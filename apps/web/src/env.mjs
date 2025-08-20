// Minimal Edge-safe env for use in Edge Runtime (middleware)
// Do NOT use Zod or any dynamic code evaluation here, as Edge Runtime forbids it.
// For full validation, see src/env.server.mjs (Node.js/server only).

export const env = {
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || "",
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || "",
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  // Add other public/edge-safe env vars as needed
};

// Note: This file must remain Edge-compatible. Do not import Zod or any code that uses eval/new Function.
