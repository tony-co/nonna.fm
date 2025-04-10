"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { MusicService } from "@/types/services";
import { ITrack, IAlbum, IPlaylist } from "@/types/library";
import { musicServiceFactory } from "@/lib/services/factory";

// Define constant types to avoid typos
export const MATCHING_TYPES = {
  LIKED_SONGS: "likedSongs",
  ALBUMS: "albums",
  PLAYLIST: "playlist",
} as const;

export const MATCHING_STATUS = {
  PENDING: "pending",
  MATCHED: "matched",
  UNMATCHED: "unmatched",
} as const;

export const TASK_STATUS = {
  IDLE: "idle",
  ACTIVE: "active",
  QUEUED: "queued",
} as const;

// Type definitions
export type MatchingType = (typeof MATCHING_TYPES)[keyof typeof MATCHING_TYPES];
export type ItemStatus = (typeof MATCHING_STATUS)[keyof typeof MATCHING_STATUS];
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export interface MatchingTask {
  id: string;
  type: MatchingType;
  targetService: MusicService;
  data: {
    likedSongs: ITrack[] | null;
    albums: IAlbum[] | null;
    playlist: IPlaylist | null;
  };
}

export interface MatchingProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface MatchingState {
  tracks: Map<string, { status: ItemStatus; targetId?: string }>;
  albums: Map<string, { status: ItemStatus; targetId?: string }>;
  queue: MatchingTask[];
  activeTask: MatchingTask | null;
  progress: Record<string, MatchingProgress>;
}

export interface MatchingStatusResult {
  isMatching: boolean;
  status: TaskStatus;
  queuePosition?: number;
  progress: number;
}

// Actions
type MatchingAction =
  | { type: "ENQUEUE_TASK"; task: MatchingTask }
  | { type: "START_NEXT_TASK" }
  | { type: "COMPLETE_TASK" }
  | { type: "UPDATE_PROGRESS"; taskId: string; percentage: number }
  | { type: "SET_TRACK_STATUS"; trackId: string; status: ItemStatus; targetId?: string }
  | { type: "SET_ALBUM_STATUS"; albumId: string; status: ItemStatus; targetId?: string }
  | { type: "CANCEL_TASK"; taskType: MatchingType; taskId?: string };

// Initial state
const initialState: MatchingState = {
  tracks: new Map(),
  albums: new Map(),
  queue: [],
  activeTask: null,
  progress: {},
};

// Reducer function
const matchingReducer = (state: MatchingState, action: MatchingAction): MatchingState => {
  switch (action.type) {
    case "ENQUEUE_TASK": {
      const taskId = action.task.id || action.task.type;
      const total =
        action.task.type === MATCHING_TYPES.LIKED_SONGS && action.task.data.likedSongs
          ? action.task.data.likedSongs.length
          : action.task.type === MATCHING_TYPES.ALBUMS && action.task.data.albums
            ? action.task.data.albums.length
            : action.task.data.playlist?.tracks.length || 0;

      // Initialize progress for this task
      const updatedProgress = {
        ...state.progress,
        [taskId]: { total, completed: 0, percentage: 0 },
      };

      // If no active task, make this the active task
      if (!state.activeTask) {
        return {
          ...state,
          activeTask: action.task,
          progress: updatedProgress,
        };
      }

      // Otherwise add to queue
      return {
        ...state,
        queue: [...state.queue, action.task],
        progress: updatedProgress,
      };
    }

    case "START_NEXT_TASK":
      if (state.activeTask || state.queue.length === 0) return state;

      const nextTask = state.queue[0];
      return {
        ...state,
        activeTask: nextTask,
        queue: state.queue.slice(1),
      };

    case "COMPLETE_TASK":
      return {
        ...state,
        activeTask: null,
      };

    case "UPDATE_PROGRESS": {
      const { taskId, percentage } = action;
      const task = state.progress[taskId];

      if (!task) return state;

      const completed = Math.floor(task.total * (percentage / 100));

      console.log("Updating progress", { taskId, percentage, completed });

      return {
        ...state,
        progress: {
          ...state.progress,
          [taskId]: {
            ...task,
            completed,
            percentage,
          },
        },
      };
    }

    case "SET_TRACK_STATUS": {
      const { trackId, status, targetId } = action;
      const newTracks = new Map(state.tracks);
      newTracks.set(trackId, { status, targetId });

      return {
        ...state,
        tracks: newTracks,
      };
    }

    case "SET_ALBUM_STATUS": {
      const { albumId, status, targetId } = action;
      const newAlbums = new Map(state.albums);
      newAlbums.set(albumId, { status, targetId });

      return {
        ...state,
        albums: newAlbums,
      };
    }

    case "CANCEL_TASK": {
      console.log("Cancelling task", action);
      const { taskType, taskId } = action;

      // Filter out tasks from queue
      const newQueue = state.queue.filter(
        task =>
          !(task.type === taskType && (taskType !== MATCHING_TYPES.PLAYLIST || task.id === taskId))
      );

      // Check if active task should be cancelled
      if (
        state.activeTask?.type === taskType &&
        (taskType !== MATCHING_TYPES.PLAYLIST || state.activeTask.id === taskId)
      ) {
        return {
          ...state,
          activeTask: null,
          queue: newQueue,
        };
      }

      return {
        ...state,
        queue: newQueue,
      };
    }

    default:
      return state;
  }
};

// Context interface
interface MatchingContextType {
  // State access
  getTrackStatus: (trackId: string) => ItemStatus | undefined;
  getTrackTargetId: (trackId: string) => string | undefined;
  getAlbumStatus: (albumId: string) => ItemStatus | undefined;
  getAlbumTargetId: (albumId: string) => string | undefined;

  // Task management
  matchLikedSongs: (tracks: ITrack[], targetService: MusicService) => void;
  matchAlbums: (albums: IAlbum[], targetService: MusicService) => void;
  matchPlaylistTracks: (playlist: IPlaylist, targetService: MusicService) => void;
  cancelMatching: (type: MatchingType, id?: string) => void;

  // Status and progress
  getMatchingStatus: (type: MatchingType, id?: string) => MatchingStatusResult;
  isMatchingInProgress: () => boolean;
}

// Create context with a default value
const MatchingContext = createContext<MatchingContextType | null>(null);

// Custom hook for consuming context
export const useMatching = (): MatchingContextType => {
  const context = useContext(MatchingContext);
  if (!context) {
    throw new Error("useMatching must be used within a MatchingProvider");
  }
  return context;
};

// Provider component
interface MatchingProviderProps {
  children: ReactNode;
}

export const MatchingProvider = ({ children }: MatchingProviderProps) => {
  const [state, dispatch] = useReducer(matchingReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isCancellingRef = useRef<boolean>(false);
  const currentTaskIdRef = useRef<string | null>(null);

  // Track and album status methods
  const setTrackStatus = useCallback((trackId: string, status: ItemStatus, targetId?: string) => {
    dispatch({ type: "SET_TRACK_STATUS", trackId, status, targetId });
  }, []);

  const setAlbumStatus = useCallback((albumId: string, status: ItemStatus, targetId?: string) => {
    dispatch({ type: "SET_ALBUM_STATUS", albumId, status, targetId });
  }, []);

  const getTrackStatus = useCallback(
    (trackId: string): ItemStatus | undefined => {
      return state.tracks.get(trackId)?.status;
    },
    [state.tracks]
  );

  const getTrackTargetId = useCallback(
    (trackId: string): string | undefined => {
      return state.tracks.get(trackId)?.targetId;
    },
    [state.tracks]
  );

  const getAlbumStatus = useCallback(
    (albumId: string): ItemStatus | undefined => {
      return state.albums.get(albumId)?.status;
    },
    [state.albums]
  );

  const getAlbumTargetId = useCallback(
    (albumId: string): string | undefined => {
      return state.albums.get(albumId)?.targetId;
    },
    [state.albums]
  );

  // Task management
  const matchLikedSongs = useCallback((tracks: ITrack[], targetService: MusicService) => {
    if (!tracks.length) return;

    const task: MatchingTask = {
      id: MATCHING_TYPES.LIKED_SONGS,
      type: MATCHING_TYPES.LIKED_SONGS,
      data: { likedSongs: tracks, albums: null, playlist: null },
      targetService,
    };

    dispatch({ type: "ENQUEUE_TASK", task });
  }, []);

  const matchAlbums = useCallback((albums: IAlbum[], targetService: MusicService) => {
    if (!albums.length) return;

    const task: MatchingTask = {
      id: MATCHING_TYPES.ALBUMS,
      type: MATCHING_TYPES.ALBUMS,
      data: { likedSongs: null, albums, playlist: null },
      targetService,
    };

    dispatch({ type: "ENQUEUE_TASK", task });
  }, []);

  const matchPlaylistTracks = useCallback((playlist: IPlaylist, targetService: MusicService) => {
    if (!playlist.tracks.length) return;

    const task: MatchingTask = {
      id: playlist.id,
      type: MATCHING_TYPES.PLAYLIST,
      data: { likedSongs: null, albums: null, playlist },
      targetService,
    };

    dispatch({ type: "ENQUEUE_TASK", task });
  }, []);

  const cancelMatching = useCallback((type: MatchingType, id?: string) => {
    console.log("Cancelling matching task", { type, id });

    // Set cancellation flag
    isCancellingRef.current = true;

    // Cancel any in-progress task
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    dispatch({ type: "CANCEL_TASK", taskType: type, taskId: id });

    // Reset cancellation flag after a short delay
    setTimeout(() => {
      isCancellingRef.current = false;
    }, 100);
  }, []);

  // Simple check if any matching is in progress
  const isMatchingInProgress = useCallback((): boolean => {
    return !!state.activeTask || state.queue.length > 0;
  }, [state.activeTask, state.queue.length]);

  // Status and progress
  const updateProgress = useCallback((taskId: string, percentage: number) => {
    dispatch({ type: "UPDATE_PROGRESS", taskId, percentage });
  }, []);

  const getMatchingStatus = useCallback(
    (type: MatchingType, id?: string): MatchingStatusResult => {
      const taskId = type === MATCHING_TYPES.PLAYLIST ? id : type;

      // Check if task is active
      if (
        state.activeTask?.type === type &&
        (type !== MATCHING_TYPES.PLAYLIST || state.activeTask.id === id)
      ) {
        return {
          isMatching: true,
          status: TASK_STATUS.ACTIVE,
          progress: state.progress[taskId as string]?.percentage || 0,
        };
      }

      // Check queue position
      const queuePosition = state.queue.findIndex(
        task => task.type === type && (type !== MATCHING_TYPES.PLAYLIST || task.id === id)
      );

      if (queuePosition !== -1) {
        return {
          isMatching: true,
          status: TASK_STATUS.QUEUED,
          queuePosition: queuePosition + 1,
          progress: 0,
        };
      }

      // Not matching
      return {
        isMatching: false,
        status: TASK_STATUS.IDLE,
        progress: 0,
      };
    },
    [state.activeTask, state.queue, state.progress]
  );

  // Effect to process the next task when the active task completes
  useEffect(() => {
    if (!state.activeTask && state.queue.length > 0) {
      dispatch({ type: "START_NEXT_TASK" });
    }
  }, [state.activeTask, state.queue.length]);

  // Effect to execute the active task
  useEffect(
    () => {
      // Skip if no active task
      if (!state.activeTask) return;

      // Generate unique ID for this task
      const taskUniqueId = `${state.activeTask.type}-${state.activeTask.id}`;

      // Skip execution if this task is already running
      if (currentTaskIdRef.current === taskUniqueId) {
        return;
      }

      // Always abort any previous operation before starting a new one
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }

      // Create a new AbortController for this execution
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      // Set the current task ID
      currentTaskIdRef.current = taskUniqueId;

      const executeTask = async (task: MatchingTask) => {
        const provider = musicServiceFactory.getProvider(task.targetService);
        const taskId = task.id || task.type;

        try {
          // Check if already cancelled before starting
          if (signal.aborted) {
            console.log("Task was cancelled before execution");
            return;
          }

          if (task.type === MATCHING_TYPES.LIKED_SONGS && task.data.likedSongs) {
            // Filter out tracks that already have a targetId
            const tracksToMatch = task.data.likedSongs.filter(track => !getTrackTargetId(track.id));

            // Set filtered tracks to pending
            tracksToMatch.forEach(track => setTrackStatus(track.id, MATCHING_STATUS.PENDING));

            // Skip if no tracks to match
            if (tracksToMatch.length === 0) {
              updateProgress(taskId, 100);
              return;
            }

            // Execute search with abort check in the progress callback
            const result = await provider.search(tracksToMatch, (progress: number) => {
              // Only throw AbortError when explicitly cancelled
              if (signal.aborted) {
                const error = new DOMException("Aborted", "AbortError");
                throw error;
              }
              updateProgress(taskId, progress < 1 ? progress * 100 : progress);
            });

            // Update track statuses
            if (result.tracks) {
              result.tracks.forEach(track => {
                if (track.targetId) {
                  setTrackStatus(track.id, MATCHING_STATUS.MATCHED, track.targetId);
                } else {
                  setTrackStatus(track.id, MATCHING_STATUS.UNMATCHED);
                }
              });
            }
          } else if (task.type === MATCHING_TYPES.ALBUMS && task.data.albums) {
            // Filter out albums that already have a targetId
            const albumsToMatch = task.data.albums.filter(album => !getAlbumTargetId(album.id));

            // Set filtered albums to pending
            albumsToMatch.forEach(album => setAlbumStatus(album.id, MATCHING_STATUS.PENDING));

            // Skip if no albums to match
            if (albumsToMatch.length === 0) {
              updateProgress(taskId, 100);
              return;
            }

            // Execute search with abort check in the progress callback
            const result = await provider.searchAlbums(albumsToMatch, (progress: number) => {
              // Only throw AbortError when explicitly cancelled
              if (signal.aborted) {
                const error = new DOMException("Aborted", "AbortError");
                throw error;
              }
              updateProgress(taskId, progress < 1 ? progress * 100 : progress);
            });

            // Update album statuses
            if (result.albums) {
              result.albums.forEach(album => {
                if (album.targetId) {
                  setAlbumStatus(album.id, MATCHING_STATUS.MATCHED, album.targetId);
                } else {
                  setAlbumStatus(album.id, MATCHING_STATUS.UNMATCHED);
                }
              });
            }
          } else if (task.type === MATCHING_TYPES.PLAYLIST && task.data.playlist) {
            // Filter out tracks that already have a targetId
            const tracksToMatch = task.data.playlist.tracks.filter(
              track => !getTrackTargetId(track.id)
            );

            // Set filtered tracks to pending
            tracksToMatch.forEach(track => setTrackStatus(track.id, MATCHING_STATUS.PENDING));

            // Skip if no tracks to match
            if (tracksToMatch.length === 0) {
              updateProgress(taskId, 100);
              return;
            }

            // Execute search with abort check in the progress callback
            const result = await provider.search(tracksToMatch, (progress: number) => {
              // Only throw AbortError when explicitly cancelled
              if (signal.aborted) {
                const error = new DOMException("Aborted", "AbortError");
                throw error;
              }
              updateProgress(taskId, progress < 1 ? progress * 100 : progress);
            });

            // Update track statuses
            if (result.tracks) {
              result.tracks.forEach(track => {
                if (track.targetId) {
                  setTrackStatus(track.id, MATCHING_STATUS.MATCHED, track.targetId);
                } else {
                  setTrackStatus(track.id, MATCHING_STATUS.UNMATCHED);
                }
              });
            }
          }
        } catch (error) {
          console.error("Error during matching:", error);

          // Don't mark as unmatched if the operation was aborted
          if (
            (error instanceof DOMException && error.name === "AbortError") ||
            (error instanceof Error && error.message === "Aborted")
          ) {
            console.log("Task was aborted");
            return;
          }

          // Mark all items as unmatched on error
          if (task.type === MATCHING_TYPES.LIKED_SONGS && task.data.likedSongs) {
            task.data.likedSongs.forEach(track =>
              setTrackStatus(track.id, MATCHING_STATUS.UNMATCHED)
            );
          } else if (task.type === MATCHING_TYPES.ALBUMS && task.data.albums) {
            task.data.albums.forEach(album => setAlbumStatus(album.id, MATCHING_STATUS.UNMATCHED));
          } else if (task.type === MATCHING_TYPES.PLAYLIST && task.data.playlist) {
            task.data.playlist.tracks.forEach(track =>
              setTrackStatus(track.id, MATCHING_STATUS.UNMATCHED)
            );
          }
        } finally {
          // Only clear the currentTaskId if it still matches this task
          if (currentTaskIdRef.current === taskUniqueId) {
            console.log(`Completing task execution: ${taskUniqueId}`);
            currentTaskIdRef.current = null;
          }

          // Only complete the task if it's still the active one
          if (state.activeTask?.id === task.id && state.activeTask?.type === task.type) {
            dispatch({ type: "COMPLETE_TASK" });
          }
        }
      };

      // Execute the active task
      executeTask(state.activeTask);

      // Cleanup function for component unmount or dependency changes
      return () => {
        // If we're unmounting or about to start a different task,
        // abort the current task operation
        if (abortControllerRef.current) {
          console.log(`Aborting previous task: ${currentTaskIdRef.current}`);
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      };
    },
    // the abort logic triggers a re-render, so we need to exclude some dependencies here
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.activeTask?.id, state.activeTask?.type]
  );

  // Context value
  const contextValue: MatchingContextType = {
    getTrackStatus,
    getTrackTargetId,
    getAlbumStatus,
    getAlbumTargetId,
    matchLikedSongs,
    matchAlbums,
    matchPlaylistTracks,
    cancelMatching,
    getMatchingStatus,
    isMatchingInProgress,
  };

  return <MatchingContext.Provider value={contextValue}>{children}</MatchingContext.Provider>;
};
