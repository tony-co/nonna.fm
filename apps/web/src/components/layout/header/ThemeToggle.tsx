"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const tAccessibility = useTranslations("Accessibility");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[30px] w-[60px]" />; // Placeholder with same dimensions
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-testid="theme-toggle"
      className={`relative inline-flex h-[30px] w-[60px] items-center justify-between rounded-full p-0.5 ${
        theme === "light"
          ? "bg-gray-300/60 hover:bg-gray-300"
          : "bg-indigo-950/60 hover:bg-indigo-950"
      } focus-visible:ring-primary-500/70 cursor-pointer border-0 transition-colors duration-200 focus:outline-none focus-visible:ring-2`}
      aria-label={
        theme === "dark" ? tAccessibility("switchToLight") : tAccessibility("switchToDark")
      }
    >
      {/* Sliding background */}
      <span
        className={`absolute h-[26px] w-[26px] rounded-full ${theme === "light" ? "translate-x-0 bg-gray-100" : "translate-x-[30px] bg-indigo-900"} transform transition-all duration-200 ease-out`}
      />

      {/* Sun icon - left side */}
      <Sun
        size={14}
        className={`relative z-10 ml-1.5 ${theme === "light" ? "text-gray-800" : "text-gray-500"} transition-colors duration-200`}
        aria-hidden="true"
        aria-label="Light theme"
      />

      {/* Moon icon - right side */}
      <Moon
        size={14}
        className={`relative z-10 mr-1.5 ${theme === "light" ? "text-gray-400" : "text-indigo-200"} transition-colors duration-200`}
        aria-hidden="true"
        aria-label="Dark theme"
      />
    </button>
  );
}
