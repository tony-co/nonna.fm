import { useCallback, useRef } from "react";
import {
  UseMatchingReturn,
  ITrack,
  IAlbum,
  IPlaylist,
  QueueTask,
  MATCHING_STATUS,
  MusicService,
} from "@/types";
import { useLibrary } from "@/contexts/LibraryContext";
import { musicServiceFactory } from "@/lib/services/factory";
import {
  matchingStart,
  matchingProgress,
  matchingError,
  matchingComplete,
  matchingCancel,
} from "@/contexts/LibraryContext.matchingActions";

// This hook now uses global matching state from LibraryContext
export const useMatching = (): UseMatchingReturn => {
  const { state, dispatch, actions } = useLibrary();
  // Only keep queue and abortController local; all state is global
  const queueRef = useRef<QueueTask[]>([]);
  const isProcessingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to get a unique task key for progress tracking
  const getTaskKey = (task: QueueTask): string => {
    if (task.type === "playlist") return `playlist:${task.playlist.id}`;
    return task.type;
  };

  // Queue processor
  const processQueue = useCallback(async (): Promise<void> => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    isProcessingRef.current = true;
    // Use action creator for matching start
    dispatch(matchingStart(queueRef.current[0]));
    const task = queueRef.current[0];
    const taskKey = getTaskKey(task);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    try {
      if (task.type === "likedSongs") {
        // Cast targetService to MusicService for provider
        const provider = musicServiceFactory.getProvider(task.targetService as MusicService);
        // Filter out tracks that already have a targetId (already matched)
        const tracksToMatch = task.tracks.filter(track => !track.targetId);
        if (tracksToMatch.length === 0) {
          // All tracks already matched, skip provider call
          dispatch(matchingComplete(taskKey));
          return;
        }
        // Set all to pending first (including already matched, for UI consistency)
        const pendingSet = new Set(
          Array.from(state.likedSongs ?? []).map(track => ({
            ...track,
            status: MATCHING_STATUS.PENDING,
          }))
        );
        actions.setLikedSongs(pendingSet);
        const result = await provider.search(tracksToMatch, progressValue => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          // Use action creator for progress
          dispatch(
            matchingProgress(
              taskKey,
              Math.round(progressValue < 1 ? progressValue * 100 : progressValue)
            )
          );
        });
        if (result.tracks) {
          // Batch update: merge all result.tracks into state.likedSongs
          const updatedTracksMap = new Map(result.tracks.map(track => [track.id, track]));
          const updated = new Set(
            Array.from(state.likedSongs ?? []).map(track =>
              updatedTracksMap.has(track.id)
                ? { ...track, ...updatedTracksMap.get(track.id) }
                : track
            )
          );
          actions.setLikedSongs(updated);
        }
        // Use action creator for complete
        dispatch(matchingComplete(taskKey));
      } else if (task.type === "albums") {
        // Cast targetService to MusicService for provider
        const provider = musicServiceFactory.getProvider(task.targetService as MusicService);
        // Filter out albums that already have a targetId (already matched)
        const albumsToMatch = task.albums.filter(album => !album.targetId);
        if (albumsToMatch.length === 0) {
          // All albums already matched, skip provider call
          dispatch(matchingComplete(taskKey));
          return;
        }
        // Set all to pending first (including already matched, for UI consistency)
        const pendingSet = new Set(
          Array.from(state.albums ?? []).map(album => ({
            ...album,
            status: MATCHING_STATUS.PENDING,
          }))
        );
        actions.setAlbums(pendingSet);
        const result = await provider.searchAlbums(albumsToMatch, progressValue => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          // Use action creator for progress
          dispatch(
            matchingProgress(
              taskKey,
              Math.round(progressValue < 1 ? progressValue * 100 : progressValue)
            )
          );
        });
        if (result.albums) {
          // Batch update: merge all result.albums into state.albums
          const updatedAlbumsMap = new Map(result.albums.map(album => [album.id, album]));
          const updated = new Set(
            Array.from(state.albums ?? []).map(album =>
              updatedAlbumsMap.has(album.id)
                ? { ...album, ...updatedAlbumsMap.get(album.id) }
                : album
            )
          );
          actions.setAlbums(updated);
        }
        // Use action creator for complete
        dispatch(matchingComplete(taskKey));
      } else if (task.type === "playlist") {
        // Cast targetService to MusicService for provider
        const provider = musicServiceFactory.getProvider(task.targetService as MusicService);
        // Filter out tracks in the playlist that already have a targetId
        const tracksToMatch = task.playlist.tracks.filter(track => !track.targetId);
        if (tracksToMatch.length === 0) {
          // All tracks already matched, skip provider call
          dispatch(matchingComplete(taskKey));
          return;
        }
        // Set all to pending first (including already matched, for UI consistency)
        const playlistId = task.playlist.id;
        const playlist = task.playlist;
        if (playlist) {
          // Use functional update to avoid stale state bugs when multiple playlists are queued
          actions.setPlaylists(prev => {
            const updated = new Map(prev ?? []);
            const pendingTracks = playlist.tracks.map(track => ({
              ...track,
              status: MATCHING_STATUS.PENDING,
            }));
            updated.set(playlistId, { ...playlist, tracks: pendingTracks });
            return updated;
          });
        }
        const result = await provider.search(tracksToMatch, progressValue => {
          if (signal.aborted) throw new DOMException("Aborted", "AbortError");
          // Use action creator for progress
          dispatch(
            matchingProgress(
              taskKey,
              Math.round(progressValue < 1 ? progressValue * 100 : progressValue)
            )
          );
        });
        if (result.tracks) {
          // Batch update: merge all result.tracks into the playlist's tracks
          // Use functional update to avoid stale state bugs when multiple playlists are queued
          const playlist = task.playlist;
          if (playlist) {
            const updatedTracksMap = new Map(result.tracks.map(track => [track.id, track]));
            actions.setPlaylists(prev => {
              const updated = new Map(prev ?? []);
              const updatedTracks = playlist.tracks.map(track =>
                updatedTracksMap.has(track.id)
                  ? { ...track, ...updatedTracksMap.get(track.id) }
                  : track
              );
              updated.set(playlistId, { ...playlist, tracks: updatedTracks });
              return updated;
            });
          }
        }
        // Use action creator for complete
        dispatch(matchingComplete(taskKey));
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Do nothing, user cancelled
      } else if (err instanceof Error) {
        // Use action creator for error
        dispatch(matchingError(err.message || "Unknown error"));
      } else {
        dispatch(matchingError("Unknown error"));
      }
    } finally {
      queueRef.current.shift();
      isProcessingRef.current = false;
      abortControllerRef.current = null;
      // If more tasks, process next
      // Use setTimeout to defer to next event loop tick, ensuring isProcessingRef.current is reset
      if (queueRef.current.length > 0) {
        setTimeout(() => processQueue(), 0);
      }
    }
  }, [actions, state.likedSongs, state.albums, dispatch]);

  // Public API
  const matchLikedSongs = useCallback(
    async (tracks: ITrack[], targetService: MusicService) => {
      if (!tracks.length) return;
      queueRef.current.push({ type: "likedSongs", tracks, targetService });
      processQueue();
    },
    [processQueue]
  );

  const matchAlbums = useCallback(
    async (albums: IAlbum[], targetService: MusicService) => {
      if (!albums.length) return;
      queueRef.current.push({ type: "albums", albums, targetService });
      processQueue();
    },
    [processQueue]
  );

  const matchPlaylistTracks = useCallback(
    async (playlist: IPlaylist, targetService: MusicService) => {
      if (!playlist.tracks.length) return;
      queueRef.current.push({ type: "playlist", playlist, targetService });
      processQueue();
    },
    [processQueue]
  );

  // Type guard for playlist tasks
  function isPlaylistTask(task: QueueTask): task is Extract<QueueTask, { type: "playlist" }> {
    return task.type === "playlist";
  }

  // Cancel a specific matching task (does not revert status)
  const cancelMatching = useCallback(
    (type: "likedSongs" | "albums" | "playlist", id?: string): void => {
      // Check if the current task matches the cancel request
      const currentTask = state.matching.currentTask;
      const isCurrentTask =
        currentTask &&
        currentTask.type === type &&
        (type !== "playlist" ||
          (id && currentTask.type === "playlist" && currentTask.playlist.id === id));

      if (isCurrentTask) {
        // If cancelling the current task, only abort it.
        // Do NOT filter the queue, let the finally block handle removal.
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      } else {
        // If cancelling a queued (not running) task, filter it out from the queue.
        queueRef.current = queueRef.current.filter(task => {
          if (task.type !== type) return true;
          if (type === "playlist" && id && isPlaylistTask(task)) return task.playlist.id !== id;
          // Remove if matches
          return false;
        });
      }
      // Only dispatch matchingCancel for the affected task (once)
      dispatch(matchingCancel(type, id));
      // Note: processQueue will be called in processQueue's finally block if there are more tasks
    },
    [dispatch, state.matching.currentTask]
  );

  // Get progress for a given task type/id
  const getProgress = useCallback(
    (type: "likedSongs" | "albums" | "playlist", id?: string): number => {
      const key = type === "playlist" && id ? `playlist:${id}` : type;
      return state.matching.progress[key] ?? 0;
    },
    [state.matching.progress]
  );

  return {
    isLoading: state.matching.isLoading,
    error: state.matching.error,
    matchLikedSongs,
    matchAlbums,
    matchPlaylistTracks,
    cancelMatching,
    getProgress,
    currentTask: state.matching.currentTask,
  };
};
