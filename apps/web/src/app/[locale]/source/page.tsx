"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceSelector } from "@/components/shared/ServiceSelector";
import { useAppleMusic } from "@/hooks/useAppleMusic";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { useState, Suspense } from "react";
import { MusicService } from "@/types";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";
import { SpotifyConsentModal } from "@/components/modals/SpotifyConsentModal";

function SourcePageContent() {
  const t = useTranslations('SourcePage');
  const tErrors = useTranslations('Errors');
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
        throw new Error(tErrors('noSourceService'));
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
      const serviceName = serviceId === "apple" ? "Apple Music" : "Spotify";
      setError(tErrors('failedToConnect', { service: serviceName }));
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
        throw new Error(tErrors('noSourceService'));
      }

      await initiateSpotifyAuth("target");
      // On success, initiateSpotifyAuth should redirect the user to Spotify's OAuth page.
      // Our callback and redirect is handled in the SpotifyCallback route.
      return;
    } catch (err) {
      console.error("Authorization error:", err);
      setError(tErrors('failedToConnect', { service: 'Spotify' }));
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid h-[100dvh] grid-rows-[auto_1fr_auto] overflow-hidden">
      <Header />
      
      <main className="container mx-auto overflow-auto px-4 py-6 sm:pt-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 flex items-center justify-center gap-2 text-xl font-semibold text-zinc-800 sm:mb-8 sm:gap-3 sm:text-3xl dark:text-stone-200">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-base text-zinc-800 sm:h-8 sm:w-8 sm:text-lg dark:text-indigo-800">
              2
            </span>
            {t('title')}
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

        <SpotifyConsentModal
          isOpen={isSpotifyConsentModalOpen}
          onClose={() => {
            setIsSpotifyConsentModalOpen(false);
            setPendingTargetAction(null);
            setIsProcessing(false);
          }}
          onAgree={handleSpotifyConsent}
        />
      </main>
      
      <Footer />
    </div>
  );
}

export default function SourcePage() {
  const t = useTranslations('Loading');
  
  return (
    <Suspense fallback={<div>{t('loading')}</div>}>
      <SourcePageContent />
    </Suspense>
  );
}
