import { useState, useCallback, useRef } from "react";
import { ITrack, IAlbum, IPlaylist } from "@/types/library";
import { MusicService } from "@/types/services";
import { musicServiceFactory } from "@/lib/services/factory";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";

interface UseSearchTracksReturn {
  isLoading: boolean;
  error: string | null;
  matchLikedSongs: (tracks: ITrack[], targetService: MusicService) => Promise<void>;
  matchAlbums: (albums: IAlbum[], targetService: MusicService) => Promise<void>;
  matchPlaylistTracks: (playlist: IPlaylist, targetService: MusicService) => Promise<void>;
  cancelMatching: () => void;
}

export const useSearchTracks = (): UseSearchTracksReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const matchedItemsRef = useRef<Set<string>>(new Set());
  const { setTrackStatus, setAlbumStatus } = useMatching();
  const { state, actions } = useLibrary();

  const cancelMatching = useCallback(() => {
    if (abortControllerRef.current) {
      console.log("Cancelling matching from:", new Error().stack);
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  // Helper function to process tracks in batches
  const processTrackBatch = useCallback(
    async (
      tracks: ITrack[],
      provider: ReturnType<typeof musicServiceFactory.getProvider>,
      signal: AbortSignal,
      batchSize: number = 20
    ) => {
      const processedTracks = new Map<string, { track: ITrack; targetId: string | null }>();

      for (let i = 0; i < tracks.length; i += batchSize) {
        if (signal.aborted) {
          console.log("Signal was aborted before search");
          return processedTracks;
        }

        const batch = tracks.slice(i, i + batchSize);
        batch.forEach(track => {
          setTrackStatus(track.id, "pending");
          matchedItemsRef.current.add(track.id);
        });

        const results = await provider.search(batch, batchSize);

        if (signal.aborted) {
          console.log("Signal was aborted after search");
          return processedTracks;
        }

        batch.forEach(track => {
          const matchedTrack = results.tracks?.find(t => (t as ITrack).id === track.id);

          if (matchedTrack && "targetId" in matchedTrack) {
            setTrackStatus(
              track.id,
              matchedTrack.targetId ? "matched" : "unmatched",
              matchedTrack.targetId
            );

            processedTracks.set(track.id, {
              track,
              targetId: matchedTrack.targetId || null,
            });
          } else {
            setTrackStatus(track.id, "unmatched");
            processedTracks.set(track.id, { track, targetId: null });
          }
        });

        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      return processedTracks;
    },
    [setTrackStatus]
  );

  const matchLikedSongs = useCallback(
    async (tracks: ITrack[], targetService: MusicService) => {
      if (!tracks.length) return;

      cancelMatching();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      setError(null);

      try {
        const provider = musicServiceFactory.getProvider(targetService);
        const unprocessedTracks = tracks.filter(track => !track.targetId);
        const processedTracks = await processTrackBatch(unprocessedTracks, provider, signal);

        if (!signal.aborted && processedTracks) {
          // Update library state with the new tracks
          const updatedTracks = new Set(state.likedSongs);

          processedTracks.forEach(({ track, targetId }) => {
            if (targetId) {
              const updatedTrack = { ...track, targetId };
              updatedTracks.delete(track);
              updatedTracks.add(updatedTrack);
            }
          });

          actions.setLikedSongs(updatedTracks);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error matching liked songs:", error);
          setError("Failed to match liked songs. Please try again.");
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [cancelMatching, processTrackBatch, state.likedSongs, actions]
  );

  const matchAlbums = useCallback(
    async (albums: IAlbum[], targetService: MusicService) => {
      if (!albums.length) return;

      cancelMatching();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      setError(null);

      try {
        const provider = musicServiceFactory.getProvider(targetService);
        const unprocessedAlbums = albums.filter(
          album => !matchedItemsRef.current.has(album.id) && !album.targetId
        );

        if (!unprocessedAlbums.length) {
          console.log("No unprocessed albums found, skipping");
          return;
        }

        unprocessedAlbums.forEach(album => {
          setAlbumStatus(album.id, "pending");
          matchedItemsRef.current.add(album.id);
        });

        const results = await provider.searchAlbums(unprocessedAlbums);
        if (signal.aborted) return;

        const updatedAlbums = new Set(state.albums);
        unprocessedAlbums.forEach(album => {
          const match = results.albums?.find(
            a => a.name === album.name && a.artist === album.artist
          );
          setAlbumStatus(album.id, match?.targetId ? "matched" : "unmatched", match?.targetId);

          // Update the album in our library state
          if (match?.targetId) {
            const updatedAlbum = { ...album, targetId: match.targetId };
            updatedAlbums.delete(album);
            updatedAlbums.add(updatedAlbum);
          }
        });

        // Update library state with the new albums
        actions.setAlbums(updatedAlbums);
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error matching albums:", error);
          setError("Failed to match albums. Please try again.");
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [cancelMatching, setAlbumStatus, state.albums, actions]
  );

  const matchPlaylistTracks = useCallback(
    async (playlist: IPlaylist, targetService: MusicService) => {
      if (!playlist.tracks.length) return;

      cancelMatching();
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      setIsLoading(true);
      setError(null);

      try {
        const provider = musicServiceFactory.getProvider(targetService);
        const unprocessedTracks = playlist.tracks.filter(track => !track.targetId);

        if (!unprocessedTracks.length) {
          console.log("No unprocessed tracks found in playlist, skipping");
          return;
        }

        // Create a map of existing tracks for easy lookup
        const tracksMap = new Map(playlist.tracks.map(track => [track.id, track]));

        // Process the unprocessed tracks
        const processedTracks = await processTrackBatch(unprocessedTracks, provider, signal);

        if (!signal.aborted && processedTracks) {
          // Update the tracks with their new target IDs
          processedTracks.forEach(({ track, targetId }) => {
            if (targetId) {
              const updatedTrack = { ...track, targetId };
              tracksMap.set(track.id, updatedTrack);
            }
          });

          // Create updated playlist with matched tracks
          const updatedPlaylist = {
            ...playlist,
            tracks: Array.from(tracksMap.values()),
          };
          actions.updatePlaylist(updatedPlaylist);
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error matching playlist tracks:", error);
          setError("Failed to match playlist tracks. Please try again.");
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [cancelMatching, processTrackBatch, actions]
  );

  return {
    isLoading,
    error,
    matchLikedSongs,
    matchAlbums,
    matchPlaylistTracks,
    cancelMatching,
  };
};
