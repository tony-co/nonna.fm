import { MusicService, TransferResult, IMusicServiceProvider } from "@/types/services";
import { musicServiceFactory } from "./services/factory";
import { isDeezerSource } from "./services/deezer/auth";
import { getYouTubeAuthData } from "./services/youtube/auth";
import { getSpotifyAuthData } from "./services/spotify/auth";
import { getAppleMusicAuthData } from "./services/apple/auth";
import type { ILibraryData, ITrack, IAlbum } from "@/types/library";

export type ServiceType =
  | "spotify"
  | "youtube"
  | "deezer"
  | "apple"
  | "amazonMusic"
  | "tidal"
  | "pandora";

async function getCurrentService(service?: MusicService): Promise<IMusicServiceProvider> {
  if (service) {
    return musicServiceFactory.getProvider(service);
  }

  const sourceService = await getActiveService("source");
  if (!sourceService || !isActiveMusicService(sourceService)) {
    throw new Error("No active service found");
  }

  return musicServiceFactory.getProvider(sourceService);
}

function isActiveMusicService(service: ServiceType): service is MusicService {
  return ["spotify", "youtube", "apple", "deezer"].includes(service);
}

export async function getActiveService(role: "source" | "target"): Promise<ServiceType | null> {
  try {
    // Check Apple Music
    const appleAuth = getAppleMusicAuthData(role);
    if (appleAuth) return "apple";

    // Check Spotify - needs special handling as it's async
    try {
      const spotifyAuth = await getSpotifyAuthData(role);
      if (spotifyAuth !== null) return "spotify";
    } catch (error) {
      console.error("Error checking Spotify auth:", error);
    }

    // Check YouTube
    try {
      const youtubeAuth = await getYouTubeAuthData(role);
      if (youtubeAuth !== null) return "youtube";
    } catch (error) {
      console.error("Error checking YouTube auth:", error);
    }

    // Special case for Deezer - only works as source
    if (role === "source" && isDeezerSource()) return "deezer";

    return null;
  } catch (error) {
    console.error("Error getting active service:", error);
    return null;
  }
}

export async function getSourceService(): Promise<ServiceType | null> {
  return getActiveService("source");
}

export async function getTargetService(): Promise<ServiceType | null> {
  return getActiveService("target");
}

export async function fetchUserLibrary(service?: MusicService): Promise<ILibraryData> {
  const provider = await getCurrentService(service);
  return provider.fetchUserLibrary();
}

export async function fetchPlaylistTracks(
  playlistId: string,
  service?: MusicService
): Promise<ITrack[]> {
  const provider = await getCurrentService(service);
  return provider.fetchPlaylistTracks(playlistId);
}

export async function addTracksToLibrary(
  tracks: ITrack[],
  service?: MusicService
): Promise<TransferResult> {
  const provider = await getCurrentService(service);
  return provider.addTracksToLibrary(tracks);
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: ITrack[],
  description?: string,
  service?: MusicService
): Promise<TransferResult> {
  const provider = await getCurrentService(service);
  return provider.createPlaylistWithTracks(name, tracks, description);
}

export async function addAlbumsToLibrary(
  albums: Set<IAlbum>,
  service?: MusicService
): Promise<TransferResult> {
  const provider = await getCurrentService(service);
  return provider.addAlbumsToLibrary(albums);
}

export async function getLibraryData(service: ServiceType): Promise<ILibraryData> {
  if (!isActiveMusicService(service)) {
    throw new Error(`Service ${service} not implemented yet`);
  }
  const provider = musicServiceFactory.getProvider(service);
  return provider.fetchUserLibrary();
}

export async function getSourceLibrary(): Promise<ILibraryData> {
  const sourceService = await getActiveService("source");
  if (!sourceService) {
    throw new Error("No source service selected");
  }
  return getLibraryData(sourceService);
}
