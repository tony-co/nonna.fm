import * as api from "@/lib/services/apple/api";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { setupAppleFetchMock, mockAppleAuth } from "@/__mocks__/services/apple/fetchMocks";

beforeEach(() => {
  setupAppleFetchMock();
  mockAppleAuth();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Apple Music API Service", () => {
  it("fetchUserLibrary returns correct library data", async () => {
    const data = await api.fetchUserLibrary();
    expect(data.playlists.length).toBe(mockPlaylists.length);
    expect(data.likedSongs.length).toBe(mockTracks.length);
    expect(data.albums.length).toBe(mockAlbums.length);
  });

  it("fetchPlaylistTracks returns correct tracks", async () => {
    const onProgress = vi.fn();
    const tracks = await api.fetchPlaylistTracks(mockPlaylists[0].id, onProgress);
    expect(tracks.length).toBe(mockPlaylists[0].tracks.length);
    expect(tracks[0].name).toBe(mockPlaylists[0].tracks[0].name);
    expect(onProgress).toHaveBeenCalled();
    for (const call of onProgress.mock.calls) {
      expect(typeof call[1]).toBe("number");
      expect(call[1]).toBeGreaterThanOrEqual(0);
      expect(call[1]).toBeLessThanOrEqual(1);
    }
  });

  it("search matches tracks and returns SearchResult", async () => {
    const onProgress = vi.fn();
    const result = await api.search(mockTracks, onProgress);
    expect(result.matched).toBeGreaterThan(0);
    expect(result.tracks?.[0].status).toBe("matched");
    expect(onProgress).toHaveBeenCalled();
    for (const call of onProgress.mock.calls) {
      expect(typeof call[0]).toBe("number");
      expect(call[0]).toBeGreaterThanOrEqual(0);
      expect(call[0]).toBeLessThanOrEqual(1);
    }
  });

  it("createPlaylistWithTracks returns playlistId and counts", async () => {
    const tracksWithTargetId = mockTracks.map(t => ({ ...t, targetId: t.id }));
    const result = await api.createPlaylistWithTracks("Test Playlist", tracksWithTargetId);
    expect(result.playlistId).toBe("new_apple_playlist_id");
    expect(result.added).toBe(mockTracks.length);
  });

  it("addTracksToLibrary returns correct counts", async () => {
    const tracksWithTargetId = mockTracks.map(t => ({ ...t, targetId: t.id }));
    const result = await api.addTracksToLibrary(tracksWithTargetId);
    expect(result.added).toBe(result.total);
  });

  it("addAlbumsToLibrary returns correct counts", async () => {
    const result = await api.addAlbumsToLibrary(new Set(mockAlbums));
    expect(result.added).toBe(result.total);
  });

  it("searchAlbums matches albums and returns SearchResult", async () => {
    const onProgress = vi.fn();
    const result = await api.searchAlbums(mockAlbums, onProgress);
    expect(result.matched).toBeGreaterThan(0);
    expect(result.albums?.[0].status).toBe("matched");
    expect(onProgress).toHaveBeenCalled();
    for (const call of onProgress.mock.calls) {
      expect(typeof call[0]).toBe("number");
      expect(call[0]).toBeGreaterThanOrEqual(0);
      expect(call[0]).toBeLessThanOrEqual(1);
    }
  });

  it("handles empty playlists/tracks/albums gracefully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
      async (input: string | URL | Request) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes("/v1/me/library/playlists")) {
          return new Response(JSON.stringify({ data: [] }), { status: 200 });
        }
        return new Response(JSON.stringify({}), { status: 404 });
      }
    );
    await expect(api.fetchUserLibrary()).rejects.toThrow();
  });

  it("handles fetch errors gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const unhandledRejectionHandler = (err: unknown): void => {
      if (err instanceof Error && err.message === "Network error") {
        return;
      }
      throw err;
    };
    process.on("unhandledRejection", unhandledRejectionHandler);

    try {
      vi.useFakeTimers();
      const fetchMock = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });
      global.fetch = fetchMock;

      const promise = api.fetchUserLibrary();
      await vi.runAllTimersAsync();
      await expect(promise).rejects.toThrow("Network error");
      expect(fetchMock).toHaveBeenCalledTimes(5);
      vi.useRealTimers();
    } finally {
      process.off("unhandledRejection", unhandledRejectionHandler);
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });
});
