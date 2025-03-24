import { vi } from "vitest";

// Mock functions
export const mockConfigure = vi.fn().mockResolvedValue(undefined);
export const mockAuthorize = vi.fn().mockResolvedValue("mock-user-token");
export const mockSearch = vi.fn().mockResolvedValue({ songs: { data: [] } });
export const mockAddToLibrary = vi.fn().mockResolvedValue(undefined);
export const mockCreatePlaylist = vi.fn().mockResolvedValue({ id: "mock-playlist-id" });
export const mockAddTracksToPlaylist = vi.fn().mockResolvedValue(undefined);

// Mock MusicKit instance
const mockInstance = {
  authorize: mockAuthorize,
  api: {
    search: mockSearch,
    library: {
      add: mockAddToLibrary,
      playlists: {
        create: mockCreatePlaylist,
        addTracks: mockAddTracksToPlaylist,
      },
    },
  },
};

// Mock MusicKit global object
const MusicKit = {
  configure: mockConfigure,
  getInstance: vi.fn().mockReturnValue(mockInstance),
};

export default MusicKit;
