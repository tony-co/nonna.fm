import { useState, useCallback, useRef } from "react";
import { IAlbum, IPlaylist, ITrack } from "@/types/library";
import { MusicService } from "@/types/services";
import { musicServiceFactory } from "@/lib/services/factory";
import { useMatching } from "@/contexts/MatchingContext";

export interface LibraryState {
  likedSongs: Array<ITrack>;
  albums: Array<IAlbum>;
  playlists: Array<IPlaylist>;
}

export interface ProgressState {
  matched: number;
  unmatched: number;
  total: number;
  processing: number;
}

interface UseSearchTracksOptions {
  libraryState: LibraryState | null;
  setLibraryState: React.Dispatch<React.SetStateAction<LibraryState | null>>;
  onModeChange: (mode: "select" | "matching" | "review" | "transfer" | "completed") => void;
  targetService?: MusicService;
}

interface UseSearchTracksReturn {
  isLoading: boolean;
  error: string | null;
  handleSearchTracks: (itemOrCategory?: IAlbum | IPlaylist | "liked" | "albums") => Promise<void>;
  cancelSearch: () => void;
}

export const useSearchTracks = ({
  libraryState,
  onModeChange,
  targetService,
}: UseSearchTracksOptions): UseSearchTracksReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { setTrackStatus, setAlbumStatus } = useMatching();

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      console.log("Search cancelled");
    }
  }, []);

  const handleSearchTracks = useCallback(
    async (itemOrCategory?: IAlbum | IPlaylist | "liked" | "albums") => {
      if (!libraryState || !targetService) {
        setError("Target service not specified");
        return;
      }

      // Cancel any existing search
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this search
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      onModeChange("matching");

      try {
        const provider = musicServiceFactory.getProvider(targetService);

        // Handle category-based searches
        if (itemOrCategory === "liked") {
          // Search only liked songs
          const BATCH_SIZE = 20;
          for (let i = 0; i < libraryState.likedSongs.length; i += BATCH_SIZE) {
            if (signal.aborted) {
              console.log("Search operation cancelled");
              return;
            }
            const batch = libraryState.likedSongs.slice(i, i + BATCH_SIZE);
            batch.forEach(track => setTrackStatus(track.id, "pending"));

            const results = await provider.search(batch, BATCH_SIZE);

            if (signal.aborted) return;

            batch.forEach(originalTrack => {
              const matchedTrack = results.tracks?.find(
                t => t.name === originalTrack.name && t.artist === originalTrack.artist
              );
              setTrackStatus(
                originalTrack.id,
                matchedTrack?.targetId ? "matched" : "unmatched",
                matchedTrack?.targetId
              );
            });

            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } else if (itemOrCategory === "albums") {
          // Search albums in batches
          const BATCH_SIZE = 20;
          for (let i = 0; i < libraryState.albums.length; i += BATCH_SIZE) {
            if (signal.aborted) {
              console.log("Search operation cancelled");
              return;
            }
            const batch = libraryState.albums.slice(i, i + BATCH_SIZE);
            batch.forEach(album => setAlbumStatus(album.id, "pending"));

            const results = await provider.searchAlbums(batch);

            if (signal.aborted) return;

            batch.forEach(album => {
              const matchedAlbum = results.albums?.find(a => a.id === album.id);
              setAlbumStatus(
                album.id,
                matchedAlbum?.targetId ? "matched" : "unmatched",
                matchedAlbum?.targetId
              );
            });

            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } else if (typeof itemOrCategory === "object") {
          if ("tracks" in itemOrCategory) {
            // Playlist logic
            const BATCH_SIZE = 20;
            for (let i = 0; i < itemOrCategory.tracks.length; i += BATCH_SIZE) {
              if (signal.aborted) {
                console.log("Search operation cancelled");
                return;
              }
              const batch = itemOrCategory.tracks.slice(i, i + BATCH_SIZE);
              batch.forEach(track => setTrackStatus(track.id, "pending"));

              const results = await provider.search(batch, BATCH_SIZE);

              if (signal.aborted) return;

              batch.forEach(originalTrack => {
                const matchedTrack = results.tracks?.find(
                  t => t.name === originalTrack.name && t.artist === originalTrack.artist
                );
                setTrackStatus(
                  originalTrack.id,
                  matchedTrack?.targetId ? "matched" : "unmatched",
                  matchedTrack?.targetId
                );
              });

              await new Promise(resolve => setTimeout(resolve, 50));
            }
          } else {
            // Single album logic
            if (signal.aborted) {
              console.log("Search operation cancelled");
              return;
            }
            setAlbumStatus(itemOrCategory.id, "pending");
            const results = await provider.searchAlbums([itemOrCategory]);

            if (signal.aborted) return;

            if (results.albums?.[0]) {
              setAlbumStatus(
                itemOrCategory.id,
                results.albums[0].targetId ? "matched" : "unmatched",
                results.albums[0].targetId
              );
            }
          }
        }

        if (!signal.aborted) {
          onModeChange("review");
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error searching tracks:", error);
          setError("Failed to search tracks. Please try again.");
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [libraryState, onModeChange, targetService, setTrackStatus, setAlbumStatus]
  );

  return {
    isLoading,
    error,
    handleSearchTracks,
    cancelSearch,
  };
};
