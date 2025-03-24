import { FC, useLayoutEffect } from "react";
import Image from "next/image";
import { IPlaylist } from "@/types/library";
import { TrackList } from "./TrackList";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";

interface PlaylistProps {
  playlist: IPlaylist;
  mode: "select" | "matching" | "review" | "transfer" | "completed";
}

export const Playlist: FC<PlaylistProps> = ({ playlist, mode }) => {
  const { selection, isSelectionDisabled, togglePlaylistTrack } = useSelection();
  const { getTrackStatus } = useMatching();

  // Scroll to top when playlist and tracks are loaded
  useLayoutEffect(() => {
    // Only proceed if we have tracks
    if (!playlist.tracks?.length) return;

    // Use RAF to ensure DOM is ready
    requestAnimationFrame(() => {
      // Only scroll the main content area
      const mainContent = document.querySelector(".main-content");
      console.log("scrooo", mainContent);
      if (mainContent) {
        try {
          // First scroll into view
          mainContent.scrollIntoView({ block: "start", behavior: "instant" });

          // Then adjust for header height (64px)
          window.scrollBy(0, -64);

          console.log("scrooo Scrolled to top with header offset");
        } catch (e) {
          console.error("Scroll failed:", e);
        }
      }
    });
  }, [playlist.id, playlist.tracks?.length]); // Reset when playlist or tracks change

  // Create a Set of selected tracks for this playlist
  const selectedTracks = selection.playlists.get(playlist.id) || new Set();

  // Count unmatched tracks using the MatchingContext
  const unmatchedCount = playlist.tracks.reduce((count, track) => {
    return getTrackStatus(track.id) === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="flex items-start gap-6">
          {playlist.artwork ? (
            <Image
              src={playlist.artwork}
              alt={`${playlist.name} artwork`}
              width={128}
              height={128}
              className="rounded-md object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-md bg-gray-700 shadow-lg">
              <svg
                className="h-12 w-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <h1 className="mb-5 text-4xl font-bold">{playlist.name}</h1>
            <p className="mb-4 text-gray-400">Created by {playlist.ownerName}</p>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
              </div>
              {mode !== "select" && unmatchedCount > 0 && (
                <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-500">
                  {unmatchedCount} unmatched
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <TrackList
        tracks={playlist.tracks}
        mode={mode === "select" ? "select" : "transfer"}
        selection={selectedTracks}
        onToggleTrack={track => togglePlaylistTrack(playlist, track)}
        isSelectionDisabled={isSelectionDisabled}
      />
    </div>
  );
};
