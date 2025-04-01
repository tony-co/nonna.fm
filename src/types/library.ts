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
  tracks: ITrack[];
}

export interface IPlaylist {
  id: string;
  name: string;
  description?: string;
  trackCount: number;
  ownerId: string;
  ownerName: string;
  tracks: ITrack[];
  selected?: boolean;
  artwork?: string; // URL to playlist artwork
  targetId?: string;
}

export interface ITrack {
  id: string;
  name: string;
  artist: string;
  album?: string;
  artwork?: string; // URL to track artwork
  targetId?: string;
  videoId?: string;
  status?: "pending" | "matched" | "unmatched";
  selected?: boolean;
}

export interface LibraryState {
  // Library Data
  likedSongs: Set<ITrack>;
  albums: Set<IAlbum>;
  playlists: Map<string, IPlaylist>;

  // Selection State
  selectedItems: {
    tracks: Set<string>; // Track IDs
    albums: Set<string>; // Album IDs
    playlists: Set<string>; // Playlist IDs
  };

  // UI State
  status: {
    isLoading: boolean;
    error: string | null;
  };
}

export type LibraryAction =
  // Selection Actions
  | { type: "SELECT_ALL_TRACKS" }
  | { type: "DESELECT_ALL_TRACKS" }
  | { type: "SELECT_ALBUM"; payload: string }
  | { type: "DESELECT_ALBUM"; payload: string }
  | { type: "SELECT_PLAYLIST"; payload: string }
  | { type: "DESELECT_PLAYLIST"; payload: string }
  | { type: "SELECT_ALL_ALBUMS" }
  | { type: "DESELECT_ALL_ALBUMS" }
  | { type: "SELECT_ALL_PLAYLISTS" }
  | { type: "DESELECT_ALL_PLAYLISTS" }
  | { type: "RESET_SELECTION" }

  // Library Data Actions
  | { type: "SET_LIKED_SONGS"; payload: Set<ITrack> }
  | { type: "SET_ALBUMS"; payload: Set<IAlbum> }
  | { type: "SET_PLAYLISTS"; payload: Map<string, IPlaylist> }
  | { type: "UPDATE_PLAYLIST"; payload: IPlaylist }
  | {
      type: "UPDATE_LIBRARY";
      payload: Partial<Pick<LibraryState, "likedSongs" | "albums" | "playlists">>;
    }

  // Status Actions
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
