"use client";

import { createContext, useReducer, useContext, useMemo } from "react";
import type { LibraryState, LibraryAction, ITrack, IAlbum, IPlaylist } from "@/types/library";
import { initialMatchingState } from "./LibraryContext.matchingState";
import { matchingReducer } from "./LibraryContext.matchingReducer";

// Initial state
const initialLibraryState: LibraryState = {
  likedSongs: new Set(),
  albums: new Set(),
  playlists: new Map(),
  selectedItems: {
    tracks: new Set(),
    albums: new Set(),
    playlists: new Set(),
  },
  status: {
    isLoading: false,
    error: null,
  },
  matching: initialMatchingState,
};

// Context type
interface LibraryContextType {
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
  actions: {
    // Selection actions
    selectAllTracks: () => void;
    deselectAllTracks: () => void;
    selectPlaylist: (playlistId: string) => void;
    deselectPlaylist: (playlistId: string) => void;
    selectAllAlbums: () => void;
    deselectAllAlbums: () => void;
    selectAllPlaylists: () => void;
    deselectAllPlaylists: () => void;
    resetSelection: () => void;

    // Library data actions
    setLikedSongs: (songs: Set<ITrack>) => void;
    setAlbums: (albums: Set<IAlbum>) => void;
    setPlaylists: (playlists: Map<string, IPlaylist>) => void;
    updatePlaylist: (playlist: IPlaylist) => void;
    updateLibrary: (
      data: Partial<Pick<LibraryState, "likedSongs" | "albums" | "playlists">>
    ) => void;

    // Status actions
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

// Create context
export const LibraryContext = createContext<LibraryContextType | null>(null);

// Reducer function
function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  // Delegate matching actions to matchingReducer
  switch (action.type) {
    case "MATCHING_START":
    case "MATCHING_PROGRESS":
    case "MATCHING_ERROR":
    case "MATCHING_COMPLETE":
    case "MATCHING_CANCEL":
      return {
        ...state,
        matching: matchingReducer(state.matching, action),
      };
    // Selection actions
    case "SELECT_ALL_TRACKS":
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          tracks: new Set([...(state.likedSongs ?? [])].map(track => track.id)),
        },
      };
    case "DESELECT_ALL_TRACKS":
      return {
        ...state,
        selectedItems: { ...state.selectedItems, tracks: new Set() },
      };
    case "SELECT_PLAYLIST": {
      const newPlaylists = new Set(state.selectedItems.playlists);
      newPlaylists.add(action.payload);
      return {
        ...state,
        selectedItems: { ...state.selectedItems, playlists: newPlaylists },
      };
    }
    case "DESELECT_PLAYLIST": {
      const newPlaylists = new Set(state.selectedItems.playlists);
      newPlaylists.delete(action.payload);
      return {
        ...state,
        selectedItems: { ...state.selectedItems, playlists: newPlaylists },
      };
    }
    case "SELECT_ALL_ALBUMS":
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          albums: new Set([...(state.albums ?? [])].map(album => album.id)),
        },
      };
    case "DESELECT_ALL_ALBUMS":
      return {
        ...state,
        selectedItems: { ...state.selectedItems, albums: new Set() },
      };
    case "SELECT_ALL_PLAYLISTS":
      return {
        ...state,
        selectedItems: {
          ...state.selectedItems,
          playlists: new Set([...(state.playlists?.keys() ?? [])]),
        },
      };
    case "DESELECT_ALL_PLAYLISTS":
      return {
        ...state,
        selectedItems: { ...state.selectedItems, playlists: new Set() },
      };
    case "RESET_SELECTION":
      return {
        ...state,
        selectedItems: {
          tracks: new Set(),
          albums: new Set(),
          playlists: new Set(),
        },
      };

    // Library data actions
    case "SET_LIKED_SONGS":
      return { ...state, likedSongs: action.payload };
    case "SET_ALBUMS":
      return { ...state, albums: action.payload };
    case "SET_PLAYLISTS":
      return { ...state, playlists: action.payload };
    case "UPDATE_PLAYLIST": {
      const newPlaylists = new Map(state.playlists);
      newPlaylists.set(action.payload.id, action.payload);
      return { ...state, playlists: newPlaylists };
    }
    case "UPDATE_LIBRARY":
      return { ...state, ...action.payload };

    // Status actions
    case "SET_LOADING":
      return { ...state, status: { ...state.status, isLoading: action.payload } };
    case "SET_ERROR":
      return { ...state, status: { ...state.status, error: action.payload } };

    default:
      return state;
  }
}

// Provider component
export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, initialLibraryState);

  const actions = useMemo(
    () => ({
      // Selection actions
      selectAllTracks: () => dispatch({ type: "SELECT_ALL_TRACKS" }),
      deselectAllTracks: () => dispatch({ type: "DESELECT_ALL_TRACKS" }),
      selectPlaylist: (playlistId: string) =>
        dispatch({ type: "SELECT_PLAYLIST", payload: playlistId }),
      deselectPlaylist: (playlistId: string) =>
        dispatch({ type: "DESELECT_PLAYLIST", payload: playlistId }),
      selectAllAlbums: () => dispatch({ type: "SELECT_ALL_ALBUMS" }),
      deselectAllAlbums: () => dispatch({ type: "DESELECT_ALL_ALBUMS" }),
      selectAllPlaylists: () => dispatch({ type: "SELECT_ALL_PLAYLISTS" }),
      deselectAllPlaylists: () => dispatch({ type: "DESELECT_ALL_PLAYLISTS" }),
      resetSelection: () => dispatch({ type: "RESET_SELECTION" }),

      // Library data actions
      setLikedSongs: (songs: Set<ITrack>) => dispatch({ type: "SET_LIKED_SONGS", payload: songs }),
      setAlbums: (albums: Set<IAlbum>) => dispatch({ type: "SET_ALBUMS", payload: albums }),
      setPlaylists: (playlists: Map<string, IPlaylist>) =>
        dispatch({ type: "SET_PLAYLISTS", payload: playlists }),
      updatePlaylist: (playlist: IPlaylist) =>
        dispatch({ type: "UPDATE_PLAYLIST", payload: playlist }),
      updateLibrary: (data: Partial<Pick<LibraryState, "likedSongs" | "albums" | "playlists">>) =>
        dispatch({ type: "UPDATE_LIBRARY", payload: data }),

      // Status actions
      setLoading: (isLoading: boolean) => dispatch({ type: "SET_LOADING", payload: isLoading }),
      setError: (error: string | null) => dispatch({ type: "SET_ERROR", payload: error }),
    }),
    [dispatch]
  );

  return (
    <LibraryContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </LibraryContext.Provider>
  );
}

// Hooks
export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}

export function useLibrarySelection() {
  const { state, actions } = useLibrary();
  return {
    selectedItems: state.selectedItems,
    ...actions,
  };
}
