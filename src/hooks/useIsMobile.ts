import { useEffect, useState } from "react";

/**
 * useIsMobile - React hook to detect if viewport is below the 'sm' Tailwind breakpoint (640px).
 * Returns true if on mobile, false otherwise.
 * Handles SSR by defaulting to false on the server.
 */
export function useIsMobile(): boolean {
  // Default to false (desktop) for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Tailwind 'sm' breakpoint is 640px
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    // Handler to update state
    const handleChange: () => void = () => setIsMobile(mediaQuery.matches);
    // Set initial value
    handleChange();
    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
