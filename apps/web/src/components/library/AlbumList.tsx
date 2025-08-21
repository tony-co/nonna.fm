"use client";
import { FC, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLibrary } from "@/contexts/LibraryContext";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useIsVisible } from "@/hooks/useIsVisible";
import { StatusIcon } from "@/components/shared/StatusIcon";
import type { IAlbum } from "@/types";
import { useItemTitle } from "@/contexts/ItemTitleContext";
import { PlayOnButton } from "@/components/shared/PlayOnButton";

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
  const tAccessibility = useTranslations('Accessibility');
  const { state } = useLibrary();
  const { setItemTitle, setMinimalMobileHeader } = useItemTitle();

  // Set title and minimal header in header when mounted
  useEffect(() => {
    setItemTitle("Albums");
    setMinimalMobileHeader(true);
    return () => {
      setItemTitle(null);
      setMinimalMobileHeader(false);
    };
  }, [setItemTitle, setMinimalMobileHeader]);

  if (!state.albums) return null;

  const albumsArray = Array.from(state.albums);
  const firstAlbumArtwork = albumsArray[0]?.artwork;
  const albumArtworks = albumsArray
    .slice(0, 4)
    .map(a => a.artwork)
    .filter((a): a is string => Boolean(a));
  const unmatchedCount = albumsArray.reduce((count, album) => {
    return album.status === "unmatched" ? count + 1 : count;
  }, 0);

  // Placeholder artwork if no albums exist
  const artwork =
    albumArtworks.length > 1 ? (
      <ArtworkImage multiSrc={albumArtworks} alt={tAccessibility('albumsArtwork')} size={192} type="album" />
    ) : firstAlbumArtwork ? (
      <ArtworkImage src={firstAlbumArtwork} alt={tAccessibility('firstAlbumArtwork')} size={192} type="album" />
    ) : (
      <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800" />
    );

  return (
    <div className="space-y-6">
      {/* Header: visually matches Playlist/LikedSongs header */}
      <div className="flex flex-col items-center lg:flex-row lg:gap-4">
        {/* Artwork */}
        <div className="w-48 overflow-hidden rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
          {artwork}
        </div>
        <div className="mt-6 min-w-0 flex-1 text-center lg:mt-0 lg:text-left">
          {/* Title and subtitle are wrapped for desktop-only left padding */}
          <div className="lg:pl-4">
            <h1 className="w-full max-w-full whitespace-normal break-words text-2xl font-bold text-indigo-900 lg:text-3xl dark:text-indigo-50">
              Albums
            </h1>
            <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
              {state.albums.size} albums
              {unmatchedCount > 0 && (
                <span className="ml-2 text-red-500 dark:text-red-400">
                  • {unmatchedCount} unmatched
                </span>
              )}
            </p>
          </div>
          {/* Play on [service] button for albums */}
          <div className="mt-4 lg:mt-6">
            <PlayOnButton type="albums" />
          </div>
        </div>
      </div>
      {/* Table header and album list */}
      <div className="relative bg-transparent dark:bg-transparent" role="albumlist">
        <div
          className="mb-4 grid grid-cols-[32px_1fr_32px] gap-2 border-b border-slate-200 bg-white/80 p-1.5 py-2 text-xs font-normal text-slate-500 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400"
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
          {albumsArray.map((album, index) => (
            <AlbumItem key={`${album.id}-${index}`} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
};
