import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { Menu, Languages, Sun, Shield, FileText } from "lucide-react";
import Dialog from "@/components/shared/Dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";
const GITHUB_REPO = "https://github.com/tony-co/nonna.fm";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MobileMenu = ({ isOpen, onOpenChange }: MobileMenuProps) => {
  const tAccessibility = useTranslations("Accessibility");
  const tDialogs = useTranslations("Dialogs");
  const tCommon = useTranslations("Common");
  const tUI = useTranslations("UI");
  const tFooter = useTranslations("Footer");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  const handleLanguageSelect = (locale: string) => {
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

  return (
    <>
      {/* Menu button: opens the dialog */}
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
        aria-label={tAccessibility("openMenu")}
      >
        <Menu className="size-6" />
      </button>

      {/* Portal for Dialog modal for mobile menu */}
      {isOpen &&
        createPortal(
          <Dialog isOpen={isOpen} onClose={() => onOpenChange(false)} title={tDialogs("settings")}>
            {/* Menu Items */}
            <div className="flex flex-col px-4">
              {/* Language Selection */}
              <div className="my-1 rounded-lg px-2 py-4">
                <div className="mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
                  <Languages className="size-6" />
                  <span className="text-[17px]">{tCommon("language")}</span>
                </div>
                <select
                  value={currentLocale}
                  onChange={e => handleLanguageSelect(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2 text-[15px] text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  aria-label={tAccessibility("selectLanguage")}
                >
                  {routing.locales.map(locale => (
                    <option
                      key={locale}
                      value={locale}
                      className="bg-white text-gray-900 dark:bg-[#0A0A1B] dark:text-white"
                    >
                      {getLanguageName(locale)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selection */}
              <div className="my-1 rounded-lg px-2 py-4">
                <div className="mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                  <Sun className="size-6" />
                  <span className="text-[17px]">{tUI("theme")}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => theme !== "light" && toggleTheme()}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${
                      theme === "light"
                        ? "border-indigo-600 bg-gray-100"
                        : "border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-white">
                      <span className="text-2xl font-medium text-gray-900">Aa</span>
                    </div>
                    <p className="mt-2 text-center text-[15px] font-medium text-gray-900 dark:text-white">
                      {tUI("light")}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => theme !== "dark" && toggleTheme()}
                    className={`relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${
                      theme === "dark"
                        ? "border-indigo-600 bg-white/10"
                        : "border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-[#1c1c1c]">
                      <span className="text-2xl font-medium text-white">Aa</span>
                    </div>
                    <p className="mt-2 text-center text-[15px] font-medium text-gray-900 dark:text-white">
                      {tUI("dark")}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="p-8">
              <button
                type="button"
                className="w-full rounded-full bg-indigo-600 py-3.5 text-center text-[17px] font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
                onClick={() => onOpenChange(false)}
              >
                {tUI("close")}
              </button>
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-200 px-4 py-8 dark:border-white/10">
              <div className="flex flex-row justify-between">
                <a
                  href={`${GITHUB_BASE_URL}/PRIVACY.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                >
                  <Shield className="mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
                  <span className="text-sm">{tFooter("privacy")}</span>
                </a>
                <a
                  href={`${GITHUB_BASE_URL}/TERMS.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                >
                  <FileText className="mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100" />
                  <span className="text-sm">{tFooter("terms")}</span>
                </a>
                <a
                  href={GITHUB_REPO}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                >
                  <svg
                    className="mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="GitHub logo"
                  >
                    <title>GitHub</title>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>
          </Dialog>,
          document.body
        )}
    </>
  );
};
