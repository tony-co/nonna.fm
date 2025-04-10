import React from "react";
import { vi } from "vitest";
import { mockTracks, mockAlbums } from "@/__mocks__/data/libraryData";
import type { ItemStatus } from "@/contexts/MatchingContext";

// Create individual mocks that can be accessed and modified in tests
export const mockFns = {
  getTrackStatus: vi.fn((id: string): ItemStatus => {
    const track = mockTracks.find(track => track.id === id);
    return (track?.status as ItemStatus) || "matched";
  }),
  getTrackTargetId: vi.fn((id: string): string | undefined => {
    const track = mockTracks.find(track => track.id === id);
    return track?.targetId;
  }),
  getAlbumStatus: vi.fn((id: string): ItemStatus => {
    const album = mockAlbums.find(album => album.id === id);
    return (album?.status as ItemStatus) || "matched";
  }),
  getAlbumTargetId: vi.fn((id: string): string | undefined => {
    const album = mockAlbums.find(album => album.id === id);
    return album?.targetId;
  }),
  matchLikedSongs: vi.fn().mockImplementation((_songs, _targetService) => {
    return Promise.resolve();
  }),
  matchAlbums: vi.fn().mockImplementation((_albums, _targetService) => {
    return Promise.resolve();
  }),
  matchPlaylistTracks: vi.fn().mockImplementation((_playlistId, _tracks, _targetService) => {
    return Promise.resolve();
  }),
  cancelMatching: vi.fn().mockImplementation(_type => {}),
  getMatchingStatus: vi.fn().mockReturnValue({
    isMatching: false,
    status: "idle",
    progress: 0,
  }),
  isMatchingInProgress: vi.fn().mockReturnValue(false),
};

// Reset all mocks between tests
export const resetMocks = () => {
  Object.values(mockFns).forEach(mock => mock.mockClear());
};

const mockContext = {
  ...mockFns,
};

const MatchingContext = React.createContext(mockContext);

export const useMatching = () => React.useContext(MatchingContext);

export const MatchingProvider = ({ children }: { children: React.ReactNode }) => (
  <MatchingContext.Provider value={mockContext}>{children}</MatchingContext.Provider>
);

export const MATCHING_STATUS = {
  PENDING: "pending",
  MATCHED: "matched",
  UNMATCHED: "unmatched",
} as const;

export const MATCHING_TYPES = {
  LIKED_SONGS: "likedSongs",
  ALBUMS: "albums",
  PLAYLIST: "playlist",
} as const;
