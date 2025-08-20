(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/lib/auth/crypto.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearEncryption",
    ()=>clearEncryption,
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "generateCodeChallenge",
    ()=>generateCodeChallenge,
    "generateRandomString",
    ()=>generateRandomString,
    "initializeEncryption",
    ()=>initializeEncryption
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/index.js [app-client] (ecmascript)");
;
const ENCRYPTION_KEY_STORAGE = "encryption_key";
const STATE_STORAGE = "spotify_auth_state";
// We'll generate this key on app start and keep it in memory and localStorage
// This provides a basic level of encryption for the current session
let ENCRYPTION_KEY;
function initializeEncryption() {
    // Try to get existing key from localStorage
    const storedKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (storedKey) {
        ENCRYPTION_KEY = storedKey;
    } else {
        // Generate new key if none exists
        ENCRYPTION_KEY = generateRandomString(32);
        localStorage.setItem(ENCRYPTION_KEY_STORAGE, ENCRYPTION_KEY);
    }
}
function encrypt(text) {
    if (!ENCRYPTION_KEY) {
        throw new Error("Encryption not initialized");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AES"].encrypt(text, ENCRYPTION_KEY).toString();
}
function decrypt(ciphertext) {
    if (!ENCRYPTION_KEY) {
        initializeEncryption(); // Try to initialize if not already done
    }
    const bytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AES"].decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["enc"].Utf8);
}
function generateRandomString(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x)=>acc + possible[x % possible.length], "");
}
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function clearEncryption() {
    ENCRYPTION_KEY = "";
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
    localStorage.removeItem(STATE_STORAGE);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/auth/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_STORAGE_KEYS",
    ()=>AUTH_STORAGE_KEYS,
    "clearAuthData",
    ()=>clearAuthData,
    "getAuthData",
    ()=>getAuthData,
    "getServiceType",
    ()=>getServiceType,
    "setAuthData",
    ()=>setAuthData,
    "setServiceType",
    ()=>setServiceType
]);
const AUTH_STORAGE_KEYS = {
    SOURCE: {
        TOKEN: "nonna_source_token",
        STATE: "nonna_source_state",
        SERVICE: "nonna_source_service",
        CODE_VERIFIER: "nonna_source_code_verifier"
    },
    TARGET: {
        TOKEN: "nonna_target_token",
        STATE: "nonna_target_state",
        SERVICE: "nonna_target_service",
        CODE_VERIFIER: "nonna_target_code_verifier"
    }
};
function getAuthData(role) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
function setAuthData(role, data) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
    localStorage.setItem(key, JSON.stringify(data));
}
function clearAuthData(role) {
    const keys = role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;
    Object.values(keys).forEach((key)=>localStorage.removeItem(key));
}
function getServiceType(role) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
    const serviceType = localStorage.getItem(key);
    if (!serviceType) {
        throw new Error("No service type found for role: ".concat(role));
    }
    return serviceType;
}
function setServiceType(role, serviceId) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
    localStorage.setItem(key, serviceId);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/services/spotify/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSpotifyAuth",
    ()=>clearSpotifyAuth,
    "getSpotifyAuthData",
    ()=>getSpotifyAuthData,
    "handleSpotifyCallback",
    ()=>handleSpotifyCallback,
    "initiateSpotifyAuth",
    ()=>initiateSpotifyAuth,
    "refreshSpotifyToken",
    ()=>refreshSpotifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-client] (ecmascript)");
;
;
const SOURCE_SPOTIFY_SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read"
];
const TARGET_SPOTIFY_SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-modify"
];
async function fetchSpotifyUserProfile(accessToken) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: "Bearer ".concat(accessToken)
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        return {
            id: data.id
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}
async function initiateSpotifyAuth(role) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    // Clear any existing auth data for this role
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    const state = {
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateRandomString"])(16),
        role
    };
    const codeVerifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateRandomString"])(64);
    const codeChallenge = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateCodeChallenge"])(codeVerifier);
    // Store state and code verifier
    const stateKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE;
    const verifierKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
    try {
        localStorage.setItem(stateKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encrypt"])(JSON.stringify(state)));
        document.cookie = "".concat(verifierKey, "=").concat(codeVerifier, "; path=/; max-age=3600; SameSite=Lax");
    } catch (error) {
        console.error("Failed to store auth data:", error);
        throw new Error("Failed to initialize authentication");
    }
    const scopes = role === "source" ? SOURCE_SPOTIFY_SCOPES : TARGET_SPOTIFY_SCOPES;
    const params = new URLSearchParams({
        client_id: ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a") || "",
        response_type: "code",
        redirect_uri: "".concat(("TURBOPACK compile-time value", "https://nonnalocal.fm:3000"), "/callback/spotify"),
        state: JSON.stringify(state),
        scope: scopes.join(" "),
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        show_dialog: "true"
    });
    window.location.href = "https://accounts.spotify.com/authorize?".concat(params.toString());
}
async function handleSpotifyCallback(searchParams) {
    console.log("Starting Spotify callback handling in auth.ts...");
    // Initialize encryption before handling callback
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    if (!searchParams) {
        console.error("No search params provided");
        return {
            success: false
        };
    }
    const params = new URLSearchParams(searchParams);
    const code = params.get("code");
    const receivedState = params.get("state");
    const error = params.get("error");
    console.log("Received params:", {
        hasCode: !!code,
        hasState: !!receivedState,
        error: error || "none"
    });
    if (error) {
        console.error("Spotify auth error:", error);
        return {
            success: false
        };
    }
    // Verify state
    let storedState = null;
    try {
        const encryptedState = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE) || localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE);
        if (encryptedState) {
            storedState = JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decrypt"])(encryptedState));
        }
    } catch (error) {
        console.error("Failed to decrypt stored state:", error);
        return {
            success: false
        };
    }
    if (!storedState || !receivedState) {
        console.error("State missing", {
            hasStoredState: !!storedState,
            hasReceivedState: !!receivedState
        });
        return {
            success: false
        };
    }
    try {
        const parsedReceivedState = JSON.parse(receivedState);
        if (parsedReceivedState.role !== storedState.role) {
            console.error("State role mismatch");
            return {
                success: false
            };
        }
    } catch (error) {
        console.error("Failed to parse received state:", error);
        return {
            success: false
        };
    }
    // Get stored code verifier from cookies
    let codeVerifier = null;
    try {
        const cookies = document.cookie.split(";");
        const verifierKey = storedState.role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
        const verifierCookie = cookies.find((cookie)=>cookie.trim().startsWith("".concat(verifierKey, "=")));
        if (verifierCookie) {
            // Extract everything after the equals sign, properly handling URL encoding
            codeVerifier = decodeURIComponent(verifierCookie.split("=")[1].trim());
        }
    } catch (error) {
        console.error("Failed to get code verifier from cookies:", error);
        return {
            success: false
        };
    }
    if (!codeVerifier || !code) {
        console.error("Missing verifier or code", {
            hasCodeVerifier: !!codeVerifier,
            hasCode: !!code
        });
        return {
            success: false
        };
    }
    console.log("State and verifier validation successful");
    // Exchange code for token with retry logic
    console.log("Exchanging code for token...");
    let tokenResponse;
    let retryCount = 0;
    const maxRetries = 3;
    const backoffMs = 1000; // Start with 1 second delay
    while(retryCount < maxRetries){
        try {
            tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a") || "",
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: ("TURBOPACK compile-time value", "https://nonnalocal.fm:3000/callback/spotify") || "",
                    code_verifier: codeVerifier
                })
            });
            if (tokenResponse.ok) {
                break;
            }
            const errorText = await tokenResponse.text();
            console.warn("Token exchange attempt ".concat(retryCount + 1, " failed:"), {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorText
            });
            // If we get a 400 error, the code might be invalid/expired - no point retrying
            if (tokenResponse.status === 400) {
                console.error("Token exchange failed with 400 - code might be invalid or expired");
                return {
                    success: false
                };
            }
            retryCount++;
            if (retryCount < maxRetries) {
                console.log("Retrying in ".concat(backoffMs / 1000, " seconds..."));
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            }
        } catch (error) {
            console.error("Network error during token exchange attempt ".concat(retryCount + 1, ":"), error);
            retryCount++;
            if (retryCount < maxRetries) {
                console.log("Retrying in ".concat(backoffMs / 1000, " seconds..."));
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            } else {
                console.error("Max retries reached for token exchange");
                return {
                    success: false
                };
            }
        }
    }
    if (!tokenResponse || !tokenResponse.ok) {
        console.error("All token exchange attempts failed");
        return {
            success: false
        };
    }
    console.log("Token exchange successful");
    let tokenData;
    try {
        tokenData = await tokenResponse.json();
    } catch (error) {
        console.error("Failed to parse token response:", error);
        return {
            success: false
        };
    }
    // Clear state and verifier
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthData"])(storedState.role);
    // Store auth data
    try {
        // Fetch user profile
        const userProfile = await fetchSpotifyUserProfile(tokenData.access_token);
        const authData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            timestamp: Date.now(),
            userId: userProfile.id,
            tokenType: tokenData.token_type,
            role: storedState.role,
            serviceId: "spotify"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthData"])(storedState.role, authData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setServiceType"])(storedState.role, "spotify");
        return {
            success: true,
            role: storedState.role
        };
    } catch (error) {
        console.error("Failed to store auth data:", error);
        return {
            success: false
        };
    }
}
async function getSpotifyAuthData(role) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const authData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthData"])(role);
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
async function refreshSpotifyToken(refreshToken, role) {
    let directRequest = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
    try {
        if (!refreshToken || refreshToken.trim() === "") {
            throw new Error("Empty refresh token provided");
        }
        console.log("Attempting to refresh token with refresh token length:", refreshToken === null || refreshToken === void 0 ? void 0 : refreshToken.length);
        let responseData;
        // Get existing auth data to preserve user info
        const existingAuthData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthData"])(role);
        // For test environments, allow direct requests to Spotify API
        if (directRequest) {
            const clientId = ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a");
            const clientSecret = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.SPOTIFY_CLIENT_SECRET;
            if (!clientId || !clientSecret) {
                throw new Error("Missing Spotify client credentials");
            }
            // Create Basic Auth header
            const buffer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from("".concat(clientId, ":").concat(clientSecret));
            const base64Auth = buffer.toString("base64");
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: "Basic ".concat(base64Auth)
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: clientId
                }).toString()
            });
            if (!response.ok) {
                console.error("Direct Spotify API request failed:", response.status, response.statusText);
                return null;
            }
            responseData = await response.json();
        } else {
            // Use our server API endpoint (default approach)
            const refreshUrl = "".concat(("TURBOPACK compile-time value", "https://nonnalocal.fm:3000"), "/api/spotify/refresh");
            const response = await fetch(refreshUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
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
        const authData = {
            accessToken: responseData.access_token,
            refreshToken: responseData.refresh_token || refreshToken,
            expiresIn: responseData.expires_in,
            timestamp: Date.now(),
            userId: (existingAuthData === null || existingAuthData === void 0 ? void 0 : existingAuthData.userId) || "",
            tokenType: responseData.token_type || "Bearer",
            role: role,
            serviceId: "spotify"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthData"])(role, authData);
        return authData;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}
function clearSpotifyAuth(role) {
    if (role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthData"])("source");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAuthData"])("target");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/callback/spotify/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SpotifyCallback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function SpotifyCallbackContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SpotifyCallbackContent.useEffect": ()=>{
            const handleCallback = {
                "SpotifyCallbackContent.useEffect.handleCallback": async ()=>{
                    try {
                        // Get the raw search string from the URL
                        const searchString = searchParams.toString();
                        // Handle the callback and get the result
                        const { success, role } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["handleSpotifyCallback"])(searchString);
                        console.log("Callback result:", success, role);
                        if (!success) {
                            console.error("Failed to handle Spotify callback");
                            router.push("/");
                            return;
                        }
                        // Get service types for both source and target
                        const sourceService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getServiceType"])("source");
                        // For target role, ensure we have a source service
                        if (role === "target" && !sourceService) {
                            console.error("Cannot redirect to transfer: no source service configured");
                            router.push("/");
                            return;
                        }
                        // Build redirect URL with service parameters
                        const redirectUrl = role === "target" ? "/library/".concat(sourceService, "/spotify") : "/source?source=spotify";
                        console.log("Redirecting to:", redirectUrl);
                        router.push(redirectUrl);
                    } catch (error) {
                        console.error("Error during Spotify callback:", error);
                        router.push("/");
                    }
                }
            }["SpotifyCallbackContent.useEffect.handleCallback"];
            handleCallback();
        }
    }["SpotifyCallbackContent.useEffect"], [
        searchParams,
        router
    ]);
    // Return null while the effect is running
    return null;
}
_s(SpotifyCallbackContent, "8i1PHtDhDf9NMpKTkROQKKwA/RI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = SpotifyCallbackContent;
function SpotifyCallback() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/callback/spotify/page.tsx",
            lineNumber: 61,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SpotifyCallbackContent, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/callback/spotify/page.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/callback/spotify/page.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c1 = SpotifyCallback;
var _c, _c1;
__turbopack_context__.k.register(_c, "SpotifyCallbackContent");
__turbopack_context__.k.register(_c1, "SpotifyCallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_74b20108._.js.map