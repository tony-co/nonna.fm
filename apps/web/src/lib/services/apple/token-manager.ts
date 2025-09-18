import { generateAppleDeveloperToken, validateToken, isTokenExpiringWithinDays } from "./jwt";

// In-memory cache for the developer token
// In production, you might want to use Redis or another persistent cache
let cachedToken: string | null = null;
let tokenGeneratedAt: number | null = null;

// Token refresh threshold - regenerate if expires within 7 days
const REFRESH_THRESHOLD_DAYS = 7;

/**
 * Gets a valid Apple Music developer token, generating a new one if needed
 * This function ensures we always have a valid, non-expiring token
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

    // Generate a new token
    console.log("Generating new Apple Music developer token");
    cachedToken = generateAppleDeveloperToken();
    tokenGeneratedAt = Date.now();

    // Validate the newly generated token
    const validation = validateToken(cachedToken);
    if (!validation.isValid) {
      throw new Error("Failed to generate valid Apple Music developer token");
    }

    console.log(
      `New Apple Music developer token generated, expires at: ${validation.expiresAt?.toISOString()}`
    );
    return cachedToken;
  } catch (error) {
    console.error("Error managing Apple Music developer token:", error);
    throw new Error("Failed to obtain valid Apple Music developer token");
  }
}

/**
 * Forces regeneration of the developer token
 * Useful for manual token refresh or error recovery
 */
export async function refreshDeveloperToken(): Promise<string> {
  console.log("Force refreshing Apple Music developer token");
  cachedToken = null;
  tokenGeneratedAt = null;
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
}
