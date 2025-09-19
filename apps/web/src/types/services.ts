import { z } from "zod";
import { AlbumSchema, type IAlbum } from "./album";
import type { ILibraryData } from "./library";
import type { MusicService } from "./music-service";
import { type ITrack, TrackSchema } from "./track";

export const SearchResultSchema = z.object({
  matched: z.number(),
  unmatched: z.number(),
  total: z.number(),
  tracks: z.array(TrackSchema).optional(),
  albums: z.array(AlbumSchema).optional(),
});
export type SearchResult = z.infer<typeof SearchResultSchema>;

export const TransferResultSchema = z.object({
  added: z.number(),
  failed: z.number(),
  total: z.number(),
  playlistId: z.string().nullable(),
});
export type TransferResult = z.infer<typeof TransferResultSchema>;

export interface IMusicServiceProvider {
  search: (tracks: Array<ITrack>, onProgress?: (progress: number) => void) => Promise<SearchResult>;

  searchAlbums: (
    albums: Array<IAlbum>,
    onProgress?: (progress: number) => void
  ) => Promise<SearchResult>;

  addTracksToLibrary: (tracks: Array<ITrack>) => Promise<TransferResult>;

  addAlbumsToLibrary: (albums: Set<IAlbum>) => Promise<TransferResult>;

  createPlaylistWithTracks: (
    name: string,
    tracks: Array<ITrack>,
    description?: string
  ) => Promise<TransferResult>;

  fetchUserLibrary: () => Promise<ILibraryData>;

  fetchPlaylistTracks: (
    playlistId: string,
    onProgress?: (tracks: ITrack[], progress: number) => void
  ) => Promise<ITrack[]>;
}

export interface IServiceFactory {
  getProvider(service: MusicService): IMusicServiceProvider;
}
