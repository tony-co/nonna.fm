"use client";
import { FC, useEffect } from "react";
import { useLibrarySelection } from "@/contexts/LibraryContext";
import { TrackList } from "@/components/library/TrackList";
import { usePlaylistTracks } from "@/hooks/usePlaylistTracks";
import { PlayOnButton } from "@/components/shared/PlayOnButton";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useItemTitle } from "@/contexts/ItemTitleContext";

interface PlaylistProps {
  playlistId: string;
}

export const Playlist: FC<PlaylistProps> = ({ playlistId }) => {
  const { selectedItems } = useLibrarySelection();
  const { playlist, isLoading, error } = usePlaylistTracks(playlistId);
  const { setItemTitle, setMinimalMobileHeader } = useItemTitle();

  // Set playlist name, minimal header, and backHref in header when loaded
  useEffect(() => {
    if (playlist?.name) setItemTitle(playlist.name);
    setMinimalMobileHeader(true);
    return () => {
      setItemTitle(null);
      setMinimalMobileHeader(false);
    };
  }, [playlist?.name, setItemTitle, setMinimalMobileHeader]);

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

  // Count unmatched tracks by reading status directly from track object
  const unmatchedCount = playlist.tracks.reduce((count, track) => {
    return track.status === "unmatched" ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="flex flex-col items-center lg:flex-row lg:gap-8">
        <div className="w-48 overflow-hidden rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20">
          <ArtworkImage src={playlist.artwork} alt={playlist.name} size={192} type="playlist" />
        </div>
        <div className="mt-6 min-w-0 flex-1 text-center lg:mt-0 lg:text-left">
          {/* Allow playlist name to wrap and break long words instead of truncating */}
          <h1 className="w-full max-w-full whitespace-normal break-words text-2xl font-bold text-indigo-900 lg:text-3xl dark:text-indigo-50">
            {playlist.name}
          </h1>
          <p className="mt-2 text-sm text-indigo-700 dark:text-indigo-300">
            {playlist.tracks.length} tracks • {unmatchedCount} unmatched
          </p>
          <div className="mt-4 lg:mt-6">
            <PlayOnButton playlistId={playlist.id} />
          </div>
        </div>
      </div>

      {/* Track List */}
      <TrackList tracks={playlist.tracks} selection={selectedTracks} playlist={playlist} />
    </div>
  );
};
