import { FC } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";

interface TransferButtonProps {
  mode: "select" | "matching" | "review" | "transfer" | "completed";
  onStartTransfer: () => void;
}

export const TransferButton: FC<TransferButtonProps> = ({ mode, onStartTransfer }) => {
  const { selection } = useSelection();
  const { matchingState } = useMatching();

  // Compute progress from selection and matching state
  const progress = {
    total: 0,
    matched: 0,
    unmatched: 0,
    processing: 0,
  };

  // Count liked songs
  if (selection.likedSongs.size > 0) {
    progress.total += selection.likedSongs.size;
    Array.from(selection.likedSongs).forEach(track => {
      const matchInfo = matchingState.tracks.get(track.id);
      if (matchInfo?.status === "matched") progress.matched++;
      else if (matchInfo?.status === "unmatched") progress.unmatched++;
    });
  }

  // Count albums
  if (selection.albums.size > 0) {
    progress.total += selection.albums.size;
    Array.from(selection.albums).forEach(album => {
      const matchInfo = matchingState.albums.get(album.id);
      if (matchInfo?.status === "matched") progress.matched++;
      else if (matchInfo?.status === "unmatched") progress.unmatched++;
    });
  }

  // Count playlist tracks
  Array.from(selection.playlists).forEach(([_, selectedTracks]) => {
    progress.total += selectedTracks.size;
    Array.from(selectedTracks).forEach(track => {
      const matchInfo = matchingState.tracks.get(track.id);
      if (matchInfo?.status === "matched") progress.matched++;
      else if (matchInfo?.status === "unmatched") progress.unmatched++;
    });
  });

  // In matching mode, set processing to total to show progress
  if (mode === "matching") {
    progress.processing = progress.total;
  }

  // Compute percentage for progress bar
  const progressPercent =
    mode === "transfer" && progress.total > 0
      ? Math.round(((progress.matched + progress.unmatched) / progress.total) * 100)
      : mode === "completed"
        ? 100
        : 0;

  // Determine button text and state based on mode and progress
  let buttonText = "";
  let buttonEnabled = false;

  switch (mode) {
    case "select":
      buttonText = "Select items to transfer";
      buttonEnabled =
        selection.likedSongs.size > 0 || selection.albums.size > 0 || selection.playlists.size > 0;
      break;
    case "matching":
      buttonText = "Matching in progress...";
      buttonEnabled = false;
      break;
    case "review":
      buttonText = `Transfer ${progress.matched} matched items`;
      buttonEnabled = progress.matched > 0;
      break;
    case "transfer":
      buttonText = `Transferring ${progressPercent}%`;
      buttonEnabled = false;
      break;
    case "completed":
      buttonText = "Transfer completed";
      buttonEnabled = false;
      break;
  }

  return (
    <button
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-4 text-base font-medium shadow-lg transition-all duration-200 md:bottom-8 md:right-8 md:px-8 md:py-4 ${
        buttonEnabled
          ? "transform cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-200/50 active:scale-[0.98] dark:hover:shadow-indigo-900/30"
          : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
      }`}
      onClick={onStartTransfer}
      disabled={!buttonEnabled}
      aria-label={buttonText}
      role="transfer-button"
      tabIndex={buttonEnabled ? 0 : -1}
    >
      {/* Progress Overlay */}
      {(mode === "matching" || mode === "transfer") && (
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
      <span className="relative z-10 flex items-center justify-center gap-2">
        {mode === "matching" || mode === "transfer" ? (
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
        ) : mode === "completed" ? (
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
    </button>
  );
};
