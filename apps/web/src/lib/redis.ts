import "server-only";
import { createClient } from "redis";
import { FREE_TIER_LIMIT } from "./constants";

type RedisClient = ReturnType<typeof createClient>;
let client: RedisClient | undefined;
let connection: Promise<RedisClient> | undefined;

async function getRedisClient(): Promise<RedisClient> {
  if (connection) return connection;
  if (client?.isReady) return client;
  if (!client) {
    const url = process.env.REDIS_URL;
    if (!url) throw new Error("REDIS_URL is required for usage tracking");
    client = createClient({
      url,
      socket: { connectTimeout: 5000, reconnectStrategy: false },
      disableOfflineQueue: true,
    });
    client.on("error", error => console.error("Redis connection error:", error.message));
  }
  const redis = client;
  connection = redis
    .connect()
    .then(() => redis)
    .finally(() => {
      connection = undefined;
    });
  return connection;
}

export const createKey = (key: string): string => `${process.env.NODE_ENV || "development"}:${key}`;
export const createUsageKey = (platformIdHash: string): string =>
  createKey(`usage:${platformIdHash}`);

export interface UsageInfo {
  usage: number;
  ttl: number;
}

// Check and increment in one operation. The window starts at the first transfer.
const incrementScript = `
local usage = tonumber(redis.call('GET', KEYS[1]) or '0')
local count = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local ttl = redis.call('TTL', KEYS[1])
if usage + count > limit then return {0, usage, math.max(0, ttl)} end
local updated = redis.call('INCRBY', KEYS[1], count)
if ttl < 0 then redis.call('EXPIRE', KEYS[1], 86400) end
return {1, updated, redis.call('TTL', KEYS[1])}
`;

export async function incrementUsage(
  usageKey: string,
  count = 1,
  limit = FREE_TIER_LIMIT
): Promise<UsageInfo & { allowed: boolean }> {
  if (!Number.isSafeInteger(count) || count <= 0)
    throw new RangeError("count must be a positive integer");
  const redis = await getRedisClient();
  const result = (await redis.eval(incrementScript, {
    keys: [usageKey],
    arguments: [String(count), String(limit)],
  })) as number[];
  return { allowed: result[0] === 1, usage: result[1], ttl: result[2] };
}

export async function getUsage(usageKey: string): Promise<UsageInfo> {
  const redis = await getRedisClient();
  const result = await redis.multi().get(usageKey).ttl(usageKey).exec();
  return { usage: Number(result[0] ?? 0), ttl: Math.max(0, Number(result[1])) };
}
