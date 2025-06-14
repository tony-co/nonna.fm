import { ITrack, ILibraryData, IAlbum, SearchResult, TransferResult } from "@/types";
import { getDeezerUserId } from "./auth";
import { retryWithExponentialBackoff, type RetryOptions } from "@/lib/utils/retry";
import { SERVICES } from "@/config/services";

// Base URL for Deezer API from services configuration
const BASE_URL = SERVICES.deezer.apiBaseUrl;

// Keep this for the handlers to use (legacy support)
export const DEEZER_API_BASE = BASE_URL;

// Types shared between client and API routes
export interface DeezerAlbum {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  nb_tracks: number;
  release_date: string;
  record_type: string;
  available: boolean;
  tracklist: string;
  explicit_lyrics: boolean;
  time_add: number;
  artist: {
    id: number;
    name: string;
    picture: string;
    picture_small: string;
    picture_medium: string;
    picture_big: string;
    picture_xl: string;
    tracklist: string;
    type: string;
  };
  type: string;
}

export interface DeezerPlaylist {
  id: number;
  title: string;
  nb_tracks: number;
  picture_medium: string;
  duration: number;
  creation_date: string;
  is_loved_track?: boolean;
  creator: {
    id: number;
    name: string;
  };
}

export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string;
  link: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_small: string;
  };
}

export interface DeezerApiResponse<T> {
  data?: T[];
  total?: number;
  error?: {
    message: string;
    type?: string;
    code?: number;
  };
  next?: string;
}

// Define Deezer-specific retry options for all API calls
const DEEZER_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5,
  initialRetryDelay: 300, // Slightly faster retry than default
  maxRetryDelay: 16000,
  jitterFactor: 0.1,
};

/**
 * Fetches all playlists for a Deezer user with pagination support
 */
export async function fetchUserLibrary(): Promise<ILibraryData> {
  const userId = getDeezerUserId();
  if (!userId) throw new Error("No Deezer user ID found");

  // Fetch playlists and albums in parallel
  const [allPlaylists, albums] = await Promise.all([
    (async (): Promise<DeezerPlaylist[]> => {
      let playlists: DeezerPlaylist[] = [];
      let nextUrl: string | undefined = `/api/deezer/playlists/${userId}`;

      // Fetch all pages of playlists with retry logic
      while (nextUrl) {
        const url: string = nextUrl; // Ensure url is string
        // Use retryWithExponentialBackoff for robust error handling
        const data: DeezerApiResponse<DeezerPlaylist> = await retryWithExponentialBackoff<
          DeezerApiResponse<DeezerPlaylist>
        >(() => fetch(url), DEEZER_RETRY_OPTIONS);

        if (data.error) {
          throw new Error(data.error?.message || "Failed to fetch Deezer library");
        }

        if (data.data) {
          playlists = [...playlists, ...data.data];
        }

        // If we get a next URL from Deezer API, convert it to our API route
        nextUrl = data.next
          ? `/api/deezer/playlists/${userId}?${new URL(data.next).searchParams.toString()}`
          : undefined;
      }

      return playlists;
    })(),
    fetchDeezerAlbums(),
  ]);

  // Find the loved tracks playlist
  const lovedTracksPlaylist = allPlaylists.find(p => p.is_loved_track);

  // Get the liked songs if the loved tracks playlist exists
  const likedSongs = lovedTracksPlaylist
    ? await fetchPlaylistTracks(lovedTracksPlaylist.id.toString())
    : [];

  // Filter out the loved tracks playlist from regular playlists
  const playlists = allPlaylists
    .filter(playlist => !playlist.is_loved_track)
    .map(playlist => ({
      id: playlist.id.toString(),
      name: playlist.title,
      trackCount: playlist.nb_tracks,
      ownerId: userId,
      artwork: playlist.picture_medium,
      tracks: [], // We'll fetch tracks when needed
    }));

  return {
    likedSongs,
    albums,
    playlists,
  };
}

/**
 * Fetches tracks for a specific Deezer playlist with pagination support
 */
export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  let allTracks: ITrack[] = [];
  let nextUrl: string | undefined = `/api/deezer/playlists/${playlistId}/tracks`;
  let total: number | undefined = undefined;

  // Fetch all pages of tracks with retry logic
  while (nextUrl) {
    const url: string = nextUrl; // Ensure url is string
    // Use retryWithExponentialBackoff for robust error handling
    const data: DeezerApiResponse<DeezerTrack> = await retryWithExponentialBackoff<
      DeezerApiResponse<DeezerTrack>
    >(() => fetch(url), DEEZER_RETRY_OPTIONS);

    if (data.error) {
      throw new Error(data.error?.message || "Failed to fetch Deezer playlist tracks");
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from Deezer API");
    }

    // Set total from the first response
    if (total === undefined && typeof data.total === "number") {
      total = data.total;
    }

    // Transform tracks to our format
    const tracks = data.data.map((track: DeezerTrack) => ({
      id: track.id.toString(),
      name: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      artwork: track.album.cover_small,
      previewUrl: track.preview,
      externalUrl: track.link,
      service: "deezer" as const,
    }));

    allTracks = [...allTracks, ...tracks];

    // Call onProgress after each page
    if (onProgress && total) {
      const progress = Math.min(allTracks.length / total, 1);
      onProgress([...allTracks], progress);
    }

    // If we get a next URL from Deezer API, convert it to our API route
    if (data.next) {
      const nextDeezerUrl = new URL(data.next);
      nextUrl = `/api/deezer/playlists/${playlistId}/tracks?${nextDeezerUrl.searchParams.toString()}`;
    } else {
      nextUrl = undefined;
    }
  }

  return allTracks;
}

/**
 * Fetches all albums for a Deezer user with pagination support
 */
export async function fetchDeezerAlbums(): Promise<IAlbum[]> {
  const userId = getDeezerUserId();
  if (!userId) throw new Error("No Deezer user ID found");

  let allAlbums: DeezerAlbum[] = [];
  let nextUrl: string | undefined = `/api/deezer/albums/${userId}`;

  // Fetch all pages of albums with retry logic
  while (nextUrl) {
    const url: string = nextUrl; // Ensure url is string
    // Use retryWithExponentialBackoff for robust error handling
    const data: DeezerApiResponse<DeezerAlbum> = await retryWithExponentialBackoff<
      DeezerApiResponse<DeezerAlbum>
    >(() => fetch(url), DEEZER_RETRY_OPTIONS);

    if (data.error) {
      throw new Error(data.error?.message || "Failed to fetch Deezer albums");
    }

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid response format from Deezer API");
    }

    allAlbums = [...allAlbums, ...data.data];

    // If we get a next URL from Deezer API, convert it to our API route
    if (data.next) {
      const nextDeezerUrl = new URL(data.next);
      nextUrl = `/api/deezer/albums/${userId}?${nextDeezerUrl.searchParams.toString()}`;
    } else {
      nextUrl = undefined;
    }
  }

  // Convert Deezer albums to our format
  return allAlbums.map(album => ({
    id: album.id.toString(),
    name: album.title,
    artist: album.artist.name,
    artwork: album.cover_small,
    trackCount: album.nb_tracks,
    tracks: [], // We'll fetch tracks when needed
    service: "deezer" as const,
  }));
}

/**
 * Empty implementation for search - Deezer API not supported
 */
export async function search(
  tracks: ITrack[],
  onProgress?: (progress: number) => void
): Promise<SearchResult> {
  // Call onProgress with 100% since we're not doing any actual work
  if (onProgress) {
    onProgress(1);
  }
  return {
    matched: 0,
    unmatched: tracks.length,
    total: tracks.length,
    tracks: [],
  };
}

/**
 * Empty implementation for searchAlbums - Deezer API not supported
 */
export async function searchAlbums(
  albums: Array<IAlbum>,
  onProgress?: (progress: number) => void
): Promise<SearchResult> {
  // Call onProgress with 100% since we're not doing any actual work
  if (onProgress) {
    onProgress(1);
  }
  return {
    matched: 0,
    unmatched: albums.length,
    total: albums.length,
    albums: [],
  };
}

/**
 * Empty implementation for addTracksToLibrary - Deezer API not supported
 */
export async function addTracksToLibrary(tracks: ITrack[]): Promise<TransferResult> {
  return {
    added: 0,
    failed: tracks.length,
    total: tracks.length,
    playlistId: null,
  };
}

/**
 * Empty implementation for addAlbumsToLibrary - Deezer API not supported
 */
export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  return {
    added: 0,
    failed: albums.size,
    total: albums.size,
    playlistId: null,
  };
}

/**
 * Empty implementation for createPlaylistWithTracks - Deezer API not supported
 */
export async function createPlaylistWithTracks(
  _name: string,
  _tracks: ITrack[],
  _description?: string
): Promise<TransferResult> {
  return {
    added: 0,
    failed: _tracks.length,
    total: _tracks.length,
    playlistId: null,
  };
}
