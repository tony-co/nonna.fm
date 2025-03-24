import { getSpotifyAuthData } from "./auth";
import type { ITrack, ILibraryData, IAlbum, IPlaylist } from "@/types/library";
import type { SearchResult, TransferResult } from "@/types/services";
import type { AuthData } from "@/lib/auth/constants";
import { retryWithExponentialBackoff } from "@/lib/utils/retry";
import {
  SpotifyTrackItem,
  SpotifyTrack,
  SpotifyAlbum,
  SpotifyPlaylist,
  transformSpotifyTrackToTrack,
  transformSpotifyAlbumToAlbum,
  transformSpotifyPlaylistToPlaylist,
} from "./types";
import {
  calculateTrackMatchScore,
  calculateAlbumMatchScore,
  DEFAULT_TRACK_CONFIG,
  DEFAULT_ALBUM_CONFIG,
  type MatchScoreDetails,
} from "@/lib/utils/matching";
import { processInBatches } from "@/lib/utils/batch-processor";

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
  const data = await retryWithExponentialBackoff<SpotifySearchResponse>(() =>
    fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=3`, {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    })
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
        name: spotifyTrack.name,
        artist: spotifyTrack.artists[0].name,
        album: spotifyTrack.album.name,
      },
      DEFAULT_TRACK_CONFIG
    )),
  }));

  const matches = await Promise.all(matchPromises);
  matches.sort((a, b) => b.score - a.score);

  // Log match details for debugging
  console.log(
    `[MATCHING] Results for "${track.name}" by ${track.artist}:`,
    matches.slice(0, 3).map(match => ({
      score: match.score,
      details: match.details,
      name: match.track.name,
      artist: match.track.artists[0].name,
      album: match.track.album.name,
    }))
  );

  // Return the ID if we have a good match (score >= minimum threshold)
  return matches[0].score >= DEFAULT_TRACK_CONFIG.thresholds.minimum ? matches[0].track.id : null;
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Fetch playlists with batching and retry
  const initialPlaylistResponse = await retryWithExponentialBackoff<{ total: number }>(() =>
    fetch("https://api.spotify.com/v1/me/playlists?limit=1", {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    })
  );

  console.log("[SPOTIFY] Initial playlist response:", initialPlaylistResponse);

  if (!initialPlaylistResponse.total) {
    throw new Error("Failed to fetch playlists count");
  }

  const totalPlaylists = initialPlaylistResponse.total;
  const playlistBatchSize = 50;
  const playlistBatchCount = Math.ceil(totalPlaylists / playlistBatchSize);

  console.log("[SPOTIFY] Playlist fetch details:", {
    totalPlaylists,
    playlistBatchSize,
    playlistBatchCount,
  });

  const playlistResults: IPlaylist[] = [];
  await processInBatches(
    async batch => {
      const offset = batch[0] * playlistBatchSize;
      console.log(
        `[SPOTIFY] Fetching playlists batch ${batch[0] + 1}/${playlistBatchCount} (offset: ${offset})`
      );

      const data = await retryWithExponentialBackoff<{ items: SpotifyPlaylist[] }>(() =>
        fetch(
          `https://api.spotify.com/v1/me/playlists?limit=${playlistBatchSize}&offset=${offset}&fields=items(id,name,tracks(total),owner(id,display_name),images)`,
          { headers: { Authorization: `Bearer ${authData.accessToken}` } }
        )
      );

      console.log(`[SPOTIFY] Playlists batch ${batch[0] + 1}/${playlistBatchCount}:`, {
        offset,
        count: data.items.length,
        total: data.items.length,
      });

      playlistResults.push(
        ...data.items.map((playlist: SpotifyPlaylist) =>
          transformSpotifyPlaylistToPlaylist(playlist)
        )
      );
    },
    {
      items: Array.from({ length: playlistBatchCount }, (_, i) => i),
      batchSize: playlistBatchSize,
      onBatchStart: (batchNumber, totalBatches) => {
        console.log(`[SPOTIFY] Starting batch ${batchNumber}/${totalBatches}`);
      },
      onError: (error, batch) => {
        console.error("[SPOTIFY] Error fetching playlist batch:", {
          error: error.message,
          batchNumber: batch[0],
          totalBatches: playlistBatchCount,
        });
      },
    }
  );

  console.log("[SPOTIFY] Final playlist count:", playlistResults.length);

  const playlists = playlistResults;

  // Fetch saved tracks (liked songs) with batching and retry

  const initialResponse = await retryWithExponentialBackoff<{ total: number }>(() =>
    fetch("https://api.spotify.com/v1/me/tracks?limit=1&fields=total", {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    })
  );

  if (!initialResponse.total) {
    throw new Error("Failed to fetch saved tracks count");
  }

  const { total: totalTracks } = initialResponse;
  const batchSize = 50;
  const batchCount = Math.ceil(totalTracks / batchSize);

  console.log("[SPOTIFY] Liked songs fetch details:", {
    totalTracks,
    batchSize,
    batchCount,
  });

  const trackResults: ITrack[] = [];
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * batchSize;
        console.log(
          `[SPOTIFY] Fetching liked songs batch ${index + 1}/${batchCount} (offset: ${offset})`
        );

        const data = await retryWithExponentialBackoff<{ items: SpotifyTrackItem[] }>(() =>
          fetch(
            `https://api.spotify.com/v1/me/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`,
            { headers: { Authorization: `Bearer ${authData.accessToken}` } }
          )
        );

        console.log(`[SPOTIFY] Liked songs batch ${index + 1}/${batchCount}:`, {
          offset,
          count: data.items.length,
        });

        return data.items.map((item: SpotifyTrackItem) => transformSpotifyTrackToTrack(item.track));
      });

      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      trackResults.push(...batchResults.flat());
    },
    {
      items: Array.from({ length: batchCount }, (_, i) => i),
      batchSize: 3, // Process 5 API requests in parallel at a time
      onBatchStart: (batchNumber, totalBatches) => {
        console.log(`[SPOTIFY] Starting liked songs batch group ${batchNumber}/${totalBatches}`);
      },
      onError: (error, batch) => {
        console.error("[SPOTIFY] Error fetching liked songs batch:", {
          error: error.message,
          batchNumbers: batch,
          totalBatches: batchCount,
        });
      },
    }
  );

  console.log("[SPOTIFY] Final liked songs count:", trackResults.length);

  const likedSongs = trackResults;

  // Fetch saved albums with batching and retry
  const initialAlbumsResponse = await retryWithExponentialBackoff<{ total: number }>(() =>
    fetch("https://api.spotify.com/v1/me/albums?limit=1", {
      headers: { Authorization: `Bearer ${authData.accessToken}` },
    })
  );

  if (!initialAlbumsResponse.total) {
    throw new Error("Failed to fetch saved albums count");
  }

  const { total: totalAlbums } = initialAlbumsResponse;
  const albumBatchSize = 50; // Spotify's recommended batch size for albums
  const albumBatchCount = Math.ceil(totalAlbums / albumBatchSize);

  console.log("[SPOTIFY] Album fetch details:", {
    totalAlbums,
    albumBatchSize,
    albumBatchCount,
  });

  const albumResults: IAlbum[] = [];
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * albumBatchSize;
        console.log(
          `[SPOTIFY] Fetching albums batch ${index + 1}/${albumBatchCount} (offset: ${offset})`
        );

        const data = await retryWithExponentialBackoff<{ items: { album: SpotifyAlbum }[] }>(() =>
          fetch(
            `https://api.spotify.com/v1/me/albums?limit=${albumBatchSize}&offset=${offset}&fields=items(album(id,name,artists(name),images))`,
            { headers: { Authorization: `Bearer ${authData.accessToken}` } }
          )
        );

        console.log(`[SPOTIFY] Albums batch ${index + 1}/${albumBatchCount}:`, {
          offset,
          count: data.items.length,
        });

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
      onBatchStart: (batchNumber, totalBatches) => {
        console.log(`[SPOTIFY] Starting albums batch group ${batchNumber}/${totalBatches}`);
      },
      onError: (error, batch) => {
        console.error("[SPOTIFY] Error fetching albums batch:", {
          error: error.message,
          batchNumbers: batch,
          totalBatches: albumBatchCount,
        });
      },
    }
  );

  console.log("[SPOTIFY] Final albums count:", albumResults.length);

  return {
    playlists,
    likedSongs,
    albums: albumResults,
  };
}

export async function fetchPlaylistTracks(playlistId: string): Promise<ITrack[]> {
  const authData = await getSpotifyAuthData("source");
  if (!authData) throw new Error("Not authenticated with Spotify");

  // Fetch initial playlist info with retry
  const initialResponse = await retryWithExponentialBackoff<{ total: number }>(() =>
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=1&fields=total`, {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    })
  );

  if (!initialResponse.total) {
    throw new Error("Failed to fetch playlist tracks count");
  }

  const { total } = initialResponse;
  const batchSize = 50;
  const batchCount = Math.ceil(total / batchSize);

  console.log("[SPOTIFY] Playlist tracks fetch details:", {
    total,
    batchSize,
    batchCount,
  });

  const trackResults: ITrack[] = [];
  await processInBatches(
    async batch => {
      // Process multiple offsets in parallel within each batch
      const batchPromises = batch.map(async index => {
        const offset = index * batchSize;
        console.log(
          `[SPOTIFY] Fetching playlist tracks batch ${index + 1}/${batchCount} (offset: ${offset})`
        );

        const data = await retryWithExponentialBackoff<{ items: SpotifyTrackItem[] }>(() =>
          fetch(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
              },
            }
          )
        );

        console.log(`[SPOTIFY] Playlist tracks batch ${index + 1}/${batchCount}:`, {
          offset,
          count: data.items.length,
        });

        return data.items.map((item: SpotifyTrackItem) => transformSpotifyTrackToTrack(item.track));
      });

      // Wait for all requests in this batch to complete
      const batchResults = await Promise.all(batchPromises);
      trackResults.push(...batchResults.flat());
    },
    {
      items: Array.from({ length: batchCount }, (_, i) => i),
      batchSize: 3, // Process 3 API requests in parallel at a time
      onBatchStart: (batchNumber, totalBatches) => {
        console.log(
          `[SPOTIFY] Starting playlist tracks batch group ${batchNumber}/${totalBatches}`
        );
      },
      onError: (error, batch) => {
        console.error("[SPOTIFY] Error fetching playlist tracks batch:", {
          error: error.message,
          batchNumbers: batch,
          totalBatches: batchCount,
        });
      },
    }
  );

  console.log("[SPOTIFY] Final playlist tracks count:", trackResults.length);

  return trackResults;
}

async function findBestMatch(track: ITrack, authData: AuthData): Promise<string | null> {
  try {
    // First attempt with full search query
    const searchQuery = encodeURIComponent(`${track.name} ${track.artist}`);
    let bestMatch = await performSearch(track, searchQuery, authData);

    if (track.name.startsWith("DMX")) {
      console.log(`[MATCHING] Best match: ${bestMatch}`);
    }

    // If no good match found and track is from YouTube, retry with just the track name
    if (bestMatch === null && track.videoId) {
      console.log(
        `[MATCHING] Retrying search for YouTube track "${track.name}" without artist name`
      );
      const retrySearchQuery = encodeURIComponent(track.name);
      bestMatch = await performSearch(track, retrySearchQuery, authData);
    }

    return bestMatch;
  } catch (error) {
    console.error("[MATCHING] Error finding best match:", error);
    return null;
  }
}

export async function search(tracks: Array<ITrack>, batchSize: number = 10): Promise<SearchResult> {
  const authData = await getSpotifyAuthData("target");
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

  // Process tracks in batches
  await processInBatches(
    async batch => {
      const trackResults = await Promise.all(
        batch.map(async track => {
          const targetId = await findBestMatch(track, authData);
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
      batchSize,
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
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: Array<ITrack & { targetId: string }>,
  description?: string
): Promise<TransferResult> {
  try {
    console.log("createPlaylistWithTracks - starting:", { name, trackCount: tracks.length });
    const authData = await getSpotifyAuthData("target");
    if (!authData) throw new Error("Not authenticated with Spotify");

    // Create the playlist
    const createResponse = await fetch("https://api.spotify.com/v1/me/playlists", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: description || `Imported on ${new Date().toLocaleDateString()}`,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error("Failed to create playlist:", {
        status: createResponse.status,
        statusText: createResponse.statusText,
        error: errorText,
      });
      throw new Error(
        `Failed to create playlist: ${createResponse.status} ${createResponse.statusText} - ${errorText}`
      );
    }

    const playlistData = await createResponse.json();
    const playlistId = playlistData.id;

    if (!playlistId) {
      console.error("No playlist ID in response:", playlistData);
      throw new Error("Failed to create playlist - no ID returned");
    }

    console.log("createPlaylistWithTracks - playlist created:", { playlistId });

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
        const uris = batch.map(track => `spotify:track:${track.targetId}`);
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uris }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to add tracks to playlist: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      },
      {
        items: tracksWithIds,
        batchSize: 100,
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`Processing batch ${batchNumber}/${totalBatches}`);
        },
        onError: (error, batch) => {
          console.error("Error adding tracks to playlist:", {
            error: error.message,
            batchSize: batch.length,
          });
        },
      }
    );

    return {
      ...result,
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

    const result = await processInBatches(
      async batch => {
        const ids = batch.map(track => track.targetId);
        const response = await fetch("https://api.spotify.com/v1/me/tracks", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to add tracks: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      },
      {
        items: tracksWithIds,
        batchSize: 50,
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`Processing batch ${batchNumber}/${totalBatches}`);
        },
        onError: (error, batch) => {
          console.error("Error adding tracks to library:", {
            error: error.message,
            batchSize: batch.length,
          });
        },
      }
    );

    return {
      ...result,
      playlistId: null,
    };
  } catch (error) {
    console.error("Error in addTracksToLibrary:", error);
    throw error;
  }
}

export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  try {
    console.log("addAlbumsToLibrary - starting:", {
      albumCount: Array.isArray(albums) ? albums.length : albums.size,
    });
    const authData = await getSpotifyAuthData("target");
    if (!authData) throw new Error("Not authenticated with Spotify");

    // Convert Set/Array to Array and filter albums with valid targetIds
    const albumsWithIds = (Array.isArray(albums) ? albums : Array.from(albums)).filter(
      (album): album is IAlbum & { targetId: string } => !!album.targetId
    );

    if (albumsWithIds.length === 0) {
      console.warn("No albums with valid targetIds found");
      return {
        added: 0,
        failed: Array.isArray(albums) ? albums.length : albums.size,
        total: Array.isArray(albums) ? albums.length : albums.size,
        playlistId: null,
      };
    }

    console.log(
      "Adding albums to library:",
      albumsWithIds.map(album => ({
        name: album.name,
        artist: album.artist,
        targetId: album.targetId,
      }))
    );

    const result = await processInBatches(
      async batch => {
        const ids = batch.map(album => album.targetId);
        console.log(`Processing batch:`, { albumIds: ids });

        const response = await fetch("https://api.spotify.com/v1/me/albums", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids }),
        });

        const responseText = await response.text();
        console.log("Spotify API response:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        });

        if (!response.ok) {
          throw new Error(`Failed to add albums: ${response.status} ${response.statusText}`);
        }
      },
      {
        items: albumsWithIds,
        batchSize: 20,
        onBatchStart: (batchNumber, totalBatches) => {
          console.log(`Processing batch ${batchNumber}/${totalBatches}`);
        },
        onError: (error, batch) => {
          console.error("Error adding albums to library:", {
            error: error.message,
            batchSize: batch.length,
            albums: batch.map(album => ({
              name: album.name,
              artist: album.artist,
              targetId: album.targetId,
            })),
          });
        },
      }
    );

    console.log("Album import completed:", {
      ...result,
      total: Array.isArray(albums) ? albums.length : albums.size,
    });

    return {
      ...result,
      playlistId: null,
    };
  } catch (error) {
    console.error("Error in addAlbumsToLibrary:", error);
    throw error;
  }
}

async function findBestAlbumMatch(album: IAlbum, authData: AuthData): Promise<string | null> {
  try {
    // Clean and encode the search query
    const searchQuery = encodeURIComponent(`${album.name} ${album.artist}`);

    // Search for albums with retry
    const response = await retryWithExponentialBackoff<Response>(() =>
      fetch(`https://api.spotify.com/v1/search?q=${searchQuery}&type=album&limit=10`, {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      })
    );

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.albums?.items?.length) {
      return null;
    }

    // Find the best match using our shared matching system
    const matches = data.albums.items
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

    // Log match details for debugging
    console.log(
      `[MATCHING] Results for album "${album.name}" by ${album.artist}:`,
      matches
        .slice(0, 3)
        .map((match: { score: number; details: MatchScoreDetails; album: SpotifyAlbum }) => ({
          score: match.score,
          details: match.details,
          name: match.album.name,
          artist: match.album.artists[0].name,
        }))
    );

    // Return the ID if we have a good match (score >= minimum threshold)
    return matches[0].score >= DEFAULT_ALBUM_CONFIG.thresholds.minimum ? matches[0].album.id : null;
  } catch (error) {
    console.error("[MATCHING] Error finding best album match:", error);
    return null;
  }
}

export async function searchAlbums(albums: Array<IAlbum>): Promise<SearchResult> {
  try {
    const authData = await getSpotifyAuthData("target");
    if (!authData) throw new Error("Not authenticated with Spotify");

    const results: Array<IAlbum> = [];
    let matched = 0;
    let unmatched = 0;

    // Process albums in batches
    await processInBatches(
      async batch => {
        const albumResults = await Promise.all(
          batch.map(async album => {
            const spotifyId = await findBestAlbumMatch(album, authData);
            return {
              ...album,
              targetId: spotifyId || undefined,
              status: spotifyId ? ("matched" as const) : ("unmatched" as const),
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
