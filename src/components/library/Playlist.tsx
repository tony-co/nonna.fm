import { FC, useLayoutEffect } from "react";
import { IPlaylist } from "@/types/library";
import { TrackList } from "./TrackList";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { PlayOnButton } from "@/components/shared/PlayOnButton";
import { ArtworkImage } from "@/components/shared/ArtworkImage";

interface PlaylistProps {
  playlist: IPlaylist;
  mode: "select" | "matching" | "review" | "transfer" | "completed";
}

export const Playlist: FC<PlaylistProps> = ({ playlist, mode }) => {
  const { selection, isSelectionDisabled, togglePlaylistTrack } = useSelection();
  const { getTrackStatus } = useMatching();
  const { libraryState } = useLibrary();

  // Scroll to top when playlist and tracks are loaded
  useLayoutEffect(() => {
    // Only proceed if we have tracks
    if (!playlist.tracks?.length) return;

    // Use RAF to ensure DOM is ready
    requestAnimationFrame(() => {
      // Only scroll the main content area
      const mainContent = document.querySelector(".main-content");
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

  if (!libraryState) return null;

  // Create a Set of selected tracks for this playlist
  const selectedTracks = selection.playlists.get(playlist.id) || new Set();

  // Count unmatched tracks using the MatchingContext
  const unmatchedCount = playlist.tracks.reduce((count, track) => {
    return getTrackStatus(track.id) === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="p-4 md:p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <ArtworkImage
            src={playlist.artwork}
            alt={`${playlist.name} artwork`}
            size={162}
            type="playlist"
            className="h-[120px] w-[120px] shadow-lg md:h-[162px] md:w-[162px]"
          />
          <div className="flex flex-1 flex-col items-center py-2 text-center md:h-[162px] md:items-start md:justify-between md:text-left">
            <h1
              className={`font-bold ${
                playlist.name.length > 30 ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"
              }`}
            >
              {playlist.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-gray-400 md:justify-start">
              {playlist.ownerName && (
                <>
                  <span>{playlist.ownerName}</span>
                  <span>•</span>
                </>
              )}
              <span>
                {playlist.tracks.length} {playlist.tracks.length === 1 ? "track" : "tracks"}
              </span>
              {mode !== "select" && unmatchedCount > 0 && (
                <>
                  <span>•</span>
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm text-red-500">
                    {unmatchedCount} unmatched
                  </span>
                </>
              )}
            </div>
            <PlayOnButton playlistId={playlist.id} />
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
