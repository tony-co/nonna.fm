export interface ILibraryData {
  likedSongs: Array<ITrack>;
  albums: Array<IAlbum>;
  playlists: Array<IPlaylist>;
}

export interface ISelectionState {
  playlists: Map<string, Set<ITrack>>;
  likedSongs: Set<ITrack>;

  albums: Set<IAlbum>;
}

export interface IAlbum {
  id: string;
  name: string;
  artist: string;
  targetId?: string;
  status?: "pending" | "matched" | "unmatched";
  selected?: boolean;
  artwork?: string; // URL to album artwork
}

export interface IPlaylist {
  id: string;
  name: string;
  trackCount: number;
  ownerId: string;
  ownerName: string;
  tracks: ITrack[];
  selected?: boolean;
  artwork?: string; // URL to playlist artwork
}

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  artwork?: string; // URL to track artwork
  targetId?: string;
  videoId?: string;
  status?: "pending" | "matched" | "unmatched";
  selected?: boolean;
}
