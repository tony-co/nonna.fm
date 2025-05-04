import { useState, useEffect, useRef } from "react";
import { IPlaylist, ITrack } from "@/types/library";
import { fetchPlaylistTracks } from "@/lib/musicApi";
import { useLibrary } from "@/contexts/LibraryContext";

interface UsePlaylistTracksReturn {
  playlist: IPlaylist | undefined;
  isLoading: boolean;
  error: string | null;
}

type FetchStatus = "idle" | "loading" | "fetched" | "error";

export const usePlaylistTracks = (playlistId: string): UsePlaylistTracksReturn => {
  const { state, actions } = useLibrary();
  const [error, setError] = useState<string | null>(null);

  // Store fetch status per playlist ID
  const fetchStatusRef = useRef<Record<string, FetchStatus>>({});
  // Track mount status with a persistent ref
  const isMountedRef = useRef(false);

  // Get current status for this playlistId
  const currentStatus = fetchStatusRef.current[playlistId] ?? "idle";
  const isLoading = currentStatus === "loading";

  // Get stable actions reference
  const updatePlaylist = actions.updatePlaylist;

  useEffect(() => {
    // Set mount status to true when effect runs
    isMountedRef.current = true;

    const fetchTracks = async (): Promise<void> => {
      // Get current state
      const currentState = state;
      if (!currentState?.playlists) return;

      // Get current playlist
      const currentPlaylist = currentState.playlists.get(playlistId);
      if (!currentPlaylist) return;

      // Skip if already fetched or fetching
      if (
        fetchStatusRef.current[playlistId] === "loading" ||
        fetchStatusRef.current[playlistId] === "fetched" ||
        (currentPlaylist.tracks && currentPlaylist.tracks.length > 0)
      ) {
        return;
      }

      // Mark as loading
      fetchStatusRef.current[playlistId] = "loading";
      if (isMountedRef.current) {
        setError(null);
      }

      try {
        // Define onProgress to update tracks as they arrive
        const onProgress = (partialTracks: ITrack[], _progress: number): void => {
          if (!isMountedRef.current) return;

          // Get latest playlist
          const latestState = state;
          const latestPlaylist = latestState?.playlists?.get(playlistId);
          if (!latestPlaylist) return;

          // Update playlist with partial tracks
          const updatedPlaylist = {
            ...latestPlaylist,
            tracks: partialTracks,
          };
          updatePlaylist(updatedPlaylist);
        };

        // Fetch tracks with progressive updates
        await fetchPlaylistTracks(playlistId, onProgress);

        // Mark as fetched once complete (if still mounted)
        if (isMountedRef.current) {
          fetchStatusRef.current[playlistId] = "fetched";
        }
      } catch (err) {
        console.error(`Error fetching playlist ${playlistId}:`, err);
        if (isMountedRef.current) {
          setError("Failed to fetch tracks.");
          fetchStatusRef.current[playlistId] = "error";
        }
      }
    };

    fetchTracks();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [playlistId, updatePlaylist, state]);

  // Return current playlist from context
  const playlist = state?.playlists?.get(playlistId);

  return {
    playlist,
    isLoading,
    error,
  };
};
