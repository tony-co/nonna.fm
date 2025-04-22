import type { ITrack, IAlbum, IPlaylist } from "@/types/library";

// Spotify API response types
export interface SpotifyTrackItem {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images?: Array<{ url: string }>;
    };
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images?: Array<{ url: string }>;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  images?: Array<{ url: string }>;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: {
    total: number;
  };
  owner: {
    id: string;
    display_name: string;
  };
  images?: Array<{ url: string }>;
}

// Type transformers
export function transformSpotifyTrackToTrack(spotifyTrack: SpotifyTrackItem["track"]): ITrack {
  return {
    id: spotifyTrack.id,
    name: spotifyTrack.name,
    artist: spotifyTrack.artists[0].name,
    album: spotifyTrack.album.name,
    artwork: spotifyTrack.album.images?.[0]?.url,
  };
}

export function transformSpotifyAlbumToAlbum(spotifyAlbum: SpotifyAlbum): IAlbum {
  return {
    id: spotifyAlbum.id,
    name: spotifyAlbum.name,
    artist: spotifyAlbum.artists[0].name,
    artwork: spotifyAlbum.images?.[0]?.url,
  };
}

export function transformSpotifyPlaylistToPlaylist(spotifyPlaylist: SpotifyPlaylist): IPlaylist {
  return {
    id: spotifyPlaylist.id,
    name: spotifyPlaylist.name,
    trackCount: spotifyPlaylist.tracks.total,
    ownerId: spotifyPlaylist.owner.id,
    tracks: [],
    artwork: spotifyPlaylist.images?.[0]?.url,
  };
}
