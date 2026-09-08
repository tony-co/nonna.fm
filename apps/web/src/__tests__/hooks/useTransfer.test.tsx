import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTransfer } from "@/hooks/useTransfer";
import type { ISelectionState } from "@/types";

const { addTracks, addAlbums, updateUsage, checkLimit, getAuthData } = vi.hoisted(() => ({
  addTracks: vi.fn(),
  addAlbums: vi.fn(),
  updateUsage: vi.fn(),
  checkLimit: vi.fn(),
  getAuthData: vi.fn(),
}));
vi.mock("@/lib/auth/constants", () => ({ getAuthData }));
vi.mock("next/navigation", () => ({ useParams: () => ({ source: "spotify", target: "apple" }) }));
vi.mock("@/contexts/LibraryContext", () => ({
  useLibrary: () => ({ state: { playlists: new Map() } }),
}));
vi.mock("@/contexts/TransferContext", () => ({ useTransfer: () => ({ updateUsage, checkLimit }) }));
vi.mock("@/lib/musicApi", () => ({
  addTracksToLibrary: addTracks,
  addAlbumsToLibrary: addAlbums,
  createPlaylistWithTracks: vi.fn(),
}));
const selection: ISelectionState = {
  likedSongs: new Set([
    { id: "song", name: "Song", artist: "Artist", targetId: "target", status: "matched" },
  ]),
  albums: new Set([
    { id: "album", name: "Album", artist: "Artist", targetId: "target-album", status: "matched" },
  ]),
  playlists: new Map(),
};
beforeEach(() => {
  vi.resetAllMocks();
  getAuthData.mockReturnValue({ serviceId: "apple", userId: "original-account" });
  checkLimit.mockResolvedValue(true);
  updateUsage.mockResolvedValue(true);
  addTracks.mockResolvedValue({ added: 1, failed: 0, total: 1, playlistId: null });
});
describe("transfer accounting", () => {
  it("records confirmed writes and displays them when a later operation fails", async () => {
    addAlbums.mockRejectedValue(new Error("Album provider unavailable"));
    const { result } = renderHook(useTransfer);
    await act(async () => result.current.handleStartTransfer(selection));
    expect(updateUsage).toHaveBeenCalledExactlyOnceWith(1, "apple:original-account");
    expect(result.current.transferResults?.likedSongs?.added).toBe(1);
    expect(result.current.transferResults?.albums?.failed).toBe(1);
    expect(result.current.showSuccessModal).toBe(true);
    expect(result.current.error).toBe("Album provider unavailable");
  });
  it("charges only successful additions", async () => {
    addTracks.mockResolvedValue({ added: 0, failed: 1, total: 1, playlistId: null });
    addAlbums.mockResolvedValue({ added: 1, failed: 0, total: 1, playlistId: null });
    const { result } = renderHook(useTransfer);
    await act(async () => result.current.handleStartTransfer(selection));
    expect(updateUsage).toHaveBeenCalledExactlyOnceWith(1, "apple:original-account");
    expect(result.current.error).toContain("Some items");
  });
  it("blocks reentry before React rerenders", async () => {
    addAlbums.mockResolvedValue({ added: 1, failed: 0, total: 1, playlistId: null });
    const { result } = renderHook(useTransfer);
    await act(async () => {
      await Promise.all([
        result.current.handleStartTransfer(selection),
        result.current.handleStartTransfer(selection),
      ]);
    });
    expect(addTracks).toHaveBeenCalledTimes(1);
    expect(addAlbums).toHaveBeenCalledTimes(1);
  });
  it("stops new writes when usage cannot be recorded", async () => {
    updateUsage.mockResolvedValue(false);
    const { result } = renderHook(useTransfer);
    await act(async () => result.current.handleStartTransfer(selection));
    expect(addAlbums).not.toHaveBeenCalled();
    expect(result.current.error).toContain("usage could not be recorded");
    expect(result.current.showSuccessModal).toBe(true);
  });

  it.each(["unmount", "account change"])(
    "stops subsequent jobs after %s and accounts for confirmed writes",
    async change => {
      let resolve!: (result: unknown) => void;
      addTracks.mockReturnValue(
        new Promise(done => {
          resolve = done;
        })
      );
      const { result, unmount } = renderHook(useTransfer);
      let transfer!: Promise<void>;
      act(() => {
        transfer = result.current.handleStartTransfer(selection);
      });
      await waitFor(() => expect(addTracks).toHaveBeenCalledTimes(1));
      if (change === "unmount") unmount();
      else getAuthData.mockReturnValue({ serviceId: "spotify", userId: "replacement-account" });
      await act(async () => {
        resolve({ added: 1, failed: 0, total: 1, playlistId: null });
        await transfer;
      });
      expect(addAlbums).not.toHaveBeenCalled();
      expect(updateUsage).toHaveBeenCalledExactlyOnceWith(1, "apple:original-account");
      if (change === "account change")
        expect(result.current.error).toContain("Target account changed");
    }
  );
});
