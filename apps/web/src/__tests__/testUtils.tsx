import { vi } from "vitest";
import React from "react";
import { NextIntlClientProvider } from 'next-intl';
import { mockLibraryState, LibraryProvider, useLibrary } from "@/__mocks__/contexts/LibraryContext";
import { TransferProvider } from "@/contexts/TransferContext";

// Mock messages for testing
export const mockMessages = {
  Metadata: {
    title: "Nonna.fm",
    description: "Transfer your music library between streaming services seamlessly",
    appName: "Nonna.fm"
  },
  Common: {
    loading: "Loading...",
    loadingUsage: "Loading usage...",
    back: "Back",
    beta: "Beta",
    language: "Language",
    theme: "Theme",
    privacy: "Privacy",
    terms: "Terms",
    github: "GitHub",
    item: "Item"
  },
  HomePage: {
    hero: {
      title: "Your Music, Anywhere",
      subtitle: "Move your playlists between streaming platforms easily."
    },
    features: {
      freeTitle: "Generous Free Plan",
      freeDescription: "500 transfers for free everyday.\nUpgrade to Premium for 10x more.",
      secureTitle: "Secure and private",
      secureDescription: "We do not sell your data.\nOur code is open source for full transparency."
    },
    steps: {
      selectSource: "Select your source:"
    },
    connectWith: "Connect with",
    loadingLibrary: "Loading your library",
    loadingSubtitle: "Just a moment while we get everything ready"
  },
  Library: {
    title: "Your library",
    subtitle: "Select items to transfer",
    likedSongs: "Liked Songs",
    songs: "songs",
    tracks: "tracks",
    tracksCount: "{count} tracks",
    unmatchedCount: "• {count} unmatched",
    trackList: {
      number: "#",
      title: "Title",
      album: "Album",
      status: "Status",
      emptyPlaylist: "This playlist seems to be empty"
    }
  },
  Errors: {
    spotifyAuthFailed: "Spotify authentication failed. Please try again.",
    spotifyAuthError: "An error occurred during Spotify authentication.",
    youtubeAuthFailed: "YouTube Music authentication failed. Please try again.",
    youtubeAuthError: "An error occurred during YouTube Music authentication.",
    notAuthenticated: "Please authenticate with a music service to continue."
  },
  Services: {
    spotify: "Spotify",
    youtubeMusic: "YouTube Music",
    deezer: "Deezer",
    appleMusic: "Apple Music",
    amazonMusic: "Amazon Music",
    tidal: "Tidal",
    pandora: "Pandora"
  },
  Transfer: {
    playOn: "Play on {service}",
    successTitle: "Enjoy your {count} tracks on",
    likedSongs: "Liked Songs",
    albums: "Albums",
    button: {
      findingMatches: "Finding Matches...",
      transferring: "Transferring...",
      startTransfer: "Start Transfer",
      transfersLeft: "transfers left",
      likedTracks: "liked tracks",
      albums: "albums",
      playlists: "playlists"
    },
    limitModal: {
      title: "Transfer Limit",
      freePlan: "Free Plan",
      premiumPlan: "Premium Plan",
      goPremium: "Go Premium",
      plans: "Plans"
    }
  },
  SpotifyConsent: {
    title: "Before using Spotify with Nonna.fm, please note:",
    warning: "While using our service with Spotify, please be aware:"
  }
};

// Mock useTransferLimits hook
vi.mock("@/hooks/useTransferLimits", () => ({
  useTransferLimits: () => ({
    status: {
      isPremium: false,
      dailyLimit: 10,
      currentUsage: 0,
      availableToday: 10,
    },
    loading: false,
    error: null,
    updateUsage: vi.fn(),
    checkLimit: vi.fn(),
    refreshStatus: vi.fn(),
    isLimitExceededModalOpen: false,
    setIsLimitExceededModalOpen: vi.fn(),
    selectedCountForModal: 0,
  }),
}));

// Create mock implementations that can be imported and reused
export const mockNavigationImplementation = {
  useParams: () => ({ source: "spotify", target: "apple" }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    route: "/library/spotify/apple",
    pathname: "/library/spotify/apple",
  }),
  usePathname: () => "/library/spotify/apple",
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
};

// For individual test overrides
export const mockNextNavigation = () => {
  return vi.mock("next/navigation", () => ({
    useRouter: () => mockNavigationImplementation.useRouter(),
    usePathname: () => mockNavigationImplementation.usePathname(),
    useParams: () => mockNavigationImplementation.useParams(),
    useSearchParams: () => mockNavigationImplementation.useSearchParams(),
    redirect: mockNavigationImplementation.redirect,
    permanentRedirect: mockNavigationImplementation.permanentRedirect,
    notFound: mockNavigationImplementation.notFound,
  }));
};

// Mock i18n navigation hooks
export const mockI18nNavigation = () => {
  return vi.mock("@/i18n/navigation", () => ({
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/library/spotify/apple",
    redirect: vi.fn(),
    permanentRedirect: vi.fn(),
    notFound: vi.fn(),
    Link: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => React.createElement('a', props, children),
    getPathname: vi.fn(() => '/library/spotify/apple'),
  }));
};

// Create a component to check loading state from context
const SuspenseContent = ({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { state } = useLibrary();
  return state.status.isLoading ? fallback : children;
};

// Mock React's Suspense to use the loading state from context
export const mockReactSuspense = () => {
  vi.mock("react", async () => {
    const actual = await vi.importActual("react");
    return {
      ...actual,
      Suspense: ({
        fallback,
        children,
      }: {
        fallback: React.ReactNode;
        children: React.ReactNode;
      }) => <SuspenseContent fallback={fallback}>{children}</SuspenseContent>,
    };
  });
};

// Create a flexible wrapper component that can handle both simple and complex test scenarios
export const TestWrapper = ({
  children,
  initialLoading = false,
  initialState,
  locale = 'en',
}: {
  children: React.ReactNode;
  initialLoading?: boolean;
  initialState?: typeof mockLibraryState;
  locale?: string;
}) => {
  // Create initial state with loading status
  const state = initialState || {
    ...mockLibraryState,
    status: {
      ...mockLibraryState.status,
      isLoading: initialLoading,
    },
  };

  return (
    <NextIntlClientProvider messages={mockMessages} locale={locale}>
      <LibraryProvider initialState={state}>
        <TransferProvider>{children}</TransferProvider>
      </LibraryProvider>
    </NextIntlClientProvider>
  );
};
