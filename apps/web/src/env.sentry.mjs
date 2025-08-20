import { z } from "zod";

// Minimal schema for Sentry client config (client-side only)
const sentryEnvSchema = z.object({
  NEXT_PUBLIC_SENTRY_DSN: z.string().url(),
});

export const sentryEnv = sentryEnvSchema.parse({
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
