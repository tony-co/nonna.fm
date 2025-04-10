"use client";
import { FC, useRef } from "react";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary, useLibrarySelection } from "@/contexts/LibraryContext";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useIsVisible } from "@/hooks/useIsVisible";
import { StatusIcon } from "@/components/shared/StatusIcon";
import type { IAlbum } from "@/types/library";

interface AlbumItemProps {
  album: IAlbum;
  selected: boolean;
  onToggle: () => void;
}

const AlbumItem: FC<AlbumItemProps> = ({ album, selected, onToggle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref);
  const { getAlbumStatus } = useMatching();
  const status = getAlbumStatus(album.id);

  return (
    <div
      ref={ref}
      className={`group grid grid-cols-[32px_1fr_32px] items-center gap-2 rounded-md p-1.5 transition-colors duration-200 md:grid-cols-[32px_32px_1fr_231px_32px] md:gap-4 md:p-2 ${
        selected
          ? "bg-indigo-50 dark:bg-indigo-950/30"
          : "bg-transparent hover:bg-indigo-50/70 dark:bg-transparent dark:hover:bg-indigo-950/20"
      }`}
      role="album"
    >
      <div>
        <input
          type="checkbox"
          className="h-3.5 w-3.5 cursor-pointer rounded-sm transition-colors duration-200 md:h-4 md:w-4"
          style={{ accentColor: "#6366f1" }}
          checked={selected}
          onChange={onToggle}
          aria-label={`Select ${album.name} by ${album.artist}`}
        />
      </div>

      <div className="hidden text-sm font-normal text-slate-500 md:block dark:text-slate-400">
        {/* Album number would go here if needed */}
      </div>

      <div className="flex min-w-0 items-center gap-4">
        {/* Artwork with intersection observer */}
        <div className="h-10 w-10 flex-shrink-0 rounded">
          {isVisible ? (
            <ArtworkImage
              src={album.artwork}
              alt={`${album.name} artwork`}
              size={40}
              type="album"
            />
          ) : (
            <div className="h-full w-full rounded bg-slate-100 dark:bg-slate-800" />
          )}
        </div>

        {/* Album info */}
        <div className="min-w-0 flex-1">
          <div
            className={`truncate font-medium ${
              status === "unmatched"
                ? "text-red-500 dark:text-red-400"
                : status === "matched"
                  ? "text-gray-800 dark:text-indigo-50"
                  : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {album.name}
          </div>
          <div className="truncate text-sm text-slate-500 dark:text-slate-400">{album.artist}</div>
        </div>
      </div>

      <div>
        <StatusIcon status={status} />
      </div>
    </div>
  );
};

export const AlbumList: FC = () => {
  const { state } = useLibrary();
  const { selectedItems, selectAlbum, deselectAlbum } = useLibrarySelection();
  const { getAlbumStatus } = useMatching();

  if (!state.albums) return null;

  // Convert selected album IDs to album objects
  const selectedAlbums = new Set(
    Array.from(state.albums).filter(album => selectedItems.albums.has(album.id))
  );

  // Count unmatched albums
  const unmatchedCount = Array.from(state.albums).reduce((count, album) => {
    return getAlbumStatus(album.id) === "unmatched" ? count + 1 : count;
  }, 0);

  // Handle album toggle
  const handleToggleAlbum = (album: IAlbum) => {
    if (selectedItems.albums.has(album.id)) {
      deselectAlbum(album.id);
    } else {
      selectAlbum(album.id);
    }
  };

  // Calculate if all albums are selected
  const allAlbumsSelected = state.albums.size > 0 && selectedAlbums.size === state.albums.size;
  const someAlbumsSelected = selectedAlbums.size > 0 && selectedAlbums.size < state.albums.size;

  // Handle select all toggle
  const handleSelectAll = () => {
    if (allAlbumsSelected) {
      Array.from(state.albums).forEach(album => {
        if (selectedItems.albums.has(album.id)) {
          deselectAlbum(album.id);
        }
      });
    } else {
      Array.from(state.albums).forEach(album => {
        if (!selectedItems.albums.has(album.id)) {
          selectAlbum(album.id);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-50">Albums</h1>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          {state.albums.size} albums • {unmatchedCount} unmatched
        </p>
      </div>

      {/* Album List */}
      <div className="relative bg-transparent dark:bg-transparent" role="albumlist">
        {/* List Header */}
        <div
          className="sticky top-0 mb-4 grid grid-cols-[32px_1fr_32px] gap-2 border-b border-slate-200 bg-white/80 p-1.5 py-2 text-xs font-normal text-slate-500 backdrop-blur-sm md:grid-cols-[32px_32px_1fr_231px_32px] md:gap-4 md:p-2 md:text-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400"
          role="row"
        >
          <div className="flex items-center" role="columnheader">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 cursor-pointer rounded-sm transition-colors duration-200 md:h-4 md:w-4"
              style={{ accentColor: "#6366f1" }}
              checked={allAlbumsSelected}
              ref={checkbox => {
                if (checkbox) {
                  checkbox.indeterminate = someAlbumsSelected && !allAlbumsSelected;
                }
              }}
              onChange={handleSelectAll}
              aria-label="Select all albums"
            />
          </div>
          <div className="hidden items-center md:flex" role="columnheader">
            #
          </div>
          <div className="flex items-center" role="columnheader">
            Title
          </div>
          <div className="hidden items-center md:flex" role="columnheader">
            Artist
          </div>
          <div className="flex items-center justify-end" role="columnheader">
            Status
          </div>
        </div>

        {/* Albums */}
        <div className="space-y-2">
          {Array.from(state.albums).map(album => (
            <AlbumItem
              key={album.id}
              album={album}
              selected={selectedAlbums.has(album)}
              onToggle={() => handleToggleAlbum(album)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
