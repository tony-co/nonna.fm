// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Access env vars directly to avoid validation issues during instrumentation
const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is provided
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    _experiments: { enableLogs: true },
  });
} else {
  console.warn(
    "[Sentry] NEXT_PUBLIC_SENTRY_DSN environment variable is not set. Sentry will not report errors."
  );
}
