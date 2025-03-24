import { SearchResult, TransferResult } from "@/types/services";
import { getYouTubeAuthData } from "../youtube/auth";
import { getAppleAuthData } from "./auth";
import type { ITrack, ILibraryData, IAlbum, IPlaylist } from "@/types/library";
import {
  calculateTrackMatchScore,
  calculateAlbumMatchScore,
  DEFAULT_TRACK_CONFIG,
  DEFAULT_ALBUM_CONFIG,
  type MatchScoreDetails,
  cleanSearchTerm,
} from "@/lib/utils/matching";

interface MusicKitInstance {
  authorize: () => Promise<string>;
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

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  artwork?: string;
}

interface AppleMusicSong {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
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

// Helper function to add delay between requests
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiting configuration
const API_CONFIG = {
  baseDelay: 200, // Base delay between requests in ms
  maxRetries: 3, // Maximum number of retries for rate-limited requests
  backoffFactor: 2, // Exponential backoff multiplier
};

interface ApiError extends Error {
  status?: number;
}

// Wrapper for API calls with rate limiting and retries
async function withRateLimit<T>(apiCall: () => Promise<T>, retryCount = 0): Promise<T> {
  try {
    // Add base delay before the request
    await delay(API_CONFIG.baseDelay);
    return await apiCall();
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError?.status === 429 && retryCount < API_CONFIG.maxRetries) {
      // Calculate delay with exponential backoff
      const backoffDelay = API_CONFIG.baseDelay * Math.pow(API_CONFIG.backoffFactor, retryCount);
      console.log(
        `Rate limited, retrying in ${backoffDelay}ms (attempt ${retryCount + 1}/${API_CONFIG.maxRetries})`
      );
      await delay(backoffDelay);
      return withRateLimit(apiCall, retryCount + 1);
    }
    throw error;
  }
}

export async function initializeAppleMusic(): Promise<MusicKitInstance> {
  try {
    // Configure MusicKit
    await window.MusicKit.configure({
      developerToken: process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN || "",
      app: {
        name: "Nonna.fm",
        build: "1.0.0",
      },
    });

    // Get the instance
    const music = window.MusicKit.getInstance();
    return music;
  } catch (error) {
    console.error("Error initializing Apple Music:", error);
    throw error;
  }
}

export async function authorizeAppleMusic(): Promise<string> {
  try {
    console.log("authorizeAppleMusic - starting");
    const music = await initializeAppleMusic();
    console.log("authorizeAppleMusic - initialized");
    const musicUserToken = await music.authorize();
    console.log("authorizeAppleMusic - success");
    return musicUserToken;
  } catch (error) {
    console.error("authorizeAppleMusic - error:", error);
    throw error;
  }
}

async function findBestMatch(
  track: Track & { id: string },
  music: MusicKitInstance
): Promise<{ songId: string | null; albumId: string | null }> {
  try {
    const isYouTubeSource = !!getYouTubeAuthData("source");

    // For YouTube sources, the data is already cleaned by the YouTube API
    // For other sources, clean the search terms
    const searchName = isYouTubeSource ? track.name : cleanSearchTerm(track.name);
    const searchArtist = isYouTubeSource ? track.artist : cleanSearchTerm(track.artist);

    const searchTerm = `${searchName} ${searchArtist}`;
    if (isYouTubeSource) {
      console.log(
        `[MATCHING] Using pre-cleaned YouTube track: "${searchName}" by "${searchArtist}"`
      );
    } else {
      console.log(
        `[MATCHING] Searching with cleaned term: "${searchTerm}" (original: "${track.name} ${track.artist}")`
      );
    }

    const result = await withRateLimit<AppleMusicSearchResponse>(async () => {
      const userToken = await music.authorize();
      const url = new URL("https://api.music.apple.com/v1/catalog/fr/search");
      url.searchParams.set("term", searchTerm);
      url.searchParams.set("types", "songs");
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Music-User-Token": userToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    });

    if (!result.results?.songs?.data?.length) {
      console.log(`[MATCHING] No results found for "${track.name}" by ${track.artist}`);
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

    // Log all scores if no matches meet the threshold
    if (
      !matches.some(
        (match: { score: number }) => match.score >= DEFAULT_TRACK_CONFIG.thresholds.minimum
      )
    ) {
      console.log(
        `[MATCHING] No matches met threshold for "${track.name}" by ${track.artist}. Best matches:`,
        matches
          .slice(0, 3)
          .map((match: { score: number; details: MatchScoreDetails; song: AppleMusicSong }) => ({
            score: match.score,
            details: match.details,
            matchedName: match.song.attributes.name,
            matchedArtist: match.song.attributes.artistName,
            matchedAlbum: match.song.attributes.albumName,
          }))
      );
    }

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
  } catch (error) {
    console.error("[MATCHING] Error finding best match:", error);
    return { songId: null, albumId: null };
  }
}

export async function search(
  tracks: Array<ITrack & { targetId: string }>,
  batchSize: number = 20
): Promise<SearchResult> {
  try {
    const music = await initializeAppleMusic();
    const results: Array<ITrack> = [];
    let matched = 0;
    let unmatched = 0;

    // Process tracks in batches
    for (let i = 0; i < tracks.length; i += batchSize) {
      const batch = tracks.slice(i, i + batchSize);
      console.log(
        `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tracks.length / batchSize)}`
      );

      const batchResults = await Promise.all(
        batch.map(async track => {
          const { songId, albumId } = await findBestMatch(track, music);
          return {
            ...track,
            targetId: songId || undefined,
            albumId: albumId || undefined,
          };
        })
      );

      results.push(...batchResults);
      matched += batchResults.filter(r => r.targetId).length;
      unmatched += batchResults.filter(r => !r.targetId).length;

      if (i + batchSize < tracks.length) {
        await delay(200); // Rate limiting
      }
    }

    return {
      matched,
      unmatched,
      total: tracks.length,
      tracks: results,
    };
  } catch (error) {
    console.error("Error in search:", error);
    throw error;
  }
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: Array<ITrack & { targetId: string }>,
  description?: string
): Promise<TransferResult> {
  try {
    console.log("createPlaylistWithTracks - starting:", { name, trackCount: tracks.length });
    const music = await initializeAppleMusic();
    const userToken = await music.authorize();

    // Create the playlist with rate limiting
    const createResponse = await withRateLimit(() =>
      fetch("https://api.music.apple.com/v1/me/library/playlists", {
        method: "POST",
        headers: {
          "Music-User-Token": userToken,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attributes: {
            name,
            description: description || `Imported on ${new Date().toLocaleDateString()}`,
          },
        }),
      })
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Failed to create playlist:", {
        status: createResponse.status,
        statusText: createResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to create playlist: ${createResponse.status} ${createResponse.statusText}`
      );
    }

    const playlistData = await createResponse.json();
    const playlistId = playlistData.data?.[0]?.id;

    if (!playlistId) {
      console.error("No playlist ID in response:", playlistData);
      throw new Error("Failed to create playlist - no ID returned");
    }

    console.log("createPlaylistWithTracks - playlist created:", { playlistId });

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

    // Add tracks to playlist
    const addTracksResponse = await fetch(
      `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          "Music-User-Token": userToken,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: tracksWithIds.map(track => ({
            id: track.targetId,
            type: "songs",
          })),
        }),
      }
    );

    if (!addTracksResponse.ok) {
      const errorText = await addTracksResponse.text();
      console.error("Error adding tracks to playlist:", {
        status: addTracksResponse.status,
        statusText: addTracksResponse.statusText,
        error: errorText,
      });
      return {
        added: 0,
        failed: tracksWithIds.length,
        total: tracks.length,
        playlistId,
      };
    }

    return {
      added: tracksWithIds.length,
      failed: tracks.length - tracksWithIds.length,
      total: tracks.length,
      playlistId,
    };
  } catch (error) {
    console.error("Error in createPlaylistWithTracks:", error);
    throw error;
  }
}

export async function addTracksToLibrary(
  tracks: Array<ITrack & { targetId: string }>
): Promise<TransferResult> {
  try {
    console.log("addTracksToLibrary - starting:", { trackCount: tracks.length });
    const music = await initializeAppleMusic();
    const userToken = await music.authorize();

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

    // Add tracks to library with rate limiting
    const response = await withRateLimit(() =>
      fetch("https://api.music.apple.com/v1/me/library", {
        method: "POST",
        headers: {
          "Music-User-Token": userToken,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: tracksWithIds.map(track => ({
            id: track.targetId,
            type: "songs",
          })),
        }),
      })
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error adding tracks to library:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return {
        added: 0,
        failed: tracksWithIds.length,
        total: tracks.length,
        playlistId: null,
      };
    }

    return {
      added: tracksWithIds.length,
      failed: tracks.length - tracksWithIds.length,
      total: tracks.length,
      playlistId: null,
    };
  } catch (error) {
    console.error("Error in addTracksToLibrary:", error);
    throw error;
  }
}

export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  try {
    console.log("addAlbumsToLibrary - starting:", { albumCount: albums.size });
    const music = await initializeAppleMusic();
    const userToken = await music.authorize();

    if (albums.size === 0) {
      return {
        added: 0,
        failed: albums.size,
        total: albums.size,
        playlistId: null,
      };
    }

    // Construct the URL with comma-separated album IDs
    const albumIds = Array.from(albums)
      .map(album => album.targetId)
      .join(",");
    const url = `https://api.music.apple.com/v1/me/library?ids[albums]=${albumIds}`;

    // Add albums to library
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Music-User-Token": userToken,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error adding albums to library:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return {
        added: 0,
        failed: albums.size,
        total: albums.size,
        playlistId: null,
      };
    }

    return {
      added: albums.size,
      failed: albums.size - albums.size,
      total: albums.size,
      playlistId: null,
    };
  } catch (error) {
    console.error("Error in addAlbumsToLibrary:", error);
    throw error;
  }
}

async function findBestAlbumMatch(
  album: { name: string; artist: string },
  music: MusicKitInstance
): Promise<{ albumId: string | null }> {
  try {
    // Clean search terms
    const searchTerm = `${cleanSearchTerm(album.name)} ${cleanSearchTerm(album.artist)}`;
    console.log(
      `[MATCHING] Searching with cleaned term: "${searchTerm}" (original: "${album.name} ${album.artist}")`
    );

    const result = await withRateLimit(async () => {
      const userToken = await music.authorize();
      const url = new URL("https://api.music.apple.com/v1/catalog/fr/search");
      url.searchParams.set("term", searchTerm);
      url.searchParams.set("types", "albums");
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Music-User-Token": userToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    });

    // Process initial search results
    if (!result.results?.albums?.data?.length) {
      console.log(`[MATCHING] No results found for album "${album.name}" by ${album.artist}`);
      return { albumId: null };
    }

    const matches = result.results.albums.data
      .map((appleAlbum: AppleAlbum) => ({
        album: appleAlbum,
        ...calculateAlbumMatchScore(
          {
            name: album.name,
            artist: album.artist,
            id: "", // Required by IAlbum but not used in matching
            artwork: undefined,
          },
          {
            name: appleAlbum.attributes.name,
            artist: appleAlbum.attributes.artistName,
          },
          DEFAULT_ALBUM_CONFIG
        ),
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    // Log match details
    console.log(
      `[MATCHING] Results for album "${album.name}" by ${album.artist}":`,
      matches
        .slice(0, 3)
        .map((match: { score: number; details: MatchScoreDetails; album: AppleAlbum }) => ({
          score: match.score,
          details: match.details,
          matchedName: match.album.attributes.name,
          matchedArtist: match.album.attributes.artistName,
        }))
    );

    // Return best match if it meets the threshold
    if (matches[0].score >= DEFAULT_ALBUM_CONFIG.thresholds.minimum) {
      return { albumId: matches[0].album.id };
    }

    return { albumId: null };
  } catch (error) {
    console.error("[MATCHING] Error finding best album match:", error);
    return { albumId: null };
  }
}

export async function searchAlbums(albums: Array<IAlbum>): Promise<SearchResult> {
  try {
    const music = await initializeAppleMusic();
    const results: Array<IAlbum> = [];
    let matched = 0;
    let unmatched = 0;

    // Process albums
    const batchResults = await Promise.all(
      albums.map(async album => {
        const { albumId } = await findBestAlbumMatch(album, music);
        return {
          ...album, // Preserve all existing album properties
          targetId: albumId || undefined, // Convert null to undefined
          status: albumId ? ("matched" as const) : ("unmatched" as const),
        };
      })
    );

    results.push(...batchResults);
    matched += batchResults.filter(r => r.targetId).length;
    unmatched += batchResults.filter(r => !r.targetId).length;

    return {
      matched,
      unmatched,
      total: albums.length,
      albums: batchResults,
    };
  } catch (error) {
    console.error("Error in searchAlbums:", error);
    throw error;
  }
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
  const baseUrl = "https://api.music.apple.com/v1/me/library";

  // Helper function to format artwork URL
  const formatArtworkUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Replace {w} and {h} with actual dimensions
    return url.replace("{w}", "300").replace("{h}", "300");
  };

  // Fetch playlists
  const playlists: IPlaylist[] = [];
  let nextUrl: string | undefined = `${baseUrl}/playlists?limit=25`;

  do {
    if (!nextUrl) break;
    const response: Response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
        "Music-User-Token": authData.accessToken,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch playlists:", {
        status: response.status,
        statusText: response.statusText,
        url: nextUrl,
      });
      throw new Error("Failed to fetch playlists");
    }

    const data: AppleResponse<ApplePlaylist> = await response.json();
    const playlistItems = data.data.map(playlist => ({
      id: playlist.id,
      name: playlist.attributes.name,
      trackCount: playlist.attributes.trackCount,
      ownerId: authData.userId,
      ownerName: authData.displayName,
      artwork: formatArtworkUrl(playlist.attributes.artwork?.url),
      tracks: [], // We'll fetch tracks when needed
    }));

    playlists.push(...playlistItems);
    // Handle relative next URL
    nextUrl = data.next
      ? data.next.startsWith("http")
        ? data.next
        : `https://api.music.apple.com${data.next}`
      : undefined;
  } while (nextUrl);

  // Fetch songs from library
  const songs = [];
  nextUrl = `${baseUrl}/songs?limit=25`;

  do {
    if (!nextUrl) break;
    console.log("Fetching songs from:", nextUrl); // Add logging to debug URL
    const response: Response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
        "Music-User-Token": authData.accessToken,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch songs:", {
        status: response.status,
        statusText: response.statusText,
        url: nextUrl,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error("Failed to fetch songs");
    }

    const data: AppleResponse<AppleSong> = await response.json();
    const songItems = data.data.map(song => ({
      id: song.id,
      name: song.attributes.name,
      artist: song.attributes.artistName,
      album: song.attributes.albumName,
      artwork: formatArtworkUrl(song.attributes.artwork?.url),
    }));

    songs.push(...songItems);
    // Handle relative next URL
    nextUrl = data.next
      ? data.next.startsWith("http")
        ? data.next
        : `https://api.music.apple.com${data.next}`
      : undefined;
  } while (nextUrl);

  // Fetch albums
  const albums = [];
  nextUrl = `${baseUrl}/albums?limit=25`;

  do {
    if (!nextUrl) break;
    const response: Response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
        "Music-User-Token": authData.accessToken,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch albums:", {
        status: response.status,
        statusText: response.statusText,
        url: nextUrl,
      });
      throw new Error("Failed to fetch albums");
    }

    const data: AppleResponse<AppleAlbum> = await response.json();
    const albumItems = data.data.map(album => ({
      id: album.id,
      name: album.attributes.name,
      artist: album.attributes.artistName,
      artwork: formatArtworkUrl(album.attributes.artwork?.url),
    }));

    albums.push(...albumItems);
    // Handle relative next URL
    nextUrl = data.next
      ? data.next.startsWith("http")
        ? data.next
        : `https://api.music.apple.com${data.next}`
      : undefined;
  } while (nextUrl);

  return {
    playlists,
    likedSongs: songs,
    albums,
  };
}

export async function fetchPlaylistTracks(playlistId: string): Promise<ITrack[]> {
  // Helper function to format artwork URL
  const formatArtworkUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    // Replace {w} and {h} with actual dimensions
    return url.replace("{w}", "300").replace("{h}", "300");
  };

  const authData = await getAppleAuthData("source");
  if (!authData) throw new Error("Not authenticated with Apple Music");

  const tracks = [];
  let nextUrl: string | undefined =
    `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;

  do {
    const response: Response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
        "Music-User-Token": authData.accessToken,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlist tracks");
    }

    const data: AppleResponse<AppleSong> = await response.json();
    const trackItems = data.data.map(item => ({
      id: item.id,
      name: item.attributes.name,
      artist: item.attributes.artistName,
      album: item.attributes.albumName,
      artwork: formatArtworkUrl(item.attributes.artwork?.url),
    }));

    tracks.push(...trackItems);
    nextUrl = data.next;
  } while (nextUrl);

  return tracks;
}
