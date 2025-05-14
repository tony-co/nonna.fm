// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Read DSN from environment variable for security and flexibility
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Enable debug mode if DSN is missing to help with debugging
  ...(process.env.NEXT_PUBLIC_SENTRY_DSN ? {} : { debug: true }),

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,
});

// Warn at runtime if DSN is missing (helps developers catch misconfigurations)
if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.warn(
    "[Sentry] NEXT_PUBLIC_SENTRY_DSN environment variable is not set. Sentry will not report errors."
  );
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
