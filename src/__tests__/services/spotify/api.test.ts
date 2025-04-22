import * as api from "@/lib/services/spotify/api";
import { mockTracks, mockAlbums, mockPlaylists } from "@/__mocks__/data/libraryData";
import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { setupSpotifyFetchMock, mockSpotifyAuth } from "@/__mocks__/services/spotify/fetchMocks";

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
    const tracks = await api.fetchPlaylistTracks(mockPlaylists[0].id);
    expect(tracks.length).toBe(mockPlaylists[0].tracks.length);
    expect(tracks[0].name).toBe(mockPlaylists[0].tracks[0].name);
  });

  it("search matches tracks and returns SearchResult", async () => {
    const result = await api.search(mockTracks, undefined);
    expect(result.matched).toBeGreaterThan(0);
    expect(result.tracks?.[0].status).toBe("matched");
  });

  it("createPlaylistWithTracks returns playlistId and counts", async () => {
    const result = await api.createPlaylistWithTracks("Test Playlist", mockTracks);
    expect(result.playlistId).toBe("new_playlist_id");
    expect(result.total).toBe(mockTracks.length);
  });

  it("addTracksToLibrary returns correct counts", async () => {
    const result = await api.addTracksToLibrary(mockTracks);
    expect(result.added + result.failed).toBe(result.total);
  });

  it("addAlbumsToLibrary returns correct counts", async () => {
    const result = await api.addAlbumsToLibrary(new Set(mockAlbums));
    expect(result.added + result.failed).toBe(result.total);
  });

  it("searchAlbums matches albums and returns SearchResult", async () => {
    const result = await api.searchAlbums(mockAlbums, undefined);
    expect(result.matched).toBeGreaterThan(0);
    expect(result.albums?.[0].status).toBe("matched");
  });

  it("handles empty playlists/tracks/albums gracefully", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
      async (input: string | URL | Request) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
        if (url.includes("/me/playlists?limit=1")) {
          return new Response(JSON.stringify({ total: 0 }), { status: 200 });
        }
        return new Response(JSON.stringify({}), { status: 404 });
      }
    );
    await expect(api.fetchUserLibrary()).rejects.toThrow();
  });

  it("handles fetch errors gracefully", async () => {
    // Attach a temporary unhandledRejection handler to suppress expected errors for this test
    const unhandledRejectionHandler = (err: unknown): void => {
      // Prevent Vitest from failing the test due to this expected error
      // Only suppress the specific error we expect
      if (err instanceof Error && err.message === "Network error") {
        // Do nothing, this is expected
        return;
      }
      // For any other error, rethrow so the test fails as normal
      throw err;
    };
    process.on("unhandledRejection", unhandledRejectionHandler);

    try {
      vi.useFakeTimers();
      // The retry logic in fetchUserLibrary will retry 5 times before throwing.
      // We mock fetch to throw an error for each attempt.
      const fetchMock = vi.fn().mockImplementation(() => {
        throw new Error("Network error");
      });
      global.fetch = fetchMock;

      const promise = api.fetchUserLibrary();

      // Fast-forward all timers (simulate all retries instantly)
      await vi.runAllTimersAsync();

      await expect(promise).rejects.toThrow("Network error");
      expect(fetchMock).toHaveBeenCalledTimes(5);

      vi.useRealTimers();
    } finally {
      // Always remove the handler after the test to avoid side effects
      process.off("unhandledRejection", unhandledRejectionHandler);
    }
  });
});
