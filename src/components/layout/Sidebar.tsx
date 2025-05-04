"use client";

import { FC } from "react";
import { useLibrary, useLibrarySelection } from "@/contexts/LibraryContext";
import { useMatching } from "@/hooks/useMatching";
import { IndeterminateCheckbox } from "@/components/shared/IndeterminateCheckbox";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { CircularProgress } from "@/components/shared/CircularProgress";
import { useRouter, useParams } from "next/navigation";
import { MusicService } from "@/types/services";
import { IPlaylist } from "@/types/library";
import { fetchPlaylistTracks } from "@/lib/musicApi";
import React from "react";
import { fetchingPlaylists } from "@/components/shared/TransferButton";

// Main component
export const LibrarySidebar: FC = () => {
  const { state, actions } = useLibrary();
  const router = useRouter();
  const params = useParams();
  const source = params.source as MusicService;
  const target = params.target as MusicService;
  const { matchLikedSongs, matchAlbums, matchPlaylistTracks, cancelMatching } = useMatching();
  const {
    selectedItems,
    selectAllTracks,
    deselectAllTracks,
    selectAllAlbums,
    deselectAllAlbums,
    selectPlaylist,
    deselectPlaylist,
  } = useLibrarySelection();

  // Tracking map to handle async operations - this is no longer needed as a ref
  // since we're using the shared fetchingPlaylists Set
  const fetchingPlaylistsRef = React.useRef(new Set<string>());

  if (!state.likedSongs || !state.albums || !state.playlists) return null;

  // Calculate selection states
  const likedSongsCount = state.likedSongs.size;
  const selectedLikedSongsCount = selectedItems.tracks.size;

  // Count unmatched liked songs
  const unmatchedLikedSongsCount = Array.from(state.likedSongs).reduce((count, track) => {
    return track.status === "unmatched" ? count + 1 : count;
  }, 0);

  const albumsCount = state.albums.size;
  const selectedAlbumsCount = Array.from(state.albums).filter(album =>
    selectedItems.albums.has(album.id)
  ).length;

  // Count unmatched albums
  const unmatchedAlbumsCount = Array.from(state.albums).reduce((count, album) => {
    return album.status === "unmatched" ? count + 1 : count;
  }, 0);

  // Handle selection toggles with matching
  const handleLikedSongsToggle = () => {
    if (selectedLikedSongsCount === likedSongsCount) {
      deselectAllTracks();
      cancelMatching("likedSongs");
    } else {
      selectAllTracks();
      matchLikedSongs(Array.from(state.likedSongs ?? []), target);
    }
  };

  const handleAlbumsToggle = () => {
    if (selectedAlbumsCount === albumsCount) {
      deselectAllAlbums();
      cancelMatching("albums");
    } else {
      selectAllAlbums();
      matchAlbums(Array.from(state.albums ?? []), target);
    }
  };

  // complex but this allows us to have a very responsive UI
  // and cancel matching quickly if the playlist is deselected
  const handlePlaylistToggle = async (playlist: IPlaylist) => {
    const playlistId = playlist.id;

    if (selectedItems.playlists.has(playlistId)) {
      // If deselecting, remove from selection and cancel matching
      deselectPlaylist(playlistId);
      cancelMatching("playlist", playlistId);

      // Mark as no longer being processed
      fetchingPlaylistsRef.current.delete(playlistId);
      fetchingPlaylists.delete(playlistId);
    } else {
      // Optimistically update UI by selecting the playlist immediately
      selectPlaylist(playlistId);

      // Add to our tracking set
      fetchingPlaylistsRef.current.add(playlistId);
      fetchingPlaylists.add(playlistId);

      // Only fetch tracks if they don't exist
      // TODO: Keep an eye on this as we could have playlists not fully fetched
      if (!playlist.tracks || playlist.tracks.length === 0) {
        try {
          // Fetch tracks in the background
          const tracks = await fetchPlaylistTracks(playlistId);

          // After fetch completes, check if playlist is still being processed
          if (tracks && fetchingPlaylistsRef.current.has(playlistId)) {
            // Update the playlist in the library context
            const updatedPlaylist = { ...playlist, tracks };
            // Use updatePlaylist to only update the relevant playlist in the Map
            // This avoids accidentally overwriting the entire playlists Map
            actions.updatePlaylist(updatedPlaylist);

            // Check if it's still selected in the UI before matching
            if (fetchingPlaylistsRef.current.has(playlistId)) {
              matchPlaylistTracks(updatedPlaylist, target);
            }

            // Remove from tracking set
            fetchingPlaylistsRef.current.delete(playlistId);
            fetchingPlaylists.delete(playlistId);
          }
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
          // Clean up tracking on error
          fetchingPlaylistsRef.current.delete(playlistId);
          fetchingPlaylists.delete(playlistId);
        }
      } else {
        // Always retrieve the latest playlist object from state before matching
        // This ensures we use the freshest tracks array and avoid stale data
        const latestPlaylist = state.playlists?.get(playlistId) || playlist;
        matchPlaylistTracks(latestPlaylist, target);
        // Remove from tracking set
        fetchingPlaylistsRef.current.delete(playlistId);
        fetchingPlaylists.delete(playlistId);
      }
    }
  };

  // Navigation handlers
  const handleLikedSongsClick = () => {
    router.push(`/library/${source}/${target}/liked`);
  };

  const handleAlbumsClick = () => {
    router.push(`/library/${source}/${target}/albums`);
  };

  const handlePlaylistClick = (playlistId: string) => {
    router.push(`/library/${source}/${target}/playlist/${playlistId}`);
  };

  // Use global matching state from context
  const isMatching = state.matching.isLoading;
  const currentTask = state.matching.currentTask;
  const getProgress = (type: "likedSongs" | "albums" | "playlist", id?: string) => {
    const key = type === "playlist" && id ? `playlist:${id}` : type;
    return state.matching.progress[key] ?? 0;
  };

  return (
    <div className="min-w-0 p-4">
      <div className="mb-4 mt-2">
        <h1 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Your library</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Select items to transfer</p>
      </div>

      {/* Liked Songs Section */}
      <div
        // Add margin-bottom to separate from next item, and reduce vertical padding
        className={`group mb-1 flex cursor-pointer items-center gap-4 rounded-lg px-2.5 py-2 transition-all duration-200
            ${
              selectedLikedSongsCount === likedSongsCount && likedSongsCount > 0
                ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60"
                : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            }`}
        onClick={handleLikedSongsClick}
        role="button"
        aria-label="View Liked Songs"
        data-testid="liked-songs-section"
      >
        <div onClick={e => e.stopPropagation()} className="pl-2 lg:pl-0">
          <IndeterminateCheckbox
            selectedCount={selectedLikedSongsCount}
            totalCount={likedSongsCount}
            onChange={handleLikedSongsToggle}
            className=""
            label="Liked Songs"
            testId="liked-songs-checkbox"
          />
        </div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300">
          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {/* Show progress if matching liked songs */}
          {currentTask && currentTask.type === "likedSongs" && isMatching && (
            <CircularProgress
              progress={getProgress("likedSongs")}
              data-testid="liked-songs-progress"
            />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${
              currentTask && currentTask.type === "likedSongs" && isMatching ? "animate-pulse" : ""
            }`}
          >
            Liked Songs
          </p>
          <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
            {likedSongsCount} songs
            {/* Show unmatched count if any */}
            {unmatchedLikedSongsCount > 0 && (
              <span className="ml-1 text-red-500 dark:text-red-400">
                • {unmatchedLikedSongsCount} unmatched
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Albums Section */}
      <div
        // Add margin-bottom to separate from next item, and reduce vertical padding
        className={`group mb-1 flex cursor-pointer items-center gap-4 rounded-lg px-2.5 py-2 transition-all duration-200
            ${
              selectedAlbumsCount === albumsCount && albumsCount > 0
                ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60"
                : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            }`}
        onClick={handleAlbumsClick}
        role="button"
        aria-label="View Albums"
        data-testid="albums-section"
      >
        <div onClick={e => e.stopPropagation()} className="pl-2 lg:pl-0">
          <IndeterminateCheckbox
            selectedCount={selectedAlbumsCount}
            totalCount={albumsCount}
            onChange={handleAlbumsToggle}
            className=""
            label="Albums"
            testId="albums-checkbox"
          />
        </div>
        <div className="relative overflow-hidden rounded-lg">
          <ArtworkImage
            src={Array.from(state.albums ?? [])[0]?.artwork}
            alt="First Album"
            type="album"
            className="rounded-lg"
          />
          {/* Show progress if matching albums */}
          {currentTask && currentTask.type === "albums" && isMatching && (
            <CircularProgress progress={getProgress("albums")} data-testid="albums-progress" />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-200 ${
              currentTask && currentTask.type === "albums" && isMatching ? "animate-pulse" : ""
            }`}
          >
            Albums
          </p>
          <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
            {albumsCount} albums
            {/* Show unmatched count if any */}
            {unmatchedAlbumsCount > 0 && (
              <span className="ml-1 text-red-500 dark:text-red-400">
                • {unmatchedAlbumsCount} unmatched
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Playlists Section */}
      {Array.from(state.playlists?.values() ?? []).map((playlist, idx, arr) => (
        <div
          key={playlist.id}
          // Add margin-bottom to separate from next item, except last; reduce vertical padding
          className={`group flex cursor-pointer items-center gap-4 rounded-lg ${idx !== arr.length - 1 ? "mb-1" : ""} px-2.5 py-2 transition-all duration-200
                ${
                  selectedItems.playlists.has(playlist.id)
                    ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60"
                    : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
                }`}
          onClick={() => handlePlaylistClick(playlist.id)}
          data-testid={`playlist-item-${playlist.id}`}
        >
          <div onClick={e => e.stopPropagation()} className="pl-2 lg:pl-0">
            <IndeterminateCheckbox
              selectedCount={selectedItems.playlists.has(playlist.id) ? 1 : 0}
              totalCount={1}
              onChange={() => handlePlaylistToggle(playlist)}
              label={playlist.name}
              testId={`playlist-checkbox-${playlist.id}`}
            />
          </div>
          <div className="relative overflow-hidden rounded-lg">
            <ArtworkImage
              src={playlist.artwork}
              alt={playlist.name}
              type="playlist"
              className={`rounded-lg ${fetchingPlaylists.has(playlist.id) ? "animate-pulse" : ""}`}
            />
            {/* Show progress if matching this playlist */}
            {currentTask &&
              currentTask.type === "playlist" &&
              currentTask.playlist.id === playlist.id &&
              isMatching && (
                <CircularProgress
                  progress={getProgress("playlist", playlist.id)}
                  data-testid={`playlist-progress-${playlist.id}`}
                />
              )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${
                (currentTask &&
                  currentTask.type === "playlist" &&
                  currentTask.playlist.id === playlist.id &&
                  isMatching) ||
                fetchingPlaylists.has(playlist.id)
                  ? "animate-pulse"
                  : ""
              }`}
              data-testid={`playlist-name-${playlist.id}`}
              title={playlist.name}
            >
              {playlist.name}
            </p>
            <p
              className="truncate text-sm text-zinc-600 dark:text-zinc-400"
              data-testid={`playlist-track-count-${playlist.id}`}
            >
              {playlist.tracks?.length || playlist.trackCount} tracks
              {/* Show unmatched count if any */}
              {playlist.tracks &&
                playlist.tracks.length > 0 &&
                (() => {
                  // Count unmatched tracks for this playlist
                  const unmatchedCount = playlist.tracks.reduce(
                    (count, track) => (track.status === "unmatched" ? count + 1 : count),
                    0
                  );
                  return unmatchedCount > 0 ? (
                    <span className="ml-1 text-red-500 dark:text-red-400">
                      • {unmatchedCount} unmatched
                    </span>
                  ) : null;
                })()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
