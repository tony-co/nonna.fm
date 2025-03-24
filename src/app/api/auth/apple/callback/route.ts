import { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const transferData = request.cookies.get("apple_transfer_data")?.value;

    // Check for error in OAuth response
    if (error) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_error&message=${error}`
      );
    }

    // Verify state to prevent CSRF
    const storedState = request.cookies.get("apple_auth_state")?.value;
    if (!state || state !== storedState) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_error&message=invalid_state`
      );
    }

    if (!code) {
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_error&message=missing_code`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.APPLE_MUSIC_CLIENT_ID || "",
        client_secret: process.env.APPLE_MUSIC_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("Token exchange failed:", error);
      return Response.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_error&message=token_exchange_failed`
      );
    }

    const tokens = await tokenResponse.json();

    // Redirect to callback page with tokens and transfer data
    const callbackParams = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in.toString(),
    });

    if (transferData) {
      callbackParams.append("data", transferData);
    }

    // Clear cookies and redirect
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${process.env.NEXT_PUBLIC_APP_URL}/callback/apple?${callbackParams.toString()}`,
        "Set-Cookie": [
          "apple_auth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
          "apple_transfer_data=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
        ].join(", "),
      },
    });
  } catch (error) {
    console.error("Error handling Apple Music callback:", error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_failed`);
  }
}
