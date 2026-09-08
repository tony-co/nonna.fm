import type { Dispatch } from "react";
import { fetchPlaylistTracks } from "@/lib/musicApi";
import { musicServiceFactory } from "@/lib/services/factory";
import type { IPlaylist, LibraryAction, LibraryState, QueueTask, UseMatchingReturn } from "@/types";

type MatchingActions = Pick<
  UseMatchingReturn,
  "matchLikedSongs" | "matchAlbums" | "matchPlaylistTracks" | "cancelMatching"
>;

export interface LibraryOperations extends MatchingActions {
  loadPlaylist: (id: string) => Promise<IPlaylist>;
  activate: () => void;
  dispose: () => void;
}

export function getTaskKey(task: QueueTask): string {
  return task.type === "playlist" ? `playlist:${task.playlist.id}` : task.type;
}

export function createLibraryOperations(
  getState: () => LibraryState,
  dispatch: Dispatch<LibraryAction>
): LibraryOperations {
  let isActive = true;
  const queue: QueueTask[] = [];
  let current: { task: QueueTask; controller: AbortController } | null = null;
  const loads = new Map<string, Promise<IPlaylist>>();
  let generation = 0;

  async function processQueue(): Promise<void> {
    if (current || !isActive) return;
    const task = queue.shift();
    if (!task) return;
    const run = { task, controller: new AbortController() };
    current = run;
    const { signal } = run.controller;
    const key = getTaskKey(task);
    dispatch({ type: "MATCHING_START", payload: task });
    try {
      const provider = musicServiceFactory.getProvider(task.targetService);
      const onProgress = (progress: number) => {
        signal.throwIfAborted();
        dispatch({
          type: "MATCHING_PROGRESS",
          payload: { key, value: Math.round(Math.max(0, Math.min(1, progress)) * 100) },
        });
      };
      const state = getState();
      const requested =
        task.type === "albums"
          ? task.albums
          : task.type === "likedSongs"
            ? task.tracks
            : task.playlist.tracks;
      const currentItems =
        task.type === "albums"
          ? Array.from(state.albums ?? [])
          : task.type === "likedSongs"
            ? Array.from(state.likedSongs ?? [])
            : (state.playlists?.get(task.playlist.id)?.tracks ?? []);
      const currentItemsById = new Map(currentItems.map(item => [item.id, item]));
      const unmatched = requested.filter(
        item => !item.targetId && !currentItemsById.get(item.id)?.targetId
      );
      if (unmatched.length > 0) {
        dispatch({
          type: "MATCHING_ITEMS_PENDING",
          payload: { task, ids: unmatched.map(item => item.id) },
        });
        const result =
          task.type === "albums"
            ? await provider.searchAlbums(unmatched, onProgress)
            : await provider.search(unmatched, onProgress);
        signal.throwIfAborted();
        dispatch({ type: "MATCHING_ITEMS_COMPLETE", payload: { task, result } });
      }
      signal.throwIfAborted();
      dispatch({ type: "MATCHING_COMPLETE", payload: key });
    } catch (error) {
      if (!signal.aborted && isActive) {
        dispatch({
          type: "MATCHING_ERROR",
          payload: error instanceof Error ? error.message : "Matching failed",
        });
      }
    } finally {
      if (current === run) current = null;
      void processQueue();
    }
  }

  async function enqueue(task: QueueTask): Promise<void> {
    if (!isActive) return;
    const key = getTaskKey(task);
    if (current && !current.controller.signal.aborted && getTaskKey(current.task) === key) return;
    if (queue.some(queued => getTaskKey(queued) === key)) return;
    queue.push(task);
    if (current?.controller.signal.aborted && queue[0] === task) {
      dispatch({ type: "MATCHING_START", payload: task });
    }
    void processQueue();
  }

  function loadPlaylist(id: string): Promise<IPlaylist> {
    const existing = loads.get(id);
    if (existing) return existing;
    const playlist = getState().playlists?.get(id);
    if (!playlist) return Promise.reject(new Error(`Playlist not found: ${id}`));
    if (getState().playlistLoads?.[id]?.status === "loaded") return Promise.resolve(playlist);

    const startedGeneration = generation;
    const canUpdate = () => isActive && generation === startedGeneration;
    dispatch({ type: "PLAYLIST_LOAD_STATUS", payload: { id, status: "loading" } });
    const pending = fetchPlaylistTracks(id, tracks => {
      if (canUpdate()) dispatch({ type: "PLAYLIST_TRACKS", payload: { id, tracks } });
    })
      .then(tracks => {
        const complete = { ...(getState().playlists?.get(id) ?? playlist), tracks };
        if (canUpdate()) {
          dispatch({ type: "PLAYLIST_TRACKS", payload: { id, tracks } });
          dispatch({ type: "PLAYLIST_LOAD_STATUS", payload: { id, status: "loaded" } });
        }
        return complete;
      })
      .catch(error => {
        if (canUpdate())
          dispatch({
            type: "PLAYLIST_LOAD_STATUS",
            payload: {
              id,
              status: "error",
              error: error instanceof Error ? error.message : "Failed to fetch tracks",
            },
          });
        throw error;
      })
      .finally(() => {
        if (loads.get(id) === pending) loads.delete(id);
      });
    loads.set(id, pending);
    return pending;
  }

  return {
    loadPlaylist,
    matchLikedSongs: (tracks, targetService) =>
      enqueue({ type: "likedSongs", tracks, targetService }),
    matchAlbums: (albums, targetService) => enqueue({ type: "albums", albums, targetService }),
    matchPlaylistTracks: (playlist, targetService) =>
      enqueue({ type: "playlist", playlist, targetService }),
    cancelMatching: (type, id) => {
      const key = type === "playlist" ? `playlist:${id}` : type;
      for (let index = queue.length - 1; index >= 0; index--) {
        if (getTaskKey(queue[index]) === key) queue.splice(index, 1);
      }
      if (current && getTaskKey(current.task) === key) current.controller.abort();
      dispatch({ type: "MATCHING_CANCEL", payload: { type, id } });
      if (current?.controller.signal.aborted && queue[0]) {
        dispatch({ type: "MATCHING_START", payload: queue[0] });
      }
    },
    activate: () => {
      isActive = true;
    },
    dispose: () => {
      isActive = false;
      generation++;
      current?.controller.abort();
      queue.length = 0;
      loads.clear();
    },
  };
}
