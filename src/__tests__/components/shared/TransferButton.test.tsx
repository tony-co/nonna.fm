import { vi } from "vitest";

// Mock the contexts first
import * as MatchingContextMock from "@/__mocks__/contexts/MatchingContext";
import * as LibraryContextMock from "@/__mocks__/contexts/LibraryContext";
import { mockFns } from "@/__mocks__/contexts/MatchingContext";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
vi.mock("@/contexts/MatchingContext", () => MatchingContextMock);
vi.mock("@/contexts/LibraryContext", () => LibraryContextMock);

// Import and setup navigation mock
import { mockNextNavigation } from "@/__tests__/testUtils";
mockNextNavigation();

// Regular imports
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransferButton } from "@/components/shared/TransferButton";
import { TestWrapper } from "@/__tests__/testUtils";

describe("TransferButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    MatchingContextMock.resetMocks();
  });

  it("renders the transfer button", () => {
    render(
      <TestWrapper>
        <TransferButton />
      </TestWrapper>
    );

    const transferButton = screen.getByRole("transfer-button");
    expect(transferButton).toBeInTheDocument();
  });

  it("shows disabled state when no matches available", () => {
    // Mock the useMatching hook to return empty matches
    vi.spyOn(MatchingContextMock, "useMatching").mockImplementation(() => ({
      ...mockFns,
      matches: new Map(),
    }));

    render(
      <TestWrapper>
        <TransferButton />
      </TestWrapper>
    );

    const transferButton = screen.getByRole("transfer-button");
    expect(transferButton).toBeDisabled();
  });

  it("shows enabled state and correct summary text when tracks and playlists are matched", () => {
    // Mock a selection of tracks and playlists
    const libraryState = {
      selectedItems: {
        tracks: new Set(["track_1", "track_2"]),
        albums: new Set<string>(),
        playlists: new Set(["playlist_1"]),
      },
      likedSongs: new Set(mockTracks),
      albums: new Set(mockAlbums),
      playlists: new Map(mockPlaylists.map(playlist => [playlist.id, playlist])),
      status: {
        isLoading: false,
        error: null,
      },
    };

    render(
      <TestWrapper>
        <LibraryContextMock.LibraryProvider initialState={libraryState}>
          <TransferButton />
        </LibraryContextMock.LibraryProvider>
      </TestWrapper>
    );

    const transferButton = screen.getByRole("transfer-button");
    expect(transferButton).not.toBeDisabled();

    // Check the summary text shows correct counts
    const summaryText = screen.getByText("2 liked tracks, 1 playlists");
    expect(summaryText).toBeInTheDocument();
  });
});
