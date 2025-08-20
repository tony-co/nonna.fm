import { vi } from "vitest";
import { ISelectionState } from "@/types";

// Mock state
export const mockSelectionState: ISelectionState = {
  playlists: new Map(),
  likedSongs: new Set(),
  albums: new Set(),
};

// Mock functions
export const mockFns = {
  toggleLikedSongs: vi.fn(),
  toggleLikedSong: vi.fn(),
  toggleAlbum: vi.fn(),
  togglePlaylist: vi.fn(),
  togglePlaylistTrack: vi.fn(),
  toggleAllAlbums: vi.fn(),
  toggleAllPlaylists: vi.fn(),
  setSelectedView: vi.fn(),
};

// Reset all mocks
export const resetMocks = () => {
  mockSelectionState.playlists.clear();
  mockSelectionState.likedSongs.clear();
  mockSelectionState.albums.clear();
  Object.values(mockFns).forEach(mock => mock.mockReset());
};

// Default mock implementation
export const useSelection = vi.fn().mockReturnValue({
  selection: mockSelectionState,
  selectedView: null,
  isSelectionDisabled: false,
  ...mockFns,
});

const SelectionContextMock = {
  useSelection,
  SelectionProvider: ({ children }: { children: React.ReactNode }) => children,
};

export default SelectionContextMock;
