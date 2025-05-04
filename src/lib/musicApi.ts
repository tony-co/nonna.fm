import { MusicService, TransferResult, IMusicServiceProvider } from "@/types/services";
import { musicServiceFactory } from "./services/factory";
import { isDeezerSource } from "./services/deezer/auth";
import { getYouTubeAuthData } from "./services/youtube/auth";
import { getSpotifyAuthData } from "./services/spotify/auth";
import { getAppleMusicAuthData } from "./services/apple/auth";
import type { ILibraryData, ITrack, IAlbum } from "@/types/library";

async function getCurrentService(
  role: "source" | "target" = "source"
): Promise<IMusicServiceProvider> {
  const service = await getActiveService(role);
  if (!service) {
    throw new Error(`No active ${role} service found`);
  }

  return musicServiceFactory.getProvider(service);
}

async function getActiveService(role: "source" | "target"): Promise<MusicService> {
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

    throw new Error("No active service found");
  } catch (error) {
    console.error("Error getting active service:", error);
    throw new Error("Error getting active service");
  }
}

export async function getSourceService(): Promise<MusicService> {
  return await getActiveService("source");
}

export async function getTargetService(): Promise<MusicService> {
  return await getActiveService("target");
}

export async function fetchUserLibrary(): Promise<ILibraryData> {
  const provider = await getCurrentService("source");
  return provider.fetchUserLibrary();
}

export async function fetchPlaylistTracks(
  playlistId: string,
  onProgress?: (tracks: ITrack[], progress: number) => void
): Promise<ITrack[]> {
  const provider = await getCurrentService("source");
  return provider.fetchPlaylistTracks(playlistId, onProgress);
}

export async function addTracksToLibrary(tracks: ITrack[]): Promise<TransferResult> {
  const provider = await getCurrentService("target");
  return provider.addTracksToLibrary(tracks);
}

export async function createPlaylistWithTracks(
  name: string,
  tracks: ITrack[],
  description?: string
): Promise<TransferResult> {
  const provider = await getCurrentService("target");
  return provider.createPlaylistWithTracks(name, tracks, description);
}

export async function addAlbumsToLibrary(albums: Set<IAlbum>): Promise<TransferResult> {
  const provider = await getCurrentService("target");
  return provider.addAlbumsToLibrary(albums);
}

export async function getLibraryData(): Promise<ILibraryData> {
  const provider = await getCurrentService("source");
  return provider.fetchUserLibrary();
}

export async function getSourceLibrary(): Promise<ILibraryData> {
  const sourceService = await getActiveService("source");
  if (!sourceService) {
    throw new Error("No source service selected");
  }
  return getLibraryData();
}
