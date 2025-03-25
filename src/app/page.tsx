"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AudioEqualizer } from "@/components/shared/AudioEqualizer";
import { initializeEncryption } from "@/lib/auth/crypto";
import { clearAllServiceData } from "@/lib/auth/utils";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";
import { validateDeezerUser, storeDeezerUserId } from "@/lib/services/deezer/auth";
import { initiateAppleAuth } from "@/lib/services/apple/auth";
import { SERVICES, getAvailableServices } from "@/config/services";
import { createPortal } from "react-dom";

// Dynamically import components that are not needed for initial render
const DialogComponent = dynamic(() => import("@/components/shared/Dialog"), { ssr: false });

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [deezerUserId, setDeezerUserId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [isDeezerModalOpen, setIsDeezerModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"success" | "error" | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Clear all service data if there was an error
    if (error) {
      clearAllServiceData();
    }
    // Initialize encryption on app start
    initializeEncryption();
  }, [error]);

  // Debounced validation function
  useEffect(() => {
    if (!deezerUserId) {
      setValidationStatus(null);
      return;
    }

    const validateProfile = async (): Promise<void> => {
      try {
        setIsValidating(true);
        setConnectError("");
        await validateDeezerUser(deezerUserId);
        setValidationStatus("success");
      } catch (error) {
        setValidationStatus("error");
        setConnectError(error instanceof Error ? error.message : "Failed to validate profile");
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateProfile, 500);
    return () => clearTimeout(timeoutId);
  }, [deezerUserId]);

  const handleSpotifyLogin = async (): Promise<void> => {
    try {
      clearAllServiceData();
      await initiateSpotifyAuth("source");
    } catch (error) {
      console.error("Error initiating Spotify auth:", error);
    }
  };

  const handleAppleLogin = async (): Promise<void> => {
    try {
      clearAllServiceData();
      const success = await initiateAppleAuth("source");
      if (success) {
        router.push("/source?source=apple");
      }
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

  const handleDeezerConnect = async (): Promise<void> => {
    try {
      clearAllServiceData();
      setIsConnecting(true);
      setConnectError("");

      // Validate the user ID
      await validateDeezerUser(deezerUserId);

      // Store the user ID
      storeDeezerUserId(deezerUserId);

      // Redirect to source page
      router.push("/source?source=deezer");
    } catch (error) {
      console.error("Error connecting to Deezer:", error);
      setConnectError(error instanceof Error ? error.message : "Failed to connect to Deezer");
    } finally {
      setIsConnecting(false);
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
                  className="mb-4 bg-gradient-to-r from-zinc-800 to-indigo-700 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl dark:from-stone-50 dark:to-indigo-600"
                  style={{
                    contain: "content",
                  }}
                >
                  Your Music, Anywhere
                </h1>
                <p
                  className="mx-auto text-xl leading-relaxed text-zinc-800 sm:text-2xl dark:text-indigo-100"
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
                  className="bg-[var(--color-error)]/5 dark:bg-[var(--color-error)]/10 border-[var(--color-error)]/20 dark:text-[var(--color-error)]/90 shadow-[var(--color-error)]/5 mx-auto mb-8 max-w-lg rounded-2xl border px-6 py-4 text-[var(--color-error)] shadow-lg backdrop-blur-sm"
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

              <h2 className="mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-zinc-800 sm:text-3xl dark:text-stone-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800">
                  1
                </span>
                Select your source:
              </h2>

              {/* Service Buttons */}
              <div className="mx-auto grid max-w-4xl grid-cols-2 items-stretch justify-center gap-4 py-4 pb-16 sm:grid-cols-2 md:grid-cols-4">
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
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
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
                  Free Forever
                </h3>
                <p className="text-lg text-zinc-600 dark:text-stone-400">
                  Transfer all your playlists, liked songs and albums between any music streaming
                  service with up to 5000 tracks completely free.
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
                  We do not store or sell your data. Everything happens in your browser, and our
                  code is open source for full transparency.
                </p>
              </div>
            </div>
          </div>

          {/* Supported Services Section */}
          <section className="px-4 py-20">
            <div className="mx-auto max-w-6xl">
              <div className="rounded-[2.5rem]">
                <h2 className="mb-4 bg-gradient-to-r from-indigo-950 to-indigo-700 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent sm:text-5xl dark:from-white dark:to-white/70">
                  Supported Services
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-indigo-950/60 dark:text-white/60">
                  We support major music streaming platforms, with more to come.
                </p>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
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
          <DialogComponent
            isOpen={isDeezerModalOpen}
            onClose={() => setIsDeezerModalOpen(false)}
            title="Connect with Deezer"
          >
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-3">
                  <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
                    Why do we need your profile ID?
                  </h3>
                  <p className="text-base text-zinc-600 dark:text-stone-400">
                    Deezer works differently from other platforms. To connect your account, we need
                    your profile ID - it&apos;s like your unique username for Deezer.{" "}
                    <button
                      onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
                    >
                      See more
                      <svg
                        className={`h-4 w-4 transform transition-transform ${showTechnicalDetails ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </p>
                  {showTechnicalDetails && (
                    <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-zinc-600 dark:border-indigo-800/30 dark:bg-indigo-950/50 dark:text-stone-400">
                      As of 2024, Deezer no longer accepts new OAuth application registrations for
                      third-party developers. This means we can&apos;t use the traditional OAuth
                      flow like we do with Spotify and YouTube. Instead, we use your public profile
                      ID to access your public playlists, which is still allowed under Deezer&apos;s
                      API terms.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
                    Make your profile public:
                  </h3>
                  <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400">
                    <li>
                      Log in to your Deezer account and go to{" "}
                      <a
                        href="https://account.deezer.com/login/?redirect_uri=https%3A%2F%2Fwww.deezer.com%2Faccount%2Fshare"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        deezer.com/account/share
                      </a>
                    </li>
                    <li>You should see your social sharing settings</li>
                    <li>Make sure the &ldquo;Private profile&rdquo; option is disabled</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
                    Get your Deezer profile ID:
                  </h3>
                  <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400">
                    <li className="leading-relaxed">
                      Go to your favourites, copy your profile ID from the URL:
                      <br />
                      <div className="mt-2 space-y-4">
                        <Image
                          src="/images/deezer_id.webp"
                          alt="How to find your Deezer profile ID"
                          width={400}
                          height={200}
                          className="rounded-xl border border-indigo-100 shadow-sm dark:border-indigo-800/30"
                          priority
                        />
                      </div>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="deezer-id-modal"
                  className="block text-base font-medium text-zinc-800 dark:text-stone-200"
                >
                  Enter your Deezer profile ID
                </label>
                <div className="relative">
                  <input
                    id="deezer-id-modal"
                    type="text"
                    value={deezerUserId}
                    onChange={e => {
                      const value = e.target.value;
                      const profileMatch = value.match(
                        /(?:deezer\.com\/(?:[a-z]{2}\/)?(?:profile\/)?|^)(\d+)(?:$|\/|(?:\?|&).*)/
                      );
                      setDeezerUserId(profileMatch ? profileMatch[1] : value);
                    }}
                    placeholder="Paste your Deezer profile ID (e.g. 123456)"
                    className={`w-full border bg-indigo-50 px-4 py-3 dark:bg-indigo-950/50 ${
                      validationStatus === "success"
                        ? "border-emerald-500 dark:border-emerald-400"
                        : validationStatus === "error"
                          ? "border-red-500 dark:border-red-400"
                          : "border-indigo-200 dark:border-indigo-800/30"
                    } rounded-xl pr-10 text-lg text-zinc-800 placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:text-stone-200 dark:placeholder-stone-500 dark:focus:ring-indigo-400`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValidating ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400" />
                    ) : validationStatus === "success" ? (
                      <svg
                        className="h-6 w-6 text-emerald-500 dark:text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : validationStatus === "error" ? (
                      <svg
                        className="h-6 w-6 text-red-500 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>
                {connectError && (
                  <p className="text-sm text-red-500 dark:text-red-400">{connectError}</p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4">
                <p className="flex-1 text-sm text-zinc-600 dark:text-stone-400">
                  We only use this data for the transfer process.
                  <br />
                  We don&apos;t store any of your data permanently.
                </p>

                <div className="flex shrink-0 gap-3">
                  <button
                    onClick={() => setIsDeezerModalOpen(false)}
                    className="rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeezerConnect}
                    disabled={!deezerUserId || isConnecting || validationStatus !== "success"}
                    className="min-w-[100px] rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          </DialogComponent>
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
