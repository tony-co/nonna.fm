import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockAlbums, mockPlaylists, mockTracks } from "@/__mocks__/data/libraryData";
import { mockSpotifyAuth, setupSpotifyFetchMock } from "@/__mocks__/services/spotify/fetchMocks";
import * as api from "@/lib/services/spotify/api";

beforeEach(() => {
  setupSpotifyFetchMock();
  mockSpotifyAuth();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Spotify API Service", () => {
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
    // Provide tracks with targetId so the function can add them
    const tracksWithTargetId = mockTracks.map(t => ({ ...t, targetId: t.id }));
    const result = await api.createPlaylistWithTracks("Test Playlist", tracksWithTargetId);
    expect(result.playlistId).toBe("new_playlist_id");
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

    expect(result.playlistId).toBe("new_playlist_id");
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

  it("handles empty libraries", async () => {
    global.fetch = vi.fn().mockImplementation(async () => Response.json({ items: [], total: 0 }));
    await expect(api.fetchUserLibrary()).resolves.toEqual({
      playlists: [],
      likedSongs: [],
      albums: [],
    });
  });

  it("fetches every playlist page and preserves order", async () => {
    const playlists = Array.from({ length: 125 }, (_, index) => ({
      id: String(index),
      name: `Playlist ${index}`,
      tracks: { total: 0 },
      owner: { id: "me" },
      images: [],
    }));
    const offsets: number[] = [];
    global.fetch = vi.fn().mockImplementation(async (input: string) => {
      const url = new URL(input);
      if (url.pathname.endsWith("/me/playlists")) {
        const offset = Number(url.searchParams.get("offset"));
        offsets.push(offset);
        return Response.json({
          items: playlists.slice(offset, offset + 50),
          total: playlists.length,
        });
      }
      return Response.json({ items: [], total: 0 });
    });
    const library = await api.fetchUserLibrary();
    expect(library.playlists.map(playlist => playlist.id)).toEqual(
      playlists.map(playlist => playlist.id)
    );
    expect(offsets).toEqual([0, 50, 100]);
  });

  it("skips unavailable tracks and accepts empty playlists", async () => {
    global.fetch = vi.fn().mockResolvedValue(Response.json({ items: [{ track: null }], total: 1 }));
    await expect(api.fetchPlaylistTracks("p")).resolves.toEqual([]);
  });

  it("propagates permanent failures", async () => {
    global.fetch = vi.fn().mockImplementation(async () => new Response(null, { status: 401 }));
    await expect(api.fetchUserLibrary()).rejects.toThrow("401");
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
