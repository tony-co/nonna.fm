import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { exchangeOAuthToken } from "@/lib/server/oauth";

const schema = z.object({
  code: z.string().min(1).max(8192),
  codeVerifier: z.string().min(43).max(128),
});
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
    grant_type: "authorization_code",
    code: body.data.code,
    code_verifier: body.data.codeVerifier,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback/youtube`,
  });
}
