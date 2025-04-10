"use client";

import { FC, useEffect, useRef } from "react";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { useParams } from "next/navigation";
import { TrackList } from "@/components/library/TrackList";
import type { MusicService } from "@/types/services";

export const LikedSongs: FC = () => {
  const { state } = useLibrary();
  const { getTrackStatus, matchLikedSongs } = useMatching();
  const params = useParams();
  const target = params.target as MusicService;
  const hasStartedMatching = useRef(false);

  // Trigger matching for all liked songs when component mounts
  useEffect(() => {
    if (state.likedSongs && !hasStartedMatching.current) {
      hasStartedMatching.current = true;
      matchLikedSongs(Array.from(state.likedSongs), target);
    }
  }, [state.likedSongs, matchLikedSongs, target]);

  if (!state.likedSongs) return null;

  // Count unmatched tracks
  const unmatchedCount = Array.from(state.likedSongs).reduce((count, track) => {
    return getTrackStatus(track.id) === "unmatched" ? count + 1 : count;
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
