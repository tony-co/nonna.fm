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

const SOURCE_SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
];

const TARGET_SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
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

export async function initiateSpotifyAuth(role: "source" | "target"): Promise<void> {
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

  const scopes = role === "source" ? SOURCE_SPOTIFY_SCOPES : TARGET_SPOTIFY_SCOPES;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback/spotify`,
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
  console.log("Starting Spotify callback handling in auth.ts...");

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
    console.error("Spotify auth error:", error);
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
    console.error("State missing", {
      hasStoredState: !!storedState,
      hasReceivedState: !!receivedState,
    });
    return { success: false };
  }

  try {
    const parsedReceivedState = JSON.parse(receivedState);
    if (parsedReceivedState.role !== storedState.role) {
      console.error("State role mismatch");
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
    const verifierKey =
      storedState.role === "source"
        ? AUTH_STORAGE_KEYS.SOURCE.CODE_VERIFIER
        : AUTH_STORAGE_KEYS.TARGET.CODE_VERIFIER;
    const verifierCookie = cookies.find(cookie => cookie.trim().startsWith(`${verifierKey}=`));
    if (verifierCookie) {
      // Extract everything after the equals sign, properly handling URL encoding
      codeVerifier = decodeURIComponent(verifierCookie.split("=")[1].trim());
    }
  } catch (error) {
    console.error("Failed to get code verifier from cookies:", error);
    return { success: false };
  }

  if (!codeVerifier || !code) {
    console.error("Missing verifier or code", {
      hasCodeVerifier: !!codeVerifier,
      hasCode: !!code,
    });
    return { success: false };
  }

  console.log("State and verifier validation successful");

  // Exchange code for token with retry logic
  console.log("Exchanging code for token...");
  let tokenResponse: Response | undefined;
  let retryCount = 0;
  const maxRetries = 3;
  const backoffMs = 1000; // Start with 1 second delay

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
          redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "",
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
  let tokenData: SpotifyTokenResponse;
  try {
    tokenData = await tokenResponse.json();
  } catch (error) {
    console.error("Failed to parse token response:", error);
    return { success: false };
  }

  // Clear state and verifier
  clearAuthData(storedState.role);

  console.log("tony", tokenData);

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

  // Check if token is expired or will expire in less than 5 minutes
  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const timeToExpiry = expirationTime - now;

  if (timeToExpiry <= 300000 && authData.refreshToken) {
    // 5 minutes in milliseconds
    return refreshSpotifyToken(authData.refreshToken, role);
  }

  return authData;
}

export async function refreshSpotifyToken(
  refreshToken: string,
  role: "source" | "target",
  directRequest = false
): Promise<AuthData | null> {
  try {
    if (!refreshToken || refreshToken.trim() === "") {
      throw new Error("Empty refresh token provided");
    }

    console.log("Attempting to refresh token with refresh token length:", refreshToken?.length);

    let responseData;

    // For test environments, allow direct requests to Spotify API
    if (directRequest) {
      const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error("Missing Spotify client credentials");
      }

      // Create Basic Auth header
      const buffer = Buffer.from(`${clientId}:${clientSecret}`);
      const base64Auth = buffer.toString("base64");

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Auth}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
        }).toString(),
      });

      if (!response.ok) {
        console.error("Direct Spotify API request failed:", response.status, response.statusText);
        return null;
      }

      responseData = await response.json();
    } else {
      // Use our server API endpoint (default approach)
      const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/refresh`;

      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      try {
        responseData = await response.json();
      } catch (error) {
        console.error("Failed to parse response as JSON:", error);
        return null;
      }

      if (!response.ok) {
        console.error("Failed to refresh token:", response.status, response.statusText);
        console.error("Error details:", responseData);
        return null;
      }
    }

    if (!responseData.access_token) {
      console.error("Invalid token response - missing access_token:", responseData);
      return null;
    }

    const authData: AuthData = {
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token || refreshToken, // Use old refresh token if new one is not provided
      expiresIn: responseData.expires_in,
      timestamp: Date.now(),
      userId: "",
      displayName: "",
      tokenType: responseData.token_type || "Bearer",
      role: role,
      serviceId: "spotify",
    };

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
