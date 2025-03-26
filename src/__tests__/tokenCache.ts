import { refreshSpotifyToken, getSpotifyAuthData } from "../lib/services/spotify/auth";
import { AuthData } from "../lib/auth/constants";
import fs from "fs";
import path from "path";

interface ServiceTokenCache {
  token: string | null; // maps to accessToken in AuthData
  refreshToken: string | null;
  expiresAt: number | null; // timestamp when token expires
  userId?: string | null;
  displayName?: string | null;
  tokenType?: string | null;
  serviceId?: string | null;
}

// Path to the token cache directory
const TOKEN_CACHE_DIR = path.join(process.cwd(), "tokens");

// Buffer time in milliseconds to refresh token before it actually expires (5 minutes)
const EXPIRY_BUFFER = 5 * 60 * 1000;

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
 * Get a valid Spotify access token, using cache if available and not expired
 * @param service - The service identifier (e.g., 'spotify', 'youtube')
 * @param forceRefresh - Whether to force a token refresh regardless of cache
 * @returns Access token or null if unavailable
 */
export async function getCachedSpotifyAccessToken(
  service: string,
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
      displayName: cache.displayName || "Unknown User",
      tokenType: cache.tokenType || "Bearer",
      role: "target",
      serviceId: cache.serviceId || service,
    };
  }

  // Try to get auth data from storage (using 'target' as default since we now use a single token)
  const authData = await getSpotifyAuthData("target");

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
      displayName: authData.displayName,
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
      const refreshedAuth = await refreshSpotifyToken(refreshToken, "target", true);

      if (refreshedAuth?.accessToken) {
        // Update cache with new token and refresh token (if provided)
        const updatedCache = {
          token: refreshedAuth.accessToken,
          refreshToken: refreshedAuth.refreshToken || refreshToken,
          expiresAt: Date.now() + refreshedAuth.expiresIn * 1000,
          userId: refreshedAuth.userId,
          displayName: refreshedAuth.displayName,
          tokenType: refreshedAuth.tokenType,
          serviceId: refreshedAuth.serviceId,
        };

        writeTokenCacheToFile(service, updatedCache);
        return refreshedAuth;
      }
    } catch (error) {
      console.error("Failed to refresh Spotify token:", error);
    }
  }

  // Clear invalid cache
  const clearedCache = { token: null, refreshToken: cache.refreshToken, expiresAt: null };
  writeTokenCacheToFile(service, clearedCache);
  return null;
}
