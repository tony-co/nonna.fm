import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import { mockAppleAuth, setupAppleFetchMock } from "@/__mocks__/services/apple/fetchMocks";
import * as api from "@/lib/services/apple/api";

beforeEach(() => {
  api.clearDeveloperTokenCache();
  setupAppleFetchMock();
  mockAppleAuth();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
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

  it("createPlaylistWithTracks calls onProgress callback with progress updates", async () => {
    const tracksWithTargetId = mockTracks.map(t => ({ ...t, targetId: t.id }));
    const onProgress = vi.fn();

    const result = await api.createPlaylistWithTracks(
      "Test Playlist",
      tracksWithTargetId,
      undefined,
      onProgress
    );

    expect(result.playlistId).toBe("new_apple_playlist_id");
    expect(onProgress).toHaveBeenCalled();
    expect(onProgress.mock.calls.length).toBeGreaterThan(0);

    // Verify progress values are numbers and in valid range
    for (const call of onProgress.mock.calls) {
      expect(typeof call[0]).toBe("number");
      expect(call[0]).toBeGreaterThan(0);
      expect(call[0]).toBeLessThanOrEqual(mockTracks.length);
    }
  });

  it("addTracksToLibrary returns correct counts", async () => {
    const tracksWithTargetId = mockTracks.map(t => ({ ...t, targetId: t.id }));
    const result = await api.addTracksToLibrary(tracksWithTargetId);
    expect(result.added).toBe(result.total);
  });

  it("addAlbumsToLibrary returns correct counts", async () => {
    const result = await api.addAlbumsToLibrary(new Set(mockAlbums));
    expect(result.added).toBe(mockAlbums.filter(album => album.targetId).length);
    expect(result.failed).toBe(mockAlbums.filter(album => !album.targetId).length);
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

  it("propagates developer token failures", async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    await expect(api.fetchUserLibrary()).rejects.toThrow("Failed to get developer token: 503");
  });

  it("uses song IDs and accepts empty 202 responses without retrying", async () => {
    global.fetch = vi.fn().mockImplementation(async (input: string | URL) => {
      if (String(input) === "/api/apple/developer-token")
        return Response.json({ success: true, token: "developer" });
      const url = new URL(input);
      expect(url.searchParams.get("ids[songs]")).toBe("target");
      return new Response(null, { status: 202, headers: { "Content-Type": "application/json" } });
    });
    const result = await api.addTracksToLibrary([{ ...mockTracks[0], targetId: "target" }]);
    expect(result).toMatchObject({ added: 1, failed: 0 });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("searches the authenticated storefront when the loaded SDK is not configured", async () => {
    const getInstance = vi.fn(() => {
      throw new Error("No configured instance");
    });
    vi.stubGlobal("MusicKit", { getInstance });
    await Promise.all([
      api.search([mockTracks[0]], undefined),
      api.searchAlbums([mockAlbums[0]], undefined),
    ]);
    const urls = vi.mocked(global.fetch).mock.calls.map(([input]) => String(input));
    expect(urls.some(url => url.includes("/v1/catalog/ca/search"))).toBe(true);
    expect(urls.some(url => url.includes("/v1/catalog/fr/search"))).toBe(false);
    expect(urls.filter(url => url.endsWith("/v1/me/storefront"))).toHaveLength(1);
    expect(getInstance).not.toHaveBeenCalled();
  });

  it("coalesces developer token requests across concurrent operations", async () => {
    await Promise.all([
      api.addTracksToLibrary([{ ...mockTracks[0], targetId: "target" }]),
      api.addTracksToLibrary([{ ...mockTracks[0], targetId: "target" }]),
    ]);
    const tokenCalls = vi
      .mocked(global.fetch)
      .mock.calls.filter(([input]) => String(input) === "/api/apple/developer-token");
    expect(tokenCalls).toHaveLength(1);
  });
});
