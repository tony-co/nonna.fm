/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { configDefaults } from "vitest/config";

// Define test exclusion patterns
const testExclude = [
  "**/src/__tests__/integration/**",
  "**/src/__mocks__/**",
  "**/node_modules/**",
  "**/dist/**",
  "**/cypress/**",
  "**/.{idea,git,cache,output,temp,next}/**",
];

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    include: ["**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: testExclude,
    server: {
      deps: {
        // https://github.com/vercel/next.js/issues/77200
        inline: ["next-intl"],
      },
    },
    // Output coverage for all tests to coverage/
    coverage: {
      provider: "v8",
      reportsDirectory: "coverage",
      // Exclude all mocks from coverage to ensure accurate stats
      exclude: [...configDefaults.exclude, ...testExclude, "**/__tests__/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
