import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  console.log("Spotify refresh token API handler started");

  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      console.error("No refresh token provided");
      return NextResponse.json({ error: "Refresh token is required" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    console.log("Environment variables:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      refreshTokenLength: refreshToken?.length,
    });

    if (!clientId || !clientSecret) {
      console.error("Missing client credentials:", {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      });
      return NextResponse.json({ error: "Missing client credentials" }, { status: 500 });
    }

    // Create Basic Auth header
    const buffer = Buffer.from(`${clientId}:${clientSecret}`);
    const base64Auth = buffer.toString("base64");

    console.log("Making request to Spotify API");

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64Auth}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
        }).toString(),
      });

      console.log("Spotify API response status:", response.status);

      const responseText = await response.text();
      console.log("Response body preview:", responseText.substring(0, 100));

      if (!response.ok) {
        console.error("Failed to refresh token:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText.substring(0, 200),
        });
        return NextResponse.json(
          {
            error: "Failed to refresh token",
            details: responseText,
          },
          { status: response.status }
        );
      }

      try {
        const tokenData = JSON.parse(responseText);
        console.log(
          "Token refresh successful. Access token received with length:",
          tokenData.access_token?.length
        );
        return NextResponse.json(tokenData);
      } catch (parseError) {
        console.error("Failed to parse token response:", parseError);
        return NextResponse.json(
          {
            error: "Failed to parse token response",
            details: responseText.substring(0, 100),
          },
          { status: 500 }
        );
      }
    } catch (fetchError) {
      console.error("Network error during token refresh:", fetchError);
      return NextResponse.json(
        {
          error: "Network error when connecting to Spotify",
          message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error in Spotify refresh token API:", error);
    return NextResponse.json(
      {
        error: "Server error processing refresh token request",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
