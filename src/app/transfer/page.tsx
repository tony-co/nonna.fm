"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { IAlbum, IPlaylist, ITrack, ISelectionState } from "@/types/library";
import { MusicService } from "@/types/services";
import { Library } from "@/components/library/Library";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  fetchUserLibrary,
  fetchPlaylistTracks,
  createPlaylistWithTracks,
  addTracksToLibrary,
  addAlbumsToLibrary,
} from "@/lib/musicApi";
import { useSearchTracks } from "@/hooks/useSearchTracks";
import { MatchingProvider } from "@/contexts/MatchingContext";
import { useMatching } from "@/contexts/MatchingContext";
import { fetchPlaylistCurator } from "@/lib/services/apple/api";

interface LibraryState {
  likedSongs: Array<ITrack>;
  albums: IAlbum[];
  playlists: Array<IPlaylist>;
}

// LoadingOverlay component with indigo styling
const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
    <div className="text-center">
      <div className="inline-block">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-b-indigo-500/10 border-l-indigo-500/70 border-r-indigo-500/40" />
      </div>
      <h2 className="mt-4 animate-pulse text-xl font-normal text-white">Loading your library</h2>
      <p className="mt-2 text-sm text-indigo-200">Just a moment while we get everything ready</p>
    </div>
  </div>
);

function TransferPageContent() {
  const searchParams = useSearchParams();
  const [libraryState, setLibraryState] = useState<LibraryState | null>(null);
  const [mode, setMode] = useState<"select" | "matching" | "review" | "transfer" | "completed">(
    "select"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { matchingState } = useMatching();

  // Get source and target services from URL parameters
  const sourceService = searchParams.get("source") as MusicService;
  const targetService = searchParams.get("target") as MusicService;

  const {
    isLoading: isSearchLoading,
    handleSearchTracks,
    cancelSearch,
  } = useSearchTracks({
    libraryState,
    setLibraryState,
    onModeChange: setMode,
    targetService,
  });

  console.log("TransferPageContent render:", {
    isLoading,
    isSearchLoading,
    libraryState: !!libraryState,
  });

  useEffect(() => {
    console.log("Loading state changed:", { isLoading, isSearchLoading });
  }, [isLoading, isSearchLoading]);

  useEffect(() => {
    const initializeLibrary = async (): Promise<void> => {
      try {
        if (!sourceService) {
          setError("Source service not specified");
          return;
        }

        setIsLoading(true);

        const library = await fetchUserLibrary(sourceService);
        setLibraryState(library);
      } catch (err) {
        console.error("Error initializing library:", err);
        setError("Failed to load library. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeLibrary();
  }, [sourceService]);

  useEffect(() => {
    const authSuccess = searchParams.get("auth_success") === "true";
    console.log("Source page - auth success check:", {
      authSuccess,
      hasLibraryState: !!libraryState,
      searchParams: Object.fromEntries(searchParams.entries()),
    });
    if (authSuccess && libraryState) {
      //handleSearchTracks();
    }
  }, [searchParams, libraryState, handleSearchTracks]);

  const handleStartTransfer = async (selection: ISelectionState): Promise<void> => {
    if (!libraryState || !targetService) {
      console.log("handleStartTransfer - missing required data", { libraryState, targetService });
      setError("Target service not specified");
      return;
    }

    try {
      // First, ensure all selected items are matched
      const selectedAlbums = Array.from(selection.albums);
      const unmatched = selectedAlbums.filter(
        album => !matchingState.albums.get(album.id)?.targetId
      );

      if (unmatched.length > 0) {
        console.log(
          "Found unmatched albums, initiating matching process:",
          unmatched.map(a => a.name)
        );
        setMode("matching");
        await handleSearchTracks({ ...unmatched[0] });
        return;
      }

      setMode("transfer");

      // Transfer liked songs
      const matchedLikedSongs = Array.from(selection.likedSongs)
        .filter(track => matchingState.tracks.get(track.id)?.status === "matched")
        .map(track => ({
          ...track,
          targetId: matchingState.tracks.get(track.id)?.targetId,
        }));

      if (matchedLikedSongs.length > 0) {
        await addTracksToLibrary(matchedLikedSongs, targetService);
      }

      // Transfer matched albums
      const albumsWithIds = selectedAlbums
        .map(album => ({
          ...album,
          targetId: matchingState.albums.get(album.id)?.targetId,
        }))
        .filter((album): album is IAlbum & { targetId: string } => !!album.targetId);

      if (albumsWithIds.length > 0) {
        console.log(
          "Transferring albums with IDs:",
          albumsWithIds.map(a => ({ name: a.name, targetId: a.targetId }))
        );
        const albumsSet = new Set<IAlbum>(albumsWithIds);
        await addAlbumsToLibrary(albumsSet, targetService);
      }

      // Transfer playlists
      for (const [playlistId, selectedTracks] of Array.from(selection.playlists.entries())) {
        const playlist = libraryState.playlists.find(p => p.id === playlistId);
        if (!playlist) continue;

        const matchedTracks = Array.from(selectedTracks)
          .filter(track => matchingState.tracks.get(track.id)?.status === "matched")
          .map(track => ({
            ...track,
            targetId: matchingState.tracks.get(track.id)?.targetId,
          }));

        if (matchedTracks.length > 0) {
          await createPlaylistWithTracks(
            playlist.name,
            matchedTracks,
            `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`,
            targetService
          );
        }
      }

      setMode("completed");
      // todo success modal
    } catch (err) {
      console.error("handleStartTransfer - error:", err);
      setError("Failed to transfer tracks. Please try again.");
      setMode("review");
    }
  };

  const handleItemClick = async (type: "playlist" | "album", id?: string): Promise<void> => {
    if (!libraryState || !sourceService) return;

    cancelSearch();

    try {
      if (type === "playlist" && id) {
        const playlist = libraryState.playlists.find(p => p.id === id);
        if (!playlist) return;

        // Fetch owner for Apple Music playlists
        let curatorName = "";
        if (sourceService === "apple") {
          const curator = await fetchPlaylistCurator(id);
          curatorName = curator?.data?.[0]?.attributes?.curatorName || "";
        }

        const tracks = await fetchPlaylistTracks(id, sourceService);

        setLibraryState(prev => {
          if (!prev) return prev;
          const updatedPlaylist = {
            ...playlist,
            tracks,
            ...(sourceService === "apple" && curatorName ? { ownerName: curatorName } : {}),
          };
          return {
            ...prev,
            playlists: prev.playlists.map(p => (p.id === id ? updatedPlaylist : p)),
          };
        });

        handleSearchTracks({ ...playlist, tracks });
      }
    } catch (err) {
      console.error("Error fetching item tracks:", err);
      setError("Failed to fetch tracks. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto flex-grow pt-4">
          <div className="h-full">
            {isLoading && <LoadingOverlay />}
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
                {error}
              </div>
            )}
            {(!sourceService || !targetService) && (
              <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500">
                Please specify both source and target services in the URL parameters (e.g.,
                /transfer?source=spotify&target=apple)
              </div>
            )}
            {!isLoading && (
              <Library
                data={libraryState || { likedSongs: [], albums: [], playlists: [] }}
                mode={mode}
                onItemClick={handleItemClick}
                onStartTransfer={handleStartTransfer}
                onSearchTracks={handleSearchTracks}
              />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function TransferPage() {
  return (
    <MatchingProvider>
      <Suspense fallback={<LoadingOverlay />}>
        <TransferPageContent />
      </Suspense>
    </MatchingProvider>
  );
}
