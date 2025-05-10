import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { refreshSpotifyToken } from "@/lib/services/spotify/auth";
import { refreshAppleToken } from "@/lib/services/apple/auth";
import { clearAuthData } from "@/lib/auth/constants";
import {
  readTokenCacheFromFile,
  writeTokenCacheToFile,
  SUPPORTED_TEST_SERVICES,
} from "@/__tests__/tokenCache";
import { MusicService } from "@/types/services";
import { refreshYouTubeToken } from "@/lib/services/youtube/auth";

// Create a test for each supported service
SUPPORTED_TEST_SERVICES.forEach((service: MusicService) => {
  describe(`${service.charAt(0).toUpperCase() + service.slice(1)} Auth API`, () => {
    let CLIENT_ID: string | undefined;
    let CLIENT_SECRET: string | undefined;

    beforeAll(() => {
      // Test configuration based on service
      switch (service) {
        case "spotify":
          CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
          CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
          break;
        case "youtube":
          CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
          CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;
          break;
        case "apple":
          CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_TEAM_ID; // Apple uses different params
          CLIENT_SECRET = process.env.APPLE_MUSIC_KEY_ID;
          break;
        case "deezer":
          CLIENT_ID = process.env.NEXT_PUBLIC_DEEZER_APP_ID;
          // Deezer doesn't use client secret in the same way
          break;
      }

      // Read refresh token from cache
      const tokenCache = readTokenCacheFromFile(service);
      const cachedRefreshToken = tokenCache.refreshToken;

      // Check if we have the necessary environment variables
      if (!cachedRefreshToken || !CLIENT_ID || (service !== "deezer" && !CLIENT_SECRET)) {
        console.warn(
          `Missing required variables for ${service} auth tests - some tests will be skipped`
        );
      }

      // Set environment variables for testing
      process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

      // Setup mock DOM environment
      global.document = {
        cookie: "",
      } as unknown as Document;

      // Mock localStorage for Node.js environment
      Object.defineProperty(global, "localStorage", {
        value: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem: vi.fn(),
          clear: vi.fn(),
          length: 0,
          key: vi.fn(),
        },
        writable: true,
      });

      // Update document.cookie configuration
      Object.defineProperty(global.document, "cookie", {
        writable: true,
        value: "",
      });
    });

    afterEach(() => {
      // Clean up after each test
      clearAuthData("source");
      clearAuthData("target");
      vi.clearAllMocks();
      vi.restoreAllMocks();
    });

    it(`should successfully get a new ${service} token if expiredAt is in the past`, async () => {
      // Skip test for services that don't use refresh tokens
      if (service === ("deezer" as MusicService)) {
        console.log("Skipping token refresh test for Deezer - not applicable");
        return;
      }

      // Read refresh token from cache
      const tokenCache = readTokenCacheFromFile(service);
      const refreshToken = tokenCache.refreshToken;

      // Skip this test if any required variable is missing
      if (!refreshToken || !CLIENT_ID || (service !== "deezer" && !CLIENT_SECRET)) {
        console.warn(`Skipping ${service} token refresh test due to missing variables`);
        return;
      }

      // Skip test if token isn't expired yet
      const now = Date.now();
      if (
        tokenCache?.token &&
        tokenCache?.expiresAt &&
        now < tokenCache.expiresAt - 5 * 60 * 1000 // 5 minutes buffer
      ) {
        console.log(`Skipping ${service} refresh test as the current token is still valid.`);
        console.log(
          `Token expires in: ${Math.floor((tokenCache.expiresAt - now) / 60000)} minutes`
        );
        return;
      }

      // Add specific debugging for this test
      console.log(`${service} token refresh test running with:`);
      console.log("- Refresh token length:", refreshToken.length);
      console.log(
        "- First/last 4 chars:",
        refreshToken.substring(0, 4) + "..." + refreshToken.substring(refreshToken.length - 4)
      );

      // Set environment variables explicitly within test scope based on service
      switch (service) {
        case "spotify":
          process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID = CLIENT_ID;
          process.env.SPOTIFY_CLIENT_SECRET = CLIENT_SECRET;
          break;
        case "youtube":
          process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID = CLIENT_ID;
          process.env.YOUTUBE_CLIENT_SECRET = CLIENT_SECRET;
          break;
        case "apple":
          process.env.NEXT_PUBLIC_APPLE_TEAM_ID = CLIENT_ID;
          process.env.APPLE_MUSIC_KEY_ID = CLIENT_SECRET;
          break;
      }

      try {
        // Refresh token based on service
        let refreshedAuth;

        switch (service) {
          case "spotify":
            // Use directRequest=true to bypass the Next.js API route
            refreshedAuth = await refreshSpotifyToken(refreshToken, "target", true);
            break;
          case "apple":
            refreshedAuth = await refreshAppleToken(refreshToken, "target");
            break;
          case "youtube":
            // Use directRequest=true to bypass the Next.js API route
            refreshedAuth = await refreshYouTubeToken(refreshToken, "target", true);
            break;
          default:
            console.warn(`Token refresh not implemented for ${service}`);
            return;
        }

        // Add this check to handle null case gracefully
        if (!refreshedAuth) {
          console.error(`${service} token refresh failed, got null result`);
          throw new Error("Token refresh failed");
        }

        // Update the token cache with the new token data using writeTokenCacheToFile
        const updatedCache = {
          token: refreshedAuth.accessToken,
          refreshToken: refreshedAuth.refreshToken || refreshToken,
          expiresAt: refreshedAuth.timestamp + refreshedAuth.expiresIn * 1000,
        };
        writeTokenCacheToFile(service, updatedCache);
        console.log(`${service} token cache file updated with new token data and refresh token.`);

        expect(refreshedAuth).not.toBeNull();
        expect(refreshedAuth.accessToken).toBeDefined();
        expect(refreshedAuth.timestamp).toBeDefined();
        expect(refreshedAuth.expiresIn).toBeGreaterThan(0);

        // Refresh token may not always be returned
        if (service !== "youtube") {
          expect(refreshedAuth.refreshToken).toBeDefined();
        }
      } catch (error) {
        console.error("Test error:", error);
        throw error;
      }
    });
  });
});
