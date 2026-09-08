import { SERVICES } from "@/config/services";
import type { AuthData } from "@/lib/auth/constants";
import { processInBatches } from "@/lib/utils/batch-processor";
import { logger } from "@/lib/utils/logger";
import {
  calculateAlbumMatchScore,
  calculateTrackMatchScore,
  cleanTrackTitle,
  DEFAULT_ALBUM_CONFIG,
  DEFAULT_TRACK_CONFIG,
} from "@/lib/utils/matching";
import { type RetryOptions, retryWithExponentialBackoff } from "@/lib/utils/retry";
import type { IAlbum, ILibraryData, ITrack, SearchResult, TransferResult } from "@/types";
import { MATCHING_STATUS } from "@/types/matching-status";
import { getSpotifyAuthData } from "./auth";
import {
  type SpotifyAlbum,
  type SpotifyPlaylist,
  type SpotifyTrack,
  type SpotifyTrackItem,
  transformSpotifyAlbumToAlbum,
  transformSpotifyPlaylistToPlaylist,
  transformSpotifyTrackToTrack,
} from "./types";

// Base URL for Spotify API from services configuration
const BASE_URL = SERVICES.spotify.apiBaseUrl;

// Spotify-specific retry options for all API calls
// These values can be tuned for Spotify's rate limits and error patterns
const SPOTIFY_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5, // Reasonable default for Spotify API
  initialRetryDelay: 500, // Start with a moderate delay
  maxRetryDelay: 32000, // Cap the delay to avoid excessive waits
  jitterFactor: 0.1, // Add jitter to avoid thundering herd
};

// Type definition for Spotify Search API response
interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
  };
}

// Helper function to perform the actual search and matching
async function performSearch(
  track: ITrack,
  searchQuery: string,
  authData: AuthData
): Promise<string | null> {
  // Use Spotify-specific retry options for all API calls
  const data = await retryWithExponentialBackoff<SpotifySearchResponse>(
    () =>
      fetch(`${BASE_URL}/search?q=${searchQuery}&type=track&limit=3`, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      }),
    SPOTIFY_RETRY_OPTIONS
  );

  if (!data.tracks?.items?.length) {
    return null;
  }

  // Find the best match using our shared matching system
  const matchPromises = data.tracks.items.map(async (spotifyTrack: SpotifyTrack) => ({
    track: spotifyTrack,
    ...(await calculateTrackMatchScore(
      track,
      {
        name: cleanTrackTitle(spotifyTrack.name),
        artist: spotifyTrack.artists[0].name,
        album: spotifyTrack.album.name,
      },
      DEFAULT_TRACK_CONFIG
    )),
  }));

  const matches = await Promise.all(matchPromises);
  matches.sort((a, b) => b.score - a.score);

  // Return the ID if we have a good match (score >= minimum threshold)
  return matches[0].score >= DEFAULT_TRACK_CONFIG.thresholds.minimum ? matches[0].track.id : null;
}

async function fetchPages<T>(
  path: string,
  authData: AuthData,
  onPage?: (items: T[], progress: number) => void
): Promise<T[]> {
  const items: T[] = [];
  const limit = 50;
  for (let offset = 0; ; offset += limit) {
    const page = await retryWithExponentialBackoff<{ items: T[]; total: number }>(
      () =>
        fetch(`${BASE_URL}${path}?limit=${limit}&offset=${offset}`, {
          headers: { Authorization: `Bearer ${authData.accessToken}` },
        }),
      SPOTIFY_RETRY_OPTIONS
    );
    if (!Array.isArray(page.items) || !Number.isSafeInteger(page.total) || page.total < 0) {
      throw new Error("Invalid Spotify pagination response");
    }
    items.push(...page.items);
    onPage?.(items, page.total === 0 ? 1 : Math.min((offset + page.items.length) / page.total, 1));
    if (offset + limit >= page.total || page.items.length === 0) return items;
  }
}

function transformTrackItems(items: SpotifyTrackItem[]): ITrack[] {
  return items.filter(item => item.track?.id).map(item => transformSpotifyTrackToTrack(item.track));
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");
  // Each collection paginates sequentially, bounding concurrency to three requests.
  const [playlists, tracks, albums] = await Promise.all([
    fetchPages<SpotifyPlaylist>("/me/playlists", authData),
    fetchPages<SpotifyTrackItem>("/me/tracks", authData),
    fetchPages<{ album: SpotifyAlbum }>("/me/albums", authData),
  ]);
  return {
    playlists: playlists.filter(Boolean).map(transformSpotifyPlaylistToPlaylist),
    likedSongs: transformTrackItems(tracks),
    albums: albums
      .filter(item => item.album?.id)
      .map(item => transformSpotifyAlbumToAlbum(item.album)),
  };
}

export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");
  const items = await fetchPages<SpotifyTrackItem>(
    `/playlists/${encodeURIComponent(playlistId)}/tracks`,
    authData,
    (items, progress) => onProgress?.(transformTrackItems(items), progress)
  );
  return transformTrackItems(items);
}

async function findBestMatch(track: ITrack, authData: AuthData): Promise<string | null> {
  try {
    // Clean the source track name for better matching
    const cleanedTrack = { ...track, name: cleanTrackTitle(track.name) };
    // First attempt with full search query
    const searchQuery = encodeURIComponent(`${cleanedTrack.name} ${track.artist}`);
    let bestMatch = await performSearch(cleanedTrack, searchQuery, authData);

    // If no good match found and track is from YouTube, retry with just the cleaned track name
    if (bestMatch === null && track.videoId) {
      const retrySearchQuery = encodeURIComponent(cleanedTrack.name);
      bestMatch = await performSearch(cleanedTrack, retrySearchQuery, authData);
    }

    return bestMatch;
  } catch (error) {
    logger.captureMatchingError("track_search", "spotify", error, {
      trackName: track.name,
      trackArtist: track.artist,
    });
    return null;
  }
}

export async function search(
  tracks: Array<ITrack>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  const results: Array<ITrack> = [];
  let matched = 0;
  let unmatched = 0;
  let processedCount = 0;

  // Process tracks in batches
  await processInBatches(
    async batch => {
      const trackResults = await Promise.all(
        batch.map(async track => {
          const targetId = await findBestMatch(track, authData);
          processedCount++;
          if (onProgress) {
            onProgress(processedCount / tracks.length);
          }
          return {
            ...track,
            targetId: targetId || undefined,
            status: targetId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };
        })
      );

      results.push(...trackResults);
      matched += trackResults.filter(r => r.targetId).length;
      unmatched += trackResults.filter(r => !r.targetId).length;
    },
    {
      items: tracks,
      batchSize: 4,
      delayBetweenBatches: 200,
      onBatchStart: () => {},
    }
  );

  return {
    matched,
    unmatched,
    total: tracks.length,
    tracks: results,
  };
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: Array<ITrack>,
  description?: string,
  onProgress?: (completed: number, total: number) => void
): Promise<TransferResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Create the playlist using retryWithExponentialBackoff
  const playlistData = await retryWithExponentialBackoff<unknown>(
    () =>
      fetch(`${BASE_URL}/me/playlists`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || `Imported on ${new Date().toLocaleDateString()}`,
        }),
      }),
    { ...SPOTIFY_RETRY_OPTIONS, retrySafe: false }
  );

  // The util parses JSON if available, so we can safely cast
  const playlistId = (playlistData as { id?: string }).id;
  if (!playlistId) {
    throw new Error("Failed to create playlist - no ID returned");
  }

  // Filter tracks with valid targetIds
  const tracksWithIds = tracks.filter(
    (track): track is ITrack & { targetId: string } => !!track.targetId
  );

  if (tracksWithIds.length === 0) {
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId,
    };
  }

  // Add tracks to playlist in small batches for individual track progress
  let completedTracks = 0;
  const total = tracksWithIds.length;

  const result = await processInBatches(
    async batch => {
      const uris = batch.map(track => `spotify:track:${track.targetId}`);
      await retryWithExponentialBackoff<unknown>(
        () =>
          fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris }),
          }),
        { ...SPOTIFY_RETRY_OPTIONS, retrySafe: false }
      );

      // Update progress after each batch
      completedTracks += batch.length;
      if (onProgress) {
        onProgress(completedTracks, total);
      }
    },
    {
      items: tracksWithIds,
      batchSize: 5, // Small batches for granular progress
      continueOnError: true,
    }
  );

  return {
    added: result.added,
    failed: tracks.length - result.added,
    total: tracks.length,
    playlistId,
  };
}

export async function addTracksToLibrary(
  tracks: Array<ITrack>,
  onProgress?: (completed: number, total: number) => void
): Promise<TransferResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Filter tracks with valid targetIds
  const tracksWithIds = tracks.filter(
    (track): track is ITrack & { targetId: string } => !!track.targetId
  );

  if (tracksWithIds.length === 0) {
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId: null,
    };
  }

  // Add tracks to library in small batches for individual track progress
  let completedTracks = 0;
  const total = tracksWithIds.length;

  const result = await processInBatches(
    async batch => {
      const ids = batch.map(track => track.targetId);
      await retryWithExponentialBackoff<unknown>(
        () =>
          fetch(`${BASE_URL}/me/tracks`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          }),
        SPOTIFY_RETRY_OPTIONS
      );

      // Update progress after each batch
      completedTracks += batch.length;
      if (onProgress) {
        onProgress(completedTracks, total);
      }
    },
    {
      items: tracksWithIds,
      batchSize: 5, // Small batches for granular progress
      continueOnError: true,
    }
  );

  return {
    added: result.added,
    failed: tracks.length - result.added,
    total: tracks.length,
    playlistId: null,
  };
}

export async function addAlbumsToLibrary(
  albums: Set<IAlbum>,
  onProgress?: (completed: number, total: number) => void
): Promise<TransferResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Convert Set/Array to Array and filter albums with valid targetIds
  const albumsWithIds = (Array.isArray(albums) ? albums : Array.from(albums)).filter(
    (album): album is IAlbum & { targetId: string } => !!album.targetId
  );

  if (albumsWithIds.length === 0) {
    throw new Error("No albums with valid targetIds found");
  }

  // Add albums one by one for individual album progress
  let completedAlbums = 0;
  const total = albumsWithIds.length;

  const result = await processInBatches(
    async batch => {
      const ids = batch.map(album => album.targetId);
      await retryWithExponentialBackoff<unknown>(
        () =>
          fetch(`${BASE_URL}/me/albums`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ids }),
          }),
        SPOTIFY_RETRY_OPTIONS
      );

      // Update progress after each album
      completedAlbums += batch.length;
      if (onProgress) {
        onProgress(completedAlbums, total);
      }
    },
    {
      items: albumsWithIds,
      batchSize: 1, // Individual albums for granular progress
      continueOnError: true,
    }
  );

  return {
    added: result.added,
    failed: albums.size - result.added,
    total: albums.size,
    playlistId: null,
  };
}

async function findBestAlbumMatch(album: IAlbum, authData: AuthData): Promise<string | null> {
  try {
    // Clean and encode the search query
    const searchQuery = encodeURIComponent(`${album.name} ${album.artist}`);

    // Search for albums with retry
    const response = await retryWithExponentialBackoff<{ albums: { items: SpotifyAlbum[] } }>(
      () =>
        fetch(`${BASE_URL}/search?q=${searchQuery}&type=album&limit=10`, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }),
      SPOTIFY_RETRY_OPTIONS
    );

    if (!response.albums?.items?.length) {
      logger.captureMatchingError(
        "album_search",
        "spotify",
        new Error(`No search results found for album "${album.name}" by ${album.artist}`),
        {
          albumName: album.name,
          albumArtist: album.artist,
        }
      );
      return null;
    }

    // Find the best match using our shared matching system
    const matches = response.albums.items
      .map((spotifyAlbum: SpotifyAlbum) => ({
        album: spotifyAlbum,
        ...calculateAlbumMatchScore(
          album,
          {
            name: spotifyAlbum.name,
            artist: spotifyAlbum.artists[0].name,
          },
          DEFAULT_ALBUM_CONFIG
        ),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    // Return the ID if we have a good match (score >= minimum threshold)
    return matches[0].score >= DEFAULT_ALBUM_CONFIG.thresholds.minimum ? matches[0].album.id : null;
  } catch (error) {
    logger.captureMatchingError("album_search", "spotify", error, {
      albumName: album.name,
      albumArtist: album.artist,
    });
    return null;
  }
}

export async function searchAlbums(
  albums: Array<IAlbum>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  const results: Array<IAlbum> = [];
  let matched = 0;
  let unmatched = 0;
  let processedCount = 0;

  // Process albums in batches
  await processInBatches(
    async batch => {
      const albumResults = await Promise.all(
        batch.map(async album => {
          const spotifyId = await findBestAlbumMatch(album, authData);
          processedCount++;
          if (onProgress) {
            onProgress(processedCount / albums.length);
          }
          return {
            ...album,
            targetId: spotifyId || undefined,
            status: spotifyId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };
        })
      );

      results.push(...albumResults);
      matched += albumResults.filter(r => r.targetId).length;
      unmatched += albumResults.filter(r => !r.targetId).length;
    },
    {
      items: albums,
      batchSize: 4,
      delayBetweenBatches: 200,
      onBatchStart: () => {},
    }
  );

  return {
    matched,
    unmatched,
    total: albums.length,
    albums: results,
  };
}
