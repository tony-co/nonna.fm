import { NextResponse } from "next/server";
import { createUsageKey, getUsage, incrementUsage } from "@/lib/redis";
import { FREE_TIER_LIMIT, PREMIUM_TIER_LIMIT } from "@/lib/constants";
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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await req.json();
    const { count } = body;

    // Validate count
    if (!count || typeof count !== "number" || count <= 0) {
      return NextResponse.json({ error: "Invalid count parameter" }, { status: 400 });
    }

    // Get platform user ID
    const platformUserId = await getPlatformUserId(req);
    const platformIdHash = hashPlatformId(platformUserId);

    // Create Redis key
    const usageKey = createUsageKey(platformIdHash);

    // Get current usage
    const { usage: currentUsage, ttl } = await getUsage(usageKey);

    // Calculate new usage
    const newUsage = currentUsage + count;

    // Check if new usage exceeds limit
    const isPremium = false; // Hardcoded for now

    if (newUsage > FREE_TIER_LIMIT && !isPremium) {
      return NextResponse.json(
        {
          error: "Daily transfer limit exceeded",
          currentUsage,
          resetInSeconds: ttl,
        },
        { status: 403 }
      );
    }

    if (newUsage > PREMIUM_TIER_LIMIT && isPremium) {
      return NextResponse.json(
        {
          error: "Daily transfer limit exceeded",
          currentUsage,
          resetInSeconds: ttl,
        },
        { status: 403 }
      );
    }

    // Increment the usage count and set 24-hour TTL
    await incrementUsage(usageKey, count);

    return NextResponse.json({
      success: true,
      currentUsage: newUsage,
    });
  } catch (error) {
    console.error("Error updating usage:", error);
    return NextResponse.json({ error: "Failed to update usage" }, { status: 500 });
  }
}
