import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/apple/developer-token/route";

// Mock the token manager module
vi.mock("@/lib/services/apple/token-manager", () => ({
  getValidDeveloperToken: vi.fn(),
  getTokenStatus: vi.fn(),
  refreshDeveloperToken: vi.fn(),
}));

// Mock the environment variables
vi.mock("@/env.server.mjs", () => ({
  env: {
    APPLE_MUSIC_PRIVATE_KEY:
      "-----BEGIN PRIVATE KEY-----\nMOCK_PRIVATE_KEY\n-----END PRIVATE KEY-----",
    APPLE_MUSIC_TEAM_ID: "MOCK_TEAM_ID",
    APPLE_MUSIC_KEY_ID: "MOCK_KEY_ID",
  },
}));

describe("/api/apple/developer-token", () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    // Set up default successful mocks
    const { getValidDeveloperToken, getTokenStatus } = vi.mocked(
      await import("@/lib/services/apple/token-manager")
    );
    getValidDeveloperToken.mockResolvedValue("mock-jwt-token");
    getTokenStatus.mockReturnValue({
      hasToken: true,
      generatedAt: new Date(),
      isValid: true,
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 180,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("GET", () => {
    it("returns a valid developer token with debug info", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("token", "mock-jwt-token");
      expect(data).toHaveProperty("debug");
      expect(data.debug).toHaveProperty("generatedAt");
      expect(data.debug).toHaveProperty("expiresAt");
      expect(data.debug).toHaveProperty("daysUntilExpiry");

      // Validate cache headers
      expect(response.headers.get("Cache-Control")).toBe("no-store, no-cache, must-revalidate");
      expect(response.headers.get("Pragma")).toBe("no-cache");
      expect(response.headers.get("Expires")).toBe("0");
    });

    it("handles token generation errors gracefully", async () => {
      // Mock the token manager to throw an error
      const { getValidDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );
      getValidDeveloperToken.mockRejectedValue(new Error("Token generation failed"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("error", "Failed to obtain valid developer token");
    });

    it("handles missing environment variables", async () => {
      // Mock the token manager to throw an environment error
      const { getValidDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );
      getValidDeveloperToken.mockRejectedValue(
        new Error("Missing required Apple Music configuration")
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("error", "Failed to obtain valid developer token");
    });
  });

  describe("POST", () => {
    it("returns a valid developer token with debug info", async () => {
      // Mock the refresh function
      const { refreshDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );
      refreshDeveloperToken.mockResolvedValue("refreshed-mock-jwt-token");

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("success", true);
      expect(data).toHaveProperty("token", "refreshed-mock-jwt-token");
      expect(data).toHaveProperty("refreshed", true);
      expect(data).toHaveProperty("debug");

      // Validate cache headers
      expect(response.headers.get("Cache-Control")).toBe("no-store, no-cache, must-revalidate");
      expect(response.headers.get("Pragma")).toBe("no-cache");
      expect(response.headers.get("Expires")).toBe("0");
    });

    it("handles token refresh errors gracefully", async () => {
      // Mock the refresh function to throw an error
      const { refreshDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );
      refreshDeveloperToken.mockRejectedValue(new Error("Token refresh failed"));

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("success", false);
      expect(data).toHaveProperty("error", "Failed to refresh developer token");
    });
  });

  describe("Token validation", () => {
    it("calls getValidDeveloperToken for GET requests", async () => {
      const { getValidDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );

      await GET();

      expect(getValidDeveloperToken).toHaveBeenCalledTimes(1);
    });

    it("calls refreshDeveloperToken for POST requests", async () => {
      const { refreshDeveloperToken } = vi.mocked(
        await import("@/lib/services/apple/token-manager")
      );
      refreshDeveloperToken.mockResolvedValue("refreshed-token");

      await POST();

      expect(refreshDeveloperToken).toHaveBeenCalledTimes(1);
    });

    it("calls getTokenStatus for debug information", async () => {
      const { getTokenStatus } = vi.mocked(await import("@/lib/services/apple/token-manager"));

      await GET();

      expect(getTokenStatus).toHaveBeenCalledTimes(1);
    });
  });
});
