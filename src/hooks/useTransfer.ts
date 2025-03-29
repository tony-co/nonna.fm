import { useState } from "react";
import { ISelectionState, IAlbum, IPlaylist } from "@/types/library";
import { MusicService, TransferResult } from "@/types/services";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { addTracksToLibrary, addAlbumsToLibrary, createPlaylistWithTracks } from "@/lib/musicApi";
import { useSearchParams } from "next/navigation";

interface TransferResults {
  likedSongs?: TransferResult;
  albums?: TransferResult;
  playlists: Map<string, TransferResult>;
}

interface UseTransferProps {
  onSearchTracks: () => Promise<void>;
}

interface UseTransferReturn {
  handleStartTransfer: (selection: ISelectionState) => Promise<void>;
  handleTransferPlaylist: (playlist: IPlaylist, selection: ISelectionState) => Promise<void>;
  transferResults: TransferResults | null;
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  error: string | null;
}

export function useTransfer({ onSearchTracks }: UseTransferProps): UseTransferReturn {
  const { libraryState } = useLibrary();
  const { matchingState } = useMatching();
  const searchParams = useSearchParams();
  const [transferResults, setTransferResults] = useState<TransferResults | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get source and target services from URL parameters
  const sourceService = searchParams.get("source") as MusicService;
  const targetService = searchParams.get("target") as MusicService;

  const handleStartTransfer = async (selection: ISelectionState): Promise<void> => {
    if (!libraryState || !targetService) {
      console.error("handleStartTransfer - missing required data", { libraryState, targetService });
      setError("Target service not specified");
      return;
    }

    try {
      // First, ensure all selected items are matched
      const selectedAlbums = Array.from(selection.albums);
      const unmatched = selectedAlbums.filter(
        album => !matchingState.albums.get(album.id)?.targetId
      );

      if (unmatched.length > 0) {
        console.log(
          "Found unmatched albums, initiating matching process:",
          unmatched.map(a => a.name)
        );
        await onSearchTracks();
        return;
      }

      const results: TransferResults = {
        playlists: new Map<string, TransferResult>(),
      };

      // Transfer liked songs
      const matchedLikedSongs = Array.from(selection.likedSongs)
        .filter(track => matchingState.tracks.get(track.id)?.status === "matched")
        .map(track => ({
          ...track,
          targetId: matchingState.tracks.get(track.id)?.targetId,
        }));

      if (matchedLikedSongs.length > 0) {
        results.likedSongs = await addTracksToLibrary(matchedLikedSongs, targetService);
      }

      // Transfer matched albums
      const albumsWithIds = selectedAlbums
        .map(album => ({
          ...album,
          targetId: matchingState.albums.get(album.id)?.targetId,
        }))
        .filter((album): album is IAlbum & { targetId: string } => !!album.targetId);

      if (albumsWithIds.length > 0) {
        console.log(
          "Transferring albums with IDs:",
          albumsWithIds.map(a => ({ name: a.name, targetId: a.targetId }))
        );
        const albumsSet = new Set<IAlbum>(albumsWithIds);
        results.albums = await addAlbumsToLibrary(albumsSet, targetService);
      }

      // Transfer playlists
      for (const [playlistId, selectedTracks] of Array.from(selection.playlists.entries())) {
        const playlist = libraryState.playlists.find(p => p.id === playlistId);
        if (!playlist) continue;

        const matchedTracks = Array.from(selectedTracks)
          .filter(track => matchingState.tracks.get(track.id)?.status === "matched")
          .map(track => ({
            ...track,
            targetId: matchingState.tracks.get(track.id)?.targetId,
          }));

        if (matchedTracks.length > 0) {
          const result = await createPlaylistWithTracks(
            playlist.name,
            matchedTracks,
            `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`,
            targetService
          );
          results.playlists.set(playlistId, result);
        }
      }

      setTransferResults(results);
      setShowSuccessModal(true);
    } catch (err) {
      console.error("handleStartTransfer - error:", err);
      setError("Failed to transfer tracks. Please try again.");
    }
  };

  const handleTransferPlaylist = async (
    playlist: IPlaylist,
    selection: ISelectionState
  ): Promise<void> => {
    if (!libraryState || !targetService) {
      console.error("handleTransferPlaylist - missing required data", {
        libraryState,
        targetService,
      });
      setError("Target service not specified");
      return;
    }

    try {
      const selectedTracks = selection.playlists.get(playlist.id);
      if (!selectedTracks || selectedTracks.size === 0) {
        setError("No tracks selected for transfer");
        return;
      }

      const matchedTracks = Array.from(selectedTracks)
        .filter(track => matchingState.tracks.get(track.id)?.status === "matched")
        .map(track => ({
          ...track,
          targetId: matchingState.tracks.get(track.id)?.targetId,
        }));

      if (matchedTracks.length === 0) {
        setError("No matched tracks found for transfer");
        return;
      }

      const result = await createPlaylistWithTracks(
        playlist.name,
        matchedTracks,
        `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`,
        targetService
      );

      setTransferResults({
        playlists: new Map([[playlist.id, result]]),
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error("handleTransferPlaylist - error:", err);
      setError("Failed to transfer playlist. Please try again.");
    }
  };

  return {
    handleStartTransfer,
    handleTransferPlaylist,
    transferResults,
    showSuccessModal,
    setShowSuccessModal,
    error,
  };
}
