"use client";
import { FC } from "react";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { TrackList } from "./TrackList";

export const LikedSongs: FC = () => {
  const { state } = useLibrary();
  const { getTrackStatus } = useMatching();

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
          {state.likedSongs.size} tracks • {unmatchedCount} unmatched
        </p>
      </div>

      {/* Track List */}
      <TrackList tracks={Array.from(state.likedSongs)} selection={new Set()} />
    </div>
  );
};
