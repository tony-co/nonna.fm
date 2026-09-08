import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as refreshSpotify } from "@/app/api/spotify/refresh/route";
import { POST as updateUsage } from "@/app/api/transfer/usage/route";

const { increment } = vi.hoisted(() => ({ increment: vi.fn() }));
vi.mock("@/lib/redis", () => ({
  incrementUsage: increment,
  createUsageKey: (key: string) => `usage:${key}`,
}));
function request(body: unknown, userId = "spotify:user"): Request {
  return new Request("http://localhost/api/transfer/usage", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify(body),
  });
}
beforeEach(() => {
  increment.mockReset();
});
describe("usage route", () => {
  it.each([0, -1, 0.5, "2", null])("rejects invalid count %s", async count => {
    expect((await updateUsage(request({ count }))).status).toBe(400);
    expect(increment).not.toHaveBeenCalled();
  });
  it("rejects malformed JSON and missing identity", async () => {
    expect(
      (await updateUsage(new Request("http://localhost", { method: "POST", body: "{" }))).status
    ).toBe(400);
    expect((await updateUsage(request({ count: 1 }, ""))).status).toBe(400);
  });
  it("reports an atomic limit rejection without a second write", async () => {
    increment.mockResolvedValue({ allowed: false, usage: 10, ttl: 60 });
    const response = await updateUsage(request({ count: 2 }));
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ currentUsage: 10, resetInSeconds: 60 });
    expect(increment).toHaveBeenCalledTimes(1);
  });
});
describe("Spotify refresh route", () => {
  it("rejects malformed token requests before contacting the provider", async () => {
    expect((await refreshSpotify(request({ refreshToken: 1 }))).status).toBe(400);
    expect(
      (await refreshSpotify(new Request("http://localhost", { method: "POST", body: "{" }))).status
    ).toBe(400);
  });
});
