"use client";

import { FC } from "react";
import { useLibrary, useLibrarySelection } from "@/contexts/LibraryContext";
import { IndeterminateCheckbox } from "@/components/shared/IndeterminateCheckbox";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useRouter, useParams } from "next/navigation";
import { MusicService } from "@/types/services";
import { useMatching } from "@/contexts/MatchingContext";
import { IPlaylist } from "@/types/library";
import { fetchPlaylistTracks } from "@/lib/musicApi";
import { CircularProgress } from "@/components/shared/CircularProgress";
import React from "react";
import { fetchingPlaylists } from "@/components/shared/TransferButton";

// Main component
export const LibrarySidebar: FC = () => {
  const { state, actions } = useLibrary();
  const router = useRouter();
  const params = useParams();
  const source = params.source as MusicService;
  const target = params.target as MusicService;
  const { matchLikedSongs, matchAlbums, matchPlaylistTracks, cancelMatching, getMatchingStatus } =
    useMatching();
  const {
    selectedItems,
    selectAllTracks,
    deselectAllTracks,
    selectAllAlbums,
    deselectAllAlbums,
    selectAllPlaylists,
    deselectAllPlaylists,
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

  const albumsCount = state.albums.size;
  const selectedAlbumsCount = Array.from(state.albums).filter(album =>
    selectedItems.albums.has(album.id)
  ).length;

  const playlistsCount = state.playlists.size;
  const selectedPlaylistsCount = Array.from(state.playlists.values()).filter(playlist =>
    selectedItems.playlists.has(playlist.id)
  ).length;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePlaylistsToggle = () => {
    if (selectedPlaylistsCount === playlistsCount) {
      deselectAllPlaylists();
      // Cancel all playlists that are currently matching
      Array.from(state.playlists?.values() ?? []).forEach(playlist => {
        cancelMatching("playlist", playlist.id);
      });
    } else {
      selectAllPlaylists();
      // Match all playlists when selected
      Array.from(state.playlists?.values() ?? []).forEach(playlist => {
        matchPlaylistTracks(playlist, target);
      });
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
          const tracks = await fetchPlaylistTracks(playlistId, source);

          // After fetch completes, check if playlist is still being processed
          if (tracks && fetchingPlaylistsRef.current.has(playlistId)) {
            // Update the playlist in the library context
            const updatedPlaylist = { ...playlist, tracks };
            const updatedPlaylists = new Map(state.playlists);
            updatedPlaylists.set(playlistId, updatedPlaylist);
            actions.setPlaylists(updatedPlaylists);

            // Check if it's still selected in the UI before matching
            if (fetchingPlaylistsRef.current.has(playlistId)) {
              // Now start matching with the updated playlist
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
        // Use existing tracks if available
        matchPlaylistTracks(playlist, target);
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

  return (
    <div className="h-full">
      <div className="flex flex-col p-4">
        <div className="mb-4 mt-2">
          <h1 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Your library</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Select items to transfer</p>
        </div>

        {/* Liked Songs Section */}
        <div>
          <div
            className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            onClick={handleLikedSongsClick}
            role="button"
            aria-label="View Liked Songs"
            data-testid="liked-songs-section"
          >
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedLikedSongsCount}
                totalCount={likedSongsCount}
                onChange={handleLikedSongsToggle}
                className="flex-shrink-0"
                label="Liked Songs"
                testId="liked-songs-checkbox"
              />
            </div>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {getMatchingStatus("likedSongs").isMatching && (
                <CircularProgress
                  progress={getMatchingStatus("likedSongs").progress}
                  data-testid="liked-songs-progress"
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${
                  getMatchingStatus("likedSongs").isMatching ? "animate-pulse" : ""
                }`}
              >
                Liked Songs
              </p>
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {likedSongsCount} songs
              </p>
            </div>
          </div>
        </div>

        {/* Albums Section */}
        <div>
          <div
            className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            onClick={handleAlbumsClick}
            role="button"
            aria-label="View Albums"
            data-testid="albums-section"
          >
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedAlbumsCount}
                totalCount={albumsCount}
                onChange={handleAlbumsToggle}
                className="flex-shrink-0"
                label="Albums"
                testId="albums-checkbox"
              />
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <ArtworkImage
                src={Array.from(state.albums ?? [])[0]?.artwork}
                alt="First Album"
                size={40}
                type="album"
                className="rounded-lg"
              />
              {getMatchingStatus("albums").isMatching && (
                <CircularProgress
                  progress={getMatchingStatus("albums").progress}
                  data-testid="albums-progress"
                />
              )}
            </div>
            <div className="min-w-0">
              <p
                className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-200 ${
                  getMatchingStatus("albums").isMatching ? "animate-pulse" : ""
                }`}
              >
                Albums
              </p>
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {albumsCount} albums
              </p>
            </div>
          </div>
        </div>

        {/* Playlists Section */}
        <div>
          <div className="">
            {Array.from(state.playlists?.values() ?? []).map(playlist => (
              <div
                key={playlist.id}
                className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
                onClick={() => handlePlaylistClick(playlist.id)}
                data-testid={`playlist-item-${playlist.id}`}
              >
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-indigo-600 transition-colors duration-200 dark:accent-indigo-500"
                    checked={selectedItems.playlists.has(playlist.id)}
                    onChange={() => handlePlaylistToggle(playlist)}
                    data-testid={`playlist-checkbox-${playlist.id}`}
                  />
                </div>
                <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                  <ArtworkImage
                    src={playlist.artwork}
                    alt={playlist.name}
                    size={40}
                    type="playlist"
                    className={`rounded-lg ${fetchingPlaylists.has(playlist.id) ? "animate-pulse" : ""}`}
                  />
                  {getMatchingStatus("playlist", playlist.id).isMatching && (
                    <CircularProgress
                      progress={getMatchingStatus("playlist", playlist.id).progress}
                      data-testid={`playlist-progress-${playlist.id}`}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${
                      getMatchingStatus("playlist", playlist.id).isMatching ||
                      fetchingPlaylists.has(playlist.id)
                        ? "animate-pulse"
                        : ""
                    }`}
                    data-testid={`playlist-name-${playlist.id}`}
                  >
                    {playlist.name}
                  </p>
                  <p
                    className="truncate text-sm text-zinc-600 dark:text-zinc-400"
                    data-testid={`playlist-track-count-${playlist.id}`}
                  >
                    {playlist.trackCount} tracks
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
