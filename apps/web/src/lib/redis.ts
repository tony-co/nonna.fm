import { createClient } from "redis";
// WARNING: This module contains server-only code and should NEVER be imported in client components
import { FREE_TIER_LIMIT, PREMIUM_TIER_LIMIT } from "./constants";
import { env } from "../env.server.mjs";

// Initialize Redis client with validated environmental URL
export const redis = createClient({
  url: env.REDIS_URL || "",
});

// Add error handling
redis.on("error", err => {
  console.error("Redis Client Error:", err);
});

// Connect to Redis only when needed (lazy initialization)
async function getRedisClient(): Promise<typeof redis> {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
    return redis;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
}

// Get current environment to prefix keys
const getEnvPrefix = (): string => {
  const env = process.env.NODE_ENV || "development";
  return `${env}:`;
};

// Helper to create prefixed keys
export const createKey = (key: string): string => {
  return `${getEnvPrefix()}${key}`;
};

// Usage tracking keys and functions
export const createUsageKey = (platformIdHash: string): string => {
  return createKey(`usage:${platformIdHash}`);
};

// Re-export the constant for backward compatibility
export { FREE_TIER_LIMIT, PREMIUM_TIER_LIMIT };

// Helper to get and increment usage, ensuring proper TTL setting
export async function incrementUsage(usageKey: string, count: number = 1): Promise<number> {
  const client = await getRedisClient();

  // Get the current value
  const currentValue = await client.get(usageKey);
  const newValue = parseInt(currentValue || "0", 10) + count;

  // Set the new value with TTL (24 hours)
  await client.set(usageKey, newValue.toString(), {
    EX: 86400, // 24 hours in seconds
  });

  return newValue;
}

// Helper to get usage count and TTL
export interface UsageInfo {
  usage: number;
  ttl: number;
}

export async function getUsage(usageKey: string): Promise<UsageInfo> {
  const client = await getRedisClient();
  const [value, ttl] = await Promise.all([client.get(usageKey), client.ttl(usageKey)]);
  return {
    usage: parseInt(value || "0", 10),
    ttl: ttl,
  };
}
