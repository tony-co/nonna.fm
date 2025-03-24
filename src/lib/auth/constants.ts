export const AUTH_STORAGE_KEYS = {
  SOURCE: {
    TOKEN: "nonna_source_token",
    STATE: "nonna_source_state",
    SERVICE: "nonna_source_service",
    CODE_VERIFIER: "nonna_source_code_verifier",
  },
  TARGET: {
    TOKEN: "nonna_target_token",
    STATE: "nonna_target_state",
    SERVICE: "nonna_target_service",
    CODE_VERIFIER: "nonna_target_code_verifier",
  },
} as const;

export interface AuthData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  timestamp: number;
  userId: string;
  displayName: string;
  tokenType: string;
  role: "source" | "target";
  serviceId: string;
}

// Helper functions for managing auth storage
export function getAuthData(role: "source" | "target"): AuthData | null {
  const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function setAuthData(role: "source" | "target", data: AuthData): void {
  const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearAuthData(role: "source" | "target"): void {
  const keys = role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;
  Object.values(keys).forEach(key => localStorage.removeItem(key));
}

export function getServiceType(role: "source" | "target"): string | null {
  const key =
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
  return localStorage.getItem(key);
}

export function setServiceType(role: "source" | "target", serviceId: string): void {
  const key =
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
  localStorage.setItem(key, serviceId);
}
