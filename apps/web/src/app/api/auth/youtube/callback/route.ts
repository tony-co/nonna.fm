import type { NextRequest } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { code, codeVerifier } = await request.json();

    if (!code || !codeVerifier) {
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
      });
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "",
        client_secret: process.env.YOUTUBE_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/callback/youtube`,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return new Response(JSON.stringify({ error: "Failed to exchange token" }), {
        status: tokenResponse.status,
      });
    }

    const tokenData = await tokenResponse.json();
    return new Response(JSON.stringify(tokenData));
  } catch (error) {
    console.error("Error in YouTube callback:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
