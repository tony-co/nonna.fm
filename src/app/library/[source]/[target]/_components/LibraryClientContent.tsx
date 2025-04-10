"use client";

import { useEffect, useState, TouchEvent } from "react";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { useLibrary } from "@/contexts/LibraryContext";
import type { IPlaylist } from "@/types/library";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { MusicService } from "@/types/services";
import { initiateAppleAuth } from "@/lib/services/apple/auth";
import { fetchInitialLibraryData } from "@/lib/server/library";
import { usePathname, useRouter } from "next/navigation";

interface LibraryClientContentProps {
  source: MusicService;
  _target: MusicService;
  children: React.ReactNode;
}

function LibraryContent({ source, _target, children }: LibraryClientContentProps) {
  const { state, actions } = useLibrary();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  // Show content when route changes (i.e., when an item is selected)
  useEffect(() => {
    const isHome = pathname.endsWith(`${source}/${_target}`);
    setIsContentVisible(!isHome);
  }, [pathname, source, _target]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance < -50; // Threshold of 50px
    if (isLeftSwipe) {
      setIsContentVisible(false);
      router.push(`/library/${source}/${_target}`);
    }
    // Reset values
    setTouchStart(0);
    setTouchEnd(0);
  };

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
          actions.setError(error.toString());
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

  if (state?.status?.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingOverlay />
      </div>
    );
  }

  if (state?.status?.error) {
    return <div>Error: {state.status.error}</div>;
  }

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
    <div className="flex h-full p-4">
      {/* Content Container */}
      <div className="flex h-full w-full md:flex-row">
        {/* Library Sidebar - Full width on mobile */}
        <aside
          role="sidebar"
          aria-label="Library Selection"
          className={`h-full w-full overflow-y-auto transition-transform duration-300 md:relative md:w-[38rem] md:translate-x-0 md:border-r md:border-indigo-100/10 md:dark:bg-transparent ${
            isContentVisible ? "fixed -translate-x-full md:static md:translate-x-0" : ""
          }`}
        >
          <div className="px-2">
            <LibrarySidebar />
          </div>
        </aside>

        {/* Main Content - Slides in from right on mobile */}
        <main
          role="main"
          aria-label="Selected Content"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`fixed inset-y-0 right-0 z-40 h-full w-full overflow-y-auto pt-14 transition-transform duration-300 sm:pt-16 md:relative md:z-0 md:translate-x-0 md:pt-0 ${
            isContentVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Back Link - Mobile Only */}
          <button
            type="button"
            data-testid="back-to-library"
            onClick={() => {
              setIsContentVisible(false);
              router.push(`/library/${source}/${_target}`);
            }}
            className="container mx-auto flex items-center gap-1 px-4 py-4 text-sm font-medium text-indigo-600 md:hidden dark:text-indigo-400"
            aria-label="Back to library"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Library
          </button>

          <div className="container mx-auto">
            <div className="h-full min-h-full overflow-auto rounded-xl p-4 shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function LibraryClientContent(props: LibraryClientContentProps) {
  return <LibraryContent {...props} />;
}
