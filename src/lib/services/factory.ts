import { IMusicServiceProvider, MusicService, IServiceFactory } from "@/types/services";
import * as appleService from "./apple/api";
import * as spotifyService from "./spotify/api";
import * as youtubeService from "./youtube/api";
import * as deezerService from "./deezer/api";

class MusicServiceFactory implements IServiceFactory {
  private providers: Record<MusicService, IMusicServiceProvider> = {
    apple: appleService,
    spotify: spotifyService,
    youtube: youtubeService,
    deezer: deezerService,
  };

  getProvider(service: MusicService): IMusicServiceProvider {
    const provider = this.providers[service];
    if (!provider) {
      throw new Error(`No provider found for service: ${service}`);
    }
    return provider;
  }
}

export const musicServiceFactory = new MusicServiceFactory();

// Keep track of playlists currently being fetched
export const fetchingPlaylists = new Set<string>();
