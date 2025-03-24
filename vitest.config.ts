import { loadEnvConfig } from "@next/env";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

loadEnvConfig(process.cwd());

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
  },
});
