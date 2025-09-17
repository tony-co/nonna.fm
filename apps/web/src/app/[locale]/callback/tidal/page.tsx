"use client";

import { handleTidalCallback } from "@/lib/services/tidal/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { Suspense } from "react";

function TidalCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Get the raw search string from the URL
        const searchString = searchParams.toString();

        // Handle the callback and get the result
        const { success, role } = await handleTidalCallback(searchString);

        console.log("Tidal callback result:", success, role);

        if (!success) {
          console.error("Failed to handle Tidal callback");
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
          role === "target" ? `/library/${sourceService}/tidal` : `/source?source=tidal`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during Tidal callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Return null while the effect is running
  return null;
}

export default function TidalCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TidalCallbackContent />
    </Suspense>
  );
}
