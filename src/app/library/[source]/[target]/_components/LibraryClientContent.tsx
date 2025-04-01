"use client";

import { useEffect } from "react";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { TransferButton } from "@/components/shared/TransferButton";
import { MatchingProvider } from "@/contexts/MatchingContext";
import { LibraryProvider, useLibrary } from "@/contexts/LibraryContext";
import type { IPlaylist } from "@/types/library";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { MusicService } from "@/types/services";
import { initiateAppleAuth } from "@/lib/services/apple/auth";
import { fetchInitialLibraryData } from "@/lib/server/library";

interface LibraryClientContentProps {
  source: MusicService;
  _target: MusicService;
  children: React.ReactNode;
}

function LibraryContent({ source, _target, children }: LibraryClientContentProps) {
  const { state, actions } = useLibrary();

  // Initialize library
  useEffect(() => {
    let mounted = true;

    async function initLibrary() {
      if (!source) return; // Don't initialize if source is not set

      try {
        actions.setLoading(true);

        // Apple Musickit requires browser-side initialization
        if (source === "apple") {
          await initiateAppleAuth("source");
        }

        const { initialData, error } = await fetchInitialLibraryData(source);

        // Check if component is still mounted before updating state
        if (!mounted) return;

        if (error) {
          console.error("Error initializing library:", error);
          actions.setError(error.message);
        } else if (initialData) {
          actions.updateLibrary({
            likedSongs: new Set(initialData.likedSongs),
            albums: new Set(initialData.albums),
            playlists: new Map(initialData.playlists.map((p: IPlaylist) => [p.id, p])),
          });
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to initialize library:", err);
        actions.setError(err instanceof Error ? err.message : "Failed to initialize library");
      } finally {
        if (mounted) {
          actions.setLoading(false);
        }
      }
    }

    const isLibraryEmpty =
      !state?.likedSongs?.size && !state?.albums?.size && !state?.playlists?.size;

    if (isLibraryEmpty && source) {
      initLibrary();
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      mounted = false;
    };
  }, [source, state?.likedSongs, state?.albums, state?.playlists, actions]);

  const isLibraryEmpty =
    !state?.likedSongs?.size && !state?.albums?.size && !state?.playlists?.size;

  if (isLibraryEmpty) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="fade-in relative flex h-[calc(100vh-40px)] flex-col">
      <TransferButton />

      {/* Content Container */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sidebar - Always visible on desktop, slides on mobile */}
        <aside
          role="sidebar"
          aria-label="Library Selection"
          className="w-full overflow-y-auto md:relative md:w-80 md:border-r md:border-indigo-100/10"
        >
          <LibrarySidebar />
        </aside>

        {/* Main Content */}
        <main
          role="main"
          aria-label="Selected Content"
          className="main-content flex-1 overflow-y-auto scroll-smooth p-6"
        >
          <div className="overflow-hidden rounded-xl bg-indigo-50/20 p-6 shadow-sm ring-1 ring-indigo-100 dark:bg-indigo-950/20 dark:ring-indigo-300/10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function LibraryClientContent(props: LibraryClientContentProps) {
  return (
    <LibraryProvider>
      <MatchingProvider>
        <LibraryContent {...props} />
      </MatchingProvider>
    </LibraryProvider>
  );
}
