module.exports = [
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/http.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentationHttp = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-http@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-http/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Http';
const INSTRUMENTATION_NAME = '@opentelemetry_sentry-patched/instrumentation-http';
const instrumentSentryHttp = nodeCore.generateInstrumentOnce(`${INTEGRATION_NAME}.sentry`, (options)=>{
    return new nodeCore.SentryHttpInstrumentation(options);
});
const instrumentOtelHttp = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, (config)=>{
    const instrumentation = new instrumentationHttp.HttpInstrumentation(config);
    // We want to update the logger namespace so we can better identify what is happening here
    try {
        instrumentation['_diag'] = api.diag.createComponentLogger({
            namespace: INSTRUMENTATION_NAME
        });
        // @ts-expect-error We are writing a read-only property here...
        instrumentation.instrumentationName = INSTRUMENTATION_NAME;
    } catch  {
    // ignore errors here...
    }
    return instrumentation;
});
/** Exported only for tests. */ function _shouldInstrumentSpans(options, clientOptions = {}) {
    // If `spans` is passed in, it takes precedence
    // Else, we by default emit spans, unless `skipOpenTelemetrySetup` is set to `true` or spans are not enabled
    if (typeof options.spans === 'boolean') {
        return options.spans;
    }
    if (clientOptions.skipOpenTelemetrySetup) {
        return false;
    }
    // IMPORTANT: We only disable span instrumentation when spans are not enabled _and_ we are on Node 22+,
    // as otherwise the necessary diagnostics channel is not available yet
    if (!core.hasSpansEnabled(clientOptions) && nodeCore.NODE_VERSION.major >= 22) {
        return false;
    }
    return true;
}
/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs and spans for outgoing HTTP requests which will be attached to the currently active span.
 */ const httpIntegration = core.defineIntegration((options = {})=>{
    const dropSpansForIncomingRequestStatusCodes = options.dropSpansForIncomingRequestStatusCodes ?? [
        [
            401,
            404
        ],
        [
            300,
            399
        ]
    ];
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            const instrumentSpans = _shouldInstrumentSpans(options, core.getClient()?.getOptions());
            // This is Sentry-specific instrumentation for request isolation and breadcrumbs
            instrumentSentryHttp({
                ...options,
                // If spans are not instrumented, it means the HttpInstrumentation has not been added
                // In that case, we want to handle incoming trace extraction ourselves
                extractIncomingTraceFromHeader: !instrumentSpans,
                // If spans are not instrumented, it means the HttpInstrumentation has not been added
                // In that case, we want to handle trace propagation ourselves
                propagateTraceInOutgoingRequests: !instrumentSpans
            });
            // This is the "regular" OTEL instrumentation that emits spans
            if (instrumentSpans) {
                const instrumentationConfig = getConfigWithDefaults(options);
                instrumentOtelHttp(instrumentationConfig);
            }
        },
        processEvent (event) {
            // Drop transaction if it has a status code that should be ignored
            if (event.type === 'transaction') {
                const statusCode = event.contexts?.trace?.data?.['http.response.status_code'];
                if (typeof statusCode === 'number' && dropSpansForIncomingRequestStatusCodes.some((code)=>{
                    if (typeof code === 'number') {
                        return code === statusCode;
                    }
                    const [min, max] = code;
                    return statusCode >= min && statusCode <= max;
                })) {
                    return null;
                }
            }
            return event;
        }
    };
});
/**
 * Determines if @param req is a ClientRequest, meaning the request was created within the express app
 * and it's an outgoing request.
 * Checking for properties instead of using `instanceOf` to avoid importing the request classes.
 */ function _isClientRequest(req) {
    return 'outputData' in req && 'outputSize' in req && !('client' in req) && !('statusCode' in req);
}
/**
 * Detects if an incoming request is a prefetch request.
 */ function isKnownPrefetchRequest(req) {
    // Currently only handles Next.js prefetch requests but may check other frameworks in the future.
    return req.headers['next-router-prefetch'] === '1';
}
function getConfigWithDefaults(options = {}) {
    const instrumentationConfig = {
        ...options.instrumentation?._experimentalConfig,
        disableIncomingRequestInstrumentation: options.disableIncomingRequestSpans,
        ignoreOutgoingRequestHook: (request)=>{
            const url = nodeCore.getRequestUrl(request);
            if (!url) {
                return false;
            }
            const _ignoreOutgoingRequests = options.ignoreOutgoingRequests;
            if (_ignoreOutgoingRequests?.(url, request)) {
                return true;
            }
            return false;
        },
        ignoreIncomingRequestHook: (request)=>{
            // request.url is the only property that holds any information about the url
            // it only consists of the URL path and query string (if any)
            const urlPath = request.url;
            const method = request.method?.toUpperCase();
            // We do not capture OPTIONS/HEAD requests as transactions
            if (method === 'OPTIONS' || method === 'HEAD') {
                return true;
            }
            // Default static asset filtering
            if (options.ignoreStaticAssets !== false && method === 'GET' && urlPath && isStaticAssetRequest(urlPath)) {
                return true;
            }
            const _ignoreIncomingRequests = options.ignoreIncomingRequests;
            if (urlPath && _ignoreIncomingRequests?.(urlPath, request)) {
                return true;
            }
            return false;
        },
        requireParentforOutgoingSpans: false,
        requireParentforIncomingSpans: false,
        requestHook: (span, req)=>{
            nodeCore.addOriginToSpan(span, 'auto.http.otel.http');
            if (!_isClientRequest(req) && isKnownPrefetchRequest(req)) {
                span.setAttribute('sentry.http.prefetch', true);
            }
            options.instrumentation?.requestHook?.(span, req);
        },
        responseHook: (span, res)=>{
            options.instrumentation?.responseHook?.(span, res);
        },
        applyCustomAttributesOnSpan: (span, request, response)=>{
            options.instrumentation?.applyCustomAttributesOnSpan?.(span, request, response);
        }
    };
    return instrumentationConfig;
}
/**
 * Check if a request is for a common static asset that should be ignored by default.
 *
 * Only exported for tests.
 */ function isStaticAssetRequest(urlPath) {
    const path = core.stripUrlQueryAndFragment(urlPath);
    // Common static file extensions
    if (path.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot|webp|avif)$/)) {
        return true;
    }
    // Common metadata files
    if (path.match(/^\/(robots\.txt|sitemap\.xml|manifest\.json|browserconfig\.xml)$/)) {
        return true;
    }
    return false;
}
exports._shouldInstrumentSpans = _shouldInstrumentSpans;
exports.httpIntegration = httpIntegration;
exports.instrumentOtelHttp = instrumentOtelHttp;
exports.isStaticAssetRequest = isStaticAssetRequest; //# sourceMappingURL=http.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/node-fetch.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationUndici = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-undici@0.14.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-undici/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'NodeFetch';
const instrumentOtelNodeFetch = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, instrumentationUndici.UndiciInstrumentation, (options)=>{
    return getConfigWithDefaults(options);
});
const instrumentSentryNodeFetch = nodeCore.generateInstrumentOnce(`${INTEGRATION_NAME}.sentry`, nodeCore.SentryNodeFetchInstrumentation, (options)=>{
    return options;
});
const _nativeNodeFetchIntegration = (options = {})=>{
    return {
        name: 'NodeFetch',
        setupOnce () {
            const instrumentSpans = _shouldInstrumentSpans(options, core.getClient()?.getOptions());
            // This is the "regular" OTEL instrumentation that emits spans
            if (instrumentSpans) {
                instrumentOtelNodeFetch(options);
            }
            // This is the Sentry-specific instrumentation that creates breadcrumbs & propagates traces
            // This must be registered after the OTEL one, to ensure that the core trace propagation logic takes presedence
            // Otherwise, the sentry-trace header may be set multiple times
            instrumentSentryNodeFetch(options);
        }
    };
};
const nativeNodeFetchIntegration = core.defineIntegration(_nativeNodeFetchIntegration);
// Matching the behavior of the base instrumentation
function getAbsoluteUrl(origin, path = '/') {
    const url = `${origin}`;
    if (url.endsWith('/') && path.startsWith('/')) {
        return `${url}${path.slice(1)}`;
    }
    if (!url.endsWith('/') && !path.startsWith('/')) {
        return `${url}/${path.slice(1)}`;
    }
    return `${url}${path}`;
}
function _shouldInstrumentSpans(options, clientOptions = {}) {
    // If `spans` is passed in, it takes precedence
    // Else, we by default emit spans, unless `skipOpenTelemetrySetup` is set to `true` or spans are not enabled
    return typeof options.spans === 'boolean' ? options.spans : !clientOptions.skipOpenTelemetrySetup && core.hasSpansEnabled(clientOptions);
}
function getConfigWithDefaults(options = {}) {
    const instrumentationConfig = {
        requireParentforSpans: false,
        ignoreRequestHook: (request)=>{
            const url = getAbsoluteUrl(request.origin, request.path);
            const _ignoreOutgoingRequests = options.ignoreOutgoingRequests;
            const shouldIgnore = _ignoreOutgoingRequests && url && _ignoreOutgoingRequests(url);
            return !!shouldIgnore;
        },
        startSpanHook: ()=>{
            return {
                [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.node_fetch'
            };
        }
    };
    return instrumentationConfig;
}
exports.nativeNodeFetchIntegration = nativeNodeFetchIntegration; //# sourceMappingURL=node-fetch.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/fs.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationFs = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-fs@0.23.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-fs/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'FileSystem';
/**
 * This integration will create spans for `fs` API operations, like reading and writing files.
 *
 * **WARNING:** This integration may add significant overhead to your application. Especially in scenarios with a lot of
 * file I/O, like for example when running a framework dev server, including this integration can massively slow down
 * your application.
 *
 * @param options Configuration for this integration.
 */ const fsIntegration = core.defineIntegration((options = {})=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationFs.FsInstrumentation({
                    requireParentSpan: true,
                    endHook (functionName, { args, span, error }) {
                        span.updateName(`fs.${functionName}`);
                        span.setAttributes({
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'file',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.file.fs'
                        });
                        if (options.recordErrorMessagesAsSpanAttributes) {
                            if (typeof args[0] === 'string' && FS_OPERATIONS_WITH_PATH_ARG.includes(functionName)) {
                                span.setAttribute('path_argument', args[0]);
                            } else if (typeof args[0] === 'string' && typeof args[1] === 'string' && FS_OPERATIONS_WITH_TARGET_PATH.includes(functionName)) {
                                span.setAttribute('target_argument', args[0]);
                                span.setAttribute('path_argument', args[1]);
                            } else if (typeof args[0] === 'string' && FS_OPERATIONS_WITH_PREFIX.includes(functionName)) {
                                span.setAttribute('prefix_argument', args[0]);
                            } else if (typeof args[0] === 'string' && typeof args[1] === 'string' && FS_OPERATIONS_WITH_EXISTING_PATH_NEW_PATH.includes(functionName)) {
                                span.setAttribute('existing_path_argument', args[0]);
                                span.setAttribute('new_path_argument', args[1]);
                            } else if (typeof args[0] === 'string' && typeof args[1] === 'string' && FS_OPERATIONS_WITH_SRC_DEST.includes(functionName)) {
                                span.setAttribute('src_argument', args[0]);
                                span.setAttribute('dest_argument', args[1]);
                            } else if (typeof args[0] === 'string' && typeof args[1] === 'string' && FS_OPERATIONS_WITH_OLD_PATH_NEW_PATH.includes(functionName)) {
                                span.setAttribute('old_path_argument', args[0]);
                                span.setAttribute('new_path_argument', args[1]);
                            }
                        }
                        if (error && options.recordErrorMessagesAsSpanAttributes) {
                            span.setAttribute('fs_error', error.message);
                        }
                    }
                }))();
        }
    };
});
const FS_OPERATIONS_WITH_OLD_PATH_NEW_PATH = [
    'rename',
    'renameSync'
];
const FS_OPERATIONS_WITH_SRC_DEST = [
    'copyFile',
    'cp',
    'copyFileSync',
    'cpSync'
];
const FS_OPERATIONS_WITH_EXISTING_PATH_NEW_PATH = [
    'link',
    'linkSync'
];
const FS_OPERATIONS_WITH_PREFIX = [
    'mkdtemp',
    'mkdtempSync'
];
const FS_OPERATIONS_WITH_TARGET_PATH = [
    'symlink',
    'symlinkSync'
];
const FS_OPERATIONS_WITH_PATH_ARG = [
    'access',
    'appendFile',
    'chmod',
    'chown',
    'exists',
    'mkdir',
    'lchown',
    'lstat',
    'lutimes',
    'open',
    'opendir',
    'readdir',
    'readFile',
    'readlink',
    'realpath',
    'realpath.native',
    'rm',
    'rmdir',
    'stat',
    'truncate',
    'unlink',
    'utimes',
    'writeFile',
    'accessSync',
    'appendFileSync',
    'chmodSync',
    'chownSync',
    'existsSync',
    'lchownSync',
    'lstatSync',
    'lutimesSync',
    'opendirSync',
    'mkdirSync',
    'openSync',
    'readdirSync',
    'readFileSync',
    'readlinkSync',
    'realpathSync',
    'realpathSync.native',
    'rmdirSync',
    'rmSync',
    'statSync',
    'truncateSync',
    'unlinkSync',
    'utimesSync',
    'writeFileSync'
];
exports.fsIntegration = fsIntegration; //# sourceMappingURL=fs.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
 *
 * ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
 */ const DEBUG_BUILD = typeof __SENTRY_DEBUG__ === 'undefined' || __SENTRY_DEBUG__;
exports.DEBUG_BUILD = DEBUG_BUILD; //# sourceMappingURL=debug-build.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/express.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationExpress = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-express@0.52.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-express/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Express';
function requestHook(span) {
    nodeCore.addOriginToSpan(span, 'auto.http.otel.express');
    const attributes = core.spanToJSON(span).data;
    // this is one of: middleware, request_handler, router
    const type = attributes['express.type'];
    if (type) {
        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_OP, `${type}.express`);
    }
    // Also update the name, we don't need to "middleware - " prefix
    const name = attributes['express.name'];
    if (typeof name === 'string') {
        span.updateName(name);
    }
}
function spanNameHook(info, defaultName) {
    if (core.getIsolationScope() === core.getDefaultIsolationScope()) {
        debugBuild.DEBUG_BUILD && core.debug.warn('Isolation scope is still default isolation scope - skipping setting transactionName');
        return defaultName;
    }
    if (info.layerType === 'request_handler') {
        // type cast b/c Otel unfortunately types info.request as any :(
        const req = info.request;
        const method = req.method ? req.method.toUpperCase() : 'GET';
        core.getIsolationScope().setTransactionName(`${method} ${info.route}`);
    }
    return defaultName;
}
const instrumentExpress = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationExpress.ExpressInstrumentation({
        requestHook: (span)=>requestHook(span),
        spanNameHook: (info, defaultName)=>spanNameHook(info, defaultName)
    }));
const _expressIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentExpress();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for [Express](https://expressjs.com/).
 *
 * If you also want to capture errors, you need to call `setupExpressErrorHandler(app)` after you set up your Express server.
 *
 * For more information, see the [express documentation](https://docs.sentry.io/platforms/javascript/guides/express/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.expressIntegration()],
 * })
 * ```
 */ const expressIntegration = core.defineIntegration(_expressIntegration);
/**
 * An Express-compatible error handler.
 */ function expressErrorHandler(options) {
    return function sentryErrorMiddleware(error, request, res, next) {
        const normalizedRequest = core.httpRequestToRequestData(request);
        // Ensure we use the express-enhanced request here, instead of the plain HTTP one
        // When an error happens, the `expressRequestHandler` middleware does not run, so we set it here too
        core.getIsolationScope().setSDKProcessingMetadata({
            normalizedRequest
        });
        const shouldHandleError = options?.shouldHandleError || defaultShouldHandleError;
        if (shouldHandleError(error)) {
            const eventId = core.captureException(error, {
                mechanism: {
                    type: 'middleware',
                    handled: false
                }
            });
            res.sentry = eventId;
        }
        next(error);
    };
}
function expressRequestHandler() {
    return function sentryRequestMiddleware(request, _res, next) {
        const normalizedRequest = core.httpRequestToRequestData(request);
        // Ensure we use the express-enhanced request here, instead of the plain HTTP one
        core.getIsolationScope().setSDKProcessingMetadata({
            normalizedRequest
        });
        next();
    };
}
/**
 * Add an Express error handler to capture errors to Sentry.
 *
 * The error handler must be before any other middleware and after all controllers.
 *
 * @param app The Express instances
 * @param options {ExpressHandlerOptions} Configuration options for the handler
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const express = require("express");
 *
 * const app = express();
 *
 * // Add your routes, etc.
 *
 * // Add this after all routes,
 * // but before any and other error-handling middlewares are defined
 * Sentry.setupExpressErrorHandler(app);
 *
 * app.listen(3000);
 * ```
 */ function setupExpressErrorHandler(app, options) {
    app.use(expressRequestHandler());
    app.use(expressErrorHandler(options));
    nodeCore.ensureIsWrapped(app.use, 'express');
}
function getStatusCodeFromResponse(error) {
    const statusCode = error.status || error.statusCode || error.status_code || error.output?.statusCode;
    return statusCode ? parseInt(statusCode, 10) : 500;
}
/** Returns true if response code is internal server error */ function defaultShouldHandleError(error) {
    const status = getStatusCodeFromResponse(error);
    return status >= 500;
}
exports.expressErrorHandler = expressErrorHandler;
exports.expressIntegration = expressIntegration;
exports.instrumentExpress = instrumentExpress;
exports.setupExpressErrorHandler = setupExpressErrorHandler; //# sourceMappingURL=express.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/fastify-otel/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dc = __turbopack_context__.r("[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+core@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/core/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const minimatch = __turbopack_context__.r("[project]/node_modules/.pnpm/minimatch@9.0.5/node_modules/minimatch/dist/commonjs/index.js [app-ssr] (ecmascript)");
/*
Vendored in and modified from @fastify/otel version 0.8.0
https://github.com/fastify/otel/releases/tag/v0.8.0

Tried not to modify the original code too much keeping it as a JavaScript CJS module to make it easier to update when required

Modifications include:
- Removed reading of package.json to get the version and package name

MIT License

Copyright (c) 2024 Fastify

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/ // SENTRY VENDOR NOTE
// Instead of using the package.json file, we hard code the package name and version here.
const PACKAGE_NAME = '@fastify/otel';
const PACKAGE_VERSION = '0.8.0';
// Constants
const SUPPORTED_VERSIONS = '>=4.0.0 <6';
const FASTIFY_HOOKS = [
    'onRequest',
    'preParsing',
    'preValidation',
    'preHandler',
    'preSerialization',
    'onSend',
    'onResponse',
    'onError'
];
const ATTRIBUTE_NAMES = {
    HOOK_NAME: 'hook.name',
    FASTIFY_TYPE: 'fastify.type',
    HOOK_CALLBACK_NAME: 'hook.callback.name',
    ROOT: 'fastify.root'
};
const HOOK_TYPES = {
    ROUTE: 'route-hook',
    INSTANCE: 'hook',
    HANDLER: 'request-handler'
};
const ANONYMOUS_FUNCTION_NAME = 'anonymous';
// Symbols
const kInstrumentation = Symbol('fastify otel instance');
const kRequestSpan = Symbol('fastify otel request spans');
const kRequestContext = Symbol('fastify otel request context');
const kAddHookOriginal = Symbol('fastify otel addhook original');
const kSetNotFoundOriginal = Symbol('fastify otel setnotfound original');
const kIgnorePaths = Symbol('fastify otel ignore path');
class FastifyOtelInstrumentation extends instrumentation.InstrumentationBase {
    constructor(config){
        super(PACKAGE_NAME, PACKAGE_VERSION, config);
        this.servername = config?.servername ?? process.env.OTEL_SERVICE_NAME ?? 'fastify';
        this[kIgnorePaths] = null;
        this._logger = api.diag.createComponentLogger({
            namespace: PACKAGE_NAME
        });
        if (config?.ignorePaths != null || process.env.OTEL_FASTIFY_IGNORE_PATHS != null) {
            const ignorePaths = config?.ignorePaths ?? process.env.OTEL_FASTIFY_IGNORE_PATHS;
            if ((typeof ignorePaths !== 'string' || ignorePaths.length === 0) && typeof ignorePaths !== 'function') {
                throw new TypeError('ignorePaths must be a string or a function');
            }
            const globMatcher = minimatch.minimatch;
            this[kIgnorePaths] = (routeOptions)=>{
                if (typeof ignorePaths === 'function') {
                    return ignorePaths(routeOptions);
                } else {
                    return globMatcher(routeOptions.url, ignorePaths);
                }
            };
        }
    }
    enable() {
        if (this._handleInitialization === undefined && this.getConfig().registerOnInitialization) {
            const FastifyInstrumentationPlugin = this.plugin();
            this._handleInitialization = (message)=>{
                message.fastify.register(FastifyInstrumentationPlugin);
            };
            dc.default.subscribe('fastify.initialization', this._handleInitialization);
        }
        return super.enable();
    }
    disable() {
        if (this._handleInitialization) {
            dc.default.unsubscribe('fastify.initialization', this._handleInitialization);
            this._handleInitialization = undefined;
        }
        return super.disable();
    }
    // We do not do patching in this instrumentation
    init() {
        return [];
    }
    plugin() {
        const instrumentation = this;
        FastifyInstrumentationPlugin[Symbol.for('skip-override')] = true;
        FastifyInstrumentationPlugin[Symbol.for('fastify.display-name')] = '@fastify/otel';
        FastifyInstrumentationPlugin[Symbol.for('plugin-meta')] = {
            fastify: SUPPORTED_VERSIONS,
            name: '@fastify/otel'
        };
        return FastifyInstrumentationPlugin;
        //TURBOPACK unreachable
        ;
        function FastifyInstrumentationPlugin(instance, opts, done) {
            instance.decorate(kInstrumentation, instrumentation);
            // addHook and notfoundHandler are essentially inherited from the prototype
            // what is important is to bound it to the right instance
            instance.decorate(kAddHookOriginal, instance.addHook);
            instance.decorate(kSetNotFoundOriginal, instance.setNotFoundHandler);
            instance.decorateRequest('opentelemetry', function openetelemetry() {
                const ctx = this[kRequestContext];
                const span = this[kRequestSpan];
                return {
                    span,
                    tracer: instrumentation.tracer,
                    context: ctx,
                    inject: (carrier, setter)=>{
                        return api.propagation.inject(ctx, carrier, setter);
                    },
                    extract: (carrier, getter)=>{
                        return api.propagation.extract(ctx, carrier, getter);
                    }
                };
            });
            instance.decorateRequest(kRequestSpan, null);
            instance.decorateRequest(kRequestContext, null);
            instance.addHook('onRoute', function(routeOptions) {
                if (instrumentation[kIgnorePaths]?.(routeOptions) === true) {
                    instrumentation._logger.debug(`Ignoring route instrumentation ${routeOptions.method} ${routeOptions.url} because it matches the ignore path`);
                    return;
                }
                for (const hook of FASTIFY_HOOKS){
                    if (routeOptions[hook] != null) {
                        const handlerLike = routeOptions[hook];
                        if (typeof handlerLike === 'function') {
                            routeOptions[hook] = handlerWrapper(handlerLike, {
                                [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                                [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - route -> ${hook}`,
                                [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.ROUTE,
                                [semanticConventions.ATTR_HTTP_ROUTE]: routeOptions.url,
                                [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: handlerLike.name?.length > 0 ? handlerLike.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                            });
                        } else if (Array.isArray(handlerLike)) {
                            const wrappedHandlers = [];
                            for (const handler of handlerLike){
                                wrappedHandlers.push(handlerWrapper(handler, {
                                    [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                                    [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - route -> ${hook}`,
                                    [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.ROUTE,
                                    [semanticConventions.ATTR_HTTP_ROUTE]: routeOptions.url,
                                    [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: handler.name?.length > 0 ? handler.name : ANONYMOUS_FUNCTION_NAME
                                }));
                            }
                            routeOptions[hook] = wrappedHandlers;
                        }
                    }
                }
                // We always want to add the onSend hook to the route to be executed last
                if (routeOptions.onSend != null) {
                    routeOptions.onSend = Array.isArray(routeOptions.onSend) ? [
                        ...routeOptions.onSend,
                        onSendHook
                    ] : [
                        routeOptions.onSend,
                        onSendHook
                    ];
                } else {
                    routeOptions.onSend = onSendHook;
                }
                // We always want to add the onError hook to the route to be executed last
                if (routeOptions.onError != null) {
                    routeOptions.onError = Array.isArray(routeOptions.onError) ? [
                        ...routeOptions.onError,
                        onErrorHook
                    ] : [
                        routeOptions.onError,
                        onErrorHook
                    ];
                } else {
                    routeOptions.onError = onErrorHook;
                }
                routeOptions.handler = handlerWrapper(routeOptions.handler, {
                    [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                    [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - route-handler`,
                    [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.HANDLER,
                    [semanticConventions.ATTR_HTTP_ROUTE]: routeOptions.url,
                    [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: routeOptions.handler.name.length > 0 ? routeOptions.handler.name : ANONYMOUS_FUNCTION_NAME
                });
            });
            instance.addHook('onRequest', function(request, _reply, hookDone) {
                if (this[kInstrumentation].isEnabled() === false) {
                    return hookDone();
                } else if (this[kInstrumentation][kIgnorePaths]?.({
                    url: request.url,
                    method: request.method
                }) === true) {
                    this[kInstrumentation]._logger.debug(`Ignoring request ${request.method} ${request.url} because it matches the ignore path`);
                    return hookDone();
                }
                let ctx = api.context.active();
                if (api.trace.getSpan(ctx) == null) {
                    ctx = api.propagation.extract(ctx, request.headers);
                }
                const rpcMetadata = core.getRPCMetadata(ctx);
                if (request.routeOptions.url != null && rpcMetadata?.type === core.RPCType.HTTP) {
                    rpcMetadata.route = request.routeOptions.url;
                }
                /** @type {import('@opentelemetry/api').Span} */ const span = this[kInstrumentation].tracer.startSpan('request', {
                    attributes: {
                        [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                        [ATTRIBUTE_NAMES.ROOT]: '@fastify/otel',
                        [semanticConventions.ATTR_HTTP_ROUTE]: request.url,
                        [semanticConventions.ATTR_HTTP_REQUEST_METHOD]: request.method
                    }
                }, ctx);
                request[kRequestContext] = api.trace.setSpan(ctx, span);
                request[kRequestSpan] = span;
                api.context.with(request[kRequestContext], ()=>{
                    hookDone();
                });
            });
            // onResponse is the last hook to be executed, only added for 404 handlers
            instance.addHook('onResponse', function(request, reply, hookDone) {
                const span = request[kRequestSpan];
                if (span != null) {
                    span.setStatus({
                        code: api.SpanStatusCode.OK,
                        message: 'OK'
                    });
                    span.setAttributes({
                        [semanticConventions.ATTR_HTTP_RESPONSE_STATUS_CODE]: 404
                    });
                    span.end();
                }
                request[kRequestSpan] = null;
                hookDone();
            });
            instance.addHook = addHookPatched;
            instance.setNotFoundHandler = setNotFoundHandlerPatched;
            done();
            function onSendHook(request, reply, payload, hookDone) {
                /** @type {import('@opentelemetry/api').Span} */ const span = request[kRequestSpan];
                if (span != null) {
                    if (reply.statusCode < 500) {
                        span.setStatus({
                            code: api.SpanStatusCode.OK,
                            message: 'OK'
                        });
                    }
                    span.setAttributes({
                        [semanticConventions.ATTR_HTTP_RESPONSE_STATUS_CODE]: reply.statusCode
                    });
                    span.end();
                }
                request[kRequestSpan] = null;
                hookDone(null, payload);
            }
            function onErrorHook(request, reply, error, hookDone) {
                /** @type {Span} */ const span = request[kRequestSpan];
                if (span != null) {
                    span.setStatus({
                        code: api.SpanStatusCode.ERROR,
                        message: error.message
                    });
                    span.recordException(error);
                }
                hookDone();
            }
            function addHookPatched(name, hook) {
                const addHookOriginal = this[kAddHookOriginal];
                if (FASTIFY_HOOKS.includes(name)) {
                    return addHookOriginal.call(this, name, handlerWrapper(hook, {
                        [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                        [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - ${name}`,
                        [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.INSTANCE,
                        [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: hook.name?.length > 0 ? hook.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                    }));
                } else {
                    return addHookOriginal.call(this, name, hook);
                }
            }
            function setNotFoundHandlerPatched(hooks, handler) {
                const setNotFoundHandlerOriginal = this[kSetNotFoundOriginal];
                if (typeof hooks === 'function') {
                    handler = handlerWrapper(hooks, {
                        [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                        [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - not-found-handler`,
                        [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.INSTANCE,
                        [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: hooks.name?.length > 0 ? hooks.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                    });
                    setNotFoundHandlerOriginal.call(this, handler);
                } else {
                    if (hooks.preValidation != null) {
                        hooks.preValidation = handlerWrapper(hooks.preValidation, {
                            [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                            [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - not-found-handler - preValidation`,
                            [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.INSTANCE,
                            [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: hooks.preValidation.name?.length > 0 ? hooks.preValidation.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                        });
                    }
                    if (hooks.preHandler != null) {
                        hooks.preHandler = handlerWrapper(hooks.preHandler, {
                            [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                            [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - not-found-handler - preHandler`,
                            [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.INSTANCE,
                            [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: hooks.preHandler.name?.length > 0 ? hooks.preHandler.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                        });
                    }
                    handler = handlerWrapper(handler, {
                        [semanticConventions.ATTR_SERVICE_NAME]: instance[kInstrumentation].servername,
                        [ATTRIBUTE_NAMES.HOOK_NAME]: `${this.pluginName} - not-found-handler`,
                        [ATTRIBUTE_NAMES.FASTIFY_TYPE]: HOOK_TYPES.INSTANCE,
                        [ATTRIBUTE_NAMES.HOOK_CALLBACK_NAME]: handler.name?.length > 0 ? handler.name : ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ 
                    });
                    setNotFoundHandlerOriginal.call(this, hooks, handler);
                }
            }
            function handlerWrapper(handler, spanAttributes = {}) {
                return function handlerWrapped(...args) {
                    /** @type {FastifyOtelInstrumentation} */ const instrumentation = this[kInstrumentation];
                    const [request] = args;
                    if (instrumentation.isEnabled() === false) {
                        return handler.call(this, ...args);
                    }
                    const ctx = request[kRequestContext] ?? api.context.active();
                    const span = instrumentation.tracer.startSpan(`handler - ${handler.name?.length > 0 ? handler.name : this.pluginName /* c8 ignore next */  ?? ANONYMOUS_FUNCTION_NAME /* c8 ignore next */ }`, {
                        attributes: spanAttributes
                    }, ctx);
                    return api.context.with(api.trace.setSpan(ctx, span), function() {
                        try {
                            const res = handler.call(this, ...args);
                            if (typeof res?.then === 'function') {
                                return res.then((result)=>{
                                    span.end();
                                    return result;
                                }, (error)=>{
                                    span.setStatus({
                                        code: api.SpanStatusCode.ERROR,
                                        message: error.message
                                    });
                                    span.recordException(error);
                                    span.end();
                                    return Promise.reject(error);
                                });
                            }
                            span.end();
                            return res;
                        } catch (error) {
                            span.setStatus({
                                code: api.SpanStatusCode.ERROR,
                                message: error.message
                            });
                            span.recordException(error);
                            span.end();
                            throw error;
                        }
                    }, this);
                };
            }
        }
    }
}
exports.FastifyOtelInstrumentation = FastifyOtelInstrumentation; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/enums/AttributeNames.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Vendored from https://github.com/open-telemetry/opentelemetry-js-contrib/blob/407f61591ba69a39a6908264379d4d98a48dbec4/plugins/node/opentelemetry-instrumentation-fastify/src/enums/AttributeNames.ts
//
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ exports.AttributeNames = void 0;
(function(AttributeNames) {
    const FASTIFY_NAME = 'fastify.name';
    AttributeNames["FASTIFY_NAME"] = FASTIFY_NAME;
    const FASTIFY_TYPE = 'fastify.type';
    AttributeNames["FASTIFY_TYPE"] = FASTIFY_TYPE;
    const HOOK_NAME = 'hook.name';
    AttributeNames["HOOK_NAME"] = HOOK_NAME;
    const PLUGIN_NAME = 'plugin.name';
    AttributeNames["PLUGIN_NAME"] = PLUGIN_NAME;
})(exports.AttributeNames || (exports.AttributeNames = {}));
exports.FastifyTypes = void 0;
(function(FastifyTypes) {
    const MIDDLEWARE = 'middleware';
    FastifyTypes["MIDDLEWARE"] = MIDDLEWARE;
    const REQUEST_HANDLER = 'request_handler';
    FastifyTypes["REQUEST_HANDLER"] = REQUEST_HANDLER;
})(exports.FastifyTypes || (exports.FastifyTypes = {}));
exports.FastifyNames = void 0;
(function(FastifyNames) {
    const MIDDLEWARE = 'middleware';
    FastifyNames["MIDDLEWARE"] = MIDDLEWARE;
    const REQUEST_HANDLER = 'request handler';
    FastifyNames["REQUEST_HANDLER"] = REQUEST_HANDLER;
})(exports.FastifyNames || (exports.FastifyNames = {})); //# sourceMappingURL=AttributeNames.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Vendored from https://github.com/open-telemetry/opentelemetry-js-contrib/blob/407f61591ba69a39a6908264379d4d98a48dbec4/plugins/node/opentelemetry-instrumentation-fastify/src/constants.ts
/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ const spanRequestSymbol = Symbol('opentelemetry.instrumentation.fastify.request_active_span');
exports.spanRequestSymbol = spanRequestSymbol; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/constants.js [app-ssr] (ecmascript)");
// Vendored from: https://github.com/open-telemetry/opentelemetry-js-contrib/blob/407f61591ba69a39a6908264379d4d98a48dbec4/plugins/node/opentelemetry-instrumentation-fastify/src/utils.ts
/* eslint-disable jsdoc/require-jsdoc */ /* eslint-disable @typescript-eslint/no-dynamic-delete */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /* eslint-disable @typescript-eslint/explicit-function-return-type */ /*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /**
 * Starts Span
 * @param reply - reply function
 * @param tracer - tracer
 * @param spanName - span name
 * @param spanAttributes - span attributes
 */ function startSpan(reply, tracer, spanName, spanAttributes = {}) {
    const span = tracer.startSpan(spanName, {
        attributes: spanAttributes
    });
    const spans = reply[constants.spanRequestSymbol] || [];
    spans.push(span);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Object.defineProperty(reply, constants.spanRequestSymbol, {
        enumerable: false,
        configurable: true,
        value: spans
    });
    return span;
}
/**
 * Ends span
 * @param reply - reply function
 * @param err - error
 */ function endSpan(reply, err) {
    const spans = reply[constants.spanRequestSymbol] || [];
    // there is no active span, or it has already ended
    if (!spans.length) {
        return;
    }
    // biome-ignore lint/complexity/noForEach: <explanation>
    spans.forEach((span)=>{
        if (err) {
            span.setStatus({
                code: api.SpanStatusCode.ERROR,
                message: err.message
            });
            span.recordException(err);
        }
        span.end();
    });
    delete reply[constants.spanRequestSymbol];
}
// @TODO after approve add this to instrumentation package and replace usage
// when it will be released
/**
 * This function handles the missing case from instrumentation package when
 * execute can either return a promise or void. And using async is not an
 * option as it is producing unwanted side effects.
 * @param execute - function to be executed
 * @param onFinish - function called when function executed
 * @param preventThrowingError - prevent to throw error when execute
 * function fails
 */ function safeExecuteInTheMiddleMaybePromise(execute, onFinish, preventThrowingError) {
    let error;
    let result = undefined;
    try {
        result = execute();
        if (isPromise(result)) {
            result.then((res)=>onFinish(undefined, res), (err)=>onFinish(err));
        }
    } catch (e) {
        error = e;
    } finally{
        if (!isPromise(result)) {
            onFinish(error, result);
            if (error && true) {
                // eslint-disable-next-line no-unsafe-finally
                throw error;
            }
        }
        // eslint-disable-next-line no-unsafe-finally
        return result;
    }
}
function isPromise(val) {
    return typeof val === 'object' && val && typeof Object.getOwnPropertyDescriptor(val, 'then')?.value === 'function' || false;
}
exports.endSpan = endSpan;
exports.safeExecuteInTheMiddleMaybePromise = safeExecuteInTheMiddleMaybePromise;
exports.startSpan = startSpan; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/instrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

;
globalThis["_sentryNextJsVersion"] = "15.5.0";
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+core@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/core/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const core$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const AttributeNames = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/enums/AttributeNames.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/utils.js [app-ssr] (ecmascript)");
// Vendored from: https://github.com/open-telemetry/opentelemetry-js-contrib/blob/407f61591ba69a39a6908264379d4d98a48dbec4/plugins/node/opentelemetry-instrumentation-fastify/src/instrumentation.ts
/* eslint-disable @typescript-eslint/no-this-alias */ /* eslint-disable jsdoc/require-jsdoc */ /* eslint-disable @typescript-eslint/explicit-function-return-type */ /* eslint-disable @typescript-eslint/no-unsafe-member-access */ /** @knipignore */ const PACKAGE_VERSION = '0.1.0';
const PACKAGE_NAME = '@sentry/instrumentation-fastify-v3';
const ANONYMOUS_NAME = 'anonymous';
// The instrumentation creates a span for invocations of lifecycle hook handlers
// that take `(request, reply, ...[, done])` arguments. Currently this is all
// lifecycle hooks except `onRequestAbort`.
// https://fastify.dev/docs/latest/Reference/Hooks
const hooksNamesToWrap = new Set([
    'onTimeout',
    'onRequest',
    'preParsing',
    'preValidation',
    'preSerialization',
    'preHandler',
    'onSend',
    'onResponse',
    'onError'
]);
/**
 * Fastify instrumentation for OpenTelemetry
 */ class FastifyInstrumentationV3 extends instrumentation.InstrumentationBase {
    constructor(config = {}){
        super(PACKAGE_NAME, PACKAGE_VERSION, config);
    }
    init() {
        return [
            new instrumentation.InstrumentationNodeModuleDefinition('fastify', [
                '>=3.0.0 <4'
            ], (moduleExports)=>{
                return this._patchConstructor(moduleExports);
            })
        ];
    }
    _hookOnRequest() {
        const instrumentation = this;
        return function onRequest(request, reply, done) {
            if (!instrumentation.isEnabled()) {
                return done();
            }
            instrumentation._wrap(reply, 'send', instrumentation._patchSend());
            const anyRequest = request;
            const rpcMetadata = core.getRPCMetadata(api.context.active());
            const routeName = anyRequest.routeOptions ? anyRequest.routeOptions.url // since fastify@4.10.0
             : request.routerPath;
            if (routeName && rpcMetadata?.type === core.RPCType.HTTP) {
                rpcMetadata.route = routeName;
            }
            const method = request.method || 'GET';
            core$1.getIsolationScope().setTransactionName(`${method} ${routeName}`);
            done();
        };
    }
    _wrapHandler(pluginName, hookName, original, syncFunctionWithDone) {
        const instrumentation = this;
        this._diag.debug('Patching fastify route.handler function');
        return function(...args) {
            if (!instrumentation.isEnabled()) {
                return original.apply(this, args);
            }
            const name = original.name || pluginName || ANONYMOUS_NAME;
            const spanName = `${AttributeNames.FastifyNames.MIDDLEWARE} - ${name}`;
            const reply = args[1];
            const span = utils.startSpan(reply, instrumentation.tracer, spanName, {
                [AttributeNames.AttributeNames.FASTIFY_TYPE]: AttributeNames.FastifyTypes.MIDDLEWARE,
                [AttributeNames.AttributeNames.PLUGIN_NAME]: pluginName,
                [AttributeNames.AttributeNames.HOOK_NAME]: hookName
            });
            const origDone = syncFunctionWithDone && args[args.length - 1];
            if (origDone) {
                args[args.length - 1] = function(...doneArgs) {
                    utils.endSpan(reply);
                    origDone.apply(this, doneArgs);
                };
            }
            return api.context.with(api.trace.setSpan(api.context.active(), span), ()=>{
                return utils.safeExecuteInTheMiddleMaybePromise(()=>{
                    return original.apply(this, args);
                }, (err)=>{
                    if (err instanceof Error) {
                        span.setStatus({
                            code: api.SpanStatusCode.ERROR,
                            message: err.message
                        });
                        span.recordException(err);
                    }
                    // async hooks should end the span as soon as the promise is resolved
                    if (!syncFunctionWithDone) {
                        utils.endSpan(reply);
                    }
                });
            });
        };
    }
    _wrapAddHook() {
        const instrumentation = this;
        this._diag.debug('Patching fastify server.addHook function');
        // biome-ignore lint/complexity/useArrowFunction: <explanation>
        return function(original) {
            return function wrappedAddHook(...args) {
                const name = args[0];
                const handler = args[1];
                const pluginName = this.pluginName;
                if (!hooksNamesToWrap.has(name)) {
                    return original.apply(this, args);
                }
                const syncFunctionWithDone = typeof args[args.length - 1] === 'function' && handler.constructor.name !== 'AsyncFunction';
                return original.apply(this, [
                    name,
                    instrumentation._wrapHandler(pluginName, name, handler, syncFunctionWithDone)
                ]);
            };
        };
    }
    _patchConstructor(moduleExports) {
        const instrumentation = this;
        function fastify(...args) {
            const app = moduleExports.fastify.apply(this, args);
            app.addHook('onRequest', instrumentation._hookOnRequest());
            app.addHook('preHandler', instrumentation._hookPreHandler());
            instrumentClient();
            instrumentation._wrap(app, 'addHook', instrumentation._wrapAddHook());
            return app;
        }
        if (moduleExports.errorCodes !== undefined) {
            fastify.errorCodes = moduleExports.errorCodes;
        }
        fastify.fastify = fastify;
        fastify.default = fastify;
        return fastify;
    }
    _patchSend() {
        const instrumentation$1 = this;
        this._diag.debug('Patching fastify reply.send function');
        return function patchSend(original) {
            return function send(...args) {
                const maybeError = args[0];
                if (!instrumentation$1.isEnabled()) {
                    return original.apply(this, args);
                }
                return instrumentation.safeExecuteInTheMiddle(()=>{
                    return original.apply(this, args);
                }, (err)=>{
                    if (!err && maybeError instanceof Error) {
                        // eslint-disable-next-line no-param-reassign
                        err = maybeError;
                    }
                    utils.endSpan(this, err);
                });
            };
        };
    }
    _hookPreHandler() {
        const instrumentation$1 = this;
        this._diag.debug('Patching fastify preHandler function');
        return function preHandler(request, reply, done) {
            if (!instrumentation$1.isEnabled()) {
                return done();
            }
            const anyRequest = request;
            const handler = anyRequest.routeOptions?.handler || anyRequest.context?.handler;
            const handlerName = handler?.name.startsWith('bound ') ? handler.name.substring(6) : handler?.name;
            const spanName = `${AttributeNames.FastifyNames.REQUEST_HANDLER} - ${handlerName || this.pluginName || ANONYMOUS_NAME}`;
            const spanAttributes = {
                [AttributeNames.AttributeNames.PLUGIN_NAME]: this.pluginName,
                [AttributeNames.AttributeNames.FASTIFY_TYPE]: AttributeNames.FastifyTypes.REQUEST_HANDLER,
                // eslint-disable-next-line deprecation/deprecation
                [semanticConventions.SEMATTRS_HTTP_ROUTE]: anyRequest.routeOptions ? anyRequest.routeOptions.url // since fastify@4.10.0
                 : request.routerPath
            };
            if (handlerName) {
                spanAttributes[AttributeNames.AttributeNames.FASTIFY_NAME] = handlerName;
            }
            const span = utils.startSpan(reply, instrumentation$1.tracer, spanName, spanAttributes);
            addFastifyV3SpanAttributes(span);
            const { requestHook } = instrumentation$1.getConfig();
            if (requestHook) {
                instrumentation.safeExecuteInTheMiddle(()=>requestHook(span, {
                        request
                    }), (e)=>{
                    if (e) {
                        instrumentation$1._diag.error('request hook failed', e);
                    }
                }, true);
            }
            return api.context.with(api.trace.setSpan(api.context.active(), span), ()=>{
                done();
            });
        };
    }
}
function instrumentClient() {
    const client = core$1.getClient();
    if (client) {
        client.on('spanStart', (span)=>{
            addFastifyV3SpanAttributes(span);
        });
    }
}
function addFastifyV3SpanAttributes(span) {
    const attributes = core$1.spanToJSON(span).data;
    // this is one of: middleware, request_handler
    const type = attributes['fastify.type'];
    // If this is already set, or we have no fastify span, no need to process again...
    if (attributes[core$1.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
        return;
    }
    span.setAttributes({
        [core$1.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.fastify',
        [core$1.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.fastify`
    });
    // Also update the name, we don't need to "middleware - " prefix
    const name = attributes['fastify.name'] || attributes['plugin.name'] || attributes['hook.name'];
    if (typeof name === 'string') {
        // Try removing `fastify -> ` and `@fastify/otel -> ` prefixes
        // This is a bit of a hack, and not always working for all spans
        // But it's the best we can do without a proper API
        const updatedName = name.replace(/^fastify -> /, '').replace(/^@fastify\/otel -> /, '');
        span.updateName(updatedName);
    }
}
exports.FastifyInstrumentationV3 = FastifyInstrumentationV3; //# sourceMappingURL=instrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dc = __turbopack_context__.r("[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/fastify-otel/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/v3/instrumentation.js [app-ssr] (ecmascript)");
/**
 * Options for the Fastify integration.
 *
 * `shouldHandleError` - Callback method deciding whether error should be captured and sent to Sentry
 * This is used on Fastify v5 where Sentry handles errors in the diagnostics channel.
 * Fastify v3 and v4 use `setupFastifyErrorHandler` instead.
 *
 * @example
 *
 * ```javascript
 * Sentry.init({
 *   integrations: [
 *     Sentry.fastifyIntegration({
 *       shouldHandleError(_error, _request, reply) {
 *         return reply.statusCode >= 500;
 *       },
 *     });
 *   },
 * });
 * ```
 *
 */ const INTEGRATION_NAME = 'Fastify';
const INTEGRATION_NAME_V5 = 'Fastify-V5';
const INTEGRATION_NAME_V3 = 'Fastify-V3';
const instrumentFastifyV3 = nodeCore.generateInstrumentOnce(INTEGRATION_NAME_V3, ()=>new instrumentation.FastifyInstrumentationV3());
function getFastifyIntegration() {
    const client = core.getClient();
    if (!client) {
        return undefined;
    } else {
        return client.getIntegrationByName(INTEGRATION_NAME);
    }
}
function handleFastifyError(error, request, reply, handlerOrigin) {
    const shouldHandleError = getFastifyIntegration()?.getShouldHandleError() || defaultShouldHandleError;
    // Diagnostics channel runs before the onError hook, so we can use it to check if the handler was already registered
    if (handlerOrigin === 'diagnostics-channel') {
        this.diagnosticsChannelExists = true;
    }
    if (this.diagnosticsChannelExists && handlerOrigin === 'onError-hook') {
        debugBuild.DEBUG_BUILD && core.debug.warn('Fastify error handler was already registered via diagnostics channel.', 'You can safely remove `setupFastifyErrorHandler` call and set `shouldHandleError` on the integration options.');
        // If the diagnostics channel already exists, we don't need to handle the error again
        return;
    }
    if (shouldHandleError(error, request, reply)) {
        core.captureException(error, {
            mechanism: {
                handled: false,
                type: 'fastify'
            }
        });
    }
}
const instrumentFastify = nodeCore.generateInstrumentOnce(INTEGRATION_NAME_V5, ()=>{
    const fastifyOtelInstrumentationInstance = new index.FastifyOtelInstrumentation();
    const plugin = fastifyOtelInstrumentationInstance.plugin();
    // This message handler works for Fastify versions 3, 4 and 5
    dc.subscribe('fastify.initialization', (message)=>{
        const fastifyInstance = message.fastify;
        fastifyInstance?.register(plugin).after((err)=>{
            if (err) {
                debugBuild.DEBUG_BUILD && core.debug.error('Failed to setup Fastify instrumentation', err);
            } else {
                instrumentClient();
                if (fastifyInstance) {
                    instrumentOnRequest(fastifyInstance);
                }
            }
        });
    });
    // This diagnostics channel only works on Fastify version 5
    // For versions 3 and 4, we use `setupFastifyErrorHandler` instead
    dc.subscribe('tracing:fastify.request.handler:error', (message)=>{
        const { error, request, reply } = message;
        handleFastifyError.call(handleFastifyError, error, request, reply, 'diagnostics-channel');
    });
    // Returning this as unknown not to deal with the internal types of the FastifyOtelInstrumentation
    return fastifyOtelInstrumentationInstance;
});
const _fastifyIntegration = ({ shouldHandleError })=>{
    let _shouldHandleError;
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            _shouldHandleError = shouldHandleError || defaultShouldHandleError;
            instrumentFastifyV3();
            instrumentFastify();
        },
        getShouldHandleError () {
            return _shouldHandleError;
        },
        setShouldHandleError (fn) {
            _shouldHandleError = fn;
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for [Fastify](https://fastify.dev/).
 *
 * If you also want to capture errors, you need to call `setupFastifyErrorHandler(app)` after you set up your Fastify server.
 *
 * For more information, see the [fastify documentation](https://docs.sentry.io/platforms/javascript/guides/fastify/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.fastifyIntegration()],
 * })
 * ```
 */ const fastifyIntegration = core.defineIntegration((options = {})=>_fastifyIntegration(options));
/**
 * Default function to determine if an error should be sent to Sentry
 *
 * 3xx and 4xx errors are not sent by default.
 */ function defaultShouldHandleError(_error, _request, reply) {
    const statusCode = reply.statusCode;
    // 3xx and 4xx errors are not sent by default.
    return statusCode >= 500 || statusCode <= 299;
}
/**
 * Add an Fastify error handler to capture errors to Sentry.
 *
 * @param fastify The Fastify instance to which to add the error handler
 * @param options Configuration options for the handler
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const Fastify = require("fastify");
 *
 * const app = Fastify();
 *
 * Sentry.setupFastifyErrorHandler(app);
 *
 * // Add your routes, etc.
 *
 * app.listen({ port: 3000 });
 * ```
 */ function setupFastifyErrorHandler(fastify, options) {
    if (options?.shouldHandleError) {
        getFastifyIntegration()?.setShouldHandleError(options.shouldHandleError);
    }
    const plugin = Object.assign(function(fastify, _options, done) {
        fastify.addHook('onError', async (request, reply, error)=>{
            handleFastifyError.call(handleFastifyError, error, request, reply, 'onError-hook');
        });
        done();
    }, {
        [Symbol.for('skip-override')]: true,
        [Symbol.for('fastify.display-name')]: 'sentry-fastify-error-handler'
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fastify.register(plugin);
}
function addFastifySpanAttributes(span) {
    const spanJSON = core.spanToJSON(span);
    const spanName = spanJSON.description;
    const attributes = spanJSON.data;
    const type = attributes['fastify.type'];
    const isHook = type === 'hook';
    const isHandler = type === spanName?.startsWith('handler -');
    // In @fastify/otel `request-handler` is separated by dash, not underscore
    const isRequestHandler = spanName === 'request' || type === 'request-handler';
    // If this is already set, or we have no fastify span, no need to process again...
    if (attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !isHandler && !isRequestHandler && !isHook) {
        return;
    }
    const opPrefix = isHook ? 'hook' : isHandler ? 'middleware' : isRequestHandler ? 'request-handler' : '<unknown>';
    span.setAttributes({
        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.fastify',
        [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${opPrefix}.fastify`
    });
    const attrName = attributes['fastify.name'] || attributes['plugin.name'] || attributes['hook.name'];
    if (typeof attrName === 'string') {
        // Try removing `fastify -> ` and `@fastify/otel -> ` prefixes
        // This is a bit of a hack, and not always working for all spans
        // But it's the best we can do without a proper API
        const updatedName = attrName.replace(/^fastify -> /, '').replace(/^@fastify\/otel -> /, '');
        span.updateName(updatedName);
    }
}
function instrumentClient() {
    const client = core.getClient();
    if (client) {
        client.on('spanStart', (span)=>{
            addFastifySpanAttributes(span);
        });
    }
}
function instrumentOnRequest(fastify) {
    fastify.addHook('onRequest', async (request, _reply)=>{
        if (request.opentelemetry) {
            const { span } = request.opentelemetry();
            if (span) {
                addFastifySpanAttributes(span);
            }
        }
        const routeName = request.routeOptions?.url;
        const method = request.method || 'GET';
        core.getIsolationScope().setTransactionName(`${method} ${routeName}`);
    });
}
exports.fastifyIntegration = fastifyIntegration;
exports.instrumentFastify = instrumentFastify;
exports.instrumentFastifyV3 = instrumentFastifyV3;
exports.setupFastifyErrorHandler = setupFastifyErrorHandler; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/graphql.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentationGraphql = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-graphql@0.51.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-graphql/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Graphql';
const instrumentGraphql = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, instrumentationGraphql.GraphQLInstrumentation, (_options)=>{
    const options = getOptionsWithDefaults(_options);
    return {
        ...options,
        responseHook (span, result) {
            nodeCore.addOriginToSpan(span, 'auto.graphql.otel.graphql');
            // We want to ensure spans are marked as errored if there are errors in the result
            // We only do that if the span is not already marked with a status
            const resultWithMaybeError = result;
            if (resultWithMaybeError.errors?.length && !core.spanToJSON(span).status) {
                span.setStatus({
                    code: api.SpanStatusCode.ERROR
                });
            }
            const attributes = core.spanToJSON(span).data;
            // If operation.name is not set, we fall back to use operation.type only
            const operationType = attributes['graphql.operation.type'];
            const operationName = attributes['graphql.operation.name'];
            if (options.useOperationNameForRootSpan && operationType) {
                const rootSpan = core.getRootSpan(span);
                const rootSpanAttributes = core.spanToJSON(rootSpan).data;
                const existingOperations = rootSpanAttributes[opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION] || [];
                const newOperation = operationName ? `${operationType} ${operationName}` : `${operationType}`;
                // We keep track of each operation on the root span
                // This can either be a string, or an array of strings (if there are multiple operations)
                if (Array.isArray(existingOperations)) {
                    existingOperations.push(newOperation);
                    rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, existingOperations);
                } else if (typeof existingOperations === 'string') {
                    rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, [
                        existingOperations,
                        newOperation
                    ]);
                } else {
                    rootSpan.setAttribute(opentelemetry.SEMANTIC_ATTRIBUTE_SENTRY_GRAPHQL_OPERATION, newOperation);
                }
                if (!core.spanToJSON(rootSpan).data['original-description']) {
                    rootSpan.setAttribute('original-description', core.spanToJSON(rootSpan).description);
                }
                // Important for e.g. @sentry/aws-serverless because this would otherwise overwrite the name again
                rootSpan.updateName(`${core.spanToJSON(rootSpan).data['original-description']} (${getGraphqlOperationNamesFromAttribute(existingOperations)})`);
            }
        }
    };
});
const _graphqlIntegration = (options = {})=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            // We set defaults here, too, because otherwise we'd update the instrumentation config
            // to the config without defaults, as `generateInstrumentOnce` automatically calls `setConfig(options)`
            // when being called the second time
            instrumentGraphql(getOptionsWithDefaults(options));
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [graphql](https://www.npmjs.com/package/graphql) library.
 *
 * For more information, see the [`graphqlIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/graphql/).
 *
 * @param {GraphqlOptions} options Configuration options for the GraphQL integration.
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.graphqlIntegration()],
 * });
 */ const graphqlIntegration = core.defineIntegration(_graphqlIntegration);
function getOptionsWithDefaults(options) {
    return {
        ignoreResolveSpans: true,
        ignoreTrivialResolveSpans: true,
        useOperationNameForRootSpan: true,
        ...options
    };
}
// copy from packages/opentelemetry/utils
function getGraphqlOperationNamesFromAttribute(attr) {
    if (Array.isArray(attr)) {
        const sorted = attr.slice().sort();
        // Up to 5 items, we just add all of them
        if (sorted.length <= 5) {
            return sorted.join(', ');
        } else {
            // Else, we add the first 5 and the diff of other operations
            return `${sorted.slice(0, 5).join(', ')}, +${sorted.length - 5}`;
        }
    }
    return `${attr}`;
}
exports.graphqlIntegration = graphqlIntegration;
exports.instrumentGraphql = instrumentGraphql; //# sourceMappingURL=graphql.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/kafka.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationKafkajs = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-kafkajs@0.12.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-kafkajs/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Kafka';
const instrumentKafka = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationKafkajs.KafkaJsInstrumentation({
        consumerHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.kafkajs.otel.consumer');
        },
        producerHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.kafkajs.otel.producer');
        }
    }));
const _kafkaIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentKafka();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [kafkajs](https://www.npmjs.com/package/kafkajs) library.
 *
 * For more information, see the [`kafkaIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/kafka/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.kafkaIntegration()],
 * });
 */ const kafkaIntegration = core.defineIntegration(_kafkaIntegration);
exports.instrumentKafka = instrumentKafka;
exports.kafkaIntegration = kafkaIntegration; //# sourceMappingURL=kafka.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/lrumemoizer.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationLruMemoizer = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-lru-memoizer@0.48.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-lru-memoizer/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'LruMemoizer';
const instrumentLruMemoizer = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationLruMemoizer.LruMemoizerInstrumentation());
const _lruMemoizerIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentLruMemoizer();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [lru-memoizer](https://www.npmjs.com/package/lru-memoizer) library.
 *
 * For more information, see the [`lruMemoizerIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/lrumemoizer/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.lruMemoizerIntegration()],
 * });
 */ const lruMemoizerIntegration = core.defineIntegration(_lruMemoizerIntegration);
exports.instrumentLruMemoizer = instrumentLruMemoizer;
exports.lruMemoizerIntegration = lruMemoizerIntegration; //# sourceMappingURL=lrumemoizer.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongo.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationMongodb = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-mongodb@0.56.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-mongodb/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Mongo';
const instrumentMongo = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationMongodb.MongoDBInstrumentation({
        dbStatementSerializer: _defaultDbStatementSerializer,
        responseHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.db.otel.mongo');
        }
    }));
/**
 * Replaces values in document with '?', hiding PII and helping grouping.
 */ function _defaultDbStatementSerializer(commandObj) {
    const resultObj = _scrubStatement(commandObj);
    return JSON.stringify(resultObj);
}
function _scrubStatement(value) {
    if (Array.isArray(value)) {
        return value.map((element)=>_scrubStatement(element));
    }
    if (isCommandObj(value)) {
        const initial = {};
        return Object.entries(value).map(([key, element])=>[
                key,
                _scrubStatement(element)
            ]).reduce((prev, current)=>{
            if (isCommandEntry(current)) {
                prev[current[0]] = current[1];
            }
            return prev;
        }, initial);
    }
    // A value like string or number, possible contains PII, scrub it
    return '?';
}
function isCommandObj(value) {
    return typeof value === 'object' && value !== null && !isBuffer(value);
}
function isBuffer(value) {
    let isBuffer = false;
    if (typeof Buffer !== 'undefined') {
        isBuffer = Buffer.isBuffer(value);
    }
    return isBuffer;
}
function isCommandEntry(value) {
    return Array.isArray(value);
}
const _mongoIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentMongo();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [mongodb](https://www.npmjs.com/package/mongodb) library.
 *
 * For more information, see the [`mongoIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/mongo/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.mongoIntegration()],
 * });
 * ```
 */ const mongoIntegration = core.defineIntegration(_mongoIntegration);
exports._defaultDbStatementSerializer = _defaultDbStatementSerializer;
exports.instrumentMongo = instrumentMongo;
exports.mongoIntegration = mongoIntegration; //# sourceMappingURL=mongo.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongoose.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationMongoose = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-mongoose@0.50.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-mongoose/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Mongoose';
const instrumentMongoose = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationMongoose.MongooseInstrumentation({
        responseHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.db.otel.mongoose');
        }
    }));
const _mongooseIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentMongoose();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [mongoose](https://www.npmjs.com/package/mongoose) library.
 *
 * For more information, see the [`mongooseIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/mongoose/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.mongooseIntegration()],
 * });
 * ```
 */ const mongooseIntegration = core.defineIntegration(_mongooseIntegration);
exports.instrumentMongoose = instrumentMongoose;
exports.mongooseIntegration = mongooseIntegration; //# sourceMappingURL=mongoose.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationMysql = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-mysql@0.49.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-mysql/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Mysql';
const instrumentMysql = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationMysql.MySQLInstrumentation({}));
const _mysqlIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentMysql();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [mysql](https://www.npmjs.com/package/mysql) library.
 *
 * For more information, see the [`mysqlIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/mysql/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.mysqlIntegration()],
 * });
 * ```
 */ const mysqlIntegration = core.defineIntegration(_mysqlIntegration);
exports.instrumentMysql = instrumentMysql;
exports.mysqlIntegration = mysqlIntegration; //# sourceMappingURL=mysql.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql2.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationMysql2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-mysql2@0.49.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-mysql2/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Mysql2';
const instrumentMysql2 = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationMysql2.MySQL2Instrumentation({
        responseHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.db.otel.mysql2');
        }
    }));
const _mysql2Integration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentMysql2();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [mysql2](https://www.npmjs.com/package/mysql2) library.
 *
 * For more information, see the [`mysql2Integration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/mysql2/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.mysqlIntegration()],
 * });
 * ```
 */ const mysql2Integration = core.defineIntegration(_mysql2Integration);
exports.instrumentMysql2 = instrumentMysql2;
exports.mysql2Integration = mysql2Integration; //# sourceMappingURL=mysql2.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/utils/redisCache.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const SINGLE_ARG_COMMANDS = [
    'get',
    'set',
    'setex'
];
const GET_COMMANDS = [
    'get',
    'mget'
];
const SET_COMMANDS = [
    'set',
    'setex'
];
// todo: del, expire
/** Checks if a given command is in the list of redis commands.
 *  Useful because commands can come in lowercase or uppercase (depending on the library). */ function isInCommands(redisCommands, command) {
    return redisCommands.includes(command.toLowerCase());
}
/** Determine cache operation based on redis statement */ function getCacheOperation(command) {
    if (isInCommands(GET_COMMANDS, command)) {
        return 'cache.get';
    } else if (isInCommands(SET_COMMANDS, command)) {
        return 'cache.put';
    } else {
        return undefined;
    }
}
function keyHasPrefix(key, prefixes) {
    return prefixes.some((prefix)=>key.startsWith(prefix));
}
/** Safely converts a redis key to a string (comma-separated if there are multiple keys) */ function getCacheKeySafely(redisCommand, cmdArgs) {
    try {
        if (cmdArgs.length === 0) {
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processArg = (arg)=>{
            if (typeof arg === 'string' || typeof arg === 'number' || Buffer.isBuffer(arg)) {
                return [
                    arg.toString()
                ];
            } else if (Array.isArray(arg)) {
                return flatten(arg.map((arg)=>processArg(arg)));
            } else {
                return [
                    '<unknown>'
                ];
            }
        };
        const firstArg = cmdArgs[0];
        if (isInCommands(SINGLE_ARG_COMMANDS, redisCommand) && firstArg != null) {
            return processArg(firstArg);
        }
        return flatten(cmdArgs.map((arg)=>processArg(arg)));
    } catch  {
        return undefined;
    }
}
/** Determines whether a redis operation should be considered as "cache operation" by checking if a key is prefixed.
 *  We only support certain commands (such as 'set', 'get', 'mget'). */ function shouldConsiderForCache(redisCommand, keys, prefixes) {
    if (!getCacheOperation(redisCommand)) {
        return false;
    }
    for (const key of keys){
        if (keyHasPrefix(key, prefixes)) {
            return true;
        }
    }
    return false;
}
/** Calculates size based on the cache response value */ function calculateCacheItemSize(response) {
    const getSize = (value)=>{
        try {
            if (Buffer.isBuffer(value)) return value.byteLength;
            else if (typeof value === 'string') return value.length;
            else if (typeof value === 'number') return value.toString().length;
            else if (value === null || value === undefined) return 0;
            return JSON.stringify(value).length;
        } catch  {
            return undefined;
        }
    };
    return Array.isArray(response) ? response.reduce((acc, curr)=>{
        const size = getSize(curr);
        return typeof size === 'number' ? acc !== undefined ? acc + size : size : acc;
    }, 0) : getSize(response);
}
function flatten(input) {
    const result = [];
    const flattenHelper = (input)=>{
        input.forEach((el)=>{
            if (Array.isArray(el)) {
                flattenHelper(el);
            } else {
                result.push(el);
            }
        });
    };
    flattenHelper(input);
    return result;
}
exports.GET_COMMANDS = GET_COMMANDS;
exports.SET_COMMANDS = SET_COMMANDS;
exports.calculateCacheItemSize = calculateCacheItemSize;
exports.getCacheKeySafely = getCacheKeySafely;
exports.getCacheOperation = getCacheOperation;
exports.isInCommands = isInCommands;
exports.shouldConsiderForCache = shouldConsiderForCache; //# sourceMappingURL=redisCache.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/redis.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationIoredis = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-ioredis@0.51.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-ioredis/build/src/index.js [app-ssr] (ecmascript)");
const instrumentationRedis = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-redis@0.51.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-redis/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const redisCache = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/utils/redisCache.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Redis';
let _redisOptions = {};
const cacheResponseHook = (span, redisCommand, cmdArgs, response)=>{
    span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.redis');
    const safeKey = redisCache.getCacheKeySafely(redisCommand, cmdArgs);
    const cacheOperation = redisCache.getCacheOperation(redisCommand);
    if (!safeKey || !cacheOperation || !_redisOptions.cachePrefixes || !redisCache.shouldConsiderForCache(redisCommand, safeKey, _redisOptions.cachePrefixes)) {
        // not relevant for cache
        return;
    }
    // otel/ioredis seems to be using the old standard, as there was a change to those params: https://github.com/open-telemetry/opentelemetry-specification/issues/3199
    // We are using params based on the docs: https://opentelemetry.io/docs/specs/semconv/attributes-registry/network/
    const networkPeerAddress = core.spanToJSON(span).data['net.peer.name'];
    const networkPeerPort = core.spanToJSON(span).data['net.peer.port'];
    if (networkPeerPort && networkPeerAddress) {
        span.setAttributes({
            'network.peer.address': networkPeerAddress,
            'network.peer.port': networkPeerPort
        });
    }
    const cacheItemSize = redisCache.calculateCacheItemSize(response);
    if (cacheItemSize) {
        span.setAttribute(core.SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE, cacheItemSize);
    }
    if (redisCache.isInCommands(redisCache.GET_COMMANDS, redisCommand) && cacheItemSize !== undefined) {
        span.setAttribute(core.SEMANTIC_ATTRIBUTE_CACHE_HIT, cacheItemSize > 0);
    }
    span.setAttributes({
        [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: cacheOperation,
        [core.SEMANTIC_ATTRIBUTE_CACHE_KEY]: safeKey
    });
    const spanDescription = safeKey.join(', ');
    span.updateName(core.truncate(spanDescription, 1024));
};
const instrumentIORedis = nodeCore.generateInstrumentOnce('IORedis', ()=>{
    return new instrumentationIoredis.IORedisInstrumentation({
        responseHook: cacheResponseHook
    });
});
const instrumentRedisModule = nodeCore.generateInstrumentOnce('Redis', ()=>{
    return new instrumentationRedis.RedisInstrumentation({
        responseHook: cacheResponseHook
    });
});
/** To be able to preload all Redis OTel instrumentations with just one ID ("Redis"), all the instrumentations are generated in this one function  */ const instrumentRedis = Object.assign(()=>{
    instrumentIORedis();
    instrumentRedisModule();
// todo: implement them gradually
// new LegacyRedisInstrumentation({}),
}, {
    id: INTEGRATION_NAME
});
const _redisIntegration = (options = {})=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            _redisOptions = options;
            instrumentRedis();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [redis](https://www.npmjs.com/package/redis) and
 * [ioredis](https://www.npmjs.com/package/ioredis) libraries.
 *
 * For more information, see the [`redisIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/redis/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.redisIntegration()],
 * });
 * ```
 */ const redisIntegration = core.defineIntegration(_redisIntegration);
exports.instrumentRedis = instrumentRedis;
exports.redisIntegration = redisIntegration; //# sourceMappingURL=redis.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgres.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationPg = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-pg@0.55.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-pg/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Postgres';
const instrumentPostgres = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationPg.PgInstrumentation({
        requireParentSpan: true,
        requestHook (span) {
            nodeCore.addOriginToSpan(span, 'auto.db.otel.postgres');
        }
    }));
const _postgresIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentPostgres();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [pg](https://www.npmjs.com/package/pg) library.
 *
 * For more information, see the [`postgresIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/postgres/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.postgresIntegration()],
 * });
 * ```
 */ const postgresIntegration = core.defineIntegration(_postgresIntegration);
exports.instrumentPostgres = instrumentPostgres;
exports.postgresIntegration = postgresIntegration; //# sourceMappingURL=postgres.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
// Instrumentation for https://github.com/porsager/postgres
const INTEGRATION_NAME = 'PostgresJs';
const SUPPORTED_VERSIONS = [
    '>=3.0.0 <4'
];
const instrumentPostgresJs = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, (options)=>new PostgresJsInstrumentation({
        requireParentSpan: options?.requireParentSpan ?? true,
        requestHook: options?.requestHook
    }));
/**
 * Instrumentation for the [postgres](https://www.npmjs.com/package/postgres) library.
 * This instrumentation captures postgresjs queries and their attributes,
 */ class PostgresJsInstrumentation extends instrumentation.InstrumentationBase {
    constructor(config){
        super('sentry-postgres-js', core.SDK_VERSION, config);
    }
    /**
   * Initializes the instrumentation.
   */ init() {
        const instrumentationModule = new instrumentation.InstrumentationNodeModuleDefinition('postgres', SUPPORTED_VERSIONS);
        [
            'src',
            'cf/src',
            'cjs/src'
        ].forEach((path)=>{
            instrumentationModule.files.push(new instrumentation.InstrumentationNodeModuleFile(`postgres/${path}/connection.js`, [
                '*'
            ], this._patchConnection.bind(this), this._unwrap.bind(this)));
            instrumentationModule.files.push(new instrumentation.InstrumentationNodeModuleFile(`postgres/${path}/query.js`, SUPPORTED_VERSIONS, this._patchQuery.bind(this), this._unwrap.bind(this)));
        });
        return [
            instrumentationModule
        ];
    }
    /**
   * Determines whether a span should be created based on the current context.
   * If `requireParentSpan` is set to true in the configuration, a span will
   * only be created if there is a parent span available.
   */ _shouldCreateSpans() {
        const config = this.getConfig();
        const hasParentSpan = api.trace.getSpan(api.context.active()) !== undefined;
        return hasParentSpan || !config.requireParentSpan;
    }
    /**
   * Patches the reject method of the Query class to set the span status and end it
   */ _patchReject(rejectTarget, span) {
        return new Proxy(rejectTarget, {
            apply: (rejectTarget, rejectThisArg, rejectArgs)=>{
                span.setStatus({
                    code: core.SPAN_STATUS_ERROR,
                    // This message is the error message from the rejectArgs, when available
                    // e.g "relation 'User' does not exist"
                    message: rejectArgs?.[0]?.message || 'unknown_error'
                });
                const result = Reflect.apply(rejectTarget, rejectThisArg, rejectArgs);
                // This status code is PG error code, e.g. '42P01' for "relation does not exist"
                // https://www.postgresql.org/docs/current/errcodes-appendix.html
                span.setAttribute(semanticConventions.ATTR_DB_RESPONSE_STATUS_CODE, rejectArgs?.[0]?.code || 'Unknown error');
                // This is the error type, e.g. 'PostgresError' for a Postgres error
                span.setAttribute(semanticConventions.ATTR_ERROR_TYPE, rejectArgs?.[0]?.name || 'Unknown error');
                span.end();
                return result;
            }
        });
    }
    /**
   * Patches the resolve method of the Query class to end the span when the query is resolved.
   */ _patchResolve(resolveTarget, span) {
        return new Proxy(resolveTarget, {
            apply: (resolveTarget, resolveThisArg, resolveArgs)=>{
                const result = Reflect.apply(resolveTarget, resolveThisArg, resolveArgs);
                const sqlCommand = resolveArgs?.[0]?.command;
                if (sqlCommand) {
                    // SQL command is only available when the query is resolved successfully
                    span.setAttribute(semanticConventions.ATTR_DB_OPERATION_NAME, sqlCommand);
                }
                span.end();
                return result;
            }
        });
    }
    /**
   * Patches the Query class to instrument the handle method.
   */ _patchQuery(moduleExports) {
        moduleExports.Query.prototype.handle = new Proxy(moduleExports.Query.prototype.handle, {
            apply: async (handleTarget, handleThisArg, handleArgs)=>{
                if (!this._shouldCreateSpans()) {
                    // If we don't need to create spans, just call the original method
                    return Reflect.apply(handleTarget, handleThisArg, handleArgs);
                }
                const sanitizedSqlQuery = this._sanitizeSqlQuery(handleThisArg.strings?.[0]);
                return core.startSpanManual({
                    name: sanitizedSqlQuery || 'postgresjs.query',
                    op: 'db'
                }, (span)=>{
                    const scope = core.getCurrentScope();
                    const postgresConnectionContext = scope.getScopeData().contexts['postgresjsConnection'];
                    nodeCore.addOriginToSpan(span, 'auto.db.otel.postgres');
                    const { requestHook } = this.getConfig();
                    if (requestHook) {
                        instrumentation.safeExecuteInTheMiddle(()=>requestHook(span, sanitizedSqlQuery, postgresConnectionContext), (error)=>{
                            if (error) {
                                core.debug.error(`Error in requestHook for ${INTEGRATION_NAME} integration:`, error);
                            }
                        });
                    }
                    // ATTR_DB_NAMESPACE is used to indicate the database name and the schema name
                    // It's only the database name as we don't have the schema information
                    const databaseName = postgresConnectionContext?.ATTR_DB_NAMESPACE || '<unknown database>';
                    const databaseHost = postgresConnectionContext?.ATTR_SERVER_ADDRESS || '<unknown host>';
                    const databasePort = postgresConnectionContext?.ATTR_SERVER_PORT || '<unknown port>';
                    span.setAttribute(semanticConventions.ATTR_DB_SYSTEM_NAME, 'postgres');
                    span.setAttribute(semanticConventions.ATTR_DB_NAMESPACE, databaseName);
                    span.setAttribute(semanticConventions.ATTR_SERVER_ADDRESS, databaseHost);
                    span.setAttribute(semanticConventions.ATTR_SERVER_PORT, databasePort);
                    span.setAttribute(semanticConventions.ATTR_DB_QUERY_TEXT, sanitizedSqlQuery);
                    handleThisArg.resolve = this._patchResolve(handleThisArg.resolve, span);
                    handleThisArg.reject = this._patchReject(handleThisArg.reject, span);
                    try {
                        return Reflect.apply(handleTarget, handleThisArg, handleArgs);
                    } catch (error) {
                        span.setStatus({
                            code: core.SPAN_STATUS_ERROR
                        });
                        span.end();
                        throw error; // Re-throw the error to propagate it
                    }
                });
            }
        });
        return moduleExports;
    }
    /**
   * Patches the Connection class to set the database, host, and port attributes
   * when a new connection is created.
   */ _patchConnection(Connection) {
        return new Proxy(Connection, {
            apply: (connectionTarget, thisArg, connectionArgs)=>{
                const databaseName = connectionArgs[0]?.database || '<unknown database>';
                const databaseHost = connectionArgs[0]?.host?.[0] || '<unknown host>';
                const databasePort = connectionArgs[0]?.port?.[0] || '<unknown port>';
                const scope = core.getCurrentScope();
                scope.setContext('postgresjsConnection', {
                    ATTR_DB_NAMESPACE: databaseName,
                    ATTR_SERVER_ADDRESS: databaseHost,
                    ATTR_SERVER_PORT: databasePort
                });
                return Reflect.apply(connectionTarget, thisArg, connectionArgs);
            }
        });
    }
    /**
   * Sanitize SQL query as per the OTEL semantic conventions
   * https://opentelemetry.io/docs/specs/semconv/database/database-spans/#sanitization-of-dbquerytext
   */ _sanitizeSqlQuery(sqlQuery) {
        if (!sqlQuery) {
            return 'Unknown SQL Query';
        }
        return sqlQuery.replace(/\s+/g, ' ').trim() // Remove extra spaces including newlines and trim
        .substring(0, 1024) // Truncate to 1024 characters
        .replace(/--.*?(\r?\n|$)/g, '') // Single line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Multi-line comments
        .replace(/;\s*$/, '') // Remove trailing semicolons
        .replace(/\b\d+\b/g, '?') // Replace standalone numbers
        // Collapse whitespace to a single space
        .replace(/\s+/g, ' ')// Collapse IN and in clauses
        // eg. IN (?, ?, ?, ?) to IN (?)
        .replace(/\bIN\b\s*\(\s*\?(?:\s*,\s*\?)*\s*\)/g, 'IN (?)');
    }
}
const _postgresJsIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentPostgresJs();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [postgres](https://www.npmjs.com/package/postgres) library.
 *
 * For more information, see the [`postgresIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/postgres/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.postgresJsIntegration()],
 * });
 * ```
 */ const postgresJsIntegration = core.defineIntegration(_postgresJsIntegration);
exports.PostgresJsInstrumentation = PostgresJsInstrumentation;
exports.instrumentPostgresJs = instrumentPostgresJs;
exports.postgresJsIntegration = postgresJsIntegration; //# sourceMappingURL=postgresjs.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@prisma+instrumentation@6.13.0_@opentelemetry+api@1.9.0/node_modules/@prisma/instrumentation/dist/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Prisma';
function isPrismaV6TracingHelper(helper) {
    return !!helper && typeof helper === 'object' && 'dispatchEngineSpans' in helper;
}
function getPrismaTracingHelper() {
    const prismaInstrumentationObject = globalThis.PRISMA_INSTRUMENTATION;
    const prismaTracingHelper = prismaInstrumentationObject && typeof prismaInstrumentationObject === 'object' && 'helper' in prismaInstrumentationObject ? prismaInstrumentationObject.helper : undefined;
    return prismaTracingHelper;
}
class SentryPrismaInteropInstrumentation extends instrumentation.PrismaInstrumentation {
    constructor(){
        super();
    }
    enable() {
        super.enable();
        // The PrismaIntegration (super class) defines a global variable `global["PRISMA_INSTRUMENTATION"]` when `enable()` is called. This global variable holds a "TracingHelper" which Prisma uses internally to create tracing data. It's their way of not depending on OTEL with their main package. The sucky thing is, prisma broke the interface of the tracing helper with the v6 major update. This means that if you use Prisma 5 with the v6 instrumentation (or vice versa) Prisma just blows up, because tries to call methods on the helper that no longer exist.
        // Because we actually want to use the v6 instrumentation and not blow up in Prisma 5 user's faces, what we're doing here is backfilling the v5 method (`createEngineSpan`) with a noop so that no longer crashes when it attempts to call that function.
        // We still won't fully emit all the spans, but this could potentially be implemented in the future.
        const prismaTracingHelper = getPrismaTracingHelper();
        let emittedWarning = false;
        if (isPrismaV6TracingHelper(prismaTracingHelper)) {
            prismaTracingHelper.createEngineSpan = ()=>{
                core.consoleSandbox(()=>{
                    if (!emittedWarning) {
                        emittedWarning = true;
                        // eslint-disable-next-line no-console
                        console.warn('[Sentry] The Sentry SDK supports tracing with Prisma version 5 only with limited capabilities. For full tracing capabilities pass `prismaInstrumentation` for version 5 to the Sentry `prismaIntegration`. Read more: https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/prisma/');
                    }
                });
            };
        }
    }
}
const instrumentPrisma = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, (options)=>{
    // Use a passed instrumentation instance to support older Prisma versions
    if (options?.prismaInstrumentation) {
        return options.prismaInstrumentation;
    }
    return new SentryPrismaInteropInstrumentation();
});
/**
 * Adds Sentry tracing instrumentation for the [prisma](https://www.npmjs.com/package/prisma) library.
 * For more information, see the [`prismaIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/prisma/).
 *
 * NOTE: By default, this integration works with Prisma version 6.
 * To get performance instrumentation for other Prisma versions,
 * 1. Install the `@prisma/instrumentation` package with the desired version.
 * 1. Pass a `new PrismaInstrumentation()` instance as exported from `@prisma/instrumentation` to the `prismaInstrumentation` option of this integration:
 *
 *    ```js
 *    import { PrismaInstrumentation } from '@prisma/instrumentation'
 *
 *    Sentry.init({
 *      integrations: [
 *        prismaIntegration({
 *          // Override the default instrumentation that Sentry uses
 *          prismaInstrumentation: new PrismaInstrumentation()
 *        })
 *      ]
 *    })
 *    ```
 *
 *    The passed instrumentation instance will override the default instrumentation instance the integration would use, while the `prismaIntegration` will still ensure data compatibility for the various Prisma versions.
 * 1. Depending on your Prisma version (prior to version 6), add `previewFeatures = ["tracing"]` to the client generator block of your Prisma schema:
 *
 *    ```
 *    generator client {
 *      provider = "prisma-client-js"
 *      previewFeatures = ["tracing"]
 *    }
 *    ```
 */ const prismaIntegration = core.defineIntegration(({ prismaInstrumentation } = {})=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentPrisma({
                prismaInstrumentation
            });
        },
        setup (client) {
            // If no tracing helper exists, we skip any work here
            // this means that prisma is not being used
            if (!getPrismaTracingHelper()) {
                return;
            }
            client.on('spanStart', (span)=>{
                const spanJSON = core.spanToJSON(span);
                if (spanJSON.description?.startsWith('prisma:')) {
                    span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.prisma');
                }
                // Make sure we use the query text as the span name, for ex. SELECT * FROM "User" WHERE "id" = $1
                if (spanJSON.description === 'prisma:engine:db_query' && spanJSON.data['db.query.text']) {
                    span.updateName(spanJSON.data['db.query.text']);
                }
                // In Prisma v5.22+, the `db.system` attribute is automatically set
                // On older versions, this is missing, so we add it here
                if (spanJSON.description === 'prisma:engine:db_query' && !spanJSON.data['db.system']) {
                    span.setAttribute('db.system', 'prisma');
                }
            });
        }
    };
});
exports.instrumentPrisma = instrumentPrisma;
exports.prismaIntegration = prismaIntegration; //# sourceMappingURL=prisma.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/hapi/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationHapi = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-hapi@0.50.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-hapi/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Hapi';
const instrumentHapi = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationHapi.HapiInstrumentation());
const _hapiIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentHapi();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for [Hapi](https://hapi.dev/).
 *
 * If you also want to capture errors, you need to call `setupHapiErrorHandler(server)` after you set up your server.
 *
 * For more information, see the [hapi documentation](https://docs.sentry.io/platforms/javascript/guides/hapi/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.hapiIntegration()],
 * })
 * ```
 */ const hapiIntegration = core.defineIntegration(_hapiIntegration);
function isErrorEvent(event) {
    return !!(event && typeof event === 'object' && 'error' in event && event.error);
}
function sendErrorToSentry(errorData) {
    core.captureException(errorData, {
        mechanism: {
            type: 'hapi',
            handled: false,
            data: {
                function: 'hapiErrorPlugin'
            }
        }
    });
}
const hapiErrorPlugin = {
    name: 'SentryHapiErrorPlugin',
    version: core.SDK_VERSION,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: async function(serverArg) {
        const server = serverArg;
        server.events.on({
            name: 'request',
            channels: [
                'error'
            ]
        }, (request, event)=>{
            if (core.getIsolationScope() !== core.getDefaultIsolationScope()) {
                const route = request.route;
                if (route.path) {
                    core.getIsolationScope().setTransactionName(`${route.method.toUpperCase()} ${route.path}`);
                }
            } else {
                debugBuild.DEBUG_BUILD && core.debug.warn('Isolation scope is still the default isolation scope - skipping setting transactionName');
            }
            if (isErrorEvent(event)) {
                sendErrorToSentry(event.error);
            }
        });
    }
};
/**
 * Add a Hapi plugin to capture errors to Sentry.
 *
 * @param server The Hapi server to attach the error handler to
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const Hapi = require('@hapi/hapi');
 *
 * const init = async () => {
 *   const server = Hapi.server();
 *
 *   // all your routes here
 *
 *   await Sentry.setupHapiErrorHandler(server);
 *
 *   await server.start();
 * };
 * ```
 */ async function setupHapiErrorHandler(server) {
    await server.register(hapiErrorPlugin);
    // Sadly, middleware spans do not go through `requestHook`, so we handle those here
    // We register this hook in this method, because if we register it in the integration `setup`,
    // it would always run even for users that are not even using hapi
    const client = core.getClient();
    if (client) {
        client.on('spanStart', (span)=>{
            addHapiSpanAttributes(span);
        });
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    nodeCore.ensureIsWrapped(server.register, 'hapi');
}
function addHapiSpanAttributes(span) {
    const attributes = core.spanToJSON(span).data;
    // this is one of: router, plugin, server.ext
    const type = attributes['hapi.type'];
    // If this is already set, or we have no Hapi span, no need to process again...
    if (attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
        return;
    }
    span.setAttributes({
        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.hapi',
        [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.hapi`
    });
}
exports.hapiErrorPlugin = hapiErrorPlugin;
exports.hapiIntegration = hapiIntegration;
exports.instrumentHapi = instrumentHapi;
exports.setupHapiErrorHandler = setupHapiErrorHandler; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/koa.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationKoa = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-koa@0.51.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-koa/build/src/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Koa';
const instrumentKoa = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, instrumentationKoa.KoaInstrumentation, (options = {})=>{
    return {
        ignoreLayersType: options.ignoreLayersType,
        requestHook (span, info) {
            nodeCore.addOriginToSpan(span, 'auto.http.otel.koa');
            const attributes = core.spanToJSON(span).data;
            // this is one of: middleware, router
            const type = attributes['koa.type'];
            if (type) {
                span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_OP, `${type}.koa`);
            }
            // Also update the name
            const name = attributes['koa.name'];
            if (typeof name === 'string') {
                // Somehow, name is sometimes `''` for middleware spans
                // See: https://github.com/open-telemetry/opentelemetry-js-contrib/issues/2220
                span.updateName(name || '< unknown >');
            }
            if (core.getIsolationScope() === core.getDefaultIsolationScope()) {
                debugBuild.DEBUG_BUILD && core.debug.warn('Isolation scope is default isolation scope - skipping setting transactionName');
                return;
            }
            const route = attributes[semanticConventions.ATTR_HTTP_ROUTE];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const method = info.context?.request?.method?.toUpperCase() || 'GET';
            if (route) {
                core.getIsolationScope().setTransactionName(`${method} ${route}`);
            }
        }
    };
});
const _koaIntegration = (options = {})=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentKoa(options);
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for [Koa](https://koajs.com/).
 *
 * If you also want to capture errors, you need to call `setupKoaErrorHandler(app)` after you set up your Koa server.
 *
 * For more information, see the [koa documentation](https://docs.sentry.io/platforms/javascript/guides/koa/).
 *
 * @param {KoaOptions} options Configuration options for the Koa integration.
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.koaIntegration()],
 * })
 * ```
 *
 * @example
 * ```javascript
 * // To ignore middleware spans
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [
 *     Sentry.koaIntegration({
 *       ignoreLayersType: ['middleware']
 *     })
 *   ],
 * })
 * ```
 */ const koaIntegration = core.defineIntegration(_koaIntegration);
/**
 * Add an Koa error handler to capture errors to Sentry.
 *
 * The error handler must be before any other middleware and after all controllers.
 *
 * @param app The Express instances
 * @param options {ExpressHandlerOptions} Configuration options for the handler
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const Koa = require("koa");
 *
 * const app = new Koa();
 *
 * Sentry.setupKoaErrorHandler(app);
 *
 * // Add your routes, etc.
 *
 * app.listen(3000);
 * ```
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
const setupKoaErrorHandler = (app)=>{
    app.use(async (ctx, next)=>{
        try {
            await next();
        } catch (error) {
            core.captureException(error);
            throw error;
        }
    });
    nodeCore.ensureIsWrapped(app.use, 'koa');
};
exports.instrumentKoa = instrumentKoa;
exports.koaIntegration = koaIntegration;
exports.setupKoaErrorHandler = setupKoaErrorHandler; //# sourceMappingURL=koa.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/connect.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationConnect = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-connect@0.47.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-connect/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Connect';
const instrumentConnect = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationConnect.ConnectInstrumentation());
const _connectIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentConnect();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for [Connect](https://github.com/senchalabs/connect/).
 *
 * If you also want to capture errors, you need to call `setupConnectErrorHandler(app)` after you initialize your connect app.
 *
 * For more information, see the [connect documentation](https://docs.sentry.io/platforms/javascript/guides/connect/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *   integrations: [Sentry.connectIntegration()],
 * })
 * ```
 */ const connectIntegration = core.defineIntegration(_connectIntegration);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function connectErrorMiddleware(err, req, res, next) {
    core.captureException(err);
    next(err);
}
/**
 * Add a Connect middleware to capture errors to Sentry.
 *
 * @param app The Connect app to attach the error handler to
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 * const connect = require("connect");
 *
 * const app = connect();
 *
 * Sentry.setupConnectErrorHandler(app);
 *
 * // Add you connect routes here
 *
 * app.listen(3000);
 * ```
 */ const setupConnectErrorHandler = (app)=>{
    app.use(connectErrorMiddleware);
    // Sadly, ConnectInstrumentation has no requestHook, so we need to add the attributes here
    // We register this hook in this method, because if we register it in the integration `setup`,
    // it would always run even for users that are not even using connect
    const client = core.getClient();
    if (client) {
        client.on('spanStart', (span)=>{
            addConnectSpanAttributes(span);
        });
    }
    nodeCore.ensureIsWrapped(app.use, 'connect');
};
function addConnectSpanAttributes(span) {
    const attributes = core.spanToJSON(span).data;
    // this is one of: middleware, request_handler
    const type = attributes['connect.type'];
    // If this is already set, or we have no connect span, no need to process again...
    if (attributes[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] || !type) {
        return;
    }
    span.setAttributes({
        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.otel.connect',
        [core.SEMANTIC_ATTRIBUTE_SENTRY_OP]: `${type}.connect`
    });
    // Also update the name, we don't need the "middleware - " prefix
    const name = attributes['connect.name'];
    if (typeof name === 'string') {
        span.updateName(name);
    }
}
exports.connectIntegration = connectIntegration;
exports.instrumentConnect = instrumentConnect;
exports.setupConnectErrorHandler = setupConnectErrorHandler; //# sourceMappingURL=connect.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/knex.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationKnex = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-knex@0.48.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-knex/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Knex';
const instrumentKnex = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationKnex.KnexInstrumentation({
        requireParentSpan: true
    }));
const _knexIntegration = ()=>{
    let instrumentationWrappedCallback;
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            const instrumentation = instrumentKnex();
            instrumentationWrappedCallback = nodeCore.instrumentWhenWrapped(instrumentation);
        },
        setup (client) {
            instrumentationWrappedCallback?.(()=>client.on('spanStart', (span)=>{
                    const { data } = core.spanToJSON(span);
                    // knex.version is always set in the span data
                    // https://github.com/open-telemetry/opentelemetry-js-contrib/blob/0309caeafc44ac9cb13a3345b790b01b76d0497d/plugins/node/opentelemetry-instrumentation-knex/src/instrumentation.ts#L138
                    if ('knex.version' in data) {
                        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.knex');
                    }
                }));
        }
    };
};
/**
 * Knex integration
 *
 * Capture tracing data for [Knex](https://knexjs.org/).
 *
 * @example
 * ```javascript
 * import * as Sentry from '@sentry/node';
 *
 * Sentry.init({
 *  integrations: [Sentry.knexIntegration()],
 * });
 * ```
 */ const knexIntegration = core.defineIntegration(_knexIntegration);
exports.instrumentKnex = instrumentKnex;
exports.knexIntegration = knexIntegration; //# sourceMappingURL=knex.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/tedious.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationTedious = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-tedious@0.22.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-tedious/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const TEDIUS_INSTRUMENTED_METHODS = new Set([
    'callProcedure',
    'execSql',
    'execSqlBatch',
    'execBulkLoad',
    'prepare',
    'execute'
]);
const INTEGRATION_NAME = 'Tedious';
const instrumentTedious = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationTedious.TediousInstrumentation({}));
const _tediousIntegration = ()=>{
    let instrumentationWrappedCallback;
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            const instrumentation = instrumentTedious();
            instrumentationWrappedCallback = nodeCore.instrumentWhenWrapped(instrumentation);
        },
        setup (client) {
            instrumentationWrappedCallback?.(()=>client.on('spanStart', (span)=>{
                    const { description, data } = core.spanToJSON(span);
                    // Tedius integration always set a span name and `db.system` attribute to `mssql`.
                    if (!description || data['db.system'] !== 'mssql') {
                        return;
                    }
                    const operation = description.split(' ')[0] || '';
                    if (TEDIUS_INSTRUMENTED_METHODS.has(operation)) {
                        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.tedious');
                    }
                }));
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [tedious](https://www.npmjs.com/package/tedious) library.
 *
 * For more information, see the [`tediousIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/tedious/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.tediousIntegration()],
 * });
 * ```
 */ const tediousIntegration = core.defineIntegration(_tediousIntegration);
exports.instrumentTedious = instrumentTedious;
exports.tediousIntegration = tediousIntegration; //# sourceMappingURL=tedious.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/genericPool.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationGenericPool = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-generic-pool@0.47.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-generic-pool/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'GenericPool';
const instrumentGenericPool = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationGenericPool.GenericPoolInstrumentation({}));
const _genericPoolIntegration = ()=>{
    let instrumentationWrappedCallback;
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            const instrumentation = instrumentGenericPool();
            instrumentationWrappedCallback = nodeCore.instrumentWhenWrapped(instrumentation);
        },
        setup (client) {
            instrumentationWrappedCallback?.(()=>client.on('spanStart', (span)=>{
                    const spanJSON = core.spanToJSON(span);
                    const spanDescription = spanJSON.description;
                    // typo in emitted span for version <= 0.38.0 of @opentelemetry/instrumentation-generic-pool
                    const isGenericPoolSpan = spanDescription === 'generic-pool.aquire' || spanDescription === 'generic-pool.acquire';
                    if (isGenericPoolSpan) {
                        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.generic_pool');
                    }
                }));
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [generic-pool](https://www.npmjs.com/package/generic-pool) library.
 *
 * For more information, see the [`genericPoolIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/genericpool/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.genericPoolIntegration()],
 * });
 * ```
 */ const genericPoolIntegration = core.defineIntegration(_genericPoolIntegration);
exports.genericPoolIntegration = genericPoolIntegration;
exports.instrumentGenericPool = instrumentGenericPool; //# sourceMappingURL=genericPool.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/dataloader.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationDataloader = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-dataloader@0.21.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-dataloader/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Dataloader';
const instrumentDataloader = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationDataloader.DataloaderInstrumentation({
        requireParentSpan: true
    }));
const _dataloaderIntegration = ()=>{
    let instrumentationWrappedCallback;
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            const instrumentation = instrumentDataloader();
            instrumentationWrappedCallback = nodeCore.instrumentWhenWrapped(instrumentation);
        },
        setup (client) {
            // This is called either immediately or when the instrumentation is wrapped
            instrumentationWrappedCallback?.(()=>{
                client.on('spanStart', (span)=>{
                    const spanJSON = core.spanToJSON(span);
                    if (spanJSON.description?.startsWith('dataloader')) {
                        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto.db.otel.dataloader');
                    }
                    // These are all possible dataloader span descriptions
                    // Still checking for the future versions
                    // in case they add support for `clear` and `prime`
                    if (spanJSON.description === 'dataloader.load' || spanJSON.description === 'dataloader.loadMany' || spanJSON.description === 'dataloader.batch') {
                        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'cache.get');
                    // TODO: We can try adding `key` to the `data` attribute upstream.
                    // Or alternatively, we can add `requestHook` to the dataloader instrumentation.
                    }
                });
            });
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [dataloader](https://www.npmjs.com/package/dataloader) library.
 *
 * For more information, see the [`dataloaderIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/dataloader/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.dataloaderIntegration()],
 * });
 * ```
 */ const dataloaderIntegration = core.defineIntegration(_dataloaderIntegration);
exports.dataloaderIntegration = dataloaderIntegration;
exports.instrumentDataloader = instrumentDataloader; //# sourceMappingURL=dataloader.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/amqplib.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentationAmqplib = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation-amqplib@0.50.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation-amqplib/build/src/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Amqplib';
const config = {
    consumeEndHook: (span)=>{
        nodeCore.addOriginToSpan(span, 'auto.amqplib.otel.consumer');
    },
    publishHook: (span)=>{
        nodeCore.addOriginToSpan(span, 'auto.amqplib.otel.publisher');
    }
};
const instrumentAmqplib = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new instrumentationAmqplib.AmqplibInstrumentation(config));
const _amqplibIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentAmqplib();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [amqplib](https://www.npmjs.com/package/amqplib) library.
 *
 * For more information, see the [`amqplibIntegration` documentation](https://docs.sentry.io/platforms/javascript/guides/node/configuration/integrations/amqplib/).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.amqplibIntegration()],
 * });
 * ```
 */ const amqplibIntegration = core.defineIntegration(_amqplibIntegration);
exports.amqplibIntegration = amqplibIntegration;
exports.instrumentAmqplib = instrumentAmqplib; //# sourceMappingURL=amqplib.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const INTEGRATION_NAME = 'VercelAI';
exports.INTEGRATION_NAME = INTEGRATION_NAME; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/instrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

;
globalThis["_sentryNextJsVersion"] = "15.5.0";
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/constants.js [app-ssr] (ecmascript)");
// List of patched methods
// From: https://sdk.vercel.ai/docs/ai-sdk-core/telemetry#collected-data
const INSTRUMENTED_METHODS = [
    'generateText',
    'streamText',
    'generateObject',
    'streamObject',
    'embed',
    'embedMany'
];
/**
 * Determines whether to record inputs and outputs for Vercel AI telemetry based on the configuration hierarchy.
 *
 * The order of precedence is:
 * 1. The vercel ai integration options
 * 2. The experimental_telemetry options in the vercel ai method calls
 * 3. When telemetry is explicitly enabled (isEnabled: true), default to recording
 * 4. Otherwise, use the sendDefaultPii option from client options
 */ function determineRecordingSettings(integrationRecordingOptions, methodTelemetryOptions, telemetryExplicitlyEnabled, defaultRecordingEnabled) {
    const recordInputs = integrationRecordingOptions?.recordInputs !== undefined ? integrationRecordingOptions.recordInputs : methodTelemetryOptions.recordInputs !== undefined ? methodTelemetryOptions.recordInputs : telemetryExplicitlyEnabled === true ? true // When telemetry is explicitly enabled, default to recording inputs
     : defaultRecordingEnabled;
    const recordOutputs = integrationRecordingOptions?.recordOutputs !== undefined ? integrationRecordingOptions.recordOutputs : methodTelemetryOptions.recordOutputs !== undefined ? methodTelemetryOptions.recordOutputs : telemetryExplicitlyEnabled === true ? true // When telemetry is explicitly enabled, default to recording inputs
     : defaultRecordingEnabled;
    return {
        recordInputs,
        recordOutputs
    };
}
/**
 * This detects is added by the Sentry Vercel AI Integration to detect if the integration should
 * be enabled.
 *
 * It also patches the `ai` module to enable Vercel AI telemetry automatically for all methods.
 */ class SentryVercelAiInstrumentation extends instrumentation.InstrumentationBase {
    __init() {
        this._isPatched = false;
    }
    __init2() {
        this._callbacks = [];
    }
    constructor(config = {}){
        super('@sentry/instrumentation-vercel-ai', core.SDK_VERSION, config);
        SentryVercelAiInstrumentation.prototype.__init.call(this);
        SentryVercelAiInstrumentation.prototype.__init2.call(this);
    }
    /**
   * Initializes the instrumentation by defining the modules to be patched.
   */ init() {
        const module = new instrumentation.InstrumentationNodeModuleDefinition('ai', [
            '>=3.0.0 <5'
        ], this._patch.bind(this));
        return module;
    }
    /**
   * Call the provided callback when the module is patched.
   * If it has already been patched, the callback will be called immediately.
   */ callWhenPatched(callback) {
        if (this._isPatched) {
            callback();
        } else {
            this._callbacks.push(callback);
        }
    }
    /**
   * Patches module exports to enable Vercel AI telemetry.
   */ _patch(moduleExports) {
        this._isPatched = true;
        this._callbacks.forEach((callback)=>callback());
        this._callbacks = [];
        function generatePatch(originalMethod) {
            return (...args)=>{
                const existingExperimentalTelemetry = args[0].experimental_telemetry || {};
                const isEnabled = existingExperimentalTelemetry.isEnabled;
                const client = core.getCurrentScope().getClient();
                const integration = client?.getIntegrationByName(constants.INTEGRATION_NAME);
                const integrationOptions = integration?.options;
                const shouldRecordInputsAndOutputs = integration ? Boolean(client?.getOptions().sendDefaultPii) : false;
                const { recordInputs, recordOutputs } = determineRecordingSettings(integrationOptions, existingExperimentalTelemetry, isEnabled, shouldRecordInputsAndOutputs);
                args[0].experimental_telemetry = {
                    ...existingExperimentalTelemetry,
                    isEnabled: isEnabled !== undefined ? isEnabled : true,
                    recordInputs,
                    recordOutputs
                };
                return core.handleCallbackErrors(()=>{
                    // @ts-expect-error we know that the method exists
                    return originalMethod.apply(this, args);
                }, (error)=>{
                    // This error bubbles up to unhandledrejection handler (if not handled before),
                    // where we do not know the active span anymore
                    // So to circumvent this, we set the active span on the error object
                    // which is picked up by the unhandledrejection handler
                    if (error && typeof error === 'object') {
                        core.addNonEnumerableProperty(error, '_sentry_active_span', core.getActiveSpan());
                    }
                });
            };
        }
        // Is this an ESM module?
        // https://tc39.es/ecma262/#sec-module-namespace-objects
        if (Object.prototype.toString.call(moduleExports) === '[object Module]') {
            // In ESM we take the usual route and just replace the exports we want to instrument
            for (const method of INSTRUMENTED_METHODS){
                moduleExports[method] = generatePatch(moduleExports[method]);
            }
            return moduleExports;
        } else {
            // In CJS we can't replace the exports in the original module because they
            // don't have setters, so we create a new object with the same properties
            const patchedModuleExports = INSTRUMENTED_METHODS.reduce((acc, curr)=>{
                acc[curr] = generatePatch(moduleExports[curr]);
                return acc;
            }, {});
            return {
                ...moduleExports,
                ...patchedModuleExports
            };
        }
    }
}
exports.SentryVercelAiInstrumentation = SentryVercelAiInstrumentation;
exports.determineRecordingSettings = determineRecordingSettings; //# sourceMappingURL=instrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/constants.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/instrumentation.js [app-ssr] (ecmascript)");
const instrumentVercelAi = nodeCore.generateInstrumentOnce(constants.INTEGRATION_NAME, ()=>new instrumentation.SentryVercelAiInstrumentation({}));
/**
 * Determines if the integration should be forced based on environment and package availability.
 * Returns true if the 'ai' package is available.
 */ function shouldForceIntegration(client) {
    const modules = client.getIntegrationByName('Modules');
    return !!modules?.getModules?.()?.ai;
}
const _vercelAIIntegration = (options = {})=>{
    let instrumentation;
    return {
        name: constants.INTEGRATION_NAME,
        options,
        setupOnce () {
            instrumentation = instrumentVercelAi();
        },
        afterAllSetup (client) {
            // Auto-detect if we should force the integration when running with 'ai' package available
            // Note that this can only be detected if the 'Modules' integration is available, and running in CJS mode
            const shouldForce = options.force ?? shouldForceIntegration(client);
            if (shouldForce) {
                core.addVercelAiProcessors(client);
            } else {
                instrumentation?.callWhenPatched(()=>core.addVercelAiProcessors(client));
            }
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the [ai](https://www.npmjs.com/package/ai) library.
 * This integration is not enabled by default, you need to manually add it.
 *
 * For more information, see the [`ai` documentation](https://sdk.vercel.ai/docs/ai-sdk-core/telemetry).
 *
 * @example
 * ```javascript
 * const Sentry = require('@sentry/node');
 *
 * Sentry.init({
 *  integrations: [Sentry.vercelAIIntegration()],
 * });
 * ```
 *
 * This integration adds tracing support to all `ai` function calls.
 * You need to opt-in to collecting spans for a specific call,
 * you can do so by setting `experimental_telemetry.isEnabled` to `true` in the first argument of the function call.
 *
 * ```javascript
 * const result = await generateText({
 *   model: openai('gpt-4-turbo'),
 *   experimental_telemetry: { isEnabled: true },
 * });
 * ```
 *
 * If you want to collect inputs and outputs for a specific call, you must specifically opt-in to each
 * function call by setting `experimental_telemetry.recordInputs` and `experimental_telemetry.recordOutputs`
 * to `true`.
 *
 * ```javascript
 * const result = await generateText({
 *  model: openai('gpt-4-turbo'),
 *  experimental_telemetry: { isEnabled: true, recordInputs: true, recordOutputs: true },
 * });
 */ const vercelAIIntegration = core.defineIntegration(_vercelAIIntegration);
exports.instrumentVercelAi = instrumentVercelAi;
exports.vercelAIIntegration = vercelAIIntegration; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/openai/instrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

;
globalThis["_sentryNextJsVersion"] = "15.5.0";
Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const supportedVersions = [
    '>=4.0.0 <6'
];
/**
 * Determines telemetry recording settings.
 */ function determineRecordingSettings(integrationOptions, defaultEnabled) {
    const recordInputs = integrationOptions?.recordInputs ?? defaultEnabled;
    const recordOutputs = integrationOptions?.recordOutputs ?? defaultEnabled;
    return {
        recordInputs,
        recordOutputs
    };
}
/**
 * Sentry OpenAI instrumentation using OpenTelemetry.
 */ class SentryOpenAiInstrumentation extends instrumentation.InstrumentationBase {
    constructor(config = {}){
        super('@sentry/instrumentation-openai', core.SDK_VERSION, config);
    }
    /**
   * Initializes the instrumentation by defining the modules to be patched.
   */ init() {
        const module = new instrumentation.InstrumentationNodeModuleDefinition('openai', supportedVersions, this._patch.bind(this));
        return module;
    }
    /**
   * Core patch logic applying instrumentation to the OpenAI client constructor.
   */ _patch(exports1) {
        const Original = exports1.OpenAI;
        const WrappedOpenAI = function(...args) {
            const instance = Reflect.construct(Original, args);
            const scopeClient = core.getCurrentScope().getClient();
            const integration = scopeClient?.getIntegrationByName(core.OPENAI_INTEGRATION_NAME);
            const integrationOpts = integration?.options;
            const defaultPii = Boolean(scopeClient?.getOptions().sendDefaultPii);
            const { recordInputs, recordOutputs } = determineRecordingSettings(integrationOpts, defaultPii);
            return core.instrumentOpenAiClient(instance, {
                recordInputs,
                recordOutputs
            });
        };
        // Preserve static and prototype chains
        Object.setPrototypeOf(WrappedOpenAI, Original);
        Object.setPrototypeOf(WrappedOpenAI.prototype, Original.prototype);
        for (const key of Object.getOwnPropertyNames(Original)){
            if (![
                'length',
                'name',
                'prototype'
            ].includes(key)) {
                const descriptor = Object.getOwnPropertyDescriptor(Original, key);
                if (descriptor) {
                    Object.defineProperty(WrappedOpenAI, key, descriptor);
                }
            }
        }
        // Constructor replacement - handle read-only properties
        // The OpenAI property might have only a getter, so use defineProperty
        try {
            exports1.OpenAI = WrappedOpenAI;
        } catch (error) {
            // If direct assignment fails, override the property descriptor
            Object.defineProperty(exports1, 'OpenAI', {
                value: WrappedOpenAI,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }
        // Wrap the default export if it points to the original constructor
        // Constructor replacement - handle read-only properties
        // The OpenAI property might have only a getter, so use defineProperty
        if (exports1.default === Original) {
            try {
                exports1.default = WrappedOpenAI;
            } catch (error) {
                // If direct assignment fails, override the property descriptor
                Object.defineProperty(exports1, 'default', {
                    value: WrappedOpenAI,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
        }
        return exports1;
    }
}
exports.SentryOpenAiInstrumentation = SentryOpenAiInstrumentation; //# sourceMappingURL=instrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/openai/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/openai/instrumentation.js [app-ssr] (ecmascript)");
const instrumentOpenAi = nodeCore.generateInstrumentOnce(core.OPENAI_INTEGRATION_NAME, ()=>new instrumentation.SentryOpenAiInstrumentation({}));
const _openAiIntegration = (options = {})=>{
    return {
        name: core.OPENAI_INTEGRATION_NAME,
        options,
        setupOnce () {
            instrumentOpenAi();
        }
    };
};
/**
 * Adds Sentry tracing instrumentation for the OpenAI SDK.
 *
 * This integration is enabled by default.
 *
 * When configured, this integration automatically instruments OpenAI SDK client instances
 * to capture telemetry data following OpenTelemetry Semantic Conventions for Generative AI.
 *
 * @example
 * ```javascript
 * import * as Sentry from '@sentry/node';
 *
 * Sentry.init({
 *   integrations: [Sentry.openAIIntegration()],
 * });
 * ```
 *
 * ## Options
 *
 * - `recordInputs`: Whether to record prompt messages (default: respects `sendDefaultPii` client option)
 * - `recordOutputs`: Whether to record response text (default: respects `sendDefaultPii` client option)
 *
 * ### Default Behavior
 *
 * By default, the integration will:
 * - Record inputs and outputs ONLY if `sendDefaultPii` is set to `true` in your Sentry client options
 * - Otherwise, inputs and outputs are NOT recorded unless explicitly enabled
 *
 * @example
 * ```javascript
 * // Record inputs and outputs when sendDefaultPii is false
 * Sentry.init({
 *   integrations: [
 *     Sentry.openAIIntegration({
 *       recordInputs: true,
 *       recordOutputs: true
 *     })
 *   ],
 * });
 *
 * // Never record inputs/outputs regardless of sendDefaultPii
 * Sentry.init({
 *   sendDefaultPii: true,
 *   integrations: [
 *     Sentry.openAIIntegration({
 *       recordInputs: false,
 *       recordOutputs: false
 *     })
 *   ],
 * });
 * ```
 *
 */ const openAIIntegration = core.defineIntegration(_openAiIntegration);
exports.instrumentOpenAi = instrumentOpenAi;
exports.openAIIntegration = openAIIntegration; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/launchDarkly.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * This is a shim for the LaunchDarkly integration.
 * We need this in order to not throw runtime errors when accidentally importing this on the server through a meta framework like Next.js.
 */ const launchDarklyIntegrationShim = core.defineIntegration((_options)=>{
    if (!core.isBrowser()) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('The launchDarklyIntegration() can only be used in the browser.');
        });
    }
    return {
        name: 'LaunchDarkly'
    };
});
/**
 * This is a shim for the LaunchDarkly flag used handler.
 */ function buildLaunchDarklyFlagUsedHandlerShim() {
    if (!core.isBrowser()) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('The buildLaunchDarklyFlagUsedHandler() can only be used in the browser.');
        });
    }
    return {
        name: 'sentry-flag-auditor',
        type: 'flag-used',
        synchronous: true,
        method: ()=>null
    };
}
exports.buildLaunchDarklyFlagUsedHandlerShim = buildLaunchDarklyFlagUsedHandlerShim;
exports.launchDarklyIntegrationShim = launchDarklyIntegrationShim; //# sourceMappingURL=launchDarkly.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/openFeature.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * This is a shim for the OpenFeature integration.
 * We need this in order to not throw runtime errors when accidentally importing this on the server through a meta framework like Next.js.
 */ const openFeatureIntegrationShim = core.defineIntegration((_options)=>{
    if (!core.isBrowser()) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('The openFeatureIntegration() can only be used in the browser.');
        });
    }
    return {
        name: 'OpenFeature'
    };
});
/**
 * This is a shim for the OpenFeature integration hook.
 */ class OpenFeatureIntegrationHookShim {
    /**
   *
   */ constructor(){
        if (!core.isBrowser()) {
            core.consoleSandbox(()=>{
                // eslint-disable-next-line no-console
                console.warn('The OpenFeatureIntegrationHook can only be used in the browser.');
            });
        }
    }
    /**
   *
   */ after() {
    // No-op
    }
    /**
   *
   */ error() {
    // No-op
    }
}
exports.OpenFeatureIntegrationHookShim = OpenFeatureIntegrationHookShim;
exports.openFeatureIntegrationShim = openFeatureIntegrationShim; //# sourceMappingURL=openFeature.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/statsig.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * This is a shim for the Statsig integration.
 * We need this in order to not throw runtime errors when accidentally importing this on the server through a meta framework like Next.js.
 */ const statsigIntegrationShim = core.defineIntegration((_options)=>{
    if (!core.isBrowser()) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('The statsigIntegration() can only be used in the browser.');
        });
    }
    return {
        name: 'Statsig'
    };
});
exports.statsigIntegrationShim = statsigIntegrationShim; //# sourceMappingURL=statsig.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/unleash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * This is a shim for the Unleash integration.
 * We need this in order to not throw runtime errors when accidentally importing this on the server through a meta framework like Next.js.
 */ const unleashIntegrationShim = core.defineIntegration((_options)=>{
    if (!core.isBrowser()) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('The unleashIntegration() can only be used in the browser.');
        });
    }
    return {
        name: 'Unleash'
    };
});
exports.unleashIntegrationShim = unleashIntegrationShim; //# sourceMappingURL=unleash.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/otel/patches/firestore.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const net = __turbopack_context__.r("[externals]/node:net [external] (node:net, cjs)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
/**
 *
 * @param tracer - Opentelemetry Tracer
 * @param firestoreSupportedVersions - supported version of firebase/firestore
 * @param wrap - reference to native instrumentation wrap function
 * @param unwrap - reference to native instrumentation wrap function
 */ function patchFirestore(tracer, firestoreSupportedVersions, wrap, unwrap, config) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const defaultFirestoreSpanCreationHook = ()=>{};
    let firestoreSpanCreationHook = defaultFirestoreSpanCreationHook;
    const configFirestoreSpanCreationHook = config.firestoreSpanCreationHook;
    if (typeof configFirestoreSpanCreationHook === 'function') {
        firestoreSpanCreationHook = (span)=>{
            instrumentation.safeExecuteInTheMiddle(()=>configFirestoreSpanCreationHook(span), (error)=>{
                if (!error) {
                    return;
                }
                api.diag.error(error?.message);
            }, true);
        };
    }
    const moduleFirestoreCJS = new instrumentation.InstrumentationNodeModuleDefinition('@firebase/firestore', firestoreSupportedVersions, // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (moduleExports)=>wrapMethods(moduleExports, wrap, unwrap, tracer, firestoreSpanCreationHook));
    const files = [
        '@firebase/firestore/dist/lite/index.node.cjs.js',
        '@firebase/firestore/dist/lite/index.node.mjs.js',
        '@firebase/firestore/dist/lite/index.rn.esm2017.js',
        '@firebase/firestore/dist/lite/index.cjs.js'
    ];
    for (const file of files){
        moduleFirestoreCJS.files.push(new instrumentation.InstrumentationNodeModuleFile(file, firestoreSupportedVersions, (moduleExports)=>wrapMethods(moduleExports, wrap, unwrap, tracer, firestoreSpanCreationHook), (moduleExports)=>unwrapMethods(moduleExports, unwrap)));
    }
    return moduleFirestoreCJS;
}
function wrapMethods(// eslint-disable-next-line @typescript-eslint/no-explicit-any
moduleExports, wrap, unwrap, tracer, firestoreSpanCreationHook) {
    unwrapMethods(moduleExports, unwrap);
    wrap(moduleExports, 'addDoc', patchAddDoc(tracer, firestoreSpanCreationHook));
    wrap(moduleExports, 'getDocs', patchGetDocs(tracer, firestoreSpanCreationHook));
    wrap(moduleExports, 'setDoc', patchSetDoc(tracer, firestoreSpanCreationHook));
    wrap(moduleExports, 'deleteDoc', patchDeleteDoc(tracer, firestoreSpanCreationHook));
    return moduleExports;
}
function unwrapMethods(// eslint-disable-next-line @typescript-eslint/no-explicit-any
moduleExports, unwrap) {
    for (const method of [
        'addDoc',
        'getDocs',
        'setDoc',
        'deleteDoc'
    ]){
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (instrumentation.isWrapped(moduleExports[method])) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            unwrap(moduleExports, method);
        }
    }
    return moduleExports;
}
function patchAddDoc(tracer, firestoreSpanCreationHook) {
    return function addDoc(original) {
        return function(reference, data) {
            const span = startDBSpan(tracer, 'addDoc', reference);
            firestoreSpanCreationHook(span);
            return executeContextWithSpan(span, ()=>{
                return original(reference, data);
            });
        };
    };
}
function patchDeleteDoc(tracer, firestoreSpanCreationHook) {
    return function deleteDoc(original) {
        return function(reference) {
            const span = startDBSpan(tracer, 'deleteDoc', reference.parent || reference);
            firestoreSpanCreationHook(span);
            return executeContextWithSpan(span, ()=>{
                return original(reference);
            });
        };
    };
}
function patchGetDocs(tracer, firestoreSpanCreationHook) {
    return function getDocs(original) {
        return function(reference) {
            const span = startDBSpan(tracer, 'getDocs', reference);
            firestoreSpanCreationHook(span);
            return executeContextWithSpan(span, ()=>{
                return original(reference);
            });
        };
    };
}
function patchSetDoc(tracer, firestoreSpanCreationHook) {
    return function setDoc(original) {
        return function(reference, data, options) {
            const span = startDBSpan(tracer, 'setDoc', reference.parent || reference);
            firestoreSpanCreationHook(span);
            return executeContextWithSpan(span, ()=>{
                return typeof options !== 'undefined' ? original(reference, data, options) : original(reference, data);
            });
        };
    };
}
function executeContextWithSpan(span, callback) {
    return api.context.with(api.trace.setSpan(api.context.active(), span), ()=>{
        return instrumentation.safeExecuteInTheMiddle(()=>{
            return callback();
        }, (err)=>{
            if (err) {
                span.recordException(err);
            }
            span.end();
        }, true);
    });
}
function startDBSpan(tracer, spanName, reference) {
    const span = tracer.startSpan(`${spanName} ${reference.path}`, {
        kind: api.SpanKind.CLIENT
    });
    addAttributes(span, reference);
    span.setAttribute(semanticConventions.ATTR_DB_OPERATION_NAME, spanName);
    return span;
}
/**
 * Gets the server address and port attributes from the Firestore settings.
 * It's best effort to extract the address and port from the settings, especially for IPv6.
 * @param span - The span to set attributes on.
 * @param settings - The Firestore settings containing host information.
 */ function getPortAndAddress(settings) {
    let address;
    let port;
    if (typeof settings.host === 'string') {
        if (settings.host.startsWith('[')) {
            // IPv6 addresses can be enclosed in square brackets, e.g., [2001:db8::1]:8080
            if (settings.host.endsWith(']')) {
                // IPv6 with square brackets without port
                address = settings.host.replace(/^\[|\]$/g, '');
            } else if (settings.host.includes(']:')) {
                // IPv6 with square brackets with port
                const lastColonIndex = settings.host.lastIndexOf(':');
                if (lastColonIndex !== -1) {
                    address = settings.host.slice(1, lastColonIndex).replace(/^\[|\]$/g, '');
                    port = settings.host.slice(lastColonIndex + 1);
                }
            }
        } else {
            // IPv4 or IPv6 without square brackets
            // If it's an IPv6 address without square brackets, we assume it does not have a port.
            if (net.isIPv6(settings.host)) {
                address = settings.host;
            } else {
                const lastColonIndex = settings.host.lastIndexOf(':');
                if (lastColonIndex !== -1) {
                    address = settings.host.slice(0, lastColonIndex);
                    port = settings.host.slice(lastColonIndex + 1);
                } else {
                    address = settings.host;
                }
            }
        }
    }
    return {
        address: address,
        port: port ? parseInt(port, 10) : undefined
    };
}
function addAttributes(span, reference) {
    const firestoreApp = reference.firestore.app;
    const firestoreOptions = firestoreApp.options;
    const json = reference.firestore.toJSON() || {};
    const settings = json.settings || {};
    const attributes = {
        [semanticConventions.ATTR_DB_COLLECTION_NAME]: reference.path,
        [semanticConventions.ATTR_DB_NAMESPACE]: firestoreApp.name,
        [semanticConventions.ATTR_DB_SYSTEM_NAME]: 'firebase.firestore',
        'firebase.firestore.type': reference.type,
        'firebase.firestore.options.projectId': firestoreOptions.projectId,
        'firebase.firestore.options.appId': firestoreOptions.appId,
        'firebase.firestore.options.messagingSenderId': firestoreOptions.messagingSenderId,
        'firebase.firestore.options.storageBucket': firestoreOptions.storageBucket
    };
    const { address, port } = getPortAndAddress(settings);
    if (address) {
        attributes[semanticConventions.ATTR_SERVER_ADDRESS] = address;
    }
    if (port) {
        attributes[semanticConventions.ATTR_SERVER_PORT] = port;
    }
    span.setAttributes(attributes);
}
exports.getPortAndAddress = getPortAndAddress;
exports.patchFirestore = patchFirestore; //# sourceMappingURL=firestore.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/otel/firebaseInstrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const firestore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/otel/patches/firestore.js [app-ssr] (ecmascript)");
const DefaultFirebaseInstrumentationConfig = {};
const firestoreSupportedVersions = [
    '>=3.0.0 <5'
]; // firebase 9+
/**
 * Instrumentation for Firebase services, specifically Firestore.
 */ class FirebaseInstrumentation extends instrumentation.InstrumentationBase {
    constructor(config = DefaultFirebaseInstrumentationConfig){
        super('@sentry/instrumentation-firebase', core.SDK_VERSION, config);
    }
    /**
   * sets config
   * @param config
   */ setConfig(config = {}) {
        super.setConfig({
            ...DefaultFirebaseInstrumentationConfig,
            ...config
        });
    }
    /**
   *
   * @protected
   */ // eslint-disable-next-line @typescript-eslint/naming-convention
    init() {
        const modules = [];
        modules.push(firestore.patchFirestore(this.tracer, firestoreSupportedVersions, this._wrap, this._unwrap, this.getConfig()));
        return modules;
    }
}
exports.FirebaseInstrumentation = FirebaseInstrumentation; //# sourceMappingURL=firebaseInstrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/firebase.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const firebaseInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/otel/firebaseInstrumentation.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Firebase';
const config = {
    firestoreSpanCreationHook: (span)=>{
        nodeCore.addOriginToSpan(span, 'auto.firebase.otel.firestore');
        span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'db.query');
    }
};
const instrumentFirebase = nodeCore.generateInstrumentOnce(INTEGRATION_NAME, ()=>new firebaseInstrumentation.FirebaseInstrumentation(config));
const _firebaseIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            instrumentFirebase();
        }
    };
};
const firebaseIntegration = core.defineIntegration(_firebaseIntegration);
exports.firebaseIntegration = firebaseIntegration;
exports.instrumentFirebase = instrumentFirebase; //# sourceMappingURL=firebase.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const http = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/http.js [app-ssr] (ecmascript)");
const amqplib = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/amqplib.js [app-ssr] (ecmascript)");
const connect = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/connect.js [app-ssr] (ecmascript)");
const express = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/express.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/index.js [app-ssr] (ecmascript)");
const firebase = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/firebase.js [app-ssr] (ecmascript)");
const genericPool = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/genericPool.js [app-ssr] (ecmascript)");
const graphql = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/graphql.js [app-ssr] (ecmascript)");
const index$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/hapi/index.js [app-ssr] (ecmascript)");
const kafka = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/kafka.js [app-ssr] (ecmascript)");
const koa = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/koa.js [app-ssr] (ecmascript)");
const lrumemoizer = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/lrumemoizer.js [app-ssr] (ecmascript)");
const mongo = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongo.js [app-ssr] (ecmascript)");
const mongoose = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongoose.js [app-ssr] (ecmascript)");
const mysql = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql.js [app-ssr] (ecmascript)");
const mysql2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql2.js [app-ssr] (ecmascript)");
const index$3 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/openai/index.js [app-ssr] (ecmascript)");
const postgres = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgres.js [app-ssr] (ecmascript)");
const postgresjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js [app-ssr] (ecmascript)");
const prisma = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js [app-ssr] (ecmascript)");
const redis = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/redis.js [app-ssr] (ecmascript)");
const tedious = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/tedious.js [app-ssr] (ecmascript)");
const index$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/index.js [app-ssr] (ecmascript)");
/**
 * With OTEL, all performance integrations will be added, as OTEL only initializes them when the patched package is actually required.
 */ function getAutoPerformanceIntegrations() {
    return [
        express.expressIntegration(),
        index.fastifyIntegration(),
        graphql.graphqlIntegration(),
        mongo.mongoIntegration(),
        mongoose.mongooseIntegration(),
        mysql.mysqlIntegration(),
        mysql2.mysql2Integration(),
        redis.redisIntegration(),
        postgres.postgresIntegration(),
        prisma.prismaIntegration(),
        index$1.hapiIntegration(),
        koa.koaIntegration(),
        connect.connectIntegration(),
        tedious.tediousIntegration(),
        genericPool.genericPoolIntegration(),
        kafka.kafkaIntegration(),
        amqplib.amqplibIntegration(),
        lrumemoizer.lruMemoizerIntegration(),
        index$2.vercelAIIntegration(),
        index$3.openAIIntegration(),
        postgresjs.postgresJsIntegration(),
        firebase.firebaseIntegration()
    ];
}
/**
 * Get a list of methods to instrument OTEL, when preload instrumentation.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOpenTelemetryInstrumentationToPreload() {
    return [
        http.instrumentOtelHttp,
        express.instrumentExpress,
        connect.instrumentConnect,
        index.instrumentFastify,
        index.instrumentFastifyV3,
        index$1.instrumentHapi,
        kafka.instrumentKafka,
        koa.instrumentKoa,
        lrumemoizer.instrumentLruMemoizer,
        mongo.instrumentMongo,
        mongoose.instrumentMongoose,
        mysql.instrumentMysql,
        mysql2.instrumentMysql2,
        postgres.instrumentPostgres,
        index$1.instrumentHapi,
        graphql.instrumentGraphql,
        redis.instrumentRedis,
        tedious.instrumentTedious,
        genericPool.instrumentGenericPool,
        amqplib.instrumentAmqplib,
        index$2.instrumentVercelAi,
        index$3.instrumentOpenAi,
        postgresjs.instrumentPostgresJs,
        firebase.instrumentFirebase
    ];
}
exports.getAutoPerformanceIntegrations = getAutoPerformanceIntegrations;
exports.getOpenTelemetryInstrumentationToPreload = getOpenTelemetryInstrumentationToPreload; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/initOtel.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const resources = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+resources@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/resources/build/esm/index.js [app-ssr] (ecmascript)");
const sdkTraceBase = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+sdk-trace-base@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/sdk-trace-base/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const importInTheMiddle = __turbopack_context__.r("[externals]/import-in-the-middle [external] (import-in-the-middle, cjs)");
const moduleModule = __turbopack_context__.r("[externals]/module [external] (module, cjs)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/index.js [app-ssr] (ecmascript)");
var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
// About 277h - this must fit into new Array(len)!
const MAX_MAX_SPAN_WAIT_DURATION = 1000000;
/**
 * Initialize OpenTelemetry for Node.
 */ function initOpenTelemetry(client, options = {}) {
    if (client.getOptions().debug) {
        nodeCore.setupOpenTelemetryLogger();
    }
    const provider = setupOtel(client, options);
    client.traceProvider = provider;
}
/** Initialize the ESM loader. */ function maybeInitializeEsmLoader() {
    const [nodeMajor = 0, nodeMinor = 0] = process.versions.node.split('.').map(Number);
    // Register hook was added in v20.6.0 and v18.19.0
    if (nodeMajor >= 21 || nodeMajor === 20 && nodeMinor >= 6 || nodeMajor === 18 && nodeMinor >= 19) {
        if (!core.GLOBAL_OBJ._sentryEsmLoaderHookRegistered) {
            try {
                const { addHookMessagePort } = importInTheMiddle.createAddHookMessageChannel();
                // @ts-expect-error register is available in these versions
                moduleModule.default.register('import-in-the-middle/hook.mjs', typeof document === 'undefined' ? __turbopack_context__.r("[externals]/url [external] (url, cjs)").pathToFileURL(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/initOtel.js")).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('sdk/initOtel.js', document.baseURI).href, {
                    data: {
                        addHookMessagePort,
                        include: []
                    },
                    transferList: [
                        addHookMessagePort
                    ]
                });
            } catch (error) {
                core.debug.warn('Failed to register ESM hook', error);
            }
        }
    } else {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn(`[Sentry] You are using Node.js v${process.versions.node} in ESM mode ("import syntax"). The Sentry Node.js SDK is not compatible with ESM in Node.js versions before 18.19.0 or before 20.6.0. Please either build your application with CommonJS ("require() syntax"), or upgrade your Node.js version.`);
        });
    }
}
/**
 * Preload OpenTelemetry for Node.
 * This can be used to preload instrumentation early, but set up Sentry later.
 * By preloading the OTEL instrumentation wrapping still happens early enough that everything works.
 */ function preloadOpenTelemetry(options = {}) {
    const { debug } = options;
    if (debug) {
        core.debug.enable();
    }
    if (!nodeCore.isCjs()) {
        maybeInitializeEsmLoader();
    }
    // These are all integrations that we need to pre-load to ensure they are set up before any other code runs
    getPreloadMethods(options.integrations).forEach((fn)=>{
        fn();
        if (debug) {
            core.debug.log(`[Sentry] Preloaded ${fn.id} instrumentation`);
        }
    });
}
function getPreloadMethods(integrationNames) {
    const instruments = index.getOpenTelemetryInstrumentationToPreload();
    if (!integrationNames) {
        return instruments;
    }
    return instruments.filter((instrumentation)=>integrationNames.includes(instrumentation.id));
}
/** Just exported for tests. */ function setupOtel(client, options = {}) {
    // Create and configure NodeTracerProvider
    const provider = new sdkTraceBase.BasicTracerProvider({
        sampler: new opentelemetry.SentrySampler(client),
        resource: resources.defaultResource().merge(resources.resourceFromAttributes({
            [semanticConventions.ATTR_SERVICE_NAME]: 'node',
            // eslint-disable-next-line deprecation/deprecation
            [semanticConventions.SEMRESATTRS_SERVICE_NAMESPACE]: 'sentry',
            [semanticConventions.ATTR_SERVICE_VERSION]: core.SDK_VERSION
        })),
        forceFlushTimeoutMillis: 500,
        spanProcessors: [
            new opentelemetry.SentrySpanProcessor({
                timeout: _clampSpanProcessorTimeout(client.getOptions().maxSpanWaitDuration)
            }),
            ...options.spanProcessors || []
        ]
    });
    // Register as globals
    api.trace.setGlobalTracerProvider(provider);
    api.propagation.setGlobalPropagator(new opentelemetry.SentryPropagator());
    api.context.setGlobalContextManager(new nodeCore.SentryContextManager());
    return provider;
}
/** Just exported for tests. */ function _clampSpanProcessorTimeout(maxSpanWaitDuration) {
    if (maxSpanWaitDuration == null) {
        return undefined;
    }
    // We guard for a max. value here, because we create an array with this length
    // So if this value is too large, this would fail
    if (maxSpanWaitDuration > MAX_MAX_SPAN_WAIT_DURATION) {
        debugBuild.DEBUG_BUILD && core.debug.warn(`\`maxSpanWaitDuration\` is too high, using the maximum value of ${MAX_MAX_SPAN_WAIT_DURATION}`);
        return MAX_MAX_SPAN_WAIT_DURATION;
    } else if (maxSpanWaitDuration <= 0 || Number.isNaN(maxSpanWaitDuration)) {
        debugBuild.DEBUG_BUILD && core.debug.warn('`maxSpanWaitDuration` must be a positive number, using default value instead.');
        return undefined;
    }
    return maxSpanWaitDuration;
}
exports._clampSpanProcessorTimeout = _clampSpanProcessorTimeout;
exports.initOpenTelemetry = initOpenTelemetry;
exports.maybeInitializeEsmLoader = maybeInitializeEsmLoader;
exports.preloadOpenTelemetry = preloadOpenTelemetry;
exports.setupOtel = setupOtel; //# sourceMappingURL=initOtel.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
const http = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/http.js [app-ssr] (ecmascript)");
const nodeFetch = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/node-fetch.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/index.js [app-ssr] (ecmascript)");
const initOtel = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/initOtel.js [app-ssr] (ecmascript)");
/**
 * Get default integrations, excluding performance.
 */ function getDefaultIntegrationsWithoutPerformance() {
    const nodeCoreIntegrations = nodeCore.getDefaultIntegrations();
    // Filter out the node-core HTTP and NodeFetch integrations and replace them with Node SDK's composite versions
    return nodeCoreIntegrations.filter((integration)=>integration.name !== 'Http' && integration.name !== 'NodeFetch').concat(http.httpIntegration(), nodeFetch.nativeNodeFetchIntegration());
}
/** Get the default integrations for the Node SDK. */ function getDefaultIntegrations(options) {
    return [
        ...getDefaultIntegrationsWithoutPerformance(),
        // We only add performance integrations if tracing is enabled
        // Note that this means that without tracing enabled, e.g. `expressIntegration()` will not be added
        // This means that generally request isolation will work (because that is done by httpIntegration)
        // But `transactionName` will not be set automatically
        ...core.hasSpansEnabled(options) ? index.getAutoPerformanceIntegrations() : []
    ];
}
/**
 * Initialize Sentry for Node.
 */ function init(options = {}) {
    return _init(options, getDefaultIntegrations);
}
/**
 * Internal initialization function.
 */ function _init(options = {}, getDefaultIntegrationsImpl) {
    core.applySdkMetadata(options, 'node');
    const client = nodeCore.init({
        ...options,
        // Only use Node SDK defaults if none provided
        defaultIntegrations: options.defaultIntegrations ?? getDefaultIntegrationsImpl(options)
    });
    // Add Node SDK specific OpenTelemetry setup
    if (client && !options.skipOpenTelemetrySetup) {
        initOtel.initOpenTelemetry(client, {
            spanProcessors: options.openTelemetrySpanProcessors
        });
        nodeCore.validateOpenTelemetrySetup();
    }
    return client;
}
/**
 * Initialize Sentry for Node, without any integrations added by default.
 */ function initWithoutDefaultIntegrations(options = {}) {
    return _init(options, ()=>[]);
}
exports.getDefaultIntegrations = getDefaultIntegrations;
exports.getDefaultIntegrationsWithoutPerformance = getDefaultIntegrationsWithoutPerformance;
exports.init = init;
exports.initWithoutDefaultIntegrations = initWithoutDefaultIntegrations; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const http = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/http.js [app-ssr] (ecmascript)");
const nodeFetch = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/node-fetch.js [app-ssr] (ecmascript)");
const fs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/fs.js [app-ssr] (ecmascript)");
const express = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/express.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/fastify/index.js [app-ssr] (ecmascript)");
const graphql = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/graphql.js [app-ssr] (ecmascript)");
const kafka = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/kafka.js [app-ssr] (ecmascript)");
const lrumemoizer = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/lrumemoizer.js [app-ssr] (ecmascript)");
const mongo = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongo.js [app-ssr] (ecmascript)");
const mongoose = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mongoose.js [app-ssr] (ecmascript)");
const mysql = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql.js [app-ssr] (ecmascript)");
const mysql2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/mysql2.js [app-ssr] (ecmascript)");
const redis = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/redis.js [app-ssr] (ecmascript)");
const postgres = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgres.js [app-ssr] (ecmascript)");
const postgresjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/postgresjs.js [app-ssr] (ecmascript)");
const prisma = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/prisma.js [app-ssr] (ecmascript)");
const index$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/hapi/index.js [app-ssr] (ecmascript)");
const koa = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/koa.js [app-ssr] (ecmascript)");
const connect = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/connect.js [app-ssr] (ecmascript)");
const knex = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/knex.js [app-ssr] (ecmascript)");
const tedious = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/tedious.js [app-ssr] (ecmascript)");
const genericPool = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/genericPool.js [app-ssr] (ecmascript)");
const dataloader = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/dataloader.js [app-ssr] (ecmascript)");
const amqplib = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/amqplib.js [app-ssr] (ecmascript)");
const index$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/vercelai/index.js [app-ssr] (ecmascript)");
const index$3 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/openai/index.js [app-ssr] (ecmascript)");
const launchDarkly = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/launchDarkly.js [app-ssr] (ecmascript)");
const openFeature = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/openFeature.js [app-ssr] (ecmascript)");
const statsig = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/statsig.js [app-ssr] (ecmascript)");
const unleash = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/featureFlagShims/unleash.js [app-ssr] (ecmascript)");
const firebase = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/firebase/firebase.js [app-ssr] (ecmascript)");
const index$4 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/index.js [app-ssr] (ecmascript)");
const initOtel = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/sdk/initOtel.js [app-ssr] (ecmascript)");
const index$5 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/integrations/tracing/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeCore = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)");
exports.httpIntegration = http.httpIntegration;
exports.nativeNodeFetchIntegration = nodeFetch.nativeNodeFetchIntegration;
exports.fsIntegration = fs.fsIntegration;
exports.expressErrorHandler = express.expressErrorHandler;
exports.expressIntegration = express.expressIntegration;
exports.setupExpressErrorHandler = express.setupExpressErrorHandler;
exports.fastifyIntegration = index.fastifyIntegration;
exports.setupFastifyErrorHandler = index.setupFastifyErrorHandler;
exports.graphqlIntegration = graphql.graphqlIntegration;
exports.kafkaIntegration = kafka.kafkaIntegration;
exports.lruMemoizerIntegration = lrumemoizer.lruMemoizerIntegration;
exports.mongoIntegration = mongo.mongoIntegration;
exports.mongooseIntegration = mongoose.mongooseIntegration;
exports.mysqlIntegration = mysql.mysqlIntegration;
exports.mysql2Integration = mysql2.mysql2Integration;
exports.redisIntegration = redis.redisIntegration;
exports.postgresIntegration = postgres.postgresIntegration;
exports.postgresJsIntegration = postgresjs.postgresJsIntegration;
exports.prismaIntegration = prisma.prismaIntegration;
exports.hapiIntegration = index$1.hapiIntegration;
exports.setupHapiErrorHandler = index$1.setupHapiErrorHandler;
exports.koaIntegration = koa.koaIntegration;
exports.setupKoaErrorHandler = koa.setupKoaErrorHandler;
exports.connectIntegration = connect.connectIntegration;
exports.setupConnectErrorHandler = connect.setupConnectErrorHandler;
exports.knexIntegration = knex.knexIntegration;
exports.tediousIntegration = tedious.tediousIntegration;
exports.genericPoolIntegration = genericPool.genericPoolIntegration;
exports.dataloaderIntegration = dataloader.dataloaderIntegration;
exports.amqplibIntegration = amqplib.amqplibIntegration;
exports.vercelAIIntegration = index$2.vercelAIIntegration;
exports.openAIIntegration = index$3.openAIIntegration;
exports.buildLaunchDarklyFlagUsedHandler = launchDarkly.buildLaunchDarklyFlagUsedHandlerShim;
exports.launchDarklyIntegration = launchDarkly.launchDarklyIntegrationShim;
exports.OpenFeatureIntegrationHook = openFeature.OpenFeatureIntegrationHookShim;
exports.openFeatureIntegration = openFeature.openFeatureIntegrationShim;
exports.statsigIntegration = statsig.statsigIntegrationShim;
exports.unleashIntegration = unleash.unleashIntegrationShim;
exports.firebaseIntegration = firebase.firebaseIntegration;
exports.getDefaultIntegrations = index$4.getDefaultIntegrations;
exports.getDefaultIntegrationsWithoutPerformance = index$4.getDefaultIntegrationsWithoutPerformance;
exports.init = index$4.init;
exports.initWithoutDefaultIntegrations = index$4.initWithoutDefaultIntegrations;
exports.initOpenTelemetry = initOtel.initOpenTelemetry;
exports.preloadOpenTelemetry = initOtel.preloadOpenTelemetry;
exports.getAutoPerformanceIntegrations = index$5.getAutoPerformanceIntegrations;
exports.setNodeAsyncContextStrategy = opentelemetry.setOpenTelemetryContextAsyncContextStrategy;
exports.SDK_VERSION = core.SDK_VERSION;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = core.SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = core.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.Scope = core.Scope;
exports.addBreadcrumb = core.addBreadcrumb;
exports.addEventProcessor = core.addEventProcessor;
exports.addIntegration = core.addIntegration;
exports.captureCheckIn = core.captureCheckIn;
exports.captureConsoleIntegration = core.captureConsoleIntegration;
exports.captureEvent = core.captureEvent;
exports.captureException = core.captureException;
exports.captureFeedback = core.captureFeedback;
exports.captureMessage = core.captureMessage;
exports.captureSession = core.captureSession;
exports.close = core.close;
exports.consoleIntegration = core.consoleIntegration;
exports.consoleLoggingIntegration = core.consoleLoggingIntegration;
exports.continueTrace = core.continueTrace;
exports.createTransport = core.createTransport;
exports.dedupeIntegration = core.dedupeIntegration;
exports.endSession = core.endSession;
exports.eventFiltersIntegration = core.eventFiltersIntegration;
exports.extraErrorDataIntegration = core.extraErrorDataIntegration;
exports.featureFlagsIntegration = core.featureFlagsIntegration;
exports.flush = core.flush;
exports.functionToStringIntegration = core.functionToStringIntegration;
exports.getActiveSpan = core.getActiveSpan;
exports.getClient = core.getClient;
exports.getCurrentScope = core.getCurrentScope;
exports.getGlobalScope = core.getGlobalScope;
exports.getIsolationScope = core.getIsolationScope;
exports.getRootSpan = core.getRootSpan;
exports.getSpanDescendants = core.getSpanDescendants;
exports.getSpanStatusFromHttpCode = core.getSpanStatusFromHttpCode;
exports.getTraceData = core.getTraceData;
exports.getTraceMetaTags = core.getTraceMetaTags;
exports.inboundFiltersIntegration = core.inboundFiltersIntegration;
exports.instrumentSupabaseClient = core.instrumentSupabaseClient;
exports.isEnabled = core.isEnabled;
exports.isInitialized = core.isInitialized;
exports.lastEventId = core.lastEventId;
exports.linkedErrorsIntegration = core.linkedErrorsIntegration;
exports.parameterize = core.parameterize;
exports.profiler = core.profiler;
exports.requestDataIntegration = core.requestDataIntegration;
exports.rewriteFramesIntegration = core.rewriteFramesIntegration;
exports.setContext = core.setContext;
exports.setCurrentClient = core.setCurrentClient;
exports.setExtra = core.setExtra;
exports.setExtras = core.setExtras;
exports.setHttpStatus = core.setHttpStatus;
exports.setMeasurement = core.setMeasurement;
exports.setTag = core.setTag;
exports.setTags = core.setTags;
exports.setUser = core.setUser;
exports.spanToBaggageHeader = core.spanToBaggageHeader;
exports.spanToJSON = core.spanToJSON;
exports.spanToTraceHeader = core.spanToTraceHeader;
exports.startInactiveSpan = core.startInactiveSpan;
exports.startNewTrace = core.startNewTrace;
exports.startSession = core.startSession;
exports.startSpan = core.startSpan;
exports.startSpanManual = core.startSpanManual;
exports.supabaseIntegration = core.supabaseIntegration;
exports.suppressTracing = core.suppressTracing;
exports.trpcMiddleware = core.trpcMiddleware;
exports.updateSpanName = core.updateSpanName;
exports.withActiveSpan = core.withActiveSpan;
exports.withIsolationScope = core.withIsolationScope;
exports.withMonitor = core.withMonitor;
exports.withScope = core.withScope;
exports.wrapMcpServerWithSentry = core.wrapMcpServerWithSentry;
exports.zodErrorsIntegration = core.zodErrorsIntegration;
exports.NODE_VERSION = nodeCore.NODE_VERSION;
exports.NodeClient = nodeCore.NodeClient;
exports.SentryContextManager = nodeCore.SentryContextManager;
exports.anrIntegration = nodeCore.anrIntegration;
exports.childProcessIntegration = nodeCore.childProcessIntegration;
exports.contextLinesIntegration = nodeCore.contextLinesIntegration;
exports.createGetModuleFromFilename = nodeCore.createGetModuleFromFilename;
exports.createSentryWinstonTransport = nodeCore.createSentryWinstonTransport;
exports.cron = nodeCore.cron;
exports.defaultStackParser = nodeCore.defaultStackParser;
exports.disableAnrDetectionForCallback = nodeCore.disableAnrDetectionForCallback;
exports.generateInstrumentOnce = nodeCore.generateInstrumentOnce;
exports.getSentryRelease = nodeCore.getSentryRelease;
exports.localVariablesIntegration = nodeCore.localVariablesIntegration;
exports.logger = nodeCore.logger;
exports.makeNodeTransport = nodeCore.makeNodeTransport;
exports.modulesIntegration = nodeCore.modulesIntegration;
exports.nodeContextIntegration = nodeCore.nodeContextIntegration;
exports.onUncaughtExceptionIntegration = nodeCore.onUncaughtExceptionIntegration;
exports.onUnhandledRejectionIntegration = nodeCore.onUnhandledRejectionIntegration;
exports.spotlightIntegration = nodeCore.spotlightIntegration;
exports.systemErrorIntegration = nodeCore.systemErrorIntegration;
exports.validateOpenTelemetrySetup = nodeCore.validateOpenTelemetrySetup; //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=c681c_%40sentry_node_build_cjs_6e116787._.js.map