"use client";

import { FC, useRef } from "react";
import { useIsVisible } from "@/hooks/useIsVisible";
import type { ITrack, IPlaylist } from "@/types/library";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { StatusIcon } from "@/components/shared/StatusIcon";

interface TrackListProps {
  tracks: Array<ITrack>;
  selection?: Set<ITrack>;
  playlist?: IPlaylist;
}

const TrackRow: FC<{
  track: ITrack;
  index: number;
  isSelected: boolean;
  playlist?: IPlaylist;
}> = ({ track, index, isSelected, playlist }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref as React.RefObject<HTMLElement>);
  // Status is now read directly from the track object (single source of truth)
  const status = track.status;

  return (
    <div
      ref={ref}
      className={`group grid grid-cols-[32px_1fr_32px] items-center gap-2 rounded-md p-1.5 transition-colors duration-200 md:grid-cols-[32px_32px_1fr_231px_32px] md:gap-4 md:p-2 ${
        isSelected
          ? "bg-indigo-50 dark:bg-indigo-950/30"
          : "bg-transparent hover:bg-indigo-50/70 dark:bg-transparent dark:hover:bg-indigo-950/20"
      }`}
      role="track"
    >
      {/* Index number */}
      <div className="hidden text-sm font-normal text-slate-500 md:block dark:text-slate-400">
        {index + 1}
      </div>

      {/* Artwork */}
      <div className="flex-shrink-0 rounded">
        {isVisible ? (
          <ArtworkImage src={track.artwork} alt={`${track.name} artwork`} type="album" />
        ) : (
          <div className="h-full w-full rounded bg-slate-100 dark:bg-slate-800" />
        )}
      </div>

      {/* Track info */}
      <div className="min-w-0">
        <div
          className={`ml-4 truncate font-medium ${
            status === "unmatched"
              ? "text-red-500 dark:text-red-400"
              : status === "matched"
                ? "text-gray-800 dark:text-indigo-50"
                : "text-slate-900 dark:text-slate-100"
          }`}
        >
          {track.name}
        </div>
        <div className="ml-4 truncate text-sm text-slate-500 dark:text-slate-400">
          {track.artist}
        </div>
      </div>

      {/* Album */}
      <div className="hidden truncate text-sm text-slate-500 md:flex md:text-slate-400">
        {track.album}
      </div>

      {/* Status */}
      <div>
        <StatusIcon track={track} playlist={playlist} />
      </div>
    </div>
  );
};

export const TrackList: FC<TrackListProps> = ({ tracks, selection = new Set(), playlist }) => {
  return (
    <div className="relative bg-transparent dark:bg-transparent" role="tracklist">
      {/* Header */}
      <div
        className="mb-4 grid grid-cols-[32px_1fr_32px] gap-2 border-b border-slate-200 bg-white/80 p-1.5 py-2 text-xs font-normal text-slate-500 backdrop-blur-sm md:grid-cols-[32px_32px_1fr_231px_32px] md:gap-4 md:p-2 md:text-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400"
        role="row"
      >
        <div className="hidden items-center md:flex" role="columnheader">
          #
        </div>
        <div className="flex items-center" role="columnheader">
          Title
        </div>
        <div className="flex items-center" role="columnheader"></div>
        <div className="hidden items-center md:flex" role="columnheader">
          Album
        </div>
        <div className="flex items-center justify-end" role="columnheader">
          Status
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const isSelected = Array.from(selection).some(
            selectedTrack => selectedTrack.id === track.id
          );

          return (
            <TrackRow
              key={`${track.id}-${index}`}
              track={track}
              index={index}
              isSelected={isSelected}
              playlist={playlist}
            />
          );
        })}
      </div>
    </div>
  );
};
