import {
  type AuthData,
  clearAuthData,
  getAuthData,
  setAuthData,
  setServiceType,
} from "@/lib/auth/constants";

/**
 * Get Apple Music (MusicKit) authentication data for a role
 * This handles MusicKit user tokens, not Apple Sign-In OAuth tokens
 */
export function getAppleMusicAuthData(role: "source" | "target"): AuthData | null {
  try {
    const authData = getAuthData(role);
    if (!authData || authData.serviceId !== "apple") {
      return null;
    }

    // Check if the MusicKit user token is expired
    if (Date.now() >= authData.timestamp + authData.expiresIn * 1000) {
      clearAuthData(role);
      return null;
    }

    return authData;
  } catch {
    console.error("Error retrieving Apple Music auth data");
    return null;
  }
}

/**
 * Store Apple Music (MusicKit) authentication data for a role
 * This handles MusicKit user tokens, not Apple Sign-In OAuth tokens
 */
export function setAppleMusicAuthData(
  role: "source" | "target",
  data: Omit<AuthData, "role" | "serviceId">
): void {
  try {
    const authData: AuthData = {
      ...data,
      role,
      serviceId: "apple",
    };
    setAuthData(role, authData);
    setServiceType(role, "apple");
  } catch {
    console.error("Error storing Apple Music auth data");
  }
}

/**
 * Clear Apple Music (MusicKit) authentication data
 * This handles MusicKit user tokens, not Apple Sign-In OAuth tokens
 */
export function clearAppleMusicAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}

/**
 * Get Apple Music authentication data with expiration check
 * This is a wrapper around getAppleMusicAuthData for async contexts
 * Note: MusicKit handles token refresh internally, so we don't need OAuth refresh logic
 */
export async function getAppleAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  // For MusicKit, we just return the stored auth data
  // MusicKit SDK handles token refresh automatically
  return getAppleMusicAuthData(role);
}
