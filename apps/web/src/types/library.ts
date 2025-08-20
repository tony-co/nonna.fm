import { z } from "zod";
import { TrackSchema, ITrack } from "./track";
import { AlbumSchema, IAlbum } from "./album";
import { PlaylistSchema, IPlaylist } from "./playlist";
import { MatchingState, QueueTask } from "./matching";
import { MusicService } from "./music-service";

export const LibraryDataSchema = z.object({
  likedSongs: z.array(TrackSchema),
  albums: z.array(AlbumSchema),
  playlists: z.array(PlaylistSchema),
});
export type ILibraryData = z.infer<typeof LibraryDataSchema>;

export interface ISelectionState {
  playlists: Map<string, Set<ITrack>>;
  likedSongs: Set<ITrack>;
  albums: Set<IAlbum>;
}

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
  | {
      type: "SET_PLAYLISTS_FUNCTIONAL";
      payload: (prev: Map<string, IPlaylist>) => Map<string, IPlaylist>;
    }
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
