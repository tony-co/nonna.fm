import { getTidalAuthData } from "./auth";
import type { ITrack, ILibraryData, IAlbum, IPlaylist } from "@/types/library";
import type { SearchResult, TransferResult } from "@/types/services";
import type { AuthData } from "@/lib/auth/constants";
import { retryWithExponentialBackoff } from "@/lib/utils/retry";
import type {
  JsonApiResource,
  JsonApiResponse,
  TrackResource,
  AlbumResource,
  PlaylistResource,
  JsonApiResourceIdentifier,
} from "./types";
import { calculateTrackMatchScore, DEFAULT_TRACK_CONFIG } from "@/lib/utils/matching";
import { processInBatches } from "@/lib/utils/batch-processor";

// --- Constants ---
const BASE_URL = "https://openapi.tidal.com/v2";
const DEFAULT_COUNTRY_CODE = "US";
const DEFAULT_LOCALE = "en-US";

// --- Helper Function ---
async function fetchWithAuth<T>(
  url: string,
  authData: AuthData,
  options: RequestInit = {}
): Promise<T> {
  if (!authData?.accessToken) {
    throw new Error("No access token available for TIDAL API request");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${authData.accessToken}`,
      Accept: "application/vnd.api+json",
      ...(options.method?.toUpperCase() !== "GET" &&
        options.body && { "Content-Type": "application/vnd.api+json" }),
    },
  });

  // Handle rate limiting
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Default to 5 seconds if no header
    console.log(`[TIDAL] Rate limited, waiting ${waitTime}ms before retry`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return fetchWithAuth<T>(url, authData, options);
  }

  // Clone the response before reading it
  const responseClone = response.clone();

  // Try to get the response body as text first
  let responseText: string;
  try {
    responseText = await responseClone.text();
  } catch (error) {
    console.error("[TIDAL] Error reading response body:", error);
    throw new Error(`Failed to read response body: ${error}`);
  }

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = JSON.parse(responseText);
    } catch {
      errorBody = responseText;
    }

    const errorMessage = `Tidal API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`;
    console.error(
      `[TIDAL API Error] ${response.status} ${response.statusText} for ${url}`,
      errorBody
    );
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  // Try to parse the response as JSON
  try {
    return JSON.parse(responseText) as T;
  } catch (error) {
    console.error("[TIDAL] Error parsing JSON response:", error);
    throw new Error(`Failed to parse JSON response: ${error}`);
  }
}

function adaptTransformTidalTrackToTrack(
  resource: TrackResource,
  _included?: JsonApiResource[]
): ITrack {
  const artistName = "Unknown Artist"; // Placeholder
  const albumName = "Unknown Album"; // Placeholder

  return {
    id: resource.id,
    name: resource.attributes.title,
    artist: artistName,
    album: albumName,
    artwork: undefined,
    targetId: resource.id, // Use targetId instead of sourceId
    status: "pending",
  };
}

function adaptTransformTidalAlbumToAlbum(
  resource: AlbumResource,
  _included?: JsonApiResource[]
): IAlbum {
  const artistName = "Unknown Artist"; // Placeholder

  return {
    id: resource.id,
    name: resource.attributes.title,
    artist: artistName,
    artwork: undefined,
    targetId: undefined,
    status: "pending",
  };
}

function adaptTransformTidalPlaylistToPlaylist(
  resource: PlaylistResource,
  _included?: JsonApiResource[]
): IPlaylist {
  const ownerName = "Unknown Owner"; // Placeholder

  return {
    id: resource.id,
    name: resource.attributes.name,
    description: resource.attributes.description,
    ownerId: "unknown",
    ownerName: ownerName,
    artwork: undefined,
    trackCount: resource.attributes.numberOfItems ?? 0,
    tracks: [],
    targetId: undefined,
  };
}

// Helper function to fetch all items from a paginated endpoint
async function fetchAllPaginatedItems<TResource extends JsonApiResource, TResult>(
  initialUrl: string,
  authData: AuthData,
  transformFn: (resource: TResource, included?: JsonApiResource[]) => TResult,
  resourceType: string
): Promise<TResult[]> {
  const allItems: TResult[] = [];
  let nextUrl: string | undefined = initialUrl;

  while (nextUrl) {
    console.log(`[TIDAL] Fetching paginated data: ${nextUrl}`);
    const response = await retryWithExponentialBackoff<
      JsonApiResponse<TResource[], JsonApiResource[]>
    >(() => fetchWithAuth(nextUrl!, authData));

    // Check if response is valid
    if (!response || !response.data) {
      console.warn(`[TIDAL] Invalid response received for ${nextUrl}:`, response);
      break;
    }

    const includedData = response.included || [];

    // Handle empty data array case
    if (Array.isArray(response.data) && response.data.length === 0) {
      console.log(`[TIDAL] No items found for ${nextUrl}`);
      break;
    }

    if (Array.isArray(response.data)) {
      try {
        if (response.data.length > 0 && (response.data[0] as JsonApiResource).attributes) {
          const transformedItems = (response.data as TResource[]).map(resource =>
            transformFn(resource, includedData)
          );
          allItems.push(...transformedItems);
        } else {
          const dataIdentifiers = response.data as JsonApiResourceIdentifier[];
          const resourcesFromIncluded = includedData.filter(
            inc => inc.type === resourceType && dataIdentifiers.some(id => id.id === inc.id)
          ) as TResource[];
          const transformedItems = resourcesFromIncluded.map(resource =>
            transformFn(resource, includedData)
          );
          allItems.push(...transformedItems);
        }
      } catch (error) {
        console.error(`[TIDAL] Error transforming data from ${nextUrl}:`, error);
        break;
      }
    }

    // Check if we have a next page
    nextUrl = response.links?.next;
    if (!nextUrl) {
      console.log("[TIDAL] No more pages to fetch");
      break;
    }
  }

  return allItems;
}

// Helper function to perform the actual search and matching (using JSON:API)
async function performSearch(
  sourceTrack: ITrack,
  searchQuery: string,
  authData: AuthData,
  countryCode: string
): Promise<string | null> {
  const encodedQuery = encodeURIComponent(searchQuery);
  // Use the searchResults endpoint, requesting tracks relationship + included track data
  const url = `${BASE_URL}/searchResults/${encodedQuery}?countryCode=${countryCode}&include=tracks&page[limit]=5`; // Limit search results

  const response = await retryWithExponentialBackoff<
    JsonApiResponse<JsonApiResource, JsonApiResource[]>
  >(() => fetchWithAuth(url, authData));

  const tidalTracks =
    response.included?.filter((item): item is TrackResource => item.type === "tracks") || [];

  if (!tidalTracks.length) {
    return null;
  }

  // Find the best match using our shared matching system
  const matchPromises = tidalTracks.map(async tidalTrackResource => ({
    track: tidalTrackResource,
    ...(await calculateTrackMatchScore(
      sourceTrack,
      {
        // Access attributes for matching
        name: tidalTrackResource.attributes.title,
        // TODO: Artist/Album names require fetching/parsing relationships -> included data
        artist: "Unknown Artist", // Placeholder - needs proper implementation
        album: "Unknown Album", // Placeholder - needs proper implementation
      },
      DEFAULT_TRACK_CONFIG
    )),
  }));

  const matches = await Promise.all(matchPromises);
  matches.sort((a, b) => b.score - a.score);

  console.log(
    `[TIDAL Search] Query: "${searchQuery}", Best Match: ${matches[0]?.track?.attributes?.title}, Score: ${matches[0]?.score}`
  );

  // Return the ID if we have a good match (score >= minimum threshold)
  return matches[0].score >= DEFAULT_TRACK_CONFIG.thresholds.minimum ? matches[0].track.id : null;
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getTidalAuthData("source");
  if (!authData) throw new Error("Not authenticated with Tidal");

  // TODO: Get countryCode and locale dynamically
  const countryCode = DEFAULT_COUNTRY_CODE;
  const locale = DEFAULT_LOCALE;

  console.log("[TIDAL] Fetching user library...", { countryCode, locale });

  // Fetch Playlists (/playlists/me)
  const playlistsUrl = `${BASE_URL}/playlists/me?countryCode=${countryCode}&include=owners,coverArt`; // Include necessary relations
  const playlists = await fetchAllPaginatedItems<PlaylistResource, IPlaylist>(
    playlistsUrl,
    authData,
    adaptTransformTidalPlaylistToPlaylist,
    "playlists"
  );
  console.log(`[TIDAL] Fetched ${playlists.length} playlists.`);

  // Fetch Liked Songs (/userCollections/me/relationships/tracks)
  const likedSongsUrl = `${BASE_URL}/userCollections/me/relationships/tracks?countryCode=${countryCode}&locale=${locale}&include=tracks`; // Must include tracks
  const likedSongs = await fetchAllPaginatedItems<TrackResource, ITrack>(
    likedSongsUrl,
    authData,
    adaptTransformTidalTrackToTrack,
    "tracks"
  );
  console.log(`[TIDAL] Fetched ${likedSongs.length} liked songs.`);

  // Fetch Saved Albums (/userCollections/me/relationships/albums)
  const savedAlbumsUrl = `${BASE_URL}/userCollections/me/relationships/albums?countryCode=${countryCode}&locale=${locale}&include=albums`; // Must include albums
  const albums = await fetchAllPaginatedItems<AlbumResource, IAlbum>(
    savedAlbumsUrl,
    authData,
    adaptTransformTidalAlbumToAlbum,
    "albums"
  );
  console.log(`[TIDAL] Fetched ${albums.length} saved albums.`);

  return {
    playlists,
    likedSongs,
    albums,
  };
}

export async function fetchPlaylistTracks(playlistId: string): Promise<ITrack[]> {
  const authData = await getTidalAuthData("source");
  if (!authData) throw new Error("Not authenticated with Tidal");

  const countryCode = DEFAULT_COUNTRY_CODE;
  console.log(`[TIDAL] Fetching tracks for playlist: ${playlistId}...`, { countryCode });

  const playlistItemsUrl = `${BASE_URL}/playlists/${playlistId}/relationships/items?countryCode=${countryCode}&include=items`;

  const tracks = await fetchAllPaginatedItems<TrackResource, ITrack>(
    playlistItemsUrl,
    authData,
    adaptTransformTidalTrackToTrack,
    "tracks"
  );
  console.log(`[TIDAL] Fetched ${tracks.length} tracks for playlist ${playlistId}.`);

  return tracks;
}

export async function searchTrack(track: ITrack): Promise<SearchResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with Tidal for target operations");

    // TODO: Get countryCode dynamically
    const countryCode = DEFAULT_COUNTRY_CODE;

    // Try searching with full track details
    const searchQuery = `${track.name} ${track.artist}`;
    console.log(`[TIDAL Search] Searching for: "${searchQuery}"`);
    let trackId = await performSearch(track, searchQuery, authData, countryCode);

    if (trackId) {
      console.log(`[TIDAL Search] Found match (full query): ${trackId}`);
      return {
        matched: 1,
        unmatched: 0,
        total: 1,
        tracks: [{ ...track, targetId: trackId, status: "matched" }],
      };
    }

    // If no match found, try with just the track name
    const nameOnlyQuery = track.name;
    console.log(`[TIDAL Search] Retrying search with name only: "${nameOnlyQuery}"`);
    trackId = await performSearch(track, nameOnlyQuery, authData, countryCode);

    if (trackId) {
      console.log(`[TIDAL Search] Found match (name only): ${trackId}`);
      return {
        matched: 1,
        unmatched: 0,
        total: 1,
        tracks: [{ ...track, targetId: trackId, status: "matched" }],
      };
    }

    console.log(`[TIDAL Search] No match found for: "${track.name} - ${track.artist}"`);
    return {
      matched: 0,
      unmatched: 1,
      total: 1,
      tracks: [{ ...track, status: "unmatched" }],
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TIDAL] Error searching track:", error.message, error);
    } else {
      console.error("[TIDAL] Unknown error in search track:", error);
    }
    return {
      matched: 0,
      unmatched: 1,
      total: 1,
      tracks: [{ ...track, status: "unmatched" }],
    };
  }
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: Array<ITrack>,
  description?: string,
  privacy: "PUBLIC" | "PRIVATE" = "PRIVATE"
): Promise<TransferResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with Tidal for target operations");

    // TODO: Get countryCode dynamically
    const countryCode = DEFAULT_COUNTRY_CODE;

    console.log("[TIDAL] createPlaylistWithTracks - starting:", {
      name,
      trackCount: tracks.length,
      privacy,
    });

    let playlistId: string | null = null;
    let createdPlaylistResource: PlaylistResource | null = null;

    // 1. Create the playlist
    const createUrl = `${BASE_URL}/playlists?countryCode=${countryCode}`;
    const createPayload = {
      data: {
        type: "playlists",
        attributes: {
          name: name,
          description: description || `Imported on ${new Date().toLocaleDateString()}`,
          privacy: privacy,
        },
      },
    };

    console.log("[TIDAL] Creating playlist with payload:", JSON.stringify(createPayload));
    const createResponse = await retryWithExponentialBackoff<JsonApiResponse<PlaylistResource>>(
      () =>
        fetchWithAuth(createUrl, authData, {
          method: "POST",
          body: JSON.stringify(createPayload),
        })
    );

    createdPlaylistResource = createResponse.data;
    playlistId = createdPlaylistResource?.id;

    if (!playlistId) {
      console.error("[TIDAL] No playlist ID in creation response:", createResponse);
      throw new Error("Failed to create playlist - no ID returned");
    }

    console.log("[TIDAL] Playlist created:", {
      playlistId,
      name: createdPlaylistResource.attributes.name,
    });

    // 2. Add tracks to the created playlist
    const tracksWithIds = tracks.filter(
      (track): track is ITrack & { targetId: string } => !!track.targetId
    );

    if (tracksWithIds.length === 0) {
      console.log("[TIDAL] No tracks with target IDs to add.");
      return {
        added: 0,
        failed: tracks.length,
        total: tracks.length,
        playlistId: playlistId, // Return the ID even if no tracks were added
      };
    }

    console.log(`[TIDAL] Adding ${tracksWithIds.length} tracks to playlist ${playlistId}`);

    // OAS Spec for PlaylistItemsRelationshipAddOperation_Payload says max 20 items
    const BATCH_SIZE = 20;

    const result = await processInBatches(
      async (batch: Array<ITrack & { targetId: string }>) => {
        const addTracksUrl = `${BASE_URL}/playlists/${playlistId}/relationships/items?countryCode=${countryCode}`;
        const batchPayload = {
          data: batch.map(track => ({
            id: track.targetId,
            type: "tracks", // Assuming only tracks, add logic for videos if needed
          })),
          // meta: { positionBefore: 'tail' } // Add at the end, might be default? Check API behavior.
        };

        await retryWithExponentialBackoff(() =>
          fetchWithAuth(addTracksUrl, authData, {
            method: "POST",
            body: JSON.stringify(batchPayload),
          })
        );
        // POST to relationship usually returns 204 No Content on success
      },
      {
        items: tracksWithIds,
        batchSize: BATCH_SIZE,
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(
            `[TIDAL] Adding tracks batch ${batchNumber}/${totalBatches} to playlist ${playlistId}`
          );
        },
        onError: (error: unknown, batch) => {
          if (error instanceof Error) {
            console.error(`[TIDAL] Error adding tracks batch to playlist ${playlistId}:`, {
              errorMessage: error.message,
              batchSize: batch.length,
            });
          } else {
            console.error(`[TIDAL] Unknown error adding tracks batch to playlist ${playlistId}:`, {
              error,
              batchSize: batch.length,
            });
          }
        },
      }
    );

    console.log(`[TIDAL] Finished adding tracks to playlist ${playlistId}. Results:`, result);

    return {
      ...result,
      playlistId, // Ensure playlistId is always included
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TIDAL] Error in createPlaylistWithTracks:", error.message, error);
    } else {
      console.error("[TIDAL] Unknown error in createPlaylistWithTracks:", error);
    }
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId: null,
    };
  }
}

export async function addTracksToLibrary(tracks: Array<ITrack>): Promise<TransferResult> {
  try {
    const authData = await getTidalAuthData("target");
    if (!authData) throw new Error("Not authenticated with Tidal for target operations");

    // TODO: Get countryCode dynamically
    const countryCode = DEFAULT_COUNTRY_CODE;

    console.log("[TIDAL] addTracksToLibrary - starting:", { trackCount: tracks.length });

    // Filter tracks with valid targetIds
    const tracksWithIds = tracks.filter(
      (track): track is ITrack & { targetId: string } => !!track.targetId
    );

    if (tracksWithIds.length === 0) {
      console.log("[TIDAL] No tracks with target IDs to add to library.");
      return {
        added: 0,
        failed: tracks.length,
        total: tracks.length,
        playlistId: null, // No playlist involved
      };
    }

    console.log(`[TIDAL] Adding ${tracksWithIds.length} tracks to user collection (favorites)`);

    // Use the endpoint for adding tracks to the user's collection
    // POST /userCollections/me/relationships/tracks
    // OAS doesn't specify a batch limit here like for playlists, 50 seems okay based on old code.
    const BATCH_SIZE = 50;

    const result = await processInBatches(
      async (batch: Array<ITrack & { targetId: string }>) => {
        const addUrl = `${BASE_URL}/userCollections/me/relationships/tracks?countryCode=${countryCode}`;
        const batchPayload = {
          data: batch.map(track => ({
            id: track.targetId,
            type: "tracks",
          })),
        };

        await retryWithExponentialBackoff(() =>
          fetchWithAuth(addUrl, authData, {
            method: "POST",
            body: JSON.stringify(batchPayload),
          })
        );
        // POST to relationship usually returns 204 No Content on success
      },
      {
        items: tracksWithIds,
        batchSize: BATCH_SIZE,
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`[TIDAL] Adding tracks batch ${batchNumber}/${totalBatches} to library`);
        },
        onError: (error: unknown, batch) => {
          if (error instanceof Error) {
            console.error(`[TIDAL] Error adding tracks batch to library:`, {
              errorMessage: error.message,
              batchSize: batch.length,
            });
          } else {
            console.error(`[TIDAL] Unknown error adding tracks batch to library:`, {
              error,
              batchSize: batch.length,
            });
          }
        },
      }
    );

    console.log(`[TIDAL] Finished adding tracks to library. Results:`, result);

    return {
      ...result,
      playlistId: null, // No playlist involved
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("[TIDAL] Error in addTracksToLibrary:", error.message, error);
    } else {
      console.error("[TIDAL] Unknown error in addTracksToLibrary:", error);
    }
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId: null,
    };
  }
}
