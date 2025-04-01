import { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MusicService } from "@/types/services";
import { IAlbum, IPlaylist } from "@/types/library";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { TransferButton } from "@/components/shared/TransferButton";
import { useTransfer } from "@/hooks/useTransfer";
import { useLibrary, useLibrarySelection } from "@/contexts/LibraryContext";
import { TransferSuccessModal } from "@/components/shared/TransferSuccessModal";
import { LibraryContent } from "@/components/library/LibraryContent";

interface LibraryProps {
  onSearchTracks: (itemOrCategory?: IAlbum | IPlaylist | "liked" | "albums") => Promise<void>;
}

const BackButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="xs:m-4 group mb-4 flex cursor-pointer items-center gap-3 px-5 py-2.5 text-sm text-indigo-600 transition-all duration-200 hover:text-indigo-700 active:scale-[0.98] md:hidden dark:text-indigo-400 dark:hover:text-indigo-300"
    aria-label="Return to library view"
  >
    <svg
      className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
    <span className="relative top-px">Back to Library</span>
  </button>
);

export const Library: FC<LibraryProps> = ({ onSearchTracks }) => {
  const { state } = useLibrary();
  const { selectedItems } = useLibrarySelection();
  const [selectedView, setSelectedView] = useState<{
    type: "playlist" | "album" | "liked";
    id?: string;
  } | null>(null);
  const [cachedView, setCachedView] = useState(selectedView);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const targetService = searchParams.get("target") as MusicService;

  const {
    transferResults,
    showSuccessModal,
    setShowSuccessModal,
    error: transferError,
  } = useTransfer({
    onSearchTracks,
  });

  // Update cached view when selectedView changes (forward navigation)
  useEffect(() => {
    if (selectedView) {
      setCachedView(selectedView);
    }
  }, [selectedView]);

  // Add beforeunload handler when user has selections
  useEffect(() => {
    const hasSelections =
      selectedItems.tracks.size > 0 ||
      selectedItems.albums.size > 0 ||
      selectedItems.playlists.size > 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (hasSelections) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave before transferring?";
      }
    };

    if (hasSelections) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return (): void => window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return (): void => {};
  }, [selectedItems]);

  const handleBackClick = () => {
    // First trigger the slide animation
    setSelectedView(null);
    setError(null);

    // Clear the cached view after animation completes
    setTimeout(() => {
      setCachedView(null);
    }, 300);
  };

  if (!state) {
    return null;
  }

  // Use cachedView for rendering content to maintain it during back transition
  const viewToRender = selectedView || cachedView;

  return (
    <div className="fade-in relative flex h-[calc(100vh-40px)] flex-col">
      <TransferButton />

      {(error || transferError) && (
        <div className="mx-6 mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
          {error || transferError}
        </div>
      )}

      {/* Content Container */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sidebar */}
        <aside
          role="sidebar"
          aria-label="Library Selection"
          className={`absolute inset-y-0 w-full overflow-y-auto transition-transform duration-300 ease-in-out md:relative md:w-80 ${
            selectedView ? "-translate-x-full md:translate-x-0" : "translate-x-0"
          }`}
        >
          <LibrarySidebar />
        </aside>

        {/* Main Content */}
        <main
          role="main"
          aria-label="Selected Content"
          className={`main-content absolute inset-0 flex-1 overflow-y-auto scroll-smooth transition-transform duration-300 ease-in-out md:relative ${
            selectedView ? "translate-x-0" : "translate-x-full md:translate-x-0"
          }`}
        >
          {viewToRender && <BackButton onClick={handleBackClick} />}
          <div className="overflow-hidden rounded-xl bg-indigo-50/20 p-6 shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-950/20 dark:ring-indigo-300/10">
            {state && <LibraryContent viewToRender={viewToRender} />}
          </div>
          {/* Add bottom padding on mobile */}
          <div className="h-18 md:h-0" />
        </main>
      </div>

      {transferResults && (
        <TransferSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          targetServiceId={targetService}
          results={transferResults}
        />
      )}
    </div>
  );
};
