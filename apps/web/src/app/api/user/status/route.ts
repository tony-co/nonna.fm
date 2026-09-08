import { NextResponse } from "next/server";
import { getUsage } from "@/lib/redis";
import { getUsageKey } from "@/lib/server/usage";

export async function GET(request: Request): Promise<NextResponse> {
  const usageKey = getUsageKey(request);
  if (!usageKey) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  try {
    const { usage, ttl } = await getUsage(usageKey);
    return NextResponse.json(
      { isPremium: false, currentUsage: usage, resetInSeconds: ttl },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error getting user status:", error);
    return NextResponse.json({ error: "Usage tracking is unavailable" }, { status: 503 });
  }
}
