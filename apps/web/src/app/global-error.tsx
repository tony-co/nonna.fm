"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { logger } from "@/lib/utils/logger";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // Capture global errors with PostHog
    logger.captureException(error, {
      level: "fatal",
      tags: {
        component: "global-error",
        errorBoundary: "root",
      },
      extra: {
        digest: error.digest,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
