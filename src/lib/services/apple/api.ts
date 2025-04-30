import { SearchResult, TransferResult } from "@/types/services";
import { getYouTubeAuthData } from "../youtube/auth";
import { getAppleAuthData } from "./auth";
import type { ITrack, ILibraryData, IAlbum, IPlaylist } from "@/types/library";
import { processInBatches } from "@/lib/utils/batch-processor";
import {
  calculateTrackMatchScore,
  calculateAlbumMatchScore,
  DEFAULT_TRACK_CONFIG,
  DEFAULT_ALBUM_CONFIG,
  type MatchScoreDetails,
  cleanSearchTerm,
} from "@/lib/utils/matching";
import { retryWithExponentialBackoff, type RetryOptions } from "@/lib/utils/retry";
import { AUTH_STORAGE_KEYS, type AuthData, setServiceType } from "@/lib/auth/constants";

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

export async function initializeAppleMusic(
  injectedMusicKit?: MusicKitGlobal
): Promise<MusicKitInstance> {
  try {
    // Use the injected MusicKit if provided, otherwise use window.MusicKit
    let musicKit =
      injectedMusicKit ?? (typeof window !== "undefined" ? window.MusicKit : undefined);

    if (!musicKit) {
      // Retry logic as before
      let attempts = 0;
      while (attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempts + 1)));
        musicKit =
          injectedMusicKit ?? (typeof window !== "undefined" ? window.MusicKit : undefined);
        if (musicKit) {
          break;
        }
        attempts++;
      }
      if (!musicKit) {
        throw new Error("MusicKit failed to load after multiple attempts");
      }
    }

    await musicKit.configure({
      developerToken: process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN || "",
      app: {
        name: "Nonna.fm",
        build: "1.0.0",
      },
    });

    return musicKit.getInstance();
  } catch (error) {
    console.error("Error initializing Apple Music:", error);
    throw error;
  }
}

export async function authorizeAppleMusic(
  role: "source" | "target",
  injectedMusicKit?: MusicKitGlobal
): Promise<string> {
  try {
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
  } catch (error) {
    console.error("authorizeAppleMusic - error:", error);
    throw error;
  }
}

async function findBestMatch(
  track: ITrack & { id: string },
  music: MusicKitInstance
): Promise<{ songId: string | null; albumId: string | null }> {
  try {
    const isYouTubeSource = !!getYouTubeAuthData("source");

    // For YouTube sources, the data is already cleaned by the YouTube API
    // For other sources, clean the search terms
    const searchName = isYouTubeSource ? track.name : cleanSearchTerm(track.name);
    const searchArtist = isYouTubeSource ? track.artist : cleanSearchTerm(track.artist);

    const searchTerm = `${searchName} ${searchArtist}`;

    const result = await retryWithExponentialBackoff<AppleMusicSearchResponse>(async () => {
      const userToken = await music.authorize();
      const url = new URL("https://api.music.apple.com/v1/catalog/fr/search");
      url.searchParams.set("term", searchTerm);
      url.searchParams.set("types", "songs");
      url.searchParams.set("limit", "3");
      url.searchParams.set("fields[songs]", "name,artistName,albumName");
      url.searchParams.set("include", "albums");

      return fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Music-User-Token": userToken,
        },
      });
    }, APPLE_RETRY_OPTIONS);

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
  tracks: Array<ITrack>,
  onProgress: ((progress: number) => void) | undefined,
  injectedMusicKit?: MusicKitGlobal
): Promise<SearchResult> {
  try {
    const music = await initializeAppleMusic(injectedMusicKit);
    const results: Array<ITrack> = [];
    let matched = 0;
    let unmatched = 0;
    let processedCount = 0;

    await processInBatches(
      async batch => {
        const trackResults = await Promise.all(
          batch.map(async track => {
            const { songId, albumId } = await findBestMatch(track, music);
            processedCount++;
            if (onProgress) {
              onProgress(processedCount / tracks.length);
            }
            return {
              ...track,
              targetId: songId || undefined,
              albumId: albumId || undefined,
              status: songId ? ("matched" as const) : ("unmatched" as const),
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
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`Processing track search batch ${batchNumber}/${totalBatches}`);
        },
        onError: (error, batch) => {
          console.error("Error searching tracks batch:", {
            error: error.message,
            batchSize: batch.length,
            tracks: batch.map(track => ({
              name: track.name,
              artist: track.artist,
            })),
          });
        },
      }
    );

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
  tracks: Array<ITrack>,
  description?: string,
  injectedMusicKit?: MusicKitGlobal
): Promise<TransferResult> {
  try {
    console.log("createPlaylistWithTracks - starting:", { name, trackCount: tracks.length });
    const music = await initializeAppleMusic(injectedMusicKit);
    const userToken = await music.authorize();

    // Create the playlist with retry
    const playlistData = await retryWithExponentialBackoff<{ data: Array<{ id: string }> }>(
      () =>
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
        }),
      APPLE_RETRY_OPTIONS
    );

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
    await retryWithExponentialBackoff(
      () =>
        fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, {
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
        }),
      APPLE_RETRY_OPTIONS
    );

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
  tracks: Array<ITrack>,
  injectedMusicKit?: MusicKitGlobal
): Promise<TransferResult> {
  try {
    console.log("addTracksToLibrary - starting:", { trackCount: tracks.length });
    const music = await initializeAppleMusic(injectedMusicKit);
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

    // Add tracks to library with retry
    await retryWithExponentialBackoff(
      () =>
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
        }),
      APPLE_RETRY_OPTIONS
    );

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

export async function addAlbumsToLibrary(
  albums: Set<IAlbum>,
  injectedMusicKit?: MusicKitGlobal
): Promise<TransferResult> {
  try {
    console.log("addAlbumsToLibrary - starting:", { albumCount: albums.size });
    const music = await initializeAppleMusic(injectedMusicKit);
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

    // Add albums to library with retry
    await retryWithExponentialBackoff(
      () =>
        fetch(url, {
          method: "POST",
          headers: {
            "Music-User-Token": userToken,
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }),
      APPLE_RETRY_OPTIONS
    );

    return {
      added: albums.size,
      failed: 0, // All were added if no error
      total: albums.size,
      playlistId: null,
    };
  } catch (error) {
    console.error("Error in addAlbumsToLibrary:", error);
    throw error;
  }
}

async function findBestAlbumMatch(
  album: IAlbum,
  music: MusicKitInstance
): Promise<{ albumId: string | null }> {
  try {
    // Clean search terms
    const searchTerm = `${cleanSearchTerm(album.name)} ${cleanSearchTerm(album.artist)}`;
    console.log(
      `[MATCHING] Searching with cleaned term: "${searchTerm}" (original: "${album.name} ${album.artist}")`
    );

    const result = await retryWithExponentialBackoff<{
      results?: { albums?: { data: AppleAlbum[] } };
    }>(async () => {
      const userToken = await music.authorize();
      const url = new URL("https://api.music.apple.com/v1/catalog/fr/search");
      url.searchParams.set("term", searchTerm);
      url.searchParams.set("types", "albums");
      url.searchParams.set("limit", "3");
      url.searchParams.set("fields[albums]", "name,artistName");

      return fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
          "Music-User-Token": userToken,
        },
      });
    }, APPLE_RETRY_OPTIONS);

    // Process initial search results
    if (!result.results?.albums?.data?.length) {
      console.log(`[MATCHING] No results found for album "${album.name}" by ${album.artist}`);
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

    // Log match details
    console.log(
      `[MATCHING] Results for album "${album.name}" by ${album.artist}:`,
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

export async function searchAlbums(
  albums: Array<IAlbum>,
  onProgress: ((progress: number) => void) | undefined,
  injectedMusicKit?: MusicKitGlobal
): Promise<SearchResult> {
  try {
    const music = await initializeAppleMusic(injectedMusicKit);
    const results: Array<IAlbum> = [];
    let matched = 0;
    let unmatched = 0;
    let processedCount = 0;

    await processInBatches(
      async batch => {
        const albumResults = await Promise.all(
          batch.map(async album => {
            const { albumId } = await findBestAlbumMatch(album, music);
            processedCount++;
            if (onProgress) {
              onProgress(processedCount / albums.length);
            }
            return {
              ...album,
              targetId: albumId || undefined,
              status: albumId ? ("matched" as const) : ("unmatched" as const),
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
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`Processing album search batch ${batchNumber}/${totalBatches}`);
        },
        onError: (error, batch) => {
          console.error("Error searching albums batch:", {
            error: error.message,
            batchSize: batch.length,
            albums: batch.map(album => ({
              name: album.name,
              artist: album.artist,
            })),
          });
        },
      }
    );

    return {
      matched,
      unmatched,
      total: albums.length,
      albums: results,
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
  let nextUrl = `${baseUrl}/playlists?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<ApplePlaylist>>(
      () =>
        fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
            "Music-User-Token": authData.accessToken,
          },
        }),
      APPLE_RETRY_OPTIONS
    );

    const playlistItems = data.data.map(playlist => ({
      id: playlist.id,
      name: playlist.attributes.name,
      trackCount: playlist.attributes.trackCount,
      ownerId: authData.userId,
      artwork: formatArtworkUrl(playlist.attributes.artwork?.url),
      tracks: [], // We'll fetch tracks when needed
    }));

    playlists.push(...playlistItems);
    // Handle relative next URL
    nextUrl = data.next
      ? data.next.startsWith("http")
        ? data.next
        : `https://api.music.apple.com${data.next}&limit=50`
      : "";

    if (!nextUrl) break;
  } while (nextUrl);

  // Fetch songs from library
  const songs = [];
  nextUrl = `${baseUrl}/songs?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleSong>>(
      () =>
        fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
            "Music-User-Token": authData.accessToken,
          },
        }),
      APPLE_RETRY_OPTIONS
    );

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
        : `https://api.music.apple.com${data.next}&limit=50`
      : "";

    if (!nextUrl) break;
  } while (nextUrl);

  // Fetch albums
  const albums: IAlbum[] = [];
  nextUrl = `${baseUrl}/albums?limit=50`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleAlbum>>(
      () =>
        fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
            "Music-User-Token": authData.accessToken,
          },
        }),
      APPLE_RETRY_OPTIONS
    );

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
        : `https://api.music.apple.com${data.next}&limit=50`
      : "";

    if (!nextUrl) break;
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
  let nextUrl = `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`;

  do {
    const data = await retryWithExponentialBackoff<AppleResponse<AppleSong>>(
      () =>
        fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN}`,
            "Music-User-Token": authData.accessToken,
          },
        }),
      APPLE_RETRY_OPTIONS
    );

    const trackItems = data.data.map(item => ({
      id: item.id,
      name: item.attributes.name,
      artist: item.attributes.artistName,
      album: item.attributes.albumName,
      artwork: formatArtworkUrl(item.attributes.artwork?.url),
    }));

    tracks.push(...trackItems);
    nextUrl = data.next || "";

    if (!nextUrl) break;
  } while (nextUrl);

  return tracks;
}
