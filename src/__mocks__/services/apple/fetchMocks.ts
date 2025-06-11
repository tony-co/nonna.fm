import { vi } from "vitest";
import * as auth from "@/lib/services/apple/auth";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import type { AuthData } from "@/lib/auth/constants";

// --- Type-safe mock AuthData for Apple Music ---
export const mockAppleAuthData: AuthData = {
  accessToken: "mock-apple-access-token",
  refreshToken: "mock-apple-refresh-token",
  expiresIn: 3600,
  timestamp: Date.now(),
  userId: "mock-apple-user-id",
  tokenType: "Bearer",
  role: "source",
  serviceId: "apple",
};

// --- Helper: build Apple Music API response objects from our mock data ---
export const appleApiMocks = {
  playlists: mockPlaylists.map(p => ({
    id: p.id,
    attributes: {
      name: p.name,
      description: p.description,
      artwork: p.artwork ? { url: p.artwork } : undefined,
    },
    relationships: {
      tracks: { data: p.tracks.map(t => ({ id: t.id, type: "songs" })) },
    },
    type: "playlists",
  })),
  tracks: mockTracks.map(t => ({
    id: t.id,
    attributes: {
      name: t.name,
      artistName: t.artist,
      albumName: t.album ?? "",
      artwork: t.artwork ? { url: t.artwork } : undefined,
    },
    type: "songs",
  })),
  albums: mockAlbums.map(a => ({
    id: a.id,
    attributes: {
      name: a.name,
      artistName: a.artist,
      artwork: a.artwork ? { url: a.artwork } : undefined,
    },
    type: "albums",
  })),
};

/**
 * Sets up global.fetch with type-safe Apple Music API responses for all main endpoints.
 * Uses Response objects and matches the real Apple Music API as closely as possible.
 */
export function setupAppleFetchMock(): void {
  global.fetch = vi.fn(async (input: string | URL | Request, options?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    // Playlist tracks endpoint: /v1/me/library/playlists/{playlistId}/tracks
    if (/\/v1\/me\/library\/playlists\/[^/]+\/tracks/.test(url) && options?.method === "GET") {
      const match = url.match(/\/v1\/me\/library\/playlists\/([^/]+)\/tracks/);
      const playlistId = match ? match[1] : undefined;
      const playlist = mockPlaylists.find(p => p.id === playlistId);
      const items = playlist
        ? playlist.tracks.map(t => ({
            id: t.id,
            attributes: {
              name: t.name,
              artistName: t.artist,
              albumName: t.album ?? "",
              artwork: t.artwork ? { url: t.artwork } : undefined,
            },
            type: "songs",
          }))
        : [];
      return new Response(JSON.stringify({ data: items }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Playlists
    if (url.includes("/v1/me/library/playlists") && options?.method === "GET") {
      return new Response(JSON.stringify({ data: appleApiMocks.playlists }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Add tracks to playlist
    if (url.includes("/v1/me/library/playlists") && options?.method === "POST") {
      return new Response(JSON.stringify({ data: [{ id: "new_apple_playlist_id" }] }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Liked songs (tracks)
    if (url.includes("/v1/me/library/songs")) {
      return new Response(JSON.stringify({ data: appleApiMocks.tracks }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Albums
    if (url.includes("/v1/me/library/albums")) {
      return new Response(JSON.stringify({ data: appleApiMocks.albums }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Search (track/album)
    if (url.includes("/v1/catalog/")) {
      if (url.includes("types=songs")) {
        return new Response(
          JSON.stringify({ results: { songs: { data: appleApiMocks.tracks } } }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      if (url.includes("types=albums")) {
        return new Response(
          JSON.stringify({ results: { albums: { data: appleApiMocks.albums } } }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
    // Add tracks/albums to library
    if (url.endsWith("/v1/me/library") && options?.method === "POST") {
      return new Response(JSON.stringify({}), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("/v1/me/library?ids[albums]=") && options?.method === "POST") {
      return new Response(JSON.stringify({}), {
        status: 202,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Default: error
    return new Response(JSON.stringify({}), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  });
}

/**
 * Mocks getAppleAuthData to always return a valid AuthData for Apple Music.
 * Use in test setup to ensure all API calls are authenticated.
 */
export function mockAppleAuth(): void {
  vi.spyOn(auth, "getAppleAuthData").mockImplementation(async () => mockAppleAuthData);
}
