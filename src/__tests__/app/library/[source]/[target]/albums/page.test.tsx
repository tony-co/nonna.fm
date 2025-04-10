// Setup mocks first
import { vi } from "vitest";

// Import and setup navigation mock
import { mockNextNavigation, mockReactSuspense } from "@/__tests__/testUtils";
mockNextNavigation();
mockReactSuspense();

// Mock MatchingContext
import * as MatchingContextMock from "@/__mocks__/contexts/MatchingContext";
vi.mock("@/contexts/MatchingContext", () => MatchingContextMock);

// Regular imports
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import AlbumsPage from "@/app/library/[source]/[target]/albums/page";
import { TestWrapper } from "@/__tests__/testUtils";
import { mockAlbums } from "@/__mocks__/data/libraryData";

describe("AlbumsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner while loading", () => {
    render(
      <TestWrapper initialLoading={true}>
        <AlbumsPage />
      </TestWrapper>
    );

    expect(screen.getByRole("loading")).toBeInTheDocument();
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

    expect(screen.getByText("3 albums • 1 unmatched")).toBeInTheDocument();
  });

  it("renders album details correctly", () => {
    render(
      <TestWrapper initialLoading={false}>
        <AlbumsPage />
      </TestWrapper>
    );

    const albumList = screen.getByRole("albumlist");
    const albums = within(albumList).getAllByRole("album");

    expect(albums).toHaveLength(mockAlbums.length);

    // Check each album from our mock data
    mockAlbums.forEach(album => {
      expect(screen.getByText(album.name)).toBeInTheDocument();
      expect(screen.getByText(album.artist)).toBeInTheDocument();
    });
  });
});
