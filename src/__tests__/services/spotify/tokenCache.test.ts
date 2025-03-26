import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { setAuthData, clearAuthData, AuthData } from "@/lib/auth/constants";
import { getCachedSpotifyAccessToken, readTokenCacheFromFile } from "@/test/tokenCache";
import * as spotifyAuth from "@/lib/services/spotify/auth";

// Test configuration
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

describe("Spotify Token Cache", () => {
  let cachedTokenForApi: string | null = null;

  beforeAll(() => {
    // Set environment variables for testing
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

    // Ensure we're working in a testing environment
    if (typeof window === "undefined") {
      // Mock localStorage for Node.js environment
      global.localStorage = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
    }

    console.log("Testing environment configured for token cache tests");
  });

  afterEach(() => {
    // Clean up after each test
    clearAuthData("source");
    clearAuthData("target");
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should return null when no auth data is available", async () => {
    // Make sure no auth data is set
    clearAuthData("source");

    // Get token from cache should return null
    const cachedToken = await getCachedSpotifyAccessToken("source");
    expect(cachedToken).toBeNull();
  });

  it("should cache token from valid auth data", async () => {
    // Set mock auth data with a future expiry
    const mockAuthData: AuthData = {
      accessToken: "mock-cached-token",
      refreshToken: "mock-refresh-token",
      expiresIn: 3600,
      timestamp: Date.now(),
      userId: "mock-user-id",
      displayName: "Mock User",
      tokenType: "Bearer",
      role: "source",
      serviceId: "spotify",
    };

    await setAuthData("source", mockAuthData);

    // First call should get token from storage and cache it
    const cachedToken1 = await getCachedSpotifyAccessToken("source");
    expect(cachedToken1).toBe("mock-cached-token");

    // Mock updating the token in storage to prove cache is working
    const updatedAuthData = {
      ...mockAuthData,
      accessToken: "updated-token-not-from-cache",
    };
    await setAuthData("source", updatedAuthData);

    // Second call should get token from cache, not storage
    const cachedToken2 = await getCachedSpotifyAccessToken("source");
    expect(cachedToken2).toBe("mock-cached-token");

    // Force refresh should get the updated token
    const forcedRefreshToken = await getCachedSpotifyAccessToken("source", true);
    expect(forcedRefreshToken).toBe("updated-token-not-from-cache");
  });

  it("should refresh an expired token", async () => {
    // Get refresh token from token cache
    const tokenCache = readTokenCacheFromFile();
    const refreshToken = tokenCache.source.refreshToken;

    // Skip if no refresh token is available
    if (!refreshToken) {
      console.warn("Skipping expired token test due to missing refresh token");
      return;
    }

    // Set mock auth data with an expired token
    const mockAuthData: AuthData = {
      accessToken: "expired-token",
      refreshToken: refreshToken,
      expiresIn: 3600,
      timestamp: Date.now() - 4000 * 1000, // 4000 seconds ago (expired)
      userId: "mock-user-id",
      displayName: "Mock User",
      tokenType: "Bearer",
      role: "source",
      serviceId: "spotify",
    };

    await setAuthData("source", mockAuthData);

    // Mock the refreshSpotifyToken function
    const mockRefreshedAuth: AuthData = {
      ...mockAuthData,
      accessToken: "refreshed-token",
      timestamp: Date.now(),
      expiresIn: 3600,
    };

    vi.spyOn(spotifyAuth, "refreshSpotifyToken").mockResolvedValue(mockRefreshedAuth);

    // Get token should trigger a refresh
    const token = await getCachedSpotifyAccessToken("source");
    expect(token).toBe("refreshed-token");
  });

  it("should set up a live cached token for API tests", async () => {
    // Get refresh token from token cache
    const tokenCache = readTokenCacheFromFile();
    const refreshToken = tokenCache.source.refreshToken;

    // Skip this test if any required environment variable is missing
    if (!refreshToken || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.warn("Skipping token setup test due to missing environment variables");
      return;
    }

    // Set environment variables explicitly within test scope
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = SPOTIFY_CLIENT_ID;
    process.env.SPOTIFY_CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;

    try {
      // Set initial auth data
      const initialAuthData: AuthData = {
        accessToken: "",
        refreshToken: refreshToken,
        expiresIn: 0,
        timestamp: 0, // Expired timestamp to force refresh
        userId: "",
        displayName: "",
        tokenType: "Bearer",
        role: "source",
        serviceId: "spotify",
      };

      await setAuthData("source", initialAuthData);

      // Now get a valid token using the cache system
      cachedTokenForApi = await getCachedSpotifyAccessToken("source");

      console.log("Live Spotify token available for tests:", !!cachedTokenForApi);
      expect(cachedTokenForApi).not.toBeNull();
    } catch (error) {
      console.error("Test error:", error);
      throw error;
    }
  });
});
