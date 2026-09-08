import { useEffect } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import type { IPlaylist } from "@/types";

interface UsePlaylistTracksReturn {
  playlist: IPlaylist | undefined;
  isLoading: boolean;
  error: string | null;
}

export function usePlaylistTracks(playlistId: string): UsePlaylistTracksReturn {
  const { state, operations } = useLibrary();
  const playlist = state.playlists?.get(playlistId);
  const load = state.playlistLoads?.[playlistId];
  const hasPlaylist = Boolean(playlist);

  useEffect(() => {
    if (hasPlaylist && !load) {
      void operations.loadPlaylist(playlistId).catch(() => {});
    }
  }, [hasPlaylist, load, operations, playlistId]);

  return {
    playlist,
    isLoading: hasPlaylist && (!load || load.status === "loading"),
    error: load?.error ?? null,
  };
}
