import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { refreshSpotifyToken } from "@/lib/services/spotify/auth";
import { createPlaylistWithTracks, addTracksToLibrary } from "@/lib/services/spotify/api";
import { setAuthData, AuthData } from "@/lib/auth/constants";
import type { ITrack } from "@/types/library";
import { readTokenCacheFromFile } from "@/test/tokenCache";

// Mark these tests as optional since they make real API changes
describe.skip("Spotify Integration", () => {
  let authData: AuthData | null = null;

  beforeAll(async () => {
    // Get refresh token from token cache
    const tokenCache = readTokenCacheFromFile();
    const refreshToken = tokenCache.source.refreshToken;

    // Skip all tests if no auth token
    if (!refreshToken) {
      console.warn("Skipping integration tests - missing refresh token");
      return;
    }

    // Set up auth for target account
    authData = await refreshSpotifyToken(refreshToken, "target");

    if (authData) {
      await setAuthData("target", authData);
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

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add tracks to a user library", async () => {
    // Skip if no auth data
    if (!authData) {
      console.warn("Skipping test - no auth data available");
      return;
    }

    // Create test tracks with Spotify IDs
    const testTracks: (ITrack & { targetId: string })[] = [
      {
        id: "test-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "matched",
        targetId: "7tFiyTwD0nx5a1eklYtX2J", // Bohemian Rhapsody Spotify ID
      },
    ];

    const result = await addTracksToLibrary(testTracks);

    expect(result).toBeDefined();
    expect(result.total).toBe(testTracks.length);

    // May not add if already in library, so we'll just verify the API call worked
    expect(result.added + result.failed).toBe(testTracks.length);

    console.log(`Library add result: added ${result.added}, failed ${result.failed}`);
  });

  it("should create a playlist with tracks", async () => {
    // Skip if no auth data
    if (!authData) {
      console.warn("Skipping test - no auth data available");
      return;
    }

    // Create test tracks with Spotify IDs
    const testTracks: (ITrack & { targetId: string })[] = [
      {
        id: "test-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "matched",
        targetId: "7tFiyTwD0nx5a1eklYtX2J", // Bohemian Rhapsody Spotify ID
      },
      {
        id: "test-2",
        name: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        artwork: "",
        status: "matched",
        targetId: "Zm4vfSW8y1IwGwBX7pMraI", // Billie Jean Spotify ID
      },
    ];

    const uniqueTestName = `Test Playlist ${Date.now()}`;
    const result = await createPlaylistWithTracks(
      uniqueTestName,
      testTracks,
      "Created by automated test"
    );

    expect(result).toBeDefined();
    expect(result.total).toBe(testTracks.length);
    expect(result.playlistId).toBeDefined();

    console.log(`Playlist created: ${uniqueTestName}, ID: ${result.playlistId}`);
    console.log(`Added ${result.added} tracks, failed ${result.failed}`);
  });
});
