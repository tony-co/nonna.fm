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

const SOURCE_SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
];

const TARGET_SPOTIFY_SCOPES = [
  ...SOURCE_SPOTIFY_SCOPES,
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-modify",
];

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

async function fetchSpotifyUserProfile(accessToken: string): Promise<{ id: string }> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data = await response.json();
  return { id: data.id };
}

export async function initiateSpotifyAuth(role: "source" | "target"): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Spotify authentication can only be initiated in browser environment");
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

  const scopes = role === "source" ? SOURCE_SPOTIFY_SCOPES : TARGET_SPOTIFY_SCOPES;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri:
      process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL}/callback/spotify`,
    state: JSON.stringify(state),
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    show_dialog: "true",
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function handleSpotifyCallback(
  searchParams: string
): Promise<{ success: boolean; role?: "source" | "target" }> {
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
    console.error("Spotify auth error:", error);
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
      codeVerifier = decodeURIComponent(verifierCookie.split("=")[1].trim());
    }
  } catch (error) {
    console.error("Failed to get code verifier from cookies:", error);
    return { success: false };
  }

  if (!codeVerifier || !code) {
    console.error("Missing verifier or code", {
      hasCodeVerifier: Boolean(codeVerifier),
      hasCode: Boolean(code),
    });
    return { success: false };
  }

  let tokenResponse: Response | undefined;
  let retryCount = 0;
  const maxRetries = 3;
  const backoffMs = 1000;

  while (retryCount < maxRetries) {
    try {
      tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
          grant_type: "authorization_code",
          code,
          redirect_uri:
            process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI ||
            `${process.env.NEXT_PUBLIC_APP_URL}/callback/spotify`,
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

      // Invalid or expired authorization codes cannot be retried.
      if (tokenResponse.status === 400) {
        console.error("Token exchange failed with 400 - code might be invalid or expired");
        return { success: false };
      }

      retryCount++;
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, backoffMs * retryCount));
      }
    } catch (error) {
      console.error(`Network error during token exchange attempt ${retryCount + 1}:`, error);
      retryCount++;
      if (retryCount < maxRetries) {
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

  let tokenData: SpotifyTokenResponse;
  try {
    tokenData = await tokenResponse.json();
  } catch (error) {
    console.error("Failed to parse token response:", error);
    return { success: false };
  }

  clearAuthData(storedState.role);

  try {
    const userProfile = await fetchSpotifyUserProfile(tokenData.access_token);

    const authData: AuthData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      timestamp: Date.now(),
      userId: userProfile.id,
      tokenType: tokenData.token_type,
      role: storedState.role,
      serviceId: "spotify",
    };

    setAuthData(storedState.role, authData);
    setServiceType(storedState.role, "spotify");
    return { success: true, role: storedState.role };
  } catch (error) {
    console.error("Failed to store auth data:", error);
    return { success: false };
  }
}

export async function getSpotifyAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const authData = getAuthData(role);
  if (!authData || authData.serviceId !== "spotify") {
    return null;
  }

  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const timeToExpiry = expirationTime - now;

  if (timeToExpiry <= 300000 && authData.refreshToken) {
    return refreshSpotifyToken(authData.refreshToken, role);
  }

  if (timeToExpiry <= 0) {
    clearAuthData(role);
    return null;
  }
  return authData;
}

const refreshRequests = new Map<string, Promise<AuthData | null>>();

export async function refreshSpotifyToken(
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
    if (existingAuthData?.serviceId !== "spotify" || existingAuthData.refreshToken !== refreshToken)
      return null;
    const response = await fetch("/api/spotify/refresh", {
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
      serviceId: "spotify",
    };

    const currentAuthData = getAuthData(role);
    if (
      currentAuthData?.serviceId !== "spotify" ||
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

export function clearSpotifyAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}
