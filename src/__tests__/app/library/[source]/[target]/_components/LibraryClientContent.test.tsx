// Setup mocks first
import { vi } from "vitest";

// Import and setup navigation mock
import { mockNextNavigation } from "@/__tests__/testUtils";
import { mockNavigationImplementation } from "@/__tests__/testUtils";
mockNextNavigation();

// Mock MatchingContext
import * as MatchingContextMock from "@/__mocks__/contexts/MatchingContext";
vi.mock("@/contexts/MatchingContext", () => MatchingContextMock);

// Regular imports
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LibraryClientContent } from "@/app/library/[source]/[target]/_components/LibraryClientContent";
import { TestWrapper } from "@/__tests__/testUtils";
import { mockLibraryState } from "@/__mocks__/contexts/LibraryContext";

// Mock the children component
const MockChildren = () => <div data-testid="mock-children">Child Content</div>;

describe("LibraryClientContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when data is loading", () => {
    render(
      <TestWrapper initialLoading={true}>
        <LibraryClientContent source="spotify" _target="apple">
          <MockChildren />
        </LibraryClientContent>
      </TestWrapper>
    );

    expect(screen.getByText(/Loading your library/i)).toBeInTheDocument();
    expect(screen.queryByTestId("mock-children")).not.toBeInTheDocument();
  });

  it("renders error state when there is an error", async () => {
    const errorState = {
      ...mockLibraryState,
      status: {
        isLoading: false,
        error: "Failed to load library",
      },
    };

    render(
      <TestWrapper initialLoading={false} initialState={errorState}>
        <LibraryClientContent source="spotify" _target="apple">
          <MockChildren />
        </LibraryClientContent>
      </TestWrapper>
    );

    expect(screen.getByText("Error: Failed to load library")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-children")).not.toBeInTheDocument();
  });

  it("renders sidebar and children when library is loaded", () => {
    render(
      <TestWrapper initialLoading={false}>
        <LibraryClientContent source="spotify" _target="apple">
          <MockChildren />
        </LibraryClientContent>
      </TestWrapper>
    );

    expect(screen.getByRole("sidebar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByTestId("mock-children")).toBeInTheDocument();
  });

  it("navigates back to library on mobile back button click", async () => {
    // Set up router mock with spy
    const routerPushSpy = vi.fn();
    const baseRouter = mockNavigationImplementation.useRouter();
    vi.spyOn(mockNavigationImplementation, "useRouter").mockImplementation(() => ({
      ...baseRouter,
      push: routerPushSpy,
    }));

    // Mock pathname to be on the liked songs view
    vi.spyOn(mockNavigationImplementation, "usePathname").mockReturnValue(
      "/library/spotify/apple/liked"
    );

    render(
      <TestWrapper initialLoading={false}>
        <LibraryClientContent source="spotify" _target="apple">
          <MockChildren />
        </LibraryClientContent>
      </TestWrapper>
    );

    const backButton = screen.getByTestId("back-to-library");
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);

    // Wait for animation to complete (300ms) and navigation to be called
    await waitFor(
      () => {
        expect(routerPushSpy).toHaveBeenCalledWith("/library/spotify/apple");
      },
      {
        timeout: 400, // Set timeout slightly higher than animation duration
      }
    );
  });

  it("handles touch gestures correctly", async () => {
    // Set up router mock with spy
    const routerPushSpy = vi.fn();
    const baseRouter = mockNavigationImplementation.useRouter();
    vi.spyOn(mockNavigationImplementation, "useRouter").mockImplementation(() => ({
      ...baseRouter,
      push: routerPushSpy,
    }));

    // Mock pathname to be on the liked songs view
    vi.spyOn(mockNavigationImplementation, "usePathname").mockReturnValue(
      "/library/spotify/apple/liked"
    );

    render(
      <TestWrapper initialLoading={false}>
        <LibraryClientContent source="spotify" _target="apple">
          <MockChildren />
        </LibraryClientContent>
      </TestWrapper>
    );

    const mainContent = screen.getByRole("main");

    // Simulate touch start
    fireEvent.touchStart(mainContent, {
      targetTouches: [{ clientX: 100 }],
    });

    // Simulate touch move - move right by 150px which should trigger navigation
    fireEvent.touchMove(mainContent, {
      targetTouches: [{ clientX: 250 }],
    });

    // Simulate touch end
    fireEvent.touchEnd(mainContent);

    // Wait for animation to complete (300ms) and navigation to be called
    await waitFor(
      () => {
        expect(routerPushSpy).toHaveBeenCalledWith("/library/spotify/apple");
      },
      {
        timeout: 400, // Set timeout slightly higher than animation duration
      }
    );
  });
});
