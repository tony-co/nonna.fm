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
  transferProgress: { current: number; total: number } | null;
  isTransferring: boolean;
}

export function useTransfer(): UseTransferHookReturn {
  const { state } = useLibrary();
  useMatching();
  const [transferResults, setTransferResults] = useState<TransferResults | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferProgress, setTransferProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const { updateUsage, checkLimit } = useTransferContext();

  const params = useParams();
  const sourceService = params.source as MusicService;
  const targetService = params.target as MusicService;

  // Helper to count total tracks that will actually be transferred
  const countTransferableItems = (selection: ISelectionState): number => {
    let count = 0;

    // Count liked songs that are matched and have targetId
    count += Array.from(selection.likedSongs).filter(
      track => track.status === "matched" && track.targetId
    ).length;

    // Count tracks in playlists that are matched and have targetId
    for (const [, selectedTracks] of Array.from(selection.playlists.entries())) {
      count += Array.from(selectedTracks).filter(
        track => track.status === "matched" && track.targetId
      ).length;
    }

    // Count albums that are matched and have targetId (albums count as 1 each for simplicity)
    count += Array.from(selection.albums).filter(
      album => album.status === "matched" && album.targetId
    ).length;

    return count;
  };

  const handleStartTransfer = async (selection: ISelectionState): Promise<void> => {
    if (!state || !targetService) {
      setError("Target service not specified");
      return;
    }

    setIsTransferring(true);
    try {
      // Count total items that will actually be transferred
      const totalTracksToTransfer = countTransferableItems(selection);

      // Initialize progress tracking
      setTransferProgress({ current: 0, total: totalTracksToTransfer });
      let currentProgress = 0;

      // Check against daily limit without updating usage
      const canProceed = await checkLimit(totalTracksToTransfer);
      if (!canProceed) {
        setTransferProgress(null);
        setIsTransferring(false);
        return;
      }

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
        const baseProgress = currentProgress;
        results.likedSongs = await addTracksToLibrary(matchedLikedSongs, (completed, _total) => {
          setTransferProgress({ current: baseProgress + completed, total: totalTracksToTransfer });
        });
        currentProgress += matchedLikedSongs.length;
        setTransferProgress({ current: currentProgress, total: totalTracksToTransfer });
      }

      // Transfer matched albums
      const albumsWithIds = Array.from(selection.albums)
        .filter(album => album.status === "matched" && album.targetId)
        .map(album => ({
          ...album,
          targetId: album.targetId,
        }));

      if (albumsWithIds.length > 0) {
        const albumsSet = new Set<IAlbum>(albumsWithIds);
        const baseProgress = currentProgress;
        results.albums = await addAlbumsToLibrary(albumsSet, (completed, _total) => {
          setTransferProgress({ current: baseProgress + completed, total: totalTracksToTransfer });
        });
        // Count albums as tracks for progress (as requested for simplicity)
        currentProgress += albumsWithIds.length;
        setTransferProgress({ current: currentProgress, total: totalTracksToTransfer });
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

        const matchedTracks = Array.from(selectedTracks)
          .filter(track => track.status === "matched" && track.targetId)
          .map(track => ({
            ...track,
            targetId: track.targetId,
          }));

        if (matchedTracks.length > 0) {
          const baseProgress = currentProgress;
          const result = await createPlaylistWithTracks(
            playlist.name,
            matchedTracks,
            `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`,
            (completed, _total) => {
              setTransferProgress({
                current: baseProgress + completed,
                total: totalTracksToTransfer,
              });
            }
          );
          results.playlists.set(playlistId, result);
          currentProgress += matchedTracks.length;
          setTransferProgress({ current: currentProgress, total: totalTracksToTransfer });
        }
      }

      // Update usage count in Redis after successful transfer
      await updateUsage(totalTracksToTransfer);

      setTransferResults(results);
      setShowSuccessModal(true);
      setTransferProgress(null); // Clear progress when done
    } catch (_err) {
      setError("Failed to transfer tracks. Please try again.");
      setTransferProgress(null); // Clear progress on error
    } finally {
      setIsTransferring(false);
    }
  };

  const handleTransferPlaylist = async (
    playlist: IPlaylist,
    selection: ISelectionState
  ): Promise<void> => {
    if (!state || !targetService) {
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
    } catch (_err) {
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
    transferProgress,
    isTransferring,
  };
}
