import { useEffect, useState } from "react";

/**
 * useIsMobile - React hook to detect if viewport is below the 'lg' Tailwind breakpoint (1024px).
 * Returns true if on mobile, false otherwise.
 * Handles SSR by defaulting to false on the server.
 */
export function useIsMobile(): boolean {
  // Default to false (desktop) for SSR
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Tailwind 'lg' breakpoint is 1024px
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
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
