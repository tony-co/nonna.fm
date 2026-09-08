import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";
import { z } from "zod/v4";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const query = z.string().trim().min(1).max(500);
const schema = z.discriminatedUnion("method", [
  z.object({ method: z.literal("search"), params: z.object({ query }) }),
  z.object({ method: z.literal("searchSongs"), params: z.object({ query }) }),
  z.object({ method: z.literal("searchAlbums"), params: z.object({ query }) }),
  z.object({ method: z.literal("getPlaylist"), params: z.object({ playlistId: id }) }),
  z.object({ method: z.literal("getAlbum"), params: z.object({ albumId: id }) }),
  z.object({ method: z.literal("getSong"), params: z.object({ videoId: id }) }),
]);

// These methods read public catalog data. OAuth access tokens are not browser cookies.
let client: Promise<YTMusic> | undefined;
function getClient(): Promise<YTMusic> {
  if (!client) {
    const music = new YTMusic();
    client = music
      .initialize({ GL: "US", HL: "en" })
      .then(() => music)
      .catch(error => {
        client = undefined;
        throw error;
      });
  }
  return client;
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid catalog request" }, { status: 400 });
  const input = parsed.data;
  try {
    const music = await getClient();
    let data: unknown;
    switch (input.method) {
      case "search":
        data = await music.search(input.params.query);
        break;
      case "searchSongs":
        data = await music.searchSongs(input.params.query);
        break;
      case "searchAlbums":
        data = await music.searchAlbums(input.params.query);
        break;
      case "getPlaylist":
        data = await music.getPlaylist(input.params.playlistId);
        break;
      case "getAlbum":
        data = await music.getAlbum(input.params.albumId);
        break;
      case "getSong":
        data = await music.getSong(input.params.videoId);
        break;
    }
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "YouTube Music is unavailable" }, { status: 502 });
  }
}
