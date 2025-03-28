import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Library } from "@/components/library/Library";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { MatchingProvider } from "@/contexts/MatchingContext";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));
window.IntersectionObserver = mockIntersectionObserver;

const defaultData = {
  likedSongs: mockTracks,
  albums: mockAlbums,
  playlists: mockPlaylists,
};

const renderLibrary = (props = {}) => {
  const mergedProps = {
    data: defaultData,
    mode: "select" as const,
    onStartTransfer: vi.fn().mockResolvedValue(undefined),
    onItemClick: vi.fn().mockResolvedValue(undefined),
    onSearchTracks: vi.fn(),
    ...props,
  };

  return render(
    <MatchingProvider>
      <SelectionProvider
        data={defaultData}
        mode={mergedProps.mode}
        onSearchTracks={mergedProps.onSearchTracks}
      >
        <Library {...mergedProps} />
      </SelectionProvider>
    </MatchingProvider>
  );
};

describe("Library Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders main sections and shows empty state", () => {
      renderLibrary();

      // Check main sections
      expect(screen.getByRole("heading", { name: /library/i })).toBeInTheDocument();
      expect(screen.getByRole("transfer-button")).toBeDisabled();

      // Check empty state message
      expect(
        screen.getByText(/select a playlist or album to view its tracks/i)
      ).toBeInTheDocument();
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
    ])("renders in %s mode", mode => {
      renderLibrary({ mode });
      expect(screen.getByRole("transfer-button")).toBeInTheDocument();
    });
  });

  describe("Selection disabled while matching or transferring", () => {
    it("disables interactions while matching", () => {
      renderLibrary({ mode: "matching" });

      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).toBeDisabled();

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });

    it("disables interactions while transferring", () => {
      renderLibrary({ mode: "transfer" });

      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).toBeDisabled();

      const checkboxes = screen.getAllByRole("checkbox");
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeDisabled();
      });
    });
  });

  describe("Transfer Flow", () => {
    it.skip("handles successful transfer initiation", async () => {
      const onStartTransfer = vi.fn().mockResolvedValue(undefined);
      renderLibrary({ onStartTransfer });

      // Select liked songs
      const likedSongsCheckbox = screen.getByTestId("liked-songs-checkbox");
      fireEvent.click(likedSongsCheckbox);

      // Wait for button to be enabled
      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).toBeEnabled();

      // Start transfer
      fireEvent.click(transferButton);

      expect(onStartTransfer).toHaveBeenCalledWith(
        expect.objectContaining({
          likedSongs: expect.any(Set),
          albums: expect.any(Set),
          playlists: expect.any(Map),
        })
      );
    });

    it.skip("handles failed transfer initiation", async () => {
      const onStartTransfer = vi.fn().mockRejectedValue(new Error("Transfer failed"));
      renderLibrary({ onStartTransfer });

      // Select liked songs
      const likedSongsCheckbox = screen.getByTestId("liked-songs-checkbox");
      fireEvent.click(likedSongsCheckbox);

      // Wait for button to be enabled
      const transferButton = screen.getByRole("transfer-button");
      expect(transferButton).toBeEnabled();

      // Start transfer
      fireEvent.click(transferButton);

      await expect(onStartTransfer).rejects.toThrow("Transfer failed");
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
      expect(within(sidebar).getByText("Select items to transfer")).toBeInTheDocument();
    });
  });
});
