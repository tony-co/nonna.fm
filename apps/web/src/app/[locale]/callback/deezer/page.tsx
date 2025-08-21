"use client";

import { handleDeezerCallback } from "@/lib/services/deezer/auth";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { Suspense } from "react";

function DeezerCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Get the raw search string from the URL
        const searchString = searchParams.toString();

        // Handle the callback and get the result
        const { success, role } = await handleDeezerCallback(searchString);

        console.log("Deezer callback result:", success, role);

        if (!success) {
          console.error("Failed to handle Deezer callback");
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
          role === "target" ? `/library/${sourceService}/deezer` : `/source?source=deezer`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during Deezer callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Return null while the effect is running
  return null;
}

export default function DeezerCallback() {
  const t = useTranslations("Loading");

  return (
    <Suspense fallback={<div>{t("loading")}</div>}>
      <DeezerCallbackContent />
    </Suspense>
  );
}
