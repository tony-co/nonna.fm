"use client";

import { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { TransferUsageDisplay } from "../shared/TransferUsageDisplay";
import { ThemeToggle } from "./header/ThemeToggle";
import { LanguageSwitch } from "./header/LanguageSwitch";
import { MobileMenu } from "./header/MobileMenu";
import { NonnaLogo } from "../icons/NonnaLogo";
import { Inter } from "next/font/google";
import Link from "next/link";
import { useItemTitle } from "@/contexts/ItemTitleContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
});

// Remove props for minimal mobile header
// interface HeaderProps {
//   minimalMobileHeader?: boolean; // Show minimal header on mobile
//   itemTitle?: string; // Title to display in minimal header
//   backHref?: string; // Back link URL
// }

// Remove props from Header
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLibraryPage = pathname?.startsWith("/library");
  const { itemTitle, minimalMobileHeader, showTitle } = useItemTitle();
  const params = useParams();
  const source = params?.source as string;
  const target = params?.target as string;
  // Compute backHref for detail pages
  const backHref = source && target ? `/library/${source}/${target}` : "/library";

  // If minimalMobileHeader is true, render both headers and use CSS to show/hide
  if (minimalMobileHeader) {
    return (
      <>
        {/* Mobile Minimal Header (Visible by default, hidden on lg screens) */}
        <header className="relative w-full backdrop-blur-xl transition-colors duration-200 ease-in-out lg:hidden">
          <div className="container mx-auto">
            <div className="relative flex h-14 w-full items-center justify-center">
              <Link
                href={backHref}
                className="absolute left-0 flex items-center px-4 text-gray-900 hover:underline focus:outline-none dark:text-white"
                aria-label="Back"
                data-testid="back-to-library"
              >
                <svg
                  className="mr-2 size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="sr-only">Back</span>
              </Link>
              <span
                className={`
                  mx-auto max-w-[65%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-center text-lg font-semibold
                  transition duration-300 ease-out
                  ${showTitle ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}
                `}
                title={itemTitle || "Item"}
              >
                {itemTitle || "Item"}
              </span>
            </div>
          </div>
        </header>

        {/* Desktop Header (Hidden by default, shown on lg screens) */}
        <header
          className={`
            relative hidden w-full backdrop-blur-xl
            transition-colors duration-200 ease-in-out lg:block
        `}
        >
          <div className="container mx-auto px-2">
            {/* Use lg:h-16 for desktop height */}
            <div className="relative flex h-14 items-center justify-between lg:h-16">
              <div className="flex items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-1.5 lg:gap-2">
                  {/* Use lg:size-8 for desktop logo */}
                  <NonnaLogo className="size-6 font-black lg:size-8 dark:text-white" />
                  <div className="flex items-center gap-1 pt-0.5 lg:gap-2">
                    <span
                      // Keep existing lg:text-xl
                      className={`${inter.className} text-md font-black uppercase italic leading-none text-gray-900 lg:text-xl dark:text-white`}
                    >
                      nonna.fm
                    </span>
                    {/* Use lg:inline-block for desktop beta badge */}
                    <span className="hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 lg:inline-block dark:bg-indigo-900/50 dark:text-indigo-300">
                      Beta
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation (Hidden by default, shown on lg screens) */}
              <div className="hidden items-center gap-8 lg:flex">
                {/* Show TransferUsageDisplay only on library page and desktop */}
                {isLibraryPage && <TransferUsageDisplay />}
                <LanguageSwitch />
                <ThemeToggle />
              </div>

              {/* Mobile Menu + TransferUsageDisplay (Shown by default, hidden on lg screens) */}
              {/* Note: This section might be redundant if the minimal header handles mobile menu, review needed */}
              {/* Keeping it for now, but applying lg:hidden */}
              <div className="flex items-center gap-2 lg:hidden">
                {/* Show TransferUsageDisplay only on library page and mobile */}
                {isLibraryPage && <TransferUsageDisplay />}
                <MobileMenu onOpenChange={setIsMenuOpen} isOpen={isMenuOpen} />
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  // Default Header (when minimalMobileHeader is false)
  return (
    <header
      className={`
        relative w-full backdrop-blur-xl
        transition-colors duration-200 ease-in-out
      `}
    >
      <div className="container mx-auto px-2">
        {/* Use lg:h-16 for desktop height */}
        <div className="relative flex h-14 items-center justify-between lg:h-16">
          {/* Use lg:gap-8 for desktop */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Use lg:gap-2 for desktop */}
            <div className="flex items-center gap-1.5 lg:gap-2">
              {/* Use lg:size-8 for desktop */}
              <NonnaLogo className="size-6 font-black lg:size-8 dark:text-white" />
              {/* Use lg:gap-2 for desktop */}
              <div className="flex items-center gap-1 pt-0.5 lg:gap-2">
                <span
                  // Keep existing lg:text-xl
                  className={`${inter.className} text-md font-black uppercase italic leading-none text-gray-900 lg:text-xl dark:text-white`}
                >
                  nonna.fm
                </span>
                {/* Use lg:inline-block for desktop */}
                <span className="hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 lg:inline-block dark:bg-indigo-900/50 dark:text-indigo-300">
                  Beta
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation (Hidden by default, shown on lg screens) */}
          <div className="hidden items-center gap-8 lg:flex">
            {/* Show TransferUsageDisplay only on library page and desktop */}
            {isLibraryPage && <TransferUsageDisplay />}
            <LanguageSwitch />
            <ThemeToggle />
          </div>

          {/* Mobile Menu + TransferUsageDisplay (Shown by default, hidden on lg screens) */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Show TransferUsageDisplay only on library page and mobile */}
            {isLibraryPage && <TransferUsageDisplay />}
            <MobileMenu onOpenChange={setIsMenuOpen} isOpen={isMenuOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};
