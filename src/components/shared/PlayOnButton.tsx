import { FC } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { SERVICES } from "@/config/services";

// Supported types for PlayOnButton
interface PlayOnButtonProps {
  type: "playlist" | "liked" | "albums";
  playlistId?: string; // Only required for playlist type
}

export const PlayOnButton: FC<PlayOnButtonProps> = ({ type, playlistId }) => {
  const serviceType = getServiceType("source");
  const service = SERVICES[serviceType as keyof typeof SERVICES];

  if (!service) return null;

  // Determine the correct URL based on type
  let url: string | null = null;
  if (type === "playlist" && playlistId) {
    url = service.getPlaylistUrl(playlistId);
  } else if (type === "liked") {
    url = service.getLikedSongsUrl();
  } else if (type === "albums") {
    url = service.getAlbumsUrl();
  }

  // Hide button if URL is not available
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={
        {
          "--service-color": service.color,
        } as React.CSSProperties
      }
      className="hover:text-[var(--service-color)]/80 hover:bg-[var(--service-color)]/5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[var(--service-color)] transition-colors lg:px-4 lg:py-2"
    >
      <service.image size={20} className="lg:h-6 lg:w-6" />
      <span className="text-xs font-medium lg:text-sm">Play on {service.name}</span>
    </a>
  );
};
