import { useState, useCallback } from "react";
import { ITrack, IAlbum, IPlaylist } from "@/types/library";
import { MusicService } from "@/types/services";
import { useMatching } from "@/contexts/MatchingContext";

interface UseSearchTracksReturn {
  isLoading: boolean;
  error: string | null;
  matchLikedSongs: (tracks: ITrack[], targetService: MusicService) => Promise<void>;
  matchAlbums: (albums: IAlbum[], targetService: MusicService) => Promise<void>;
  matchPlaylistTracks: (playlist: IPlaylist, targetService: MusicService) => Promise<void>;
  cancelMatching: (type: "likedSongs" | "albums" | "playlist", id?: string) => void;
}

export const useSearchTracks = (): UseSearchTracksReturn => {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const {
    matchLikedSongs: matchLikedSongsCtx,
    matchAlbums: matchAlbumsCtx,
    matchPlaylistTracks: matchPlaylistTracksCtx,
    cancelMatching,
  } = useMatching();

  const matchLikedSongs = useCallback(
    async (tracks: ITrack[], targetService: MusicService) => {
      if (!tracks.length) return;
      matchLikedSongsCtx(tracks, targetService);
    },
    [matchLikedSongsCtx]
  );

  const matchAlbums = useCallback(
    async (albums: IAlbum[], targetService: MusicService) => {
      if (!albums.length) return;
      matchAlbumsCtx(albums, targetService);
    },
    [matchAlbumsCtx]
  );

  const matchPlaylistTracks = useCallback(
    async (playlist: IPlaylist, targetService: MusicService) => {
      if (!playlist.tracks.length) return;
      matchPlaylistTracksCtx(playlist, targetService);
    },
    [matchPlaylistTracksCtx]
  );

  return {
    isLoading,
    error,
    matchLikedSongs,
    matchAlbums,
    matchPlaylistTracks,
    cancelMatching,
  };
};
