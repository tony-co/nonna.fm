import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import { mockAppleAuth, setupAppleFetchMock } from "@/__mocks__/services/apple/fetchMocks";
import * as api from "@/lib/services/apple/api";

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
    // Clear the existing mock and set up a new one that returns empty data
    vi.clearAllMocks();
    global.fetch = vi.fn(async (input: string | URL | Request) => {
      const url =
        typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

      // Still mock the developer token endpoint
      if (url.includes("/api/apple/developer-token")) {
        return new Response(
          JSON.stringify({
            success: true,
            token: "mock-apple-developer-token",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }

      // Return empty data for Apple Music API endpoints
      if (url.includes("/v1/me/library")) {
        return new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({}), { status: 404 });
    });

    const result = await api.fetchUserLibrary();
    expect(result.playlists).toEqual([]);
    expect(result.likedSongs).toEqual([]);
    expect(result.albums).toEqual([]);
  });

  it("handles fetch errors gracefully", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const unhandledRejectionHandler = (err: unknown): void => {
      if (
        err instanceof Error &&
        (err.message === "Network error" ||
          err.message.includes("Failed to obtain valid Apple Music developer token"))
      ) {
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
      await expect(promise).rejects.toThrow("Failed to obtain valid Apple Music developer token");
      // The fetch mock will be called multiple times due to token requests and retries
      expect(fetchMock).toHaveBeenCalled();
      vi.useRealTimers();
    } finally {
      process.off("unhandledRejection", unhandledRejectionHandler);
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });
});
