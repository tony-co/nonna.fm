import {
  encrypt,
  decrypt,
  generateRandomString,
  generateCodeChallenge,
  initializeEncryption,
} from "@/lib/auth/crypto";
import {
  AUTH_STORAGE_KEYS,
  AuthData,
  setAuthData,
  getAuthData,
  clearAuthData,
  setServiceType,
} from "@/lib/auth/constants";

// Readonly scope for source role
const YOUTUBE_READ_SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"].join(" ");

// Write scopes for target role
const YOUTUBE_WRITE_SCOPES = ["https://www.googleapis.com/auth/youtube"].join(" ");

interface YouTubeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function initiateYouTubeAuth(role: "source" | "target"): Promise<void> {
  initializeEncryption();

  // Clear any existing auth data for this role
  clearAuthData(role);

  const state = {
    value: generateRandomString(16),
    role,
  };

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store state and code verifier
  const stateKey =
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.STATE : AUTH_STORAGE_KEYS.TARGET.STATE;
  const verifierKey =
    role === "source"
      ? AUTH_STORAGE_KEYS.SOURCE.CODE_VERIFIER
      : AUTH_STORAGE_KEYS.TARGET.CODE_VERIFIER;

  try {
    localStorage.setItem(stateKey, encrypt(JSON.stringify(state)));
    document.cookie = `${verifierKey}=${codeVerifier}; path=/; max-age=3600; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to store auth data:", error);
    throw new Error("Failed to initialize authentication");
  }

  // Use appropriate scopes based on role
  const scopes = role === "source" ? YOUTUBE_READ_SCOPES : YOUTUBE_WRITE_SCOPES;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback/youtube`,
    state: JSON.stringify(state),
    scope: scopes,
    access_type: "offline",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    prompt: "consent",
  });

  if (!process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing required YouTube configuration");
  }

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function handleYouTubeCallback(
  searchParams: string
): Promise<{ success: boolean; role?: "source" | "target" }> {
  console.log("Starting YouTube callback handling...");

  initializeEncryption();

  if (!searchParams) {
    console.error("No search params provided");
    return { success: false };
  }

  const params = new URLSearchParams(searchParams);
  const code = params.get("code");
  const receivedState = params.get("state");
  const error = params.get("error");

  console.log("Received callback request");

  if (error) {
    console.error("YouTube auth error occurred");
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
  } catch {
    console.error("State validation failed");
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
  } catch {
    console.error("State validation failed");
    return { success: false };
  }

  // Get stored code verifier from cookies
  let codeVerifier: string | null = null;
  try {
    const cookies = document.cookie.split(";");
    const verifierKey =
      storedState.role === "source"
        ? AUTH_STORAGE_KEYS.SOURCE.CODE_VERIFIER
        : AUTH_STORAGE_KEYS.TARGET.CODE_VERIFIER;
    const verifierCookie = cookies.find(cookie => cookie.trim().startsWith(`${verifierKey}=`));
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

  // Exchange code for token
  console.log("Starting token exchange...");
  let tokenResponse: Response;
  try {
    tokenResponse = await fetch("/api/auth/youtube/callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        codeVerifier,
      }),
    });
  } catch {
    console.error("Network error during token exchange");
    return { success: false };
  }

  if (!tokenResponse.ok) {
    await tokenResponse.text(); // Consume the response
    console.error("Token exchange failed");
    return { success: false };
  }

  console.log("Token exchange successful");
  let tokenData: YouTubeTokenResponse;
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
      serviceId: "youtube",
    };

    setAuthData(storedState.role, authData);
    setServiceType(storedState.role, "youtube");
    return { success: true, role: storedState.role };
  } catch (error) {
    console.error("Failed to store auth data:", error);
    return { success: false };
  }
}

async function refreshYouTubeToken(refreshToken: string): Promise<YouTubeTokenResponse | null> {
  try {
    const response = await fetch("/api/auth/youtube/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await response.text(); // Consume the response
      console.error("Token refresh failed");
      return null;
    }

    return await response.json();
  } catch {
    console.error("Token refresh failed");
    return null;
  }
}

export async function getYouTubeAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const authData = getAuthData(role);
  if (!authData || authData.serviceId !== "youtube") {
    return null;
  }

  // Check if token is expired or about to expire (within 5 minutes)
  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const expirationThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  const isExpired = now >= expirationTime - expirationThreshold;

  console.log("Checking auth token status");

  // If token is expired and we have a refresh token, try to refresh
  if (isExpired && authData.refreshToken) {
    console.log("Starting token refresh...");
    const tokenData = await refreshYouTubeToken(authData.refreshToken);

    if (tokenData) {
      // Update auth data with new access token
      const updatedAuthData: AuthData = {
        ...authData,
        accessToken: tokenData.access_token,
        expiresIn: tokenData.expires_in,
        timestamp: Date.now(),
        // If a new refresh token is provided, update it
        refreshToken: tokenData.refresh_token || authData.refreshToken,
      };

      setAuthData(role, updatedAuthData);
      console.log("Token refresh successful");
      return updatedAuthData;
    } else {
      console.error("Token refresh failed, clearing auth data");
      clearAuthData(role);
      return null;
    }
  } else if (isExpired) {
    // Token is expired and we don't have a refresh token
    console.log("Auth token expired, no refresh token available");
    clearAuthData(role);
    return null;
  }

  // Token is still valid
  return authData;
}

export function clearYouTubeAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}
