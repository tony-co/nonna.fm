import { vi } from "vitest";
import React from "react";
import { mockLibraryState, LibraryProvider, useLibrary } from "@/__mocks__/contexts/LibraryContext";
import * as MatchingContextMock from "@/__mocks__/contexts/MatchingContext";
import { TransferProvider } from "@/contexts/TransferContext";

// Mock the MatchingContext module to use our mock implementation
vi.mock("@/contexts/MatchingContext", () => MatchingContextMock);

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
};

// For individual test overrides
export const mockNextNavigation = () => {
  return vi.mock("next/navigation", () => ({
    useRouter: () => mockNavigationImplementation.useRouter(),
    usePathname: () => mockNavigationImplementation.usePathname(),
    useParams: () => mockNavigationImplementation.useParams(),
    useSearchParams: () => mockNavigationImplementation.useSearchParams(),
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
}: {
  children: React.ReactNode;
  initialLoading?: boolean;
  initialState?: typeof mockLibraryState;
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
    <MatchingContextMock.MatchingProvider>
      <LibraryProvider initialState={state}>
        <TransferProvider>{children}</TransferProvider>
      </LibraryProvider>
    </MatchingContextMock.MatchingProvider>
  );
};
