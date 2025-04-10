import { useState } from "react";
import { ISelectionState, IAlbum, IPlaylist } from "@/types/library";
import { MusicService, TransferResult } from "@/types/services";
import { useMatching, MATCHING_STATUS } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { addTracksToLibrary, addAlbumsToLibrary, createPlaylistWithTracks } from "@/lib/musicApi";
import { useParams } from "next/navigation";

interface TransferResults {
  likedSongs?: TransferResult;
  albums?: TransferResult;
  playlists: Map<string, TransferResult>;
}

interface UseTransferReturn {
  handleStartTransfer: (selection: ISelectionState) => Promise<void>;
  handleTransferPlaylist: (playlist: IPlaylist, selection: ISelectionState) => Promise<void>;
  transferResults: TransferResults | null;
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  error: string | null;
}

export function useTransfer(): UseTransferReturn {
  const { state } = useLibrary();
  const { getTrackStatus, getTrackTargetId, getAlbumTargetId } = useMatching();
  const [transferResults, setTransferResults] = useState<TransferResults | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const sourceService = params.source as MusicService;
  const targetService = params.target as MusicService;

  const handleStartTransfer = async (selection: ISelectionState): Promise<void> => {
    if (!state || !targetService) {
      console.error("handleStartTransfer - missing required data", { state, targetService });
      setError("Target service not specified");
      return;
    }

    try {
      const results: TransferResults = {
        playlists: new Map<string, TransferResult>(),
      };

      console.log("Starting transfer with selection:", selection);

      // Transfer liked songs
      const matchedLikedSongs = Array.from(selection.likedSongs)
        .filter(track => getTrackStatus(track.id) === MATCHING_STATUS.MATCHED)
        .map(track => ({
          ...track,
          targetId: getTrackTargetId(track.id),
        }));

      if (matchedLikedSongs.length > 0) {
        results.likedSongs = await addTracksToLibrary(matchedLikedSongs, targetService);
      }

      // Transfer matched albums
      const albumsWithIds = Array.from(selection.albums)
        .map(album => ({
          ...album,
          targetId: getAlbumTargetId(album.id),
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
        if (!state.playlists) {
          throw new Error("Playlists not initialized");
        }
        const playlist = state.playlists.get(playlistId);
        if (!playlist) {
          throw new Error(`Playlist not found: ${playlistId}`);
        }

        console.log("Transferring playlist:", playlist);

        const matchedTracks = Array.from(selectedTracks)
          .filter(track => getTrackStatus(track.id) === MATCHING_STATUS.MATCHED)
          .map(track => ({
            ...track,
            targetId: getTrackTargetId(track.id),
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

      console.log("Transfer completed successfully:", results);
      setTransferResults(results);
      setShowSuccessModal(true);
      console.log("Success modal should show now:", { showModal: true });
    } catch (err) {
      console.error("handleStartTransfer - error:", err);
      setError("Failed to transfer tracks. Please try again.");
    }
  };

  const handleTransferPlaylist = async (
    playlist: IPlaylist,
    selection: ISelectionState
  ): Promise<void> => {
    if (!state || !targetService) {
      console.error("handleTransferPlaylist - missing required data", {
        state,
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
        .filter(track => getTrackStatus(track.id) === MATCHING_STATUS.MATCHED)
        .map(track => ({
          ...track,
          targetId: getTrackTargetId(track.id),
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

      const results: TransferResults = {
        playlists: new Map([[playlist.id, result]]),
      };

      console.log("Playlist transfer completed successfully:", results);
      setTransferResults(results);
      setShowSuccessModal(true);
      console.log("Success modal should show now:", { showModal: true });
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
