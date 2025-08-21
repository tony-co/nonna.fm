"use client";

import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AudioEqualizer } from "@/components/shared/AudioEqualizer";
import { initializeEncryption } from "@/lib/auth/crypto";
import { clearAllServiceData } from "@/lib/auth/utils";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";
import { authorizeAppleMusic } from "@/lib/services/apple/api";
import { getAvailableServices } from "@/config/services";
import { DeezerConnectModal } from "@/components/modals/DeezerConnectModal";
import { SpotifyConsentModal } from "@/components/modals/SpotifyConsentModal";

function HomePageContent() {
  const t = useTranslations("HomePage");
  const tAccessibility = useTranslations("Accessibility");
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isDeezerModalOpen, setIsDeezerModalOpen] = useState(false);
  const [isSpotifyConsentModalOpen, setIsSpotifyConsentModalOpen] = useState(false);

  useEffect(() => {
    // Clear all service data if there was an error
    if (error) {
      clearAllServiceData();
    }
    // Initialize encryption on app start
    initializeEncryption();
  }, [error]);

  const handleSpotifyLogin = async (): Promise<void> => {
    setIsSpotifyConsentModalOpen(true);
  };

  const handleSpotifyConsent = async (): Promise<void> => {
    try {
      clearAllServiceData();
      setIsSpotifyConsentModalOpen(false);
      await initiateSpotifyAuth("source");
    } catch (error) {
      console.error("Error initiating Spotify auth:", error);
    }
  };

  const handleAppleLogin = async (): Promise<void> => {
    try {
      clearAllServiceData();
      await authorizeAppleMusic("source");
      router.push("/source?source=apple");
    } catch (error) {
      console.error("Error initiating Apple Music auth:", error);
    }
  };

  const handleYouTubeLogin = async (): Promise<void> => {
    try {
      clearAllServiceData();
      await initiateYouTubeAuth("source");
    } catch (error) {
      console.error("Error initiating YouTube auth:", error);
    }
  };

  const openDeezerModal = (): void => {
    clearAllServiceData();
    setIsDeezerModalOpen(true);
  };

  return (
    <div className="grid h-[100dvh] grid-rows-[auto_1fr_auto] overflow-hidden">
      <header className="sticky top-0 z-50 h-auto">
        <Header />
      </header>

      <main className="overflow-auto">
        <div className="relative">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-2">
                <h1
                  className="mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl dark:from-stone-50 dark:to-indigo-600"
                  style={{
                    contain: "content",
                  }}
                >
                  {t("title")}
                </h1>
                <p
                  className="mx-auto text-xl leading-relaxed text-zinc-800 lg:text-2xl dark:text-indigo-100"
                  style={{
                    contain: "content",
                    textRendering: "optimizeLegibility",
                  }}
                >
                  {t.rich("subtitle", {
                    strong: chunks => <strong>{chunks}</strong>,
                  })}
                </p>
              </div>

              {error && (
                <div
                  className="bg-[var(--color-error)]/5 dark:bg-[var(--color-error)]/10 border-[var(--color-error)]/20 dark:text-[var(--color-error)]/90 mx-auto mb-8 max-w-lg rounded-2xl border px-6 py-4 text-[var(--color-error)] shadow-lg backdrop-blur-sm"
                  style={{ contain: "content" }}
                >
                  {error === "spotify_auth_failed" && t("errors.spotifyAuthFailed")}
                  {error === "spotify_auth_error" && t("errors.spotifyAuthError")}
                  {error === "youtube_auth_failed" && t("errors.youtubeAuthFailed")}
                  {error === "youtube_auth_error" && t("errors.youtubeAuthError")}
                  {error === "not_authenticated" && t("errors.notAuthenticated")}
                </div>
              )}

              <div className="mb-22">
                <AudioEqualizer className="opacity-90" />
              </div>

              <h2 className="mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-zinc-800 lg:text-3xl dark:text-stone-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800">
                  1
                </span>
                {t("selectSource")}
              </h2>

              {/* Service Buttons */}
              <div className="mx-auto flex max-w-4xl flex-wrap items-stretch justify-center gap-4 py-4 pb-16">
                {getAvailableServices().map(service => (
                  <button
                    key={service.id}
                    onClick={
                      service.id === "spotify"
                        ? handleSpotifyLogin
                        : service.id === "youtube"
                          ? handleYouTubeLogin
                          : service.id === "deezer"
                            ? openDeezerModal
                            : service.id === "apple"
                              ? handleAppleLogin
                              : undefined
                    }
                    className="group flex h-[180px] w-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl bg-indigo-100 px-5 py-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900/70"
                  >
                    <service.image className="h-12 w-12" size={48} />
                    <span className="text-text text-center text-base font-semibold">
                      {t("connectWith")}
                      <br />
                      {service.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="relative mx-auto max-w-7xl px-4 py-20">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70">
                  <span
                    className="text-4xl drop-shadow-md filter"
                    role="img"
                    aria-label={tAccessibility("moneyWithWings")}
                  >
                    💸
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  {t("features.freeplan.title")}
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  {t.rich("features.freeplan.description", {
                    strong: chunks => <strong>{chunks}</strong>,
                    br: () => <br />,
                  })}
                </p>
              </div>
              <div className="rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70">
                  <span
                    className="text-4xl drop-shadow-md filter"
                    role="img"
                    aria-label={tAccessibility("shieldWithLock")}
                  >
                    🔐
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  {t("features.secure.title")}
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  {t.rich("features.secure.description", {
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deezer Modal */}
        <DeezerConnectModal
          isOpen={isDeezerModalOpen}
          onClose={() => setIsDeezerModalOpen(false)}
        />

        {/* Spotify Consent Modal */}
        <SpotifyConsentModal
          isOpen={isSpotifyConsentModalOpen}
          onClose={() => setIsSpotifyConsentModalOpen(false)}
          onAgree={handleSpotifyConsent}
        />
      </main>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  const t = useTranslations("Loading");

  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <HomePageContent />
    </Suspense>
  );
}
