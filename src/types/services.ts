import { ITrack, IAlbum, ILibraryData } from "./library";

export type MusicService = "spotify" | "apple" | "youtube" | "deezer";

export interface SearchResult {
  matched: number;
  unmatched: number;
  total: number;
  tracks?: Array<ITrack>;
  albums?: Array<IAlbum>;
}

export interface TransferResult {
  added: number;
  failed: number;
  total: number;
  playlistId: string | null;
}

export interface IMusicServiceProvider {
  // Search for tracks and albums - not all services might support batch requests
  search(tracks: ITrack[], batchSize?: number): Promise<SearchResult>;

  // Search for albums
  searchAlbums(albums: Array<IAlbum>): Promise<SearchResult>;

  // Transfer liked songs
  addTracksToLibrary(tracks: ITrack[]): Promise<TransferResult>;

  // Transfer albums
  addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult>;

  // Transfer playlists
  createPlaylistWithTracks(
    name: string,
    tracks: ITrack[],
    description?: string
  ): Promise<TransferResult>;

  // Fetch methods
  fetchUserLibrary(): Promise<ILibraryData>;

  // Fetch playlist tracks
  fetchPlaylistTracks(playlistId: string): Promise<ITrack[]>;
}

export interface IServiceFactory {
  getProvider(service: MusicService): IMusicServiceProvider;
}
