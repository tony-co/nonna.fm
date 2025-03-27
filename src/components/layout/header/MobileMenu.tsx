import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "简体中文" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "ko", name: "한국어" },
  { code: "fa", name: "فارسی" },
];

export const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        onClick={() => setIsOpen(!isOpen)}
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
            onClick={() => setIsOpen(false)}
          />

          <div
            className="relative mt-auto w-full rounded-t-[20px] border border-gray-200 bg-white dark:border-white/10 dark:bg-[#0A0A1B]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-200 px-4 py-4 dark:border-white/10">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                aria-label="Back"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h2 className="text-[22px] font-semibold text-gray-900 dark:text-white">Settings</h2>
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
            <div className="p-4">
              <button
                className="w-full rounded-full bg-indigo-600 py-3.5 text-center text-[17px] font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>

            {/* Safe area spacing for iOS */}
            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  );
};
