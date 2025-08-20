"use client";

import React from "react";
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
  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title="Spotify Terms of Service">
      <div className="space-y-6">
        <div className="">
          <p className="mb-2 font-semibold">Before using Spotify with Nonna.fm, please note:</p>
          <ul className="ml-4 list-disc space-y-1.5 text-sm">
            <li>
              Nonna.fm makes no warranties or representations on behalf of Spotify and expressly
              disclaims all implied warranties with respect to the Spotify Platform, Spotify Service
              and Spotify Content, including the implied warranties of merchantability, fitness for
              a particular purpose and non-infringement.
            </li>
            <li>
              You agree to not modify or create derivative works based on the Spotify Platform,
              Spotify Service or Spotify Content.
            </li>
            <li>
              You agree to not decompile, reverse-engineer, disassemble, or otherwise reduce the
              Spotify Platform, Spotify Service, and Spotify Content to source code or other
              human-perceivable form, to the full extent allowed by law.
            </li>
            <li>
              Nonna.fm is solely responsible for this application and Spotify has no liability
              related to your use of this service.
            </li>
            <li>
              Spotify is a third party beneficiary of our terms of service and privacy policy and is
              entitled to directly enforce these terms.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-stone-200">
            Privacy Information
          </h3>
          <div className="text-sm">
            <p className="mb-2">While using our service with Spotify, please be aware:</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>Our collection and use of data is subject to our privacy policy.</li>
              <li>
                We collect and use information about your Spotify playlists, saved songs, and
                related metadata solely for providing the playlist transfer service.
              </li>
              <li>
                All processing of your data happens directly in your browser. We do not store your
                Spotify data on our servers.
              </li>
              <li>
                For questions about your information, please contact us via our support channels.
              </li>
              <li>
                We do not place cookies on your browser beyond what is necessary for authentication.
              </li>
              <li>
                We do not allow third parties to place cookies on your browser to track browsing
                activities.
              </li>
              <li>
                You can manage cookies through your browser settings if you wish to control them.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50"
          >
            Decline
          </button>
          <button
            onClick={onAgree}
            className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            I Agree
          </button>
        </div>
      </div>
    </DialogComponent>
  );
}
