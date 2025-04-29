"use client";

import { useParams } from "next/navigation";
import { useLibrary } from "@/contexts/LibraryContext";
import { useMatching } from "@/hooks/useMatching";
import { useTransfer as useTransferHook } from "@/hooks/useTransfer";
import { useTransfer } from "@/contexts/TransferContext";
import { useState } from "react";
import { TransferSuccessModal } from "./TransferSuccessModal";
import { MusicService } from "@/types/services";

// Track playlists that are currently being fetched
export const fetchingPlaylists = new Set<string>();

export function TransferButton() {
  const { state } = useLibrary();
  const { isLoading: isMatching } = useMatching();
  const { userStatus: status } = useTransfer();
  const {
    handleStartTransfer,
    transferResults,
    showSuccessModal,
    setShowSuccessModal,
    error: transferError,
  } = useTransferHook();
  const [isTransferring, setIsTransferring] = useState(false);

  // Dynamically check if any selected playlist is currently being fetched (no memo, always up-to-date)
  const isFetchingPlaylists = Array.from(state.selectedItems.playlists).some(playlistId =>
    fetchingPlaylists.has(playlistId)
  );

  // Get target service from URL parameters
  const params = useParams();
  const targetServiceId = params.target as MusicService;

  // Check if any items are selected
  const hasSelections =
    state.selectedItems.tracks.size > 0 ||
    state.selectedItems.albums.size > 0 ||
    state.selectedItems.playlists.size > 0;

  // Button is busy if any async operation is in progress
  const isBusy = isTransferring || isMatching || isFetchingPlaylists;
  // Disable if busy, completed, or nothing selected
  const isDisabled = isBusy || !hasSelections;

  // Determine button text based on state
  const buttonText =
    isMatching || isFetchingPlaylists
      ? "Finding Matches..."
      : isTransferring
        ? "Transferring..."
        : "Start Transfer";

  // Format summary text of selected items
  const getSummaryText = () => {
    const parts = [];
    if (state.selectedItems.tracks.size > 0) {
      parts.push(`${state.selectedItems.tracks.size} liked tracks`);
    }
    if (state.selectedItems.albums.size > 0) {
      parts.push(`${state.selectedItems.albums.size} albums`);
    }
    if (state.selectedItems.playlists.size > 0) {
      parts.push(`${state.selectedItems.playlists.size} playlists`);
    }
    return parts.join(", ");
  };

  // Prepare selected data for the success modal
  const getSelectedData = () => {
    const selectedLikedSongs = state.likedSongs
      ? Array.from(state.likedSongs).filter(track => state.selectedItems.tracks.has(track.id))
      : [];

    const selectedAlbums = state.albums
      ? Array.from(state.albums).filter(album => state.selectedItems.albums.has(album.id))
      : [];

    const selectedPlaylists = new Map();
    if (state.playlists) {
      for (const playlistId of state.selectedItems.playlists) {
        const playlist = state.playlists.get(playlistId);
        if (playlist) {
          selectedPlaylists.set(playlistId, playlist);
        }
      }
    }

    return {
      likedSongs: selectedLikedSongs,
      albums: selectedAlbums,
      playlists: selectedPlaylists,
    };
  };

  // Handle button click
  const handleClick = async () => {
    if (!hasSelections) return;
    setIsTransferring(true);

    try {
      // Create selection state from the selected items
      const selection = {
        likedSongs: new Set(
          state.likedSongs
            ? Array.from(state.likedSongs).filter(track => state.selectedItems.tracks.has(track.id))
            : []
        ),
        albums: new Set(
          state.albums
            ? Array.from(state.albums).filter(album => state.selectedItems.albums.has(album.id))
            : []
        ),
        playlists: new Map(),
      };

      // Add selected playlists to the selection
      if (state.playlists) {
        for (const playlistId of state.selectedItems.playlists) {
          const playlist = state.playlists.get(playlistId);
          if (playlist) {
            selection.playlists.set(playlistId, new Set(playlist.tracks));
          }
        }
      }

      await handleStartTransfer(selection);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4">
        {status && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {status.availableToday} transfers left
          </span>
        )}
        <button
          className={`relative flex w-[240px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${
            !isDisabled
              ? "transform cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-200/50 active:scale-[0.98] dark:hover:shadow-indigo-900/30"
              : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }`}
          onClick={handleClick}
          disabled={isDisabled}
          aria-label={`${buttonText}${hasSelections ? ` - ${getSummaryText()}` : ""}`}
          role="transfer-button"
          tabIndex={!isDisabled ? 0 : -1}
        >
          {/* Progress Overlay */}
          {(isMatching || isTransferring || isFetchingPlaylists) && (
            <div className="absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
          )}
          <span className="relative z-10 flex flex-col items-center justify-center">
            <span className="flex items-center justify-center gap-2">
              {isMatching || isTransferring || isFetchingPlaylists ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {buttonText}
                </>
              ) : (
                buttonText
              )}
            </span>
          </span>
        </button>
      </div>

      {showSuccessModal && transferResults && (
        <TransferSuccessModal
          isOpen={true}
          onClose={() => setShowSuccessModal(false)}
          targetServiceId={targetServiceId}
          results={transferResults}
          selectedData={getSelectedData()}
        />
      )}

      {transferError && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md rounded-lg bg-red-50 p-4 text-red-800 shadow-lg dark:bg-red-900/30 dark:text-red-200">
          <p>{transferError}</p>
        </div>
      )}
    </>
  );
}
