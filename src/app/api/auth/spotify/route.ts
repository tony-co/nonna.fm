import { NextResponse } from "next/server";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-library-read",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-library-modify",
].join(" ");

export async function GET(): Promise<NextResponse> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    return NextResponse.json({ error: "Spotify client configuration is missing" }, { status: 500 });
  }

  // Generate a random state string for security
  const state = Math.random().toString(36).substring(2, 15);

  // Store state in session for verification later
  // This should be implemented with a proper session management system

  // Build the Spotify authorization URL
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    state: state,
    scope: SPOTIFY_SCOPES,
  });

  // Redirect to Spotify authorization page
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
