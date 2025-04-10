"use client";

import { FC, useRef } from "react";
import { useMatching } from "@/contexts/MatchingContext";
import type { ITrack } from "@/types/library";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useIsVisible } from "@/hooks/useIsVisible";

// Status icons component for better organization
const StatusIcon: FC<{ status: string | undefined }> = ({ status }) => {
  switch (status) {
    case "matched":
      return (
        <div className="flex justify-end" title="Matched">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
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
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-500 dark:bg-indigo-400" />
        </div>
      );
    default:
      return null;
  }
};

interface TrackListProps {
  tracks: Array<ITrack>;
  selection?: Set<ITrack>;
}

const TrackRow: FC<{
  track: ITrack;
  index: number;
  isSelected: boolean;
  status?: string;
}> = ({ track, index, isSelected, status }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref as React.RefObject<HTMLElement>);

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
      <div className="h-10 w-10 flex-shrink-0 rounded">
        {isVisible ? (
          <ArtworkImage src={track.artwork} alt={`${track.name} artwork`} size={40} type="album" />
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
        <StatusIcon status={status} />
      </div>
    </div>
  );
};

export const TrackList: FC<TrackListProps> = ({ tracks, selection = new Set() }) => {
  const { getTrackStatus } = useMatching();

  return (
    <div className="relative bg-transparent dark:bg-transparent" role="tracklist">
      {/* Header */}
      <div
        className="sticky top-0 mb-4 grid grid-cols-[32px_1fr_32px] gap-2 border-b border-slate-200 bg-white/80 p-1.5 py-2 text-xs font-normal text-slate-500 backdrop-blur-sm md:grid-cols-[32px_32px_1fr_231px_32px] md:gap-4 md:p-2 md:text-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400"
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
          const status = getTrackStatus(track.id);
          const isSelected = Array.from(selection).some(
            selectedTrack => selectedTrack.id === track.id
          );

          return (
            <TrackRow
              key={track.id + index}
              track={track}
              index={index}
              isSelected={isSelected}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
};
