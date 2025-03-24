import { FC } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";

interface ProgressProps {
  mode: "select" | "matching" | "review" | "transfer" | "completed";
  isLoading?: boolean;
  onStartTransfer: () => void;
}

export const Progress: FC<ProgressProps> = ({ mode, isLoading, onStartTransfer }) => {
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
  if (mode === "matching" && isLoading) {
    progress.processing = progress.total;
  }

  // Compute percentage for progress bar (still used for transfer button display)
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
      buttonEnabled = false;
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
    <div className="mb-12">
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h2 className="flex items-center gap-3 text-2xl font-semibold text-gray-800 sm:text-3xl dark:text-gray-200">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800">
              3
            </span>
            Select Tracks to Transfer
          </h2>

          {/* Stats Display */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Total: {progress.total}</span>
            <span className="text-emerald-500 dark:text-emerald-400">
              Matched: {progress.matched}
            </span>
            {progress.unmatched > 0 && (
              <span className="text-red-500 dark:text-red-400">
                Not Found: {progress.unmatched}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`relative overflow-hidden whitespace-nowrap rounded-full px-8 py-3.5 text-base font-medium ${
            buttonEnabled
              ? "transform cursor-pointer text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:shadow-indigo-200 active:scale-[0.98] dark:hover:shadow-indigo-900/30"
              : "cursor-not-allowed text-gray-400 dark:text-gray-500"
          }`}
          style={{
            background: buttonEnabled
              ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
              : "rgb(243 244 246 / 0.8)",
            boxShadow: buttonEnabled ? "0 2px 4px 0 rgb(0 0 0 / 0.1)" : "none",
          }}
          onClick={onStartTransfer}
          disabled={!buttonEnabled}
          aria-label={buttonText}
          role="button"
          tabIndex={buttonEnabled ? 0 : -1}
        >
          {/* Progress Overlay */}
          {(mode === "matching" || mode === "transfer") && isLoading && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

            @media (prefers-color-scheme: dark) {
              button:not(:disabled) {
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
              }
              button:disabled {
                background: rgb(31 41 55 / 0.8);
              }
            }
          `}</style>
          <span className="relative z-10 flex items-center justify-center gap-2">
            {(mode === "matching" || mode === "transfer") && isLoading ? (
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
      </div>
    </div>
  );
};
