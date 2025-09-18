import { AES, enc } from "crypto-js";

const ENCRYPTION_KEY_STORAGE = "encryption_key";
const STATE_STORAGE = "spotify_auth_state";

// We'll generate this key on app start and keep it in memory and localStorage
// This provides a basic level of encryption for the current session
let ENCRYPTION_KEY: string;

export function initializeEncryption(): void {
  // Check if running in browser environment
  if (typeof window === "undefined") {
    return;
  }

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

export function encrypt(text: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error("Encryption not initialized");
  }
  return AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  if (!ENCRYPTION_KEY) {
    initializeEncryption(); // Try to initialize if not already done
  }
  const bytes = AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return bytes.toString(enc.Utf8);
}

export function generateRandomString(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// For PKCE
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function clearEncryption(): void {
  ENCRYPTION_KEY = "";

  // Check if running in browser environment
  if (typeof window !== "undefined") {
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
    localStorage.removeItem(STATE_STORAGE);
  }
}
