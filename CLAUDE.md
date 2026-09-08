# Repository guidance

Nonna.fm is a pnpm workspace containing one Next.js 15 / React 19 application at `apps/web`. Root scripts use Turborepo. Use Node.js 22 and the pnpm version pinned in `package.json`.

- `pnpm dev`: HTTPS development at `nonnalocal.fm:3000`.
- `pnpm type-check`, `pnpm biome:ci`, `pnpm test`: local quality checks.
- `pnpm test:coverage`: coverage and optional isolated Redis tests (`REDIS_TEST_URL`).
- `pnpm build`, then `pnpm --filter web test:e2e`: production build and browser smoke tests.

Use TypeScript strict types, Biome formatting, and Zod v4 (`zod/v4`). Next.js route params are promises. Pages are server components unless browser behavior requires a client boundary. Tailwind v4 is configured in `src/app/globals.css`.

`LibraryProvider` owns reducer state and `LibraryContext.operations.ts` owns one matching queue and one deduplicated playlist loader per library session. Hooks consume these operations; do not introduce module-global queues or independent loaders. Merge async results through reducer actions, and distinguish loaded empty collections from collections that have not loaded.

Providers implement `IMusicServiceProvider` and are loaded by `lib/services/factory.ts`. Search progress is a ratio from 0 to 1. Transfer results must report confirmed additions, failures, total input count, and any created playlist ID. Do not blindly retry non-idempotent writes. Server credentials belong behind `server-only` imports.

Spotify and Apple Music are currently available in production. YouTube and Deezer are development integrations; Deezer is source-only. Preserve those boundaries unless explicitly asked to change them.

Environment values are documented in README.md. Never commit `.env.local`, credentials, provider tokens, or generated build/test output. Logging uses PostHog with console fallback; this project does not use Sentry.
