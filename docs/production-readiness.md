# Production-readiness audit

Scope: review the existing application and fix architecture, correctness, performance, security, and delivery problems without adding product features. Spotify and Apple Music remain the production providers; development providers remain restricted by the existing service configuration.

## Changes

| Area | Finding | Resolution |
| --- | --- | --- |
| Matching | Each consumer owned a queue while sharing state; cancelled results could commit | One queue per library provider, task deduplication, cancellation guards after awaits, reducer-based result merges |
| Playlists | Sidebar and page competed to load tracks; partial data looked complete | One shared promise per playlist, explicit loading/loaded/error states, local failure recovery, final results committed even without progress callbacks |
| Empty accounts | Empty collections triggered repeat loading and perpetual spinners | Initialization tracked separately from collection size |
| Spotify | Playlist pagination skipped pages, and zero counts were rejected | Shared sequential pagination, up to three concurrent collection requests, unavailable tracks filtered |
| Apple | Saved-song payload was incorrect; empty 202 responses retried; token requests doubled API traffic | Correct `ids[songs]` query, empty-success handling, cached/coalesced developer-token requests, authenticated storefront resolution, bounded initialization recovery |
| Transfers | Later failures lost earlier success and charged attempted items | Settled batch counts, per-operation accounting of confirmed writes, visible partial results, reentry guard, session/account checks before subsequent operations |
| OAuth | State validation compared only roles; refreshes raced | Complete nonce verification, role-specific state lookup, consistent redirects, coalesced refreshes, stale-session guards |
| Redis | Read/modify/write lost updates and extended expiry on every write | Atomic Lua check/increment, fixed 24-hour window, shared connection promise, bounded connection failures |
| Server endpoints | Debug token logs, unvalidated requests, unbounded per-token YouTube instances | Validated inputs, no-store token responses, upstream timeouts, one public catalog client without retained user tokens |
| Rendering | Quadratic selection/matching lookups, one observer per row, eager provider/analytics loading | Set/Map lookups, shared observer, memoized rows, dynamic provider/analytics loading |
| Structure | Unused server wrapper, duplicate state, legacy auth stub and unused build tooling | Removed those paths; documented current module responsibilities |
| CI | PRs skipped production builds and relied on external coverage service credentials | PR builds, dependency audit, coverage artifacts, isolated Redis and desktop/mobile browser tests |

The dependency lockfile was refreshed within existing major versions. Narrow overrides update pinned vulnerable `postcss`, `minimatch`, and `yaml` transitive dependencies. The audit reported 129 advisories before the change and zero afterward. Biome remains pinned to 2.2.4 to avoid unrelated rule migrations.

The Next.js production build reports shared first-load JavaScript decreasing from 158 kB to 103 kB (about 35%). This measures initial bundles, not total bytes downloaded after deferred analytics loads. It is not a field performance or provider throughput measurement.

## State ownership

A service-pair layout creates one `LibraryProvider`, keyed by source and target. Reducer state owns library data, selection, load statuses, and matching progress. Session operations own in-flight requests and cancellation. Disposal invalidates late loads and aborts matching result commits. Matching retains the complete task's membership even when React has not yet committed a final playlist-load update.

Read requests retry bounded transient failures. Playlist creation and append operations retry explicit rate-limit responses only; an ambiguous transport failure is not automatically replayed. Batch writes retain successful counts when another batch fails. Usage is recorded against the original destination account after each confirmed provider operation. Leaving the session or changing destination accounts prevents subsequent jobs from starting.

## Verification and limits

Tests exercise the real library reducer and matching queue, pagination, cancellation, empty libraries, retries, OAuth state and refresh races, partial writes, and concurrent Redis updates. Browser smoke tests cover seven locales, desktop/mobile layouts, empty authenticated libraries using mocked providers, and invalid service routes.

- Provider authorization and real account writes require live account acceptance testing. Automated tests do not mutate real music libraries or use local credentials.
- Usage limits remain advisory: the browser submits a platform ID and performs provider writes directly. Atomic Redis accounting fixes races but does not make this a server-enforced billing or abuse boundary. The code does not introduce paid tiers or a new server-side transfer product.
- Provider writes and Redis accounting cannot be one transaction. If accounting fails after a confirmed write, the UI preserves the result, reports the problem, and stops subsequent work. A provider timeout may still mean the write happened; review the destination before manually retrying.
- OAuth user credentials remain in browser storage, as required by the current browser-driven integration. Server signing secrets remain server-only. Keep third-party scripts and production access controls under review.
- Cancellation prevents stale result commits and subsequent batch work; provider requests already in flight can finish.
- The repository does not contain production traffic measurements or service-account test access. Production readiness must include deployment configuration, Redis availability, and monitoring actual provider limits.

## Primary references

- [Apple: Add a resource to a library](https://developer.apple.com/documentation/applemusicapi/add-a-resource-to-a-library)
- [YouTube: Playlist operations](https://developers.google.com/youtube/v3/guides/implementation/playlists)
- [Redis: Atomic Lua execution](https://redis.io/docs/latest/develop/programmability/eval-intro/)
- [Next.js security advisories](https://github.com/vercel/next.js/security/advisories)
