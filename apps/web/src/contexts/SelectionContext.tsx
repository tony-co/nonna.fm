import { createContext, type FC, type ReactNode, useCallback, useContext, useState } from "react";
import { fetchPlaylistTracks } from "@/lib/musicApi";
import type { IAlbum, IPlaylist, ISelectionState, ITrack } from "@/types";

interface SelectionContextType {
  selection: ISelectionState;
  selectedView: {
    type: "playlist" | "album" | "liked";
    id?: string;
  } | null;
  isSelectionDisabled: boolean;
  toggleLikedSongs: () => void;
  toggleLikedSong: (track: ITrack) => void;
  toggleAlbum: (album: IAlbum) => void;
  togglePlaylist: (playlist: IPlaylist) => void;
  togglePlaylistTrack: (playlist: IPlaylist, track: ITrack) => void;
  toggleAllAlbums: () => void;
  toggleAllPlaylists: () => void;
  setSelectedView: (view: { type: "playlist" | "album" | "liked"; id?: string } | null) => void;
}

interface SelectionProviderProps {
  children: ReactNode;
  data: {
    likedSongs: Array<ITrack>;
    albums: Array<IAlbum>;
    playlists: Array<IPlaylist>;
  };
  mode: "select" | "matching" | "review" | "transfer" | "completed";
  onSearchTracks: (item: IAlbum | IPlaylist | "liked" | "albums") => void;
}

const SelectionContext = createContext<SelectionContextType | null>(null);

export const SelectionProvider: FC<SelectionProviderProps> = ({
  children,
  data,
  mode,
  onSearchTracks,
}) => {
  // Selection state with playlist tracks
  const [selection, setSelection] = useState<ISelectionState>({
    playlists: new Map(),
    likedSongs: new Set(),
    albums: new Set(),
  });

  // Selected view state
  const [selectedView, setSelectedView] = useState<{
    type: "playlist" | "album" | "liked";
    id?: string;
  } | null>(null);

  const isSelectionDisabled = mode === "matching" || mode === "transfer";

  // Toggle all liked songs
  const toggleLikedSongs = useCallback(() => {
    onSearchTracks("liked");
    setSelection(prev => {
      const newLikedSongs = prev.likedSongs.size > 0 ? new Set<ITrack>() : new Set(data.likedSongs);
      return { ...prev, likedSongs: newLikedSongs };
    });
  }, [data.likedSongs, onSearchTracks]);

  // Toggle a single liked song
  const toggleLikedSong = useCallback((track: ITrack) => {
    setSelection(prev => {
      const newLikedSongs = new Set(prev.likedSongs);
      const existingTrack = Array.from(newLikedSongs).find(t => t.id === track.id);

      if (existingTrack) {
        newLikedSongs.delete(existingTrack);
      } else {
        newLikedSongs.add(track);
      }

      return { ...prev, likedSongs: newLikedSongs };
    });
  }, []);

  // Toggle all albums
  const toggleAllAlbums = useCallback(() => {
    onSearchTracks("albums");
    setSelection(prev => {
      const newAlbums = prev.albums.size > 0 ? new Set<IAlbum>() : new Set(data.albums);
      return { ...prev, albums: newAlbums };
    });
  }, [data.albums, onSearchTracks]);

  // Toggle a single album
  const toggleAlbum = useCallback(
    (album: IAlbum) => {
      onSearchTracks(album);
      setSelection(prev => {
        const newAlbums = new Set(prev.albums);
        if (newAlbums.has(album)) {
          newAlbums.delete(album);
        } else {
          newAlbums.add(album);
        }
        return { ...prev, albums: newAlbums };
      });
    },
    [onSearchTracks]
  );

  const togglePlaylist = useCallback(
    async (playlist: IPlaylist) => {
      try {
        // Fetch tracks if they haven't been loaded yet
        let updatedPlaylist = playlist;
        if (!playlist.tracks || playlist.tracks.length === 0) {
          const tracks = await fetchPlaylistTracks(playlist.id);
          updatedPlaylist = { ...playlist, tracks };
        }

        // Trigger matching process
        onSearchTracks(updatedPlaylist);

        // Update selection state
        setSelection(prev => {
          const newPlaylists = new Map(prev.playlists);
          const existingTracks = newPlaylists.get(playlist.id);

          // If playlist is already selected (has tracks), unselect it
          if (existingTracks && existingTracks.size > 0) {
            newPlaylists.delete(playlist.id);
          } else {
            // Select all tracks in the playlist
            newPlaylists.set(playlist.id, new Set(updatedPlaylist.tracks));
          }

          return { ...prev, playlists: newPlaylists };
        });
      } catch (err) {
        console.error("Error toggling playlist:", err);
      }
    },
    [onSearchTracks]
  );

  const togglePlaylistTrack = useCallback((playlist: IPlaylist, track: ITrack) => {
    setSelection(prev => {
      const newPlaylists = new Map(prev.playlists);
      const selectedTracks = new Set(newPlaylists.get(playlist.id) || new Set<ITrack>());

      // Find if this exact track is already selected
      const existingTrack = Array.from(selectedTracks).find(t => t.id === track.id);

      if (existingTrack) {
        selectedTracks.delete(existingTrack);
      } else {
        selectedTracks.add(track);
      }

      // If all tracks in the playlist are selected, ensure the playlist is selected
      if (selectedTracks.size === playlist.tracks.length) {
        newPlaylists.set(playlist.id, selectedTracks);
      } else if (selectedTracks.size === 0) {
        // If no tracks are selected, remove the playlist
        newPlaylists.delete(playlist.id);
      } else {
        // Some tracks are selected
        newPlaylists.set(playlist.id, selectedTracks);
      }

      return { ...prev, playlists: newPlaylists };
    });
  }, []);

  const toggleAllPlaylists = useCallback(() => {
    setSelection(prev => {
      const newPlaylists = new Map();
      if (prev.playlists.size === 0) {
        // Select all playlists with all their tracks
        data.playlists.forEach(playlist => {
          newPlaylists.set(playlist.id, new Set(playlist.tracks));
        });
      }
      return { ...prev, playlists: newPlaylists };
    });
  }, [data.playlists]);

  const value = {
    selection,
    selectedView,
    isSelectionDisabled,
    toggleLikedSongs,
    toggleLikedSong,
    toggleAlbum,
    togglePlaylist,
    togglePlaylistTrack,
    toggleAllAlbums,
    toggleAllPlaylists,
    setSelectedView,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
