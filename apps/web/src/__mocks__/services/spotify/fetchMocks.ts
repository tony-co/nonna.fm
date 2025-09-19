import { vi } from "vitest";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import type { AuthData } from "@/lib/auth/constants";
import * as auth from "@/lib/services/spotify/auth";
import type { SpotifyPlaylist, SpotifyTrackItem } from "@/lib/services/spotify/types";

// --- Type-safe mock AuthData ---
export const mockSpotifyAuthData: AuthData = {
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  expiresIn: 3600,
  timestamp: Date.now(),
  userId: "mock-user-id",
  tokenType: "Bearer",
  role: "source",
  serviceId: "spotify",
};

// --- Helper: build Spotify API response objects from our mock data ---
export const spotifyApiMocks = {
  playlists: mockPlaylists.map(p => ({
    id: p.id,
    name: p.name,
    tracks: { total: p.trackCount },
    owner: { id: p.ownerId, display_name: "Owner" },
    images: p.artwork ? [{ url: p.artwork }] : [],
  })) as SpotifyPlaylist[],
  tracks: mockTracks.map(t => ({
    track: {
      id: t.id,
      name: t.name,
      artists: [{ name: t.artist }],
      album: { name: t.album ?? "", images: t.artwork ? [{ url: t.artwork }] : [] },
    },
  })) as SpotifyTrackItem[],
  albums: mockAlbums.map(a => ({
    album: {
      id: a.id,
      name: a.name,
      artists: [{ name: a.artist }],
      images: a.artwork ? [{ url: a.artwork }] : [],
    },
  })),
  searchTrack: {
    tracks: {
      items: [
        {
          id: mockTracks[0].id,
          name: mockTracks[0].name,
          artists: [{ name: mockTracks[0].artist }],
          album: {
            name: mockTracks[0].album ?? "",
            images: mockTracks[0].artwork ? [{ url: mockTracks[0].artwork }] : [],
          },
        },
      ],
      total: 1,
      limit: 3,
      offset: 0,
    },
  },
  searchAlbums: {
    albums: {
      items: mockAlbums.map(a => ({
        id: a.id,
        name: a.name,
        artists: [{ name: a.artist }],
        images: a.artwork ? [{ url: a.artwork }] : [],
      })),
    },
  },
};

/**
 * Sets up global.fetch with type-safe Spotify API responses for all main endpoints.
 * Uses Response objects and matches the real Spotify API as closely as possible.
 */
export function setupSpotifyFetchMock(): void {
  global.fetch = vi.fn(async (input: string | URL | Request, options?: RequestInit) => {
    const url =
      typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    // Playlist creation (POST /me/playlists) must come before the general /me/playlists handler
    if (url.endsWith("/me/playlists") && options?.method === "POST") {
      return new Response(JSON.stringify({ id: "new_playlist_id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Playlists
    if (url.includes("/me/playlists")) {
      // Parse limit and offset from query string
      const limitMatch = url.match(/limit=(\d+)/);
      const offsetMatch = url.match(/offset=(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : spotifyApiMocks.playlists.length;
      const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
      // Always return full Spotify API structure, even for limit=1
      // This matches the real API and works with retry logic that parses JSON
      return new Response(
        JSON.stringify({
          items: spotifyApiMocks.playlists.slice(offset, offset + limit),
          total: spotifyApiMocks.playlists.length,
          limit,
          offset,
          href: url,
          next: null,
          previous: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    // Liked songs (tracks)
    if (url.includes("/me/tracks")) {
      const limitMatch = url.match(/limit=(\d+)/);
      const offsetMatch = url.match(/offset=(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : spotifyApiMocks.tracks.length;
      const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
      return new Response(
        JSON.stringify({
          items: spotifyApiMocks.tracks.slice(offset, offset + limit),
          total: spotifyApiMocks.tracks.length,
          limit,
          offset,
          href: url,
          next: null,
          previous: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    // Albums
    if (url.includes("/me/albums")) {
      const limitMatch = url.match(/limit=(\d+)/);
      const offsetMatch = url.match(/offset=(\d+)/);
      const limit = limitMatch ? parseInt(limitMatch[1], 10) : spotifyApiMocks.albums.length;
      const offset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;
      return new Response(
        JSON.stringify({
          items: spotifyApiMocks.albums.slice(offset, offset + limit),
          total: spotifyApiMocks.albums.length,
          limit,
          offset,
          href: url,
          next: null,
          previous: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    // Match Spotify playlist tracks endpoint: /playlists/{playlistId}/tracks
    if (/\/playlists\/[^/]+\/tracks/.test(url)) {
      // Extract playlistId from URL
      const match = url.match(/\/playlists\/([^/]+)\/tracks/);
      const playlistId = match ? match[1] : undefined;
      // Find the playlist in mockPlaylists
      const playlist = mockPlaylists.find(p => p.id === playlistId);
      if (url.includes("/tracks?limit=1")) {
        // Initial count
        const total = playlist ? playlist.tracks.length : 0;
        return new Response(JSON.stringify({ total }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      // Return only the tracks for the requested playlist, mapped to Spotify API format
      const items = playlist
        ? playlist.tracks.map(t => ({
            track: {
              id: t.id,
              name: t.name,
              artists: [{ name: t.artist }],
              album: { name: t.album ?? "", images: t.artwork ? [{ url: t.artwork }] : [] },
            },
          }))
        : [];
      return new Response(JSON.stringify({ items }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Search (track/album)
    if (url.includes("/search")) {
      if (url.includes("type=track")) {
        return new Response(JSON.stringify(spotifyApiMocks.searchTrack), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("type=album")) {
        return new Response(JSON.stringify(spotifyApiMocks.searchAlbums), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    // Add tracks to playlist
    if (url.includes("/playlists/") && options?.method === "POST") {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Add tracks/albums to library
    if (url.includes("/me/tracks") && options?.method === "PUT") {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.includes("/me/albums") && options?.method === "PUT") {
      return new Response(JSON.stringify({}), {
        status: 200,
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
 * Mocks getSpotifyAuthData to always return a valid AuthData for Spotify.
 * Use in test setup to ensure all API calls are authenticated.
 */
export function mockSpotifyAuth(): void {
  vi.spyOn(auth, "getSpotifyAuthData").mockImplementation(async () => mockSpotifyAuthData);
}
