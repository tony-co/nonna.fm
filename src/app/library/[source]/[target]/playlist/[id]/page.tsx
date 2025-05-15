import { Suspense } from "react";
import { MusicService } from "@/types";
import { Playlist } from "./_components/Playlist";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface PlaylistPageProps {
  params: Promise<{
    id: string;
    source: MusicService;
    target: MusicService;
  }>;
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Playlist playlistId={id} />
    </Suspense>
  );
}
