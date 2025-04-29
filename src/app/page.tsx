"use client";

import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AudioEqualizer } from "@/components/shared/AudioEqualizer";
import { initializeEncryption } from "@/lib/auth/crypto";
import { clearAllServiceData } from "@/lib/auth/utils";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";
import { authorizeAppleMusic } from "@/lib/services/apple/api";
import { SERVICES, getAvailableServices } from "@/config/services";
import { createPortal } from "react-dom";
import { DeezerConnectModal } from "@/components/modals/DeezerConnectModal";
import { SpotifyConsentModal } from "@/components/modals/SpotifyConsentModal";

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [isDeezerModalOpen, setIsDeezerModalOpen] = useState(false);
  const [isSpotifyConsentModalOpen, setIsSpotifyConsentModalOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

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

  const handleMouseEnter = (event: React.MouseEvent<HTMLSpanElement>): void => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handleMouseLeave = (): void => {
    setTooltipPosition(null);
  };

  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="relative overflow-hidden">
        {/* Main Content */}
        <main>
          <div className="mx-auto max-w-7xl px-4 py-12">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-2">
                <h1
                  className="mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl dark:from-stone-50 dark:to-indigo-600"
                  style={{
                    contain: "content",
                  }}
                >
                  Your Music, Anywhere
                </h1>
                <p
                  className="mx-auto text-xl leading-relaxed text-zinc-800 lg:text-2xl dark:text-indigo-100"
                  style={{
                    contain: "content",
                    textRendering: "optimizeLegibility",
                  }}
                >
                  Move your playlists between streaming platforms <strong>for free</strong>.
                </p>
              </div>

              {error && (
                <div
                  className="bg-[var(--color-error)]/5 dark:bg-[var(--color-error)]/10 border-[var(--color-error)]/20 dark:text-[var(--color-error)]/90 mx-auto mb-8 max-w-lg rounded-2xl border px-6 py-4 text-[var(--color-error)] shadow-lg backdrop-blur-sm"
                  style={{ contain: "content" }}
                >
                  {error === "spotify_auth_failed" &&
                    "Spotify authentication failed. Please try again."}
                  {error === "spotify_auth_error" &&
                    "An error occurred during Spotify authentication."}
                  {error === "youtube_auth_failed" &&
                    "YouTube Music authentication failed. Please try again."}
                  {error === "youtube_auth_error" &&
                    "An error occurred during YouTube Music authentication."}
                  {error === "not_authenticated" &&
                    "Please authenticate with a music service to continue."}
                </div>
              )}

              <div className="mb-22">
                <AudioEqualizer className="opacity-90" />
              </div>

              <h2 className="mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-zinc-800 lg:text-3xl dark:text-stone-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800">
                  1
                </span>
                Select your source:
              </h2>

              {/* Service Buttons */}
              <div className="mx-auto grid max-w-4xl grid-cols-2 items-stretch justify-center gap-4 py-4 pb-16 lg:grid-cols-4">
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
                    className="group flex h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl bg-indigo-100 px-8 py-6 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900/70"
                  >
                    <service.image className="h-12 w-12" />
                    <span className="text-text text-center text-base font-semibold">
                      Connect with
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
                    aria-label="Money with wings"
                  >
                    💸
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  Generous Free Plan
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  300 transfers for free <strong>everyday</strong>
                  <br />
                  Upgrade to Premium for 10x more.
                </p>
              </div>
              <div className="rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70">
                <div className="mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70">
                  <span
                    className="text-4xl drop-shadow-md filter"
                    role="img"
                    aria-label="Shield with lock"
                  >
                    🔐
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200">
                  Secure and private
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  We do not sell your data.
                  <br />
                  Our code is open source for full transparency.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Services Section */}
          <section className="px-4 py-20">
            <div className="mx-auto max-w-6xl">
              <div className="rounded-[2.5rem]">
                <h2 className="mb-4 bg-gradient-to-br from-stone-900 to-stone-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent lg:text-5xl dark:from-white dark:to-white/70">
                  Supported Services
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-indigo-950/60 dark:text-white/60">
                  We support major music streaming platforms, with more to come.
                </p>
                <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                  {Object.values(SERVICES).map(service => (
                    <div
                      key={service.id}
                      className="group relative overflow-hidden rounded-2xl border border-indigo-200/30 bg-gradient-to-br from-indigo-100/80 via-white to-indigo-50/80 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:border-white/5 dark:from-indigo-950/50 dark:via-indigo-950/50 dark:to-indigo-950/50"
                    >
                      <div className="relative flex flex-col items-center gap-4">
                        <div className="h-16 w-16 p-2">
                          <service.image className="h-full w-full" />
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-950 dark:text-white">
                          {service.name}
                        </h3>
                        <span
                          className="relative rounded-full px-3 py-1 text-sm shadow-lg"
                          style={{
                            backgroundColor:
                              service.status === "Available"
                                ? "rgba(99, 102, 241, 0.1)"
                                : service.status === "Coming Soon"
                                  ? "rgba(99, 102, 241, 0.05)"
                                  : "rgba(99, 102, 241, 0.05)",
                            border:
                              service.status === "Available"
                                ? "1px solid rgba(99, 102, 241, 0.3)"
                                : service.status === "Coming Soon"
                                  ? "1px solid rgba(99, 102, 241, 0.2)"
                                  : "1px solid rgba(99, 102, 241, 0.2)",
                            color:
                              service.status === "Available"
                                ? "rgb(67, 56, 202)"
                                : service.status === "Coming Soon"
                                  ? "rgb(99, 102, 241)"
                                  : "rgb(99, 102, 241)",
                            ...(!service.status.startsWith("Available") && {
                              dark: {
                                backgroundColor: "rgba(8, 145, 178, 0.2)",
                                borderColor: "rgba(8, 145, 178, 0.4)",
                                color: "rgba(236, 254, 255, 0.9)",
                              },
                            }),
                          }}
                          onMouseEnter={
                            service.id === "deezer" && service.status === "Available"
                              ? handleMouseEnter
                              : undefined
                          }
                          onMouseLeave={
                            service.id === "deezer" && service.status === "Available"
                              ? handleMouseLeave
                              : undefined
                          }
                        >
                          {service.status}
                          {service.id === "deezer" && service.status === "Available" && "*"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Footer />

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
      </div>

      {tooltipPosition &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            Export only: We can export your Deezer tracks, but cannot import into Deezer
            <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
