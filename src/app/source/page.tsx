"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceSelector } from "@/components/shared/ServiceSelector";
import { useAppleMusic } from "@/hooks/useAppleMusic";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { useState, Suspense } from "react";
import { MusicService } from "@/types";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";
import { SpotifyConsentModal } from "@/components/modals/SpotifyConsentModal";
import { useRouter } from "next/navigation";

function SourcePageContent() {
  const searchParams = useSearchParams();
  const { authorize: authorizeAppleMusic } = useAppleMusic();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpotifyConsentModalOpen, setIsSpotifyConsentModalOpen] = useState(false);
  const [pendingTargetAction, setPendingTargetAction] = useState<string | null>(null);
  const router = useRouter();

  const handleTargetSelect = async (serviceId: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const source = searchParams.get("source");
      if (!source) {
        throw new Error("No source service selected");
      }

      if (serviceId === "apple") {
        await authorizeAppleMusic("target");
        // Apple Music does not use OAuth redirects; after successful authorization, we navigate to the library page here.
        router.push(`/library/${source}/apple`);
        return;
      } else if (serviceId === "spotify") {
        setPendingTargetAction(serviceId);
        setIsSpotifyConsentModalOpen(true);
        setIsProcessing(false);
      } else if (serviceId === "youtube") {
        await initiateYouTubeAuth("target");
        // On success, initiateYouTubeAuth should redirect the user to YouTube's OAuth page.
        // Our callback and redirect is handled in the YouTubeCallback route.
        return;
      }
    } catch (err) {
      console.error("Authorization error:", err);
      setError(
        `Failed to connect to ${serviceId === "apple" ? "Apple Music" : "Spotify"}. Please try again.`
      );
      setIsProcessing(false);
    }
  };

  const handleSpotifyConsent = async (): Promise<void> => {
    if (!pendingTargetAction) return;

    setIsProcessing(true);
    setIsSpotifyConsentModalOpen(false);

    try {
      const source = searchParams.get("source");
      if (!source) {
        throw new Error("No source service selected");
      }

      await initiateSpotifyAuth("target");
      // On success, initiateSpotifyAuth should redirect the user to Spotify's OAuth page.
      // Our callback and redirect is handled in the SpotifyCallback route.
      return;
    } catch (err) {
      console.error("Authorization error:", err);
      setError("Failed to connect to Spotify. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto flex-grow px-4 py-6 sm:pt-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-zinc-800 sm:mb-8 sm:gap-3 sm:text-3xl dark:text-stone-200">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-base text-zinc-800 sm:h-8 sm:w-8 sm:text-lg dark:text-indigo-800">
                2
              </span>
              Now select your target:
            </h2>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 backdrop-blur-sm sm:mb-6 sm:p-4 sm:text-base dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400">
                {error}
              </div>
            )}

            <ServiceSelector
              onTargetSelect={handleTargetSelect}
              isProcessing={isProcessing}
              source={searchParams.get("source") as MusicService}
            />
          </div>
        </main>
        <Footer />

        <SpotifyConsentModal
          isOpen={isSpotifyConsentModalOpen}
          onClose={() => {
            setIsSpotifyConsentModalOpen(false);
            setPendingTargetAction(null);
            setIsProcessing(false);
          }}
          onAgree={handleSpotifyConsent}
        />
      </div>
    </>
  );
}

export default function SourcePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SourcePageContent />
    </Suspense>
  );
}
