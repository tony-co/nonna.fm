import { NextResponse } from "next/server";
import { createUsageKey, getUsage } from "@/lib/redis";
import crypto from "crypto";

// Helper to hash platform user IDs
const hashPlatformId = (platformId: string): string => {
  return crypto.createHash("sha256").update(platformId).digest("hex");
};

// Get the platform user ID from the request header
const getPlatformUserId = async (req: Request): Promise<string> => {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new Error("No user ID provided");
  }
  return userId;
};

export async function GET(req: Request): Promise<NextResponse> {
  try {
    // Get platform user ID
    const platformUserId = await getPlatformUserId(req);
    const platformIdHash = hashPlatformId(platformUserId);

    // Create Redis key
    const usageKey = createUsageKey(platformIdHash);

    // Get current usage and TTL
    const { usage: currentUsage, ttl } = await getUsage(usageKey);

    // For now, hardcode isPremium to false
    const isPremium = false;

    return NextResponse.json({
      isPremium,
      currentUsage,
      resetInSeconds: ttl,
    });
  } catch (error) {
    console.error("Error getting user status:", error);
    return NextResponse.json({ error: "Failed to get usage status" }, { status: 500 });
  }
}
