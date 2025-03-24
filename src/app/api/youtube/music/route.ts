import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

// Create a map to store initialized YTMusic instances by token
const ytmusicInstances: Map<string, YTMusic> = new Map();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await request.json();
    const { method, params, token } = body;

    if (!method || !token) {
      return NextResponse.json(
        { error: "Invalid request. Missing method or token." },
        { status: 400 }
      );
    }

    // Get or create a YTMusic instance for this token
    let ytmusic = ytmusicInstances.get(token);
    if (!ytmusic) {
      ytmusic = new YTMusic();

      // Initialize with the provided token
      await ytmusic.initialize({
        cookies: `SAPISID=${token}; SID=${token}; __Secure-3PAPISID=${token}`,
        GL: "US",
        HL: "en",
      });

      ytmusicInstances.set(token, ytmusic);
    }

    // Call the requested method with the provided parameters
    let result;
    switch (method) {
      case "search":
        result = await ytmusic.search(params.query);
        break;
      case "searchSongs":
        result = await ytmusic.searchSongs(params.query);
        break;
      case "getPlaylist":
        result = await ytmusic.getPlaylist(params.playlistId);
        break;
      case "getAlbum":
        result = await ytmusic.getAlbum(params.albumId);
        break;
      case "getSong":
        result = await ytmusic.getSong(params.videoId);
        break;
      default:
        return NextResponse.json({ error: `Method ${method} not supported` }, { status: 400 });
    }

    return NextResponse.json({ data: result });
  } catch (error: unknown) {
    console.error("YouTube Music API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
