"use client";

import { FC, useEffect, useRef } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useSearchTracks } from "@/hooks/useSearchTracks";
import { useParams } from "next/navigation";
import { AlbumList } from "@/components/library/AlbumList";
import type { MusicService } from "@/types/services";

export const Albums: FC = () => {
  const { state } = useLibrary();
  const { matchAlbums } = useSearchTracks();
  const params = useParams();
  const target = params.target as MusicService;
  const hasStartedMatching = useRef(false);

  // Trigger matching for all albums when component mounts
  useEffect(() => {
    if (state.albums && !hasStartedMatching.current) {
      hasStartedMatching.current = true;
      matchAlbums(Array.from(state.albums), target);
    }
  }, [state.albums, matchAlbums, target]);

  return <AlbumList />;
};
