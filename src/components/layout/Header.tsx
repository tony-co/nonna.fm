"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { TransferUsageDisplay } from "../shared/TransferUsageDisplay";
import { ThemeToggle } from "./header/ThemeToggle";
import { LanguageSwitch } from "./header/LanguageSwitch";
import { MobileMenu } from "./header/MobileMenu";
import { NonnaLogo } from "../icons/NonnaLogo";
import { Inter } from "next/font/google";
import { useIsMobile } from "@/hooks/useIsMobile";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
});

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLibraryPage = pathname?.startsWith("/library");
  const isMobile = useIsMobile();

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
