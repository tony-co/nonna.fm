import React from "react";

const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-indigo-200/20 px-4 py-8 dark:border-indigo-800/20">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-8">
        <a
          href={`${GITHUB_BASE_URL}/PRIVACY.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400"
        >
          Privacy Policy
        </a>
        <a
          href={`${GITHUB_BASE_URL}/TERMS.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-stone-400 dark:hover:text-indigo-400"
        >
          Terms of Use
        </a>
      </div>
    </footer>
  );
}
