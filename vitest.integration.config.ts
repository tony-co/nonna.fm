/// <reference types="vitest" />
import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

const env = loadEnv("test", process.cwd(), "");

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "**/src/__tests__/integration/auth.test.ts",
      "**/src/__tests__/integration/api.test.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
    ],
    sequence: {
      shuffle: false, // Don't randomize test order
      concurrent: false, // Run tests sequentially
    },
    env: {
      ...env,
      NEXT_PUBLIC_SPOTIFY_CLIENT_ID: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: env.SPOTIFY_CLIENT_SECRET,
      TEST_SPOTIFY_PLAYLIST_ID: env.TEST_SPOTIFY_PLAYLIST_ID,
      TEST_SPOTIFY_ALBUM_ID: env.TEST_SPOTIFY_ALBUM_ID,
    },
    environmentOptions: {
      envFile: ".env.test.local",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
