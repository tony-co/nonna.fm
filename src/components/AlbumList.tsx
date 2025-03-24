import { FC, useEffect, useState, useRef } from "react";
import { IAlbum } from "@/types/library";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";
import Image from "next/image";

interface AlbumListProps {
  albums: Array<IAlbum>;
}

const useIsVisible = (ref: React.RefObject<HTMLElement | null>): boolean => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

const StatusIcon: FC<{ status: string | undefined }> = ({ status }) => {
  switch (status) {
    case "matched":
      return (
        <div className="flex justify-end" title="Matched">
          <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
        </div>
      );
    case "unmatched":
      return (
        <div className="flex justify-end" title="Not Found">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-400" />
        </div>
      );
    case "pending":
      return (
        <div className="flex justify-end" title="Searching...">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-300 dark:bg-indigo-200" />
        </div>
      );
    default:
      return null;
  }
};

const AlbumItem: FC<{ album: IAlbum }> = ({ album }) => {
  const { selection, isSelectionDisabled, toggleAlbum } = useSelection();
  const { getAlbumStatus } = useMatching();
  const status = getAlbumStatus(album.id);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);

  return (
    <div
      ref={ref}
      className="flex items-center gap-4 rounded-lg bg-indigo-50 p-4 transition-colors duration-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
    >
      <input
        type="checkbox"
        className="h-4 w-4 cursor-pointer rounded accent-indigo-600 transition-colors duration-200 dark:accent-indigo-500"
        checked={selection.albums.has(album)}
        onChange={() => toggleAlbum(album)}
        disabled={isSelectionDisabled}
      />
      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
        {album.artwork ? (
          isVisible ? (
            <Image
              src={album.artwork}
              alt={`${album.name} artwork`}
              className="h-full w-full object-cover"
              width={48}
              height={48}
              priority={false}
            />
          ) : (
            <div className="h-full w-full bg-indigo-200 dark:bg-indigo-800" />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-indigo-200 dark:bg-indigo-800">
            <svg
              className="h-6 w-6 text-indigo-500 dark:text-indigo-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <p className="font-normal text-indigo-900 dark:text-indigo-50">{album.name}</p>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">{album.artist}</p>
      </div>
      <StatusIcon status={status} />
    </div>
  );
};

export const AlbumList: FC<AlbumListProps> = ({ albums }) => {
  const { getAlbumStatus } = useMatching();
  const unmatchedCount = albums.filter(album => getAlbumStatus(album.id) === "unmatched").length;

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-indigo-900 dark:text-indigo-50">Albums</h1>
          {unmatchedCount > 0 && (
            <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {unmatchedCount} unmatched
            </span>
          )}
        </div>
        <span className="text-sm text-indigo-800 dark:text-indigo-300">{albums.length} albums</span>
      </div>
      <div className="space-y-2">
        {albums.map(album => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
};
