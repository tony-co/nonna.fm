import { FC } from "react";
import Dialog from "./Dialog";
import { useSelection } from "@/contexts/SelectionContext";
import { getServiceById } from "@/config/services";
import { TransferResult } from "@/types/services";
import { ArtworkImage } from "./ArtworkImage";

interface TransferSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetServiceId: string;
  results: {
    likedSongs?: TransferResult;
    albums?: TransferResult;
    playlists: Map<string, TransferResult>;
  };
}

export const TransferSuccessModal: FC<TransferSuccessModalProps> = ({
  isOpen,
  onClose,
  targetServiceId,
  results,
}) => {
  const { selection } = useSelection();
  const targetService = getServiceById(targetServiceId);

  if (!targetService) return null;

  const hasLikedSongs = results.likedSongs && results.likedSongs.playlistId;
  const hasAlbums = results.albums && results.albums.playlistId;
  const successfulPlaylists = Array.from(results.playlists.entries()).filter(
    ([_, result]) => result.playlistId
  );

  const totalTransferred =
    (results.likedSongs?.added || 0) +
    (results.albums?.added || 0) +
    Array.from(results.playlists.values()).reduce((sum, result) => sum + result.added, 0);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Complete!"
      closeOnBackdropClick={false}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 p-6 text-indigo-600 dark:from-indigo-400/10 dark:to-indigo-500/5 dark:text-indigo-400">
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex items-center gap-3">
              <span className="text-xl font-medium">Enjoy your {totalTransferred} tracks on</span>
              <div className="flex items-center gap-2">
                <targetService.image size={28} />
                <span className="text-xl font-medium" style={{ color: targetService.color }}>
                  {targetService.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-stone-200">
            Your transferred music is ready!
          </h3>
          <div className="flex flex-col gap-3">
            {hasLikedSongs && (
              <a
                href={targetService.getPlaylistUrl(results.likedSongs!.playlistId!)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50"
              >
                <div className="flex items-center gap-4">
                  {selection.likedSongs.size > 0 && (
                    <ArtworkImage
                      src={Array.from(selection.likedSongs)[0].artwork}
                      alt="Liked Songs"
                      size={48}
                      type="liked"
                      className="group-hover:scale-105"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Liked Songs</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {results.likedSongs?.added} songs transferred
                    </div>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}

            {hasAlbums && (
              <a
                href={targetService.getPlaylistUrl(results.albums!.playlistId!)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50"
              >
                <div className="flex items-center gap-4">
                  {selection.albums.size > 0 && (
                    <ArtworkImage
                      src={Array.from(selection.albums)[0].artwork}
                      alt="Albums"
                      size={48}
                      type="album"
                      className="group-hover:scale-105"
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Albums</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {results.albums?.added} albums transferred
                    </div>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            )}

            {successfulPlaylists.map(([playlistId, result]) => {
              const tracks = selection.playlists.get(playlistId);
              if (!tracks || !result.playlistId) return null;

              const firstTrack = Array.from(tracks)[0];

              return (
                <a
                  key={playlistId}
                  href={targetService.getPlaylistUrl(result.playlistId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50"
                >
                  <div className="flex items-center gap-4">
                    <ArtworkImage
                      src={firstTrack?.artwork}
                      alt={firstTrack?.name || "Playlist"}
                      size={48}
                      type="playlist"
                      className="group-hover:scale-105"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {firstTrack?.name || "Playlist"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {result.added} songs transferred
                      </div>
                    </div>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
};
