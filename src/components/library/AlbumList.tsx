"use client";
import { FC, useRef } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useIsVisible } from "@/hooks/useIsVisible";
import { StatusIcon } from "@/components/shared/StatusIcon";
import type { IAlbum } from "@/types/library";

interface AlbumItemProps {
  album: IAlbum;
}

const AlbumItem: FC<AlbumItemProps> = ({ album }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);
  const status = album.status;

  return (
    <div
      ref={ref}
      className={
        "group grid grid-cols-[32px_1fr_32px] items-center gap-2 rounded-md bg-transparent p-1.5 transition-colors duration-200 hover:bg-indigo-50/70 dark:bg-transparent dark:hover:bg-indigo-950/20"
      }
      role="album"
    >
      <div className="flex-shrink-0 rounded">
        {isVisible ? (
          <ArtworkImage src={album.artwork} alt={`${album.name} artwork`} type="album" />
        ) : (
          <div className="h-full w-full rounded bg-slate-100 dark:bg-slate-800" />
        )}
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <div
          className={`ml-4 truncate font-medium ${
            status === "unmatched"
              ? "text-red-500 dark:text-red-400"
              : status === "matched"
                ? "text-gray-800 dark:text-indigo-50"
                : "text-slate-900 dark:text-slate-100"
          }`}
        >
          {album.name}
        </div>
        <div className="ml-4 truncate text-sm text-slate-500 dark:text-slate-400">
          {album.artist}
        </div>
      </div>
      <div className="flex justify-end">
        <StatusIcon album={album} />
      </div>
    </div>
  );
};

export const AlbumList: FC = () => {
  const { state } = useLibrary();
  if (!state.albums) return null;

  const unmatchedCount = Array.from(state.albums).reduce((count, album) => {
    return album.status === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-50">Albums</h1>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          {state.albums.size} albums • {unmatchedCount} unmatched
        </p>
      </div>
      <div className="relative bg-transparent dark:bg-transparent" role="albumlist">
        <div
          className="sticky top-0 mb-4 grid grid-cols-[32px_1fr_32px] gap-2 border-b border-slate-200 bg-white/80 p-1.5 py-2 text-xs font-normal text-slate-500 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400"
          role="row"
        >
          <div className="flex items-center" role="columnheader">
            Title
          </div>
          <div className="ml-4 flex items-center" role="columnheader"></div>
          <div className="flex items-center justify-end" role="columnheader">
            Status
          </div>
        </div>
        <div className="space-y-2">
          {Array.from(state.albums).map((album, index) => (
            <AlbumItem key={`${album.id}-${index}`} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
};
