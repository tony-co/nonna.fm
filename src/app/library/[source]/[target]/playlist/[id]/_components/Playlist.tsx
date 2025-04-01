"use client";
import { FC, useRef, useEffect } from "react";
import { useMatching } from "@/contexts/MatchingContext";
import { useLibrarySelection } from "@/contexts/LibraryContext";
import { TrackList } from "@/components/library/TrackList";
import { usePlaylistTracks } from "@/hooks/usePlaylistTracks";
import { PlayOnButton } from "@/components/shared/PlayOnButton";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useSearchTracks } from "@/hooks/useSearchTracks";
import { useParams } from "next/navigation";
import { MusicService } from "@/types/services";

interface PlaylistProps {
  playlistId: string;
}

export const Playlist: FC<PlaylistProps> = ({ playlistId }) => {
  const { selectedItems } = useLibrarySelection();
  const { getTrackStatus } = useMatching();
  const { playlist, isLoading, error } = usePlaylistTracks(playlistId);
  const { matchPlaylistTracks } = useSearchTracks();
  const params = useParams();
  const targetService = params.target as MusicService;
  const hasStartedMatching = useRef(false);

  // Trigger matching for all playlist tracks when playlist is available
  useEffect(() => {
    if (
      playlist && // Check playlist exists
      Array.isArray(playlist.tracks) &&
      playlist.tracks.length > 0 && // Ensure we have tracks
      !isLoading && // Ensure loading is complete
      !hasStartedMatching.current // Prevent duplicate matching
    ) {
      hasStartedMatching.current = true;
      matchPlaylistTracks(playlist, targetService);
    }
  }, [playlist, isLoading, matchPlaylistTracks, targetService]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (isLoading || !playlist) {
    return <LoadingSpinner />;
  }

  // Convert selected track IDs to track objects
  const selectedTracks = new Set(
    playlist.tracks.filter(track => selectedItems.tracks.has(track.id))
  );

  // Count unmatched tracks
  const unmatchedCount = playlist.tracks.reduce((count, track) => {
    return getTrackStatus(track.id) === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="flex items-center gap-6">
        <div className="h-32 w-32 overflow-hidden rounded-lg">
          <ArtworkImage src={playlist.artwork} alt={playlist.name} size={128} type="playlist" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-indigo-900 dark:text-indigo-50">
            {playlist.name}
          </h1>
          <p className="text-sm text-indigo-700 dark:text-indigo-300">
            {playlist.tracks.length} tracks • {unmatchedCount} unmatched
          </p>
          <div className="mt-4">
            <PlayOnButton playlistId={playlist.id} />
          </div>
        </div>
      </div>

      {/* Track List */}
      <TrackList tracks={playlist.tracks} selection={selectedTracks} />
    </div>
  );
};
