"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
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
      onClick={toggleTheme}
      data-testid="theme-toggle"
      className={`
        relative inline-flex h-[30px] w-[60px] items-center justify-between rounded-full p-0.5
        ${
          theme === "light"
            ? "bg-gray-300/60 hover:bg-gray-300"
            : "bg-indigo-950/60 hover:bg-indigo-950"
        }
        focus-visible:ring-primary-500/70 cursor-pointer
        border-0 transition-colors duration-200
        focus:outline-none focus-visible:ring-2
      `}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Sliding background */}
      <span
        className={`
          absolute h-[26px] w-[26px] rounded-full
          ${theme === "light" ? "translate-x-0 bg-gray-100" : "translate-x-[30px] bg-indigo-900"}
          transform transition-all duration-200 ease-out
        `}
      />

      {/* Sun icon - left side */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          relative z-10 ml-1.5
          ${theme === "light" ? "text-gray-800" : "text-gray-500"}
          transition-colors duration-200
        `}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon icon - right side */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          relative z-10 mr-1.5
          ${theme === "light" ? "text-gray-400" : "text-indigo-200"}
          transition-colors duration-200
        `}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
