"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect, useState } from "react";
import { clearAllServiceData } from "@/lib/auth/utils";
import { storeDeezerUserId, validateDeezerUser } from "@/lib/services/deezer/auth";

// Dynamically import Dialog component
const DialogComponent = dynamic(() => import("@/components/shared/Dialog"), { ssr: false });

interface DeezerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeezerConnectModal({
  isOpen,
  onClose,
}: DeezerConnectModalProps): React.ReactElement {
  const router = useRouter();
  const t = useTranslations("DeezerConnect");
  const tButtons = useTranslations("Buttons");
  const tAccessibility = useTranslations("Accessibility");
  const tUI = useTranslations("UI");
  const tErrors = useTranslations("Errors");
  const [deezerUserId, setDeezerUserId] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"success" | "error" | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

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
        setConnectError(
          error instanceof Error ? error.message : tErrors("failedToValidateProfile")
        );
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateProfile, 500);
    return () => clearTimeout(timeoutId);
  }, [deezerUserId, tErrors]);

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
      setConnectError(error instanceof Error ? error.message : tErrors("failedToConnectToDeezer"));
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title={t("title")}>
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-3">
            <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
              {t("whyNeedId.title")}
            </h3>
            <p className="text-base text-zinc-600 dark:text-stone-400">
              {t("whyNeedId.explanation")}{" "}
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400"
              >
                {t("whyNeedId.seeMore")}
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
                {t("whyNeedId.technicalDetails")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
              {t("makePublic.title")}
            </h3>
            <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400">
              <li>
                {t("makePublic.step1")}{" "}
                <a
                  href="https://account.deezer.com/login/?redirect_uri=https%3A%2F%2Fwww.deezer.com%2Faccount%2Fshare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  deezer.com/account/share
                </a>
              </li>
              <li>{t("makePublic.step2")}</li>
              <li>{t("makePublic.step3")}</li>
            </ol>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200">
              {t("getId.title")}
            </h3>
            <ol className="list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400">
              <li className="leading-relaxed">
                {t("getId.instructions")}
                <br />
                <div className="mt-2 space-y-4">
                  <Image
                    src="/images/deezer_id.webp"
                    alt={tAccessibility("howToFindProfileId")}
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
            {t("form.label")}
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
              placeholder={t("form.placeholder")}
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
          {connectError && <p className="text-sm text-red-500 dark:text-red-400">{connectError}</p>}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <p className="flex-1 text-sm text-zinc-600 dark:text-stone-400">
            {t("privacy.line1")}
            <br />
            {t("privacy.line2")}
          </p>

          <div className="flex shrink-0 gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50"
            >
              {tButtons("cancel")}
            </button>
            <button
              onClick={handleDeezerConnect}
              disabled={!deezerUserId || isConnecting || validationStatus !== "success"}
              className="min-w-[100px] rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {isConnecting ? tUI("connecting") : tButtons("connect")}
            </button>
          </div>
        </div>
      </div>
    </DialogComponent>
  );
}
