import { NextRequest } from "next/server";
import { DEEZER_API_BASE, DeezerApiResponse, DeezerAlbum } from "@/lib/services/deezer/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;

    // Get any additional query params from the request
    const searchParams = request.nextUrl.searchParams.toString();
    const apiUrl = `${DEEZER_API_BASE}/user/${id}/albums${searchParams ? `?${searchParams}` : ""}`;

    const response = await fetch(apiUrl);
    const data: DeezerApiResponse<DeezerAlbum> = await response.json();

    if (!response.ok) {
      console.error("Deezer API error:", {
        status: response.status,
        url: apiUrl,
        error: data.error,
      });
      return Response.json(
        { error: "Failed to fetch user albums", status: response.status },
        { status: response.status }
      );
    }

    // Pass through the Deezer API response
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching user albums:", error);
    return Response.json({ error: "Failed to fetch user albums" }, { status: 500 });
  }
}
