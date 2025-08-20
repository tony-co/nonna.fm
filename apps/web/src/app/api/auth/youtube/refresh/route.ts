import { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: "Missing refresh token" }), { status: 400 });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "",
        client_secret: process.env.YOUTUBE_CLIENT_SECRET || "",
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token refresh failed:", error);
      return new Response(JSON.stringify({ error: "Failed to refresh token" }), {
        status: tokenResponse.status,
      });
    }

    const tokenData = await tokenResponse.json();
    return new Response(JSON.stringify(tokenData));
  } catch (error) {
    console.error("Error refreshing YouTube token:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
