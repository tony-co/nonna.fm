import type { ITrack, IAlbum, IPlaylist } from "@/types";

// === Core TIDAL Resource Types ===

/**
 * TIDAL Track resource based on OpenAPI specification
 */
export interface TidalTrack {
  id: string;
  type: "tracks";
  attributes: {
    title: string;
    version?: string;
    isrc?: string;
    copyright?: string;
    duration: number; // Duration in seconds
    replayGain?: number;
    peak?: number;
    explicit?: boolean;
    audioQuality?: "LOW" | "HIGH" | "LOSSLESS" | "HI_RES";
    audioModes?: string[];
    mediaMetadata?: {
      tags?: string[];
    };
  };
  relationships?: {
    artists?: {
      data?: Array<{ id: string; type: "artists" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
    albums?: {
      data?: Array<{ id: string; type: "albums" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
    providers?: {
      data?: Array<{ id: string; type: "providers" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL Album resource based on OpenAPI specification
 */
export interface TidalAlbum {
  id: string;
  type: "albums";
  attributes: {
    title: string;
    barcodeId?: string;
    numberOfTracks: number;
    numberOfVolumes: number;
    releaseDate?: string;
    duration: number; // Duration in seconds
    explicit?: boolean;
    type: "ALBUM" | "SINGLE" | "EP" | "COMPILATION";
    copyright?: string;
    mediaMetadata?: {
      tags?: string[];
    };
    imageLinks: Array<{
      href: string;
      meta: {
        width: number;
        height: number;
      };
    }>;
  };
  relationships?: {
    artists?: {
      data?: Array<{ id: string; type: "artists" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
    items?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    providers?: {
      data?: Array<{ id: string; type: "providers" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
    similarAlbums?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    coverArt?: {
      data?: Array<{ id: string; type: "artworks" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL Playlist resource based on OpenAPI specification
 */
export interface TidalPlaylist {
  id: string;
  type: "playlists";
  attributes: {
    name: string;
    description?: string;
    numberOfTracks: number;
    duration: number; // Duration in seconds
    lastModified?: string;
    created?: string;
    type: "USER" | "EDITORIAL";
    publicPlaylist?: boolean;
    popularity?: number;
    promotedArtists?: Array<{
      id: string;
      name: string;
    }>;
    lastItemAddedAt?: string;
    mediaMetadata?: {
      tags?: string[];
    };
    imageLinks: Array<{
      href: string;
      meta: {
        width: number;
        height: number;
      };
    }>;
  };
  relationships?: {
    owner?: {
      data?: { id: string; type: "users" };
      links?: {
        related?: string;
        self?: string;
      };
    };
    items?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    squareImage?: {
      data?: Array<{ id: string; type: "artworks" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
    coverArt?: {
      data?: Array<{ id: string; type: "artworks" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL Artist resource based on OpenAPI specification
 */
export interface TidalArtist {
  id: string;
  type: "artists";
  attributes: {
    name: string;
    popularity?: number;
    mediaMetadata?: {
      tags?: string[];
    };
  };
  relationships?: {
    albums?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    tracks?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    artistRoles?: {
      links?: {
        related?: string;
        self?: string;
      };
    };
    picture?: {
      data?: Array<{ id: string; type: "artworks" }>;
      links?: {
        related?: string;
        self?: string;
      };
    };
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL Artwork resource based on OpenAPI specification
 */
export interface TidalArtwork {
  id: string;
  type: "artworks";
  attributes: {
    width: number;
    height: number;
    files?: Array<{
      href: string;
      meta: {
        width: number;
        height: number;
      };
    }>;
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL User resource based on OpenAPI specification
 */
export interface TidalUser {
  id: string;
  type: "users";
  attributes: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    countryCode?: string;
    created?: string;
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

/**
 * TIDAL Provider resource based on OpenAPI specification
 */
export interface TidalProvider {
  id: string;
  type: "providers";
  attributes: {
    name: string;
  };
  links?: {
    self?: string;
  };
  meta?: {
    [key: string]: unknown;
  };
}

// === Union type for all included resources ===
export type TidalIncludedResource =
  | TidalArtist
  | TidalAlbum
  | TidalTrack
  | TidalPlaylist
  | TidalArtwork
  | TidalUser
  | TidalProvider;

// === Response wrapper interfaces ===

/**
 * JSON:API compliant single resource response
 */
export interface TidalDataResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      cursor?: string;
      next?: string;
      previous?: string;
    };
    [key: string]: unknown;
  };
  included?: TidalIncludedResource[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  jsonapi?: {
    version: string;
  };
}

/**
 * JSON:API compliant array response
 */
export interface TidalArrayResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      cursor?: string;
      next?: string;
      previous?: string;
    };
    [key: string]: unknown;
  };
  included?: TidalIncludedResource[];
  links?: {
    self?: string;
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
  jsonapi?: {
    version: string;
  };
}

/**
 * JSON:API error object
 */
export interface TidalError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
    header?: string;
  };
  meta?: {
    category?: string;
    [key: string]: unknown;
  };
}

/**
 * JSON:API error response
 */
export interface TidalErrorResponse {
  errors: TidalError[];
  meta?: {
    [key: string]: unknown;
  };
  links?: {
    about?: string;
  };
  jsonapi?: {
    version: string;
  };
}

// === Helper functions to find included resources ===

/**
 * Helper function to find an included resource by type and ID
 */
export function findIncludedResource<T extends TidalIncludedResource>(
  included: TidalIncludedResource[] | undefined,
  type: T["type"],
  id: string
): T | undefined {
  return included?.find((resource): resource is T => resource.type === type && resource.id === id);
}

/**
 * Helper function to find multiple included resources by type and IDs
 */
export function findIncludedResources<T extends TidalIncludedResource>(
  included: TidalIncludedResource[] | undefined,
  type: T["type"],
  ids: string[]
): T[] {
  if (!included) return [];
  return included.filter(
    (resource): resource is T => resource.type === type && ids.includes(resource.id)
  );
}

// === Type transformers with proper relationship handling ===

/**
 * Transform TIDAL track to internal track format
 * Handles included artists and albums for complete data
 */
export function transformTidalTrackToTrack(
  tidalTrack: TidalTrack,
  included?: TidalIncludedResource[]
): ITrack {
  console.log("tidalTrack", tidalTrack);
  console.log("included", included);
  // Extract artist names from included resources
  const artistIds = tidalTrack.relationships?.artists?.data?.map(artist => artist.id) || [];
  const artists = findIncludedResources<TidalArtist>(included, "artists", artistIds);
  const artistName =
    artists.length > 0
      ? artists.map(artist => artist.attributes.name).join(", ")
      : "Unknown Artist";

  // Extract album name from included resources
  const albumIds = tidalTrack.relationships?.albums?.data?.map(album => album.id) || [];
  const albums = findIncludedResources<TidalAlbum>(included, "albums", albumIds);
  const albumName = albums.length > 0 ? albums[0].attributes.title : "Unknown Album";

  // Extract artwork from album's cover art in included resources
  let artwork = "";
  if (albums.length > 0) {
    const album = albums[0];
    const coverArtId = album.relationships?.coverArt?.data?.[0]?.id;
    if (coverArtId && included) {
      const artworkResource = findIncludedResource<TidalArtwork>(included, "artworks", coverArtId);
      if (artworkResource?.attributes.files?.[0]?.href) {
        artwork = artworkResource.attributes.files[0].href;
      }
    }
  }

  return {
    id: tidalTrack.id,
    name: tidalTrack.attributes.title,
    artist: artistName,
    album: albumName,
    artwork,
    status: "pending",
  };
}

/**
 * Transform TIDAL album to internal album format
 * Handles included artists for complete data
 */
export function transformTidalAlbumToAlbum(
  tidalAlbum: TidalAlbum,
  included?: TidalIncludedResource[]
): IAlbum {
  // Extract artist names from included resources
  const artistIds = tidalAlbum.relationships?.artists?.data?.map(artist => artist.id) || [];
  const artists = findIncludedResources<TidalArtist>(included, "artists", artistIds);
  const artistName =
    artists.length > 0
      ? artists.map(artist => artist.attributes.name).join(", ")
      : "Unknown Artist";

  // Extract artwork from cover art relationship in included resources
  let artwork = "";
  const coverArtId = tidalAlbum.relationships?.coverArt?.data?.[0]?.id;
  if (coverArtId && included) {
    const artworkResource = findIncludedResource<TidalArtwork>(included, "artworks", coverArtId);
    if (artworkResource?.attributes.files?.[0]?.href) {
      artwork = artworkResource.attributes.files[0].href;
    }
  }

  return {
    id: tidalAlbum.id,
    name: tidalAlbum.attributes?.title || "Unknown Album",
    artist: artistName,
    artwork,
    status: "pending",
  };
}

/**
 * Transform TIDAL playlist to internal playlist format
 * Handles included owner information for complete data
 */
export function transformTidalPlaylistToPlaylist(
  tidalPlaylist: TidalPlaylist,
  included?: TidalIncludedResource[]
): IPlaylist {
  // Extract owner information from included resources
  const ownerId = tidalPlaylist.relationships?.owner?.data?.id || "unknown";

  // Extract artwork from included artworks resources
  let artwork = "";
  const coverArtId = tidalPlaylist.relationships?.coverArt?.data?.[0]?.id;
  if (coverArtId && included) {
    const artworkResource = findIncludedResource<TidalArtwork>(included, "artworks", coverArtId);
    if (artworkResource?.attributes.files?.[0]?.href) {
      artwork = artworkResource.attributes.files[0].href;
    }
  }

  return {
    id: tidalPlaylist.id,
    name: tidalPlaylist.attributes.name,
    description: tidalPlaylist.attributes.description,
    trackCount: tidalPlaylist.attributes.numberOfTracks,
    ownerId,
    tracks: [],
    artwork,
  };
}
