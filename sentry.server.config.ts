// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Read DSN from environment variable for security and flexibility
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Enable debug mode if DSN is missing to help with debugging
  ...(process.env.NEXT_PUBLIC_SENTRY_DSN ? {} : { debug: true }),

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  _experiments: { enableLogs: true },
});

// Warn at runtime if DSN is missing (helps developers catch misconfigurations)
if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.warn(
    "[Sentry] NEXT_PUBLIC_SENTRY_DSN environment variable is not set. Sentry will not report errors."
  );
}
