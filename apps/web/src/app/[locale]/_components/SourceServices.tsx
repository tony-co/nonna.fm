"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DeezerConnectModal } from "@/components/modals/DeezerConnectModal";
import { SpotifyConsentModal } from "@/components/modals/SpotifyConsentModal";
import { getAvailableServices } from "@/config/services";
import { useRouter } from "@/i18n/navigation";
import { initializeEncryption } from "@/lib/auth/crypto";
import { clearAllServiceData } from "@/lib/auth/utils";
import { authorizeAppleMusic } from "@/lib/services/apple/api";
import { initiateSpotifyAuth } from "@/lib/services/spotify/auth";
import { initiateYouTubeAuth } from "@/lib/services/youtube/auth";

export function SourceServices() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [isDeezerModalOpen, setIsDeezerModalOpen] = useState(false);
  const [isSpotifyConsentModalOpen, setIsSpotifyConsentModalOpen] = useState(false);

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
    <>
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
            type="button"
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
      {/* Deezer Modal */}
      <DeezerConnectModal isOpen={isDeezerModalOpen} onClose={() => setIsDeezerModalOpen(false)} />

      {/* Spotify Consent Modal */}
      <SpotifyConsentModal
        isOpen={isSpotifyConsentModalOpen}
        onClose={() => setIsSpotifyConsentModalOpen(false)}
        onAgree={handleSpotifyConsent}
      />
    </>
  );
}

export function HomeAuthState() {
  const t = useTranslations("HomePage");
  const error = useSearchParams().get("error");

  useEffect(() => {
    if (error) clearAllServiceData();
    initializeEncryption();
  }, [error]);

  return (
    <>
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
    </>
  );
}
