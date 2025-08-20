import { NextRequest } from "next/server";
import { generateRandomString } from "@/lib/auth/crypto";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transferData = searchParams.get("data");

    // Generate state for security
    const state = generateRandomString(16);

    // Configure Sign in with Apple parameters
    const params = new URLSearchParams({
      client_id: process.env.APPLE_CLIENT_ID || "", // This should be your Services ID from Apple
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple/callback`,
      response_type: "code",
      state,
      response_mode: "form_post",
      scope: "name email",
    });

    // Create response with redirect and cookies
    return new Response(null, {
      status: 302,
      headers: {
        Location: `https://appleid.apple.com/auth/authorize?${params.toString()}`,
        "Set-Cookie": [
          `apple_auth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Secure`,
          transferData
            ? `apple_transfer_data=${encodeURIComponent(transferData)}; Path=/; HttpOnly; SameSite=Lax; Secure`
            : "",
        ]
          .filter(Boolean)
          .join(", "),
      },
    });
  } catch (error) {
    console.error("Error initiating Apple auth:", error);
    return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/?error=apple_auth_error`);
  }
}
