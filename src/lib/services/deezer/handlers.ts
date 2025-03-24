export const DEEZER_API_BASE = "https://api.deezer.com";

export interface DeezerTrack {
  id: number;
  title: string;
  duration: number;
  preview: string;
  link: string;
  artist: {
    name: string;
  };
  album: {
    title: string;
    cover_medium: string;
  };
}

export interface DeezerTracksResponse {
  data: DeezerTrack[];
  total: number;
  next?: string;
  error?: {
    message: string;
    type?: string;
    code?: number;
  };
}

/**
 * Fetches and transforms tracks from Deezer API
 */
export async function handlePlaylistTracksRequest(playlistId: string): Promise<Response> {
  try {
    const response = await fetch(`${DEEZER_API_BASE}/playlists/${playlistId}/tracks`);
    const data: DeezerTracksResponse = await response.json();

    if (!response.ok) {
      console.error("Deezer API error:", {
        status: response.status,
        url: `${DEEZER_API_BASE}/playlists/${playlistId}/tracks`,
        error: data.error,
      });
      return Response.json(
        { error: "Failed to fetch playlist tracks", status: response.status },
        { status: response.status }
      );
    }

    if (data.error) {
      return Response.json(
        { error: data.error.message || "Failed to fetch playlist tracks" },
        { status: 400 }
      );
    }

    if (!data.data || !Array.isArray(data.data)) {
      return Response.json({ error: "Invalid response format from Deezer API" }, { status: 500 });
    }

    // Transform the data to match our selection context format
    const tracks = data.data.map((track: DeezerTrack) => ({
      id: track.id.toString(),
      name: track.title,
      artist: track.artist.name,
      album: track.album.title,
      duration: track.duration,
      albumArt: track.album.cover_medium,
      previewUrl: track.preview,
      externalUrl: track.link,
      service: "deezer" as const,
    }));

    // Return in a format consistent with DeezerApiResponse
    return Response.json({
      data: tracks,
      total: data.total,
      next: data.next,
    });
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return Response.json({ error: "Failed to fetch playlist tracks" }, { status: 500 });
  }
}
