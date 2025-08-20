module.exports = [
"[project]/apps/web/.next-internal/server/app/api/user/status/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/redis [external] (redis, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("redis", () => require("redis"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/constants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Constants shared between client and server components
// Daily transfer limit for free users
__turbopack_context__.s([
    "FREE_TIER_LIMIT",
    ()=>FREE_TIER_LIMIT,
    "PREMIUM_TIER_LIMIT",
    ()=>PREMIUM_TIER_LIMIT
]);
const FREE_TIER_LIMIT = 500;
const PREMIUM_TIER_LIMIT = 5000;
}),
"[project]/apps/web/src/lib/redis.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createKey",
    ()=>createKey,
    "createUsageKey",
    ()=>createUsageKey,
    "getUsage",
    ()=>getUsage,
    "incrementUsage",
    ()=>incrementUsage,
    "redis",
    ()=>redis
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$redis__$5b$external$5d$__$28$redis$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/redis [external] (redis, cjs)");
// WARNING: This module contains server-only code and should NEVER be imported in client components
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-route] (ecmascript)");
;
;
const redis = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$redis__$5b$external$5d$__$28$redis$2c$__cjs$29$__["createClient"])({
    url: process.env.REDIS_URL || ""
});
// Add error handling
redis.on("error", (err)=>{
    console.error("Redis Client Error:", err);
});
// Connect to Redis only when needed (lazy initialization)
async function getRedisClient() {
    try {
        if (!redis.isOpen) {
            await redis.connect();
        }
        return redis;
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        throw error;
    }
}
// Get current environment to prefix keys
const getEnvPrefix = ()=>{
    const env = ("TURBOPACK compile-time value", "development") || "development";
    return `${env}:`;
};
const createKey = (key)=>{
    return `${getEnvPrefix()}${key}`;
};
const createUsageKey = (platformIdHash)=>{
    return createKey(`usage:${platformIdHash}`);
};
;
async function incrementUsage(usageKey, count = 1) {
    const client = await getRedisClient();
    // Get the current value
    const currentValue = await client.get(usageKey);
    const newValue = parseInt(currentValue || "0", 10) + count;
    // Set the new value with TTL (24 hours)
    await client.set(usageKey, newValue.toString(), {
        EX: 86400
    });
    return newValue;
}
async function getUsage(usageKey) {
    const client = await getRedisClient();
    const [value, ttl] = await Promise.all([
        client.get(usageKey),
        client.ttl(usageKey)
    ]);
    return {
        usage: parseInt(value || "0", 10),
        ttl: ttl
    };
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/apps/web/src/app/api/user/status/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/lib/redis.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
// Helper to hash platform user IDs
const hashPlatformId = (platformId)=>{
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(platformId).digest("hex");
};
// Get the platform user ID from the request header
const getPlatformUserId = async (req)=>{
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        throw new Error("No user ID provided");
    }
    return userId;
};
async function GET(req) {
    try {
        // Get platform user ID
        const platformUserId = await getPlatformUserId(req);
        const platformIdHash = hashPlatformId(platformUserId);
        // Create Redis key
        const usageKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createUsageKey"])(platformIdHash);
        // Get current usage and TTL
        const { usage: currentUsage, ttl } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$redis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getUsage"])(usageKey);
        // For now, hardcode isPremium to false
        const isPremium = false;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            isPremium,
            currentUsage,
            resetInSeconds: ttl
        });
    } catch (error) {
        console.error("Error getting user status:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to get usage status"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9ff394a9._.js.map