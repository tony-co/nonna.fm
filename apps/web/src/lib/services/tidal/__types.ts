import type { ITrack, IAlbum, IPlaylist } from "@/types/library";

// JSON:API Base Types
export interface JsonApiResourceIdentifier {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

export interface JsonApiLinks {
  self?: string;
  next?: string;
  [key: string]: string | undefined;
}

export interface JsonApiResource<
  TAttributes = Record<string, unknown>,
  TRelationships = Record<string, unknown>,
> extends JsonApiResourceIdentifier {
  attributes: TAttributes;
  relationships?: TRelationships;
}

export interface JsonApiResponse<
  TData = JsonApiResource | JsonApiResource[],
  TIncluded = JsonApiResource[],
> {
  data: TData;
  included?: TIncluded;
  links?: JsonApiLinks;
  meta?: Record<string, unknown>;
}

// Specific Resource Types
export interface TrackResource
  extends JsonApiResource<{
    title: string;
    duration: string;
    explicit: boolean;
    isrc: string;
    popularity: number;
    mediaTags: string[];
  }> {}

export interface AlbumResource
  extends JsonApiResource<{
    title: string;
    barcodeId: string;
    numberOfItems: number;
    duration: string;
    explicit: boolean;
    releaseDate?: string;
    popularity: number;
    mediaTags: string[];
    type: "ALBUM" | "EP" | "SINGLE";
  }> {}

export interface PlaylistResource
  extends JsonApiResource<{
    name: string;
    description?: string;
    playlistType: "EDITORIAL" | "USER" | "MIX" | "ARTIST";
    privacy: "PUBLIC" | "PRIVATE";
    createdAt: string;
    lastModifiedAt: string;
    numberOfItems?: number;
    duration?: string;
    bounded: boolean;
  }> {}

// Legacy types that can be removed once migration is complete
export type TidalTrackItem = never;
export type TidalTrack = never;
export type TidalAlbum = never;
export type TidalPlaylist = never;
export const transformTidalTrackToTrack = null;
export const transformTidalAlbumToAlbum = null;
export const transformTidalPlaylistToPlaylist = null;
