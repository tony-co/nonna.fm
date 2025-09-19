"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export const LanguageSwitch = () => {
  const t = useTranslations("Languages");
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

    router.replace({ pathname, query: searchParamsObj }, { locale });
  };

  // Native language names - always displayed in their own language
  const nativeLanguageNames = {
    en: "English",
    fr: "Français",
    es: "Español",
    pt: "Português",
    it: "Italiano",
    de: "Deutsch",
    ja: "日本語",
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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="language-switch"
        className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-800 transition-colors hover:text-gray-950 dark:text-indigo-300 dark:hover:text-indigo-200"
        aria-label={t("selectLanguage")}
      >
        <Languages size={20} aria-label={`${t("currentLanguage")}: ${getCurrentLanguageName()}`} />
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
          aria-label="Toggle dropdown"
        />
      </button>

      {isOpen && (
        <div
          data-testid="language-dropdown"
          className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/95"
        >
          {routing.locales.map(locale => (
            <button
              type="button"
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
