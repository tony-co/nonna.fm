import type React from "react";
import { createContext, useContext, useState } from "react";
import { vi } from "vitest";
import { mockLibraryData } from "@/__mocks__/data/libraryData";
import type { LibraryState } from "@/types";

// Mock library state
const initialMockState: LibraryState = {
  likedSongs: new Set(mockLibraryData.likedSongs),
  albums: new Set(mockLibraryData.albums),
  playlists: new Map(mockLibraryData.playlists.map(p => [p.id, p])),
  selectedItems: {
    tracks: new Set<string>(),
    albums: new Set<string>(),
    playlists: new Set<string>(),
  },
  status: {
    isLoading: false,
    error: null,
  },
  matching: {
    isLoading: false,
    error: null,
    progress: {},
    currentTask: null,
  },
};

// Export for backward compatibility with existing tests
export const mockLibraryState = initialMockState;

// Create mock actions type
type MockActions = {
  selectAllTracks: ReturnType<typeof vi.fn>;
  deselectAllTracks: ReturnType<typeof vi.fn>;
  selectAlbum: ReturnType<typeof vi.fn>;
  deselectAlbum: ReturnType<typeof vi.fn>;
  selectPlaylist: ReturnType<typeof vi.fn>;
  deselectPlaylist: ReturnType<typeof vi.fn>;
  selectAllAlbums: ReturnType<typeof vi.fn>;
  deselectAllAlbums: ReturnType<typeof vi.fn>;
  selectAllPlaylists: ReturnType<typeof vi.fn>;
  deselectAllPlaylists: ReturnType<typeof vi.fn>;
  resetSelection: ReturnType<typeof vi.fn>;
  setLikedSongs: ReturnType<typeof vi.fn>;
  setAlbums: ReturnType<typeof vi.fn>;
  setPlaylists: ReturnType<typeof vi.fn>;
  updatePlaylist: ReturnType<typeof vi.fn>;
  updateLibrary: ReturnType<typeof vi.fn>;
  setLoading: ReturnType<typeof vi.fn>;
  setError: ReturnType<typeof vi.fn>;
};

// Create mock actions
export const mockActions: MockActions = {
  selectAllTracks: vi.fn(),
  deselectAllTracks: vi.fn(),
  selectAlbum: vi.fn(),
  deselectAlbum: vi.fn(),
  selectPlaylist: vi.fn(),
  deselectPlaylist: vi.fn(),
  selectAllAlbums: vi.fn(),
  deselectAllAlbums: vi.fn(),
  selectAllPlaylists: vi.fn(),
  deselectAllPlaylists: vi.fn(),
  resetSelection: vi.fn(),
  setLikedSongs: vi.fn(),
  setAlbums: vi.fn(),
  setPlaylists: vi.fn(),
  updatePlaylist: vi.fn(),
  updateLibrary: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
};

// Create the context type
type LibraryContextType = {
  state: LibraryState;
  dispatch: ReturnType<typeof vi.fn>;
  actions: MockActions;
};

// Create the context
const LibraryContext = createContext<LibraryContextType | null>(null);

export const LibraryProvider = ({
  children,
  initialState = initialMockState,
}: {
  children: React.ReactNode;
  initialState?: LibraryState;
}) => {
  const [state, setState] = useState(initialState);
  const contextValue: LibraryContextType = {
    state,
    dispatch: vi.fn(),
    actions: {
      ...mockActions,
      selectAllTracks: vi.fn(() => {
        mockActions.selectAllTracks();
        setState(prev => ({
          ...prev,
          selectedItems: {
            ...prev.selectedItems,
            tracks: new Set([...(prev.likedSongs ?? [])].map(track => track.id)),
          },
        }));
      }),
      deselectAllTracks: vi.fn(() => {
        mockActions.deselectAllTracks();
        setState(prev => ({
          ...prev,
          selectedItems: {
            ...prev.selectedItems,
            tracks: new Set(),
          },
        }));
      }),
      setLoading: vi.fn((isLoading: boolean) => {
        setState(prev => ({
          ...prev,
          status: { ...prev.status, isLoading },
        }));
      }),
      setError: vi.fn((error: string | null) => {
        setState(prev => ({
          ...prev,
          status: { ...prev.status, error },
        }));
      }),
    },
  };

  return <LibraryContext.Provider value={contextValue}>{children}</LibraryContext.Provider>;
};

// Create the hook that uses the context
export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
};

// Create the selection hook
export const useLibrarySelection = () => {
  const { state, actions } = useLibrary();
  return {
    selectedItems: state.selectedItems,
    ...actions,
  };
};

// Mock the real context module
vi.mock("@/contexts/LibraryContext", () => ({
  LibraryContext,
  LibraryProvider,
  useLibrary,
  useLibrarySelection,
}));
