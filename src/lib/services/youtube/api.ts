import { getYouTubeAuthData } from "./auth";
import { YTMusicAdapter } from "./ytmusic-adapter";
import type { ITrack, ILibraryData, IAlbum } from "@/types/library";
import type { SearchResult, TransferResult } from "@/types/services";

interface YouTubePlaylistItem {
  id?: string;
  snippet: {
    title: string;
    description?: string;
    channelTitle?: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    resourceId?: {
      videoId: string;
    };
    videoOwnerChannelTitle?: string;
  };
  contentDetails?: {
    itemCount: number;
  };
  status?: {
    privacyStatus: "private" | "public" | "unlisted";
    uploadStatus: "deleted" | "failed" | "processed" | "rejected" | "uploaded";
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  pageInfo: {
    totalResults: number;
  };
  nextPageToken?: string;
}

interface YouTubeSearchMatch {
  score: number;
  nameScore: number;
  artistScore: number;
  item: YouTubePlaylistItem;
}

interface YouTubeSearchResponse {
  matches: YouTubeSearchMatch[];
}

interface YouTubePlaylistCreateResponse {
  id: string;
  snippet: {
    title: string;
  };
}

interface YouTubePlaylistItemInsertResponse {
  id: string;
  snippet: {
    resourceId: {
      videoId: string;
    };
  };
}

interface YouTubePlaylistItemsResponse {
  items: Array<{
    snippet: {
      resourceId: {
        videoId: string;
      };
      title: string;
      channelTitle: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
    status?: {
      privacyStatus: "private" | "public" | "unlisted";
      uploadStatus: "deleted" | "failed" | "processed" | "rejected" | "uploaded";
    };
  }>;
  nextPageToken?: string;
}

/**
 * Find the best matching album from YouTube search results
 */
async function findBestAlbumMatch(album: Pick<ITrack, "name" | "artist">): Promise<string | null> {
  try {
    const authData = await getYouTubeAuthData("target");
    if (!authData) {
      return null;
    }

    const response = await fetch("/api/youtube/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `${album.name} ${album.artist}`,
        token: authData.accessToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Search request failed");
    }

    const data = (await response.json()) as YouTubeSearchResponse;
    if (!data.matches?.length) {
      return null;
    }

    // Sort matches by score
    const matches = data.matches.sort((a, b) => b.score - a.score);

    // Map matches to a more readable format for logging
    console.log(
      "Matches:",
      matches.map(match => ({
        score: match.score,
        nameScore: match.nameScore,
        artistScore: match.artistScore,
        title: cleanYouTubeTitle(match.item.snippet.title),
        channel: cleanYouTubeTitle(match.item.snippet.channelTitle || ""),
      }))
    );

    // Return the ID if we have a good match (score >= 0.7)
    const bestMatch = matches[0];
    if (bestMatch.score >= 0.7) {
      return bestMatch.item.snippet.resourceId?.videoId || bestMatch.item.id || null;
    }
    return null;
  } catch (error) {
    console.error("[MATCHING] Error finding best album match:", error);
    return null;
  }
}

/**
 * Find matching YouTube videos for a batch of albums
 */
export async function findMatchingAlbums(
  albums: IAlbum[]
): Promise<Array<IAlbum & { targetId?: string }>> {
  try {
    const authData = await getYouTubeAuthData("target");
    if (!authData) {
      throw new Error("Not authenticated with YouTube");
    }

    const batchResults = await Promise.all(
      albums.map(async album => {
        const youtubeId = await findBestAlbumMatch(album);
        return {
          ...album,
          targetId: youtubeId || undefined,
        };
      })
    );

    return batchResults;
  } catch (error) {
    console.error("[MATCHING] Error finding matching albums:", error);
    return albums.map(album => ({ ...album }));
  }
}

/**
 * Search for tracks in YouTube Music
 */
export async function search(tracks: ITrack[]): Promise<SearchResult> {
  try {
    const ytAdapter = new YTMusicAdapter();
    await ytAdapter.initialize("target");

    const matchedTracks = await ytAdapter.findMatchingTracks(tracks);
    const validTracks = matchedTracks.filter(track => track.targetId);

    return {
      matched: validTracks.length,
      unmatched: tracks.length - validTracks.length,
      total: tracks.length,
      tracks: matchedTracks,
    };
  } catch (error) {
    console.error("[SEARCH] Error searching tracks:", error);
    return {
      matched: 0,
      unmatched: tracks.length,
      total: tracks.length,
      tracks: tracks.map(track => ({ ...track })),
    };
  }
}

/**
 * Create a playlist with the given tracks
 */
export async function createPlaylistWithTracks(
  name: string,
  tracks: ITrack[],
  description?: string
): Promise<TransferResult> {
  try {
    const authData = await getYouTubeAuthData("target");
    if (!authData) throw new Error("Not authenticated with YouTube");

    const validTracks = tracks.filter(track => track.targetId);
    if (validTracks.length === 0) {
      return {
        added: 0,
        failed: tracks.length,
        total: tracks.length,
        playlistId: null,
      };
    }

    // Create the playlist
    const createPlaylist = async (): Promise<string> => {
      const response = await fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: name,
            description: description || "",
            privacyStatus: "private",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create playlist: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as YouTubePlaylistCreateResponse;
      return data.id;
    };

    // Create playlist with retry
    const playlistId = await retryWithExponentialBackoff(createPlaylist);

    // Add tracks to the playlist
    const addTrackToPlaylist = async (track: ITrack & { targetId?: string }): Promise<void> => {
      if (!track.targetId) return;

      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            snippet: {
              playlistId,
              resourceId: {
                kind: "youtube#video",
                videoId: track.targetId,
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add track to playlist: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as YouTubePlaylistItemInsertResponse;
      if (!data.id) {
        throw new Error("Failed to add track to playlist: No item ID returned");
      }
    };

    // Add tracks with retry
    let added = 0;
    let failed = 0;

    for (const track of validTracks) {
      try {
        await retryWithExponentialBackoff(() => addTrackToPlaylist(track));
        added++;
      } catch (error) {
        console.error(`Failed to add track ${track.name}:`, error);
        failed++;
      }
    }

    return {
      added,
      failed,
      total: tracks.length,
      playlistId,
    };
  } catch (error) {
    console.error("[PLAYLIST] Error creating playlist:", error);
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId: null,
    };
  }
}

/**
 * Get playlist details
 */
export async function fetchPlaylistTracks(playlistId: string): Promise<ITrack[]> {
  try {
    const authData = await getYouTubeAuthData("source");
    if (!authData) throw new Error("Not authenticated with YouTube");

    const tracks: ITrack[] = [];
    let nextPageToken: string | undefined;

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.append("part", "snippet,status");
      url.searchParams.append("playlistId", playlistId);
      url.searchParams.append("maxResults", "50");
      if (nextPageToken) {
        url.searchParams.append("pageToken", nextPageToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlist items");
      }

      const data = (await response.json()) as YouTubePlaylistItemsResponse;

      tracks.push(
        ...(data.items || [])
          .filter(item => {
            // Only include tracks that have required data and are public
            if (!item.snippet?.resourceId?.videoId || !item.snippet.title) {
              return false;
            }
            return item.status?.privacyStatus === "public";
          })
          .map(item => {
            const metadata = extractTrackMetadata(item);
            return {
              id: item.snippet.resourceId.videoId,
              name: metadata.title,
              artist: metadata.artist,
              album: "YouTube Music",
              videoId: item.snippet.resourceId.videoId,
              artwork:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.medium?.url ||
                item.snippet.thumbnails?.default?.url,
            };
          })
      );

      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return tracks;
  } catch (error) {
    console.error("[PLAYLIST] Error getting playlist:", error);
    return [];
  }
}

/**
 * Get user's library
 */
export async function fetchUserLibrary(): Promise<ILibraryData> {
  const authData = await getYouTubeAuthData("source");
  if (!authData) throw new Error("Not authenticated with YouTube");

  // Fetch playlists
  const playlists = [];
  let nextPageToken: string | undefined;

  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlists");
    url.searchParams.append("part", "snippet,contentDetails");
    url.searchParams.append("mine", "true");
    url.searchParams.append("maxResults", "50");
    if (nextPageToken) {
      url.searchParams.append("pageToken", nextPageToken);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }

    const data: YouTubePlaylistResponse = await response.json();

    playlists.push(
      ...data.items.map(playlist => ({
        id: playlist.id || `youtube-${Date.now()}-${Math.random()}`,
        name: playlist.snippet.title,
        trackCount: playlist.contentDetails?.itemCount || 0,
        ownerId: authData.userId,
        ownerName: authData.displayName,
        tracks: [],
        artwork:
          playlist.snippet.thumbnails?.high?.url ||
          playlist.snippet.thumbnails?.medium?.url ||
          playlist.snippet.thumbnails?.default?.url,
      }))
    );

    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  // Fetch liked songs using the consolidated getPlaylist function
  const likedSongs = await fetchPlaylistTracks("LM");

  // For now, return empty albums array as YouTube Music's album structure
  // is different and will need special handling
  const albums: Array<{ id: string; name: string; artist: string; artwork?: string }> = [];

  return {
    playlists,
    likedSongs,
    albums,
  };
}

/**
 * Clean up YouTube title by removing common suffixes and prefixes
 */
function cleanYouTubeTitle(title: string): string {
  // First remove any duration timestamp at the end (e.g., "4:46", "3:33")
  title = title.replace(/\s+\d{1,2}:\d{2}\s*$/, "");

  // Remove channel/uploader attribution at the end
  title = title.replace(/\s+by\s+[^()\[\]]+$/, "");

  return (
    title
      // Remove all content in square brackets
      .replace(/\s*\[[^\]]*\]/g, "")

      // Remove official video/audio indicators
      .replace(/\s*\(Official.*?\)/gi, "")

      // Remove live performance indicators
      .replace(/\s*\(Live.*?\)/gi, "")
      .replace(/\s*\(.*?Live Session.*?\)/gi, "")

      // Remove lyric video indicators
      .replace(/\s*\(Lyric.*?\)/gi, "")
      .replace(/\s*\(.*?lyrics.*?\)/gi, "")

      // Remove audio indicators
      .replace(/\s*\(Audio.*?\)/gi, "")
      .replace(/\s*\(Acoustic.*?\)/gi, "")

      // Remove music video indicators
      .replace(/\s*\(Music Video.*?\)/gi, "")
      .replace(/\s*\(Video.*?\)/gi, "")

      // Remove mix/version/edit indicators
      .replace(/\s*\(.*?Mix.*?\)/gi, "")
      .replace(/\s*\(.*?Version.*?\)/gi, "")
      .replace(/\s*\(.*?Edit.*?\)/gi, "")

      // Remove cover song indicators
      .replace(/\s*\(.*?Cover.*?\)/gi, "")

      // Remove featuring artist indicators
      .replace(/\s*\(feat\..*?\)/gi, "")
      .replace(/\s*\(ft\..*?\)/gi, "")
      .replace(/\s+ft\..*$/gi, "") // Handle "ft." at the end without parentheses
      .replace(/\s+ft\s+.*$/gi, "") // Handle "ft" without dot at the end
      .replace(/\s+feat\..*$/gi, "") // Handle "feat." at the end without parentheses
      .replace(/\s+feat\s+.*$/gi, "") // Handle "feat" without dot at the end

      // Remove album indicators (usually at the end after artist)
      .replace(/\s+(?:From|on)\s+.*?(?:Album|EP).*?$/i, "")

      // Remove bonus track indicators
      .replace(/\s*\(Bonus Track\)/gi, "")

      // Remove instrumental indicators
      .replace(/\s*\(Instrumental\)/gi, "")

      // Remove uncensored indicators (with optional parentheses)
      .replace(/\s*(?:\()?Uncensored(?:\))?/gi, "")

      // Remove location indicators
      .replace(/\s*\(.*?at .*?\)/gi, "")

      // Remove quality/resolution tags
      .replace(/\s*\(?(?:HD|4K|1080p|720p|Full HD|Ultra HD|UHD|HQ)\)?/gi, "")
      .replace(/\s*\((?:High Quality|High Definition)\)/gi, "")
      .replace(/\s*\[(?:HD|4K|1080p|720p|Full HD|Ultra HD|UHD|HQ)\]/gi, "")

      // Remove any remaining parentheses with short content (likely metadata)
      .replace(/\s*\([^)]{1,20}\)/g, "")

      // Clean up apostrophes and quotes
      .replace(/[''′`]/g, "") // Remove single quotes and similar characters
      .replace(/[""]/g, "") // Remove double quotes

      // Clean up any leftover artifacts
      .replace(/\s*-\s*$/, "") // Remove trailing dash
      .replace(/^\s*-\s*/, "") // Remove leading dash
      .replace(/\s+/g, " ") // Normalize spaces
      .trim()
  );
}

/**
 * Clean up YouTube artist name by removing common suffixes and collaborations
 */
function cleanYouTubeArtist(artist: string): string {
  return (
    artist
      // Remove featuring artists with more comprehensive patterns
      .replace(/\s+feat\.?\s+.*/i, "") // "feat" or "feat."
      .replace(/\s+ft\.?\s+.*/i, "") // "ft" or "ft."
      .replace(/\s+featuring\s+.*/i, "") // "featuring"
      .replace(/\s*\(feat\.?\s+[^)]*\)/gi, "") // (feat. ...)
      .replace(/\s*\(ft\.?\s+[^)]*\)/gi, "") // (ft. ...)
      .replace(/\s*\[feat\.?\s+[^]]*\]/gi, "") // [feat. ...]
      .replace(/\s*\[ft\.?\s+[^]]*\]/gi, "") // [ft. ...]

      // Remove "- Topic" suffix common in YouTube Music
      .replace(/\s*-\s*Topic$/i, "")

      // Remove "VEVO" suffix
      .replace(/\s*VEVO$/i, "")

      // Remove common channel indicators
      .replace(/\s*\(Official\)$/i, "")
      .replace(/\s*\(Official Channel\)$/i, "")

      // Clean up any leftover artifacts
      .replace(/\s+/g, " ")
      .trim()
  );
}

interface TrackMetadata {
  title: string;
  artist: string;
}

/**
 * Extract both title and artist information from a YouTube playlist item
 */
function extractTrackMetadata(item: YouTubePlaylistItem): TrackMetadata {
  const { snippet } = item;
  const defaultResult = { title: cleanYouTubeTitle(snippet.title), artist: "Unknown Artist" };

  // Helper function to validate artist name
  const isValidArtistName = (name?: string): boolean => {
    if (!name) return false;
    const invalidTerms = ["youtube", "vevo", "official", "music", "records", "topic"];
    return !invalidTerms.some(term => name.toLowerCase().includes(term));
  };

  // Helper function to extract artist and title from a string
  const extractFromSeparator = (text: string): TrackMetadata | null => {
    // Match the pattern: "Artist feat. Someone - Title" but only with spaced dashes
    const featMatch = text.match(
      /^(.+?)(?:\s+(?:feat\.?|ft\.?|featuring)\s+[^-]+)?(?:\s+-\s+.+)$/i
    );
    if (featMatch) {
      const [, artist] = featMatch;
      // Get the title part after the last spaced dash
      const titlePart = text.split(/\s+-\s+/).pop() || "";
      return {
        artist: cleanYouTubeArtist(artist.trim()),
        title: cleanYouTubeTitle(titlePart.trim()),
      };
    }

    // If no featuring pattern, just split on spaced separators
    const parts = text.split(/\s+[-–—:]\s+/).map(p => p.trim());
    if (parts.length < 2) return null;

    // Validate first part looks like an artist name (not too long, no special patterns)
    const potentialArtist = parts[0];
    if (
      potentialArtist.split(" ").length > 4 ||
      potentialArtist.toLowerCase().includes("provided") ||
      !isValidArtistName(potentialArtist)
    ) {
      return null;
    }

    return {
      artist: cleanYouTubeArtist(potentialArtist),
      title: cleanYouTubeTitle(parts.slice(1).join(" - ")),
    };
  };

  // Try to extract from Topic channel
  if (snippet.videoOwnerChannelTitle?.includes("- Topic")) {
    return {
      artist: cleanYouTubeArtist(snippet.videoOwnerChannelTitle.split("- Topic")[0].trim()),
      title: cleanYouTubeTitle(snippet.title),
    };
  }

  // Try to extract from description metadata
  if (snippet.description?.includes("Provided to YouTube")) {
    const lines = snippet.description.split("\n");
    let foundTitle = "";
    let foundArtist = "";

    for (const line of lines) {
      if (!line.includes("·")) continue;

      const parts = line.split("·").map(p => p.trim());

      // Look for song title
      if (parts[0].toLowerCase().includes("song")) {
        foundTitle = cleanYouTubeTitle(parts[0].replace(/song/i, "").trim());
      }
      // Look for track title
      else if (line.toLowerCase().includes("title") || line.toLowerCase().includes("track")) {
        foundTitle = cleanYouTubeTitle(parts[0].trim());
      }

      // Look for artist
      if (line.toLowerCase().includes("performer") || line.toLowerCase().includes("artist")) {
        foundArtist = cleanYouTubeArtist(parts[parts.length - 1]);
      }
    }

    if (foundTitle || foundArtist) {
      return {
        title: foundTitle || defaultResult.title,
        artist: foundArtist || defaultResult.artist,
      };
    }
  }

  // Try to extract from common title patterns
  const extracted = extractFromSeparator(snippet.title);
  if (extracted) return extracted;

  // Try to extract from channel information
  if (snippet.videoOwnerChannelTitle && isValidArtistName(snippet.videoOwnerChannelTitle)) {
    return {
      title: defaultResult.title,
      artist: cleanYouTubeArtist(snippet.videoOwnerChannelTitle),
    };
  }

  if (snippet.channelTitle && isValidArtistName(snippet.channelTitle)) {
    return {
      title: defaultResult.title,
      artist: cleanYouTubeArtist(snippet.channelTitle),
    };
  }

  // Fallback to default result with cleaned title
  return defaultResult;
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let retries = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        throw error;
      }
      const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Search for albums in YouTube Music
 */
export async function searchAlbums(albums: IAlbum[]): Promise<SearchResult> {
  try {
    const ytAdapter = new YTMusicAdapter();
    await ytAdapter.initialize("target");

    const matchedAlbums = await findMatchingAlbums(albums);
    const validAlbums = matchedAlbums.filter(album => album.targetId);

    return {
      matched: validAlbums.length,
      unmatched: albums.length - validAlbums.length,
      total: albums.length,
      tracks: [], // YouTube doesn't return tracks in album search
    };
  } catch (error) {
    console.error("[SEARCH] Error searching albums:", error);
    return {
      matched: 0,
      unmatched: albums.length,
      total: albums.length,
      tracks: [],
    };
  }
}

/**
 * Add tracks to YouTube Music library
 */
export async function addTracksToLibrary(tracks: ITrack[]): Promise<TransferResult> {
  try {
    const authData = await getYouTubeAuthData("target");
    if (!authData) {
      throw new Error("Not authenticated with YouTube");
    }

    const validTracks = tracks.filter(track => track.targetId);
    if (validTracks.length === 0) {
      return {
        added: 0,
        failed: tracks.length,
        total: tracks.length,
        playlistId: null,
      };
    }

    // Create a playlist for the tracks
    const playlistName = `Imported from Nonna.fm - ${new Date().toLocaleDateString()}`;
    const playlistId = await createPlaylistWithTracks(playlistName, validTracks);

    return {
      added: validTracks.length,
      failed: tracks.length - validTracks.length,
      total: tracks.length,
      playlistId: playlistId.playlistId,
    };
  } catch (error) {
    console.error("[LIBRARY] Error adding tracks to library:", error);
    return {
      added: 0,
      failed: tracks.length,
      total: tracks.length,
      playlistId: null,
    };
  }
}

/**
 * Add albums to YouTube Music library
 */
export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  try {
    const authData = await getYouTubeAuthData("target");
    if (!authData) {
      throw new Error("Not authenticated with YouTube");
    }

    const albumsArray = Array.from(albums);
    const matchedAlbums = await findMatchingAlbums(albumsArray);
    const validAlbums = matchedAlbums.filter(album => album.targetId);

    if (validAlbums.length === 0) {
      return {
        added: 0,
        failed: albums.size,
        total: albums.size,
        playlistId: null,
      };
    }

    // Create a playlist for the albums
    const playlistName = `Imported Albums from Nonna.fm - ${new Date().toLocaleDateString()}`;
    const playlistId = await createPlaylistWithTracks(
      playlistName,
      validAlbums.map(album => ({
        id: album.targetId || "", // Use targetId as the track id
        name: album.name,
        artist: album.artist,
        album: album.name, // Use album name as the album name
        targetId: album.targetId,
      }))
    );

    return {
      added: validAlbums.length,
      failed: albums.size - validAlbums.length,
      total: albums.size,
      playlistId: playlistId.playlistId,
    };
  } catch (error) {
    console.error("[LIBRARY] Error adding albums to library:", error);
    return {
      added: 0,
      failed: albums.size,
      total: albums.size,
      playlistId: null,
    };
  }
}
