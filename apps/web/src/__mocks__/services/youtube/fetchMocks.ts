import { vi } from "vitest";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import type { AuthData } from "@/lib/auth/constants";
import * as auth from "@/lib/services/youtube/auth";

// Type-safe mock AuthData for YouTube Music
export const mockYouTubeAuthData: AuthData = {
  accessToken: "mock-youtube-access-token",
  refreshToken: "mock-youtube-refresh-token",
  expiresIn: 3600,
  timestamp: Date.now(),
  userId: "mock-youtube-user-id",
  tokenType: "Bearer",
  role: "source",
  serviceId: "youtube",
};

// Helper: build YouTube Music API response objects from our mock data
export const youtubeApiMocks = {
  playlists: mockPlaylists.map(p => ({
    id: p.id,
    snippet: {
      title: p.name,
      description: p.description || "",
      thumbnails: p.artwork ? { default: { url: p.artwork } } : undefined,
    },
    contentDetails: {
      itemCount: p.tracks.length,
    },
  })),
  tracks: mockTracks.map(t => ({
    id: t.id,
    snippet: {
      title: t.name,
      channelTitle: t.artist,
      thumbnails: t.artwork ? { default: { url: t.artwork } } : undefined,
    },
    contentDetails: {
      duration: "PT3M30S", // Mock duration
    },
  })),
  albums: mockAlbums.map(a => ({
    id: a.id,
    snippet: {
      title: a.name,
      channelTitle: a.artist,
      thumbnails: a.artwork ? { default: { url: a.artwork } } : undefined,
    },
  })),
  playlistItems: mockTracks.map((t, index) => ({
    id: `playlist_item_${index}`,
    snippet: {
      title: t.name,
      channelTitle: t.artist,
      thumbnails: t.artwork ? { default: { url: t.artwork } } : undefined,
      resourceId: {
        videoId: t.id,
      },
    },
    status: {
      privacyStatus: "public" as const,
    },
  })),
};

/**
 * Sets up global.fetch with type-safe YouTube API responses for all main endpoints.
 * Uses Response objects and matches the real YouTube API as closely as possible.
 */
export function setupYouTubeFetchMock(): void {
  global.fetch = vi.fn(async (input: string | URL | Request, _options?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    // Mock YouTube Data API v3 playlists endpoint
    if (url.includes("https://www.googleapis.com/youtube/v3/playlists")) {
      const method = _options?.method || "GET";

      if (method === "POST") {
        // Creating a new playlist
        return new Response(
          JSON.stringify({
            id: "new_youtube_playlist_id",
            snippet: {
              title: "Test Playlist",
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Getting playlists
        return new Response(
          JSON.stringify({
            items: youtubeApiMocks.playlists,
            pageInfo: {
              totalResults: youtubeApiMocks.playlists.length,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Mock YouTube Data API v3 playlistItems endpoint
    if (url.includes("https://www.googleapis.com/youtube/v3/playlistItems")) {
      const urlObj = new URL(url);
      const method = _options?.method || "GET";

      if (method === "POST") {
        // Adding a track to a playlist
        return new Response(
          JSON.stringify({
            id: "new_playlist_item_id",
            snippet: {
              title: "Added Track",
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        // Getting playlist tracks
        const playlistId = urlObj.searchParams.get("playlistId");

        // Return tracks based on playlist ID
        let items: Array<{
          id: string;
          snippet: {
            title: string;
            channelTitle: string;
            thumbnails?: { default?: { url: string } };
            resourceId: { videoId: string };
          };
          status: { privacyStatus: "public" };
        }>;

        if (playlistId === "LM") {
          // Liked songs - return all tracks
          items = youtubeApiMocks.playlistItems;
        } else if (playlistId === mockPlaylists[0].id) {
          // First playlist - return its tracks
          items = mockPlaylists[0].tracks.map((t, index) => ({
            id: `${mockPlaylists[0].id}_${index}`,
            snippet: {
              title: t.name,
              channelTitle: t.artist,
              thumbnails: t.artwork ? { default: { url: t.artwork } } : undefined,
              resourceId: {
                videoId: t.id,
              },
            },
            status: {
              privacyStatus: "public" as const,
            },
          }));
        } else {
          // Other playlists - return empty for now
          items = [];
        }

        return new Response(
          JSON.stringify({
            items,
            pageInfo: {
              totalResults: items.length,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Mock YouTube search API endpoint (for album search)
    if (url.includes("/api/youtube/search")) {
      return new Response(
        JSON.stringify({
          matches: youtubeApiMocks.tracks.map(t => ({
            score: 0.95, // High score for testing
            nameScore: 0.9,
            artistScore: 0.9,
            item: {
              id: t.id,
              snippet: {
                title: t.snippet.title,
                channelTitle: t.snippet.channelTitle,
                thumbnails: t.snippet.thumbnails,
                resourceId: {
                  videoId: t.id,
                },
              },
            },
          })),
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Mock YouTube Music proxy API endpoints (YTMusicAdapter)
    if (url.includes("/api/youtube/music")) {
      // Parse the POST body to get the method and params
      const body = _options?.body;
      if (body && typeof body === "string") {
        try {
          const { method } = JSON.parse(body);

          switch (method) {
            case "search":
            case "searchSongs":
              // Mock search functionality for YTMusicAdapter
              return new Response(
                JSON.stringify({
                  data: youtubeApiMocks.tracks.map(t => ({
                    videoId: t.id,
                    name: t.snippet.title,
                    artist: { artistId: "mock-artist-id", name: t.snippet.channelTitle },
                    album: { name: "Mock Album", albumId: "mock-album-id" },
                    thumbnails: t.snippet.thumbnails?.default
                      ? [{ url: t.snippet.thumbnails.default.url, width: 120, height: 90 }]
                      : [],
                    type: "SONG" as const,
                  })),
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            case "searchAlbums":
              // Mock album search functionality for YTMusicAdapter
              return new Response(
                JSON.stringify({
                  data: youtubeApiMocks.albums.map(a => ({
                    albumId: a.id,
                    name: a.snippet.title,
                    artist: { artistId: "mock-artist-id", name: a.snippet.channelTitle },
                    thumbnails: a.snippet.thumbnails?.default
                      ? [{ url: a.snippet.thumbnails.default.url, width: 120, height: 90 }]
                      : [],
                    type: "ALBUM" as const,
                  })),
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            case "get_library_playlists":
              // Mock user playlists
              return new Response(
                JSON.stringify({
                  data: youtubeApiMocks.playlists.map(p => ({
                    playlistId: p.id,
                    title: p.snippet.title,
                    trackCount: p.contentDetails.itemCount,
                  })),
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            case "get_playlist_tracks":
              // Mock playlist tracks
              return new Response(
                JSON.stringify({
                  data: youtubeApiMocks.playlistItems.map(item => ({
                    videoId: item.snippet.resourceId?.videoId || item.id,
                    name: item.snippet.title,
                    artist: { artistId: "mock-artist-id", name: item.snippet.channelTitle },
                    album: { name: "Mock Album", albumId: "mock-album-id" },
                    thumbnails: item.snippet.thumbnails?.default
                      ? [{ url: item.snippet.thumbnails.default.url, width: 120, height: 90 }]
                      : [],
                    type: "SONG" as const,
                  })),
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            case "create_playlist":
              // Mock playlist creation
              return new Response(
                JSON.stringify({
                  data: {
                    playlistId: "new_youtube_playlist_id",
                  },
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            case "add_to_playlist":
              // Mock adding tracks to playlist
              return new Response(
                JSON.stringify({
                  data: {
                    status: "STATUS_SUCCEEDED",
                  },
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );

            default:
              return new Response(
                JSON.stringify({
                  data: null,
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                }
              );
          }
        } catch {
          return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Fallback for non-POST requests
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mock YouTube auth callback endpoint
    if (url.includes("/api/auth/youtube/callback")) {
      return new Response(
        JSON.stringify({
          access_token: mockYouTubeAuthData.accessToken,
          refresh_token: mockYouTubeAuthData.refreshToken,
          expires_in: mockYouTubeAuthData.expiresIn,
          token_type: mockYouTubeAuthData.tokenType,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Mock YouTube auth refresh endpoint
    if (url.includes("/api/auth/youtube/refresh")) {
      return new Response(
        JSON.stringify({
          access_token: `new-${mockYouTubeAuthData.accessToken}`,
          expires_in: mockYouTubeAuthData.expiresIn,
          token_type: mockYouTubeAuthData.tokenType,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Default: error
    return new Response(JSON.stringify({}), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  });
}

/**
 * Mocks getYouTubeAuthData to always return a valid AuthData for YouTube Music.
 * Use in test setup to ensure all API calls are authenticated.
 */
export function mockYouTubeAuth(): void {
  vi.spyOn(auth, "getYouTubeAuthData").mockImplementation(async () => mockYouTubeAuthData);
}
