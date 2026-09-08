import "server-only";
import { z } from "zod/v4";

const optionalString = z.preprocess(value => value === "" ? undefined : value, z.string().min(1).optional());
const optionalUrl = z.preprocess(value => value === "" ? undefined : value, z.url().optional());

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.url().default("https://nonna.fm"),
  REDIS_URL: optionalUrl,
  NEXT_PUBLIC_POSTHOG_KEY: optionalString,
  NEXT_PUBLIC_POSTHOG_HOST: optionalUrl,
  GOOGLE_SITE_VERIFICATION: optionalString,
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: optionalString,
  SPOTIFY_CLIENT_SECRET: optionalString,
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: optionalUrl,
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: optionalString,
  YOUTUBE_CLIENT_SECRET: optionalString,
  APPLE_MUSIC_TEAM_ID: optionalString,
  APPLE_MUSIC_KEY_ID: optionalString,
  APPLE_MUSIC_PRIVATE_KEY: optionalString,
});

// Provider credentials are required by the corresponding operation, not by a public-page build.
export const env = envSchema.parse(process.env);
