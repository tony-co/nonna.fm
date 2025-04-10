"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceSelector } from "@/components/shared/ServiceSelector";
import { useAppleMusic } from "@/hooks/useAppleMusic";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { useState, Suspense } from "react";
import { MusicService } from "@/types/services";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";

function SourcePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authorize: authorizeAppleMusic } = useAppleMusic();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTargetSelect = async (serviceId: string): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const source = searchParams.get("source");
      if (!source) {
        throw new Error("No source service selected");
      }

      if (serviceId === "apple") {
        await authorizeAppleMusic();
        router.push(`/library/${source}/${serviceId}`);
      } else if (serviceId === "spotify") {
        await initiateSpotifyAuth("target");
        router.push(`/library/${source}/${serviceId}`);
      } else if (serviceId === "youtube") {
        await initiateYouTubeAuth("target");
        router.push(`/library/${source}/${serviceId}`);
      }
    } catch (err) {
      console.error("Authorization error:", err);
      setError(
        `Failed to connect to ${serviceId === "apple" ? "Apple Music" : "Spotify"}. Please try again.`
      );
    } finally {
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
