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
  tokenType: string;
  role: "source" | "target";
  serviceId: string;
}

// Helper functions for managing auth storage
export function getAuthData(role: "source" | "target"): AuthData | null {
  if (typeof window === "undefined") {
    return null;
  }
  const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function setAuthData(role: "source" | "target", data: AuthData): void {
  if (typeof window === "undefined") {
    return;
  }
  const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
  localStorage.setItem(key, JSON.stringify(data));
}

export function clearAuthData(role: "source" | "target"): void {
  if (typeof window === "undefined") {
    return;
  }
  const keys = role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;
  Object.values(keys).forEach(key => localStorage.removeItem(key));
}

export function getServiceType(role: "source" | "target"): string {
  if (typeof window === "undefined") {
    throw new Error("Service type access not available in server environment");
  }
  const key =
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
  const serviceType = localStorage.getItem(key);

  if (!serviceType) {
    throw new Error(`No service type found for role: ${role}`);
  }

  return serviceType;
}

export function setServiceType(role: "source" | "target", serviceId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  const key =
    role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
  localStorage.setItem(key, serviceId);
}
