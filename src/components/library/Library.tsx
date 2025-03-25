import { FC, useEffect } from "react";
import { IAlbum, IPlaylist, ITrack, ISelectionState } from "@/types/library";
import { Progress } from "@/components/shared/Progress";
import { LikedSongs } from "@/components/library/LikedSongs";
import { AlbumList } from "@/components/library/AlbumList";
import { Playlist } from "@/components/library/Playlist";
import { SelectionProvider, useSelection } from "@/contexts/SelectionContext";
import { LibrarySidebar } from "@/components/layout/Sidebar";

interface LibraryProps {
  data: {
    likedSongs: Array<ITrack>;
    albums: Array<IAlbum>;
    playlists: Array<IPlaylist>;
  };
  mode: "select" | "matching" | "review" | "transfer" | "completed";
  onItemClick?: (type: "playlist" | "album", id: string) => Promise<void>;
  onStartTransfer: (selection: ISelectionState) => Promise<void>;
  onSearchTracks: (itemOrCategory?: IAlbum | IPlaylist | "liked" | "albums") => void;
}

const LibraryContent: FC<LibraryProps> = ({
  data,
  mode,
  onItemClick,
  onStartTransfer,
  onSearchTracks,
}) => {
  const { selection, selectedView, setSelectedView } = useSelection();

  // Add beforeunload handler when in transfer mode with selections
  useEffect(() => {
    const hasSelections =
      selection.likedSongs.size > 0 || selection.albums.size > 0 || selection.playlists.size > 0;

    console.log("Selection state:", {
      hasSelections,
      mode,
      likedSongs: selection.likedSongs.size,
      albums: selection.albums.size,
      playlists: selection.playlists.size,
    });

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

  const handleItemClick = (type: "playlist" | "album" | "liked", id?: string): void => {
    console.log("handleItemClick", { type, id });
    setSelectedView({ type, id });

    // Only call onItemClick for playlist and album types
    if (type === "liked") {
      // Trigger search for liked songs
      onSearchTracks("liked");
    } else if (type === "album" && !id) {
      // Clicking the albums category
      onSearchTracks("albums");
    } else if (onItemClick && id) {
      // Handle individual playlist or album clicks
      onItemClick(type as "playlist" | "album", id);
    }
  };

  return (
    <div className="fade-in relative flex h-full flex-col">
      <Progress mode={mode} onStartTransfer={() => onStartTransfer(selection)} />

      {/* Content Container */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside
          role="complementary"
          aria-label="Library Selection"
          className="sticky bottom-[20px] top-[20px] h-[calc(100vh-40px)] w-80 flex-shrink-0 overflow-y-auto"
        >
          <LibrarySidebar data={data} onItemClick={handleItemClick} />
        </aside>

        {/* Main Content */}
        <main
          role="main"
          aria-label="Selected Content"
          className="main-content flex-1 overflow-y-auto scroll-smooth"
        >
          <div className="overflow-hidden rounded-xl bg-indigo-50/20 p-6 shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-950/20 dark:ring-indigo-300/10">
            {/* Switch on view type */}
            {{
              liked: <LikedSongs tracks={data.likedSongs} mode={mode} />,
              album: <AlbumList albums={data.albums} />,
              playlist: selectedView?.id
                ? data.playlists.find(p => p.id === selectedView.id) && (
                    <Playlist
                      playlist={data.playlists.find(p => p.id === selectedView.id)!}
                      mode={mode}
                    />
                  )
                : null,
            }[(selectedView?.type || "") as "liked" | "album" | "playlist"] ?? (
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
        </main>
      </div>
    </div>
  );
};

export const Library: FC<LibraryProps> = props => {
  return (
    <SelectionProvider data={props.data} mode={props.mode} onSearchTracks={props.onSearchTracks}>
      <LibraryContent {...props} />
    </SelectionProvider>
  );
};
