import { IAlbum, IPlaylist, ITrack } from "@/types/library";
import Image from "next/image";
import { useSelection } from "@/contexts/SelectionContext";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";

// Types
interface LibrarySidebarProps {
  data: {
    likedSongs: Array<ITrack>;
    albums: Array<IAlbum>;
    playlists: Array<IPlaylist>;
  };
  onItemClick: (type: "playlist" | "album" | "liked", id?: string) => void;
}

// Subcomponents
const SidebarHeader = () => (
  <div>
    <h1 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Library</h1>
    <p className="text-sm text-zinc-600 dark:text-zinc-400">Select items to transfer</p>
  </div>
);

const LikedSongsItem = ({
  selectedCount,
  totalCount,
  isSelected,
  onToggle,
  onClick,
  isDisabled,
}: {
  selectedCount: number;
  totalCount: number;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  isDisabled: boolean;
}) => (
  <div
    className={`group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 ${
      isSelected
        ? "bg-indigo-100 dark:bg-indigo-950/90"
        : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
    }`}
    onClick={onClick}
  >
    <div onClick={e => e.stopPropagation()}>
      <IndeterminateCheckbox
        selectedCount={selectedCount}
        totalCount={totalCount}
        onChange={onToggle}
        onClick={e => e.stopPropagation()}
        disabled={isDisabled}
        className="flex-shrink-0"
      />
    </div>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300">
      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
    <div className="min-w-0">
      <p
        className={`truncate font-normal ${
          isSelected
            ? "text-zinc-800 dark:text-white"
            : "text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100"
        }`}
      >
        Liked Songs
      </p>
      <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">{totalCount} songs</p>
    </div>
  </div>
);

const AlbumsItem = ({
  albums,
  selectedCount,
  totalCount,
  isSelected,
  onToggle,
  onClick,
  isDisabled,
}: {
  albums: Array<IAlbum>;
  selectedCount: number;
  totalCount: number;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  isDisabled: boolean;
}) => (
  <div
    className={`group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 ${
      isSelected
        ? "bg-indigo-100 dark:bg-indigo-950/90"
        : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
    }`}
    onClick={onClick}
  >
    <div onClick={e => e.stopPropagation()}>
      <IndeterminateCheckbox
        selectedCount={selectedCount}
        totalCount={totalCount}
        onChange={onToggle}
        onClick={e => e.stopPropagation()}
        disabled={isDisabled}
        className="flex-shrink-0"
      />
    </div>
    {albums.length > 0 && albums[0].artwork ? (
      <div className="h-10 w-10 overflow-hidden rounded-lg">
        <Image
          src={albums[0].artwork}
          alt="First Album"
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
    ) : (
      <div className="from-primary-500 to-primary-700 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br">
        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      </div>
    )}
    <div className="min-w-0">
      <p
        className={`truncate font-normal ${
          isSelected
            ? "text-zinc-800 dark:text-white"
            : "text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-200"
        }`}
      >
        Albums
      </p>
      <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">{totalCount} albums</p>
    </div>
  </div>
);

const PlaylistsSection = ({
  playlists,
  selectedCount,
  totalCount,
  onToggleAll,
  onTogglePlaylist,
  onPlaylistClick,
  selectedPlaylistId,
  isDisabled,
  selection,
}: {
  playlists: Array<IPlaylist>;
  selectedCount: number;
  totalCount: number;
  onToggleAll: () => void;
  onTogglePlaylist: (playlist: IPlaylist) => void;
  onPlaylistClick: (id: string) => void;
  selectedPlaylistId?: string;
  isDisabled: boolean;
  selection: Map<string, Set<ITrack>>;
}) => (
  <>
    <div className="mb-1 flex items-center gap-3 px-2 py-2">
      <div onClick={e => e.stopPropagation()}>
        <IndeterminateCheckbox
          selectedCount={selectedCount}
          totalCount={totalCount}
          onChange={onToggleAll}
          disabled={isDisabled}
          className="flex-shrink-0"
        />
      </div>
      <div className="px-2">
        <h1 className="mb-1 text-xl font-bold text-zinc-800 dark:text-white">Playlists</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">All playlists</p>
      </div>
    </div>
    <div className="space-y-1">
      {playlists.map(playlist => {
        const isSelected = selectedPlaylistId === playlist.id;
        const selectedTracks = selection.get(playlist.id);
        const selectedTrackCount = selectedTracks ? selectedTracks.size : 0;
        const totalTrackCount = playlist.tracks?.length || playlist.trackCount;

        return (
          <div
            key={playlist.id}
            className={`group flex cursor-pointer items-center gap-3 rounded-lg p-2.5 transition-all duration-200 ${
              isSelected
                ? "bg-indigo-100 dark:bg-indigo-950/90"
                : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
            }`}
            onClick={() => onPlaylistClick(playlist.id)}
          >
            <div onClick={e => e.stopPropagation()}>
              <IndeterminateCheckbox
                selectedCount={selectedTrackCount}
                totalCount={totalTrackCount}
                onChange={() => onTogglePlaylist(playlist)}
                onClick={e => e.stopPropagation()}
                disabled={isDisabled}
                className="flex-shrink-0"
              />
            </div>
            {playlist.artwork ? (
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={playlist.artwork}
                  alt={playlist.name}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-300">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-normal ${
                  isSelected
                    ? "text-zinc-800 dark:text-white"
                    : "text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100"
                }`}
              >
                {playlist.name}
              </p>
              <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
                {playlist.trackCount} tracks
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

// Main component
export const LibrarySidebar = ({ data, onItemClick }: LibrarySidebarProps) => {
  const {
    selection,
    selectedView,
    isSelectionDisabled,
    toggleLikedSongs,
    toggleAllAlbums,
    toggleAllPlaylists,
    togglePlaylist,
  } = useSelection();

  return (
    <div className="sticky bottom-[20px] top-[20px] h-[calc(100vh-40px)] w-80 flex-shrink-0 overflow-y-auto">
      <div className="flex flex-col space-y-4">
        <SidebarHeader />

        {/* Liked Songs Section */}
        <div>
          <LikedSongsItem
            selectedCount={selection.likedSongs.size}
            totalCount={data.likedSongs.length}
            isSelected={selectedView?.type === "liked"}
            onToggle={toggleLikedSongs}
            onClick={() => onItemClick("liked")}
            isDisabled={isSelectionDisabled}
          />
        </div>

        {/* Albums Section */}
        <div>
          <AlbumsItem
            albums={data.albums}
            selectedCount={selection.albums.size}
            totalCount={data.albums.length}
            isSelected={selectedView?.type === "album" && !selectedView.id}
            onToggle={toggleAllAlbums}
            onClick={() => onItemClick("album")}
            isDisabled={isSelectionDisabled}
          />
        </div>

        {/* Playlists Section */}
        <div>
          <PlaylistsSection
            playlists={data.playlists}
            selectedCount={selection.playlists.size}
            totalCount={data.playlists.length}
            onToggleAll={toggleAllPlaylists}
            onTogglePlaylist={togglePlaylist}
            onPlaylistClick={id => onItemClick("playlist", id)}
            selectedPlaylistId={selectedView?.type === "playlist" ? selectedView.id : undefined}
            isDisabled={isSelectionDisabled}
            selection={selection.playlists}
          />
        </div>
      </div>
    </div>
  );
};
