import { ITrack, IAlbum, IPlaylist, ILibraryData } from "@/types/library";

export const mockTracks: ITrack[] = [
  {
    id: "track_1",
    name: "Fortnight",
    artist: "Taylor Swift ft. Post Malone",
    album: "The Tortured Poets Department",
    artwork: "https://example.com/artwork/fortnight.jpg",
  },
  {
    id: "track_2",
    name: "yes, and?",
    artist: "Ariana Grande",
    album: "eternal sunshine",
    artwork: "https://example.com/artwork/yes-and.jpg",
  },
  {
    id: "track_3",
    name: "Million Dollar Baby",
    artist: "Tommy Richman",
    album: "Million Dollar Baby - Single",
    artwork: "https://example.com/artwork/million-dollar-baby.jpg",
  },
  {
    id: "track_4",
    name: "TEXAS HOLD 'EM",
    artist: "Beyoncé",
    album: "Cowboy Carter",
    artwork: "https://example.com/artwork/texas-hold-em.jpg",
  },
  {
    id: "track_5",
    name: "Stick Season",
    artist: "Noah Kahan",
    album: "Stick Season",
    artwork: "https://example.com/artwork/stick-season.jpg",
  },
];

export const mockAlbums: IAlbum[] = [
  {
    id: "album_1",
    name: "The Tortured Poets Department",
    artist: "Taylor Swift",
    artwork: "https://example.com/albums/tortured-poets.jpg",
  },
  {
    id: "album_2",
    name: "eternal sunshine",
    artist: "Ariana Grande",
    artwork: "https://example.com/albums/eternal-sunshine.jpg",
  },
];

export const mockPlaylists: IPlaylist[] = [
  {
    id: "playlist_1",
    name: "2024 Hits",
    trackCount: 4,
    ownerId: "user_1",
    ownerName: "Test User",
    tracks: [mockTracks[0], mockTracks[1], mockTracks[2], mockTracks[3]],
    artwork: "https://example.com/playlists/2024-hits.jpg",
  },
  {
    id: "playlist_2",
    name: "Chill Vibes",
    trackCount: 1,
    ownerId: "user_1",
    ownerName: "Test User",
    tracks: [mockTracks[4]],
    artwork: "https://example.com/playlists/chill-vibes.jpg",
  },
];

export const mockLibraryData: ILibraryData = {
  likedSongs: mockTracks,
  albums: mockAlbums,
  playlists: mockPlaylists,
};

export const createMockLibraryData = (overrides: Partial<ILibraryData> = {}): ILibraryData => ({
  ...mockLibraryData,
  ...overrides,
});
