// PostHog client initialization for Next.js 15.3+
// Simplified setup following PostHog's recommended approach
import posthog from "posthog-js";

if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_HOST) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,

    // Enable debug mode in development
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },

    // PostHog configuration options
    capture_pageview: true, // Enable automatic pageview capture for Next.js App Router
    capture_pageleave: true, // Capture when users leave the page

    // Privacy and GDPR compliance
    respect_dnt: true,
    opt_out_capturing_by_default: false,

    // Performance settings
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true, // Mask all inputs for privacy
      maskTextSelector: "*", // Mask all text
      blockClass: "ph-no-capture", // CSS class to block elements from recording
      ignoreClass: "ph-ignore", // CSS class to ignore elements
    },

    // Feature flags
    bootstrap: {
      featureFlags: {},
    },

    // PostHog defaults date as requested
    defaults: "2025-05-24",
  });
} else {
  console.warn(
    "[PostHog] NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST environment variables are not set. PostHog will not track events."
  );
}
