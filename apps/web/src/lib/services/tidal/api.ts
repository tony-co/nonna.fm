import { getTidalAuthData } from "./auth";
import type { ITrack, ILibraryData, IAlbum, IPlaylist } from "@/types";
import type { SearchResult, TransferResult } from "@/types/services";
import type { AuthData } from "@/lib/auth/constants";
import { retryWithExponentialBackoff, type RetryOptions } from "@/lib/utils/retry";
import {
  TidalTrack,
  TidalAlbum,
  TidalPlaylist,
  TidalArrayResponse,
  transformTidalTrackToTrack,
  transformTidalAlbumToAlbum,
  transformTidalPlaylistToPlaylist,
} from "./types";
import {
  calculateTrackMatchScore,
  calculateAlbumMatchScore,
  DEFAULT_TRACK_CONFIG,
  DEFAULT_ALBUM_CONFIG,
} from "@/lib/utils/matching";
import { processInBatches } from "@/lib/utils/batch-processor";

// Define TIDAL-specific retry options
const TIDAL_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 5,
  initialRetryDelay: 1000, // Start with slightly slower retry for TIDAL API
  maxRetryDelay: 32000,
  jitterFactor: 0.2,
};

// Helper function to get user ID from auth data
async function getUserId(_authData: AuthData): Promise<string> {
  const authData = await getTidalAuthData("source");

  if (!authData) {
    throw new Error("No TIDAL source authentication found");
  }

  if (!authData.userId) {
    throw new Error("No userId found in TIDAL auth data");
  }

  return authData.userId.toString();
}

// Helper function to search for tracks with query
async function performSearch(
  track: ITrack,
  searchQuery: string,
  authData: AuthData
): Promise<string | null> {
  const countryCode = "US"; // Default country code
  const encodedQuery = encodeURIComponent(searchQuery);

  const data = await retryWithExponentialBackoff<TidalArrayResponse<TidalTrack>>(
    () =>
      fetch(
        `https://openapi.tidal.com/v2/searchResults/${encodedQuery}?countryCode=${countryCode}&types=tracks&limit=3`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/vnd.api+json",
          },
        }
      ),
    TIDAL_RETRY_OPTIONS
  );

  if (!data.data?.length) {
    return null;
  }

  // Find the best match using the shared matching system
  const matchPromises = data.data.map(async (tidalTrack: TidalTrack) => ({
    track: tidalTrack,
    ...(await calculateTrackMatchScore(
      track,
      {
        name: tidalTrack.attributes.title,
        // TIDAL API doesn't include artist/album names in track attributes directly
        // We would need to fetch relationships or use a different endpoint to get this data
        artist: "Unknown Artist", // TODO: Implement relationship fetching
        album: "Unknown Album", // TODO: Implement relationship fetching
      },
      DEFAULT_TRACK_CONFIG
    )),
  }));

  const matches = await Promise.all(matchPromises);
  matches.sort((a, b) => b.score - a.score);

  // Return the ID if we have a good match (score >= minimum threshold)
  return matches[0].score >= DEFAULT_TRACK_CONFIG.thresholds.minimum ? matches[0].track.id : null;
}

async function findBestMatch(track: ITrack, authData: AuthData): Promise<string | null> {
  try {
    // First attempt with full search query
    const searchQuery = `${track.name} ${track.artist}`;
    let bestMatch = await performSearch(track, searchQuery, authData);

    // If no good match found and track is from YouTube, retry with just the track name
    if (bestMatch === null && track.videoId) {
      const retrySearchQuery = track.name;
      bestMatch = await performSearch(track, retrySearchQuery, authData);
    }

    return bestMatch;
  } catch (error) {
    console.error("[MATCHING] Error finding best match:", error);
    return null;
    // throw new Error(
    //   `Error finding best track match: ${error instanceof Error ? error.message : String(error)}`
    // );
  }
}

async function findBestAlbumMatch(album: IAlbum, authData: AuthData): Promise<string | null> {
  try {
    const countryCode = "US"; // Default country code
    const searchQuery = encodeURIComponent(`${album.name} ${album.artist}`);

    // Search for albums
    const response = await retryWithExponentialBackoff<TidalArrayResponse<TidalAlbum>>(
      () =>
        fetch(
          `https://openapi.tidal.com/v2/searchResults/${searchQuery}?countryCode=${countryCode}&types=albums&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/vnd.api+json",
            },
          }
        ),
      TIDAL_RETRY_OPTIONS
    );

    if (!response.data?.length) {
      return null;
    }

    // Find the best match using our shared matching system
    // Note: TIDAL API doesn't provide artist name directly in album attributes
    // We'll need to implement relationship fetching to get accurate artist names
    const matches = response.data
      .map((tidalAlbum: TidalAlbum) => ({
        album: tidalAlbum,
        ...calculateAlbumMatchScore(
          album,
          {
            name: tidalAlbum.attributes.title, // TIDAL uses 'title' not 'name'
            artist: "", // TODO: Fetch artist name via relationships
          },
          DEFAULT_ALBUM_CONFIG
        ),
      }))
      .sort((a, b) => b.score - a.score);

    // Return the ID if we have a good match (score >= minimum threshold)
    return matches[0].score >= DEFAULT_ALBUM_CONFIG.thresholds.minimum ? matches[0].album.id : null;
  } catch (error) {
    console.error("[MATCHING] Error finding best album match:", error);
    return null;
    // throw new Error(
    //   `Error finding best album match: ${error instanceof Error ? error.message : String(error)}`
    // );
  }
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getTidalAuthData("source");
  if (!authData) throw new Error("Not authenticated with TIDAL");

  const countryCode = "US"; // Default country code

  // Fetch playlists
  const playlists = await fetchPlaylists(authData, countryCode);

  // Fetch saved tracks (favorites)
  const likedSongs = await fetchFavoriteTracks(authData, countryCode);
  //const likedSongs: ITrack[] = [];

  // Fetch saved albums
  const albums = await fetchFavoriteAlbums(authData, countryCode);

  return {
    playlists,
    likedSongs,
    albums,
  };
}

async function fetchPlaylists(authData: AuthData, countryCode: string): Promise<IPlaylist[]> {
  const playlistResults: IPlaylist[] = [];
  let cursor: string | undefined;

  // Get user ID for the new userCollections endpoint
  const userId = await getUserId(authData);

  // Fetch playlists with full details using include=playlists
  do {
    const url = cursor
      ? `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/playlists?countryCode=${countryCode}&include=playlists,playlists.coverArt&page[cursor]=${cursor}`
      : `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/playlists?countryCode=${countryCode}&include=playlists,playlists.coverArt`;

    const data = await retryWithExponentialBackoff<string>(
      () =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/vnd.api+json",
          },
        }),
      TIDAL_RETRY_OPTIONS
    );

    const parsedData = JSON.parse(data) as {
      data: Array<{ id: string; type: string; meta: { itemId: string; addedAt: string } }>;
      included?: Array<TidalPlaylist>;
      meta?: { pagination?: { cursor?: string } };
    };

    // Process included playlist data directly
    if (parsedData.included) {
      const playlists = parsedData.included
        .filter(item => item.type === "playlists")
        .map(playlist => transformTidalPlaylistToPlaylist(playlist, parsedData.included))
        .filter((playlist): playlist is IPlaylist => playlist !== null);

      playlistResults.push(...playlists);
    }

    // Get next cursor for pagination
    cursor = parsedData.meta?.pagination?.cursor;
  } while (cursor);

  return playlistResults;
}

async function fetchFavoriteAlbums(authData: AuthData, countryCode: string): Promise<IAlbum[]> {
  const albumResults: IAlbum[] = [];
  let cursor: string | undefined;

  // Get user ID for the new userCollections endpoint
  const userId = await getUserId(authData);

  // Fetch albums with full details using include=albums
  do {
    const url = cursor
      ? `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/albums?countryCode=${countryCode}&include=albums,albums.coverArt&page[cursor]=${cursor}`
      : `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/albums?countryCode=${countryCode}&include=albums,albums.coverArt`;

    const data = await retryWithExponentialBackoff<string>(
      () =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/vnd.api+json",
          },
        }),
      TIDAL_RETRY_OPTIONS
    );

    const parsedData = JSON.parse(data) as {
      data: Array<{ id: string; type: string; meta: { itemId: string; addedAt: string } }>;
      included?: Array<TidalAlbum>;
      meta?: { pagination?: { cursor?: string } };
    };

    // Process included album data directly
    if (parsedData.included) {
      const albums = parsedData.included
        .filter(item => item.type === "albums")
        .map(album => transformTidalAlbumToAlbum(album, parsedData.included))
        .filter((album): album is IAlbum => album !== null);

      albumResults.push(...albums);
    }

    // Get next cursor for pagination
    cursor = parsedData.meta?.pagination?.cursor;
  } while (cursor);

  return albumResults;
}

/** todo tidal api does not support retrieving favorite tracks for now */
/* eslint-disable @typescript-eslint/no-unused-vars */
async function fetchFavoriteTracks(authData: AuthData, countryCode: string): Promise<ITrack[]> {
  const trackResults: ITrack[] = [];
  let cursor: string | undefined;

  // Get user ID for the new userCollections endpoint
  const userId = await getUserId(authData);

  // First, get all track IDs from userCollections endpoint
  const trackIds: string[] = [];
  do {
    const url = cursor
      ? `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/tracks?countryCode=${countryCode}&page[cursor]=${cursor}`
      : `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/tracks?countryCode=${countryCode}`;

    const data = await retryWithExponentialBackoff<string>(
      () =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/vnd.api+json",
          },
        }),
      TIDAL_RETRY_OPTIONS
    );

    const parsedData = JSON.parse(data) as {
      data: Array<{ id: string; type: string; meta: { itemId: string; addedAt: string } }>;
      meta?: { pagination?: { cursor?: string } };
    };

    // Extract track IDs
    trackIds.push(...parsedData.data.map(item => item.id));

    // Get next cursor
    cursor = parsedData.meta?.pagination?.cursor;
  } while (cursor);

  // Now fetch full details for tracks in batches using bulk endpoint
  await processInBatches(
    async (batch: string[]) => {
      try {
        // Create filter parameter for bulk track fetch
        const filterIds = batch.join(",");
        const url = `https://openapi.tidal.com/v2/tracks?countryCode=${countryCode}&filter[id]=${filterIds}&include=artists,albums,albums.coverArt`;

        const data = await retryWithExponentialBackoff<string>(
          () =>
            fetch(url, {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/vnd.api+json",
              },
            }),
          TIDAL_RETRY_OPTIONS
        );

        const parsedData = JSON.parse(data) as TidalArrayResponse<TidalTrack>;
        trackResults.push(
          ...parsedData.data.map(track => transformTidalTrackToTrack(track, parsedData.included))
        );
      } catch (error) {
        throw new Error(
          `Error fetching track details batch: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    },
    {
      items: trackIds,
      batchSize: 10, // Process 10 tracks at a time to avoid rate limits
      delayBetweenBatches: 100,
    }
  );

  return trackResults;
}

export async function search(
  tracks: Array<ITrack>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  const authData = await getTidalAuthData("target");
  if (!authData) {
    return {
      matched: 0,
      unmatched: tracks.length,
      total: tracks.length,
      tracks: tracks.map(track => ({
        ...track,
        status: "unmatched",
      })),
    };
  }

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
            status: targetId ? ("matched" as const) : ("unmatched" as const),
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
    }
  );

  return {
    matched,
    unmatched,
    total: tracks.length,
    tracks: results,
  };
}

export async function searchAlbums(
  albums: Array<IAlbum>,
  onProgress: ((progress: number) => void) | undefined
): Promise<SearchResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with TIDAL");

    const results: Array<IAlbum> = [];
    let matched = 0;
    let unmatched = 0;
    let processedCount = 0;

    // Process albums in batches
    await processInBatches(
      async batch => {
        const albumResults = await Promise.all(
          batch.map(async album => {
            const tidalId = await findBestAlbumMatch(album, authData);
            processedCount++;
            if (onProgress) {
              onProgress(processedCount / albums.length);
            }
            return {
              ...album,
              targetId: tidalId || undefined,
              status: tidalId ? ("matched" as const) : ("unmatched" as const),
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
      }
    );

    return {
      matched,
      unmatched,
      total: albums.length,
      albums: results,
    };
  } catch (error) {
    throw error;
  }
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: Array<ITrack>,
  description?: string
): Promise<TransferResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with TIDAL");

    const countryCode = "US"; // Default country code

    // Create the playlist
    const createResponse = await fetch("https://openapi.tidal.com/v2/playlists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "playlists",
          attributes: {
            name,
            description: description || `Imported on ${new Date().toLocaleDateString()}`,
          },
        },
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(
        `Failed to create playlist: ${createResponse.status} ${createResponse.statusText} - ${errorText}`
      );
    }

    const playlistData = await createResponse.json();
    const playlistId = playlistData.data.id;

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

    const result = await processInBatches(
      async batch => {
        // Format request body for adding tracks to playlist
        const addTracksBody = {
          data: batch.map(track => ({
            type: "playlistTracks",
            attributes: {
              itemId: track.targetId,
              itemType: "tracks",
            },
          })),
        };

        const response = await fetch(
          `https://openapi.tidal.com/v2/playlists/${playlistId}/items?countryCode=${countryCode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/vnd.api+json",
            },
            body: JSON.stringify(addTracksBody),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to add tracks to playlist: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      },
      {
        items: tracksWithIds,
        batchSize: 50, // Process 50 tracks at a time
      }
    );

    return {
      ...result,
      playlistId,
    };
  } catch (error) {
    throw error;
  }
}

export async function addTracksToLibrary(tracks: Array<ITrack>): Promise<TransferResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with TIDAL");

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

    const countryCode = "US"; // Default country code

    const result = await processInBatches(
      async batch => {
        // Format request for adding favorites
        const addFavoritesBody = {
          data: batch.map(track => ({
            type: "userFavorites",
            attributes: {
              itemId: track.targetId,
              itemType: "tracks",
              favourite: true,
            },
          })),
        };

        const response = await fetch(
          `https://openapi.tidal.com/v2/users/me/favorites?countryCode=${countryCode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/vnd.api+json",
            },
            body: JSON.stringify(addFavoritesBody),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to add tracks to favorites: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      },
      {
        items: tracksWithIds,
        batchSize: 25, // Process 25 tracks at a time
      }
    );

    return {
      ...result,
      playlistId: null,
    };
  } catch (error) {
    throw error;
  }
}

export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with TIDAL");

    // Convert Set/Array to Array and filter albums with valid targetIds
    const albumsWithIds = (Array.isArray(albums) ? albums : Array.from(albums)).filter(
      (album): album is IAlbum & { targetId: string } => !!album.targetId
    );

    if (albumsWithIds.length === 0) {
      return {
        added: 0,
        failed: Array.isArray(albums) ? albums.length : albums.size,
        total: Array.isArray(albums) ? albums.length : albums.size,
        playlistId: null,
      };
    }

    const countryCode = "US"; // Default country code

    // Get user ID for the new userCollections endpoint
    const userId = await getUserId(authData);

    const result = await processInBatches(
      async batch => {
        // Format request for adding albums to user collection
        const addAlbumsBody = {
          data: batch.map(album => ({
            type: "albums",
            id: album.targetId,
          })),
        };

        const response = await fetch(
          `https://openapi.tidal.com/v2/userCollections/${userId}/relationships/albums?countryCode=${countryCode}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/vnd.api+json",
            },
            body: JSON.stringify(addAlbumsBody),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to add albums to library: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      },
      {
        items: albumsWithIds,
        batchSize: 20,
      }
    );

    return {
      ...result,
      playlistId: null,
    };
  } catch (error) {
    throw error;
  }
}

export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  const authData = await getTidalAuthData("source");
  if (!authData) throw new Error("Not authenticated with TIDAL");

  const countryCode = "US"; // Default country code
  const trackResults: ITrack[] = [];

  try {
    // Step 1: Get all track IDs from playlist items
    const trackIds: string[] = [];
    let cursor: string | undefined;

    do {
      const url = cursor
        ? `https://openapi.tidal.com/v2${cursor}`
        : `https://openapi.tidal.com/v2/playlists/${playlistId}/relationships/items?countryCode=${countryCode}`;

      const data = await retryWithExponentialBackoff<string>(
        () =>
          fetch(url, {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/vnd.api+json",
            },
          }),
        TIDAL_RETRY_OPTIONS
      );

      const parsedData = JSON.parse(data) as {
        data: Array<{ id: string; type: string }>;
        links?: { next?: string };
        meta?: { pagination?: { cursor?: string } };
      };

      // Extract track IDs (filter for tracks only)
      const pageTrackIds = parsedData.data
        .filter(item => item.type === "tracks")
        .map(item => item.id);

      trackIds.push(...pageTrackIds);

      // Get next cursor for pagination
      cursor = parsedData.links?.next ?? undefined;
    } while (cursor);

    if (trackIds.length === 0) {
      return trackResults;
    }

    // Step 2: Fetch full track details in batches using track IDs
    await processInBatches(
      async (batch: string[]) => {
        try {
          // Create filter parameter for bulk track fetch
          const filterIds = batch.join(",");
          const url = `https://openapi.tidal.com/v2/tracks?countryCode=${countryCode}&include=artists,albums,albums.coverArt&filter[id]=${filterIds}`;

          const data = await retryWithExponentialBackoff<string>(
            () =>
              fetch(url, {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                  "Content-Type": "application/vnd.api+json",
                },
              }),
            TIDAL_RETRY_OPTIONS
          );

          const parsedData = JSON.parse(data) as TidalArrayResponse<TidalTrack>;
          const batchTracks = parsedData.data.map(track =>
            transformTidalTrackToTrack(track, parsedData.included)
          );

          trackResults.push(...batchTracks);

          // Call onProgress callback after each batch
          if (onProgress) {
            const progress = trackResults.length / trackIds.length;
            onProgress([...trackResults], progress);
          }
        } catch (error) {
          throw new Error(
            `Error fetching track details batch: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      },
      {
        items: trackIds,
        batchSize: 20, // Process 50 tracks at a time to avoid rate limits
        delayBetweenBatches: 500,
      }
    );

    return trackResults;
  } catch (error) {
    throw error;
  }
}
