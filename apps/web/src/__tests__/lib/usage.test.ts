import { createClient } from "redis";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createKey, getUsage, incrementUsage } from "@/lib/redis";

// Use an isolated Redis instance; never fall back to the application's REDIS_URL.
const testUrl = process.env.REDIS_TEST_URL;
describe.skipIf(!testUrl)("atomic usage tracking", () => {
  const prefix = `test:usage-regression:${crypto.randomUUID()}`;
  const keys = Array.from({ length: 3 }, (_, index) => createKey(`${prefix}:${index}`));
  let client: ReturnType<typeof createClient>;
  beforeAll(async () => {
    vi.stubEnv("REDIS_URL", testUrl);
    client = createClient({ url: testUrl });
    await client.connect();
  });
  afterAll(async () => {
    await client.del(keys);
    await client.quit();
    vi.unstubAllEnvs();
  });
  it("does not lose increments or exceed the limit under concurrency", async () => {
    const results = await Promise.all(
      Array.from({ length: 40 }, () => incrementUsage(keys[0], 1, 25))
    );
    expect(results.filter(result => result.allowed)).toHaveLength(25);
    expect((await getUsage(keys[0])).usage).toBe(25);
  });
  it("preserves an existing reset time", async () => {
    await client.set(keys[1], "2", { EX: 60 });
    const result = await incrementUsage(keys[1], 3, 10);
    expect(result).toMatchObject({ allowed: true, usage: 5 });
    expect(result.ttl).toBeGreaterThan(0);
    expect(result.ttl).toBeLessThanOrEqual(60);
  });
  it("starts a new daily window for the first write", async () => {
    const result = await incrementUsage(keys[2], 1, 10);
    expect(result.ttl).toBeGreaterThan(86395);
    expect(result.ttl).toBeLessThanOrEqual(86400);
  });
});
