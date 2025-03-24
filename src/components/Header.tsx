"use client";

import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitch } from "./LanguageSwitch";
import { NonnaLogo } from "./icons/NonnaLogo";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
});

export const Header = () => {
  return (
    <header
      className={`
        relative w-full backdrop-blur
        transition-colors duration-200 ease-in-out
      `}
      style={{ zIndex: 50 }}
    >
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <NonnaLogo className="size-8 font-black dark:text-white" />
              <div className="flex items-center gap-2">
                <span
                  className={`${inter.className} text-2xl font-black uppercase italic text-gray-900 dark:text-white`}
                >
                  nonna.fm
                </span>
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                  Beta
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <LanguageSwitch />
            <ThemeToggle />

            {/* GitHub Link */}
            <a
              href="https://github.com/tony-co/nonna.fm"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-2 text-gray-800 transition-colors duration-200 ease-in-out hover:text-gray-950 dark:text-indigo-300 dark:hover:text-indigo-200"
              aria-label="View on GitHub"
            >
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
