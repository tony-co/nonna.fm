"use client";

import { useEffect, useState, useCallback } from "react";
import { LibrarySidebar } from "@/components/layout/Sidebar";
import { useLibrary } from "@/contexts/LibraryContext";
import type { IPlaylist } from "@/types/library";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { MusicService } from "@/types/services";
import { authorizeAppleMusic } from "@/lib/services/apple/api";
import { fetchInitialLibraryData } from "@/lib/server/library";
import { usePathname } from "next/navigation";
import { useItemTitle } from "@/contexts/ItemTitleContext";

interface LibraryClientContentProps {
  source: MusicService;
  _target: MusicService;
  children: React.ReactNode;
}

function LibraryContent({ source, _target, children }: LibraryClientContentProps) {
  const { state, actions } = useLibrary();
  const { setShowTitle } = useItemTitle();
  const [isContentVisible, setIsContentVisible] = useState(false);
  const pathname = usePathname();
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null);
  const mainRef = useCallback((node: HTMLElement | null) => {
    setMainEl(node);
  }, []);

  // Show content when route changes (i.e., when an item is selected)
  useEffect(() => {
    const isHome = pathname.endsWith(`${source}/${_target}`);
    setIsContentVisible(!isHome);
  }, [pathname, source, _target]);

  // Effect to observe the h1 within the main content area
  useEffect(() => {
    if (!isContentVisible || !setShowTitle) {
      setShowTitle(false);
      return;
    }

    if (!mainEl) {
      // Wait for main element to be set
      return;
    }

    const scrollContainer = mainEl;
    let intersectionObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    function attachIntersectionObserver() {
      const h1Element = scrollContainer.querySelector("h1");

      if (!h1Element) return false;
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          setShowTitle(!entry.isIntersecting);
        },
        {
          root: scrollContainer,
          rootMargin: "0px",
          threshold: 0.1,
        }
      );
      intersectionObserver.observe(h1Element);
      return true;
    }

    // Try to attach immediately
    if (!attachIntersectionObserver()) {
      // If h1 is not present, observe for DOM changes
      mutationObserver = new MutationObserver(() => {
        if (attachIntersectionObserver()) {
          // Once attached, disconnect mutation observer
          if (mutationObserver) mutationObserver.disconnect();
        }
      });
      mutationObserver.observe(scrollContainer, { childList: true, subtree: true });
    }

    return () => {
      if (intersectionObserver) intersectionObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [isContentVisible, setShowTitle, mainEl]);

  // Initialize library
  useEffect(() => {
    let mounted = true;

    async function initLibrary() {
      if (!source) return; // Don't initialize if source is not set

      try {
        actions.setLoading(true);

        // Apple Musickit requires browser-side initialization
        if (source === "apple") {
          await authorizeAppleMusic("source");
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
    <div className="flex h-full">
      {/* Content Container */}
      <div className="flex h-full w-full md:flex-row">
        {/* Library Sidebar - Full width on mobile, height based on content. Full height on desktop */}
        <aside
          role="sidebar"
          aria-label="Library Selection"
          // DEBUG: Removed temporary background
          // Removed h-full for mobile, added md:h-full for desktop
          className={`w-full overflow-y-auto transition-transform duration-300 md:relative md:h-full md:w-[38rem] md:translate-x-0 md:border-r md:border-indigo-100/10 md:dark:bg-transparent ${
            // Note: md:dark:bg-transparent might override debug color on desktop dark mode
            isContentVisible ? "fixed -translate-x-full md:static md:translate-x-0" : ""
          }`}
        >
          <LibrarySidebar />
        </aside>

        {/* Main Content - Slides in from right on mobile */}
        <main
          ref={mainRef}
          role="main"
          aria-label="Selected Content"
          className={`fixed inset-y-0 right-0 z-40 h-full w-full overflow-y-auto pb-16 pt-14 transition-transform duration-300 sm:pt-16 md:relative md:z-0 md:translate-x-0 md:pb-0 md:pt-0 ${
            isContentVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="rounded-xl p-4 pb-12 shadow-sm md:p-6 md:pb-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function LibraryClientContent(props: LibraryClientContentProps) {
  return <LibraryContent {...props} />;
}
