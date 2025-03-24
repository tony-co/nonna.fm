import { z } from "zod";

export const envSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Spotify OAuth Configuration
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: z.string().min(1),
  SPOTIFY_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: z.string().url(),

  // YouTube Music OAuth Configuration
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: z.string().min(1),
  YOUTUBE_CLIENT_SECRET: z.string().min(1),

  // Basic Auth Configuration
  BASIC_AUTH_USER: z.string().min(1),
  BASIC_AUTH_PASSWORD: z.string().min(1),
});

export const env = envSchema.parse({
  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,

  // Spotify OAuth Configuration
  NEXT_PUBLIC_SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  NEXT_PUBLIC_SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,

  // YouTube Music OAuth Configuration
  NEXT_PUBLIC_YOUTUBE_CLIENT_ID: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,

  // Basic Auth Configuration
  BASIC_AUTH_USER: process.env.BASIC_AUTH_USER,
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,
});
