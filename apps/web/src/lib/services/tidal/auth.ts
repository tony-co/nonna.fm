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

const SOURCE_TIDAL_SCOPES = ["user.read", "collection.read", "playlists.read"];

const TARGET_TIDAL_SCOPES = [
  "user.read",
  "collection.read",
  "playlists.read",
  "playlists.write",
  "collection.write",
];

interface TidalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

async function fetchTidalUserProfile(accessToken: string): Promise<{ id: string }> {
  try {
    const response = await fetch("https://openapi.tidal.com/v2/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    console.log("Tidal user profile:", data);
    return {
      id: data.data.id.toString(),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function initiateTidalAuth(role: "source" | "target"): Promise<void> {
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

  const scopes = role === "source" ? SOURCE_TIDAL_SCOPES : TARGET_TIDAL_SCOPES;

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_TIDAL_CLIENT_ID || "",
    response_type: "code",
    redirect_uri: process.env.NEXT_PUBLIC_TIDAL_REDIRECT_URI || "",
    state: JSON.stringify(state),
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  });

  window.location.href = `https://login.tidal.com/authorize?${params.toString()}`;
}

export async function handleTidalCallback(
  searchParams: string
): Promise<{ success: boolean; role?: "source" | "target" }> {
  console.log("Starting Tidal callback handling in auth.ts...");

  const params = new URLSearchParams(searchParams);
  const code = params.get("code");
  const stateParam = params.get("state");
  const error = params.get("error");

  if (error) {
    console.error("Tidal auth error:", error);
    return { success: false };
  }

  if (!code || !stateParam) {
    console.error("Missing code or state in callback");
    return { success: false };
  }

  let storedState;
  try {
    const stateJson = JSON.parse(stateParam);
    const stateKey =
      stateJson.role === "source" ? AUTH_STORAGE_KEYS.SOURCE.STATE : AUTH_STORAGE_KEYS.TARGET.STATE;
    const encryptedState = localStorage.getItem(stateKey);
    if (!encryptedState) {
      throw new Error("No stored state found");
    }
    storedState = JSON.parse(decrypt(encryptedState));
  } catch (error) {
    console.error("Failed to parse or validate state:", error);
    return { success: false };
  }

  // Verify state
  if (!storedState || storedState.value !== JSON.parse(stateParam).value) {
    console.error("State mismatch");
    return { success: false };
  }

  // Get code verifier
  const verifierKey =
    storedState.role === "source"
      ? AUTH_STORAGE_KEYS.SOURCE.CODE_VERIFIER
      : AUTH_STORAGE_KEYS.TARGET.CODE_VERIFIER;
  const codeVerifier = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${verifierKey}=`))
    ?.split("=")[1];

  if (!codeVerifier) {
    console.error("No code verifier found");
    return { success: false };
  }

  // Exchange code for tokens
  let tokenResponse: Response | null = null;
  const maxRetries = 3;
  let retryCount = 0;
  const backoffMs = 1000; // Start with 1 second delay

  while (retryCount < maxRetries) {
    try {
      tokenResponse = await fetch("https://auth.tidal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.NEXT_PUBLIC_TIDAL_CLIENT_ID || "",
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.NEXT_PUBLIC_TIDAL_REDIRECT_URI || "",
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
  let tokenData: TidalTokenResponse;
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
    // Fetch user profile
    const userProfile = await fetchTidalUserProfile(tokenData.access_token);

    const authData: AuthData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      timestamp: Date.now(),
      userId: userProfile.id,
      tokenType: tokenData.token_type,
      role: storedState.role,
      serviceId: "tidal",
    };

    setAuthData(storedState.role, authData);
    setServiceType(storedState.role, "tidal");
    return { success: true, role: storedState.role };
  } catch (error) {
    console.error("Failed to store auth data:", error);
    return { success: false };
  }
}

export async function getTidalAuthData(role: "source" | "target"): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const authData = getAuthData(role);
  if (!authData || authData.serviceId !== "tidal") {
    return null;
  }

  // Check if token is expired or will expire in less than 5 minutes
  const expirationTime = authData.timestamp + authData.expiresIn * 1000;
  const now = Date.now();
  const timeToExpiry = expirationTime - now;

  if (timeToExpiry <= 300000 && authData.refreshToken) {
    // 5 minutes in milliseconds
    return refreshTidalToken(authData.refreshToken, role);
  }

  return authData;
}

export async function refreshTidalToken(
  refreshToken: string,
  role: "source" | "target"
): Promise<AuthData | null> {
  try {
    if (!refreshToken || refreshToken.trim() === "") {
      throw new Error("Empty refresh token provided");
    }

    console.log("Attempting to refresh token with refresh token length:", refreshToken?.length);

    // Get existing auth data to preserve user info
    const existingAuthData = getAuthData(role);

    const response = await fetch("https://auth.tidal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_TIDAL_CLIENT_ID || "",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", response.status, response.statusText);
      return null;
    }

    const responseData = await response.json();

    if (!responseData.access_token) {
      console.error("Invalid token response - missing access_token:", responseData);
      return null;
    }

    const authData: AuthData = {
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token || refreshToken,
      expiresIn: responseData.expires_in,
      timestamp: Date.now(),
      userId: existingAuthData?.userId || "",
      tokenType: responseData.token_type || "Bearer",
      role: role,
      serviceId: "tidal",
    };

    setAuthData(role, authData);
    return authData;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}

export function clearTidalAuth(role?: "source" | "target"): void {
  if (role) {
    clearAuthData(role);
  } else {
    clearAuthData("source");
    clearAuthData("target");
  }
}
