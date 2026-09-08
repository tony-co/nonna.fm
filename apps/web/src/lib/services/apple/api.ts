import { SERVICES } from "@/config/services";
import { AUTH_STORAGE_KEYS, type AuthData, setServiceType } from "@/lib/auth/constants";
import { processInBatches } from "@/lib/utils/batch-processor";
import { logger } from "@/lib/utils/logger";
import {
  calculateAlbumMatchScore,
  calculateTrackMatchScore,
  cleanSearchTerm,
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
import { getAppleAuthData } from "./auth";

const BASE_URL = SERVICES.apple.apiBaseUrl || "https://api.music.apple.com";

interface MusicKitInstance {
  authorize: () => Promise<string>;
  storefrontId?: string;
  api: {
    search: (
      term: string,
      options: { types: string }
    ) => Promise<{
      songs?: {
        data: Array<{
          id: string;
          attributes: {
            name: string;
            artistName: string;
            albumName: string;
            artwork?: {
              url: string;
            };
          };
          relationships?: {
            album?: {
              data: Array<{
                id: string;
              }>;
            };
          };
        }>;
      };
      albums?: {
        data: Array<{
          id: string;
          attributes: {
            name: string;
            artistName: string;
          };
        }>;
      };
    }>;
    library: {
      add: (options: { songs: string[] }) => Promise<void>;
      playlists: {
        create: (options: { name: string; description?: string }) => Promise<{ id: string }>;
        addTracks: (playlistId: string, options: { songs: string[] }) => Promise<void>;
      };
    };
  };
}

interface MusicKitGlobal {
  configure: (options: {
    developerToken: string;
    app: {
      name: string;
      build: string;
    };
  }) => Promise<void>;
  getInstance: () => MusicKitInstance;
}

declare global {
  interface Window {
    MusicKit: MusicKitGlobal;
  }
}

interface AppleMusicSong {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    artwork?: {
      url: string;
    };
  };
  relationships?: {
    album?: {
      data?: Array<{ id: string }>;
    };
  };
}

interface AppleAlbum {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    artwork?: {
      url: string;
    };
  };
}

interface AppleMusicSearchResponse {
  results: {
    songs?: {
      data: AppleMusicSong[];
    };
    albums?: {
      data: AppleAlbum[];
    };
  };
}

// Define Apple-specific retry options
const APPLE_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5,
  initialRetryDelay: 200, // Start with a bit faster retry than default
  maxRetryDelay: 32000,
  jitterFactor: 0.1,
};

let developerToken: { value: string; expiresAt: number } | null = null;
let developerTokenRequest: Promise<string> | null = null;

export function clearDeveloperTokenCache(): void {
  developerToken = null;
  developerTokenRequest = null;
  storefrontRequest = undefined;
}

async function getDeveloperToken(): Promise<string> {
  if (developerToken && developerToken.expiresAt > Date.now()) return developerToken.value;
  if (developerTokenRequest) return developerTokenRequest;
  developerTokenRequest = fetch("/api/apple/developer-token", { cache: "no-store" })
    .then(async response => {
      if (!response.ok) throw new Error(`Failed to get developer token: ${response.status}`);
      const data = await response.json();
      if (!data.success || typeof data.token !== "string")
        throw new Error("Invalid developer token response");
      developerToken = { value: data.token, expiresAt: Date.now() + 60 * 60 * 1000 };
      return data.token as string;
    })
    .finally(() => {
      developerTokenRequest = null;
    });
  return developerTokenRequest;
}

async function fetchAppleMusic(
  url: string | URL,
  options: RequestInit = {},
  authData: AuthData
): Promise<Response> {
  async function request(): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${await getDeveloperToken()}`);
    headers.set("Music-User-Token", authData.accessToken);
    return fetch(url, { ...options, headers });
  }
  const response = await request();
  if (response.status !== 401) return response;
  clearDeveloperTokenCache();
  return request();
}

let storefrontRequest: { userToken: string; promise: Promise<string> } | undefined;

async function getStorefront(authData: AuthData): Promise<string> {
  if (storefrontRequest?.userToken === authData.accessToken) return storefrontRequest.promise;
  const promise = retryWithExponentialBackoff<{ data: { id: string }[] }>(
    () => fetchAppleMusic(`${BASE_URL}/v1/me/storefront`, {}, authData),
    APPLE_RETRY_OPTIONS
  )
    .then(response => {
      const id = response.data?.[0]?.id;
      if (!id || !/^[a-z]{2}$/.test(id)) throw new Error("Apple Music storefront is unavailable");
      return id;
    })
    .catch(error => {
      if (storefrontRequest?.promise === promise) storefrontRequest = undefined;
      throw error;
    });
  storefrontRequest = { userToken: authData.accessToken, promise };
  return promise;
}

export async function initializeAppleMusic(
  injectedMusicKit?: MusicKitGlobal
): Promise<MusicKitInstance> {
  let musicKit = injectedMusicKit ?? (typeof window !== "undefined" ? window.MusicKit : undefined);
  for (let attempt = 0; !musicKit && attempt < 10; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    musicKit = injectedMusicKit ?? (typeof window !== "undefined" ? window.MusicKit : undefined);
  }
  if (!musicKit) throw new Error("MusicKit failed to load after multiple attempts");
  const configure = async () => {
    await musicKit.configure({
      developerToken: await getDeveloperToken(),
      app: { name: "Nonna.fm", build: "1.0.0" },
    });
  };
  try {
    await configure();
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("expired token")) throw error;
    const response = await fetch("/api/apple/developer-token", { method: "POST" });
    if (!response.ok) throw new Error("Failed to refresh Apple Music developer token");
    clearDeveloperTokenCache();
    await configure();
  }
  return musicKit.getInstance();
}

export async function authorizeAppleMusic(
  role: "source" | "target",
  injectedMusicKit?: MusicKitGlobal
): Promise<string> {
  // Check if running in browser environment
  if (typeof window === "undefined") {
    throw new Error("Apple Music authorization can only be performed in browser environment");
  }
  const music = await initializeAppleMusic(injectedMusicKit);
  const musicUserToken = await music.authorize();

  // Store auth data in localStorage
  const authData: AuthData = {
    accessToken: musicUserToken,
    refreshToken: "", // MusicKit handles token refresh internally
    expiresIn: 3600, // 1 hour default
    timestamp: Date.now(),
    userId: musicUserToken, // Use the user token as ID since it's unique per user
    tokenType: "Bearer",
    role,
    serviceId: "apple",
  };

  // Store in localStorage
  localStorage.setItem(
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN,
    JSON.stringify(authData)
  );
  setServiceType(role, "apple");

  return musicUserToken;
}

// Helper function to perform the actual search and matching for Apple Music
async function performSearch(
  track: ITrack,
  searchTerm: string,
  authData: AuthData
): Promise<{ songId: string | null; albumId: string | null }> {
  const url = new URL(`${BASE_URL}/v1/catalog/${await getStorefront(authData)}/search`);
  url.searchParams.set("term", searchTerm);
  url.searchParams.set("types", "songs");
  url.searchParams.set("limit", "3");
  url.searchParams.set("fields[songs]", "name,artistName,albumName");
  url.searchParams.set("include", "albums");

  const result = await retryWithExponentialBackoff<AppleMusicSearchResponse>(async () => {
    return fetchAppleMusic(url, { method: "GET" }, authData);
  }, APPLE_RETRY_OPTIONS);

  if (!result.results?.songs?.data?.length) {
    return { songId: null, albumId: null };
  }

  const matches = await Promise.all(
    result.results.songs.data.map(async song => ({
      song,
      ...(await calculateTrackMatchScore(
        track,
        {
          name: song.attributes.name,
          artist: song.attributes.artistName,
          album: song.attributes.albumName,
        },
        DEFAULT_TRACK_CONFIG
      )),
    }))
  );

  matches.sort((a: { score: number }, b: { score: number }) => b.score - a.score);

  const filteredMatches = matches.filter(
    (match: { score: number }) => match.score >= DEFAULT_TRACK_CONFIG.thresholds.minimum
  );

  if (filteredMatches.length > 0) {
    const bestMatch = filteredMatches[0].song;
    const albumId = bestMatch.relationships?.album?.data?.[0]?.id || null;
    return {
      songId: bestMatch.id,
      albumId,
    };
  }

  return { songId: null, albumId: null };
}

// Refactored findBestMatch to use performSearch and retry logic like Spotify
async function findBestMatch(
  track: ITrack & { id: string },
  authData: AuthData
): Promise<{ songId: string | null; albumId: string | null }> {
  try {
    // Clean the track name for better matching
    const cleanedTrack = { ...track, name: cleanTrackTitle(track.name) };
    // First attempt with full search query
    const searchQuery = `${cleanedTrack.name} ${track.artist}`;
    let bestMatch = await performSearch(cleanedTrack, searchQuery, authData);

    // If no good match found and track is from YouTube, retry with just the cleaned track name
    if (!bestMatch.songId && track.videoId) {
      const retrySearchQuery = cleanedTrack.name;
      bestMatch = await performSearch(cleanedTrack, retrySearchQuery, authData);
    }

    return bestMatch;
  } catch (error) {
    logger.captureMatchingError("track_search", "apple", error, {
      trackName: track.name,
      trackArtist: track.artist,
    });
    return { songId: null, albumId: null };
  }
}

export async function search(
  tracks: Array<ITrack>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  const authData = await getAppleAuthData("target");
  if (!authData) {
    throw new Error("Not authenticated with Apple Music");
  }

  const results: Array<ITrack> = [];
  let matched = 0;
  let unmatched = 0;
  let processedCount = 0;

  await processInBatches(
    async batch => {
      const trackResults = await Promise.all(
        batch.map(async track => {
          const { songId, albumId } = await findBestMatch(track, authData);
          processedCount++;
          if (onProgress) {
            onProgress(processedCount / tracks.length);
          }
          return {
            ...track,
            targetId: songId || undefined,
            albumId: albumId || undefined,
            status: songId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };
        })
      );

      results.push(...trackResults);
      matched += trackResults.filter(r => r.targetId).length;
      unmatched += trackResults.filter(r => !r.targetId).length;
    },
    {
      items: tracks,
      batchSize: 10,
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
  const authData = await getAppleAuthData("target");
  if (!authData) {
    throw new Error("Not authenticated with Apple Music");
  }

  // Create the playlist with retry
  const playlistData = await retryWithExponentialBackoff<{ data: Array<{ id: string }> }>(
    () =>
      fetchAppleMusic(
        `${BASE_URL}/v1/me/library/playlists`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attributes: {
              name,
              description: description || `Imported on ${new Date().toLocaleDateString()}`,
            },
          }),
        },
        authData
      ),
    { ...APPLE_RETRY_OPTIONS, retrySafe: false }
  );

  const playlistId = playlistData.data?.[0]?.id;

  if (!playlistId) {
    throw new Error("Failed to create playlist - no ID returned");
  }

  // Filter tracks with IDs
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

  // Add tracks to playlist in batches for progress tracking
  let completedTracks = 0;
  const total = tracksWithIds.length;

  const result = await processInBatches(
    async batch => {
      await retryWithExponentialBackoff(
        () =>
          fetchAppleMusic(
            `${BASE_URL}/v1/me/library/playlists/${playlistId}/tracks`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: batch.map(track => ({
                  id: track.targetId,
                  type: "songs",
                })),
              }),
            },
            authData
          ),
        { ...APPLE_RETRY_OPTIONS, retrySafe: false }
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
  const authData = await getAppleAuthData("target");
  if (!authData) {
    throw new Error("Not authenticated with Apple Music");
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
      playlistId: null,
    };
  }

  // Add tracks to library in batches for progress tracking
  let completedTracks = 0;
  const total = tracksWithIds.length;

  const result = await processInBatches(
    async batch => {
      await retryWithExponentialBackoff(
        () =>
          fetchAppleMusic(
            `${BASE_URL}/v1/me/library?${new URLSearchParams({ "ids[songs]": batch.map(track => track.targetId).join(",") })}`,
            { method: "POST" },
            authData
          ),
        APPLE_RETRY_OPTIONS
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
  const authData = await getAppleAuthData("target");
  if (!authData) throw new Error("Not authenticated with Apple Music");
  const albumsWithIds = Array.from(albums).filter(album => album.targetId);
  let completed = 0;
  const result = await processInBatches(
    async batch => {
      const query = new URLSearchParams({
        "ids[albums]": batch.map(album => album.targetId).join(","),
      });
      await retryWithExponentialBackoff(
        () => fetchAppleMusic(`${BASE_URL}/v1/me/library?${query}`, { method: "POST" }, authData),
        APPLE_RETRY_OPTIONS
      );
      completed += batch.length;
      onProgress?.(completed, albumsWithIds.length);
    },
    { items: albumsWithIds, batchSize: 1, delayBetweenBatches: 10, continueOnError: true }
  );
  return {
    added: result.added,
    failed: albums.size - result.added,
    total: albums.size,
    playlistId: null,
  };
}

async function findBestAlbumMatch(
  album: IAlbum,
  authData: AuthData
): Promise<{ albumId: string | null }> {
  try {
    // Clean search terms
    const searchTerm = `${cleanSearchTerm(album.name)} ${cleanSearchTerm(album.artist)}`;

    const url = new URL(`${BASE_URL}/v1/catalog/${await getStorefront(authData)}/search`);
    url.searchParams.set("term", searchTerm);
    url.searchParams.set("types", "albums");
    url.searchParams.set("limit", "3");
    url.searchParams.set("fields[albums]", "name,artistName");

    const result = await retryWithExponentialBackoff<{
      results?: { albums?: { data: AppleAlbum[] } };
    }>(async () => {
      return fetchAppleMusic(url, { method: "GET" }, authData);
    }, APPLE_RETRY_OPTIONS);

    // Process initial search results
    if (!result.results?.albums?.data?.length) {
      logger.captureMatchingError(
        "album_search",
        "apple",
        new Error(`No search results found for album "${album.name}" by ${album.artist}`),
        {
          albumName: album.name,
          albumArtist: album.artist,
        }
      );
      return { albumId: null };
    }

    const matches = result.results.albums.data
      .map((appleAlbum: AppleAlbum) => ({
        album: appleAlbum,
        ...calculateAlbumMatchScore(
          album,
          {
            name: appleAlbum.attributes.name,
            artist: appleAlbum.attributes.artistName,
          },
          DEFAULT_ALBUM_CONFIG
        ),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    // Return best match if it meets the threshold
    if (matches[0].score >= DEFAULT_ALBUM_CONFIG.thresholds.minimum) {
      return { albumId: matches[0].album.id };
    }

    return { albumId: null };
  } catch (error) {
    logger.captureMatchingError("album_search", "apple", error, {
      albumName: album.name,
      albumArtist: album.artist,
    });
    return { albumId: null };
  }
}

export async function searchAlbums(
  albums: Array<IAlbum>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  const authData = await getAppleAuthData("target");
  if (!authData) {
    throw new Error("Not authenticated with Apple Music");
  }

  const results: Array<IAlbum> = [];
  let matched = 0;
  let unmatched = 0;
  let processedCount = 0;

  await processInBatches(
    async batch => {
      const albumResults = await Promise.all(
        batch.map(async album => {
          const { albumId } = await findBestAlbumMatch(album, authData);
          processedCount++;
          if (onProgress) {
            onProgress(processedCount / albums.length);
          }
          return {
            ...album,
            targetId: albumId || undefined,
            status: albumId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };
        })
      );

      results.push(...albumResults);
      matched += albumResults.filter(r => r.targetId).length;
      unmatched += albumResults.filter(r => !r.targetId).length;
    },
    {
      items: albums,
      batchSize: 10,
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

interface AppleResponse<T> {
  data: T[];
  next?: string;
}

interface ApplePlaylist {
  id: string;
  attributes: {
    name: string;
    trackCount: number;
    artwork?: {
      url: string;
    };
  };
}

interface AppleSong {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    artwork?: {
      url: string;
    };
  };
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getAppleAuthData("source");
  if (!authData) throw new Error("Not authenticated with Apple Music");

  // Base URL for Apple Music API
  const baseUrl = `${BASE_URL}/v1/me/library`;

  // Helper function to format artwork URL
  const formatArtworkUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Replace {w} and {h} with actual dimensions
    return url.replace("{w}", "192").replace("{h}", "192");
  };

  // Fetch playlists
  const playlists: IPlaylist[] = [];
  let nextUrl = `${baseUrl}/playlists?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<ApplePlaylist>>(
      () => fetchAppleMusic(nextUrl, { method: "GET" }, authData),
      APPLE_RETRY_OPTIONS
    );

    const playlistItems = (data.data || []).map(playlist => ({
      id: playlist.id,
      name: playlist.attributes.name,
      trackCount: playlist.attributes.trackCount,
      ownerId: authData.userId,
      artwork: formatArtworkUrl(playlist.attributes.artwork?.url),
      tracks: [], // We'll fetch tracks when needed
    }));

    playlists.push(...playlistItems);
    nextUrl = data.next ? `${BASE_URL}${data.next}` : "";

    if (!nextUrl) break;
  } while (nextUrl);

  // Fetch songs from library
  const songs = [];
  nextUrl = `${baseUrl}/songs?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleSong>>(
      () => fetchAppleMusic(nextUrl, { method: "GET" }, authData),
      APPLE_RETRY_OPTIONS
    );

    const songItems = (data.data || []).map(song => ({
      id: song.id,
      name: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      artwork: formatArtworkUrl(song.attributes.artwork?.url),
    }));

    songs.push(...songItems);
    nextUrl = data.next ? `${BASE_URL}${data.next}` : "";

    if (!nextUrl) break;
  } while (nextUrl);

  // Fetch albums
  const albums: IAlbum[] = [];
  nextUrl = `${baseUrl}/albums?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleAlbum>>(
      () => fetchAppleMusic(nextUrl, { method: "GET" }, authData),
      APPLE_RETRY_OPTIONS
    );

    const albumItems = (data.data || []).map(album => ({
      id: album.id,
      name: album.attributes.name,
      artist: album.attributes.artistName,
      artwork: formatArtworkUrl(album.attributes.artwork?.url),
    }));

    albums.push(...albumItems);
    nextUrl = data.next ? `${BASE_URL}${data.next}` : "";

    if (!nextUrl) break;
  } while (nextUrl);

  return {
    playlists,
    likedSongs: songs,
    albums,
  };
}

export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  // Helper function to format artwork URL
  const formatArtworkUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Replace {w} and {h} with actual dimensions
    return url.replace("{w}", "48").replace("{h}", "48");
  };

  const authData = await getAppleAuthData("source");
  if (!authData) throw new Error("Not authenticated with Apple Music");

  const tracks: ITrack[] = [];
  let nextUrl = `${BASE_URL}/v1/me/library/playlists/${playlistId}/tracks?limit=50`;

  while (nextUrl) {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleSong>>(
      () => fetchAppleMusic(nextUrl, { method: "GET" }, authData),
      {
        ...APPLE_RETRY_OPTIONS,
        treat404AsEmpty: true,
      }
    );

    // Apple API does not return total, so we estimate progress by assuming 100 per page
    const trackItems = (data.data || []).map(item => ({
      id: item.id,
      name: item.attributes.name,
      artist: item.attributes.artistName,
      album: item.attributes.albumName,
      artwork: formatArtworkUrl(item.attributes.artwork?.url),
    }));

    tracks.push(...trackItems);

    // Call onProgress after each page
    if (onProgress) {
      // Estimate progress: if no nextUrl, we're done
      const progress = data.next ? 0.99 : 1;
      onProgress([...tracks], progress);
    }

    nextUrl = data.next ? `${BASE_URL}${data.next}` : "";
  }

  return tracks;
}
