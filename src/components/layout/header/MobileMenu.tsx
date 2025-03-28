import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";
const GITHUB_REPO = "https://github.com/tony-co/nonna.fm";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "简体中文" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "ko", name: "한국어" },
  { code: "fa", name: "فارسی" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MobileMenu = ({ isOpen, onOpenChange }: MobileMenuProps) => {
  const [selectedLang, setSelectedLang] = useState("en");
  const { theme, toggleTheme } = useTheme();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLang(langCode);
    // todo: handle language change
  };

  return (
    <>
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
        aria-label="Open menu"
      >
        <svg
          className="size-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Bottom sheet modal */}
      {isOpen && (
        <div className="fixed inset-0 left-0 right-0 top-0 z-[9999] flex flex-col">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/80"
            onClick={() => onOpenChange(false)}
          />

          <div
            className="relative mt-auto w-full border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0A0A1B]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-white/10">
              <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white">Settings</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                aria-label="Close menu"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col px-4">
              {/* Language Selection */}
              <div className="my-1 rounded-lg px-2 py-4">
                <div className="mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="text-[17px]">Language</span>
                </div>
                <select
                  value={selectedLang}
                  onChange={e => handleLanguageSelect(e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2 text-[15px] text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  aria-label="Select language"
                >
                  {languages.map(lang => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="bg-white text-gray-900 dark:bg-[#0A0A1B] dark:text-white"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selection */}
              <div className="my-1 rounded-lg px-2 py-4">
                <div className="mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="text-[17px]">Theme</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
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
                      Light
                    </p>
                  </button>

                  <button
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
                      Dark
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <div className="p-8">
              <button
                className="w-full rounded-full bg-indigo-600 py-3.5 text-center text-[17px] font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
                onClick={() => onOpenChange(false)}
              >
                Done
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
                  <svg
                    className="mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  <span className="text-sm">Privacy</span>
                </a>
                <a
                  href={`${GITHUB_BASE_URL}/TERMS.md`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
                >
                  <svg
                    className="mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                    />
                  </svg>
                  <span className="text-sm">Terms</span>
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
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
