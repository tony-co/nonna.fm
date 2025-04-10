import { useState, useEffect } from "react";
import { IPlaylist } from "@/types/library";
import { fetchPlaylistCurator } from "@/lib/services/apple/api";
import { fetchPlaylistTracks, getSourceService } from "@/lib/musicApi";
import { useLibrary } from "@/contexts/LibraryContext";

interface UsePlaylistTracksReturn {
  playlist: IPlaylist | undefined;
  isLoading: boolean;
  error: string | null;
}

export const usePlaylistTracks = (playlistId: string): UsePlaylistTracksReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, actions } = useLibrary();

  // Fetch tracks if they don't exist
  useEffect(() => {
    let isMounted = true;

    const fetchTracks = async (): Promise<void> => {
      if (!state) return;

      // Get the existing playlist
      const existingPlaylist = state.playlists.get(playlistId);
      if (!existingPlaylist) {
        setError("Playlist not found");
        return;
      }

      // Only fetch if tracks array is empty or undefined
      if (existingPlaylist.tracks && existingPlaylist.tracks.length > 0) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const sourceService = await getSourceService();

        // Fetch owner for Apple Music playlists
        let curatorName = "";
        if (sourceService === "apple") {
          const curator = await fetchPlaylistCurator(playlistId);
          curatorName = curator?.data?.[0]?.attributes?.curatorName || "";
        }

        const tracks = await fetchPlaylistTracks(playlistId, sourceService);

        if (!isMounted) return;

        const updatedPlaylist = {
          ...existingPlaylist,
          tracks,
          ...(sourceService === "apple" && curatorName ? { ownerName: curatorName } : {}),
        };

        const updatedPlaylists = new Map(state.playlists);
        updatedPlaylists.set(playlistId, updatedPlaylist);
        actions.setPlaylists(updatedPlaylists);
      } catch (err) {
        if (!isMounted) return;
        const errorMessage = "Failed to fetch tracks. Please try again.";
        console.error("Error fetching playlist tracks:", err);
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTracks();

    return () => {
      isMounted = false;
    };
  }, [playlistId, state, actions]);

  return {
    playlist: state?.playlists.get(playlistId),
    isLoading,
    error,
  };
};
