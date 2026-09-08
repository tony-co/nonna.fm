import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { useTransfer as useTransferContext } from "@/contexts/TransferContext";
import { getAuthData } from "@/lib/auth/constants";
import { addAlbumsToLibrary, addTracksToLibrary, createPlaylistWithTracks } from "@/lib/musicApi";
import type { IAlbum, ISelectionState, ITrack, TransferResult } from "@/types";

interface TransferResults {
  likedSongs?: TransferResult;
  albums?: TransferResult;
  playlists: Map<string, TransferResult>;
}

interface TransferJob {
  count: number;
  run: (onProgress: (completed: number, total: number) => void) => Promise<TransferResult>;
  save: (result: TransferResult) => void;
}

function getMatchedItems<T extends ITrack | IAlbum>(items: Iterable<T>): T[] {
  return Array.from(items).filter(item => item.status === "matched" && item.targetId);
}

export function useTransfer() {
  const { state } = useLibrary();
  const { updateUsage, checkLimit } = useTransferContext();
  const params = useParams();
  const isRunning = useRef(false);
  const isActive = useRef(true);
  useEffect(() => {
    isActive.current = true;
    return () => {
      isActive.current = false;
    };
  }, []);
  const [transferResults, setTransferResults] = useState<TransferResults | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transferProgress, setTransferProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);

  async function handleStartTransfer(selection: ISelectionState): Promise<void> {
    if (isRunning.current || !isActive.current) return;
    isRunning.current = true;
    setIsTransferring(true);
    setError(null);
    setShowSuccessModal(false);
    setTransferResults(null);
    const results: TransferResults = { playlists: new Map() };
    const jobs: TransferJob[] = [];

    try {
      if (!params.target) throw new Error("Target service not specified");
      const targetAuth = getAuthData("target");
      if (!targetAuth || targetAuth.serviceId !== params.target)
        throw new Error(
          "Target service authentication has changed. Reconnect before transferring."
        );
      const userId = `${targetAuth.serviceId}:${targetAuth.userId}`;
      const likedSongs = getMatchedItems(selection.likedSongs);
      if (likedSongs.length)
        jobs.push({
          count: likedSongs.length,
          run: progress => addTracksToLibrary(likedSongs, progress),
          save: result => {
            results.likedSongs = result;
          },
        });
      const albums = getMatchedItems(selection.albums);
      if (albums.length)
        jobs.push({
          count: albums.length,
          run: progress => addAlbumsToLibrary(new Set(albums), progress),
          save: result => {
            results.albums = result;
          },
        });
      for (const [id, selectedTracks] of selection.playlists) {
        const tracks = getMatchedItems(selectedTracks);
        if (!tracks.length) continue;
        const playlist = state.playlists?.get(id);
        if (!playlist) throw new Error(`Playlist not found: ${id}`);
        if (state.playlistLoads?.[id]?.status !== "loaded")
          throw new Error("Wait for playlists to finish loading before transferring");
        jobs.push({
          count: tracks.length,
          run: progress =>
            createPlaylistWithTracks(
              playlist.name,
              tracks,
              `Imported from ${params.source} on ${new Date().toLocaleDateString()}`,
              progress
            ),
          save: result => {
            results.playlists.set(id, result);
          },
        });
      }
      const total = jobs.reduce((count, job) => count + job.count, 0);
      if (!total) throw new Error("No matched items selected for transfer");
      if (!(await checkLimit(total, userId))) {
        setError(
          "Transfer limit could not be confirmed. Check your available transfers and try again."
        );
        return;
      }
      let completed = 0;
      let hasFailures = false;
      for (const job of jobs) {
        if (!isActive.current) return;
        const currentAuth = getAuthData("target");
        if (
          currentAuth?.serviceId !== targetAuth.serviceId ||
          currentAuth?.userId !== targetAuth.userId
        )
          throw new Error("Target account changed. The transfer was stopped.");
        setTransferProgress({ current: completed, total });
        let result: TransferResult;
        try {
          result = await job.run(count =>
            setTransferProgress({ current: completed + count, total })
          );
        } catch (error) {
          job.save({ added: 0, failed: job.count, total: job.count, playlistId: null });
          throw error;
        }
        job.save(result);
        completed += job.count;
        hasFailures ||= result.failed > 0;
        setTransferResults({ ...results, playlists: new Map(results.playlists) });
        if (result.added > 0 && !(await updateUsage(result.added, userId))) {
          throw new Error(
            "Transferred items, but usage could not be recorded. Refresh before starting another transfer."
          );
        }
      }
      if (hasFailures)
        setError(
          "Some items could not be transferred. Review the transfer results before trying again."
        );
      setShowSuccessModal(true);
    } catch (error) {
      const confirmed =
        (results.likedSongs?.added ?? 0) +
        (results.albums?.added ?? 0) +
        Array.from(results.playlists.values()).reduce((sum, result) => sum + result.added, 0);
      if (confirmed > 0) {
        setTransferResults({ ...results, playlists: new Map(results.playlists) });
        setShowSuccessModal(true);
      }
      setError(error instanceof Error ? error.message : "Failed to transfer items");
    } finally {
      setTransferProgress(null);
      setIsTransferring(false);
      isRunning.current = false;
    }
  }

  return {
    handleStartTransfer,
    transferResults,
    showSuccessModal,
    setShowSuccessModal,
    error,
    transferProgress,
    isTransferring,
  };
}
