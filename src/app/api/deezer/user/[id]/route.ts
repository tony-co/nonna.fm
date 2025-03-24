import { NextRequest } from "next/server";

const DEEZER_API_BASE = "https://api.deezer.com";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const response = await fetch(`${DEEZER_API_BASE}/user/${id}`);
    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch Deezer user" }, { status: response.status });
    }

    if (data.error) {
      return Response.json(
        { error: data.error.message || "Failed to fetch Deezer user" },
        { status: 400 }
      );
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching Deezer user:", error);
    return Response.json({ error: "Failed to fetch Deezer user" }, { status: 500 });
  }
}
