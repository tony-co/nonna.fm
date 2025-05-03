import { useState, useEffect } from "react";
import { IPlaylist } from "@/types/library";
import { fetchPlaylistTracks, getSourceService } from "@/lib/musicApi";
import { useLibrary } from "@/contexts/LibraryContext";

interface UsePlaylistTracksReturn {
  playlist: IPlaylist | undefined;
  isLoading: boolean;
  error: string | null;
}

// Module-level Set to track which playlist IDs have been fetched
const fetchedPlaylists = new Set<string>();

export const usePlaylistTracks = (playlistId: string): UsePlaylistTracksReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, actions } = useLibrary();

  // Fetch tracks if they don't exist
  useEffect(() => {
    let isMounted = true;

    const fetchTracks = async (): Promise<void> => {
      if (!state || !state.playlists) return;

      // Get the existing playlist
      const existingPlaylist = state.playlists.get(playlistId);
      if (!existingPlaylist) {
        setError("Playlist not found");
        return;
      }

      // If we've already fetched for this playlist, do not fetch again (prevents infinite loop)
      if (fetchedPlaylists.has(playlistId)) {
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

        const tracks = await fetchPlaylistTracks(playlistId, sourceService);

        if (!isMounted) return;

        const updatedPlaylist = {
          ...existingPlaylist,
          tracks,
        };

        actions.updatePlaylist(updatedPlaylist);
      } catch (err) {
        if (!isMounted) return;
        const errorMessage = "Failed to fetch tracks. Please try again.";
        console.error("Error fetching playlist tracks:", err);
        setError(errorMessage);
      } finally {
        // Mark this playlist as fetched, regardless of success or failure, to prevent infinite loop
        fetchedPlaylists.add(playlistId);
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
    playlist: state?.playlists?.get(playlistId),
    isLoading,
    error,
  };
};
