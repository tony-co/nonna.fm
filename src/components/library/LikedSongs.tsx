import { FC } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { TrackList } from "./TrackList";

interface LikedSongsProps {
  mode: "select" | "matching" | "review" | "transfer" | "completed";
}

export const LikedSongs: FC<LikedSongsProps> = ({ mode }) => {
  const { libraryState } = useLibrary();
  const { selection, isSelectionDisabled, toggleLikedSong } = useSelection();
  const { matchingState } = useMatching();

  if (!libraryState) return null;

  const matchedCount = libraryState.likedSongs.reduce((count, track) => {
    return matchingState.tracks.get(track.id)?.status === "matched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Liked Songs</h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {matchedCount} / {libraryState.likedSongs.length} matched
        </span>
      </div>
      <TrackList
        tracks={libraryState.likedSongs}
        mode={mode === "select" ? "select" : "transfer"}
        selection={selection.likedSongs}
        onToggleTrack={toggleLikedSong}
        isSelectionDisabled={isSelectionDisabled}
      />
    </div>
  );
};
