"use client";

import { handleSpotifyCallback } from "@/lib/services/spotify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { Suspense } from "react";

function SpotifyCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Get the raw search string from the URL
        const searchString = searchParams.toString();

        // Handle the callback and get the result
        const { success, role } = await handleSpotifyCallback(searchString);

        console.log("Callback result:", success, role);

        if (!success) {
          console.error("Failed to handle Spotify callback");
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
          role === "target" ? `/library/${sourceService}/spotify` : `/source?source=spotify`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during Spotify callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Return null while the effect is running
  return null;
}

export default function SpotifyCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpotifyCallbackContent />
    </Suspense>
  );
}
