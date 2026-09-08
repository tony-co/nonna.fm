import { AUTH_STORAGE_KEYS } from "./constants";
import { decrypt } from "./crypto";

export function validateOAuthState(
  receivedState: string | null
): { role: "source" | "target" } | null {
  if (!receivedState || typeof window === "undefined") return null;
  try {
    const received = JSON.parse(receivedState);
    if (
      (received.role !== "source" && received.role !== "target") ||
      typeof received.value !== "string" ||
      received.value.length < 16
    )
      return null;
    const keys = received.role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;
    const encrypted = localStorage.getItem(keys.STATE);
    if (!encrypted) return null;
    const stored = JSON.parse(decrypt(encrypted));
    if (stored.role !== received.role || stored.value !== received.value) return null;
    return { role: received.role };
  } catch {
    return null;
  }
}
