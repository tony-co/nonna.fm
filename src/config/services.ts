import { SpotifyLogo } from "@/components/icons/SpotifyLogo";
import { YouTubeMusicLogo } from "@/components/icons/YouTubeMusicLogo";
import { DeezerLogo } from "@/components/icons/DeezerLogo";
import { AppleMusicLogo } from "@/components/icons/AppleMusicLogo";
import { AmazonMusicLogo } from "@/components/icons/AmazonMusicLogo";
import { TidalLogo } from "@/components/icons/TidalLogo";
import { PandoraLogo } from "@/components/icons/PandoraLogo";
import { FC } from "react";

export interface ServiceConfig {
  id: string;
  name: string;
  image: FC<{ className?: string; size?: number }>;
  color: string;
  status: "Available" | "Coming Soon" | "Beta" | "Maintenance";
}

export const SERVICES: Record<string, ServiceConfig> = {
  spotify: {
    id: "spotify",
    name: "Spotify",
    image: SpotifyLogo,
    color: "#1ed760",
    status: "Available",
  },
  youtube: {
    id: "youtube",
    name: "YouTube Music",
    image: YouTubeMusicLogo,
    color: "#FF0000",
    status: "Available",
  },
  deezer: {
    id: "deezer",
    name: "Deezer",
    image: DeezerLogo,
    color: "#A238FF",
    status: "Available",
  },
  apple: {
    id: "apple",
    name: "Apple Music",
    image: AppleMusicLogo,
    color: "#FA243C",
    status: "Available",
  },
  amazonMusic: {
    id: "amazonMusic",
    name: "Amazon Music",
    image: AmazonMusicLogo,
    color: "#00A8E1",
    status: "Coming Soon",
  },
  tidal: {
    id: "tidal",
    name: "Tidal",
    image: TidalLogo,
    color: "#000000",
    status: "Coming Soon",
  },
  pandora: {
    id: "pandora",
    name: "Pandora",
    image: PandoraLogo,
    color: "#3668FF",
    status: "Coming Soon",
  },
} as const;

// Helper function to get available services
export const getAvailableServices = (): ServiceConfig[] => {
  return Object.values(SERVICES).filter(service => service.status === "Available");
};

// Helper function to get coming soon services
export const getComingSoonServices = (): ServiceConfig[] => {
  return Object.values(SERVICES).filter(service => service.status === "Coming Soon");
};

// Helper function to get service by ID
export const getServiceById = (id: string): ServiceConfig | undefined => {
  return SERVICES[id];
};
