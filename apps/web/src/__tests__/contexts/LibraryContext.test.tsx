import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LibraryProvider, useLibrary } from "@/contexts/LibraryContext";
import type { ITrack } from "@/types";

vi.mock("@/lib/services/factory", () => ({ musicServiceFactory: { getProvider: vi.fn() } }));
const { fetchTracks } = vi.hoisted(() => ({ fetchTracks: vi.fn() }));
vi.mock("@/lib/musicApi", () => ({ fetchPlaylistTracks: fetchTracks }));
const track: ITrack = { id: "1", name: "Song", artist: "Artist" };
const playlist = { id: "p", name: "Playlist", ownerId: "me", tracks: [], trackCount: 2 };

describe("LibraryProvider", () => {
  it("keeps independent sessions and stable actions", () => {
    const first = renderHook(useLibrary, { wrapper: LibraryProvider });
    const second = renderHook(useLibrary, { wrapper: LibraryProvider });
    const actions = first.result.current.actions;
    act(() => first.result.current.actions.setLikedSongs(new Set([track])));
    act(() => first.result.current.actions.selectAllTracks());
    expect(first.result.current.state.selectedItems.tracks).toEqual(new Set(["1"]));
    expect(second.result.current.state.selectedItems.tracks.size).toBe(0);
    expect(first.result.current.actions).toBe(actions);
  });

  it("coalesces playlist loads, preserves progress, and commits the final response", async () => {
    let resolve!: (tracks: ITrack[]) => void;
    let onProgress!: (tracks: ITrack[], progress: number) => void;
    fetchTracks.mockImplementation((_id, progress) => {
      onProgress = progress;
      return new Promise<ITrack[]>(done => {
        resolve = done;
      });
    });
    const { result } = renderHook(useLibrary, { wrapper: LibraryProvider });
    act(() => result.current.actions.setPlaylists(new Map([[playlist.id, playlist]])));
    let first!: Promise<unknown>;
    let second!: Promise<unknown>;
    act(() => {
      first = result.current.operations.loadPlaylist("p");
      second = result.current.operations.loadPlaylist("p");
    });
    expect(first).toBe(second);
    expect(fetchTracks).toHaveBeenCalledTimes(1);
    act(() => onProgress([track], 0.5));
    expect(result.current.state.playlistLoads?.p.status).toBe("loading");
    const all = [track, { ...track, id: "2" }];
    await act(async () => {
      resolve(all);
      await first;
    });
    expect(result.current.state.playlists?.get("p")?.tracks).toEqual(all);
    expect(result.current.state.playlistLoads?.p.status).toBe("loaded");
    await act(async () => {
      await result.current.operations.loadPlaylist("p");
    });
    expect(fetchTracks).toHaveBeenCalledTimes(1);
  });

  it("records a failed load without immediately retrying", async () => {
    fetchTracks.mockReset().mockRejectedValue(new Error("Unavailable"));
    const { result } = renderHook(useLibrary, { wrapper: LibraryProvider });
    act(() => result.current.actions.setPlaylists(new Map([[playlist.id, playlist]])));
    await act(async () => {
      await expect(result.current.operations.loadPlaylist("p")).rejects.toThrow("Unavailable");
    });
    expect(result.current.state.playlistLoads?.p).toMatchObject({
      status: "error",
      error: "Unavailable",
    });
    expect(fetchTracks).toHaveBeenCalledTimes(1);
  });
});
