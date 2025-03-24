import { refreshSpotifyToken, getSpotifyAuthData } from "../lib/services/spotify/auth";
import fs from "fs";
import path from "path";

// Cache structure to hold tokens for both source and target
interface TokenCache {
  source: {
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  };
  target: {
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  };
}

// Path to the token cache file
const TOKEN_CACHE_FILE = path.join(process.cwd(), "tokens", "token.spotify.json");

// Buffer time in milliseconds to refresh token before it actually expires (5 minutes)
const EXPIRY_BUFFER = 5 * 60 * 1000;

/**
 * Read token cache from file
 * @returns The token cache object
 */
export function readTokenCacheFromFile(): TokenCache {
  try {
    // Ensure tokens directory exists
    const tokensDir = path.dirname(TOKEN_CACHE_FILE);
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir, { recursive: true });
    }

    // Check if file exists
    if (fs.existsSync(TOKEN_CACHE_FILE)) {
      const fileContent = fs.readFileSync(TOKEN_CACHE_FILE, "utf8");
      return JSON.parse(fileContent) as TokenCache;
    }
  } catch (error) {
    console.error("Error reading token cache file:", error);
  }

  // Return default empty cache if file doesn't exist or there's an error
  return {
    source: { token: null, refreshToken: null, expiresAt: null },
    target: { token: null, refreshToken: null, expiresAt: null },
  };
}

/**
 * Write token cache to file
 * @param cache - The token cache to write
 */
export function writeTokenCacheToFile(cache: TokenCache): void {
  try {
    // Ensure tokens directory exists
    const tokensDir = path.dirname(TOKEN_CACHE_FILE);
    if (!fs.existsSync(tokensDir)) {
      fs.mkdirSync(tokensDir, { recursive: true });
    }

    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing token cache file:", error);
  }
}

/**
 * Get a valid Spotify access token, using cache if available and not expired
 * @param role - 'source' or 'target' role
 * @param forceRefresh - Whether to force a token refresh regardless of cache
 * @returns Access token or null if unavailable
 */
export async function getCachedSpotifyAccessToken(
  role: "source" | "target",
  forceRefresh = false
): Promise<string | null> {
  // Read current cache from file
  const tokenCache = readTokenCacheFromFile();
  const cache = tokenCache[role];
  const now = Date.now();

  // Return cached token if it's valid and not close to expiry
  if (!forceRefresh && cache.token && cache.expiresAt && now < cache.expiresAt - EXPIRY_BUFFER) {
    return cache.token;
  }

  // Try to get auth data from storage
  const authData = await getSpotifyAuthData(role);

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
    tokenCache[role] = {
      token: authData.accessToken,
      refreshToken: authData.refreshToken || cache.refreshToken,
      expiresAt: authData.timestamp + authData.expiresIn * 1000,
    };
    writeTokenCacheToFile(tokenCache);
    return authData.accessToken;
  }

  // Token needs refresh
  const refreshToken = authData.refreshToken || cache.refreshToken;
  if (refreshToken) {
    try {
      const refreshedAuth = await refreshSpotifyToken(refreshToken, role, true);

      if (refreshedAuth?.accessToken) {
        // Update cache with new token and refresh token (if provided)
        tokenCache[role] = {
          token: refreshedAuth.accessToken,
          refreshToken: refreshedAuth.refreshToken || refreshToken,
          expiresAt: Date.now() + refreshedAuth.expiresIn * 1000,
        };

        writeTokenCacheToFile(tokenCache);
        return refreshedAuth.accessToken;
      }
    } catch (error) {
      console.error(`Failed to refresh ${role} Spotify token:`, error);
    }
  }

  // Clear invalid cache
  tokenCache[role] = { token: null, refreshToken: cache.refreshToken, expiresAt: null };
  writeTokenCacheToFile(tokenCache);
  return null;
}
