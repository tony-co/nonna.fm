import { generateAppleDeveloperToken, isTokenExpiringWithinDays, validateToken } from "./jwt";

// In-memory cache for the developer token
// In production, you might want to use Redis or another persistent cache
let cachedToken: string | null = null;
let tokenGeneratedAt: number | null = null;

// In-flight promise deduplication to prevent concurrent token generation
let tokenGenerationPromise: Promise<string> | null = null;

// Token refresh threshold - regenerate if expires within 7 days
const REFRESH_THRESHOLD_DAYS = 7;

/**
 * Gets a valid Apple Music developer token, generating a new one if needed
 * This function ensures we always have a valid, non-expiring token
 * Uses promise deduplication to prevent concurrent token generation
 */
export async function getValidDeveloperToken(): Promise<string> {
  try {
    // Check if we have a cached token and it's still valid
    if (cachedToken) {
      const validation = validateToken(cachedToken);

      // If token is valid and not expiring soon, return it
      if (validation.isValid && !isTokenExpiringWithinDays(cachedToken, REFRESH_THRESHOLD_DAYS)) {
        return cachedToken;
      }

      // Log token status for debugging
      if (!validation.isValid) {
        console.warn("Apple Music developer token is invalid, generating new one");
      } else if (validation.expiresAt) {
        console.warn(
          `Apple Music developer token expires at ${validation.expiresAt.toISOString()}, generating new one`
        );
      }
    }

    // Check if token generation is already in progress
    if (tokenGenerationPromise) {
      console.log("Token generation already in progress, waiting for completion");
      return await tokenGenerationPromise;
    }

    // Start token generation and store the promise
    tokenGenerationPromise = generateNewToken();

    try {
      const token = await tokenGenerationPromise;
      return token;
    } finally {
      // Clear the in-flight promise when done (success or failure)
      tokenGenerationPromise = null;
    }
  } catch (error) {
    console.error("Error managing Apple Music developer token:", error);
    throw new Error("Failed to obtain valid Apple Music developer token");
  }
}

/**
 * Internal function to generate a new token
 * Separated for better error handling and promise deduplication
 */
async function generateNewToken(): Promise<string> {
  // Generate a new token
  console.log("Generating new Apple Music developer token");
  const newToken = generateAppleDeveloperToken();

  // Validate the newly generated token
  const validation = validateToken(newToken);
  if (!validation.isValid) {
    throw new Error("Failed to generate valid Apple Music developer token");
  }

  // Update cache
  cachedToken = newToken;
  tokenGeneratedAt = Date.now();

  console.log(
    `New Apple Music developer token generated, expires at: ${validation.expiresAt?.toISOString()}`
  );
  return newToken;
}

/**
 * Forces regeneration of the developer token
 * Useful for manual token refresh or error recovery
 */
export async function refreshDeveloperToken(): Promise<string> {
  console.log("Force refreshing Apple Music developer token");
  cachedToken = null;
  tokenGeneratedAt = null;
  tokenGenerationPromise = null; // Clear any in-flight generation
  return getValidDeveloperToken();
}

/**
 * Gets token status information for debugging
 */
export function getTokenStatus(): {
  hasToken: boolean;
  generatedAt: Date | null;
  isValid: boolean;
  expiresAt: Date | null;
  daysUntilExpiry: number | null;
} {
  if (!cachedToken) {
    return {
      hasToken: false,
      generatedAt: null,
      isValid: false,
      expiresAt: null,
      daysUntilExpiry: null,
    };
  }

  const validation = validateToken(cachedToken);
  const daysUntilExpiry = validation.timeUntilExpiry
    ? Math.floor(validation.timeUntilExpiry / (24 * 60 * 60))
    : null;

  return {
    hasToken: true,
    generatedAt: tokenGeneratedAt ? new Date(tokenGeneratedAt) : null,
    isValid: validation.isValid,
    expiresAt: validation.expiresAt || null,
    daysUntilExpiry,
  };
}

/**
 * Clears the cached token - useful for testing or error recovery
 */
export function clearCachedToken(): void {
  console.log("Clearing cached Apple Music developer token");
  cachedToken = null;
  tokenGeneratedAt = null;
  tokenGenerationPromise = null; // Clear any in-flight generation
}
