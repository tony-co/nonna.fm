import { FC, useEffect, useState, useRef } from "react";
import { ITrack } from "@/types/library";
import { useMatching } from "@/contexts/MatchingContext";
import Image from "next/image";

// Intersection Observer hook for lazy loading
const useIsVisible = (ref: React.RefObject<HTMLElement>): boolean => {
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
  tracks: ITrack[];
  mode?: "select" | "transfer";
  selection?: Set<ITrack>;
  onToggleTrack?: (track: ITrack) => void;
  isSelectionDisabled?: boolean;
}

const TrackItem: FC<{
  track: ITrack;
  index: number;
  isSelected: boolean;
  onToggleTrack?: (track: ITrack) => void;
  isSelectionDisabled?: boolean;
  mode?: "select" | "transfer";
  status?: string;
}> = ({ track, index, isSelected, onToggleTrack, isSelectionDisabled, mode, status }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref as React.RefObject<HTMLElement>);

  return (
    <div
      className={`group grid grid-cols-[32px_32px_1fr_231px_32px] items-center gap-4 rounded-md p-2 transition-colors duration-200 ${
        isSelected
          ? "bg-indigo-50 dark:bg-indigo-950/30"
          : "bg-transparent hover:bg-indigo-50/70 dark:bg-transparent dark:hover:bg-indigo-950/20"
      }`}
    >
      <div>
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded-sm transition-colors duration-200"
          style={{ accentColor: "#6366f1" }}
          checked={isSelected}
          onChange={() => onToggleTrack?.(track)}
          disabled={isSelectionDisabled}
        />
      </div>

      <div className="text-sm font-normal text-slate-500 dark:text-slate-400">{index + 1}</div>

      <div className="flex min-w-0 items-center gap-4">
        {/* Artwork with intersection observer */}
        <div
          ref={ref}
          className="h-10 w-10 flex-shrink-0 rounded bg-indigo-50 shadow dark:bg-indigo-950/30"
        >
          {track.artwork ? (
            isVisible ? (
              <Image
                src={track.artwork}
                alt={`${track.name} artwork`}
                className="h-full w-full rounded object-cover"
                width={40}
                height={40}
                priority={false}
              />
            ) : (
              <div className="h-full w-full rounded bg-slate-100 dark:bg-slate-800" />
            )
          ) : (
            <div className="h-full w-full rounded bg-slate-200 dark:bg-slate-700" />
          )}
        </div>

        {/* Track info */}
        <div className="min-w-0 flex-1">
          <div
            className={`truncate font-medium ${
              mode === "transfer" && status === "unmatched"
                ? "text-red-500 dark:text-red-400"
                : mode === "transfer" && status === "matched"
                  ? "text-gray-800 dark:text-indigo-50"
                  : "text-slate-900 dark:text-slate-100"
            }`}
          >
            {track.name}
          </div>
          <div className="truncate text-sm text-slate-500 dark:text-slate-400">{track.artist}</div>
        </div>
      </div>

      {/* Album */}
      <div className="hidden truncate text-sm text-slate-500 md:block dark:text-slate-400">
        {track.album}
      </div>

      <div>
        <StatusIcon status={status} />
      </div>
    </div>
  );
};

export const TrackList: FC<TrackListProps> = ({
  tracks,
  mode = "select",
  selection = new Set(),
  onToggleTrack,
  isSelectionDisabled,
}) => {
  const { getTrackStatus } = useMatching();

  // Helper function to check if a track is selected by ID
  const isTrackSelected = (track: ITrack): boolean => {
    return Array.from(selection).some(selectedTrack => selectedTrack.id === track.id);
  };

  // Calculate if all tracks are selected
  const allTracksSelected = tracks.length > 0 && tracks.every(track => isTrackSelected(track));
  const someTracksSelected = tracks.some(track => isTrackSelected(track));

  // Handle select all toggle
  const handleSelectAll = (): void => {
    if (!onToggleTrack) return;

    // If all tracks are selected, deselect all
    // If some or no tracks are selected, select all remaining unselected tracks
    if (allTracksSelected) {
      // Deselect all tracks
      tracks.forEach(track => {
        if (isTrackSelected(track)) {
          onToggleTrack(track);
        }
      });
    } else {
      // Select all unselected tracks
      tracks.forEach(track => {
        if (!isTrackSelected(track)) {
          onToggleTrack(track);
        }
      });
    }
  };

  return (
    <div className="relative bg-transparent dark:bg-transparent">
      {/* Header */}
      <div className="sticky top-0 mb-4 grid grid-cols-[32px_32px_1fr_231px_32px] gap-4 border-b border-slate-200 bg-white/80 p-2 py-2 text-sm font-normal text-slate-500 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-400">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded-sm transition-colors duration-200"
            style={{ accentColor: "#6366f1" }}
            checked={allTracksSelected}
            ref={checkbox => {
              if (checkbox) {
                checkbox.indeterminate = someTracksSelected && !allTracksSelected;
              }
            }}
            onChange={handleSelectAll}
            disabled={isSelectionDisabled}
            aria-label="Select all tracks"
          />
        </div>
        <div className="flex items-center">#</div>
        <div className="flex items-center">Title</div>
        <div className="flex items-center">Album</div>
        <div className="flex items-center justify-end">Status</div>
      </div>

      {/* Tracks */}
      <div className="space-y-2">
        {tracks.map((track, index) => {
          const status = getTrackStatus(track.id);
          const isSelected = isTrackSelected(track);

          return (
            <TrackItem
              key={track.id + index}
              track={track}
              index={index}
              isSelected={isSelected}
              onToggleTrack={onToggleTrack}
              isSelectionDisabled={isSelectionDisabled}
              mode={mode}
              status={status}
            />
          );
        })}
      </div>
    </div>
  );
};
