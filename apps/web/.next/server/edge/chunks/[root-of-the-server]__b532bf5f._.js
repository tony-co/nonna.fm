(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__b532bf5f._.js",
"[project]/apps/web/src/env.mjs [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[project]/apps/web/sentry.edge.config.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
// Edge Runtime: must use Edge-safe env (no Zod)
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/env.mjs [instrumentation-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/esm/edge/index.js [instrumentation-edge] (ecmascript) <locals>");
;
;
// Only initialize Sentry if DSN is provided
if (__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_SENTRY_DSN) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__["init"]({
        dsn: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$env$2e$mjs__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__["env"].NEXT_PUBLIC_SENTRY_DSN,
        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: 1,
        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        _experiments: {
            enableLogs: true
        }
    });
} else {
    console.warn("[Sentry] NEXT_PUBLIC_SENTRY_DSN environment variable is not set. Sentry will not report errors.");
}
}),
"[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "onRequestError",
    ()=>onRequestError,
    "register",
    ()=>register
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$common$2f$captureRequestError$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/esm/common/captureRequestError.js [instrumentation-edge] (ecmascript)");
globalThis["_sentryNextJsVersion"] = "15.5.0";
;
async function register() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time truthy", 1) {
        await Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/web/sentry.edge.config.ts [instrumentation-edge] (ecmascript)"));
    }
}
const onRequestError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$common$2f$captureRequestError$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__["captureRequestError"];
}),
"[project]/apps/web/edge-wrapper.js { MODULE => \"[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/web/src/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__b532bf5f._.js.map