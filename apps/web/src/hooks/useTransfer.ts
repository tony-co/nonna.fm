import { useParams } from "next/navigation";
import { useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useTransfer as useTransferContext } from "@/contexts/TransferContext";
import { useMatching } from "@/hooks/useMatching";
import { addAlbumsToLibrary, addTracksToLibrary, createPlaylistWithTracks } from "@/lib/musicApi";
import type { IAlbum, IPlaylist, ISelectionState, MusicService, TransferResult } from "@/types";

interface TransferResults {
  likedSongs?: TransferResult;
  albums?: TransferResult;
  playlists: Map<string, TransferResult>;
}

interface UseTransferHookReturn {
  handleStartTransfer: (selection: ISelectionState) => Promise<void>;
  handleTransferPlaylist: (playlist: IPlaylist, selection: ISelectionState) => Promise<void>;
  transferResults: TransferResults | null;
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  error: string | null;
}

export function useTransfer(): UseTransferHookReturn {
  const { state } = useLibrary();
  useMatching();
  const [transferResults, setTransferResults] = useState<TransferResults | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUsage, checkLimit } = useTransferContext();

  const params = useParams();
  const sourceService = params.source as MusicService;
  const targetService = params.target as MusicService;

  // Helper to count total tracks in a selection
  const countSelectedTracks = (selection: ISelectionState): number => {
    let count = 0;

    // Count liked songs
    count += Array.from(selection.likedSongs).filter(track => track.status === "matched").length;

    // Count tracks in playlists
    for (const [, selectedTracks] of Array.from(selection.playlists.entries())) {
      count += Array.from(selectedTracks).filter(track => track.status === "matched").length;
    }

    // Count albums as tracks (this is a simplification)
    // In a full implementation, we would count the actual tracks in each album
    count += selection.albums.size;

    return count;
  };

  const handleStartTransfer = async (selection: ISelectionState): Promise<void> => {
    if (!state || !targetService) {
      console.error("handleStartTransfer - missing required data", { state, targetService });
      setError("Target service not specified");
      return;
    }

    try {
      // Count total tracks that will be transferred
      const totalTracksToTransfer = countSelectedTracks(selection);

      // Check against daily limit without updating usage
      const canProceed = await checkLimit(totalTracksToTransfer);
      if (!canProceed) {
        return;
      }

      console.log("Starting transfer with selection:", selection);

      const results: TransferResults = {
        playlists: new Map<string, TransferResult>(),
      };

      // Transfer liked songs
      const matchedLikedSongs = Array.from(selection.likedSongs)
        .filter(track => track.status === "matched" && track.targetId)
        .map(track => ({
          ...track,
          targetId: track.targetId,
        }));

      if (matchedLikedSongs.length > 0) {
        results.likedSongs = await addTracksToLibrary(matchedLikedSongs);
      }

      // Transfer matched albums
      const albumsWithIds = Array.from(selection.albums)
        .filter(album => album.status === "matched" && album.targetId)
        .map(album => ({
          ...album,
          targetId: album.targetId,
        }));

      if (albumsWithIds.length > 0) {
        console.log(
          "Transferring albums with IDs:",
          albumsWithIds.map(a => ({ name: a.name, targetId: a.targetId }))
        );
        const albumsSet = new Set<IAlbum>(albumsWithIds);
        results.albums = await addAlbumsToLibrary(albumsSet);
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
          .filter(track => track.status === "matched" && track.targetId)
          .map(track => ({
            ...track,
            targetId: track.targetId,
          }));

        if (matchedTracks.length > 0) {
          const result = await createPlaylistWithTracks(
            playlist.name,
            matchedTracks,
            `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`
          );
          results.playlists.set(playlistId, result);
        }
      }

      // Update usage count in Redis after successful transfer
      await updateUsage(totalTracksToTransfer);

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
        .filter(track => track.status === "matched" && track.targetId)
        .map(track => ({
          ...track,
          targetId: track.targetId,
        }));

      if (matchedTracks.length === 0) {
        setError("No matched tracks found for transfer");
        return;
      }

      // Check against daily limit without updating usage
      const canProceed = await checkLimit(matchedTracks.length);
      if (!canProceed) {
        return;
      }

      const result = await createPlaylistWithTracks(
        playlist.name,
        matchedTracks,
        `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`
      );

      // Update usage count in Redis after successful transfer
      await updateUsage(matchedTracks.length);

      const results: TransferResults = {
        playlists: new Map([[playlist.id, result]]),
      };

      setTransferResults(results);
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
