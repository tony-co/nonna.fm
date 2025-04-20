import { MusicService } from "@/types/services";

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
  status?: MatchingStatus;
  selected?: boolean;
  artwork?: string; // URL to album artwork
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
  status?: MatchingStatus;
  selected?: boolean;
}

export interface MatchingState {
  isLoading: boolean;
  error: string | null;
  progress: Record<string, number>;
  currentTask: QueueTask | null;
}

export type QueueTask =
  | { type: "likedSongs"; tracks: ITrack[]; targetService: string }
  | { type: "albums"; albums: IAlbum[]; targetService: string }
  | { type: "playlist"; playlist: IPlaylist; targetService: string };

export interface LibraryState {
  // Library Data
  likedSongs: Set<ITrack> | undefined;
  albums: Set<IAlbum> | undefined;
  playlists: Map<string, IPlaylist> | undefined;

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

  matching: MatchingState;
}

export type LibraryAction =
  // Selection Actions
  | { type: "SELECT_ALL_TRACKS" }
  | { type: "DESELECT_ALL_TRACKS" }
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
  | { type: "SET_ERROR"; payload: string | null }

  // Matching Actions
  | { type: "MATCHING_START"; payload: QueueTask }
  | { type: "MATCHING_PROGRESS"; payload: { key: string; value: number } }
  | { type: "MATCHING_ERROR"; payload: string }
  | { type: "MATCHING_COMPLETE"; payload: string }
  | { type: "MATCHING_CANCEL"; payload: { type: string; id?: string } };

// --- Matching status constants ---
/**
 * Status values for track/album/playlist matching operations.
 * Used to indicate whether an item is pending, matched, or unmatched.
 */
export const MATCHING_STATUS = {
  PENDING: "pending",
  MATCHED: "matched",
  UNMATCHED: "unmatched",
} as const;

/**
 * Type for status fields that use MATCHING_STATUS values.
 * Ensures all status fields are consistent and type-safe.
 */
export type MatchingStatus = (typeof MATCHING_STATUS)[keyof typeof MATCHING_STATUS];

// --- useMatching hook return type ---
/**
 * Return type for the useMatching hook, describing the API for matching operations.
 */
export interface UseMatchingReturn {
  isLoading: boolean;
  error: string | null;
  matchLikedSongs: (tracks: ITrack[], targetService: MusicService) => Promise<void>;
  matchAlbums: (albums: IAlbum[], targetService: MusicService) => Promise<void>;
  matchPlaylistTracks: (playlist: IPlaylist, targetService: MusicService) => Promise<void>;
  cancelMatching: (type: "likedSongs" | "albums" | "playlist", id?: string) => void;
  getProgress: (type: "likedSongs" | "albums" | "playlist", id?: string) => number;
  currentTask: QueueTask | null;
}
