import * as api from "@/lib/services/youtube/api";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { setupYouTubeFetchMock, mockYouTubeAuth } from "@/__mocks__/services/youtube/fetchMocks";

beforeEach(() => {
  setupYouTubeFetchMock();
  mockYouTubeAuth();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("YouTube Music API Service", () => {
  it("fetchUserLibrary returns correct library data", async () => {
    const data = await api.fetchUserLibrary();
    expect(data.playlists.length).toBe(mockPlaylists.length);
    expect(data.likedSongs.length).toBe(mockTracks.length);
    // YouTube API currently returns empty albums array as noted in the implementation
    expect(data.albums.length).toBe(0);
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
    expect(result.playlistId).toBe("new_youtube_playlist_id");
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

      // Mock YouTube Data API v3 endpoints with empty data
      if (url.includes("https://www.googleapis.com/youtube/v3/playlists")) {
        return new Response(
          JSON.stringify({
            items: [],
            pageInfo: {
              totalResults: 0,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (url.includes("https://www.googleapis.com/youtube/v3/playlistItems")) {
        return new Response(
          JSON.stringify({
            items: [],
            pageInfo: {
              totalResults: 0,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Mock YouTube Music proxy API endpoints with empty data
      if (url.includes("/api/youtube/music")) {
        return new Response(
          JSON.stringify({
            contents: {
              singleColumnBrowseResultsRenderer: {
                tabs: [
                  {
                    tabRenderer: {
                      content: {
                        sectionListRenderer: {
                          contents: [],
                        },
                      },
                    },
                  },
                ],
              },
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
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
        (err.message === "Network error" || err.message.includes("Failed to fetch user library"))
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
      await expect(promise).rejects.toThrow();
      expect(fetchMock).toHaveBeenCalled();
      vi.useRealTimers();
    } finally {
      process.off("unhandledRejection", unhandledRejectionHandler);
      errorSpy.mockRestore();
      warnSpy.mockRestore();
    }
  });

  it("handles authentication errors gracefully", async () => {
    // Mock authentication failure
    const { getYouTubeAuthData } = vi.mocked(await import("@/lib/services/youtube/auth"));
    getYouTubeAuthData.mockResolvedValue(null);

    await expect(api.fetchUserLibrary()).rejects.toThrow();
  });

  it("validates track data structure", async () => {
    const data = await api.fetchUserLibrary();

    // Validate that tracks have required properties
    if (data.likedSongs.length > 0) {
      const track = data.likedSongs[0];
      expect(track).toHaveProperty("id");
      expect(track).toHaveProperty("name");
      expect(track).toHaveProperty("artist");
      expect(typeof track.id).toBe("string");
      expect(typeof track.name).toBe("string");
      expect(typeof track.artist).toBe("string");
    }
  });

  it("validates playlist data structure", async () => {
    const data = await api.fetchUserLibrary();

    // Validate that playlists have required properties
    if (data.playlists.length > 0) {
      const playlist = data.playlists[0];
      expect(playlist).toHaveProperty("id");
      expect(playlist).toHaveProperty("name");
      expect(playlist).toHaveProperty("tracks");
      expect(typeof playlist.id).toBe("string");
      expect(typeof playlist.name).toBe("string");
      expect(Array.isArray(playlist.tracks)).toBe(true);
    }
  });

  it("validates album data structure", async () => {
    const data = await api.fetchUserLibrary();

    // Validate that albums have required properties
    if (data.albums.length > 0) {
      const album = data.albums[0];
      expect(album).toHaveProperty("id");
      expect(album).toHaveProperty("name");
      expect(album).toHaveProperty("artist");
      expect(typeof album.id).toBe("string");
      expect(typeof album.name).toBe("string");
      expect(typeof album.artist).toBe("string");
    }
  });
});
