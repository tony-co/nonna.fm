"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useLibrary } from "@/contexts/LibraryContext";
import { useMatching } from "@/contexts/MatchingContext";
import { useTransfer } from "@/hooks/useTransfer";
import { useState } from "react";
import { TransferSuccessModal } from "./TransferSuccessModal";
import { MusicService } from "@/types/services";

export function TransferButton() {
  const searchParams = useSearchParams();
  const { state } = useLibrary();
  const { matchingState } = useMatching();
  const [isTransferring, setIsTransferring] = useState(false);

  // Get target service from URL parameters
  const params = useParams();
  const targetServiceId = params.target as MusicService;

  const { handleStartTransfer, transferResults, showSuccessModal, setShowSuccessModal, error } =
    useTransfer({ onSearchTracks: () => Promise.resolve() });

  // Check if any items are selected
  const hasSelections =
    state.selectedItems.tracks.size > 0 ||
    state.selectedItems.albums.size > 0 ||
    state.selectedItems.playlists.size > 0;

  // Check if any items are currently being matched
  const isMatching =
    Array.from(matchingState.tracks.values()).some(track => track.status === "pending") ||
    Array.from(matchingState.albums.values()).some(album => album.status === "pending");

  // Get current mode from URL
  const mode = searchParams.get("step") || "select";
  const isCompleted = mode === "completed";

  // Determine button text based on state
  const buttonText = isMatching
    ? "Finding Matches..."
    : isTransferring
      ? "Transferring..."
      : isCompleted
        ? "Transfer Complete"
        : mode === "review"
          ? "Begin Transfer"
          : "Start Transfer";

  // Determine button state
  const isDisabled = isTransferring || isCompleted || !hasSelections;

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
    const selectedLikedSongs = Array.from(state.likedSongs).filter(track =>
      state.selectedItems.tracks.has(track.id)
    );

    const selectedAlbums = Array.from(state.albums).filter(album =>
      state.selectedItems.albums.has(album.id)
    );

    const selectedPlaylists = new Map();
    for (const playlistId of state.selectedItems.playlists) {
      const playlist = state.playlists.get(playlistId);
      if (playlist) {
        selectedPlaylists.set(playlistId, playlist);
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
          Array.from(state.likedSongs).filter(track => state.selectedItems.tracks.has(track.id))
        ),
        albums: new Set(
          Array.from(state.albums).filter(album => state.selectedItems.albums.has(album.id))
        ),
        playlists: new Map(),
      };

      // Add selected playlists to the selection
      for (const playlistId of state.selectedItems.playlists) {
        const playlist = state.playlists.get(playlistId);
        if (playlist) {
          selection.playlists.set(playlistId, new Set(playlist.tracks));
        }
      }

      await handleStartTransfer(selection);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <>
      <button
        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${
          hasSelections
            ? "transform cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-200/50 active:scale-[0.98] dark:hover:shadow-indigo-900/30"
            : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
        }`}
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={`${buttonText}${hasSelections ? ` - ${getSummaryText()}` : ""}`}
        role="transfer-button"
        tabIndex={hasSelections ? 0 : -1}
      >
        {/* Progress Overlay */}
        {(isMatching || isTransferring) && (
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: "shimmer 2s linear infinite",
              backgroundSize: "200% 100%",
            }}
          />
        )}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: 100% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
        `}</style>
        <span className="relative z-10 flex flex-col items-center justify-center">
          <span className="flex items-center justify-center gap-2">
            {isMatching || isTransferring ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {buttonText}
              </>
            ) : isCompleted ? (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {buttonText}
              </>
            ) : (
              buttonText
            )}
          </span>
          {hasSelections && !isCompleted && (
            <span className="text-sm opacity-90">{getSummaryText()}</span>
          )}
        </span>
      </button>

      {showSuccessModal && transferResults && (
        <TransferSuccessModal
          isOpen={true}
          onClose={() => setShowSuccessModal(false)}
          targetServiceId={targetServiceId}
          results={transferResults}
          selectedData={getSelectedData()}
        />
      )}

      {error && (
        <div className="fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md rounded-lg bg-red-50 p-4 text-red-800 shadow-lg dark:bg-red-900/30 dark:text-red-200">
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
