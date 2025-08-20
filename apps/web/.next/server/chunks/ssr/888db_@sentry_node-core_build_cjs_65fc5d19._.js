module.exports = [
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/logs/capture.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const util = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Capture a log with the given level.
 *
 * @param level - The level of the log.
 * @param message - The message to log.
 * @param attributes - Arbitrary structured data that stores information about the log - e.g., userId: 100.
 */ function captureLog(level, ...args) {
    const [messageOrMessageTemplate, paramsOrAttributes, maybeAttributes] = args;
    if (Array.isArray(paramsOrAttributes)) {
        const attributes = {
            ...maybeAttributes
        };
        attributes['sentry.message.template'] = messageOrMessageTemplate;
        paramsOrAttributes.forEach((param, index)=>{
            attributes[`sentry.message.parameter.${index}`] = param;
        });
        const message = util.format(messageOrMessageTemplate, ...paramsOrAttributes);
        core._INTERNAL_captureLog({
            level,
            message,
            attributes
        });
    } else {
        core._INTERNAL_captureLog({
            level,
            message: messageOrMessageTemplate,
            attributes: paramsOrAttributes
        });
    }
}
exports.captureLog = captureLog; //# sourceMappingURL=capture.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/logs/exports.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const capture = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/logs/capture.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * @summary Capture a log with the `trace` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.trace('Starting database connection', {
 *   database: 'users',
 *   connectionId: 'conn_123'
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.trace('Database connection %s established for %s',
 *   ['successful', 'users'],
 *   { connectionId: 'conn_123' }
 * );
 * ```
 */ function trace(...args) {
    capture.captureLog('trace', ...args);
}
/**
 * @summary Capture a log with the `debug` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.debug('Cache miss for user profile', {
 *   userId: 'user_123',
 *   cacheKey: 'profile:user_123'
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.debug('Cache %s for %s: %s',
 *   ['miss', 'user profile', 'key not found'],
 *   { userId: 'user_123' }
 * );
 * ```
 */ function debug(...args) {
    capture.captureLog('debug', ...args);
}
/**
 * @summary Capture a log with the `info` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.info('User profile updated', {
 *   userId: 'user_123',
 *   updatedFields: ['email', 'preferences']
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.info('User %s updated their %s',
 *   ['John Doe', 'profile settings'],
 *   { userId: 'user_123' }
 * );
 * ```
 */ function info(...args) {
    capture.captureLog('info', ...args);
}
/**
 * @summary Capture a log with the `warn` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.warn('Rate limit approaching', {
 *   endpoint: '/api/users',
 *   currentRate: '95/100',
 *   resetTime: '2024-03-20T10:00:00Z'
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.warn('Rate limit %s for %s: %s',
 *   ['approaching', '/api/users', '95/100 requests'],
 *   { resetTime: '2024-03-20T10:00:00Z' }
 * );
 * ```
 */ function warn(...args) {
    capture.captureLog('warn', ...args);
}
/**
 * @summary Capture a log with the `error` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.error('Failed to process payment', {
 *   orderId: 'order_123',
 *   errorCode: 'PAYMENT_FAILED',
 *   amount: 99.99
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.error('Payment processing failed for order %s: %s',
 *   ['order_123', 'insufficient funds'],
 *   { amount: 99.99 }
 * );
 * ```
 */ function error(...args) {
    capture.captureLog('error', ...args);
}
/**
 * @summary Capture a log with the `fatal` level. Requires the `enableLogs` option to be enabled.
 *
 * You can either pass a message and attributes or a message template, params and attributes.
 *
 * @example
 *
 * ```
 * Sentry.logger.fatal('Database connection pool exhausted', {
 *   database: 'users',
 *   activeConnections: 100,
 *   maxConnections: 100
 * });
 * ```
 *
 * @example With template strings
 *
 * ```
 * Sentry.logger.fatal('Database %s: %s connections active',
 *   ['connection pool exhausted', '100/100'],
 *   { database: 'users' }
 * );
 * ```
 */ function fatal(...args) {
    capture.captureLog('fatal', ...args);
}
exports.fmt = core.fmt;
exports.debug = debug;
exports.error = error;
exports.fatal = fatal;
exports.info = info;
exports.trace = trace;
exports.warn = warn; //# sourceMappingURL=exports.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/instrument.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
/** Exported only for tests. */ const INSTRUMENTED = {};
/**
 * Instrument an OpenTelemetry instrumentation once.
 * This will skip running instrumentation again if it was already instrumented.
 */ function generateInstrumentOnce(name, // eslint-disable-next-line @typescript-eslint/no-explicit-any
creatorOrClass, optionsCallback) {
    if (optionsCallback) {
        return _generateInstrumentOnceWithOptions(name, creatorOrClass, optionsCallback);
    }
    return _generateInstrumentOnce(name, creatorOrClass);
}
// The plain version without handling of options
// Should not be used with custom options that are mutated in the creator!
function _generateInstrumentOnce(name, creator) {
    return Object.assign((options)=>{
        const instrumented = INSTRUMENTED[name];
        if (instrumented) {
            // If options are provided, ensure we update them
            if (options) {
                instrumented.setConfig(options);
            }
            return instrumented;
        }
        const instrumentation$1 = creator(options);
        INSTRUMENTED[name] = instrumentation$1;
        instrumentation.registerInstrumentations({
            instrumentations: [
                instrumentation$1
            ]
        });
        return instrumentation$1;
    }, {
        id: name
    });
}
// This version handles options properly
function _generateInstrumentOnceWithOptions(name, instrumentationClass, optionsCallback) {
    return Object.assign((_options)=>{
        const options = optionsCallback(_options);
        const instrumented = INSTRUMENTED[name];
        if (instrumented) {
            // Ensure we update options
            instrumented.setConfig(options);
            return instrumented;
        }
        const instrumentation$1 = new instrumentationClass(options);
        INSTRUMENTED[name] = instrumentation$1;
        instrumentation.registerInstrumentations({
            instrumentations: [
                instrumentation$1
            ]
        });
        return instrumentation$1;
    }, {
        id: name
    });
}
/**
 * Ensure a given callback is called when the instrumentation is actually wrapping something.
 * This can be used to ensure some logic is only called when the instrumentation is actually active.
 *
 * This function returns a function that can be invoked with a callback.
 * This callback will either be invoked immediately
 * (e.g. if the instrumentation was already wrapped, or if _wrap could not be patched),
 * or once the instrumentation is actually wrapping something.
 *
 * Make sure to call this function right after adding the instrumentation, otherwise it may be too late!
 * The returned callback can be used any time, and also multiple times.
 */ function instrumentWhenWrapped(instrumentation) {
    let isWrapped = false;
    let callbacks = [];
    if (!hasWrap(instrumentation)) {
        isWrapped = true;
    } else {
        const originalWrap = instrumentation['_wrap'];
        instrumentation['_wrap'] = (...args)=>{
            isWrapped = true;
            callbacks.forEach((callback)=>callback());
            callbacks = [];
            return originalWrap(...args);
        };
    }
    const registerCallback = (callback)=>{
        if (isWrapped) {
            callback();
        } else {
            callbacks.push(callback);
        }
    };
    return registerCallback;
}
function hasWrap(instrumentation) {
    return typeof instrumentation['_wrap'] === 'function';
}
exports.INSTRUMENTED = INSTRUMENTED;
exports.generateInstrumentOnce = generateInstrumentOnce;
exports.instrumentWhenWrapped = instrumentWhenWrapped; //# sourceMappingURL=instrument.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/getRequestUrl.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/** Build a full URL from request options. */ function getRequestUrl(requestOptions) {
    const protocol = requestOptions.protocol || '';
    const hostname = requestOptions.hostname || requestOptions.host || '';
    // Don't log standard :80 (http) and :443 (https) ports to reduce the noise
    // Also don't add port if the hostname already includes a port
    const port = !requestOptions.port || requestOptions.port === 80 || requestOptions.port === 443 || /^(.*):(\d+)$/.test(hostname) ? '' : `:${requestOptions.port}`;
    const path = requestOptions.path ? requestOptions.path : '/';
    return `${protocol}//${hostname}${port}${path}`;
}
exports.getRequestUrl = getRequestUrl; //# sourceMappingURL=getRequestUrl.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const INSTRUMENTATION_NAME = '@sentry/instrumentation-http';
/** We only want to capture request bodies up to 1mb. */ const MAX_BODY_BYTE_LENGTH = 1024 * 1024;
exports.INSTRUMENTATION_NAME = INSTRUMENTATION_NAME;
exports.MAX_BODY_BYTE_LENGTH = MAX_BODY_BYTE_LENGTH; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/incoming-requests.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/constants.js [app-ssr] (ecmascript)");
const clientToRequestSessionAggregatesMap = new Map();
/**
 * Instrument a server to capture incoming requests.
 *
 */ function instrumentServer(server, { ignoreIncomingRequestBody, maxIncomingRequestBodySize = 'medium', trackIncomingRequestsAsSessions = true, sessionFlushingDelayMS }) {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalEmit = server.emit;
    // This means it was already patched, do nothing
    if (originalEmit.__sentry_patched__) {
        return;
    }
    const newEmit = new Proxy(originalEmit, {
        apply (target, thisArg, args) {
            // Only traces request events
            if (args[0] !== 'request') {
                return target.apply(thisArg, args);
            }
            debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, 'Handling incoming request');
            const isolationScope = core.getIsolationScope().clone();
            const request = args[1];
            const response = args[2];
            const normalizedRequest = core.httpRequestToRequestData(request);
            // request.ip is non-standard but some frameworks set this
            const ipAddress = request.ip || request.socket?.remoteAddress;
            const url = request.url || '/';
            if (!ignoreIncomingRequestBody?.(url, request) && maxIncomingRequestBodySize !== 'none') {
                patchRequestToCaptureBody(request, isolationScope, maxIncomingRequestBodySize);
            }
            // Update the isolation scope, isolate this request
            isolationScope.setSDKProcessingMetadata({
                normalizedRequest,
                ipAddress
            });
            // attempt to update the scope's `transactionName` based on the request URL
            // Ideally, framework instrumentations coming after the HttpInstrumentation
            // update the transactionName once we get a parameterized route.
            const httpMethod = (request.method || 'GET').toUpperCase();
            const httpTarget = core.stripUrlQueryAndFragment(url);
            const bestEffortTransactionName = `${httpMethod} ${httpTarget}`;
            isolationScope.setTransactionName(bestEffortTransactionName);
            if (trackIncomingRequestsAsSessions !== false) {
                recordRequestSession({
                    requestIsolationScope: isolationScope,
                    response,
                    sessionFlushingDelayMS: sessionFlushingDelayMS ?? 60000
                });
            }
            return core.withIsolationScope(isolationScope, ()=>{
                // Set a new propagationSpanId for this request
                // We rely on the fact that `withIsolationScope()` will implicitly also fork the current scope
                // This way we can save an "unnecessary" `withScope()` invocation
                core.getCurrentScope().getPropagationContext().propagationSpanId = core.generateSpanId();
                const ctx = api.propagation.extract(api.context.active(), normalizedRequest.headers);
                return api.context.with(ctx, ()=>{
                    return target.apply(thisArg, args);
                });
            });
        }
    });
    core.addNonEnumerableProperty(newEmit, '__sentry_patched__', true);
    server.emit = newEmit;
}
/**
 * Starts a session and tracks it in the context of a given isolation scope.
 * When the passed response is finished, the session is put into a task and is
 * aggregated with other sessions that may happen in a certain time window
 * (sessionFlushingDelayMs).
 *
 * The sessions are always aggregated by the client that is on the current scope
 * at the time of ending the response (if there is one).
 */ // Exported for unit tests
function recordRequestSession({ requestIsolationScope, response, sessionFlushingDelayMS }) {
    requestIsolationScope.setSDKProcessingMetadata({
        requestSession: {
            status: 'ok'
        }
    });
    response.once('close', ()=>{
        // We need to grab the client off the current scope instead of the isolation scope because the isolation scope doesn't hold any client out of the box.
        const client = core.getClient();
        const requestSession = requestIsolationScope.getScopeData().sdkProcessingMetadata.requestSession;
        if (client && requestSession) {
            debugBuild.DEBUG_BUILD && core.debug.log(`Recorded request session with status: ${requestSession.status}`);
            const roundedDate = new Date();
            roundedDate.setSeconds(0, 0);
            const dateBucketKey = roundedDate.toISOString();
            const existingClientAggregate = clientToRequestSessionAggregatesMap.get(client);
            const bucket = existingClientAggregate?.[dateBucketKey] || {
                exited: 0,
                crashed: 0,
                errored: 0
            };
            bucket[({
                ok: 'exited',
                crashed: 'crashed',
                errored: 'errored'
            })[requestSession.status]]++;
            if (existingClientAggregate) {
                existingClientAggregate[dateBucketKey] = bucket;
            } else {
                debugBuild.DEBUG_BUILD && core.debug.log('Opened new request session aggregate.');
                const newClientAggregate = {
                    [dateBucketKey]: bucket
                };
                clientToRequestSessionAggregatesMap.set(client, newClientAggregate);
                const flushPendingClientAggregates = ()=>{
                    clearTimeout(timeout);
                    unregisterClientFlushHook();
                    clientToRequestSessionAggregatesMap.delete(client);
                    const aggregatePayload = Object.entries(newClientAggregate).map(([timestamp, value])=>({
                            started: timestamp,
                            exited: value.exited,
                            errored: value.errored,
                            crashed: value.crashed
                        }));
                    client.sendSession({
                        aggregates: aggregatePayload
                    });
                };
                const unregisterClientFlushHook = client.on('flush', ()=>{
                    debugBuild.DEBUG_BUILD && core.debug.log('Sending request session aggregate due to client flush');
                    flushPendingClientAggregates();
                });
                const timeout = setTimeout(()=>{
                    debugBuild.DEBUG_BUILD && core.debug.log('Sending request session aggregate due to flushing schedule');
                    flushPendingClientAggregates();
                }, sessionFlushingDelayMS).unref();
            }
        }
    });
}
/**
 * This method patches the request object to capture the body.
 * Instead of actually consuming the streamed body ourselves, which has potential side effects,
 * we monkey patch `req.on('data')` to intercept the body chunks.
 * This way, we only read the body if the user also consumes the body, ensuring we do not change any behavior in unexpected ways.
 */ function patchRequestToCaptureBody(req, isolationScope, maxIncomingRequestBodySize) {
    let bodyByteLength = 0;
    const chunks = [];
    debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, 'Patching request.on');
    /**
   * We need to keep track of the original callbacks, in order to be able to remove listeners again.
   * Since `off` depends on having the exact same function reference passed in, we need to be able to map
   * original listeners to our wrapped ones.
   */ const callbackMap = new WeakMap();
    const maxBodySize = maxIncomingRequestBodySize === 'small' ? 1000 : maxIncomingRequestBodySize === 'medium' ? 10000 : constants.MAX_BODY_BYTE_LENGTH;
    try {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        req.on = new Proxy(req.on, {
            apply: (target, thisArg, args)=>{
                const [event, listener, ...restArgs] = args;
                if (event === 'data') {
                    debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, `Handling request.on("data") with maximum body size of ${maxBodySize}b`);
                    const callback = new Proxy(listener, {
                        apply: (target, thisArg, args)=>{
                            try {
                                const chunk = args[0];
                                const bufferifiedChunk = Buffer.from(chunk);
                                if (bodyByteLength < maxBodySize) {
                                    chunks.push(bufferifiedChunk);
                                    bodyByteLength += bufferifiedChunk.byteLength;
                                } else if (debugBuild.DEBUG_BUILD) {
                                    core.debug.log(constants.INSTRUMENTATION_NAME, `Dropping request body chunk because maximum body length of ${maxBodySize}b is exceeded.`);
                                }
                            } catch (err) {
                                debugBuild.DEBUG_BUILD && core.debug.error(constants.INSTRUMENTATION_NAME, 'Encountered error while storing body chunk.');
                            }
                            return Reflect.apply(target, thisArg, args);
                        }
                    });
                    callbackMap.set(listener, callback);
                    return Reflect.apply(target, thisArg, [
                        event,
                        callback,
                        ...restArgs
                    ]);
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        // Ensure we also remove callbacks correctly
        // eslint-disable-next-line @typescript-eslint/unbound-method
        req.off = new Proxy(req.off, {
            apply: (target, thisArg, args)=>{
                const [, listener] = args;
                const callback = callbackMap.get(listener);
                if (callback) {
                    callbackMap.delete(listener);
                    const modifiedArgs = args.slice();
                    modifiedArgs[1] = callback;
                    return Reflect.apply(target, thisArg, modifiedArgs);
                }
                return Reflect.apply(target, thisArg, args);
            }
        });
        req.on('end', ()=>{
            try {
                const body = Buffer.concat(chunks).toString('utf-8');
                if (body) {
                    // Using Buffer.byteLength here, because the body may contain characters that are not 1 byte long
                    const bodyByteLength = Buffer.byteLength(body, 'utf-8');
                    const truncatedBody = bodyByteLength > maxBodySize ? `${Buffer.from(body).subarray(0, maxBodySize - 3).toString('utf-8')}...` : body;
                    isolationScope.setSDKProcessingMetadata({
                        normalizedRequest: {
                            data: truncatedBody
                        }
                    });
                }
            } catch (error) {
                if (debugBuild.DEBUG_BUILD) {
                    core.debug.error(constants.INSTRUMENTATION_NAME, 'Error building captured request body', error);
                }
            }
        });
    } catch (error) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.error(constants.INSTRUMENTATION_NAME, 'Error patching request to capture body', error);
        }
    }
}
exports.instrumentServer = instrumentServer;
exports.recordRequestSession = recordRequestSession; //# sourceMappingURL=incoming-requests.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Merge two baggage headers into one, where the existing one takes precedence.
 * The order of the existing baggage will be preserved, and new entries will be added to the end.
 */ function mergeBaggageHeaders(existing, baggage) {
    if (!existing) {
        return baggage;
    }
    const existingBaggageEntries = core.parseBaggageHeader(existing);
    const newBaggageEntries = core.parseBaggageHeader(baggage);
    if (!newBaggageEntries) {
        return existing;
    }
    // Existing entries take precedence, ensuring order remains stable for minimal changes
    const mergedBaggageEntries = {
        ...existingBaggageEntries
    };
    Object.entries(newBaggageEntries).forEach(([key, value])=>{
        if (!mergedBaggageEntries[key]) {
            mergedBaggageEntries[key] = value;
        }
    });
    return core.objectToBaggageHeader(mergedBaggageEntries);
}
exports.mergeBaggageHeaders = mergeBaggageHeaders; //# sourceMappingURL=baggage.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/outgoing-requests.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/constants.js [app-ssr] (ecmascript)");
/** Add a breadcrumb for outgoing requests. */ function addRequestBreadcrumb(request, response) {
    const data = getBreadcrumbData(request);
    const statusCode = response?.statusCode;
    const level = core.getBreadcrumbLogLevelFromHttpStatusCode(statusCode);
    core.addBreadcrumb({
        category: 'http',
        data: {
            status_code: statusCode,
            ...data
        },
        type: 'http',
        level
    }, {
        event: 'response',
        request,
        response
    });
}
/**
 * Add trace propagation headers to an outgoing request.
 * This must be called _before_ the request is sent!
 */ function addTracePropagationHeadersToOutgoingRequest(request, propagationDecisionMap) {
    const url = getRequestUrl(request);
    // Manually add the trace headers, if it applies
    // Note: We do not use `propagation.inject()` here, because our propagator relies on an active span
    // Which we do not have in this case
    const tracePropagationTargets = core.getClient()?.getOptions().tracePropagationTargets;
    const headersToAdd = opentelemetry.shouldPropagateTraceForUrl(url, tracePropagationTargets, propagationDecisionMap) ? core.getTraceData() : undefined;
    if (!headersToAdd) {
        return;
    }
    const { 'sentry-trace': sentryTrace, baggage: baggage$1 } = headersToAdd;
    // We do not want to overwrite existing header here, if it was already set
    if (sentryTrace && !request.getHeader('sentry-trace')) {
        try {
            request.setHeader('sentry-trace', sentryTrace);
            debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, 'Added sentry-trace header to outgoing request');
        } catch (error) {
            debugBuild.DEBUG_BUILD && core.debug.error(constants.INSTRUMENTATION_NAME, 'Failed to add sentry-trace header to outgoing request:', core.isError(error) ? error.message : 'Unknown error');
        }
    }
    if (baggage$1) {
        // For baggage, we make sure to merge this into a possibly existing header
        const newBaggage = baggage.mergeBaggageHeaders(request.getHeader('baggage'), baggage$1);
        if (newBaggage) {
            try {
                request.setHeader('baggage', newBaggage);
                debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, 'Added baggage header to outgoing request');
            } catch (error) {
                debugBuild.DEBUG_BUILD && core.debug.error(constants.INSTRUMENTATION_NAME, 'Failed to add baggage header to outgoing request:', core.isError(error) ? error.message : 'Unknown error');
            }
        }
    }
}
function getBreadcrumbData(request) {
    try {
        // `request.host` does not contain the port, but the host header does
        const host = request.getHeader('host') || request.host;
        const url = new URL(request.path, `${request.protocol}//${host}`);
        const parsedUrl = core.parseUrl(url.toString());
        const data = {
            url: core.getSanitizedUrlString(parsedUrl),
            'http.method': request.method || 'GET'
        };
        if (parsedUrl.search) {
            data['http.query'] = parsedUrl.search;
        }
        if (parsedUrl.hash) {
            data['http.fragment'] = parsedUrl.hash;
        }
        return data;
    } catch  {
        return {};
    }
}
/** Convert an outgoing request to request options. */ function getRequestOptions(request) {
    return {
        method: request.method,
        protocol: request.protocol,
        host: request.host,
        hostname: request.host,
        path: request.path,
        headers: request.getHeaders()
    };
}
function getRequestUrl(request) {
    const hostname = request.getHeader('host') || request.host;
    const protocol = request.protocol;
    const path = request.path;
    return `${protocol}//${hostname}${path}`;
}
exports.addRequestBreadcrumb = addRequestBreadcrumb;
exports.addTracePropagationHeadersToOutgoingRequest = addTracePropagationHeadersToOutgoingRequest;
exports.getRequestOptions = getRequestOptions; //# sourceMappingURL=outgoing-requests.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/SentryHttpInstrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const diagnosticsChannel = __turbopack_context__.r("[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+core@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/core/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const getRequestUrl = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/getRequestUrl.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/constants.js [app-ssr] (ecmascript)");
const incomingRequests = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/incoming-requests.js [app-ssr] (ecmascript)");
const outgoingRequests = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/outgoing-requests.js [app-ssr] (ecmascript)");
/**
 * This custom HTTP instrumentation is used to isolate incoming requests and annotate them with additional information.
 * It does not emit any spans.
 *
 * The reason this is isolated from the OpenTelemetry instrumentation is that users may overwrite this,
 * which would lead to Sentry not working as expected.
 *
 * Important note: Contrary to other OTEL instrumentation, this one cannot be unwrapped.
 * It only does minimal things though and does not emit any spans.
 *
 * This is heavily inspired & adapted from:
 * https://github.com/open-telemetry/opentelemetry-js/blob/f8ab5592ddea5cba0a3b33bf8d74f27872c0367f/experimental/packages/opentelemetry-instrumentation-http/src/http.ts
 */ class SentryHttpInstrumentation extends instrumentation.InstrumentationBase {
    constructor(config = {}){
        super(constants.INSTRUMENTATION_NAME, core.SDK_VERSION, config);
        this._propagationDecisionMap = new core.LRUMap(100);
        this._ignoreOutgoingRequestsMap = new WeakMap();
    }
    /** @inheritdoc */ init() {
        // We register handlers when either http or https is instrumented
        // but we only want to register them once, whichever is loaded first
        let hasRegisteredHandlers = false;
        const onHttpServerRequestStart = (_data)=>{
            const data = _data;
            incomingRequests.instrumentServer(data.server, {
                ignoreIncomingRequestBody: this.getConfig().ignoreIncomingRequestBody,
                maxIncomingRequestBodySize: this.getConfig().maxIncomingRequestBodySize,
                trackIncomingRequestsAsSessions: this.getConfig().trackIncomingRequestsAsSessions,
                sessionFlushingDelayMS: this.getConfig().sessionFlushingDelayMS ?? 60000
            });
        };
        const onHttpClientResponseFinish = (_data)=>{
            const data = _data;
            this._onOutgoingRequestFinish(data.request, data.response);
        };
        const onHttpClientRequestError = (_data)=>{
            const data = _data;
            this._onOutgoingRequestFinish(data.request, undefined);
        };
        const onHttpClientRequestCreated = (_data)=>{
            const data = _data;
            this._onOutgoingRequestCreated(data.request);
        };
        const wrap = (moduleExports)=>{
            if (hasRegisteredHandlers) {
                return moduleExports;
            }
            hasRegisteredHandlers = true;
            diagnosticsChannel.subscribe('http.server.request.start', onHttpServerRequestStart);
            diagnosticsChannel.subscribe('http.client.response.finish', onHttpClientResponseFinish);
            // When an error happens, we still want to have a breadcrumb
            // In this case, `http.client.response.finish` is not triggered
            diagnosticsChannel.subscribe('http.client.request.error', onHttpClientRequestError);
            // NOTE: This channel only exist since Node 22
            // Before that, outgoing requests are not patched
            // and trace headers are not propagated, sadly.
            if (this.getConfig().propagateTraceInOutgoingRequests) {
                diagnosticsChannel.subscribe('http.client.request.created', onHttpClientRequestCreated);
            }
            return moduleExports;
        };
        const unwrap = ()=>{
            diagnosticsChannel.unsubscribe('http.server.request.start', onHttpServerRequestStart);
            diagnosticsChannel.unsubscribe('http.client.response.finish', onHttpClientResponseFinish);
            diagnosticsChannel.unsubscribe('http.client.request.error', onHttpClientRequestError);
            diagnosticsChannel.unsubscribe('http.client.request.created', onHttpClientRequestCreated);
        };
        /**
     * You may be wondering why we register these diagnostics-channel listeners
     * in such a convoluted way (as InstrumentationNodeModuleDefinition...)˝,
     * instead of simply subscribing to the events once in here.
     * The reason for this is timing semantics: These functions are called once the http or https module is loaded.
     * If we'd subscribe before that, there seem to be conflicts with the OTEL native instrumentation in some scenarios,
     * especially the "import-on-top" pattern of setting up ESM applications.
     */ return [
            new instrumentation.InstrumentationNodeModuleDefinition('http', [
                '*'
            ], wrap, unwrap),
            new instrumentation.InstrumentationNodeModuleDefinition('https', [
                '*'
            ], wrap, unwrap)
        ];
    }
    /**
   * This is triggered when an outgoing request finishes.
   * It has access to the final request and response objects.
   */ _onOutgoingRequestFinish(request, response) {
        debugBuild.DEBUG_BUILD && core.debug.log(constants.INSTRUMENTATION_NAME, 'Handling finished outgoing request');
        const _breadcrumbs = this.getConfig().breadcrumbs;
        const breadCrumbsEnabled = typeof _breadcrumbs === 'undefined' ? true : _breadcrumbs;
        // Note: We cannot rely on the map being set by `_onOutgoingRequestCreated`, because that is not run in Node <22
        const shouldIgnore = this._ignoreOutgoingRequestsMap.get(request) ?? this._shouldIgnoreOutgoingRequest(request);
        this._ignoreOutgoingRequestsMap.set(request, shouldIgnore);
        if (breadCrumbsEnabled && !shouldIgnore) {
            outgoingRequests.addRequestBreadcrumb(request, response);
        }
    }
    /**
   * This is triggered when an outgoing request is created.
   * It has access to the request object, and can mutate it before the request is sent.
   */ _onOutgoingRequestCreated(request) {
        const shouldIgnore = this._ignoreOutgoingRequestsMap.get(request) ?? this._shouldIgnoreOutgoingRequest(request);
        this._ignoreOutgoingRequestsMap.set(request, shouldIgnore);
        if (shouldIgnore) {
            return;
        }
        outgoingRequests.addTracePropagationHeadersToOutgoingRequest(request, this._propagationDecisionMap);
    }
    /**
   * Check if the given outgoing request should be ignored.
   */ _shouldIgnoreOutgoingRequest(request) {
        if (core$1.isTracingSuppressed(api.context.active())) {
            return true;
        }
        const ignoreOutgoingRequests = this.getConfig().ignoreOutgoingRequests;
        if (!ignoreOutgoingRequests) {
            return false;
        }
        const options = outgoingRequests.getRequestOptions(request);
        const url = getRequestUrl.getRequestUrl(request);
        return ignoreOutgoingRequests(url, options);
    }
}
exports.SentryHttpInstrumentation = SentryHttpInstrumentation; //# sourceMappingURL=SentryHttpInstrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const instrument = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/instrument.js [app-ssr] (ecmascript)");
const SentryHttpInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/SentryHttpInstrumentation.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Http';
const instrumentSentryHttp = instrument.generateInstrumentOnce(`${INTEGRATION_NAME}.sentry`, (options)=>{
    return new SentryHttpInstrumentation.SentryHttpInstrumentation(options);
});
/**
 * The http integration instruments Node's internal http and https modules.
 * It creates breadcrumbs for outgoing HTTP requests which will be attached to the currently active span.
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
            instrumentSentryHttp({
                ...options,
                extractIncomingTraceFromHeader: true,
                propagateTraceInOutgoingRequests: true
            });
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
exports.httpIntegration = httpIntegration; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const NODE_VERSION = core.parseSemver(process.versions.node);
const NODE_MAJOR = NODE_VERSION.major;
const NODE_MINOR = NODE_VERSION.minor;
exports.NODE_MAJOR = NODE_MAJOR;
exports.NODE_MINOR = NODE_MINOR;
exports.NODE_VERSION = NODE_VERSION; //# sourceMappingURL=nodeVersion.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/SentryNodeFetchInstrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+core@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/core/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const diagch = __turbopack_context__.r("[externals]/diagnostics_channel [external] (diagnostics_channel, cjs)");
const nodeVersion = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const SENTRY_TRACE_HEADER = 'sentry-trace';
const SENTRY_BAGGAGE_HEADER = 'baggage';
// For baggage, we make sure to merge this into a possibly existing header
const BAGGAGE_HEADER_REGEX = /baggage: (.*)\r\n/;
/**
 * This custom node-fetch instrumentation is used to instrument outgoing fetch requests.
 * It does not emit any spans.
 *
 * The reason this is isolated from the OpenTelemetry instrumentation is that users may overwrite this,
 * which would lead to Sentry not working as expected.
 *
 * This is heavily inspired & adapted from:
 * https://github.com/open-telemetry/opentelemetry-js-contrib/blob/28e209a9da36bc4e1f8c2b0db7360170ed46cb80/plugins/node/instrumentation-undici/src/undici.ts
 */ class SentryNodeFetchInstrumentation extends instrumentation.InstrumentationBase {
    // Keep ref to avoid https://github.com/nodejs/node/issues/42170 bug and for
    // unsubscribing.
    constructor(config = {}){
        super('@sentry/instrumentation-node-fetch', core.SDK_VERSION, config);
        this._channelSubs = [];
        this._propagationDecisionMap = new core.LRUMap(100);
        this._ignoreOutgoingRequestsMap = new WeakMap();
    }
    /** No need to instrument files/modules. */ init() {
        return undefined;
    }
    /** Disable the instrumentation. */ disable() {
        super.disable();
        this._channelSubs.forEach((sub)=>sub.unsubscribe());
        this._channelSubs = [];
    }
    /** Enable the instrumentation. */ enable() {
        // "enabled" handling is currently a bit messy with InstrumentationBase.
        // If constructed with `{enabled: false}`, this `.enable()` is still called,
        // and `this.getConfig().enabled !== this.isEnabled()`, creating confusion.
        //
        // For now, this class will setup for instrumenting if `.enable()` is
        // called, but use `this.getConfig().enabled` to determine if
        // instrumentation should be generated. This covers the more likely common
        // case of config being given a construction time, rather than later via
        // `instance.enable()`, `.disable()`, or `.setConfig()` calls.
        super.enable();
        // This method is called by the super-class constructor before ours is
        // called. So we need to ensure the property is initalized.
        this._channelSubs = this._channelSubs || [];
        // Avoid to duplicate subscriptions
        if (this._channelSubs.length > 0) {
            return;
        }
        this._subscribeToChannel('undici:request:create', this._onRequestCreated.bind(this));
        this._subscribeToChannel('undici:request:headers', this._onResponseHeaders.bind(this));
    }
    /**
   * This method is called when a request is created.
   * You can still mutate the request here before it is sent.
   */ _onRequestCreated({ request }) {
        const config = this.getConfig();
        const enabled = config.enabled !== false;
        if (!enabled) {
            return;
        }
        const shouldIgnore = this._shouldIgnoreOutgoingRequest(request);
        // We store this decisision for later so we do not need to re-evaluate it
        // Additionally, the active context is not correct in _onResponseHeaders, so we need to make sure it is evaluated here
        this._ignoreOutgoingRequestsMap.set(request, shouldIgnore);
        if (shouldIgnore) {
            return;
        }
        const url = getAbsoluteUrl(request.origin, request.path);
        // Manually add the trace headers, if it applies
        // Note: We do not use `propagation.inject()` here, because our propagator relies on an active span
        // Which we do not have in this case
        // The propagator _may_ overwrite this, but this should be fine as it is the same data
        const tracePropagationTargets = core.getClient()?.getOptions().tracePropagationTargets;
        const addedHeaders = opentelemetry.shouldPropagateTraceForUrl(url, tracePropagationTargets, this._propagationDecisionMap) ? core.getTraceData() : undefined;
        if (!addedHeaders) {
            return;
        }
        const { 'sentry-trace': sentryTrace, baggage: baggage$1 } = addedHeaders;
        // We do not want to overwrite existing headers here
        // If the core UndiciInstrumentation is registered, it will already have set the headers
        // We do not want to add any then
        if (Array.isArray(request.headers)) {
            const requestHeaders = request.headers;
            // We do not want to overwrite existing header here, if it was already set
            if (sentryTrace && !requestHeaders.includes(SENTRY_TRACE_HEADER)) {
                requestHeaders.push(SENTRY_TRACE_HEADER, sentryTrace);
            }
            // For baggage, we make sure to merge this into a possibly existing header
            const existingBaggagePos = requestHeaders.findIndex((header)=>header === SENTRY_BAGGAGE_HEADER);
            if (baggage$1 && existingBaggagePos === -1) {
                requestHeaders.push(SENTRY_BAGGAGE_HEADER, baggage$1);
            } else if (baggage$1) {
                const existingBaggage = requestHeaders[existingBaggagePos + 1];
                const merged = baggage.mergeBaggageHeaders(existingBaggage, baggage$1);
                if (merged) {
                    requestHeaders[existingBaggagePos + 1] = merged;
                }
            }
        } else {
            const requestHeaders = request.headers;
            // We do not want to overwrite existing header here, if it was already set
            if (sentryTrace && !requestHeaders.includes(`${SENTRY_TRACE_HEADER}:`)) {
                request.headers += `${SENTRY_TRACE_HEADER}: ${sentryTrace}\r\n`;
            }
            const existingBaggage = request.headers.match(BAGGAGE_HEADER_REGEX)?.[1];
            if (baggage$1 && !existingBaggage) {
                request.headers += `${SENTRY_BAGGAGE_HEADER}: ${baggage$1}\r\n`;
            } else if (baggage$1) {
                const merged = baggage.mergeBaggageHeaders(existingBaggage, baggage$1);
                if (merged) {
                    request.headers = request.headers.replace(BAGGAGE_HEADER_REGEX, `baggage: ${merged}\r\n`);
                }
            }
        }
    }
    /**
   * This method is called when a response is received.
   */ _onResponseHeaders({ request, response }) {
        const config = this.getConfig();
        const enabled = config.enabled !== false;
        if (!enabled) {
            return;
        }
        const _breadcrumbs = config.breadcrumbs;
        const breadCrumbsEnabled = typeof _breadcrumbs === 'undefined' ? true : _breadcrumbs;
        const shouldIgnore = this._ignoreOutgoingRequestsMap.get(request);
        if (breadCrumbsEnabled && !shouldIgnore) {
            addRequestBreadcrumb(request, response);
        }
    }
    /** Subscribe to a diagnostics channel. */ _subscribeToChannel(diagnosticChannel, onMessage) {
        // `diagnostics_channel` had a ref counting bug until v18.19.0.
        // https://github.com/nodejs/node/pull/47520
        const useNewSubscribe = nodeVersion.NODE_MAJOR > 18 || nodeVersion.NODE_MAJOR === 18 && nodeVersion.NODE_MINOR >= 19;
        let unsubscribe;
        if (useNewSubscribe) {
            diagch.subscribe?.(diagnosticChannel, onMessage);
            unsubscribe = ()=>diagch.unsubscribe?.(diagnosticChannel, onMessage);
        } else {
            const channel = diagch.channel(diagnosticChannel);
            channel.subscribe(onMessage);
            unsubscribe = ()=>channel.unsubscribe(onMessage);
        }
        this._channelSubs.push({
            name: diagnosticChannel,
            unsubscribe
        });
    }
    /**
   * Check if the given outgoing request should be ignored.
   */ _shouldIgnoreOutgoingRequest(request) {
        if (core$1.isTracingSuppressed(api.context.active())) {
            return true;
        }
        // Add trace propagation headers
        const url = getAbsoluteUrl(request.origin, request.path);
        const ignoreOutgoingRequests = this.getConfig().ignoreOutgoingRequests;
        if (typeof ignoreOutgoingRequests !== 'function' || !url) {
            return false;
        }
        return ignoreOutgoingRequests(url);
    }
}
/** Add a breadcrumb for outgoing requests. */ function addRequestBreadcrumb(request, response) {
    const data = getBreadcrumbData(request);
    const statusCode = response.statusCode;
    const level = core.getBreadcrumbLogLevelFromHttpStatusCode(statusCode);
    core.addBreadcrumb({
        category: 'http',
        data: {
            status_code: statusCode,
            ...data
        },
        type: 'http',
        level
    }, {
        event: 'response',
        request,
        response
    });
}
function getBreadcrumbData(request) {
    try {
        const url = getAbsoluteUrl(request.origin, request.path);
        const parsedUrl = core.parseUrl(url);
        const data = {
            url: core.getSanitizedUrlString(parsedUrl),
            'http.method': request.method || 'GET'
        };
        if (parsedUrl.search) {
            data['http.query'] = parsedUrl.search;
        }
        if (parsedUrl.hash) {
            data['http.fragment'] = parsedUrl.hash;
        }
        return data;
    } catch  {
        return {};
    }
}
function getAbsoluteUrl(origin, path = '/') {
    try {
        const url = new URL(path, origin);
        return url.toString();
    } catch  {
        // fallback: Construct it on our own
        const url = `${origin}`;
        if (url.endsWith('/') && path.startsWith('/')) {
            return `${url}${path.slice(1)}`;
        }
        if (!url.endsWith('/') && !path.startsWith('/')) {
            return `${url}/${path.slice(1)}`;
        }
        return `${url}${path}`;
    }
}
exports.SentryNodeFetchInstrumentation = SentryNodeFetchInstrumentation; //# sourceMappingURL=SentryNodeFetchInstrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const instrument = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/instrument.js [app-ssr] (ecmascript)");
const SentryNodeFetchInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/SentryNodeFetchInstrumentation.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'NodeFetch';
const instrumentSentryNodeFetch = instrument.generateInstrumentOnce(`${INTEGRATION_NAME}.sentry`, SentryNodeFetchInstrumentation.SentryNodeFetchInstrumentation, (options)=>{
    return options;
});
const _nativeNodeFetchIntegration = (options = {})=>{
    return {
        name: 'NodeFetch',
        setupOnce () {
            instrumentSentryNodeFetch(options);
        }
    };
};
const nativeNodeFetchIntegration = core.defineIntegration(_nativeNodeFetchIntegration);
exports.nativeNodeFetchIntegration = nativeNodeFetchIntegration; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node_child_process = __turbopack_context__.r("[externals]/node:child_process [external] (node:child_process, cjs)");
const node_fs = __turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)");
const os = __turbopack_context__.r("[externals]/node:os [external] (node:os, cjs)");
const node_path = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
const util = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/* eslint-disable max-lines */ const readFileAsync = util.promisify(node_fs.readFile);
const readDirAsync = util.promisify(node_fs.readdir);
// Process enhanced with methods from Node 18, 20, 22 as @types/node
// is on `14.18.0` to match minimum version requirements of the SDK
const INTEGRATION_NAME = 'Context';
const _nodeContextIntegration = (options = {})=>{
    let cachedContext;
    const _options = {
        app: true,
        os: true,
        device: true,
        culture: true,
        cloudResource: true,
        ...options
    };
    /** Add contexts to the event. Caches the context so we only look it up once. */ async function addContext(event) {
        if (cachedContext === undefined) {
            cachedContext = _getContexts();
        }
        const updatedContext = _updateContext(await cachedContext);
        // TODO(v11): conditional with `sendDefaultPii` here?
        event.contexts = {
            ...event.contexts,
            app: {
                ...updatedContext.app,
                ...event.contexts?.app
            },
            os: {
                ...updatedContext.os,
                ...event.contexts?.os
            },
            device: {
                ...updatedContext.device,
                ...event.contexts?.device
            },
            culture: {
                ...updatedContext.culture,
                ...event.contexts?.culture
            },
            cloud_resource: {
                ...updatedContext.cloud_resource,
                ...event.contexts?.cloud_resource
            }
        };
        return event;
    }
    /** Get the contexts from node. */ async function _getContexts() {
        const contexts = {};
        if (_options.os) {
            contexts.os = await getOsContext();
        }
        if (_options.app) {
            contexts.app = getAppContext();
        }
        if (_options.device) {
            contexts.device = getDeviceContext(_options.device);
        }
        if (_options.culture) {
            const culture = getCultureContext();
            if (culture) {
                contexts.culture = culture;
            }
        }
        if (_options.cloudResource) {
            contexts.cloud_resource = getCloudResourceContext();
        }
        return contexts;
    }
    return {
        name: INTEGRATION_NAME,
        processEvent (event) {
            return addContext(event);
        }
    };
};
/**
 * Capture context about the environment and the device that the client is running on, to events.
 */ const nodeContextIntegration = core.defineIntegration(_nodeContextIntegration);
/**
 * Updates the context with dynamic values that can change
 */ function _updateContext(contexts) {
    // Only update properties if they exist
    if (contexts.app?.app_memory) {
        contexts.app.app_memory = process.memoryUsage().rss;
    }
    if (contexts.app?.free_memory && typeof process.availableMemory === 'function') {
        const freeMemory = process.availableMemory?.();
        if (freeMemory != null) {
            contexts.app.free_memory = freeMemory;
        }
    }
    if (contexts.device?.free_memory) {
        contexts.device.free_memory = os.freemem();
    }
    return contexts;
}
/**
 * Returns the operating system context.
 *
 * Based on the current platform, this uses a different strategy to provide the
 * most accurate OS information. Since this might involve spawning subprocesses
 * or accessing the file system, this should only be executed lazily and cached.
 *
 *  - On macOS (Darwin), this will execute the `sw_vers` utility. The context
 *    has a `name`, `version`, `build` and `kernel_version` set.
 *  - On Linux, this will try to load a distribution release from `/etc` and set
 *    the `name`, `version` and `kernel_version` fields.
 *  - On all other platforms, only a `name` and `version` will be returned. Note
 *    that `version` might actually be the kernel version.
 */ async function getOsContext() {
    const platformId = os.platform();
    switch(platformId){
        case 'darwin':
            return getDarwinInfo();
        case 'linux':
            return getLinuxInfo();
        default:
            return {
                name: PLATFORM_NAMES[platformId] || platformId,
                version: os.release()
            };
    }
}
function getCultureContext() {
    try {
        if (typeof process.versions.icu !== 'string') {
            // Node was built without ICU support
            return;
        }
        // Check that node was built with full Intl support. Its possible it was built without support for non-English
        // locales which will make resolvedOptions inaccurate
        //
        // https://nodejs.org/api/intl.html#detecting-internationalization-support
        const january = new Date(9e8);
        const spanish = new Intl.DateTimeFormat('es', {
            month: 'long'
        });
        if (spanish.format(january) === 'enero') {
            const options = Intl.DateTimeFormat().resolvedOptions();
            return {
                locale: options.locale,
                timezone: options.timeZone
            };
        }
    } catch  {
    //
    }
    return;
}
/**
 * Get app context information from process
 */ function getAppContext() {
    const app_memory = process.memoryUsage().rss;
    const app_start_time = new Date(Date.now() - process.uptime() * 1000).toISOString();
    // https://nodejs.org/api/process.html#processavailablememory
    const appContext = {
        app_start_time,
        app_memory
    };
    if (typeof process.availableMemory === 'function') {
        const freeMemory = process.availableMemory?.();
        if (freeMemory != null) {
            appContext.free_memory = freeMemory;
        }
    }
    return appContext;
}
/**
 * Gets device information from os
 */ function getDeviceContext(deviceOpt) {
    const device = {};
    // Sometimes os.uptime() throws due to lacking permissions: https://github.com/getsentry/sentry-javascript/issues/8202
    let uptime;
    try {
        uptime = os.uptime();
    } catch  {
    // noop
    }
    // os.uptime or its return value seem to be undefined in certain environments (e.g. Azure functions).
    // Hence, we only set boot time, if we get a valid uptime value.
    // @see https://github.com/getsentry/sentry-javascript/issues/5856
    if (typeof uptime === 'number') {
        device.boot_time = new Date(Date.now() - uptime * 1000).toISOString();
    }
    device.arch = os.arch();
    if (deviceOpt === true || deviceOpt.memory) {
        device.memory_size = os.totalmem();
        device.free_memory = os.freemem();
    }
    if (deviceOpt === true || deviceOpt.cpu) {
        const cpuInfo = os.cpus();
        const firstCpu = cpuInfo?.[0];
        if (firstCpu) {
            device.processor_count = cpuInfo.length;
            device.cpu_description = firstCpu.model;
            device.processor_frequency = firstCpu.speed;
        }
    }
    return device;
}
/** Mapping of Node's platform names to actual OS names. */ const PLATFORM_NAMES = {
    aix: 'IBM AIX',
    freebsd: 'FreeBSD',
    openbsd: 'OpenBSD',
    sunos: 'SunOS',
    win32: 'Windows'
};
/** Linux version file to check for a distribution. */ /** Mapping of linux release files located in /etc to distributions. */ const LINUX_DISTROS = [
    {
        name: 'fedora-release',
        distros: [
            'Fedora'
        ]
    },
    {
        name: 'redhat-release',
        distros: [
            'Red Hat Linux',
            'Centos'
        ]
    },
    {
        name: 'redhat_version',
        distros: [
            'Red Hat Linux'
        ]
    },
    {
        name: 'SuSE-release',
        distros: [
            'SUSE Linux'
        ]
    },
    {
        name: 'lsb-release',
        distros: [
            'Ubuntu Linux',
            'Arch Linux'
        ]
    },
    {
        name: 'debian_version',
        distros: [
            'Debian'
        ]
    },
    {
        name: 'debian_release',
        distros: [
            'Debian'
        ]
    },
    {
        name: 'arch-release',
        distros: [
            'Arch Linux'
        ]
    },
    {
        name: 'gentoo-release',
        distros: [
            'Gentoo Linux'
        ]
    },
    {
        name: 'novell-release',
        distros: [
            'SUSE Linux'
        ]
    },
    {
        name: 'alpine-release',
        distros: [
            'Alpine Linux'
        ]
    }
];
/** Functions to extract the OS version from Linux release files. */ const LINUX_VERSIONS = {
    alpine: (content)=>content,
    arch: (content)=>matchFirst(/distrib_release=(.*)/, content),
    centos: (content)=>matchFirst(/release ([^ ]+)/, content),
    debian: (content)=>content,
    fedora: (content)=>matchFirst(/release (..)/, content),
    mint: (content)=>matchFirst(/distrib_release=(.*)/, content),
    red: (content)=>matchFirst(/release ([^ ]+)/, content),
    suse: (content)=>matchFirst(/VERSION = (.*)\n/, content),
    ubuntu: (content)=>matchFirst(/distrib_release=(.*)/, content)
};
/**
 * Executes a regular expression with one capture group.
 *
 * @param regex A regular expression to execute.
 * @param text Content to execute the RegEx on.
 * @returns The captured string if matched; otherwise undefined.
 */ function matchFirst(regex, text) {
    const match = regex.exec(text);
    return match ? match[1] : undefined;
}
/** Loads the macOS operating system context. */ async function getDarwinInfo() {
    // Default values that will be used in case no operating system information
    // can be loaded. The default version is computed via heuristics from the
    // kernel version, but the build ID is missing.
    const darwinInfo = {
        kernel_version: os.release(),
        name: 'Mac OS X',
        version: `10.${Number(os.release().split('.')[0]) - 4}`
    };
    try {
        // We try to load the actual macOS version by executing the `sw_vers` tool.
        // This tool should be available on every standard macOS installation. In
        // case this fails, we stick with the values computed above.
        const output = await new Promise((resolve, reject)=>{
            node_child_process.execFile('/usr/bin/sw_vers', (error, stdout)=>{
                if (error) {
                    reject(error);
                    return;
                }
                resolve(stdout);
            });
        });
        darwinInfo.name = matchFirst(/^ProductName:\s+(.*)$/m, output);
        darwinInfo.version = matchFirst(/^ProductVersion:\s+(.*)$/m, output);
        darwinInfo.build = matchFirst(/^BuildVersion:\s+(.*)$/m, output);
    } catch  {
    // ignore
    }
    return darwinInfo;
}
/** Returns a distribution identifier to look up version callbacks. */ function getLinuxDistroId(name) {
    return name.split(' ')[0].toLowerCase();
}
/** Loads the Linux operating system context. */ async function getLinuxInfo() {
    // By default, we cannot assume anything about the distribution or Linux
    // version. `os.release()` returns the kernel version and we assume a generic
    // "Linux" name, which will be replaced down below.
    const linuxInfo = {
        kernel_version: os.release(),
        name: 'Linux'
    };
    try {
        // We start guessing the distribution by listing files in the /etc
        // directory. This is were most Linux distributions (except Knoppix) store
        // release files with certain distribution-dependent meta data. We search
        // for exactly one known file defined in `LINUX_DISTROS` and exit if none
        // are found. In case there are more than one file, we just stick with the
        // first one.
        const etcFiles = await readDirAsync('/etc');
        const distroFile = LINUX_DISTROS.find((file)=>etcFiles.includes(file.name));
        if (!distroFile) {
            return linuxInfo;
        }
        // Once that file is known, load its contents. To make searching in those
        // files easier, we lowercase the file contents. Since these files are
        // usually quite small, this should not allocate too much memory and we only
        // hold on to it for a very short amount of time.
        const distroPath = node_path.join('/etc', distroFile.name);
        const contents = (await readFileAsync(distroPath, {
            encoding: 'utf-8'
        })).toLowerCase();
        // Some Linux distributions store their release information in the same file
        // (e.g. RHEL and Centos). In those cases, we scan the file for an
        // identifier, that basically consists of the first word of the linux
        // distribution name (e.g. "red" for Red Hat). In case there is no match, we
        // just assume the first distribution in our list.
        const { distros } = distroFile;
        linuxInfo.name = distros.find((d)=>contents.indexOf(getLinuxDistroId(d)) >= 0) || distros[0];
        // Based on the found distribution, we can now compute the actual version
        // number. This is different for every distribution, so several strategies
        // are computed in `LINUX_VERSIONS`.
        const id = getLinuxDistroId(linuxInfo.name);
        linuxInfo.version = LINUX_VERSIONS[id]?.(contents);
    } catch  {
    // ignore
    }
    return linuxInfo;
}
/**
 * Grabs some information about hosting provider based on best effort.
 */ function getCloudResourceContext() {
    if (process.env.VERCEL) {
        // https://vercel.com/docs/concepts/projects/environment-variables/system-environment-variables#system-environment-variables
        return {
            'cloud.provider': 'vercel',
            'cloud.region': process.env.VERCEL_REGION
        };
    } else if (process.env.AWS_REGION) {
        // https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
        return {
            'cloud.provider': 'aws',
            'cloud.region': process.env.AWS_REGION,
            'cloud.platform': process.env.AWS_EXECUTION_ENV
        };
    } else if (process.env.GCP_PROJECT) {
        // https://cloud.google.com/composer/docs/how-to/managing/environment-variables#reserved_variables
        return {
            'cloud.provider': 'gcp'
        };
    } else if (process.env.ALIYUN_REGION_ID) {
        // TODO: find where I found these environment variables - at least gc.github.com returns something
        return {
            'cloud.provider': 'alibaba_cloud',
            'cloud.region': process.env.ALIYUN_REGION_ID
        };
    } else if (process.env.WEBSITE_SITE_NAME && process.env.REGION_NAME) {
        // https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings?tabs=kudu%2Cdotnet#app-environment
        return {
            'cloud.provider': 'azure',
            'cloud.region': process.env.REGION_NAME
        };
    } else if (process.env.IBM_CLOUD_REGION) {
        // TODO: find where I found these environment variables - at least gc.github.com returns something
        return {
            'cloud.provider': 'ibm_cloud',
            'cloud.region': process.env.IBM_CLOUD_REGION
        };
    } else if (process.env.TENCENTCLOUD_REGION) {
        // https://www.tencentcloud.com/document/product/583/32748
        return {
            'cloud.provider': 'tencent_cloud',
            'cloud.region': process.env.TENCENTCLOUD_REGION,
            'cloud.account.id': process.env.TENCENTCLOUD_APPID,
            'cloud.availability_zone': process.env.TENCENTCLOUD_ZONE
        };
    } else if (process.env.NETLIFY) {
        // https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables
        return {
            'cloud.provider': 'netlify'
        };
    } else if (process.env.FLY_REGION) {
        // https://fly.io/docs/reference/runtime-environment/
        return {
            'cloud.provider': 'fly.io',
            'cloud.region': process.env.FLY_REGION
        };
    } else if (process.env.DYNO) {
        // https://devcenter.heroku.com/articles/dynos#local-environment-variables
        return {
            'cloud.provider': 'heroku'
        };
    } else {
        return undefined;
    }
}
exports.getAppContext = getAppContext;
exports.getDeviceContext = getDeviceContext;
exports.nodeContextIntegration = nodeContextIntegration;
exports.readDirAsync = readDirAsync;
exports.readFileAsync = readFileAsync; //# sourceMappingURL=context.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/contextlines.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node_fs = __turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)");
const node_readline = __turbopack_context__.r("[externals]/node:readline [external] (node:readline, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const LRU_FILE_CONTENTS_CACHE = new core.LRUMap(10);
const LRU_FILE_CONTENTS_FS_READ_FAILED = new core.LRUMap(20);
const DEFAULT_LINES_OF_CONTEXT = 7;
const INTEGRATION_NAME = 'ContextLines';
// Determines the upper bound of lineno/colno that we will attempt to read. Large colno values are likely to be
// minified code while large lineno values are likely to be bundled code.
// Exported for testing purposes.
const MAX_CONTEXTLINES_COLNO = 1000;
const MAX_CONTEXTLINES_LINENO = 10000;
/**
 * Get or init map value
 */ function emplace(map, key, contents) {
    const value = map.get(key);
    if (value === undefined) {
        map.set(key, contents);
        return contents;
    }
    return value;
}
/**
 * Determines if context lines should be skipped for a file.
 * - .min.(mjs|cjs|js) files are and not useful since they dont point to the original source
 * - node: prefixed modules are part of the runtime and cannot be resolved to a file
 * - data: skip json, wasm and inline js https://nodejs.org/api/esm.html#data-imports
 */ function shouldSkipContextLinesForFile(path) {
    // Test the most common prefix and extension first. These are the ones we
    // are most likely to see in user applications and are the ones we can break out of first.
    if (path.startsWith('node:')) return true;
    if (path.endsWith('.min.js')) return true;
    if (path.endsWith('.min.cjs')) return true;
    if (path.endsWith('.min.mjs')) return true;
    if (path.startsWith('data:')) return true;
    return false;
}
/**
 * Determines if we should skip contextlines based off the max lineno and colno values.
 */ function shouldSkipContextLinesForFrame(frame) {
    if (frame.lineno !== undefined && frame.lineno > MAX_CONTEXTLINES_LINENO) return true;
    if (frame.colno !== undefined && frame.colno > MAX_CONTEXTLINES_COLNO) return true;
    return false;
}
/**
 * Checks if we have all the contents that we need in the cache.
 */ function rangeExistsInContentCache(file, range) {
    const contents = LRU_FILE_CONTENTS_CACHE.get(file);
    if (contents === undefined) return false;
    for(let i = range[0]; i <= range[1]; i++){
        if (contents[i] === undefined) {
            return false;
        }
    }
    return true;
}
/**
 * Creates contiguous ranges of lines to read from a file. In the case where context lines overlap,
 * the ranges are merged to create a single range.
 */ function makeLineReaderRanges(lines, linecontext) {
    if (!lines.length) {
        return [];
    }
    let i = 0;
    const line = lines[0];
    if (typeof line !== 'number') {
        return [];
    }
    let current = makeContextRange(line, linecontext);
    const out = [];
    // eslint-disable-next-line no-constant-condition
    while(true){
        if (i === lines.length - 1) {
            out.push(current);
            break;
        }
        // If the next line falls into the current range, extend the current range to lineno + linecontext.
        const next = lines[i + 1];
        if (typeof next !== 'number') {
            break;
        }
        if (next <= current[1]) {
            current[1] = next + linecontext;
        } else {
            out.push(current);
            current = makeContextRange(next, linecontext);
        }
        i++;
    }
    return out;
}
/**
 * Extracts lines from a file and stores them in a cache.
 */ function getContextLinesFromFile(path, ranges, output) {
    return new Promise((resolve, _reject)=>{
        // It is important *not* to have any async code between createInterface and the 'line' event listener
        // as it will cause the 'line' event to
        // be emitted before the listener is attached.
        const stream = node_fs.createReadStream(path);
        const lineReaded = node_readline.createInterface({
            input: stream
        });
        // We need to explicitly destroy the stream to prevent memory leaks,
        // removing the listeners on the readline interface is not enough.
        // See: https://github.com/nodejs/node/issues/9002 and https://github.com/getsentry/sentry-javascript/issues/14892
        function destroyStreamAndResolve() {
            stream.destroy();
            resolve();
        }
        // Init at zero and increment at the start of the loop because lines are 1 indexed.
        let lineNumber = 0;
        let currentRangeIndex = 0;
        const range = ranges[currentRangeIndex];
        if (range === undefined) {
            // We should never reach this point, but if we do, we should resolve the promise to prevent it from hanging.
            destroyStreamAndResolve();
            return;
        }
        let rangeStart = range[0];
        let rangeEnd = range[1];
        // We use this inside Promise.all, so we need to resolve the promise even if there is an error
        // to prevent Promise.all from short circuiting the rest.
        function onStreamError(e) {
            // Mark file path as failed to read and prevent multiple read attempts.
            LRU_FILE_CONTENTS_FS_READ_FAILED.set(path, 1);
            debugBuild.DEBUG_BUILD && core.debug.error(`Failed to read file: ${path}. Error: ${e}`);
            lineReaded.close();
            lineReaded.removeAllListeners();
            destroyStreamAndResolve();
        }
        // We need to handle the error event to prevent the process from crashing in < Node 16
        // https://github.com/nodejs/node/pull/31603
        stream.on('error', onStreamError);
        lineReaded.on('error', onStreamError);
        lineReaded.on('close', destroyStreamAndResolve);
        lineReaded.on('line', (line)=>{
            lineNumber++;
            if (lineNumber < rangeStart) return;
            // !Warning: This mutates the cache by storing the snipped line into the cache.
            output[lineNumber] = core.snipLine(line, 0);
            if (lineNumber >= rangeEnd) {
                if (currentRangeIndex === ranges.length - 1) {
                    // We need to close the file stream and remove listeners, else the reader will continue to run our listener;
                    lineReaded.close();
                    lineReaded.removeAllListeners();
                    return;
                }
                currentRangeIndex++;
                const range = ranges[currentRangeIndex];
                if (range === undefined) {
                    // This should never happen as it means we have a bug in the context.
                    lineReaded.close();
                    lineReaded.removeAllListeners();
                    return;
                }
                rangeStart = range[0];
                rangeEnd = range[1];
            }
        });
    });
}
/**
 * Adds surrounding (context) lines of the line that an exception occurred on to the event.
 * This is done by reading the file line by line and extracting the lines. The extracted lines are stored in
 * a cache to prevent multiple reads of the same file. Failures to read a file are similarly cached to prevent multiple
 * failing reads from happening.
 */ /* eslint-disable complexity */ async function addSourceContext(event, contextLines) {
    // keep a lookup map of which files we've already enqueued to read,
    // so we don't enqueue the same file multiple times which would cause multiple i/o reads
    const filesToLines = {};
    if (contextLines > 0 && event.exception?.values) {
        for (const exception of event.exception.values){
            if (!exception.stacktrace?.frames?.length) {
                continue;
            }
            // Maps preserve insertion order, so we iterate in reverse, starting at the
            // outermost frame and closer to where the exception has occurred (poor mans priority)
            for(let i = exception.stacktrace.frames.length - 1; i >= 0; i--){
                const frame = exception.stacktrace.frames[i];
                const filename = frame?.filename;
                if (!frame || typeof filename !== 'string' || typeof frame.lineno !== 'number' || shouldSkipContextLinesForFile(filename) || shouldSkipContextLinesForFrame(frame)) {
                    continue;
                }
                const filesToLinesOutput = filesToLines[filename];
                if (!filesToLinesOutput) filesToLines[filename] = [];
                // @ts-expect-error this is defined above
                filesToLines[filename].push(frame.lineno);
            }
        }
    }
    const files = Object.keys(filesToLines);
    if (files.length == 0) {
        return event;
    }
    const readlinePromises = [];
    for (const file of files){
        // If we failed to read this before, dont try reading it again.
        if (LRU_FILE_CONTENTS_FS_READ_FAILED.get(file)) {
            continue;
        }
        const filesToLineRanges = filesToLines[file];
        if (!filesToLineRanges) {
            continue;
        }
        // Sort ranges so that they are sorted by line increasing order and match how the file is read.
        filesToLineRanges.sort((a, b)=>a - b);
        // Check if the contents are already in the cache and if we can avoid reading the file again.
        const ranges = makeLineReaderRanges(filesToLineRanges, contextLines);
        if (ranges.every((r)=>rangeExistsInContentCache(file, r))) {
            continue;
        }
        const cache = emplace(LRU_FILE_CONTENTS_CACHE, file, {});
        readlinePromises.push(getContextLinesFromFile(file, ranges, cache));
    }
    // The promise rejections are caught in order to prevent them from short circuiting Promise.all
    await Promise.all(readlinePromises).catch(()=>{
        debugBuild.DEBUG_BUILD && core.debug.log('Failed to read one or more source files and resolve context lines');
    });
    // Perform the same loop as above, but this time we can assume all files are in the cache
    // and attempt to add source context to frames.
    if (contextLines > 0 && event.exception?.values) {
        for (const exception of event.exception.values){
            if (exception.stacktrace?.frames && exception.stacktrace.frames.length > 0) {
                addSourceContextToFrames(exception.stacktrace.frames, contextLines, LRU_FILE_CONTENTS_CACHE);
            }
        }
    }
    return event;
}
/* eslint-enable complexity */ /** Adds context lines to frames */ function addSourceContextToFrames(frames, contextLines, cache) {
    for (const frame of frames){
        // Only add context if we have a filename and it hasn't already been added
        if (frame.filename && frame.context_line === undefined && typeof frame.lineno === 'number') {
            const contents = cache.get(frame.filename);
            if (contents === undefined) {
                continue;
            }
            addContextToFrame(frame.lineno, frame, contextLines, contents);
        }
    }
}
/**
 * Clears the context lines from a frame, used to reset a frame to its original state
 * if we fail to resolve all context lines for it.
 */ function clearLineContext(frame) {
    delete frame.pre_context;
    delete frame.context_line;
    delete frame.post_context;
}
/**
 * Resolves context lines before and after the given line number and appends them to the frame;
 */ function addContextToFrame(lineno, frame, contextLines, contents) {
    // When there is no line number in the frame, attaching context is nonsensical and will even break grouping.
    // We already check for lineno before calling this, but since StackFrame lineno ism optional, we check it again.
    if (frame.lineno === undefined || contents === undefined) {
        debugBuild.DEBUG_BUILD && core.debug.error('Cannot resolve context for frame with no lineno or file contents');
        return;
    }
    frame.pre_context = [];
    for(let i = makeRangeStart(lineno, contextLines); i < lineno; i++){
        // We always expect the start context as line numbers cannot be negative. If we dont find a line, then
        // something went wrong somewhere. Clear the context and return without adding any linecontext.
        const line = contents[i];
        if (line === undefined) {
            clearLineContext(frame);
            debugBuild.DEBUG_BUILD && core.debug.error(`Could not find line ${i} in file ${frame.filename}`);
            return;
        }
        frame.pre_context.push(line);
    }
    // We should always have the context line. If we dont, something went wrong, so we clear the context and return
    // without adding any linecontext.
    if (contents[lineno] === undefined) {
        clearLineContext(frame);
        debugBuild.DEBUG_BUILD && core.debug.error(`Could not find line ${lineno} in file ${frame.filename}`);
        return;
    }
    frame.context_line = contents[lineno];
    const end = makeRangeEnd(lineno, contextLines);
    frame.post_context = [];
    for(let i = lineno + 1; i <= end; i++){
        // Since we dont track when the file ends, we cant clear the context if we dont find a line as it could
        // just be that we reached the end of the file.
        const line = contents[i];
        if (line === undefined) {
            break;
        }
        frame.post_context.push(line);
    }
}
// Helper functions for generating line context ranges. They take a line number and the number of lines of context to
// include before and after the line and generate an inclusive range of indices.
// Compute inclusive end context range
function makeRangeStart(line, linecontext) {
    return Math.max(1, line - linecontext);
}
// Compute inclusive start context range
function makeRangeEnd(line, linecontext) {
    return line + linecontext;
}
// Determine start and end indices for context range (inclusive);
function makeContextRange(line, linecontext) {
    return [
        makeRangeStart(line, linecontext),
        makeRangeEnd(line, linecontext)
    ];
}
/** Exported only for tests, as a type-safe variant. */ const _contextLinesIntegration = (options = {})=>{
    const contextLines = options.frameContextLines !== undefined ? options.frameContextLines : DEFAULT_LINES_OF_CONTEXT;
    return {
        name: INTEGRATION_NAME,
        processEvent (event) {
            return addSourceContext(event, contextLines);
        }
    };
};
/**
 * Capture the lines before and after the frame's context.
 */ const contextLinesIntegration = core.defineIntegration(_contextLinesIntegration);
exports.MAX_CONTEXTLINES_COLNO = MAX_CONTEXTLINES_COLNO;
exports.MAX_CONTEXTLINES_LINENO = MAX_CONTEXTLINES_LINENO;
exports._contextLinesIntegration = _contextLinesIntegration;
exports.addContextToFrame = addContextToFrame;
exports.contextLinesIntegration = contextLinesIntegration; //# sourceMappingURL=contextlines.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/debug.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
let cachedDebuggerEnabled;
/**
 * Was the debugger enabled when this function was first called?
 */ async function isDebuggerEnabled() {
    if (cachedDebuggerEnabled === undefined) {
        try {
            // Node can be built without inspector support
            const inspector = await __turbopack_context__.A("[externals]/node:inspector [external] (node:inspector, cjs, async loader)");
            cachedDebuggerEnabled = !!inspector.url();
        } catch  {
            cachedDebuggerEnabled = false;
        }
    }
    return cachedDebuggerEnabled;
}
exports.isDebuggerEnabled = isDebuggerEnabled; //# sourceMappingURL=debug.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/common.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * The key used to store the local variables on the error object.
 */ const LOCAL_VARIABLES_KEY = '__SENTRY_ERROR_LOCAL_VARIABLES__';
/**
 * Creates a rate limiter that will call the disable callback when the rate limit is reached and the enable callback
 * when a timeout has occurred.
 * @param maxPerSecond Maximum number of calls per second
 * @param enable Callback to enable capture
 * @param disable Callback to disable capture
 * @returns A function to call to increment the rate limiter count
 */ function createRateLimiter(maxPerSecond, enable, disable) {
    let count = 0;
    let retrySeconds = 5;
    let disabledTimeout = 0;
    setInterval(()=>{
        if (disabledTimeout === 0) {
            if (count > maxPerSecond) {
                retrySeconds *= 2;
                disable(retrySeconds);
                // Cap at one day
                if (retrySeconds > 86400) {
                    retrySeconds = 86400;
                }
                disabledTimeout = retrySeconds;
            }
        } else {
            disabledTimeout -= 1;
            if (disabledTimeout === 0) {
                enable();
            }
        }
        count = 0;
    }, 1000).unref();
    return ()=>{
        count += 1;
    };
}
// Add types for the exception event data
/** Could this be an anonymous function? */ function isAnonymous(name) {
    return name !== undefined && (name.length === 0 || name === '?' || name === '<anonymous>');
}
/** Do the function names appear to match? */ function functionNamesMatch(a, b) {
    return a === b || `Object.${a}` === b || a === `Object.${b}` || isAnonymous(a) && isAnonymous(b);
}
exports.LOCAL_VARIABLES_KEY = LOCAL_VARIABLES_KEY;
exports.createRateLimiter = createRateLimiter;
exports.functionNamesMatch = functionNamesMatch;
exports.isAnonymous = isAnonymous; //# sourceMappingURL=common.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/local-variables-async.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node_worker_threads = __turbopack_context__.r("[externals]/node:worker_threads [external] (node:worker_threads, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/debug.js [app-ssr] (ecmascript)");
const common = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/common.js [app-ssr] (ecmascript)");
// This string is a placeholder that gets overwritten with the worker code.
const base64WorkerScript = 'LyohIEBzZW50cnkvbm9kZS1jb3JlIDEwLjUuMCAoNTc3ZmJlZikgfCBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0ICovCmltcG9ydHtTZXNzaW9uIGFzIGV9ZnJvbSJub2RlOmluc3BlY3Rvci9wcm9taXNlcyI7aW1wb3J0e3dvcmtlckRhdGEgYXMgdH1mcm9tIm5vZGU6d29ya2VyX3RocmVhZHMiO2NvbnN0IG49Z2xvYmFsVGhpcyxpPXt9O2NvbnN0IG89Il9fU0VOVFJZX0VSUk9SX0xPQ0FMX1ZBUklBQkxFU19fIjtjb25zdCBhPXQ7ZnVuY3Rpb24gcyguLi5lKXthLmRlYnVnJiZmdW5jdGlvbihlKXtpZighKCJjb25zb2xlImluIG4pKXJldHVybiBlKCk7Y29uc3QgdD1uLmNvbnNvbGUsbz17fSxhPU9iamVjdC5rZXlzKGkpO2EuZm9yRWFjaChlPT57Y29uc3Qgbj1pW2VdO29bZV09dFtlXSx0W2VdPW59KTt0cnl7cmV0dXJuIGUoKX1maW5hbGx5e2EuZm9yRWFjaChlPT57dFtlXT1vW2VdfSl9fSgoKT0+Y29uc29sZS5sb2coIltMb2NhbFZhcmlhYmxlcyBXb3JrZXJdIiwuLi5lKSl9YXN5bmMgZnVuY3Rpb24gYyhlLHQsbixpKXtjb25zdCBvPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSk7aVtuXT1vLnJlc3VsdC5maWx0ZXIoZT0+Imxlbmd0aCIhPT1lLm5hbWUmJiFpc05hTihwYXJzZUludChlLm5hbWUsMTApKSkuc29ydCgoZSx0KT0+cGFyc2VJbnQoZS5uYW1lLDEwKS1wYXJzZUludCh0Lm5hbWUsMTApKS5tYXAoZT0+ZS52YWx1ZT8udmFsdWUpfWFzeW5jIGZ1bmN0aW9uIHIoZSx0LG4saSl7Y29uc3Qgbz1hd2FpdCBlLnBvc3QoIlJ1bnRpbWUuZ2V0UHJvcGVydGllcyIse29iamVjdElkOnQsb3duUHJvcGVydGllczohMH0pO2lbbl09by5yZXN1bHQubWFwKGU9PltlLm5hbWUsZS52YWx1ZT8udmFsdWVdKS5yZWR1Y2UoKGUsW3Qsbl0pPT4oZVt0XT1uLGUpLHt9KX1mdW5jdGlvbiB1KGUsdCl7ZS52YWx1ZSYmKCJ2YWx1ZSJpbiBlLnZhbHVlP3ZvaWQgMD09PWUudmFsdWUudmFsdWV8fG51bGw9PT1lLnZhbHVlLnZhbHVlP3RbZS5uYW1lXT1gPCR7ZS52YWx1ZS52YWx1ZX0+YDp0W2UubmFtZV09ZS52YWx1ZS52YWx1ZToiZGVzY3JpcHRpb24iaW4gZS52YWx1ZSYmImZ1bmN0aW9uIiE9PWUudmFsdWUudHlwZT90W2UubmFtZV09YDwke2UudmFsdWUuZGVzY3JpcHRpb259PmA6InVuZGVmaW5lZCI9PT1lLnZhbHVlLnR5cGUmJih0W2UubmFtZV09Ijx1bmRlZmluZWQ+IikpfWFzeW5jIGZ1bmN0aW9uIGwoZSx0KXtjb25zdCBuPWF3YWl0IGUucG9zdCgiUnVudGltZS5nZXRQcm9wZXJ0aWVzIix7b2JqZWN0SWQ6dCxvd25Qcm9wZXJ0aWVzOiEwfSksaT17fTtmb3IoY29uc3QgdCBvZiBuLnJlc3VsdClpZih0LnZhbHVlPy5vYmplY3RJZCYmIkFycmF5Ij09PXQudmFsdWUuY2xhc3NOYW1lKXtjb25zdCBuPXQudmFsdWUub2JqZWN0SWQ7YXdhaXQgYyhlLG4sdC5uYW1lLGkpfWVsc2UgaWYodC52YWx1ZT8ub2JqZWN0SWQmJiJPYmplY3QiPT09dC52YWx1ZS5jbGFzc05hbWUpe2NvbnN0IG49dC52YWx1ZS5vYmplY3RJZDthd2FpdCByKGUsbix0Lm5hbWUsaSl9ZWxzZSB0LnZhbHVlJiZ1KHQsaSk7cmV0dXJuIGl9bGV0IGY7KGFzeW5jIGZ1bmN0aW9uKCl7Y29uc3QgdD1uZXcgZTt0LmNvbm5lY3RUb01haW5UaHJlYWQoKSxzKCJDb25uZWN0ZWQgdG8gbWFpbiB0aHJlYWQiKTtsZXQgbj0hMTt0Lm9uKCJEZWJ1Z2dlci5yZXN1bWVkIiwoKT0+e249ITF9KSx0Lm9uKCJEZWJ1Z2dlci5wYXVzZWQiLGU9PntuPSEwLGFzeW5jIGZ1bmN0aW9uKGUse3JlYXNvbjp0LGRhdGE6e29iamVjdElkOm59LGNhbGxGcmFtZXM6aX0pe2lmKCJleGNlcHRpb24iIT09dCYmInByb21pc2VSZWplY3Rpb24iIT09dClyZXR1cm47aWYoZj8uKCksbnVsbD09bilyZXR1cm47Y29uc3QgYT1bXTtmb3IobGV0IHQ9MDt0PGkubGVuZ3RoO3QrKyl7Y29uc3R7c2NvcGVDaGFpbjpuLGZ1bmN0aW9uTmFtZTpvLHRoaXM6c309aVt0XSxjPW4uZmluZChlPT4ibG9jYWwiPT09ZS50eXBlKSxyPSJnbG9iYWwiIT09cy5jbGFzc05hbWUmJnMuY2xhc3NOYW1lP2Ake3MuY2xhc3NOYW1lfS4ke299YDpvO2lmKHZvaWQgMD09PWM/Lm9iamVjdC5vYmplY3RJZClhW3RdPXtmdW5jdGlvbjpyfTtlbHNle2NvbnN0IG49YXdhaXQgbChlLGMub2JqZWN0Lm9iamVjdElkKTthW3RdPXtmdW5jdGlvbjpyLHZhcnM6bn19fWF3YWl0IGUucG9zdCgiUnVudGltZS5jYWxsRnVuY3Rpb25PbiIse2Z1bmN0aW9uRGVjbGFyYXRpb246YGZ1bmN0aW9uKCkgeyB0aGlzLiR7b30gPSB0aGlzLiR7b30gfHwgJHtKU09OLnN0cmluZ2lmeShhKX07IH1gLHNpbGVudDohMCxvYmplY3RJZDpufSksYXdhaXQgZS5wb3N0KCJSdW50aW1lLnJlbGVhc2VPYmplY3QiLHtvYmplY3RJZDpufSl9KHQsZS5wYXJhbXMpLnRoZW4oYXN5bmMoKT0+e24mJmF3YWl0IHQucG9zdCgiRGVidWdnZXIucmVzdW1lIil9LGFzeW5jIGU9PntuJiZhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnJlc3VtZSIpfSl9KSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLmVuYWJsZSIpO2NvbnN0IGk9ITEhPT1hLmNhcHR1cmVBbGxFeGNlcHRpb25zO2lmKGF3YWl0IHQucG9zdCgiRGVidWdnZXIuc2V0UGF1c2VPbkV4Y2VwdGlvbnMiLHtzdGF0ZTppPyJhbGwiOiJ1bmNhdWdodCJ9KSxpKXtjb25zdCBlPWEubWF4RXhjZXB0aW9uc1BlclNlY29uZHx8NTA7Zj1mdW5jdGlvbihlLHQsbil7bGV0IGk9MCxvPTUsYT0wO3JldHVybiBzZXRJbnRlcnZhbCgoKT0+ezA9PT1hP2k+ZSYmKG8qPTIsbihvKSxvPjg2NDAwJiYobz04NjQwMCksYT1vKTooYS09MSwwPT09YSYmdCgpKSxpPTB9LDFlMykudW5yZWYoKSwoKT0+e2krPTF9fShlLGFzeW5jKCk9PntzKCJSYXRlLWxpbWl0IGxpZnRlZC4iKSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6ImFsbCJ9KX0sYXN5bmMgZT0+e3MoYFJhdGUtbGltaXQgZXhjZWVkZWQuIERpc2FibGluZyBjYXB0dXJpbmcgb2YgY2F1Z2h0IGV4Y2VwdGlvbnMgZm9yICR7ZX0gc2Vjb25kcy5gKSxhd2FpdCB0LnBvc3QoIkRlYnVnZ2VyLnNldFBhdXNlT25FeGNlcHRpb25zIix7c3RhdGU6InVuY2F1Z2h0In0pfSl9fSkoKS5jYXRjaChlPT57cygiRmFpbGVkIHRvIHN0YXJ0IGRlYnVnZ2VyIixlKX0pLHNldEludGVydmFsKCgpPT57fSwxZTQpOw==';
function log(...args) {
    core.debug.log('[LocalVariables]', ...args);
}
/**
 * Adds local variables to exception frames
 */ const localVariablesAsyncIntegration = core.defineIntegration((integrationOptions = {})=>{
    function addLocalVariablesToException(exception, localVariables) {
        // Filter out frames where the function name is `new Promise` since these are in the error.stack frames
        // but do not appear in the debugger call frames
        const frames = (exception.stacktrace?.frames || []).filter((frame)=>frame.function !== 'new Promise');
        for(let i = 0; i < frames.length; i++){
            // Sentry frames are in reverse order
            const frameIndex = frames.length - i - 1;
            const frameLocalVariables = localVariables[i];
            const frame = frames[frameIndex];
            if (!frame || !frameLocalVariables) {
                break;
            }
            if (// We need to have vars to add
            frameLocalVariables.vars === undefined || // We're not interested in frames that are not in_app because the vars are not relevant
            frame.in_app === false || // The function names need to match
            !common.functionNamesMatch(frame.function, frameLocalVariables.function)) {
                continue;
            }
            frame.vars = frameLocalVariables.vars;
        }
    }
    function addLocalVariablesToEvent(event, hint) {
        if (hint.originalException && typeof hint.originalException === 'object' && common.LOCAL_VARIABLES_KEY in hint.originalException && Array.isArray(hint.originalException[common.LOCAL_VARIABLES_KEY])) {
            for (const exception of event.exception?.values || []){
                addLocalVariablesToException(exception, hint.originalException[common.LOCAL_VARIABLES_KEY]);
            }
            hint.originalException[common.LOCAL_VARIABLES_KEY] = undefined;
        }
        return event;
    }
    async function startInspector() {
        // We load inspector dynamically because on some platforms Node is built without inspector support
        const inspector = await __turbopack_context__.A("[externals]/node:inspector [external] (node:inspector, cjs, async loader)");
        if (!inspector.url()) {
            inspector.open(0);
        }
    }
    function startWorker(options) {
        const worker = new node_worker_threads.Worker(new URL(`data:application/javascript;base64,${base64WorkerScript}`), {
            workerData: options,
            // We don't want any Node args to be passed to the worker
            execArgv: [],
            env: {
                ...process.env,
                NODE_OPTIONS: undefined
            }
        });
        process.on('exit', ()=>{
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            worker.terminate();
        });
        worker.once('error', (err)=>{
            log('Worker error', err);
        });
        worker.once('exit', (code)=>{
            log('Worker exit', code);
        });
        // Ensure this thread can't block app exit
        worker.unref();
    }
    return {
        name: 'LocalVariablesAsync',
        async setup (client) {
            const clientOptions = client.getOptions();
            if (!clientOptions.includeLocalVariables) {
                return;
            }
            if (await debug.isDebuggerEnabled()) {
                core.debug.warn('Local variables capture has been disabled because the debugger was already enabled');
                return;
            }
            const options = {
                ...integrationOptions,
                debug: core.debug.isEnabled()
            };
            startInspector().then(()=>{
                try {
                    startWorker(options);
                } catch (e) {
                    core.debug.error('Failed to start worker', e);
                }
            }, (e)=>{
                core.debug.error('Failed to start inspector', e);
            });
        },
        processEvent (event, hint) {
            return addLocalVariablesToEvent(event, hint);
        }
    };
});
exports.base64WorkerScript = base64WorkerScript;
exports.localVariablesAsyncIntegration = localVariablesAsyncIntegration; //# sourceMappingURL=local-variables-async.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/local-variables-sync.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeVersion = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/debug.js [app-ssr] (ecmascript)");
const common = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/common.js [app-ssr] (ecmascript)");
/** Creates a unique hash from stack frames */ function hashFrames(frames) {
    if (frames === undefined) {
        return;
    }
    // Only hash the 10 most recent frames (ie. the last 10)
    return frames.slice(-10).reduce((acc, frame)=>`${acc},${frame.function},${frame.lineno},${frame.colno}`, '');
}
/**
 * We use the stack parser to create a unique hash from the exception stack trace
 * This is used to lookup vars when the exception passes through the event processor
 */ function hashFromStack(stackParser, stack) {
    if (stack === undefined) {
        return undefined;
    }
    return hashFrames(stackParser(stack, 1));
}
/** Creates a container for callbacks to be called sequentially */ function createCallbackList(complete) {
    // A collection of callbacks to be executed last to first
    let callbacks = [];
    let completedCalled = false;
    function checkedComplete(result) {
        callbacks = [];
        if (completedCalled) {
            return;
        }
        completedCalled = true;
        complete(result);
    }
    // complete should be called last
    callbacks.push(checkedComplete);
    function add(fn) {
        callbacks.push(fn);
    }
    function next(result) {
        const popped = callbacks.pop() || checkedComplete;
        try {
            popped(result);
        } catch  {
            // If there is an error, we still want to call the complete callback
            checkedComplete(result);
        }
    }
    return {
        add,
        next
    };
}
/**
 * Promise API is available as `Experimental` and in Node 19 only.
 *
 * Callback-based API is `Stable` since v14 and `Experimental` since v8.
 * Because of that, we are creating our own `AsyncSession` class.
 *
 * https://nodejs.org/docs/latest-v19.x/api/inspector.html#promises-api
 * https://nodejs.org/docs/latest-v14.x/api/inspector.html
 */ class AsyncSession {
    /** Throws if inspector API is not available */ constructor(_session){
        this._session = _session;
    //
    }
    static async create(orDefault) {
        if (orDefault) {
            return orDefault;
        }
        const inspector = await __turbopack_context__.A("[externals]/node:inspector [external] (node:inspector, cjs, async loader)");
        return new AsyncSession(new inspector.Session());
    }
    /** @inheritdoc */ configureAndConnect(onPause, captureAll) {
        this._session.connect();
        this._session.on('Debugger.paused', (event)=>{
            onPause(event, ()=>{
                // After the pause work is complete, resume execution or the exception context memory is leaked
                this._session.post('Debugger.resume');
            });
        });
        this._session.post('Debugger.enable');
        this._session.post('Debugger.setPauseOnExceptions', {
            state: captureAll ? 'all' : 'uncaught'
        });
    }
    setPauseOnExceptions(captureAll) {
        this._session.post('Debugger.setPauseOnExceptions', {
            state: captureAll ? 'all' : 'uncaught'
        });
    }
    /** @inheritdoc */ getLocalVariables(objectId, complete) {
        this._getProperties(objectId, (props)=>{
            const { add, next } = createCallbackList(complete);
            for (const prop of props){
                if (prop.value?.objectId && prop.value.className === 'Array') {
                    const id = prop.value.objectId;
                    add((vars)=>this._unrollArray(id, prop.name, vars, next));
                } else if (prop.value?.objectId && prop.value.className === 'Object') {
                    const id = prop.value.objectId;
                    add((vars)=>this._unrollObject(id, prop.name, vars, next));
                } else if (prop.value) {
                    add((vars)=>this._unrollOther(prop, vars, next));
                }
            }
            next({});
        });
    }
    /**
   * Gets all the PropertyDescriptors of an object
   */ _getProperties(objectId, next) {
        this._session.post('Runtime.getProperties', {
            objectId,
            ownProperties: true
        }, (err, params)=>{
            if (err) {
                next([]);
            } else {
                next(params.result);
            }
        });
    }
    /**
   * Unrolls an array property
   */ _unrollArray(objectId, name, vars, next) {
        this._getProperties(objectId, (props)=>{
            vars[name] = props.filter((v)=>v.name !== 'length' && !isNaN(parseInt(v.name, 10))).sort((a, b)=>parseInt(a.name, 10) - parseInt(b.name, 10)).map((v)=>v.value?.value);
            next(vars);
        });
    }
    /**
   * Unrolls an object property
   */ _unrollObject(objectId, name, vars, next) {
        this._getProperties(objectId, (props)=>{
            vars[name] = props.map((v)=>[
                    v.name,
                    v.value?.value
                ]).reduce((obj, [key, val])=>{
                obj[key] = val;
                return obj;
            }, {});
            next(vars);
        });
    }
    /**
   * Unrolls other properties
   */ _unrollOther(prop, vars, next) {
        if (prop.value) {
            if ('value' in prop.value) {
                if (prop.value.value === undefined || prop.value.value === null) {
                    vars[prop.name] = `<${prop.value.value}>`;
                } else {
                    vars[prop.name] = prop.value.value;
                }
            } else if ('description' in prop.value && prop.value.type !== 'function') {
                vars[prop.name] = `<${prop.value.description}>`;
            } else if (prop.value.type === 'undefined') {
                vars[prop.name] = '<undefined>';
            }
        }
        next(vars);
    }
}
const INTEGRATION_NAME = 'LocalVariables';
/**
 * Adds local variables to exception frames
 */ const _localVariablesSyncIntegration = (options = {}, sessionOverride)=>{
    const cachedFrames = new core.LRUMap(20);
    let rateLimiter;
    let shouldProcessEvent = false;
    function addLocalVariablesToException(exception) {
        const hash = hashFrames(exception.stacktrace?.frames);
        if (hash === undefined) {
            return;
        }
        // Check if we have local variables for an exception that matches the hash
        // remove is identical to get but also removes the entry from the cache
        const cachedFrame = cachedFrames.remove(hash);
        if (cachedFrame === undefined) {
            return;
        }
        // Filter out frames where the function name is `new Promise` since these are in the error.stack frames
        // but do not appear in the debugger call frames
        const frames = (exception.stacktrace?.frames || []).filter((frame)=>frame.function !== 'new Promise');
        for(let i = 0; i < frames.length; i++){
            // Sentry frames are in reverse order
            const frameIndex = frames.length - i - 1;
            const cachedFrameVariable = cachedFrame[i];
            const frameVariable = frames[frameIndex];
            // Drop out if we run out of frames to match up
            if (!frameVariable || !cachedFrameVariable) {
                break;
            }
            if (// We need to have vars to add
            cachedFrameVariable.vars === undefined || // We're not interested in frames that are not in_app because the vars are not relevant
            frameVariable.in_app === false || // The function names need to match
            !common.functionNamesMatch(frameVariable.function, cachedFrameVariable.function)) {
                continue;
            }
            frameVariable.vars = cachedFrameVariable.vars;
        }
    }
    function addLocalVariablesToEvent(event) {
        for (const exception of event.exception?.values || []){
            addLocalVariablesToException(exception);
        }
        return event;
    }
    return {
        name: INTEGRATION_NAME,
        async setupOnce () {
            const client = core.getClient();
            const clientOptions = client?.getOptions();
            if (!clientOptions?.includeLocalVariables) {
                return;
            }
            // Only setup this integration if the Node version is >= v18
            // https://github.com/getsentry/sentry-javascript/issues/7697
            const unsupportedNodeVersion = nodeVersion.NODE_MAJOR < 18;
            if (unsupportedNodeVersion) {
                core.debug.log('The `LocalVariables` integration is only supported on Node >= v18.');
                return;
            }
            if (await debug.isDebuggerEnabled()) {
                core.debug.warn('Local variables capture has been disabled because the debugger was already enabled');
                return;
            }
            AsyncSession.create(sessionOverride).then((session)=>{
                function handlePaused(stackParser, { params: { reason, data, callFrames } }, complete) {
                    if (reason !== 'exception' && reason !== 'promiseRejection') {
                        complete();
                        return;
                    }
                    rateLimiter?.();
                    // data.description contains the original error.stack
                    const exceptionHash = hashFromStack(stackParser, data.description);
                    if (exceptionHash == undefined) {
                        complete();
                        return;
                    }
                    const { add, next } = createCallbackList((frames)=>{
                        cachedFrames.set(exceptionHash, frames);
                        complete();
                    });
                    // Because we're queuing up and making all these calls synchronously, we can potentially overflow the stack
                    // For this reason we only attempt to get local variables for the first 5 frames
                    for(let i = 0; i < Math.min(callFrames.length, 5); i++){
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const { scopeChain, functionName, this: obj } = callFrames[i];
                        const localScope = scopeChain.find((scope)=>scope.type === 'local');
                        // obj.className is undefined in ESM modules
                        const fn = obj.className === 'global' || !obj.className ? functionName : `${obj.className}.${functionName}`;
                        if (localScope?.object.objectId === undefined) {
                            add((frames)=>{
                                frames[i] = {
                                    function: fn
                                };
                                next(frames);
                            });
                        } else {
                            const id = localScope.object.objectId;
                            add((frames)=>session.getLocalVariables(id, (vars)=>{
                                    frames[i] = {
                                        function: fn,
                                        vars
                                    };
                                    next(frames);
                                }));
                        }
                    }
                    next([]);
                }
                const captureAll = options.captureAllExceptions !== false;
                session.configureAndConnect((ev, complete)=>handlePaused(clientOptions.stackParser, ev, complete), captureAll);
                if (captureAll) {
                    const max = options.maxExceptionsPerSecond || 50;
                    rateLimiter = common.createRateLimiter(max, ()=>{
                        core.debug.log('Local variables rate-limit lifted.');
                        session.setPauseOnExceptions(true);
                    }, (seconds)=>{
                        core.debug.log(`Local variables rate-limit exceeded. Disabling capturing of caught exceptions for ${seconds} seconds.`);
                        session.setPauseOnExceptions(false);
                    });
                }
                shouldProcessEvent = true;
            }, (error)=>{
                core.debug.log('The `LocalVariables` integration failed to start.', error);
            });
        },
        processEvent (event) {
            if (shouldProcessEvent) {
                return addLocalVariablesToEvent(event);
            }
            return event;
        },
        // These are entirely for testing
        _getCachedFramesCount () {
            return cachedFrames.size;
        },
        _getFirstCachedFrame () {
            return cachedFrames.values()[0];
        }
    };
};
/**
 * Adds local variables to exception frames.
 */ const localVariablesSyncIntegration = core.defineIntegration(_localVariablesSyncIntegration);
exports.createCallbackList = createCallbackList;
exports.hashFrames = hashFrames;
exports.hashFromStack = hashFromStack;
exports.localVariablesSyncIntegration = localVariablesSyncIntegration; //# sourceMappingURL=local-variables-sync.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const nodeVersion = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)");
const localVariablesAsync = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/local-variables-async.js [app-ssr] (ecmascript)");
const localVariablesSync = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/local-variables-sync.js [app-ssr] (ecmascript)");
const localVariablesIntegration = (options = {})=>{
    return nodeVersion.NODE_VERSION.major < 19 ? localVariablesSync.localVariablesSyncIntegration(options) : localVariablesAsync.localVariablesAsyncIntegration(options);
};
exports.localVariablesIntegration = localVariablesIntegration; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/** Detect CommonJS. */ function isCjs() {
    try {
        return ("TURBOPACK compile-time value", "object") !== 'undefined' && typeof module.exports !== 'undefined';
    } catch  {
        return false;
    }
}
exports.isCjs = isCjs; //# sourceMappingURL=commonjs.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/modules.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node_fs = __turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)");
const node_path = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
const commonjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)");
let moduleCache;
const INTEGRATION_NAME = 'Modules';
/**
 * `__SENTRY_SERVER_MODULES__` can be replaced at build time with the modules loaded by the server.
 * Right now, we leverage this in Next.js to circumvent the problem that we do not get access to these things at runtime.
 */ const SERVER_MODULES = typeof __SENTRY_SERVER_MODULES__ === 'undefined' ? {} : __SENTRY_SERVER_MODULES__;
const _modulesIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        processEvent (event) {
            event.modules = {
                ...event.modules,
                ..._getModules()
            };
            return event;
        },
        getModules: _getModules
    };
};
/**
 * Add node modules / packages to the event.
 * For this, multiple sources are used:
 * - They can be injected at build time into the __SENTRY_SERVER_MODULES__ variable (e.g. in Next.js)
 * - They are extracted from the dependencies & devDependencies in the package.json file
 * - They are extracted from the require.cache (CJS only)
 */ const modulesIntegration = _modulesIntegration;
function getRequireCachePaths() {
    try {
        return ("TURBOPACK compile-time truthy", 1) ? Object.keys(__turbopack_context__.c) : "TURBOPACK unreachable";
    } catch  {
        return [];
    }
}
/** Extract information about package.json modules */ function collectModules() {
    return {
        ...SERVER_MODULES,
        ...getModulesFromPackageJson(),
        ...commonjs.isCjs() ? collectRequireModules() : {}
    };
}
/** Extract information about package.json modules from require.cache */ function collectRequireModules() {
    const mainPaths = /*TURBOPACK member replacement*/ __turbopack_context__.t.main?.paths || [];
    const paths = getRequireCachePaths();
    // We start with the modules from package.json (if possible)
    // These may be overwritten by more specific versions from the require.cache
    const infos = {};
    const seen = new Set();
    paths.forEach((path)=>{
        let dir = path;
        /** Traverse directories upward in the search of package.json file */ const updir = ()=>{
            const orig = dir;
            dir = node_path.dirname(orig);
            if (!dir || orig === dir || seen.has(orig)) {
                return undefined;
            }
            if (mainPaths.indexOf(dir) < 0) {
                return updir();
            }
            const pkgfile = node_path.join(orig, 'package.json');
            seen.add(orig);
            if (!node_fs.existsSync(pkgfile)) {
                return updir();
            }
            try {
                const info = JSON.parse(node_fs.readFileSync(pkgfile, 'utf8'));
                infos[info.name] = info.version;
            } catch  {
            // no-empty
            }
        };
        updir();
    });
    return infos;
}
/** Fetches the list of modules and the versions loaded by the entry file for your node.js app. */ function _getModules() {
    if (!moduleCache) {
        moduleCache = collectModules();
    }
    return moduleCache;
}
function getPackageJson() {
    try {
        const filePath = node_path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(node_fs.readFileSync(filePath, 'utf8'));
        return packageJson;
    } catch  {
        return {};
    }
}
function getModulesFromPackageJson() {
    const packageJson = getPackageJson();
    return {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };
}
exports.modulesIntegration = modulesIntegration; //# sourceMappingURL=modules.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/errorhandling.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const DEFAULT_SHUTDOWN_TIMEOUT = 2000;
/**
 * @hidden
 */ function logAndExitProcess(error) {
    core.consoleSandbox(()=>{
        // eslint-disable-next-line no-console
        console.error(error);
    });
    const client = core.getClient();
    if (client === undefined) {
        debugBuild.DEBUG_BUILD && core.debug.warn('No NodeClient was defined, we are exiting the process now.');
        /*TURBOPACK member replacement*/ __turbopack_context__.g.process.exit(1);
        return;
    }
    const options = client.getOptions();
    const timeout = options?.shutdownTimeout && options.shutdownTimeout > 0 ? options.shutdownTimeout : DEFAULT_SHUTDOWN_TIMEOUT;
    client.close(timeout).then((result)=>{
        if (!result) {
            debugBuild.DEBUG_BUILD && core.debug.warn('We reached the timeout for emptying the request buffer, still exiting now!');
        }
        /*TURBOPACK member replacement*/ __turbopack_context__.g.process.exit(1);
    }, (error)=>{
        debugBuild.DEBUG_BUILD && core.debug.error(error);
    });
}
exports.logAndExitProcess = logAndExitProcess; //# sourceMappingURL=errorhandling.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onuncaughtexception.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const errorhandling = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/errorhandling.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'OnUncaughtException';
/**
 * Add a global exception handler.
 */ const onUncaughtExceptionIntegration = core.defineIntegration((options = {})=>{
    const optionsWithDefaults = {
        exitEvenIfOtherHandlersAreRegistered: false,
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            /*TURBOPACK member replacement*/ __turbopack_context__.g.process.on('uncaughtException', makeErrorHandler(client, optionsWithDefaults));
        }
    };
});
/** Exported only for tests */ function makeErrorHandler(client, options) {
    const timeout = 2000;
    let caughtFirstError = false;
    let caughtSecondError = false;
    let calledFatalError = false;
    let firstError;
    const clientOptions = client.getOptions();
    return Object.assign((error)=>{
        let onFatalError = errorhandling.logAndExitProcess;
        if (options.onFatalError) {
            onFatalError = options.onFatalError;
        } else if (clientOptions.onFatalError) {
            onFatalError = clientOptions.onFatalError;
        }
        // Attaching a listener to `uncaughtException` will prevent the node process from exiting. We generally do not
        // want to alter this behaviour so we check for other listeners that users may have attached themselves and adjust
        // exit behaviour of the SDK accordingly:
        // - If other listeners are attached, do not exit.
        // - If the only listener attached is ours, exit.
        const userProvidedListenersCount = /*TURBOPACK member replacement*/ __turbopack_context__.g.process.listeners('uncaughtException').filter((listener)=>{
            // There are 3 listeners we ignore:
            return(// as soon as we're using domains this listener is attached by node itself
            listener.name !== 'domainUncaughtExceptionClear' && // the handler we register for tracing
            listener.tag !== 'sentry_tracingErrorCallback' && // the handler we register in this integration
            listener._errorHandler !== true);
        }).length;
        const processWouldExit = userProvidedListenersCount === 0;
        const shouldApplyFatalHandlingLogic = options.exitEvenIfOtherHandlersAreRegistered || processWouldExit;
        if (!caughtFirstError) {
            // this is the first uncaught error and the ultimate reason for shutting down
            // we want to do absolutely everything possible to ensure it gets captured
            // also we want to make sure we don't go recursion crazy if more errors happen after this one
            firstError = error;
            caughtFirstError = true;
            if (core.getClient() === client) {
                core.captureException(error, {
                    originalException: error,
                    captureContext: {
                        level: 'fatal'
                    },
                    mechanism: {
                        handled: false,
                        type: 'onuncaughtexception'
                    }
                });
            }
            if (!calledFatalError && shouldApplyFatalHandlingLogic) {
                calledFatalError = true;
                onFatalError(error);
            }
        } else {
            if (shouldApplyFatalHandlingLogic) {
                if (calledFatalError) {
                    // we hit an error *after* calling onFatalError - pretty boned at this point, just shut it down
                    debugBuild.DEBUG_BUILD && core.debug.warn('uncaught exception after calling fatal error shutdown callback - this is bad! forcing shutdown');
                    errorhandling.logAndExitProcess(error);
                } else if (!caughtSecondError) {
                    // two cases for how we can hit this branch:
                    //   - capturing of first error blew up and we just caught the exception from that
                    //     - quit trying to capture, proceed with shutdown
                    //   - a second independent error happened while waiting for first error to capture
                    //     - want to avoid causing premature shutdown before first error capture finishes
                    // it's hard to immediately tell case 1 from case 2 without doing some fancy/questionable domain stuff
                    // so let's instead just delay a bit before we proceed with our action here
                    // in case 1, we just wait a bit unnecessarily but ultimately do the same thing
                    // in case 2, the delay hopefully made us wait long enough for the capture to finish
                    // two potential nonideal outcomes:
                    //   nonideal case 1: capturing fails fast, we sit around for a few seconds unnecessarily before proceeding correctly by calling onFatalError
                    //   nonideal case 2: case 2 happens, 1st error is captured but slowly, timeout completes before capture and we treat second error as the sendErr of (nonexistent) failure from trying to capture first error
                    // note that after hitting this branch, we might catch more errors where (caughtSecondError && !calledFatalError)
                    //   we ignore them - they don't matter to us, we're just waiting for the second error timeout to finish
                    caughtSecondError = true;
                    setTimeout(()=>{
                        if (!calledFatalError) {
                            // it was probably case 1, let's treat err as the sendErr and call onFatalError
                            calledFatalError = true;
                            onFatalError(firstError, error);
                        }
                    }, timeout); // capturing could take at least sendTimeout to fail, plus an arbitrary second for how long it takes to collect surrounding source etc
                }
            }
        }
    }, {
        _errorHandler: true
    });
}
exports.makeErrorHandler = makeErrorHandler;
exports.onUncaughtExceptionIntegration = onUncaughtExceptionIntegration; //# sourceMappingURL=onuncaughtexception.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onunhandledrejection.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const errorhandling = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/errorhandling.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'OnUnhandledRejection';
const _onUnhandledRejectionIntegration = (options = {})=>{
    const opts = {
        mode: 'warn',
        ...options
    };
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            /*TURBOPACK member replacement*/ __turbopack_context__.g.process.on('unhandledRejection', makeUnhandledPromiseHandler(client, opts));
        }
    };
};
/**
 * Add a global promise rejection handler.
 */ const onUnhandledRejectionIntegration = core.defineIntegration(_onUnhandledRejectionIntegration);
/**
 * Send an exception with reason
 * @param reason string
 * @param promise promise
 *
 * Exported only for tests.
 */ function makeUnhandledPromiseHandler(client, options) {
    return function sendUnhandledPromise(reason, promise) {
        if (core.getClient() !== client) {
            return;
        }
        const level = options.mode === 'strict' ? 'fatal' : 'error';
        // this can be set in places where we cannot reliably get access to the active span/error
        // when the error bubbles up to this handler, we can use this to set the active span
        const activeSpanForError = reason && typeof reason === 'object' ? reason._sentry_active_span : undefined;
        const activeSpanWrapper = activeSpanForError ? (fn)=>core.withActiveSpan(activeSpanForError, fn) : (fn)=>fn();
        activeSpanWrapper(()=>{
            core.captureException(reason, {
                originalException: promise,
                captureContext: {
                    extra: {
                        unhandledPromiseRejection: true
                    },
                    level
                },
                mechanism: {
                    handled: false,
                    type: 'onunhandledrejection'
                }
            });
        });
        handleRejection(reason, options.mode);
    };
}
/**
 * Handler for `mode` option
 */ function handleRejection(reason, mode) {
    // https://github.com/nodejs/node/blob/7cf6f9e964aa00772965391c23acda6d71972a9a/lib/internal/process/promises.js#L234-L240
    const rejectionWarning = 'This error originated either by ' + 'throwing inside of an async function without a catch block, ' + 'or by rejecting a promise which was not handled with .catch().' + ' The promise rejected with the reason:';
    /* eslint-disable no-console */ if (mode === 'warn') {
        core.consoleSandbox(()=>{
            console.warn(rejectionWarning);
            console.error(reason && typeof reason === 'object' && 'stack' in reason ? reason.stack : reason);
        });
    } else if (mode === 'strict') {
        core.consoleSandbox(()=>{
            console.warn(rejectionWarning);
        });
        errorhandling.logAndExitProcess(reason);
    }
/* eslint-enable no-console */ }
exports.makeUnhandledPromiseHandler = makeUnhandledPromiseHandler;
exports.onUnhandledRejectionIntegration = onUnhandledRejectionIntegration; //# sourceMappingURL=onunhandledrejection.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/anr/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const util = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const node_worker_threads = __turbopack_context__.r("[externals]/node:worker_threads [external] (node:worker_threads, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nodeVersion = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)");
const debug = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/debug.js [app-ssr] (ecmascript)");
const { isPromise } = util.types;
// This string is a placeholder that gets overwritten with the worker code.
const base64WorkerScript = 'LyohIEBzZW50cnkvbm9kZS1jb3JlIDEwLjUuMCAoNTc3ZmJlZikgfCBodHRwczovL2dpdGh1Yi5jb20vZ2V0c2VudHJ5L3NlbnRyeS1qYXZhc2NyaXB0ICovCmltcG9ydHtTZXNzaW9uIGFzIHR9ZnJvbSJub2RlOmluc3BlY3RvciI7aW1wb3J0e3dvcmtlckRhdGEgYXMgbixwYXJlbnRQb3J0IGFzIGV9ZnJvbSJub2RlOndvcmtlcl90aHJlYWRzIjtpbXBvcnR7cG9zaXggYXMgcixzZXAgYXMgb31mcm9tIm5vZGU6cGF0aCI7aW1wb3J0KmFzIHMgZnJvbSJub2RlOmh0dHAiO2ltcG9ydCphcyBpIGZyb20ibm9kZTpodHRwcyI7aW1wb3J0e1JlYWRhYmxlIGFzIGN9ZnJvbSJub2RlOnN0cmVhbSI7aW1wb3J0e2NyZWF0ZUd6aXAgYXMgdX1mcm9tIm5vZGU6emxpYiI7aW1wb3J0KmFzIGEgZnJvbSJub2RlOm5ldCI7aW1wb3J0KmFzIGYgZnJvbSJub2RlOnRscyI7Y29uc3QgaD0idW5kZWZpbmVkIj09dHlwZW9mIF9fU0VOVFJZX0RFQlVHX198fF9fU0VOVFJZX0RFQlVHX18scD1nbG9iYWxUaGlzLGw9IjEwLjUuMCI7ZnVuY3Rpb24gZCgpe3JldHVybiBtKHApLHB9ZnVuY3Rpb24gbSh0KXtjb25zdCBuPXQuX19TRU5UUllfXz10Ll9fU0VOVFJZX198fHt9O3JldHVybiBuLnZlcnNpb249bi52ZXJzaW9ufHxsLG5bbF09bltsXXx8e319ZnVuY3Rpb24gZyh0LG4sZT1wKXtjb25zdCByPWUuX19TRU5UUllfXz1lLl9fU0VOVFJZX198fHt9LG89cltsXT1yW2xdfHx7fTtyZXR1cm4gb1t0XXx8KG9bdF09bigpKX1jb25zdCB5PXt9O2Z1bmN0aW9uIGIodCl7aWYoISgiY29uc29sZSJpbiBwKSlyZXR1cm4gdCgpO2NvbnN0IG49cC5jb25zb2xlLGU9e30scj1PYmplY3Qua2V5cyh5KTtyLmZvckVhY2godD0+e2NvbnN0IHI9eVt0XTtlW3RdPW5bdF0sblt0XT1yfSk7dHJ5e3JldHVybiB0KCl9ZmluYWxseXtyLmZvckVhY2godD0+e25bdF09ZVt0XX0pfX1mdW5jdGlvbiB2KCl7cmV0dXJuIHcoKS5lbmFibGVkfWZ1bmN0aW9uIF8odCwuLi5uKXtoJiZ2KCkmJmIoKCk9PntwLmNvbnNvbGVbdF0oYFNlbnRyeSBMb2dnZXIgWyR7dH1dOmAsLi4ubil9KX1mdW5jdGlvbiB3KCl7cmV0dXJuIGg/ZygibG9nZ2VyU2V0dGluZ3MiLCgpPT4oe2VuYWJsZWQ6ITF9KSk6e2VuYWJsZWQ6ITF9fWNvbnN0IFM9e2VuYWJsZTpmdW5jdGlvbigpe3coKS5lbmFibGVkPSEwfSxkaXNhYmxlOmZ1bmN0aW9uKCl7dygpLmVuYWJsZWQ9ITF9LGlzRW5hYmxlZDp2LGxvZzpmdW5jdGlvbiguLi50KXtfKCJsb2ciLC4uLnQpfSx3YXJuOmZ1bmN0aW9uKC4uLnQpe18oIndhcm4iLC4uLnQpfSxlcnJvcjpmdW5jdGlvbiguLi50KXtfKCJlcnJvciIsLi4udCl9fSwkPS9jYXB0dXJlTWVzc2FnZXxjYXB0dXJlRXhjZXB0aW9uLztmdW5jdGlvbiBFKHQpe3JldHVybiB0W3QubGVuZ3RoLTFdfHx7fX1jb25zdCB4PSI8YW5vbnltb3VzPiI7Y29uc3QgTj1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO2Z1bmN0aW9uIEModCxuKXtyZXR1cm4gTi5jYWxsKHQpPT09YFtvYmplY3QgJHtufV1gfWZ1bmN0aW9uIGsodCl7cmV0dXJuIEModCwiU3RyaW5nIil9ZnVuY3Rpb24gVCh0KXtyZXR1cm4gQyh0LCJPYmplY3QiKX1mdW5jdGlvbiBqKHQpe3JldHVybiBCb29sZWFuKHQ/LnRoZW4mJiJmdW5jdGlvbiI9PXR5cGVvZiB0LnRoZW4pfWZ1bmN0aW9uIEkodCxuKXt0cnl7cmV0dXJuIHQgaW5zdGFuY2VvZiBufWNhdGNoe3JldHVybiExfX1jb25zdCBPPXA7ZnVuY3Rpb24gUih0LG4pe2NvbnN0IGU9dCxyPVtdO2lmKCFlPy50YWdOYW1lKXJldHVybiIiO2lmKE8uSFRNTEVsZW1lbnQmJmUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCYmZS5kYXRhc2V0KXtpZihlLmRhdGFzZXQuc2VudHJ5Q29tcG9uZW50KXJldHVybiBlLmRhdGFzZXQuc2VudHJ5Q29tcG9uZW50O2lmKGUuZGF0YXNldC5zZW50cnlFbGVtZW50KXJldHVybiBlLmRhdGFzZXQuc2VudHJ5RWxlbWVudH1yLnB1c2goZS50YWdOYW1lLnRvTG93ZXJDYXNlKCkpO2NvbnN0IG89bj8ubGVuZ3RoP24uZmlsdGVyKHQ9PmUuZ2V0QXR0cmlidXRlKHQpKS5tYXAodD0+W3QsZS5nZXRBdHRyaWJ1dGUodCldKTpudWxsO2lmKG8/Lmxlbmd0aClvLmZvckVhY2godD0+e3IucHVzaChgWyR7dFswXX09IiR7dFsxXX0iXWApfSk7ZWxzZXtlLmlkJiZyLnB1c2goYCMke2UuaWR9YCk7Y29uc3QgdD1lLmNsYXNzTmFtZTtpZih0JiZrKHQpKXtjb25zdCBuPXQuc3BsaXQoL1xzKy8pO2Zvcihjb25zdCB0IG9mIG4pci5wdXNoKGAuJHt0fWApfX1jb25zdCBzPVsiYXJpYS1sYWJlbCIsInR5cGUiLCJuYW1lIiwidGl0bGUiLCJhbHQiXTtmb3IoY29uc3QgdCBvZiBzKXtjb25zdCBuPWUuZ2V0QXR0cmlidXRlKHQpO24mJnIucHVzaChgWyR7dH09IiR7bn0iXWApfXJldHVybiByLmpvaW4oIiIpfWZ1bmN0aW9uIEEodCxuPTApe3JldHVybiJzdHJpbmciIT10eXBlb2YgdHx8MD09PW58fHQubGVuZ3RoPD1uP3Q6YCR7dC5zbGljZSgwLG4pfS4uLmB9ZnVuY3Rpb24gRCh0KXtpZihmdW5jdGlvbih0KXtzd2l0Y2goTi5jYWxsKHQpKXtjYXNlIltvYmplY3QgRXJyb3JdIjpjYXNlIltvYmplY3QgRXhjZXB0aW9uXSI6Y2FzZSJbb2JqZWN0IERPTUV4Y2VwdGlvbl0iOmNhc2UiW29iamVjdCBXZWJBc3NlbWJseS5FeGNlcHRpb25dIjpyZXR1cm4hMDtkZWZhdWx0OnJldHVybiBJKHQsRXJyb3IpfX0odCkpcmV0dXJue21lc3NhZ2U6dC5tZXNzYWdlLG5hbWU6dC5uYW1lLHN0YWNrOnQuc3RhY2ssLi4uVSh0KX07aWYobj10LCJ1bmRlZmluZWQiIT10eXBlb2YgRXZlbnQmJkkobixFdmVudCkpe2NvbnN0IG49e3R5cGU6dC50eXBlLHRhcmdldDpQKHQudGFyZ2V0KSxjdXJyZW50VGFyZ2V0OlAodC5jdXJyZW50VGFyZ2V0KSwuLi5VKHQpfTtyZXR1cm4idW5kZWZpbmVkIiE9dHlwZW9mIEN1c3RvbUV2ZW50JiZJKHQsQ3VzdG9tRXZlbnQpJiYobi5kZXRhaWw9dC5kZXRhaWwpLG59cmV0dXJuIHQ7dmFyIG59ZnVuY3Rpb24gUCh0KXt0cnl7cmV0dXJuIG49dCwidW5kZWZpbmVkIiE9dHlwZW9mIEVsZW1lbnQmJkkobixFbGVtZW50KT9mdW5jdGlvbih0LG49e30pe2lmKCF0KXJldHVybiI8dW5rbm93bj4iO3RyeXtsZXQgZT10O2NvbnN0IHI9NSxvPVtdO2xldCBzPTAsaT0wO2NvbnN0IGM9IiA+ICIsdT1jLmxlbmd0aDtsZXQgYTtjb25zdCBmPUFycmF5LmlzQXJyYXkobik/bjpuLmtleUF0dHJzLGg9IUFycmF5LmlzQXJyYXkobikmJm4ubWF4U3RyaW5nTGVuZ3RofHw4MDtmb3IoO2UmJnMrKzxyJiYoYT1SKGUsZiksISgiaHRtbCI9PT1hfHxzPjEmJmkrby5sZW5ndGgqdSthLmxlbmd0aD49aCkpOylvLnB1c2goYSksaSs9YS5sZW5ndGgsZT1lLnBhcmVudE5vZGU7cmV0dXJuIG8ucmV2ZXJzZSgpLmpvaW4oYyl9Y2F0Y2h7cmV0dXJuIjx1bmtub3duPiJ9fSh0KTpPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCl9Y2F0Y2h7cmV0dXJuIjx1bmtub3duPiJ9dmFyIG59ZnVuY3Rpb24gVSh0KXtpZigib2JqZWN0Ij09dHlwZW9mIHQmJm51bGwhPT10KXtjb25zdCBuPXt9O2Zvcihjb25zdCBlIGluIHQpT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsZSkmJihuW2VdPXRbZV0pO3JldHVybiBufXJldHVybnt9fWZ1bmN0aW9uIE0odD1mdW5jdGlvbigpe2NvbnN0IHQ9cDtyZXR1cm4gdC5jcnlwdG98fHQubXNDcnlwdG99KCkpe2xldCBuPSgpPT4xNipNYXRoLnJhbmRvbSgpO3RyeXtpZih0Py5yYW5kb21VVUlEKXJldHVybiB0LnJhbmRvbVVVSUQoKS5yZXBsYWNlKC8tL2csIiIpO3Q/LmdldFJhbmRvbVZhbHVlcyYmKG49KCk9Pntjb25zdCBuPW5ldyBVaW50OEFycmF5KDEpO3JldHVybiB0LmdldFJhbmRvbVZhbHVlcyhuKSxuWzBdfSl9Y2F0Y2h7fXJldHVybihbMWU3XSsxZTMrNGUzKzhlMysxZTExKS5yZXBsYWNlKC9bMDE4XS9nLHQ9Pih0XigxNSZuKCkpPj50LzQpLnRvU3RyaW5nKDE2KSl9ZnVuY3Rpb24gTCgpe3JldHVybiBEYXRlLm5vdygpLzFlM31sZXQgQjtmdW5jdGlvbiBHKCl7cmV0dXJuKEI/PyhCPWZ1bmN0aW9uKCl7Y29uc3R7cGVyZm9ybWFuY2U6dH09cDtpZighdD8ubm93fHwhdC50aW1lT3JpZ2luKXJldHVybiBMO2NvbnN0IG49dC50aW1lT3JpZ2luO3JldHVybigpPT4obit0Lm5vdygpKS8xZTN9KCkpKSgpfWZ1bmN0aW9uIEgodCl7Y29uc3Qgbj1HKCksZT17c2lkOk0oKSxpbml0OiEwLHRpbWVzdGFtcDpuLHN0YXJ0ZWQ6bixkdXJhdGlvbjowLHN0YXR1czoib2siLGVycm9yczowLGlnbm9yZUR1cmF0aW9uOiExLHRvSlNPTjooKT0+ZnVuY3Rpb24odCl7cmV0dXJue3NpZDpgJHt0LnNpZH1gLGluaXQ6dC5pbml0LHN0YXJ0ZWQ6bmV3IERhdGUoMWUzKnQuc3RhcnRlZCkudG9JU09TdHJpbmcoKSx0aW1lc3RhbXA6bmV3IERhdGUoMWUzKnQudGltZXN0YW1wKS50b0lTT1N0cmluZygpLHN0YXR1czp0LnN0YXR1cyxlcnJvcnM6dC5lcnJvcnMsZGlkOiJudW1iZXIiPT10eXBlb2YgdC5kaWR8fCJzdHJpbmciPT10eXBlb2YgdC5kaWQ/YCR7dC5kaWR9YDp2b2lkIDAsZHVyYXRpb246dC5kdXJhdGlvbixhYm5vcm1hbF9tZWNoYW5pc206dC5hYm5vcm1hbF9tZWNoYW5pc20sYXR0cnM6e3JlbGVhc2U6dC5yZWxlYXNlLGVudmlyb25tZW50OnQuZW52aXJvbm1lbnQsaXBfYWRkcmVzczp0LmlwQWRkcmVzcyx1c2VyX2FnZW50OnQudXNlckFnZW50fX19KGUpfTtyZXR1cm4gdCYmSihlLHQpLGV9ZnVuY3Rpb24gSih0LG49e30pe2lmKG4udXNlciYmKCF0LmlwQWRkcmVzcyYmbi51c2VyLmlwX2FkZHJlc3MmJih0LmlwQWRkcmVzcz1uLnVzZXIuaXBfYWRkcmVzcyksdC5kaWR8fG4uZGlkfHwodC5kaWQ9bi51c2VyLmlkfHxuLnVzZXIuZW1haWx8fG4udXNlci51c2VybmFtZSkpLHQudGltZXN0YW1wPW4udGltZXN0YW1wfHxHKCksbi5hYm5vcm1hbF9tZWNoYW5pc20mJih0LmFibm9ybWFsX21lY2hhbmlzbT1uLmFibm9ybWFsX21lY2hhbmlzbSksbi5pZ25vcmVEdXJhdGlvbiYmKHQuaWdub3JlRHVyYXRpb249bi5pZ25vcmVEdXJhdGlvbiksbi5zaWQmJih0LnNpZD0zMj09PW4uc2lkLmxlbmd0aD9uLnNpZDpNKCkpLHZvaWQgMCE9PW4uaW5pdCYmKHQuaW5pdD1uLmluaXQpLCF0LmRpZCYmbi5kaWQmJih0LmRpZD1gJHtuLmRpZH1gKSwibnVtYmVyIj09dHlwZW9mIG4uc3RhcnRlZCYmKHQuc3RhcnRlZD1uLnN0YXJ0ZWQpLHQuaWdub3JlRHVyYXRpb24pdC5kdXJhdGlvbj12b2lkIDA7ZWxzZSBpZigibnVtYmVyIj09dHlwZW9mIG4uZHVyYXRpb24pdC5kdXJhdGlvbj1uLmR1cmF0aW9uO2Vsc2V7Y29uc3Qgbj10LnRpbWVzdGFtcC10LnN0YXJ0ZWQ7dC5kdXJhdGlvbj1uPj0wP246MH1uLnJlbGVhc2UmJih0LnJlbGVhc2U9bi5yZWxlYXNlKSxuLmVudmlyb25tZW50JiYodC5lbnZpcm9ubWVudD1uLmVudmlyb25tZW50KSwhdC5pcEFkZHJlc3MmJm4uaXBBZGRyZXNzJiYodC5pcEFkZHJlc3M9bi5pcEFkZHJlc3MpLCF0LnVzZXJBZ2VudCYmbi51c2VyQWdlbnQmJih0LnVzZXJBZ2VudD1uLnVzZXJBZ2VudCksIm51bWJlciI9PXR5cGVvZiBuLmVycm9ycyYmKHQuZXJyb3JzPW4uZXJyb3JzKSxuLnN0YXR1cyYmKHQuc3RhdHVzPW4uc3RhdHVzKX1mdW5jdGlvbiB6KHQsbixlPTIpe2lmKCFufHwib2JqZWN0IiE9dHlwZW9mIG58fGU8PTApcmV0dXJuIG47aWYodCYmMD09PU9iamVjdC5rZXlzKG4pLmxlbmd0aClyZXR1cm4gdDtjb25zdCByPXsuLi50fTtmb3IoY29uc3QgdCBpbiBuKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChuLHQpJiYoclt0XT16KHJbdF0sblt0XSxlLTEpKTtyZXR1cm4gcn1mdW5jdGlvbiBGKCl7cmV0dXJuIE0oKX1mdW5jdGlvbiBXKCl7cmV0dXJuIE0oKS5zdWJzdHJpbmcoMTYpfWNvbnN0IFk9Il9zZW50cnlTcGFuIjtmdW5jdGlvbiBLKHQsbil7bj9mdW5jdGlvbih0LG4sZSl7dHJ5e09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4se3ZhbHVlOmUsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfSl9Y2F0Y2h7aCYmUy5sb2coYEZhaWxlZCB0byBhZGQgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgIiR7bn0iIHRvIG9iamVjdGAsdCl9fSh0LFksbik6ZGVsZXRlIHRbWV19ZnVuY3Rpb24gWih0KXtyZXR1cm4gdFtZXX1jbGFzcyBWe2NvbnN0cnVjdG9yKCl7dGhpcy50PSExLHRoaXMubz1bXSx0aGlzLmk9W10sdGhpcy51PVtdLHRoaXMuaD1bXSx0aGlzLnA9e30sdGhpcy5sPXt9LHRoaXMubT17fSx0aGlzLnY9e30sdGhpcy5fPXt9LHRoaXMuUz17dHJhY2VJZDpGKCksc2FtcGxlUmFuZDpNYXRoLnJhbmRvbSgpfX1jbG9uZSgpe2NvbnN0IHQ9bmV3IFY7cmV0dXJuIHQudT1bLi4udGhpcy51XSx0Lmw9ey4uLnRoaXMubH0sdC5tPXsuLi50aGlzLm19LHQudj17Li4udGhpcy52fSx0aGlzLnYuZmxhZ3MmJih0LnYuZmxhZ3M9e3ZhbHVlczpbLi4udGhpcy52LmZsYWdzLnZhbHVlc119KSx0LnA9dGhpcy5wLHQuTj10aGlzLk4sdC5DPXRoaXMuQyx0Lms9dGhpcy5rLHQuVD10aGlzLlQsdC5pPVsuLi50aGlzLmldLHQuaD1bLi4udGhpcy5oXSx0Ll89ey4uLnRoaXMuX30sdC5TPXsuLi50aGlzLlN9LHQuaj10aGlzLmosdC5JPXRoaXMuSSxLKHQsWih0aGlzKSksdH1zZXRDbGllbnQodCl7dGhpcy5qPXR9c2V0TGFzdEV2ZW50SWQodCl7dGhpcy5JPXR9Z2V0Q2xpZW50KCl7cmV0dXJuIHRoaXMuan1sYXN0RXZlbnRJZCgpe3JldHVybiB0aGlzLkl9YWRkU2NvcGVMaXN0ZW5lcih0KXt0aGlzLm8ucHVzaCh0KX1hZGRFdmVudFByb2Nlc3Nvcih0KXtyZXR1cm4gdGhpcy5pLnB1c2godCksdGhpc31zZXRVc2VyKHQpe3JldHVybiB0aGlzLnA9dHx8e2VtYWlsOnZvaWQgMCxpZDp2b2lkIDAsaXBfYWRkcmVzczp2b2lkIDAsdXNlcm5hbWU6dm9pZCAwfSx0aGlzLkMmJkoodGhpcy5DLHt1c2VyOnR9KSx0aGlzLk8oKSx0aGlzfWdldFVzZXIoKXtyZXR1cm4gdGhpcy5wfXNldFRhZ3ModCl7cmV0dXJuIHRoaXMubD17Li4udGhpcy5sLC4uLnR9LHRoaXMuTygpLHRoaXN9c2V0VGFnKHQsbil7cmV0dXJuIHRoaXMubD17Li4udGhpcy5sLFt0XTpufSx0aGlzLk8oKSx0aGlzfXNldEV4dHJhcyh0KXtyZXR1cm4gdGhpcy5tPXsuLi50aGlzLm0sLi4udH0sdGhpcy5PKCksdGhpc31zZXRFeHRyYSh0LG4pe3JldHVybiB0aGlzLm09ey4uLnRoaXMubSxbdF06bn0sdGhpcy5PKCksdGhpc31zZXRGaW5nZXJwcmludCh0KXtyZXR1cm4gdGhpcy5UPXQsdGhpcy5PKCksdGhpc31zZXRMZXZlbCh0KXtyZXR1cm4gdGhpcy5OPXQsdGhpcy5PKCksdGhpc31zZXRUcmFuc2FjdGlvbk5hbWUodCl7cmV0dXJuIHRoaXMuaz10LHRoaXMuTygpLHRoaXN9c2V0Q29udGV4dCh0LG4pe3JldHVybiBudWxsPT09bj9kZWxldGUgdGhpcy52W3RdOnRoaXMudlt0XT1uLHRoaXMuTygpLHRoaXN9c2V0U2Vzc2lvbih0KXtyZXR1cm4gdD90aGlzLkM9dDpkZWxldGUgdGhpcy5DLHRoaXMuTygpLHRoaXN9Z2V0U2Vzc2lvbigpe3JldHVybiB0aGlzLkN9dXBkYXRlKHQpe2lmKCF0KXJldHVybiB0aGlzO2NvbnN0IG49ImZ1bmN0aW9uIj09dHlwZW9mIHQ/dCh0aGlzKTp0LGU9biBpbnN0YW5jZW9mIFY/bi5nZXRTY29wZURhdGEoKTpUKG4pP3Q6dm9pZCAwLHt0YWdzOnIsZXh0cmE6byx1c2VyOnMsY29udGV4dHM6aSxsZXZlbDpjLGZpbmdlcnByaW50OnU9W10scHJvcGFnYXRpb25Db250ZXh0OmF9PWV8fHt9O3JldHVybiB0aGlzLmw9ey4uLnRoaXMubCwuLi5yfSx0aGlzLm09ey4uLnRoaXMubSwuLi5vfSx0aGlzLnY9ey4uLnRoaXMudiwuLi5pfSxzJiZPYmplY3Qua2V5cyhzKS5sZW5ndGgmJih0aGlzLnA9cyksYyYmKHRoaXMuTj1jKSx1Lmxlbmd0aCYmKHRoaXMuVD11KSxhJiYodGhpcy5TPWEpLHRoaXN9Y2xlYXIoKXtyZXR1cm4gdGhpcy51PVtdLHRoaXMubD17fSx0aGlzLm09e30sdGhpcy5wPXt9LHRoaXMudj17fSx0aGlzLk49dm9pZCAwLHRoaXMuaz12b2lkIDAsdGhpcy5UPXZvaWQgMCx0aGlzLkM9dm9pZCAwLEsodGhpcyx2b2lkIDApLHRoaXMuaD1bXSx0aGlzLnNldFByb3BhZ2F0aW9uQ29udGV4dCh7dHJhY2VJZDpGKCksc2FtcGxlUmFuZDpNYXRoLnJhbmRvbSgpfSksdGhpcy5PKCksdGhpc31hZGRCcmVhZGNydW1iKHQsbil7Y29uc3QgZT0ibnVtYmVyIj09dHlwZW9mIG4/bjoxMDA7aWYoZTw9MClyZXR1cm4gdGhpcztjb25zdCByPXt0aW1lc3RhbXA6TCgpLC4uLnQsbWVzc2FnZTp0Lm1lc3NhZ2U/QSh0Lm1lc3NhZ2UsMjA0OCk6dC5tZXNzYWdlfTtyZXR1cm4gdGhpcy51LnB1c2gociksdGhpcy51Lmxlbmd0aD5lJiYodGhpcy51PXRoaXMudS5zbGljZSgtZSksdGhpcy5qPy5yZWNvcmREcm9wcGVkRXZlbnQoImJ1ZmZlcl9vdmVyZmxvdyIsImxvZ19pdGVtIikpLHRoaXMuTygpLHRoaXN9Z2V0TGFzdEJyZWFkY3J1bWIoKXtyZXR1cm4gdGhpcy51W3RoaXMudS5sZW5ndGgtMV19Y2xlYXJCcmVhZGNydW1icygpe3JldHVybiB0aGlzLnU9W10sdGhpcy5PKCksdGhpc31hZGRBdHRhY2htZW50KHQpe3JldHVybiB0aGlzLmgucHVzaCh0KSx0aGlzfWNsZWFyQXR0YWNobWVudHMoKXtyZXR1cm4gdGhpcy5oPVtdLHRoaXN9Z2V0U2NvcGVEYXRhKCl7cmV0dXJue2JyZWFkY3J1bWJzOnRoaXMudSxhdHRhY2htZW50czp0aGlzLmgsY29udGV4dHM6dGhpcy52LHRhZ3M6dGhpcy5sLGV4dHJhOnRoaXMubSx1c2VyOnRoaXMucCxsZXZlbDp0aGlzLk4sZmluZ2VycHJpbnQ6dGhpcy5UfHxbXSxldmVudFByb2Nlc3NvcnM6dGhpcy5pLHByb3BhZ2F0aW9uQ29udGV4dDp0aGlzLlMsc2RrUHJvY2Vzc2luZ01ldGFkYXRhOnRoaXMuXyx0cmFuc2FjdGlvbk5hbWU6dGhpcy5rLHNwYW46Wih0aGlzKX19c2V0U0RLUHJvY2Vzc2luZ01ldGFkYXRhKHQpe3JldHVybiB0aGlzLl89eih0aGlzLl8sdCwyKSx0aGlzfXNldFByb3BhZ2F0aW9uQ29udGV4dCh0KXtyZXR1cm4gdGhpcy5TPXQsdGhpc31nZXRQcm9wYWdhdGlvbkNvbnRleHQoKXtyZXR1cm4gdGhpcy5TfWNhcHR1cmVFeGNlcHRpb24odCxuKXtjb25zdCBlPW4/LmV2ZW50X2lkfHxNKCk7aWYoIXRoaXMuailyZXR1cm4gaCYmUy53YXJuKCJObyBjbGllbnQgY29uZmlndXJlZCBvbiBzY29wZSAtIHdpbGwgbm90IGNhcHR1cmUgZXhjZXB0aW9uISIpLGU7Y29uc3Qgcj1uZXcgRXJyb3IoIlNlbnRyeSBzeW50aGV0aWNFeGNlcHRpb24iKTtyZXR1cm4gdGhpcy5qLmNhcHR1cmVFeGNlcHRpb24odCx7b3JpZ2luYWxFeGNlcHRpb246dCxzeW50aGV0aWNFeGNlcHRpb246ciwuLi5uLGV2ZW50X2lkOmV9LHRoaXMpLGV9Y2FwdHVyZU1lc3NhZ2UodCxuLGUpe2NvbnN0IHI9ZT8uZXZlbnRfaWR8fE0oKTtpZighdGhpcy5qKXJldHVybiBoJiZTLndhcm4oIk5vIGNsaWVudCBjb25maWd1cmVkIG9uIHNjb3BlIC0gd2lsbCBub3QgY2FwdHVyZSBtZXNzYWdlISIpLHI7Y29uc3Qgbz1uZXcgRXJyb3IodCk7cmV0dXJuIHRoaXMuai5jYXB0dXJlTWVzc2FnZSh0LG4se29yaWdpbmFsRXhjZXB0aW9uOnQsc3ludGhldGljRXhjZXB0aW9uOm8sLi4uZSxldmVudF9pZDpyfSx0aGlzKSxyfWNhcHR1cmVFdmVudCh0LG4pe2NvbnN0IGU9bj8uZXZlbnRfaWR8fE0oKTtyZXR1cm4gdGhpcy5qPyh0aGlzLmouY2FwdHVyZUV2ZW50KHQsey4uLm4sZXZlbnRfaWQ6ZX0sdGhpcyksZSk6KGgmJlMud2FybigiTm8gY2xpZW50IGNvbmZpZ3VyZWQgb24gc2NvcGUgLSB3aWxsIG5vdCBjYXB0dXJlIGV2ZW50ISIpLGUpfU8oKXt0aGlzLnR8fCh0aGlzLnQ9ITAsdGhpcy5vLmZvckVhY2godD0+e3QodGhpcyl9KSx0aGlzLnQ9ITEpfX1jbGFzcyBxe2NvbnN0cnVjdG9yKHQsbil7bGV0IGUscjtlPXR8fG5ldyBWLHI9bnx8bmV3IFYsdGhpcy5SPVt7c2NvcGU6ZX1dLHRoaXMuQT1yfXdpdGhTY29wZSh0KXtjb25zdCBuPXRoaXMuRCgpO2xldCBlO3RyeXtlPXQobil9Y2F0Y2godCl7dGhyb3cgdGhpcy5QKCksdH1yZXR1cm4gaihlKT9lLnRoZW4odD0+KHRoaXMuUCgpLHQpLHQ9Pnt0aHJvdyB0aGlzLlAoKSx0fSk6KHRoaXMuUCgpLGUpfWdldENsaWVudCgpe3JldHVybiB0aGlzLmdldFN0YWNrVG9wKCkuY2xpZW50fWdldFNjb3BlKCl7cmV0dXJuIHRoaXMuZ2V0U3RhY2tUb3AoKS5zY29wZX1nZXRJc29sYXRpb25TY29wZSgpe3JldHVybiB0aGlzLkF9Z2V0U3RhY2tUb3AoKXtyZXR1cm4gdGhpcy5SW3RoaXMuUi5sZW5ndGgtMV19RCgpe2NvbnN0IHQ9dGhpcy5nZXRTY29wZSgpLmNsb25lKCk7cmV0dXJuIHRoaXMuUi5wdXNoKHtjbGllbnQ6dGhpcy5nZXRDbGllbnQoKSxzY29wZTp0fSksdH1QKCl7cmV0dXJuISh0aGlzLlIubGVuZ3RoPD0xKSYmISF0aGlzLlIucG9wKCl9fWZ1bmN0aW9uIFEoKXtjb25zdCB0PW0oZCgpKTtyZXR1cm4gdC5zdGFjaz10LnN0YWNrfHxuZXcgcShnKCJkZWZhdWx0Q3VycmVudFNjb3BlIiwoKT0+bmV3IFYpLGcoImRlZmF1bHRJc29sYXRpb25TY29wZSIsKCk9Pm5ldyBWKSl9ZnVuY3Rpb24gWCh0KXtyZXR1cm4gUSgpLndpdGhTY29wZSh0KX1mdW5jdGlvbiB0dCh0LG4pe2NvbnN0IGU9USgpO3JldHVybiBlLndpdGhTY29wZSgoKT0+KGUuZ2V0U3RhY2tUb3AoKS5zY29wZT10LG4odCkpKX1mdW5jdGlvbiBudCh0KXtyZXR1cm4gUSgpLndpdGhTY29wZSgoKT0+dChRKCkuZ2V0SXNvbGF0aW9uU2NvcGUoKSkpfWZ1bmN0aW9uIGV0KHQpe2NvbnN0IG49bSh0KTtyZXR1cm4gbi5hY3M/bi5hY3M6e3dpdGhJc29sYXRpb25TY29wZTpudCx3aXRoU2NvcGU6WCx3aXRoU2V0U2NvcGU6dHQsd2l0aFNldElzb2xhdGlvblNjb3BlOih0LG4pPT5udChuKSxnZXRDdXJyZW50U2NvcGU6KCk9PlEoKS5nZXRTY29wZSgpLGdldElzb2xhdGlvblNjb3BlOigpPT5RKCkuZ2V0SXNvbGF0aW9uU2NvcGUoKX19ZnVuY3Rpb24gcnQoKXtyZXR1cm4gZXQoZCgpKS5nZXRDdXJyZW50U2NvcGUoKS5nZXRDbGllbnQoKX1mdW5jdGlvbiBvdCh0KXtyZXR1cm57c2NvcGU6dC5fc2VudHJ5U2NvcGUsaXNvbGF0aW9uU2NvcGU6dC5fc2VudHJ5SXNvbGF0aW9uU2NvcGV9fWNvbnN0IHN0PS9ec2VudHJ5LS87ZnVuY3Rpb24gaXQodCl7Y29uc3Qgbj1mdW5jdGlvbih0KXtpZighdHx8IWsodCkmJiFBcnJheS5pc0FycmF5KHQpKXJldHVybjtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiB0LnJlZHVjZSgodCxuKT0+e2NvbnN0IGU9Y3Qobik7cmV0dXJuIE9iamVjdC5lbnRyaWVzKGUpLmZvckVhY2goKFtuLGVdKT0+e3Rbbl09ZX0pLHR9LHt9KTtyZXR1cm4gY3QodCl9KHQpO2lmKCFuKXJldHVybjtjb25zdCBlPU9iamVjdC5lbnRyaWVzKG4pLnJlZHVjZSgodCxbbixlXSk9PntpZihuLm1hdGNoKHN0KSl7dFtuLnNsaWNlKDcpXT1lfXJldHVybiB0fSx7fSk7cmV0dXJuIE9iamVjdC5rZXlzKGUpLmxlbmd0aD4wP2U6dm9pZCAwfWZ1bmN0aW9uIGN0KHQpe3JldHVybiB0LnNwbGl0KCIsIikubWFwKHQ9PnQuc3BsaXQoIj0iKS5tYXAodD0+e3RyeXtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHQudHJpbSgpKX1jYXRjaHtyZXR1cm59fSkpLnJlZHVjZSgodCxbbixlXSk9PihuJiZlJiYodFtuXT1lKSx0KSx7fSl9Y29uc3QgdXQ9L15vKFxkKylcLi87ZnVuY3Rpb24gYXQodCxuPSExKXtjb25zdHtob3N0OmUscGF0aDpyLHBhc3M6byxwb3J0OnMscHJvamVjdElkOmkscHJvdG9jb2w6YyxwdWJsaWNLZXk6dX09dDtyZXR1cm5gJHtjfTovLyR7dX0ke24mJm8/YDoke299YDoiIn1AJHtlfSR7cz9gOiR7c31gOiIifS8ke3I/YCR7cn0vYDpyfSR7aX1gfWZ1bmN0aW9uIGZ0KHQpe2NvbnN0IG49dC5nZXRPcHRpb25zKCkse2hvc3Q6ZX09dC5nZXREc24oKXx8e307bGV0IHI7cmV0dXJuIG4ub3JnSWQ/cj1TdHJpbmcobi5vcmdJZCk6ZSYmKHI9ZnVuY3Rpb24odCl7Y29uc3Qgbj10Lm1hdGNoKHV0KTtyZXR1cm4gbj8uWzFdfShlKSkscn1mdW5jdGlvbiBodCh0KXtjb25zdHtzcGFuSWQ6bix0cmFjZUlkOmUsaXNSZW1vdGU6cn09dC5zcGFuQ29udGV4dCgpLG89cj9uOm10KHQpLnBhcmVudF9zcGFuX2lkLHM9b3QodCkuc2NvcGU7cmV0dXJue3BhcmVudF9zcGFuX2lkOm8sc3Bhbl9pZDpyP3M/LmdldFByb3BhZ2F0aW9uQ29udGV4dCgpLnByb3BhZ2F0aW9uU3BhbklkfHxXKCk6bix0cmFjZV9pZDplfX1mdW5jdGlvbiBwdCh0KXtyZXR1cm4gdCYmdC5sZW5ndGg+MD90Lm1hcCgoe2NvbnRleHQ6e3NwYW5JZDp0LHRyYWNlSWQ6bix0cmFjZUZsYWdzOmUsLi4ucn0sYXR0cmlidXRlczpvfSk9Pih7c3Bhbl9pZDp0LHRyYWNlX2lkOm4sc2FtcGxlZDoxPT09ZSxhdHRyaWJ1dGVzOm8sLi4ucn0pKTp2b2lkIDB9ZnVuY3Rpb24gbHQodCl7cmV0dXJuIm51bWJlciI9PXR5cGVvZiB0P2R0KHQpOkFycmF5LmlzQXJyYXkodCk/dFswXSt0WzFdLzFlOTp0IGluc3RhbmNlb2YgRGF0ZT9kdCh0LmdldFRpbWUoKSk6RygpfWZ1bmN0aW9uIGR0KHQpe3JldHVybiB0Pjk5OTk5OTk5OTk/dC8xZTM6dH1mdW5jdGlvbiBtdCh0KXtpZihmdW5jdGlvbih0KXtyZXR1cm4iZnVuY3Rpb24iPT10eXBlb2YgdC5nZXRTcGFuSlNPTn0odCkpcmV0dXJuIHQuZ2V0U3BhbkpTT04oKTtjb25zdHtzcGFuSWQ6bix0cmFjZUlkOmV9PXQuc3BhbkNvbnRleHQoKTtpZihmdW5jdGlvbih0KXtjb25zdCBuPXQ7cmV0dXJuISEobi5hdHRyaWJ1dGVzJiZuLnN0YXJ0VGltZSYmbi5uYW1lJiZuLmVuZFRpbWUmJm4uc3RhdHVzKX0odCkpe2NvbnN0e2F0dHJpYnV0ZXM6cixzdGFydFRpbWU6byxuYW1lOnMsZW5kVGltZTppLHN0YXR1czpjLGxpbmtzOnV9PXQ7cmV0dXJue3NwYW5faWQ6bix0cmFjZV9pZDplLGRhdGE6cixkZXNjcmlwdGlvbjpzLHBhcmVudF9zcGFuX2lkOiJwYXJlbnRTcGFuSWQiaW4gdD90LnBhcmVudFNwYW5JZDoicGFyZW50U3BhbkNvbnRleHQiaW4gdD90LnBhcmVudFNwYW5Db250ZXh0Py5zcGFuSWQ6dm9pZCAwLHN0YXJ0X3RpbWVzdGFtcDpsdChvKSx0aW1lc3RhbXA6bHQoaSl8fHZvaWQgMCxzdGF0dXM6Z3QoYyksb3A6clsic2VudHJ5Lm9wIl0sb3JpZ2luOnJbInNlbnRyeS5vcmlnaW4iXSxsaW5rczpwdCh1KX19cmV0dXJue3NwYW5faWQ6bix0cmFjZV9pZDplLHN0YXJ0X3RpbWVzdGFtcDowLGRhdGE6e319fWZ1bmN0aW9uIGd0KHQpe2lmKHQmJjAhPT10LmNvZGUpcmV0dXJuIDE9PT10LmNvZGU/Im9rIjp0Lm1lc3NhZ2V8fCJ1bmtub3duX2Vycm9yIn1mdW5jdGlvbiB5dCh0KXtyZXR1cm4gdC5fc2VudHJ5Um9vdFNwYW58fHR9ZnVuY3Rpb24gYnQodCl7Y29uc3Qgbj1ydCgpO2lmKCFuKXJldHVybnt9O2NvbnN0IGU9eXQodCkscj1tdChlKSxvPXIuZGF0YSxzPWUuc3BhbkNvbnRleHQoKS50cmFjZVN0YXRlLGk9cz8uZ2V0KCJzZW50cnkuc2FtcGxlX3JhdGUiKT8/b1sic2VudHJ5LnNhbXBsZV9yYXRlIl0/P29bInNlbnRyeS5wcmV2aW91c190cmFjZV9zYW1wbGVfcmF0ZSJdO2Z1bmN0aW9uIGModCl7cmV0dXJuIm51bWJlciIhPXR5cGVvZiBpJiYic3RyaW5nIiE9dHlwZW9mIGl8fCh0LnNhbXBsZV9yYXRlPWAke2l9YCksdH1jb25zdCB1PWUuX2Zyb3plbkRzYztpZih1KXJldHVybiBjKHUpO2NvbnN0IGE9cz8uZ2V0KCJzZW50cnkuZHNjIiksZj1hJiZpdChhKTtpZihmKXJldHVybiBjKGYpO2NvbnN0IGg9ZnVuY3Rpb24odCxuKXtjb25zdCBlPW4uZ2V0T3B0aW9ucygpLHtwdWJsaWNLZXk6cn09bi5nZXREc24oKXx8e30sbz17ZW52aXJvbm1lbnQ6ZS5lbnZpcm9ubWVudHx8InByb2R1Y3Rpb24iLHJlbGVhc2U6ZS5yZWxlYXNlLHB1YmxpY19rZXk6cix0cmFjZV9pZDp0LG9yZ19pZDpmdChuKX07cmV0dXJuIG4uZW1pdCgiY3JlYXRlRHNjIixvKSxvfSh0LnNwYW5Db250ZXh0KCkudHJhY2VJZCxuKSxwPW9bInNlbnRyeS5zb3VyY2UiXSxsPXIuZGVzY3JpcHRpb247cmV0dXJuInVybCIhPT1wJiZsJiYoaC50cmFuc2FjdGlvbj1sKSxmdW5jdGlvbigpe2lmKCJib29sZWFuIj09dHlwZW9mIF9fU0VOVFJZX1RSQUNJTkdfXyYmIV9fU0VOVFJZX1RSQUNJTkdfXylyZXR1cm4hMTtjb25zdCB0PXJ0KCk/LmdldE9wdGlvbnMoKTtyZXR1cm4hKCF0fHxudWxsPT10LnRyYWNlc1NhbXBsZVJhdGUmJiF0LnRyYWNlc1NhbXBsZXIpfSgpJiYoaC5zYW1wbGVkPVN0cmluZyhmdW5jdGlvbih0KXtjb25zdHt0cmFjZUZsYWdzOm59PXQuc3BhbkNvbnRleHQoKTtyZXR1cm4gMT09PW59KGUpKSxoLnNhbXBsZV9yYW5kPXM/LmdldCgic2VudHJ5LnNhbXBsZV9yYW5kIik/P290KGUpLnNjb3BlPy5nZXRQcm9wYWdhdGlvbkNvbnRleHQoKS5zYW1wbGVSYW5kLnRvU3RyaW5nKCkpLGMoaCksbi5lbWl0KCJjcmVhdGVEc2MiLGgsZSksaH1mdW5jdGlvbiB2dCh0LG49MTAwLGU9MS8wKXt0cnl7cmV0dXJuIF90KCIiLHQsbixlKX1jYXRjaCh0KXtyZXR1cm57RVJST1I6YCoqbm9uLXNlcmlhbGl6YWJsZSoqICgke3R9KWB9fX1mdW5jdGlvbiBfdCh0LG4sZT0xLzAscj0xLzAsbz1mdW5jdGlvbigpe2NvbnN0IHQ9bmV3IFdlYWtTZXQ7ZnVuY3Rpb24gbihuKXtyZXR1cm4hIXQuaGFzKG4pfHwodC5hZGQobiksITEpfWZ1bmN0aW9uIGUobil7dC5kZWxldGUobil9cmV0dXJuW24sZV19KCkpe2NvbnN0W3MsaV09bztpZihudWxsPT1ufHxbImJvb2xlYW4iLCJzdHJpbmciXS5pbmNsdWRlcyh0eXBlb2Ygbil8fCJudW1iZXIiPT10eXBlb2YgbiYmTnVtYmVyLmlzRmluaXRlKG4pKXJldHVybiBuO2NvbnN0IGM9ZnVuY3Rpb24odCxuKXt0cnl7aWYoImRvbWFpbiI9PT10JiZuJiYib2JqZWN0Ij09dHlwZW9mIG4mJm4uVSlyZXR1cm4iW0RvbWFpbl0iO2lmKCJkb21haW5FbWl0dGVyIj09PXQpcmV0dXJuIltEb21haW5FbWl0dGVyXSI7aWYoInVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWwmJm49PT1nbG9iYWwpcmV0dXJuIltHbG9iYWxdIjtpZigidW5kZWZpbmVkIiE9dHlwZW9mIHdpbmRvdyYmbj09PXdpbmRvdylyZXR1cm4iW1dpbmRvd10iO2lmKCJ1bmRlZmluZWQiIT10eXBlb2YgZG9jdW1lbnQmJm49PT1kb2N1bWVudClyZXR1cm4iW0RvY3VtZW50XSI7aWYoIm9iamVjdCI9PXR5cGVvZihlPW4pJiZudWxsIT09ZSYmKGUuX19pc1Z1ZXx8ZS5NKSlyZXR1cm4iW1Z1ZVZpZXdNb2RlbF0iO2lmKGZ1bmN0aW9uKHQpe3JldHVybiBUKHQpJiYibmF0aXZlRXZlbnQiaW4gdCYmInByZXZlbnREZWZhdWx0ImluIHQmJiJzdG9wUHJvcGFnYXRpb24iaW4gdH0obikpcmV0dXJuIltTeW50aGV0aWNFdmVudF0iO2lmKCJudW1iZXIiPT10eXBlb2YgbiYmIU51bWJlci5pc0Zpbml0ZShuKSlyZXR1cm5gWyR7bn1dYDtpZigiZnVuY3Rpb24iPT10eXBlb2YgbilyZXR1cm5gW0Z1bmN0aW9uOiAke2Z1bmN0aW9uKHQpe3RyeXtyZXR1cm4gdCYmImZ1bmN0aW9uIj09dHlwZW9mIHQmJnQubmFtZXx8eH1jYXRjaHtyZXR1cm4geH19KG4pfV1gO2lmKCJzeW1ib2wiPT10eXBlb2YgbilyZXR1cm5gWyR7U3RyaW5nKG4pfV1gO2lmKCJiaWdpbnQiPT10eXBlb2YgbilyZXR1cm5gW0JpZ0ludDogJHtTdHJpbmcobil9XWA7Y29uc3Qgcj1mdW5jdGlvbih0KXtjb25zdCBuPU9iamVjdC5nZXRQcm90b3R5cGVPZih0KTtyZXR1cm4gbj8uY29uc3RydWN0b3I/bi5jb25zdHJ1Y3Rvci5uYW1lOiJudWxsIHByb3RvdHlwZSJ9KG4pO3JldHVybi9eSFRNTChcdyopRWxlbWVudCQvLnRlc3Qocik/YFtIVE1MRWxlbWVudDogJHtyfV1gOmBbb2JqZWN0ICR7cn1dYH1jYXRjaCh0KXtyZXR1cm5gKipub24tc2VyaWFsaXphYmxlKiogKCR7dH0pYH12YXIgZX0odCxuKTtpZighYy5zdGFydHNXaXRoKCJbb2JqZWN0ICIpKXJldHVybiBjO2lmKG4uX19zZW50cnlfc2tpcF9ub3JtYWxpemF0aW9uX18pcmV0dXJuIG47Y29uc3QgdT0ibnVtYmVyIj09dHlwZW9mIG4uX19zZW50cnlfb3ZlcnJpZGVfbm9ybWFsaXphdGlvbl9kZXB0aF9fP24uX19zZW50cnlfb3ZlcnJpZGVfbm9ybWFsaXphdGlvbl9kZXB0aF9fOmU7aWYoMD09PXUpcmV0dXJuIGMucmVwbGFjZSgib2JqZWN0ICIsIiIpO2lmKHMobikpcmV0dXJuIltDaXJjdWxhciB+XSI7Y29uc3QgYT1uO2lmKGEmJiJmdW5jdGlvbiI9PXR5cGVvZiBhLnRvSlNPTil0cnl7cmV0dXJuIF90KCIiLGEudG9KU09OKCksdS0xLHIsbyl9Y2F0Y2h7fWNvbnN0IGY9QXJyYXkuaXNBcnJheShuKT9bXTp7fTtsZXQgaD0wO2NvbnN0IHA9RChuKTtmb3IoY29uc3QgdCBpbiBwKXtpZighT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHAsdCkpY29udGludWU7aWYoaD49cil7Zlt0XT0iW01heFByb3BlcnRpZXMgfl0iO2JyZWFrfWNvbnN0IG49cFt0XTtmW3RdPV90KHQsbix1LTEscixvKSxoKyt9cmV0dXJuIGkobiksZn1mdW5jdGlvbiB3dCh0LG4pe2NvbnN0IGU9bi5yZXBsYWNlKC9cXC9nLCIvIikucmVwbGFjZSgvW3xcXHt9KClbXF1eJCsqPy5dL2csIlxcJCYiKTtsZXQgcj10O3RyeXtyPWRlY29kZVVSSSh0KX1jYXRjaHt9cmV0dXJuIHIucmVwbGFjZSgvXFwvZywiLyIpLnJlcGxhY2UoL3dlYnBhY2s6XC8/L2csIiIpLnJlcGxhY2UobmV3IFJlZ0V4cChgKGZpbGU6Ly8pPy8qJHtlfS8qYCwiaWciKSwiYXBwOi8vLyIpfWZ1bmN0aW9uIFN0KHQsbj1bXSl7cmV0dXJuW3Qsbl19ZnVuY3Rpb24gJHQodCxuKXtjb25zdCBlPXRbMV07Zm9yKGNvbnN0IHQgb2YgZSl7aWYobih0LHRbMF0udHlwZSkpcmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gRXQodCl7Y29uc3Qgbj1tKHApO3JldHVybiBuLmVuY29kZVBvbHlmaWxsP24uZW5jb2RlUG9seWZpbGwodCk6KG5ldyBUZXh0RW5jb2RlcikuZW5jb2RlKHQpfWZ1bmN0aW9uIHh0KHQpe2NvbnN0W24sZV09dDtsZXQgcj1KU09OLnN0cmluZ2lmeShuKTtmdW5jdGlvbiBvKHQpeyJzdHJpbmciPT10eXBlb2Ygcj9yPSJzdHJpbmciPT10eXBlb2YgdD9yK3Q6W0V0KHIpLHRdOnIucHVzaCgic3RyaW5nIj09dHlwZW9mIHQ/RXQodCk6dCl9Zm9yKGNvbnN0IHQgb2YgZSl7Y29uc3RbbixlXT10O2lmKG8oYFxuJHtKU09OLnN0cmluZ2lmeShuKX1cbmApLCJzdHJpbmciPT10eXBlb2YgZXx8ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpbyhlKTtlbHNle2xldCB0O3RyeXt0PUpTT04uc3RyaW5naWZ5KGUpfWNhdGNoe3Q9SlNPTi5zdHJpbmdpZnkodnQoZSkpfW8odCl9fXJldHVybiJzdHJpbmciPT10eXBlb2Ygcj9yOmZ1bmN0aW9uKHQpe2NvbnN0IG49dC5yZWR1Y2UoKHQsbik9PnQrbi5sZW5ndGgsMCksZT1uZXcgVWludDhBcnJheShuKTtsZXQgcj0wO2Zvcihjb25zdCBuIG9mIHQpZS5zZXQobixyKSxyKz1uLmxlbmd0aDtyZXR1cm4gZX0ocil9Y29uc3QgTnQ9e3Nlc3Npb246InNlc3Npb24iLHNlc3Npb25zOiJzZXNzaW9uIixhdHRhY2htZW50OiJhdHRhY2htZW50Iix0cmFuc2FjdGlvbjoidHJhbnNhY3Rpb24iLGV2ZW50OiJlcnJvciIsY2xpZW50X3JlcG9ydDoiaW50ZXJuYWwiLHVzZXJfcmVwb3J0OiJkZWZhdWx0Iixwcm9maWxlOiJwcm9maWxlIixwcm9maWxlX2NodW5rOiJwcm9maWxlIixyZXBsYXlfZXZlbnQ6InJlcGxheSIscmVwbGF5X3JlY29yZGluZzoicmVwbGF5IixjaGVja19pbjoibW9uaXRvciIsZmVlZGJhY2s6ImZlZWRiYWNrIixzcGFuOiJzcGFuIixyYXdfc2VjdXJpdHk6InNlY3VyaXR5Iixsb2c6ImxvZ19pdGVtIn07ZnVuY3Rpb24gQ3QodCl7aWYoIXQ/LnNkaylyZXR1cm47Y29uc3R7bmFtZTpuLHZlcnNpb246ZX09dC5zZGs7cmV0dXJue25hbWU6bix2ZXJzaW9uOmV9fWZ1bmN0aW9uIGt0KHQsbixlLHIpe2NvbnN0IG89Q3QoZSkscz10LnR5cGUmJiJyZXBsYXlfZXZlbnQiIT09dC50eXBlP3QudHlwZToiZXZlbnQiOyFmdW5jdGlvbih0LG4pe2lmKCFuKXJldHVybiB0O2NvbnN0IGU9dC5zZGt8fHt9O3Quc2RrPXsuLi5lLG5hbWU6ZS5uYW1lfHxuLm5hbWUsdmVyc2lvbjplLnZlcnNpb258fG4udmVyc2lvbixpbnRlZ3JhdGlvbnM6Wy4uLnQuc2RrPy5pbnRlZ3JhdGlvbnN8fFtdLC4uLm4uaW50ZWdyYXRpb25zfHxbXV0scGFja2FnZXM6Wy4uLnQuc2RrPy5wYWNrYWdlc3x8W10sLi4ubi5wYWNrYWdlc3x8W11dLHNldHRpbmdzOnQuc2RrPy5zZXR0aW5nc3x8bi5zZXR0aW5ncz97Li4udC5zZGs/LnNldHRpbmdzLC4uLm4uc2V0dGluZ3N9OnZvaWQgMH19KHQsZT8uc2RrKTtjb25zdCBpPWZ1bmN0aW9uKHQsbixlLHIpe2NvbnN0IG89dC5zZGtQcm9jZXNzaW5nTWV0YWRhdGE/LmR5bmFtaWNTYW1wbGluZ0NvbnRleHQ7cmV0dXJue2V2ZW50X2lkOnQuZXZlbnRfaWQsc2VudF9hdDoobmV3IERhdGUpLnRvSVNPU3RyaW5nKCksLi4ubiYme3NkazpufSwuLi4hIWUmJnImJntkc246YXQocil9LC4uLm8mJnt0cmFjZTpvfX19KHQsbyxyLG4pO2RlbGV0ZSB0LnNka1Byb2Nlc3NpbmdNZXRhZGF0YTtyZXR1cm4gU3QoaSxbW3t0eXBlOnN9LHRdXSl9Y29uc3QgVHQ9Il9fU0VOVFJZX1NVUFBSRVNTX1RSQUNJTkdfXyI7ZnVuY3Rpb24ganQodCl7Y29uc3Qgbj1ldChkKCkpO3JldHVybiBuLnN1cHByZXNzVHJhY2luZz9uLnN1cHByZXNzVHJhY2luZyh0KTpmdW5jdGlvbiguLi50KXtjb25zdCBuPWV0KGQoKSk7aWYoMj09PXQubGVuZ3RoKXtjb25zdFtlLHJdPXQ7cmV0dXJuIGU/bi53aXRoU2V0U2NvcGUoZSxyKTpuLndpdGhTY29wZShyKX1yZXR1cm4gbi53aXRoU2NvcGUodFswXSl9KG49PntuLnNldFNES1Byb2Nlc3NpbmdNZXRhZGF0YSh7W1R0XTohMH0pO2NvbnN0IGU9dCgpO3JldHVybiBuLnNldFNES1Byb2Nlc3NpbmdNZXRhZGF0YSh7W1R0XTp2b2lkIDB9KSxlfSl9ZnVuY3Rpb24gSXQodCl7cmV0dXJuIG5ldyBPdChuPT57bih0KX0pfWNsYXNzIE90e2NvbnN0cnVjdG9yKHQpe3RoaXMuTD0wLHRoaXMuQj1bXSx0aGlzLkcodCl9dGhlbih0LG4pe3JldHVybiBuZXcgT3QoKGUscik9Pnt0aGlzLkIucHVzaChbITEsbj0+e2lmKHQpdHJ5e2UodChuKSl9Y2F0Y2godCl7cih0KX1lbHNlIGUobil9LHQ9PntpZihuKXRyeXtlKG4odCkpfWNhdGNoKHQpe3IodCl9ZWxzZSByKHQpfV0pLHRoaXMuSCgpfSl9Y2F0Y2godCl7cmV0dXJuIHRoaXMudGhlbih0PT50LHQpfWZpbmFsbHkodCl7cmV0dXJuIG5ldyBPdCgobixlKT0+e2xldCByLG87cmV0dXJuIHRoaXMudGhlbihuPT57bz0hMSxyPW4sdCYmdCgpfSxuPT57bz0hMCxyPW4sdCYmdCgpfSkudGhlbigoKT0+e28/ZShyKTpuKHIpfSl9KX1IKCl7aWYoMD09PXRoaXMuTClyZXR1cm47Y29uc3QgdD10aGlzLkIuc2xpY2UoKTt0aGlzLkI9W10sdC5mb3JFYWNoKHQ9Pnt0WzBdfHwoMT09PXRoaXMuTCYmdFsxXSh0aGlzLkopLDI9PT10aGlzLkwmJnRbMl0odGhpcy5KKSx0WzBdPSEwKX0pfUcodCl7Y29uc3Qgbj0odCxuKT0+ezA9PT10aGlzLkwmJihqKG4pP24udGhlbihlLHIpOih0aGlzLkw9dCx0aGlzLko9bix0aGlzLkgoKSkpfSxlPXQ9PntuKDEsdCl9LHI9dD0+e24oMix0KX07dHJ5e3QoZSxyKX1jYXRjaCh0KXtyKHQpfX19ZnVuY3Rpb24gUnQodCxuKXtjb25zdHtmaW5nZXJwcmludDplLHNwYW46cixicmVhZGNydW1iczpvLHNka1Byb2Nlc3NpbmdNZXRhZGF0YTpzfT1uOyFmdW5jdGlvbih0LG4pe2NvbnN0e2V4dHJhOmUsdGFnczpyLHVzZXI6byxjb250ZXh0czpzLGxldmVsOmksdHJhbnNhY3Rpb25OYW1lOmN9PW47T2JqZWN0LmtleXMoZSkubGVuZ3RoJiYodC5leHRyYT17Li4uZSwuLi50LmV4dHJhfSk7T2JqZWN0LmtleXMocikubGVuZ3RoJiYodC50YWdzPXsuLi5yLC4uLnQudGFnc30pO09iamVjdC5rZXlzKG8pLmxlbmd0aCYmKHQudXNlcj17Li4ubywuLi50LnVzZXJ9KTtPYmplY3Qua2V5cyhzKS5sZW5ndGgmJih0LmNvbnRleHRzPXsuLi5zLC4uLnQuY29udGV4dHN9KTtpJiYodC5sZXZlbD1pKTtjJiYidHJhbnNhY3Rpb24iIT09dC50eXBlJiYodC50cmFuc2FjdGlvbj1jKX0odCxuKSxyJiZmdW5jdGlvbih0LG4pe3QuY29udGV4dHM9e3RyYWNlOmh0KG4pLC4uLnQuY29udGV4dHN9LHQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhPXtkeW5hbWljU2FtcGxpbmdDb250ZXh0OmJ0KG4pLC4uLnQuc2RrUHJvY2Vzc2luZ01ldGFkYXRhfTtjb25zdCBlPXl0KG4pLHI9bXQoZSkuZGVzY3JpcHRpb247ciYmIXQudHJhbnNhY3Rpb24mJiJ0cmFuc2FjdGlvbiI9PT10LnR5cGUmJih0LnRyYW5zYWN0aW9uPXIpfSh0LHIpLGZ1bmN0aW9uKHQsbil7dC5maW5nZXJwcmludD10LmZpbmdlcnByaW50P0FycmF5LmlzQXJyYXkodC5maW5nZXJwcmludCk/dC5maW5nZXJwcmludDpbdC5maW5nZXJwcmludF06W10sbiYmKHQuZmluZ2VycHJpbnQ9dC5maW5nZXJwcmludC5jb25jYXQobikpO3QuZmluZ2VycHJpbnQubGVuZ3RofHxkZWxldGUgdC5maW5nZXJwcmludH0odCxlKSxmdW5jdGlvbih0LG4pe2NvbnN0IGU9Wy4uLnQuYnJlYWRjcnVtYnN8fFtdLC4uLm5dO3QuYnJlYWRjcnVtYnM9ZS5sZW5ndGg/ZTp2b2lkIDB9KHQsbyksZnVuY3Rpb24odCxuKXt0LnNka1Byb2Nlc3NpbmdNZXRhZGF0YT17Li4udC5zZGtQcm9jZXNzaW5nTWV0YWRhdGEsLi4ubn19KHQscyl9Y29uc3QgQXQ9U3ltYm9sLmZvcigiU2VudHJ5QnVmZmVyRnVsbEVycm9yIik7ZnVuY3Rpb24gRHQodCl7Y29uc3Qgbj1bXTtmdW5jdGlvbiBlKHQpe3JldHVybiBuLnNwbGljZShuLmluZGV4T2YodCksMSlbMF18fFByb21pc2UucmVzb2x2ZSh2b2lkIDApfXJldHVybnskOm4sYWRkOmZ1bmN0aW9uKHIpe2lmKCEodm9pZCAwPT09dHx8bi5sZW5ndGg8dCkpcmV0dXJuIG89QXQsbmV3IE90KCh0LG4pPT57bihvKX0pO3ZhciBvO2NvbnN0IHM9cigpO3JldHVybi0xPT09bi5pbmRleE9mKHMpJiZuLnB1c2gocykscy50aGVuKCgpPT5lKHMpKS50aGVuKG51bGwsKCk9PmUocykudGhlbihudWxsLCgpPT57fSkpLHN9LGRyYWluOmZ1bmN0aW9uKHQpe3JldHVybiBuZXcgT3QoKGUscik9PntsZXQgbz1uLmxlbmd0aDtpZighbylyZXR1cm4gZSghMCk7Y29uc3Qgcz1zZXRUaW1lb3V0KCgpPT57dCYmdD4wJiZlKCExKX0sdCk7bi5mb3JFYWNoKHQ9PntJdCh0KS50aGVuKCgpPT57LS1vfHwoY2xlYXJUaW1lb3V0KHMpLGUoITApKX0scil9KX0pfX19ZnVuY3Rpb24gUHQodCx7c3RhdHVzQ29kZTpuLGhlYWRlcnM6ZX0scj1EYXRlLm5vdygpKXtjb25zdCBvPXsuLi50fSxzPWU/LlsieC1zZW50cnktcmF0ZS1saW1pdHMiXSxpPWU/LlsicmV0cnktYWZ0ZXIiXTtpZihzKWZvcihjb25zdCB0IG9mIHMudHJpbSgpLnNwbGl0KCIsIikpe2NvbnN0W24sZSwsLHNdPXQuc3BsaXQoIjoiLDUpLGk9cGFyc2VJbnQobiwxMCksYz0xZTMqKGlzTmFOKGkpPzYwOmkpO2lmKGUpZm9yKGNvbnN0IHQgb2YgZS5zcGxpdCgiOyIpKSJtZXRyaWNfYnVja2V0Ij09PXQmJnMmJiFzLnNwbGl0KCI7IikuaW5jbHVkZXMoImN1c3RvbSIpfHwob1t0XT1yK2MpO2Vsc2Ugby5hbGw9citjfWVsc2UgaT9vLmFsbD1yK2Z1bmN0aW9uKHQsbj1EYXRlLm5vdygpKXtjb25zdCBlPXBhcnNlSW50KGAke3R9YCwxMCk7aWYoIWlzTmFOKGUpKXJldHVybiAxZTMqZTtjb25zdCByPURhdGUucGFyc2UoYCR7dH1gKTtyZXR1cm4gaXNOYU4ocik/NmU0OnItbn0oaSxyKTo0Mjk9PT1uJiYoby5hbGw9cis2ZTQpO3JldHVybiBvfWZ1bmN0aW9uIFV0KHQsbixlPUR0KHQuYnVmZmVyU2l6ZXx8NjQpKXtsZXQgcj17fTtyZXR1cm57c2VuZDpmdW5jdGlvbih0KXtjb25zdCBvPVtdO2lmKCR0KHQsKHQsbik9Pntjb25zdCBlPWZ1bmN0aW9uKHQpe3JldHVybiBOdFt0XX0obik7KGZ1bmN0aW9uKHQsbixlPURhdGUubm93KCkpe3JldHVybiBmdW5jdGlvbih0LG4pe3JldHVybiB0W25dfHx0LmFsbHx8MH0odCxuKT5lfSkocixlKXx8by5wdXNoKHQpfSksMD09PW8ubGVuZ3RoKXJldHVybiBJdCh7fSk7Y29uc3Qgcz1TdCh0WzBdLG8pLGk9dD0+eyR0KHMsKHQsbik9Pnt9KX07cmV0dXJuIGUuYWRkKCgpPT5uKHtib2R5Onh0KHMpfSkudGhlbih0PT4odm9pZCAwIT09dC5zdGF0dXNDb2RlJiYodC5zdGF0dXNDb2RlPDIwMHx8dC5zdGF0dXNDb2RlPj0zMDApJiZoJiZTLndhcm4oYFNlbnRyeSByZXNwb25kZWQgd2l0aCBzdGF0dXMgY29kZSAke3Quc3RhdHVzQ29kZX0gdG8gc2VudCBldmVudC5gKSxyPVB0KHIsdCksdCksdD0+e3Rocm93IGkoKSxoJiZTLmVycm9yKCJFbmNvdW50ZXJlZCBlcnJvciBydW5uaW5nIHRyYW5zcG9ydCByZXF1ZXN0OiIsdCksdH0pKS50aGVuKHQ9PnQsdD0+e2lmKHQ9PT1BdClyZXR1cm4gaCYmUy5lcnJvcigiU2tpcHBlZCBzZW5kaW5nIGV2ZW50IGJlY2F1c2UgYnVmZmVyIGlzIGZ1bGwuIiksaSgpLEl0KHt9KTt0aHJvdyB0fSl9LGZsdXNoOnQ9PmUuZHJhaW4odCl9fWNvbnN0IE10PS9eKFxTKzpcXHxcLz8pKFtcc1xTXSo/KSgoPzpcLnsxLDJ9fFteL1xcXSs/fCkoXC5bXi4vXFxdKnwpKSg/OlsvXFxdKikkLztmdW5jdGlvbiBMdCh0KXtjb25zdCBuPWZ1bmN0aW9uKHQpe2NvbnN0IG49dC5sZW5ndGg+MTAyND9gPHRydW5jYXRlZD4ke3Quc2xpY2UoLTEwMjQpfWA6dCxlPU10LmV4ZWMobik7cmV0dXJuIGU/ZS5zbGljZSgxKTpbXX0odCksZT1uWzBdfHwiIjtsZXQgcj1uWzFdO3JldHVybiBlfHxyPyhyJiYocj1yLnNsaWNlKDAsci5sZW5ndGgtMSkpLGUrcik6Ii4ifWZ1bmN0aW9uIEJ0KHQsbj0hMSl7cmV0dXJuIShufHx0JiYhdC5zdGFydHNXaXRoKCIvIikmJiF0Lm1hdGNoKC9eW0EtWl06LykmJiF0LnN0YXJ0c1dpdGgoIi4iKSYmIXQubWF0Y2goL15bYS16QS1aXShbYS16QS1aMC05LlwtK10pKjpcL1wvLykpJiZ2b2lkIDAhPT10JiYhdC5pbmNsdWRlcygibm9kZV9tb2R1bGVzLyIpfWNvbnN0IEd0PVN5bWJvbCgiQWdlbnRCYXNlSW50ZXJuYWxTdGF0ZSIpO2NsYXNzIEh0IGV4dGVuZHMgcy5BZ2VudHtjb25zdHJ1Y3Rvcih0KXtzdXBlcih0KSx0aGlzW0d0XT17fX1pc1NlY3VyZUVuZHBvaW50KHQpe2lmKHQpe2lmKCJib29sZWFuIj09dHlwZW9mIHQuc2VjdXJlRW5kcG9pbnQpcmV0dXJuIHQuc2VjdXJlRW5kcG9pbnQ7aWYoInN0cmluZyI9PXR5cGVvZiB0LnByb3RvY29sKXJldHVybiJodHRwczoiPT09dC5wcm90b2NvbH1jb25zdHtzdGFjazpufT1uZXcgRXJyb3I7cmV0dXJuInN0cmluZyI9PXR5cGVvZiBuJiZuLnNwbGl0KCJcbiIpLnNvbWUodD0+LTEhPT10LmluZGV4T2YoIihodHRwcy5qczoiKXx8LTEhPT10LmluZGV4T2YoIm5vZGU6aHR0cHM6IikpfWNyZWF0ZVNvY2tldCh0LG4sZSl7Y29uc3Qgcj17Li4ubixzZWN1cmVFbmRwb2ludDp0aGlzLmlzU2VjdXJlRW5kcG9pbnQobil9O1Byb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PnRoaXMuY29ubmVjdCh0LHIpKS50aGVuKG89PntpZihvIGluc3RhbmNlb2Ygcy5BZ2VudClyZXR1cm4gby5hZGRSZXF1ZXN0KHQscik7dGhpc1tHdF0uY3VycmVudFNvY2tldD1vLHN1cGVyLmNyZWF0ZVNvY2tldCh0LG4sZSl9LGUpfWNyZWF0ZUNvbm5lY3Rpb24oKXtjb25zdCB0PXRoaXNbR3RdLmN1cnJlbnRTb2NrZXQ7aWYodGhpc1tHdF0uY3VycmVudFNvY2tldD12b2lkIDAsIXQpdGhyb3cgbmV3IEVycm9yKCJObyBzb2NrZXQgd2FzIHJldHVybmVkIGluIHRoZSBgY29ubmVjdCgpYCBmdW5jdGlvbiIpO3JldHVybiB0fWdldCBkZWZhdWx0UG9ydCgpe3JldHVybiB0aGlzW0d0XS5kZWZhdWx0UG9ydD8/KCJodHRwczoiPT09dGhpcy5wcm90b2NvbD80NDM6ODApfXNldCBkZWZhdWx0UG9ydCh0KXt0aGlzW0d0XSYmKHRoaXNbR3RdLmRlZmF1bHRQb3J0PXQpfWdldCBwcm90b2NvbCgpe3JldHVybiB0aGlzW0d0XS5wcm90b2NvbD8/KHRoaXMuaXNTZWN1cmVFbmRwb2ludCgpPyJodHRwczoiOiJodHRwOiIpfXNldCBwcm90b2NvbCh0KXt0aGlzW0d0XSYmKHRoaXNbR3RdLnByb3RvY29sPXQpfX1mdW5jdGlvbiBKdCguLi50KXtTLmxvZygiW2h0dHBzLXByb3h5LWFnZW50OnBhcnNlLXByb3h5LXJlc3BvbnNlXSIsLi4udCl9ZnVuY3Rpb24genQodCl7cmV0dXJuIG5ldyBQcm9taXNlKChuLGUpPT57bGV0IHI9MDtjb25zdCBvPVtdO2Z1bmN0aW9uIHMoKXtjb25zdCBjPXQucmVhZCgpO2M/ZnVuY3Rpb24oYyl7by5wdXNoKGMpLHIrPWMubGVuZ3RoO2NvbnN0IHU9QnVmZmVyLmNvbmNhdChvLHIpLGE9dS5pbmRleE9mKCJcclxuXHJcbiIpO2lmKC0xPT09YSlyZXR1cm4gSnQoImhhdmUgbm90IHJlY2VpdmVkIGVuZCBvZiBIVFRQIGhlYWRlcnMgeWV0Li4uIiksdm9pZCBzKCk7Y29uc3QgZj11LnN1YmFycmF5KDAsYSkudG9TdHJpbmcoImFzY2lpIikuc3BsaXQoIlxyXG4iKSxoPWYuc2hpZnQoKTtpZighaClyZXR1cm4gdC5kZXN0cm95KCksZShuZXcgRXJyb3IoIk5vIGhlYWRlciByZWNlaXZlZCBmcm9tIHByb3h5IENPTk5FQ1QgcmVzcG9uc2UiKSk7Y29uc3QgcD1oLnNwbGl0KCIgIiksbD0rKHBbMV18fDApLGQ9cC5zbGljZSgyKS5qb2luKCIgIiksbT17fTtmb3IoY29uc3QgbiBvZiBmKXtpZighbiljb250aW51ZTtjb25zdCByPW4uaW5kZXhPZigiOiIpO2lmKC0xPT09cilyZXR1cm4gdC5kZXN0cm95KCksZShuZXcgRXJyb3IoYEludmFsaWQgaGVhZGVyIGZyb20gcHJveHkgQ09OTkVDVCByZXNwb25zZTogIiR7bn0iYCkpO2NvbnN0IG89bi5zbGljZSgwLHIpLnRvTG93ZXJDYXNlKCkscz1uLnNsaWNlKHIrMSkudHJpbVN0YXJ0KCksaT1tW29dOyJzdHJpbmciPT10eXBlb2YgaT9tW29dPVtpLHNdOkFycmF5LmlzQXJyYXkoaSk/aS5wdXNoKHMpOm1bb109c31KdCgiZ290IHByb3h5IHNlcnZlciByZXNwb25zZTogJW8gJW8iLGgsbSksaSgpLG4oe2Nvbm5lY3Q6e3N0YXR1c0NvZGU6bCxzdGF0dXNUZXh0OmQsaGVhZGVyczptfSxidWZmZXJlZDp1fSl9KGMpOnQub25jZSgicmVhZGFibGUiLHMpfWZ1bmN0aW9uIGkoKXt0LnJlbW92ZUxpc3RlbmVyKCJlbmQiLGMpLHQucmVtb3ZlTGlzdGVuZXIoImVycm9yIix1KSx0LnJlbW92ZUxpc3RlbmVyKCJyZWFkYWJsZSIscyl9ZnVuY3Rpb24gYygpe2koKSxKdCgib25lbmQiKSxlKG5ldyBFcnJvcigiUHJveHkgY29ubmVjdGlvbiBlbmRlZCBiZWZvcmUgcmVjZWl2aW5nIENPTk5FQ1QgcmVzcG9uc2UiKSl9ZnVuY3Rpb24gdSh0KXtpKCksSnQoIm9uZXJyb3IgJW8iLHQpLGUodCl9dC5vbigiZXJyb3IiLHUpLHQub24oImVuZCIsYykscygpfSl9ZnVuY3Rpb24gRnQoLi4udCl7Uy5sb2coIltodHRwcy1wcm94eS1hZ2VudF0iLC4uLnQpfWNsYXNzIFd0IGV4dGVuZHMgSHR7c3RhdGljIF9faW5pdFN0YXRpYygpe3RoaXMucHJvdG9jb2xzPVsiaHR0cCIsImh0dHBzIl19Y29uc3RydWN0b3IodCxuKXtzdXBlcihuKSx0aGlzLm9wdGlvbnM9e30sdGhpcy5wcm94eT0ic3RyaW5nIj09dHlwZW9mIHQ/bmV3IFVSTCh0KTp0LHRoaXMucHJveHlIZWFkZXJzPW4/LmhlYWRlcnM/P3t9LEZ0KCJDcmVhdGluZyBuZXcgSHR0cHNQcm94eUFnZW50IGluc3RhbmNlOiAlbyIsdGhpcy5wcm94eS5ocmVmKTtjb25zdCBlPSh0aGlzLnByb3h5Lmhvc3RuYW1lfHx0aGlzLnByb3h5Lmhvc3QpLnJlcGxhY2UoL15cW3xcXSQvZywiIikscj10aGlzLnByb3h5LnBvcnQ/cGFyc2VJbnQodGhpcy5wcm94eS5wb3J0LDEwKToiaHR0cHM6Ij09PXRoaXMucHJveHkucHJvdG9jb2w/NDQzOjgwO3RoaXMuY29ubmVjdE9wdHM9e0FMUE5Qcm90b2NvbHM6WyJodHRwLzEuMSJdLC4uLm4/S3QobiwiaGVhZGVycyIpOm51bGwsaG9zdDplLHBvcnQ6cn19YXN5bmMgY29ubmVjdCh0LG4pe2NvbnN0e3Byb3h5OmV9PXRoaXM7aWYoIW4uaG9zdCl0aHJvdyBuZXcgVHlwZUVycm9yKCdObyAiaG9zdCIgcHJvdmlkZWQnKTtsZXQgcjtpZigiaHR0cHM6Ij09PWUucHJvdG9jb2wpe0Z0KCJDcmVhdGluZyBgdGxzLlNvY2tldGA6ICVvIix0aGlzLmNvbm5lY3RPcHRzKTtjb25zdCB0PXRoaXMuY29ubmVjdE9wdHMuc2VydmVybmFtZXx8dGhpcy5jb25uZWN0T3B0cy5ob3N0O3I9Zi5jb25uZWN0KHsuLi50aGlzLmNvbm5lY3RPcHRzLHNlcnZlcm5hbWU6dCYmYS5pc0lQKHQpP3ZvaWQgMDp0fSl9ZWxzZSBGdCgiQ3JlYXRpbmcgYG5ldC5Tb2NrZXRgOiAlbyIsdGhpcy5jb25uZWN0T3B0cykscj1hLmNvbm5lY3QodGhpcy5jb25uZWN0T3B0cyk7Y29uc3Qgbz0iZnVuY3Rpb24iPT10eXBlb2YgdGhpcy5wcm94eUhlYWRlcnM/dGhpcy5wcm94eUhlYWRlcnMoKTp7Li4udGhpcy5wcm94eUhlYWRlcnN9LHM9YS5pc0lQdjYobi5ob3N0KT9gWyR7bi5ob3N0fV1gOm4uaG9zdDtsZXQgaT1gQ09OTkVDVCAke3N9OiR7bi5wb3J0fSBIVFRQLzEuMVxyXG5gO2lmKGUudXNlcm5hbWV8fGUucGFzc3dvcmQpe2NvbnN0IHQ9YCR7ZGVjb2RlVVJJQ29tcG9uZW50KGUudXNlcm5hbWUpfToke2RlY29kZVVSSUNvbXBvbmVudChlLnBhc3N3b3JkKX1gO29bIlByb3h5LUF1dGhvcml6YXRpb24iXT1gQmFzaWMgJHtCdWZmZXIuZnJvbSh0KS50b1N0cmluZygiYmFzZTY0Iil9YH1vLkhvc3Q9YCR7c306JHtuLnBvcnR9YCxvWyJQcm94eS1Db25uZWN0aW9uIl18fChvWyJQcm94eS1Db25uZWN0aW9uIl09dGhpcy5rZWVwQWxpdmU/IktlZXAtQWxpdmUiOiJjbG9zZSIpO2Zvcihjb25zdCB0IG9mIE9iamVjdC5rZXlzKG8pKWkrPWAke3R9OiAke29bdF19XHJcbmA7Y29uc3QgYz16dChyKTtyLndyaXRlKGAke2l9XHJcbmApO2NvbnN0e2Nvbm5lY3Q6dSxidWZmZXJlZDpofT1hd2FpdCBjO2lmKHQuZW1pdCgicHJveHlDb25uZWN0Iix1KSx0aGlzLmVtaXQoInByb3h5Q29ubmVjdCIsdSx0KSwyMDA9PT11LnN0YXR1c0NvZGUpe2lmKHQub25jZSgic29ja2V0IixZdCksbi5zZWN1cmVFbmRwb2ludCl7RnQoIlVwZ3JhZGluZyBzb2NrZXQgY29ubmVjdGlvbiB0byBUTFMiKTtjb25zdCB0PW4uc2VydmVybmFtZXx8bi5ob3N0O3JldHVybiBmLmNvbm5lY3Qoey4uLkt0KG4sImhvc3QiLCJwYXRoIiwicG9ydCIpLHNvY2tldDpyLHNlcnZlcm5hbWU6YS5pc0lQKHQpP3ZvaWQgMDp0fSl9cmV0dXJuIHJ9ci5kZXN0cm95KCk7Y29uc3QgcD1uZXcgYS5Tb2NrZXQoe3dyaXRhYmxlOiExfSk7cmV0dXJuIHAucmVhZGFibGU9ITAsdC5vbmNlKCJzb2NrZXQiLHQ9PntGdCgiUmVwbGF5aW5nIHByb3h5IGJ1ZmZlciBmb3IgZmFpbGVkIHJlcXVlc3QiKSx0LnB1c2goaCksdC5wdXNoKG51bGwpfSkscH19ZnVuY3Rpb24gWXQodCl7dC5yZXN1bWUoKX1mdW5jdGlvbiBLdCh0LC4uLm4pe2NvbnN0IGU9e307bGV0IHI7Zm9yKHIgaW4gdCluLmluY2x1ZGVzKHIpfHwoZVtyXT10W3JdKTtyZXR1cm4gZX1XdC5fX2luaXRTdGF0aWMoKTtmdW5jdGlvbiBadCh0KXtyZXR1cm4gdC5yZXBsYWNlKC9eW0EtWl06LywiIikucmVwbGFjZSgvXFwvZywiLyIpfWNvbnN0IFZ0PW47bGV0IHF0LFF0PTAsWHQ9e307ZnVuY3Rpb24gdG4odCl7VnQuZGVidWcmJmNvbnNvbGUubG9nKGBbQU5SIFdvcmtlcl0gJHt0fWApfXZhciBubixlbixybjtjb25zdCBvbj1mdW5jdGlvbih0KXtsZXQgbjt0cnl7bj1uZXcgVVJMKHQudXJsKX1jYXRjaChuKXtyZXR1cm4gYigoKT0+e2NvbnNvbGUud2FybigiW0BzZW50cnkvbm9kZV06IEludmFsaWQgZHNuIG9yIHR1bm5lbCBvcHRpb24sIHdpbGwgbm90IHNlbmQgYW55IGV2ZW50cy4gVGhlIHR1bm5lbCBvcHRpb24gbXVzdCBiZSBhIGZ1bGwgVVJMIHdoZW4gdXNlZC4iKX0pLFV0KHQsKCk9PlByb21pc2UucmVzb2x2ZSh7fSkpfWNvbnN0IGU9Imh0dHBzOiI9PT1uLnByb3RvY29sLHI9ZnVuY3Rpb24odCxuKXtjb25zdHtub19wcm94eTplfT1wcm9jZXNzLmVudixyPWU/LnNwbGl0KCIsIikuc29tZShuPT50Lmhvc3QuZW5kc1dpdGgobil8fHQuaG9zdG5hbWUuZW5kc1dpdGgobikpO3JldHVybiByP3ZvaWQgMDpufShuLHQucHJveHl8fChlP3Byb2Nlc3MuZW52Lmh0dHBzX3Byb3h5OnZvaWQgMCl8fHByb2Nlc3MuZW52Lmh0dHBfcHJveHkpLG89ZT9pOnMsYT12b2lkIDAhPT10LmtlZXBBbGl2ZSYmdC5rZWVwQWxpdmUsZj1yP25ldyBXdChyKTpuZXcgby5BZ2VudCh7a2VlcEFsaXZlOmEsbWF4U29ja2V0czozMCx0aW1lb3V0OjJlM30pLGg9ZnVuY3Rpb24odCxuLGUpe2NvbnN0e2hvc3RuYW1lOnIscGF0aG5hbWU6byxwb3J0OnMscHJvdG9jb2w6aSxzZWFyY2g6YX09bmV3IFVSTCh0LnVybCk7cmV0dXJuIGZ1bmN0aW9uKGYpe3JldHVybiBuZXcgUHJvbWlzZSgoaCxwKT0+e2p0KCgpPT57bGV0IGw9ZnVuY3Rpb24odCl7cmV0dXJuIG5ldyBjKHtyZWFkKCl7dGhpcy5wdXNoKHQpLHRoaXMucHVzaChudWxsKX19KX0oZi5ib2R5KTtjb25zdCBkPXsuLi50LmhlYWRlcnN9O2YuYm9keS5sZW5ndGg+MzI3NjgmJihkWyJjb250ZW50LWVuY29kaW5nIl09Imd6aXAiLGw9bC5waXBlKHUoKSkpO2NvbnN0IG09bi5yZXF1ZXN0KHttZXRob2Q6IlBPU1QiLGFnZW50OmUsaGVhZGVyczpkLGhvc3RuYW1lOnIscGF0aDpgJHtvfSR7YX1gLHBvcnQ6cyxwcm90b2NvbDppLGNhOnQuY2FDZXJ0c30sdD0+e3Qub24oImRhdGEiLCgpPT57fSksdC5vbigiZW5kIiwoKT0+e30pLHQuc2V0RW5jb2RpbmcoInV0ZjgiKTtjb25zdCBuPXQuaGVhZGVyc1sicmV0cnktYWZ0ZXIiXT8/bnVsbCxlPXQuaGVhZGVyc1sieC1zZW50cnktcmF0ZS1saW1pdHMiXT8/bnVsbDtoKHtzdGF0dXNDb2RlOnQuc3RhdHVzQ29kZSxoZWFkZXJzOnsicmV0cnktYWZ0ZXIiOm4sIngtc2VudHJ5LXJhdGUtbGltaXRzIjpBcnJheS5pc0FycmF5KGUpP2VbMF18fG51bGw6ZX19KX0pO20ub24oImVycm9yIixwKSxsLnBpcGUobSl9KX0pfX0odCx0Lmh0dHBNb2R1bGU/P28sZik7cmV0dXJuIFV0KHQsaCl9KHt1cmw6KG5uPVZ0LmRzbixlbj1WdC50dW5uZWwscm49VnQuc2RrTWV0YWRhdGEuc2RrLGVufHxgJHtmdW5jdGlvbih0KXtyZXR1cm5gJHtmdW5jdGlvbih0KXtjb25zdCBuPXQucHJvdG9jb2w/YCR7dC5wcm90b2NvbH06YDoiIixlPXQucG9ydD9gOiR7dC5wb3J0fWA6IiI7cmV0dXJuYCR7bn0vLyR7dC5ob3N0fSR7ZX0ke3QucGF0aD9gLyR7dC5wYXRofWA6IiJ9L2FwaS9gfSh0KX0ke3QucHJvamVjdElkfS9lbnZlbG9wZS9gfShubil9PyR7ZnVuY3Rpb24odCxuKXtjb25zdCBlPXtzZW50cnlfdmVyc2lvbjoiNyJ9O3JldHVybiB0LnB1YmxpY0tleSYmKGUuc2VudHJ5X2tleT10LnB1YmxpY0tleSksbiYmKGUuc2VudHJ5X2NsaWVudD1gJHtuLm5hbWV9LyR7bi52ZXJzaW9ufWApLG5ldyBVUkxTZWFyY2hQYXJhbXMoZSkudG9TdHJpbmcoKX0obm4scm4pfWApfSk7YXN5bmMgZnVuY3Rpb24gc24oKXtpZihxdCl7dG4oIlNlbmRpbmcgYWJub3JtYWwgc2Vzc2lvbiIpLEoocXQse3N0YXR1czoiYWJub3JtYWwiLGFibm9ybWFsX21lY2hhbmlzbToiYW5yX2ZvcmVncm91bmQiLHJlbGVhc2U6VnQucmVsZWFzZSxlbnZpcm9ubWVudDpWdC5lbnZpcm9ubWVudH0pO2NvbnN0IHQ9ZnVuY3Rpb24odCxuLGUscil7Y29uc3Qgbz1DdChlKTtyZXR1cm4gU3Qoe3NlbnRfYXQ6KG5ldyBEYXRlKS50b0lTT1N0cmluZygpLC4uLm8mJntzZGs6b30sLi4uISFyJiZuJiZ7ZHNuOmF0KG4pfX0sWyJhZ2dyZWdhdGVzImluIHQ/W3t0eXBlOiJzZXNzaW9ucyJ9LHRdOlt7dHlwZToic2Vzc2lvbiJ9LHQudG9KU09OKCldXSl9KHF0LFZ0LmRzbixWdC5zZGtNZXRhZGF0YSxWdC50dW5uZWwpO3RuKEpTT04uc3RyaW5naWZ5KHQpKSxhd2FpdCBvbi5zZW5kKHQpO3RyeXtlPy5wb3N0TWVzc2FnZSgic2Vzc2lvbi1lbmRlZCIpfWNhdGNoe319fWZ1bmN0aW9uIGNuKHQpe2lmKCF0KXJldHVybjtjb25zdCBuPWZ1bmN0aW9uKHQpe2lmKCF0Lmxlbmd0aClyZXR1cm5bXTtjb25zdCBuPUFycmF5LmZyb20odCk7cmV0dXJuL3NlbnRyeVdyYXBwZWQvLnRlc3QoRShuKS5mdW5jdGlvbnx8IiIpJiZuLnBvcCgpLG4ucmV2ZXJzZSgpLCQudGVzdChFKG4pLmZ1bmN0aW9ufHwiIikmJihuLnBvcCgpLCQudGVzdChFKG4pLmZ1bmN0aW9ufHwiIikmJm4ucG9wKCkpLG4uc2xpY2UoMCw1MCkubWFwKHQ9Pih7Li4udCxmaWxlbmFtZTp0LmZpbGVuYW1lfHxFKG4pLmZpbGVuYW1lLGZ1bmN0aW9uOnQuZnVuY3Rpb258fCI/In0pKX0odCk7aWYoVnQuYXBwUm9vdFBhdGgpZm9yKGNvbnN0IHQgb2Ygbil0LmZpbGVuYW1lJiYodC5maWxlbmFtZT13dCh0LmZpbGVuYW1lLFZ0LmFwcFJvb3RQYXRoKSk7cmV0dXJuIG59YXN5bmMgZnVuY3Rpb24gdW4odCxuKXtpZihRdD49VnQubWF4QW5yRXZlbnRzKXJldHVybjtRdCs9MSxhd2FpdCBzbigpLHRuKCJTZW5kaW5nIGV2ZW50Iik7Y29uc3QgZT17ZXZlbnRfaWQ6TSgpLGNvbnRleHRzOlZ0LmNvbnRleHRzLHJlbGVhc2U6VnQucmVsZWFzZSxlbnZpcm9ubWVudDpWdC5lbnZpcm9ubWVudCxkaXN0OlZ0LmRpc3QscGxhdGZvcm06Im5vZGUiLGxldmVsOiJlcnJvciIsZXhjZXB0aW9uOnt2YWx1ZXM6W3t0eXBlOiJBcHBsaWNhdGlvbk5vdFJlc3BvbmRpbmciLHZhbHVlOmBBcHBsaWNhdGlvbiBOb3QgUmVzcG9uZGluZyBmb3IgYXQgbGVhc3QgJHtWdC5hbnJUaHJlc2hvbGR9IG1zYCxzdGFja3RyYWNlOntmcmFtZXM6Y24odCl9LG1lY2hhbmlzbTp7dHlwZToiQU5SIn19XX0sdGFnczpWdC5zdGF0aWNUYWdzfTtuJiZmdW5jdGlvbih0LG4pe2lmKFJ0KHQsbiksIXQuY29udGV4dHM/LnRyYWNlKXtjb25zdHt0cmFjZUlkOmUscGFyZW50U3BhbklkOnIscHJvcGFnYXRpb25TcGFuSWQ6b309bi5wcm9wYWdhdGlvbkNvbnRleHQ7dC5jb250ZXh0cz17dHJhY2U6e3RyYWNlX2lkOmUsc3Bhbl9pZDpvfHxXKCkscGFyZW50X3NwYW5faWQ6cn0sLi4udC5jb250ZXh0c319fShlLG4pLGZ1bmN0aW9uKHQpe2lmKDA9PT1PYmplY3Qua2V5cyhYdCkubGVuZ3RoKXJldHVybjtjb25zdCBuPVZ0LmFwcFJvb3RQYXRoP3t9Olh0O2lmKFZ0LmFwcFJvb3RQYXRoKWZvcihjb25zdFt0LGVdb2YgT2JqZWN0LmVudHJpZXMoWHQpKW5bd3QodCxWdC5hcHBSb290UGF0aCldPWU7Y29uc3QgZT1uZXcgTWFwO2Zvcihjb25zdCByIG9mIHQuZXhjZXB0aW9uPy52YWx1ZXN8fFtdKWZvcihjb25zdCB0IG9mIHIuc3RhY2t0cmFjZT8uZnJhbWVzfHxbXSl7Y29uc3Qgcj10LmFic19wYXRofHx0LmZpbGVuYW1lO3ImJm5bcl0mJmUuc2V0KHIsbltyXSl9aWYoZS5zaXplPjApe2NvbnN0IG49W107Zm9yKGNvbnN0W3Qscl1vZiBlLmVudHJpZXMoKSluLnB1c2goe3R5cGU6InNvdXJjZW1hcCIsY29kZV9maWxlOnQsZGVidWdfaWQ6cn0pO3QuZGVidWdfbWV0YT17aW1hZ2VzOm59fX0oZSk7Y29uc3Qgcj1rdChlLFZ0LmRzbixWdC5zZGtNZXRhZGF0YSxWdC50dW5uZWwpO3RuKEpTT04uc3RyaW5naWZ5KHIpKSxhd2FpdCBvbi5zZW5kKHIpLGF3YWl0IG9uLmZsdXNoKDJlMyksUXQ+PVZ0Lm1heEFuckV2ZW50cyYmc2V0VGltZW91dCgoKT0+e3Byb2Nlc3MuZXhpdCgwKX0sNWUzKX1sZXQgYW47aWYodG4oIlN0YXJ0ZWQiKSxWdC5jYXB0dXJlU3RhY2tUcmFjZSl7dG4oIkNvbm5lY3RpbmcgdG8gZGVidWdnZXIiKTtjb25zdCBuPW5ldyB0O24uY29ubmVjdFRvTWFpblRocmVhZCgpLHRuKCJDb25uZWN0ZWQgdG8gZGVidWdnZXIiKTtjb25zdCBlPW5ldyBNYXA7bi5vbigiRGVidWdnZXIuc2NyaXB0UGFyc2VkIix0PT57ZS5zZXQodC5wYXJhbXMuc2NyaXB0SWQsdC5wYXJhbXMudXJsKX0pLG4ub24oIkRlYnVnZ2VyLnBhdXNlZCIsdD0+e2lmKCJvdGhlciI9PT10LnBhcmFtcy5yZWFzb24pdHJ5e3RuKCJEZWJ1Z2dlciBwYXVzZWQiKTtjb25zdCBzPVsuLi50LnBhcmFtcy5jYWxsRnJhbWVzXSxpPVZ0LmFwcFJvb3RQYXRoP2Z1bmN0aW9uKHQ9KHByb2Nlc3MuYXJndlsxXT9MdChwcm9jZXNzLmFyZ3ZbMV0pOnByb2Nlc3MuY3dkKCkpLG49IlxcIj09PW8pe2NvbnN0IGU9bj9adCh0KTp0O3JldHVybiB0PT57aWYoIXQpcmV0dXJuO2NvbnN0IG89bj9adCh0KTp0O2xldHtkaXI6cyxiYXNlOmksZXh0OmN9PXIucGFyc2Uobyk7Ii5qcyIhPT1jJiYiLm1qcyIhPT1jJiYiLmNqcyIhPT1jfHwoaT1pLnNsaWNlKDAsLTEqYy5sZW5ndGgpKTtjb25zdCB1PWRlY29kZVVSSUNvbXBvbmVudChpKTtzfHwocz0iLiIpO2NvbnN0IGE9cy5sYXN0SW5kZXhPZigiL25vZGVfbW9kdWxlcyIpO2lmKGE+LTEpcmV0dXJuYCR7cy5zbGljZShhKzE0KS5yZXBsYWNlKC9cLy9nLCIuIil9OiR7dX1gO2lmKHMuc3RhcnRzV2l0aChlKSl7Y29uc3QgdD1zLnNsaWNlKGUubGVuZ3RoKzEpLnJlcGxhY2UoL1wvL2csIi4iKTtyZXR1cm4gdD9gJHt0fToke3V9YDp1fXJldHVybiB1fX0oVnQuYXBwUm9vdFBhdGgpOigpPT57fSxjPXMubWFwKHQ9PmZ1bmN0aW9uKHQsbixlKXtjb25zdCByPW4/bi5yZXBsYWNlKC9eZmlsZTpcL1wvLywiIik6dm9pZCAwLG89dC5sb2NhdGlvbi5jb2x1bW5OdW1iZXI/dC5sb2NhdGlvbi5jb2x1bW5OdW1iZXIrMTp2b2lkIDAscz10LmxvY2F0aW9uLmxpbmVOdW1iZXI/dC5sb2NhdGlvbi5saW5lTnVtYmVyKzE6dm9pZCAwO3JldHVybntmaWxlbmFtZTpyLG1vZHVsZTplKHIpLGZ1bmN0aW9uOnQuZnVuY3Rpb25OYW1lfHwiPyIsY29sbm86byxsaW5lbm86cyxpbl9hcHA6cj9CdChyKTp2b2lkIDB9fSh0LGUuZ2V0KHQubG9jYXRpb24uc2NyaXB0SWQpLGkpKSx1PXNldFRpbWVvdXQoKCk9Pnt1bihjKS50aGVuKG51bGwsKCk9Pnt0bigiU2VuZGluZyBBTlIgZXZlbnQgZmFpbGVkLiIpfSl9LDVlMyk7bi5wb3N0KCJSdW50aW1lLmV2YWx1YXRlIix7ZXhwcmVzc2lvbjoiZ2xvYmFsLl9fU0VOVFJZX0dFVF9TQ09QRVNfXygpOyIsc2lsZW50OiEwLHJldHVybkJ5VmFsdWU6ITB9LCh0LGUpPT57dCYmdG4oYEVycm9yIGV4ZWN1dGluZyBzY3JpcHQ6ICcke3QubWVzc2FnZX0nYCksY2xlYXJUaW1lb3V0KHUpO2NvbnN0IHI9ZT8ucmVzdWx0P2UucmVzdWx0LnZhbHVlOnZvaWQgMDtuLnBvc3QoIkRlYnVnZ2VyLnJlc3VtZSIpLG4ucG9zdCgiRGVidWdnZXIuZGlzYWJsZSIpLHVuKGMscikudGhlbihudWxsLCgpPT57dG4oIlNlbmRpbmcgQU5SIGV2ZW50IGZhaWxlZC4iKX0pfSl9Y2F0Y2godCl7dGhyb3cgbi5wb3N0KCJEZWJ1Z2dlci5yZXN1bWUiKSxuLnBvc3QoIkRlYnVnZ2VyLmRpc2FibGUiKSx0fX0pLGFuPSgpPT57dHJ5e24ucG9zdCgiRGVidWdnZXIuZW5hYmxlIiwoKT0+e24ucG9zdCgiRGVidWdnZXIucGF1c2UiKX0pfWNhdGNoe319fWNvbnN0e3BvbGw6Zm59PWZ1bmN0aW9uKHQsbixlLHIpe2NvbnN0IG89dCgpO2xldCBzPSExLGk9ITA7cmV0dXJuIHNldEludGVydmFsKCgpPT57Y29uc3QgdD1vLmdldFRpbWVNcygpOyExPT09cyYmdD5uK2UmJihzPSEwLGkmJnIoKSksdDxuK2UmJihzPSExKX0sMjApLHtwb2xsOigpPT57by5yZXNldCgpfSxlbmFibGVkOnQ9PntpPXR9fX0oZnVuY3Rpb24oKXtsZXQgdD1wcm9jZXNzLmhydGltZSgpO3JldHVybntnZXRUaW1lTXM6KCk9Pntjb25zdFtuLGVdPXByb2Nlc3MuaHJ0aW1lKHQpO3JldHVybiBNYXRoLmZsb29yKDFlMypuK2UvMWU2KX0scmVzZXQ6KCk9Pnt0PXByb2Nlc3MuaHJ0aW1lKCl9fX0sVnQucG9sbEludGVydmFsLFZ0LmFuclRocmVzaG9sZCxmdW5jdGlvbigpe3RuKCJXYXRjaGRvZyB0aW1lb3V0IiksYW4/KHRuKCJQYXVzaW5nIGRlYnVnZ2VyIHRvIGNhcHR1cmUgc3RhY2sgdHJhY2UiKSxhbigpKToodG4oIkNhcHR1cmluZyBldmVudCB3aXRob3V0IGEgc3RhY2sgdHJhY2UiKSx1bigpLnRoZW4obnVsbCwoKT0+e3RuKCJTZW5kaW5nIEFOUiBldmVudCBmYWlsZWQgb24gd2F0Y2hkb2cgdGltZW91dC4iKX0pKX0pO2U/Lm9uKCJtZXNzYWdlIix0PT57dC5zZXNzaW9uJiYocXQ9SCh0LnNlc3Npb24pKSx0LmRlYnVnSW1hZ2VzJiYoWHQ9dC5kZWJ1Z0ltYWdlcyksZm4oKX0pOw==';
const DEFAULT_INTERVAL = 50;
const DEFAULT_HANG_THRESHOLD = 5000;
function log(message, ...args) {
    core.debug.log(`[ANR] ${message}`, ...args);
}
function globalWithScopeFetchFn() {
    return core.GLOBAL_OBJ;
}
/** Fetches merged scope data */ function getScopeData() {
    const scope = core.getGlobalScope().getScopeData();
    core.mergeScopeData(scope, core.getIsolationScope().getScopeData());
    core.mergeScopeData(scope, core.getCurrentScope().getScopeData());
    // We remove attachments because they likely won't serialize well as json
    scope.attachments = [];
    // We can't serialize event processor functions
    scope.eventProcessors = [];
    return scope;
}
/**
 * Gets contexts by calling all event processors. This shouldn't be called until all integrations are setup
 */ async function getContexts(client) {
    let event = {
        message: 'ANR'
    };
    const eventHint = {};
    for (const processor of client.getEventProcessors()){
        if (event === null) break;
        event = await processor(event, eventHint);
    }
    return event?.contexts || {};
}
const INTEGRATION_NAME = 'Anr';
// eslint-disable-next-line deprecation/deprecation
const _anrIntegration = (options = {})=>{
    if (nodeVersion.NODE_VERSION.major < 16 || nodeVersion.NODE_VERSION.major === 16 && nodeVersion.NODE_VERSION.minor < 17) {
        throw new Error('ANR detection requires Node 16.17.0 or later');
    }
    let worker;
    let client;
    // Hookup the scope fetch function to the global object so that it can be called from the worker thread via the
    // debugger when it pauses
    const gbl = globalWithScopeFetchFn();
    gbl.__SENTRY_GET_SCOPES__ = getScopeData;
    return {
        name: INTEGRATION_NAME,
        startWorker: ()=>{
            if (worker) {
                return;
            }
            if (client) {
                worker = _startWorker(client, options);
            }
        },
        stopWorker: ()=>{
            if (worker) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                worker.then((stop)=>{
                    stop();
                    worker = undefined;
                });
            }
        },
        async setup (initClient) {
            client = initClient;
            if (options.captureStackTrace && await debug.isDebuggerEnabled()) {
                core.debug.warn('ANR captureStackTrace has been disabled because the debugger was already enabled');
                options.captureStackTrace = false;
            }
            // setImmediate is used to ensure that all other integrations have had their setup called first.
            // This allows us to call into all integrations to fetch the full context
            setImmediate(()=>this.startWorker());
        }
    };
};
// eslint-disable-next-line deprecation/deprecation
/**
 * Application Not Responding (ANR) integration for Node.js applications.
 *
 * @deprecated The ANR integration has been deprecated. Use `eventLoopBlockIntegration` from `@sentry/node-native` instead.
 *
 * Detects when the Node.js main thread event loop is blocked for more than the configured
 * threshold (5 seconds by default) and reports these as Sentry events.
 *
 * ANR detection uses a worker thread to monitor the event loop in the main app thread.
 * The main app thread sends a heartbeat message to the ANR worker thread every 50ms by default.
 * If the ANR worker does not receive a heartbeat message for the configured threshold duration,
 * it triggers an ANR event.
 *
 * - Node.js 16.17.0 or higher
 * - Only supported in the Node.js runtime (not browsers)
 * - Not supported for Node.js clusters
 *
 * Overhead should be minimal:
 * - Main thread: Only polling the ANR worker over IPC every 50ms
 * - Worker thread: Consumes around 10-20 MB of RAM
 * - When ANR detected: Brief pause in debugger to capture stack trace (negligible compared to the blocking)
 *
 * @example
 * ```javascript
 * Sentry.init({
 *   dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
 *   integrations: [
 *     Sentry.anrIntegration({
 *       anrThreshold: 5000,
 *       captureStackTrace: true,
 *       pollInterval: 50,
 *     }),
 *   ],
 * });
 * ```
 */ const anrIntegration = core.defineIntegration(_anrIntegration);
/**
 * Starts the ANR worker thread
 *
 * @returns A function to stop the worker
 */ async function _startWorker(client, // eslint-disable-next-line deprecation/deprecation
integrationOptions) {
    const dsn = client.getDsn();
    if (!dsn) {
        return ()=>{
        //
        };
    }
    const contexts = await getContexts(client);
    // These will not be accurate if sent later from the worker thread
    delete contexts.app?.app_memory;
    delete contexts.device?.free_memory;
    const initOptions = client.getOptions();
    const sdkMetadata = client.getSdkMetadata() || {};
    if (sdkMetadata.sdk) {
        sdkMetadata.sdk.integrations = initOptions.integrations.map((i)=>i.name);
    }
    const options = {
        debug: core.debug.isEnabled(),
        dsn,
        tunnel: initOptions.tunnel,
        environment: initOptions.environment || 'production',
        release: initOptions.release,
        dist: initOptions.dist,
        sdkMetadata,
        appRootPath: integrationOptions.appRootPath,
        pollInterval: integrationOptions.pollInterval || DEFAULT_INTERVAL,
        anrThreshold: integrationOptions.anrThreshold || DEFAULT_HANG_THRESHOLD,
        captureStackTrace: !!integrationOptions.captureStackTrace,
        maxAnrEvents: integrationOptions.maxAnrEvents || 1,
        staticTags: integrationOptions.staticTags || {},
        contexts
    };
    if (options.captureStackTrace) {
        const inspector = await __turbopack_context__.A("[externals]/node:inspector [external] (node:inspector, cjs, async loader)");
        if (!inspector.url()) {
            inspector.open(0);
        }
    }
    const worker = new node_worker_threads.Worker(new URL(`data:application/javascript;base64,${base64WorkerScript}`), {
        workerData: options,
        // We don't want any Node args to be passed to the worker
        execArgv: [],
        env: {
            ...process.env,
            NODE_OPTIONS: undefined
        }
    });
    process.on('exit', ()=>{
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        worker.terminate();
    });
    const timer = setInterval(()=>{
        try {
            const currentSession = core.getIsolationScope().getSession();
            // We need to copy the session object and remove the toJSON method so it can be sent to the worker
            // serialized without making it a SerializedSession
            const session = currentSession ? {
                ...currentSession,
                toJSON: undefined
            } : undefined;
            // message the worker to tell it the main event loop is still running
            worker.postMessage({
                session,
                debugImages: core.getFilenameToDebugIdMap(initOptions.stackParser)
            });
        } catch  {
        //
        }
    }, options.pollInterval);
    // Timer should not block exit
    timer.unref();
    worker.on('message', (msg)=>{
        if (msg === 'session-ended') {
            log('ANR event sent from ANR worker. Clearing session in this thread.');
            core.getIsolationScope().setSession(undefined);
        }
    });
    worker.once('error', (err)=>{
        clearInterval(timer);
        log('ANR worker error', err);
    });
    worker.once('exit', (code)=>{
        clearInterval(timer);
        log('ANR worker exit', code);
    });
    // Ensure this thread can't block app exit
    worker.unref();
    return ()=>{
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        worker.terminate();
        clearInterval(timer);
    };
}
/**
 * Temporarily disables ANR detection for the duration of a callback function.
 *
 * This utility function allows you to disable ANR detection during operations that
 * are expected to block the event loop, such as intensive computational tasks or
 * synchronous I/O operations.
 *
 * @deprecated The ANR integration has been deprecated. Use `eventLoopBlockIntegration` from `@sentry/node-native` instead.
 */ function disableAnrDetectionForCallback(callback) {
    const integration = core.getClient()?.getIntegrationByName(INTEGRATION_NAME);
    if (!integration) {
        return callback();
    }
    integration.stopWorker();
    const result = callback();
    if (isPromise(result)) {
        return result.finally(()=>integration.startWorker());
    }
    integration.startWorker();
    return result;
}
exports.anrIntegration = anrIntegration;
exports.base64WorkerScript = base64WorkerScript;
exports.disableAnrDetectionForCallback = disableAnrDetectionForCallback; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/spotlight.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const http = __turbopack_context__.r("[externals]/node:http [external] (node:http, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Spotlight';
const _spotlightIntegration = (options = {})=>{
    const _options = {
        sidecarUrl: options.sidecarUrl || 'http://localhost:8969/stream'
    };
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            try {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            } catch  {
            // ignore
            }
            connectToSpotlight(client, _options);
        }
    };
};
/**
 * Use this integration to send errors and transactions to Spotlight.
 *
 * Learn more about spotlight at https://spotlightjs.com
 *
 * Important: This integration only works with Node 18 or newer.
 */ const spotlightIntegration = core.defineIntegration(_spotlightIntegration);
function connectToSpotlight(client, options) {
    const spotlightUrl = parseSidecarUrl(options.sidecarUrl);
    if (!spotlightUrl) {
        return;
    }
    let failedRequests = 0;
    client.on('beforeEnvelope', (envelope)=>{
        if (failedRequests > 3) {
            core.debug.warn('[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests');
            return;
        }
        const serializedEnvelope = core.serializeEnvelope(envelope);
        core.suppressTracing(()=>{
            const req = http.request({
                method: 'POST',
                path: spotlightUrl.pathname,
                hostname: spotlightUrl.hostname,
                port: spotlightUrl.port,
                headers: {
                    'Content-Type': 'application/x-sentry-envelope'
                }
            }, (res)=>{
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                    // Reset failed requests counter on success
                    failedRequests = 0;
                }
                res.on('data', ()=>{
                // Drain socket
                });
                res.on('end', ()=>{
                // Drain socket
                });
                res.setEncoding('utf8');
            });
            req.on('error', ()=>{
                failedRequests++;
                core.debug.warn('[Spotlight] Failed to send envelope to Spotlight Sidecar');
            });
            req.write(serializedEnvelope);
            req.end();
        });
    });
}
function parseSidecarUrl(url) {
    try {
        return new URL(`${url}`);
    } catch  {
        core.debug.warn(`[Spotlight] Invalid sidecar URL: ${url}`);
        return undefined;
    }
}
exports.INTEGRATION_NAME = INTEGRATION_NAME;
exports.spotlightIntegration = spotlightIntegration; //# sourceMappingURL=spotlight.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/systemError.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const util = __turbopack_context__.r("[externals]/node:util [external] (node:util, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'NodeSystemError';
function isSystemError(error) {
    if (!(error instanceof Error)) {
        return false;
    }
    if (!('errno' in error) || typeof error.errno !== 'number') {
        return false;
    }
    // Appears this is the recommended way to check for Node.js SystemError
    // https://github.com/nodejs/node/issues/46869
    return util.getSystemErrorMap().has(error.errno);
}
/**
 * Captures context for Node.js SystemError errors.
 */ const systemErrorIntegration = core.defineIntegration((options = {})=>{
    return {
        name: INTEGRATION_NAME,
        processEvent: (event, hint, client)=>{
            if (!isSystemError(hint.originalException)) {
                return event;
            }
            const error = hint.originalException;
            const errorContext = {
                ...error
            };
            if (!client.getOptions().sendDefaultPii && options.includePaths !== true) {
                delete errorContext.path;
                delete errorContext.dest;
            }
            event.contexts = {
                ...event.contexts,
                node_system_error: errorContext
            };
            for (const exception of event.exception?.values || []){
                if (exception.value) {
                    if (error.path && exception.value.includes(error.path)) {
                        exception.value = exception.value.replace(`'${error.path}'`, '').trim();
                    }
                    if (error.dest && exception.value.includes(error.dest)) {
                        exception.value = exception.value.replace(`'${error.dest}'`, '').trim();
                    }
                }
            }
            return event;
        }
    };
});
exports.systemErrorIntegration = systemErrorIntegration; //# sourceMappingURL=systemError.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/childProcess.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const diagnosticsChannel = __turbopack_context__.r("[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'ChildProcess';
/**
 * Capture breadcrumbs and events for child processes and worker threads.
 */ const childProcessIntegration = core.defineIntegration((options = {})=>{
    return {
        name: INTEGRATION_NAME,
        setup () {
            diagnosticsChannel.channel('child_process').subscribe((event)=>{
                if (event && typeof event === 'object' && 'process' in event) {
                    captureChildProcessEvents(event.process, options);
                }
            });
            diagnosticsChannel.channel('worker_threads').subscribe((event)=>{
                if (event && typeof event === 'object' && 'worker' in event) {
                    captureWorkerThreadEvents(event.worker, options);
                }
            });
        }
    };
});
function captureChildProcessEvents(child, options) {
    let hasExited = false;
    let data;
    child.on('spawn', ()=>{
        // This is Sentry getting macOS OS context
        if (child.spawnfile === '/usr/bin/sw_vers') {
            hasExited = true;
            return;
        }
        data = {
            spawnfile: child.spawnfile
        };
        if (options.includeChildProcessArgs) {
            data.spawnargs = child.spawnargs;
        }
    }).on('exit', (code)=>{
        if (!hasExited) {
            hasExited = true;
            // Only log for non-zero exit codes
            if (code !== null && code !== 0) {
                core.addBreadcrumb({
                    category: 'child_process',
                    message: `Child process exited with code '${code}'`,
                    level: code === 0 ? 'info' : 'warning',
                    data
                });
            }
        }
    }).on('error', (error)=>{
        if (!hasExited) {
            hasExited = true;
            core.addBreadcrumb({
                category: 'child_process',
                message: `Child process errored with '${error.message}'`,
                level: 'error',
                data
            });
        }
    });
}
function captureWorkerThreadEvents(worker, options) {
    let threadId;
    worker.on('online', ()=>{
        threadId = worker.threadId;
    }).on('error', (error)=>{
        if (options.captureWorkerErrors !== false) {
            core.captureException(error, {
                mechanism: {
                    type: 'instrument',
                    handled: false,
                    data: {
                        threadId: String(threadId)
                    }
                }
            });
        } else {
            core.addBreadcrumb({
                category: 'worker_thread',
                message: `Worker thread errored with '${error.message}'`,
                level: 'error',
                data: {
                    threadId
                }
            });
        }
    });
}
exports.childProcessIntegration = childProcessIntegration; //# sourceMappingURL=childProcess.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/winston.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const capture = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/logs/capture.js [app-ssr] (ecmascript)");
const DEFAULT_CAPTURED_LEVELS = [
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
];
// See: https://github.com/winstonjs/triple-beam
const LEVEL_SYMBOL = Symbol.for('level');
const MESSAGE_SYMBOL = Symbol.for('message');
const SPLAT_SYMBOL = Symbol.for('splat');
/**
 * Options for the Sentry Winston transport.
 */ /**
 * Creates a new Sentry Winston transport that fowards logs to Sentry. Requires the `enableLogs` option to be enabled.
 *
 * Supports Winston 3.x.x.
 *
 * @param TransportClass - The Winston transport class to extend.
 * @returns The extended transport class.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 *
 * @example
 * ```ts
 * const winston = require('winston');
 * const Transport = require('winston-transport');
 *
 * const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);
 *
 * const logger = winston.createLogger({
 *   transports: [new SentryWinstonTransport()],
 * });
 * ```
 */ function createSentryWinstonTransport(// eslint-disable-next-line @typescript-eslint/no-explicit-any
TransportClass, sentryWinstonOptions) {
    // @ts-ignore - We know this is safe because SentryWinstonTransport extends TransportClass
    class SentryWinstonTransport extends TransportClass {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(options){
            super(options);
            this._levels = new Set(sentryWinstonOptions?.levels ?? DEFAULT_CAPTURED_LEVELS);
        }
        /**
     * Forwards a winston log to the Sentry SDK.
     */ log(info, callback) {
            try {
                setImmediate(()=>{
                    // @ts-ignore - We know this is safe because SentryWinstonTransport extends TransportClass
                    this.emit('logged', info);
                });
                if (!isObject(info)) {
                    return;
                }
                const levelFromSymbol = info[LEVEL_SYMBOL];
                // See: https://github.com/winstonjs/winston?tab=readme-ov-file#streams-objectmode-and-info-objects
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { level, message, timestamp, ...attributes } = info;
                // Remove all symbols from the remaining attributes
                attributes[LEVEL_SYMBOL] = undefined;
                attributes[MESSAGE_SYMBOL] = undefined;
                attributes[SPLAT_SYMBOL] = undefined;
                const logSeverityLevel = WINSTON_LEVEL_TO_LOG_SEVERITY_LEVEL_MAP[levelFromSymbol] ?? 'info';
                if (this._levels.has(logSeverityLevel)) {
                    capture.captureLog(logSeverityLevel, message, {
                        ...attributes,
                        'sentry.origin': 'auto.logging.winston'
                    });
                }
            } catch  {
            // do nothing
            }
            if (callback) {
                callback();
            }
        }
    }
    return SentryWinstonTransport;
}
function isObject(anything) {
    return typeof anything === 'object' && anything != null;
}
// npm
// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }
//
// syslog
// {
//   emerg: 0,
//   alert: 1,
//   crit: 2,
//   error: 3,
//   warning: 4,
//   notice: 5,
//   info: 6,
//   debug: 7,
// }
const WINSTON_LEVEL_TO_LOG_SEVERITY_LEVEL_MAP = {
    // npm
    silly: 'trace',
    // npm and syslog
    debug: 'debug',
    // npm
    verbose: 'debug',
    // npm
    http: 'debug',
    // npm and syslog
    info: 'info',
    // syslog
    notice: 'info',
    // npm
    warn: 'warn',
    // syslog
    warning: 'warn',
    // npm and syslog
    error: 'error',
    // syslog
    emerg: 'fatal',
    // syslog
    alert: 'fatal',
    // syslog
    crit: 'fatal'
};
exports.createSentryWinstonTransport = createSentryWinstonTransport; //# sourceMappingURL=winston.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/contextManager.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const contextAsyncHooks = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/context-async-hooks/build/src/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * This is a custom ContextManager for OpenTelemetry, which extends the default AsyncLocalStorageContextManager.
 * It ensures that we create a new hub per context, so that the OTEL Context & the Sentry Scopes are always in sync.
 *
 * Note that we currently only support AsyncHooks with this,
 * but since this should work for Node 14+ anyhow that should be good enough.
 */ const SentryContextManager = opentelemetry.wrapContextManagerClass(contextAsyncHooks.AsyncLocalStorageContextManager);
exports.SentryContextManager = SentryContextManager; //# sourceMappingURL=contextManager.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/logger.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Setup the OTEL logger to use our own debug logger.
 */ function setupOpenTelemetryLogger() {
    // Disable diag, to ensure this works even if called multiple times
    api.diag.disable();
    api.diag.setLogger({
        error: core.debug.error,
        warn: core.debug.warn,
        info: core.debug.log,
        debug: core.debug.log,
        verbose: core.debug.log
    }, api.DiagLogLevel.DEBUG);
}
exports.setupOpenTelemetryLogger = setupOpenTelemetryLogger; //# sourceMappingURL=logger.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/processSession.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'ProcessSession';
/**
 * Records a Session for the current process to track release health.
 */ const processSessionIntegration = core.defineIntegration(()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            core.startSession();
            // Emitted in the case of healthy sessions, error of `mechanism.handled: true` and unhandledrejections because
            // The 'beforeExit' event is not emitted for conditions causing explicit termination,
            // such as calling process.exit() or uncaught exceptions.
            // Ref: https://nodejs.org/api/process.html#process_event_beforeexit
            process.on('beforeExit', ()=>{
                const session = core.getIsolationScope().getSession();
                // Only call endSession, if the Session exists on Scope and SessionStatus is not a
                // Terminal Status i.e. Exited or Crashed because
                // "When a session is moved away from ok it must not be updated anymore."
                // Ref: https://develop.sentry.dev/sdk/sessions/
                if (session?.status !== 'ok') {
                    core.endSession();
                }
            });
        }
    };
});
exports.processSessionIntegration = processSessionIntegration; //# sourceMappingURL=processSession.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/base.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const http = __turbopack_context__.r("[externals]/node:http [external] (node:http, cjs)");
__turbopack_context__.r("[externals]/node:https [external] (node:https, cjs)");
/**
 * This code was originally forked from https://github.com/TooTallNate/proxy-agents/tree/b133295fd16f6475578b6b15bd9b4e33ecb0d0b7
 * With the following LICENSE:
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Nathan Rajlich <nathan@tootallnate.net>*
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:*
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.*
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ const INTERNAL = Symbol('AgentBaseInternalState');
class Agent extends http.Agent {
    // Set by `http.Agent` - missing from `@types/node`
    constructor(opts){
        super(opts);
        this[INTERNAL] = {};
    }
    /**
   * Determine whether this is an `http` or `https` request.
   */ isSecureEndpoint(options) {
        if (options) {
            // First check the `secureEndpoint` property explicitly, since this
            // means that a parent `Agent` is "passing through" to this instance.
            if (typeof options.secureEndpoint === 'boolean') {
                return options.secureEndpoint;
            }
            // If no explicit `secure` endpoint, check if `protocol` property is
            // set. This will usually be the case since using a full string URL
            // or `URL` instance should be the most common usage.
            if (typeof options.protocol === 'string') {
                return options.protocol === 'https:';
            }
        }
        // Finally, if no `protocol` property was set, then fall back to
        // checking the stack trace of the current call stack, and try to
        // detect the "https" module.
        const { stack } = new Error();
        if (typeof stack !== 'string') return false;
        return stack.split('\n').some((l)=>l.indexOf('(https.js:') !== -1 || l.indexOf('node:https:') !== -1);
    }
    createSocket(req, options, cb) {
        const connectOpts = {
            ...options,
            secureEndpoint: this.isSecureEndpoint(options)
        };
        Promise.resolve().then(()=>this.connect(req, connectOpts)).then((socket)=>{
            if (socket instanceof http.Agent) {
                // @ts-expect-error `addRequest()` isn't defined in `@types/node`
                return socket.addRequest(req, connectOpts);
            }
            this[INTERNAL].currentSocket = socket;
            // @ts-expect-error `createSocket()` isn't defined in `@types/node`
            super.createSocket(req, options, cb);
        }, cb);
    }
    createConnection() {
        const socket = this[INTERNAL].currentSocket;
        this[INTERNAL].currentSocket = undefined;
        if (!socket) {
            throw new Error('No socket was returned in the `connect()` function');
        }
        return socket;
    }
    get defaultPort() {
        return this[INTERNAL].defaultPort ?? (this.protocol === 'https:' ? 443 : 80);
    }
    set defaultPort(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].defaultPort = v;
        }
    }
    get protocol() {
        return this[INTERNAL].protocol ?? (this.isSecureEndpoint() ? 'https:' : 'http:');
    }
    set protocol(v) {
        if (this[INTERNAL]) {
            this[INTERNAL].protocol = v;
        }
    }
}
exports.Agent = Agent; //# sourceMappingURL=base.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/parse-proxy-response.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
function debugLog(...args) {
    core.debug.log('[https-proxy-agent:parse-proxy-response]', ...args);
}
function parseProxyResponse(socket) {
    return new Promise((resolve, reject)=>{
        // we need to buffer any HTTP traffic that happens with the proxy before we get
        // the CONNECT response, so that if the response is anything other than an "200"
        // response code, then we can re-play the "data" events on the socket once the
        // HTTP parser is hooked up...
        let buffersLength = 0;
        const buffers = [];
        function read() {
            const b = socket.read();
            if (b) ondata(b);
            else socket.once('readable', read);
        }
        function cleanup() {
            socket.removeListener('end', onend);
            socket.removeListener('error', onerror);
            socket.removeListener('readable', read);
        }
        function onend() {
            cleanup();
            debugLog('onend');
            reject(new Error('Proxy connection ended before receiving CONNECT response'));
        }
        function onerror(err) {
            cleanup();
            debugLog('onerror %o', err);
            reject(err);
        }
        function ondata(b) {
            buffers.push(b);
            buffersLength += b.length;
            const buffered = Buffer.concat(buffers, buffersLength);
            const endOfHeaders = buffered.indexOf('\r\n\r\n');
            if (endOfHeaders === -1) {
                // keep buffering
                debugLog('have not received end of HTTP headers yet...');
                read();
                return;
            }
            const headerParts = buffered.subarray(0, endOfHeaders).toString('ascii').split('\r\n');
            const firstLine = headerParts.shift();
            if (!firstLine) {
                socket.destroy();
                return reject(new Error('No header received from proxy CONNECT response'));
            }
            const firstLineParts = firstLine.split(' ');
            const statusCode = +(firstLineParts[1] || 0);
            const statusText = firstLineParts.slice(2).join(' ');
            const headers = {};
            for (const header of headerParts){
                if (!header) continue;
                const firstColon = header.indexOf(':');
                if (firstColon === -1) {
                    socket.destroy();
                    return reject(new Error(`Invalid header from proxy CONNECT response: "${header}"`));
                }
                const key = header.slice(0, firstColon).toLowerCase();
                const value = header.slice(firstColon + 1).trimStart();
                const current = headers[key];
                if (typeof current === 'string') {
                    headers[key] = [
                        current,
                        value
                    ];
                } else if (Array.isArray(current)) {
                    current.push(value);
                } else {
                    headers[key] = value;
                }
            }
            debugLog('got proxy server response: %o %o', firstLine, headers);
            cleanup();
            resolve({
                connect: {
                    statusCode,
                    statusText,
                    headers
                },
                buffered
            });
        }
        socket.on('error', onerror);
        socket.on('end', onend);
        read();
    });
}
exports.parseProxyResponse = parseProxyResponse; //# sourceMappingURL=parse-proxy-response.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const net = __turbopack_context__.r("[externals]/node:net [external] (node:net, cjs)");
const tls = __turbopack_context__.r("[externals]/node:tls [external] (node:tls, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const base = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/base.js [app-ssr] (ecmascript)");
const parseProxyResponse = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/parse-proxy-response.js [app-ssr] (ecmascript)");
function debugLog(...args) {
    core.debug.log('[https-proxy-agent]', ...args);
}
/**
 * The `HttpsProxyAgent` implements an HTTP Agent subclass that connects to
 * the specified "HTTP(s) proxy server" in order to proxy HTTPS requests.
 *
 * Outgoing HTTP requests are first tunneled through the proxy server using the
 * `CONNECT` HTTP request method to establish a connection to the proxy server,
 * and then the proxy server connects to the destination target and issues the
 * HTTP request from the proxy server.
 *
 * `https:` requests have their socket connection upgraded to TLS once
 * the connection to the proxy server has been established.
 */ class HttpsProxyAgent extends base.Agent {
    static __initStatic() {
        this.protocols = [
            'http',
            'https'
        ];
    }
    constructor(proxy, opts){
        super(opts);
        this.options = {};
        this.proxy = typeof proxy === 'string' ? new URL(proxy) : proxy;
        this.proxyHeaders = opts?.headers ?? {};
        debugLog('Creating new HttpsProxyAgent instance: %o', this.proxy.href);
        // Trim off the brackets from IPv6 addresses
        const host = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, '');
        const port = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === 'https:' ? 443 : 80;
        this.connectOpts = {
            // Attempt to negotiate http/1.1 for proxy servers that support http/2
            ALPNProtocols: [
                'http/1.1'
            ],
            ...opts ? omit(opts, 'headers') : null,
            host,
            port
        };
    }
    /**
   * Called when the node-core HTTP client library is creating a
   * new HTTP request.
   */ async connect(req, opts) {
        const { proxy } = this;
        if (!opts.host) {
            throw new TypeError('No "host" provided');
        }
        // Create a socket connection to the proxy server.
        let socket;
        if (proxy.protocol === 'https:') {
            debugLog('Creating `tls.Socket`: %o', this.connectOpts);
            const servername = this.connectOpts.servername || this.connectOpts.host;
            socket = tls.connect({
                ...this.connectOpts,
                servername: servername && net.isIP(servername) ? undefined : servername
            });
        } else {
            debugLog('Creating `net.Socket`: %o', this.connectOpts);
            socket = net.connect(this.connectOpts);
        }
        const headers = typeof this.proxyHeaders === 'function' ? this.proxyHeaders() : {
            ...this.proxyHeaders
        };
        const host = net.isIPv6(opts.host) ? `[${opts.host}]` : opts.host;
        let payload = `CONNECT ${host}:${opts.port} HTTP/1.1\r\n`;
        // Inject the `Proxy-Authorization` header if necessary.
        if (proxy.username || proxy.password) {
            const auth = `${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`;
            headers['Proxy-Authorization'] = `Basic ${Buffer.from(auth).toString('base64')}`;
        }
        headers.Host = `${host}:${opts.port}`;
        if (!headers['Proxy-Connection']) {
            headers['Proxy-Connection'] = this.keepAlive ? 'Keep-Alive' : 'close';
        }
        for (const name of Object.keys(headers)){
            payload += `${name}: ${headers[name]}\r\n`;
        }
        const proxyResponsePromise = parseProxyResponse.parseProxyResponse(socket);
        socket.write(`${payload}\r\n`);
        const { connect, buffered } = await proxyResponsePromise;
        req.emit('proxyConnect', connect);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Not EventEmitter in Node types
        this.emit('proxyConnect', connect, req);
        if (connect.statusCode === 200) {
            req.once('socket', resume);
            if (opts.secureEndpoint) {
                // The proxy is connecting to a TLS server, so upgrade
                // this socket connection to a TLS connection.
                debugLog('Upgrading socket connection to TLS');
                const servername = opts.servername || opts.host;
                return tls.connect({
                    ...omit(opts, 'host', 'path', 'port'),
                    socket,
                    servername: net.isIP(servername) ? undefined : servername
                });
            }
            return socket;
        }
        // Some other status code that's not 200... need to re-play the HTTP
        // header "data" events onto the socket once the HTTP machinery is
        // attached so that the node core `http` can parse and handle the
        // error status code.
        // Close the original socket, and a new "fake" socket is returned
        // instead, so that the proxy doesn't get the HTTP request
        // written to it (which may contain `Authorization` headers or other
        // sensitive data).
        //
        // See: https://hackerone.com/reports/541502
        socket.destroy();
        const fakeSocket = new net.Socket({
            writable: false
        });
        fakeSocket.readable = true;
        // Need to wait for the "socket" event to re-play the "data" events.
        req.once('socket', (s)=>{
            debugLog('Replaying proxy buffer for failed request');
            // Replay the "buffered" Buffer onto the fake `socket`, since at
            // this point the HTTP module machinery has been hooked up for
            // the user.
            s.push(buffered);
            s.push(null);
        });
        return fakeSocket;
    }
}
HttpsProxyAgent.__initStatic();
function resume(socket) {
    socket.resume();
}
function omit(obj, ...keys) {
    const ret = {};
    let key;
    for(key in obj){
        if (!keys.includes(key)) {
            ret[key] = obj[key];
        }
    }
    return ret;
}
exports.HttpsProxyAgent = HttpsProxyAgent; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/transports/http.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const http = __turbopack_context__.r("[externals]/node:http [external] (node:http, cjs)");
const https = __turbopack_context__.r("[externals]/node:https [external] (node:https, cjs)");
const node_stream = __turbopack_context__.r("[externals]/node:stream [external] (node:stream, cjs)");
const node_zlib = __turbopack_context__.r("[externals]/node:zlib [external] (node:zlib, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/proxy/index.js [app-ssr] (ecmascript)");
// Estimated maximum size for reasonable standalone event
const GZIP_THRESHOLD = 1024 * 32;
/**
 * Gets a stream from a Uint8Array or string
 * Readable.from is ideal but was added in node.js v12.3.0 and v10.17.0
 */ function streamFromBody(body) {
    return new node_stream.Readable({
        read () {
            this.push(body);
            this.push(null);
        }
    });
}
/**
 * Creates a Transport that uses native the native 'http' and 'https' modules to send events to Sentry.
 */ function makeNodeTransport(options) {
    let urlSegments;
    try {
        urlSegments = new URL(options.url);
    } catch (e) {
        core.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('[@sentry/node]: Invalid dsn or tunnel option, will not send any events. The tunnel option must be a full URL when used.');
        });
        return core.createTransport(options, ()=>Promise.resolve({}));
    }
    const isHttps = urlSegments.protocol === 'https:';
    // Proxy prioritization: http => `options.proxy` | `process.env.http_proxy`
    // Proxy prioritization: https => `options.proxy` | `process.env.https_proxy` | `process.env.http_proxy`
    const proxy = applyNoProxyOption(urlSegments, options.proxy || (isHttps ? process.env.https_proxy : undefined) || process.env.http_proxy);
    const nativeHttpModule = isHttps ? https : http;
    const keepAlive = options.keepAlive === undefined ? false : options.keepAlive;
    // TODO(v11): Evaluate if we can set keepAlive to true. This would involve testing for memory leaks in older node
    // versions(>= 8) as they had memory leaks when using it: #2555
    const agent = proxy ? new index.HttpsProxyAgent(proxy) : new nativeHttpModule.Agent({
        keepAlive,
        maxSockets: 30,
        timeout: 2000
    });
    const requestExecutor = createRequestExecutor(options, options.httpModule ?? nativeHttpModule, agent);
    return core.createTransport(options, requestExecutor);
}
/**
 * Honors the `no_proxy` env variable with the highest priority to allow for hosts exclusion.
 *
 * @param transportUrl The URL the transport intends to send events to.
 * @param proxy The client configured proxy.
 * @returns A proxy the transport should use.
 */ function applyNoProxyOption(transportUrlSegments, proxy) {
    const { no_proxy } = process.env;
    const urlIsExemptFromProxy = no_proxy?.split(',').some((exemption)=>transportUrlSegments.host.endsWith(exemption) || transportUrlSegments.hostname.endsWith(exemption));
    if (urlIsExemptFromProxy) {
        return undefined;
    } else {
        return proxy;
    }
}
/**
 * Creates a RequestExecutor to be used with `createTransport`.
 */ function createRequestExecutor(options, httpModule, agent) {
    const { hostname, pathname, port, protocol, search } = new URL(options.url);
    return function makeRequest(request) {
        return new Promise((resolve, reject)=>{
            // This ensures we do not generate any spans in OpenTelemetry for the transport
            core.suppressTracing(()=>{
                let body = streamFromBody(request.body);
                const headers = {
                    ...options.headers
                };
                if (request.body.length > GZIP_THRESHOLD) {
                    headers['content-encoding'] = 'gzip';
                    body = body.pipe(node_zlib.createGzip());
                }
                const req = httpModule.request({
                    method: 'POST',
                    agent,
                    headers,
                    hostname,
                    path: `${pathname}${search}`,
                    port,
                    protocol,
                    ca: options.caCerts
                }, (res)=>{
                    res.on('data', ()=>{
                    // Drain socket
                    });
                    res.on('end', ()=>{
                    // Drain socket
                    });
                    res.setEncoding('utf8');
                    // "Key-value pairs of header names and values. Header names are lower-cased."
                    // https://nodejs.org/api/http.html#http_message_headers
                    const retryAfterHeader = res.headers['retry-after'] ?? null;
                    const rateLimitsHeader = res.headers['x-sentry-rate-limits'] ?? null;
                    resolve({
                        statusCode: res.statusCode,
                        headers: {
                            'retry-after': retryAfterHeader,
                            'x-sentry-rate-limits': Array.isArray(rateLimitsHeader) ? rateLimitsHeader[0] || null : rateLimitsHeader
                        }
                    });
                });
                req.on('error', reject);
                body.pipe(req);
            });
        });
    };
}
exports.makeNodeTransport = makeNodeTransport; //# sourceMappingURL=http.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/envToBool.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const FALSY_ENV_VALUES = new Set([
    'false',
    'f',
    'n',
    'no',
    'off',
    '0'
]);
const TRUTHY_ENV_VALUES = new Set([
    'true',
    't',
    'y',
    'yes',
    'on',
    '1'
]);
/**
 * A helper function which casts an ENV variable value to `true` or `false` using the constants defined above.
 * In strict mode, it may return `null` if the value doesn't match any of the predefined values.
 *
 * @param value The value of the env variable
 * @param options -- Only has `strict` key for now, which requires a strict match for `true` in TRUTHY_ENV_VALUES
 * @returns true/false if the lowercase value matches the predefined values above. If not, null in strict mode,
 *          and Boolean(value) in loose mode.
 */ function envToBool(value, options) {
    const normalized = String(value).toLowerCase();
    if (FALSY_ENV_VALUES.has(normalized)) {
        return false;
    }
    if (TRUTHY_ENV_VALUES.has(normalized)) {
        return true;
    }
    return options?.strict ? null : Boolean(value);
}
exports.FALSY_ENV_VALUES = FALSY_ENV_VALUES;
exports.TRUTHY_ENV_VALUES = TRUTHY_ENV_VALUES;
exports.envToBool = envToBool; //# sourceMappingURL=envToBool.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/module.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node_path = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/** normalizes Windows paths */ function normalizeWindowsPath(path) {
    return path.replace(/^[A-Z]:/, '') // remove Windows-style prefix
    .replace(/\\/g, '/'); // replace all `\` instances with `/`
}
/** Creates a function that gets the module name from a filename */ function createGetModuleFromFilename(basePath = process.argv[1] ? core.dirname(process.argv[1]) : process.cwd(), isWindows = node_path.sep === '\\') {
    const normalizedBase = isWindows ? normalizeWindowsPath(basePath) : basePath;
    return (filename)=>{
        if (!filename) {
            return;
        }
        const normalizedFilename = isWindows ? normalizeWindowsPath(filename) : filename;
        // eslint-disable-next-line prefer-const
        let { dir, base: file, ext } = node_path.posix.parse(normalizedFilename);
        if (ext === '.js' || ext === '.mjs' || ext === '.cjs') {
            file = file.slice(0, ext.length * -1);
        }
        // The file name might be URI-encoded which we want to decode to
        // the original file name.
        const decodedFile = decodeURIComponent(file);
        if (!dir) {
            // No dirname whatsoever
            dir = '.';
        }
        const n = dir.lastIndexOf('/node_modules');
        if (n > -1) {
            return `${dir.slice(n + 14).replace(/\//g, '.')}:${decodedFile}`;
        }
        // Let's see if it's a part of the main module
        // To be a part of main module, it has to share the same base
        if (dir.startsWith(normalizedBase)) {
            const moduleName = dir.slice(normalizedBase.length + 1).replace(/\//g, '.');
            return moduleName ? `${moduleName}:${decodedFile}` : decodedFile;
        }
        return decodedFile;
    };
}
exports.createGetModuleFromFilename = createGetModuleFromFilename; //# sourceMappingURL=module.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/api.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const module$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/module.js [app-ssr] (ecmascript)");
/**
 * Returns a release dynamically from environment variables.
 */ // eslint-disable-next-line complexity
function getSentryRelease(fallback) {
    // Always read first as Sentry takes this as precedence
    if (process.env.SENTRY_RELEASE) {
        return process.env.SENTRY_RELEASE;
    }
    // This supports the variable that sentry-webpack-plugin injects
    if (core.GLOBAL_OBJ.SENTRY_RELEASE?.id) {
        return core.GLOBAL_OBJ.SENTRY_RELEASE.id;
    }
    // This list is in approximate alpha order, separated into 3 categories:
    // 1. Git providers
    // 2. CI providers with specific environment variables (has the provider name in the variable name)
    // 3. CI providers with generic environment variables (checked for last to prevent possible false positives)
    const possibleReleaseNameOfGitProvider = // GitHub Actions - https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables#default-environment-variables
    process.env['GITHUB_SHA'] || // GitLab CI - https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
    process.env['CI_MERGE_REQUEST_SOURCE_BRANCH_SHA'] || process.env['CI_BUILD_REF'] || process.env['CI_COMMIT_SHA'] || // Bitbucket - https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
    process.env['BITBUCKET_COMMIT'];
    const possibleReleaseNameOfCiProvidersWithSpecificEnvVar = // AppVeyor - https://www.appveyor.com/docs/environment-variables/
    process.env['APPVEYOR_PULL_REQUEST_HEAD_COMMIT'] || process.env['APPVEYOR_REPO_COMMIT'] || // AWS CodeBuild - https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
    process.env['CODEBUILD_RESOLVED_SOURCE_VERSION'] || // AWS Amplify - https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html
    process.env['AWS_COMMIT_ID'] || // Azure Pipelines - https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml
    process.env['BUILD_SOURCEVERSION'] || // Bitrise - https://devcenter.bitrise.io/builds/available-environment-variables/
    process.env['GIT_CLONE_COMMIT_HASH'] || // Buddy CI - https://buddy.works/docs/pipelines/environment-variables#default-environment-variables
    process.env['BUDDY_EXECUTION_REVISION'] || // Builtkite - https://buildkite.com/docs/pipelines/environment-variables
    process.env['BUILDKITE_COMMIT'] || // CircleCI - https://circleci.com/docs/variables/
    process.env['CIRCLE_SHA1'] || // Cirrus CI - https://cirrus-ci.org/guide/writing-tasks/#environment-variables
    process.env['CIRRUS_CHANGE_IN_REPO'] || // Codefresh - https://codefresh.io/docs/docs/codefresh-yaml/variables/
    process.env['CF_REVISION'] || // Codemagic - https://docs.codemagic.io/yaml-basic-configuration/environment-variables/
    process.env['CM_COMMIT'] || // Cloudflare Pages - https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables
    process.env['CF_PAGES_COMMIT_SHA'] || // Drone - https://docs.drone.io/pipeline/environment/reference/
    process.env['DRONE_COMMIT_SHA'] || // Flightcontrol - https://www.flightcontrol.dev/docs/guides/flightcontrol/environment-variables#built-in-environment-variables
    process.env['FC_GIT_COMMIT_SHA'] || // Heroku #1 https://devcenter.heroku.com/articles/heroku-ci
    process.env['HEROKU_TEST_RUN_COMMIT_VERSION'] || // Heroku #2 https://docs.sentry.io/product/integrations/deployment/heroku/#configure-releases
    process.env['HEROKU_SLUG_COMMIT'] || // Railway - https://docs.railway.app/reference/variables#git-variables
    process.env['RAILWAY_GIT_COMMIT_SHA'] || // Render - https://render.com/docs/environment-variables
    process.env['RENDER_GIT_COMMIT'] || // Semaphore CI - https://docs.semaphoreci.com/ci-cd-environment/environment-variables
    process.env['SEMAPHORE_GIT_SHA'] || // TravisCI - https://docs.travis-ci.com/user/environment-variables/#default-environment-variables
    process.env['TRAVIS_PULL_REQUEST_SHA'] || // Vercel - https://vercel.com/docs/v2/build-step#system-environment-variables
    process.env['VERCEL_GIT_COMMIT_SHA'] || process.env['VERCEL_GITHUB_COMMIT_SHA'] || process.env['VERCEL_GITLAB_COMMIT_SHA'] || process.env['VERCEL_BITBUCKET_COMMIT_SHA'] || // Zeit (now known as Vercel)
    process.env['ZEIT_GITHUB_COMMIT_SHA'] || process.env['ZEIT_GITLAB_COMMIT_SHA'] || process.env['ZEIT_BITBUCKET_COMMIT_SHA'];
    const possibleReleaseNameOfCiProvidersWithGenericEnvVar = // CloudBees CodeShip - https://docs.cloudbees.com/docs/cloudbees-codeship/latest/pro-builds-and-configuration/environment-variables
    process.env['CI_COMMIT_ID'] || // Coolify - https://coolify.io/docs/knowledge-base/environment-variables
    process.env['SOURCE_COMMIT'] || // Heroku #3 https://devcenter.heroku.com/changelog-items/630
    process.env['SOURCE_VERSION'] || // Jenkins - https://plugins.jenkins.io/git/#environment-variables
    process.env['GIT_COMMIT'] || // Netlify - https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
    process.env['COMMIT_REF'] || // TeamCity - https://www.jetbrains.com/help/teamcity/predefined-build-parameters.html
    process.env['BUILD_VCS_NUMBER'] || // Woodpecker CI - https://woodpecker-ci.org/docs/usage/environment
    process.env['CI_COMMIT_SHA'];
    return possibleReleaseNameOfGitProvider || possibleReleaseNameOfCiProvidersWithSpecificEnvVar || possibleReleaseNameOfCiProvidersWithGenericEnvVar || fallback;
}
/** Node.js stack parser */ const defaultStackParser = core.createStackParser(core.nodeStackLineParser(module$1.createGetModuleFromFilename()));
exports.defaultStackParser = defaultStackParser;
exports.getSentryRelease = getSentryRelease; //# sourceMappingURL=api.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const os = __turbopack_context__.r("[externals]/node:os [external] (node:os, cjs)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const worker_threads = __turbopack_context__.r("[externals]/worker_threads [external] (worker_threads, cjs)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const DEFAULT_CLIENT_REPORT_FLUSH_INTERVAL_MS = 60000; // 60s was chosen arbitrarily
/** A client for using Sentry with Node & OpenTelemetry. */ class NodeClient extends core.ServerRuntimeClient {
    constructor(options){
        const serverName = options.includeServerName === false ? undefined : options.serverName || /*TURBOPACK member replacement*/ __turbopack_context__.g.process.env.SENTRY_NAME || os.hostname();
        const clientOptions = {
            ...options,
            platform: 'node',
            runtime: {
                name: 'node',
                version: /*TURBOPACK member replacement*/ __turbopack_context__.g.process.version
            },
            serverName
        };
        if (options.openTelemetryInstrumentations) {
            instrumentation.registerInstrumentations({
                instrumentations: options.openTelemetryInstrumentations
            });
        }
        core.applySdkMetadata(clientOptions, 'node');
        core.debug.log(`Initializing Sentry: process: ${process.pid}, thread: ${worker_threads.isMainThread ? 'main' : `worker-${worker_threads.threadId}`}.`);
        super(clientOptions);
        if (this.getOptions().enableLogs) {
            this._logOnExitFlushListener = ()=>{
                core._INTERNAL_flushLogsBuffer(this);
            };
            if (serverName) {
                this.on('beforeCaptureLog', (log)=>{
                    log.attributes = {
                        ...log.attributes,
                        'server.address': serverName
                    };
                });
            }
            process.on('beforeExit', this._logOnExitFlushListener);
        }
    }
    /** Get the OTEL tracer. */ get tracer() {
        if (this._tracer) {
            return this._tracer;
        }
        const name = '@sentry/node';
        const version = core.SDK_VERSION;
        const tracer = api.trace.getTracer(name, version);
        this._tracer = tracer;
        return tracer;
    }
    // Eslint ignore explanation: This is already documented in super.
    // eslint-disable-next-line jsdoc/require-jsdoc
    async flush(timeout) {
        const provider = this.traceProvider;
        await provider?.forceFlush();
        if (this.getOptions().sendClientReports) {
            this._flushOutcomes();
        }
        return super.flush(timeout);
    }
    // Eslint ignore explanation: This is already documented in super.
    // eslint-disable-next-line jsdoc/require-jsdoc
    close(timeout) {
        if (this._clientReportInterval) {
            clearInterval(this._clientReportInterval);
        }
        if (this._clientReportOnExitFlushListener) {
            process.off('beforeExit', this._clientReportOnExitFlushListener);
        }
        if (this._logOnExitFlushListener) {
            process.off('beforeExit', this._logOnExitFlushListener);
        }
        return super.close(timeout);
    }
    /**
   * Will start tracking client reports for this client.
   *
   * NOTICE: This method will create an interval that is periodically called and attach a `process.on('beforeExit')`
   * hook. To clean up these resources, call `.close()` when you no longer intend to use the client. Not doing so will
   * result in a memory leak.
   */ // The reason client reports need to be manually activated with this method instead of just enabling them in a
    // constructor, is that if users periodically and unboundedly create new clients, we will create more and more
    // intervals and beforeExit listeners, thus leaking memory. In these situations, users are required to call
    // `client.close()` in order to dispose of the acquired resources.
    // We assume that calling this method in Sentry.init() is a sensible default, because calling Sentry.init() over and
    // over again would also result in memory leaks.
    // Note: We have experimented with using `FinalizationRegisty` to clear the interval when the client is garbage
    // collected, but it did not work, because the cleanup function never got called.
    startClientReportTracking() {
        const clientOptions = this.getOptions();
        if (clientOptions.sendClientReports) {
            this._clientReportOnExitFlushListener = ()=>{
                this._flushOutcomes();
            };
            this._clientReportInterval = setInterval(()=>{
                debugBuild.DEBUG_BUILD && core.debug.log('Flushing client reports based on interval.');
                this._flushOutcomes();
            }, clientOptions.clientReportFlushInterval ?? DEFAULT_CLIENT_REPORT_FLUSH_INTERVAL_MS)// Unref is critical for not preventing the process from exiting because the interval is active.
            .unref();
            process.on('beforeExit', this._clientReportOnExitFlushListener);
        }
    }
    /** Custom implementation for OTEL, so we can handle scope-span linking. */ _getTraceInfoFromScope(scope) {
        if (!scope) {
            return [
                undefined,
                undefined
            ];
        }
        return opentelemetry.getTraceContextForScope(this, scope);
    }
}
exports.NodeClient = NodeClient; //# sourceMappingURL=client.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/esmLoader.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const importInTheMiddle = __turbopack_context__.r("[externals]/import-in-the-middle [external] (import-in-the-middle, cjs)");
const moduleModule = __turbopack_context__.r("[externals]/module [external] (module, cjs)");
var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/** Initialize the ESM loader. */ function maybeInitializeEsmLoader() {
    const [nodeMajor = 0, nodeMinor = 0] = process.versions.node.split('.').map(Number);
    // Register hook was added in v20.6.0 and v18.19.0
    if (nodeMajor >= 21 || nodeMajor === 20 && nodeMinor >= 6 || nodeMajor === 18 && nodeMinor >= 19) {
        if (!core.GLOBAL_OBJ._sentryEsmLoaderHookRegistered) {
            try {
                const { addHookMessagePort } = importInTheMiddle.createAddHookMessageChannel();
                // @ts-expect-error register is available in these versions
                moduleModule.default.register('import-in-the-middle/hook.mjs', typeof document === 'undefined' ? __turbopack_context__.r("[externals]/url [external] (url, cjs)").pathToFileURL(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/esmLoader.js")).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('sdk/esmLoader.js', document.baseURI).href, {
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
exports.maybeInitializeEsmLoader = maybeInitializeEsmLoader; //# sourceMappingURL=esmLoader.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const childProcess = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/childProcess.js [app-ssr] (ecmascript)");
const context = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/context.js [app-ssr] (ecmascript)");
const contextlines = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/contextlines.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/index.js [app-ssr] (ecmascript)");
const index$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/index.js [app-ssr] (ecmascript)");
const modules = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/modules.js [app-ssr] (ecmascript)");
const index$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/index.js [app-ssr] (ecmascript)");
const onuncaughtexception = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onuncaughtexception.js [app-ssr] (ecmascript)");
const onunhandledrejection = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onunhandledrejection.js [app-ssr] (ecmascript)");
const processSession = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/processSession.js [app-ssr] (ecmascript)");
const spotlight = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/spotlight.js [app-ssr] (ecmascript)");
const systemError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/systemError.js [app-ssr] (ecmascript)");
const http = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/transports/http.js [app-ssr] (ecmascript)");
const commonjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)");
const envToBool = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/envToBool.js [app-ssr] (ecmascript)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/api.js [app-ssr] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/client.js [app-ssr] (ecmascript)");
const esmLoader = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/esmLoader.js [app-ssr] (ecmascript)");
/**
 * Get default integrations for the Node-Core SDK.
 */ function getDefaultIntegrations() {
    return [
        // Common
        // TODO(v11): Replace with `eventFiltersIntegration` once we remove the deprecated `inboundFiltersIntegration`
        // eslint-disable-next-line deprecation/deprecation
        core.inboundFiltersIntegration(),
        core.functionToStringIntegration(),
        core.linkedErrorsIntegration(),
        core.requestDataIntegration(),
        systemError.systemErrorIntegration(),
        // Native Wrappers
        core.consoleIntegration(),
        index.httpIntegration(),
        index$1.nativeNodeFetchIntegration(),
        // Global Handlers
        onuncaughtexception.onUncaughtExceptionIntegration(),
        onunhandledrejection.onUnhandledRejectionIntegration(),
        // Event Info
        contextlines.contextLinesIntegration(),
        index$2.localVariablesIntegration(),
        context.nodeContextIntegration(),
        childProcess.childProcessIntegration(),
        processSession.processSessionIntegration(),
        modules.modulesIntegration()
    ];
}
/**
 * Initialize Sentry for Node.
 */ function init(options = {}) {
    return _init(options, getDefaultIntegrations);
}
/**
 * Initialize Sentry for Node, without any integrations added by default.
 */ function initWithoutDefaultIntegrations(options = {}) {
    return _init(options, ()=>[]);
}
/**
 * Initialize Sentry for Node, without performance instrumentation.
 */ function _init(_options = {}, getDefaultIntegrationsImpl) {
    const options = getClientOptions(_options, getDefaultIntegrationsImpl);
    if (options.debug === true) {
        if (debugBuild.DEBUG_BUILD) {
            core.debug.enable();
        } else {
            // use `console.warn` rather than `debug.warn` since by non-debug bundles have all `debug.x` statements stripped
            core.consoleSandbox(()=>{
                // eslint-disable-next-line no-console
                console.warn('[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.');
            });
        }
    }
    if (!commonjs.isCjs() && options.registerEsmLoaderHooks !== false) {
        esmLoader.maybeInitializeEsmLoader();
    }
    opentelemetry.setOpenTelemetryContextAsyncContextStrategy();
    const scope = core.getCurrentScope();
    scope.update(options.initialScope);
    if (options.spotlight && !options.integrations.some(({ name })=>name === spotlight.INTEGRATION_NAME)) {
        options.integrations.push(spotlight.spotlightIntegration({
            sidecarUrl: typeof options.spotlight === 'string' ? options.spotlight : undefined
        }));
    }
    core.applySdkMetadata(options, 'node-core');
    const client$1 = new client.NodeClient(options);
    // The client is on the current scope, from where it generally is inherited
    core.getCurrentScope().setClient(client$1);
    client$1.init();
    core.debug.log(`Running in ${commonjs.isCjs() ? 'CommonJS' : 'ESM'} mode.`);
    client$1.startClientReportTracking();
    updateScopeFromEnvVariables();
    opentelemetry.enhanceDscWithOpenTelemetryRootSpanName(client$1);
    opentelemetry.setupEventContextTrace(client$1);
    return client$1;
}
/**
 * Validate that your OpenTelemetry setup is correct.
 */ function validateOpenTelemetrySetup() {
    if (!debugBuild.DEBUG_BUILD) {
        return;
    }
    const setup = opentelemetry.openTelemetrySetupCheck();
    const required = [
        'SentryContextManager',
        'SentryPropagator'
    ];
    if (core.hasSpansEnabled()) {
        required.push('SentrySpanProcessor');
    }
    for (const k of required){
        if (!setup.includes(k)) {
            core.debug.error(`You have to set up the ${k}. Without this, the OpenTelemetry & Sentry integration will not work properly.`);
        }
    }
    if (!setup.includes('SentrySampler')) {
        core.debug.warn('You have to set up the SentrySampler. Without this, the OpenTelemetry & Sentry integration may still work, but sample rates set for the Sentry SDK will not be respected. If you use a custom sampler, make sure to use `wrapSamplingDecision`.');
    }
}
function getClientOptions(options, getDefaultIntegrationsImpl) {
    const release = getRelease(options.release);
    const spotlight = options.spotlight ?? envToBool.envToBool(process.env.SENTRY_SPOTLIGHT, {
        strict: true
    }) ?? process.env.SENTRY_SPOTLIGHT;
    const tracesSampleRate = getTracesSampleRate(options.tracesSampleRate);
    const mergedOptions = {
        ...options,
        dsn: options.dsn ?? process.env.SENTRY_DSN,
        environment: options.environment ?? process.env.SENTRY_ENVIRONMENT,
        sendClientReports: options.sendClientReports ?? true,
        transport: options.transport ?? http.makeNodeTransport,
        stackParser: core.stackParserFromStackParserOptions(options.stackParser || api.defaultStackParser),
        release,
        tracesSampleRate,
        spotlight,
        debug: envToBool.envToBool(options.debug ?? process.env.SENTRY_DEBUG)
    };
    const integrations = options.integrations;
    const defaultIntegrations = options.defaultIntegrations ?? getDefaultIntegrationsImpl(mergedOptions);
    return {
        ...mergedOptions,
        integrations: core.getIntegrationsToSetup({
            defaultIntegrations,
            integrations
        })
    };
}
function getRelease(release) {
    if (release !== undefined) {
        return release;
    }
    const detectedRelease = api.getSentryRelease();
    if (detectedRelease !== undefined) {
        return detectedRelease;
    }
    return undefined;
}
function getTracesSampleRate(tracesSampleRate) {
    if (tracesSampleRate !== undefined) {
        return tracesSampleRate;
    }
    const sampleRateFromEnv = process.env.SENTRY_TRACES_SAMPLE_RATE;
    if (!sampleRateFromEnv) {
        return undefined;
    }
    const parsed = parseFloat(sampleRateFromEnv);
    return isFinite(parsed) ? parsed : undefined;
}
/**
 * Update scope and propagation context based on environmental variables.
 *
 * See https://github.com/getsentry/rfcs/blob/main/text/0071-continue-trace-over-process-boundaries.md
 * for more details.
 */ function updateScopeFromEnvVariables() {
    if (envToBool.envToBool(process.env.SENTRY_USE_ENVIRONMENT) !== false) {
        const sentryTraceEnv = process.env.SENTRY_TRACE;
        const baggageEnv = process.env.SENTRY_BAGGAGE;
        const propagationContext = core.propagationContextFromHeaders(sentryTraceEnv, baggageEnv);
        core.getCurrentScope().setPropagationContext(propagationContext);
    }
}
exports.getDefaultIntegrations = getDefaultIntegrations;
exports.init = init;
exports.initWithoutDefaultIntegrations = initWithoutDefaultIntegrations;
exports.validateOpenTelemetrySetup = validateOpenTelemetrySetup; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/scope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Update the active isolation scope.
 * Should be used with caution!
 */ function setIsolationScope(isolationScope) {
    const scopes = opentelemetry.getScopesFromContext(api.context.active());
    if (scopes) {
        scopes.isolationScope = isolationScope;
    }
}
exports.setIsolationScope = setIsolationScope; //# sourceMappingURL=scope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/addOriginToSpan.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/** Adds an origin to an OTEL Span. */ function addOriginToSpan(span, origin) {
    span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, origin);
}
exports.addOriginToSpan = addOriginToSpan; //# sourceMappingURL=addOriginToSpan.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/createMissingInstrumentationContext.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const commonjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)");
const createMissingInstrumentationContext = (pkg)=>({
        package: pkg,
        'javascript.is_cjs': commonjs.isCjs()
    });
exports.createMissingInstrumentationContext = createMissingInstrumentationContext; //# sourceMappingURL=createMissingInstrumentationContext.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/ensureIsWrapped.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const instrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+instrumentation@0.203.0_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/instrumentation/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const commonjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)");
const createMissingInstrumentationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/createMissingInstrumentationContext.js [app-ssr] (ecmascript)");
/**
 * Checks and warns if a framework isn't wrapped by opentelemetry.
 */ function ensureIsWrapped(maybeWrappedFunction, name) {
    const clientOptions = core.getClient()?.getOptions();
    if (!clientOptions?.disableInstrumentationWarnings && !instrumentation.isWrapped(maybeWrappedFunction) && core.isEnabled() && core.hasSpansEnabled(clientOptions)) {
        core.consoleSandbox(()=>{
            if (commonjs.isCjs()) {
                // eslint-disable-next-line no-console
                console.warn(`[Sentry] ${name} is not instrumented. This is likely because you required/imported ${name} before calling \`Sentry.init()\`.`);
            } else {
                // eslint-disable-next-line no-console
                console.warn(`[Sentry] ${name} is not instrumented. Please make sure to initialize Sentry in a separate file that you \`--import\` when running node, see: https://docs.sentry.io/platforms/javascript/guides/${name}/install/esm/.`);
            }
        });
        core.getGlobalScope().setContext('missing_instrumentation', createMissingInstrumentationContext.createMissingInstrumentationContext(name));
    }
}
exports.ensureIsWrapped = ensureIsWrapped; //# sourceMappingURL=ensureIsWrapped.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/common.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const replacements = [
    [
        'january',
        '1'
    ],
    [
        'february',
        '2'
    ],
    [
        'march',
        '3'
    ],
    [
        'april',
        '4'
    ],
    [
        'may',
        '5'
    ],
    [
        'june',
        '6'
    ],
    [
        'july',
        '7'
    ],
    [
        'august',
        '8'
    ],
    [
        'september',
        '9'
    ],
    [
        'october',
        '10'
    ],
    [
        'november',
        '11'
    ],
    [
        'december',
        '12'
    ],
    [
        'jan',
        '1'
    ],
    [
        'feb',
        '2'
    ],
    [
        'mar',
        '3'
    ],
    [
        'apr',
        '4'
    ],
    [
        'may',
        '5'
    ],
    [
        'jun',
        '6'
    ],
    [
        'jul',
        '7'
    ],
    [
        'aug',
        '8'
    ],
    [
        'sep',
        '9'
    ],
    [
        'oct',
        '10'
    ],
    [
        'nov',
        '11'
    ],
    [
        'dec',
        '12'
    ],
    [
        'sunday',
        '0'
    ],
    [
        'monday',
        '1'
    ],
    [
        'tuesday',
        '2'
    ],
    [
        'wednesday',
        '3'
    ],
    [
        'thursday',
        '4'
    ],
    [
        'friday',
        '5'
    ],
    [
        'saturday',
        '6'
    ],
    [
        'sun',
        '0'
    ],
    [
        'mon',
        '1'
    ],
    [
        'tue',
        '2'
    ],
    [
        'wed',
        '3'
    ],
    [
        'thu',
        '4'
    ],
    [
        'fri',
        '5'
    ],
    [
        'sat',
        '6'
    ]
];
/**
 * Replaces names in cron expressions
 */ function replaceCronNames(cronExpression) {
    return replacements.reduce(// eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor
    (acc, [name, replacement])=>acc.replace(new RegExp(name, 'gi'), replacement), cronExpression);
}
exports.replaceCronNames = replaceCronNames; //# sourceMappingURL=common.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/cron.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const common = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/common.js [app-ssr] (ecmascript)");
const ERROR_TEXT = 'Automatic instrumentation of CronJob only supports crontab string';
/**
 * Instruments the `cron` library to send a check-in event to Sentry for each job execution.
 *
 * ```ts
 * import * as Sentry from '@sentry/node';
 * import { CronJob } from 'cron';
 *
 * const CronJobWithCheckIn = Sentry.cron.instrumentCron(CronJob, 'my-cron-job');
 *
 * // use the constructor
 * const job = new CronJobWithCheckIn('* * * * *', () => {
 *  console.log('You will see this message every minute');
 * });
 *
 * // or from
 * const job = CronJobWithCheckIn.from({ cronTime: '* * * * *', onTick: () => {
 *   console.log('You will see this message every minute');
 * });
 * ```
 */ function instrumentCron(lib, monitorSlug) {
    let jobScheduled = false;
    return new Proxy(lib, {
        construct (target, args) {
            const [cronTime, onTick, onComplete, start, timeZone, ...rest] = args;
            if (typeof cronTime !== 'string') {
                throw new Error(ERROR_TEXT);
            }
            if (jobScheduled) {
                throw new Error(`A job named '${monitorSlug}' has already been scheduled`);
            }
            jobScheduled = true;
            const cronString = common.replaceCronNames(cronTime);
            async function monitoredTick(context, onComplete) {
                return core.withMonitor(monitorSlug, async ()=>{
                    try {
                        await onTick(context, onComplete);
                    } catch (e) {
                        core.captureException(e);
                        throw e;
                    }
                }, {
                    schedule: {
                        type: 'crontab',
                        value: cronString
                    },
                    timezone: timeZone || undefined
                });
            }
            return new target(cronTime, monitoredTick, onComplete, start, timeZone, ...rest);
        },
        get (target, prop) {
            if (prop === 'from') {
                return (param)=>{
                    const { cronTime, onTick, timeZone } = param;
                    if (typeof cronTime !== 'string') {
                        throw new Error(ERROR_TEXT);
                    }
                    if (jobScheduled) {
                        throw new Error(`A job named '${monitorSlug}' has already been scheduled`);
                    }
                    jobScheduled = true;
                    const cronString = common.replaceCronNames(cronTime);
                    param.onTick = async (context, onComplete)=>{
                        return core.withMonitor(monitorSlug, async ()=>{
                            try {
                                await onTick(context, onComplete);
                            } catch (e) {
                                core.captureException(e);
                                throw e;
                            }
                        }, {
                            schedule: {
                                type: 'crontab',
                                value: cronString
                            },
                            timezone: timeZone || undefined
                        });
                    };
                    return target.from(param);
                };
            } else {
                return target[prop];
            }
        }
    });
}
exports.instrumentCron = instrumentCron; //# sourceMappingURL=cron.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/node-cron.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const common = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/common.js [app-ssr] (ecmascript)");
/**
 * Wraps the `node-cron` library with check-in monitoring.
 *
 * ```ts
 * import * as Sentry from "@sentry/node";
 * import * as cron from "node-cron";
 *
 * const cronWithCheckIn = Sentry.cron.instrumentNodeCron(cron);
 *
 * cronWithCheckIn.schedule(
 *   "* * * * *",
 *   () => {
 *     console.log("running a task every minute");
 *   },
 *   { name: "my-cron-job" },
 * );
 * ```
 */ function instrumentNodeCron(lib) {
    return new Proxy(lib, {
        get (target, prop) {
            if (prop === 'schedule' && target.schedule) {
                // When 'get' is called for schedule, return a proxied version of the schedule function
                return new Proxy(target.schedule, {
                    apply (target, thisArg, argArray) {
                        const [expression, callback, options] = argArray;
                        const name = options?.name;
                        const timezone = options?.timezone;
                        if (!name) {
                            throw new Error('Missing "name" for scheduled job. A name is required for Sentry check-in monitoring.');
                        }
                        const monitoredCallback = async ()=>{
                            return core.withMonitor(name, async ()=>{
                                // We have to manually catch here and capture the exception because node-cron swallows errors
                                // https://github.com/node-cron/node-cron/issues/399
                                try {
                                    return await callback();
                                } catch (e) {
                                    core.captureException(e);
                                    throw e;
                                }
                            }, {
                                schedule: {
                                    type: 'crontab',
                                    value: common.replaceCronNames(expression)
                                },
                                timezone
                            });
                        };
                        return target.apply(thisArg, [
                            expression,
                            monitoredCallback,
                            options
                        ]);
                    }
                });
            } else {
                return target[prop];
            }
        }
    });
}
exports.instrumentNodeCron = instrumentNodeCron; //# sourceMappingURL=node-cron.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/node-schedule.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const common = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/common.js [app-ssr] (ecmascript)");
/**
 * Instruments the `node-schedule` library to send a check-in event to Sentry for each job execution.
 *
 * ```ts
 * import * as Sentry from '@sentry/node';
 * import * as schedule from 'node-schedule';
 *
 * const scheduleWithCheckIn = Sentry.cron.instrumentNodeSchedule(schedule);
 *
 * const job = scheduleWithCheckIn.scheduleJob('my-cron-job', '* * * * *', () => {
 *  console.log('You will see this message every minute');
 * });
 * ```
 */ function instrumentNodeSchedule(lib) {
    return new Proxy(lib, {
        get (target, prop) {
            if (prop === 'scheduleJob') {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                return new Proxy(target.scheduleJob, {
                    apply (target, thisArg, argArray) {
                        const [nameOrExpression, expressionOrCallback, callback] = argArray;
                        if (typeof nameOrExpression !== 'string' || typeof expressionOrCallback !== 'string' || typeof callback !== 'function') {
                            throw new Error("Automatic instrumentation of 'node-schedule' requires the first parameter of 'scheduleJob' to be a job name string and the second parameter to be a crontab string");
                        }
                        const monitorSlug = nameOrExpression;
                        const expression = expressionOrCallback;
                        async function monitoredCallback() {
                            return core.withMonitor(monitorSlug, async ()=>{
                                await callback?.();
                            }, {
                                schedule: {
                                    type: 'crontab',
                                    value: common.replaceCronNames(expression)
                                }
                            });
                        }
                        return target.apply(thisArg, [
                            monitorSlug,
                            expression,
                            monitoredCallback
                        ]);
                    }
                });
            }
            return target[prop];
        }
    });
}
exports.instrumentNodeSchedule = instrumentNodeSchedule; //# sourceMappingURL=node-schedule.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const cron$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/cron.js [app-ssr] (ecmascript)");
const nodeCron = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/node-cron.js [app-ssr] (ecmascript)");
const nodeSchedule = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/node-schedule.js [app-ssr] (ecmascript)");
/** Methods to instrument cron libraries for Sentry check-ins */ const cron = {
    instrumentCron: cron$1.instrumentCron,
    instrumentNodeCron: nodeCron.instrumentNodeCron,
    instrumentNodeSchedule: nodeSchedule.instrumentNodeSchedule
};
exports.cron = cron; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/logs/exports.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/index.js [app-ssr] (ecmascript)");
const SentryHttpInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/http/SentryHttpInstrumentation.js [app-ssr] (ecmascript)");
const index$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/index.js [app-ssr] (ecmascript)");
const SentryNodeFetchInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/node-fetch/SentryNodeFetchInstrumentation.js [app-ssr] (ecmascript)");
const context = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/context.js [app-ssr] (ecmascript)");
const contextlines = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/contextlines.js [app-ssr] (ecmascript)");
const index$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/local-variables/index.js [app-ssr] (ecmascript)");
const modules = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/modules.js [app-ssr] (ecmascript)");
const onuncaughtexception = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onuncaughtexception.js [app-ssr] (ecmascript)");
const onunhandledrejection = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/onunhandledrejection.js [app-ssr] (ecmascript)");
const index$3 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/anr/index.js [app-ssr] (ecmascript)");
const spotlight = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/spotlight.js [app-ssr] (ecmascript)");
const systemError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/systemError.js [app-ssr] (ecmascript)");
const childProcess = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/childProcess.js [app-ssr] (ecmascript)");
const winston = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/integrations/winston.js [app-ssr] (ecmascript)");
const contextManager = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/contextManager.js [app-ssr] (ecmascript)");
const logger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/logger.js [app-ssr] (ecmascript)");
const instrument = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/otel/instrument.js [app-ssr] (ecmascript)");
const index$4 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/index.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/scope.js [app-ssr] (ecmascript)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/api.js [app-ssr] (ecmascript)");
const module$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/module.js [app-ssr] (ecmascript)");
const addOriginToSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/addOriginToSpan.js [app-ssr] (ecmascript)");
const getRequestUrl = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/getRequestUrl.js [app-ssr] (ecmascript)");
const commonjs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/commonjs.js [app-ssr] (ecmascript)");
const ensureIsWrapped = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/ensureIsWrapped.js [app-ssr] (ecmascript)");
const createMissingInstrumentationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/createMissingInstrumentationContext.js [app-ssr] (ecmascript)");
const envToBool = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/utils/envToBool.js [app-ssr] (ecmascript)");
const http = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/transports/http.js [app-ssr] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/sdk/client.js [app-ssr] (ecmascript)");
const index$5 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/cron/index.js [app-ssr] (ecmascript)");
const nodeVersion = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node-core@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hooks@2._59bae3b21553cb2244142e082c55711c/node_modules/@sentry/node-core/build/cjs/nodeVersion.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
exports.logger = exports$1;
exports.httpIntegration = index.httpIntegration;
exports.SentryHttpInstrumentation = SentryHttpInstrumentation.SentryHttpInstrumentation;
exports.nativeNodeFetchIntegration = index$1.nativeNodeFetchIntegration;
exports.SentryNodeFetchInstrumentation = SentryNodeFetchInstrumentation.SentryNodeFetchInstrumentation;
exports.nodeContextIntegration = context.nodeContextIntegration;
exports.contextLinesIntegration = contextlines.contextLinesIntegration;
exports.localVariablesIntegration = index$2.localVariablesIntegration;
exports.modulesIntegration = modules.modulesIntegration;
exports.onUncaughtExceptionIntegration = onuncaughtexception.onUncaughtExceptionIntegration;
exports.onUnhandledRejectionIntegration = onunhandledrejection.onUnhandledRejectionIntegration;
exports.anrIntegration = index$3.anrIntegration;
exports.disableAnrDetectionForCallback = index$3.disableAnrDetectionForCallback;
exports.spotlightIntegration = spotlight.spotlightIntegration;
exports.systemErrorIntegration = systemError.systemErrorIntegration;
exports.childProcessIntegration = childProcess.childProcessIntegration;
exports.createSentryWinstonTransport = winston.createSentryWinstonTransport;
exports.SentryContextManager = contextManager.SentryContextManager;
exports.setupOpenTelemetryLogger = logger.setupOpenTelemetryLogger;
exports.INSTRUMENTED = instrument.INSTRUMENTED;
exports.generateInstrumentOnce = instrument.generateInstrumentOnce;
exports.instrumentWhenWrapped = instrument.instrumentWhenWrapped;
exports.getDefaultIntegrations = index$4.getDefaultIntegrations;
exports.init = index$4.init;
exports.initWithoutDefaultIntegrations = index$4.initWithoutDefaultIntegrations;
exports.validateOpenTelemetrySetup = index$4.validateOpenTelemetrySetup;
exports.setIsolationScope = scope.setIsolationScope;
exports.defaultStackParser = api.defaultStackParser;
exports.getSentryRelease = api.getSentryRelease;
exports.createGetModuleFromFilename = module$1.createGetModuleFromFilename;
exports.addOriginToSpan = addOriginToSpan.addOriginToSpan;
exports.getRequestUrl = getRequestUrl.getRequestUrl;
exports.isCjs = commonjs.isCjs;
exports.ensureIsWrapped = ensureIsWrapped.ensureIsWrapped;
exports.createMissingInstrumentationContext = createMissingInstrumentationContext.createMissingInstrumentationContext;
exports.envToBool = envToBool.envToBool;
exports.makeNodeTransport = http.makeNodeTransport;
exports.NodeClient = client.NodeClient;
exports.cron = index$5.cron;
exports.NODE_VERSION = nodeVersion.NODE_VERSION;
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
exports.zodErrorsIntegration = core.zodErrorsIntegration; //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=888db_%40sentry_node-core_build_cjs_65fc5d19._.js.map