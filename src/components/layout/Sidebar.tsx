"use client";

import { FC } from "react";
import { useLibrary, useLibrarySelection } from "@/contexts/LibraryContext";
import { IndeterminateCheckbox } from "@/components/shared/IndeterminateCheckbox";
import { ArtworkImage } from "@/components/shared/ArtworkImage";
import { useRouter, useParams } from "next/navigation";
import { MusicService } from "@/types/services";
import { useSearchTracks } from "@/hooks/useSearchTracks";
import { IPlaylist } from "@/types/library";
import { fetchPlaylistTracks } from "@/lib/musicApi";

// Main component
export const LibrarySidebar: FC = () => {
  const { state } = useLibrary();
  const router = useRouter();
  const params = useParams();
  const source = params.source as MusicService;
  const target = params.target as MusicService;
  const { matchLikedSongs, matchAlbums, matchPlaylistTracks } = useSearchTracks();
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

  if (!state.likedSongs || !state.albums || !state.playlists) return null;

  // Calculate selection states
  const likedSongsCount = state.likedSongs.size;
  const selectedLikedSongsCount = selectedItems.tracks.size > 0 ? likedSongsCount : 0;

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
    } else {
      selectAllTracks();
      // Match all liked songs when selected
      matchLikedSongs(Array.from(state.likedSongs), target);
    }
  };

  const handleAlbumsToggle = () => {
    if (selectedAlbumsCount === albumsCount) {
      deselectAllAlbums();
    } else {
      selectAllAlbums();
      // Match all albums when selected
      matchAlbums(Array.from(state.albums), target);
    }
  };

  const handlePlaylistsToggle = () => {
    if (selectedPlaylistsCount === playlistsCount) {
      deselectAllPlaylists();
    } else {
      selectAllPlaylists();
      // Match all playlists when selected
      Array.from(state.playlists.values()).forEach(playlist => {
        matchPlaylistTracks(playlist, target);
      });
    }
  };

  const handlePlaylistToggle = async (playlist: IPlaylist) => {
    if (selectedItems.playlists.has(playlist.id)) {
      deselectPlaylist(playlist.id);
    } else {
      selectPlaylist(playlist.id);

      // Only fetch tracks if they don't exist
      if (!playlist.tracks || playlist.tracks.length === 0) {
        try {
          const tracks = await fetchPlaylistTracks(playlist.id, source);
          if (tracks) {
            // Match the playlist when selected and tracks are available
            matchPlaylistTracks({ ...playlist, tracks }, target);
          }
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
        }
      } else {
        // Use existing tracks if available
        matchPlaylistTracks(playlist, target);
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
    <div className="sticky bottom-[20px] top-[20px] h-[calc(100vh-40px)] w-80 flex-shrink-0 overflow-y-auto">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Library</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Select items to transfer</p>
        </div>

        {/* Liked Songs Section */}
        <div>
          <div
            className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            onClick={handleLikedSongsClick}
            role="button"
            aria-label="View Liked Songs"
          >
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedLikedSongsCount}
                totalCount={likedSongsCount}
                onChange={handleLikedSongsToggle}
                className="flex-shrink-0"
                label="Liked Songs"
              />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100">
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
          >
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedAlbumsCount}
                totalCount={albumsCount}
                onChange={handleAlbumsToggle}
                className="flex-shrink-0"
                label="Albums"
              />
            </div>
            <div className="h-10 w-10 overflow-hidden rounded-lg">
              <ArtworkImage
                src={Array.from(state.albums)[0]?.artwork}
                alt="First Album"
                size={40}
                type="album"
                className="rounded-lg"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-200">
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
          <div className="mb-1 flex items-center gap-3 px-2 py-2">
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedPlaylistsCount}
                totalCount={playlistsCount}
                onChange={handlePlaylistsToggle}
                className="flex-shrink-0"
                label="All Playlists"
              />
            </div>
            <div className="px-2">
              <h2 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Playlists</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">All playlists</p>
            </div>
          </div>
          <div className="space-y-1">
            {Array.from(state.playlists.values()).map(playlist => (
              <div
                key={playlist.id}
                className="group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
                onClick={() => handlePlaylistClick(playlist.id)}
              >
                <div onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded accent-indigo-600 transition-colors duration-200 dark:accent-indigo-500"
                    checked={selectedItems.playlists.has(playlist.id)}
                    onChange={() => handlePlaylistToggle(playlist)}
                  />
                </div>
                <div className="h-10 w-10 overflow-hidden rounded-lg">
                  <ArtworkImage
                    src={playlist.artwork}
                    alt={playlist.name}
                    size={40}
                    type="playlist"
                    className="rounded-lg"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                    {playlist.name}
                  </p>
                  <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
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
