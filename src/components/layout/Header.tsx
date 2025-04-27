"use client";

import { useState } from "react";
import { usePathname, useParams } from "next/navigation";
import { TransferUsageDisplay } from "../shared/TransferUsageDisplay";
import { ThemeToggle } from "./header/ThemeToggle";
import { LanguageSwitch } from "./header/LanguageSwitch";
import { MobileMenu } from "./header/MobileMenu";
import { NonnaLogo } from "../icons/NonnaLogo";
import { Inter } from "next/font/google";
import { useIsMobile } from "@/hooks/useIsMobile";
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
  const isMobile = useIsMobile();
  const { itemTitle, minimalMobileHeader, showTitle } = useItemTitle();
  const params = useParams();
  const source = params?.source as string;
  const target = params?.target as string;
  // Compute backHref for detail pages
  const backHref = `/library/${source}/${target}`;

  // Remove local showTitle state and useEffect
  // const [showTitle, setShowTitle] = useState(false);
  // useEffect(() => { ... IntersectionObserver logic ... }, [minimalMobileHeader, isMobile]);

  // If minimalMobileHeader is true and on mobile, render minimal header
  if (minimalMobileHeader && isMobile) {
    return (
      <header
        className="relative w-full backdrop-blur transition-colors duration-200 ease-in-out sm:hidden"
        style={{ zIndex: 50 }}
      >
        <div className="container mx-auto">
          {/* Use w-full for the flex container to prevent overflow and horizontal scroll on mobile */}
          <div className="relative flex h-14 w-full items-center justify-center">
            {/* Back link: Absolutely positioned to the left, so it doesn't affect centering */}
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
            {/* Centered, truncated item title. Use showTitle from context. */}
            <span
              className={`
                mx-auto max-w-[65%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-center text-lg font-semibold
                transition duration-300 ease-out
                ${showTitle ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}
              `}
              title={itemTitle || "Item"}
            >
              {/* Always render the title text; CSS handles visibility/animation */}
              {itemTitle || "Item"}
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header
        className={`
          relative w-full backdrop-blur
        transition-colors duration-200 ease-in-out
      `}
        style={{ zIndex: 50 }}
      >
        <div className="container mx-auto px-2">
          <div className="relative flex h-14 items-center justify-between sm:h-16">
            <div className="flex items-center gap-4 sm:gap-8">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <NonnaLogo className="size-6 font-black sm:size-8 dark:text-white" />
                <div className="flex items-center gap-1 pt-0.5 sm:gap-2">
                  <span
                    className={`${inter.className} text-md font-black uppercase italic leading-none text-gray-900 lg:text-xl dark:text-white`}
                  >
                    nonna.fm
                  </span>
                  <span className="hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 sm:inline-block dark:bg-indigo-900/50 dark:text-indigo-300">
                    Beta
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 sm:flex">
              {/* Only render TransferUsageDisplay on desktop if on library page and not mobile */}
              {isLibraryPage && !isMobile && <TransferUsageDisplay />}
              <LanguageSwitch />
              <ThemeToggle />
            </div>

            {/* Mobile Menu + TransferUsageDisplay (Mobile Only) */}
            <div className="flex items-center gap-2 sm:hidden">
              {/* Only render TransferUsageDisplay on mobile if on library page and isMobile */}
              {isLibraryPage && isMobile && <TransferUsageDisplay />}
              <MobileMenu onOpenChange={setIsMenuOpen} isOpen={isMenuOpen} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
