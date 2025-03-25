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
      const transferParams = new URLSearchParams();
      if (source) transferParams.set("source", source);
      transferParams.set("target", serviceId);

      console.log(serviceId);

      if (serviceId === "apple") {
        console.log("apple1");
        await authorizeAppleMusic();
        console.log("apple2");
        router.push(`/transfer?${transferParams.toString()}`);
        console.log("apple3");
      } else if (serviceId === "spotify") {
        await initiateSpotifyAuth("target");
        router.push(`/transfer?${transferParams.toString()}`);
      } else if (serviceId === "youtube") {
        await initiateYouTubeAuth("target");
        router.push(`/transfer?${transferParams.toString()}`);
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
        <main className="container mx-auto flex-grow px-4 pt-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-zinc-800 sm:text-3xl dark:text-stone-200">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800">
                2
              </span>
              Now select your target:
            </h2>

            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 backdrop-blur-sm dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400">
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
