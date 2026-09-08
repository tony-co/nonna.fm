import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { incrementUsage } from "@/lib/redis";
import { getUsageKey } from "@/lib/server/usage";

const bodySchema = z.object({ count: z.number().int().positive().max(Number.MAX_SAFE_INTEGER) });

export async function POST(request: Request): Promise<NextResponse> {
  const usageKey = getUsageKey(request);
  if (!usageKey) return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  const body = bodySchema.safeParse(await request.json().catch(() => null));
  if (!body.success)
    return NextResponse.json({ error: "Invalid count parameter" }, { status: 400 });
  try {
    const result = await incrementUsage(usageKey, body.data.count);
    return NextResponse.json(
      {
        ...(result.allowed ? { success: true } : { error: "Daily transfer limit exceeded" }),
        currentUsage: result.usage,
        resetInSeconds: result.ttl,
      },
      { status: result.allowed ? 200 : 403, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error updating usage:", error);
    return NextResponse.json({ error: "Usage tracking is unavailable" }, { status: 503 });
  }
}
