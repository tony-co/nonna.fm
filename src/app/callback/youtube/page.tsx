"use client";

import { handleYouTubeCallback } from "@/lib/services/youtube/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface YouTubeCallbackProps {
  searchParams: Promise<SearchParams>;
}

export default function YouTubeCallback({ searchParams }: YouTubeCallbackProps) {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Convert search params to string for the callback handler
        const searchString = Object.entries(await searchParams)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

        // Handle the callback and get the result
        const { success, role } = await handleYouTubeCallback(searchString);

        console.log("YouTube callback result:", success, role);

        if (!success) {
          console.error("Failed to handle YouTube callback");
          router.push("/");
          return;
        }

        // Get service types for both source and target
        const sourceService = getServiceType("source");
        const targetService = getServiceType("target");

        console.log("Source service:", sourceService);
        console.log("Target service:", targetService);

        // For target role, ensure we have a source service
        if (role === "target" && !sourceService) {
          console.error("Cannot redirect to transfer: no source service configured");
          router.push("/");
          return;
        }

        // Build redirect URL with service parameters
        const redirectUrl =
          role === "target"
            ? `/transfer?source=${sourceService}&target=youtube`
            : `/source?source=youtube`;

        console.log("Redirecting to:", redirectUrl);

        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during YouTube callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Return null while the effect is running
  return null;
}
