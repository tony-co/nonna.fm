import { FC } from "react";
import { LikedSongs } from "@/components/library/LikedSongs";
import { AlbumList } from "@/components/library/AlbumList";
import { Playlist } from "@/app/library/[source]/[target]/playlist/[id]/_components/Playlist";
import { useLibrary } from "@/contexts/LibraryContext";

interface LibraryContentProps {
  viewToRender: { type: "playlist" | "album" | "liked"; id?: string } | null;
}

const EmptyState: FC = () => (
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
);

export const LibraryContent: FC<LibraryContentProps> = ({ viewToRender }) => {
  const { state } = useLibrary();

  if (!viewToRender) {
    return <EmptyState />;
  }

  switch (viewToRender.type) {
    case "liked":
      return <LikedSongs />;
    case "album":
      return <AlbumList />;
    case "playlist":
      if (viewToRender.id && state) {
        const playlist = state.playlists.get(viewToRender.id);
        if (!playlist) {
          return <EmptyState />;
        }
        return <Playlist playlistId={viewToRender.id} />;
      }
      return <EmptyState />;
    default:
      return <EmptyState />;
  }
};
