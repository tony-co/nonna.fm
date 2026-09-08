import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { LibraryProvider, useLibrary } from "@/contexts/LibraryContext";
import type { LibraryState } from "@/types";

const { fetchTracks } = vi.hoisted(() => ({ fetchTracks: vi.fn() }));
vi.mock("@/lib/musicApi", () => ({ fetchPlaylistTracks: fetchTracks }));
vi.mock("@/lib/services/factory", () => ({ musicServiceFactory: { getProvider: vi.fn() } }));
vi.mock("next/navigation", () => ({
  useParams: () => ({ source: "spotify", target: "apple" }),
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@/components/shared/ArtworkImage", () => ({ ArtworkImage: () => null }));

let state: LibraryState;
function StateReader() {
  const library = useLibrary();
  state = library.state;
  useEffect(() => {
    const playlist = { id: "p", name: "Playlist", ownerId: "me", tracks: [], trackCount: 1 };
    library.actions.updateLibrary({
      likedSongs: new Set(),
      albums: new Set(),
      playlists: new Map([["p", playlist]]),
    });
  }, [library.actions]);
  return null;
}

beforeEach(() => {
  fetchTracks.mockReset();
});

describe("playlist selection failures", () => {
  it.each([true, false])(
    "keeps the library usable when failure arrives after deselection: %s",
    async deselect => {
      let reject!: (error: Error) => void;
      fetchTracks.mockReturnValue(
        new Promise((_, fail) => {
          reject = fail;
        })
      );
      render(
        <LibraryProvider>
          <LibrarySidebar />
          <StateReader />
        </LibraryProvider>
      );
      fireEvent.click(screen.getByTestId("playlist-checkbox-p"));
      if (deselect) fireEvent.click(screen.getByTestId("playlist-checkbox-p"));
      await act(async () => reject(new Error("Playlist unavailable")));
      expect(await screen.findByRole("alert")).toHaveTextContent("Playlist unavailable");
      expect(state.status.error).toBeNull();
      expect(state.selectedItems.playlists.size).toBe(0);
      expect(screen.getByTestId("liked-songs-section")).toBeVisible();
      fetchTracks.mockResolvedValue([]);
      fireEvent.click(screen.getByTestId("playlist-checkbox-p"));
      await waitFor(() => expect(state.playlistLoads?.p.status).toBe("loaded"));
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    }
  );
});
