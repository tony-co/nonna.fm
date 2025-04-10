import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mock-inter-font",
    style: {
      fontFamily: "Inter",
    },
  }),
}));

// Mock matchMedia
const mockMatchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    // Setup DOM API mocks
    vi.stubGlobal("matchMedia", mockMatchMedia);
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();

    // Reset the document's class list before each test
    document.documentElement.classList.remove("dark");
  });

  it("renders the header with logo and navigation", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Check if the logo text is present
    const logoText = screen.getByText(/nonna\.fm/i);
    expect(logoText).toBeInTheDocument();

    // Check for the beta badge
    const betaBadge = screen.getByText(/beta/i);
    expect(betaBadge).toBeInTheDocument();

    // Check for the theme toggle using data-testid
    const themeToggle = screen.getByTestId("theme-toggle");
    expect(themeToggle).toBeInTheDocument();

    // Check for language switch using data-testid
    // todo test language switch once we have intl
    const languageSwitch = screen.getByTestId("language-switch");
    expect(languageSwitch).toBeInTheDocument();
  });

  it("starts with light theme by default", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Verify that dark mode class is not present initially
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("toggles between light and dark themes when clicking the theme button", () => {
    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    const themeToggle = screen.getByTestId("theme-toggle");

    // Initial state should be light theme
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to switch to dark theme
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");

    // Click to switch back to light theme
    fireEvent.click(themeToggle);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("respects system dark mode preference", () => {
    // Mock system dark mode preference
    mockMatchMedia.mockImplementationOnce(query => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    );

    // Should start with dark theme when system prefers dark
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });
});
