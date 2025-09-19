import type { IAlbum, ITrack } from "@/types";
import { MATCHING_STATUS } from "@/types";
import { getYouTubeAuthData } from "./auth";

// Define types for the search result items from ytmusic-api
interface YTMusicSearchItem {
  videoId: string;
  albumId?: string;
  name: string;
  artist?: { artistId: string | null; name: string };
  album?: { name: string; albumId: string };
  thumbnails?: Array<{ url: string; width: number; height: number }>;
  type?: "SONG" | "VIDEO" | "ALBUM";
}

interface YTMusicApiParams {
  query?: string;
  playlistId?: string;
  albumId?: string;
  [key: string]: unknown;
}

interface YTMusicApiResponse<T> {
  data: T;
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
  }>;
}

/**
 * Returns an absolute URL for the YouTube Music API proxy.
 * In Node.js (test) environments, fetch requires an absolute URL.
 * Uses NEXT_PUBLIC_APP_URL or defaults to http://localhost:3000.
 */
function getYouTubeApiUrl(path: string): string {
  // If already absolute, return as is
  if (/^https?:\/\//.test(path)) return path;
  // Use env or fallback

  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // Ensure no double slashes
  return base.replace(/\/$/, "") + (path.startsWith("/") ? path : `/${path}`);
}

/**
 * Adapter that integrates with the YouTube Music API through a server-side proxy
 */
export class YTMusicAdapter {
  private initialized: boolean = false;
  private currentRole: "source" | "target" | null = null;

  /**
   * Initialize connection to the YouTube Music API
   */
  async initialize(role: "source" | "target"): Promise<boolean> {
    try {
      const authData = await getYouTubeAuthData(role);
      if (!authData) {
        return false;
      }

      // Make a test API call to verify connectivity
      const testResult = await this.makeApiCall<YTMusicSearchItem[]>(
        "search",
        { query: "test" },
        authData.accessToken
      );
      if (!testResult) {
        return false;
      }

      this.initialized = true;
      this.currentRole = role;
      return true;
    } catch (error) {
      console.error("Failed to initialize YTMusic:", error);
      return false;
    }
  }

  /**
   * Make a call to our YouTube Music API proxy
   */
  private async makeApiCall<T>(
    method: string,
    params: YTMusicApiParams,
    token: string
  ): Promise<T> {
    try {
      // Use absolute URL for Node.js compatibility
      const url = getYouTubeApiUrl("/api/youtube/music");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          params,
          token,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${errorText}`);
      }

      const result = (await response.json()) as YTMusicApiResponse<T>;
      return result.data;
    } catch (error) {
      console.error(`Error in API call ${method}:`, error);
      throw error;
    }
  }

  /**
   * Search for songs with improved YouTube Music results
   */
  async search(query: string): Promise<ITrack[]> {
    if (!this.initialized) {
      await this.initialize("source");
    }

    try {
      const authData = await getYouTubeAuthData(this.currentRole || "source");
      if (!authData) throw new Error("Not authenticated with YouTube");

      const results = await this.makeApiCall<YTMusicSearchItem[]>(
        "search",
        { query },
        authData.accessToken
      );

      // Map the YTMusic search results to our ITrack format
      return results
        .filter(item => item.type === "SONG")
        .map((item: YTMusicSearchItem) => ({
          id: item.videoId || "",
          name: item.name || "Unknown Track",
          artist: item.artist?.name || "Unknown Artist",
          album: item.album?.name || "Unknown Album",
          artwork: item.thumbnails?.[0]?.url,
        }));
    } catch (error) {
      console.error(`Error searching for "${query}":`, error);
      return [];
    }
  }

  /**
   * Get user's library with better structured data
   */
  async getLikedSongs(): Promise<ITrack[]> {
    if (!this.initialized) {
      await this.initialize("source");
    }

    try {
      const authData = await getYouTubeAuthData(this.currentRole || "source");
      if (!authData) throw new Error("Not authenticated with YouTube");

      // Get liked songs using the YouTube Data API v3
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.append("part", "snippet");
      url.searchParams.append("playlistId", "LM");
      url.searchParams.append("maxResults", "50");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch liked songs");
      }

      const data = (await response.json()) as YouTubePlaylistItemsResponse;

      // Map to our format
      return (data.items || []).map(item => ({
        id: item.snippet.resourceId.videoId || "",
        name: item.snippet.title || "Unknown Track",
        artist: item.snippet.channelTitle || "Unknown Artist",
        album: "YouTube Music",
        artwork:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url,
      }));
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      return [];
    }
  }

  /**
   * Get songs matching search criteria for a batch of tracks
   * Used for matching source tracks to YouTube Music tracks
   */
  async findMatchingTracks(
    tracks: Array<ITrack>
  ): Promise<Array<ITrack & { targetId?: string; status?: "matched" | "unmatched" }>> {
    if (!this.initialized) {
      await this.initialize("target");
    }

    const authData = await getYouTubeAuthData(this.currentRole || "target");
    if (!authData) throw new Error("Not authenticated with YouTube");

    return Promise.all(
      tracks.map(async track => {
        try {
          // Construct a search query combining track name and artist
          const searchQuery = `${track.name} ${track.artist}`;
          // Use searchSongs to get more accurate song matches
          const searchResults = await this.makeApiCall<YTMusicSearchItem[]>(
            "searchSongs",
            { query: searchQuery },
            authData.accessToken
          );

          // With searchSongs, we should already have only song results
          const songMatch = searchResults.find(item => item.type === "SONG");

          return {
            ...track,
            targetId: songMatch?.videoId || undefined,
            status: songMatch?.videoId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };
        } catch (error) {
          console.error(`Error finding match for track "${track.name}":`, error);
          return {
            ...track,
            status: MATCHING_STATUS.UNMATCHED,
          };
        }
      })
    );
  }

  /**
   * Find matching albums in YouTube Music
   * Used for matching source albums to YouTube Music albums
   */
  async findMatchingAlbums(albums: IAlbum[]): Promise<IAlbum[]> {
    if (!this.initialized) {
      await this.initialize("target");
    }

    const authData = await getYouTubeAuthData(this.currentRole || "target");
    if (!authData) throw new Error("Not authenticated with YouTube");

    return Promise.all(
      albums.map(async album => {
        try {
          // Construct a search query combining album name and artist
          const searchQuery = `${album.name} ${album.artist}`;

          // Search for albums
          const searchResults = await this.makeApiCall<YTMusicSearchItem[]>(
            "searchAlbums",
            { query: searchQuery },
            authData.accessToken
          );

          // Find the best album match
          const albumMatch = searchResults.find(
            item => item.type === "ALBUM" && item.albumId // Ensure it has a browseId
          );

          const result = {
            ...album,
            targetId: albumMatch?.albumId || undefined,
            status: albumMatch?.albumId ? MATCHING_STATUS.MATCHED : MATCHING_STATUS.UNMATCHED,
          };

          return result;
        } catch (error) {
          console.error(`Error finding match for album "${album.name}":`, error);
          return {
            ...album,
            status: MATCHING_STATUS.UNMATCHED,
          };
        }
      })
    );
  }
}

// Singleton instance
export const ytmusicAdapter = new YTMusicAdapter();
