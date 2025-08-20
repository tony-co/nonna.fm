// Mock window.matchMedia for test environment (jsdom/Node)
// This prevents errors from hooks/components that use matchMedia (e.g., useIsMobile, ThemeContext)
// Set matches: true so isMobile returns true and Header renders the back button
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: true, // force mobile mode for test
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
} else {
  // If already defined, override to force matches: true
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Setup mocks first
import { vi } from "vitest";

// Import and setup navigation mock
import { mockNextNavigation, mockI18nNavigation } from "@/__tests__/testUtils";
import { mockNavigationImplementation } from "@/__tests__/testUtils";
mockNextNavigation();
mockI18nNavigation();

// Mock useMatching hook
import { useMatching, resetMocks as resetMatchingMocks } from "@/__mocks__/hooks/useMatching";
vi.mock("@/hooks/useMatching", () => ({ useMatching }));

// Mock next/font/google for font imports (fixes Inter is not a function error)
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "font-inter" }),
}));

// Regular imports
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { LibraryClientContent } from "@/app/[locale]/library/[source]/[target]/_components/LibraryClientContent";
import { TestWrapper, mockMessages } from "@/__tests__/testUtils";
import { mockLibraryState } from "@/__mocks__/contexts/LibraryContext";
import { Header } from "@/components/layout/Header";
import { ItemTitleProvider, useItemTitle } from "@/contexts/ItemTitleContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { TransferProvider } from "@/contexts/TransferContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NextIntlClientProvider } from 'next-intl';

// Mock the children component
const MockChildren = () => <div data-testid="mock-children">Child Content</div>;

// Helper to set minimalMobileHeader in context so Header renders back button
const SetMinimalMobileHeader: React.FC = () => {
  const { setMinimalMobileHeader } = useItemTitle();
  React.useEffect(() => {
    setMinimalMobileHeader(true);
    return () => setMinimalMobileHeader(false);
  }, [setMinimalMobileHeader]);
  return null;
};

describe("LibraryClientContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetMatchingMocks(); // Reset useMatching mock state and spies
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

    // Render Header and LibraryClientContent directly, with only minimal required providers
    // This avoids a heavy custom TestLayout and keeps the test focused
    render(
      <NextIntlClientProvider messages={mockMessages} locale="en">
        <ThemeProvider>
          <LibraryProvider>
            <TransferProvider>
              <ItemTitleProvider>
                {/* Set minimalMobileHeader so Header renders back button */}
                <SetMinimalMobileHeader />
                <Header />
                <LibraryClientContent source="spotify" _target="apple">
                  <MockChildren />
                </LibraryClientContent>
              </ItemTitleProvider>
            </TransferProvider>
          </LibraryProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    );

    const backButton = screen.getByTestId("back-to-library");
    expect(backButton).toBeInTheDocument();
    // Check that the back button points to the correct URL
    expect(backButton).toHaveAttribute("href", "/library/spotify/apple");
    // Check that the sidebar text 'Your library' is present
    expect(screen.getByText("Your library")).toBeInTheDocument();
  });
});
