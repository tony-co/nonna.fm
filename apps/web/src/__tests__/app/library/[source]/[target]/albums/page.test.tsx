// Setup mocks first
import { vi } from "vitest";

// Import and setup navigation mock
import { mockNextNavigation, mockReactSuspense } from "@/__tests__/testUtils";

mockNextNavigation();
mockReactSuspense();

// Mock useMatching hook
import { resetMocks as resetMatchingMocks, useMatching } from "@/__mocks__/hooks/useMatching";

vi.mock("@/hooks/useMatching", () => ({ useMatching }));

// Mock PlayOnButton component to avoid dependency issues in tests
vi.mock("@/components/shared/PlayOnButton", () => ({
  PlayOnButton: () => null,
}));

// Mock getServiceType to return a default value (e.g., 'spotify')
vi.mock("@/lib/auth/constants", () => ({
  getServiceType: () => "spotify",
}));

import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { mockAlbums } from "@/__mocks__/data/libraryData";
import { TestWrapper } from "@/__tests__/testUtils";
import AlbumsPage from "@/app/[locale]/library/[source]/[target]/albums/page";

describe("AlbumsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMatchingMocks(); // Reset useMatching mock state and spies
  });

  it("renders loading spinner while loading", () => {
    render(
      <TestWrapper initialLoading={true}>
        <AlbumsPage />
      </TestWrapper>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders albums when loaded", () => {
    render(
      <TestWrapper initialLoading={false}>
        <AlbumsPage />
      </TestWrapper>
    );

    expect(screen.getByText("Albums")).toBeInTheDocument();
    expect(screen.getByText(/3(\s+)albums/)).toBeInTheDocument();
  });

  it("displays unmatched albums count when there are unmatched albums", () => {
    render(
      <TestWrapper initialLoading={false}>
        <AlbumsPage />
      </TestWrapper>
    );

    expect(screen.getByText("3 albums")).toBeInTheDocument();
    expect(screen.getByText(/1 unmatched/i)).toBeInTheDocument();
  });

  it("renders album details correctly", () => {
    render(
      <TestWrapper initialLoading={false}>
        <AlbumsPage />
      </TestWrapper>
    );

    const albumList = screen.getByTestId("albumlist");
    const albums = within(albumList).getAllByTestId("album");

    expect(albums).toHaveLength(mockAlbums.length);

    // Check each album from our mock data
    mockAlbums.forEach(album => {
      expect(screen.getByText(album.name)).toBeInTheDocument();
      expect(screen.getByText(album.artist)).toBeInTheDocument();
    });
  });
});
