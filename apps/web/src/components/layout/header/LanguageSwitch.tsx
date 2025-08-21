"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { routing } from "@/i18n/routing";

export const LanguageSwitch = () => {
  const t = useTranslations('Languages');
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (locale: string) => {
    setIsOpen(false);
    
    // Convert search params to object to preserve URL parameters
    const searchParamsObj = Object.fromEntries(searchParams.entries());
    
    router.replace(
      { pathname, query: searchParamsObj },
      { locale }
    );
  };

  // Native language names - always displayed in their own language
  const nativeLanguageNames = {
    'en': 'English',
    'fr': 'Français', 
    'es': 'Español',
    'pt': 'Português',
    'it': 'Italiano',
    'de': 'Deutsch',
    'jp': '日本語'
  } as const;

  const getLanguageName = (locale: string): string => {
    return nativeLanguageNames[locale as keyof typeof nativeLanguageNames] || locale;
  };

  const getCurrentLanguageName = (): string => {
    return getLanguageName(currentLocale);
  };

  return (
    <div className="relative" ref={dropdownRef} style={{ zIndex: 100 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid="language-switch"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-800 transition-colors hover:text-gray-950 dark:text-indigo-300 dark:hover:text-indigo-200"
        aria-label={t('selectLanguage')}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 512 512"
          fill="currentColor"
          role="graphics-symbol"
          aria-label={`${t('currentLanguage')}: ${getCurrentLanguageName()}`}
        >
          <path d="M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"></path>
          <path d="M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"></path>
        </svg>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          data-testid="language-dropdown"
          className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/95"
        >
          {routing.locales.map(locale => (
            <button
              key={locale}
              onClick={() => handleLanguageSelect(locale)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                locale === currentLocale
                  ? "bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {getLanguageName(locale)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};