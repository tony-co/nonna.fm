# Redis operations

## September 2026 recovery

The old `redis-nonna` resource was marked **Uninstalled** by its provider, and its configured hostname no longer resolved. Production usage requests timed out before the production-readiness changes; afterward they returned HTTP 503 promptly. The failure was the removed database, not an authentication or Lua compatibility issue.

A replacement `nonna-redis` database uses the existing Redis Cloud integration on Vercel, on the free 30 MB plan in `iad1`, alongside the production functions. `REDIS_URL` is stored in Vercel environment settings and must never be committed.

## Weekly activity

`apps/web/vercel.json` schedules `/api/health/redis` each Monday at 08:17 UTC. Vercel runs this only on production deployments. The handler requires the bearer token from `CRON_SECRET`, makes a real Redis read through the same connection as usage tracking, and returns an uncached HTTP 200 on success or HTTP 503 on failure. It does not change a user's transfer count.

Redis Cloud documents automatic deletion of free databases after 14 inactive days. The weekly check keeps the database active while the cron is enabled and succeeding. This does not change the free plan's capacity or availability limits. Failed cron requests are visible in Vercel logs; this does not configure a separate paging service.

## Verify and recover

- Inspect the resource with `vercel integration-resource inspect nonna-redis --scope graindevue`.
- Inspect cron status in the project's Vercel Cron Jobs settings, and use Run to invoke the authenticated production job immediately.
- Inspect failures with `vercel logs --project nonna-fm --scope graindevue --environment production --query /api/health/redis --since 7d`.
- If Redis fails, verify that the resource is available and `REDIS_URL` matches its current connection details. Check DNS and authentication before changing application code.
- Environment changes require a new production deployment. Verify both `/api/user/status` and `/api/transfer/usage` using a unique synthetic platform ID; its test counter expires after 24 hours. Never use a real user's ID for an operational write check.
- If the free resource is removed again, provision a replacement, reconnect it, and confirm the cron is enabled. Old usage counters expire after 24 hours and contain no music library data.

References: [Redis Cloud inactivity policy](https://support.redislabs.com/hc/en-us/articles/33138489404818-Free-Redis-Cloud-Database-Deleted-Due-to-Inactivity), [Vercel cron setup](https://vercel.com/docs/cron-jobs/quickstart), [cron authentication and management](https://vercel.com/docs/cron-jobs/manage-cron-jobs).
