import { IPlaylist, ITrack } from "@/types/library";
import { useSelection } from "@/contexts/SelectionContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { IndeterminateCheckbox } from "@/components/shared/IndeterminateCheckbox";
import { ArtworkImage } from "@/components/shared/ArtworkImage";

// Types
interface LibrarySidebarProps {
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
  isSelected,
  onToggle,
  onClick,
  isDisabled,
}: {
  selectedCount: number;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  isDisabled: boolean;
}) => {
  const { libraryState } = useLibrary();
  const totalCount = libraryState?.likedSongs.length || 0;

  return (
    <div
      className={`group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-all duration-200 ${
        isSelected
          ? "bg-indigo-100 dark:bg-indigo-950/90"
          : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"
      }`}
      onClick={onClick}
      data-testid="liked-songs-section"
    >
      <div onClick={e => e.stopPropagation()}>
        <IndeterminateCheckbox
          selectedCount={selectedCount}
          totalCount={totalCount}
          onChange={onToggle}
          onClick={e => e.stopPropagation()}
          disabled={isDisabled}
          className="flex-shrink-0"
          label="Liked Songs"
          testId="liked-songs-checkbox"
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
};

const AlbumsItem = ({
  selectedCount,
  isSelected,
  onToggle,
  onClick,
  isDisabled,
}: {
  selectedCount: number;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  isDisabled: boolean;
}) => {
  const { libraryState } = useLibrary();
  const albums = libraryState?.albums || [];
  const totalCount = albums.length;

  return (
    <div
      className={`group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-all duration-200 ${
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
          label="Albums"
          testId="albums-checkbox"
        />
      </div>
      <div className="h-10 w-10 overflow-hidden rounded-lg">
        <ArtworkImage
          src={albums[0]?.artwork}
          alt="First Album"
          size={40}
          type="album"
          className="rounded-lg"
        />
      </div>
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
};

const PlaylistsSection = ({
  selectedCount,
  onToggleAll,
  onTogglePlaylist,
  onPlaylistClick,
  selectedPlaylistId,
  isDisabled,
  selection,
}: {
  selectedCount: number;
  onToggleAll: () => void;
  onTogglePlaylist: (playlist: IPlaylist) => void;
  onPlaylistClick: (id: string) => void;
  selectedPlaylistId?: string;
  isDisabled: boolean;
  selection: Map<string, Set<ITrack>>;
}) => {
  const { libraryState } = useLibrary();
  const playlists = libraryState?.playlists || [];
  const totalCount = playlists.length;

  return (
    <>
      <div className="mb-1 flex items-center gap-4 px-3 py-3">
        <div onClick={e => e.stopPropagation()}>
          <IndeterminateCheckbox
            selectedCount={selectedCount}
            totalCount={totalCount}
            onChange={onToggleAll}
            disabled={isDisabled}
            className="flex-shrink-0"
            label="All Playlists"
            testId="all-playlists-checkbox"
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
              className={`group flex cursor-pointer items-center gap-4 rounded-lg p-3 transition-all duration-200 ${
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
                  label={playlist.name}
                  testId={`playlist-${playlist.id}-checkbox`}
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
};

// Main component
export const LibrarySidebar = ({ onItemClick }: LibrarySidebarProps) => {
  const { libraryState } = useLibrary();
  const {
    selection,
    selectedView,
    isSelectionDisabled,
    toggleLikedSongs,
    toggleAllAlbums,
    toggleAllPlaylists,
    togglePlaylist,
  } = useSelection();

  if (!libraryState) return null;

  return (
    <div className="h-full w-80 flex-shrink-0">
      <div className="flex h-full flex-col space-y-4 px-4 md:sticky md:top-0">
        <SidebarHeader />

        {/* Liked Songs Section */}
        <div>
          <LikedSongsItem
            selectedCount={selection.likedSongs.size}
            isSelected={selectedView?.type === "liked"}
            onToggle={toggleLikedSongs}
            onClick={() => onItemClick("liked")}
            isDisabled={isSelectionDisabled}
          />
        </div>

        {/* Albums Section */}
        <div>
          <AlbumsItem
            selectedCount={selection.albums.size}
            isSelected={selectedView?.type === "album" && !selectedView.id}
            onToggle={toggleAllAlbums}
            onClick={() => onItemClick("album")}
            isDisabled={isSelectionDisabled}
          />
        </div>

        {/* Playlists Section */}
        <div>
          <PlaylistsSection
            selectedCount={selection.playlists.size}
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
