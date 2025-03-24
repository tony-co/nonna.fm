import { describe, it, expect, beforeAll, afterEach, vi, beforeEach } from "vitest";
import { fetchUserLibrary, fetchPlaylistTracks, search } from "@/lib/services/spotify/api";
import { setAuthData, AuthData } from "@/lib/auth/constants";
import type { ITrack } from "@/types/library";
import { getCachedSpotifyAccessToken, readTokenCacheFromFile } from "@/test/tokenCache";

// Global test variables
const TEST_PLAYLIST_ID = process.env.TEST_SPOTIFY_PLAYLIST_ID;
const TEST_ALBUM_ID = process.env.TEST_SPOTIFY_ALBUM_ID;

describe("Spotify API", () => {
  // Auth data that will be initialized in beforeAll
  let authData: AuthData | null = null;
  let accessToken: string | null = null;

  beforeAll(async () => {
    // Get refresh token from token cache
    const tokenCache = readTokenCacheFromFile();
    const refreshToken = tokenCache.source.refreshToken;

    // Check if we have the necessary environment variables
    if (!refreshToken) {
      console.warn("Missing refresh token - some tests will be skipped");
    }
    if (!TEST_PLAYLIST_ID) {
      console.warn("Missing TEST_SPOTIFY_PLAYLIST_ID - playlist tests will be skipped");
    }
    if (!TEST_ALBUM_ID) {
      console.warn("Missing TEST_SPOTIFY_ALBUM_ID - album tests will be skipped");
    }

    // Set up auth data for all tests
    if (refreshToken) {
      // Use the token cache mechanism instead of directly refreshing
      accessToken = await getCachedSpotifyAccessToken("source");

      if (accessToken) {
        // Create auth data structure from the token
        authData = {
          accessToken,
          refreshToken,
          expiresIn: 3600, // Default expiry
          timestamp: Date.now(),
          userId: "",
          displayName: "",
          tokenType: "Bearer",
          role: "source",
          serviceId: "spotify",
        };

        await setAuthData("source", authData);
      }
    }

    // Ensure we're working in a testing environment
    if (typeof window === "undefined") {
      // Mock localStorage for Node.js environment
      global.localStorage = {
        getItem: vi.fn().mockImplementation(key => {
          if (key.includes("token") && authData) {
            return JSON.stringify(authData);
          }
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
    }
  });

  beforeEach(() => {
    // Reset storage mocks between tests
    if (typeof window === "undefined" && authData) {
      vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
        if (key.includes("token")) {
          return JSON.stringify(authData);
        }
        return null;
      });
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch user library", async () => {
    // Skip if no auth data
    if (!authData) {
      console.warn("Skipping fetchUserLibrary test - no auth data available");
      return;
    }

    const library = await fetchUserLibrary();

    // Verify library structure
    expect(library).toBeDefined();
    expect(library.playlists).toBeInstanceOf(Array);
    expect(library.likedSongs).toBeInstanceOf(Array);
    expect(library.albums).toBeInstanceOf(Array);

    // Check some data is returned (test account should have some data)
    if (library.playlists.length > 0) {
      const playlist = library.playlists[0];
      expect(playlist.id).toBeDefined();
      expect(playlist.name).toBeDefined();
      expect(playlist.tracks).toBeDefined();
    }

    // Log some stats about the fetched library
    console.log(
      `Fetched library: ${library.playlists.length} playlists, ${library.likedSongs.length} liked songs, ${library.albums.length} albums`
    );
  });

  it("should fetch tracks from a playlist", async () => {
    // Skip if no auth data or test playlist ID
    if (!authData || !TEST_PLAYLIST_ID) {
      console.warn("Skipping fetchPlaylistTracks test - missing auth data or playlist ID");
      return;
    }

    const tracks = await fetchPlaylistTracks(TEST_PLAYLIST_ID);

    // Verify tracks array
    expect(tracks).toBeInstanceOf(Array);

    if (tracks.length > 0) {
      // Verify track structure
      const track = tracks[0];
      expect(track.id).toBeDefined();
      expect(track.name).equals("Axel F");
      expect(track.artist).equals("Crazy Frog");
      expect(track.album).equals("Crazy Frog presents Crazy Hits");

      // Log some info about tracks
      console.log(`Fetched ${tracks.length} tracks from playlist ${TEST_PLAYLIST_ID}`);
      console.log(`First track: ${track.name} by ${track.artist}`);
    }
  });

  it("should search for tracks", async () => {
    // Skip if no auth data
    if (!authData) {
      console.warn("Skipping search test - no auth data available");
      return;
    }

    // Create some test tracks to search for
    const testTracks: ITrack[] = [
      {
        id: "test-id-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "pending",
      },
      {
        id: "test-id-2",
        name: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        artwork: "",
        status: "pending",
      },
    ];

    const searchResult = await search(testTracks, 1); // 1 track per batch for testing

    // Verify search results
    expect(searchResult).toBeDefined();
    expect(searchResult.matched).toBeGreaterThanOrEqual(0);
    expect(searchResult.unmatched).toBeGreaterThanOrEqual(0);
    expect(searchResult.total).toBe(testTracks.length);
    expect(searchResult.tracks).toBeInstanceOf(Array);

    // Log search results
    console.log(
      `Search results: ${searchResult.matched} tracks found, ${searchResult.unmatched} failed`
    );
  });
});
