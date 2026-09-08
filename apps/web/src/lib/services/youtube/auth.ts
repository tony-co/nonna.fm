import {
  AUTH_STORAGE_KEYS,
  type AuthData,
  clearAuthData,
  getAuthData,
  setAuthData,
  setServiceType,
} from "@/lib/auth/constants";
import {
  encrypt,
  generateCodeChallenge,
  generateRandomString,
  initializeEncryption,
} from "@/lib/auth/crypto";
import { validateOAuthState } from "@/lib/auth/state";

const YOUTUBE_READ_SCOPES = "https://www.googleapis.com/auth/youtube.readonly";
const YOUTUBE_WRITE_SCOPES = "https://www.googleapis.com/auth/youtube";

interface YouTubeTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export async function initiateYouTubeAuth(role: "source" | "target"): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("YouTube authentication can only be initiated in browser environment");
  }

  initializeEncryption();
  clearAuthData(role);

  const state = {
    value: generateRandomString(16),
    role,
  };

  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const keys = role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;

  try {
    localStorage.setItem(keys.STATE, encrypt(JSON.stringify(state)));
    // biome-ignore lint/suspicious/noDocumentCookie: Required for OAuth PKCE flow
    document.cookie = `${keys.CODE_VERIFIER}=${codeVerifier}; path=/; max-age=3600; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to store auth data:", error);
    throw new Error("Failed to initialize authentication");
  }

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
): Promise<{ success: boolean; role?: "source" | "target"; error?: string }> {
  initializeEncryption();

  if (!searchParams) {
    console.error("No search params provided");
    return { success: false };
  }

  const params = new URLSearchParams(searchParams);
  const code = params.get("code");
  const receivedState = params.get("state");
  const error = params.get("error");

  if (error) {
    console.error("YouTube auth error occurred");
    return { success: false };
  }

  const storedState = validateOAuthState(receivedState);
  if (!storedState) return { success: false };

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
    await tokenResponse.text();
    console.error("Token exchange failed");
    return { success: false };
  }

  let tokenData: YouTubeTokenResponse;
  try {
    tokenData = await tokenResponse.json();
  } catch (error) {
    console.error("Failed to parse token response:", error);
    return { success: false };
  }

  clearAuthData(storedState.role);

  try {
    const userProfile = await fetchYouTubeUserProfile(tokenData.access_token);

    const authData: AuthData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      timestamp: Date.now(),
      userId: userProfile.id,
      tokenType: tokenData.token_type,
      role: storedState.role,
      serviceId: "youtube",
    };

    setAuthData(storedState.role, authData);
    setServiceType(storedState.role, "youtube");
    return { success: true, role: storedState.role };
  } catch (error) {
    console.error("Failed to store auth data or fetch user profile:", error);

    if (error instanceof Error && error.message === "No channel found for user") {
      return {
        success: false,
        error: "You don't have a YouTube channel. Please create one to continue.",
        role: storedState.role,
      };
    }

    return { success: false };
  }
}

const refreshRequests = new Map<string, Promise<AuthData | null>>();

export async function refreshYouTubeToken(
  refreshToken: string,
  role: "source" | "target",
  _directRequest = false
): Promise<AuthData | null> {
  const key = `${role}:${refreshToken}`;
  const pending = refreshRequests.get(key);
  if (pending) return pending;
  const request = performTokenRefresh(refreshToken, role).finally(() =>
    refreshRequests.delete(key)
  );
  refreshRequests.set(key, request);
  return request;
}

async function performTokenRefresh(
  refreshToken: string,
  role: "source" | "target"
): Promise<AuthData | null> {
  try {
    if (!refreshToken.trim()) return null;
    const existingAuthData = getAuthData(role);
    if (existingAuthData?.serviceId !== "youtube" || existingAuthData.refreshToken !== refreshToken)
      return null;
    const response = await fetch("/api/auth/youtube/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const responseData: {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
      token_type?: string;
    } = await response.json();
    if (!responseData.access_token) {
      console.error("Invalid token response - missing access_token");
      return null;
    }

    const authData: AuthData = {
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token || refreshToken,
      expiresIn: responseData.expires_in,
      timestamp: Date.now(),
      userId: existingAuthData?.userId || "",
      tokenType: responseData.token_type || "Bearer",
      role,
      serviceId: "youtube",
    };

    const currentAuthData = getAuthData(role);
    if (
      currentAuthData?.serviceId !== "youtube" ||
      currentAuthData.refreshToken !== existingAuthData.refreshToken
    )
      return null;
    setAuthData(role, authData);
    return authData;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export async function getYouTubeAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const authData = getAuthData(role);
  if (!authData || authData.serviceId !== "youtube") {
    return null;
  }

  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const expirationThreshold = 5 * 60 * 1000;
  const isExpired = now >= expirationTime - expirationThreshold;

  if (!isExpired) return authData;

  if (authData.refreshToken) {
    const updatedAuthData = await refreshYouTubeToken(authData.refreshToken, role);

    if (updatedAuthData) return updatedAuthData;

    console.error("Token refresh failed, clearing auth data");
  }

  const currentAuthData = getAuthData(role);
  if (
    currentAuthData?.serviceId === "youtube" &&
    currentAuthData.refreshToken === authData.refreshToken
  )
    clearAuthData(role);
  return null;
}

export function clearYouTubeAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}

async function fetchYouTubeUserProfile(accessToken: string): Promise<{ id: string }> {
  const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=id&mine=true", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("No channel found for user");
  }

  return { id: data.items[0].id };
}
