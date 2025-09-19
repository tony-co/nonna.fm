import { useTranslations } from "next-intl";
import type React from "react";
import { Shield, FileText } from "lucide-react";

const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";
const GITHUB_REPO = "https://github.com/tony-co/nonna.fm";

export function Footer({ children }: { children?: React.ReactNode }): React.ReactElement {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-indigo-200/20 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-indigo-800/20 dark:bg-[#0A0A1B]/80">
      <div className="container mx-auto flex items-center justify-between">
        {/* Links on the left - hidden on mobile */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`${GITHUB_BASE_URL}/PRIVACY.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
          >
            <Shield
              className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              aria-label="Privacy policy icon"
            />
            {t("privacy")}
          </a>
          <a
            href={`${GITHUB_BASE_URL}/TERMS.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
          >
            <FileText
              className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              aria-label="Terms of service icon"
            />
            {t("terms")}
          </a>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
          >
            <svg
              className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-label="GitHub repository icon"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>

        {/* TransferButton on the right */}
        <div className="ml-auto flex w-full justify-end lg:w-auto">{children}</div>
      </div>
    </footer>
  );
}
