import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { refreshSpotifyToken } from "@/lib/services/spotify/auth";
import { clearAuthData } from "@/lib/auth/constants";
import { readTokenCacheFromFile, writeTokenCacheToFile } from "@/test/tokenCache";

describe("Spotify Auth API", () => {
  let SPOTIFY_CLIENT_ID: string | undefined;
  let SPOTIFY_CLIENT_SECRET: string | undefined;

  beforeAll(() => {
    // Test configuration
    SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    // Read refresh token from cache
    const tokenCache = readTokenCacheFromFile();
    const cachedRefreshToken = tokenCache.source.refreshToken;

    // Log environment variable presence without revealing values
    console.log("Cached refresh token exists:", !!cachedRefreshToken);
    console.log("NEXT_PUBLIC_SPOTIFY_CLIENT_ID exists:", !!SPOTIFY_CLIENT_ID);
    console.log("SPOTIFY_CLIENT_SECRET exists:", !!SPOTIFY_CLIENT_SECRET);

    // Check if we have the necessary environment variables
    if (!cachedRefreshToken || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.warn(
        "Missing required variables for Spotify auth tests - some tests will be skipped"
      );
    }

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

      // Mock document.cookie
      Object.defineProperty(global.document, "cookie", {
        writable: true,
        value: "",
      });
    }
  });

  afterEach(() => {
    // Clean up after each test
    clearAuthData("source");
    clearAuthData("target");
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should successfully get a new refresh token if expiredAt is in the past", async () => {
    // Read refresh token from cache
    const tokenCache = readTokenCacheFromFile();
    const refreshToken = tokenCache.source.refreshToken;

    // Skip this test if any required variable is missing
    if (!refreshToken || !SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      console.warn("Skipping token refresh test due to missing variables");
      return;
    }

    // Skip test if token isn't expired yet
    const now = Date.now();
    if (
      tokenCache?.source?.token &&
      tokenCache?.source?.expiresAt &&
      now < tokenCache.source.expiresAt - 5 * 60 * 1000 // 5 minutes buffer
    ) {
      console.log("Skipping refresh test as the current token is still valid.");
      console.log(
        `Token expires in: ${Math.floor((tokenCache.source.expiresAt - now) / 60000)} minutes`
      );
      return;
    }

    // Add specific debugging for this test
    console.log("Token refresh test running with:");
    console.log("- Refresh token length:", refreshToken.length);
    console.log(
      "- First/last 4 chars:",
      refreshToken.substring(0, 4) + "..." + refreshToken.substring(refreshToken.length - 4)
    );

    // Set environment variables explicitly within test scope
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = SPOTIFY_CLIENT_ID;
    process.env.SPOTIFY_CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;

    try {
      // Use directRequest=true to bypass the Next.js API route
      const refreshedAuth = await refreshSpotifyToken(refreshToken, "source", true);

      // Add this check to handle null case gracefully
      if (!refreshedAuth) {
        console.error("Token refresh failed, got null result");
        throw new Error("Token refresh failed");
      }

      // Update the token cache with the new token data using writeTokenCacheToFile
      if (tokenCache) {
        tokenCache.source = {
          token: refreshedAuth.accessToken,
          refreshToken: refreshedAuth.refreshToken || refreshToken,
          expiresAt: refreshedAuth.timestamp + refreshedAuth.expiresIn * 1000,
        };
        writeTokenCacheToFile(tokenCache);
        console.log("Token cache file updated with new token data and refresh token.");
      }

      expect(refreshedAuth).not.toBeNull();
      expect(refreshedAuth.accessToken).toBeDefined();
      expect(refreshedAuth.refreshToken).toBeDefined();
      expect(refreshedAuth.timestamp).toBeDefined();
      expect(refreshedAuth.expiresIn).toBeGreaterThan(0);
    } catch (error) {
      console.error("Test error:", error);
      throw error;
    }
  });
});
