import "server-only";
import { NextResponse } from "next/server";

export async function exchangeOAuthToken(
  url: string,
  body: Record<string, string>,
  authorization?: string
): Promise<NextResponse> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: new URLSearchParams(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Token exchange failed" },
        {
          status: response.status >= 500 ? 502 : response.status,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }
    return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Authentication provider is unavailable" }, { status: 502 });
  }
}
