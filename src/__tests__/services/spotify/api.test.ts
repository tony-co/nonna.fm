import { describe, it, expect, beforeAll, vi, afterAll } from "vitest";
import {
  fetchUserLibrary,
  fetchPlaylistTracks,
  search,
  addTracksToLibrary,
  createPlaylistWithTracks,
} from "@/lib/services/spotify/api";
import { setAuthData, AuthData, clearAuthData, setServiceType } from "@/lib/auth/constants";
import type { ITrack } from "@/types/library";
import { getCachedSpotifyAccessToken } from "@/__tests__/tokenCache";

// Global test variables
const TEST_PLAYLIST_ID = process.env.TEST_SPOTIFY_PLAYLIST_ID;
const TEST_ALBUM_ID = process.env.TEST_SPOTIFY_ALBUM_ID;

describe("Spotify API", () => {
  // Auth data that will be initialized in beforeAll
  let authDataSource: AuthData | null = null;
  let authDataTarget: AuthData | null = null;

  beforeAll(async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

    // Mock window object for test environment
    global.window = {
      location: { href: "" },
    } as unknown as Window & typeof globalThis;

    // Setup mock DOM environment
    global.document = {
      cookie: "",
    } as unknown as Document;

    // Mock localStorage with a proper storage implementation
    const store: { [key: string]: string } = {};
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          Object.keys(store).forEach(key => delete store[key]);
        }),
        length: 0,
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
      },
      writable: true,
    });

    // Update document.cookie configuration
    Object.defineProperty(global.document, "cookie", {
      writable: true,
      value: "",
    });

    const authData = await getCachedSpotifyAccessToken("spotify");
    // Same token - only for testing as we know its a read/write token
    if (authData) {
      authDataSource = { ...authData, role: "source" };
      authDataTarget = { ...authData, role: "target" };
      await setAuthData("source", authDataSource);
      await setAuthData("target", authDataTarget);

      // Also set the service type
      setServiceType("source", "spotify");
      setServiceType("target", "spotify");
    } else {
      console.warn("No auth data available from token cache - tests will fail");
    }

    // Check if we have the necessary environment variables
    if (!TEST_ALBUM_ID || !TEST_PLAYLIST_ID) {
      console.warn(
        "Missing required variables for Spotify auth tests - some tests will be skipped"
      );
    }
  });

  afterAll(() => {
    // Clean up after each test
    clearAuthData("source");
    clearAuthData("target");
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should fetch user library", async () => {
    vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
      if (key.includes("token")) {
        return JSON.stringify(authDataSource);
      }
      return null;
    });

    // Skip if no auth data
    if (!authDataSource) {
      console.warn("Skipping fetchUserLibrary test - no auth data available");
      return;
    }

    const library = await fetchUserLibrary();

    // Verify library structure
    expect(library).toBeDefined();
    expect(library.playlists).toBeInstanceOf(Array);
    expect(library.likedSongs).toBeInstanceOf(Array);
    expect(library.albums).toBeInstanceOf(Array);

    // Check some data is returned (test account should have some data)
    if (library.playlists.length > 0) {
      const playlist = library.playlists[0];
      expect(playlist.id).toBeDefined();
      expect(playlist.name).toBeDefined();
      expect(playlist.tracks).toBeDefined();
    }

    // Log some stats about the fetched library
    console.log(
      `Fetched library: ${library.playlists.length} playlists, ${library.likedSongs.length} liked songs, ${library.albums.length} albums`
    );
  });

  it("should fetch tracks from a playlist", async () => {
    vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
      if (key.includes("token")) {
        return JSON.stringify(authDataSource);
      }
      return null;
    });

    // Skip if no auth data or test playlist ID
    if (!authDataSource || !TEST_PLAYLIST_ID) {
      console.warn("Skipping fetchPlaylistTracks test - missing auth data or playlist ID");
      return;
    }

    const tracks = await fetchPlaylistTracks(TEST_PLAYLIST_ID);

    // Verify tracks array
    expect(tracks).toBeInstanceOf(Array);

    if (tracks.length > 0) {
      // Verify track structure
      const track = tracks[0];
      expect(track.id).toBeDefined();
      expect(track.name).equals("Axel F");
      expect(track.artist).equals("Crazy Frog");
      expect(track.album).equals("Crazy Frog presents Crazy Hits");

      // Log some info about tracks
      console.log(`Fetched ${tracks.length} tracks from playlist ${TEST_PLAYLIST_ID}`);
      console.log(`First track: ${track.name} by ${track.artist}`);
    }
  });

  it("should search for tracks", async () => {
    vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
      if (key.includes("token")) {
        return JSON.stringify(authDataSource);
      }
      return null;
    });

    // Skip if no auth data
    if (!authDataSource) {
      console.warn("Skipping search test - no auth data available");
      return;
    }

    // Create some test tracks to search for
    const testTracks: ITrack[] = [
      {
        id: "test-id-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "pending",
      },
      {
        id: "test-id-2",
        name: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        artwork: "",
        status: "pending",
      },
    ];

    const searchResult = await search(testTracks, progress => {
      // Optional: Log progress if needed
      console.log(`Search progress: ${Math.round(progress * 100)}%`);
    }); // Pass a progress callback function

    // Verify search results
    expect(searchResult).toBeDefined();
    expect(searchResult.matched).toBeGreaterThanOrEqual(0);
    expect(searchResult.unmatched).toBeGreaterThanOrEqual(0);
    expect(searchResult.total).toBe(testTracks.length);
    expect(searchResult.tracks).toBeInstanceOf(Array);

    // Log search results
    console.log(
      `Search results: ${searchResult.matched} tracks found, ${searchResult.unmatched} failed`
    );
  });

  it("should add tracks to a user library", async () => {
    vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
      if (key.includes("token")) {
        return JSON.stringify(authDataTarget);
      }
      return null;
    });

    // Skip if no auth data
    if (!authDataTarget) {
      console.warn("Skipping addTracksToLibrary test - no auth data available");
      return;
    }

    // Create test tracks with Spotify IDs
    const testTracks: (ITrack & { targetId: string })[] = [
      {
        id: "test-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "matched",
        targetId: "7tFiyTwD0nx5a1eklYtX2J", // Bohemian Rhapsody Spotify ID
      },
    ];

    const result = await addTracksToLibrary(testTracks);

    expect(result).toBeDefined();
    expect(result.total).toBe(testTracks.length);

    // May not add if already in library, so we'll just verify the API call worked
    expect(result.added + result.failed).toBe(testTracks.length);

    console.log(`Library add result: added ${result.added}, failed ${result.failed}`);
  });

  it("should create a playlist with tracks", async () => {
    vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
      if (key.includes("token")) {
        return JSON.stringify(authDataTarget);
      }
      return null;
    });

    // Skip if no auth data
    if (!authDataTarget) {
      console.warn("Skipping createPlaylistWithTracks test - no auth data available");
      return;
    }

    // Create test tracks with Spotify IDs
    const testTracks: (ITrack & { targetId: string })[] = [
      {
        id: "test-1",
        name: "Bohemian Rhapsody",
        artist: "Queen",
        album: "A Night at the Opera",
        artwork: "",
        status: "matched",
        targetId: "4u7EnebtmKWzUH433cf5Qv", // Bohemian Rhapsody Spotify ID
      },
      {
        id: "test-2",
        name: "Billie Jean",
        artist: "Michael Jackson",
        album: "Thriller",
        artwork: "",
        status: "matched",
        targetId: "7J1uxwnxfQLu4APicE5Rnj", // Billie Jean Spotify ID
      },
    ];

    const uniqueTestName = `Test Playlist ${Date.now()}`;
    const result = await createPlaylistWithTracks(
      uniqueTestName,
      testTracks,
      "Created by automated test"
    );

    expect(result).toBeDefined();
    expect(result.total).toBe(testTracks.length);
    expect(result.playlistId).toBeDefined();

    console.log(`Playlist created: ${uniqueTestName}, ID: ${result.playlistId}`);
    console.log(`Added ${result.added} tracks, failed ${result.failed}`);
  });
});
