import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LibraryProvider, useLibrary } from "@/contexts/LibraryContext";
import { useMatching } from "@/hooks/useMatching";
import type { ITrack, SearchResult } from "@/types";

const { search, fetchTracks } = vi.hoisted(() => ({ search: vi.fn(), fetchTracks: vi.fn() }));
vi.mock("@/lib/services/factory", () => ({
  musicServiceFactory: { getProvider: () => ({ search }) },
}));
vi.mock("@/lib/musicApi", () => ({ fetchPlaylistTracks: fetchTracks }));

const track: ITrack = { id: "one", name: "One", artist: "Artist", status: "pending" };
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}
const matched: SearchResult = {
  total: 1,
  matched: 1,
  unmatched: 0,
  tracks: [{ ...track, targetId: "target-one", status: "matched" }],
};

function setup() {
  return renderHook(
    () => ({ library: useLibrary(), first: useMatching(), second: useMatching() }),
    { wrapper: LibraryProvider }
  );
}

beforeEach(() => {
  search.mockReset();
});

describe("matching with the real library provider", () => {
  it("shares a queue across consumers and deduplicates work", async () => {
    const pending = deferred<SearchResult>();
    search.mockReturnValue(pending.promise);
    const { result } = setup();
    act(() => result.current.library.actions.setLikedSongs(new Set([track])));
    act(() => {
      void result.current.first.matchLikedSongs([track], "spotify");
      void result.current.second.matchLikedSongs([track], "spotify");
    });
    expect(search).toHaveBeenCalledTimes(1);
    expect(result.current.second.isLoading).toBe(true);
    await act(async () => pending.resolve(matched));
    expect(result.current.first.isLoading).toBe(false);
    expect(result.current.second.getProgress("likedSongs")).toBe(100);
    expect(Array.from(result.current.library.state.likedSongs ?? [])[0].targetId).toBe(
      "target-one"
    );
  });

  it("ignores late results when another consumer cancels", async () => {
    const pending = deferred<SearchResult>();
    search.mockReturnValue(pending.promise);
    const { result } = setup();
    act(() => result.current.library.actions.setLikedSongs(new Set([track])));
    act(() => {
      void result.current.first.matchLikedSongs([track], "spotify");
    });
    act(() => result.current.second.cancelMatching("likedSongs"));
    await act(async () => pending.resolve(matched));
    expect(result.current.first.getProgress("likedSongs")).toBe(0);
    expect(
      result.current.library.state.likedSongs?.values().next().value?.targetId
    ).toBeUndefined();
  });

  it("merges results into current data and preserves previous matches", async () => {
    const pending = deferred<SearchResult>();
    search.mockReturnValue(pending.promise);
    const { result } = setup();
    const previous = { ...track, id: "previous", targetId: "already", status: "matched" as const };
    act(() => result.current.library.actions.setLikedSongs(new Set([track, previous])));
    act(() => {
      void result.current.first.matchLikedSongs([track, previous], "spotify");
    });
    expect(search.mock.calls[0][0]).toEqual([track]);
    const added = { ...track, id: "added-during-search" };
    act(() => result.current.library.actions.setLikedSongs(new Set([track, previous, added])));
    await act(async () => pending.resolve(matched));
    expect(Array.from(result.current.library.state.likedSongs ?? [])).toEqual([
      matched.tracks?.[0],
      previous,
      added,
    ]);
  });

  it("runs queued playlists sequentially and cancels queued work", async () => {
    const pending = deferred<SearchResult>();
    search.mockReturnValue(pending.promise);
    const { result } = setup();
    const first = { id: "p1", name: "First", ownerId: "me", trackCount: 1, tracks: [track] };
    const second = { ...first, id: "p2" };
    act(() =>
      result.current.library.actions.setPlaylists(
        new Map([
          [first.id, first],
          [second.id, second],
        ])
      )
    );
    act(() => {
      void result.current.first.matchPlaylistTracks(first, "spotify");
      void result.current.second.matchPlaylistTracks(second, "spotify");
      result.current.second.cancelMatching("playlist", second.id);
    });
    await act(async () => pending.resolve(matched));
    expect(search).toHaveBeenCalledTimes(1);
    expect(result.current.library.state.playlists?.get("p1")?.tracks[0].targetId).toBe(
      "target-one"
    );
    expect(result.current.library.state.playlists?.get("p2")?.tracks[0].targetId).toBeUndefined();
  });

  it("matches the final playlist even before React commits the load", async () => {
    fetchTracks.mockResolvedValue([track]);
    search.mockResolvedValue(matched);
    const { result } = setup();
    const playlist = { id: "p", name: "Playlist", ownerId: "me", trackCount: 1, tracks: [] };
    act(() => result.current.library.actions.setPlaylists(new Map([["p", playlist]])));
    await act(async () => {
      const loaded = await result.current.library.operations.loadPlaylist("p");
      await result.current.first.matchPlaylistTracks(loaded, "spotify");
    });
    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0][0]).toEqual([track]);
    expect(result.current.library.state.playlists?.get("p")?.tracks[0].targetId).toBe("target-one");
  });

  it.each([true, false])(
    "stays busy when replacement work is queued before cancellation: %s",
    async queuedBeforeCancel => {
      const firstRequest = deferred<SearchResult>();
      const secondRequest = deferred<SearchResult>();
      search.mockReturnValueOnce(firstRequest.promise).mockReturnValueOnce(secondRequest.promise);
      const { result } = setup();
      const first = { id: "p1", name: "First", ownerId: "me", trackCount: 1, tracks: [track] };
      const second = { ...first, id: "p2" };
      act(() =>
        result.current.library.actions.setPlaylists(
          new Map([
            [first.id, first],
            [second.id, second],
          ])
        )
      );
      act(() => {
        void result.current.first.matchPlaylistTracks(first, "spotify");
        if (queuedBeforeCancel) void result.current.second.matchPlaylistTracks(second, "spotify");
        result.current.first.cancelMatching("playlist", first.id);
        if (!queuedBeforeCancel) void result.current.second.matchPlaylistTracks(second, "spotify");
      });
      expect(result.current.first.isLoading).toBe(true);
      await act(async () => firstRequest.resolve(matched));
      expect(search).toHaveBeenCalledTimes(2);
      expect(result.current.first.isLoading).toBe(true);
      await act(async () => secondRequest.resolve(matched));
      expect(result.current.first.isLoading).toBe(false);
      expect(result.current.library.state.playlists?.get("p1")?.tracks[0].targetId).toBeUndefined();
      expect(result.current.library.state.playlists?.get("p2")?.tracks[0].targetId).toBe(
        "target-one"
      );
    }
  );

  it("does not leak work between library sessions", async () => {
    const pending = deferred<SearchResult>();
    search.mockReturnValueOnce(pending.promise).mockResolvedValue(matched);
    const first = setup();
    act(() => first.result.current.library.actions.setLikedSongs(new Set([track])));
    act(() => {
      void first.result.current.first.matchLikedSongs([track], "spotify");
    });
    first.unmount();
    const second = setup();
    act(() => second.result.current.library.actions.setLikedSongs(new Set([track])));
    await act(async () => {
      void second.result.current.first.matchLikedSongs([track], "spotify");
    });
    await act(async () => pending.resolve(matched));
    await waitFor(() => expect(second.result.current.first.getProgress("likedSongs")).toBe(100));
  });
});
