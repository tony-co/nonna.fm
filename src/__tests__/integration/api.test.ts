import { describe, it, expect, beforeAll, vi, afterAll, beforeEach } from "vitest";
import { MusicService } from "@/types/services";
import { setAuthData, AuthData, clearAuthData, setServiceType } from "@/lib/auth/constants";
import type { ITrack } from "@/types/library";
import { getCachedAccessToken } from "@/__tests__/tokenCache";
import { musicServiceFactory } from "@/lib/services/factory";

// Create tests for individual services
// Currently we're focusing on services that have most complete implementations
const TESTABLE_SERVICES: MusicService[] = ["youtube"];

// Global test variables
const TEST_PLAYLIST_IDS: Record<MusicService, string | undefined> = {
  spotify: process.env.TEST_SPOTIFY_PLAYLIST_ID,
  apple: process.env.TEST_APPLE_PLAYLIST_ID,
  youtube: process.env.TEST_YOUTUBE_PLAYLIST_ID,
  deezer: process.env.TEST_DEEZER_PLAYLIST_ID,
};

const TEST_ALBUM_IDS: Record<MusicService, string | undefined> = {
  spotify: process.env.TEST_SPOTIFY_ALBUM_ID,
  apple: process.env.TEST_APPLE_ALBUM_ID,
  youtube: process.env.TEST_YOUTUBE_ALBUM_ID,
  deezer: process.env.TEST_DEEZER_ALBUM_ID,
};

TESTABLE_SERVICES.forEach((service: MusicService) => {
  describe(`${service.charAt(0).toUpperCase() + service.slice(1)} API`, () => {
    // Auth data that will be initialized in beforeAll
    let authDataSource: AuthData | null = null;
    let authDataTarget: AuthData | null = null;
    const TEST_PLAYLIST_ID = TEST_PLAYLIST_IDS[service];
    const TEST_ALBUM_ID = TEST_ALBUM_IDS[service];

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

      const authData = await getCachedAccessToken(service);
      // Same token - only for testing as we know its a read/write token
      if (authData) {
        authDataSource = { ...authData, role: "source" };
        authDataTarget = { ...authData, role: "target" };
        await setAuthData("source", authDataSource);
        await setAuthData("target", authDataTarget);

        // Also set the service type
        setServiceType("source", service);
        setServiceType("target", service);
      } else {
        console.warn(`No auth data available from token cache for ${service} - tests will fail`);
      }

      // Check if we have the necessary environment variables
      if (!TEST_ALBUM_ID || !TEST_PLAYLIST_ID) {
        console.warn(
          `Missing required variables for ${service} tests - some tests will be skipped`
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

    // Shared beforeEach to reset localStorage mocks before every test
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("should fetch user library", async () => {
      mockLocalStorageWithAuth(authDataSource);
      if (skipIfNoAuth(authDataSource, "fetchUserLibrary")) return;

      const provider = musicServiceFactory.getProvider(service);
      const library = await provider.fetchUserLibrary();

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
    });

    it("should fetch tracks from a playlist", async () => {
      mockLocalStorageWithAuth(authDataSource);
      if (skipIfNoAuth(authDataSource, "fetchPlaylistTracks") || !TEST_PLAYLIST_ID) {
        if (!TEST_PLAYLIST_ID) {
          console.warn(`Skipping fetchPlaylistTracks test for ${service} - missing playlist ID`);
        }

        return;
      }

      const provider = musicServiceFactory.getProvider(service);
      const tracks = await provider.fetchPlaylistTracks(TEST_PLAYLIST_ID);

      // Verify tracks array
      expect(tracks).toBeInstanceOf(Array);

      // We can't check for specific tracks as test data may vary between services
      if (tracks.length > 0) {
        // Verify track structure
        const track = tracks[0];
        expect(track.id).toBeDefined();
        expect(track.name).toBeDefined();
        expect(track.artist).toBeDefined();
        // Some services might not have album info
        if (service !== "deezer") {
          expect(track.album).toBeDefined();
        }
      }
    });

    it("should search for tracks", async () => {
      mockLocalStorageWithAuth(authDataSource);
      if (skipIfNoAuth(authDataSource, "search")) return;

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

      const provider = musicServiceFactory.getProvider(service);
      const searchResult = await provider.search(testTracks, _progress => {}); // Pass a progress callback function

      // Verify search results
      expect(searchResult).toBeDefined();
      expect(searchResult.matched).toBeGreaterThanOrEqual(0);
      expect(searchResult.unmatched).toBeGreaterThanOrEqual(0);
      expect(searchResult.total).toBe(testTracks.length);
      expect(searchResult.tracks).toBeInstanceOf(Array);
    });

    it("should add tracks to a user library", async () => {
      mockLocalStorageWithAuth(authDataTarget);
      if (skipIfNoAuth(authDataTarget, "addTracksToLibrary")) return;

      // Create test tracks with target IDs
      // These IDs need to be specific to the service being tested
      const testTracks: (ITrack & { targetId: string })[] = getTestTracksForService(service);

      if (testTracks.length === 0) {
        console.warn(`Skipping addTracksToLibrary test for ${service} - no test tracks available`);
        return;
      }

      const provider = musicServiceFactory.getProvider(service);
      const result = await provider.addTracksToLibrary(testTracks);

      expect(result).toBeDefined();
      expect(result.total).toBe(testTracks.length);

      // May not add if already in library, so we'll just verify the API call worked
      expect(result.added + result.failed).toBe(testTracks.length);
    });

    it("should create a playlist with tracks", async () => {
      mockLocalStorageWithAuth(authDataTarget);
      if (skipIfNoAuth(authDataTarget, "createPlaylistWithTracks")) return;

      // Create test tracks with target IDs
      const testTracks: (ITrack & { targetId: string })[] = getTestTracksForService(service);

      if (testTracks.length === 0) {
        console.warn(
          `Skipping createPlaylistWithTracks test for ${service} - no test tracks available`
        );
        return;
      }

      const uniqueTestName = `Test Playlist ${service} ${Date.now()}`;
      const provider = musicServiceFactory.getProvider(service);
      const result = await provider.createPlaylistWithTracks(
        uniqueTestName,
        testTracks,
        `Created by automated test for ${service}`
      );

      expect(result).toBeDefined();
      expect(result.total).toBe(testTracks.length);
      expect(result.playlistId).toBeDefined();
    });

    it("should search for albums", async () => {
      mockLocalStorageWithAuth(authDataSource);
      if (skipIfNoAuth(authDataSource, "searchAlbums")) return;

      // Create some test albums to search for
      const testAlbums: ITrack[] = [
        {
          id: "test-album-1",
          name: "A Night at the Opera",
          artist: "Queen",
          album: "A Night at the Opera",
          artwork: "",
          status: "pending",
        },
        {
          id: "test-album-2",
          name: "Thriller",
          artist: "Michael Jackson",
          album: "Thriller",
          artwork: "",
          status: "pending",
        },
      ];

      // searchAlbums expects IAlbum[], so map testTracks to IAlbum
      const testIAlbums = testAlbums.map(track => ({
        id: track.id,
        name: track.album || "", // Ensure name is always a string
        artist: track.artist,
        artwork: track.artwork,
        status: track.status,
      }));

      const provider = musicServiceFactory.getProvider(service);
      const searchResult = await provider.searchAlbums(testIAlbums, _progress => {});

      // Verify search results structure
      expect(searchResult).toBeDefined();
      expect(searchResult.matched).toBeGreaterThanOrEqual(0);
      expect(searchResult.unmatched).toBeGreaterThanOrEqual(0);
      expect(searchResult.total).toBe(testIAlbums.length);
      expect(searchResult.albums).toBeInstanceOf(Array);
    });
  });
});

// Helper to mock localStorage for auth tokens
function mockLocalStorageWithAuth(authData: AuthData | null): void {
  vi.spyOn(global.localStorage, "getItem").mockImplementation(key => {
    if (key.includes("token")) {
      return authData ? JSON.stringify(authData) : null;
    }
    return null;
  });
}

// Helper to skip tests if auth data is missing
function skipIfNoAuth(authData: AuthData | null, testName: string): boolean {
  if (!authData) {
    console.warn(`Skipping ${testName} test - no auth data available`);
    return true;
  }
  return false;
}

// Returns test tracks with valid IDs for the specific service
function getTestTracksForService(service: MusicService): (ITrack & { targetId: string })[] {
  switch (service) {
    case "spotify":
      return [
        {
          id: "test-1",
          name: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          artwork: "",
          status: "matched",
          targetId: "7tFiyTwD0nx5a1eklYtX2J", // Bohemian Rhapsody Spotify ID
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
    case "youtube":
      return [
        {
          id: "test-1",
          name: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          artwork: "",
          status: "matched",
          targetId: "fJ9rUzIMcZQ", // YouTube ID
        },
      ];
    case "apple":
      return [
        {
          id: "test-1",
          name: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          artwork: "",
          status: "matched",
          targetId: "1447037598", // Apple Music ID
        },
      ];
    case "deezer":
      return [
        {
          id: "test-1",
          name: "Bohemian Rhapsody",
          artist: "Queen",
          album: "A Night at the Opera",
          artwork: "",
          status: "matched",
          targetId: "3102904", // Deezer ID
        },
      ];
    default:
      return [];
  }
}
