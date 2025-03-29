import { useState, useCallback } from "react";
import { IPlaylist, ILibraryData } from "@/types/library";
import { fetchPlaylistCurator } from "@/lib/services/apple/api";
import { fetchPlaylistTracks as fetchPlaylistTracksApi, getSourceService } from "@/lib/musicApi";
import { useLibrary } from "@/contexts/LibraryContext";

interface UsePlaylistTracksOptions {
  onCancel: () => void;
}

interface UsePlaylistTracksReturn {
  error: string | null;
  isLoading: boolean;
  handleLoadPlaylistTracks: (playlistId: string) => Promise<IPlaylist>;
}

export const usePlaylistTracks = ({
  onCancel,
}: UsePlaylistTracksOptions): UsePlaylistTracksReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { libraryState, setLibraryState } = useLibrary();

  const handleLoadPlaylistTracks = useCallback(
    async (playlistId: string): Promise<IPlaylist> => {
      if (!libraryState) {
        throw new Error("Library not available");
      }

      const sourceService = await getSourceService();
      const playlist = libraryState.playlists.find(p => p.id === playlistId);
      if (!playlist) {
        throw new Error("Playlist not found");
      }

      try {
        setError(null);
        setIsLoading(true);
        onCancel();

        // Fetch owner for Apple Music playlists
        let curatorName = "";
        if (sourceService === "apple") {
          const curator = await fetchPlaylistCurator(playlistId);
          curatorName = curator?.data?.[0]?.attributes?.curatorName || "";
        }

        const tracks = await fetchPlaylistTracksApi(playlistId, sourceService);

        const updatedPlaylist = {
          ...playlist,
          tracks,
          ...(sourceService === "apple" && curatorName ? { ownerName: curatorName } : {}),
        };

        setLibraryState((prev: ILibraryData | null) => {
          if (!prev) return prev;
          return {
            ...prev,
            playlists: prev.playlists.map(p => (p.id === playlistId ? updatedPlaylist : p)),
          };
        });

        return updatedPlaylist;
      } catch (err) {
        const errorMessage = "Failed to fetch tracks. Please try again.";
        console.error("Error fetching playlist tracks:", err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [libraryState, onCancel, setLibraryState]
  );

  return {
    error,
    isLoading,
    handleLoadPlaylistTracks,
  };
};
