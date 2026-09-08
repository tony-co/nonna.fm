import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { exchangeOAuthToken } from "@/lib/server/oauth";

const schema = z.object({ refreshToken: z.string().min(1).max(8192) });
export async function POST(request: Request): Promise<NextResponse> {
  const body = schema.safeParse(await request.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid token request" }, { status: 400 });
  const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  if (!clientId || !clientSecret)
    return NextResponse.json({ error: "YouTube is not configured" }, { status: 503 });
  return exchangeOAuthToken("https://oauth2.googleapis.com/token", {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: body.data.refreshToken,
  });
}
