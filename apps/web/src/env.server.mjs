import { z } from "zod";

// Full server-side schema (includes secrets)
export const envSchema = z.object({
  // === Core Application ===
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string({ error: "NEXT_PUBLIC_APP_URL must be a valid URL" }).url(),

  // === Database & Infrastructure ===
  REDIS_URL: z.string({ error: "REDIS_URL must be a valid URL" }).url().optional(),

  // === SEO & Analytics ===
  NEXT_PUBLIC_POSTHOG_KEY: z.string({ error: "NEXT_PUBLIC_POSTHOG_KEY is required" }).min(1),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string({ error: "NEXT_PUBLIC_POSTHOG_HOST must be a valid URL" })
    .url(),
  GOOGLE_SITE_VERIFICATION: z.string().optional(),

  // === Spotify OAuth ===
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z
    .string({ error: "NEXT_PUBLIC_SPOTIFY_CLIENT_ID is required" })
    .min(1),
  SPOTIFY_CLIENT_SECRET: z.string({ error: "SPOTIFY_CLIENT_SECRET is required" }).min(1).optional(),
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z
    .string({ error: "NEXT_PUBLIC_SPOTIFY_REDIRECT_URI must be a valid URL" })
    .url(),
  // Legacy environment variables for backwards compatibility
  SPOTIFY_CLIENT_ID: z.string().optional(),
  SPOTIFY_REDIRECT_URI: z
    .string({ error: "SPOTIFY_REDIRECT_URI must be a valid URL" })
    .url()
    .optional(),

  // === YouTube Music OAuth ===
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: z
    .string({ error: "NEXT_PUBLIC_YOUTUBE_CLIENT_ID is required" })
    .min(1),
  YOUTUBE_CLIENT_SECRET: z.string({ error: "YOUTUBE_CLIENT_SECRET is required" }).min(1).optional(),

  // === Apple Music Configuration ===
  APPLE_MUSIC_TEAM_ID: z.string({ error: "APPLE_MUSIC_TEAM_ID is required" }).min(1).optional(),
  APPLE_MUSIC_KEY_ID: z.string({ error: "APPLE_MUSIC_KEY_ID is required" }).min(1).optional(),
  APPLE_MUSIC_PRIVATE_KEY: z
    .string({ error: "APPLE_MUSIC_PRIVATE_KEY is required" })
    .min(1)
    .optional(),
});

// Server-side env: use only on the server!
export const env = envSchema.parse(process.env);

// Note: Do NOT import this file in Edge Runtime code (middleware, edge API routes, etc.)
// It uses Zod, which is not compatible with Edge Runtime due to dynamic code evaluation.
