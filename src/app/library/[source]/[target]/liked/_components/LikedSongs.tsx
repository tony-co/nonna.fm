"use client";

import { FC, useEffect } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { TrackList } from "@/components/library/TrackList";
import { useItemTitle } from "@/contexts/ItemTitleContext";
import { PlayOnButton } from "@/components/shared/PlayOnButton";
import { LikedSongsIcon } from "@/components/icons/LikedSongsIcon";

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

  // Placeholder artwork for Liked Songs (now uses LikedSongsIcon)
  const likedArtwork = (
    <div className="flex h-48 w-48 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300">
      <LikedSongsIcon className="h-20 w-20 text-white drop-shadow-lg dark:text-indigo-100" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header: visually matches Playlist header */}
      <div className="flex flex-col items-center lg:flex-row lg:gap-4">
        {/* Artwork placeholder */}
        <div className="w-48 overflow-hidden rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
          {likedArtwork}
        </div>
        <div className="mt-6 min-w-0 flex-1 text-center lg:mt-0 lg:text-left">
          {/* Title and subtitle are wrapped for desktop-only left padding */}
          <div className="lg:pl-4">
            <h1 className="w-full max-w-full whitespace-normal break-words text-2xl font-bold text-indigo-900 lg:text-3xl dark:text-indigo-50">
              Liked Songs
            </h1>
            <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
              {state.likedSongs.size} tracks
              {unmatchedCount > 0 && (
                <span className="ml-2 text-red-500 dark:text-red-400">
                  • {unmatchedCount} unmatched
                </span>
              )}
            </p>
          </div>
          {/* Play on [service] button for liked songs */}
          <div className="mt-4 lg:mt-6">
            <PlayOnButton type="liked" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Track List */}
        <TrackList tracks={Array.from(state.likedSongs)} selection={new Set()} />
      </div>
    </div>
  );
};
