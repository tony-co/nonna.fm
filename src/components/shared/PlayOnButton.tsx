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
      className="hover:text-[var(--service-color)]/80 hover:bg-[var(--service-color)]/5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[var(--service-color)] transition-colors md:px-4 md:py-2"
    >
      <service.image size={20} className="md:h-6 md:w-6" />
      <span className="text-xs font-medium md:text-sm">Play on {service.name}</span>
    </a>
  );
};
