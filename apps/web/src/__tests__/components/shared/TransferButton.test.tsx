import { vi } from "vitest";

// Mock the contexts first
import * as LibraryContextMock from "@/__mocks__/contexts/LibraryContext";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import { resetMocks as resetMatchingMocks, useMatching } from "@/__mocks__/hooks/useMatching";
import { initialMatchingState } from "@/contexts/LibraryContext.matchingState";

vi.mock("@/hooks/useMatching", () => ({ useMatching }));
vi.mock("@/contexts/LibraryContext", () => LibraryContextMock);

// Import and setup navigation mock
import { mockNextNavigation } from "@/__tests__/testUtils";

mockNextNavigation();

import { render, screen } from "@testing-library/react";
// Regular imports
import { beforeEach, describe, expect, it } from "vitest";
import { TestWrapper } from "@/__tests__/testUtils";
import { TransferButton } from "@/components/shared/TransferButton";

describe("TransferButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMatchingMocks(); // Reset useMatching mock state and spies
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
    // Mock the useMatching hook to return empty matches if needed
    // (adjust as needed for your TransferButton logic)
    render(
      <TestWrapper>
        <TransferButton />
      </TestWrapper>
    );

    const transferButton = screen.getByRole("transfer-button");
    expect(transferButton).toBeDisabled();
  });

  it("shows enabled state and correct usage text when tracks and playlists are matched", () => {
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
      matching: initialMatchingState,
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

    // Check the usage text shows correct counts
    const usageText = screen.getByText("10 transfers left");
    expect(usageText).toBeInTheDocument();
  });
});
