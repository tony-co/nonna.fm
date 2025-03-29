import { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MusicService } from "@/types/services";
import { IAlbum, IPlaylist } from "@/types/library";
import { LikedSongs } from "@/components/library/LikedSongs";
import { AlbumList } from "@/components/library/AlbumList";
import { Playlist } from "@/components/library/Playlist";
import { useSelection } from "@/contexts/SelectionContext";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { TransferButton } from "@/components/shared/TransferButton";
import { usePlaylistTracks } from "@/hooks/usePlaylistTracks";
import { useTransfer } from "@/hooks/useTransfer";
import { useLibrary } from "@/contexts/LibraryContext";
import { TransferSuccessModal } from "@/components/shared/TransferSuccessModal";

interface LibraryProps {
  mode: "select" | "matching" | "review" | "transfer" | "completed";
  onSearchTracks: (itemOrCategory?: IAlbum | IPlaylist | "liked" | "albums") => Promise<void>;
  onCancel: () => void;
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

export const Library: FC<LibraryProps> = ({ mode, onSearchTracks, onCancel }) => {
  const { libraryState } = useLibrary();
  const { selection, selectedView, setSelectedView } = useSelection();
  const [cachedView, setCachedView] = useState(selectedView);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const targetService = searchParams.get("target") as MusicService;

  const { handleLoadPlaylistTracks } = usePlaylistTracks({
    onCancel,
  });

  const {
    handleStartTransfer,
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

  // Add beforeunload handler when in transfer mode with selections
  useEffect(() => {
    const hasSelections =
      selection.likedSongs.size > 0 || selection.albums.size > 0 || selection.playlists.size > 0;

    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (mode === "transfer" || hasSelections) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave before transferring?";
      }
    };

    if (hasSelections) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return (): void => window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return (): void => {};
  }, [mode, selection]);

  const handleItemClick = async (
    type: "playlist" | "album" | "liked",
    id?: string
  ): Promise<void> => {
    setSelectedView({ type, id });
    setError(null);

    // Delay the data loading to allow animation to complete
    setTimeout(async () => {
      try {
        if (type === "liked") {
          await onSearchTracks("liked");
        } else if (type === "album" && !id) {
          await onSearchTracks("albums");
        } else if (type === "playlist" && id && libraryState) {
          const updatedPlaylist = await handleLoadPlaylistTracks(id);
          await onSearchTracks(updatedPlaylist);
        }
      } catch (err) {
        console.error("Error handling item click:", err);
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
        setSelectedView(null);
      }
    }, 300);
  };

  const handleBackClick = () => {
    // First trigger the slide animation
    setSelectedView(null);
    setError(null);

    // Clear the cached view after animation completes
    setTimeout(() => {
      setCachedView(null);
    }, 300);
  };

  if (!libraryState) {
    return null;
  }

  // Use cachedView for rendering content to maintain it during back transition
  const viewToRender = selectedView || cachedView;

  return (
    <div className="fade-in relative flex h-[calc(100vh-40px)] flex-col">
      <TransferButton mode={mode} onStartTransfer={() => handleStartTransfer(selection)} />

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
          <LibrarySidebar onItemClick={handleItemClick} />
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
            {/* Switch on view type */}
            {{
              liked: <LikedSongs mode={mode} />,
              album: <AlbumList />,
              playlist: viewToRender?.id &&
                libraryState?.playlists.find(p => p.id === viewToRender.id) && (
                  <Playlist
                    playlist={libraryState.playlists.find(p => p.id === viewToRender.id)!}
                    mode={mode}
                  />
                ),
            }[(viewToRender?.type || "") as "liked" | "album" | "playlist"] ?? (
              <div className="p-8 text-center" role="status" aria-label="Empty State">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-indigo-500 dark:text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                <p className="text-lg font-normal text-indigo-700 dark:text-indigo-400">
                  Select a playlist or album to view its tracks
                </p>
                <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-300/70">
                  Choose from your library on the left
                </p>
              </div>
            )}
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
