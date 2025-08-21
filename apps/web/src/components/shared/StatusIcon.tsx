import { FC } from "react";
import { useTranslations } from "next-intl";
import type { IAlbum, ITrack, IPlaylist } from "@/types";
import { MatchingStatus } from "@/types";

interface StatusIconProps {
  album?: IAlbum;
  track?: ITrack;
  playlist?: IPlaylist;
}

export const StatusIcon: FC<StatusIconProps> = ({ album, track, playlist: _playlist }) => {
  const t = useTranslations('Status');
  
  // Status is now read directly from the album or track object
  let status: MatchingStatus | undefined;
  if (album) {
    status = album.status;
  } else if (track) {
    status = track.status;
    // Note: playlist parameter is provided but currently not used.
    // It will be used in the future to differentiate between liked tracks and playlist tracks
  }

  switch (status) {
    case "matched":
      return (
        <div className="flex justify-end" title={t('matched')}>
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
      );
    case "unmatched":
      return (
        <div className="flex justify-end" title={t('notFound')}>
          <div className="h-2.5 w-2.5 rounded-full bg-red-500 dark:bg-red-400" />
        </div>
      );
    case "pending":
      return (
        <div className="flex justify-end" title={t('searching')}>
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-300 dark:bg-indigo-200" />
        </div>
      );
    default:
      return null;
  }
};
