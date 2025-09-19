import type { FC } from "react";
import { z } from "zod/v4";
import { AmazonMusicLogo } from "@/components/icons/AmazonMusicLogo";
import { AppleMusicLogo } from "@/components/icons/AppleMusicLogo";
import { DeezerLogo } from "@/components/icons/DeezerLogo";
import { PandoraLogo } from "@/components/icons/PandoraLogo";
import { SpotifyLogo } from "@/components/icons/SpotifyLogo";
import { TidalLogo } from "@/components/icons/TidalLogo";
import { YouTubeMusicLogo } from "@/components/icons/YouTubeMusicLogo";

// Status constants for service availability
export const SERVICE_STATUS = {
  OFF: "OFF",
  DEV: "DEV",
  AVAILABLE: "AVAILABLE",
  MAINTENANCE: "MAINTENANCE",
} as const;

export type ServiceStatus = (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];

export const ServiceConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.custom<FC<{ className: string; size: number }>>(val => typeof val === "function"),
  color: z.string(),
  status: z.enum([
    SERVICE_STATUS.OFF,
    SERVICE_STATUS.DEV,
    SERVICE_STATUS.AVAILABLE,
    SERVICE_STATUS.MAINTENANCE,
  ]),
  getPlaylistUrl: z.custom<(id: string) => string>(val => typeof val === "function"),
  getLikedSongsUrl: z.custom<() => string>(val => typeof val === "function"),
  getAlbumsUrl: z.custom<() => string>(val => typeof val === "function"),
  apiBaseUrl: z.url(),
});

export type ServiceConfig = z.infer<typeof ServiceConfigSchema>;

const ServicesSchema = z.record(z.string(), ServiceConfigSchema);

const rawServices = {
  spotify: {
    id: "spotify",
    name: "Spotify",
    image: SpotifyLogo,
    color: "#1ed760",
    status: SERVICE_STATUS.AVAILABLE,
    apiBaseUrl: "https://api.spotify.com/v1",
    getPlaylistUrl: (id: string) => `https://open.spotify.com/playlist/${id}`,
    getLikedSongsUrl: () => "https://open.spotify.com/collection/tracks",
    getAlbumsUrl: () => "https://open.spotify.com/",
  },
  youtube: {
    id: "youtube",
    name: "YouTube Music",
    image: YouTubeMusicLogo,
    color: "#FF0000",
    status: SERVICE_STATUS.DEV,
    apiBaseUrl: "https://www.googleapis.com/youtube/v3",
    getPlaylistUrl: (id: string) => `https://music.youtube.com/playlist?list=${id}`,
    getLikedSongsUrl: () => "https://music.youtube.com/playlist?list=LM",
    getAlbumsUrl: () => null,
  },
  deezer: {
    id: "deezer",
    name: "Deezer",
    image: DeezerLogo,
    color: "#A238FF",
    status: SERVICE_STATUS.DEV,
    apiBaseUrl: "https://api.deezer.com",
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
    status: SERVICE_STATUS.AVAILABLE,
    apiBaseUrl: "https://api.music.apple.com", // no version as Apple gives relative pagination urls
    getPlaylistUrl: (id: string) => {
      try {
        if (window?.MusicKit) {
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
    status: SERVICE_STATUS.OFF,
    apiBaseUrl: "https://api.music.amazon.com",
    getPlaylistUrl: (id: string) => `https://music.amazon.com/playlists/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
  },
  tidal: {
    id: "tidal",
    name: "Tidal",
    image: TidalLogo,
    color: "#000000",
    status: SERVICE_STATUS.DEV,
    apiBaseUrl: "https://openapi.tidal.com/v2",
    getPlaylistUrl: (id: string) => `https://tidal.com/playlist/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
  },
  pandora: {
    id: "pandora",
    name: "Pandora",
    image: PandoraLogo,
    color: "#3668FF",
    status: SERVICE_STATUS.OFF,
    apiBaseUrl: "https://api.pandora.com/v1",
    getPlaylistUrl: (id: string) => `https://www.pandora.com/playlist/${id}`,
    getLikedSongsUrl: () => null,
    getAlbumsUrl: () => null,
  },
} as const;

// Validate and export the services configuration
export const SERVICES: Record<string, ServiceConfig> = (() => {
  try {
    return ServicesSchema.parse(rawServices);
  } catch (error) {
    console.error("Services configuration validation failed:", error);
    throw new Error("Invalid services configuration. Please check the service definitions.");
  }
})();

// Helper function to get available services with validation
// In non-production environments, also includes DEV services for testing
export const getAvailableServices = (): ServiceConfig[] => {
  try {
    const availableServices = Object.values(SERVICES).filter(service => {
      if (service.status === SERVICE_STATUS.AVAILABLE) {
        return true;
      }
      // Include DEV services when not in production
      if (process.env.NODE_ENV !== "production" && service.status === SERVICE_STATUS.DEV) {
        return true;
      }
      return false;
    });

    if (availableServices.length === 0) {
      console.warn("No available services found");
    }

    return availableServices;
  } catch (error) {
    console.error("Error getting available services:", error);
    return [];
  }
};

// Helper function to get offline services with validation
export const getOfflineServices = (): ServiceConfig[] => {
  try {
    return Object.values(SERVICES).filter(service => service.status === SERVICE_STATUS.OFF);
  } catch (error) {
    console.error("Error getting offline services:", error);
    return [];
  }
};

// Helper function to get services in development with validation
export const getDevServices = (): ServiceConfig[] => {
  try {
    return Object.values(SERVICES).filter(service => service.status === SERVICE_STATUS.DEV);
  } catch (error) {
    console.error("Error getting dev services:", error);
    return [];
  }
};

// Helper function to get services in maintenance with validation
export const getMaintenanceServices = (): ServiceConfig[] => {
  try {
    return Object.values(SERVICES).filter(service => service.status === SERVICE_STATUS.MAINTENANCE);
  } catch (error) {
    console.error("Error getting maintenance services:", error);
    return [];
  }
};

// Helper function to get coming soon services with validation (kept for backward compatibility)
export const getComingSoonServices = (): ServiceConfig[] => {
  try {
    return Object.values(SERVICES).filter(service => service.status === SERVICE_STATUS.OFF);
  } catch (error) {
    console.error("Error getting coming soon services:", error);
    return [];
  }
};

// Helper function to get service by ID with validation
export const getServiceById = (id: string): ServiceConfig | undefined => {
  if (!id || typeof id !== "string") {
    console.error(`Invalid service ID "${id}": must be a non-empty string`);
    return undefined;
  }
  return SERVICES[id];
};

// Helper function to validate a service configuration
export const validateServiceConfig = (config: unknown): ServiceConfig => {
  return ServiceConfigSchema.parse(config);
};

// Helper function to safely get playlist URL with validation
export const getPlaylistUrl = (serviceId: string, playlistId: string): string | null => {
  try {
    const service = getServiceById(serviceId);
    if (!service) {
      throw new Error(`Service "${serviceId}" not found`);
    }

    // Validate playlist ID
    if (!playlistId || playlistId.trim().length === 0) {
      throw new Error("Playlist ID cannot be empty");
    }

    return service.getPlaylistUrl(playlistId.trim());
  } catch (error) {
    console.error(`Error getting playlist URL for service "${serviceId}":`, error);
    return null;
  }
};
