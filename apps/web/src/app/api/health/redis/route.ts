import { NextResponse } from "next/server";
import { createKey, getUsage } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await getUsage(createKey("health:redis"));
    return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Redis health check failed");
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
