import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    settings: {
      next: {
        rootDir: "./",
      },
    },
    overrides: [
      {
        files: ["**/*.ts"],
        rules: {
          "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
        },
      },
      {
        files: ["**/*.tsx"],
        rules: {
          "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
          "@typescript-eslint/no-explicit-any": "error",
          "@typescript-eslint/explicit-function-return-type": "off",
        },
      },
    ],
  }),
];

export default config;
