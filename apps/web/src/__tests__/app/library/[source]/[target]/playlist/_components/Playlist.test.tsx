import { vi } from "vitest";

// Import and setup navigation mock
import { mockNextNavigation, mockReactSuspense } from "@/__tests__/testUtils";
mockNextNavigation();
mockReactSuspense();

// Mock usePlaylistTracks hook
const mockUsePlaylistTracks = vi.fn();
vi.mock("@/hooks/usePlaylistTracks", () => ({
  usePlaylistTracks: (playlistId: string) => mockUsePlaylistTracks(playlistId),
}));

// Mock PlayOnButton component
vi.mock("@/components/shared/PlayOnButton", () => ({
  PlayOnButton: () => null,
}));

// Mock getServiceType
vi.mock("@/lib/auth/constants", () => ({
  getServiceType: () => "spotify",
}));

// Regular imports
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Playlist } from "@/app/[locale]/library/[source]/[target]/playlist/[id]/_components/Playlist";
import { TestWrapper } from "@/__tests__/testUtils";
import { mockPlaylists } from "@/__mocks__/data/libraryData";
import { MusicService } from "@/types";

// Mock useParams for route parameter extraction
const mockParams = {
  playlistId: mockPlaylists[0].id,
  source: "spotify" as MusicService,
  target: "apple" as MusicService,
};

vi.mock("next/navigation", () => ({
  ...vi.importActual("next/navigation"),
  useParams: () => mockParams,
}));

describe("Playlist", () => {
  beforeEach(() => {
    // Clear all mocks and their implementations
    vi.clearAllMocks();
    vi.resetAllMocks();

    // Set default mock implementation for each test
    mockUsePlaylistTracks.mockImplementation((playlistId: string) => ({
      playlist: mockPlaylists.find(p => p.id === playlistId),
      isLoading: false,
      error: null,
    }));
  });

  it("renders loading spinner while loading", () => {
    // Override the default mock for this test
    mockUsePlaylistTracks.mockImplementation(() => ({
      playlist: undefined,
      isLoading: true,
      error: null,
    }));

    render(
      <TestWrapper initialLoading={true}>
        <Playlist playlistId={mockPlaylists[0].id} />
      </TestWrapper>
    );

    expect(screen.getByRole("loading")).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders playlist details (count unmatched tracks) when loaded", () => {
    render(
      <TestWrapper initialLoading={false}>
        <Playlist playlistId={mockPlaylists[0].id} />
      </TestWrapper>
    );

    // Check playlist header
    expect(screen.getByText(mockPlaylists[0].name)).toBeInTheDocument();

    const count = mockPlaylists[0].tracks.length;
    const unmatched = mockPlaylists[0].tracks.filter(track => track.status === "unmatched").length;
    expect(
      screen.getByText((content, _element) => {
        return content !== null && content.includes(`${count} tracks`);
      })
    ).toBeInTheDocument();
    if (unmatched > 0) {
      expect(screen.getByText(`${unmatched} unmatched`)).toBeInTheDocument();
    }
  });

  it("renders track list correctly", () => {
    render(
      <TestWrapper initialLoading={false}>
        <Playlist playlistId={mockPlaylists[0].id} />
      </TestWrapper>
    );

    const trackList = screen.getByRole("tracklist");
    const tracks = within(trackList).getAllByRole("track");

    expect(tracks).toHaveLength(mockPlaylists[0].tracks.length);

    // Check each track from our mock data
    mockPlaylists[0].tracks.forEach(track => {
      expect(screen.getByText(track.name)).toBeInTheDocument();
      expect(screen.getByText(track.artist)).toBeInTheDocument();
    });
  });

  it("renders error state when there is an error", () => {
    // Override the default mock for this test
    mockUsePlaylistTracks.mockImplementation(() => ({
      playlist: undefined,
      isLoading: false,
      error: "Failed to load playlist",
    }));

    render(
      <TestWrapper initialLoading={false}>
        <Playlist playlistId={mockPlaylists[0].id} />
      </TestWrapper>
    );

    expect(screen.getByText(/failed to load playlist/i)).toBeInTheDocument();
  });
});
