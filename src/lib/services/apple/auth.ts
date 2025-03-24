import { decrypt, initializeEncryption } from "@/lib/auth/crypto";
import {
  AUTH_STORAGE_KEYS,
  AuthData,
  setAuthData,
  getAuthData,
  clearAuthData,
  setServiceType,
} from "@/lib/auth/constants";

interface AppleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export function getAppleMusicAuthData(role: "source" | "target"): AuthData | null {
  try {
    const authData = getAuthData(role);
    if (!authData || authData.serviceId !== "apple") {
      return null;
    }

    // Check if the token is expired
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

export function clearAppleMusicAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}

export async function initiateAppleAuth(role: "source" | "target"): Promise<boolean> {
  try {
    console.log("initiateAppleAuth - starting for role:", role);

    // Clear any existing auth data for this role
    clearAuthData(role);

    // Initialize MusicKit
    await window.MusicKit.configure({
      developerToken: process.env.NEXT_PUBLIC_APPLE_MUSIC_DEVELOPER_TOKEN || "",
      app: {
        name: "Nonna.fm",
        build: "1.0.0",
      },
    });

    // Get MusicKit instance
    const music = window.MusicKit.getInstance();

    // Authorize with MusicKit
    const musicUserToken = await music.authorize();
    console.log("MusicKit authorization successful");

    // Store the auth data
    setAppleMusicAuthData(role, {
      accessToken: musicUserToken,
      refreshToken: "", // MusicKit handles token refresh internally
      expiresIn: 3600, // 1 hour default, MusicKit will handle actual expiration
      timestamp: Date.now(),
      userId: "", // Will be populated later if needed
      displayName: "", // Will be populated later if needed
      tokenType: "Bearer", // MusicKit uses Bearer tokens
    });

    console.log("Apple Music authorization completed");
    return true;
  } catch (error) {
    console.error("initiateAppleAuth - error:", error);
    throw error;
  }
}

export async function handleAppleCallback(
  searchParams: string
): Promise<{ success: boolean; role?: "source" | "target" }> {
  console.log("Starting Apple callback handling...");

  // Initialize encryption before handling callback
  initializeEncryption();

  if (!searchParams) {
    console.error("No search params provided");
    return { success: false };
  }

  const params = new URLSearchParams(searchParams);
  const code = params.get("code");
  const receivedState = params.get("state");
  const error = params.get("error");

  console.log("Received params:", {
    hasCode: !!code,
    hasState: !!receivedState,
    error: error || "none",
  });

  if (error) {
    console.error("Apple auth error occurred");
    return { success: false };
  }

  // Verify state
  let storedState: { role: "source" | "target" } | null = null;
  try {
    const encryptedState =
      localStorage.getItem(AUTH_STORAGE_KEYS.SOURCE.STATE) ||
      localStorage.getItem(AUTH_STORAGE_KEYS.TARGET.STATE);
    if (encryptedState) {
      storedState = JSON.parse(decrypt(encryptedState));
    }
  } catch (error) {
    console.error("Failed to decrypt stored state:", error);
    return { success: false };
  }

  if (!storedState || !receivedState) {
    console.error("State validation failed");
    return { success: false };
  }

  try {
    const parsedReceivedState = JSON.parse(receivedState);
    if (parsedReceivedState.role !== storedState.role) {
      console.error("State role validation failed");
      return { success: false };
    }
  } catch (error) {
    console.error("Failed to parse received state:", error);
    return { success: false };
  }

  // Get stored code verifier from cookies
  let codeVerifier: string | null = null;
  try {
    const cookies = document.cookie.split(";");
    const verifierCookie = cookies.find(
      cookie =>
        cookie.trim().startsWith(AUTH_STORAGE_KEYS.SOURCE.CODE_VERIFIER) ||
        cookie.trim().startsWith(AUTH_STORAGE_KEYS.TARGET.CODE_VERIFIER)
    );
    if (verifierCookie) {
      codeVerifier = verifierCookie.split("=")[1].trim();
    }
  } catch (error) {
    console.error("Failed to get code verifier from cookies:", error);
    return { success: false };
  }

  if (!codeVerifier || !code) {
    console.error("Missing verifier or code");
    return { success: false };
  }

  console.log("State validation successful");

  // Exchange code for token with retry logic
  console.log("Starting token exchange...");
  let tokenResponse: Response | undefined;
  let retryCount = 0;
  const maxRetries = 3;
  const backoffMs = 1000;

  while (retryCount < maxRetries) {
    try {
      tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
          client_secret: process.env.APPLE_CLIENT_SECRET || "",
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || "",
          code_verifier: codeVerifier,
        }),
      });

      if (tokenResponse.ok) {
        break;
      }

      const errorText = await tokenResponse.text();
      console.warn(`Token exchange attempt ${retryCount + 1} failed:`, {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
      });

      // If we get a 400 error, the code might be invalid/expired - no point retrying
      if (tokenResponse.status === 400) {
        console.error("Token exchange failed with 400 - code might be invalid or expired");
        return { success: false };
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${backoffMs / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs * retryCount));
      }
    } catch (error) {
      console.error(`Network error during token exchange attempt ${retryCount + 1}:`, error);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${backoffMs / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, backoffMs * retryCount));
      } else {
        console.error("Max retries reached for token exchange");
        return { success: false };
      }
    }
  }

  if (!tokenResponse || !tokenResponse.ok) {
    console.error("All token exchange attempts failed");
    return { success: false };
  }

  console.log("Token exchange successful");
  let tokenData: AppleTokenResponse;
  try {
    tokenData = await tokenResponse.json();
  } catch (error) {
    console.error("Failed to parse token response:", error);
    return { success: false };
  }

  // Clear state and verifier
  clearAuthData(storedState.role);

  // Store auth data
  try {
    const authData: AuthData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      timestamp: Date.now(),
      userId: "",
      displayName: "",
      tokenType: tokenData.token_type,
      role: storedState.role,
      serviceId: "apple",
    };

    setAuthData(storedState.role, authData);
    setServiceType(storedState.role, "apple");
    return { success: true, role: storedState.role };
  } catch (error) {
    console.error("Failed to store auth data:", error);
    return { success: false };
  }
}

export async function getAppleAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const authData = getAuthData(role);
  if (!authData || authData.serviceId !== "apple") {
    return null;
  }

  // Check if token is expired or will expire in less than 5 minutes
  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const timeToExpiry = expirationTime - now;

  if (timeToExpiry <= 300000 && authData.refreshToken) {
    // 5 minutes in milliseconds
    return refreshAppleToken(authData.refreshToken, role);
  }

  return authData;
}

export async function refreshAppleToken(
  refreshToken: string,
  role: "source" | "target"
): Promise<AuthData | null> {
  try {
    const response = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "",
        client_secret: process.env.APPLE_CLIENT_SECRET || "",
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", response.statusText);
      return null;
    }

    const tokenData: AppleTokenResponse = await response.json();
    const authData: AuthData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || refreshToken, // Use old refresh token if new one is not provided
      expiresIn: tokenData.expires_in,
      timestamp: Date.now(),
      userId: "",
      displayName: "",
      tokenType: tokenData.token_type,
      role: role,
      serviceId: "apple",
    };

    setAuthData(role, authData);
    return authData;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export function clearAppleAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}
