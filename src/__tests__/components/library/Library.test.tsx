import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Library } from "@/components/library/Library";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { MatchingProvider } from "@/contexts/MatchingContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { ILibraryData } from "@/types/library";

// Mock Next.js useSearchParams
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue("spotify"),
  }),
}));

// Mock hooks
vi.mock("@/hooks/usePlaylistTracks", () => ({
  usePlaylistTracks: () => ({
    handleLoadPlaylistTracks: vi.fn().mockResolvedValue({}),
  }),
}));

const mockUseTransfer = vi.fn(() => ({
  handleStartTransfer: vi.fn(),
  transferResults: null,
  showSuccessModal: false,
  setShowSuccessModal: vi.fn(),
  error: null as string | null,
}));

vi.mock("@/hooks/useTransfer", () => ({
  useTransfer: () => mockUseTransfer(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

// Mock useLibrary hook
const mockUseLibrary = vi.fn(() => ({
  libraryState: {
    likedSongs: mockTracks,
    albums: mockAlbums,
    playlists: mockPlaylists,
  } as ILibraryData | null,
  isLoading: false,
  error: null as string | null,
  setLibraryState: vi.fn(),
  initializeLibrary: vi.fn(),
  clearError: vi.fn(),
}));

vi.mock("@/contexts/LibraryContext", async () => {
  const actual = await vi.importActual("@/contexts/LibraryContext");
  return {
    ...actual,
    useLibrary: () => mockUseLibrary(),
  };
});

const renderLibrary = (props = {}) => {
  const mergedProps = {
    mode: "select" as const,
    onStartTransfer: vi.fn().mockResolvedValue(undefined),
    onItemClick: vi.fn().mockResolvedValue(undefined),
    onSearchTracks: vi.fn(),
    onCancel: vi.fn(),
    ...props,
  };

  return render(
    <LibraryProvider>
      <MatchingProvider>
        <SelectionProvider
          data={{
            likedSongs: mockTracks,
            albums: mockAlbums,
            playlists: mockPlaylists,
          }}
          mode={mergedProps.mode}
          onSearchTracks={mergedProps.onSearchTracks}
        >
          <Library {...mergedProps} />
        </SelectionProvider>
      </MatchingProvider>
    </LibraryProvider>
  );
};

describe("Library Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLibrary.mockImplementation(() => ({
      libraryState: {
        likedSongs: mockTracks,
        albums: mockAlbums,
        playlists: mockPlaylists,
      } as ILibraryData,
      isLoading: false,
      error: null as string | null,
      setLibraryState: vi.fn(),
      initializeLibrary: vi.fn(),
      clearError: vi.fn(),
    }));
  });

  describe("Initial Render", () => {
    it("renders main sections and shows empty state when library is loaded", () => {
      renderLibrary();

      // Check main sections
      const sidebar = screen.getByRole("sidebar");
      expect(within(sidebar).getByText(/library/i)).toBeInTheDocument();
      expect(screen.getByRole("transfer-button")).toBeDisabled();

      // Check empty state message in main content
      const main = screen.getByRole("main");
      expect(
        within(main).getByText(/select a playlist or album to view its tracks/i)
      ).toBeInTheDocument();
      expect(within(main).getByText(/choose from your library on the left/i)).toBeInTheDocument();
    });

    it("handles loading state", () => {
      mockUseLibrary.mockReturnValueOnce({
        libraryState: null,
        isLoading: true,
        error: null as string | null,
        setLibraryState: vi.fn(),
        initializeLibrary: vi.fn(),
        clearError: vi.fn(),
      });

      renderLibrary();
      expect(screen.queryByRole("main")).not.toBeInTheDocument();
    });

    it("handles error state", () => {
      const errorMessage = "Failed to load library";
      mockUseTransfer.mockReturnValueOnce({
        handleStartTransfer: vi.fn(),
        transferResults: null,
        showSuccessModal: false,
        setShowSuccessModal: vi.fn(),
        error: errorMessage,
      });

      renderLibrary();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe("Selection Handling", () => {
    it("selecting liked songs triggers search", async () => {
      const onSearchTracks = vi.fn().mockResolvedValue(undefined);
      renderLibrary({ onSearchTracks });

      // Select all liked songs
      const likedSongsCheckbox = screen.getByTestId("liked-songs-checkbox");
      fireEvent.click(likedSongsCheckbox);

      expect(likedSongsCheckbox).toBeChecked();
      expect(onSearchTracks).toHaveBeenCalledWith("liked");
    });

    it("allows selecting albums", () => {
      const onSearchTracks = vi.fn().mockResolvedValue(undefined);
      renderLibrary({ onSearchTracks });

      // Select all albums
      const albumsCheckbox = screen.getByTestId("albums-checkbox");
      fireEvent.click(albumsCheckbox);

      expect(albumsCheckbox).toBeChecked();
      expect(onSearchTracks).toHaveBeenCalledWith("albums");
    });

    it("allows selecting individual tracks in liked songs", async () => {
      const onSearchTracks = vi.fn().mockResolvedValue(undefined);
      renderLibrary({ onSearchTracks });

      // Open liked songs view
      const likedSongsSection = screen.getByTestId("liked-songs-section");
      fireEvent.click(likedSongsSection);

      // Wait for track list to be visible
      const trackList = await screen.findByRole("tracklist");
      expect(trackList).toBeInTheDocument();

      // Wait for the setTimeout to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // onSearchTracks should have been called with "liked"
      expect(onSearchTracks).toHaveBeenCalledWith("liked");

      // Get all checkboxes and verify we have them
      const checkboxes = within(trackList).getAllByRole("checkbox");
      expect(checkboxes.length).toBeGreaterThan(1);

      // Select first track
      const firstTrackCheckbox = checkboxes[1];
      fireEvent.click(firstTrackCheckbox);
      const secondTrackCheckbox = checkboxes[2];
      fireEvent.click(secondTrackCheckbox);

      // Verify checkbox state
      expect(firstTrackCheckbox).toBeChecked();
      expect(secondTrackCheckbox).toBeChecked();
      // Wait for onSearchTracks Promise to resolve
      await onSearchTracks.mock.results[onSearchTracks.mock.calls.length - 1].value;
    });
  });

  describe("Mode Handling", () => {
    it.each([
      ["select", /select items to transfer/i],
      ["matching", /matching in progress/i],
      ["transfer", /transferring 0%/i],
      ["completed", /transfer complete/i],
    ])("renders in %s mode", (mode, expectedText) => {
      renderLibrary({ mode });
      const button = screen.getByRole("transfer-button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent(expectedText);
    });
  });

  describe("Selection disabled while matching or transferring", () => {
    it.each([["matching"], ["transfer"]])("disables interactions while in %s mode", mode => {
      renderLibrary({ mode });

      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).toBeDisabled();

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });
  });

  describe("Transfer Flow", () => {
    it("handles successful transfer initiation", async () => {
      const onStartTransfer = vi.fn().mockResolvedValue(undefined);
      const handleStartTransfer = vi.fn(selection => onStartTransfer(selection));
      mockUseTransfer.mockReturnValue({
        handleStartTransfer,
        transferResults: null,
        showSuccessModal: false,
        setShowSuccessModal: vi.fn(),
        error: null,
      });

      renderLibrary();

      // Select liked songs
      const likedSongsCheckbox = screen.getByTestId("liked-songs-checkbox");
      fireEvent.click(likedSongsCheckbox);

      // Wait for button to be enabled
      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).not.toBeDisabled();

      // Start transfer
      fireEvent.click(transferButton);

      expect(handleStartTransfer).toHaveBeenCalledWith(
        expect.objectContaining({
          likedSongs: expect.any(Set),
          albums: expect.any(Set),
          playlists: expect.any(Map),
        })
      );
    });

    it("handles failed transfer initiation", async () => {
      const onStartTransfer = vi.fn().mockRejectedValue(new Error("Transfer failed"));
      const handleStartTransfer = vi.fn(selection => onStartTransfer(selection));
      mockUseTransfer.mockReturnValue({
        handleStartTransfer,
        transferResults: null,
        showSuccessModal: false,
        setShowSuccessModal: vi.fn(),
        error: null,
      });

      renderLibrary();

      // Select liked songs
      const likedSongsCheckbox = screen.getByTestId("liked-songs-checkbox");
      fireEvent.click(likedSongsCheckbox);

      // Wait for button to be enabled
      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).not.toBeDisabled();

      // Start transfer
      fireEvent.click(transferButton);

      await expect(handleStartTransfer).rejects.toThrow("Transfer failed");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      renderLibrary();

      // Check main landmarks
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByRole("sidebar")).toBeInTheDocument();

      // Check interactive elements
      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute("aria-label");
      });

      // Check headings hierarchy
      const headings = screen.getAllByRole("heading");
      expect(headings[0]).toHaveTextContent(/library/i);
      const sidebar = screen.getByRole("sidebar");
      expect(within(sidebar).getByText(/select items to transfer/i)).toBeInTheDocument();
    });
  });
});
