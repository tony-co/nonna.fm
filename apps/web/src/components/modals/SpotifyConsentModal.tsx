"use client";

import React from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

// Dynamically import Dialog component
const DialogComponent = dynamic(() => import("@/components/shared/Dialog"), { ssr: false });

interface SpotifyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function SpotifyConsentModal({
  isOpen,
  onClose,
  onAgree,
}: SpotifyConsentModalProps): React.ReactElement {
  const tSpotifyTerms = useTranslations("Modals.spotifyTerms");

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title={tSpotifyTerms("title")}>
      <div className="space-y-6">
        <div className="">
          <p className="mb-2 font-semibold">{tSpotifyTerms("intro")}</p>
          <ul className="ml-4 list-disc space-y-1.5 text-sm">
            {tSpotifyTerms.raw("termsItems").map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-stone-200">
            {tSpotifyTerms("privacyTitle")}
          </h3>
          <div className="text-sm">
            <p className="mb-2">{tSpotifyTerms("privacyIntro")}</p>
            <ul className="ml-4 list-disc space-y-1.5">
              {tSpotifyTerms.raw("privacyItems").map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50"
          >
            {tSpotifyTerms("decline")}
          </button>
          <button
            onClick={onAgree}
            className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {tSpotifyTerms("agree")}
          </button>
        </div>
      </div>
    </DialogComponent>
  );
}
