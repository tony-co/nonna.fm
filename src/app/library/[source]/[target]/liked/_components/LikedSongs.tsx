"use client";

import { FC, useEffect } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { TrackList } from "@/components/library/TrackList";
import { useItemTitle } from "@/contexts/ItemTitleContext";

export const LikedSongs: FC = () => {
  const { state } = useLibrary();
  const { setItemTitle, setMinimalMobileHeader } = useItemTitle();

  // Set title and minimal header in header when mounted
  useEffect(() => {
    setItemTitle("Liked Songs");
    setMinimalMobileHeader(true);
    return () => {
      setItemTitle(null);
      setMinimalMobileHeader(false);
    };
  }, [setItemTitle, setMinimalMobileHeader]);

  if (!state.likedSongs) return null;

  // Count unmatched tracks by reading status directly from track object
  const unmatchedCount = Array.from(state.likedSongs).reduce((count, track) => {
    return track.status === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-50">Liked Songs</h1>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          {state.likedSongs.size} tracks
        </p>
      </div>

      {/* Content */}
      <div>
        {/* Unmatched count info */}
        {unmatchedCount > 0 && (
          <p className="mb-4 text-sm text-red-500 dark:text-red-400">
            {unmatchedCount} tracks unmatched
          </p>
        )}

        {/* Track List */}
        <TrackList tracks={Array.from(state.likedSongs)} selection={new Set()} />
      </div>
    </div>
  );
};
