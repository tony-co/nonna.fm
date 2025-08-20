(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8445c663._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/apps/web/src/env.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Minimal Edge-safe env for use in Edge Runtime (middleware)
// Do NOT use Zod or any dynamic code evaluation here, as Edge Runtime forbids it.
// For full validation, see src/env.server.mjs (Node.js/server only).
__turbopack_context__.s([
    "env",
    ()=>env
]);
const env = {
    BASIC_AUTH_USER: process.env.BASIC_AUTH_USER || "",
    BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD || "",
    NEXT_PUBLIC_SENTRY_DSN: ("TURBOPACK compile-time value", "https://73554041aef742260939cc53dd2fbf6e@o4509320664186880.ingest.de.sentry.io/4509320666677328") || ""
}; // Note: This file must remain Edge-compatible. Do not import Zod or any code that uses eval/new Function.
}),
"[project]/apps/web/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/env.mjs [middleware-edge] (ecmascript)");
;
;
function middleware(request) {
    // Get the basic auth credentials from the request
    const basicAuth = request.headers.get("authorization");
    if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");
        // Check if the credentials match
        if (user === __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["env"].BASIC_AUTH_USER && pwd === __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["env"].BASIC_AUTH_PASSWORD) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        }
    }
    // If no credentials or invalid credentials, return 401
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"]("Authentication required", {
        status: 401,
        headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"'
        }
    });
}
const config = {
    matcher: [
        /*
     * Exclude the Sentry tunnel route from middleware to avoid conflicts.
     * This must come before other exclusions to ensure Sentry requests are not blocked.
     */ "/((?!sentry-tunnel|api|_next/static|_next/image|favicon\\.ico|manifest\\.json|favicons/).*)"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8445c663._.js.map