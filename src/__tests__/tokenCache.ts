import { refreshSpotifyToken, getSpotifyAuthData } from "../lib/services/spotify/auth";
import { getDeezerUserId } from "../lib/services/deezer/auth";
import { getYouTubeAuthData } from "../lib/services/youtube/auth";
import { getAppleMusicAuthData, refreshAppleToken } from "../lib/services/apple/auth";
import { AuthData } from "../lib/auth/constants";
import { MusicService } from "@/types/services";
import fs from "fs";
import path from "path";

interface ServiceTokenCache {
  token: string | null; // maps to accessToken in AuthData
  refreshToken: string | null;
  expiresAt: number | null; // timestamp when token expires
  userId?: string | null;
  tokenType?: string | null;
  serviceId?: string | null;
}

// Path to the token cache directory
const TOKEN_CACHE_DIR = path.join(process.cwd(), "tokens");

// Buffer time in milliseconds to refresh token before it actually expires (5 minutes)
const EXPIRY_BUFFER = 5 * 60 * 1000;

// List of supported music services for testing
export const SUPPORTED_TEST_SERVICES: MusicService[] = ["youtube"];

/**
 * Get the token cache file path for a specific service
 * @param service - The service identifier (e.g., 'spotify', 'youtube')
 * @returns The path to the token cache file
 */
function getTokenCacheFilePath(service: string): string {
  return path.join(TOKEN_CACHE_DIR, `token.${service}.json`);
}

/**
 * Read token cache from file
 * @param service - The service identifier (e.g., 'spotify', 'youtube')
 * @returns The token cache object
 */
export function readTokenCacheFromFile(service: string): ServiceTokenCache {
  try {
    // Ensure tokens directory exists
    if (!fs.existsSync(TOKEN_CACHE_DIR)) {
      fs.mkdirSync(TOKEN_CACHE_DIR, { recursive: true });
    }

    const cacheFilePath = getTokenCacheFilePath(service);

    // Check if file exists
    if (fs.existsSync(cacheFilePath)) {
      const fileContent = fs.readFileSync(cacheFilePath, "utf8");
      return JSON.parse(fileContent) as ServiceTokenCache;
    }
  } catch (error) {
    console.error(`Error reading token cache file for ${service}:`, error);
  }

  // Return default empty cache if file doesn't exist or there's an error
  return { token: null, refreshToken: null, expiresAt: null };
}

/**
 * Write token cache to file
 * @param service - The service identifier (e.g., 'spotify', 'youtube')
 * @param cache - The token cache to write
 */
export function writeTokenCacheToFile(service: string, cache: ServiceTokenCache): void {
  try {
    // Ensure tokens directory exists
    if (!fs.existsSync(TOKEN_CACHE_DIR)) {
      fs.mkdirSync(TOKEN_CACHE_DIR, { recursive: true });
    }

    const cacheFilePath = getTokenCacheFilePath(service);
    fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing token cache file for ${service}:`, error);
  }
}

/**
 * Get a valid access token for any supported service
 * @param service - The service identifier (e.g., 'spotify', 'youtube')
 * @param forceRefresh - Whether to force a token refresh regardless of cache
 * @returns Access token or null if unavailable
 */
export async function getCachedAccessToken(
  service: MusicService,
  forceRefresh = false
): Promise<AuthData | null> {
  // Read current cache from file
  const cache = readTokenCacheFromFile(service);
  const now = Date.now();

  // Return cached token if it's valid and not close to expiry
  if (!forceRefresh && cache.token && cache.expiresAt && now < cache.expiresAt - EXPIRY_BUFFER) {
    // Map cache to AuthData format
    return {
      accessToken: cache.token,
      refreshToken: cache.refreshToken || undefined,
      expiresIn: Math.floor((cache.expiresAt - now) / 1000),
      timestamp: now,
      userId: cache.userId || "unknown",
      tokenType: cache.tokenType || "Bearer",
      role: "target",
      serviceId: cache.serviceId || service,
    };
  }

  let authData: AuthData | null = null;
  let refreshedAuth: AuthData | null = null;

  // Get auth data based on service type
  switch (service) {
    case "spotify":
      authData = await getSpotifyAuthData("target");
      break;
    case "youtube":
      authData = await getYouTubeAuthData("target");
      break;
    case "apple":
      authData = await getAppleMusicAuthData("target");
      break;
    case "deezer":
      // Deezer doesn't use the same auth model, it uses user ID
      const userId = getDeezerUserId();
      if (userId) {
        authData = {
          accessToken: "deezer-no-token-needed",
          expiresIn: 3600,
          timestamp: Date.now(),
          userId: userId,
          tokenType: "Bearer",
          role: "target",
          serviceId: "deezer",
        };
      }
      break;
    default:
      throw new Error(`Unsupported service type: ${service}`);
  }

  if (!authData) {
    return null;
  }

  // Check if stored token is still valid
  if (
    !forceRefresh &&
    authData.accessToken &&
    authData.timestamp &&
    authData.expiresIn &&
    now < authData.timestamp + authData.expiresIn * 1000 - EXPIRY_BUFFER
  ) {
    // Update cache with existing valid token
    const updatedCache = {
      token: authData.accessToken,
      refreshToken: authData.refreshToken || cache.refreshToken,
      expiresAt: authData.timestamp + authData.expiresIn * 1000,
      userId: authData.userId,
      tokenType: authData.tokenType,
      serviceId: authData.serviceId,
    };
    writeTokenCacheToFile(service, updatedCache);
    return authData;
  }

  // Token needs refresh
  const refreshToken = authData.refreshToken || cache.refreshToken;
  if (refreshToken) {
    try {
      // Different refresh method depending on service
      switch (service) {
        case "spotify":
          refreshedAuth = await refreshSpotifyToken(refreshToken, "target", true);
          break;
        case "youtube":
          // YouTube refresh is private in auth.ts, we'll need to get a fresh token
          authData = await getYouTubeAuthData("target");
          refreshedAuth = authData;
          break;
        case "apple":
          refreshedAuth = await refreshAppleToken(refreshToken, "target");
          break;
        case "deezer":
          // Deezer doesn't use this token flow in our app
          console.log("Deezer doesn't support token refresh in the same way");
          break;
      }

      if (refreshedAuth?.accessToken) {
        // Update cache with new token and refresh token (if provided)
        const updatedCache = {
          token: refreshedAuth.accessToken,
          refreshToken: refreshedAuth.refreshToken || refreshToken,
          expiresAt: Date.now() + refreshedAuth.expiresIn * 1000,
          userId: refreshedAuth.userId,
          tokenType: refreshedAuth.tokenType,
          serviceId: refreshedAuth.serviceId,
        };

        writeTokenCacheToFile(service, updatedCache);
        return refreshedAuth;
      }
    } catch (error) {
      console.error(`Failed to refresh ${service} token:`, error);
    }
  }

  // Clear invalid cache
  const clearedCache = { token: null, refreshToken: cache.refreshToken, expiresAt: null };
  writeTokenCacheToFile(service, clearedCache);
  return null;
}

/**
 * Get a valid Spotify access token (legacy function for backward compatibility)
 */
export async function getCachedSpotifyAccessToken(
  service: string,
  forceRefresh = false
): Promise<AuthData | null> {
  return getCachedAccessToken("spotify", forceRefresh);
}
