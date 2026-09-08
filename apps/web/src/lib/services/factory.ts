import type { IMusicServiceProvider, MusicService } from "@/types";

function lazyProvider(load: () => Promise<IMusicServiceProvider>): IMusicServiceProvider {
  return {
    search: async (...args) => (await load()).search(...args),
    searchAlbums: async (...args) => (await load()).searchAlbums(...args),
    addTracksToLibrary: async (...args) => (await load()).addTracksToLibrary(...args),
    addAlbumsToLibrary: async (...args) => (await load()).addAlbumsToLibrary(...args),
    createPlaylistWithTracks: async (...args) => (await load()).createPlaylistWithTracks(...args),
    fetchUserLibrary: async (...args) => (await load()).fetchUserLibrary(...args),
    fetchPlaylistTracks: async (...args) => (await load()).fetchPlaylistTracks(...args),
  };
}

const providers: Record<MusicService, IMusicServiceProvider> = {
  apple: lazyProvider(() => import("./apple/api")),
  spotify: lazyProvider(() => import("./spotify/api")),
  youtube: lazyProvider(() => import("./youtube/api")),
  deezer: lazyProvider(() => import("./deezer/api")),
};

export const musicServiceFactory = {
  getProvider(service: MusicService): IMusicServiceProvider {
    const provider = providers[service];
    if (!provider) throw new Error(`No provider found for service: ${service}`);
    return provider;
  },
};
