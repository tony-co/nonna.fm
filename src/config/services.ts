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
  getPlaylistUrl: (id: string) => string;
  getLikedSongsUrl: () => string | null;
  getAlbumsUrl: () => string | null;
}

export const SERVICES: Record<string, ServiceConfig> = {
  spotify: {
    id: "spotify",
    name: "Spotify",
    image: SpotifyLogo,
    color: "#1ed760",
    status: "Available",
    getPlaylistUrl: (id: string) => `https://open.spotify.com/playlist/${id}`,
    getLikedSongsUrl: () => "https://open.spotify.com/collection/tracks",
    getAlbumsUrl: () => "https://open.spotify.com/",
  },
  youtube: {
    id: "youtube",
    name: "YouTube Music",
    image: YouTubeMusicLogo,
    color: "#FF0000",
    status: "Available",
    getPlaylistUrl: (id: string) => `https://music.youtube.com/playlist?list=${id}`,
    getLikedSongsUrl: () => "https://music.youtube.com/playlist?list=LM",
    getAlbumsUrl: () => null,
  },
  deezer: {
    id: "deezer",
    name: "Deezer",
    image: DeezerLogo,
    color: "#A238FF",
    status: "Available",
    getPlaylistUrl: (id: string) => `https://www.deezer.com/playlist/${id}`,
    getLikedSongsUrl: () => {
      if (typeof window === "undefined") return null;
      const userId = localStorage.getItem("deezer_user_id");
      return userId ? `https://www.deezer.com/fr/profile/${userId}/loved` : null;
    },
    getAlbumsUrl: () => {
      if (typeof window === "undefined") return null;
      const userId = localStorage.getItem("deezer_user_id");
      return userId ? `https://www.deezer.com/fr/profile/${userId}/albums` : null;
    },
  },
  apple: {
    id: "apple",
    name: "Apple Music",
    image: AppleMusicLogo,
    color: "#FA243C",
    status: "Available",
    getPlaylistUrl: (id: string) => {
      try {
        if (typeof window !== "undefined" && window.MusicKit) {
          const music = window.MusicKit.getInstance();
          const storefrontId = music?.storefrontId;
          if (storefrontId) {
            return `https://music.apple.com/${storefrontId}/library/playlist/${id}`;
          }
        }
      } catch (error) {
        console.error("Error retrieving Apple Music storefront ID:", error);
      }
      return `https://music.apple.com/library/playlist/${id}`;
    },
    getLikedSongsUrl: () => "https://music.apple.com/fr/library/songs",
    getAlbumsUrl: () => "https://music.apple.com/fr/library/albums",
  },
  amazonMusic: {
    id: "amazonMusic",
    name: "Amazon Music",
    image: AmazonMusicLogo,
    color: "#00A8E1",
    status: "Coming Soon",
    getPlaylistUrl: (id: string) => `https://music.amazon.com/playlists/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
  },
  tidal: {
    id: "tidal",
    name: "Tidal",
    image: TidalLogo,
    color: "#000000",
    status: "Coming Soon",
    getPlaylistUrl: (id: string) => `https://tidal.com/playlist/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
  },
  pandora: {
    id: "pandora",
    name: "Pandora",
    image: PandoraLogo,
    color: "#3668FF",
    status: "Coming Soon",
    getPlaylistUrl: (id: string) => `https://www.pandora.com/playlist/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
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
