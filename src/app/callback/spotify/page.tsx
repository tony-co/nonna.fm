"use client";

import { handleSpotifyCallback } from "@/lib/services/spotify/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface SpotifyCallbackProps {
  searchParams: Promise<SearchParams>;
}

export default function SpotifyCallback({ searchParams }: SpotifyCallbackProps) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Convert search params to string for the callback handler
        const searchString = Object.entries(await searchParams)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

        // Handle the callback and get the result
        const { success, role } = await handleSpotifyCallback(searchString);

        console.log("tony handle callback", success, role);

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
          role === "target"
            ? `/transfer?source=${sourceService}&target=spotify`
            : `/source?source=spotify`;

        console.log("tony redirect url", redirectUrl);

        router.push(redirectUrl);
        console.log("tony redirected");
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
