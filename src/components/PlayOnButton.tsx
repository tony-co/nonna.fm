import { FC } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { SERVICES } from "@/config/services";

interface PlayOnButtonProps {
  playlistId: string;
}

export const PlayOnButton: FC<PlayOnButtonProps> = ({ playlistId }) => {
  const serviceType = getServiceType("source");
  const service = SERVICES[serviceType as keyof typeof SERVICES];

  if (!service) return null;

  return (
    <a
      href={service.getPlaylistUrl(playlistId)}
      target="_blank"
      rel="noopener noreferrer"
      style={
        {
          "--service-color": service.color,
        } as React.CSSProperties
      }
      className="hover:text-[var(--service-color)]/80 inline-flex w-fit items-center gap-2 px-3 py-2 text-[var(--service-color)] transition-colors"
    >
      <service.image size={24} />
      <span className="text-sm font-medium">Play on {service.name}</span>
    </a>
  );
};
