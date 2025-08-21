"use client";

import { handleYouTubeCallback } from "@/lib/services/youtube/auth";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { Suspense } from "react";
import Dialog from "@/components/shared/Dialog";

import "@/app/globals.css";

function YouTubeCallbackContent() {
  const t = useTranslations("Errors");
  const tButtons = useTranslations("Buttons");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Get the raw search string from the URL
        const searchString = searchParams.toString();

        // Handle the callback and get the result
        const { success, role, error } = await handleYouTubeCallback(searchString);

        console.log("YouTube callback result:", success, role, error);

        if (!success) {
          if (error) {
            setError(error);
            setShowErrorDialog(true);
            return;
          }
          console.error("Failed to handle YouTube callback");
          router.push("/");
          return;
        }

        // Get service types for both source and target
        const sourceService = getServiceType("source");

        // For target role, ensure we have a source service
        if (role === "target" && !sourceService) {
          console.error("Cannot redirect to transfer: no source service configured");
          router.push("/");
          return;
        }

        // Build redirect URL with service parameters
        const redirectUrl =
          role === "target" ? `/library/${sourceService}/youtube` : `/source?source=youtube`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during YouTube callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  const handleCloseDialog = () => {
    setShowErrorDialog(false);
    router.push("/");
  };

  // Display error dialog if there is an error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Dialog
          isOpen={showErrorDialog}
          onClose={handleCloseDialog}
          title={t("youtubeConnectionError")}
        >
          <div className="flex flex-col items-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-300">{error}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="https://www.youtube.com/create_channel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                {tButtons("createYouTubeChannel")}
              </Link>
              <button
                onClick={handleCloseDialog}
                className="rounded-lg border border-gray-300 bg-transparent px-5 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                {tButtons("returnToHome")}
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  // Return loading while the effect is running
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 dark:border-gray-600 dark:border-t-red-500"></div>
    </div>
  );
}

export default function YouTubeCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-red-600 dark:border-gray-600 dark:border-t-red-500"></div>
        </div>
      }
    >
      <YouTubeCallbackContent />
    </Suspense>
  );
}
