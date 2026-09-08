# Nonna.fm

Move playlists, albums, and saved songs between music services. The production UI currently enables Spotify and Apple Music; YouTube and Deezer remain development integrations.

## Development

Requires Node.js 22 and pnpm 10.12.4.

```sh
pnpm install --frozen-lockfile
cp apps/web/.env apps/web/.env.local
pnpm dev
```

Set provider credentials in `apps/web/.env.local`, which is ignored by Git. Map `nonnalocal.fm` to `127.0.0.1` in `/etc/hosts`; the development command uses HTTPS at `https://nonnalocal.fm:3000`. Register the same callback URLs with each provider and set `NEXT_PUBLIC_APP_URL` accordingly.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public origin and OAuth callback URLs |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Spotify PKCE authorization |
| `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` | Exact registered Spotify callback URL |
| `APPLE_MUSIC_TEAM_ID`, `APPLE_MUSIC_KEY_ID`, `APPLE_MUSIC_PRIVATE_KEY` | Server-generated Apple developer tokens |
| `REDIS_URL` | Usage tracking; required for transfers |
| `CRON_SECRET` | Authorizes the weekly production Redis health check |
| `NEXT_PUBLIC_YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` | Development YouTube integration |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Optional analytics |

Spotify refreshes use PKCE and do not require a client secret. Apple private keys can contain literal `\n` escapes. Provider configuration is checked when used, so public pages can build without credentials. Deployment must supply the credentials for enabled providers and a reachable Redis server.

## Validation

```sh
pnpm type-check
pnpm biome:ci
pnpm test
pnpm audit
pnpm build
pnpm --filter web test:e2e
```

`pnpm test:coverage` produces `apps/web/coverage`. Set `REDIS_TEST_URL` to an **isolated test Redis** to run the concurrency/expiry tests; they never use the application's Redis URL by default. CI runs them against a dedicated Redis service. Browser tests require `pnpm --filter web exec playwright install chromium`, use dummy credentials, and intercept external requests.

Every PR runs type checking, formatting/lint checks, dependency auditing, unit and Redis tests, a production build, and desktop/mobile browser smoke tests.

Vercel runs `/api/health/redis` every Monday at 08:17 UTC. Set a random `CRON_SECRET` in the production environment; Vercel sends it as a bearer token. The check reads a dedicated health key, keeping the free Redis database active without modifying user usage counters. A failed check returns HTTP 503 and appears in Vercel runtime logs. See [the Redis operations guide](docs/redis-operations.md) for verification and recovery.

## Structure

- `apps/web/src/app`: Next.js App Router pages and server endpoints.
- `apps/web/src/contexts`: library state and session-owned async work.
- `apps/web/src/hooks`: UI-facing hooks for matching, playlist loading, and transfers.
- `apps/web/src/lib/services`: provider-specific authentication and APIs, loaded on demand.
- `apps/web/src/lib/server`: server-only endpoint helpers; Redis and Apple signing remain on the server.
- `apps/web/src/lib/utils`: matching scores, request retries, batching, and logging.
- `apps/web/src/__tests__`, `apps/web/e2e`: unit/regression and browser tests.
- `apps/web/messages`: translations for seven locales.

See [the production-readiness audit](docs/production-readiness.md) for implementation decisions and operational limits.

## Contributing

Create a branch, run the validation commands, and open a pull request. Keep provider availability and existing user flows unchanged unless a feature change is explicitly intended.

## License

[GNU AGPL v3](LICENSE).
