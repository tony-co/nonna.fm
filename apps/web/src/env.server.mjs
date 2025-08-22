import { z } from "zod";

// Full server-side schema (includes secrets)
export const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Spotify OAuth Configuration
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z.string().url(),

  // YouTube Music OAuth Configuration
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),

  // PostHog Configuration
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
});

// Server-side env: use only on the server!
export const env = envSchema.parse(process.env);

// Note: Do NOT import this file in Edge Runtime code (middleware, edge API routes, etc.)
// It uses Zod, which is not compatible with Edge Runtime due to dynamic code evaluation.
