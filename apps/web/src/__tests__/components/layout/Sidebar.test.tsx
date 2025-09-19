// Setup mocks first
import { vi } from "vitest";

// Mock the contexts first
import * as LibraryContextMock from "@/__mocks__/contexts/LibraryContext";
import {
  mockFns as matchingMockFns,
  resetMocks as resetMatchingMocks,
  useMatching,
} from "@/__mocks__/hooks/useMatching";

vi.mock("@/hooks/useMatching", () => ({ useMatching }));
vi.mock("@/contexts/LibraryContext", () => LibraryContextMock);

import * as SelectionContextMock from "@/__mocks__/contexts/SelectionContext";

vi.mock("@/contexts/SelectionContext", () => SelectionContextMock);

// Import and setup navigation mock
import { mockNextNavigation } from "@/__tests__/testUtils";

mockNextNavigation();

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// Regular imports
import { beforeEach, describe, expect, it } from "vitest";
import { mockLibraryState } from "@/__mocks__/contexts/LibraryContext";
import { mockNavigationImplementation, TestWrapper } from "@/__tests__/testUtils";
import { LibrarySidebar } from "@/components/layout/Sidebar";

// Mock the fetchPlaylistTracks function
const mockFetchPlaylistTracks = vi.hoisted(() =>
  vi.fn().mockResolvedValue([
    { id: "1", name: "Track 1" },
    { id: "2", name: "Track 2" },
  ])
);

vi.mock("@/lib/musicApi", () => ({
  fetchPlaylistTracks: mockFetchPlaylistTracks,
}));

// Mock components
vi.mock("@/components/shared/ArtworkImage", () => ({
  // biome-ignore lint/performance/noImgElement: Using img in test mock is appropriate
  ArtworkImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

// Mock the shared TransferButton state
vi.mock("@/components/shared/TransferButton", () => ({
  fetchingPlaylists: new Set(),
}));

describe("LibrarySidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMatchingMocks(); // Reset useMatching mock state and spies
  });

  describe("Rendering", () => {
    it("renders all sections when library data is available", () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      expect(screen.getByText("Liked Songs", { ignore: ".sr-only" })).toBeInTheDocument();
      expect(screen.getByText("5 Tracks")).toBeInTheDocument();
      expect(screen.getByText("Albums", { ignore: ".sr-only" })).toBeInTheDocument();
      expect(screen.getByText(/\d+ Albums/, { ignore: ".sr-only" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "View Liked Songs" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "View Albums" })).toBeInTheDocument();
    });

    it("returns null when library data is not available", () => {
      render(
        <TestWrapper
          initialState={{
            ...mockLibraryState,
            likedSongs: undefined,
            albums: undefined,
            playlists: undefined,
            status: { isLoading: false, error: null },
          }}
        >
          <LibrarySidebar />
        </TestWrapper>
      );
      expect(screen.queryByText("Liked Songs")).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    let routerPushSpy: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      // Set up router mock with spy
      routerPushSpy = vi.fn();
      const baseRouter = mockNavigationImplementation.useRouter();
      vi.spyOn(mockNavigationImplementation, "useRouter").mockImplementation(() => ({
        ...baseRouter,
        push: routerPushSpy,
      }));
    });

    it("navigates to liked songs page when clicked", async () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId("liked-songs-section"));

      await waitFor(() => {
        expect(routerPushSpy).toHaveBeenCalledWith("/library/spotify/apple/liked");
      });
    });

    it("navigates to albums page when clicked", async () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId("albums-section"));

      await waitFor(() => {
        expect(routerPushSpy).toHaveBeenCalledWith("/library/spotify/apple/albums");
      });
    });

    it("navigates to playlist page when playlist is clicked", async () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      // Get first playlist from the mock data
      const playlistId = Array.from(mockLibraryState.playlists?.values() ?? [])[0].id;
      const playlistItem = screen.getByTestId(`playlist-item-${playlistId}`);
      expect(playlistItem).toBeInTheDocument();

      fireEvent.click(playlistItem);

      await waitFor(() => {
        expect(routerPushSpy).toHaveBeenCalledWith(`/library/spotify/apple/playlist/${playlistId}`);
      });
    });
  });

  describe("Selection and Matching", () => {
    beforeEach(() => {
      vi.clearAllMocks();
      SelectionContextMock.resetMocks();
    });

    it("triggers selection and matching for liked songs", () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      // Click the liked songs checkbox
      fireEvent.click(screen.getByTestId("liked-songs-checkbox"));

      // Verify selection and matching were triggered
      expect(LibraryContextMock.mockActions.selectAllTracks).toHaveBeenCalled();
      expect(matchingMockFns.matchLikedSongs).toHaveBeenCalledWith(
        Array.from(mockLibraryState.likedSongs ?? []),
        "apple"
      );
    });

    it("cancels matching when deselecting", () => {
      render(
        <TestWrapper>
          <LibrarySidebar />
        </TestWrapper>
      );

      const checkbox = screen.getByTestId("liked-songs-checkbox");

      // First click to select
      fireEvent.click(checkbox);
      expect(LibraryContextMock.mockActions.selectAllTracks).toHaveBeenCalled();

      // Second click to deselect
      fireEvent.click(checkbox);
      expect(LibraryContextMock.mockActions.deselectAllTracks).toHaveBeenCalled();
      expect(matchingMockFns.cancelMatching).toHaveBeenCalledWith("likedSongs");
    });

    it("handles playlist selection and fetching", () => {
      // Create a modified state where the first playlist has no tracks
      const modifiedState = {
        ...mockLibraryState,
        playlists: new Map(
          Array.from(mockLibraryState.playlists?.entries() ?? []).map(([id, playlist], index) => {
            if (index === 0) {
              return [id, { ...playlist, tracks: [] }];
            }
            return [id, playlist];
          })
        ),
      };

      render(
        <TestWrapper initialState={modifiedState}>
          <LibrarySidebar />
        </TestWrapper>
      );

      // Find and select a playlist
      const playlistCheckbox = screen.getAllByRole("checkbox")[2]; // First playlist checkbox
      fireEvent.click(playlistCheckbox);

      // Verify playlist selection and fetching
      expect(LibraryContextMock.mockActions.selectPlaylist).toHaveBeenCalled();
      expect(mockFetchPlaylistTracks).toHaveBeenCalled();
    });
  });
});
