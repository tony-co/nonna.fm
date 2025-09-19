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
import type {
  IAlbum,
  ILibraryData,
  IPlaylist,
  ITrack,
  SearchResult,
  TransferResult,
} from "@/types";
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

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Fetch playlists with batching and retry
  const initialPlaylistResponse = await retryWithExponentialBackoff<{ total: number }>(
    () =>
      fetch(`${BASE_URL}/me/playlists?limit=1`, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      }),
    SPOTIFY_RETRY_OPTIONS
  );

  if (!initialPlaylistResponse.total) {
    throw new Error("Failed to fetch playlists count");
  }

  const totalPlaylists = initialPlaylistResponse.total;
  const playlistBatchSize = 50;
  const playlistBatchCount = Math.ceil(totalPlaylists / playlistBatchSize);

  const playlistResults: IPlaylist[] = [];
  await processInBatches(
    async batch => {
      const offset = batch[0] * playlistBatchSize;
      const data = await retryWithExponentialBackoff<{ items: SpotifyPlaylist[] }>(
        () =>
          fetch(
            `${BASE_URL}/me/playlists?limit=${playlistBatchSize}&offset=${offset}&fields=items(id,name,tracks(total),owner(id,display_name),images)`,
            { headers: { Authorization: `Bearer ${authData.accessToken}` } }
          ),
        SPOTIFY_RETRY_OPTIONS
      );

      playlistResults.push(
        ...data.items.map((playlist: SpotifyPlaylist) =>
          transformSpotifyPlaylistToPlaylist(playlist)
        )
      );
    },
    {
      items: Array.from({ length: playlistBatchCount }, (_, i) => i),
      batchSize: playlistBatchSize,
      onBatchStart: () => {},
    }
  );

  const playlists = playlistResults;

  // Fetch saved tracks (liked songs) with batching and retry

  const initialResponse = await retryWithExponentialBackoff<{ total: number }>(
    () =>
      fetch(`${BASE_URL}/me/tracks?limit=1&fields=total`, {
        headers: { Authorization: `Bearer ${authData.accessToken}` },
      }),
    SPOTIFY_RETRY_OPTIONS
  );

  if (!initialResponse.total) {
    throw new Error("Failed to fetch saved tracks count");
  }

  const { total: totalTracks } = initialResponse;
  const batchSize = 50;
  const batchCount = Math.ceil(totalTracks / batchSize);

  const trackResults: ITrack[] = [];
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * batchSize;
        const data = await retryWithExponentialBackoff<{ items: SpotifyTrackItem[] }>(
          () =>
            fetch(
              `${BASE_URL}/me/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`,
              { headers: { Authorization: `Bearer ${authData.accessToken}` } }
            ),
          SPOTIFY_RETRY_OPTIONS
        );

        return data.items.map((item: SpotifyTrackItem) => transformSpotifyTrackToTrack(item.track));
      });

      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      trackResults.push(...batchResults.flat());
    },
    {
      items: Array.from({ length: batchCount }, (_, i) => i),
      batchSize: 3, // Process 5 API requests in parallel at a time
      onBatchStart: () => {},
    }
  );

  const likedSongs = trackResults;

  // Fetch saved albums with batching and retry
  const initialAlbumsResponse = await retryWithExponentialBackoff<{ total: number }>(
    () =>
      fetch(`${BASE_URL}/me/albums?limit=1`, {
        headers: { Authorization: `Bearer ${authData.accessToken}` },
      }),
    SPOTIFY_RETRY_OPTIONS
  );

  if (!initialAlbumsResponse.total) {
    throw new Error("Failed to fetch saved albums count");
  }

  const { total: totalAlbums } = initialAlbumsResponse;
  const albumBatchSize = 50; // Spotify's recommended batch size for albums
  const albumBatchCount = Math.ceil(totalAlbums / albumBatchSize);
  const albumResults: IAlbum[] = [];
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * albumBatchSize;
        const data = await retryWithExponentialBackoff<{ items: { album: SpotifyAlbum }[] }>(
          () =>
            fetch(
              `${BASE_URL}/me/albums?limit=${albumBatchSize}&offset=${offset}&fields=items(album(id,name,artists(name),images))`,
              { headers: { Authorization: `Bearer ${authData.accessToken}` } }
            ),
          SPOTIFY_RETRY_OPTIONS
        );

        return data.items.map((item: { album: SpotifyAlbum }) =>
          transformSpotifyAlbumToAlbum(item.album)
        );
      });

      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      albumResults.push(...batchResults.flat());
    },
    {
      items: Array.from({ length: albumBatchCount }, (_, i) => i),
      batchSize: 3, // Process 3 API requests in parallel at a time
      onBatchStart: () => {},
    }
  );

  return {
    playlists,
    likedSongs,
    albums: albumResults,
  };
}

export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Fetch initial playlist info with retry
  const initialResponse = await retryWithExponentialBackoff<{ total: number }>(
    () =>
      fetch(`${BASE_URL}/playlists/${playlistId}/tracks?limit=1&fields=total`, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      }),
    SPOTIFY_RETRY_OPTIONS
  );

  if (!initialResponse.total) {
    throw new Error("Failed to fetch playlist tracks count");
  }

  const { total } = initialResponse;
  const batchSize = 50;
  const batchCount = Math.ceil(total / batchSize);
  const trackResults: ITrack[] = [];
  let loadedCount = 0;
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * batchSize;
        const data = await retryWithExponentialBackoff<{ items: SpotifyTrackItem[] }>(
          () =>
            fetch(
              `${BASE_URL}/playlists/${playlistId}/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                },
              }
            ),
          SPOTIFY_RETRY_OPTIONS
        );

        return data.items.map((item: SpotifyTrackItem) => transformSpotifyTrackToTrack(item.track));
      });

      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      const flatBatch = batchResults.flat();
      trackResults.push(...flatBatch);
      loadedCount += flatBatch.length;
      // Call onProgress with a shallow copy of the loaded tracks and progress ratio
      if (onProgress) {
        onProgress([...trackResults], Math.min(loadedCount / total, 1));
      }
    },
    {
      items: Array.from({ length: batchCount }, (_, i) => i),
      batchSize: 1, // Process 3 API requests in parallel at a time
      onBatchStart: () => {},
    }
  );

  return trackResults;
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
  description?: string
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
    SPOTIFY_RETRY_OPTIONS
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

  // Add tracks to playlist in batches using retryWithExponentialBackoff
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
        SPOTIFY_RETRY_OPTIONS
      );
    },
    {
      items: tracksWithIds,
      batchSize: 100,
      onBatchStart: () => {},
    }
  );

  return {
    ...result,
    playlistId,
  };
}

export async function addTracksToLibrary(tracks: Array<ITrack>): Promise<TransferResult> {
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

  // Add tracks to library in batches using retryWithExponentialBackoff
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
    },
    {
      items: tracksWithIds,
      batchSize: 50,
      onBatchStart: () => {},
    }
  );

  return {
    ...result,
    playlistId: null,
  };
}

export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  const authData = await getSpotifyAuthData("target");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Convert Set/Array to Array and filter albums with valid targetIds
  const albumsWithIds = (Array.isArray(albums) ? albums : Array.from(albums)).filter(
    (album): album is IAlbum & { targetId: string } => !!album.targetId
  );

  if (albumsWithIds.length === 0) {
    throw new Error("No albums with valid targetIds found");
  }

  // Add albums to library in batches using retryWithExponentialBackoff
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
    },
    {
      items: albumsWithIds,
      batchSize: 20,
      onBatchStart: () => {},
    }
  );

  return {
    ...result,
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
