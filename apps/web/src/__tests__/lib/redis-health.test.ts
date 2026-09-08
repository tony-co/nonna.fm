import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/redis/route";

const { getUsage } = vi.hoisted(() => ({ getUsage: vi.fn() }));
vi.mock("@/lib/redis", () => ({ getUsage, createKey: (key: string) => `test:${key}` }));

function request(authorization?: string) {
  return new Request("https://nonna.fm/api/health/redis", {
    headers: authorization ? { Authorization: authorization } : {},
  });
}

beforeEach(() => {
  getUsage.mockReset().mockResolvedValue({ usage: 0, ttl: 0 });
  vi.stubEnv("CRON_SECRET", "test-cron-secret");
});
afterEach(() => vi.unstubAllEnvs());

describe("weekly Redis health check", () => {
  it.each([undefined, "Bearer wrong-secret"])("rejects unauthorized calls: %s", async header => {
    expect((await GET(request(header))).status).toBe(401);
    expect(getUsage).not.toHaveBeenCalled();
  });
  it("fails closed when the cron secret is missing", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await GET(request("Bearer "))).status).toBe(401);
    expect(getUsage).not.toHaveBeenCalled();
  });
  it("checks Redis without touching a user's transfer counter", async () => {
    const response = await GET(request("Bearer test-cron-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(getUsage).toHaveBeenCalledExactlyOnceWith("test:health:redis");
  });
  it("reports database failure instead of a healthy response", async () => {
    getUsage.mockRejectedValue(new Error("Connection unavailable"));
    const response = await GET(request("Bearer test-cron-secret"));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});
