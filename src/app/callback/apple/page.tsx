"use client";

import { handleAppleCallback } from "@/lib/services/apple/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getServiceType } from "@/lib/auth/constants";
import { Suspense } from "react";

function AppleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      try {
        // Get the raw search string from the URL
        const searchString = searchParams.toString();

        // Handle the callback and get the result
        const { success, role } = await handleAppleCallback(searchString);

        console.log("Apple callback result:", success, role);

        if (!success) {
          console.error("Failed to handle Apple Music callback");
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
          role === "target" ? `/library/${sourceService}/apple` : `/source?source=apple`;

        console.log("Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error during Apple Music callback:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [searchParams, router]);

  // Return null while the effect is running
  return null;
}

export default function AppleCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppleCallbackContent />
    </Suspense>
  );
}
