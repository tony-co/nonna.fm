module.exports = [
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/** Internal global with common properties and Sentry extensions  */ /** Get's the global object for the current JavaScript runtime */ const GLOBAL_OBJ = globalThis;
exports.GLOBAL_OBJ = GLOBAL_OBJ; //# sourceMappingURL=worldwide.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/version.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// This is a magic string replaced by rollup
const SDK_VERSION = "10.5.0";
exports.SDK_VERSION = SDK_VERSION; //# sourceMappingURL=version.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const version = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/version.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/**
 * An object that contains globally accessible properties and maintains a scope stack.
 * @hidden
 */ /**
 * Returns the global shim registry.
 *
 * FIXME: This function is problematic, because despite always returning a valid Carrier,
 * it has an optional `__SENTRY__` property, which then in turn requires us to always perform an unnecessary check
 * at the call-site. We always access the carrier through this function, so we can guarantee that `__SENTRY__` is there.
 **/ function getMainCarrier() {
    // This ensures a Sentry carrier exists
    getSentryCarrier(worldwide.GLOBAL_OBJ);
    return worldwide.GLOBAL_OBJ;
}
/** Will either get the existing sentry carrier, or create a new one. */ function getSentryCarrier(carrier) {
    const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
    // For now: First SDK that sets the .version property wins
    __SENTRY__.version = __SENTRY__.version || version.SDK_VERSION;
    // Intentionally populating and returning the version of "this" SDK instance
    // rather than what's set in .version so that "this" SDK always gets its carrier
    return __SENTRY__[version.SDK_VERSION] = __SENTRY__[version.SDK_VERSION] || {};
}
/**
 * Returns a global singleton contained in the global `__SENTRY__[]` object.
 *
 * If the singleton doesn't already exist in `__SENTRY__`, it will be created using the given factory
 * function and added to the `__SENTRY__` object.
 *
 * @param name name of the global singleton on __SENTRY__
 * @param creator creator Factory function to create the singleton if it doesn't already exist on `__SENTRY__`
 * @param obj (Optional) The global object on which to look for `__SENTRY__`, if not `GLOBAL_OBJ`'s return value
 * @returns the singleton
 */ function getGlobalSingleton(name, creator, obj = worldwide.GLOBAL_OBJ) {
    const __SENTRY__ = obj.__SENTRY__ = obj.__SENTRY__ || {};
    const carrier = __SENTRY__[version.SDK_VERSION] = __SENTRY__[version.SDK_VERSION] || {};
    // Note: We do not want to set `carrier.version` here, as this may be called before any `init` is called, e.g. for the default scopes
    return carrier[name] || (carrier[name] = creator());
}
exports.getGlobalSingleton = getGlobalSingleton;
exports.getMainCarrier = getMainCarrier;
exports.getSentryCarrier = getSentryCarrier; //# sourceMappingURL=carrier.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const CONSOLE_LEVELS = [
    'debug',
    'info',
    'warn',
    'error',
    'log',
    'assert',
    'trace'
];
/** Prefix for logging strings */ const PREFIX = 'Sentry Logger ';
/** This may be mutated by the console instrumentation. */ const originalConsoleMethods = {};
/**
 * Temporarily disable sentry console instrumentations.
 *
 * @param callback The function to run against the original `console` messages
 * @returns The results of the callback
 */ function consoleSandbox(callback) {
    if (!('console' in worldwide.GLOBAL_OBJ)) {
        return callback();
    }
    const console = worldwide.GLOBAL_OBJ.console;
    const wrappedFuncs = {};
    const wrappedLevels = Object.keys(originalConsoleMethods);
    // Restore all wrapped console methods
    wrappedLevels.forEach((level)=>{
        const originalConsoleMethod = originalConsoleMethods[level];
        wrappedFuncs[level] = console[level];
        console[level] = originalConsoleMethod;
    });
    try {
        return callback();
    } finally{
        // Revert restoration to wrapped state
        wrappedLevels.forEach((level)=>{
            console[level] = wrappedFuncs[level];
        });
    }
}
function enable() {
    _getLoggerSettings().enabled = true;
}
function disable() {
    _getLoggerSettings().enabled = false;
}
function isEnabled() {
    return _getLoggerSettings().enabled;
}
function log(...args) {
    _maybeLog('log', ...args);
}
function warn(...args) {
    _maybeLog('warn', ...args);
}
function error(...args) {
    _maybeLog('error', ...args);
}
function _maybeLog(level, ...args) {
    if (!debugBuild.DEBUG_BUILD) {
        return;
    }
    if (isEnabled()) {
        consoleSandbox(()=>{
            worldwide.GLOBAL_OBJ.console[level](`${PREFIX}[${level}]:`, ...args);
        });
    }
}
function _getLoggerSettings() {
    if (!debugBuild.DEBUG_BUILD) {
        return {
            enabled: false
        };
    }
    return carrier.getGlobalSingleton('loggerSettings', ()=>({
            enabled: false
        }));
}
/**
 * This is a logger singleton which either logs things or no-ops if logging is not enabled.
 */ const debug = {
    /** Enable logging. */ enable,
    /** Disable logging. */ disable,
    /** Check if logging is enabled. */ isEnabled,
    /** Log a message. */ log,
    /** Log a warning. */ warn,
    /** Log an error. */ error
};
exports.CONSOLE_LEVELS = CONSOLE_LEVELS;
exports.consoleSandbox = consoleSandbox;
exports.debug = debug;
exports.originalConsoleMethods = originalConsoleMethods; //# sourceMappingURL=debug-logger.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const STACKTRACE_FRAME_LIMIT = 50;
const UNKNOWN_FUNCTION = '?';
// Used to sanitize webpack (error: *) wrapped stack errors
const WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
const STRIP_FRAME_REGEXP = /captureMessage|captureException/;
/**
 * Creates a stack parser with the supplied line parsers
 *
 * StackFrames are returned in the correct order for Sentry Exception
 * frames and with Sentry SDK internal frames removed from the top and bottom
 *
 */ function createStackParser(...parsers) {
    const sortedParsers = parsers.sort((a, b)=>a[0] - b[0]).map((p)=>p[1]);
    return (stack, skipFirstLines = 0, framesToPop = 0)=>{
        const frames = [];
        const lines = stack.split('\n');
        for(let i = skipFirstLines; i < lines.length; i++){
            let line = lines[i];
            // Truncate lines over 1kb because many of the regular expressions use
            // backtracking which results in run time that increases exponentially
            // with input size. Huge strings can result in hangs/Denial of Service:
            // https://github.com/getsentry/sentry-javascript/issues/2286
            if (line.length > 1024) {
                line = line.slice(0, 1024);
            }
            // https://github.com/getsentry/sentry-javascript/issues/5459
            // Remove webpack (error: *) wrappers
            const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, '$1') : line;
            // https://github.com/getsentry/sentry-javascript/issues/7813
            // Skip Error: lines
            if (cleanedLine.match(/\S*Error: /)) {
                continue;
            }
            for (const parser of sortedParsers){
                const frame = parser(cleanedLine);
                if (frame) {
                    frames.push(frame);
                    break;
                }
            }
            if (frames.length >= STACKTRACE_FRAME_LIMIT + framesToPop) {
                break;
            }
        }
        return stripSentryFramesAndReverse(frames.slice(framesToPop));
    };
}
/**
 * Gets a stack parser implementation from Options.stackParser
 * @see Options
 *
 * If options contains an array of line parsers, it is converted into a parser
 */ function stackParserFromStackParserOptions(stackParser) {
    if (Array.isArray(stackParser)) {
        return createStackParser(...stackParser);
    }
    return stackParser;
}
/**
 * Removes Sentry frames from the top and bottom of the stack if present and enforces a limit of max number of frames.
 * Assumes stack input is ordered from top to bottom and returns the reverse representation so call site of the
 * function that caused the crash is the last frame in the array.
 * @hidden
 */ function stripSentryFramesAndReverse(stack) {
    if (!stack.length) {
        return [];
    }
    const localStack = Array.from(stack);
    // If stack starts with one of our API calls, remove it (starts, meaning it's the top of the stack - aka last call)
    if (/sentryWrapped/.test(getLastStackFrame(localStack).function || '')) {
        localStack.pop();
    }
    // Reversing in the middle of the procedure allows us to just pop the values off the stack
    localStack.reverse();
    // If stack ends with one of our internal API calls, remove it (ends, meaning it's the bottom of the stack - aka top-most call)
    if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || '')) {
        localStack.pop();
        // When using synthetic events, we will have a 2 levels deep stack, as `new Error('Sentry syntheticException')`
        // is produced within the scope itself, making it:
        //
        //   Sentry.captureException()
        //   scope.captureException()
        //
        // instead of just the top `Sentry` call itself.
        // This forces us to possibly strip an additional frame in the exact same was as above.
        if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || '')) {
            localStack.pop();
        }
    }
    return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame)=>({
            ...frame,
            filename: frame.filename || getLastStackFrame(localStack).filename,
            function: frame.function || UNKNOWN_FUNCTION
        }));
}
function getLastStackFrame(arr) {
    return arr[arr.length - 1] || {};
}
const defaultFunctionName = '<anonymous>';
/**
 * Safely extract function name from itself
 */ function getFunctionName(fn) {
    try {
        if (!fn || typeof fn !== 'function') {
            return defaultFunctionName;
        }
        return fn.name || defaultFunctionName;
    } catch  {
        // Just accessing custom props in some Selenium environments
        // can cause a "Permission denied" exception (see raven-js#495).
        return defaultFunctionName;
    }
}
/**
 * Get's stack frames from an event without needing to check for undefined properties.
 */ function getFramesFromEvent(event) {
    const exception = event.exception;
    if (exception) {
        const frames = [];
        try {
            // @ts-expect-error Object could be undefined
            exception.values.forEach((value)=>{
                // @ts-expect-error Value could be undefined
                if (value.stacktrace.frames) {
                    // @ts-expect-error Value could be undefined
                    frames.push(...value.stacktrace.frames);
                }
            });
            return frames;
        } catch  {
            return undefined;
        }
    }
    return undefined;
}
exports.UNKNOWN_FUNCTION = UNKNOWN_FUNCTION;
exports.createStackParser = createStackParser;
exports.getFramesFromEvent = getFramesFromEvent;
exports.getFunctionName = getFunctionName;
exports.stackParserFromStackParserOptions = stackParserFromStackParserOptions;
exports.stripSentryFramesAndReverse = stripSentryFramesAndReverse; //# sourceMappingURL=stacktrace.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
// We keep the handlers globally
const handlers = {};
const instrumented = {};
/** Add a handler function. */ function addHandler(type, handler) {
    handlers[type] = handlers[type] || [];
    handlers[type].push(handler);
}
/**
 * Reset all instrumentation handlers.
 * This can be used by tests to ensure we have a clean slate of instrumentation handlers.
 */ function resetInstrumentationHandlers() {
    Object.keys(handlers).forEach((key)=>{
        handlers[key] = undefined;
    });
}
/** Maybe run an instrumentation function, unless it was already called. */ function maybeInstrument(type, instrumentFn) {
    if (!instrumented[type]) {
        instrumented[type] = true;
        try {
            instrumentFn();
        } catch (e) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.error(`Error while instrumenting ${type}`, e);
        }
    }
}
/** Trigger handlers for a given instrumentation type. */ function triggerHandlers(type, data) {
    const typeHandlers = type && handlers[type];
    if (!typeHandlers) {
        return;
    }
    for (const handler of typeHandlers){
        try {
            handler(data);
        } catch (e) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.error(`Error while triggering instrumentation handler.\nType: ${type}\nName: ${stacktrace.getFunctionName(handler)}\nError:`, e);
        }
    }
}
exports.addHandler = addHandler;
exports.maybeInstrument = maybeInstrument;
exports.resetInstrumentationHandlers = resetInstrumentationHandlers;
exports.triggerHandlers = triggerHandlers; //# sourceMappingURL=handlers.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalError.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)");
let _oldOnErrorHandler = null;
/**
 * Add an instrumentation handler for when an error is captured by the global error handler.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addGlobalErrorInstrumentationHandler(handler) {
    const type = 'error';
    handlers.addHandler(type, handler);
    handlers.maybeInstrument(type, instrumentError);
}
function instrumentError() {
    _oldOnErrorHandler = worldwide.GLOBAL_OBJ.onerror;
    // Note: The reason we are doing window.onerror instead of window.addEventListener('error')
    // is that we are using this handler in the Loader Script, to handle buffered errors consistently
    worldwide.GLOBAL_OBJ.onerror = function(msg, url, line, column, error) {
        const handlerData = {
            column,
            error,
            line,
            msg,
            url
        };
        handlers.triggerHandlers('error', handlerData);
        if (_oldOnErrorHandler) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnErrorHandler.apply(this, arguments);
        }
        return false;
    };
    worldwide.GLOBAL_OBJ.onerror.__SENTRY_INSTRUMENTED__ = true;
}
exports.addGlobalErrorInstrumentationHandler = addGlobalErrorInstrumentationHandler; //# sourceMappingURL=globalError.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalUnhandledRejection.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)");
let _oldOnUnhandledRejectionHandler = null;
/**
 * Add an instrumentation handler for when an unhandled promise rejection is captured.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addGlobalUnhandledRejectionInstrumentationHandler(handler) {
    const type = 'unhandledrejection';
    handlers.addHandler(type, handler);
    handlers.maybeInstrument(type, instrumentUnhandledRejection);
}
function instrumentUnhandledRejection() {
    _oldOnUnhandledRejectionHandler = worldwide.GLOBAL_OBJ.onunhandledrejection;
    // Note: The reason we are doing window.onunhandledrejection instead of window.addEventListener('unhandledrejection')
    // is that we are using this handler in the Loader Script, to handle buffered rejections consistently
    worldwide.GLOBAL_OBJ.onunhandledrejection = function(e) {
        const handlerData = e;
        handlers.triggerHandlers('unhandledrejection', handlerData);
        if (_oldOnUnhandledRejectionHandler) {
            // eslint-disable-next-line prefer-rest-params
            return _oldOnUnhandledRejectionHandler.apply(this, arguments);
        }
        return true;
    };
    worldwide.GLOBAL_OBJ.onunhandledrejection.__SENTRY_INSTRUMENTED__ = true;
}
exports.addGlobalUnhandledRejectionInstrumentationHandler = addGlobalUnhandledRejectionInstrumentationHandler; //# sourceMappingURL=globalUnhandledRejection.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// eslint-disable-next-line @typescript-eslint/unbound-method
const objectToString = Object.prototype.toString;
/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isError(wat) {
    switch(objectToString.call(wat)){
        case '[object Error]':
        case '[object Exception]':
        case '[object DOMException]':
        case '[object WebAssembly.Exception]':
            return true;
        default:
            return isInstanceOf(wat, Error);
    }
}
/**
 * Checks whether given value is an instance of the given built-in class.
 *
 * @param wat The value to be checked
 * @param className
 * @returns A boolean representing the result.
 */ function isBuiltin(wat, className) {
    return objectToString.call(wat) === `[object ${className}]`;
}
/**
 * Checks whether given value's type is ErrorEvent
 * {@link isErrorEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isErrorEvent(wat) {
    return isBuiltin(wat, 'ErrorEvent');
}
/**
 * Checks whether given value's type is DOMError
 * {@link isDOMError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isDOMError(wat) {
    return isBuiltin(wat, 'DOMError');
}
/**
 * Checks whether given value's type is DOMException
 * {@link isDOMException}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isDOMException(wat) {
    return isBuiltin(wat, 'DOMException');
}
/**
 * Checks whether given value's type is a string
 * {@link isString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isString(wat) {
    return isBuiltin(wat, 'String');
}
/**
 * Checks whether given string is parameterized
 * {@link isParameterizedString}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isParameterizedString(wat) {
    return typeof wat === 'object' && wat !== null && '__sentry_template_string__' in wat && '__sentry_template_values__' in wat;
}
/**
 * Checks whether given value is a primitive (undefined, null, number, boolean, string, bigint, symbol)
 * {@link isPrimitive}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isPrimitive(wat) {
    return wat === null || isParameterizedString(wat) || typeof wat !== 'object' && typeof wat !== 'function';
}
/**
 * Checks whether given value's type is an object literal, or a class instance.
 * {@link isPlainObject}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isPlainObject(wat) {
    return isBuiltin(wat, 'Object');
}
/**
 * Checks whether given value's type is an Event instance
 * {@link isEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isEvent(wat) {
    return typeof Event !== 'undefined' && isInstanceOf(wat, Event);
}
/**
 * Checks whether given value's type is an Element instance
 * {@link isElement}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isElement(wat) {
    return typeof Element !== 'undefined' && isInstanceOf(wat, Element);
}
/**
 * Checks whether given value's type is an regexp
 * {@link isRegExp}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isRegExp(wat) {
    return isBuiltin(wat, 'RegExp');
}
/**
 * Checks whether given value has a then function.
 * @param wat A value to be checked.
 */ function isThenable(wat) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Boolean(wat?.then && typeof wat.then === 'function');
}
/**
 * Checks whether given value's type is a SyntheticEvent
 * {@link isSyntheticEvent}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isSyntheticEvent(wat) {
    return isPlainObject(wat) && 'nativeEvent' in wat && 'preventDefault' in wat && 'stopPropagation' in wat;
}
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */ function isInstanceOf(wat, base) {
    try {
        return wat instanceof base;
    } catch  {
        return false;
    }
}
/**
 * Checks whether given value's type is a Vue ViewModel.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */ function isVueViewModel(wat) {
    // Not using Object.prototype.toString because in Vue 3 it would read the instance's Symbol(Symbol.toStringTag) property.
    return !!(typeof wat === 'object' && wat !== null && (wat.__isVue || wat._isVue));
}
/**
 * Checks whether the given parameter is a Standard Web API Request instance.
 *
 * Returns false if Request is not available in the current runtime.
 */ function isRequest(request) {
    return typeof Request !== 'undefined' && isInstanceOf(request, Request);
}
exports.isDOMError = isDOMError;
exports.isDOMException = isDOMException;
exports.isElement = isElement;
exports.isError = isError;
exports.isErrorEvent = isErrorEvent;
exports.isEvent = isEvent;
exports.isInstanceOf = isInstanceOf;
exports.isParameterizedString = isParameterizedString;
exports.isPlainObject = isPlainObject;
exports.isPrimitive = isPrimitive;
exports.isRegExp = isRegExp;
exports.isRequest = isRequest;
exports.isString = isString;
exports.isSyntheticEvent = isSyntheticEvent;
exports.isThenable = isThenable;
exports.isVueViewModel = isVueViewModel; //# sourceMappingURL=is.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/browser.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const WINDOW = worldwide.GLOBAL_OBJ;
const DEFAULT_MAX_STRING_LENGTH = 80;
/**
 * Given a child DOM element, returns a query-selector statement describing that
 * and its ancestors
 * e.g. [HTMLElement] => body > div > input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function htmlTreeAsString(elem, options = {}) {
    if (!elem) {
        return '<unknown>';
    }
    // try/catch both:
    // - accessing event.target (see getsentry/raven-js#838, #768)
    // - `htmlTreeAsString` because it's complex, and just accessing the DOM incorrectly
    // - can throw an exception in some circumstances.
    try {
        let currentElem = elem;
        const MAX_TRAVERSE_HEIGHT = 5;
        const out = [];
        let height = 0;
        let len = 0;
        const separator = ' > ';
        const sepLength = separator.length;
        let nextStr;
        const keyAttrs = Array.isArray(options) ? options : options.keyAttrs;
        const maxStringLength = !Array.isArray(options) && options.maxStringLength || DEFAULT_MAX_STRING_LENGTH;
        while(currentElem && height++ < MAX_TRAVERSE_HEIGHT){
            nextStr = _htmlElementAsString(currentElem, keyAttrs);
            // bail out if
            // - nextStr is the 'html' element
            // - the length of the string that would be created exceeds maxStringLength
            //   (ignore this limit if we are on the first iteration)
            if (nextStr === 'html' || height > 1 && len + out.length * sepLength + nextStr.length >= maxStringLength) {
                break;
            }
            out.push(nextStr);
            len += nextStr.length;
            currentElem = currentElem.parentNode;
        }
        return out.reverse().join(separator);
    } catch  {
        return '<unknown>';
    }
}
/**
 * Returns a simple, query-selector representation of a DOM element
 * e.g. [HTMLElement] => input#foo.btn[name=baz]
 * @returns generated DOM path
 */ function _htmlElementAsString(el, keyAttrs) {
    const elem = el;
    const out = [];
    if (!elem?.tagName) {
        return '';
    }
    // @ts-expect-error WINDOW has HTMLElement
    if (WINDOW.HTMLElement) {
        // If using the component name annotation plugin, this value may be available on the DOM node
        if (elem instanceof HTMLElement && elem.dataset) {
            if (elem.dataset['sentryComponent']) {
                return elem.dataset['sentryComponent'];
            }
            if (elem.dataset['sentryElement']) {
                return elem.dataset['sentryElement'];
            }
        }
    }
    out.push(elem.tagName.toLowerCase());
    // Pairs of attribute keys defined in `serializeAttribute` and their values on element.
    const keyAttrPairs = keyAttrs?.length ? keyAttrs.filter((keyAttr)=>elem.getAttribute(keyAttr)).map((keyAttr)=>[
            keyAttr,
            elem.getAttribute(keyAttr)
        ]) : null;
    if (keyAttrPairs?.length) {
        keyAttrPairs.forEach((keyAttrPair)=>{
            out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`);
        });
    } else {
        if (elem.id) {
            out.push(`#${elem.id}`);
        }
        const className = elem.className;
        if (className && is.isString(className)) {
            const classes = className.split(/\s+/);
            for (const c of classes){
                out.push(`.${c}`);
            }
        }
    }
    const allowedAttrs = [
        'aria-label',
        'type',
        'name',
        'title',
        'alt'
    ];
    for (const k of allowedAttrs){
        const attr = elem.getAttribute(k);
        if (attr) {
            out.push(`[${k}="${attr}"]`);
        }
    }
    return out.join('');
}
/**
 * A safe form of location.href
 */ function getLocationHref() {
    try {
        return WINDOW.document.location.href;
    } catch  {
        return '';
    }
}
/**
 * Given a DOM element, traverses up the tree until it finds the first ancestor node
 * that has the `data-sentry-component` or `data-sentry-element` attribute with `data-sentry-component` taking
 * precedence. This attribute is added at build-time by projects that have the component name annotation plugin installed.
 *
 * @returns a string representation of the component for the provided DOM element, or `null` if not found
 */ function getComponentName(elem) {
    // @ts-expect-error WINDOW has HTMLElement
    if (!WINDOW.HTMLElement) {
        return null;
    }
    let currentElem = elem;
    const MAX_TRAVERSE_HEIGHT = 5;
    for(let i = 0; i < MAX_TRAVERSE_HEIGHT; i++){
        if (!currentElem) {
            return null;
        }
        if (currentElem instanceof HTMLElement) {
            if (currentElem.dataset['sentryComponent']) {
                return currentElem.dataset['sentryComponent'];
            }
            if (currentElem.dataset['sentryElement']) {
                return currentElem.dataset['sentryElement'];
            }
        }
        currentElem = currentElem.parentNode;
    }
    return null;
}
exports.getComponentName = getComponentName;
exports.getLocationHref = getLocationHref;
exports.htmlTreeAsString = htmlTreeAsString; //# sourceMappingURL=browser.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
/**
 * Truncates given string to the maximum characters count
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string (0 = unlimited)
 * @returns string Encoded
 */ function truncate(str, max = 0) {
    if (typeof str !== 'string' || max === 0) {
        return str;
    }
    return str.length <= max ? str : `${str.slice(0, max)}...`;
}
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */ function snipLine(line, colno) {
    let newLine = line;
    const lineLength = newLine.length;
    if (lineLength <= 150) {
        return newLine;
    }
    if (colno > lineLength) {
        // eslint-disable-next-line no-param-reassign
        colno = lineLength;
    }
    let start = Math.max(colno - 60, 0);
    if (start < 5) {
        start = 0;
    }
    let end = Math.min(start + 140, lineLength);
    if (end > lineLength - 5) {
        end = lineLength;
    }
    if (end === lineLength) {
        start = Math.max(end - 140, 0);
    }
    newLine = newLine.slice(start, end);
    if (start > 0) {
        newLine = `'{snip} ${newLine}`;
    }
    if (end < lineLength) {
        newLine += ' {snip}';
    }
    return newLine;
}
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */ function safeJoin(input, delimiter) {
    if (!Array.isArray(input)) {
        return '';
    }
    const output = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for(let i = 0; i < input.length; i++){
        const value = input[i];
        try {
            // This is a hack to fix a Vue3-specific bug that causes an infinite loop of
            // console warnings. This happens when a Vue template is rendered with
            // an undeclared variable, which we try to stringify, ultimately causing
            // Vue to issue another warning which repeats indefinitely.
            // see: https://github.com/getsentry/sentry-javascript/pull/8981
            if (is.isVueViewModel(value)) {
                output.push('[VueViewModel]');
            } else {
                output.push(String(value));
            }
        } catch  {
            output.push('[value cannot be serialized]');
        }
    }
    return output.join(delimiter);
}
/**
 * Checks if the given value matches a regex or string
 *
 * @param value The string to test
 * @param pattern Either a regex or a string against which `value` will be matched
 * @param requireExactStringMatch If true, `value` must match `pattern` exactly. If false, `value` will match
 * `pattern` if it contains `pattern`. Only applies to string-type patterns.
 */ function isMatchingPattern(value, pattern, requireExactStringMatch = false) {
    if (!is.isString(value)) {
        return false;
    }
    if (is.isRegExp(pattern)) {
        return pattern.test(value);
    }
    if (is.isString(pattern)) {
        return requireExactStringMatch ? value === pattern : value.includes(pattern);
    }
    return false;
}
/**
 * Test the given string against an array of strings and regexes. By default, string matching is done on a
 * substring-inclusion basis rather than a strict equality basis
 *
 * @param testString The string to test
 * @param patterns The patterns against which to test the string
 * @param requireExactStringMatch If true, `testString` must match one of the given string patterns exactly in order to
 * count. If false, `testString` will match a string pattern if it contains that pattern.
 * @returns
 */ function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = false) {
    return patterns.some((pattern)=>isMatchingPattern(testString, pattern, requireExactStringMatch));
}
exports.isMatchingPattern = isMatchingPattern;
exports.safeJoin = safeJoin;
exports.snipLine = snipLine;
exports.stringMatchesSomePattern = stringMatchesSomePattern;
exports.truncate = truncate; //# sourceMappingURL=string.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const browser = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/browser.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
/* eslint-disable @typescript-eslint/no-explicit-any */ /**
 * Replace a method in an object with a wrapped version of itself.
 *
 * If the method on the passed object is not a function, the wrapper will not be applied.
 *
 * @param source An object that contains a method to be wrapped.
 * @param name The name of the method to be wrapped.
 * @param replacementFactory A higher-order function that takes the original version of the given method and returns a
 * wrapped version. Note: The function returned by `replacementFactory` needs to be a non-arrow function, in order to
 * preserve the correct value of `this`, and the original method must be called using `origMethod.call(this, <other
 * args>)` or `origMethod.apply(this, [<other args>])` (rather than being called directly), again to preserve `this`.
 * @returns void
 */ function fill(source, name, replacementFactory) {
    if (!(name in source)) {
        return;
    }
    // explicitly casting to unknown because we don't know the type of the method initially at all
    const original = source[name];
    if (typeof original !== 'function') {
        return;
    }
    const wrapped = replacementFactory(original);
    // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
    // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
    if (typeof wrapped === 'function') {
        markFunctionWrapped(wrapped, original);
    }
    try {
        source[name] = wrapped;
    } catch  {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Failed to replace method "${name}" in object`, source);
    }
}
/**
 * Defines a non-enumerable property on the given object.
 *
 * @param obj The object on which to set the property
 * @param name The name of the property to be set
 * @param value The value to which to set the property
 */ function addNonEnumerableProperty(obj, name, value) {
    try {
        Object.defineProperty(obj, name, {
            // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
            value: value,
            writable: true,
            configurable: true
        });
    } catch  {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Failed to add non-enumerable property "${name}" to object`, obj);
    }
}
/**
 * Remembers the original function on the wrapped function and
 * patches up the prototype.
 *
 * @param wrapped the wrapper function
 * @param original the original function that gets wrapped
 */ function markFunctionWrapped(wrapped, original) {
    try {
        const proto = original.prototype || {};
        wrapped.prototype = original.prototype = proto;
        addNonEnumerableProperty(wrapped, '__sentry_original__', original);
    } catch  {} // eslint-disable-line no-empty
}
/**
 * This extracts the original function if available.  See
 * `markFunctionWrapped` for more information.
 *
 * @param func the function to unwrap
 * @returns the unwrapped version of the function if available.
 */ // eslint-disable-next-line @typescript-eslint/ban-types
function getOriginalFunction(func) {
    return func.__sentry_original__;
}
/**
 * Transforms any `Error` or `Event` into a plain object with all of their enumerable properties, and some of their
 * non-enumerable properties attached.
 *
 * @param value Initial source that we have to transform in order for it to be usable by the serializer
 * @returns An Event or Error turned into an object - or the value argument itself, when value is neither an Event nor
 *  an Error.
 */ function convertToPlainObject(value) {
    if (is.isError(value)) {
        return {
            message: value.message,
            name: value.name,
            stack: value.stack,
            ...getOwnProperties(value)
        };
    } else if (is.isEvent(value)) {
        const newObj = {
            type: value.type,
            target: serializeEventTarget(value.target),
            currentTarget: serializeEventTarget(value.currentTarget),
            ...getOwnProperties(value)
        };
        if (typeof CustomEvent !== 'undefined' && is.isInstanceOf(value, CustomEvent)) {
            newObj.detail = value.detail;
        }
        return newObj;
    } else {
        return value;
    }
}
/** Creates a string representation of the target of an `Event` object */ function serializeEventTarget(target) {
    try {
        return is.isElement(target) ? browser.htmlTreeAsString(target) : Object.prototype.toString.call(target);
    } catch  {
        return '<unknown>';
    }
}
/** Filters out all but an object's own properties */ function getOwnProperties(obj) {
    if (typeof obj === 'object' && obj !== null) {
        const extractedProps = {};
        for(const property in obj){
            if (Object.prototype.hasOwnProperty.call(obj, property)) {
                extractedProps[property] = obj[property];
            }
        }
        return extractedProps;
    } else {
        return {};
    }
}
/**
 * Given any captured exception, extract its keys and create a sorted
 * and truncated list that will be used inside the event message.
 * eg. `Non-error exception captured with keys: foo, bar, baz`
 */ function extractExceptionKeysForMessage(exception, maxLength = 40) {
    const keys = Object.keys(convertToPlainObject(exception));
    keys.sort();
    const firstKey = keys[0];
    if (!firstKey) {
        return '[object has no keys]';
    }
    if (firstKey.length >= maxLength) {
        return string.truncate(firstKey, maxLength);
    }
    for(let includedKeys = keys.length; includedKeys > 0; includedKeys--){
        const serialized = keys.slice(0, includedKeys).join(', ');
        if (serialized.length > maxLength) {
            continue;
        }
        if (includedKeys === keys.length) {
            return serialized;
        }
        return string.truncate(serialized, maxLength);
    }
    return '';
}
/**
 * Given any object, return a new object having removed all fields whose value was `undefined`.
 * Works recursively on objects and arrays.
 *
 * Attention: This function keeps circular references in the returned object.
 *
 * @deprecated This function is no longer used by the SDK and will be removed in a future major version.
 */ function dropUndefinedKeys(inputValue) {
    // This map keeps track of what already visited nodes map to.
    // Our Set - based memoBuilder doesn't work here because we want to the output object to have the same circular
    // references as the input object.
    const memoizationMap = new Map();
    // This function just proxies `_dropUndefinedKeys` to keep the `memoBuilder` out of this function's API
    return _dropUndefinedKeys(inputValue, memoizationMap);
}
function _dropUndefinedKeys(inputValue, memoizationMap) {
    // Early return for primitive values
    if (inputValue === null || typeof inputValue !== 'object') {
        return inputValue;
    }
    // Check memo map first for all object types
    const memoVal = memoizationMap.get(inputValue);
    if (memoVal !== undefined) {
        return memoVal;
    }
    // handle arrays
    if (Array.isArray(inputValue)) {
        const returnValue = [];
        // Store mapping to handle circular references
        memoizationMap.set(inputValue, returnValue);
        inputValue.forEach((value)=>{
            returnValue.push(_dropUndefinedKeys(value, memoizationMap));
        });
        return returnValue;
    }
    if (isPojo(inputValue)) {
        const returnValue = {};
        // Store mapping to handle circular references
        memoizationMap.set(inputValue, returnValue);
        const keys = Object.keys(inputValue);
        keys.forEach((key)=>{
            const val = inputValue[key];
            if (val !== undefined) {
                returnValue[key] = _dropUndefinedKeys(val, memoizationMap);
            }
        });
        return returnValue;
    }
    // For other object types, return as is
    return inputValue;
}
function isPojo(input) {
    // Plain objects have Object as constructor or no constructor
    const constructor = input.constructor;
    return constructor === Object || constructor === undefined;
}
/**
 * Ensure that something is an object.
 *
 * Turns `undefined` and `null` into `String`s and all other primitives into instances of their respective wrapper
 * classes (String, Boolean, Number, etc.). Acts as the identity function on non-primitives.
 *
 * @param wat The subject of the objectification
 * @returns A version of `wat` which can safely be used with `Object` class methods
 */ function objectify(wat) {
    let objectified;
    switch(true){
        // this will catch both undefined and null
        case wat == undefined:
            objectified = new String(wat);
            break;
        // Though symbols and bigints do have wrapper classes (`Symbol` and `BigInt`, respectively), for whatever reason
        // those classes don't have constructors which can be used with the `new` keyword. We therefore need to cast each as
        // an object in order to wrap it.
        case typeof wat === 'symbol' || typeof wat === 'bigint':
            objectified = Object(wat);
            break;
        // this will catch the remaining primitives: `String`, `Number`, and `Boolean`
        case is.isPrimitive(wat):
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            objectified = new wat.constructor(wat);
            break;
        // by process of elimination, at this point we know that `wat` must already be an object
        default:
            objectified = wat;
            break;
    }
    return objectified;
}
exports.addNonEnumerableProperty = addNonEnumerableProperty;
exports.convertToPlainObject = convertToPlainObject;
exports.dropUndefinedKeys = dropUndefinedKeys;
exports.extractExceptionKeysForMessage = extractExceptionKeysForMessage;
exports.fill = fill;
exports.getOriginalFunction = getOriginalFunction;
exports.markFunctionWrapped = markFunctionWrapped;
exports.objectify = objectify; //# sourceMappingURL=object.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
function getCrypto() {
    const gbl = worldwide.GLOBAL_OBJ;
    return gbl.crypto || gbl.msCrypto;
}
/**
 * UUID4 generator
 * @param crypto Object that provides the crypto API.
 * @returns string Generated UUID4.
 */ function uuid4(crypto = getCrypto()) {
    let getRandomByte = ()=>Math.random() * 16;
    try {
        if (crypto?.randomUUID) {
            return crypto.randomUUID().replace(/-/g, '');
        }
        if (crypto?.getRandomValues) {
            getRandomByte = ()=>{
                // crypto.getRandomValues might return undefined instead of the typed array
                // in old Chromium versions (e.g. 23.0.1235.0 (151422))
                // However, `typedArray` is still filled in-place.
                // @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#typedarray
                const typedArray = new Uint8Array(1);
                crypto.getRandomValues(typedArray);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return typedArray[0];
            };
        }
    } catch  {
    // some runtimes can crash invoking crypto
    // https://github.com/getsentry/sentry-javascript/issues/8935
    }
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    // Concatenating the following numbers as strings results in '10000000100040008000100000000000'
    return ([
        1e7
    ] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, (c)=>// eslint-disable-next-line no-bitwise
        (c ^ (getRandomByte() & 15) >> c / 4).toString(16));
}
function getFirstException(event) {
    return event.exception?.values?.[0];
}
/**
 * Extracts either message or type+value from an event that can be used for user-facing logs
 * @returns event's description
 */ function getEventDescription(event) {
    const { message, event_id: eventId } = event;
    if (message) {
        return message;
    }
    const firstException = getFirstException(event);
    if (firstException) {
        if (firstException.type && firstException.value) {
            return `${firstException.type}: ${firstException.value}`;
        }
        return firstException.type || firstException.value || eventId || '<unknown>';
    }
    return eventId || '<unknown>';
}
/**
 * Adds exception values, type and value to an synthetic Exception.
 * @param event The event to modify.
 * @param value Value of the exception.
 * @param type Type of the exception.
 * @hidden
 */ function addExceptionTypeValue(event, value, type) {
    const exception = event.exception = event.exception || {};
    const values = exception.values = exception.values || [];
    const firstException = values[0] = values[0] || {};
    if (!firstException.value) {
        firstException.value = value || '';
    }
    if (!firstException.type) {
        firstException.type = type || 'Error';
    }
}
/**
 * Adds exception mechanism data to a given event. Uses defaults if the second parameter is not passed.
 *
 * @param event The event to modify.
 * @param newMechanism Mechanism data to add to the event.
 * @hidden
 */ function addExceptionMechanism(event, newMechanism) {
    const firstException = getFirstException(event);
    if (!firstException) {
        return;
    }
    const defaultMechanism = {
        type: 'generic',
        handled: true
    };
    const currentMechanism = firstException.mechanism;
    firstException.mechanism = {
        ...defaultMechanism,
        ...currentMechanism,
        ...newMechanism
    };
    if (newMechanism && 'data' in newMechanism) {
        const mergedData = {
            ...currentMechanism?.data,
            ...newMechanism.data
        };
        firstException.mechanism.data = mergedData;
    }
}
// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER_REGEXP = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
/**
 * Represents Semantic Versioning object
 */ function _parseInt(input) {
    return parseInt(input || '', 10);
}
/**
 * Parses input into a SemVer interface
 * @param input string representation of a semver version
 */ function parseSemver(input) {
    const match = input.match(SEMVER_REGEXP) || [];
    const major = _parseInt(match[1]);
    const minor = _parseInt(match[2]);
    const patch = _parseInt(match[3]);
    return {
        buildmetadata: match[5],
        major: isNaN(major) ? undefined : major,
        minor: isNaN(minor) ? undefined : minor,
        patch: isNaN(patch) ? undefined : patch,
        prerelease: match[4]
    };
}
/**
 * This function adds context (pre/post/line) lines to the provided frame
 *
 * @param lines string[] containing all lines
 * @param frame StackFrame that will be mutated
 * @param linesOfContext number of context lines we want to add pre/post
 */ function addContextToFrame(lines, frame, linesOfContext = 5) {
    // When there is no line number in the frame, attaching context is nonsensical and will even break grouping
    if (frame.lineno === undefined) {
        return;
    }
    const maxLines = lines.length;
    const sourceLine = Math.max(Math.min(maxLines - 1, frame.lineno - 1), 0);
    frame.pre_context = lines.slice(Math.max(0, sourceLine - linesOfContext), sourceLine).map((line)=>string.snipLine(line, 0));
    // We guard here to ensure this is not larger than the existing number of lines
    const lineIndex = Math.min(maxLines - 1, sourceLine);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    frame.context_line = string.snipLine(lines[lineIndex], frame.colno || 0);
    frame.post_context = lines.slice(Math.min(sourceLine + 1, maxLines), sourceLine + 1 + linesOfContext).map((line)=>string.snipLine(line, 0));
}
/**
 * Checks whether or not we've already captured the given exception (note: not an identical exception - the very object
 * in question), and marks it captured if not.
 *
 * This is useful because it's possible for an error to get captured by more than one mechanism. After we intercept and
 * record an error, we rethrow it (assuming we've intercepted it before it's reached the top-level global handlers), so
 * that we don't interfere with whatever effects the error might have had were the SDK not there. At that point, because
 * the error has been rethrown, it's possible for it to bubble up to some other code we've instrumented. If it's not
 * caught after that, it will bubble all the way up to the global handlers (which of course we also instrument). This
 * function helps us ensure that even if we encounter the same error more than once, we only record it the first time we
 * see it.
 *
 * Note: It will ignore primitives (always return `false` and not mark them as seen), as properties can't be set on
 * them. {@link: Object.objectify} can be used on exceptions to convert any that are primitives into their equivalent
 * object wrapper forms so that this check will always work. However, because we need to flag the exact object which
 * will get rethrown, and because that rethrowing happens outside of the event processing pipeline, the objectification
 * must be done before the exception captured.
 *
 * @param A thrown exception to check or flag as having been seen
 * @returns `true` if the exception has already been captured, `false` if not (with the side effect of marking it seen)
 */ function checkOrSetAlreadyCaught(exception) {
    if (isAlreadyCaptured(exception)) {
        return true;
    }
    try {
        // set it this way rather than by assignment so that it's not ennumerable and therefore isn't recorded by the
        // `ExtraErrorData` integration
        object.addNonEnumerableProperty(exception, '__sentry_captured__', true);
    } catch  {
    // `exception` is a primitive, so we can't mark it seen
    }
    return false;
}
function isAlreadyCaptured(exception) {
    try {
        return exception.__sentry_captured__;
    } catch  {} // eslint-disable-line no-empty
}
exports.addContextToFrame = addContextToFrame;
exports.addExceptionMechanism = addExceptionMechanism;
exports.addExceptionTypeValue = addExceptionTypeValue;
exports.checkOrSetAlreadyCaught = checkOrSetAlreadyCaught;
exports.getEventDescription = getEventDescription;
exports.parseSemver = parseSemver;
exports.uuid4 = uuid4; //# sourceMappingURL=misc.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const ONE_SECOND_IN_MS = 1000;
/**
 * A partial definition of the [Performance Web API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Performance}
 * for accessing a high-resolution monotonic clock.
 */ /**
 * Returns a timestamp in seconds since the UNIX epoch using the Date API.
 */ function dateTimestampInSeconds() {
    return Date.now() / ONE_SECOND_IN_MS;
}
/**
 * Returns a wrapper around the native Performance API browser implementation, or undefined for browsers that do not
 * support the API.
 *
 * Wrapping the native API works around differences in behavior from different browsers.
 */ function createUnixTimestampInSecondsFunc() {
    const { performance } = worldwide.GLOBAL_OBJ;
    // Some browser and environments don't have a performance or timeOrigin, so we fallback to
    // using Date.now() to compute the starting time.
    if (!performance?.now || !performance.timeOrigin) {
        return dateTimestampInSeconds;
    }
    const timeOrigin = performance.timeOrigin;
    // performance.now() is a monotonic clock, which means it starts at 0 when the process begins. To get the current
    // wall clock time (actual UNIX timestamp), we need to add the starting time origin and the current time elapsed.
    //
    // TODO: This does not account for the case where the monotonic clock that powers performance.now() drifts from the
    // wall clock time, which causes the returned timestamp to be inaccurate. We should investigate how to detect and
    // correct for this.
    // See: https://github.com/getsentry/sentry-javascript/issues/2590
    // See: https://github.com/mdn/content/issues/4713
    // See: https://dev.to/noamr/when-a-millisecond-is-not-a-millisecond-3h6
    return ()=>{
        return (timeOrigin + performance.now()) / ONE_SECOND_IN_MS;
    };
}
let _cachedTimestampInSeconds;
/**
 * Returns a timestamp in seconds since the UNIX epoch using either the Performance or Date APIs, depending on the
 * availability of the Performance API.
 *
 * BUG: Note that because of how browsers implement the Performance API, the clock might stop when the computer is
 * asleep. This creates a skew between `dateTimestampInSeconds` and `timestampInSeconds`. The
 * skew can grow to arbitrary amounts like days, weeks or months.
 * See https://github.com/getsentry/sentry-javascript/issues/2590.
 */ function timestampInSeconds() {
    // We store this in a closure so that we don't have to create a new function every time this is called.
    const func = _cachedTimestampInSeconds ?? (_cachedTimestampInSeconds = createUnixTimestampInSecondsFunc());
    return func();
}
/**
 * Cached result of getBrowserTimeOrigin.
 */ let cachedTimeOrigin;
/**
 * Gets the time origin and the mode used to determine it.
 */ function getBrowserTimeOrigin() {
    // Unfortunately browsers may report an inaccurate time origin data, through either performance.timeOrigin or
    // performance.timing.navigationStart, which results in poor results in performance data. We only treat time origin
    // data as reliable if they are within a reasonable threshold of the current time.
    const { performance } = worldwide.GLOBAL_OBJ;
    if (!performance?.now) {
        return [
            undefined,
            'none'
        ];
    }
    const threshold = 3600 * 1000;
    const performanceNow = performance.now();
    const dateNow = Date.now();
    // if timeOrigin isn't available set delta to threshold so it isn't used
    const timeOriginDelta = performance.timeOrigin ? Math.abs(performance.timeOrigin + performanceNow - dateNow) : threshold;
    const timeOriginIsReliable = timeOriginDelta < threshold;
    // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
    // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
    // Also as of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always
    // a valid fallback. In the absence of an initial time provided by the browser, fallback to the current time from the
    // Date API.
    // eslint-disable-next-line deprecation/deprecation
    const navigationStart = performance.timing?.navigationStart;
    const hasNavigationStart = typeof navigationStart === 'number';
    // if navigationStart isn't available set delta to threshold so it isn't used
    const navigationStartDelta = hasNavigationStart ? Math.abs(navigationStart + performanceNow - dateNow) : threshold;
    const navigationStartIsReliable = navigationStartDelta < threshold;
    if (timeOriginIsReliable || navigationStartIsReliable) {
        // Use the more reliable time origin
        if (timeOriginDelta <= navigationStartDelta) {
            return [
                performance.timeOrigin,
                'timeOrigin'
            ];
        } else {
            return [
                navigationStart,
                'navigationStart'
            ];
        }
    }
    // Either both timeOrigin and navigationStart are skewed or neither is available, fallback to Date.
    return [
        dateNow,
        'dateNow'
    ];
}
/**
 * The number of milliseconds since the UNIX epoch. This value is only usable in a browser, and only when the
 * performance API is available.
 */ function browserPerformanceTimeOrigin() {
    if (!cachedTimeOrigin) {
        cachedTimeOrigin = getBrowserTimeOrigin();
    }
    return cachedTimeOrigin[0];
}
exports.browserPerformanceTimeOrigin = browserPerformanceTimeOrigin;
exports.dateTimestampInSeconds = dateTimestampInSeconds;
exports.timestampInSeconds = timestampInSeconds; //# sourceMappingURL=time.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/session.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
/**
 * Creates a new `Session` object by setting certain default parameters. If optional @param context
 * is passed, the passed properties are applied to the session object.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns a new `Session` object
 */ function makeSession(context) {
    // Both timestamp and started are in seconds since the UNIX epoch.
    const startingTime = time.timestampInSeconds();
    const session = {
        sid: misc.uuid4(),
        init: true,
        timestamp: startingTime,
        started: startingTime,
        duration: 0,
        status: 'ok',
        errors: 0,
        ignoreDuration: false,
        toJSON: ()=>sessionToJSON(session)
    };
    if (context) {
        updateSession(session, context);
    }
    return session;
}
/**
 * Updates a session object with the properties passed in the context.
 *
 * Note that this function mutates the passed object and returns void.
 * (Had to do this instead of returning a new and updated session because closing and sending a session
 * makes an update to the session after it was passed to the sending logic.
 * @see Client.captureSession )
 *
 * @param session the `Session` to update
 * @param context the `SessionContext` holding the properties that should be updated in @param session
 */ // eslint-disable-next-line complexity
function updateSession(session, context = {}) {
    if (context.user) {
        if (!session.ipAddress && context.user.ip_address) {
            session.ipAddress = context.user.ip_address;
        }
        if (!session.did && !context.did) {
            session.did = context.user.id || context.user.email || context.user.username;
        }
    }
    session.timestamp = context.timestamp || time.timestampInSeconds();
    if (context.abnormal_mechanism) {
        session.abnormal_mechanism = context.abnormal_mechanism;
    }
    if (context.ignoreDuration) {
        session.ignoreDuration = context.ignoreDuration;
    }
    if (context.sid) {
        // Good enough uuid validation. — Kamil
        session.sid = context.sid.length === 32 ? context.sid : misc.uuid4();
    }
    if (context.init !== undefined) {
        session.init = context.init;
    }
    if (!session.did && context.did) {
        session.did = `${context.did}`;
    }
    if (typeof context.started === 'number') {
        session.started = context.started;
    }
    if (session.ignoreDuration) {
        session.duration = undefined;
    } else if (typeof context.duration === 'number') {
        session.duration = context.duration;
    } else {
        const duration = session.timestamp - session.started;
        session.duration = duration >= 0 ? duration : 0;
    }
    if (context.release) {
        session.release = context.release;
    }
    if (context.environment) {
        session.environment = context.environment;
    }
    if (!session.ipAddress && context.ipAddress) {
        session.ipAddress = context.ipAddress;
    }
    if (!session.userAgent && context.userAgent) {
        session.userAgent = context.userAgent;
    }
    if (typeof context.errors === 'number') {
        session.errors = context.errors;
    }
    if (context.status) {
        session.status = context.status;
    }
}
/**
 * Closes a session by setting its status and updating the session object with it.
 * Internally calls `updateSession` to update the passed session object.
 *
 * Note that this function mutates the passed session (@see updateSession for explanation).
 *
 * @param session the `Session` object to be closed
 * @param status the `SessionStatus` with which the session was closed. If you don't pass a status,
 *               this function will keep the previously set status, unless it was `'ok'` in which case
 *               it is changed to `'exited'`.
 */ function closeSession(session, status) {
    let context = {};
    if (status) {
        context = {
            status
        };
    } else if (session.status === 'ok') {
        context = {
            status: 'exited'
        };
    }
    updateSession(session, context);
}
/**
 * Serializes a passed session object to a JSON object with a slightly different structure.
 * This is necessary because the Sentry backend requires a slightly different schema of a session
 * than the one the JS SDKs use internally.
 *
 * @param session the session to be converted
 *
 * @returns a JSON object of the passed session
 */ function sessionToJSON(session) {
    return {
        sid: `${session.sid}`,
        init: session.init,
        // Make sure that sec is converted to ms for date constructor
        started: new Date(session.started * 1000).toISOString(),
        timestamp: new Date(session.timestamp * 1000).toISOString(),
        status: session.status,
        errors: session.errors,
        did: typeof session.did === 'number' || typeof session.did === 'string' ? `${session.did}` : undefined,
        duration: session.duration,
        abnormal_mechanism: session.abnormal_mechanism,
        attrs: {
            release: session.release,
            environment: session.environment,
            ip_address: session.ipAddress,
            user_agent: session.userAgent
        }
    };
}
exports.closeSession = closeSession;
exports.makeSession = makeSession;
exports.updateSession = updateSession; //# sourceMappingURL=session.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/merge.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Shallow merge two objects.
 * Does not mutate the passed in objects.
 * Undefined/empty values in the merge object will overwrite existing values.
 *
 * By default, this merges 2 levels deep.
 */ function merge(initialObj, mergeObj, levels = 2) {
    // If the merge value is not an object, or we have no merge levels left,
    // we just set the value to the merge value
    if (!mergeObj || typeof mergeObj !== 'object' || levels <= 0) {
        return mergeObj;
    }
    // If the merge object is an empty object, and the initial object is not undefined, we return the initial object
    if (initialObj && Object.keys(mergeObj).length === 0) {
        return initialObj;
    }
    // Clone object
    const output = {
        ...initialObj
    };
    // Merge values into output, resursively
    for(const key in mergeObj){
        if (Object.prototype.hasOwnProperty.call(mergeObj, key)) {
            output[key] = merge(output[key], mergeObj[key], levels - 1);
        }
    }
    return output;
}
exports.merge = merge; //# sourceMappingURL=merge.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
/**
 * Generate a random, valid trace ID.
 */ function generateTraceId() {
    return misc.uuid4();
}
/**
 * Generate a random, valid span ID.
 */ function generateSpanId() {
    return misc.uuid4().substring(16);
}
exports.generateSpanId = generateSpanId;
exports.generateTraceId = generateTraceId; //# sourceMappingURL=propagationContext.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const SCOPE_SPAN_FIELD = '_sentrySpan';
/**
 * Set the active span for a given scope.
 * NOTE: This should NOT be used directly, but is only used internally by the trace methods.
 */ function _setSpanForScope(scope, span) {
    if (span) {
        object.addNonEnumerableProperty(scope, SCOPE_SPAN_FIELD, span);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete scope[SCOPE_SPAN_FIELD];
    }
}
/**
 * Get the active span for a given scope.
 * NOTE: This should NOT be used directly, but is only used internally by the trace methods.
 */ function _getSpanForScope(scope) {
    return scope[SCOPE_SPAN_FIELD];
}
exports._getSpanForScope = _getSpanForScope;
exports._setSpanForScope = _setSpanForScope; //# sourceMappingURL=spanOnScope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const session = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/session.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const merge = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/merge.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const spanOnScope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
/**
 * Default value for maximum number of breadcrumbs added to an event.
 */ const DEFAULT_MAX_BREADCRUMBS = 100;
/**
 * A context to be used for capturing an event.
 * This can either be a Scope, or a partial ScopeContext,
 * or a callback that receives the current scope and returns a new scope to use.
 */ /**
 * Holds additional event information.
 */ class Scope {
    /** Flag if notifying is happening. */ /** Callback for client to receive scope changes. */ /** Callback list that will be called during event processing. */ /** Array of breadcrumbs. */ /** User */ /** Tags */ /** Extra */ /** Contexts */ /** Attachments */ /** Propagation Context for distributed tracing */ /**
   * A place to stash data which is needed at some point in the SDK's event processing pipeline but which shouldn't get
   * sent to Sentry
   */ /** Fingerprint */ /** Severity */ /**
   * Transaction Name
   *
   * IMPORTANT: The transaction name on the scope has nothing to do with root spans/transaction objects.
   * It's purpose is to assign a transaction to the scope that's added to non-transaction events.
   */ /** Session */ /** The client on this scope */ /** Contains the last event id of a captured event.  */ // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
    constructor(){
        this._notifyingListeners = false;
        this._scopeListeners = [];
        this._eventProcessors = [];
        this._breadcrumbs = [];
        this._attachments = [];
        this._user = {};
        this._tags = {};
        this._extra = {};
        this._contexts = {};
        this._sdkProcessingMetadata = {};
        this._propagationContext = {
            traceId: propagationContext.generateTraceId(),
            sampleRand: Math.random()
        };
    }
    /**
   * Clone all data from this scope into a new scope.
   */ clone() {
        const newScope = new Scope();
        newScope._breadcrumbs = [
            ...this._breadcrumbs
        ];
        newScope._tags = {
            ...this._tags
        };
        newScope._extra = {
            ...this._extra
        };
        newScope._contexts = {
            ...this._contexts
        };
        if (this._contexts.flags) {
            // We need to copy the `values` array so insertions on a cloned scope
            // won't affect the original array.
            newScope._contexts.flags = {
                values: [
                    ...this._contexts.flags.values
                ]
            };
        }
        newScope._user = this._user;
        newScope._level = this._level;
        newScope._session = this._session;
        newScope._transactionName = this._transactionName;
        newScope._fingerprint = this._fingerprint;
        newScope._eventProcessors = [
            ...this._eventProcessors
        ];
        newScope._attachments = [
            ...this._attachments
        ];
        newScope._sdkProcessingMetadata = {
            ...this._sdkProcessingMetadata
        };
        newScope._propagationContext = {
            ...this._propagationContext
        };
        newScope._client = this._client;
        newScope._lastEventId = this._lastEventId;
        spanOnScope._setSpanForScope(newScope, spanOnScope._getSpanForScope(this));
        return newScope;
    }
    /**
   * Update the client assigned to this scope.
   * Note that not every scope will have a client assigned - isolation scopes & the global scope will generally not have a client,
   * as well as manually created scopes.
   */ setClient(client) {
        this._client = client;
    }
    /**
   * Set the ID of the last captured error event.
   * This is generally only captured on the isolation scope.
   */ setLastEventId(lastEventId) {
        this._lastEventId = lastEventId;
    }
    /**
   * Get the client assigned to this scope.
   */ getClient() {
        return this._client;
    }
    /**
   * Get the ID of the last captured error event.
   * This is generally only available on the isolation scope.
   */ lastEventId() {
        return this._lastEventId;
    }
    /**
   * @inheritDoc
   */ addScopeListener(callback) {
        this._scopeListeners.push(callback);
    }
    /**
   * Add an event processor that will be called before an event is sent.
   */ addEventProcessor(callback) {
        this._eventProcessors.push(callback);
        return this;
    }
    /**
   * Set the user for this scope.
   * Set to `null` to unset the user.
   */ setUser(user) {
        // If null is passed we want to unset everything, but still define keys,
        // so that later down in the pipeline any existing values are cleared.
        this._user = user || {
            email: undefined,
            id: undefined,
            ip_address: undefined,
            username: undefined
        };
        if (this._session) {
            session.updateSession(this._session, {
                user
            });
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Get the user from this scope.
   */ getUser() {
        return this._user;
    }
    /**
   * Set an object that will be merged into existing tags on the scope,
   * and will be sent as tags data with the event.
   */ setTags(tags) {
        this._tags = {
            ...this._tags,
            ...tags
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Set a single tag that will be sent as tags data with the event.
   */ setTag(key, value) {
        this._tags = {
            ...this._tags,
            [key]: value
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Set an object that will be merged into existing extra on the scope,
   * and will be sent as extra data with the event.
   */ setExtras(extras) {
        this._extra = {
            ...this._extra,
            ...extras
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Set a single key:value extra entry that will be sent as extra data with the event.
   */ setExtra(key, extra) {
        this._extra = {
            ...this._extra,
            [key]: extra
        };
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets the fingerprint on the scope to send with the events.
   * @param {string[]} fingerprint Fingerprint to group events in Sentry.
   */ setFingerprint(fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets the level on the scope for future events.
   */ setLevel(level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets the transaction name on the scope so that the name of e.g. taken server route or
   * the page location is attached to future events.
   *
   * IMPORTANT: Calling this function does NOT change the name of the currently active
   * root span. If you want to change the name of the active root span, use
   * `Sentry.updateSpanName(rootSpan, 'new name')` instead.
   *
   * By default, the SDK updates the scope's transaction name automatically on sensible
   * occasions, such as a page navigation or when handling a new request on the server.
   */ setTransactionName(name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Sets context data with the given name.
   * Data passed as context will be normalized. You can also pass `null` to unset the context.
   * Note that context data will not be merged - calling `setContext` will overwrite an existing context with the same key.
   */ setContext(key, context) {
        if (context === null) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._contexts[key];
        } else {
            this._contexts[key] = context;
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Set the session for the scope.
   */ setSession(session) {
        if (!session) {
            delete this._session;
        } else {
            this._session = session;
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Get the session from the scope.
   */ getSession() {
        return this._session;
    }
    /**
   * Updates the scope with provided data. Can work in three variations:
   * - plain object containing updatable attributes
   * - Scope instance that'll extract the attributes from
   * - callback function that'll receive the current scope as an argument and allow for modifications
   */ update(captureContext) {
        if (!captureContext) {
            return this;
        }
        const scopeToMerge = typeof captureContext === 'function' ? captureContext(this) : captureContext;
        const scopeInstance = scopeToMerge instanceof Scope ? scopeToMerge.getScopeData() : is.isPlainObject(scopeToMerge) ? captureContext : undefined;
        const { tags, extra, user, contexts, level, fingerprint = [], propagationContext } = scopeInstance || {};
        this._tags = {
            ...this._tags,
            ...tags
        };
        this._extra = {
            ...this._extra,
            ...extra
        };
        this._contexts = {
            ...this._contexts,
            ...contexts
        };
        if (user && Object.keys(user).length) {
            this._user = user;
        }
        if (level) {
            this._level = level;
        }
        if (fingerprint.length) {
            this._fingerprint = fingerprint;
        }
        if (propagationContext) {
            this._propagationContext = propagationContext;
        }
        return this;
    }
    /**
   * Clears the current scope and resets its properties.
   * Note: The client will not be cleared.
   */ clear() {
        // client is not cleared here on purpose!
        this._breadcrumbs = [];
        this._tags = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = undefined;
        this._transactionName = undefined;
        this._fingerprint = undefined;
        this._session = undefined;
        spanOnScope._setSpanForScope(this, undefined);
        this._attachments = [];
        this.setPropagationContext({
            traceId: propagationContext.generateTraceId(),
            sampleRand: Math.random()
        });
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Adds a breadcrumb to the scope.
   * By default, the last 100 breadcrumbs are kept.
   */ addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        const maxCrumbs = typeof maxBreadcrumbs === 'number' ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
        // No data has been changed, so don't notify scope listeners
        if (maxCrumbs <= 0) {
            return this;
        }
        const mergedBreadcrumb = {
            timestamp: time.dateTimestampInSeconds(),
            ...breadcrumb,
            // Breadcrumb messages can theoretically be infinitely large and they're held in memory so we truncate them not to leak (too much) memory
            message: breadcrumb.message ? string.truncate(breadcrumb.message, 2048) : breadcrumb.message
        };
        this._breadcrumbs.push(mergedBreadcrumb);
        if (this._breadcrumbs.length > maxCrumbs) {
            this._breadcrumbs = this._breadcrumbs.slice(-maxCrumbs);
            this._client?.recordDroppedEvent('buffer_overflow', 'log_item');
        }
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Get the last breadcrumb of the scope.
   */ getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
    }
    /**
   * Clear all breadcrumbs from the scope.
   */ clearBreadcrumbs() {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
    }
    /**
   * Add an attachment to the scope.
   */ addAttachment(attachment) {
        this._attachments.push(attachment);
        return this;
    }
    /**
   * Clear all attachments from the scope.
   */ clearAttachments() {
        this._attachments = [];
        return this;
    }
    /**
   * Get the data of this scope, which should be applied to an event during processing.
   */ getScopeData() {
        return {
            breadcrumbs: this._breadcrumbs,
            attachments: this._attachments,
            contexts: this._contexts,
            tags: this._tags,
            extra: this._extra,
            user: this._user,
            level: this._level,
            fingerprint: this._fingerprint || [],
            eventProcessors: this._eventProcessors,
            propagationContext: this._propagationContext,
            sdkProcessingMetadata: this._sdkProcessingMetadata,
            transactionName: this._transactionName,
            span: spanOnScope._getSpanForScope(this)
        };
    }
    /**
   * Add data which will be accessible during event processing but won't get sent to Sentry.
   */ setSDKProcessingMetadata(newData) {
        this._sdkProcessingMetadata = merge.merge(this._sdkProcessingMetadata, newData, 2);
        return this;
    }
    /**
   * Add propagation context to the scope, used for distributed tracing
   */ setPropagationContext(context) {
        this._propagationContext = context;
        return this;
    }
    /**
   * Get propagation context from the scope, used for distributed tracing
   */ getPropagationContext() {
        return this._propagationContext;
    }
    /**
   * Capture an exception for this scope.
   *
   * @returns {string} The id of the captured Sentry event.
   */ captureException(exception, hint) {
        const eventId = hint?.event_id || misc.uuid4();
        if (!this._client) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No client configured on scope - will not capture exception!');
            return eventId;
        }
        const syntheticException = new Error('Sentry syntheticException');
        this._client.captureException(exception, {
            originalException: exception,
            syntheticException,
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * Capture a message for this scope.
   *
   * @returns {string} The id of the captured message.
   */ captureMessage(message, level, hint) {
        const eventId = hint?.event_id || misc.uuid4();
        if (!this._client) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No client configured on scope - will not capture message!');
            return eventId;
        }
        const syntheticException = new Error(message);
        this._client.captureMessage(message, level, {
            originalException: message,
            syntheticException,
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * Capture a Sentry event for this scope.
   *
   * @returns {string} The id of the captured event.
   */ captureEvent(event, hint) {
        const eventId = hint?.event_id || misc.uuid4();
        if (!this._client) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No client configured on scope - will not capture event!');
            return eventId;
        }
        this._client.captureEvent(event, {
            ...hint,
            event_id: eventId
        }, this);
        return eventId;
    }
    /**
   * This will be called on every set call.
   */ _notifyScopeListeners() {
        // We need this check for this._notifyingListeners to be able to work on scope during updates
        // If this check is not here we'll produce endless recursion when something is done with the scope
        // during the callback.
        if (!this._notifyingListeners) {
            this._notifyingListeners = true;
            this._scopeListeners.forEach((callback)=>{
                callback(this);
            });
            this._notifyingListeners = false;
        }
    }
}
exports.Scope = Scope; //# sourceMappingURL=scope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/defaultScopes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)");
/** Get the default current scope. */ function getDefaultCurrentScope() {
    return carrier.getGlobalSingleton('defaultCurrentScope', ()=>new scope.Scope());
}
/** Get the default isolation scope. */ function getDefaultIsolationScope() {
    return carrier.getGlobalSingleton('defaultIsolationScope', ()=>new scope.Scope());
}
exports.getDefaultCurrentScope = getDefaultCurrentScope;
exports.getDefaultIsolationScope = getDefaultIsolationScope; //# sourceMappingURL=defaultScopes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/stackStrategy.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const defaultScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/defaultScopes.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
/**
 * This is an object that holds a stack of scopes.
 */ class AsyncContextStack {
    constructor(scope$1, isolationScope){
        let assignedScope;
        if (!scope$1) {
            assignedScope = new scope.Scope();
        } else {
            assignedScope = scope$1;
        }
        let assignedIsolationScope;
        if (!isolationScope) {
            assignedIsolationScope = new scope.Scope();
        } else {
            assignedIsolationScope = isolationScope;
        }
        // scope stack for domains or the process
        this._stack = [
            {
                scope: assignedScope
            }
        ];
        this._isolationScope = assignedIsolationScope;
    }
    /**
   * Fork a scope for the stack.
   */ withScope(callback) {
        const scope = this._pushScope();
        let maybePromiseResult;
        try {
            maybePromiseResult = callback(scope);
        } catch (e) {
            this._popScope();
            throw e;
        }
        if (is.isThenable(maybePromiseResult)) {
            // @ts-expect-error - isThenable returns the wrong type
            return maybePromiseResult.then((res)=>{
                this._popScope();
                return res;
            }, (e)=>{
                this._popScope();
                throw e;
            });
        }
        this._popScope();
        return maybePromiseResult;
    }
    /**
   * Get the client of the stack.
   */ getClient() {
        return this.getStackTop().client;
    }
    /**
   * Returns the scope of the top stack.
   */ getScope() {
        return this.getStackTop().scope;
    }
    /**
   * Get the isolation scope for the stack.
   */ getIsolationScope() {
        return this._isolationScope;
    }
    /**
   * Returns the topmost scope layer in the order domain > local > process.
   */ getStackTop() {
        return this._stack[this._stack.length - 1];
    }
    /**
   * Push a scope to the stack.
   */ _pushScope() {
        // We want to clone the content of prev scope
        const scope = this.getScope().clone();
        this._stack.push({
            client: this.getClient(),
            scope
        });
        return scope;
    }
    /**
   * Pop a scope from the stack.
   */ _popScope() {
        if (this._stack.length <= 1) return false;
        return !!this._stack.pop();
    }
}
/**
 * Get the global async context stack.
 * This will be removed during the v8 cycle and is only here to make migration easier.
 */ function getAsyncContextStack() {
    const registry = carrier.getMainCarrier();
    const sentry = carrier.getSentryCarrier(registry);
    return sentry.stack = sentry.stack || new AsyncContextStack(defaultScopes.getDefaultCurrentScope(), defaultScopes.getDefaultIsolationScope());
}
function withScope(callback) {
    return getAsyncContextStack().withScope(callback);
}
function withSetScope(scope, callback) {
    const stack = getAsyncContextStack();
    return stack.withScope(()=>{
        stack.getStackTop().scope = scope;
        return callback(scope);
    });
}
function withIsolationScope(callback) {
    return getAsyncContextStack().withScope(()=>{
        return callback(getAsyncContextStack().getIsolationScope());
    });
}
/**
 * Get the stack-based async context strategy.
 */ function getStackAsyncContextStrategy() {
    return {
        withIsolationScope,
        withScope,
        withSetScope,
        withSetIsolationScope: (_isolationScope, callback)=>{
            return withIsolationScope(callback);
        },
        getCurrentScope: ()=>getAsyncContextStack().getScope(),
        getIsolationScope: ()=>getAsyncContextStack().getIsolationScope()
    };
}
exports.AsyncContextStack = AsyncContextStack;
exports.getStackAsyncContextStrategy = getStackAsyncContextStrategy; //# sourceMappingURL=stackStrategy.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const stackStrategy = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/stackStrategy.js [app-ssr] (ecmascript)");
/**
 * @private Private API with no semver guarantees!
 *
 * Sets the global async context strategy
 */ function setAsyncContextStrategy(strategy) {
    // Get main carrier (global for every environment)
    const registry = carrier.getMainCarrier();
    const sentry = carrier.getSentryCarrier(registry);
    sentry.acs = strategy;
}
/**
 * Get the current async context strategy.
 * If none has been setup, the default will be used.
 */ function getAsyncContextStrategy(carrier$1) {
    const sentry = carrier.getSentryCarrier(carrier$1);
    if (sentry.acs) {
        return sentry.acs;
    }
    // Otherwise, use the default one (stack)
    return stackStrategy.getStackAsyncContextStrategy();
}
exports.getAsyncContextStrategy = getAsyncContextStrategy;
exports.setAsyncContextStrategy = setAsyncContextStrategy; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
/**
 * Get the currently active scope.
 */ function getCurrentScope() {
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    return acs.getCurrentScope();
}
/**
 * Get the currently active isolation scope.
 * The isolation scope is active for the current execution context.
 */ function getIsolationScope() {
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    return acs.getIsolationScope();
}
/**
 * Get the global scope.
 * This scope is applied to _all_ events.
 */ function getGlobalScope() {
    return carrier.getGlobalSingleton('globalScope', ()=>new scope.Scope());
}
/**
 * Creates a new scope with and executes the given operation within.
 * The scope is automatically removed once the operation
 * finishes or throws.
 */ /**
 * Either creates a new active scope, or sets the given scope as active scope in the given callback.
 */ function withScope(...rest) {
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    // If a scope is defined, we want to make this the active scope instead of the default one
    if (rest.length === 2) {
        const [scope, callback] = rest;
        if (!scope) {
            return acs.withScope(callback);
        }
        return acs.withSetScope(scope, callback);
    }
    return acs.withScope(rest[0]);
}
/**
 * Attempts to fork the current isolation scope and the current scope based on the current async context strategy. If no
 * async context strategy is set, the isolation scope and the current scope will not be forked (this is currently the
 * case, for example, in the browser).
 *
 * Usage of this function in environments without async context strategy is discouraged and may lead to unexpected behaviour.
 *
 * This function is intended for Sentry SDK and SDK integration development. It is not recommended to be used in "normal"
 * applications directly because it comes with pitfalls. Use at your own risk!
 */ /**
 * Either creates a new active isolation scope, or sets the given isolation scope as active scope in the given callback.
 */ function withIsolationScope(...rest) {
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    // If a scope is defined, we want to make this the active scope instead of the default one
    if (rest.length === 2) {
        const [isolationScope, callback] = rest;
        if (!isolationScope) {
            return acs.withIsolationScope(callback);
        }
        return acs.withSetIsolationScope(isolationScope, callback);
    }
    return acs.withIsolationScope(rest[0]);
}
/**
 * Get the currently active client.
 */ function getClient() {
    return getCurrentScope().getClient();
}
/**
 * Get a trace context for the given scope.
 */ function getTraceContextFromScope(scope) {
    const propagationContext$1 = scope.getPropagationContext();
    const { traceId, parentSpanId, propagationSpanId } = propagationContext$1;
    const traceContext = {
        trace_id: traceId,
        span_id: propagationSpanId || propagationContext.generateSpanId()
    };
    if (parentSpanId) {
        traceContext.parent_span_id = parentSpanId;
    }
    return traceContext;
}
exports.getClient = getClient;
exports.getCurrentScope = getCurrentScope;
exports.getGlobalScope = getGlobalScope;
exports.getIsolationScope = getIsolationScope;
exports.getTraceContextFromScope = getTraceContextFromScope;
exports.withIsolationScope = withIsolationScope;
exports.withScope = withScope; //# sourceMappingURL=currentScopes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Use this attribute to represent the source of a span.
 * Should be one of: custom, url, route, view, component, task, unknown
 *
 */ const SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = 'sentry.source';
/**
 * Attributes that holds the sample rate that was locally applied to a span.
 * If this attribute is not defined, it means that the span inherited a sampling decision.
 *
 * NOTE: Is only defined on root spans.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = 'sentry.sample_rate';
/**
 * Attribute holding the sample rate of the previous trace.
 * This is used to sample consistently across subsequent traces in the browser SDK.
 *
 * Note: Only defined on root spans, if opted into consistent sampling
 */ const SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE = 'sentry.previous_trace_sample_rate';
/**
 * Use this attribute to represent the operation of a span.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_OP = 'sentry.op';
/**
 * Use this attribute to represent the origin of a span.
 */ const SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = 'sentry.origin';
/** The reason why an idle span finished. */ const SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON = 'sentry.idle_span_finish_reason';
/** The unit of a measurement, which may be stored as a TimedEvent. */ const SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT = 'sentry.measurement_unit';
/** The value of a measurement, which may be stored as a TimedEvent. */ const SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE = 'sentry.measurement_value';
/**
 * A custom span name set by users guaranteed to be taken over any automatically
 * inferred name. This attribute is removed before the span is sent.
 *
 * @internal only meant for internal SDK usage
 * @hidden
 */ const SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME = 'sentry.custom_span_name';
/**
 * The id of the profile that this span occurred in.
 */ const SEMANTIC_ATTRIBUTE_PROFILE_ID = 'sentry.profile_id';
const SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME = 'sentry.exclusive_time';
const SEMANTIC_ATTRIBUTE_CACHE_HIT = 'cache.hit';
const SEMANTIC_ATTRIBUTE_CACHE_KEY = 'cache.key';
const SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE = 'cache.item_size';
/** TODO: Remove these once we update to latest semantic conventions */ const SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD = 'http.request.method';
const SEMANTIC_ATTRIBUTE_URL_FULL = 'url.full';
/**
 * A span link attribute to mark the link as a special span link.
 *
 * Known values:
 * - `previous_trace`: The span links to the frontend root span of the previous trace.
 * - `next_trace`: The span links to the frontend root span of the next trace. (Not set by the SDK)
 *
 * Other values may be set as appropriate.
 * @see https://develop.sentry.dev/sdk/telemetry/traces/span-links/#link-types
 */ const SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE = 'sentry.link.type';
exports.SEMANTIC_ATTRIBUTE_CACHE_HIT = SEMANTIC_ATTRIBUTE_CACHE_HIT;
exports.SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE = SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE;
exports.SEMANTIC_ATTRIBUTE_CACHE_KEY = SEMANTIC_ATTRIBUTE_CACHE_KEY;
exports.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME = SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME;
exports.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD = SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD;
exports.SEMANTIC_ATTRIBUTE_PROFILE_ID = SEMANTIC_ATTRIBUTE_PROFILE_ID;
exports.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME = SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME;
exports.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON = SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON;
exports.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT = SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT;
exports.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE = SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE = SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.SEMANTIC_ATTRIBUTE_URL_FULL = SEMANTIC_ATTRIBUTE_URL_FULL;
exports.SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE = SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE; //# sourceMappingURL=semanticAttributes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const SPAN_STATUS_UNSET = 0;
const SPAN_STATUS_OK = 1;
const SPAN_STATUS_ERROR = 2;
/**
 * Converts a HTTP status code into a sentry status with a message.
 *
 * @param httpStatus The HTTP response status code.
 * @returns The span status or unknown_error.
 */ // https://develop.sentry.dev/sdk/event-payloads/span/
function getSpanStatusFromHttpCode(httpStatus) {
    if (httpStatus < 400 && httpStatus >= 100) {
        return {
            code: SPAN_STATUS_OK
        };
    }
    if (httpStatus >= 400 && httpStatus < 500) {
        switch(httpStatus){
            case 401:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'unauthenticated'
                };
            case 403:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'permission_denied'
                };
            case 404:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'not_found'
                };
            case 409:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'already_exists'
                };
            case 413:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'failed_precondition'
                };
            case 429:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'resource_exhausted'
                };
            case 499:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'cancelled'
                };
            default:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'invalid_argument'
                };
        }
    }
    if (httpStatus >= 500 && httpStatus < 600) {
        switch(httpStatus){
            case 501:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'unimplemented'
                };
            case 503:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'unavailable'
                };
            case 504:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'deadline_exceeded'
                };
            default:
                return {
                    code: SPAN_STATUS_ERROR,
                    message: 'internal_error'
                };
        }
    }
    return {
        code: SPAN_STATUS_ERROR,
        message: 'unknown_error'
    };
}
/**
 * Sets the Http status attributes on the current span based on the http code.
 * Additionally, the span's status is updated, depending on the http code.
 */ function setHttpStatus(span, httpStatus) {
    span.setAttribute('http.response.status_code', httpStatus);
    const spanStatus = getSpanStatusFromHttpCode(httpStatus);
    if (spanStatus.message !== 'unknown_error') {
        span.setStatus(spanStatus);
    }
}
exports.SPAN_STATUS_ERROR = SPAN_STATUS_ERROR;
exports.SPAN_STATUS_OK = SPAN_STATUS_OK;
exports.SPAN_STATUS_UNSET = SPAN_STATUS_UNSET;
exports.getSpanStatusFromHttpCode = getSpanStatusFromHttpCode;
exports.setHttpStatus = setHttpStatus; //# sourceMappingURL=spanstatus.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const SCOPE_ON_START_SPAN_FIELD = '_sentryScope';
const ISOLATION_SCOPE_ON_START_SPAN_FIELD = '_sentryIsolationScope';
/** Store the scope & isolation scope for a span, which can the be used when it is finished. */ function setCapturedScopesOnSpan(span, scope, isolationScope) {
    if (span) {
        object.addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, isolationScope);
        object.addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope);
    }
}
/**
 * Grabs the scope and isolation scope off a span that were active when the span was started.
 */ function getCapturedScopesOnSpan(span) {
    return {
        scope: span[SCOPE_ON_START_SPAN_FIELD],
        isolationScope: span[ISOLATION_SCOPE_ON_START_SPAN_FIELD]
    };
}
exports.getCapturedScopesOnSpan = getCapturedScopesOnSpan;
exports.setCapturedScopesOnSpan = setCapturedScopesOnSpan; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const SENTRY_BAGGAGE_KEY_PREFIX = 'sentry-';
const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = /^sentry-/;
/**
 * Max length of a serialized baggage string
 *
 * https://www.w3.org/TR/baggage/#limits
 */ const MAX_BAGGAGE_STRING_LENGTH = 8192;
/**
 * Takes a baggage header and turns it into Dynamic Sampling Context, by extracting all the "sentry-" prefixed values
 * from it.
 *
 * @param baggageHeader A very bread definition of a baggage header as it might appear in various frameworks.
 * @returns The Dynamic Sampling Context that was found on `baggageHeader`, if there was any, `undefined` otherwise.
 */ function baggageHeaderToDynamicSamplingContext(// Very liberal definition of what any incoming header might look like
baggageHeader) {
    const baggageObject = parseBaggageHeader(baggageHeader);
    if (!baggageObject) {
        return undefined;
    }
    // Read all "sentry-" prefixed values out of the baggage object and put it onto a dynamic sampling context object.
    const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value])=>{
        if (key.match(SENTRY_BAGGAGE_KEY_PREFIX_REGEX)) {
            const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
            acc[nonPrefixedKey] = value;
        }
        return acc;
    }, {});
    // Only return a dynamic sampling context object if there are keys in it.
    // A keyless object means there were no sentry values on the header, which means that there is no DSC.
    if (Object.keys(dynamicSamplingContext).length > 0) {
        return dynamicSamplingContext;
    } else {
        return undefined;
    }
}
/**
 * Turns a Dynamic Sampling Object into a baggage header by prefixing all the keys on the object with "sentry-".
 *
 * @param dynamicSamplingContext The Dynamic Sampling Context to turn into a header. For convenience and compatibility
 * with the `getDynamicSamplingContext` method on the Transaction class ,this argument can also be `undefined`. If it is
 * `undefined` the function will return `undefined`.
 * @returns a baggage header, created from `dynamicSamplingContext`, or `undefined` either if `dynamicSamplingContext`
 * was `undefined`, or if `dynamicSamplingContext` didn't contain any values.
 */ function dynamicSamplingContextToSentryBaggageHeader(// this also takes undefined for convenience and bundle size in other places
dynamicSamplingContext) {
    if (!dynamicSamplingContext) {
        return undefined;
    }
    // Prefix all DSC keys with "sentry-" and put them into a new object
    const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce((acc, [dscKey, dscValue])=>{
        if (dscValue) {
            acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
        }
        return acc;
    }, {});
    return objectToBaggageHeader(sentryPrefixedDSC);
}
/**
 * Take a baggage header and parse it into an object.
 */ function parseBaggageHeader(baggageHeader) {
    if (!baggageHeader || !is.isString(baggageHeader) && !Array.isArray(baggageHeader)) {
        return undefined;
    }
    if (Array.isArray(baggageHeader)) {
        // Combine all baggage headers into one object containing the baggage values so we can later read the Sentry-DSC-values from it
        return baggageHeader.reduce((acc, curr)=>{
            const currBaggageObject = baggageHeaderToObject(curr);
            Object.entries(currBaggageObject).forEach(([key, value])=>{
                acc[key] = value;
            });
            return acc;
        }, {});
    }
    return baggageHeaderToObject(baggageHeader);
}
/**
 * Will parse a baggage header, which is a simple key-value map, into a flat object.
 *
 * @param baggageHeader The baggage header to parse.
 * @returns a flat object containing all the key-value pairs from `baggageHeader`.
 */ function baggageHeaderToObject(baggageHeader) {
    return baggageHeader.split(',').map((baggageEntry)=>baggageEntry.split('=').map((keyOrValue)=>{
            try {
                return decodeURIComponent(keyOrValue.trim());
            } catch  {
                // We ignore errors here, e.g. if the value cannot be URL decoded.
                // This will then be skipped in the next step
                return;
            }
        })).reduce((acc, [key, value])=>{
        if (key && value) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
/**
 * Turns a flat object (key-value pairs) into a baggage header, which is also just key-value pairs.
 *
 * @param object The object to turn into a baggage header.
 * @returns a baggage header string, or `undefined` if the object didn't have any values, since an empty baggage header
 * is not spec compliant.
 */ function objectToBaggageHeader(object) {
    if (Object.keys(object).length === 0) {
        // An empty baggage header is not spec compliant: We return undefined.
        return undefined;
    }
    return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex)=>{
        const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
        const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
        if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`);
            return baggageHeader;
        } else {
            return newBaggageHeader;
        }
    }, '');
}
exports.MAX_BAGGAGE_STRING_LENGTH = MAX_BAGGAGE_STRING_LENGTH;
exports.SENTRY_BAGGAGE_KEY_PREFIX = SENTRY_BAGGAGE_KEY_PREFIX;
exports.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = SENTRY_BAGGAGE_KEY_PREFIX_REGEX;
exports.baggageHeaderToDynamicSamplingContext = baggageHeaderToDynamicSamplingContext;
exports.dynamicSamplingContextToSentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader;
exports.objectToBaggageHeader = objectToBaggageHeader;
exports.parseBaggageHeader = parseBaggageHeader; //# sourceMappingURL=baggage.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
/** Regular expression used to extract org ID from a DSN host. */ const ORG_ID_REGEX = /^o(\d+)\./;
/** Regular expression used to parse a Dsn. */ const DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)([\w.-]+)(?::(\d+))?\/(.+)/;
function isValidProtocol(protocol) {
    return protocol === 'http' || protocol === 'https';
}
/**
 * Renders the string representation of this Dsn.
 *
 * By default, this will render the public representation without the password
 * component. To get the deprecated private representation, set `withPassword`
 * to true.
 *
 * @param withPassword When set to true, the password will be included.
 */ function dsnToString(dsn, withPassword = false) {
    const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
    return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ''}` + `@${host}${port ? `:${port}` : ''}/${path ? `${path}/` : path}${projectId}`;
}
/**
 * Parses a Dsn from a given string.
 *
 * @param str A Dsn as string
 * @returns Dsn as DsnComponents or undefined if @param str is not a valid DSN string
 */ function dsnFromString(str) {
    const match = DSN_REGEX.exec(str);
    if (!match) {
        // This should be logged to the console
        debugLogger.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.error(`Invalid Sentry Dsn: ${str}`);
        });
        return undefined;
    }
    const [protocol, publicKey, pass = '', host = '', port = '', lastPath = ''] = match.slice(1);
    let path = '';
    let projectId = lastPath;
    const split = projectId.split('/');
    if (split.length > 1) {
        path = split.slice(0, -1).join('/');
        projectId = split.pop();
    }
    if (projectId) {
        const projectMatch = projectId.match(/^\d+/);
        if (projectMatch) {
            projectId = projectMatch[0];
        }
    }
    return dsnFromComponents({
        host,
        pass,
        path,
        projectId,
        port,
        protocol: protocol,
        publicKey
    });
}
function dsnFromComponents(components) {
    return {
        protocol: components.protocol,
        publicKey: components.publicKey || '',
        pass: components.pass || '',
        host: components.host,
        port: components.port || '',
        path: components.path || '',
        projectId: components.projectId
    };
}
function validateDsn(dsn) {
    if (!debugBuild.DEBUG_BUILD) {
        return true;
    }
    const { port, projectId, protocol } = dsn;
    const requiredComponents = [
        'protocol',
        'publicKey',
        'host',
        'projectId'
    ];
    const hasMissingRequiredComponent = requiredComponents.find((component)=>{
        if (!dsn[component]) {
            debugLogger.debug.error(`Invalid Sentry Dsn: ${component} missing`);
            return true;
        }
        return false;
    });
    if (hasMissingRequiredComponent) {
        return false;
    }
    if (!projectId.match(/^\d+$/)) {
        debugLogger.debug.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
        return false;
    }
    if (!isValidProtocol(protocol)) {
        debugLogger.debug.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
        return false;
    }
    if (port && isNaN(parseInt(port, 10))) {
        debugLogger.debug.error(`Invalid Sentry Dsn: Invalid port ${port}`);
        return false;
    }
    return true;
}
/**
 * Extract the org ID from a DSN host.
 *
 * @param host The host from a DSN
 * @returns The org ID if found, undefined otherwise
 */ function extractOrgIdFromDsnHost(host) {
    const match = host.match(ORG_ID_REGEX);
    return match?.[1];
}
/**
 *  Returns the organization ID of the client.
 *
 *  The organization ID is extracted from the DSN. If the client options include a `orgId`, this will always take precedence.
 */ function extractOrgIdFromClient(client) {
    const options = client.getOptions();
    const { host } = client.getDsn() || {};
    let org_id;
    if (options.orgId) {
        org_id = String(options.orgId);
    } else if (host) {
        org_id = extractOrgIdFromDsnHost(host);
    }
    return org_id;
}
/**
 * Creates a valid Sentry Dsn object, identifying a Sentry instance and project.
 * @returns a valid DsnComponents object or `undefined` if @param from is an invalid DSN source
 */ function makeDsn(from) {
    const components = typeof from === 'string' ? dsnFromString(from) : dsnFromComponents(from);
    if (!components || !validateDsn(components)) {
        return undefined;
    }
    return components;
}
exports.dsnFromString = dsnFromString;
exports.dsnToString = dsnToString;
exports.extractOrgIdFromClient = extractOrgIdFromClient;
exports.extractOrgIdFromDsnHost = extractOrgIdFromDsnHost;
exports.makeDsn = makeDsn; //# sourceMappingURL=dsn.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Parse a sample rate from a given value.
 * This will either return a boolean or number sample rate, if the sample rate is valid (between 0 and 1).
 * If a string is passed, we try to convert it to a number.
 *
 * Any invalid sample rate will return `undefined`.
 */ function parseSampleRate(sampleRate) {
    if (typeof sampleRate === 'boolean') {
        return Number(sampleRate);
    }
    const rate = typeof sampleRate === 'string' ? parseFloat(sampleRate) : sampleRate;
    if (typeof rate !== 'number' || isNaN(rate) || rate < 0 || rate > 1) {
        return undefined;
    }
    return rate;
}
exports.parseSampleRate = parseSampleRate; //# sourceMappingURL=parseSampleRate.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/tracing.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const parseSampleRate = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
// eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- RegExp is used for readability here
const TRACEPARENT_REGEXP = new RegExp('^[ \\t]*' + // whitespace
'([0-9a-f]{32})?' + // trace_id
'-?([0-9a-f]{16})?' + // span_id
'-?([01])?' + // sampled
'[ \\t]*$');
/**
 * Extract transaction context data from a `sentry-trace` header.
 *
 * @param traceparent Traceparent string
 *
 * @returns Object containing data from the header, or undefined if traceparent string is malformed
 */ function extractTraceparentData(traceparent) {
    if (!traceparent) {
        return undefined;
    }
    const matches = traceparent.match(TRACEPARENT_REGEXP);
    if (!matches) {
        return undefined;
    }
    let parentSampled;
    if (matches[3] === '1') {
        parentSampled = true;
    } else if (matches[3] === '0') {
        parentSampled = false;
    }
    return {
        traceId: matches[1],
        parentSampled,
        parentSpanId: matches[2]
    };
}
/**
 * Create a propagation context from incoming headers or
 * creates a minimal new one if the headers are undefined.
 */ function propagationContextFromHeaders(sentryTrace, baggage$1) {
    const traceparentData = extractTraceparentData(sentryTrace);
    const dynamicSamplingContext = baggage.baggageHeaderToDynamicSamplingContext(baggage$1);
    if (!traceparentData?.traceId) {
        return {
            traceId: propagationContext.generateTraceId(),
            sampleRand: Math.random()
        };
    }
    const sampleRand = getSampleRandFromTraceparentAndDsc(traceparentData, dynamicSamplingContext);
    // The sample_rand on the DSC needs to be generated based on traceparent + baggage.
    if (dynamicSamplingContext) {
        dynamicSamplingContext.sample_rand = sampleRand.toString();
    }
    const { traceId, parentSpanId, parentSampled } = traceparentData;
    return {
        traceId,
        parentSpanId,
        sampled: parentSampled,
        dsc: dynamicSamplingContext || {},
        sampleRand
    };
}
/**
 * Create sentry-trace header from span context values.
 */ function generateSentryTraceHeader(traceId = propagationContext.generateTraceId(), spanId = propagationContext.generateSpanId(), sampled) {
    let sampledString = '';
    if (sampled !== undefined) {
        sampledString = sampled ? '-1' : '-0';
    }
    return `${traceId}-${spanId}${sampledString}`;
}
/**
 * Given any combination of an incoming trace, generate a sample rand based on its defined semantics.
 *
 * Read more: https://develop.sentry.dev/sdk/telemetry/traces/#propagated-random-value
 */ function getSampleRandFromTraceparentAndDsc(traceparentData, dsc) {
    // When there is an incoming sample rand use it.
    const parsedSampleRand = parseSampleRate.parseSampleRate(dsc?.sample_rand);
    if (parsedSampleRand !== undefined) {
        return parsedSampleRand;
    }
    // Otherwise, if there is an incoming sampling decision + sample rate, generate a sample rand that would lead to the same sampling decision.
    const parsedSampleRate = parseSampleRate.parseSampleRate(dsc?.sample_rate);
    if (parsedSampleRate && traceparentData?.parentSampled !== undefined) {
        return traceparentData.parentSampled ? Math.random() * parsedSampleRate : parsedSampleRate + Math.random() * (1 - parsedSampleRate);
    } else {
        // If nothing applies, return a random sample rand.
        return Math.random();
    }
}
/**
 * Determines whether a new trace should be continued based on the provided baggage org ID and the client's `strictTraceContinuation` option.
 * If the trace should not be continued, a new trace will be started.
 *
 * The result is dependent on the `strictTraceContinuation` option in the client.
 * See https://develop.sentry.dev/sdk/telemetry/traces/#stricttracecontinuation
 */ function shouldContinueTrace(client, baggageOrgId) {
    const clientOrgId = dsn.extractOrgIdFromClient(client);
    // Case: baggage orgID and Client orgID don't match - always start new trace
    if (baggageOrgId && clientOrgId && baggageOrgId !== clientOrgId) {
        debugLogger.debug.log(`Won't continue trace because org IDs don't match (incoming baggage: ${baggageOrgId}, SDK options: ${clientOrgId})`);
        return false;
    }
    const strictTraceContinuation = client.getOptions().strictTraceContinuation || false; // default for `strictTraceContinuation` is `false`
    if (strictTraceContinuation) {
        // With strict continuation enabled, don't continue trace if:
        // - Baggage has orgID, but Client doesn't have one
        // - Client has orgID, but baggage doesn't have one
        if (baggageOrgId && !clientOrgId || !baggageOrgId && clientOrgId) {
            debugLogger.debug.log(`Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${baggageOrgId}, Sentry client: ${clientOrgId})`);
            return false;
        }
    }
    return true;
}
exports.TRACEPARENT_REGEXP = TRACEPARENT_REGEXP;
exports.extractTraceparentData = extractTraceparentData;
exports.generateSentryTraceHeader = generateSentryTraceHeader;
exports.propagationContextFromHeaders = propagationContextFromHeaders;
exports.shouldContinueTrace = shouldContinueTrace; //# sourceMappingURL=tracing.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const tracing = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/tracing.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanOnScope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)");
// These are aligned with OpenTelemetry trace flags
const TRACE_FLAG_NONE = 0x0;
const TRACE_FLAG_SAMPLED = 0x1;
let hasShownSpanDropWarning = false;
/**
 * Convert a span to a trace context, which can be sent as the `trace` context in an event.
 * By default, this will only include trace_id, span_id & parent_span_id.
 * If `includeAllData` is true, it will also include data, op, status & origin.
 */ function spanToTransactionTraceContext(span) {
    const { spanId: span_id, traceId: trace_id } = span.spanContext();
    const { data, op, parent_span_id, status, origin, links } = spanToJSON(span);
    return {
        parent_span_id,
        span_id,
        trace_id,
        data,
        op,
        status,
        origin,
        links
    };
}
/**
 * Convert a span to a trace context, which can be sent as the `trace` context in a non-transaction event.
 */ function spanToTraceContext(span) {
    const { spanId, traceId: trace_id, isRemote } = span.spanContext();
    // If the span is remote, we use a random/virtual span as span_id to the trace context,
    // and the remote span as parent_span_id
    const parent_span_id = isRemote ? spanId : spanToJSON(span).parent_span_id;
    const scope = utils.getCapturedScopesOnSpan(span).scope;
    const span_id = isRemote ? scope?.getPropagationContext().propagationSpanId || propagationContext.generateSpanId() : spanId;
    return {
        parent_span_id,
        span_id,
        trace_id
    };
}
/**
 * Convert a Span to a Sentry trace header.
 */ function spanToTraceHeader(span) {
    const { traceId, spanId } = span.spanContext();
    const sampled = spanIsSampled(span);
    return tracing.generateSentryTraceHeader(traceId, spanId, sampled);
}
/**
 *  Converts the span links array to a flattened version to be sent within an envelope.
 *
 *  If the links array is empty, it returns `undefined` so the empty value can be dropped before it's sent.
 */ function convertSpanLinksForEnvelope(links) {
    if (links && links.length > 0) {
        return links.map(({ context: { spanId, traceId, traceFlags, ...restContext }, attributes })=>({
                span_id: spanId,
                trace_id: traceId,
                sampled: traceFlags === TRACE_FLAG_SAMPLED,
                attributes,
                ...restContext
            }));
    } else {
        return undefined;
    }
}
/**
 * Convert a span time input into a timestamp in seconds.
 */ function spanTimeInputToSeconds(input) {
    if (typeof input === 'number') {
        return ensureTimestampInSeconds(input);
    }
    if (Array.isArray(input)) {
        // See {@link HrTime} for the array-based time format
        return input[0] + input[1] / 1e9;
    }
    if (input instanceof Date) {
        return ensureTimestampInSeconds(input.getTime());
    }
    return time.timestampInSeconds();
}
/**
 * Converts a timestamp to second, if it was in milliseconds, or keeps it as second.
 */ function ensureTimestampInSeconds(timestamp) {
    const isMs = timestamp > 9999999999;
    return isMs ? timestamp / 1000 : timestamp;
}
/**
 * Convert a span to a JSON representation.
 */ // Note: Because of this, we currently have a circular type dependency (which we opted out of in package.json).
// This is not avoidable as we need `spanToJSON` in `spanUtils.ts`, which in turn is needed by `span.ts` for backwards compatibility.
// And `spanToJSON` needs the Span class from `span.ts` to check here.
function spanToJSON(span) {
    if (spanIsSentrySpan(span)) {
        return span.getSpanJSON();
    }
    const { spanId: span_id, traceId: trace_id } = span.spanContext();
    // Handle a span from @opentelemetry/sdk-base-trace's `Span` class
    if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
        const { attributes, startTime, name, endTime, status, links } = span;
        // In preparation for the next major of OpenTelemetry, we want to support
        // looking up the parent span id according to the new API
        // In OTel v1, the parent span id is accessed as `parentSpanId`
        // In OTel v2, the parent span id is accessed as `spanId` on the `parentSpanContext`
        const parentSpanId = 'parentSpanId' in span ? span.parentSpanId : 'parentSpanContext' in span ? span.parentSpanContext?.spanId : undefined;
        return {
            span_id,
            trace_id,
            data: attributes,
            description: name,
            parent_span_id: parentSpanId,
            start_timestamp: spanTimeInputToSeconds(startTime),
            // This is [0,0] by default in OTEL, in which case we want to interpret this as no end time
            timestamp: spanTimeInputToSeconds(endTime) || undefined,
            status: getStatusMessage(status),
            op: attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP],
            origin: attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
            links: convertSpanLinksForEnvelope(links)
        };
    }
    // Finally, at least we have `spanContext()`....
    // This should not actually happen in reality, but we need to handle it for type safety.
    return {
        span_id,
        trace_id,
        start_timestamp: 0,
        data: {}
    };
}
function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
    const castSpan = span;
    return !!castSpan.attributes && !!castSpan.startTime && !!castSpan.name && !!castSpan.endTime && !!castSpan.status;
}
/** Exported only for tests. */ /**
 * Sadly, due to circular dependency checks we cannot actually import the Span class here and check for instanceof.
 * :( So instead we approximate this by checking if it has the `getSpanJSON` method.
 */ function spanIsSentrySpan(span) {
    return typeof span.getSpanJSON === 'function';
}
/**
 * Returns true if a span is sampled.
 * In most cases, you should just use `span.isRecording()` instead.
 * However, this has a slightly different semantic, as it also returns false if the span is finished.
 * So in the case where this distinction is important, use this method.
 */ function spanIsSampled(span) {
    // We align our trace flags with the ones OpenTelemetry use
    // So we also check for sampled the same way they do.
    const { traceFlags } = span.spanContext();
    return traceFlags === TRACE_FLAG_SAMPLED;
}
/** Get the status message to use for a JSON representation of a span. */ function getStatusMessage(status) {
    if (!status || status.code === spanstatus.SPAN_STATUS_UNSET) {
        return undefined;
    }
    if (status.code === spanstatus.SPAN_STATUS_OK) {
        return 'ok';
    }
    return status.message || 'unknown_error';
}
const CHILD_SPANS_FIELD = '_sentryChildSpans';
const ROOT_SPAN_FIELD = '_sentryRootSpan';
/**
 * Adds an opaque child span reference to a span.
 */ function addChildSpanToSpan(span, childSpan) {
    // We store the root span reference on the child span
    // We need this for `getRootSpan()` to work
    const rootSpan = span[ROOT_SPAN_FIELD] || span;
    object.addNonEnumerableProperty(childSpan, ROOT_SPAN_FIELD, rootSpan);
    // We store a list of child spans on the parent span
    // We need this for `getSpanDescendants()` to work
    if (span[CHILD_SPANS_FIELD]) {
        span[CHILD_SPANS_FIELD].add(childSpan);
    } else {
        object.addNonEnumerableProperty(span, CHILD_SPANS_FIELD, new Set([
            childSpan
        ]));
    }
}
/** This is only used internally by Idle Spans. */ function removeChildSpanFromSpan(span, childSpan) {
    if (span[CHILD_SPANS_FIELD]) {
        span[CHILD_SPANS_FIELD].delete(childSpan);
    }
}
/**
 * Returns an array of the given span and all of its descendants.
 */ function getSpanDescendants(span) {
    const resultSet = new Set();
    function addSpanChildren(span) {
        // This exit condition is required to not infinitely loop in case of a circular dependency.
        if (resultSet.has(span)) {
            return;
        // We want to ignore unsampled spans (e.g. non recording spans)
        } else if (spanIsSampled(span)) {
            resultSet.add(span);
            const childSpans = span[CHILD_SPANS_FIELD] ? Array.from(span[CHILD_SPANS_FIELD]) : [];
            for (const childSpan of childSpans){
                addSpanChildren(childSpan);
            }
        }
    }
    addSpanChildren(span);
    return Array.from(resultSet);
}
/**
 * Returns the root span of a given span.
 */ function getRootSpan(span) {
    return span[ROOT_SPAN_FIELD] || span;
}
/**
 * Returns the currently active span.
 */ function getActiveSpan() {
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    if (acs.getActiveSpan) {
        return acs.getActiveSpan();
    }
    return spanOnScope._getSpanForScope(currentScopes.getCurrentScope());
}
/**
 * Logs a warning once if `beforeSendSpan` is used to drop spans.
 */ function showSpanDropWarning() {
    if (!hasShownSpanDropWarning) {
        debugLogger.consoleSandbox(()=>{
            // eslint-disable-next-line no-console
            console.warn('[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly.');
        });
        hasShownSpanDropWarning = true;
    }
}
/**
 * Updates the name of the given span and ensures that the span name is not
 * overwritten by the Sentry SDK.
 *
 * Use this function instead of `span.updateName()` if you want to make sure that
 * your name is kept. For some spans, for example root `http.server` spans the
 * Sentry SDK would otherwise overwrite the span name with a high-quality name
 * it infers when the span ends.
 *
 * Use this function in server code or when your span is started on the server
 * and on the client (browser). If you only update a span name on the client,
 * you can also use `span.updateName()` the SDK does not overwrite the name.
 *
 * @param span - The span to update the name of.
 * @param name - The name to set on the span.
 */ function updateSpanName(span, name) {
    span.updateName(name);
    span.setAttributes({
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'custom',
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME]: name
    });
}
exports.TRACE_FLAG_NONE = TRACE_FLAG_NONE;
exports.TRACE_FLAG_SAMPLED = TRACE_FLAG_SAMPLED;
exports.addChildSpanToSpan = addChildSpanToSpan;
exports.convertSpanLinksForEnvelope = convertSpanLinksForEnvelope;
exports.getActiveSpan = getActiveSpan;
exports.getRootSpan = getRootSpan;
exports.getSpanDescendants = getSpanDescendants;
exports.getStatusMessage = getStatusMessage;
exports.removeChildSpanFromSpan = removeChildSpanFromSpan;
exports.showSpanDropWarning = showSpanDropWarning;
exports.spanIsSampled = spanIsSampled;
exports.spanTimeInputToSeconds = spanTimeInputToSeconds;
exports.spanToJSON = spanToJSON;
exports.spanToTraceContext = spanToTraceContext;
exports.spanToTraceHeader = spanToTraceHeader;
exports.spanToTransactionTraceContext = spanToTransactionTraceContext;
exports.updateSpanName = updateSpanName; //# sourceMappingURL=spanUtils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/errors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const globalError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalError.js [app-ssr] (ecmascript)");
const globalUnhandledRejection = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalUnhandledRejection.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
let errorsInstrumented = false;
/**
 * Ensure that global errors automatically set the active span status.
 */ function registerSpanErrorInstrumentation() {
    if (errorsInstrumented) {
        return;
    }
    /**
   * If an error or unhandled promise occurs, we mark the active root span as failed
   */ function errorCallback() {
        const activeSpan = spanUtils.getActiveSpan();
        const rootSpan = activeSpan && spanUtils.getRootSpan(activeSpan);
        if (rootSpan) {
            const message = 'internal_error';
            debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Tracing] Root span: ${message} -> Global error occurred`);
            rootSpan.setStatus({
                code: spanstatus.SPAN_STATUS_ERROR,
                message
            });
        }
    }
    // The function name will be lost when bundling but we need to be able to identify this listener later to maintain the
    // node.js default exit behaviour
    errorCallback.tag = 'sentry_tracingErrorCallback';
    errorsInstrumented = true;
    globalError.addGlobalErrorInstrumentationHandler(errorCallback);
    globalUnhandledRejection.addGlobalUnhandledRejectionInstrumentationHandler(errorCallback);
}
exports.registerSpanErrorInstrumentation = registerSpanErrorInstrumentation; //# sourceMappingURL=errors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
// Treeshakable guard to remove all code related to tracing
/**
 * Determines if span recording is currently enabled.
 *
 * Spans are recorded when at least one of `tracesSampleRate` and `tracesSampler`
 * is defined in the SDK config. This function does not make any assumption about
 * sampling decisions, it only checks if the SDK is configured to record spans.
 *
 * Important: This function only determines if span recording is enabled. Trace
 * continuation and propagation is separately controlled and not covered by this function.
 * If this function returns `false`, traces can still be propagated (which is what
 * we refer to by "Tracing without Performance")
 * @see https://develop.sentry.dev/sdk/telemetry/traces/tracing-without-performance/
 *
 * @param maybeOptions An SDK options object to be passed to this function.
 * If this option is not provided, the function will use the current client's options.
 */ function hasSpansEnabled(maybeOptions) {
    if (typeof __SENTRY_TRACING__ === 'boolean' && !__SENTRY_TRACING__) {
        return false;
    }
    const options = maybeOptions || currentScopes.getClient()?.getOptions();
    return !!options && // Note: This check is `!= null`, meaning "nullish". `0` is not "nullish", `undefined` and `null` are. (This comment was brought to you by 15 minutes of questioning life)
    (options.tracesSampleRate != null || !!options.tracesSampler);
}
exports.hasSpansEnabled = hasSpansEnabled; //# sourceMappingURL=hasSpansEnabled.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const DEFAULT_ENVIRONMENT = 'production';
exports.DEFAULT_ENVIRONMENT = DEFAULT_ENVIRONMENT; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/constants.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)");
/**
 * If you change this value, also update the terser plugin config to
 * avoid minification of the object property!
 */ const FROZEN_DSC_FIELD = '_frozenDsc';
/**
 * Freeze the given DSC on the given span.
 */ function freezeDscOnSpan(span, dsc) {
    const spanWithMaybeDsc = span;
    object.addNonEnumerableProperty(spanWithMaybeDsc, FROZEN_DSC_FIELD, dsc);
}
/**
 * Creates a dynamic sampling context from a client.
 *
 * Dispatches the `createDsc` lifecycle hook as a side effect.
 */ function getDynamicSamplingContextFromClient(trace_id, client) {
    const options = client.getOptions();
    const { publicKey: public_key } = client.getDsn() || {};
    // Instead of conditionally adding non-undefined values, we add them and then remove them if needed
    // otherwise, the order of baggage entries changes, which "breaks" a bunch of tests etc.
    const dsc = {
        environment: options.environment || constants.DEFAULT_ENVIRONMENT,
        release: options.release,
        public_key,
        trace_id,
        org_id: dsn.extractOrgIdFromClient(client)
    };
    client.emit('createDsc', dsc);
    return dsc;
}
/**
 * Get the dynamic sampling context for the currently active scopes.
 */ function getDynamicSamplingContextFromScope(client, scope) {
    const propagationContext = scope.getPropagationContext();
    return propagationContext.dsc || getDynamicSamplingContextFromClient(propagationContext.traceId, client);
}
/**
 * Creates a dynamic sampling context from a span (and client and scope)
 *
 * @param span the span from which a few values like the root span name and sample rate are extracted.
 *
 * @returns a dynamic sampling context
 */ function getDynamicSamplingContextFromSpan(span) {
    const client = currentScopes.getClient();
    if (!client) {
        return {};
    }
    const rootSpan = spanUtils.getRootSpan(span);
    const rootSpanJson = spanUtils.spanToJSON(rootSpan);
    const rootSpanAttributes = rootSpanJson.data;
    const traceState = rootSpan.spanContext().traceState;
    // The span sample rate that was locally applied to the root span should also always be applied to the DSC, even if the DSC is frozen.
    // This is so that the downstream traces/services can use parentSampleRate in their `tracesSampler` to make consistent sampling decisions across the entire trace.
    const rootSpanSampleRate = traceState?.get('sentry.sample_rate') ?? rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] ?? rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE];
    function applyLocalSampleRateToDsc(dsc) {
        if (typeof rootSpanSampleRate === 'number' || typeof rootSpanSampleRate === 'string') {
            dsc.sample_rate = `${rootSpanSampleRate}`;
        }
        return dsc;
    }
    // For core implementation, we freeze the DSC onto the span as a non-enumerable property
    const frozenDsc = rootSpan[FROZEN_DSC_FIELD];
    if (frozenDsc) {
        return applyLocalSampleRateToDsc(frozenDsc);
    }
    // For OpenTelemetry, we freeze the DSC on the trace state
    const traceStateDsc = traceState?.get('sentry.dsc');
    // If the span has a DSC, we want it to take precedence
    const dscOnTraceState = traceStateDsc && baggage.baggageHeaderToDynamicSamplingContext(traceStateDsc);
    if (dscOnTraceState) {
        return applyLocalSampleRateToDsc(dscOnTraceState);
    }
    // Else, we generate it from the span
    const dsc = getDynamicSamplingContextFromClient(span.spanContext().traceId, client);
    // We don't want to have a transaction name in the DSC if the source is "url" because URLs might contain PII
    const source = rootSpanAttributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
    // after JSON conversion, txn.name becomes jsonSpan.description
    const name = rootSpanJson.description;
    if (source !== 'url' && name) {
        dsc.transaction = name;
    }
    // How can we even land here with hasSpansEnabled() returning false?
    // Otel creates a Non-recording span in Tracing Without Performance mode when handling incoming requests
    // So we end up with an active span that is not sampled (neither positively nor negatively)
    if (hasSpansEnabled.hasSpansEnabled()) {
        dsc.sampled = String(spanUtils.spanIsSampled(rootSpan));
        dsc.sample_rand = // In OTEL we store the sample rand on the trace state because we cannot access scopes for NonRecordingSpans
        // The Sentry OTEL SpanSampler takes care of writing the sample rand on the root span
        traceState?.get('sentry.sample_rand') ?? // On all other platforms we can actually get the scopes from a root span (we use this as a fallback)
        utils.getCapturedScopesOnSpan(rootSpan).scope?.getPropagationContext().sampleRand.toString();
    }
    applyLocalSampleRateToDsc(dsc);
    client.emit('createDsc', dsc, rootSpan);
    return dsc;
}
/**
 * Convert a Span to a baggage header.
 */ function spanToBaggageHeader(span) {
    const dsc = getDynamicSamplingContextFromSpan(span);
    return baggage.dynamicSamplingContextToSentryBaggageHeader(dsc);
}
exports.freezeDscOnSpan = freezeDscOnSpan;
exports.getDynamicSamplingContextFromClient = getDynamicSamplingContextFromClient;
exports.getDynamicSamplingContextFromScope = getDynamicSamplingContextFromScope;
exports.getDynamicSamplingContextFromSpan = getDynamicSamplingContextFromSpan;
exports.spanToBaggageHeader = spanToBaggageHeader; //# sourceMappingURL=dynamicSamplingContext.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentryNonRecordingSpan.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * A Sentry Span that is non-recording, meaning it will not be sent to Sentry.
 */ class SentryNonRecordingSpan {
    constructor(spanContext = {}){
        this._traceId = spanContext.traceId || propagationContext.generateTraceId();
        this._spanId = spanContext.spanId || propagationContext.generateSpanId();
    }
    /** @inheritdoc */ spanContext() {
        return {
            spanId: this._spanId,
            traceId: this._traceId,
            traceFlags: spanUtils.TRACE_FLAG_NONE
        };
    }
    /** @inheritdoc */ end(_timestamp) {}
    /** @inheritdoc */ setAttribute(_key, _value) {
        return this;
    }
    /** @inheritdoc */ setAttributes(_values) {
        return this;
    }
    /** @inheritdoc */ setStatus(_status) {
        return this;
    }
    /** @inheritdoc */ updateName(_name) {
        return this;
    }
    /** @inheritdoc */ isRecording() {
        return false;
    }
    /** @inheritdoc */ addEvent(_name, _attributesOrStartTime, _startTime) {
        return this;
    }
    /** @inheritDoc */ addLink(_link) {
        return this;
    }
    /** @inheritDoc */ addLinks(_links) {
        return this;
    }
    /**
   * This should generally not be used,
   * but we need it for being compliant with the OTEL Span interface.
   *
   * @hidden
   * @internal
   */ recordException(_exception, _time) {
    // noop
    }
}
exports.SentryNonRecordingSpan = SentryNonRecordingSpan; //# sourceMappingURL=sentryNonRecordingSpan.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
/**
 * Recursively normalizes the given object.
 *
 * - Creates a copy to prevent original input mutation
 * - Skips non-enumerable properties
 * - When stringifying, calls `toJSON` if implemented
 * - Removes circular references
 * - Translates non-serializable values (`undefined`/`NaN`/functions) to serializable format
 * - Translates known global objects/classes to a string representations
 * - Takes care of `Error` object serialization
 * - Optionally limits depth of final output
 * - Optionally limits number of properties/elements included in any single object/array
 *
 * @param input The object to be normalized.
 * @param depth The max depth to which to normalize the object. (Anything deeper stringified whole.)
 * @param maxProperties The max number of elements or properties to be included in any single array or
 * object in the normalized output.
 * @returns A normalized version of the object, or `"**non-serializable**"` if any errors are thrown during normalization.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(input, depth = 100, maxProperties = +Infinity) {
    try {
        // since we're at the outermost level, we don't provide a key
        return visit('', input, depth, maxProperties);
    } catch (err) {
        return {
            ERROR: `**non-serializable** (${err})`
        };
    }
}
/** JSDoc */ function normalizeToSize(// eslint-disable-next-line @typescript-eslint/no-explicit-any
object, // Default Node.js REPL depth
depth = 3, // 100kB, as 200kB is max payload size, so half sounds reasonable
maxSize = 100 * 1024) {
    const normalized = normalize(object, depth);
    if (jsonSize(normalized) > maxSize) {
        return normalizeToSize(object, depth - 1, maxSize);
    }
    return normalized;
}
/**
 * Visits a node to perform normalization on it
 *
 * @param key The key corresponding to the given node
 * @param value The node to be visited
 * @param depth Optional number indicating the maximum recursion depth
 * @param maxProperties Optional maximum number of properties/elements included in any single object/array
 * @param memo Optional Memo class handling decycling
 */ function visit(key, value, depth = +Infinity, maxProperties = +Infinity, memo = memoBuilder()) {
    const [memoize, unmemoize] = memo;
    // Get the simple cases out of the way first
    if (value == null || // this matches null and undefined -> eqeq not eqeqeq
    [
        'boolean',
        'string'
    ].includes(typeof value) || typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    const stringified = stringifyValue(key, value);
    // Anything we could potentially dig into more (objects or arrays) will have come back as `"[object XXXX]"`.
    // Everything else will have already been serialized, so if we don't see that pattern, we're done.
    if (!stringified.startsWith('[object ')) {
        return stringified;
    }
    // From here on, we can assert that `value` is either an object or an array.
    // Do not normalize objects that we know have already been normalized. As a general rule, the
    // "__sentry_skip_normalization__" property should only be used sparingly and only should only be set on objects that
    // have already been normalized.
    if (value['__sentry_skip_normalization__']) {
        return value;
    }
    // We can set `__sentry_override_normalization_depth__` on an object to ensure that from there
    // We keep a certain amount of depth.
    // This should be used sparingly, e.g. we use it for the redux integration to ensure we get a certain amount of state.
    const remainingDepth = typeof value['__sentry_override_normalization_depth__'] === 'number' ? value['__sentry_override_normalization_depth__'] : depth;
    // We're also done if we've reached the max depth
    if (remainingDepth === 0) {
        // At this point we know `serialized` is a string of the form `"[object XXXX]"`. Clean it up so it's just `"[XXXX]"`.
        return stringified.replace('object ', '');
    }
    // If we've already visited this branch, bail out, as it's circular reference. If not, note that we're seeing it now.
    if (memoize(value)) {
        return '[Circular ~]';
    }
    // If the value has a `toJSON` method, we call it to extract more information
    const valueWithToJSON = value;
    if (valueWithToJSON && typeof valueWithToJSON.toJSON === 'function') {
        try {
            const jsonValue = valueWithToJSON.toJSON();
            // We need to normalize the return value of `.toJSON()` in case it has circular references
            return visit('', jsonValue, remainingDepth - 1, maxProperties, memo);
        } catch  {
        // pass (The built-in `toJSON` failed, but we can still try to do it ourselves)
        }
    }
    // At this point we know we either have an object or an array, we haven't seen it before, and we're going to recurse
    // because we haven't yet reached the max depth. Create an accumulator to hold the results of visiting each
    // property/entry, and keep track of the number of items we add to it.
    const normalized = Array.isArray(value) ? [] : {};
    let numAdded = 0;
    // Before we begin, convert`Error` and`Event` instances into plain objects, since some of each of their relevant
    // properties are non-enumerable and otherwise would get missed.
    const visitable = object.convertToPlainObject(value);
    for(const visitKey in visitable){
        // Avoid iterating over fields in the prototype if they've somehow been exposed to enumeration.
        if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
            continue;
        }
        if (numAdded >= maxProperties) {
            normalized[visitKey] = '[MaxProperties ~]';
            break;
        }
        // Recursively visit all the child nodes
        const visitValue = visitable[visitKey];
        normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
        numAdded++;
    }
    // Once we've visited all the branches, remove the parent from memo storage
    unmemoize(value);
    // Return accumulated values
    return normalized;
}
/* eslint-disable complexity */ /**
 * Stringify the given value. Handles various known special values and types.
 *
 * Not meant to be used on simple primitives which already have a string representation, as it will, for example, turn
 * the number 1231 into "[Object Number]", nor on `null`, as it will throw.
 *
 * @param value The value to stringify
 * @returns A stringified representation of the given value
 */ function stringifyValue(key, // this type is a tiny bit of a cheat, since this function does handle NaN (which is technically a number), but for
// our internal use, it'll do
value) {
    try {
        if (key === 'domain' && value && typeof value === 'object' && value._events) {
            return '[Domain]';
        }
        if (key === 'domainEmitter') {
            return '[DomainEmitter]';
        }
        // It's safe to use `global`, `window`, and `document` here in this manner, as we are asserting using `typeof` first
        // which won't throw if they are not present.
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && value === /*TURBOPACK member replacement*/ __turbopack_context__.g) {
            return '[Global]';
        }
        // eslint-disable-next-line no-restricted-globals
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // eslint-disable-next-line no-restricted-globals
        if (typeof document !== 'undefined' && value === document) {
            return '[Document]';
        }
        if (is.isVueViewModel(value)) {
            return '[VueViewModel]';
        }
        // React's SyntheticEvent thingy
        if (is.isSyntheticEvent(value)) {
            return '[SyntheticEvent]';
        }
        if (typeof value === 'number' && !Number.isFinite(value)) {
            return `[${value}]`;
        }
        if (typeof value === 'function') {
            return `[Function: ${stacktrace.getFunctionName(value)}]`;
        }
        if (typeof value === 'symbol') {
            return `[${String(value)}]`;
        }
        // stringified BigInts are indistinguishable from regular numbers, so we need to label them to avoid confusion
        if (typeof value === 'bigint') {
            return `[BigInt: ${String(value)}]`;
        }
        // Now that we've knocked out all the special cases and the primitives, all we have left are objects. Simply casting
        // them to strings means that instances of classes which haven't defined their `toStringTag` will just come out as
        // `"[object Object]"`. If we instead look at the constructor's name (which is the same as the name of the class),
        // we can make sure that only plain objects come out that way.
        const objName = getConstructorName(value);
        // Handle HTML Elements
        if (/^HTML(\w*)Element$/.test(objName)) {
            return `[HTMLElement: ${objName}]`;
        }
        return `[object ${objName}]`;
    } catch (err) {
        return `**non-serializable** (${err})`;
    }
}
/* eslint-enable complexity */ function getConstructorName(value) {
    const prototype = Object.getPrototypeOf(value);
    return prototype?.constructor ? prototype.constructor.name : 'null prototype';
}
/** Calculates bytes size of input string */ function utf8Length(value) {
    // eslint-disable-next-line no-bitwise
    return ~-encodeURI(value).split(/%..|./).length;
}
/** Calculates bytes size of input object */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonSize(value) {
    return utf8Length(JSON.stringify(value));
}
/**
 * Normalizes URLs in exceptions and stacktraces to a base path so Sentry can fingerprint
 * across platforms and working directory.
 *
 * @param url The URL to be normalized.
 * @param basePath The application base path.
 * @returns The normalized URL.
 */ function normalizeUrlToBase(url, basePath) {
    const escapedBase = basePath// Backslash to forward
    .replace(/\\/g, '/')// Escape RegExp special characters
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    let newUrl = url;
    try {
        newUrl = decodeURI(url);
    } catch  {
    // Sometime this breaks
    }
    return newUrl.replace(/\\/g, '/').replace(/webpack:\/?/g, '') // Remove intermediate base path
    // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor
    .replace(new RegExp(`(file://)?/*${escapedBase}/*`, 'ig'), 'app:///');
}
/**
 * Helper to decycle json objects
 */ function memoBuilder() {
    const inner = new WeakSet();
    function memoize(obj) {
        if (inner.has(obj)) {
            return true;
        }
        inner.add(obj);
        return false;
    }
    function unmemoize(obj) {
        inner.delete(obj);
    }
    return [
        memoize,
        unmemoize
    ];
}
exports.normalize = normalize;
exports.normalizeToSize = normalizeToSize;
exports.normalizeUrlToBase = normalizeUrlToBase; //# sourceMappingURL=normalize.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/**
 * Creates an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */ function createEnvelope(headers, items = []) {
    return [
        headers,
        items
    ];
}
/**
 * Add an item to an envelope.
 * Make sure to always explicitly provide the generic to this function
 * so that the envelope types resolve correctly.
 */ function addItemToEnvelope(envelope, newItem) {
    const [headers, items] = envelope;
    return [
        headers,
        [
            ...items,
            newItem
        ]
    ];
}
/**
 * Convenience function to loop through the items and item types of an envelope.
 * (This function was mostly created because working with envelope types is painful at the moment)
 *
 * If the callback returns true, the rest of the items will be skipped.
 */ function forEachEnvelopeItem(envelope, callback) {
    const envelopeItems = envelope[1];
    for (const envelopeItem of envelopeItems){
        const envelopeItemType = envelopeItem[0].type;
        const result = callback(envelopeItem, envelopeItemType);
        if (result) {
            return true;
        }
    }
    return false;
}
/**
 * Returns true if the envelope contains any of the given envelope item types
 */ function envelopeContainsItemType(envelope, types) {
    return forEachEnvelopeItem(envelope, (_, type)=>types.includes(type));
}
/**
 * Encode a string to UTF8 array.
 */ function encodeUTF8(input) {
    const carrier$1 = carrier.getSentryCarrier(worldwide.GLOBAL_OBJ);
    return carrier$1.encodePolyfill ? carrier$1.encodePolyfill(input) : new TextEncoder().encode(input);
}
/**
 * Decode a UTF8 array to string.
 */ function decodeUTF8(input) {
    const carrier$1 = carrier.getSentryCarrier(worldwide.GLOBAL_OBJ);
    return carrier$1.decodePolyfill ? carrier$1.decodePolyfill(input) : new TextDecoder().decode(input);
}
/**
 * Serializes an envelope.
 */ function serializeEnvelope(envelope) {
    const [envHeaders, items] = envelope;
    // Initially we construct our envelope as a string and only convert to binary chunks if we encounter binary data
    let parts = JSON.stringify(envHeaders);
    function append(next) {
        if (typeof parts === 'string') {
            parts = typeof next === 'string' ? parts + next : [
                encodeUTF8(parts),
                next
            ];
        } else {
            parts.push(typeof next === 'string' ? encodeUTF8(next) : next);
        }
    }
    for (const item of items){
        const [itemHeaders, payload] = item;
        append(`\n${JSON.stringify(itemHeaders)}\n`);
        if (typeof payload === 'string' || payload instanceof Uint8Array) {
            append(payload);
        } else {
            let stringifiedPayload;
            try {
                stringifiedPayload = JSON.stringify(payload);
            } catch  {
                // In case, despite all our efforts to keep `payload` circular-dependency-free, `JSON.stringify()` still
                // fails, we try again after normalizing it again with infinite normalization depth. This of course has a
                // performance impact but in this case a performance hit is better than throwing.
                stringifiedPayload = JSON.stringify(normalize.normalize(payload));
            }
            append(stringifiedPayload);
        }
    }
    return typeof parts === 'string' ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
    const totalLength = buffers.reduce((acc, buf)=>acc + buf.length, 0);
    const merged = new Uint8Array(totalLength);
    let offset = 0;
    for (const buffer of buffers){
        merged.set(buffer, offset);
        offset += buffer.length;
    }
    return merged;
}
/**
 * Parses an envelope
 */ function parseEnvelope(env) {
    let buffer = typeof env === 'string' ? encodeUTF8(env) : env;
    function readBinary(length) {
        const bin = buffer.subarray(0, length);
        // Replace the buffer with the remaining data excluding trailing newline
        buffer = buffer.subarray(length + 1);
        return bin;
    }
    function readJson() {
        let i = buffer.indexOf(0xa);
        // If we couldn't find a newline, we must have found the end of the buffer
        if (i < 0) {
            i = buffer.length;
        }
        return JSON.parse(decodeUTF8(readBinary(i)));
    }
    const envelopeHeader = readJson();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = [];
    while(buffer.length){
        const itemHeader = readJson();
        const binaryLength = typeof itemHeader.length === 'number' ? itemHeader.length : undefined;
        items.push([
            itemHeader,
            binaryLength ? readBinary(binaryLength) : readJson()
        ]);
    }
    return [
        envelopeHeader,
        items
    ];
}
/**
 * Creates envelope item for a single span
 */ function createSpanEnvelopeItem(spanJson) {
    const spanHeaders = {
        type: 'span'
    };
    return [
        spanHeaders,
        spanJson
    ];
}
/**
 * Creates attachment envelope items
 */ function createAttachmentEnvelopeItem(attachment) {
    const buffer = typeof attachment.data === 'string' ? encodeUTF8(attachment.data) : attachment.data;
    return [
        {
            type: 'attachment',
            length: buffer.length,
            filename: attachment.filename,
            content_type: attachment.contentType,
            attachment_type: attachment.attachmentType
        },
        buffer
    ];
}
const ITEM_TYPE_TO_DATA_CATEGORY_MAP = {
    session: 'session',
    sessions: 'session',
    attachment: 'attachment',
    transaction: 'transaction',
    event: 'error',
    client_report: 'internal',
    user_report: 'default',
    profile: 'profile',
    profile_chunk: 'profile',
    replay_event: 'replay',
    replay_recording: 'replay',
    check_in: 'monitor',
    feedback: 'feedback',
    span: 'span',
    raw_security: 'security',
    log: 'log_item'
};
/**
 * Maps the type of an envelope item to a data category.
 */ function envelopeItemTypeToDataCategory(type) {
    return ITEM_TYPE_TO_DATA_CATEGORY_MAP[type];
}
/** Extracts the minimal SDK info from the metadata or an events */ function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
    if (!metadataOrEvent?.sdk) {
        return;
    }
    const { name, version } = metadataOrEvent.sdk;
    return {
        name,
        version
    };
}
/**
 * Creates event envelope headers, based on event, sdk info and tunnel
 * Note: This function was extracted from the core package to make it available in Replay
 */ function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn$1) {
    const dynamicSamplingContext = event.sdkProcessingMetadata?.dynamicSamplingContext;
    return {
        event_id: event.event_id,
        sent_at: new Date().toISOString(),
        ...sdkInfo && {
            sdk: sdkInfo
        },
        ...!!tunnel && dsn$1 && {
            dsn: dsn.dsnToString(dsn$1)
        },
        ...dynamicSamplingContext && {
            trace: dynamicSamplingContext
        }
    };
}
exports.addItemToEnvelope = addItemToEnvelope;
exports.createAttachmentEnvelopeItem = createAttachmentEnvelopeItem;
exports.createEnvelope = createEnvelope;
exports.createEventEnvelopeHeaders = createEventEnvelopeHeaders;
exports.createSpanEnvelopeItem = createSpanEnvelopeItem;
exports.envelopeContainsItemType = envelopeContainsItemType;
exports.envelopeItemTypeToDataCategory = envelopeItemTypeToDataCategory;
exports.forEachEnvelopeItem = forEachEnvelopeItem;
exports.getSdkMetadataForEnvelopeHeader = getSdkMetadataForEnvelopeHeader;
exports.parseEnvelope = parseEnvelope;
exports.serializeEnvelope = serializeEnvelope; //# sourceMappingURL=envelope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/should-ignore-span.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
/**
 * Check if a span should be ignored based on the ignoreSpans configuration.
 */ function shouldIgnoreSpan(span, ignoreSpans) {
    if (!ignoreSpans?.length || !span.description) {
        return false;
    }
    for (const pattern of ignoreSpans){
        if (isStringOrRegExp(pattern)) {
            if (string.isMatchingPattern(span.description, pattern)) {
                return true;
            }
            continue;
        }
        if (!pattern.name && !pattern.op) {
            continue;
        }
        const nameMatches = pattern.name ? string.isMatchingPattern(span.description, pattern.name) : true;
        const opMatches = pattern.op ? span.op && string.isMatchingPattern(span.op, pattern.op) : true;
        // This check here is only correct because we can guarantee that we ran `isMatchingPattern`
        // for at least one of `nameMatches` and `opMatches`. So in contrary to how this looks,
        // not both op and name actually have to match. This is the most efficient way to check
        // for all combinations of name and op patterns.
        if (nameMatches && opMatches) {
            return true;
        }
    }
    return false;
}
/**
 * Takes a list of spans, and a span that was dropped, and re-parents the child spans of the dropped span to the parent of the dropped span, if possible.
 * This mutates the spans array in place!
 */ function reparentChildSpans(spans, dropSpan) {
    const droppedSpanParentId = dropSpan.parent_span_id;
    const droppedSpanId = dropSpan.span_id;
    // This should generally not happen, as we do not apply this on root spans
    // but to be safe, we just bail in this case
    if (!droppedSpanParentId) {
        return;
    }
    for (const span of spans){
        if (span.parent_span_id === droppedSpanId) {
            span.parent_span_id = droppedSpanParentId;
        }
    }
}
function isStringOrRegExp(value) {
    return typeof value === 'string' || value instanceof RegExp;
}
exports.reparentChildSpans = reparentChildSpans;
exports.shouldIgnoreSpan = shouldIgnoreSpan; //# sourceMappingURL=should-ignore-span.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/envelope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const shouldIgnoreSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/should-ignore-span.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * Apply SdkInfo (name, version, packages, integrations) to the corresponding event key.
 * Merge with existing data if any.
 *
 * @internal, exported only for testing
 **/ function _enhanceEventWithSdkInfo(event, newSdkInfo) {
    if (!newSdkInfo) {
        return event;
    }
    const eventSdkInfo = event.sdk || {};
    event.sdk = {
        ...eventSdkInfo,
        name: eventSdkInfo.name || newSdkInfo.name,
        version: eventSdkInfo.version || newSdkInfo.version,
        integrations: [
            ...event.sdk?.integrations || [],
            ...newSdkInfo.integrations || []
        ],
        packages: [
            ...event.sdk?.packages || [],
            ...newSdkInfo.packages || []
        ],
        settings: event.sdk?.settings || newSdkInfo.settings ? {
            ...event.sdk?.settings,
            ...newSdkInfo.settings
        } : undefined
    };
    return event;
}
/** Creates an envelope from a Session */ function createSessionEnvelope(session, dsn$1, metadata, tunnel) {
    const sdkInfo = envelope.getSdkMetadataForEnvelopeHeader(metadata);
    const envelopeHeaders = {
        sent_at: new Date().toISOString(),
        ...sdkInfo && {
            sdk: sdkInfo
        },
        ...!!tunnel && dsn$1 && {
            dsn: dsn.dsnToString(dsn$1)
        }
    };
    const envelopeItem = 'aggregates' in session ? [
        {
            type: 'sessions'
        },
        session
    ] : [
        {
            type: 'session'
        },
        session.toJSON()
    ];
    return envelope.createEnvelope(envelopeHeaders, [
        envelopeItem
    ]);
}
/**
 * Create an Envelope from an event.
 */ function createEventEnvelope(event, dsn, metadata, tunnel) {
    const sdkInfo = envelope.getSdkMetadataForEnvelopeHeader(metadata);
    /*
    Note: Due to TS, event.type may be `replay_event`, theoretically.
    In practice, we never call `createEventEnvelope` with `replay_event` type,
    and we'd have to adjust a looot of types to make this work properly.
    We want to avoid casting this around, as that could lead to bugs (e.g. when we add another type)
    So the safe choice is to really guard against the replay_event type here.
  */ const eventType = event.type && event.type !== 'replay_event' ? event.type : 'event';
    _enhanceEventWithSdkInfo(event, metadata?.sdk);
    const envelopeHeaders = envelope.createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
    // Prevent this data (which, if it exists, was used in earlier steps in the processing pipeline) from being sent to
    // sentry. (Note: Our use of this property comes and goes with whatever we might be debugging, whatever hacks we may
    // have temporarily added, etc. Even if we don't happen to be using it at some point in the future, let's not get rid
    // of this `delete`, lest we miss putting it back in the next time the property is in use.)
    delete event.sdkProcessingMetadata;
    const eventItem = [
        {
            type: eventType
        },
        event
    ];
    return envelope.createEnvelope(envelopeHeaders, [
        eventItem
    ]);
}
/**
 * Create envelope from Span item.
 *
 * Takes an optional client and runs spans through `beforeSendSpan` if available.
 */ function createSpanEnvelope(spans, client) {
    function dscHasRequiredProps(dsc) {
        return !!dsc.trace_id && !!dsc.public_key;
    }
    // For the moment we'll obtain the DSC from the first span in the array
    // This might need to be changed if we permit sending multiple spans from
    // different segments in one envelope
    const dsc = dynamicSamplingContext.getDynamicSamplingContextFromSpan(spans[0]);
    const dsn$1 = client?.getDsn();
    const tunnel = client?.getOptions().tunnel;
    const headers = {
        sent_at: new Date().toISOString(),
        ...dscHasRequiredProps(dsc) && {
            trace: dsc
        },
        ...!!tunnel && dsn$1 && {
            dsn: dsn.dsnToString(dsn$1)
        }
    };
    const { beforeSendSpan, ignoreSpans } = client?.getOptions() || {};
    const filteredSpans = ignoreSpans?.length ? spans.filter((span)=>!shouldIgnoreSpan.shouldIgnoreSpan(spanUtils.spanToJSON(span), ignoreSpans)) : spans;
    const droppedSpans = spans.length - filteredSpans.length;
    if (droppedSpans) {
        client?.recordDroppedEvent('before_send', 'span', droppedSpans);
    }
    const convertToSpanJSON = beforeSendSpan ? (span)=>{
        const spanJson = spanUtils.spanToJSON(span);
        const processedSpan = beforeSendSpan(spanJson);
        if (!processedSpan) {
            spanUtils.showSpanDropWarning();
            return spanJson;
        }
        return processedSpan;
    } : spanUtils.spanToJSON;
    const items = [];
    for (const span of filteredSpans){
        const spanJson = convertToSpanJSON(span);
        if (spanJson) {
            items.push(envelope.createSpanEnvelopeItem(spanJson));
        }
    }
    return envelope.createEnvelope(headers, items);
}
exports._enhanceEventWithSdkInfo = _enhanceEventWithSdkInfo;
exports.createEventEnvelope = createEventEnvelope;
exports.createSessionEnvelope = createSessionEnvelope;
exports.createSpanEnvelope = createSpanEnvelope; //# sourceMappingURL=envelope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/logSpans.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * Print a log message for a started span.
 */ function logSpanStart(span) {
    if (!debugBuild.DEBUG_BUILD) return;
    const { description = '< unknown name >', op = '< unknown op >', parent_span_id: parentSpanId } = spanUtils.spanToJSON(span);
    const { spanId } = span.spanContext();
    const sampled = spanUtils.spanIsSampled(span);
    const rootSpan = spanUtils.getRootSpan(span);
    const isRootSpan = rootSpan === span;
    const header = `[Tracing] Starting ${sampled ? 'sampled' : 'unsampled'} ${isRootSpan ? 'root ' : ''}span`;
    const infoParts = [
        `op: ${op}`,
        `name: ${description}`,
        `ID: ${spanId}`
    ];
    if (parentSpanId) {
        infoParts.push(`parent ID: ${parentSpanId}`);
    }
    if (!isRootSpan) {
        const { op, description } = spanUtils.spanToJSON(rootSpan);
        infoParts.push(`root ID: ${rootSpan.spanContext().spanId}`);
        if (op) {
            infoParts.push(`root op: ${op}`);
        }
        if (description) {
            infoParts.push(`root description: ${description}`);
        }
    }
    debugLogger.debug.log(`${header}
  ${infoParts.join('\n  ')}`);
}
/**
 * Print a log message for an ended span.
 */ function logSpanEnd(span) {
    if (!debugBuild.DEBUG_BUILD) return;
    const { description = '< unknown name >', op = '< unknown op >' } = spanUtils.spanToJSON(span);
    const { spanId } = span.spanContext();
    const rootSpan = spanUtils.getRootSpan(span);
    const isRootSpan = rootSpan === span;
    const msg = `[Tracing] Finishing "${op}" ${isRootSpan ? 'root ' : ''}span "${description}" with ID ${spanId}`;
    debugLogger.debug.log(msg);
}
exports.logSpanEnd = logSpanEnd;
exports.logSpanStart = logSpanStart; //# sourceMappingURL=logSpans.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/measurement.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * Adds a measurement to the active transaction on the current global scope. You can optionally pass in a different span
 * as the 4th parameter.
 */ function setMeasurement(name, value, unit, activeSpan = spanUtils.getActiveSpan()) {
    const rootSpan = activeSpan && spanUtils.getRootSpan(activeSpan);
    if (rootSpan) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Measurement] Setting measurement on root span: ${name} = ${value} ${unit}`);
        rootSpan.addEvent(name, {
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE]: value,
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT]: unit
        });
    }
}
/**
 * Convert timed events to measurements.
 */ function timedEventsToMeasurements(events) {
    if (!events || events.length === 0) {
        return undefined;
    }
    const measurements = {};
    events.forEach((event)=>{
        const attributes = event.attributes || {};
        const unit = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT];
        const value = attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE];
        if (typeof unit === 'string' && typeof value === 'number') {
            measurements[event.name] = {
                value,
                unit
            };
        }
    });
    return measurements;
}
exports.setMeasurement = setMeasurement;
exports.timedEventsToMeasurements = timedEventsToMeasurements; //# sourceMappingURL=measurement.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentrySpan.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/envelope.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const logSpans = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/logSpans.js [app-ssr] (ecmascript)");
const measurement = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/measurement.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)");
const MAX_SPAN_COUNT = 1000;
/**
 * Span contains all data about a span
 */ class SentrySpan {
    /** Epoch timestamp in seconds when the span started. */ /** Epoch timestamp in seconds when the span ended. */ /** Internal keeper of the status */ /** The timed events added to this span. */ /** if true, treat span as a standalone span (not part of a transaction) */ /**
   * You should never call the constructor manually, always use `Sentry.startSpan()`
   * or other span methods.
   * @internal
   * @hideconstructor
   * @hidden
   */ constructor(spanContext = {}){
        this._traceId = spanContext.traceId || propagationContext.generateTraceId();
        this._spanId = spanContext.spanId || propagationContext.generateSpanId();
        this._startTime = spanContext.startTimestamp || time.timestampInSeconds();
        this._links = spanContext.links;
        this._attributes = {};
        this.setAttributes({
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'manual',
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanContext.op,
            ...spanContext.attributes
        });
        this._name = spanContext.name;
        if (spanContext.parentSpanId) {
            this._parentSpanId = spanContext.parentSpanId;
        }
        // We want to include booleans as well here
        if ('sampled' in spanContext) {
            this._sampled = spanContext.sampled;
        }
        if (spanContext.endTimestamp) {
            this._endTime = spanContext.endTimestamp;
        }
        this._events = [];
        this._isStandaloneSpan = spanContext.isStandalone;
        // If the span is already ended, ensure we finalize the span immediately
        if (this._endTime) {
            this._onSpanEnded();
        }
    }
    /** @inheritDoc */ addLink(link) {
        if (this._links) {
            this._links.push(link);
        } else {
            this._links = [
                link
            ];
        }
        return this;
    }
    /** @inheritDoc */ addLinks(links) {
        if (this._links) {
            this._links.push(...links);
        } else {
            this._links = links;
        }
        return this;
    }
    /**
   * This should generally not be used,
   * but it is needed for being compliant with the OTEL Span interface.
   *
   * @hidden
   * @internal
   */ recordException(_exception, _time) {
    // noop
    }
    /** @inheritdoc */ spanContext() {
        const { _spanId: spanId, _traceId: traceId, _sampled: sampled } = this;
        return {
            spanId,
            traceId,
            traceFlags: sampled ? spanUtils.TRACE_FLAG_SAMPLED : spanUtils.TRACE_FLAG_NONE
        };
    }
    /** @inheritdoc */ setAttribute(key, value) {
        if (value === undefined) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete this._attributes[key];
        } else {
            this._attributes[key] = value;
        }
        return this;
    }
    /** @inheritdoc */ setAttributes(attributes) {
        Object.keys(attributes).forEach((key)=>this.setAttribute(key, attributes[key]));
        return this;
    }
    /**
   * This should generally not be used,
   * but we need it for browser tracing where we want to adjust the start time afterwards.
   * USE THIS WITH CAUTION!
   *
   * @hidden
   * @internal
   */ updateStartTime(timeInput) {
        this._startTime = spanUtils.spanTimeInputToSeconds(timeInput);
    }
    /**
   * @inheritDoc
   */ setStatus(value) {
        this._status = value;
        return this;
    }
    /**
   * @inheritDoc
   */ updateName(name) {
        this._name = name;
        this.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, 'custom');
        return this;
    }
    /** @inheritdoc */ end(endTimestamp) {
        // If already ended, skip
        if (this._endTime) {
            return;
        }
        this._endTime = spanUtils.spanTimeInputToSeconds(endTimestamp);
        logSpans.logSpanEnd(this);
        this._onSpanEnded();
    }
    /**
   * Get JSON representation of this span.
   *
   * @hidden
   * @internal This method is purely for internal purposes and should not be used outside
   * of SDK code. If you need to get a JSON representation of a span,
   * use `spanToJSON(span)` instead.
   */ getSpanJSON() {
        return {
            data: this._attributes,
            description: this._name,
            op: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP],
            parent_span_id: this._parentSpanId,
            span_id: this._spanId,
            start_timestamp: this._startTime,
            status: spanUtils.getStatusMessage(this._status),
            timestamp: this._endTime,
            trace_id: this._traceId,
            origin: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
            profile_id: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_PROFILE_ID],
            exclusive_time: this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
            measurements: measurement.timedEventsToMeasurements(this._events),
            is_segment: this._isStandaloneSpan && spanUtils.getRootSpan(this) === this || undefined,
            segment_id: this._isStandaloneSpan ? spanUtils.getRootSpan(this).spanContext().spanId : undefined,
            links: spanUtils.convertSpanLinksForEnvelope(this._links)
        };
    }
    /** @inheritdoc */ isRecording() {
        return !this._endTime && !!this._sampled;
    }
    /**
   * @inheritdoc
   */ addEvent(name, attributesOrStartTime, startTime) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Tracing] Adding an event to span:', name);
        const time$1 = isSpanTimeInput(attributesOrStartTime) ? attributesOrStartTime : startTime || time.timestampInSeconds();
        const attributes = isSpanTimeInput(attributesOrStartTime) ? {} : attributesOrStartTime || {};
        const event = {
            name,
            time: spanUtils.spanTimeInputToSeconds(time$1),
            attributes
        };
        this._events.push(event);
        return this;
    }
    /**
   * This method should generally not be used,
   * but for now we need a way to publicly check if the `_isStandaloneSpan` flag is set.
   * USE THIS WITH CAUTION!
   * @internal
   * @hidden
   * @experimental
   */ isStandaloneSpan() {
        return !!this._isStandaloneSpan;
    }
    /** Emit `spanEnd` when the span is ended. */ _onSpanEnded() {
        const client = currentScopes.getClient();
        if (client) {
            client.emit('spanEnd', this);
        }
        // A segment span is basically the root span of a local span tree.
        // So for now, this is either what we previously refer to as the root span,
        // or a standalone span.
        const isSegmentSpan = this._isStandaloneSpan || this === spanUtils.getRootSpan(this);
        if (!isSegmentSpan) {
            return;
        }
        // if this is a standalone span, we send it immediately
        if (this._isStandaloneSpan) {
            if (this._sampled) {
                sendSpanEnvelope(envelope.createSpanEnvelope([
                    this
                ], client));
            } else {
                debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Tracing] Discarding standalone span because its trace was not chosen to be sampled.');
                if (client) {
                    client.recordDroppedEvent('sample_rate', 'span');
                }
            }
            return;
        }
        const transactionEvent = this._convertSpanToTransaction();
        if (transactionEvent) {
            const scope = utils.getCapturedScopesOnSpan(this).scope || currentScopes.getCurrentScope();
            scope.captureEvent(transactionEvent);
        }
    }
    /**
   * Finish the transaction & prepare the event to send to Sentry.
   */ _convertSpanToTransaction() {
        // We can only convert finished spans
        if (!isFullFinishedSpan(spanUtils.spanToJSON(this))) {
            return undefined;
        }
        if (!this._name) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Transaction has no name, falling back to `<unlabeled transaction>`.');
            this._name = '<unlabeled transaction>';
        }
        const { scope: capturedSpanScope, isolationScope: capturedSpanIsolationScope } = utils.getCapturedScopesOnSpan(this);
        const normalizedRequest = capturedSpanScope?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
        if (this._sampled !== true) {
            return undefined;
        }
        // The transaction span itself as well as any potential standalone spans should be filtered out
        const finishedSpans = spanUtils.getSpanDescendants(this).filter((span)=>span !== this && !isStandaloneSpan(span));
        const spans = finishedSpans.map((span)=>spanUtils.spanToJSON(span)).filter(isFullFinishedSpan);
        const source = this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
        // remove internal root span attributes we don't need to send.
        /* eslint-disable @typescript-eslint/no-dynamic-delete */ delete this._attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
        spans.forEach((span)=>{
            delete span.data[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
        });
        // eslint-enabled-next-line @typescript-eslint/no-dynamic-delete
        const transaction = {
            contexts: {
                trace: spanUtils.spanToTransactionTraceContext(this)
            },
            spans: // spans.sort() mutates the array, but `spans` is already a copy so we can safely do this here
            // we do not use spans anymore after this point
            spans.length > MAX_SPAN_COUNT ? spans.sort((a, b)=>a.start_timestamp - b.start_timestamp).slice(0, MAX_SPAN_COUNT) : spans,
            start_timestamp: this._startTime,
            timestamp: this._endTime,
            transaction: this._name,
            type: 'transaction',
            sdkProcessingMetadata: {
                capturedSpanScope,
                capturedSpanIsolationScope,
                dynamicSamplingContext: dynamicSamplingContext.getDynamicSamplingContextFromSpan(this)
            },
            request: normalizedRequest,
            ...source && {
                transaction_info: {
                    source
                }
            }
        };
        const measurements = measurement.timedEventsToMeasurements(this._events);
        const hasMeasurements = measurements && Object.keys(measurements).length;
        if (hasMeasurements) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Measurements] Adding measurements to transaction event', JSON.stringify(measurements, undefined, 2));
            transaction.measurements = measurements;
        }
        return transaction;
    }
}
function isSpanTimeInput(value) {
    return value && typeof value === 'number' || value instanceof Date || Array.isArray(value);
}
// We want to filter out any incomplete SpanJSON objects
function isFullFinishedSpan(input) {
    return !!input.start_timestamp && !!input.timestamp && !!input.span_id && !!input.trace_id;
}
/** `SentrySpan`s can be sent as a standalone span rather than belonging to a transaction */ function isStandaloneSpan(span) {
    return span instanceof SentrySpan && span.isStandaloneSpan();
}
/**
 * Sends a `SpanEnvelope`.
 *
 * Note: If the envelope's spans are dropped, e.g. via `beforeSendSpan`,
 * the envelope will not be sent either.
 */ function sendSpanEnvelope(envelope) {
    const client = currentScopes.getClient();
    if (!client) {
        return;
    }
    const spanItems = envelope[1];
    if (!spanItems || spanItems.length === 0) {
        client.recordDroppedEvent('before_send', 'span');
        return;
    }
    // sendEnvelope should not throw
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    client.sendEnvelope(envelope);
}
exports.SentrySpan = SentrySpan; //# sourceMappingURL=sentrySpan.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/handleCallbackErrors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
/**
 * Wrap a callback function with error handling.
 * If an error is thrown, it will be passed to the `onError` callback and re-thrown.
 *
 * If the return value of the function is a promise, it will be handled with `maybeHandlePromiseRejection`.
 *
 * If an `onFinally` callback is provided, this will be called when the callback has finished
 * - so if it returns a promise, once the promise resolved/rejected,
 * else once the callback has finished executing.
 * The `onFinally` callback will _always_ be called, no matter if an error was thrown or not.
 */ function handleCallbackErrors(fn, onError, onFinally = ()=>{}) {
    let maybePromiseResult;
    try {
        maybePromiseResult = fn();
    } catch (e) {
        onError(e);
        onFinally();
        throw e;
    }
    return maybeHandlePromiseRejection(maybePromiseResult, onError, onFinally);
}
/**
 * Maybe handle a promise rejection.
 * This expects to be given a value that _may_ be a promise, or any other value.
 * If it is a promise, and it rejects, it will call the `onError` callback.
 * Other than this, it will generally return the given value as-is.
 */ function maybeHandlePromiseRejection(value, onError, onFinally) {
    if (is.isThenable(value)) {
        // @ts-expect-error - the isThenable check returns the "wrong" type here
        return value.then((res)=>{
            onFinally();
            return res;
        }, (e)=>{
            onError(e);
            onFinally();
            throw e;
        });
    }
    onFinally();
    return value;
}
exports.handleCallbackErrors = handleCallbackErrors; //# sourceMappingURL=handleCallbackErrors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sampling.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const parseSampleRate = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)");
/**
 * Makes a sampling decision for the given options.
 *
 * Called every time a root span is created. Only root spans which emerge with a `sampled` value of `true` will be
 * sent to Sentry.
 */ function sampleSpan(options, samplingContext, sampleRand) {
    // nothing to do if span recording is not enabled
    if (!hasSpansEnabled.hasSpansEnabled(options)) {
        return [
            false
        ];
    }
    let localSampleRateWasApplied = undefined;
    // we would have bailed already if neither `tracesSampler` nor `tracesSampleRate` were defined, so one of these should
    // work; prefer the hook if so
    let sampleRate;
    if (typeof options.tracesSampler === 'function') {
        sampleRate = options.tracesSampler({
            ...samplingContext,
            inheritOrSampleWith: (fallbackSampleRate)=>{
                // If we have an incoming parent sample rate, we'll just use that one.
                // The sampling decision will be inherited because of the sample_rand that was generated when the trace reached the incoming boundaries of the SDK.
                if (typeof samplingContext.parentSampleRate === 'number') {
                    return samplingContext.parentSampleRate;
                }
                // Fallback if parent sample rate is not on the incoming trace (e.g. if there is no baggage)
                // This is to provide backwards compatibility if there are incoming traces from older SDKs that don't send a parent sample rate or a sample rand. In these cases we just want to force either a sampling decision on the downstream traces via the sample rate.
                if (typeof samplingContext.parentSampled === 'boolean') {
                    return Number(samplingContext.parentSampled);
                }
                return fallbackSampleRate;
            }
        });
        localSampleRateWasApplied = true;
    } else if (samplingContext.parentSampled !== undefined) {
        sampleRate = samplingContext.parentSampled;
    } else if (typeof options.tracesSampleRate !== 'undefined') {
        sampleRate = options.tracesSampleRate;
        localSampleRateWasApplied = true;
    }
    // Since this is coming from the user (or from a function provided by the user), who knows what we might get.
    // (The only valid values are booleans or numbers between 0 and 1.)
    const parsedSampleRate = parseSampleRate.parseSampleRate(sampleRate);
    if (parsedSampleRate === undefined) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(sampleRate)} of type ${JSON.stringify(typeof sampleRate)}.`);
        return [
            false
        ];
    }
    // if the function returned 0 (or false), or if `tracesSampleRate` is 0, it's a sign the transaction should be dropped
    if (!parsedSampleRate) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Tracing] Discarding transaction because ${typeof options.tracesSampler === 'function' ? 'tracesSampler returned 0 or false' : 'a negative sampling decision was inherited or tracesSampleRate is set to 0'}`);
        return [
            false,
            parsedSampleRate,
            localSampleRateWasApplied
        ];
    }
    // We always compare the sample rand for the current execution context against the chosen sample rate.
    // Read more: https://develop.sentry.dev/sdk/telemetry/traces/#propagated-random-value
    const shouldSample = sampleRand < parsedSampleRate;
    // if we're not going to keep it, we're done
    if (!shouldSample) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(sampleRate)})`);
    }
    return [
        shouldSample,
        parsedSampleRate,
        localSampleRateWasApplied
    ];
}
exports.sampleSpan = sampleSpan; //# sourceMappingURL=sampling.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const handleCallbackErrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/handleCallbackErrors.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const parseSampleRate = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const spanOnScope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const tracing = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/tracing.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const logSpans = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/logSpans.js [app-ssr] (ecmascript)");
const sampling = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sampling.js [app-ssr] (ecmascript)");
const sentryNonRecordingSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentryNonRecordingSpan.js [app-ssr] (ecmascript)");
const sentrySpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentrySpan.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)");
/* eslint-disable max-lines */ const SUPPRESS_TRACING_KEY = '__SENTRY_SUPPRESS_TRACING__';
/**
 * Wraps a function with a transaction/span and finishes the span after the function is done.
 * The created span is the active span and will be used as parent by other spans created inside the function
 * and can be accessed via `Sentry.getActiveSpan()`, as long as the function is executed while the scope is active.
 *
 * If you want to create a span that is not set as active, use {@link startInactiveSpan}.
 *
 * You'll always get a span passed to the callback,
 * it may just be a non-recording span if the span is not sampled or if tracing is disabled.
 */ function startSpan(options, callback) {
    const acs = getAcs();
    if (acs.startSpan) {
        return acs.startSpan(options, callback);
    }
    const spanArguments = parseSentrySpanArguments(options);
    const { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options;
    // We still need to fork a potentially passed scope, as we set the active span on it
    // and we need to ensure that it is cleaned up properly once the span ends.
    const customForkedScope = customScope?.clone();
    return currentScopes.withScope(customForkedScope, ()=>{
        // If `options.parentSpan` is defined, we want to wrap the callback in `withActiveSpan`
        const wrapper = getActiveSpanWrapper(customParentSpan);
        return wrapper(()=>{
            const scope = currentScopes.getCurrentScope();
            const parentSpan = getParentSpan(scope, customParentSpan);
            const shouldSkipSpan = options.onlyIfParent && !parentSpan;
            const activeSpan = shouldSkipSpan ? new sentryNonRecordingSpan.SentryNonRecordingSpan() : createChildOrRootSpan({
                parentSpan,
                spanArguments,
                forceTransaction,
                scope
            });
            spanOnScope._setSpanForScope(scope, activeSpan);
            return handleCallbackErrors.handleCallbackErrors(()=>callback(activeSpan), ()=>{
                // Only update the span status if it hasn't been changed yet, and the span is not yet finished
                const { status } = spanUtils.spanToJSON(activeSpan);
                if (activeSpan.isRecording() && (!status || status === 'ok')) {
                    activeSpan.setStatus({
                        code: spanstatus.SPAN_STATUS_ERROR,
                        message: 'internal_error'
                    });
                }
            }, ()=>{
                activeSpan.end();
            });
        });
    });
}
/**
 * Similar to `Sentry.startSpan`. Wraps a function with a transaction/span, but does not finish the span
 * after the function is done automatically. Use `span.end()` to end the span.
 *
 * The created span is the active span and will be used as parent by other spans created inside the function
 * and can be accessed via `Sentry.getActiveSpan()`, as long as the function is executed while the scope is active.
 *
 * You'll always get a span passed to the callback,
 * it may just be a non-recording span if the span is not sampled or if tracing is disabled.
 */ function startSpanManual(options, callback) {
    const acs = getAcs();
    if (acs.startSpanManual) {
        return acs.startSpanManual(options, callback);
    }
    const spanArguments = parseSentrySpanArguments(options);
    const { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options;
    const customForkedScope = customScope?.clone();
    return currentScopes.withScope(customForkedScope, ()=>{
        // If `options.parentSpan` is defined, we want to wrap the callback in `withActiveSpan`
        const wrapper = getActiveSpanWrapper(customParentSpan);
        return wrapper(()=>{
            const scope = currentScopes.getCurrentScope();
            const parentSpan = getParentSpan(scope, customParentSpan);
            const shouldSkipSpan = options.onlyIfParent && !parentSpan;
            const activeSpan = shouldSkipSpan ? new sentryNonRecordingSpan.SentryNonRecordingSpan() : createChildOrRootSpan({
                parentSpan,
                spanArguments,
                forceTransaction,
                scope
            });
            spanOnScope._setSpanForScope(scope, activeSpan);
            return handleCallbackErrors.handleCallbackErrors(// We pass the `finish` function to the callback, so the user can finish the span manually
            // this is mainly here for historic purposes because previously, we instructed users to call
            // `finish` instead of `span.end()` to also clean up the scope. Nowadays, calling `span.end()`
            // or `finish` has the same effect and we simply leave it here to avoid breaking user code.
            ()=>callback(activeSpan, ()=>activeSpan.end()), ()=>{
                // Only update the span status if it hasn't been changed yet, and the span is not yet finished
                const { status } = spanUtils.spanToJSON(activeSpan);
                if (activeSpan.isRecording() && (!status || status === 'ok')) {
                    activeSpan.setStatus({
                        code: spanstatus.SPAN_STATUS_ERROR,
                        message: 'internal_error'
                    });
                }
            });
        });
    });
}
/**
 * Creates a span. This span is not set as active, so will not get automatic instrumentation spans
 * as children or be able to be accessed via `Sentry.getActiveSpan()`.
 *
 * If you want to create a span that is set as active, use {@link startSpan}.
 *
 * This function will always return a span,
 * it may just be a non-recording span if the span is not sampled or if tracing is disabled.
 */ function startInactiveSpan(options) {
    const acs = getAcs();
    if (acs.startInactiveSpan) {
        return acs.startInactiveSpan(options);
    }
    const spanArguments = parseSentrySpanArguments(options);
    const { forceTransaction, parentSpan: customParentSpan } = options;
    // If `options.scope` is defined, we use this as as a wrapper,
    // If `options.parentSpan` is defined, we want to wrap the callback in `withActiveSpan`
    const wrapper = options.scope ? (callback)=>currentScopes.withScope(options.scope, callback) : customParentSpan !== undefined ? (callback)=>withActiveSpan(customParentSpan, callback) : (callback)=>callback();
    return wrapper(()=>{
        const scope = currentScopes.getCurrentScope();
        const parentSpan = getParentSpan(scope, customParentSpan);
        const shouldSkipSpan = options.onlyIfParent && !parentSpan;
        if (shouldSkipSpan) {
            return new sentryNonRecordingSpan.SentryNonRecordingSpan();
        }
        return createChildOrRootSpan({
            parentSpan,
            spanArguments,
            forceTransaction,
            scope
        });
    });
}
/**
 * Continue a trace from `sentry-trace` and `baggage` values.
 * These values can be obtained from incoming request headers, or in the browser from `<meta name="sentry-trace">`
 * and `<meta name="baggage">` HTML tags.
 *
 * Spans started with `startSpan`, `startSpanManual` and `startInactiveSpan`, within the callback will automatically
 * be attached to the incoming trace.
 */ const continueTrace = (options, callback)=>{
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    if (acs.continueTrace) {
        return acs.continueTrace(options, callback);
    }
    const { sentryTrace, baggage: baggage$1 } = options;
    const client = currentScopes.getClient();
    const incomingDsc = baggage.baggageHeaderToDynamicSamplingContext(baggage$1);
    if (client && !tracing.shouldContinueTrace(client, incomingDsc?.org_id)) {
        return startNewTrace(callback);
    }
    return currentScopes.withScope((scope)=>{
        const propagationContext = tracing.propagationContextFromHeaders(sentryTrace, baggage$1);
        scope.setPropagationContext(propagationContext);
        return callback();
    });
};
/**
 * Forks the current scope and sets the provided span as active span in the context of the provided callback. Can be
 * passed `null` to start an entirely new span tree.
 *
 * @param span Spans started in the context of the provided callback will be children of this span. If `null` is passed,
 * spans started within the callback will not be attached to a parent span.
 * @param callback Execution context in which the provided span will be active. Is passed the newly forked scope.
 * @returns the value returned from the provided callback function.
 */ function withActiveSpan(span, callback) {
    const acs = getAcs();
    if (acs.withActiveSpan) {
        return acs.withActiveSpan(span, callback);
    }
    return currentScopes.withScope((scope)=>{
        spanOnScope._setSpanForScope(scope, span || undefined);
        return callback(scope);
    });
}
/** Suppress tracing in the given callback, ensuring no spans are generated inside of it. */ function suppressTracing(callback) {
    const acs = getAcs();
    if (acs.suppressTracing) {
        return acs.suppressTracing(callback);
    }
    return currentScopes.withScope((scope)=>{
        // Note: We do not wait for the callback to finish before we reset the metadata
        // the reason for this is that otherwise, in the browser this can lead to very weird behavior
        // as there is only a single top scope, if the callback takes longer to finish,
        // other, unrelated spans may also be suppressed, which we do not want
        // so instead, we only suppress tracing synchronoysly in the browser
        scope.setSDKProcessingMetadata({
            [SUPPRESS_TRACING_KEY]: true
        });
        const res = callback();
        scope.setSDKProcessingMetadata({
            [SUPPRESS_TRACING_KEY]: undefined
        });
        return res;
    });
}
/**
 * Starts a new trace for the duration of the provided callback. Spans started within the
 * callback will be part of the new trace instead of a potentially previously started trace.
 *
 * Important: Only use this function if you want to override the default trace lifetime and
 * propagation mechanism of the SDK for the duration and scope of the provided callback.
 * The newly created trace will also be the root of a new distributed trace, for example if
 * you make http requests within the callback.
 * This function might be useful if the operation you want to instrument should not be part
 * of a potentially ongoing trace.
 *
 * Default behavior:
 * - Server-side: A new trace is started for each incoming request.
 * - Browser: A new trace is started for each page our route. Navigating to a new route
 *            or page will automatically create a new trace.
 */ function startNewTrace(callback) {
    return currentScopes.withScope((scope)=>{
        scope.setPropagationContext({
            traceId: propagationContext.generateTraceId(),
            sampleRand: Math.random()
        });
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Starting a new trace with id ${scope.getPropagationContext().traceId}`);
        return withActiveSpan(null, callback);
    });
}
function createChildOrRootSpan({ parentSpan, spanArguments, forceTransaction, scope }) {
    if (!hasSpansEnabled.hasSpansEnabled()) {
        const span = new sentryNonRecordingSpan.SentryNonRecordingSpan();
        // If this is a root span, we ensure to freeze a DSC
        // So we can have at least partial data here
        if (forceTransaction || !parentSpan) {
            const dsc = {
                sampled: 'false',
                sample_rate: '0',
                transaction: spanArguments.name,
                ...dynamicSamplingContext.getDynamicSamplingContextFromSpan(span)
            };
            dynamicSamplingContext.freezeDscOnSpan(span, dsc);
        }
        return span;
    }
    const isolationScope = currentScopes.getIsolationScope();
    let span;
    if (parentSpan && !forceTransaction) {
        span = _startChildSpan(parentSpan, scope, spanArguments);
        spanUtils.addChildSpanToSpan(parentSpan, span);
    } else if (parentSpan) {
        // If we forced a transaction but have a parent span, make sure to continue from the parent span, not the scope
        const dsc = dynamicSamplingContext.getDynamicSamplingContextFromSpan(parentSpan);
        const { traceId, spanId: parentSpanId } = parentSpan.spanContext();
        const parentSampled = spanUtils.spanIsSampled(parentSpan);
        span = _startRootSpan({
            traceId,
            parentSpanId,
            ...spanArguments
        }, scope, parentSampled);
        dynamicSamplingContext.freezeDscOnSpan(span, dsc);
    } else {
        const { traceId, dsc, parentSpanId, sampled: parentSampled } = {
            ...isolationScope.getPropagationContext(),
            ...scope.getPropagationContext()
        };
        span = _startRootSpan({
            traceId,
            parentSpanId,
            ...spanArguments
        }, scope, parentSampled);
        if (dsc) {
            dynamicSamplingContext.freezeDscOnSpan(span, dsc);
        }
    }
    logSpans.logSpanStart(span);
    utils.setCapturedScopesOnSpan(span, scope, isolationScope);
    return span;
}
/**
 * This converts StartSpanOptions to SentrySpanArguments.
 * For the most part (for now) we accept the same options,
 * but some of them need to be transformed.
 */ function parseSentrySpanArguments(options) {
    const exp = options.experimental || {};
    const initialCtx = {
        isStandalone: exp.standalone,
        ...options
    };
    if (options.startTime) {
        const ctx = {
            ...initialCtx
        };
        ctx.startTimestamp = spanUtils.spanTimeInputToSeconds(options.startTime);
        delete ctx.startTime;
        return ctx;
    }
    return initialCtx;
}
function getAcs() {
    const carrier$1 = carrier.getMainCarrier();
    return index.getAsyncContextStrategy(carrier$1);
}
function _startRootSpan(spanArguments, scope, parentSampled) {
    const client = currentScopes.getClient();
    const options = client?.getOptions() || {};
    const { name = '' } = spanArguments;
    const mutableSpanSamplingData = {
        spanAttributes: {
            ...spanArguments.attributes
        },
        spanName: name,
        parentSampled
    };
    // we don't care about the decision for the moment; this is just a placeholder
    client?.emit('beforeSampling', mutableSpanSamplingData, {
        decision: false
    });
    // If hook consumers override the parentSampled flag, we will use that value instead of the actual one
    const finalParentSampled = mutableSpanSamplingData.parentSampled ?? parentSampled;
    const finalAttributes = mutableSpanSamplingData.spanAttributes;
    const currentPropagationContext = scope.getPropagationContext();
    const [sampled, sampleRate, localSampleRateWasApplied] = scope.getScopeData().sdkProcessingMetadata[SUPPRESS_TRACING_KEY] ? [
        false
    ] : sampling.sampleSpan(options, {
        name,
        parentSampled: finalParentSampled,
        attributes: finalAttributes,
        parentSampleRate: parseSampleRate.parseSampleRate(currentPropagationContext.dsc?.sample_rate)
    }, currentPropagationContext.sampleRand);
    const rootSpan = new sentrySpan.SentrySpan({
        ...spanArguments,
        attributes: {
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'custom',
            [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: sampleRate !== undefined && localSampleRateWasApplied ? sampleRate : undefined,
            ...finalAttributes
        },
        sampled
    });
    if (!sampled && client) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Tracing] Discarding root span because its trace was not chosen to be sampled.');
        client.recordDroppedEvent('sample_rate', 'transaction');
    }
    if (client) {
        client.emit('spanStart', rootSpan);
    }
    return rootSpan;
}
/**
 * Creates a new `Span` while setting the current `Span.id` as `parentSpanId`.
 * This inherits the sampling decision from the parent span.
 */ function _startChildSpan(parentSpan, scope, spanArguments) {
    const { spanId, traceId } = parentSpan.spanContext();
    const sampled = scope.getScopeData().sdkProcessingMetadata[SUPPRESS_TRACING_KEY] ? false : spanUtils.spanIsSampled(parentSpan);
    const childSpan = sampled ? new sentrySpan.SentrySpan({
        ...spanArguments,
        parentSpanId: spanId,
        traceId,
        sampled
    }) : new sentryNonRecordingSpan.SentryNonRecordingSpan({
        traceId
    });
    spanUtils.addChildSpanToSpan(parentSpan, childSpan);
    const client = currentScopes.getClient();
    if (client) {
        client.emit('spanStart', childSpan);
        // If it has an endTimestamp, it's already ended
        if (spanArguments.endTimestamp) {
            client.emit('spanEnd', childSpan);
        }
    }
    return childSpan;
}
function getParentSpan(scope, customParentSpan) {
    // always use the passed in span directly
    if (customParentSpan) {
        return customParentSpan;
    }
    // This is different from `undefined` as it means the user explicitly wants no parent span
    if (customParentSpan === null) {
        return undefined;
    }
    const span = spanOnScope._getSpanForScope(scope);
    if (!span) {
        return undefined;
    }
    const client = currentScopes.getClient();
    const options = client ? client.getOptions() : {};
    if (options.parentSpanIsAlwaysRootSpan) {
        return spanUtils.getRootSpan(span);
    }
    return span;
}
function getActiveSpanWrapper(parentSpan) {
    return parentSpan !== undefined ? (callback)=>{
        return withActiveSpan(parentSpan, callback);
    } : (callback)=>callback();
}
exports.continueTrace = continueTrace;
exports.startInactiveSpan = startInactiveSpan;
exports.startNewTrace = startNewTrace;
exports.startSpan = startSpan;
exports.startSpanManual = startSpanManual;
exports.suppressTracing = suppressTracing;
exports.withActiveSpan = withActiveSpan; //# sourceMappingURL=trace.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/idleSpan.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const spanOnScope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const sentryNonRecordingSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentryNonRecordingSpan.js [app-ssr] (ecmascript)");
const sentrySpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentrySpan.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const TRACING_DEFAULTS = {
    idleTimeout: 1000,
    finalTimeout: 30000,
    childSpanTimeout: 15000
};
const FINISH_REASON_HEARTBEAT_FAILED = 'heartbeatFailed';
const FINISH_REASON_IDLE_TIMEOUT = 'idleTimeout';
const FINISH_REASON_FINAL_TIMEOUT = 'finalTimeout';
const FINISH_REASON_EXTERNAL_FINISH = 'externalFinish';
/**
 * An idle span is a span that automatically finishes. It does this by tracking child spans as activities.
 * An idle span is always the active span.
 */ function startIdleSpan(startSpanOptions, options = {}) {
    // Activities store a list of active spans
    const activities = new Map();
    // We should not use heartbeat if we finished a span
    let _finished = false;
    // Timer that tracks idleTimeout
    let _idleTimeoutID;
    // The reason why the span was finished
    let _finishReason = FINISH_REASON_EXTERNAL_FINISH;
    let _autoFinishAllowed = !options.disableAutoFinish;
    const _cleanupHooks = [];
    const { idleTimeout = TRACING_DEFAULTS.idleTimeout, finalTimeout = TRACING_DEFAULTS.finalTimeout, childSpanTimeout = TRACING_DEFAULTS.childSpanTimeout, beforeSpanEnd } = options;
    const client = currentScopes.getClient();
    if (!client || !hasSpansEnabled.hasSpansEnabled()) {
        const span = new sentryNonRecordingSpan.SentryNonRecordingSpan();
        const dsc = {
            sample_rate: '0',
            sampled: 'false',
            ...dynamicSamplingContext.getDynamicSamplingContextFromSpan(span)
        };
        dynamicSamplingContext.freezeDscOnSpan(span, dsc);
        return span;
    }
    const scope = currentScopes.getCurrentScope();
    const previousActiveSpan = spanUtils.getActiveSpan();
    const span = _startIdleSpan(startSpanOptions);
    // We patch span.end to ensure we can run some things before the span is ended
    // eslint-disable-next-line @typescript-eslint/unbound-method
    span.end = new Proxy(span.end, {
        apply (target, thisArg, args) {
            if (beforeSpanEnd) {
                beforeSpanEnd(span);
            }
            // If the span is non-recording, nothing more to do here...
            // This is the case if tracing is enabled but this specific span was not sampled
            if (thisArg instanceof sentryNonRecordingSpan.SentryNonRecordingSpan) {
                return;
            }
            // Just ensuring that this keeps working, even if we ever have more arguments here
            const [definedEndTimestamp, ...rest] = args;
            const timestamp = definedEndTimestamp || time.timestampInSeconds();
            const spanEndTimestamp = spanUtils.spanTimeInputToSeconds(timestamp);
            // Ensure we end with the last span timestamp, if possible
            const spans = spanUtils.getSpanDescendants(span).filter((child)=>child !== span);
            // If we have no spans, we just end, nothing else to do here
            if (!spans.length) {
                onIdleSpanEnded(spanEndTimestamp);
                return Reflect.apply(target, thisArg, [
                    spanEndTimestamp,
                    ...rest
                ]);
            }
            const childEndTimestamps = spans.map((span)=>spanUtils.spanToJSON(span).timestamp).filter((timestamp)=>!!timestamp);
            const latestSpanEndTimestamp = childEndTimestamps.length ? Math.max(...childEndTimestamps) : undefined;
            // In reality this should always exist here, but type-wise it may be undefined...
            const spanStartTimestamp = spanUtils.spanToJSON(span).start_timestamp;
            // The final endTimestamp should:
            // * Never be before the span start timestamp
            // * Be the latestSpanEndTimestamp, if there is one, and it is smaller than the passed span end timestamp
            // * Otherwise be the passed end timestamp
            // Final timestamp can never be after finalTimeout
            const endTimestamp = Math.min(spanStartTimestamp ? spanStartTimestamp + finalTimeout / 1000 : Infinity, Math.max(spanStartTimestamp || -Infinity, Math.min(spanEndTimestamp, latestSpanEndTimestamp || Infinity)));
            onIdleSpanEnded(endTimestamp);
            return Reflect.apply(target, thisArg, [
                endTimestamp,
                ...rest
            ]);
        }
    });
    /**
   * Cancels the existing idle timeout, if there is one.
   */ function _cancelIdleTimeout() {
        if (_idleTimeoutID) {
            clearTimeout(_idleTimeoutID);
            _idleTimeoutID = undefined;
        }
    }
    /**
   * Restarts idle timeout, if there is no running idle timeout it will start one.
   */ function _restartIdleTimeout(endTimestamp) {
        _cancelIdleTimeout();
        _idleTimeoutID = setTimeout(()=>{
            if (!_finished && activities.size === 0 && _autoFinishAllowed) {
                _finishReason = FINISH_REASON_IDLE_TIMEOUT;
                span.end(endTimestamp);
            }
        }, idleTimeout);
    }
    /**
   * Restarts child span timeout, if there is none running it will start one.
   */ function _restartChildSpanTimeout(endTimestamp) {
        _idleTimeoutID = setTimeout(()=>{
            if (!_finished && _autoFinishAllowed) {
                _finishReason = FINISH_REASON_HEARTBEAT_FAILED;
                span.end(endTimestamp);
            }
        }, childSpanTimeout);
    }
    /**
   * Start tracking a specific activity.
   * @param spanId The span id that represents the activity
   */ function _pushActivity(spanId) {
        _cancelIdleTimeout();
        activities.set(spanId, true);
        const endTimestamp = time.timestampInSeconds();
        // We need to add the timeout here to have the real endtimestamp of the idle span
        // Remember timestampInSeconds is in seconds, timeout is in ms
        _restartChildSpanTimeout(endTimestamp + childSpanTimeout / 1000);
    }
    /**
   * Remove an activity from usage
   * @param spanId The span id that represents the activity
   */ function _popActivity(spanId) {
        if (activities.has(spanId)) {
            activities.delete(spanId);
        }
        if (activities.size === 0) {
            const endTimestamp = time.timestampInSeconds();
            // We need to add the timeout here to have the real endtimestamp of the idle span
            // Remember timestampInSeconds is in seconds, timeout is in ms
            _restartIdleTimeout(endTimestamp + idleTimeout / 1000);
        }
    }
    function onIdleSpanEnded(endTimestamp) {
        _finished = true;
        activities.clear();
        _cleanupHooks.forEach((cleanup)=>cleanup());
        spanOnScope._setSpanForScope(scope, previousActiveSpan);
        const spanJSON = spanUtils.spanToJSON(span);
        const { start_timestamp: startTimestamp } = spanJSON;
        // This should never happen, but to make TS happy...
        if (!startTimestamp) {
            return;
        }
        const attributes = spanJSON.data;
        if (!attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON]) {
            span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON, _finishReason);
        }
        debugLogger.debug.log(`[Tracing] Idle span "${spanJSON.op}" finished`);
        const childSpans = spanUtils.getSpanDescendants(span).filter((child)=>child !== span);
        let discardedSpans = 0;
        childSpans.forEach((childSpan)=>{
            // We cancel all pending spans with status "cancelled" to indicate the idle span was finished early
            if (childSpan.isRecording()) {
                childSpan.setStatus({
                    code: spanstatus.SPAN_STATUS_ERROR,
                    message: 'cancelled'
                });
                childSpan.end(endTimestamp);
                debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Tracing] Cancelling span since span ended early', JSON.stringify(childSpan, undefined, 2));
            }
            const childSpanJSON = spanUtils.spanToJSON(childSpan);
            const { timestamp: childEndTimestamp = 0, start_timestamp: childStartTimestamp = 0 } = childSpanJSON;
            const spanStartedBeforeIdleSpanEnd = childStartTimestamp <= endTimestamp;
            // Add a delta with idle timeout so that we prevent false positives
            const timeoutWithMarginOfError = (finalTimeout + idleTimeout) / 1000;
            const spanEndedBeforeFinalTimeout = childEndTimestamp - childStartTimestamp <= timeoutWithMarginOfError;
            if (debugBuild.DEBUG_BUILD) {
                const stringifiedSpan = JSON.stringify(childSpan, undefined, 2);
                if (!spanStartedBeforeIdleSpanEnd) {
                    debugLogger.debug.log('[Tracing] Discarding span since it happened after idle span was finished', stringifiedSpan);
                } else if (!spanEndedBeforeFinalTimeout) {
                    debugLogger.debug.log('[Tracing] Discarding span since it finished after idle span final timeout', stringifiedSpan);
                }
            }
            if (!spanEndedBeforeFinalTimeout || !spanStartedBeforeIdleSpanEnd) {
                spanUtils.removeChildSpanFromSpan(span, childSpan);
                discardedSpans++;
            }
        });
        if (discardedSpans > 0) {
            span.setAttribute('sentry.idle_span_discarded_spans', discardedSpans);
        }
    }
    _cleanupHooks.push(client.on('spanStart', (startedSpan)=>{
        // If we already finished the idle span,
        // or if this is the idle span itself being started,
        // or if the started span has already been closed,
        // we don't care about it for activity
        if (_finished || startedSpan === span || !!spanUtils.spanToJSON(startedSpan).timestamp || startedSpan instanceof sentrySpan.SentrySpan && startedSpan.isStandaloneSpan()) {
            return;
        }
        const allSpans = spanUtils.getSpanDescendants(span);
        // If the span that was just started is a child of the idle span, we should track it
        if (allSpans.includes(startedSpan)) {
            _pushActivity(startedSpan.spanContext().spanId);
        }
    }));
    _cleanupHooks.push(client.on('spanEnd', (endedSpan)=>{
        if (_finished) {
            return;
        }
        _popActivity(endedSpan.spanContext().spanId);
    }));
    _cleanupHooks.push(client.on('idleSpanEnableAutoFinish', (spanToAllowAutoFinish)=>{
        if (spanToAllowAutoFinish === span) {
            _autoFinishAllowed = true;
            _restartIdleTimeout();
            if (activities.size) {
                _restartChildSpanTimeout();
            }
        }
    }));
    // We only start the initial idle timeout if we are not delaying the auto finish
    if (!options.disableAutoFinish) {
        _restartIdleTimeout();
    }
    setTimeout(()=>{
        if (!_finished) {
            span.setStatus({
                code: spanstatus.SPAN_STATUS_ERROR,
                message: 'deadline_exceeded'
            });
            _finishReason = FINISH_REASON_FINAL_TIMEOUT;
            span.end();
        }
    }, finalTimeout);
    return span;
}
function _startIdleSpan(options) {
    const span = trace.startInactiveSpan(options);
    spanOnScope._setSpanForScope(currentScopes.getCurrentScope(), span);
    debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Tracing] Started span is an idle span');
    return span;
}
exports.TRACING_DEFAULTS = TRACING_DEFAULTS;
exports.startIdleSpan = startIdleSpan; //# sourceMappingURL=idleSpan.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
/* eslint-disable @typescript-eslint/no-explicit-any */ /** SyncPromise internal states */ const STATE_PENDING = 0;
const STATE_RESOLVED = 1;
const STATE_REJECTED = 2;
/**
 * Creates a resolved sync promise.
 *
 * @param value the value to resolve the promise with
 * @returns the resolved sync promise
 */ function resolvedSyncPromise(value) {
    return new SyncPromise((resolve)=>{
        resolve(value);
    });
}
/**
 * Creates a rejected sync promise.
 *
 * @param value the value to reject the promise with
 * @returns the rejected sync promise
 */ function rejectedSyncPromise(reason) {
    return new SyncPromise((_, reject)=>{
        reject(reason);
    });
}
/**
 * Thenable class that behaves like a Promise and follows it's interface
 * but is not async internally
 */ class SyncPromise {
    constructor(executor){
        this._state = STATE_PENDING;
        this._handlers = [];
        this._runExecutor(executor);
    }
    /** @inheritdoc */ then(onfulfilled, onrejected) {
        return new SyncPromise((resolve, reject)=>{
            this._handlers.push([
                false,
                (result)=>{
                    if (!onfulfilled) {
                        // TODO: ¯\_(ツ)_/¯
                        // TODO: FIXME
                        resolve(result);
                    } else {
                        try {
                            resolve(onfulfilled(result));
                        } catch (e) {
                            reject(e);
                        }
                    }
                },
                (reason)=>{
                    if (!onrejected) {
                        reject(reason);
                    } else {
                        try {
                            resolve(onrejected(reason));
                        } catch (e) {
                            reject(e);
                        }
                    }
                }
            ]);
            this._executeHandlers();
        });
    }
    /** @inheritdoc */ catch(onrejected) {
        return this.then((val)=>val, onrejected);
    }
    /** @inheritdoc */ finally(onfinally) {
        return new SyncPromise((resolve, reject)=>{
            let val;
            let isRejected;
            return this.then((value)=>{
                isRejected = false;
                val = value;
                if (onfinally) {
                    onfinally();
                }
            }, (reason)=>{
                isRejected = true;
                val = reason;
                if (onfinally) {
                    onfinally();
                }
            }).then(()=>{
                if (isRejected) {
                    reject(val);
                    return;
                }
                resolve(val);
            });
        });
    }
    /** Excute the resolve/reject handlers. */ _executeHandlers() {
        if (this._state === STATE_PENDING) {
            return;
        }
        const cachedHandlers = this._handlers.slice();
        this._handlers = [];
        cachedHandlers.forEach((handler)=>{
            if (handler[0]) {
                return;
            }
            if (this._state === STATE_RESOLVED) {
                handler[1](this._value);
            }
            if (this._state === STATE_REJECTED) {
                handler[2](this._value);
            }
            handler[0] = true;
        });
    }
    /** Run the executor for the SyncPromise. */ _runExecutor(executor) {
        const setResult = (state, value)=>{
            if (this._state !== STATE_PENDING) {
                return;
            }
            if (is.isThenable(value)) {
                void value.then(resolve, reject);
                return;
            }
            this._state = state;
            this._value = value;
            this._executeHandlers();
        };
        const resolve = (value)=>{
            setResult(STATE_RESOLVED, value);
        };
        const reject = (reason)=>{
            setResult(STATE_REJECTED, reason);
        };
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
}
exports.SyncPromise = SyncPromise;
exports.rejectedSyncPromise = rejectedSyncPromise;
exports.resolvedSyncPromise = resolvedSyncPromise; //# sourceMappingURL=syncpromise.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/eventProcessors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
/**
 * Process an array of event processors, returning the processed event (or `null` if the event was dropped).
 */ function notifyEventProcessors(processors, event, hint, index = 0) {
    return new syncpromise.SyncPromise((resolve, reject)=>{
        const processor = processors[index];
        if (event === null || typeof processor !== 'function') {
            resolve(event);
        } else {
            const result = processor({
                ...event
            }, hint);
            debugBuild.DEBUG_BUILD && processor.id && result === null && debugLogger.debug.log(`Event processor "${processor.id}" dropped event`);
            if (is.isThenable(result)) {
                void result.then((final)=>notifyEventProcessors(processors, final, hint, index + 1).then(resolve)).then(null, reject);
            } else {
                void notifyEventProcessors(processors, result, hint, index + 1).then(resolve).then(null, reject);
            }
        }
    });
}
exports.notifyEventProcessors = notifyEventProcessors; //# sourceMappingURL=eventProcessors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/applyScopeDataToEvent.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const merge = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/merge.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * Applies data from the scope to the event and runs all event processors on it.
 */ function applyScopeDataToEvent(event, data) {
    const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
    // Apply general data
    applyDataToEvent(event, data);
    // We want to set the trace context for normal events only if there isn't already
    // a trace context on the event. There is a product feature in place where we link
    // errors with transaction and it relies on that.
    if (span) {
        applySpanToEvent(event, span);
    }
    applyFingerprintToEvent(event, fingerprint);
    applyBreadcrumbsToEvent(event, breadcrumbs);
    applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
/** Merge data of two scopes together. */ function mergeScopeData(data, mergeData) {
    const { extra, tags, user, contexts, level, sdkProcessingMetadata, breadcrumbs, fingerprint, eventProcessors, attachments, propagationContext, transactionName, span } = mergeData;
    mergeAndOverwriteScopeData(data, 'extra', extra);
    mergeAndOverwriteScopeData(data, 'tags', tags);
    mergeAndOverwriteScopeData(data, 'user', user);
    mergeAndOverwriteScopeData(data, 'contexts', contexts);
    data.sdkProcessingMetadata = merge.merge(data.sdkProcessingMetadata, sdkProcessingMetadata, 2);
    if (level) {
        data.level = level;
    }
    if (transactionName) {
        data.transactionName = transactionName;
    }
    if (span) {
        data.span = span;
    }
    if (breadcrumbs.length) {
        data.breadcrumbs = [
            ...data.breadcrumbs,
            ...breadcrumbs
        ];
    }
    if (fingerprint.length) {
        data.fingerprint = [
            ...data.fingerprint,
            ...fingerprint
        ];
    }
    if (eventProcessors.length) {
        data.eventProcessors = [
            ...data.eventProcessors,
            ...eventProcessors
        ];
    }
    if (attachments.length) {
        data.attachments = [
            ...data.attachments,
            ...attachments
        ];
    }
    data.propagationContext = {
        ...data.propagationContext,
        ...propagationContext
    };
}
/**
 * Merges certain scope data. Undefined values will overwrite any existing values.
 * Exported only for tests.
 */ function mergeAndOverwriteScopeData(data, prop, mergeVal) {
    data[prop] = merge.merge(data[prop], mergeVal, 1);
}
function applyDataToEvent(event, data) {
    const { extra, tags, user, contexts, level, transactionName } = data;
    if (Object.keys(extra).length) {
        event.extra = {
            ...extra,
            ...event.extra
        };
    }
    if (Object.keys(tags).length) {
        event.tags = {
            ...tags,
            ...event.tags
        };
    }
    if (Object.keys(user).length) {
        event.user = {
            ...user,
            ...event.user
        };
    }
    if (Object.keys(contexts).length) {
        event.contexts = {
            ...contexts,
            ...event.contexts
        };
    }
    if (level) {
        event.level = level;
    }
    // transaction events get their `transaction` from the root span name
    if (transactionName && event.type !== 'transaction') {
        event.transaction = transactionName;
    }
}
function applyBreadcrumbsToEvent(event, breadcrumbs) {
    const mergedBreadcrumbs = [
        ...event.breadcrumbs || [],
        ...breadcrumbs
    ];
    event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : undefined;
}
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
    event.sdkProcessingMetadata = {
        ...event.sdkProcessingMetadata,
        ...sdkProcessingMetadata
    };
}
function applySpanToEvent(event, span) {
    event.contexts = {
        trace: spanUtils.spanToTraceContext(span),
        ...event.contexts
    };
    event.sdkProcessingMetadata = {
        dynamicSamplingContext: dynamicSamplingContext.getDynamicSamplingContextFromSpan(span),
        ...event.sdkProcessingMetadata
    };
    const rootSpan = spanUtils.getRootSpan(span);
    const transactionName = spanUtils.spanToJSON(rootSpan).description;
    if (transactionName && !event.transaction && event.type === 'transaction') {
        event.transaction = transactionName;
    }
}
/**
 * Applies fingerprint from the scope to the event if there's one,
 * uses message if there's one instead or get rid of empty fingerprint
 */ function applyFingerprintToEvent(event, fingerprint) {
    // Make sure it's an array first and we actually have something in place
    event.fingerprint = event.fingerprint ? Array.isArray(event.fingerprint) ? event.fingerprint : [
        event.fingerprint
    ] : [];
    // If we have something on the scope, then merge it with event
    if (fingerprint) {
        event.fingerprint = event.fingerprint.concat(fingerprint);
    }
    // If we have no data at all, remove empty array default
    if (!event.fingerprint.length) {
        delete event.fingerprint;
    }
}
exports.applyScopeDataToEvent = applyScopeDataToEvent;
exports.mergeAndOverwriteScopeData = mergeAndOverwriteScopeData;
exports.mergeScopeData = mergeScopeData; //# sourceMappingURL=applyScopeDataToEvent.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-ids.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
let parsedStackResults;
let lastKeysCount;
let cachedFilenameDebugIds;
/**
 * Returns a map of filenames to debug identifiers.
 */ function getFilenameToDebugIdMap(stackParser) {
    const debugIdMap = worldwide.GLOBAL_OBJ._sentryDebugIds;
    if (!debugIdMap) {
        return {};
    }
    const debugIdKeys = Object.keys(debugIdMap);
    // If the count of registered globals hasn't changed since the last call, we
    // can just return the cached result.
    if (cachedFilenameDebugIds && debugIdKeys.length === lastKeysCount) {
        return cachedFilenameDebugIds;
    }
    lastKeysCount = debugIdKeys.length;
    // Build a map of filename -> debug_id.
    cachedFilenameDebugIds = debugIdKeys.reduce((acc, stackKey)=>{
        if (!parsedStackResults) {
            parsedStackResults = {};
        }
        const result = parsedStackResults[stackKey];
        if (result) {
            acc[result[0]] = result[1];
        } else {
            const parsedStack = stackParser(stackKey);
            for(let i = parsedStack.length - 1; i >= 0; i--){
                const stackFrame = parsedStack[i];
                const filename = stackFrame?.filename;
                const debugId = debugIdMap[stackKey];
                if (filename && debugId) {
                    acc[filename] = debugId;
                    parsedStackResults[stackKey] = [
                        filename,
                        debugId
                    ];
                    break;
                }
            }
        }
        return acc;
    }, {});
    return cachedFilenameDebugIds;
}
/**
 * Returns a list of debug images for the given resources.
 */ function getDebugImagesForResources(stackParser, resource_paths) {
    const filenameDebugIdMap = getFilenameToDebugIdMap(stackParser);
    if (!filenameDebugIdMap) {
        return [];
    }
    const images = [];
    for (const path of resource_paths){
        if (path && filenameDebugIdMap[path]) {
            images.push({
                type: 'sourcemap',
                code_file: path,
                debug_id: filenameDebugIdMap[path]
            });
        }
    }
    return images;
}
exports.getDebugImagesForResources = getDebugImagesForResources;
exports.getFilenameToDebugIdMap = getFilenameToDebugIdMap; //# sourceMappingURL=debug-ids.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/prepareEvent.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/constants.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const eventProcessors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/eventProcessors.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)");
const applyScopeDataToEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/applyScopeDataToEvent.js [app-ssr] (ecmascript)");
const debugIds = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-ids.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
/**
 * This type makes sure that we get either a CaptureContext, OR an EventHint.
 * It does not allow mixing them, which could lead to unexpected outcomes, e.g. this is disallowed:
 * { user: { id: '123' }, mechanism: { handled: false } }
 */ /**
 * Adds common information to events.
 *
 * The information includes release and environment from `options`,
 * breadcrumbs and context (extra, tags and user) from the scope.
 *
 * Information that is already present in the event is never overwritten. For
 * nested objects, such as the context, keys are merged.
 *
 * @param event The original event.
 * @param hint May contain additional information about the original exception.
 * @param scope A scope containing event metadata.
 * @returns A new event with more information.
 * @hidden
 */ function prepareEvent(options, event, hint, scope, client, isolationScope) {
    const { normalizeDepth = 3, normalizeMaxBreadth = 1000 } = options;
    const prepared = {
        ...event,
        event_id: event.event_id || hint.event_id || misc.uuid4(),
        timestamp: event.timestamp || time.dateTimestampInSeconds()
    };
    const integrations = hint.integrations || options.integrations.map((i)=>i.name);
    applyClientOptions(prepared, options);
    applyIntegrationsMetadata(prepared, integrations);
    if (client) {
        client.emit('applyFrameMetadata', event);
    }
    // Only put debug IDs onto frames for error events.
    if (event.type === undefined) {
        applyDebugIds(prepared, options.stackParser);
    }
    // If we have scope given to us, use it as the base for further modifications.
    // This allows us to prevent unnecessary copying of data if `captureContext` is not provided.
    const finalScope = getFinalScope(scope, hint.captureContext);
    if (hint.mechanism) {
        misc.addExceptionMechanism(prepared, hint.mechanism);
    }
    const clientEventProcessors = client ? client.getEventProcessors() : [];
    // This should be the last thing called, since we want that
    // {@link Scope.addEventProcessor} gets the finished prepared event.
    // Merge scope data together
    const data = currentScopes.getGlobalScope().getScopeData();
    if (isolationScope) {
        const isolationData = isolationScope.getScopeData();
        applyScopeDataToEvent.mergeScopeData(data, isolationData);
    }
    if (finalScope) {
        const finalScopeData = finalScope.getScopeData();
        applyScopeDataToEvent.mergeScopeData(data, finalScopeData);
    }
    const attachments = [
        ...hint.attachments || [],
        ...data.attachments
    ];
    if (attachments.length) {
        hint.attachments = attachments;
    }
    applyScopeDataToEvent.applyScopeDataToEvent(prepared, data);
    const eventProcessors$1 = [
        ...clientEventProcessors,
        // Run scope event processors _after_ all other processors
        ...data.eventProcessors
    ];
    const result = eventProcessors.notifyEventProcessors(eventProcessors$1, prepared, hint);
    return result.then((evt)=>{
        if (evt) {
            // We apply the debug_meta field only after all event processors have ran, so that if any event processors modified
            // file names (e.g.the RewriteFrames integration) the filename -> debug ID relationship isn't destroyed.
            // This should not cause any PII issues, since we're only moving data that is already on the event and not adding
            // any new data
            applyDebugMeta(evt);
        }
        if (typeof normalizeDepth === 'number' && normalizeDepth > 0) {
            return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
        }
        return evt;
    });
}
/**
 * Enhances event using the client configuration.
 * It takes care of all "static" values like environment, release and `dist`,
 * as well as truncating overly long values.
 *
 * Only exported for tests.
 *
 * @param event event instance to be enhanced
 */ function applyClientOptions(event, options) {
    const { environment, release, dist, maxValueLength = 250 } = options;
    // empty strings do not make sense for environment, release, and dist
    // so we handle them the same as if they were not provided
    event.environment = event.environment || environment || constants.DEFAULT_ENVIRONMENT;
    if (!event.release && release) {
        event.release = release;
    }
    if (!event.dist && dist) {
        event.dist = dist;
    }
    const request = event.request;
    if (request?.url) {
        request.url = string.truncate(request.url, maxValueLength);
    }
}
/**
 * Puts debug IDs into the stack frames of an error event.
 */ function applyDebugIds(event, stackParser) {
    // Build a map of filename -> debug_id
    const filenameDebugIdMap = debugIds.getFilenameToDebugIdMap(stackParser);
    event.exception?.values?.forEach((exception)=>{
        exception.stacktrace?.frames?.forEach((frame)=>{
            if (frame.filename) {
                frame.debug_id = filenameDebugIdMap[frame.filename];
            }
        });
    });
}
/**
 * Moves debug IDs from the stack frames of an error event into the debug_meta field.
 */ function applyDebugMeta(event) {
    // Extract debug IDs and filenames from the stack frames on the event.
    const filenameDebugIdMap = {};
    event.exception?.values?.forEach((exception)=>{
        exception.stacktrace?.frames?.forEach((frame)=>{
            if (frame.debug_id) {
                if (frame.abs_path) {
                    filenameDebugIdMap[frame.abs_path] = frame.debug_id;
                } else if (frame.filename) {
                    filenameDebugIdMap[frame.filename] = frame.debug_id;
                }
                delete frame.debug_id;
            }
        });
    });
    if (Object.keys(filenameDebugIdMap).length === 0) {
        return;
    }
    // Fill debug_meta information
    event.debug_meta = event.debug_meta || {};
    event.debug_meta.images = event.debug_meta.images || [];
    const images = event.debug_meta.images;
    Object.entries(filenameDebugIdMap).forEach(([filename, debug_id])=>{
        images.push({
            type: 'sourcemap',
            code_file: filename,
            debug_id
        });
    });
}
/**
 * This function adds all used integrations to the SDK info in the event.
 * @param event The event that will be filled with all integrations.
 */ function applyIntegrationsMetadata(event, integrationNames) {
    if (integrationNames.length > 0) {
        event.sdk = event.sdk || {};
        event.sdk.integrations = [
            ...event.sdk.integrations || [],
            ...integrationNames
        ];
    }
}
/**
 * Applies `normalize` function on necessary `Event` attributes to make them safe for serialization.
 * Normalized keys:
 * - `breadcrumbs.data`
 * - `user`
 * - `contexts`
 * - `extra`
 * @param event Event
 * @returns Normalized event
 */ function normalizeEvent(event, depth, maxBreadth) {
    if (!event) {
        return null;
    }
    const normalized = {
        ...event,
        ...event.breadcrumbs && {
            breadcrumbs: event.breadcrumbs.map((b)=>({
                    ...b,
                    ...b.data && {
                        data: normalize.normalize(b.data, depth, maxBreadth)
                    }
                }))
        },
        ...event.user && {
            user: normalize.normalize(event.user, depth, maxBreadth)
        },
        ...event.contexts && {
            contexts: normalize.normalize(event.contexts, depth, maxBreadth)
        },
        ...event.extra && {
            extra: normalize.normalize(event.extra, depth, maxBreadth)
        }
    };
    // event.contexts.trace stores information about a Transaction. Similarly,
    // event.spans[] stores information about child Spans. Given that a
    // Transaction is conceptually a Span, normalization should apply to both
    // Transactions and Spans consistently.
    // For now the decision is to skip normalization of Transactions and Spans,
    // so this block overwrites the normalized event to add back the original
    // Transaction information prior to normalization.
    if (event.contexts?.trace && normalized.contexts) {
        normalized.contexts.trace = event.contexts.trace;
        // event.contexts.trace.data may contain circular/dangerous data so we need to normalize it
        if (event.contexts.trace.data) {
            normalized.contexts.trace.data = normalize.normalize(event.contexts.trace.data, depth, maxBreadth);
        }
    }
    // event.spans[].data may contain circular/dangerous data so we need to normalize it
    if (event.spans) {
        normalized.spans = event.spans.map((span)=>{
            return {
                ...span,
                ...span.data && {
                    data: normalize.normalize(span.data, depth, maxBreadth)
                }
            };
        });
    }
    // event.contexts.flags (FeatureFlagContext) stores context for our feature
    // flag integrations. It has a greater nesting depth than our other typed
    // Contexts, so we re-normalize with a fixed depth of 3 here. We do not want
    // to skip this in case of conflicting, user-provided context.
    if (event.contexts?.flags && normalized.contexts) {
        normalized.contexts.flags = normalize.normalize(event.contexts.flags, 3, maxBreadth);
    }
    return normalized;
}
function getFinalScope(scope$1, captureContext) {
    if (!captureContext) {
        return scope$1;
    }
    const finalScope = scope$1 ? scope$1.clone() : new scope.Scope();
    finalScope.update(captureContext);
    return finalScope;
}
/**
 * Parse either an `EventHint` directly, or convert a `CaptureContext` to an `EventHint`.
 * This is used to allow to update method signatures that used to accept a `CaptureContext` but should now accept an `EventHint`.
 */ function parseEventHintOrCaptureContext(hint) {
    if (!hint) {
        return undefined;
    }
    // If you pass a Scope or `() => Scope` as CaptureContext, we just return this as captureContext
    if (hintIsScopeOrFunction(hint)) {
        return {
            captureContext: hint
        };
    }
    if (hintIsScopeContext(hint)) {
        return {
            captureContext: hint
        };
    }
    return hint;
}
function hintIsScopeOrFunction(hint) {
    return hint instanceof scope.Scope || typeof hint === 'function';
}
const captureContextKeys = [
    'user',
    'level',
    'extra',
    'contexts',
    'tags',
    'fingerprint',
    'propagationContext'
];
function hintIsScopeContext(hint) {
    return Object.keys(hint).some((key)=>captureContextKeys.includes(key));
}
exports.applyClientOptions = applyClientOptions;
exports.applyDebugIds = applyDebugIds;
exports.applyDebugMeta = applyDebugMeta;
exports.parseEventHintOrCaptureContext = parseEventHintOrCaptureContext;
exports.prepareEvent = prepareEvent; //# sourceMappingURL=prepareEvent.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const session = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/session.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const prepareEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/prepareEvent.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/**
 * Captures an exception event and sends it to Sentry.
 *
 * @param exception The exception to capture.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured Sentry event.
 */ function captureException(exception, hint) {
    return currentScopes.getCurrentScope().captureException(exception, prepareEvent.parseEventHintOrCaptureContext(hint));
}
/**
 * Captures a message event and sends it to Sentry.
 *
 * @param message The message to send to Sentry.
 * @param captureContext Define the level of the message or pass in additional data to attach to the message.
 * @returns the id of the captured message.
 */ function captureMessage(message, captureContext) {
    // This is necessary to provide explicit scopes upgrade, without changing the original
    // arity of the `captureMessage(message, level)` method.
    const level = typeof captureContext === 'string' ? captureContext : undefined;
    const context = typeof captureContext !== 'string' ? {
        captureContext
    } : undefined;
    return currentScopes.getCurrentScope().captureMessage(message, level, context);
}
/**
 * Captures a manually created event and sends it to Sentry.
 *
 * @param event The event to send to Sentry.
 * @param hint Optional additional data to attach to the Sentry event.
 * @returns the id of the captured event.
 */ function captureEvent(event, hint) {
    return currentScopes.getCurrentScope().captureEvent(event, hint);
}
/**
 * Sets context data with the given name.
 * @param name of the context
 * @param context Any kind of data. This data will be normalized.
 */ function setContext(name, context) {
    currentScopes.getIsolationScope().setContext(name, context);
}
/**
 * Set an object that will be merged sent as extra data with the event.
 * @param extras Extras object to merge into current context.
 */ function setExtras(extras) {
    currentScopes.getIsolationScope().setExtras(extras);
}
/**
 * Set key:value that will be sent as extra data with the event.
 * @param key String of extra
 * @param extra Any kind of data. This data will be normalized.
 */ function setExtra(key, extra) {
    currentScopes.getIsolationScope().setExtra(key, extra);
}
/**
 * Set an object that will be merged sent as tags data with the event.
 * @param tags Tags context object to merge into current context.
 */ function setTags(tags) {
    currentScopes.getIsolationScope().setTags(tags);
}
/**
 * Set key:value that will be sent as tags data with the event.
 *
 * Can also be used to unset a tag, by passing `undefined`.
 *
 * @param key String key of tag
 * @param value Value of tag
 */ function setTag(key, value) {
    currentScopes.getIsolationScope().setTag(key, value);
}
/**
 * Updates user context information for future events.
 *
 * @param user User context object to be set in the current context. Pass `null` to unset the user.
 */ function setUser(user) {
    currentScopes.getIsolationScope().setUser(user);
}
/**
 * The last error event id of the isolation scope.
 *
 * Warning: This function really returns the last recorded error event id on the current
 * isolation scope. If you call this function after handling a certain error and another error
 * is captured in between, the last one is returned instead of the one you might expect.
 * Also, ids of events that were never sent to Sentry (for example because
 * they were dropped in `beforeSend`) could be returned.
 *
 * @returns The last event id of the isolation scope.
 */ function lastEventId() {
    return currentScopes.getIsolationScope().lastEventId();
}
/**
 * Create a cron monitor check in and send it to Sentry.
 *
 * @param checkIn An object that describes a check in.
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function captureCheckIn(checkIn, upsertMonitorConfig) {
    const scope = currentScopes.getCurrentScope();
    const client = currentScopes.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Cannot capture check-in. No client defined.');
    } else if (!client.captureCheckIn) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Cannot capture check-in. Client does not support sending check-ins.');
    } else {
        return client.captureCheckIn(checkIn, upsertMonitorConfig, scope);
    }
    return misc.uuid4();
}
/**
 * Wraps a callback with a cron monitor check in. The check in will be sent to Sentry when the callback finishes.
 *
 * @param monitorSlug The distinct slug of the monitor.
 * @param callback Callback to be monitored
 * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
 * to create a monitor automatically when sending a check in.
 */ function withMonitor(monitorSlug, callback, upsertMonitorConfig) {
    const checkInId = captureCheckIn({
        monitorSlug,
        status: 'in_progress'
    }, upsertMonitorConfig);
    const now = time.timestampInSeconds();
    function finishCheckIn(status) {
        captureCheckIn({
            monitorSlug,
            status,
            checkInId,
            duration: time.timestampInSeconds() - now
        });
    }
    return currentScopes.withIsolationScope(()=>{
        let maybePromiseResult;
        try {
            maybePromiseResult = callback();
        } catch (e) {
            finishCheckIn('error');
            throw e;
        }
        if (is.isThenable(maybePromiseResult)) {
            return maybePromiseResult.then((r)=>{
                finishCheckIn('ok');
                return r;
            }, (e)=>{
                finishCheckIn('error');
                throw e;
            });
        }
        finishCheckIn('ok');
        return maybePromiseResult;
    });
}
/**
 * Call `flush()` on the current client, if there is one. See {@link Client.flush}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue. Omitting this parameter will cause
 * the client to wait until all events are sent before resolving the promise.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function flush(timeout) {
    const client = currentScopes.getClient();
    if (client) {
        return client.flush(timeout);
    }
    debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Cannot flush events. No client defined.');
    return Promise.resolve(false);
}
/**
 * Call `close()` on the current client, if there is one. See {@link Client.close}.
 *
 * @param timeout Maximum time in ms the client should wait to flush its event queue before shutting down. Omitting this
 * parameter will cause the client to wait until all events are sent before disabling itself.
 * @returns A promise which resolves to `true` if the queue successfully drains before the timeout, or `false` if it
 * doesn't (or if there's no client defined).
 */ async function close(timeout) {
    const client = currentScopes.getClient();
    if (client) {
        return client.close(timeout);
    }
    debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Cannot flush events and disable SDK. No client defined.');
    return Promise.resolve(false);
}
/**
 * Returns true if Sentry has been properly initialized.
 */ function isInitialized() {
    return !!currentScopes.getClient();
}
/** If the SDK is initialized & enabled. */ function isEnabled() {
    const client = currentScopes.getClient();
    return client?.getOptions().enabled !== false && !!client?.getTransport();
}
/**
 * Add an event processor.
 * This will be added to the current isolation scope, ensuring any event that is processed in the current execution
 * context will have the processor applied.
 */ function addEventProcessor(callback) {
    currentScopes.getIsolationScope().addEventProcessor(callback);
}
/**
 * Start a session on the current isolation scope.
 *
 * @param context (optional) additional properties to be applied to the returned session object
 *
 * @returns the new active session
 */ function startSession(context) {
    const isolationScope = currentScopes.getIsolationScope();
    const currentScope = currentScopes.getCurrentScope();
    // Will fetch userAgent if called from browser sdk
    const { userAgent } = worldwide.GLOBAL_OBJ.navigator || {};
    const session$1 = session.makeSession({
        user: currentScope.getUser() || isolationScope.getUser(),
        ...userAgent && {
            userAgent
        },
        ...context
    });
    // End existing session if there's one
    const currentSession = isolationScope.getSession();
    if (currentSession?.status === 'ok') {
        session.updateSession(currentSession, {
            status: 'exited'
        });
    }
    endSession();
    // Afterwards we set the new session on the scope
    isolationScope.setSession(session$1);
    return session$1;
}
/**
 * End the session on the current isolation scope.
 */ function endSession() {
    const isolationScope = currentScopes.getIsolationScope();
    const currentScope = currentScopes.getCurrentScope();
    const session$1 = currentScope.getSession() || isolationScope.getSession();
    if (session$1) {
        session.closeSession(session$1);
    }
    _sendSessionUpdate();
    // the session is over; take it off of the scope
    isolationScope.setSession();
}
/**
 * Sends the current Session on the scope
 */ function _sendSessionUpdate() {
    const isolationScope = currentScopes.getIsolationScope();
    const client = currentScopes.getClient();
    const session = isolationScope.getSession();
    if (session && client) {
        client.captureSession(session);
    }
}
/**
 * Sends the current session on the scope to Sentry
 *
 * @param end If set the session will be marked as exited and removed from the scope.
 *            Defaults to `false`.
 */ function captureSession(end = false) {
    // both send the update and pull the session from the scope
    if (end) {
        endSession();
        return;
    }
    // only send the update
    _sendSessionUpdate();
}
exports.addEventProcessor = addEventProcessor;
exports.captureCheckIn = captureCheckIn;
exports.captureEvent = captureEvent;
exports.captureException = captureException;
exports.captureMessage = captureMessage;
exports.captureSession = captureSession;
exports.close = close;
exports.endSession = endSession;
exports.flush = flush;
exports.isEnabled = isEnabled;
exports.isInitialized = isInitialized;
exports.lastEventId = lastEventId;
exports.setContext = setContext;
exports.setExtra = setExtra;
exports.setExtras = setExtras;
exports.setTag = setTag;
exports.setTags = setTags;
exports.setUser = setUser;
exports.startSession = startSession;
exports.withMonitor = withMonitor; //# sourceMappingURL=exports.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/api.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const SENTRY_API_VERSION = '7';
/** Returns the prefix to construct Sentry ingestion API endpoints. */ function getBaseApiEndpoint(dsn) {
    const protocol = dsn.protocol ? `${dsn.protocol}:` : '';
    const port = dsn.port ? `:${dsn.port}` : '';
    return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ''}/api/`;
}
/** Returns the ingest API endpoint for target. */ function _getIngestEndpoint(dsn) {
    return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
/** Returns a URL-encoded string with auth config suitable for a query string. */ function _encodedAuth(dsn, sdkInfo) {
    const params = {
        sentry_version: SENTRY_API_VERSION
    };
    if (dsn.publicKey) {
        // We send only the minimum set of required information. See
        // https://github.com/getsentry/sentry-javascript/issues/2572.
        params.sentry_key = dsn.publicKey;
    }
    if (sdkInfo) {
        params.sentry_client = `${sdkInfo.name}/${sdkInfo.version}`;
    }
    return new URLSearchParams(params).toString();
}
/**
 * Returns the envelope endpoint URL with auth in the query string.
 *
 * Sending auth as part of the query string and not as custom HTTP headers avoids CORS preflight requests.
 */ function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel, sdkInfo) {
    return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
/** Returns the url to the report dialog endpoint. */ function getReportDialogEndpoint(dsnLike, dialogOptions) {
    const dsn$1 = dsn.makeDsn(dsnLike);
    if (!dsn$1) {
        return '';
    }
    const endpoint = `${getBaseApiEndpoint(dsn$1)}embed/error-page/`;
    let encodedOptions = `dsn=${dsn.dsnToString(dsn$1)}`;
    for(const key in dialogOptions){
        if (key === 'dsn') {
            continue;
        }
        if (key === 'onClose') {
            continue;
        }
        if (key === 'user') {
            const user = dialogOptions.user;
            if (!user) {
                continue;
            }
            if (user.name) {
                encodedOptions += `&name=${encodeURIComponent(user.name)}`;
            }
            if (user.email) {
                encodedOptions += `&email=${encodeURIComponent(user.email)}`;
            }
        } else {
            encodedOptions += `&${encodeURIComponent(key)}=${encodeURIComponent(dialogOptions[key])}`;
        }
    }
    return `${endpoint}?${encodedOptions}`;
}
exports.getEnvelopeEndpointWithUrlEncodedAuth = getEnvelopeEndpointWithUrlEncodedAuth;
exports.getReportDialogEndpoint = getReportDialogEndpoint; //# sourceMappingURL=api.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const installedIntegrations = [];
/** Map of integrations assigned to a client */ /**
 * Remove duplicates from the given array, preferring the last instance of any duplicate. Not guaranteed to
 * preserve the order of integrations in the array.
 *
 * @private
 */ function filterDuplicates(integrations) {
    const integrationsByName = {};
    integrations.forEach((currentInstance)=>{
        const { name } = currentInstance;
        const existingInstance = integrationsByName[name];
        // We want integrations later in the array to overwrite earlier ones of the same type, except that we never want a
        // default instance to overwrite an existing user instance
        if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
            return;
        }
        integrationsByName[name] = currentInstance;
    });
    return Object.values(integrationsByName);
}
/** Gets integrations to install */ function getIntegrationsToSetup(options) {
    const defaultIntegrations = options.defaultIntegrations || [];
    const userIntegrations = options.integrations;
    // We flag default instances, so that later we can tell them apart from any user-created instances of the same class
    defaultIntegrations.forEach((integration)=>{
        integration.isDefaultInstance = true;
    });
    let integrations;
    if (Array.isArray(userIntegrations)) {
        integrations = [
            ...defaultIntegrations,
            ...userIntegrations
        ];
    } else if (typeof userIntegrations === 'function') {
        const resolvedUserIntegrations = userIntegrations(defaultIntegrations);
        integrations = Array.isArray(resolvedUserIntegrations) ? resolvedUserIntegrations : [
            resolvedUserIntegrations
        ];
    } else {
        integrations = defaultIntegrations;
    }
    return filterDuplicates(integrations);
}
/**
 * Given a list of integration instances this installs them all. When `withDefaults` is set to `true` then all default
 * integrations are added unless they were already provided before.
 * @param integrations array of integration instances
 * @param withDefault should enable default integrations
 */ function setupIntegrations(client, integrations) {
    const integrationIndex = {};
    integrations.forEach((integration)=>{
        // guard against empty provided integrations
        if (integration) {
            setupIntegration(client, integration, integrationIndex);
        }
    });
    return integrationIndex;
}
/**
 * Execute the `afterAllSetup` hooks of the given integrations.
 */ function afterSetupIntegrations(client, integrations) {
    for (const integration of integrations){
        // guard against empty provided integrations
        if (integration?.afterAllSetup) {
            integration.afterAllSetup(client);
        }
    }
}
/** Setup a single integration.  */ function setupIntegration(client, integration, integrationIndex) {
    if (integrationIndex[integration.name]) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Integration skipped because it was already installed: ${integration.name}`);
        return;
    }
    integrationIndex[integration.name] = integration;
    // `setupOnce` is only called the first time
    if (installedIntegrations.indexOf(integration.name) === -1 && typeof integration.setupOnce === 'function') {
        integration.setupOnce();
        installedIntegrations.push(integration.name);
    }
    // `setup` is run for each client
    if (integration.setup && typeof integration.setup === 'function') {
        integration.setup(client);
    }
    if (typeof integration.preprocessEvent === 'function') {
        const callback = integration.preprocessEvent.bind(integration);
        client.on('preprocessEvent', (event, hint)=>callback(event, hint, client));
    }
    if (typeof integration.processEvent === 'function') {
        const callback = integration.processEvent.bind(integration);
        const processor = Object.assign((event, hint)=>callback(event, hint, client), {
            id: integration.name
        });
        client.addEventProcessor(processor);
    }
    debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Integration installed: ${integration.name}`);
}
/** Add an integration to the current scope's client. */ function addIntegration(integration) {
    const client = currentScopes.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Cannot add integration "${integration.name}" because no SDK Client is available.`);
        return;
    }
    client.addIntegration(integration);
}
/**
 * Define an integration function that can be used to create an integration instance.
 * Note that this by design hides the implementation details of the integration, as they are considered internal.
 */ function defineIntegration(fn) {
    return fn;
}
exports.addIntegration = addIntegration;
exports.afterSetupIntegrations = afterSetupIntegrations;
exports.defineIntegration = defineIntegration;
exports.getIntegrationsToSetup = getIntegrationsToSetup;
exports.installedIntegrations = installedIntegrations;
exports.setupIntegration = setupIntegration;
exports.setupIntegrations = setupIntegrations; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/clientreport.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
/**
 * Creates client report envelope
 * @param discarded_events An array of discard events
 * @param dsn A DSN that can be set on the header. Optional.
 */ function createClientReportEnvelope(discarded_events, dsn, timestamp) {
    const clientReportItem = [
        {
            type: 'client_report'
        },
        {
            timestamp: timestamp || time.dateTimestampInSeconds(),
            discarded_events
        }
    ];
    return envelope.createEnvelope(dsn ? {
        dsn
    } : {}, [
        clientReportItem
    ]);
}
exports.createClientReportEnvelope = createClientReportEnvelope; //# sourceMappingURL=clientreport.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Get a list of possible event messages from a Sentry event.
 */ function getPossibleEventMessages(event) {
    const possibleMessages = [];
    if (event.message) {
        possibleMessages.push(event.message);
    }
    try {
        // @ts-expect-error Try catching to save bundle size
        const lastException = event.exception.values[event.exception.values.length - 1];
        if (lastException?.value) {
            possibleMessages.push(lastException.value);
            if (lastException.type) {
                possibleMessages.push(`${lastException.type}: ${lastException.value}`);
            }
        }
    } catch  {
    // ignore errors here
    }
    return possibleMessages;
}
exports.getPossibleEventMessages = getPossibleEventMessages; //# sourceMappingURL=eventUtils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/transactionEvent.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
/**
 * Converts a transaction event to a span JSON object.
 */ function convertTransactionEventToSpanJson(event) {
    const { trace_id, parent_span_id, span_id, status, origin, data, op } = event.contexts?.trace ?? {};
    return {
        data: data ?? {},
        description: event.transaction,
        op,
        parent_span_id,
        span_id: span_id ?? '',
        start_timestamp: event.start_timestamp ?? 0,
        status,
        timestamp: event.timestamp,
        trace_id: trace_id ?? '',
        origin,
        profile_id: data?.[semanticAttributes.SEMANTIC_ATTRIBUTE_PROFILE_ID],
        exclusive_time: data?.[semanticAttributes.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
        measurements: event.measurements,
        is_segment: true
    };
}
/**
 * Converts a span JSON object to a transaction event.
 */ function convertSpanJsonToTransactionEvent(span) {
    return {
        type: 'transaction',
        timestamp: span.timestamp,
        start_timestamp: span.start_timestamp,
        transaction: span.description,
        contexts: {
            trace: {
                trace_id: span.trace_id,
                span_id: span.span_id,
                parent_span_id: span.parent_span_id,
                op: span.op,
                status: span.status,
                origin: span.origin,
                data: {
                    ...span.data,
                    ...span.profile_id && {
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_PROFILE_ID]: span.profile_id
                    },
                    ...span.exclusive_time && {
                        [semanticAttributes.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: span.exclusive_time
                    }
                }
            }
        },
        measurements: span.measurements
    };
}
exports.convertSpanJsonToTransactionEvent = convertSpanJsonToTransactionEvent;
exports.convertTransactionEventToSpanJson = convertTransactionEventToSpanJson; //# sourceMappingURL=transactionEvent.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/api.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/constants.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/envelope.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const session = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/session.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const clientreport = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/clientreport.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const envelope$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const eventUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventUtils.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const merge = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/merge.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const parseSampleRate = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)");
const prepareEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/prepareEvent.js [app-ssr] (ecmascript)");
const shouldIgnoreSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/should-ignore-span.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
const transactionEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/transactionEvent.js [app-ssr] (ecmascript)");
/* eslint-disable max-lines */ const ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
const MISSING_RELEASE_FOR_SESSION_ERROR = 'Discarded session because of missing or non-string release';
const INTERNAL_ERROR_SYMBOL = Symbol.for('SentryInternalError');
const DO_NOT_SEND_EVENT_SYMBOL = Symbol.for('SentryDoNotSendEventError');
function _makeInternalError(message) {
    return {
        message,
        [INTERNAL_ERROR_SYMBOL]: true
    };
}
function _makeDoNotSendEventError(message) {
    return {
        message,
        [DO_NOT_SEND_EVENT_SYMBOL]: true
    };
}
function _isInternalError(error) {
    return !!error && typeof error === 'object' && INTERNAL_ERROR_SYMBOL in error;
}
function _isDoNotSendEventError(error) {
    return !!error && typeof error === 'object' && DO_NOT_SEND_EVENT_SYMBOL in error;
}
/**
 * Base implementation for all JavaScript SDK clients.
 *
 * Call the constructor with the corresponding options
 * specific to the client subclass. To access these options later, use
 * {@link Client.getOptions}.
 *
 * If a Dsn is specified in the options, it will be parsed and stored. Use
 * {@link Client.getDsn} to retrieve the Dsn at any moment. In case the Dsn is
 * invalid, the constructor will throw a {@link SentryException}. Note that
 * without a valid Dsn, the SDK will not send any events to Sentry.
 *
 * Before sending an event, it is passed through
 * {@link Client._prepareEvent} to add SDK information and scope data
 * (breadcrumbs and context). To add more custom information, override this
 * method and extend the resulting prepared event.
 *
 * To issue automatically created events (e.g. via instrumentation), use
 * {@link Client.captureEvent}. It will prepare the event and pass it through
 * the callback lifecycle. To issue auto-breadcrumbs, use
 * {@link Client.addBreadcrumb}.
 *
 * @example
 * class NodeClient extends Client<NodeOptions> {
 *   public constructor(options: NodeOptions) {
 *     super(options);
 *   }
 *
 *   // ...
 * }
 */ class Client {
    /** Options passed to the SDK. */ /** The client Dsn, if specified in options. Without this Dsn, the SDK will be disabled. */ /** Array of set up integrations. */ /** Number of calls being processed */ /** Holds flushable  */ // eslint-disable-next-line @typescript-eslint/ban-types
    /**
   * Initializes this client instance.
   *
   * @param options Options for the client.
   */ constructor(options){
        this._options = options;
        this._integrations = {};
        this._numProcessing = 0;
        this._outcomes = {};
        this._hooks = {};
        this._eventProcessors = [];
        if (options.dsn) {
            this._dsn = dsn.makeDsn(options.dsn);
        } else {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No DSN provided, client will not send events.');
        }
        if (this._dsn) {
            const url = api.getEnvelopeEndpointWithUrlEncodedAuth(this._dsn, options.tunnel, options._metadata ? options._metadata.sdk : undefined);
            this._transport = options.transport({
                tunnel: this._options.tunnel,
                recordDroppedEvent: this.recordDroppedEvent.bind(this),
                ...options.transportOptions,
                url
            });
        }
    }
    /**
   * Captures an exception event and sends it to Sentry.
   *
   * Unlike `captureException` exported from every SDK, this method requires that you pass it the current scope.
   */ captureException(exception, hint, scope) {
        const eventId = misc.uuid4();
        // ensure we haven't captured this very object before
        if (misc.checkOrSetAlreadyCaught(exception)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.log(ALREADY_SEEN_ERROR);
            return eventId;
        }
        const hintWithEventId = {
            event_id: eventId,
            ...hint
        };
        this._process(this.eventFromException(exception, hintWithEventId).then((event)=>this._captureEvent(event, hintWithEventId, scope)));
        return hintWithEventId.event_id;
    }
    /**
   * Captures a message event and sends it to Sentry.
   *
   * Unlike `captureMessage` exported from every SDK, this method requires that you pass it the current scope.
   */ captureMessage(message, level, hint, currentScope) {
        const hintWithEventId = {
            event_id: misc.uuid4(),
            ...hint
        };
        const eventMessage = is.isParameterizedString(message) ? message : String(message);
        const promisedEvent = is.isPrimitive(message) ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
        this._process(promisedEvent.then((event)=>this._captureEvent(event, hintWithEventId, currentScope)));
        return hintWithEventId.event_id;
    }
    /**
   * Captures a manually created event and sends it to Sentry.
   *
   * Unlike `captureEvent` exported from every SDK, this method requires that you pass it the current scope.
   */ captureEvent(event, hint, currentScope) {
        const eventId = misc.uuid4();
        // ensure we haven't captured this very object before
        if (hint?.originalException && misc.checkOrSetAlreadyCaught(hint.originalException)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.log(ALREADY_SEEN_ERROR);
            return eventId;
        }
        const hintWithEventId = {
            event_id: eventId,
            ...hint
        };
        const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
        const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
        const capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
        this._process(this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope, capturedSpanIsolationScope));
        return hintWithEventId.event_id;
    }
    /**
   * Captures a session.
   */ captureSession(session$1) {
        this.sendSession(session$1);
        // After sending, we set init false to indicate it's not the first occurrence
        session.updateSession(session$1, {
            init: false
        });
    }
    /**
   * Create a cron monitor check in and send it to Sentry. This method is not available on all clients.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   * @param scope An optional scope containing event metadata.
   * @returns A string representing the id of the check in.
   */ /**
   * Get the current Dsn.
   */ getDsn() {
        return this._dsn;
    }
    /**
   * Get the current options.
   */ getOptions() {
        return this._options;
    }
    /**
   * Get the SDK metadata.
   * @see SdkMetadata
   */ getSdkMetadata() {
        return this._options._metadata;
    }
    /**
   * Returns the transport that is used by the client.
   * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
   */ getTransport() {
        return this._transport;
    }
    /**
   * Wait for all events to be sent or the timeout to expire, whichever comes first.
   *
   * @param timeout Maximum time in ms the client should wait for events to be flushed. Omitting this parameter will
   *   cause the client to wait until all events are sent before resolving the promise.
   * @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
   * still events in the queue when the timeout is reached.
   */ flush(timeout) {
        const transport = this._transport;
        if (transport) {
            this.emit('flush');
            return this._isClientDoneProcessing(timeout).then((clientFinished)=>{
                return transport.flush(timeout).then((transportFlushed)=>clientFinished && transportFlushed);
            });
        } else {
            return syncpromise.resolvedSyncPromise(true);
        }
    }
    /**
   * Flush the event queue and set the client to `enabled = false`. See {@link Client.flush}.
   *
   * @param {number} timeout Maximum time in ms the client should wait before shutting down. Omitting this parameter will cause
   *   the client to wait until all events are sent before disabling itself.
   * @returns {Promise<boolean>} A promise which resolves to `true` if the flush completes successfully before the timeout, or `false` if
   * it doesn't.
   */ close(timeout) {
        return this.flush(timeout).then((result)=>{
            this.getOptions().enabled = false;
            this.emit('close');
            return result;
        });
    }
    /**
   * Get all installed event processors.
   */ getEventProcessors() {
        return this._eventProcessors;
    }
    /**
   * Adds an event processor that applies to any event processed by this client.
   */ addEventProcessor(eventProcessor) {
        this._eventProcessors.push(eventProcessor);
    }
    /**
   * Initialize this client.
   * Call this after the client was set on a scope.
   */ init() {
        if (this._isEnabled() || // Force integrations to be setup even if no DSN was set when we have
        // Spotlight enabled. This is particularly important for browser as we
        // don't support the `spotlight` option there and rely on the users
        // adding the `spotlightBrowserIntegration()` to their integrations which
        // wouldn't get initialized with the check below when there's no DSN set.
        this._options.integrations.some(({ name })=>name.startsWith('Spotlight'))) {
            this._setupIntegrations();
        }
    }
    /**
   * Gets an installed integration by its name.
   *
   * @returns {Integration|undefined} The installed integration or `undefined` if no integration with that `name` was installed.
   */ getIntegrationByName(integrationName) {
        return this._integrations[integrationName];
    }
    /**
   * Add an integration to the client.
   * This can be used to e.g. lazy load integrations.
   * In most cases, this should not be necessary,
   * and you're better off just passing the integrations via `integrations: []` at initialization time.
   * However, if you find the need to conditionally load & add an integration, you can use `addIntegration` to do so.
   */ addIntegration(integration$1) {
        const isAlreadyInstalled = this._integrations[integration$1.name];
        // This hook takes care of only installing if not already installed
        integration.setupIntegration(this, integration$1, this._integrations);
        // Here we need to check manually to make sure to not run this multiple times
        if (!isAlreadyInstalled) {
            integration.afterSetupIntegrations(this, [
                integration$1
            ]);
        }
    }
    /**
   * Send a fully prepared event to Sentry.
   */ sendEvent(event, hint = {}) {
        this.emit('beforeSendEvent', event, hint);
        let env = envelope.createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
        for (const attachment of hint.attachments || []){
            env = envelope$1.addItemToEnvelope(env, envelope$1.createAttachmentEnvelopeItem(attachment));
        }
        const promise = this.sendEnvelope(env);
        if (promise) {
            promise.then((sendResponse)=>this.emit('afterSendEvent', event, sendResponse), null);
        }
    }
    /**
   * Send a session or session aggregrates to Sentry.
   */ sendSession(session) {
        // Backfill release and environment on session
        const { release: clientReleaseOption, environment: clientEnvironmentOption = constants.DEFAULT_ENVIRONMENT } = this._options;
        if ('aggregates' in session) {
            const sessionAttrs = session.attrs || {};
            if (!sessionAttrs.release && !clientReleaseOption) {
                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
                return;
            }
            sessionAttrs.release = sessionAttrs.release || clientReleaseOption;
            sessionAttrs.environment = sessionAttrs.environment || clientEnvironmentOption;
            session.attrs = sessionAttrs;
        } else {
            if (!session.release && !clientReleaseOption) {
                debugBuild.DEBUG_BUILD && debugLogger.debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
                return;
            }
            session.release = session.release || clientReleaseOption;
            session.environment = session.environment || clientEnvironmentOption;
        }
        this.emit('beforeSendSession', session);
        const env = envelope.createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
        // sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendEnvelope(env);
    }
    /**
   * Record on the client that an event got dropped (ie, an event that will not be sent to Sentry).
   */ recordDroppedEvent(reason, category, count = 1) {
        if (this._options.sendClientReports) {
            // We want to track each category (error, transaction, session, replay_event) separately
            // but still keep the distinction between different type of outcomes.
            // We could use nested maps, but it's much easier to read and type this way.
            // A correct type for map-based implementation if we want to go that route
            // would be `Partial<Record<SentryRequestType, Partial<Record<Outcome, number>>>>`
            // With typescript 4.1 we could even use template literal types
            const key = `${reason}:${category}`;
            debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Recording outcome: "${key}"${count > 1 ? ` (${count} times)` : ''}`);
            this._outcomes[key] = (this._outcomes[key] || 0) + count;
        }
    }
    /* eslint-disable @typescript-eslint/unified-signatures */ /**
   * Register a callback for whenever a span is started.
   * Receives the span as argument.
   * @returns {() => void} A function that, when executed, removes the registered callback.
   */ /**
   * Register a hook on this client.
   */ on(hook, callback) {
        const hooks = this._hooks[hook] = this._hooks[hook] || [];
        // @ts-expect-error We assume the types are correct
        hooks.push(callback);
        // This function returns a callback execution handler that, when invoked,
        // deregisters a callback. This is crucial for managing instances where callbacks
        // need to be unregistered to prevent self-referencing in callback closures,
        // ensuring proper garbage collection.
        return ()=>{
            // @ts-expect-error We assume the types are correct
            const cbIndex = hooks.indexOf(callback);
            if (cbIndex > -1) {
                hooks.splice(cbIndex, 1);
            }
        };
    }
    /** Fire a hook whenever a span starts. */ /**
   * Emit a hook that was previously registered via `on()`.
   */ emit(hook, ...rest) {
        const callbacks = this._hooks[hook];
        if (callbacks) {
            callbacks.forEach((callback)=>callback(...rest));
        }
    }
    /**
   * Send an envelope to Sentry.
   */ sendEnvelope(envelope) {
        this.emit('beforeEnvelope', envelope);
        if (this._isEnabled() && this._transport) {
            return this._transport.send(envelope).then(null, (reason)=>{
                debugBuild.DEBUG_BUILD && debugLogger.debug.error('Error while sending envelope:', reason);
                return reason;
            });
        }
        debugBuild.DEBUG_BUILD && debugLogger.debug.error('Transport disabled');
        return syncpromise.resolvedSyncPromise({});
    }
    /* eslint-enable @typescript-eslint/unified-signatures */ /** Setup integrations for this client. */ _setupIntegrations() {
        const { integrations } = this._options;
        this._integrations = integration.setupIntegrations(this, integrations);
        integration.afterSetupIntegrations(this, integrations);
    }
    /** Updates existing session based on the provided event */ _updateSessionFromEvent(session$1, event) {
        let crashed = event.level === 'fatal';
        let errored = false;
        const exceptions = event.exception?.values;
        if (exceptions) {
            errored = true;
            for (const ex of exceptions){
                const mechanism = ex.mechanism;
                if (mechanism?.handled === false) {
                    crashed = true;
                    break;
                }
            }
        }
        // A session is updated and that session update is sent in only one of the two following scenarios:
        // 1. Session with non terminal status and 0 errors + an error occurred -> Will set error count to 1 and send update
        // 2. Session with non terminal status and 1 error + a crash occurred -> Will set status crashed and send update
        const sessionNonTerminal = session$1.status === 'ok';
        const shouldUpdateAndSend = sessionNonTerminal && session$1.errors === 0 || sessionNonTerminal && crashed;
        if (shouldUpdateAndSend) {
            session.updateSession(session$1, {
                ...crashed && {
                    status: 'crashed'
                },
                errors: session$1.errors || Number(errored || crashed)
            });
            this.captureSession(session$1);
        }
    }
    /**
   * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
   * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
   * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
   * `false` otherwise
   */ _isClientDoneProcessing(timeout) {
        return new syncpromise.SyncPromise((resolve)=>{
            let ticked = 0;
            const tick = 1;
            const interval = setInterval(()=>{
                if (this._numProcessing == 0) {
                    clearInterval(interval);
                    resolve(true);
                } else {
                    ticked += tick;
                    if (timeout && ticked >= timeout) {
                        clearInterval(interval);
                        resolve(false);
                    }
                }
            }, tick);
        });
    }
    /** Determines whether this SDK is enabled and a transport is present. */ _isEnabled() {
        return this.getOptions().enabled !== false && this._transport !== undefined;
    }
    /**
   * Adds common information to events.
   *
   * The information includes release and environment from `options`,
   * breadcrumbs and context (extra, tags and user) from the scope.
   *
   * Information that is already present in the event is never overwritten. For
   * nested objects, such as the context, keys are merged.
   *
   * @param event The original event.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A new event with more information.
   */ _prepareEvent(event, hint, currentScope, isolationScope) {
        const options = this.getOptions();
        const integrations = Object.keys(this._integrations);
        if (!hint.integrations && integrations?.length) {
            hint.integrations = integrations;
        }
        this.emit('preprocessEvent', event, hint);
        if (!event.type) {
            isolationScope.setLastEventId(event.event_id || hint.event_id);
        }
        return prepareEvent.prepareEvent(options, event, hint, currentScope, this, isolationScope).then((evt)=>{
            if (evt === null) {
                return evt;
            }
            this.emit('postprocessEvent', evt, hint);
            evt.contexts = {
                trace: currentScopes.getTraceContextFromScope(currentScope),
                ...evt.contexts
            };
            const dynamicSamplingContext$1 = dynamicSamplingContext.getDynamicSamplingContextFromScope(this, currentScope);
            evt.sdkProcessingMetadata = {
                dynamicSamplingContext: dynamicSamplingContext$1,
                ...evt.sdkProcessingMetadata
            };
            return evt;
        });
    }
    /**
   * Processes the event and logs an error in case of rejection
   * @param event
   * @param hint
   * @param scope
   */ _captureEvent(event, hint = {}, currentScope = currentScopes.getCurrentScope(), isolationScope = currentScopes.getIsolationScope()) {
        if (debugBuild.DEBUG_BUILD && isErrorEvent(event)) {
            debugLogger.debug.log(`Captured error event \`${eventUtils.getPossibleEventMessages(event)[0] || '<unknown>'}\``);
        }
        return this._processEvent(event, hint, currentScope, isolationScope).then((finalEvent)=>{
            return finalEvent.event_id;
        }, (reason)=>{
            if (debugBuild.DEBUG_BUILD) {
                if (_isDoNotSendEventError(reason)) {
                    debugLogger.debug.log(reason.message);
                } else if (_isInternalError(reason)) {
                    debugLogger.debug.warn(reason.message);
                } else {
                    debugLogger.debug.warn(reason);
                }
            }
            return undefined;
        });
    }
    /**
   * Processes an event (either error or message) and sends it to Sentry.
   *
   * This also adds breadcrumbs and context information to the event. However,
   * platform specific meta data (such as the User's IP address) must be added
   * by the SDK implementor.
   *
   *
   * @param event The event to send to Sentry.
   * @param hint May contain additional information about the original exception.
   * @param currentScope A scope containing event metadata.
   * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
   */ _processEvent(event, hint, currentScope, isolationScope) {
        const options = this.getOptions();
        const { sampleRate } = options;
        const isTransaction = isTransactionEvent(event);
        const isError = isErrorEvent(event);
        const eventType = event.type || 'error';
        const beforeSendLabel = `before send for type \`${eventType}\``;
        // 1.0 === 100% events are sent
        // 0.0 === 0% events are sent
        // Sampling for transaction happens somewhere else
        const parsedSampleRate = typeof sampleRate === 'undefined' ? undefined : parseSampleRate.parseSampleRate(sampleRate);
        if (isError && typeof parsedSampleRate === 'number' && Math.random() > parsedSampleRate) {
            this.recordDroppedEvent('sample_rate', 'error');
            return syncpromise.rejectedSyncPromise(_makeDoNotSendEventError(`Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`));
        }
        const dataCategory = eventType === 'replay_event' ? 'replay' : eventType;
        return this._prepareEvent(event, hint, currentScope, isolationScope).then((prepared)=>{
            if (prepared === null) {
                this.recordDroppedEvent('event_processor', dataCategory);
                throw _makeDoNotSendEventError('An event processor returned `null`, will not send event.');
            }
            const isInternalException = hint.data && hint.data.__sentry__ === true;
            if (isInternalException) {
                return prepared;
            }
            const result = processBeforeSend(this, options, prepared, hint);
            return _validateBeforeSendResult(result, beforeSendLabel);
        }).then((processedEvent)=>{
            if (processedEvent === null) {
                this.recordDroppedEvent('before_send', dataCategory);
                if (isTransaction) {
                    const spans = event.spans || [];
                    // the transaction itself counts as one span, plus all the child spans that are added
                    const spanCount = 1 + spans.length;
                    this.recordDroppedEvent('before_send', 'span', spanCount);
                }
                throw _makeDoNotSendEventError(`${beforeSendLabel} returned \`null\`, will not send event.`);
            }
            const session = currentScope.getSession() || isolationScope.getSession();
            if (isError && session) {
                this._updateSessionFromEvent(session, processedEvent);
            }
            if (isTransaction) {
                const spanCountBefore = processedEvent.sdkProcessingMetadata?.spanCountBeforeProcessing || 0;
                const spanCountAfter = processedEvent.spans ? processedEvent.spans.length : 0;
                const droppedSpanCount = spanCountBefore - spanCountAfter;
                if (droppedSpanCount > 0) {
                    this.recordDroppedEvent('before_send', 'span', droppedSpanCount);
                }
            }
            // None of the Sentry built event processor will update transaction name,
            // so if the transaction name has been changed by an event processor, we know
            // it has to come from custom event processor added by a user
            const transactionInfo = processedEvent.transaction_info;
            if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
                const source = 'custom';
                processedEvent.transaction_info = {
                    ...transactionInfo,
                    source
                };
            }
            this.sendEvent(processedEvent, hint);
            return processedEvent;
        }).then(null, (reason)=>{
            if (_isDoNotSendEventError(reason) || _isInternalError(reason)) {
                throw reason;
            }
            this.captureException(reason, {
                mechanism: {
                    handled: false,
                    type: 'internal'
                },
                data: {
                    __sentry__: true
                },
                originalException: reason
            });
            throw _makeInternalError(`Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.\nReason: ${reason}`);
        });
    }
    /**
   * Occupies the client with processing and event
   */ _process(promise) {
        this._numProcessing++;
        void promise.then((value)=>{
            this._numProcessing--;
            return value;
        }, (reason)=>{
            this._numProcessing--;
            return reason;
        });
    }
    /**
   * Clears outcomes on this client and returns them.
   */ _clearOutcomes() {
        const outcomes = this._outcomes;
        this._outcomes = {};
        return Object.entries(outcomes).map(([key, quantity])=>{
            const [reason, category] = key.split(':');
            return {
                reason,
                category,
                quantity
            };
        });
    }
    /**
   * Sends client reports as an envelope.
   */ _flushOutcomes() {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('Flushing outcomes...');
        const outcomes = this._clearOutcomes();
        if (outcomes.length === 0) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.log('No outcomes to send');
            return;
        }
        // This is really the only place where we want to check for a DSN and only send outcomes then
        if (!this._dsn) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.log('No dsn provided, will not send outcomes');
            return;
        }
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('Sending outcomes:', outcomes);
        const envelope = clientreport.createClientReportEnvelope(outcomes, this._options.tunnel && dsn.dsnToString(this._dsn));
        // sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendEnvelope(envelope);
    }
}
/**
 * Verifies that return value of configured `beforeSend` or `beforeSendTransaction` is of expected type, and returns the value if so.
 */ function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
    const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
    if (is.isThenable(beforeSendResult)) {
        return beforeSendResult.then((event)=>{
            if (!is.isPlainObject(event) && event !== null) {
                throw _makeInternalError(invalidValueError);
            }
            return event;
        }, (e)=>{
            throw _makeInternalError(`${beforeSendLabel} rejected with ${e}`);
        });
    } else if (!is.isPlainObject(beforeSendResult) && beforeSendResult !== null) {
        throw _makeInternalError(invalidValueError);
    }
    return beforeSendResult;
}
/**
 * Process the matching `beforeSendXXX` callback.
 */ function processBeforeSend(client, options, event, hint) {
    const { beforeSend, beforeSendTransaction, beforeSendSpan, ignoreSpans } = options;
    let processedEvent = event;
    if (isErrorEvent(processedEvent) && beforeSend) {
        return beforeSend(processedEvent, hint);
    }
    if (isTransactionEvent(processedEvent)) {
        // Avoid processing if we don't have to
        if (beforeSendSpan || ignoreSpans) {
            // 1. Process root span
            const rootSpanJson = transactionEvent.convertTransactionEventToSpanJson(processedEvent);
            // 1.1 If the root span should be ignored, drop the whole transaction
            if (ignoreSpans?.length && shouldIgnoreSpan.shouldIgnoreSpan(rootSpanJson, ignoreSpans)) {
                // dropping the whole transaction!
                return null;
            }
            // 1.2 If a `beforeSendSpan` callback is defined, process the root span
            if (beforeSendSpan) {
                const processedRootSpanJson = beforeSendSpan(rootSpanJson);
                if (!processedRootSpanJson) {
                    spanUtils.showSpanDropWarning();
                } else {
                    // update event with processed root span values
                    processedEvent = merge.merge(event, transactionEvent.convertSpanJsonToTransactionEvent(processedRootSpanJson));
                }
            }
            // 2. Process child spans
            if (processedEvent.spans) {
                const processedSpans = [];
                const initialSpans = processedEvent.spans;
                for (const span of initialSpans){
                    // 2.a If the child span should be ignored, reparent it to the root span
                    if (ignoreSpans?.length && shouldIgnoreSpan.shouldIgnoreSpan(span, ignoreSpans)) {
                        shouldIgnoreSpan.reparentChildSpans(initialSpans, span);
                        continue;
                    }
                    // 2.b If a `beforeSendSpan` callback is defined, process the child span
                    if (beforeSendSpan) {
                        const processedSpan = beforeSendSpan(span);
                        if (!processedSpan) {
                            spanUtils.showSpanDropWarning();
                            processedSpans.push(span);
                        } else {
                            processedSpans.push(processedSpan);
                        }
                    } else {
                        processedSpans.push(span);
                    }
                }
                const droppedSpans = processedEvent.spans.length - processedSpans.length;
                if (droppedSpans) {
                    client.recordDroppedEvent('before_send', 'span', droppedSpans);
                }
                processedEvent.spans = processedSpans;
            }
        }
        if (beforeSendTransaction) {
            if (processedEvent.spans) {
                // We store the # of spans before processing in SDK metadata,
                // so we can compare it afterwards to determine how many spans were dropped
                const spanCountBefore = processedEvent.spans.length;
                processedEvent.sdkProcessingMetadata = {
                    ...event.sdkProcessingMetadata,
                    spanCountBeforeProcessing: spanCountBefore
                };
            }
            return beforeSendTransaction(processedEvent, hint);
        }
    }
    return processedEvent;
}
function isErrorEvent(event) {
    return event.type === undefined;
}
function isTransactionEvent(event) {
    return event.type === 'transaction';
}
/** Extract trace information from scope */ function _getTraceInfoFromScope(client, scope) {
    if (!scope) {
        return [
            undefined,
            undefined
        ];
    }
    return currentScopes.withScope(scope, ()=>{
        const span = spanUtils.getActiveSpan();
        const traceContext = span ? spanUtils.spanToTraceContext(span) : currentScopes.getTraceContextFromScope(scope);
        const dynamicSamplingContext$1 = span ? dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) : dynamicSamplingContext.getDynamicSamplingContextFromScope(client, scope);
        return [
            dynamicSamplingContext$1,
            traceContext
        ];
    });
}
exports.Client = Client;
exports._getTraceInfoFromScope = _getTraceInfoFromScope; //# sourceMappingURL=client.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/checkin.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
/**
 * Create envelope from check in item.
 */ function createCheckInEnvelope(checkIn, dynamicSamplingContext, metadata, tunnel, dsn$1) {
    const headers = {
        sent_at: new Date().toISOString()
    };
    if (metadata?.sdk) {
        headers.sdk = {
            name: metadata.sdk.name,
            version: metadata.sdk.version
        };
    }
    if (!!tunnel && !!dsn$1) {
        headers.dsn = dsn.dsnToString(dsn$1);
    }
    if (dynamicSamplingContext) {
        headers.trace = dynamicSamplingContext;
    }
    const item = createCheckInEnvelopeItem(checkIn);
    return envelope.createEnvelope(headers, [
        item
    ]);
}
function createCheckInEnvelopeItem(checkIn) {
    const checkInHeaders = {
        type: 'check_in'
    };
    return [
        checkInHeaders,
        checkIn
    ];
}
exports.createCheckInEnvelope = createCheckInEnvelope; //# sourceMappingURL=checkin.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Maps a log severity level to a log severity number.
 *
 * @see LogSeverityLevel
 */ const SEVERITY_TEXT_TO_SEVERITY_NUMBER = {
    trace: 1,
    debug: 5,
    info: 9,
    warn: 13,
    error: 17,
    fatal: 21
};
exports.SEVERITY_TEXT_TO_SEVERITY_NUMBER = SEVERITY_TEXT_TO_SEVERITY_NUMBER; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/envelope.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
/**
 * Creates a log container envelope item for a list of logs.
 *
 * @param items - The logs to include in the envelope.
 * @returns The created log container envelope item.
 */ function createLogContainerEnvelopeItem(items) {
    return [
        {
            type: 'log',
            item_count: items.length,
            content_type: 'application/vnd.sentry.items.log+json'
        },
        {
            items
        }
    ];
}
/**
 * Creates an envelope for a list of logs.
 *
 * Logs from multiple traces can be included in the same envelope.
 *
 * @param logs - The logs to include in the envelope.
 * @param metadata - The metadata to include in the envelope.
 * @param tunnel - The tunnel to include in the envelope.
 * @param dsn - The DSN to include in the envelope.
 * @returns The created envelope.
 */ function createLogEnvelope(logs, metadata, tunnel, dsn$1) {
    const headers = {};
    if (metadata?.sdk) {
        headers.sdk = {
            name: metadata.sdk.name,
            version: metadata.sdk.version
        };
    }
    if (!!tunnel && !!dsn$1) {
        headers.dsn = dsn.dsnToString(dsn$1);
    }
    return envelope.createEnvelope(headers, [
        createLogContainerEnvelopeItem(logs)
    ]);
}
exports.createLogContainerEnvelopeItem = createLogContainerEnvelopeItem;
exports.createLogEnvelope = createLogEnvelope; //# sourceMappingURL=envelope.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/exports.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/client.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const applyScopeDataToEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/applyScopeDataToEvent.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const spanOnScope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanOnScope.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/constants.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/envelope.js [app-ssr] (ecmascript)");
const MAX_LOG_BUFFER_SIZE = 100;
/**
 * Converts a log attribute to a serialized log attribute.
 *
 * @param key - The key of the log attribute.
 * @param value - The value of the log attribute.
 * @returns The serialized log attribute.
 */ function logAttributeToSerializedLogAttribute(value) {
    switch(typeof value){
        case 'number':
            if (Number.isInteger(value)) {
                return {
                    value,
                    type: 'integer'
                };
            }
            return {
                value,
                type: 'double'
            };
        case 'boolean':
            return {
                value,
                type: 'boolean'
            };
        case 'string':
            return {
                value,
                type: 'string'
            };
        default:
            {
                let stringValue = '';
                try {
                    stringValue = JSON.stringify(value) ?? '';
                } catch  {
                // Do nothing
                }
                return {
                    value: stringValue,
                    type: 'string'
                };
            }
    }
}
/**
 * Sets a log attribute if the value exists and the attribute key is not already present.
 *
 * @param logAttributes - The log attributes object to modify.
 * @param key - The attribute key to set.
 * @param value - The value to set (only sets if truthy and key not present).
 * @param setEvenIfPresent - Whether to set the attribute if it is present. Defaults to true.
 */ function setLogAttribute(logAttributes, key, value, setEvenIfPresent = true) {
    if (value && (!logAttributes[key] || setEvenIfPresent)) {
        logAttributes[key] = value;
    }
}
/**
 * Captures a serialized log event and adds it to the log buffer for the given client.
 *
 * @param client - A client. Uses the current client if not provided.
 * @param serializedLog - The serialized log event to capture.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function _INTERNAL_captureSerializedLog(client, serializedLog) {
    const bufferMap = _getBufferMap();
    const logBuffer = _INTERNAL_getLogBuffer(client);
    if (logBuffer === undefined) {
        bufferMap.set(client, [
            serializedLog
        ]);
    } else {
        bufferMap.set(client, [
            ...logBuffer,
            serializedLog
        ]);
        if (logBuffer.length >= MAX_LOG_BUFFER_SIZE) {
            _INTERNAL_flushLogsBuffer(client, logBuffer);
        }
    }
}
/**
 * Captures a log event and sends it to Sentry.
 *
 * @param log - The log event to capture.
 * @param scope - A scope. Uses the current scope if not provided.
 * @param client - A client. Uses the current client if not provided.
 * @param captureSerializedLog - A function to capture the serialized log.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function _INTERNAL_captureLog(beforeLog, client$1 = currentScopes.getClient(), currentScope = currentScopes.getCurrentScope(), captureSerializedLog = _INTERNAL_captureSerializedLog) {
    if (!client$1) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No client available to capture log.');
        return;
    }
    const { release, environment, enableLogs = false, beforeSendLog } = client$1.getOptions();
    if (!enableLogs) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('logging option not enabled, log will not be captured.');
        return;
    }
    const [, traceContext] = client._getTraceInfoFromScope(client$1, currentScope);
    const processedLogAttributes = {
        ...beforeLog.attributes
    };
    const { user: { id, email, username } } = getMergedScopeData(currentScope);
    setLogAttribute(processedLogAttributes, 'user.id', id, false);
    setLogAttribute(processedLogAttributes, 'user.email', email, false);
    setLogAttribute(processedLogAttributes, 'user.name', username, false);
    setLogAttribute(processedLogAttributes, 'sentry.release', release);
    setLogAttribute(processedLogAttributes, 'sentry.environment', environment);
    const { name, version } = client$1.getSdkMetadata()?.sdk ?? {};
    setLogAttribute(processedLogAttributes, 'sentry.sdk.name', name);
    setLogAttribute(processedLogAttributes, 'sentry.sdk.version', version);
    const beforeLogMessage = beforeLog.message;
    if (is.isParameterizedString(beforeLogMessage)) {
        const { __sentry_template_string__, __sentry_template_values__ = [] } = beforeLogMessage;
        processedLogAttributes['sentry.message.template'] = __sentry_template_string__;
        __sentry_template_values__.forEach((param, index)=>{
            processedLogAttributes[`sentry.message.parameter.${index}`] = param;
        });
    }
    const span = spanOnScope._getSpanForScope(currentScope);
    // Add the parent span ID to the log attributes for trace context
    setLogAttribute(processedLogAttributes, 'sentry.trace.parent_span_id', span?.spanContext().spanId);
    const processedLog = {
        ...beforeLog,
        attributes: processedLogAttributes
    };
    client$1.emit('beforeCaptureLog', processedLog);
    // We need to wrap this in `consoleSandbox` to avoid recursive calls to `beforeSendLog`
    const log = beforeSendLog ? debugLogger.consoleSandbox(()=>beforeSendLog(processedLog)) : processedLog;
    if (!log) {
        client$1.recordDroppedEvent('before_send', 'log_item', 1);
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('beforeSendLog returned null, log will not be captured.');
        return;
    }
    const { level, message, attributes = {}, severityNumber } = log;
    const serializedLog = {
        timestamp: time.timestampInSeconds(),
        level,
        body: message,
        trace_id: traceContext?.trace_id,
        severity_number: severityNumber ?? constants.SEVERITY_TEXT_TO_SEVERITY_NUMBER[level],
        attributes: Object.keys(attributes).reduce((acc, key)=>{
            acc[key] = logAttributeToSerializedLogAttribute(attributes[key]);
            return acc;
        }, {})
    };
    captureSerializedLog(client$1, serializedLog);
    client$1.emit('afterCaptureLog', log);
}
/**
 * Flushes the logs buffer to Sentry.
 *
 * @param client - A client.
 * @param maybeLogBuffer - A log buffer. Uses the log buffer for the given client if not provided.
 *
 * @experimental This method will experience breaking changes. This is not yet part of
 * the stable Sentry SDK API and can be changed or removed without warning.
 */ function _INTERNAL_flushLogsBuffer(client, maybeLogBuffer) {
    const logBuffer = maybeLogBuffer ?? _INTERNAL_getLogBuffer(client) ?? [];
    if (logBuffer.length === 0) {
        return;
    }
    const clientOptions = client.getOptions();
    const envelope$1 = envelope.createLogEnvelope(logBuffer, clientOptions._metadata, clientOptions.tunnel, client.getDsn());
    // Clear the log buffer after envelopes have been constructed.
    _getBufferMap().set(client, []);
    client.emit('flushLogs');
    // sendEnvelope should not throw
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    client.sendEnvelope(envelope$1);
}
/**
 * Returns the log buffer for a given client.
 *
 * Exported for testing purposes.
 *
 * @param client - The client to get the log buffer for.
 * @returns The log buffer for the given client.
 */ function _INTERNAL_getLogBuffer(client) {
    return _getBufferMap().get(client);
}
/**
 * Get the scope data for the current scope after merging with the
 * global scope and isolation scope.
 *
 * @param currentScope - The current scope.
 * @returns The scope data.
 */ function getMergedScopeData(currentScope) {
    const scopeData = currentScopes.getGlobalScope().getScopeData();
    applyScopeDataToEvent.mergeScopeData(scopeData, currentScopes.getIsolationScope().getScopeData());
    applyScopeDataToEvent.mergeScopeData(scopeData, currentScope.getScopeData());
    return scopeData;
}
function _getBufferMap() {
    // The reference to the Client <> LogBuffer map is stored on the carrier to ensure it's always the same
    return carrier.getGlobalSingleton('clientToLogBufferMap', ()=>new WeakMap());
}
exports._INTERNAL_captureLog = _INTERNAL_captureLog;
exports._INTERNAL_captureSerializedLog = _INTERNAL_captureSerializedLog;
exports._INTERNAL_flushLogsBuffer = _INTERNAL_flushLogsBuffer;
exports._INTERNAL_getLogBuffer = _INTERNAL_getLogBuffer;
exports.logAttributeToSerializedLogAttribute = logAttributeToSerializedLogAttribute; //# sourceMappingURL=exports.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventbuilder.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
/**
 * Extracts stack frames from the error.stack string
 */ function parseStackFrames(stackParser, error) {
    return stackParser(error.stack || '', 1);
}
/**
 * Extracts stack frames from the error and builds a Sentry Exception
 */ function exceptionFromError(stackParser, error) {
    const exception = {
        type: error.name || error.constructor.name,
        value: error.message
    };
    const frames = parseStackFrames(stackParser, error);
    if (frames.length) {
        exception.stacktrace = {
            frames
        };
    }
    return exception;
}
/** If a plain object has a property that is an `Error`, return this error. */ function getErrorPropertyFromObject(obj) {
    for(const prop in obj){
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            const value = obj[prop];
            if (value instanceof Error) {
                return value;
            }
        }
    }
    return undefined;
}
function getMessageForObject(exception) {
    if ('name' in exception && typeof exception.name === 'string') {
        let message = `'${exception.name}' captured as exception`;
        if ('message' in exception && typeof exception.message === 'string') {
            message += ` with message '${exception.message}'`;
        }
        return message;
    } else if ('message' in exception && typeof exception.message === 'string') {
        return exception.message;
    }
    const keys = object.extractExceptionKeysForMessage(exception);
    // Some ErrorEvent instances do not have an `error` property, which is why they are not handled before
    // We still want to try to get a decent message for these cases
    if (is.isErrorEvent(exception)) {
        return `Event \`ErrorEvent\` captured as exception with message \`${exception.message}\``;
    }
    const className = getObjectClassName(exception);
    return `${className && className !== 'Object' ? `'${className}'` : 'Object'} captured as exception with keys: ${keys}`;
}
function getObjectClassName(obj) {
    try {
        const prototype = Object.getPrototypeOf(obj);
        return prototype ? prototype.constructor.name : undefined;
    } catch  {
    // ignore errors here
    }
}
function getException(client, mechanism, exception, hint) {
    if (is.isError(exception)) {
        return [
            exception,
            undefined
        ];
    }
    // Mutate this!
    mechanism.synthetic = true;
    if (is.isPlainObject(exception)) {
        const normalizeDepth = client?.getOptions().normalizeDepth;
        const extras = {
            ['__serialized__']: normalize.normalizeToSize(exception, normalizeDepth)
        };
        const errorFromProp = getErrorPropertyFromObject(exception);
        if (errorFromProp) {
            return [
                errorFromProp,
                extras
            ];
        }
        const message = getMessageForObject(exception);
        const ex = hint?.syntheticException || new Error(message);
        ex.message = message;
        return [
            ex,
            extras
        ];
    }
    // This handles when someone does: `throw "something awesome";`
    // We use synthesized Error here so we can extract a (rough) stack trace.
    const ex = hint?.syntheticException || new Error(exception);
    ex.message = `${exception}`;
    return [
        ex,
        undefined
    ];
}
/**
 * Builds and Event from a Exception
 * @hidden
 */ function eventFromUnknownInput(client, stackParser, exception, hint) {
    const providedMechanism = hint?.data && hint.data.mechanism;
    const mechanism = providedMechanism || {
        handled: true,
        type: 'generic'
    };
    const [ex, extras] = getException(client, mechanism, exception, hint);
    const event = {
        exception: {
            values: [
                exceptionFromError(stackParser, ex)
            ]
        }
    };
    if (extras) {
        event.extra = extras;
    }
    misc.addExceptionTypeValue(event, undefined, undefined);
    misc.addExceptionMechanism(event, mechanism);
    return {
        ...event,
        event_id: hint?.event_id
    };
}
/**
 * Builds and Event from a Message
 * @hidden
 */ function eventFromMessage(stackParser, message, level = 'info', hint, attachStacktrace) {
    const event = {
        event_id: hint?.event_id,
        level
    };
    if (attachStacktrace && hint?.syntheticException) {
        const frames = parseStackFrames(stackParser, hint.syntheticException);
        if (frames.length) {
            event.exception = {
                values: [
                    {
                        value: message,
                        stacktrace: {
                            frames
                        }
                    }
                ]
            };
            misc.addExceptionMechanism(event, {
                synthetic: true
            });
        }
    }
    if (is.isParameterizedString(message)) {
        const { __sentry_template_string__, __sentry_template_values__ } = message;
        event.logentry = {
            message: __sentry_template_string__,
            params: __sentry_template_values__
        };
        return event;
    }
    event.message = message;
    return event;
}
exports.eventFromMessage = eventFromMessage;
exports.eventFromUnknownInput = eventFromUnknownInput;
exports.exceptionFromError = exceptionFromError;
exports.parseStackFrames = parseStackFrames; //# sourceMappingURL=eventbuilder.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/server-runtime-client.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const checkin = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/checkin.js [app-ssr] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/client.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/exports.js [app-ssr] (ecmascript)");
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/errors.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventbuilder.js [app-ssr] (ecmascript)");
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
// TODO: Make this configurable
const DEFAULT_LOG_FLUSH_INTERVAL = 5000;
/**
 * The Sentry Server Runtime Client SDK.
 */ class ServerRuntimeClient extends client.Client {
    /**
   * Creates a new Edge SDK instance.
   * @param options Configuration options for this SDK.
   */ constructor(options){
        // Server clients always support tracing
        errors.registerSpanErrorInstrumentation();
        super(options);
        this._logWeight = 0;
        if (this._options.enableLogs) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const client = this;
            client.on('flushLogs', ()=>{
                client._logWeight = 0;
                clearTimeout(client._logFlushIdleTimeout);
            });
            client.on('afterCaptureLog', (log)=>{
                client._logWeight += estimateLogSizeInBytes(log);
                // We flush the logs buffer if it exceeds 0.8 MB
                // The log weight is a rough estimate, so we flush way before
                // the payload gets too big.
                if (client._logWeight >= 800000) {
                    exports$1._INTERNAL_flushLogsBuffer(client);
                } else {
                    // start an idle timeout to flush the logs buffer if no logs are captured for a while
                    client._logFlushIdleTimeout = setTimeout(()=>{
                        exports$1._INTERNAL_flushLogsBuffer(client);
                    }, DEFAULT_LOG_FLUSH_INTERVAL);
                }
            });
            client.on('flush', ()=>{
                exports$1._INTERNAL_flushLogsBuffer(client);
            });
        }
    }
    /**
   * @inheritDoc
   */ eventFromException(exception, hint) {
        const event = eventbuilder.eventFromUnknownInput(this, this._options.stackParser, exception, hint);
        event.level = 'error';
        return syncpromise.resolvedSyncPromise(event);
    }
    /**
   * @inheritDoc
   */ eventFromMessage(message, level = 'info', hint) {
        return syncpromise.resolvedSyncPromise(eventbuilder.eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace));
    }
    /**
   * @inheritDoc
   */ captureException(exception, hint, scope) {
        setCurrentRequestSessionErroredOrCrashed(hint);
        return super.captureException(exception, hint, scope);
    }
    /**
   * @inheritDoc
   */ captureEvent(event, hint, scope) {
        // If the event is of type Exception, then a request session should be captured
        const isException = !event.type && event.exception?.values && event.exception.values.length > 0;
        if (isException) {
            setCurrentRequestSessionErroredOrCrashed(hint);
        }
        return super.captureEvent(event, hint, scope);
    }
    /**
   * Create a cron monitor check in and send it to Sentry.
   *
   * @param checkIn An object that describes a check in.
   * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
   * to create a monitor automatically when sending a check in.
   */ captureCheckIn(checkIn, monitorConfig, scope) {
        const id = 'checkInId' in checkIn && checkIn.checkInId ? checkIn.checkInId : misc.uuid4();
        if (!this._isEnabled()) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('SDK not enabled, will not capture check-in.');
            return id;
        }
        const options = this.getOptions();
        const { release, environment, tunnel } = options;
        const serializedCheckIn = {
            check_in_id: id,
            monitor_slug: checkIn.monitorSlug,
            status: checkIn.status,
            release,
            environment
        };
        if ('duration' in checkIn) {
            serializedCheckIn.duration = checkIn.duration;
        }
        if (monitorConfig) {
            serializedCheckIn.monitor_config = {
                schedule: monitorConfig.schedule,
                checkin_margin: monitorConfig.checkinMargin,
                max_runtime: monitorConfig.maxRuntime,
                timezone: monitorConfig.timezone,
                failure_issue_threshold: monitorConfig.failureIssueThreshold,
                recovery_threshold: monitorConfig.recoveryThreshold
            };
        }
        const [dynamicSamplingContext, traceContext] = client._getTraceInfoFromScope(this, scope);
        if (traceContext) {
            serializedCheckIn.contexts = {
                trace: traceContext
            };
        }
        const envelope = checkin.createCheckInEnvelope(serializedCheckIn, dynamicSamplingContext, this.getSdkMetadata(), tunnel, this.getDsn());
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('Sending checkin:', checkIn.monitorSlug, checkIn.status);
        // sendEnvelope should not throw
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.sendEnvelope(envelope);
        return id;
    }
    /**
   * @inheritDoc
   */ _prepareEvent(event, hint, currentScope, isolationScope) {
        if (this._options.platform) {
            event.platform = event.platform || this._options.platform;
        }
        if (this._options.runtime) {
            event.contexts = {
                ...event.contexts,
                runtime: event.contexts?.runtime || this._options.runtime
            };
        }
        if (this._options.serverName) {
            event.server_name = event.server_name || this._options.serverName;
        }
        return super._prepareEvent(event, hint, currentScope, isolationScope);
    }
}
function setCurrentRequestSessionErroredOrCrashed(eventHint) {
    const requestSession = currentScopes.getIsolationScope().getScopeData().sdkProcessingMetadata.requestSession;
    if (requestSession) {
        // We mutate instead of doing `setSdkProcessingMetadata` because the http integration stores away a particular
        // isolationScope. If that isolation scope is forked, setting the processing metadata here will not mutate the
        // original isolation scope that the http integration stored away.
        const isHandledException = eventHint?.mechanism?.handled ?? true;
        // A request session can go from "errored" -> "crashed" but not "crashed" -> "errored".
        // Crashed (unhandled exception) is worse than errored (handled exception).
        if (isHandledException && requestSession.status !== 'crashed') {
            requestSession.status = 'errored';
        } else if (!isHandledException) {
            requestSession.status = 'crashed';
        }
    }
}
/**
 * Estimate the size of a log in bytes.
 *
 * @param log - The log to estimate the size of.
 * @returns The estimated size of the log in bytes.
 */ function estimateLogSizeInBytes(log) {
    let weight = 0;
    // Estimate byte size of 2 bytes per character. This is a rough estimate JS strings are stored as UTF-16.
    if (log.message) {
        weight += log.message.length * 2;
    }
    if (log.attributes) {
        Object.values(log.attributes).forEach((value)=>{
            if (Array.isArray(value)) {
                weight += value.length * estimatePrimitiveSizeInBytes(value[0]);
            } else if (is.isPrimitive(value)) {
                weight += estimatePrimitiveSizeInBytes(value);
            } else {
                // For objects values, we estimate the size of the object as 100 bytes
                weight += 100;
            }
        });
    }
    return weight;
}
function estimatePrimitiveSizeInBytes(value) {
    if (typeof value === 'string') {
        return value.length * 2;
    } else if (typeof value === 'number') {
        return 8;
    } else if (typeof value === 'boolean') {
        return 4;
    }
    return 0;
}
exports.ServerRuntimeClient = ServerRuntimeClient; //# sourceMappingURL=server-runtime-client.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/sdk.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
/** A class object that can instantiate Client objects. */ /**
 * Internal function to create a new SDK client instance. The client is
 * installed and then bound to the current scope.
 *
 * @param clientClass The client class to instantiate.
 * @param options Options to pass to the client.
 */ function initAndBind(clientClass, options) {
    if (options.debug === true) {
        if (debugBuild.DEBUG_BUILD) {
            debugLogger.debug.enable();
        } else {
            // use `console.warn` rather than `debug.warn` since by non-debug bundles have all `debug.x` statements stripped
            debugLogger.consoleSandbox(()=>{
                // eslint-disable-next-line no-console
                console.warn('[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.');
            });
        }
    }
    const scope = currentScopes.getCurrentScope();
    scope.update(options.initialScope);
    const client = new clientClass(options);
    setCurrentClient(client);
    client.init();
    return client;
}
/**
 * Make the given client the current client.
 */ function setCurrentClient(client) {
    currentScopes.getCurrentScope().setClient(client);
}
exports.initAndBind = initAndBind;
exports.setCurrentClient = setCurrentClient; //# sourceMappingURL=sdk.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/promisebuffer.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
const SENTRY_BUFFER_FULL_ERROR = Symbol.for('SentryBufferFullError');
/**
 * Creates an new PromiseBuffer object with the specified limit
 * @param limit max number of promises that can be stored in the buffer
 */ function makePromiseBuffer(limit) {
    const buffer = [];
    function isReady() {
        return limit === undefined || buffer.length < limit;
    }
    /**
   * Remove a promise from the queue.
   *
   * @param task Can be any PromiseLike<T>
   * @returns Removed promise.
   */ function remove(task) {
        return buffer.splice(buffer.indexOf(task), 1)[0] || Promise.resolve(undefined);
    }
    /**
   * Add a promise (representing an in-flight action) to the queue, and set it to remove itself on fulfillment.
   *
   * @param taskProducer A function producing any PromiseLike<T>; In previous versions this used to be `task:
   *        PromiseLike<T>`, but under that model, Promises were instantly created on the call-site and their executor
   *        functions therefore ran immediately. Thus, even if the buffer was full, the action still happened. By
   *        requiring the promise to be wrapped in a function, we can defer promise creation until after the buffer
   *        limit check.
   * @returns The original promise.
   */ function add(taskProducer) {
        if (!isReady()) {
            return syncpromise.rejectedSyncPromise(SENTRY_BUFFER_FULL_ERROR);
        }
        // start the task and add its promise to the queue
        const task = taskProducer();
        if (buffer.indexOf(task) === -1) {
            buffer.push(task);
        }
        void task.then(()=>remove(task))// Use `then(null, rejectionHandler)` rather than `catch(rejectionHandler)` so that we can use `PromiseLike`
        // rather than `Promise`. `PromiseLike` doesn't have a `.catch` method, making its polyfill smaller. (ES5 didn't
        // have promises, so TS has to polyfill when down-compiling.)
        .then(null, ()=>remove(task).then(null, ()=>{
            // We have to add another catch here because `remove()` starts a new promise chain.
            }));
        return task;
    }
    /**
   * Wait for all promises in the queue to resolve or for timeout to expire, whichever comes first.
   *
   * @param timeout The time, in ms, after which to resolve to `false` if the queue is still non-empty. Passing `0` (or
   * not passing anything) will make the promise wait as long as it takes for the queue to drain before resolving to
   * `true`.
   * @returns A promise which will resolve to `true` if the queue is already empty or drains before the timeout, and
   * `false` otherwise
   */ function drain(timeout) {
        return new syncpromise.SyncPromise((resolve, reject)=>{
            let counter = buffer.length;
            if (!counter) {
                return resolve(true);
            }
            // wait for `timeout` ms and then resolve to `false` (if not cancelled first)
            const capturedSetTimeout = setTimeout(()=>{
                if (timeout && timeout > 0) {
                    resolve(false);
                }
            }, timeout);
            // if all promises resolve in time, cancel the timer and resolve to `true`
            buffer.forEach((item)=>{
                void syncpromise.resolvedSyncPromise(item).then(()=>{
                    if (!--counter) {
                        clearTimeout(capturedSetTimeout);
                        resolve(true);
                    }
                }, reject);
            });
        });
    }
    return {
        $: buffer,
        add,
        drain
    };
}
exports.SENTRY_BUFFER_FULL_ERROR = SENTRY_BUFFER_FULL_ERROR;
exports.makePromiseBuffer = makePromiseBuffer; //# sourceMappingURL=promisebuffer.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ratelimit.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Intentionally keeping the key broad, as we don't know for sure what rate limit headers get returned from backend
const DEFAULT_RETRY_AFTER = 60 * 1000; // 60 seconds
/**
 * Extracts Retry-After value from the request header or returns default value
 * @param header string representation of 'Retry-After' header
 * @param now current unix timestamp
 *
 */ function parseRetryAfterHeader(header, now = Date.now()) {
    const headerDelay = parseInt(`${header}`, 10);
    if (!isNaN(headerDelay)) {
        return headerDelay * 1000;
    }
    const headerDate = Date.parse(`${header}`);
    if (!isNaN(headerDate)) {
        return headerDate - now;
    }
    return DEFAULT_RETRY_AFTER;
}
/**
 * Gets the time that the given category is disabled until for rate limiting.
 * In case no category-specific limit is set but a general rate limit across all categories is active,
 * that time is returned.
 *
 * @return the time in ms that the category is disabled until or 0 if there's no active rate limit.
 */ function disabledUntil(limits, dataCategory) {
    return limits[dataCategory] || limits.all || 0;
}
/**
 * Checks if a category is rate limited
 */ function isRateLimited(limits, dataCategory, now = Date.now()) {
    return disabledUntil(limits, dataCategory) > now;
}
/**
 * Update ratelimits from incoming headers.
 *
 * @return the updated RateLimits object.
 */ function updateRateLimits(limits, { statusCode, headers }, now = Date.now()) {
    const updatedRateLimits = {
        ...limits
    };
    // "The name is case-insensitive."
    // https://developer.mozilla.org/en-US/docs/Web/API/Headers/get
    const rateLimitHeader = headers?.['x-sentry-rate-limits'];
    const retryAfterHeader = headers?.['retry-after'];
    if (rateLimitHeader) {
        /**
     * rate limit headers are of the form
     *     <header>,<header>,..
     * where each <header> is of the form
     *     <retry_after>: <categories>: <scope>: <reason_code>: <namespaces>
     * where
     *     <retry_after> is a delay in seconds
     *     <categories> is the event type(s) (error, transaction, etc) being rate limited and is of the form
     *         <category>;<category>;...
     *     <scope> is what's being limited (org, project, or key) - ignored by SDK
     *     <reason_code> is an arbitrary string like "org_quota" - ignored by SDK
     *     <namespaces> Semicolon-separated list of metric namespace identifiers. Defines which namespace(s) will be affected.
     *         Only present if rate limit applies to the metric_bucket data category.
     */ for (const limit of rateLimitHeader.trim().split(',')){
            const [retryAfter, categories, , , namespaces] = limit.split(':', 5);
            const headerDelay = parseInt(retryAfter, 10);
            const delay = (!isNaN(headerDelay) ? headerDelay : 60) * 1000; // 60sec default
            if (!categories) {
                updatedRateLimits.all = now + delay;
            } else {
                for (const category of categories.split(';')){
                    if (category === 'metric_bucket') {
                        // namespaces will be present when category === 'metric_bucket'
                        if (!namespaces || namespaces.split(';').includes('custom')) {
                            updatedRateLimits[category] = now + delay;
                        }
                    } else {
                        updatedRateLimits[category] = now + delay;
                    }
                }
            }
        }
    } else if (retryAfterHeader) {
        updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
    } else if (statusCode === 429) {
        updatedRateLimits.all = now + 60 * 1000;
    }
    return updatedRateLimits;
}
exports.DEFAULT_RETRY_AFTER = DEFAULT_RETRY_AFTER;
exports.disabledUntil = disabledUntil;
exports.isRateLimited = isRateLimited;
exports.parseRetryAfterHeader = parseRetryAfterHeader;
exports.updateRateLimits = updateRateLimits; //# sourceMappingURL=ratelimit.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/base.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const promisebuffer = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/promisebuffer.js [app-ssr] (ecmascript)");
const ratelimit = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ratelimit.js [app-ssr] (ecmascript)");
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
const DEFAULT_TRANSPORT_BUFFER_SIZE = 64;
/**
 * Creates an instance of a Sentry `Transport`
 *
 * @param options
 * @param makeRequest
 */ function createTransport(options, makeRequest, buffer = promisebuffer.makePromiseBuffer(options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE)) {
    let rateLimits = {};
    const flush = (timeout)=>buffer.drain(timeout);
    function send(envelope$1) {
        const filteredEnvelopeItems = [];
        // Drop rate limited items from envelope
        envelope.forEachEnvelopeItem(envelope$1, (item, type)=>{
            const dataCategory = envelope.envelopeItemTypeToDataCategory(type);
            if (ratelimit.isRateLimited(rateLimits, dataCategory)) {
                options.recordDroppedEvent('ratelimit_backoff', dataCategory);
            } else {
                filteredEnvelopeItems.push(item);
            }
        });
        // Skip sending if envelope is empty after filtering out rate limited events
        if (filteredEnvelopeItems.length === 0) {
            return syncpromise.resolvedSyncPromise({});
        }
        const filteredEnvelope = envelope.createEnvelope(envelope$1[0], filteredEnvelopeItems);
        // Creates client report for each item in an envelope
        const recordEnvelopeLoss = (reason)=>{
            envelope.forEachEnvelopeItem(filteredEnvelope, (item, type)=>{
                options.recordDroppedEvent(reason, envelope.envelopeItemTypeToDataCategory(type));
            });
        };
        const requestTask = ()=>makeRequest({
                body: envelope.serializeEnvelope(filteredEnvelope)
            }).then((response)=>{
                // We don't want to throw on NOK responses, but we want to at least log them
                if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode >= 300)) {
                    debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
                }
                rateLimits = ratelimit.updateRateLimits(rateLimits, response);
                return response;
            }, (error)=>{
                recordEnvelopeLoss('network_error');
                debugBuild.DEBUG_BUILD && debugLogger.debug.error('Encountered error running transport request:', error);
                throw error;
            });
        return buffer.add(requestTask).then((result)=>result, (error)=>{
            if (error === promisebuffer.SENTRY_BUFFER_FULL_ERROR) {
                debugBuild.DEBUG_BUILD && debugLogger.debug.error('Skipped sending event because buffer is full.');
                recordEnvelopeLoss('queue_overflow');
                return syncpromise.resolvedSyncPromise({});
            } else {
                throw error;
            }
        });
    }
    return {
        send,
        flush
    };
}
exports.DEFAULT_TRANSPORT_BUFFER_SIZE = DEFAULT_TRANSPORT_BUFFER_SIZE;
exports.createTransport = createTransport; //# sourceMappingURL=base.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/offline.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const ratelimit = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ratelimit.js [app-ssr] (ecmascript)");
const MIN_DELAY = 100; // 100 ms
const START_DELAY = 5000; // 5 seconds
const MAX_DELAY = 3.6e6; // 1 hour
/**
 * Wraps a transport and stores and retries events when they fail to send.
 *
 * @param createTransport The transport to wrap.
 */ function makeOfflineTransport(createTransport) {
    function log(...args) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.log('[Offline]:', ...args);
    }
    return (options)=>{
        const transport = createTransport(options);
        if (!options.createStore) {
            throw new Error('No `createStore` function was provided');
        }
        const store = options.createStore(options);
        let retryDelay = START_DELAY;
        let flushTimer;
        function shouldQueue(env, error, retryDelay) {
            // We want to drop client reports because they can be generated when we retry sending events while offline.
            if (envelope.envelopeContainsItemType(env, [
                'client_report'
            ])) {
                return false;
            }
            if (options.shouldStore) {
                return options.shouldStore(env, error, retryDelay);
            }
            return true;
        }
        function flushIn(delay) {
            if (flushTimer) {
                clearTimeout(flushTimer);
            }
            flushTimer = setTimeout(async ()=>{
                flushTimer = undefined;
                const found = await store.shift();
                if (found) {
                    log('Attempting to send previously queued event');
                    // We should to update the sent_at timestamp to the current time.
                    found[0].sent_at = new Date().toISOString();
                    void send(found, true).catch((e)=>{
                        log('Failed to retry sending', e);
                    });
                }
            }, delay);
            // We need to unref the timer in node.js, otherwise the node process never exit.
            if (typeof flushTimer !== 'number' && flushTimer.unref) {
                flushTimer.unref();
            }
        }
        function flushWithBackOff() {
            if (flushTimer) {
                return;
            }
            flushIn(retryDelay);
            retryDelay = Math.min(retryDelay * 2, MAX_DELAY);
        }
        async function send(envelope$1, isRetry = false) {
            // We queue all replay envelopes to avoid multiple replay envelopes being sent at the same time. If one fails, we
            // need to retry them in order.
            if (!isRetry && envelope.envelopeContainsItemType(envelope$1, [
                'replay_event',
                'replay_recording'
            ])) {
                await store.push(envelope$1);
                flushIn(MIN_DELAY);
                return {};
            }
            try {
                if (options.shouldSend && await options.shouldSend(envelope$1) === false) {
                    throw new Error('Envelope not sent because `shouldSend` callback returned false');
                }
                const result = await transport.send(envelope$1);
                let delay = MIN_DELAY;
                if (result) {
                    // If there's a retry-after header, use that as the next delay.
                    if (result.headers?.['retry-after']) {
                        delay = ratelimit.parseRetryAfterHeader(result.headers['retry-after']);
                    } else if (result.headers?.['x-sentry-rate-limits']) {
                        delay = 60000; // 60 seconds
                    } else if ((result.statusCode || 0) >= 400) {
                        return result;
                    }
                }
                flushIn(delay);
                retryDelay = START_DELAY;
                return result;
            } catch (e) {
                if (await shouldQueue(envelope$1, e, retryDelay)) {
                    // If this envelope was a retry, we want to add it to the front of the queue so it's retried again first.
                    if (isRetry) {
                        await store.unshift(envelope$1);
                    } else {
                        await store.push(envelope$1);
                    }
                    flushWithBackOff();
                    log('Error sending. Event queued.', e);
                    return {};
                } else {
                    throw e;
                }
            }
        }
        if (options.flushAtStartup) {
            flushWithBackOff();
        }
        return {
            send,
            flush: (timeout)=>{
                // If there's no timeout, we should attempt to flush the offline queue.
                if (timeout === undefined) {
                    retryDelay = START_DELAY;
                    flushIn(MIN_DELAY);
                }
                return transport.flush(timeout);
            }
        };
    };
}
exports.MIN_DELAY = MIN_DELAY;
exports.START_DELAY = START_DELAY;
exports.makeOfflineTransport = makeOfflineTransport; //# sourceMappingURL=offline.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/multiplexed.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/api.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
/**
 * Gets an event from an envelope.
 *
 * This is only exported for use in the tests
 */ function eventFromEnvelope(env, types) {
    let event;
    envelope.forEachEnvelopeItem(env, (item, type)=>{
        if (types.includes(type)) {
            event = Array.isArray(item) ? item[1] : undefined;
        }
        // bail out if we found an event
        return !!event;
    });
    return event;
}
/**
 * Creates a transport that overrides the release on all events.
 */ function makeOverrideReleaseTransport(createTransport, release) {
    return (options)=>{
        const transport = createTransport(options);
        return {
            ...transport,
            send: async (envelope)=>{
                const event = eventFromEnvelope(envelope, [
                    'event',
                    'transaction',
                    'profile',
                    'replay_event'
                ]);
                if (event) {
                    event.release = release;
                }
                return transport.send(envelope);
            }
        };
    };
}
/** Overrides the DSN in the envelope header  */ function overrideDsn(envelope$1, dsn) {
    return envelope.createEnvelope(dsn ? {
        ...envelope$1[0],
        dsn
    } : envelope$1[0], envelope$1[1]);
}
/**
 * Creates a transport that can send events to different DSNs depending on the envelope contents.
 */ function makeMultiplexedTransport(createTransport, matcher) {
    return (options)=>{
        const fallbackTransport = createTransport(options);
        const otherTransports = new Map();
        function getTransport(dsn$1, release) {
            // We create a transport for every unique dsn/release combination as there may be code from multiple releases in
            // use at the same time
            const key = release ? `${dsn$1}:${release}` : dsn$1;
            let transport = otherTransports.get(key);
            if (!transport) {
                const validatedDsn = dsn.dsnFromString(dsn$1);
                if (!validatedDsn) {
                    return undefined;
                }
                const url = api.getEnvelopeEndpointWithUrlEncodedAuth(validatedDsn, options.tunnel);
                transport = release ? makeOverrideReleaseTransport(createTransport, release)({
                    ...options,
                    url
                }) : createTransport({
                    ...options,
                    url
                });
                otherTransports.set(key, transport);
            }
            return [
                dsn$1,
                transport
            ];
        }
        async function send(envelope) {
            function getEvent(types) {
                const eventTypes = types?.length ? types : [
                    'event'
                ];
                return eventFromEnvelope(envelope, eventTypes);
            }
            const transports = matcher({
                envelope,
                getEvent
            }).map((result)=>{
                if (typeof result === 'string') {
                    return getTransport(result, undefined);
                } else {
                    return getTransport(result.dsn, result.release);
                }
            }).filter((t)=>!!t);
            // If we have no transports to send to, use the fallback transport
            // Don't override the DSN in the header for the fallback transport. '' is falsy
            const transportsWithFallback = transports.length ? transports : [
                [
                    '',
                    fallbackTransport
                ]
            ];
            const results = await Promise.all(transportsWithFallback.map(([dsn, transport])=>transport.send(overrideDsn(envelope, dsn))));
            return results[0];
        }
        async function flush(timeout) {
            const allTransports = [
                ...otherTransports.values(),
                fallbackTransport
            ];
            const results = await Promise.all(allTransports.map((transport)=>transport.flush(timeout)));
            return results.every((r)=>r);
        }
        return {
            send,
            flush
        };
    };
}
exports.eventFromEnvelope = eventFromEnvelope;
exports.makeMultiplexedTransport = makeMultiplexedTransport; //# sourceMappingURL=multiplexed.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/isSentryRequestUrl.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Checks whether given url points to Sentry server
 *
 * @param url url to verify
 */ function isSentryRequestUrl(url, client) {
    const dsn = client?.getDsn();
    const tunnel = client?.getOptions().tunnel;
    return checkDsn(url, dsn) || checkTunnel(url, tunnel);
}
function checkTunnel(url, tunnel) {
    if (!tunnel) {
        return false;
    }
    return removeTrailingSlash(url) === removeTrailingSlash(tunnel);
}
function checkDsn(url, dsn) {
    return dsn ? url.includes(dsn.host) : false;
}
function removeTrailingSlash(str) {
    return str[str.length - 1] === '/' ? str.slice(0, -1) : str;
}
exports.isSentryRequestUrl = isSentryRequestUrl; //# sourceMappingURL=isSentryRequestUrl.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parameterize.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Tagged template function which returns parameterized representation of the message
 * For example: parameterize`This is a log statement with ${x} and ${y} params`, would return:
 * "__sentry_template_string__": 'This is a log statement with %s and %s params',
 * "__sentry_template_values__": ['first', 'second']
 *
 * @param strings An array of string values splitted between expressions
 * @param values Expressions extracted from template string
 *
 * @returns A `ParameterizedString` object that can be passed into `captureMessage` or Sentry.logger.X methods.
 */ function parameterize(strings, ...values) {
    const formatted = new String(String.raw(strings, ...values));
    formatted.__sentry_template_string__ = strings.join('\x00').replace(/%/g, '%%').replace(/\0/g, '%s');
    formatted.__sentry_template_values__ = values;
    return formatted;
}
/**
 * Tagged template function which returns parameterized representation of the message.
 *
 * @param strings An array of string values splitted between expressions
 * @param values Expressions extracted from template string
 * @returns A `ParameterizedString` object that can be passed into `captureMessage` or Sentry.logger.X methods.
 */ const fmt = parameterize;
exports.fmt = fmt;
exports.parameterize = parameterize; //# sourceMappingURL=parameterize.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ipAddress.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// By default, we want to infer the IP address, unless this is explicitly set to `null`
// We do this after all other processing is done
// If `ip_address` is explicitly set to `null` or a value, we leave it as is
/**
 * @internal
 * @deprecated -- set ip inferral via via SDK metadata options on client instead.
 */ function addAutoIpAddressToUser(objWithMaybeUser) {
    if (objWithMaybeUser.user?.ip_address === undefined) {
        objWithMaybeUser.user = {
            ...objWithMaybeUser.user,
            ip_address: '{{auto}}'
        };
    }
}
/**
 * @internal
 */ function addAutoIpAddressToSession(session) {
    if ('aggregates' in session) {
        if (session.attrs?.['ip_address'] === undefined) {
            session.attrs = {
                ...session.attrs,
                ip_address: '{{auto}}'
            };
        }
    } else {
        if (session.ipAddress === undefined) {
            session.ipAddress = '{{auto}}';
        }
    }
}
exports.addAutoIpAddressToSession = addAutoIpAddressToSession;
exports.addAutoIpAddressToUser = addAutoIpAddressToUser; //# sourceMappingURL=ipAddress.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/sdkMetadata.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const version = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/version.js [app-ssr] (ecmascript)");
/**
 * A builder for the SDK metadata in the options for the SDK initialization.
 *
 * Note: This function is identical to `buildMetadata` in Remix and NextJS and SvelteKit.
 * We don't extract it for bundle size reasons.
 * @see https://github.com/getsentry/sentry-javascript/pull/7404
 * @see https://github.com/getsentry/sentry-javascript/pull/4196
 *
 * If you make changes to this function consider updating the others as well.
 *
 * @param options SDK options object that gets mutated
 * @param names list of package names
 */ function applySdkMetadata(options, name, names = [
    name
], source = 'npm') {
    const metadata = options._metadata || {};
    if (!metadata.sdk) {
        metadata.sdk = {
            name: `sentry.javascript.${name}`,
            packages: names.map((name)=>({
                    name: `${source}:@sentry/${name}`,
                    version: version.SDK_VERSION
                })),
            version: version.SDK_VERSION
        };
    }
    options._metadata = metadata;
}
exports.applySdkMetadata = applySdkMetadata; //# sourceMappingURL=sdkMetadata.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/traceData.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const tracing = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/tracing.js [app-ssr] (ecmascript)");
/**
 * Extracts trace propagation data from the current span or from the client's scope (via transaction or propagation
 * context) and serializes it to `sentry-trace` and `baggage` values to strings. These values can be used to propagate
 * a trace via our tracing Http headers or Html `<meta>` tags.
 *
 * This function also applies some validation to the generated sentry-trace and baggage values to ensure that
 * only valid strings are returned.
 *
 * @returns an object with the tracing data values. The object keys are the name of the tracing key to be used as header
 * or meta tag name.
 */ function getTraceData(options = {}) {
    const client = options.client || currentScopes.getClient();
    if (!exports$1.isEnabled() || !client) {
        return {};
    }
    const carrier$1 = carrier.getMainCarrier();
    const acs = index.getAsyncContextStrategy(carrier$1);
    if (acs.getTraceData) {
        return acs.getTraceData(options);
    }
    const scope = options.scope || currentScopes.getCurrentScope();
    const span = options.span || spanUtils.getActiveSpan();
    const sentryTrace = span ? spanUtils.spanToTraceHeader(span) : scopeToTraceHeader(scope);
    const dsc = span ? dynamicSamplingContext.getDynamicSamplingContextFromSpan(span) : dynamicSamplingContext.getDynamicSamplingContextFromScope(client, scope);
    const baggage$1 = baggage.dynamicSamplingContextToSentryBaggageHeader(dsc);
    const isValidSentryTraceHeader = tracing.TRACEPARENT_REGEXP.test(sentryTrace);
    if (!isValidSentryTraceHeader) {
        debugLogger.debug.warn('Invalid sentry-trace data. Cannot generate trace data');
        return {};
    }
    return {
        'sentry-trace': sentryTrace,
        baggage: baggage$1
    };
}
/**
 * Get a sentry-trace header value for the given scope.
 */ function scopeToTraceHeader(scope) {
    const { traceId, sampled, propagationSpanId } = scope.getPropagationContext();
    return tracing.generateSentryTraceHeader(traceId, propagationSpanId, sampled);
}
exports.getTraceData = getTraceData; //# sourceMappingURL=traceData.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/meta.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const traceData = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/traceData.js [app-ssr] (ecmascript)");
/**
 * Returns a string of meta tags that represent the current trace data.
 *
 * You can use this to propagate a trace from your server-side rendered Html to the browser.
 * This function returns up to two meta tags, `sentry-trace` and `baggage`, depending on the
 * current trace data state.
 *
 * @example
 * Usage example:
 *
 * ```js
 * function renderHtml() {
 *   return `
 *     <head>
 *       ${getTraceMetaTags()}
 *     </head>
 *   `;
 * }
 * ```
 *
 */ function getTraceMetaTags(traceData$1) {
    return Object.entries(traceData$1 || traceData.getTraceData()).map(([key, value])=>`<meta name="${key}" content="${value}"/>`).join('\n');
}
exports.getTraceMetaTags = getTraceMetaTags; //# sourceMappingURL=meta.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debounce.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Heavily simplified debounce function based on lodash.debounce.
 *
 * This function takes a callback function (@param fun) and delays its invocation
 * by @param wait milliseconds. Optionally, a maxWait can be specified in @param options,
 * which ensures that the callback is invoked at least once after the specified max. wait time.
 *
 * @param func the function whose invocation is to be debounced
 * @param wait the minimum time until the function is invoked after it was called once
 * @param options the options object, which can contain the `maxWait` property
 *
 * @returns the debounced version of the function, which needs to be called at least once to start the
 *          debouncing process. Subsequent calls will reset the debouncing timer and, in case @paramfunc
 *          was already invoked in the meantime, return @param func's return value.
 *          The debounced function has two additional properties:
 *          - `flush`: Invokes the debounced function immediately and returns its return value
 *          - `cancel`: Cancels the debouncing process and resets the debouncing timer
 */ function debounce(func, wait, options) {
    let callbackReturnValue;
    let timerId;
    let maxTimerId;
    const maxWait = options?.maxWait ? Math.max(options.maxWait, wait) : 0;
    const setTimeoutImpl = options?.setTimeoutImpl || setTimeout;
    function invokeFunc() {
        cancelTimers();
        callbackReturnValue = func();
        return callbackReturnValue;
    }
    function cancelTimers() {
        timerId !== undefined && clearTimeout(timerId);
        maxTimerId !== undefined && clearTimeout(maxTimerId);
        timerId = maxTimerId = undefined;
    }
    function flush() {
        if (timerId !== undefined || maxTimerId !== undefined) {
            return invokeFunc();
        }
        return callbackReturnValue;
    }
    function debounced() {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeoutImpl(invokeFunc, wait);
        if (maxWait && maxTimerId === undefined) {
            maxTimerId = setTimeoutImpl(invokeFunc, maxWait);
        }
        return callbackReturnValue;
    }
    debounced.cancel = cancelTimers;
    debounced.flush = flush;
    return debounced;
}
exports.debounce = debounce; //# sourceMappingURL=debounce.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/request.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Transforms a `Headers` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into a simple key-value dict.
 * The header keys will be lower case: e.g. A "Content-Type" header will be stored as "content-type".
 */ function winterCGHeadersToDict(winterCGHeaders) {
    const headers = {};
    try {
        winterCGHeaders.forEach((value, key)=>{
            if (typeof value === 'string') {
                // We check that value is a string even though it might be redundant to make sure prototype pollution is not possible.
                headers[key] = value;
            }
        });
    } catch  {
    // just return the empty headers
    }
    return headers;
}
/**
 * Convert common request headers to a simple dictionary.
 */ function headersToDict(reqHeaders) {
    const headers = Object.create(null);
    try {
        Object.entries(reqHeaders).forEach(([key, value])=>{
            if (typeof value === 'string') {
                headers[key] = value;
            }
        });
    } catch  {
    // just return the empty headers
    }
    return headers;
}
/**
 * Converts a `Request` object that implements the `Web Fetch API` (https://developer.mozilla.org/en-US/docs/Web/API/Headers) into the format that the `RequestData` integration understands.
 */ function winterCGRequestToRequestData(req) {
    const headers = winterCGHeadersToDict(req.headers);
    return {
        method: req.method,
        url: req.url,
        query_string: extractQueryParamsFromUrl(req.url),
        headers
    };
}
/**
 * Convert a HTTP request object to RequestEventData to be passed as normalizedRequest.
 * Instead of allowing `PolymorphicRequest` to be passed,
 * we want to be more specific and generally require a http.IncomingMessage-like object.
 */ function httpRequestToRequestData(request) {
    const headers = request.headers || {};
    // Check for x-forwarded-host first, then fall back to host header
    const forwardedHost = typeof headers['x-forwarded-host'] === 'string' ? headers['x-forwarded-host'] : undefined;
    const host = forwardedHost || (typeof headers.host === 'string' ? headers.host : undefined);
    // Check for x-forwarded-proto first, then fall back to existing protocol detection
    const forwardedProto = typeof headers['x-forwarded-proto'] === 'string' ? headers['x-forwarded-proto'] : undefined;
    const protocol = forwardedProto || request.protocol || (request.socket?.encrypted ? 'https' : 'http');
    const url = request.url || '';
    const absoluteUrl = getAbsoluteUrl({
        url,
        host,
        protocol
    });
    // This is non-standard, but may be sometimes set
    // It may be overwritten later by our own body handling
    const data = request.body || undefined;
    // This is non-standard, but may be set on e.g. Next.js or Express requests
    const cookies = request.cookies;
    return {
        url: absoluteUrl,
        method: request.method,
        query_string: extractQueryParamsFromUrl(url),
        headers: headersToDict(headers),
        cookies,
        data
    };
}
function getAbsoluteUrl({ url, protocol, host }) {
    if (url?.startsWith('http')) {
        return url;
    }
    if (url && host) {
        return `${protocol}://${host}${url}`;
    }
    return undefined;
}
/** Extract the query params from an URL. */ function extractQueryParamsFromUrl(url) {
    // url is path and query string
    if (!url) {
        return;
    }
    try {
        // The `URL` constructor can't handle internal URLs of the form `/some/path/here`, so stick a dummy protocol and
        // hostname as the base. Since the point here is just to grab the query string, it doesn't matter what we use.
        const queryParams = new URL(url, 'http://s.io').search.slice(1);
        return queryParams.length ? queryParams : undefined;
    } catch  {
        return undefined;
    }
}
exports.extractQueryParamsFromUrl = extractQueryParamsFromUrl;
exports.headersToDict = headersToDict;
exports.httpRequestToRequestData = httpRequestToRequestData;
exports.winterCGHeadersToDict = winterCGHeadersToDict;
exports.winterCGRequestToRequestData = winterCGRequestToRequestData; //# sourceMappingURL=request.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/breadcrumbs.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
/**
 * Default maximum number of breadcrumbs added to an event. Can be overwritten
 * with {@link Options.maxBreadcrumbs}.
 */ const DEFAULT_BREADCRUMBS = 100;
/**
 * Records a new breadcrumb which will be attached to future events.
 *
 * Breadcrumbs will be added to subsequent events to provide more context on
 * user's actions prior to an error or crash.
 */ function addBreadcrumb(breadcrumb, hint) {
    const client = currentScopes.getClient();
    const isolationScope = currentScopes.getIsolationScope();
    if (!client) return;
    const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions();
    if (maxBreadcrumbs <= 0) return;
    const timestamp = time.dateTimestampInSeconds();
    const mergedBreadcrumb = {
        timestamp,
        ...breadcrumb
    };
    const finalBreadcrumb = beforeBreadcrumb ? debugLogger.consoleSandbox(()=>beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
    if (finalBreadcrumb === null) return;
    if (client.emit) {
        client.emit('beforeAddBreadcrumb', finalBreadcrumb, hint);
    }
    isolationScope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
}
exports.addBreadcrumb = addBreadcrumb; //# sourceMappingURL=breadcrumbs.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/functiontostring.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
let originalFunctionToString;
const INTEGRATION_NAME = 'FunctionToString';
const SETUP_CLIENTS = new WeakMap();
const _functionToStringIntegration = ()=>{
    return {
        name: INTEGRATION_NAME,
        setupOnce () {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            originalFunctionToString = Function.prototype.toString;
            // intrinsics (like Function.prototype) might be immutable in some environments
            // e.g. Node with --frozen-intrinsics, XS (an embedded JavaScript engine) or SES (a JavaScript proposal)
            try {
                Function.prototype.toString = function(...args) {
                    const originalFunction = object.getOriginalFunction(this);
                    const context = SETUP_CLIENTS.has(currentScopes.getClient()) && originalFunction !== undefined ? originalFunction : this;
                    return originalFunctionToString.apply(context, args);
                };
            } catch  {
            // ignore errors here, just don't patch this
            }
        },
        setup (client) {
            SETUP_CLIENTS.set(client, true);
        }
    };
};
/**
 * Patch toString calls to return proper name for wrapped functions.
 *
 * ```js
 * Sentry.init({
 *   integrations: [
 *     functionToStringIntegration(),
 *   ],
 * });
 * ```
 */ const functionToStringIntegration = integration.defineIntegration(_functionToStringIntegration);
exports.functionToStringIntegration = functionToStringIntegration; //# sourceMappingURL=functiontostring.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/eventFilters.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const eventUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventUtils.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
// "Script error." is hard coded into browsers for errors that it can't read.
// this is the result of a script being pulled in from an external domain and CORS.
const DEFAULT_IGNORE_ERRORS = [
    /^Script error\.?$/,
    /^Javascript error: Script error\.? on line 0$/,
    /^ResizeObserver loop completed with undelivered notifications.$/,
    /^Cannot redefine property: googletag$/,
    /^Can't find variable: gmo$/,
    /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
    'can\'t redefine non-configurable property "solana"',
    "vv().getRestrictions is not a function. (In 'vv().getRestrictions(1,a)', 'vv().getRestrictions' is undefined)",
    "Can't find variable: _AutofillCallbackHandler",
    /^Non-Error promise rejection captured with value: Object Not Found Matching Id:\d+, MethodName:simulateEvent, ParamCount:\d+$/,
    /^Java exception was raised during method invocation$/
];
/** Options for the EventFilters integration */ const INTEGRATION_NAME = 'EventFilters';
/**
 * An integration that filters out events (errors and transactions) based on:
 *
 * - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
 * - (Errors) A list of error messages or urls/filenames passed in via
 *   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
 *   - The same options passed to the integration directly via @param options
 * - (Transactions/Spans) A list of root span (transaction) names passed in via
 *   - Top level Sentry.init option (`ignoreTransactions`)
 *   - The same option passed to the integration directly via @param options
 *
 * Events filtered by this integration will not be sent to Sentry.
 */ const eventFiltersIntegration = integration.defineIntegration((options = {})=>{
    let mergedOptions;
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            const clientOptions = client.getOptions();
            mergedOptions = _mergeOptions(options, clientOptions);
        },
        processEvent (event, _hint, client) {
            if (!mergedOptions) {
                const clientOptions = client.getOptions();
                mergedOptions = _mergeOptions(options, clientOptions);
            }
            return _shouldDropEvent(event, mergedOptions) ? null : event;
        }
    };
});
/**
 * An integration that filters out events (errors and transactions) based on:
 *
 * - (Errors) A curated list of known low-value or irrelevant errors (see {@link DEFAULT_IGNORE_ERRORS})
 * - (Errors) A list of error messages or urls/filenames passed in via
 *   - Top level Sentry.init options (`ignoreErrors`, `denyUrls`, `allowUrls`)
 *   - The same options passed to the integration directly via @param options
 * - (Transactions/Spans) A list of root span (transaction) names passed in via
 *   - Top level Sentry.init option (`ignoreTransactions`)
 *   - The same option passed to the integration directly via @param options
 *
 * Events filtered by this integration will not be sent to Sentry.
 *
 * @deprecated this integration was renamed and will be removed in a future major version.
 * Use `eventFiltersIntegration` instead.
 */ const inboundFiltersIntegration = integration.defineIntegration((options = {})=>{
    return {
        ...eventFiltersIntegration(options),
        name: 'InboundFilters'
    };
});
function _mergeOptions(internalOptions = {}, clientOptions = {}) {
    return {
        allowUrls: [
            ...internalOptions.allowUrls || [],
            ...clientOptions.allowUrls || []
        ],
        denyUrls: [
            ...internalOptions.denyUrls || [],
            ...clientOptions.denyUrls || []
        ],
        ignoreErrors: [
            ...internalOptions.ignoreErrors || [],
            ...clientOptions.ignoreErrors || [],
            ...internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS
        ],
        ignoreTransactions: [
            ...internalOptions.ignoreTransactions || [],
            ...clientOptions.ignoreTransactions || []
        ]
    };
}
function _shouldDropEvent(event, options) {
    if (!event.type) {
        // Filter errors
        if (_isIgnoredError(event, options.ignoreErrors)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Event dropped due to being matched by \`ignoreErrors\` option.\nEvent: ${misc.getEventDescription(event)}`);
            return true;
        }
        if (_isUselessError(event)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Event dropped due to not having an error message, error type or stacktrace.\nEvent: ${misc.getEventDescription(event)}`);
            return true;
        }
        if (_isDeniedUrl(event, options.denyUrls)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Event dropped due to being matched by \`denyUrls\` option.\nEvent: ${misc.getEventDescription(event)}.\nUrl: ${_getEventFilterUrl(event)}`);
            return true;
        }
        if (!_isAllowedUrl(event, options.allowUrls)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Event dropped due to not being matched by \`allowUrls\` option.\nEvent: ${misc.getEventDescription(event)}.\nUrl: ${_getEventFilterUrl(event)}`);
            return true;
        }
    } else if (event.type === 'transaction') {
        // Filter transactions
        if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn(`Event dropped due to being matched by \`ignoreTransactions\` option.\nEvent: ${misc.getEventDescription(event)}`);
            return true;
        }
    }
    return false;
}
function _isIgnoredError(event, ignoreErrors) {
    if (!ignoreErrors?.length) {
        return false;
    }
    return eventUtils.getPossibleEventMessages(event).some((message)=>string.stringMatchesSomePattern(message, ignoreErrors));
}
function _isIgnoredTransaction(event, ignoreTransactions) {
    if (!ignoreTransactions?.length) {
        return false;
    }
    const name = event.transaction;
    return name ? string.stringMatchesSomePattern(name, ignoreTransactions) : false;
}
function _isDeniedUrl(event, denyUrls) {
    if (!denyUrls?.length) {
        return false;
    }
    const url = _getEventFilterUrl(event);
    return !url ? false : string.stringMatchesSomePattern(url, denyUrls);
}
function _isAllowedUrl(event, allowUrls) {
    if (!allowUrls?.length) {
        return true;
    }
    const url = _getEventFilterUrl(event);
    return !url ? true : string.stringMatchesSomePattern(url, allowUrls);
}
function _getLastValidUrl(frames = []) {
    for(let i = frames.length - 1; i >= 0; i--){
        const frame = frames[i];
        if (frame && frame.filename !== '<anonymous>' && frame.filename !== '[native code]') {
            return frame.filename || null;
        }
    }
    return null;
}
function _getEventFilterUrl(event) {
    try {
        // If there are linked exceptions or exception aggregates we only want to match against the top frame of the "root" (the main exception)
        // The root always comes last in linked exceptions
        const rootException = [
            ...event.exception?.values ?? []
        ].reverse().find((value)=>value.mechanism?.parent_id === undefined && value.stacktrace?.frames?.length);
        const frames = rootException?.stacktrace?.frames;
        return frames ? _getLastValidUrl(frames) : null;
    } catch  {
        debugBuild.DEBUG_BUILD && debugLogger.debug.error(`Cannot extract url for event ${misc.getEventDescription(event)}`);
        return null;
    }
}
function _isUselessError(event) {
    // We only want to consider events for dropping that actually have recorded exception values.
    if (!event.exception?.values?.length) {
        return false;
    }
    return(// No top-level message
    !event.message && // There are no exception values that have a stacktrace, a non-generic-Error type or value
    !event.exception.values.some((value)=>value.stacktrace || value.type && value.type !== 'Error' || value.value));
}
exports.eventFiltersIntegration = eventFiltersIntegration;
exports.inboundFiltersIntegration = inboundFiltersIntegration; //# sourceMappingURL=eventFilters.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/aggregate-errors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
/**
 * Creates exceptions inside `event.exception.values` for errors that are nested on properties based on the `key` parameter.
 */ function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, key, limit, event, hint) {
    if (!event.exception?.values || !hint || !is.isInstanceOf(hint.originalException, Error)) {
        return;
    }
    // Generally speaking the last item in `event.exception.values` is the exception originating from the original Error
    const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : undefined;
    // We only create exception grouping if there is an exception in the event.
    if (originalException) {
        event.exception.values = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, hint.originalException, key, event.exception.values, originalException, 0);
    }
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error, key, prevExceptions, exception, exceptionId) {
    if (prevExceptions.length >= limit + 1) {
        return prevExceptions;
    }
    let newExceptions = [
        ...prevExceptions
    ];
    // Recursively call this function in order to walk down a chain of errors
    if (is.isInstanceOf(error[key], Error)) {
        applyExceptionGroupFieldsForParentException(exception, exceptionId);
        const newException = exceptionFromErrorImplementation(parser, error[key]);
        const newExceptionId = newExceptions.length;
        applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId);
        newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error[key], key, [
            newException,
            ...newExceptions
        ], newException, newExceptionId);
    }
    // This will create exception grouping for AggregateErrors
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError
    if (Array.isArray(error.errors)) {
        error.errors.forEach((childError, i)=>{
            if (is.isInstanceOf(childError, Error)) {
                applyExceptionGroupFieldsForParentException(exception, exceptionId);
                const newException = exceptionFromErrorImplementation(parser, childError);
                const newExceptionId = newExceptions.length;
                applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId);
                newExceptions = aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, childError, key, [
                    newException,
                    ...newExceptions
                ], newException, newExceptionId);
            }
        });
    }
    return newExceptions;
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId) {
    // Don't know if this default makes sense. The protocol requires us to set these values so we pick *some* default.
    exception.mechanism = exception.mechanism || {
        type: 'generic',
        handled: true
    };
    exception.mechanism = {
        ...exception.mechanism,
        ...exception.type === 'AggregateError' && {
            is_exception_group: true
        },
        exception_id: exceptionId
    };
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
    // Don't know if this default makes sense. The protocol requires us to set these values so we pick *some* default.
    exception.mechanism = exception.mechanism || {
        type: 'generic',
        handled: true
    };
    exception.mechanism = {
        ...exception.mechanism,
        type: 'chained',
        source,
        exception_id: exceptionId,
        parent_id: parentId
    };
}
exports.applyAggregateErrorsToEvent = applyAggregateErrorsToEvent; //# sourceMappingURL=aggregate-errors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/linkederrors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const aggregateErrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/aggregate-errors.js [app-ssr] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventbuilder.js [app-ssr] (ecmascript)");
const DEFAULT_KEY = 'cause';
const DEFAULT_LIMIT = 5;
const INTEGRATION_NAME = 'LinkedErrors';
const _linkedErrorsIntegration = (options = {})=>{
    const limit = options.limit || DEFAULT_LIMIT;
    const key = options.key || DEFAULT_KEY;
    return {
        name: INTEGRATION_NAME,
        preprocessEvent (event, hint, client) {
            const options = client.getOptions();
            aggregateErrors.applyAggregateErrorsToEvent(eventbuilder.exceptionFromError, options.stackParser, key, limit, event, hint);
        }
    };
};
const linkedErrorsIntegration = integration.defineIntegration(_linkedErrorsIntegration);
exports.linkedErrorsIntegration = linkedErrorsIntegration; //# sourceMappingURL=linkederrors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/metadata.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/** Keys are source filename/url, values are metadata objects. */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
const filenameMetadataMap = new Map();
/** Set of stack strings that have already been parsed. */ const parsedStacks = new Set();
function ensureMetadataStacksAreParsed(parser) {
    if (!worldwide.GLOBAL_OBJ._sentryModuleMetadata) {
        return;
    }
    for (const stack of Object.keys(worldwide.GLOBAL_OBJ._sentryModuleMetadata)){
        const metadata = worldwide.GLOBAL_OBJ._sentryModuleMetadata[stack];
        if (parsedStacks.has(stack)) {
            continue;
        }
        // Ensure this stack doesn't get parsed again
        parsedStacks.add(stack);
        const frames = parser(stack);
        // Go through the frames starting from the top of the stack and find the first one with a filename
        for (const frame of frames.reverse()){
            if (frame.filename) {
                // Save the metadata for this filename
                filenameMetadataMap.set(frame.filename, metadata);
                break;
            }
        }
    }
}
/**
 * Retrieve metadata for a specific JavaScript file URL.
 *
 * Metadata is injected by the Sentry bundler plugins using the `_experiments.moduleMetadata` config option.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMetadataForUrl(parser, filename) {
    ensureMetadataStacksAreParsed(parser);
    return filenameMetadataMap.get(filename);
}
/**
 * Adds metadata to stack frames.
 *
 * Metadata is injected by the Sentry bundler plugins using the `_experiments.moduleMetadata` config option.
 */ function addMetadataToStackFrames(parser, event) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values.forEach((exception)=>{
            if (!exception.stacktrace) {
                return;
            }
            for (const frame of exception.stacktrace.frames || []){
                if (!frame.filename || frame.module_metadata) {
                    continue;
                }
                const metadata = getMetadataForUrl(parser, frame.filename);
                if (metadata) {
                    frame.module_metadata = metadata;
                }
            }
        });
    } catch  {
    // To save bundle size we're just try catching here instead of checking for the existence of all the different objects.
    }
}
/**
 * Strips metadata from stack frames.
 */ function stripMetadataFromStackFrames(event) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event.exception.values.forEach((exception)=>{
            if (!exception.stacktrace) {
                return;
            }
            for (const frame of exception.stacktrace.frames || []){
                delete frame.module_metadata;
            }
        });
    } catch  {
    // To save bundle size we're just try catching here instead of checking for the existence of all the different objects.
    }
}
exports.addMetadataToStackFrames = addMetadataToStackFrames;
exports.getMetadataForUrl = getMetadataForUrl;
exports.stripMetadataFromStackFrames = stripMetadataFromStackFrames; //# sourceMappingURL=metadata.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/metadata.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const metadata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/metadata.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
/**
 * Adds module metadata to stack frames.
 *
 * Metadata can be injected by the Sentry bundler plugins using the `moduleMetadata` config option.
 *
 * When this integration is added, the metadata passed to the bundler plugin is added to the stack frames of all events
 * under the `module_metadata` property. This can be used to help in tagging or routing of events from different teams
 * our sources
 */ const moduleMetadataIntegration = integration.defineIntegration(()=>{
    return {
        name: 'ModuleMetadata',
        setup (client) {
            // We need to strip metadata from stack frames before sending them to Sentry since these are client side only.
            client.on('beforeEnvelope', (envelope$1)=>{
                envelope.forEachEnvelopeItem(envelope$1, (item, type)=>{
                    if (type === 'event') {
                        const event = Array.isArray(item) ? item[1] : undefined;
                        if (event) {
                            metadata.stripMetadataFromStackFrames(event);
                            item[1] = event;
                        }
                    }
                });
            });
            client.on('applyFrameMetadata', (event)=>{
                // Only apply stack frame metadata to error events
                if (event.type) {
                    return;
                }
                const stackParser = client.getOptions().stackParser;
                metadata.addMetadataToStackFrames(stackParser, event);
            });
        }
    };
});
exports.moduleMetadataIntegration = moduleMetadataIntegration; //# sourceMappingURL=metadata.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/cookie.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * This code was originally copied from the 'cookie` module at v0.5.0 and was simplified for our use case.
 * https://github.com/jshttp/cookie/blob/a0c84147aab6266bdb3996cf4062e93907c0b0fc/index.js
 * It had the following license:
 *
 * (The MIT License)
 *
 * Copyright (c) 2012-2014 Roman Shtylman <shtylman@gmail.com>
 * Copyright (c) 2015 Douglas Christopher Wilson <doug@somethingdoug.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * 'Software'), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */ /**
 * Parses a cookie string
 */ function parseCookie(str) {
    const obj = {};
    let index = 0;
    while(index < str.length){
        const eqIdx = str.indexOf('=', index);
        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }
        let endIdx = str.indexOf(';', index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(';', eqIdx - 1) + 1;
            continue;
        }
        const key = str.slice(index, eqIdx).trim();
        // only assign once
        if (undefined === obj[key]) {
            let val = str.slice(eqIdx + 1, endIdx).trim();
            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            try {
                obj[key] = val.indexOf('%') !== -1 ? decodeURIComponent(val) : val;
            } catch  {
                obj[key] = val;
            }
        }
        index = endIdx + 1;
    }
    return obj;
}
exports.parseCookie = parseCookie; //# sourceMappingURL=cookie.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/vendor/getIpAddress.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Vendored / modified from @sergiodxa/remix-utils
// https://github.com/sergiodxa/remix-utils/blob/02af80e12829a53696bfa8f3c2363975cf59f55e/src/server/get-client-ip-address.ts
// MIT License
// Copyright (c) 2021 Sergio Xalambrí
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// The headers to check, in priority order
const ipHeaderNames = [
    'X-Client-IP',
    'X-Forwarded-For',
    'Fly-Client-IP',
    'CF-Connecting-IP',
    'Fastly-Client-Ip',
    'True-Client-Ip',
    'X-Real-IP',
    'X-Cluster-Client-IP',
    'X-Forwarded',
    'Forwarded-For',
    'Forwarded',
    'X-Vercel-Forwarded-For'
];
/**
 * Get the IP address of the client sending a request.
 *
 * It receives a Request headers object and use it to get the
 * IP address from one of the following headers in order.
 *
 * If the IP address is valid, it will be returned. Otherwise, null will be
 * returned.
 *
 * If the header values contains more than one IP address, the first valid one
 * will be returned.
 */ function getClientIPAddress(headers) {
    // This will end up being Array<string | string[] | undefined | null> because of the various possible values a header
    // can take
    const headerValues = ipHeaderNames.map((headerName)=>{
        const rawValue = headers[headerName];
        const value = Array.isArray(rawValue) ? rawValue.join(';') : rawValue;
        if (headerName === 'Forwarded') {
            return parseForwardedHeader(value);
        }
        return value?.split(',').map((v)=>v.trim());
    });
    // Flatten the array and filter out any falsy entries
    const flattenedHeaderValues = headerValues.reduce((acc, val)=>{
        if (!val) {
            return acc;
        }
        return acc.concat(val);
    }, []);
    // Find the first value which is a valid IP address, if any
    const ipAddress = flattenedHeaderValues.find((ip)=>ip !== null && isIP(ip));
    return ipAddress || null;
}
function parseForwardedHeader(value) {
    if (!value) {
        return null;
    }
    for (const part of value.split(';')){
        if (part.startsWith('for=')) {
            return part.slice(4);
        }
    }
    return null;
}
//
/**
 * Custom method instead of importing this from `net` package, as this only exists in node
 * Accepts:
 * 127.0.0.1
 * 192.168.1.1
 * 192.168.1.255
 * 255.255.255.255
 * 10.1.1.1
 * 0.0.0.0
 * 2b01:cb19:8350:ed00:d0dd:fa5b:de31:8be5
 *
 * Rejects:
 * 1.1.1.01
 * 30.168.1.255.1
 * 127.1
 * 192.168.1.256
 * -1.2.3.4
 * 1.1.1.1.
 * 3...3
 * 192.168.1.099
 */ function isIP(str) {
    const regex = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
    return regex.test(str);
}
exports.getClientIPAddress = getClientIPAddress;
exports.ipHeaderNames = ipHeaderNames; //# sourceMappingURL=getIpAddress.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/requestdata.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const cookie = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/cookie.js [app-ssr] (ecmascript)");
const getIpAddress = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/vendor/getIpAddress.js [app-ssr] (ecmascript)");
// TODO(v11): Change defaults based on `sendDefaultPii`
const DEFAULT_INCLUDE = {
    cookies: true,
    data: true,
    headers: true,
    query_string: true,
    url: true
};
const INTEGRATION_NAME = 'RequestData';
const _requestDataIntegration = (options = {})=>{
    const include = {
        ...DEFAULT_INCLUDE,
        ...options.include
    };
    return {
        name: INTEGRATION_NAME,
        processEvent (event, _hint, client) {
            const { sdkProcessingMetadata = {} } = event;
            const { normalizedRequest, ipAddress } = sdkProcessingMetadata;
            const includeWithDefaultPiiApplied = {
                ...include,
                ip: include.ip ?? client.getOptions().sendDefaultPii
            };
            if (normalizedRequest) {
                addNormalizedRequestDataToEvent(event, normalizedRequest, {
                    ipAddress
                }, includeWithDefaultPiiApplied);
            }
            return event;
        }
    };
};
/**
 * Add data about a request to an event. Primarily for use in Node-based SDKs, but included in `@sentry/core`
 * so it can be used in cross-platform SDKs like `@sentry/nextjs`.
 */ const requestDataIntegration = integration.defineIntegration(_requestDataIntegration);
/**
 * Add already normalized request data to an event.
 * This mutates the passed in event.
 */ function addNormalizedRequestDataToEvent(event, req, // Data that should not go into `event.request` but is somehow related to requests
additionalData, include) {
    event.request = {
        ...event.request,
        ...extractNormalizedRequestData(req, include)
    };
    if (include.ip) {
        const ip = req.headers && getIpAddress.getClientIPAddress(req.headers) || additionalData.ipAddress;
        if (ip) {
            event.user = {
                ...event.user,
                ip_address: ip
            };
        }
    }
}
function extractNormalizedRequestData(normalizedRequest, include) {
    const requestData = {};
    const headers = {
        ...normalizedRequest.headers
    };
    if (include.headers) {
        requestData.headers = headers;
        // Remove the Cookie header in case cookie data should not be included in the event
        if (!include.cookies) {
            delete headers.cookie;
        }
        // Remove IP headers in case IP data should not be included in the event
        if (!include.ip) {
            getIpAddress.ipHeaderNames.forEach((ipHeaderName)=>{
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete headers[ipHeaderName];
            });
        }
    }
    requestData.method = normalizedRequest.method;
    if (include.url) {
        requestData.url = normalizedRequest.url;
    }
    if (include.cookies) {
        const cookies = normalizedRequest.cookies || (headers?.cookie ? cookie.parseCookie(headers.cookie) : undefined);
        requestData.cookies = cookies || {};
    }
    if (include.query_string) {
        requestData.query_string = normalizedRequest.query_string;
    }
    if (include.data) {
        requestData.data = normalizedRequest.data;
    }
    return requestData;
}
exports.requestDataIntegration = requestDataIntegration; //# sourceMappingURL=requestdata.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/console.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)");
/**
 * Add an instrumentation handler for when a console.xxx method is called.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addConsoleInstrumentationHandler(handler) {
    const type = 'console';
    handlers.addHandler(type, handler);
    handlers.maybeInstrument(type, instrumentConsole);
}
function instrumentConsole() {
    if (!('console' in worldwide.GLOBAL_OBJ)) {
        return;
    }
    debugLogger.CONSOLE_LEVELS.forEach(function(level) {
        if (!(level in worldwide.GLOBAL_OBJ.console)) {
            return;
        }
        object.fill(worldwide.GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
            debugLogger.originalConsoleMethods[level] = originalConsoleMethod;
            return function(...args) {
                const handlerData = {
                    args,
                    level
                };
                handlers.triggerHandlers('console', handlerData);
                const log = debugLogger.originalConsoleMethods[level];
                log?.apply(worldwide.GLOBAL_OBJ.console, args);
            };
        });
    });
}
exports.addConsoleInstrumentationHandler = addConsoleInstrumentationHandler; //# sourceMappingURL=console.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/severity.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Converts a string-based level into a `SeverityLevel`, normalizing it along the way.
 *
 * @param level String representation of desired `SeverityLevel`.
 * @returns The `SeverityLevel` corresponding to the given string, or 'log' if the string isn't a valid level.
 */ function severityLevelFromString(level) {
    return level === 'warn' ? 'warning' : [
        'fatal',
        'error',
        'warning',
        'log',
        'info',
        'debug'
    ].includes(level) ? level : 'log';
}
exports.severityLevelFromString = severityLevelFromString; //# sourceMappingURL=severity.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/captureconsole.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const console = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/console.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const severity = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/severity.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'CaptureConsole';
const _captureConsoleIntegration = (options = {})=>{
    const levels = options.levels || debugLogger.CONSOLE_LEVELS;
    const handled = options.handled ?? true;
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            if (!('console' in worldwide.GLOBAL_OBJ)) {
                return;
            }
            console.addConsoleInstrumentationHandler(({ args, level })=>{
                if (currentScopes.getClient() !== client || !levels.includes(level)) {
                    return;
                }
                consoleHandler(args, level, handled);
            });
        }
    };
};
/**
 * Send Console API calls as Sentry Events.
 */ const captureConsoleIntegration = integration.defineIntegration(_captureConsoleIntegration);
function consoleHandler(args, level, handled) {
    const captureContext = {
        level: severity.severityLevelFromString(level),
        extra: {
            arguments: args
        }
    };
    currentScopes.withScope((scope)=>{
        scope.addEventProcessor((event)=>{
            event.logger = 'console';
            misc.addExceptionMechanism(event, {
                handled,
                type: 'console'
            });
            return event;
        });
        if (level === 'assert') {
            if (!args[0]) {
                const message = `Assertion failed: ${string.safeJoin(args.slice(1), ' ') || 'console.assert'}`;
                scope.setExtra('arguments', args.slice(1));
                exports$1.captureMessage(message, captureContext);
            }
            return;
        }
        const error = args.find((arg)=>arg instanceof Error);
        if (error) {
            exports$1.captureException(error, captureContext);
            return;
        }
        const message = string.safeJoin(args, ' ');
        exports$1.captureMessage(message, captureContext);
    });
}
exports.captureConsoleIntegration = captureConsoleIntegration; //# sourceMappingURL=captureconsole.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/dedupe.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Dedupe';
const _dedupeIntegration = ()=>{
    let previousEvent;
    return {
        name: INTEGRATION_NAME,
        processEvent (currentEvent) {
            // We want to ignore any non-error type events, e.g. transactions or replays
            // These should never be deduped, and also not be compared against as _previousEvent.
            if (currentEvent.type) {
                return currentEvent;
            }
            // Juuust in case something goes wrong
            try {
                if (_shouldDropEvent(currentEvent, previousEvent)) {
                    debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Event dropped due to being a duplicate of previously captured event.');
                    return null;
                }
            } catch  {} // eslint-disable-line no-empty
            return previousEvent = currentEvent;
        }
    };
};
/**
 * Deduplication filter.
 */ const dedupeIntegration = integration.defineIntegration(_dedupeIntegration);
/** only exported for tests. */ function _shouldDropEvent(currentEvent, previousEvent) {
    if (!previousEvent) {
        return false;
    }
    if (_isSameMessageEvent(currentEvent, previousEvent)) {
        return true;
    }
    if (_isSameExceptionEvent(currentEvent, previousEvent)) {
        return true;
    }
    return false;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
    const currentMessage = currentEvent.message;
    const previousMessage = previousEvent.message;
    // If neither event has a message property, they were both exceptions, so bail out
    if (!currentMessage && !previousMessage) {
        return false;
    }
    // If only one event has a stacktrace, but not the other one, they are not the same
    if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
        return false;
    }
    if (currentMessage !== previousMessage) {
        return false;
    }
    if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
    }
    if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
    }
    return true;
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
    const previousException = _getExceptionFromEvent(previousEvent);
    const currentException = _getExceptionFromEvent(currentEvent);
    if (!previousException || !currentException) {
        return false;
    }
    if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
        return false;
    }
    if (!_isSameFingerprint(currentEvent, previousEvent)) {
        return false;
    }
    if (!_isSameStacktrace(currentEvent, previousEvent)) {
        return false;
    }
    return true;
}
function _isSameStacktrace(currentEvent, previousEvent) {
    let currentFrames = stacktrace.getFramesFromEvent(currentEvent);
    let previousFrames = stacktrace.getFramesFromEvent(previousEvent);
    // If neither event has a stacktrace, they are assumed to be the same
    if (!currentFrames && !previousFrames) {
        return true;
    }
    // If only one event has a stacktrace, but not the other one, they are not the same
    if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
        return false;
    }
    currentFrames = currentFrames;
    previousFrames = previousFrames;
    // If number of frames differ, they are not the same
    if (previousFrames.length !== currentFrames.length) {
        return false;
    }
    // Otherwise, compare the two
    for(let i = 0; i < previousFrames.length; i++){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const frameA = previousFrames[i];
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const frameB = currentFrames[i];
        if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
            return false;
        }
    }
    return true;
}
function _isSameFingerprint(currentEvent, previousEvent) {
    let currentFingerprint = currentEvent.fingerprint;
    let previousFingerprint = previousEvent.fingerprint;
    // If neither event has a fingerprint, they are assumed to be the same
    if (!currentFingerprint && !previousFingerprint) {
        return true;
    }
    // If only one event has a fingerprint, but not the other one, they are not the same
    if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
        return false;
    }
    currentFingerprint = currentFingerprint;
    previousFingerprint = previousFingerprint;
    // Otherwise, compare the two
    try {
        return !!(currentFingerprint.join('') === previousFingerprint.join(''));
    } catch  {
        return false;
    }
}
function _getExceptionFromEvent(event) {
    return event.exception?.values?.[0];
}
exports._shouldDropEvent = _shouldDropEvent;
exports.dedupeIntegration = dedupeIntegration; //# sourceMappingURL=dedupe.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/extraerrordata.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'ExtraErrorData';
/**
 * Extract additional data for from original exceptions.
 */ const _extraErrorDataIntegration = (options = {})=>{
    const { depth = 3, captureErrorCause = true } = options;
    return {
        name: INTEGRATION_NAME,
        processEvent (event, hint, client) {
            const { maxValueLength = 250 } = client.getOptions();
            return _enhanceEventWithErrorData(event, hint, depth, captureErrorCause, maxValueLength);
        }
    };
};
const extraErrorDataIntegration = integration.defineIntegration(_extraErrorDataIntegration);
function _enhanceEventWithErrorData(event, hint = {}, depth, captureErrorCause, maxValueLength) {
    if (!hint.originalException || !is.isError(hint.originalException)) {
        return event;
    }
    const exceptionName = hint.originalException.name || hint.originalException.constructor.name;
    const errorData = _extractErrorData(hint.originalException, captureErrorCause, maxValueLength);
    if (errorData) {
        const contexts = {
            ...event.contexts
        };
        const normalizedErrorData = normalize.normalize(errorData, depth);
        if (is.isPlainObject(normalizedErrorData)) {
            // We mark the error data as "already normalized" here, because we don't want other normalization procedures to
            // potentially truncate the data we just already normalized, with a certain depth setting.
            object.addNonEnumerableProperty(normalizedErrorData, '__sentry_skip_normalization__', true);
            contexts[exceptionName] = normalizedErrorData;
        }
        return {
            ...event,
            contexts
        };
    }
    return event;
}
/**
 * Extract extra information from the Error object
 */ function _extractErrorData(error, captureErrorCause, maxValueLength) {
    // We are trying to enhance already existing event, so no harm done if it won't succeed
    try {
        const nativeKeys = [
            'name',
            'message',
            'stack',
            'line',
            'column',
            'fileName',
            'lineNumber',
            'columnNumber',
            'toJSON'
        ];
        const extraErrorInfo = {};
        // We want only enumerable properties, thus `getOwnPropertyNames` is redundant here, as we filter keys anyway.
        for (const key of Object.keys(error)){
            if (nativeKeys.indexOf(key) !== -1) {
                continue;
            }
            const value = error[key];
            extraErrorInfo[key] = is.isError(value) || typeof value === 'string' ? string.truncate(`${value}`, maxValueLength) : value;
        }
        // Error.cause is a standard property that is non enumerable, we therefore need to access it separately.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause
        if (captureErrorCause && error.cause !== undefined) {
            if (is.isError(error.cause)) {
                const errorName = error.cause.name || error.cause.constructor.name;
                extraErrorInfo.cause = {
                    [errorName]: _extractErrorData(error.cause, false, maxValueLength)
                };
            } else {
                extraErrorInfo.cause = error.cause;
            }
        }
        // Check if someone attached `toJSON` method to grab even more properties (eg. axios is doing that)
        if (typeof error.toJSON === 'function') {
            const serializedError = error.toJSON();
            for (const key of Object.keys(serializedError)){
                const value = serializedError[key];
                extraErrorInfo[key] = is.isError(value) ? value.toString() : value;
            }
        }
        return extraErrorInfo;
    } catch (oO) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.error('Unable to extract extra data from the Error object:', oO);
    }
    return null;
}
exports.extraErrorDataIntegration = extraErrorDataIntegration; //# sourceMappingURL=extraerrordata.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript
// https://github.com/calvinmetcalf/rollup-plugin-node-builtins/blob/63ab8aacd013767445ca299e468d9a60a95328d7/src/es6/path.js
//
// Copyright Joyent, Inc.and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/** JSDoc */ function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    let up = 0;
    for(let i = parts.length - 1; i >= 0; i--){
        const last = parts[i];
        if (last === '.') {
            parts.splice(i, 1);
        } else if (last === '..') {
            parts.splice(i, 1);
            up++;
        } else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        for(; up--; up){
            parts.unshift('..');
        }
    }
    return parts;
}
// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
const splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
/** JSDoc */ function splitPath(filename) {
    // Truncate files names greater than 1024 characters to avoid regex dos
    // https://github.com/getsentry/sentry-javascript/pull/8737#discussion_r1285719172
    const truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename;
    const parts = splitPathRe.exec(truncated);
    return parts ? parts.slice(1) : [];
}
// path.resolve([from ...], to)
// posix version
/** JSDoc */ function resolve(...args) {
    let resolvedPath = '';
    let resolvedAbsolute = false;
    for(let i = args.length - 1; i >= -1 && !resolvedAbsolute; i--){
        const path = i >= 0 ? args[i] : '/';
        // Skip empty entries
        if (!path) {
            continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute = path.charAt(0) === '/';
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    // Normalize the path
    resolvedPath = normalizeArray(resolvedPath.split('/').filter((p)=>!!p), !resolvedAbsolute).join('/');
    return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
}
/** JSDoc */ function trim(arr) {
    let start = 0;
    for(; start < arr.length; start++){
        if (arr[start] !== '') {
            break;
        }
    }
    let end = arr.length - 1;
    for(; end >= 0; end--){
        if (arr[end] !== '') {
            break;
        }
    }
    if (start > end) {
        return [];
    }
    return arr.slice(start, end - start + 1);
}
// path.relative(from, to)
// posix version
/** JSDoc */ function relative(from, to) {
    /* eslint-disable no-param-reassign */ from = resolve(from).slice(1);
    to = resolve(to).slice(1);
    /* eslint-enable no-param-reassign */ const fromParts = trim(from.split('/'));
    const toParts = trim(to.split('/'));
    const length = Math.min(fromParts.length, toParts.length);
    let samePartsLength = length;
    for(let i = 0; i < length; i++){
        if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
        }
    }
    let outputParts = [];
    for(let i = samePartsLength; i < fromParts.length; i++){
        outputParts.push('..');
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join('/');
}
// path.normalize(path)
// posix version
/** JSDoc */ function normalizePath(path) {
    const isPathAbsolute = isAbsolute(path);
    const trailingSlash = path.slice(-1) === '/';
    // Normalize the path
    let normalizedPath = normalizeArray(path.split('/').filter((p)=>!!p), !isPathAbsolute).join('/');
    if (!normalizedPath && !isPathAbsolute) {
        normalizedPath = '.';
    }
    if (normalizedPath && trailingSlash) {
        normalizedPath += '/';
    }
    return (isPathAbsolute ? '/' : '') + normalizedPath;
}
// posix version
/** JSDoc */ function isAbsolute(path) {
    return path.charAt(0) === '/';
}
// posix version
/** JSDoc */ function join(...args) {
    return normalizePath(args.join('/'));
}
/** JSDoc */ function dirname(path) {
    const result = splitPath(path);
    const root = result[0] || '';
    let dir = result[1];
    if (!root && !dir) {
        // No dirname whatsoever
        return '.';
    }
    if (dir) {
        // It has a dirname, strip trailing slash
        dir = dir.slice(0, dir.length - 1);
    }
    return root + dir;
}
/** JSDoc */ function basename(path, ext) {
    let f = splitPath(path)[2] || '';
    if (ext && f.slice(ext.length * -1) === ext) {
        f = f.slice(0, f.length - ext.length);
    }
    return f;
}
exports.basename = basename;
exports.dirname = dirname;
exports.isAbsolute = isAbsolute;
exports.join = join;
exports.normalizePath = normalizePath;
exports.relative = relative;
exports.resolve = resolve; //# sourceMappingURL=path.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/rewriteframes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const path = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/path.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'RewriteFrames';
/**
 * Rewrite event frames paths.
 */ const rewriteFramesIntegration = integration.defineIntegration((options = {})=>{
    const root = options.root;
    const prefix = options.prefix || 'app:///';
    const isBrowser = 'window' in worldwide.GLOBAL_OBJ && !!worldwide.GLOBAL_OBJ.window;
    const iteratee = options.iteratee || generateIteratee({
        isBrowser,
        root,
        prefix
    });
    /** Process an exception event. */ function _processExceptionsEvent(event) {
        try {
            return {
                ...event,
                exception: {
                    ...event.exception,
                    // The check for this is performed inside `process` call itself, safe to skip here
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    values: event.exception.values.map((value)=>({
                            ...value,
                            ...value.stacktrace && {
                                stacktrace: _processStacktrace(value.stacktrace)
                            }
                        }))
                }
            };
        } catch  {
            return event;
        }
    }
    /** Process a stack trace. */ function _processStacktrace(stacktrace) {
        return {
            ...stacktrace,
            frames: stacktrace?.frames?.map((f)=>iteratee(f))
        };
    }
    return {
        name: INTEGRATION_NAME,
        processEvent (originalEvent) {
            let processedEvent = originalEvent;
            if (originalEvent.exception && Array.isArray(originalEvent.exception.values)) {
                processedEvent = _processExceptionsEvent(processedEvent);
            }
            return processedEvent;
        }
    };
});
/**
 * Exported only for tests.
 */ function generateIteratee({ isBrowser, root, prefix }) {
    return (frame)=>{
        if (!frame.filename) {
            return frame;
        }
        // Determine if this is a Windows frame by checking for a Windows-style prefix such as `C:\`
        const isWindowsFrame = /^[a-zA-Z]:\\/.test(frame.filename) || frame.filename.includes('\\') && !frame.filename.includes('/');
        // Check if the frame filename begins with `/`
        const startsWithSlash = /^\//.test(frame.filename);
        if (isBrowser) {
            if (root) {
                const oldFilename = frame.filename;
                if (oldFilename.indexOf(root) === 0) {
                    frame.filename = oldFilename.replace(root, prefix);
                }
            }
        } else {
            if (isWindowsFrame || startsWithSlash) {
                const filename = isWindowsFrame ? frame.filename.replace(/^[a-zA-Z]:/, '') // remove Windows-style prefix
                .replace(/\\/g, '/') // replace all `\\` instances with `/`
                 : frame.filename;
                const base = root ? path.relative(root, filename) : path.basename(filename);
                frame.filename = `${prefix}${base}`;
            }
        }
        return frame;
    };
}
exports.generateIteratee = generateIteratee;
exports.rewriteFramesIntegration = rewriteFramesIntegration; //# sourceMappingURL=rewriteframes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/supabase.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const breadcrumbs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/breadcrumbs.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
// Based on Kamil Ogórek's work on:
// https://github.com/supabase-community/sentry-integration-js
const AUTH_OPERATIONS_TO_INSTRUMENT = [
    'reauthenticate',
    'signInAnonymously',
    'signInWithOAuth',
    'signInWithIdToken',
    'signInWithOtp',
    'signInWithPassword',
    'signInWithSSO',
    'signOut',
    'signUp',
    'verifyOtp'
];
const AUTH_ADMIN_OPERATIONS_TO_INSTRUMENT = [
    'createUser',
    'deleteUser',
    'listUsers',
    'getUserById',
    'updateUserById',
    'inviteUserByEmail'
];
const FILTER_MAPPINGS = {
    eq: 'eq',
    neq: 'neq',
    gt: 'gt',
    gte: 'gte',
    lt: 'lt',
    lte: 'lte',
    like: 'like',
    'like(all)': 'likeAllOf',
    'like(any)': 'likeAnyOf',
    ilike: 'ilike',
    'ilike(all)': 'ilikeAllOf',
    'ilike(any)': 'ilikeAnyOf',
    is: 'is',
    in: 'in',
    cs: 'contains',
    cd: 'containedBy',
    sr: 'rangeGt',
    nxl: 'rangeGte',
    sl: 'rangeLt',
    nxr: 'rangeLte',
    adj: 'rangeAdjacent',
    ov: 'overlaps',
    fts: '',
    plfts: 'plain',
    phfts: 'phrase',
    wfts: 'websearch',
    not: 'not'
};
const DB_OPERATIONS_TO_INSTRUMENT = [
    'select',
    'insert',
    'upsert',
    'update',
    'delete'
];
function markAsInstrumented(fn) {
    try {
        fn.__SENTRY_INSTRUMENTED__ = true;
    } catch  {
    // ignore errors here
    }
}
function isInstrumented(fn) {
    try {
        return fn.__SENTRY_INSTRUMENTED__;
    } catch  {
        return false;
    }
}
/**
 * Extracts the database operation type from the HTTP method and headers
 * @param method - The HTTP method of the request
 * @param headers - The request headers
 * @returns The database operation type ('select', 'insert', 'upsert', 'update', or 'delete')
 */ function extractOperation(method, headers = {}) {
    switch(method){
        case 'GET':
            {
                return 'select';
            }
        case 'POST':
            {
                if (headers['Prefer']?.includes('resolution=')) {
                    return 'upsert';
                } else {
                    return 'insert';
                }
            }
        case 'PATCH':
            {
                return 'update';
            }
        case 'DELETE':
            {
                return 'delete';
            }
        default:
            {
                return '<unknown-op>';
            }
    }
}
/**
 * Translates Supabase filter parameters into readable method names for tracing
 * @param key - The filter key from the URL search parameters
 * @param query - The filter value from the URL search parameters
 * @returns A string representation of the filter as a method call
 */ function translateFiltersIntoMethods(key, query) {
    if (query === '' || query === '*') {
        return 'select(*)';
    }
    if (key === 'select') {
        return `select(${query})`;
    }
    if (key === 'or' || key.endsWith('.or')) {
        return `${key}${query}`;
    }
    const [filter, ...value] = query.split('.');
    let method;
    // Handle optional `configPart` of the filter
    if (filter?.startsWith('fts')) {
        method = 'textSearch';
    } else if (filter?.startsWith('plfts')) {
        method = 'textSearch[plain]';
    } else if (filter?.startsWith('phfts')) {
        method = 'textSearch[phrase]';
    } else if (filter?.startsWith('wfts')) {
        method = 'textSearch[websearch]';
    } else {
        method = filter && FILTER_MAPPINGS[filter] || 'filter';
    }
    return `${method}(${key}, ${value.join('.')})`;
}
function instrumentAuthOperation(operation, isAdmin = false) {
    return new Proxy(operation, {
        apply (target, thisArg, argumentsList) {
            return trace.startSpan({
                name: `auth ${isAdmin ? '(admin) ' : ''}${operation.name}`,
                attributes: {
                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.db.supabase',
                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'db',
                    'db.system': 'postgresql',
                    'db.operation': `auth.${isAdmin ? 'admin.' : ''}${operation.name}`
                }
            }, (span)=>{
                return Reflect.apply(target, thisArg, argumentsList).then((res)=>{
                    if (res && typeof res === 'object' && 'error' in res && res.error) {
                        span.setStatus({
                            code: spanstatus.SPAN_STATUS_ERROR
                        });
                        exports$1.captureException(res.error, {
                            mechanism: {
                                handled: false,
                                type: 'auto.db.supabase.auth'
                            }
                        });
                    } else {
                        span.setStatus({
                            code: spanstatus.SPAN_STATUS_OK
                        });
                    }
                    span.end();
                    return res;
                }).catch((err)=>{
                    span.setStatus({
                        code: spanstatus.SPAN_STATUS_ERROR
                    });
                    span.end();
                    exports$1.captureException(err, {
                        mechanism: {
                            handled: false,
                            type: 'auto.db.supabase.auth'
                        }
                    });
                    throw err;
                }).then(...argumentsList);
            });
        }
    });
}
function instrumentSupabaseAuthClient(supabaseClientInstance) {
    const auth = supabaseClientInstance.auth;
    if (!auth || isInstrumented(supabaseClientInstance.auth)) {
        return;
    }
    for (const operation of AUTH_OPERATIONS_TO_INSTRUMENT){
        const authOperation = auth[operation];
        if (!authOperation) {
            continue;
        }
        if (typeof supabaseClientInstance.auth[operation] === 'function') {
            supabaseClientInstance.auth[operation] = instrumentAuthOperation(authOperation);
        }
    }
    for (const operation of AUTH_ADMIN_OPERATIONS_TO_INSTRUMENT){
        const authOperation = auth.admin[operation];
        if (!authOperation) {
            continue;
        }
        if (typeof supabaseClientInstance.auth.admin[operation] === 'function') {
            supabaseClientInstance.auth.admin[operation] = instrumentAuthOperation(authOperation, true);
        }
    }
    markAsInstrumented(supabaseClientInstance.auth);
}
function instrumentSupabaseClientConstructor(SupabaseClient) {
    if (isInstrumented(SupabaseClient.prototype.from)) {
        return;
    }
    SupabaseClient.prototype.from = new Proxy(SupabaseClient.prototype.from, {
        apply (target, thisArg, argumentsList) {
            const rv = Reflect.apply(target, thisArg, argumentsList);
            const PostgRESTQueryBuilder = rv.constructor;
            instrumentPostgRESTQueryBuilder(PostgRESTQueryBuilder);
            return rv;
        }
    });
    markAsInstrumented(SupabaseClient.prototype.from);
}
function instrumentPostgRESTFilterBuilder(PostgRESTFilterBuilder) {
    if (isInstrumented(PostgRESTFilterBuilder.prototype.then)) {
        return;
    }
    PostgRESTFilterBuilder.prototype.then = new Proxy(PostgRESTFilterBuilder.prototype.then, {
        apply (target, thisArg, argumentsList) {
            const operations = DB_OPERATIONS_TO_INSTRUMENT;
            const typedThis = thisArg;
            const operation = extractOperation(typedThis.method, typedThis.headers);
            if (!operations.includes(operation)) {
                return Reflect.apply(target, thisArg, argumentsList);
            }
            if (!typedThis?.url?.pathname || typeof typedThis.url.pathname !== 'string') {
                return Reflect.apply(target, thisArg, argumentsList);
            }
            const pathParts = typedThis.url.pathname.split('/');
            const table = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';
            const queryItems = [];
            for (const [key, value] of typedThis.url.searchParams.entries()){
                // It's possible to have multiple entries for the same key, eg. `id=eq.7&id=eq.3`,
                // so we need to use array instead of object to collect them.
                queryItems.push(translateFiltersIntoMethods(key, value));
            }
            const body = Object.create(null);
            if (is.isPlainObject(typedThis.body)) {
                for (const [key, value] of Object.entries(typedThis.body)){
                    body[key] = value;
                }
            }
            // Adding operation to the beginning of the description if it's not a `select` operation
            // For example, it can be an `insert` or `update` operation but the query can be `select(...)`
            // For `select` operations, we don't need repeat it in the description
            const description = `${operation === 'select' ? '' : `${operation}${body ? '(...) ' : ''}`}${queryItems.join(' ')} from(${table})`;
            const attributes = {
                'db.table': table,
                'db.schema': typedThis.schema,
                'db.url': typedThis.url.origin,
                'db.sdk': typedThis.headers['X-Client-Info'],
                'db.system': 'postgresql',
                'db.operation': operation,
                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.db.supabase',
                [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'db'
            };
            if (queryItems.length) {
                attributes['db.query'] = queryItems;
            }
            if (Object.keys(body).length) {
                attributes['db.body'] = body;
            }
            return trace.startSpan({
                name: description,
                attributes
            }, (span)=>{
                return Reflect.apply(target, thisArg, []).then((res)=>{
                    if (span) {
                        if (res && typeof res === 'object' && 'status' in res) {
                            spanstatus.setHttpStatus(span, res.status || 500);
                        }
                        span.end();
                    }
                    if (res.error) {
                        const err = new Error(res.error.message);
                        if (res.error.code) {
                            err.code = res.error.code;
                        }
                        if (res.error.details) {
                            err.details = res.error.details;
                        }
                        const supabaseContext = {};
                        if (queryItems.length) {
                            supabaseContext.query = queryItems;
                        }
                        if (Object.keys(body).length) {
                            supabaseContext.body = body;
                        }
                        exports$1.captureException(err, (scope)=>{
                            scope.addEventProcessor((e)=>{
                                misc.addExceptionMechanism(e, {
                                    handled: false,
                                    type: 'auto.db.supabase.postgres'
                                });
                                return e;
                            });
                            scope.setContext('supabase', supabaseContext);
                            return scope;
                        });
                    }
                    const breadcrumb = {
                        type: 'supabase',
                        category: `db.${operation}`,
                        message: description
                    };
                    const data = {};
                    if (queryItems.length) {
                        data.query = queryItems;
                    }
                    if (Object.keys(body).length) {
                        data.body = body;
                    }
                    if (Object.keys(data).length) {
                        breadcrumb.data = data;
                    }
                    breadcrumbs.addBreadcrumb(breadcrumb);
                    return res;
                }, (err)=>{
                    // TODO: shouldn't we capture this error?
                    if (span) {
                        spanstatus.setHttpStatus(span, 500);
                        span.end();
                    }
                    throw err;
                }).then(...argumentsList);
            });
        }
    });
    markAsInstrumented(PostgRESTFilterBuilder.prototype.then);
}
function instrumentPostgRESTQueryBuilder(PostgRESTQueryBuilder) {
    // We need to wrap _all_ operations despite them sharing the same `PostgRESTFilterBuilder`
    // constructor, as we don't know which method will be called first, and we don't want to miss any calls.
    for (const operation of DB_OPERATIONS_TO_INSTRUMENT){
        if (isInstrumented(PostgRESTQueryBuilder.prototype[operation])) {
            continue;
        }
        PostgRESTQueryBuilder.prototype[operation] = new Proxy(PostgRESTQueryBuilder.prototype[operation], {
            apply (target, thisArg, argumentsList) {
                const rv = Reflect.apply(target, thisArg, argumentsList);
                const PostgRESTFilterBuilder = rv.constructor;
                debugBuild.DEBUG_BUILD && debugLogger.debug.log(`Instrumenting ${operation} operation's PostgRESTFilterBuilder`);
                instrumentPostgRESTFilterBuilder(PostgRESTFilterBuilder);
                return rv;
            }
        });
        markAsInstrumented(PostgRESTQueryBuilder.prototype[operation]);
    }
}
const instrumentSupabaseClient = (supabaseClient)=>{
    if (!supabaseClient) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Supabase integration was not installed because no Supabase client was provided.');
        return;
    }
    const SupabaseClientConstructor = supabaseClient.constructor === Function ? supabaseClient : supabaseClient.constructor;
    instrumentSupabaseClientConstructor(SupabaseClientConstructor);
    instrumentSupabaseAuthClient(supabaseClient);
};
const INTEGRATION_NAME = 'Supabase';
const _supabaseIntegration = (supabaseClient)=>{
    return {
        setupOnce () {
            instrumentSupabaseClient(supabaseClient);
        },
        name: INTEGRATION_NAME
    };
};
const supabaseIntegration = integration.defineIntegration((options)=>{
    return _supabaseIntegration(options.supabaseClient);
});
exports.DB_OPERATIONS_TO_INSTRUMENT = DB_OPERATIONS_TO_INSTRUMENT;
exports.FILTER_MAPPINGS = FILTER_MAPPINGS;
exports.extractOperation = extractOperation;
exports.instrumentSupabaseClient = instrumentSupabaseClient;
exports.supabaseIntegration = supabaseIntegration;
exports.translateFiltersIntoMethods = translateFiltersIntoMethods; //# sourceMappingURL=supabase.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/zoderrors.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const DEFAULT_LIMIT = 10;
const INTEGRATION_NAME = 'ZodErrors';
/**
 * Simplified ZodIssue type definition
 */ function originalExceptionIsZodError(originalException) {
    return is.isError(originalException) && originalException.name === 'ZodError' && Array.isArray(originalException.issues);
}
/**
 * Formats child objects or arrays to a string
 * that is preserved when sent to Sentry.
 *
 * Without this, we end up with something like this in Sentry:
 *
 * [
 *  [Object],
 *  [Object],
 *  [Object],
 *  [Object]
 * ]
 */ function flattenIssue(issue) {
    return {
        ...issue,
        path: 'path' in issue && Array.isArray(issue.path) ? issue.path.join('.') : undefined,
        keys: 'keys' in issue ? JSON.stringify(issue.keys) : undefined,
        unionErrors: 'unionErrors' in issue ? JSON.stringify(issue.unionErrors) : undefined
    };
}
/**
 * Takes ZodError issue path array and returns a flattened version as a string.
 * This makes it easier to display paths within a Sentry error message.
 *
 * Array indexes are normalized to reduce duplicate entries
 *
 * @param path ZodError issue path
 * @returns flattened path
 *
 * @example
 * flattenIssuePath([0, 'foo', 1, 'bar']) // -> '<array>.foo.<array>.bar'
 */ function flattenIssuePath(path) {
    return path.map((p)=>{
        if (typeof p === 'number') {
            return '<array>';
        } else {
            return p;
        }
    }).join('.');
}
/**
 * Zod error message is a stringified version of ZodError.issues
 * This doesn't display well in the Sentry UI. Replace it with something shorter.
 */ function formatIssueMessage(zodError) {
    const errorKeyMap = new Set();
    for (const iss of zodError.issues){
        const issuePath = flattenIssuePath(iss.path);
        if (issuePath.length > 0) {
            errorKeyMap.add(issuePath);
        }
    }
    const errorKeys = Array.from(errorKeyMap);
    if (errorKeys.length === 0) {
        // If there are no keys, then we're likely validating the root
        // variable rather than a key within an object. This attempts
        // to extract what type it was that failed to validate.
        // For example, z.string().parse(123) would return "string" here.
        let rootExpectedType = 'variable';
        if (zodError.issues.length > 0) {
            const iss = zodError.issues[0];
            if (iss !== undefined && 'expected' in iss && typeof iss.expected === 'string') {
                rootExpectedType = iss.expected;
            }
        }
        return `Failed to validate ${rootExpectedType}`;
    }
    return `Failed to validate keys: ${string.truncate(errorKeys.join(', '), 100)}`;
}
/**
 * Applies ZodError issues to an event extra and replaces the error message
 */ function applyZodErrorsToEvent(limit, saveZodIssuesAsAttachment = false, event, hint) {
    if (!event.exception?.values || !hint.originalException || !originalExceptionIsZodError(hint.originalException) || hint.originalException.issues.length === 0) {
        return event;
    }
    try {
        const issuesToFlatten = saveZodIssuesAsAttachment ? hint.originalException.issues : hint.originalException.issues.slice(0, limit);
        const flattenedIssues = issuesToFlatten.map(flattenIssue);
        if (saveZodIssuesAsAttachment) {
            // Sometimes having the full error details can be helpful.
            // Attachments have much higher limits, so we can include the full list of issues.
            if (!Array.isArray(hint.attachments)) {
                hint.attachments = [];
            }
            hint.attachments.push({
                filename: 'zod_issues.json',
                data: JSON.stringify({
                    issues: flattenedIssues
                })
            });
        }
        return {
            ...event,
            exception: {
                ...event.exception,
                values: [
                    {
                        ...event.exception.values[0],
                        value: formatIssueMessage(hint.originalException)
                    },
                    ...event.exception.values.slice(1)
                ]
            },
            extra: {
                ...event.extra,
                'zoderror.issues': flattenedIssues.slice(0, limit)
            }
        };
    } catch (e) {
        // Hopefully we never throw errors here, but record it
        // with the event just in case.
        return {
            ...event,
            extra: {
                ...event.extra,
                'zoderrors sentry integration parse error': {
                    message: 'an exception was thrown while processing ZodError within applyZodErrorsToEvent()',
                    error: e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : 'unknown'
                }
            }
        };
    }
}
const _zodErrorsIntegration = (options = {})=>{
    const limit = options.limit ?? DEFAULT_LIMIT;
    return {
        name: INTEGRATION_NAME,
        processEvent (originalEvent, hint) {
            const processedEvent = applyZodErrorsToEvent(limit, options.saveZodIssuesAsAttachment, originalEvent, hint);
            return processedEvent;
        }
    };
};
/**
 * Sentry integration to process Zod errors, making them easier to work with in Sentry.
 */ const zodErrorsIntegration = integration.defineIntegration(_zodErrorsIntegration);
exports.applyZodErrorsToEvent = applyZodErrorsToEvent;
exports.flattenIssue = flattenIssue;
exports.flattenIssuePath = flattenIssuePath;
exports.formatIssueMessage = formatIssueMessage;
exports.zodErrorsIntegration = zodErrorsIntegration; //# sourceMappingURL=zoderrors.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/third-party-errors-filter.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const metadata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/metadata.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
/**
 * This integration allows you to filter out, or tag error events that do not come from user code marked with a bundle key via the Sentry bundler plugins.
 */ const thirdPartyErrorFilterIntegration = integration.defineIntegration((options)=>{
    return {
        name: 'ThirdPartyErrorsFilter',
        setup (client) {
            // We need to strip metadata from stack frames before sending them to Sentry since these are client side only.
            // TODO(lforst): Move this cleanup logic into a more central place in the SDK.
            client.on('beforeEnvelope', (envelope$1)=>{
                envelope.forEachEnvelopeItem(envelope$1, (item, type)=>{
                    if (type === 'event') {
                        const event = Array.isArray(item) ? item[1] : undefined;
                        if (event) {
                            metadata.stripMetadataFromStackFrames(event);
                            item[1] = event;
                        }
                    }
                });
            });
            client.on('applyFrameMetadata', (event)=>{
                // Only apply stack frame metadata to error events
                if (event.type) {
                    return;
                }
                const stackParser = client.getOptions().stackParser;
                metadata.addMetadataToStackFrames(stackParser, event);
            });
        },
        processEvent (event) {
            const frameKeys = getBundleKeysForAllFramesWithFilenames(event);
            if (frameKeys) {
                const arrayMethod = options.behaviour === 'drop-error-if-contains-third-party-frames' || options.behaviour === 'apply-tag-if-contains-third-party-frames' ? 'some' : 'every';
                const behaviourApplies = frameKeys[arrayMethod]((keys)=>!keys.some((key)=>options.filterKeys.includes(key)));
                if (behaviourApplies) {
                    const shouldDrop = options.behaviour === 'drop-error-if-contains-third-party-frames' || options.behaviour === 'drop-error-if-exclusively-contains-third-party-frames';
                    if (shouldDrop) {
                        return null;
                    } else {
                        event.tags = {
                            ...event.tags,
                            third_party_code: true
                        };
                    }
                }
            }
            return event;
        }
    };
});
function getBundleKeysForAllFramesWithFilenames(event) {
    const frames = stacktrace.getFramesFromEvent(event);
    if (!frames) {
        return undefined;
    }
    return frames// Exclude frames without a filename since these are likely native code or built-ins
    .filter((frame)=>!!frame.filename).map((frame)=>{
        if (frame.module_metadata) {
            return Object.keys(frame.module_metadata).filter((key)=>key.startsWith(BUNDLER_PLUGIN_APP_KEY_PREFIX)).map((key)=>key.slice(BUNDLER_PLUGIN_APP_KEY_PREFIX.length));
        }
        return [];
    });
}
const BUNDLER_PLUGIN_APP_KEY_PREFIX = '_sentryBundlerPluginAppKey:';
exports.thirdPartyErrorFilterIntegration = thirdPartyErrorFilterIntegration; //# sourceMappingURL=third-party-errors-filter.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/console.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const breadcrumbs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/breadcrumbs.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const console = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/console.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const severity = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/severity.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'Console';
/**
 * Captures calls to the `console` API as breadcrumbs in Sentry.
 *
 * By default the integration instruments `console.debug`, `console.info`, `console.warn`, `console.error`,
 * `console.log`, `console.trace`, and `console.assert`. You can use the `levels` option to customize which
 * levels are captured.
 *
 * @example
 *
 * ```js
 * Sentry.init({
 *   integrations: [Sentry.consoleIntegration({ levels: ['error', 'warn'] })],
 * });
 * ```
 */ const consoleIntegration = integration.defineIntegration((options = {})=>{
    const levels = new Set(options.levels || debugLogger.CONSOLE_LEVELS);
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            console.addConsoleInstrumentationHandler(({ args, level })=>{
                if (currentScopes.getClient() !== client || !levels.has(level)) {
                    return;
                }
                addConsoleBreadcrumb(level, args);
            });
        }
    };
});
/**
 * Capture a console breadcrumb.
 *
 * Exported just for tests.
 */ function addConsoleBreadcrumb(level, args) {
    const breadcrumb = {
        category: 'console',
        data: {
            arguments: args,
            logger: 'console'
        },
        level: severity.severityLevelFromString(level),
        message: formatConsoleArgs(args)
    };
    if (level === 'assert') {
        if (args[0] === false) {
            const assertionArgs = args.slice(1);
            breadcrumb.message = assertionArgs.length > 0 ? `Assertion failed: ${formatConsoleArgs(assertionArgs)}` : 'Assertion failed';
            breadcrumb.data.arguments = assertionArgs;
        } else {
            // Don't capture a breadcrumb for passed assertions
            return;
        }
    }
    breadcrumbs.addBreadcrumb(breadcrumb, {
        input: args,
        level
    });
}
function formatConsoleArgs(values) {
    return 'util' in worldwide.GLOBAL_OBJ && typeof worldwide.GLOBAL_OBJ.util.format === 'function' ? worldwide.GLOBAL_OBJ.util.format(...values) : string.safeJoin(values, ' ');
}
exports.addConsoleBreadcrumb = addConsoleBreadcrumb;
exports.consoleIntegration = consoleIntegration; //# sourceMappingURL=console.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/featureFlags.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
/**
 * Ordered LRU cache for storing feature flags in the scope context. The name
 * of each flag in the buffer is unique, and the output of getAll() is ordered
 * from oldest to newest.
 */ /**
 * Max size of the LRU flag buffer stored in Sentry scope and event contexts.
 */ const _INTERNAL_FLAG_BUFFER_SIZE = 100;
/**
 * Max number of flag evaluations to record per span.
 */ const _INTERNAL_MAX_FLAGS_PER_SPAN = 10;
const SPAN_FLAG_ATTRIBUTE_PREFIX = 'flag.evaluation.';
/**
 * Copies feature flags that are in current scope context to the event context
 */ function _INTERNAL_copyFlagsFromScopeToEvent(event) {
    const scope = currentScopes.getCurrentScope();
    const flagContext = scope.getScopeData().contexts.flags;
    const flagBuffer = flagContext ? flagContext.values : [];
    if (!flagBuffer.length) {
        return event;
    }
    if (event.contexts === undefined) {
        event.contexts = {};
    }
    event.contexts.flags = {
        values: [
            ...flagBuffer
        ]
    };
    return event;
}
/**
 * Inserts a flag into the current scope's context while maintaining ordered LRU properties.
 * Not thread-safe. After inserting:
 * - The flag buffer is sorted in order of recency, with the newest evaluation at the end.
 * - The names in the buffer are always unique.
 * - The length of the buffer never exceeds `maxSize`.
 *
 * @param name     Name of the feature flag to insert.
 * @param value    Value of the feature flag.
 * @param maxSize  Max number of flags the buffer should store. Default value should always be used in production.
 */ function _INTERNAL_insertFlagToScope(name, value, maxSize = _INTERNAL_FLAG_BUFFER_SIZE) {
    const scopeContexts = currentScopes.getCurrentScope().getScopeData().contexts;
    if (!scopeContexts.flags) {
        scopeContexts.flags = {
            values: []
        };
    }
    const flags = scopeContexts.flags.values;
    _INTERNAL_insertToFlagBuffer(flags, name, value, maxSize);
}
/**
 * Exported for tests only. Currently only accepts boolean values (otherwise no-op).
 * Inserts a flag into a FeatureFlag array while maintaining the following properties:
 * - Flags are sorted in order of recency, with the newest evaluation at the end.
 * - The flag names are always unique.
 * - The length of the array never exceeds `maxSize`.
 *
 * @param flags      The buffer to insert the flag into.
 * @param name       Name of the feature flag to insert.
 * @param value      Value of the feature flag.
 * @param maxSize    Max number of flags the buffer should store. Default value should always be used in production.
 */ function _INTERNAL_insertToFlagBuffer(flags, name, value, maxSize) {
    if (typeof value !== 'boolean') {
        return;
    }
    if (flags.length > maxSize) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.error(`[Feature Flags] insertToFlagBuffer called on a buffer larger than maxSize=${maxSize}`);
        return;
    }
    // Check if the flag is already in the buffer - O(n)
    const index = flags.findIndex((f)=>f.flag === name);
    if (index !== -1) {
        // The flag was found, remove it from its current position - O(n)
        flags.splice(index, 1);
    }
    if (flags.length === maxSize) {
        // If at capacity, pop the earliest flag - O(n)
        flags.shift();
    }
    // Push the flag to the end - O(1)
    flags.push({
        flag: name,
        result: value
    });
}
/**
 * Records a feature flag evaluation for the active span. This is a no-op for non-boolean values.
 * The flag and its value is stored in span attributes with the `flag.evaluation` prefix. Once the
 * unique flags for a span reaches maxFlagsPerSpan, subsequent flags are dropped.
 *
 * @param name             Name of the feature flag.
 * @param value            Value of the feature flag. Non-boolean values are ignored.
 * @param maxFlagsPerSpan  Max number of flags a buffer should store. Default value should always be used in production.
 */ function _INTERNAL_addFeatureFlagToActiveSpan(name, value, maxFlagsPerSpan = _INTERNAL_MAX_FLAGS_PER_SPAN) {
    if (typeof value !== 'boolean') {
        return;
    }
    const span = spanUtils.getActiveSpan();
    if (!span) {
        return;
    }
    const attributes = spanUtils.spanToJSON(span).data;
    // If the flag already exists, always update it
    if (`${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}` in attributes) {
        span.setAttribute(`${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}`, value);
        return;
    }
    // Else, add the flag to the span if we have not reached the max number of flags
    const numOfAddedFlags = Object.keys(attributes).filter((key)=>key.startsWith(SPAN_FLAG_ATTRIBUTE_PREFIX)).length;
    if (numOfAddedFlags < maxFlagsPerSpan) {
        span.setAttribute(`${SPAN_FLAG_ATTRIBUTE_PREFIX}${name}`, value);
    }
}
exports._INTERNAL_FLAG_BUFFER_SIZE = _INTERNAL_FLAG_BUFFER_SIZE;
exports._INTERNAL_MAX_FLAGS_PER_SPAN = _INTERNAL_MAX_FLAGS_PER_SPAN;
exports._INTERNAL_addFeatureFlagToActiveSpan = _INTERNAL_addFeatureFlagToActiveSpan;
exports._INTERNAL_copyFlagsFromScopeToEvent = _INTERNAL_copyFlagsFromScopeToEvent;
exports._INTERNAL_insertFlagToScope = _INTERNAL_insertFlagToScope;
exports._INTERNAL_insertToFlagBuffer = _INTERNAL_insertToFlagBuffer; //# sourceMappingURL=featureFlags.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/featureFlags/featureFlagsIntegration.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const featureFlags = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/featureFlags.js [app-ssr] (ecmascript)");
/**
 * Sentry integration for buffering feature flag evaluations manually with an API, and
 * capturing them on error events and spans.
 *
 * See the [feature flag documentation](https://develop.sentry.dev/sdk/expected-features/#feature-flags) for more information.
 *
 * @example
 * ```
 * import * as Sentry from '@sentry/browser';
 * import { type FeatureFlagsIntegration } from '@sentry/browser';
 *
 * // Setup
 * Sentry.init(..., integrations: [Sentry.featureFlagsIntegration()])
 *
 * // Verify
 * const flagsIntegration = Sentry.getClient()?.getIntegrationByName<FeatureFlagsIntegration>('FeatureFlags');
 * if (flagsIntegration) {
 *   flagsIntegration.addFeatureFlag('my-flag', true);
 * } else {
 *   // check your setup
 * }
 * Sentry.captureException(Exception('broke')); // 'my-flag' should be captured to this Sentry event.
 * ```
 */ const featureFlagsIntegration = integration.defineIntegration(()=>{
    return {
        name: 'FeatureFlags',
        processEvent (event, _hint, _client) {
            return featureFlags._INTERNAL_copyFlagsFromScopeToEvent(event);
        },
        addFeatureFlag (name, value) {
            featureFlags._INTERNAL_insertFlagToScope(name, value);
            featureFlags._INTERNAL_addFeatureFlagToActiveSpan(name, value);
        }
    };
});
exports.featureFlagsIntegration = featureFlagsIntegration; //# sourceMappingURL=featureFlagsIntegration.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/profiling.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
function isProfilingIntegrationWithProfiler(integration) {
    return !!integration && typeof integration['_profiler'] !== 'undefined' && typeof integration['_profiler']['start'] === 'function' && typeof integration['_profiler']['stop'] === 'function';
}
/**
 * Starts the Sentry continuous profiler.
 * This mode is exclusive with the transaction profiler and will only work if the profilesSampleRate is set to a falsy value.
 * In continuous profiling mode, the profiler will keep reporting profile chunks to Sentry until it is stopped, which allows for continuous profiling of the application.
 */ function startProfiler() {
    const client = currentScopes.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No Sentry client available, profiling is not started');
        return;
    }
    const integration = client.getIntegrationByName('ProfilingIntegration');
    if (!integration) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('ProfilingIntegration is not available');
        return;
    }
    if (!isProfilingIntegrationWithProfiler(integration)) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Profiler is not available on profiling integration.');
        return;
    }
    integration._profiler.start();
}
/**
 * Stops the Sentry continuous profiler.
 * Calls to stop will stop the profiler and flush the currently collected profile data to Sentry.
 */ function stopProfiler() {
    const client = currentScopes.getClient();
    if (!client) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('No Sentry client available, profiling is not started');
        return;
    }
    const integration = client.getIntegrationByName('ProfilingIntegration');
    if (!integration) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('ProfilingIntegration is not available');
        return;
    }
    if (!isProfilingIntegrationWithProfiler(integration)) {
        debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Profiler is not available on profiling integration.');
        return;
    }
    integration._profiler.stop();
}
const profiler = {
    startProfiler,
    stopProfiler
};
exports.profiler = profiler; //# sourceMappingURL=profiling.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
// Curious about `thismessage:/`? See: https://www.rfc-editor.org/rfc/rfc2557.html
//  > When the methods above do not yield an absolute URI, a base URL
//  > of "thismessage:/" MUST be employed. This base URL has been
//  > defined for the sole purpose of resolving relative references
//  > within a multipart/related structure when no other base URI is
//  > specified.
//
// We need to provide a base URL to `parseStringToURLObject` because the fetch API gives us a
// relative URL sometimes.
//
// This is the only case where we need to provide a base URL to `parseStringToURLObject`
// because the relative URL is not valid on its own.
const DEFAULT_BASE_URL = 'thismessage:/';
/**
 * Checks if the URL object is relative
 *
 * @param url - The URL object to check
 * @returns True if the URL object is relative, false otherwise
 */ function isURLObjectRelative(url) {
    return 'isRelative' in url;
}
/**
 * Parses string to a URL object
 *
 * @param url - The URL to parse
 * @returns The parsed URL object or undefined if the URL is invalid
 */ function parseStringToURLObject(url, urlBase) {
    const isRelative = url.indexOf('://') <= 0 && url.indexOf('//') !== 0;
    const base = urlBase ?? (isRelative ? DEFAULT_BASE_URL : undefined);
    try {
        // Use `canParse` to short-circuit the URL constructor if it's not a valid URL
        // This is faster than trying to construct the URL and catching the error
        // Node 20+, Chrome 120+, Firefox 115+, Safari 17+
        if ('canParse' in URL && !URL.canParse(url, base)) {
            return undefined;
        }
        const fullUrlObject = new URL(url, base);
        if (isRelative) {
            // Because we used a fake base URL, we need to return a relative URL object.
            // We cannot return anything about the origin, host, etc. because it will refer to the fake base URL.
            return {
                isRelative,
                pathname: fullUrlObject.pathname,
                search: fullUrlObject.search,
                hash: fullUrlObject.hash
            };
        }
        return fullUrlObject;
    } catch  {
    // empty body
    }
    return undefined;
}
/**
 * Takes a URL object and returns a sanitized string which is safe to use as span name
 * see: https://develop.sentry.dev/sdk/data-handling/#structuring-data
 */ function getSanitizedUrlStringFromUrlObject(url) {
    if (isURLObjectRelative(url)) {
        return url.pathname;
    }
    const newUrl = new URL(url);
    newUrl.search = '';
    newUrl.hash = '';
    if ([
        '80',
        '443'
    ].includes(newUrl.port)) {
        newUrl.port = '';
    }
    if (newUrl.password) {
        newUrl.password = '%filtered%';
    }
    if (newUrl.username) {
        newUrl.username = '%filtered%';
    }
    return newUrl.toString();
}
function getHttpSpanNameFromUrlObject(urlObject, kind, request, routeName) {
    const method = request?.method?.toUpperCase() ?? 'GET';
    const route = routeName ? routeName : urlObject ? kind === 'client' ? getSanitizedUrlStringFromUrlObject(urlObject) : urlObject.pathname : '/';
    return `${method} ${route}`;
}
/**
 * Takes a parsed URL object and returns a set of attributes for the span
 * that represents the HTTP request for that url. This is used for both server
 * and client http spans.
 *
 * Follows https://opentelemetry.io/docs/specs/semconv/http/.
 *
 * @param urlObject - see {@link parseStringToURLObject}
 * @param kind - The type of HTTP operation (server or client)
 * @param spanOrigin - The origin of the span
 * @param request - The request object, see {@link PartialRequest}
 * @param routeName - The name of the route, must be low cardinality
 * @returns The span name and attributes for the HTTP operation
 */ function getHttpSpanDetailsFromUrlObject(urlObject, kind, spanOrigin, request, routeName) {
    const attributes = {
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'url'
    };
    if (routeName) {
        // This is based on https://opentelemetry.io/docs/specs/semconv/http/http-spans/#name
        attributes[kind === 'server' ? 'http.route' : 'url.template'] = routeName;
        attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = 'route';
    }
    if (request?.method) {
        attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD] = request.method.toUpperCase();
    }
    if (urlObject) {
        if (urlObject.search) {
            attributes['url.query'] = urlObject.search;
        }
        if (urlObject.hash) {
            attributes['url.fragment'] = urlObject.hash;
        }
        if (urlObject.pathname) {
            attributes['url.path'] = urlObject.pathname;
            if (urlObject.pathname === '/') {
                attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = 'route';
            }
        }
        if (!isURLObjectRelative(urlObject)) {
            attributes[semanticAttributes.SEMANTIC_ATTRIBUTE_URL_FULL] = urlObject.href;
            if (urlObject.port) {
                attributes['url.port'] = urlObject.port;
            }
            if (urlObject.protocol) {
                attributes['url.scheme'] = urlObject.protocol;
            }
            if (urlObject.hostname) {
                attributes[kind === 'server' ? 'server.address' : 'url.domain'] = urlObject.hostname;
            }
        }
    }
    return [
        getHttpSpanNameFromUrlObject(urlObject, kind, request, routeName),
        attributes
    ];
}
/**
 * Parses string form of URL into an object
 * // borrowed from https://tools.ietf.org/html/rfc3986#appendix-B
 * // intentionally using regex and not <a/> href parsing trick because React Native and other
 * // environments where DOM might not be available
 * @returns parsed URL object
 */ function parseUrl(url) {
    if (!url) {
        return {};
    }
    const match = url.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {};
    }
    // coerce to undefined values to empty string so we don't get 'undefined'
    const query = match[6] || '';
    const fragment = match[8] || '';
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        search: query,
        hash: fragment,
        relative: match[5] + query + fragment
    };
}
/**
 * Strip the query string and fragment off of a given URL or path (if present)
 *
 * @param urlPath Full URL or path, including possible query string and/or fragment
 * @returns URL or path without query string or fragment
 */ function stripUrlQueryAndFragment(urlPath) {
    return urlPath.split(/[?#]/, 1)[0];
}
/**
 * Takes a URL object and returns a sanitized string which is safe to use as span name
 * see: https://develop.sentry.dev/sdk/data-handling/#structuring-data
 */ function getSanitizedUrlString(url) {
    const { protocol, host, path } = url;
    const filteredHost = host?.replace(/^.*@/, '[filtered]:[filtered]@').replace(/(:80)$/, '').replace(/(:443)$/, '') || '';
    return `${protocol ? `${protocol}://` : ''}${filteredHost}${path}`;
}
exports.getHttpSpanDetailsFromUrlObject = getHttpSpanDetailsFromUrlObject;
exports.getSanitizedUrlString = getSanitizedUrlString;
exports.getSanitizedUrlStringFromUrlObject = getSanitizedUrlStringFromUrlObject;
exports.isURLObjectRelative = isURLObjectRelative;
exports.parseStringToURLObject = parseStringToURLObject;
exports.parseUrl = parseUrl;
exports.stripUrlQueryAndFragment = stripUrlQueryAndFragment; //# sourceMappingURL=url.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/fetch.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const sentryNonRecordingSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentryNonRecordingSpan.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const traceData = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/traceData.js [app-ssr] (ecmascript)");
const url = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/url.js [app-ssr] (ecmascript)");
/**
 * Create and track fetch request spans for usage in combination with `addFetchInstrumentationHandler`.
 *
 * @returns Span if a span was created, otherwise void.
 */ function instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeaders, spans, spanOrigin = 'auto.http.browser') {
    if (!handlerData.fetchData) {
        return undefined;
    }
    const { method, url } = handlerData.fetchData;
    const shouldCreateSpanResult = hasSpansEnabled.hasSpansEnabled() && shouldCreateSpan(url);
    if (handlerData.endTimestamp && shouldCreateSpanResult) {
        const spanId = handlerData.fetchData.__span;
        if (!spanId) return;
        const span = spans[spanId];
        if (span) {
            endSpan(span, handlerData);
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete spans[spanId];
        }
        return undefined;
    }
    const hasParent = !!spanUtils.getActiveSpan();
    const span = shouldCreateSpanResult && hasParent ? trace.startInactiveSpan(getSpanStartOptions(url, method, spanOrigin)) : new sentryNonRecordingSpan.SentryNonRecordingSpan();
    handlerData.fetchData.__span = span.spanContext().spanId;
    spans[span.spanContext().spanId] = span;
    if (shouldAttachHeaders(handlerData.fetchData.url)) {
        const request = handlerData.args[0];
        const options = handlerData.args[1] || {};
        const headers = _addTracingHeadersToFetchRequest(request, options, // If performance is disabled (TWP) or there's no active root span (pageload/navigation/interaction),
        // we do not want to use the span as base for the trace headers,
        // which means that the headers will be generated from the scope and the sampling decision is deferred
        hasSpansEnabled.hasSpansEnabled() && hasParent ? span : undefined);
        if (headers) {
            // Ensure this is actually set, if no options have been passed previously
            handlerData.args[1] = options;
            options.headers = headers;
        }
    }
    const client = currentScopes.getClient();
    if (client) {
        const fetchHint = {
            input: handlerData.args,
            response: handlerData.response,
            startTimestamp: handlerData.startTimestamp,
            endTimestamp: handlerData.endTimestamp
        };
        client.emit('beforeOutgoingRequestSpan', span, fetchHint);
    }
    return span;
}
/**
 * Adds sentry-trace and baggage headers to the various forms of fetch headers.
 * exported only for testing purposes
 *
 * When we determine if we should add a baggage header, there are 3 cases:
 * 1. No previous baggage header -> add baggage
 * 2. Previous baggage header has no sentry baggage values -> add our baggage
 * 3. Previous baggage header has sentry baggage values -> do nothing (might have been added manually by users)
 */ // eslint-disable-next-line complexity -- yup it's this complicated :(
function _addTracingHeadersToFetchRequest(request, fetchOptionsObj, span) {
    const traceHeaders = traceData.getTraceData({
        span
    });
    const sentryTrace = traceHeaders['sentry-trace'];
    const baggage = traceHeaders.baggage;
    // Nothing to do, when we return undefined here, the original headers will be used
    if (!sentryTrace) {
        return undefined;
    }
    const originalHeaders = fetchOptionsObj.headers || (is.isRequest(request) ? request.headers : undefined);
    if (!originalHeaders) {
        return {
            ...traceHeaders
        };
    } else if (isHeaders(originalHeaders)) {
        const newHeaders = new Headers(originalHeaders);
        // We don't want to override manually added sentry headers
        if (!newHeaders.get('sentry-trace')) {
            newHeaders.set('sentry-trace', sentryTrace);
        }
        if (baggage) {
            const prevBaggageHeader = newHeaders.get('baggage');
            if (!prevBaggageHeader) {
                newHeaders.set('baggage', baggage);
            } else if (!baggageHeaderHasSentryBaggageValues(prevBaggageHeader)) {
                newHeaders.set('baggage', `${prevBaggageHeader},${baggage}`);
            }
        }
        return newHeaders;
    } else if (Array.isArray(originalHeaders)) {
        const newHeaders = [
            ...originalHeaders
        ];
        if (!originalHeaders.find((header)=>header[0] === 'sentry-trace')) {
            newHeaders.push([
                'sentry-trace',
                sentryTrace
            ]);
        }
        const prevBaggageHeaderWithSentryValues = originalHeaders.find((header)=>header[0] === 'baggage' && baggageHeaderHasSentryBaggageValues(header[1]));
        if (baggage && !prevBaggageHeaderWithSentryValues) {
            // If there are multiple entries with the same key, the browser will merge the values into a single request header.
            // Its therefore safe to simply push a "baggage" entry, even though there might already be another baggage header.
            newHeaders.push([
                'baggage',
                baggage
            ]);
        }
        return newHeaders;
    } else {
        const existingSentryTraceHeader = 'sentry-trace' in originalHeaders ? originalHeaders['sentry-trace'] : undefined;
        const existingBaggageHeader = 'baggage' in originalHeaders ? originalHeaders.baggage : undefined;
        const newBaggageHeaders = existingBaggageHeader ? Array.isArray(existingBaggageHeader) ? [
            ...existingBaggageHeader
        ] : [
            existingBaggageHeader
        ] : [];
        const prevBaggageHeaderWithSentryValues = existingBaggageHeader && (Array.isArray(existingBaggageHeader) ? existingBaggageHeader.find((headerItem)=>baggageHeaderHasSentryBaggageValues(headerItem)) : baggageHeaderHasSentryBaggageValues(existingBaggageHeader));
        if (baggage && !prevBaggageHeaderWithSentryValues) {
            newBaggageHeaders.push(baggage);
        }
        return {
            ...originalHeaders,
            'sentry-trace': existingSentryTraceHeader ?? sentryTrace,
            baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(',') : undefined
        };
    }
}
function endSpan(span, handlerData) {
    if (handlerData.response) {
        spanstatus.setHttpStatus(span, handlerData.response.status);
        const contentLength = handlerData.response?.headers?.get('content-length');
        if (contentLength) {
            const contentLengthNum = parseInt(contentLength);
            if (contentLengthNum > 0) {
                span.setAttribute('http.response_content_length', contentLengthNum);
            }
        }
    } else if (handlerData.error) {
        span.setStatus({
            code: spanstatus.SPAN_STATUS_ERROR,
            message: 'internal_error'
        });
    }
    span.end();
}
function baggageHeaderHasSentryBaggageValues(baggageHeader) {
    return baggageHeader.split(',').some((baggageEntry)=>baggageEntry.trim().startsWith(baggage.SENTRY_BAGGAGE_KEY_PREFIX));
}
function isHeaders(headers) {
    return typeof Headers !== 'undefined' && is.isInstanceOf(headers, Headers);
}
function getSpanStartOptions(url$1, method, spanOrigin) {
    const parsedUrl = url.parseStringToURLObject(url$1);
    return {
        name: parsedUrl ? `${method} ${url.getSanitizedUrlStringFromUrlObject(parsedUrl)}` : method,
        attributes: getFetchSpanAttributes(url$1, parsedUrl, method, spanOrigin)
    };
}
function getFetchSpanAttributes(url$1, parsedUrl, method, spanOrigin) {
    const attributes = {
        url: url$1,
        type: 'fetch',
        'http.method': method,
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: 'http.client'
    };
    if (parsedUrl) {
        if (!url.isURLObjectRelative(parsedUrl)) {
            attributes['http.url'] = parsedUrl.href;
            attributes['server.address'] = parsedUrl.host;
        }
        if (parsedUrl.search) {
            attributes['http.query'] = parsedUrl.search;
        }
        if (parsedUrl.hash) {
            attributes['http.fragment'] = parsedUrl.hash;
        }
    }
    return attributes;
}
exports._addTracingHeadersToFetchRequest = _addTracingHeadersToFetchRequest;
exports.instrumentFetchRequest = instrumentFetchRequest; //# sourceMappingURL=fetch.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/trpc.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const trpcCaptureContext = {
    mechanism: {
        handled: false,
        data: {
            function: 'trpcMiddleware'
        }
    }
};
function captureIfError(nextResult) {
    // TODO: Set span status based on what TRPCError was encountered
    if (typeof nextResult === 'object' && nextResult !== null && 'ok' in nextResult && !nextResult.ok && 'error' in nextResult) {
        exports$1.captureException(nextResult.error, trpcCaptureContext);
    }
}
/**
 * Sentry tRPC middleware that captures errors and creates spans for tRPC procedures.
 */ function trpcMiddleware(options = {}) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return async function(opts) {
        const { path, type, next, rawInput, getRawInput } = opts;
        const client = currentScopes.getClient();
        const clientOptions = client?.getOptions();
        const trpcContext = {
            procedure_path: path,
            procedure_type: type
        };
        object.addNonEnumerableProperty(trpcContext, '__sentry_override_normalization_depth__', 1 + // 1 for context.input + the normal normalization depth
        (clientOptions?.normalizeDepth ?? 5));
        if (options.attachRpcInput !== undefined ? options.attachRpcInput : clientOptions?.sendDefaultPii) {
            if (rawInput !== undefined) {
                trpcContext.input = normalize.normalize(rawInput);
            }
            if (getRawInput !== undefined && typeof getRawInput === 'function') {
                try {
                    const rawRes = await getRawInput();
                    trpcContext.input = normalize.normalize(rawRes);
                } catch  {
                // noop
                }
            }
        }
        return currentScopes.withIsolationScope((scope)=>{
            scope.setContext('trpc', trpcContext);
            return trace.startSpanManual({
                name: `trpc/${path}`,
                op: 'rpc.server',
                attributes: {
                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
                    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.rpc.trpc'
                },
                forceTransaction: !!options.forceTransaction
            }, async (span)=>{
                try {
                    const nextResult = await next();
                    captureIfError(nextResult);
                    span.end();
                    return nextResult;
                } catch (e) {
                    exports$1.captureException(e, trpcCaptureContext);
                    span.end();
                    throw e;
                }
            });
        });
    };
}
exports.trpcMiddleware = trpcMiddleware; //# sourceMappingURL=trpc.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/errorCapture.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
/**
 * Safe error capture utilities for MCP server instrumentation
 *
 * Ensures error reporting never interferes with MCP server operation.
 * All capture operations are wrapped in try-catch to prevent side effects.
 */ /**
 * Captures an error without affecting MCP server operation.
 *
 * The active span already contains all MCP context (method, tool, arguments, etc.)
 * @param error - Error to capture
 * @param errorType - Classification of error type for filtering
 * @param extraData - Additional context data to include
 */ function captureError(error, errorType, extraData) {
    try {
        const client = currentScopes.getClient();
        if (!client) {
            return;
        }
        const activeSpan = spanUtils.getActiveSpan();
        if (activeSpan?.isRecording()) {
            activeSpan.setStatus({
                code: spanstatus.SPAN_STATUS_ERROR,
                message: 'internal_error'
            });
        }
        exports$1.captureException(error, {
            mechanism: {
                type: 'mcp_server',
                handled: false,
                data: {
                    error_type: errorType || 'handler_execution',
                    ...extraData
                }
            }
        });
    } catch  {
    // noop
    }
}
exports.captureError = captureError; //# sourceMappingURL=errorCapture.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/handlers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const errorCapture = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/errorCapture.js [app-ssr] (ecmascript)");
/**
 * Handler method wrapping for MCP server instrumentation
 *
 * Provides automatic error capture and span correlation for tool, resource,
 * and prompt handlers.
 */ /**
 * Generic function to wrap MCP server method handlers
 * @internal
 * @param serverInstance - MCP server instance
 * @param methodName - Method name to wrap (tool, resource, prompt)
 */ function wrapMethodHandler(serverInstance, methodName) {
    object.fill(serverInstance, methodName, (originalMethod)=>{
        return function(name, ...args) {
            const handler = args[args.length - 1];
            if (typeof handler !== 'function') {
                return originalMethod.call(this, name, ...args);
            }
            const wrappedHandler = createWrappedHandler(handler, methodName, name);
            return originalMethod.call(this, name, ...args.slice(0, -1), wrappedHandler);
        };
    });
}
/**
 * Creates a wrapped handler with span correlation and error capture
 * @internal
 * @param originalHandler - Original handler function
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 * @returns Wrapped handler function
 */ function createWrappedHandler(originalHandler, methodName, handlerName) {
    return function(...handlerArgs) {
        try {
            return createErrorCapturingHandler.call(this, originalHandler, methodName, handlerName, handlerArgs);
        } catch (error) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('MCP handler wrapping failed:', error);
            return originalHandler.apply(this, handlerArgs);
        }
    };
}
/**
 * Creates an error-capturing wrapper for handler execution
 * @internal
 * @param originalHandler - Original handler function
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 * @param handlerArgs - Handler arguments
 * @param extraHandlerData - Additional handler context
 * @returns Handler execution result
 */ function createErrorCapturingHandler(originalHandler, methodName, handlerName, handlerArgs) {
    try {
        const result = originalHandler.apply(this, handlerArgs);
        if (result && typeof result === 'object' && typeof result.then === 'function') {
            return Promise.resolve(result).catch((error)=>{
                captureHandlerError(error, methodName, handlerName);
                throw error;
            });
        }
        return result;
    } catch (error) {
        captureHandlerError(error, methodName, handlerName);
        throw error;
    }
}
/**
 * Captures handler execution errors based on handler type
 * @internal
 * @param error - Error to capture
 * @param methodName - MCP method name
 * @param handlerName - Handler identifier
 */ function captureHandlerError(error, methodName, handlerName) {
    try {
        const extraData = {};
        if (methodName === 'tool') {
            extraData.tool_name = handlerName;
            if (error.name === 'ProtocolValidationError' || error.message.includes('validation') || error.message.includes('protocol')) {
                errorCapture.captureError(error, 'validation', extraData);
            } else if (error.name === 'ServerTimeoutError' || error.message.includes('timed out') || error.message.includes('timeout')) {
                errorCapture.captureError(error, 'timeout', extraData);
            } else {
                errorCapture.captureError(error, 'tool_execution', extraData);
            }
        } else if (methodName === 'resource') {
            extraData.resource_uri = handlerName;
            errorCapture.captureError(error, 'resource_execution', extraData);
        } else if (methodName === 'prompt') {
            extraData.prompt_name = handlerName;
            errorCapture.captureError(error, 'prompt_execution', extraData);
        }
    } catch (captureErr) {
    // noop
    }
}
/**
 * Wraps tool handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function wrapToolHandlers(serverInstance) {
    wrapMethodHandler(serverInstance, 'tool');
}
/**
 * Wraps resource handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function wrapResourceHandlers(serverInstance) {
    wrapMethodHandler(serverInstance, 'resource');
}
/**
 * Wraps prompt handlers to associate them with request spans
 * @param serverInstance - MCP server instance
 */ function wrapPromptHandlers(serverInstance) {
    wrapMethodHandler(serverInstance, 'prompt');
}
/**
 * Wraps all MCP handler types (tool, resource, prompt) for span correlation
 * @param serverInstance - MCP server instance
 */ function wrapAllMCPHandlers(serverInstance) {
    wrapToolHandlers(serverInstance);
    wrapResourceHandlers(serverInstance);
    wrapPromptHandlers(serverInstance);
}
exports.wrapAllMCPHandlers = wrapAllMCPHandlers;
exports.wrapPromptHandlers = wrapPromptHandlers;
exports.wrapResourceHandlers = wrapResourceHandlers;
exports.wrapToolHandlers = wrapToolHandlers; //# sourceMappingURL=handlers.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Essential MCP attribute constants for Sentry instrumentation
 *
 * Based on OpenTelemetry MCP semantic conventions
 * @see https://github.com/open-telemetry/semantic-conventions/blob/3097fb0af5b9492b0e3f55dc5f6c21a3dc2be8df/docs/gen-ai/mcp.md
 */ // =============================================================================
// CORE MCP ATTRIBUTES
// =============================================================================
/** The name of the request or notification method */ const MCP_METHOD_NAME_ATTRIBUTE = 'mcp.method.name';
/** JSON-RPC request identifier for the request. Unique within the MCP session. */ const MCP_REQUEST_ID_ATTRIBUTE = 'mcp.request.id';
/** Identifies the MCP session */ const MCP_SESSION_ID_ATTRIBUTE = 'mcp.session.id';
/** Transport method used for MCP communication */ const MCP_TRANSPORT_ATTRIBUTE = 'mcp.transport';
// =============================================================================
// SERVER ATTRIBUTES
// =============================================================================
/** Name of the MCP server application */ const MCP_SERVER_NAME_ATTRIBUTE = 'mcp.server.name';
/** Display title of the MCP server application */ const MCP_SERVER_TITLE_ATTRIBUTE = 'mcp.server.title';
/** Version of the MCP server application */ const MCP_SERVER_VERSION_ATTRIBUTE = 'mcp.server.version';
/** MCP protocol version used in the session */ const MCP_PROTOCOL_VERSION_ATTRIBUTE = 'mcp.protocol.version';
// =============================================================================
// METHOD-SPECIFIC ATTRIBUTES
// =============================================================================
/** Name of the tool being called */ const MCP_TOOL_NAME_ATTRIBUTE = 'mcp.tool.name';
/** The resource URI being accessed */ const MCP_RESOURCE_URI_ATTRIBUTE = 'mcp.resource.uri';
/** Name of the prompt template */ const MCP_PROMPT_NAME_ATTRIBUTE = 'mcp.prompt.name';
// =============================================================================
// TOOL RESULT ATTRIBUTES
// =============================================================================
/** Whether a tool execution resulted in an error */ const MCP_TOOL_RESULT_IS_ERROR_ATTRIBUTE = 'mcp.tool.result.is_error';
/** Number of content items in the tool result */ const MCP_TOOL_RESULT_CONTENT_COUNT_ATTRIBUTE = 'mcp.tool.result.content_count';
/** Serialized content of the tool result */ const MCP_TOOL_RESULT_CONTENT_ATTRIBUTE = 'mcp.tool.result.content';
/** Prefix for tool result attributes that contain sensitive content */ const MCP_TOOL_RESULT_PREFIX = 'mcp.tool.result';
// =============================================================================
// PROMPT RESULT ATTRIBUTES
// =============================================================================
/** Description of the prompt result */ const MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE = 'mcp.prompt.result.description';
/** Number of messages in the prompt result */ const MCP_PROMPT_RESULT_MESSAGE_COUNT_ATTRIBUTE = 'mcp.prompt.result.message_count';
/** Content of the message in the prompt result (for single message results) */ const MCP_PROMPT_RESULT_MESSAGE_CONTENT_ATTRIBUTE = 'mcp.prompt.result.message_content';
/** Prefix for prompt result attributes that contain sensitive content */ const MCP_PROMPT_RESULT_PREFIX = 'mcp.prompt.result';
// =============================================================================
// REQUEST ARGUMENT ATTRIBUTES
// =============================================================================
/** Prefix for MCP request argument prefix for each argument */ const MCP_REQUEST_ARGUMENT = 'mcp.request.argument';
// =============================================================================
// LOGGING ATTRIBUTES
// =============================================================================
/** Log level for MCP logging operations */ const MCP_LOGGING_LEVEL_ATTRIBUTE = 'mcp.logging.level';
/** Logger name for MCP logging operations */ const MCP_LOGGING_LOGGER_ATTRIBUTE = 'mcp.logging.logger';
/** Data type of the logged message */ const MCP_LOGGING_DATA_TYPE_ATTRIBUTE = 'mcp.logging.data_type';
/** Log message content */ const MCP_LOGGING_MESSAGE_ATTRIBUTE = 'mcp.logging.message';
// =============================================================================
// NETWORK ATTRIBUTES (OpenTelemetry Standard)
// =============================================================================
/** OSI transport layer protocol */ const NETWORK_TRANSPORT_ATTRIBUTE = 'network.transport';
/** The version of JSON RPC protocol used */ const NETWORK_PROTOCOL_VERSION_ATTRIBUTE = 'network.protocol.version';
/** Client address - domain name if available without reverse DNS lookup; otherwise, IP address or Unix domain socket name */ const CLIENT_ADDRESS_ATTRIBUTE = 'client.address';
/** Client port number */ const CLIENT_PORT_ATTRIBUTE = 'client.port';
// =============================================================================
// SENTRY-SPECIFIC MCP ATTRIBUTE VALUES
// =============================================================================
/** Sentry operation value for MCP server spans */ const MCP_SERVER_OP_VALUE = 'mcp.server';
/**
 * Sentry operation value for client-to-server notifications
 * Following OpenTelemetry MCP semantic conventions
 */ const MCP_NOTIFICATION_CLIENT_TO_SERVER_OP_VALUE = 'mcp.notification.client_to_server';
/**
 * Sentry operation value for server-to-client notifications
 * Following OpenTelemetry MCP semantic conventions
 */ const MCP_NOTIFICATION_SERVER_TO_CLIENT_OP_VALUE = 'mcp.notification.server_to_client';
/** Sentry origin value for MCP function spans */ const MCP_FUNCTION_ORIGIN_VALUE = 'auto.function.mcp_server';
/** Sentry origin value for MCP notification spans */ const MCP_NOTIFICATION_ORIGIN_VALUE = 'auto.mcp.notification';
/** Sentry source value for MCP route spans */ const MCP_ROUTE_SOURCE_VALUE = 'route';
exports.CLIENT_ADDRESS_ATTRIBUTE = CLIENT_ADDRESS_ATTRIBUTE;
exports.CLIENT_PORT_ATTRIBUTE = CLIENT_PORT_ATTRIBUTE;
exports.MCP_FUNCTION_ORIGIN_VALUE = MCP_FUNCTION_ORIGIN_VALUE;
exports.MCP_LOGGING_DATA_TYPE_ATTRIBUTE = MCP_LOGGING_DATA_TYPE_ATTRIBUTE;
exports.MCP_LOGGING_LEVEL_ATTRIBUTE = MCP_LOGGING_LEVEL_ATTRIBUTE;
exports.MCP_LOGGING_LOGGER_ATTRIBUTE = MCP_LOGGING_LOGGER_ATTRIBUTE;
exports.MCP_LOGGING_MESSAGE_ATTRIBUTE = MCP_LOGGING_MESSAGE_ATTRIBUTE;
exports.MCP_METHOD_NAME_ATTRIBUTE = MCP_METHOD_NAME_ATTRIBUTE;
exports.MCP_NOTIFICATION_CLIENT_TO_SERVER_OP_VALUE = MCP_NOTIFICATION_CLIENT_TO_SERVER_OP_VALUE;
exports.MCP_NOTIFICATION_ORIGIN_VALUE = MCP_NOTIFICATION_ORIGIN_VALUE;
exports.MCP_NOTIFICATION_SERVER_TO_CLIENT_OP_VALUE = MCP_NOTIFICATION_SERVER_TO_CLIENT_OP_VALUE;
exports.MCP_PROMPT_NAME_ATTRIBUTE = MCP_PROMPT_NAME_ATTRIBUTE;
exports.MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE = MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE;
exports.MCP_PROMPT_RESULT_MESSAGE_CONTENT_ATTRIBUTE = MCP_PROMPT_RESULT_MESSAGE_CONTENT_ATTRIBUTE;
exports.MCP_PROMPT_RESULT_MESSAGE_COUNT_ATTRIBUTE = MCP_PROMPT_RESULT_MESSAGE_COUNT_ATTRIBUTE;
exports.MCP_PROMPT_RESULT_PREFIX = MCP_PROMPT_RESULT_PREFIX;
exports.MCP_PROTOCOL_VERSION_ATTRIBUTE = MCP_PROTOCOL_VERSION_ATTRIBUTE;
exports.MCP_REQUEST_ARGUMENT = MCP_REQUEST_ARGUMENT;
exports.MCP_REQUEST_ID_ATTRIBUTE = MCP_REQUEST_ID_ATTRIBUTE;
exports.MCP_RESOURCE_URI_ATTRIBUTE = MCP_RESOURCE_URI_ATTRIBUTE;
exports.MCP_ROUTE_SOURCE_VALUE = MCP_ROUTE_SOURCE_VALUE;
exports.MCP_SERVER_NAME_ATTRIBUTE = MCP_SERVER_NAME_ATTRIBUTE;
exports.MCP_SERVER_OP_VALUE = MCP_SERVER_OP_VALUE;
exports.MCP_SERVER_TITLE_ATTRIBUTE = MCP_SERVER_TITLE_ATTRIBUTE;
exports.MCP_SERVER_VERSION_ATTRIBUTE = MCP_SERVER_VERSION_ATTRIBUTE;
exports.MCP_SESSION_ID_ATTRIBUTE = MCP_SESSION_ID_ATTRIBUTE;
exports.MCP_TOOL_NAME_ATTRIBUTE = MCP_TOOL_NAME_ATTRIBUTE;
exports.MCP_TOOL_RESULT_CONTENT_ATTRIBUTE = MCP_TOOL_RESULT_CONTENT_ATTRIBUTE;
exports.MCP_TOOL_RESULT_CONTENT_COUNT_ATTRIBUTE = MCP_TOOL_RESULT_CONTENT_COUNT_ATTRIBUTE;
exports.MCP_TOOL_RESULT_IS_ERROR_ATTRIBUTE = MCP_TOOL_RESULT_IS_ERROR_ATTRIBUTE;
exports.MCP_TOOL_RESULT_PREFIX = MCP_TOOL_RESULT_PREFIX;
exports.MCP_TRANSPORT_ATTRIBUTE = MCP_TRANSPORT_ATTRIBUTE;
exports.NETWORK_PROTOCOL_VERSION_ATTRIBUTE = NETWORK_PROTOCOL_VERSION_ATTRIBUTE;
exports.NETWORK_TRANSPORT_ATTRIBUTE = NETWORK_TRANSPORT_ATTRIBUTE; //# sourceMappingURL=attributes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/piiFiltering.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
/**
 * PII attributes that should be removed when sendDefaultPii is false
 * @internal
 */ const PII_ATTRIBUTES = new Set([
    attributes.CLIENT_ADDRESS_ATTRIBUTE,
    attributes.CLIENT_PORT_ATTRIBUTE,
    attributes.MCP_LOGGING_MESSAGE_ATTRIBUTE,
    attributes.MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE,
    attributes.MCP_PROMPT_RESULT_MESSAGE_CONTENT_ATTRIBUTE,
    attributes.MCP_RESOURCE_URI_ATTRIBUTE,
    attributes.MCP_TOOL_RESULT_CONTENT_ATTRIBUTE
]);
/**
 * Checks if an attribute key should be considered PII.
 *
 * Returns true for:
 * - Explicit PII attributes (client.address, client.port, mcp.logging.message, etc.)
 * - All request arguments (mcp.request.argument.*)
 * - Tool and prompt result content (mcp.tool.result.*, mcp.prompt.result.*) except metadata
 *
 * Preserves metadata attributes ending with _count, _error, or .is_error as they don't contain sensitive data.
 *
 * @param key - Attribute key to evaluate
 * @returns true if the attribute should be filtered out (is PII), false if it should be preserved
 * @internal
 */ function isPiiAttribute(key) {
    if (PII_ATTRIBUTES.has(key)) {
        return true;
    }
    if (key.startsWith(`${attributes.MCP_REQUEST_ARGUMENT}.`)) {
        return true;
    }
    if (key.startsWith(`${attributes.MCP_TOOL_RESULT_PREFIX}.`) || key.startsWith(`${attributes.MCP_PROMPT_RESULT_PREFIX}.`)) {
        if (!key.endsWith('_count') && !key.endsWith('_error') && !key.endsWith('.is_error')) {
            return true;
        }
    }
    return false;
}
/**
 * Removes PII attributes from span data when sendDefaultPii is false
 * @param spanData - Raw span attributes
 * @param sendDefaultPii - Whether to include PII data
 * @returns Filtered span attributes
 */ function filterMcpPiiFromSpanData(spanData, sendDefaultPii) {
    if (sendDefaultPii) {
        return spanData;
    }
    return Object.entries(spanData).reduce((acc, [key, value])=>{
        if (!isPiiAttribute(key)) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
exports.filterMcpPiiFromSpanData = filterMcpPiiFromSpanData; //# sourceMappingURL=piiFiltering.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/validation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
/**
 * Message validation functions for MCP server instrumentation
 *
 * Provides JSON-RPC 2.0 message type validation and MCP server instance validation.
 */ /**
 * Validates if a message is a JSON-RPC request
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC request
 */ function isJsonRpcRequest(message) {
    return typeof message === 'object' && message !== null && 'jsonrpc' in message && message.jsonrpc === '2.0' && 'method' in message && 'id' in message;
}
/**
 * Validates if a message is a JSON-RPC notification
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC notification
 */ function isJsonRpcNotification(message) {
    return typeof message === 'object' && message !== null && 'jsonrpc' in message && message.jsonrpc === '2.0' && 'method' in message && !('id' in message);
}
/**
 * Validates if a message is a JSON-RPC response
 * @param message - Message to validate
 * @returns True if message is a JSON-RPC response
 */ function isJsonRpcResponse(message) {
    return typeof message === 'object' && message !== null && 'jsonrpc' in message && message.jsonrpc === '2.0' && 'id' in message && ('result' in message || 'error' in message);
}
/**
 * Validates MCP server instance with type checking
 * @param instance - Object to validate as MCP server instance
 * @returns True if instance has required MCP server methods
 */ function validateMcpServerInstance(instance) {
    if (typeof instance === 'object' && instance !== null && 'resource' in instance && 'tool' in instance && 'prompt' in instance && 'connect' in instance) {
        return true;
    }
    debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Did not patch MCP server. Interface is incompatible.');
    return false;
}
/**
 * Check if the item is a valid content item
 * @param item - The item to check
 * @returns True if the item is a valid content item, false otherwise
 */ function isValidContentItem(item) {
    return item != null && typeof item === 'object';
}
exports.isJsonRpcNotification = isJsonRpcNotification;
exports.isJsonRpcRequest = isJsonRpcRequest;
exports.isJsonRpcResponse = isJsonRpcResponse;
exports.isValidContentItem = isValidContentItem;
exports.validateMcpServerInstance = validateMcpServerInstance; //# sourceMappingURL=validation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/resultExtraction.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
const validation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/validation.js [app-ssr] (ecmascript)");
/**
 * Result extraction functions for MCP server instrumentation
 *
 * Handles extraction of attributes from tool and prompt execution results.
 */ /**
 * Build attributes for tool result content items
 * @param content - Array of content items from tool result
 * @returns Attributes extracted from each content item including type, text, mime type, URI, and resource info
 */ function buildAllContentItemAttributes(content) {
    const attributes$1 = {
        [attributes.MCP_TOOL_RESULT_CONTENT_COUNT_ATTRIBUTE]: content.length
    };
    for (const [i, item] of content.entries()){
        if (!validation.isValidContentItem(item)) {
            continue;
        }
        const prefix = content.length === 1 ? 'mcp.tool.result' : `mcp.tool.result.${i}`;
        const safeSet = (key, value)=>{
            if (typeof value === 'string') {
                attributes$1[`${prefix}.${key}`] = value;
            }
        };
        safeSet('content_type', item.type);
        safeSet('mime_type', item.mimeType);
        safeSet('uri', item.uri);
        safeSet('name', item.name);
        if (typeof item.text === 'string') {
            attributes$1[`${prefix}.content`] = item.text;
        }
        if (typeof item.data === 'string') {
            attributes$1[`${prefix}.data_size`] = item.data.length;
        }
        const resource = item.resource;
        if (validation.isValidContentItem(resource)) {
            safeSet('resource_uri', resource.uri);
            safeSet('resource_mime_type', resource.mimeType);
        }
    }
    return attributes$1;
}
/**
 * Extract tool result attributes for span instrumentation
 * @param result - Tool execution result
 * @returns Attributes extracted from tool result content
 */ function extractToolResultAttributes(result) {
    if (!validation.isValidContentItem(result)) {
        return {};
    }
    const attributes$1 = Array.isArray(result.content) ? buildAllContentItemAttributes(result.content) : {};
    if (typeof result.isError === 'boolean') {
        attributes$1[attributes.MCP_TOOL_RESULT_IS_ERROR_ATTRIBUTE] = result.isError;
    }
    return attributes$1;
}
/**
 * Extract prompt result attributes for span instrumentation
 * @param result - Prompt execution result
 * @returns Attributes extracted from prompt result
 */ function extractPromptResultAttributes(result) {
    const attributes$1 = {};
    if (!validation.isValidContentItem(result)) {
        return attributes$1;
    }
    if (typeof result.description === 'string') {
        attributes$1[attributes.MCP_PROMPT_RESULT_DESCRIPTION_ATTRIBUTE] = result.description;
    }
    if (Array.isArray(result.messages)) {
        attributes$1[attributes.MCP_PROMPT_RESULT_MESSAGE_COUNT_ATTRIBUTE] = result.messages.length;
        const messages = result.messages;
        for (const [i, message] of messages.entries()){
            if (!validation.isValidContentItem(message)) {
                continue;
            }
            const prefix = messages.length === 1 ? 'mcp.prompt.result' : `mcp.prompt.result.${i}`;
            const safeSet = (key, value)=>{
                if (typeof value === 'string') {
                    const attrName = messages.length === 1 ? `${prefix}.message_${key}` : `${prefix}.${key}`;
                    attributes$1[attrName] = value;
                }
            };
            safeSet('role', message.role);
            if (validation.isValidContentItem(message.content)) {
                const content = message.content;
                if (typeof content.text === 'string') {
                    const attrName = messages.length === 1 ? `${prefix}.message_content` : `${prefix}.content`;
                    attributes$1[attrName] = content.text;
                }
            }
        }
    }
    return attributes$1;
}
exports.extractPromptResultAttributes = extractPromptResultAttributes;
exports.extractToolResultAttributes = extractToolResultAttributes; //# sourceMappingURL=resultExtraction.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/correlation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const piiFiltering = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/piiFiltering.js [app-ssr] (ecmascript)");
const resultExtraction = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/resultExtraction.js [app-ssr] (ecmascript)");
/**
 * Request-span correlation system for MCP server instrumentation
 *
 * Handles mapping requestId to span data for correlation with handler execution.
 * Uses WeakMap to scope correlation maps per transport instance, preventing
 * request ID collisions between different MCP sessions.
 */ /**
 * Transport-scoped correlation system that prevents collisions between different MCP sessions
 * @internal Each transport instance gets its own correlation map, eliminating request ID conflicts
 */ const transportToSpanMap = new WeakMap();
/**
 * Gets or creates the span map for a specific transport instance
 * @internal
 * @param transport - MCP transport instance
 * @returns Span map for the transport
 */ function getOrCreateSpanMap(transport) {
    let spanMap = transportToSpanMap.get(transport);
    if (!spanMap) {
        spanMap = new Map();
        transportToSpanMap.set(transport, spanMap);
    }
    return spanMap;
}
/**
 * Stores span context for later correlation with handler execution
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param span - Active span to correlate
 * @param method - MCP method name
 */ function storeSpanForRequest(transport, requestId, span, method) {
    const spanMap = getOrCreateSpanMap(transport);
    spanMap.set(requestId, {
        span,
        method,
        startTime: Date.now()
    });
}
/**
 * Completes span with tool results and cleans up correlation
 * @param transport - MCP transport instance
 * @param requestId - Request identifier
 * @param result - Tool execution result for attribute extraction
 */ function completeSpanWithResults(transport, requestId, result) {
    const spanMap = getOrCreateSpanMap(transport);
    const spanData = spanMap.get(requestId);
    if (spanData) {
        const { span, method } = spanData;
        if (method === 'tools/call') {
            const rawToolAttributes = resultExtraction.extractToolResultAttributes(result);
            const client = currentScopes.getClient();
            const sendDefaultPii = Boolean(client?.getOptions().sendDefaultPii);
            const toolAttributes = piiFiltering.filterMcpPiiFromSpanData(rawToolAttributes, sendDefaultPii);
            span.setAttributes(toolAttributes);
        } else if (method === 'prompts/get') {
            const rawPromptAttributes = resultExtraction.extractPromptResultAttributes(result);
            const client = currentScopes.getClient();
            const sendDefaultPii = Boolean(client?.getOptions().sendDefaultPii);
            const promptAttributes = piiFiltering.filterMcpPiiFromSpanData(rawPromptAttributes, sendDefaultPii);
            span.setAttributes(promptAttributes);
        }
        span.end();
        spanMap.delete(requestId);
    }
}
/**
 * Cleans up pending spans for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function cleanupPendingSpansForTransport(transport) {
    const spanMap = transportToSpanMap.get(transport);
    if (spanMap) {
        for (const [, spanData] of spanMap){
            spanData.span.setStatus({
                code: spanstatus.SPAN_STATUS_ERROR,
                message: 'cancelled'
            });
            spanData.span.end();
        }
        spanMap.clear();
    }
}
exports.cleanupPendingSpansForTransport = cleanupPendingSpansForTransport;
exports.completeSpanWithResults = completeSpanWithResults;
exports.storeSpanForRequest = storeSpanForRequest; //# sourceMappingURL=correlation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionManagement.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Transport-scoped session data storage (only for transports with sessionId)
 * @internal Maps transport instances to session-level data
 */ const transportToSessionData = new WeakMap();
/**
 * Stores session data for a transport with sessionId
 * @param transport - MCP transport instance
 * @param sessionData - Session data to store
 */ function storeSessionDataForTransport(transport, sessionData) {
    if (transport.sessionId) {
        transportToSessionData.set(transport, sessionData);
    }
}
/**
 * Updates session data for a transport with sessionId (merges with existing data)
 * @param transport - MCP transport instance
 * @param partialSessionData - Partial session data to merge with existing data
 */ function updateSessionDataForTransport(transport, partialSessionData) {
    if (transport.sessionId) {
        const existingData = transportToSessionData.get(transport) || {};
        transportToSessionData.set(transport, {
            ...existingData,
            ...partialSessionData
        });
    }
}
/**
 * Retrieves client information for a transport
 * @param transport - MCP transport instance
 * @returns Client information if available
 */ function getClientInfoForTransport(transport) {
    return transportToSessionData.get(transport)?.clientInfo;
}
/**
 * Retrieves protocol version for a transport
 * @param transport - MCP transport instance
 * @returns Protocol version if available
 */ function getProtocolVersionForTransport(transport) {
    return transportToSessionData.get(transport)?.protocolVersion;
}
/**
 * Retrieves full session data for a transport
 * @param transport - MCP transport instance
 * @returns Complete session data if available
 */ function getSessionDataForTransport(transport) {
    return transportToSessionData.get(transport);
}
/**
 * Cleans up session data for a specific transport (when that transport closes)
 * @param transport - MCP transport instance
 */ function cleanupSessionDataForTransport(transport) {
    transportToSessionData.delete(transport);
}
exports.cleanupSessionDataForTransport = cleanupSessionDataForTransport;
exports.getClientInfoForTransport = getClientInfoForTransport;
exports.getProtocolVersionForTransport = getProtocolVersionForTransport;
exports.getSessionDataForTransport = getSessionDataForTransport;
exports.storeSessionDataForTransport = storeSessionDataForTransport;
exports.updateSessionDataForTransport = updateSessionDataForTransport; //# sourceMappingURL=sessionManagement.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionExtraction.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
const sessionManagement = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionManagement.js [app-ssr] (ecmascript)");
const validation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/validation.js [app-ssr] (ecmascript)");
/**
 * Session and party info extraction functions for MCP server instrumentation
 *
 * Handles extraction of client/server info and session data from MCP messages.
 */ /**
 * Extracts and validates PartyInfo from an unknown object
 * @param obj - Unknown object that might contain party info
 * @returns Validated PartyInfo object with only string properties
 */ function extractPartyInfo(obj) {
    const partyInfo = {};
    if (validation.isValidContentItem(obj)) {
        if (typeof obj.name === 'string') {
            partyInfo.name = obj.name;
        }
        if (typeof obj.title === 'string') {
            partyInfo.title = obj.title;
        }
        if (typeof obj.version === 'string') {
            partyInfo.version = obj.version;
        }
    }
    return partyInfo;
}
/**
 * Extracts session data from "initialize" requests
 * @param request - JSON-RPC "initialize" request containing client info and protocol version
 * @returns Session data extracted from request parameters including protocol version and client info
 */ function extractSessionDataFromInitializeRequest(request) {
    const sessionData = {};
    if (validation.isValidContentItem(request.params)) {
        if (typeof request.params.protocolVersion === 'string') {
            sessionData.protocolVersion = request.params.protocolVersion;
        }
        if (request.params.clientInfo) {
            sessionData.clientInfo = extractPartyInfo(request.params.clientInfo);
        }
    }
    return sessionData;
}
/**
 * Extracts session data from "initialize" response
 * @param result - "initialize" response result containing server info and protocol version
 * @returns Partial session data extracted from response including protocol version and server info
 */ function extractSessionDataFromInitializeResponse(result) {
    const sessionData = {};
    if (validation.isValidContentItem(result)) {
        if (typeof result.protocolVersion === 'string') {
            sessionData.protocolVersion = result.protocolVersion;
        }
        if (result.serverInfo) {
            sessionData.serverInfo = extractPartyInfo(result.serverInfo);
        }
    }
    return sessionData;
}
/**
 * Build client attributes from stored client info
 * @param transport - MCP transport instance
 * @returns Client attributes for span instrumentation
 */ function getClientAttributes(transport) {
    const clientInfo = sessionManagement.getClientInfoForTransport(transport);
    const attributes = {};
    if (clientInfo?.name) {
        attributes['mcp.client.name'] = clientInfo.name;
    }
    if (clientInfo?.title) {
        attributes['mcp.client.title'] = clientInfo.title;
    }
    if (clientInfo?.version) {
        attributes['mcp.client.version'] = clientInfo.version;
    }
    return attributes;
}
/**
 * Build server attributes from stored server info
 * @param transport - MCP transport instance
 * @returns Server attributes for span instrumentation
 */ function getServerAttributes(transport) {
    const serverInfo = sessionManagement.getSessionDataForTransport(transport)?.serverInfo;
    const attributes$1 = {};
    if (serverInfo?.name) {
        attributes$1[attributes.MCP_SERVER_NAME_ATTRIBUTE] = serverInfo.name;
    }
    if (serverInfo?.title) {
        attributes$1[attributes.MCP_SERVER_TITLE_ATTRIBUTE] = serverInfo.title;
    }
    if (serverInfo?.version) {
        attributes$1[attributes.MCP_SERVER_VERSION_ATTRIBUTE] = serverInfo.version;
    }
    return attributes$1;
}
/**
 * Extracts client connection info from extra handler data
 * @param extra - Extra handler data containing connection info
 * @returns Client address and port information
 */ function extractClientInfo(extra) {
    return {
        address: extra?.requestInfo?.remoteAddress || extra?.clientAddress || extra?.request?.ip || extra?.request?.connection?.remoteAddress,
        port: extra?.requestInfo?.remotePort || extra?.clientPort || extra?.request?.connection?.remotePort
    };
}
/**
 * Extracts transport types based on transport constructor name
 * @param transport - MCP transport instance
 * @returns Transport type mapping for span attributes
 */ function getTransportTypes(transport) {
    if (!transport?.constructor) {
        return {
            mcpTransport: 'unknown',
            networkTransport: 'unknown'
        };
    }
    const transportName = typeof transport.constructor?.name === 'string' ? transport.constructor.name : 'unknown';
    let networkTransport = 'unknown';
    const lowerTransportName = transportName.toLowerCase();
    if (lowerTransportName.includes('stdio')) {
        networkTransport = 'pipe';
    } else if (lowerTransportName.includes('http') || lowerTransportName.includes('sse')) {
        networkTransport = 'tcp';
    }
    return {
        mcpTransport: transportName,
        networkTransport
    };
}
/**
 * Build transport and network attributes
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @returns Transport attributes for span instrumentation
 * @note sessionId may be undefined during initial setup - session should be established by client during initialize flow
 */ function buildTransportAttributes(transport, extra) {
    const sessionId = transport && 'sessionId' in transport ? transport.sessionId : undefined;
    const clientInfo = extra ? extractClientInfo(extra) : {};
    const { mcpTransport, networkTransport } = getTransportTypes(transport);
    const clientAttributes = getClientAttributes(transport);
    const serverAttributes = getServerAttributes(transport);
    const protocolVersion = sessionManagement.getProtocolVersionForTransport(transport);
    const attributes$1 = {
        ...sessionId && {
            [attributes.MCP_SESSION_ID_ATTRIBUTE]: sessionId
        },
        ...clientInfo.address && {
            [attributes.CLIENT_ADDRESS_ATTRIBUTE]: clientInfo.address
        },
        ...clientInfo.port && {
            [attributes.CLIENT_PORT_ATTRIBUTE]: clientInfo.port
        },
        [attributes.MCP_TRANSPORT_ATTRIBUTE]: mcpTransport,
        [attributes.NETWORK_TRANSPORT_ATTRIBUTE]: networkTransport,
        [attributes.NETWORK_PROTOCOL_VERSION_ATTRIBUTE]: '2.0',
        ...protocolVersion && {
            [attributes.MCP_PROTOCOL_VERSION_ATTRIBUTE]: protocolVersion
        },
        ...clientAttributes,
        ...serverAttributes
    };
    return attributes$1;
}
exports.buildTransportAttributes = buildTransportAttributes;
exports.extractClientInfo = extractClientInfo;
exports.extractSessionDataFromInitializeRequest = extractSessionDataFromInitializeRequest;
exports.extractSessionDataFromInitializeResponse = extractSessionDataFromInitializeResponse;
exports.getClientAttributes = getClientAttributes;
exports.getServerAttributes = getServerAttributes;
exports.getTransportTypes = getTransportTypes; //# sourceMappingURL=sessionExtraction.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/methodConfig.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
/**
 * Method configuration and request processing for MCP server instrumentation
 */ /**
 * Configuration for MCP methods to extract targets and arguments
 * @internal Maps method names to their extraction configuration
 */ const METHOD_CONFIGS = {
    'tools/call': {
        targetField: 'name',
        targetAttribute: attributes.MCP_TOOL_NAME_ATTRIBUTE,
        captureArguments: true,
        argumentsField: 'arguments'
    },
    'resources/read': {
        targetField: 'uri',
        targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE,
        captureUri: true
    },
    'resources/subscribe': {
        targetField: 'uri',
        targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE
    },
    'resources/unsubscribe': {
        targetField: 'uri',
        targetAttribute: attributes.MCP_RESOURCE_URI_ATTRIBUTE
    },
    'prompts/get': {
        targetField: 'name',
        targetAttribute: attributes.MCP_PROMPT_NAME_ATTRIBUTE,
        captureName: true,
        captureArguments: true,
        argumentsField: 'arguments'
    }
};
/**
 * Extracts target info from method and params based on method type
 * @param method - MCP method name
 * @param params - Method parameters
 * @returns Target name and attributes for span instrumentation
 */ function extractTargetInfo(method, params) {
    const config = METHOD_CONFIGS[method];
    if (!config) {
        return {
            attributes: {}
        };
    }
    const target = config.targetField && typeof params?.[config.targetField] === 'string' ? params[config.targetField] : undefined;
    return {
        target,
        attributes: target && config.targetAttribute ? {
            [config.targetAttribute]: target
        } : {}
    };
}
/**
 * Extracts request arguments based on method type
 * @param method - MCP method name
 * @param params - Method parameters
 * @returns Arguments as span attributes with mcp.request.argument prefix
 */ function getRequestArguments(method, params) {
    const args = {};
    const config = METHOD_CONFIGS[method];
    if (!config) {
        return args;
    }
    if (config.captureArguments && config.argumentsField && params?.[config.argumentsField]) {
        const argumentsObj = params[config.argumentsField];
        if (typeof argumentsObj === 'object' && argumentsObj !== null) {
            for (const [key, value] of Object.entries(argumentsObj)){
                args[`${attributes.MCP_REQUEST_ARGUMENT}.${key.toLowerCase()}`] = JSON.stringify(value);
            }
        }
    }
    if (config.captureUri && params?.uri) {
        args[`${attributes.MCP_REQUEST_ARGUMENT}.uri`] = JSON.stringify(params.uri);
    }
    if (config.captureName && params?.name) {
        args[`${attributes.MCP_REQUEST_ARGUMENT}.name`] = JSON.stringify(params.name);
    }
    return args;
}
exports.extractTargetInfo = extractTargetInfo;
exports.getRequestArguments = getRequestArguments; //# sourceMappingURL=methodConfig.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributeExtraction.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const url = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/url.js [app-ssr] (ecmascript)");
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
const methodConfig = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/methodConfig.js [app-ssr] (ecmascript)");
/**
 * Core attribute extraction and building functions for MCP server instrumentation
 */ /**
 * Extracts additional attributes for specific notification types
 * @param method - Notification method name
 * @param params - Notification parameters
 * @returns Method-specific attributes for span instrumentation
 */ function getNotificationAttributes(method, params) {
    const attributes$1 = {};
    switch(method){
        case 'notifications/cancelled':
            if (params?.requestId) {
                attributes$1['mcp.cancelled.request_id'] = String(params.requestId);
            }
            if (params?.reason) {
                attributes$1['mcp.cancelled.reason'] = String(params.reason);
            }
            break;
        case 'notifications/message':
            if (params?.level) {
                attributes$1[attributes.MCP_LOGGING_LEVEL_ATTRIBUTE] = String(params.level);
            }
            if (params?.logger) {
                attributes$1[attributes.MCP_LOGGING_LOGGER_ATTRIBUTE] = String(params.logger);
            }
            if (params?.data !== undefined) {
                attributes$1[attributes.MCP_LOGGING_DATA_TYPE_ATTRIBUTE] = typeof params.data;
                if (typeof params.data === 'string') {
                    attributes$1[attributes.MCP_LOGGING_MESSAGE_ATTRIBUTE] = params.data;
                } else {
                    attributes$1[attributes.MCP_LOGGING_MESSAGE_ATTRIBUTE] = JSON.stringify(params.data);
                }
            }
            break;
        case 'notifications/progress':
            if (params?.progressToken) {
                attributes$1['mcp.progress.token'] = String(params.progressToken);
            }
            if (typeof params?.progress === 'number') {
                attributes$1['mcp.progress.current'] = params.progress;
            }
            if (typeof params?.total === 'number') {
                attributes$1['mcp.progress.total'] = params.total;
                if (typeof params?.progress === 'number') {
                    attributes$1['mcp.progress.percentage'] = params.progress / params.total * 100;
                }
            }
            if (params?.message) {
                attributes$1['mcp.progress.message'] = String(params.message);
            }
            break;
        case 'notifications/resources/updated':
            if (params?.uri) {
                attributes$1[attributes.MCP_RESOURCE_URI_ATTRIBUTE] = String(params.uri);
                const urlObject = url.parseStringToURLObject(String(params.uri));
                if (urlObject && !url.isURLObjectRelative(urlObject)) {
                    attributes$1['mcp.resource.protocol'] = urlObject.protocol.replace(':', '');
                }
            }
            break;
        case 'notifications/initialized':
            attributes$1['mcp.lifecycle.phase'] = 'initialization_complete';
            attributes$1['mcp.protocol.ready'] = 1;
            break;
    }
    return attributes$1;
}
/**
 * Build type-specific attributes based on message type
 * @param type - Span type (request or notification)
 * @param message - JSON-RPC message
 * @param params - Optional parameters for attribute extraction
 * @returns Type-specific attributes for span instrumentation
 */ function buildTypeSpecificAttributes(type, message, params) {
    if (type === 'request') {
        const request = message;
        const targetInfo = methodConfig.extractTargetInfo(request.method, params || {});
        return {
            ...request.id !== undefined && {
                [attributes.MCP_REQUEST_ID_ATTRIBUTE]: String(request.id)
            },
            ...targetInfo.attributes,
            ...methodConfig.getRequestArguments(request.method, params || {})
        };
    }
    return getNotificationAttributes(message.method, params || {});
}
exports.buildTypeSpecificAttributes = buildTypeSpecificAttributes;
exports.getNotificationAttributes = getNotificationAttributes; //# sourceMappingURL=attributeExtraction.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/spans.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const attributeExtraction = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributeExtraction.js [app-ssr] (ecmascript)");
const attributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/attributes.js [app-ssr] (ecmascript)");
const methodConfig = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/methodConfig.js [app-ssr] (ecmascript)");
const piiFiltering = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/piiFiltering.js [app-ssr] (ecmascript)");
const sessionExtraction = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionExtraction.js [app-ssr] (ecmascript)");
/**
 * Span creation and management functions for MCP server instrumentation
 *
 * Provides unified span creation following OpenTelemetry MCP semantic conventions and our opinitionated take on MCP.
 * Handles both request and notification spans with attribute extraction.
 */ /**
 * Creates a span name based on the method and target
 * @internal
 * @param method - MCP method name
 * @param target - Optional target identifier
 * @returns Formatted span name
 */ function createSpanName(method, target) {
    return target ? `${method} ${target}` : method;
}
/**
 * Build Sentry-specific attributes based on span type
 * @internal
 * @param type - Span type configuration
 * @returns Sentry-specific attributes
 */ function buildSentryAttributes(type) {
    let op;
    let origin;
    switch(type){
        case 'request':
            op = attributes.MCP_SERVER_OP_VALUE;
            origin = attributes.MCP_FUNCTION_ORIGIN_VALUE;
            break;
        case 'notification-incoming':
            op = attributes.MCP_NOTIFICATION_CLIENT_TO_SERVER_OP_VALUE;
            origin = attributes.MCP_NOTIFICATION_ORIGIN_VALUE;
            break;
        case 'notification-outgoing':
            op = attributes.MCP_NOTIFICATION_SERVER_TO_CLIENT_OP_VALUE;
            origin = attributes.MCP_NOTIFICATION_ORIGIN_VALUE;
            break;
    }
    return {
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: origin,
        [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: attributes.MCP_ROUTE_SOURCE_VALUE
    };
}
/**
 * Unified builder for creating MCP spans
 * @internal
 * @param config - Span configuration
 * @returns Created span
 */ function createMcpSpan(config) {
    const { type, message, transport, extra, callback } = config;
    const { method } = message;
    const params = message.params;
    // Determine span name based on type and OTEL conventions
    let spanName;
    if (type === 'request') {
        const targetInfo = methodConfig.extractTargetInfo(method, params || {});
        spanName = createSpanName(method, targetInfo.target);
    } else {
        // For notifications, use method name directly per OpenTelemetry conventions
        spanName = method;
    }
    const rawAttributes = {
        ...sessionExtraction.buildTransportAttributes(transport, extra),
        [attributes.MCP_METHOD_NAME_ATTRIBUTE]: method,
        ...attributeExtraction.buildTypeSpecificAttributes(type, message, params),
        ...buildSentryAttributes(type)
    };
    const client = currentScopes.getClient();
    const sendDefaultPii = Boolean(client?.getOptions().sendDefaultPii);
    const attributes$1 = piiFiltering.filterMcpPiiFromSpanData(rawAttributes, sendDefaultPii);
    return trace.startSpan({
        name: spanName,
        forceTransaction: true,
        attributes: attributes$1
    }, callback);
}
/**
 * Creates a span for incoming MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param extra - Extra handler data
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function createMcpNotificationSpan(jsonRpcMessage, transport, extra, callback) {
    return createMcpSpan({
        type: 'notification-incoming',
        message: jsonRpcMessage,
        transport,
        extra,
        callback
    });
}
/**
 * Creates a span for outgoing MCP notifications
 * @param jsonRpcMessage - Notification message
 * @param transport - MCP transport instance
 * @param callback - Span execution callback
 * @returns Span execution result
 */ function createMcpOutgoingNotificationSpan(jsonRpcMessage, transport, callback) {
    return createMcpSpan({
        type: 'notification-outgoing',
        message: jsonRpcMessage,
        transport,
        callback
    });
}
/**
 * Builds span configuration for MCP server requests
 * @param jsonRpcMessage - Request message
 * @param transport - MCP transport instance
 * @param extra - Optional extra handler data
 * @returns Span configuration object
 */ function buildMcpServerSpanConfig(jsonRpcMessage, transport, extra) {
    const { method } = jsonRpcMessage;
    const params = jsonRpcMessage.params;
    const targetInfo = methodConfig.extractTargetInfo(method, params || {});
    const spanName = createSpanName(method, targetInfo.target);
    const rawAttributes = {
        ...sessionExtraction.buildTransportAttributes(transport, extra),
        [attributes.MCP_METHOD_NAME_ATTRIBUTE]: method,
        ...attributeExtraction.buildTypeSpecificAttributes('request', jsonRpcMessage, params),
        ...buildSentryAttributes('request')
    };
    const client = currentScopes.getClient();
    const sendDefaultPii = Boolean(client?.getOptions().sendDefaultPii);
    const attributes$1 = piiFiltering.filterMcpPiiFromSpanData(rawAttributes, sendDefaultPii);
    return {
        name: spanName,
        op: attributes.MCP_SERVER_OP_VALUE,
        forceTransaction: true,
        attributes: attributes$1
    };
}
exports.buildMcpServerSpanConfig = buildMcpServerSpanConfig;
exports.createMcpNotificationSpan = createMcpNotificationSpan;
exports.createMcpOutgoingNotificationSpan = createMcpOutgoingNotificationSpan; //# sourceMappingURL=spans.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/transport.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const correlation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/correlation.js [app-ssr] (ecmascript)");
const errorCapture = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/errorCapture.js [app-ssr] (ecmascript)");
const sessionExtraction = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionExtraction.js [app-ssr] (ecmascript)");
const sessionManagement = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/sessionManagement.js [app-ssr] (ecmascript)");
const spans = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/spans.js [app-ssr] (ecmascript)");
const validation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/validation.js [app-ssr] (ecmascript)");
/**
 * Transport layer instrumentation for MCP server
 *
 * Handles message interception and response correlation.
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/transports
 */ /**
 * Wraps transport.onmessage to create spans for incoming messages.
 * For "initialize" requests, extracts and stores client info and protocol version
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function wrapTransportOnMessage(transport) {
    if (transport.onmessage) {
        object.fill(transport, 'onmessage', (originalOnMessage)=>{
            return function(message, extra) {
                if (validation.isJsonRpcRequest(message)) {
                    if (message.method === 'initialize') {
                        try {
                            const sessionData = sessionExtraction.extractSessionDataFromInitializeRequest(message);
                            sessionManagement.storeSessionDataForTransport(this, sessionData);
                        } catch  {
                        // noop
                        }
                    }
                    const isolationScope = currentScopes.getIsolationScope().clone();
                    return currentScopes.withIsolationScope(isolationScope, ()=>{
                        const spanConfig = spans.buildMcpServerSpanConfig(message, this, extra);
                        const span = trace.startInactiveSpan(spanConfig);
                        correlation.storeSpanForRequest(this, message.id, span, message.method);
                        return trace.withActiveSpan(span, ()=>{
                            return originalOnMessage.call(this, message, extra);
                        });
                    });
                }
                if (validation.isJsonRpcNotification(message)) {
                    return spans.createMcpNotificationSpan(message, this, extra, ()=>{
                        return originalOnMessage.call(this, message, extra);
                    });
                }
                return originalOnMessage.call(this, message, extra);
            };
        });
    }
}
/**
 * Wraps transport.send to handle outgoing messages and response correlation.
 * For "initialize" responses, extracts and stores protocol version and server info
 * in the session data for the transport.
 * @param transport - MCP transport instance to wrap
 */ function wrapTransportSend(transport) {
    if (transport.send) {
        object.fill(transport, 'send', (originalSend)=>{
            return async function(...args) {
                const [message] = args;
                if (validation.isJsonRpcNotification(message)) {
                    return spans.createMcpOutgoingNotificationSpan(message, this, ()=>{
                        return originalSend.call(this, ...args);
                    });
                }
                if (validation.isJsonRpcResponse(message)) {
                    if (message.id !== null && message.id !== undefined) {
                        if (message.error) {
                            captureJsonRpcErrorResponse(message.error);
                        }
                        if (validation.isValidContentItem(message.result)) {
                            if (message.result.protocolVersion || message.result.serverInfo) {
                                try {
                                    const serverData = sessionExtraction.extractSessionDataFromInitializeResponse(message.result);
                                    sessionManagement.updateSessionDataForTransport(this, serverData);
                                } catch  {
                                // noop
                                }
                            }
                        }
                        correlation.completeSpanWithResults(this, message.id, message.result);
                    }
                }
                return originalSend.call(this, ...args);
            };
        });
    }
}
/**
 * Wraps transport.onclose to clean up pending spans for this transport only
 * @param transport - MCP transport instance to wrap
 */ function wrapTransportOnClose(transport) {
    if (transport.onclose) {
        object.fill(transport, 'onclose', (originalOnClose)=>{
            return function(...args) {
                correlation.cleanupPendingSpansForTransport(this);
                sessionManagement.cleanupSessionDataForTransport(this);
                return originalOnClose.call(this, ...args);
            };
        });
    }
}
/**
 * Wraps transport error handlers to capture connection errors
 * @param transport - MCP transport instance to wrap
 */ function wrapTransportError(transport) {
    if (transport.onerror) {
        object.fill(transport, 'onerror', (originalOnError)=>{
            return function(error) {
                captureTransportError(error);
                return originalOnError.call(this, error);
            };
        });
    }
}
/**
 * Captures JSON-RPC error responses for server-side errors.
 * @see https://www.jsonrpc.org/specification#error_object
 * @internal
 * @param errorResponse - JSON-RPC error response
 */ function captureJsonRpcErrorResponse(errorResponse) {
    try {
        if (errorResponse && typeof errorResponse === 'object' && 'code' in errorResponse && 'message' in errorResponse) {
            const jsonRpcError = errorResponse;
            const isServerError = jsonRpcError.code === -32603 || jsonRpcError.code >= -32099 && jsonRpcError.code <= -32000;
            if (isServerError) {
                const error = new Error(jsonRpcError.message);
                error.name = `JsonRpcError_${jsonRpcError.code}`;
                errorCapture.captureError(error, 'protocol');
            }
        }
    } catch  {
    // noop
    }
}
/**
 * Captures transport connection errors
 * @internal
 * @param error - Transport error
 */ function captureTransportError(error) {
    try {
        errorCapture.captureError(error, 'transport');
    } catch  {
    // noop
    }
}
exports.wrapTransportError = wrapTransportError;
exports.wrapTransportOnClose = wrapTransportOnClose;
exports.wrapTransportOnMessage = wrapTransportOnMessage;
exports.wrapTransportSend = wrapTransportSend; //# sourceMappingURL=transport.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/handlers.js [app-ssr] (ecmascript)");
const transport = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/transport.js [app-ssr] (ecmascript)");
const validation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/validation.js [app-ssr] (ecmascript)");
/**
 * Tracks wrapped MCP server instances to prevent double-wrapping
 * @internal
 */ const wrappedMcpServerInstances = new WeakSet();
/**
 * Wraps a MCP Server instance from the `@modelcontextprotocol/sdk` package with Sentry instrumentation.
 *
 * Compatible with versions `^1.9.0` of the `@modelcontextprotocol/sdk` package.
 * Automatically instruments transport methods and handler functions for comprehensive monitoring.
 *
 * @example
 * ```typescript
 * import * as Sentry from '@sentry/core';
 * import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
 * import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
 *
 * const server = Sentry.wrapMcpServerWithSentry(
 *   new McpServer({ name: "my-server", version: "1.0.0" })
 * );
 *
 * const transport = new StreamableHTTPServerTransport();
 * await server.connect(transport);
 * ```
 *
 * @param mcpServerInstance - MCP server instance to instrument
 * @returns Instrumented server instance (same reference)
 */ function wrapMcpServerWithSentry(mcpServerInstance) {
    if (wrappedMcpServerInstances.has(mcpServerInstance)) {
        return mcpServerInstance;
    }
    if (!validation.validateMcpServerInstance(mcpServerInstance)) {
        return mcpServerInstance;
    }
    const serverInstance = mcpServerInstance;
    object.fill(serverInstance, 'connect', (originalConnect)=>{
        return async function(transport$1, ...restArgs) {
            const result = await originalConnect.call(this, transport$1, ...restArgs);
            transport.wrapTransportOnMessage(transport$1);
            transport.wrapTransportSend(transport$1);
            transport.wrapTransportOnClose(transport$1);
            transport.wrapTransportError(transport$1);
            return result;
        };
    });
    handlers.wrapAllMCPHandlers(serverInstance);
    wrappedMcpServerInstances.add(mcpServerInstance);
    return mcpServerInstance;
}
exports.wrapMcpServerWithSentry = wrapMcpServerWithSentry; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/feedback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
/**
 * Send user feedback to Sentry.
 */ function captureFeedback(params, hint = {}, scope = currentScopes.getCurrentScope()) {
    const { message, name, email, url, source, associatedEventId, tags } = params;
    const feedbackEvent = {
        contexts: {
            feedback: {
                contact_email: email,
                name,
                message,
                url,
                source,
                associated_event_id: associatedEventId
            }
        },
        type: 'feedback',
        level: 'info',
        tags
    };
    const client = scope?.getClient() || currentScopes.getClient();
    if (client) {
        client.emit('beforeSendFeedback', feedbackEvent, hint);
    }
    const eventId = scope.captureEvent(feedbackEvent, hint);
    return eventId;
}
exports.captureFeedback = captureFeedback; //# sourceMappingURL=feedback.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/console-integration.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const console = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/console.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/exports.js [app-ssr] (ecmascript)");
const INTEGRATION_NAME = 'ConsoleLogs';
const DEFAULT_ATTRIBUTES = {
    [semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.console.logging'
};
const _consoleLoggingIntegration = (options = {})=>{
    const levels = options.levels || debugLogger.CONSOLE_LEVELS;
    return {
        name: INTEGRATION_NAME,
        setup (client) {
            const { enableLogs, normalizeDepth = 3, normalizeMaxBreadth = 1000 } = client.getOptions();
            if (!enableLogs) {
                debugBuild.DEBUG_BUILD && debugLogger.debug.warn('`enableLogs` is not enabled, ConsoleLogs integration disabled');
                return;
            }
            console.addConsoleInstrumentationHandler(({ args, level })=>{
                if (currentScopes.getClient() !== client || !levels.includes(level)) {
                    return;
                }
                if (level === 'assert') {
                    if (!args[0]) {
                        const followingArgs = args.slice(1);
                        const assertionMessage = followingArgs.length > 0 ? `Assertion failed: ${formatConsoleArgs(followingArgs, normalizeDepth, normalizeMaxBreadth)}` : 'Assertion failed';
                        exports$1._INTERNAL_captureLog({
                            level: 'error',
                            message: assertionMessage,
                            attributes: DEFAULT_ATTRIBUTES
                        });
                    }
                    return;
                }
                const isLevelLog = level === 'log';
                exports$1._INTERNAL_captureLog({
                    level: isLevelLog ? 'info' : level,
                    message: formatConsoleArgs(args, normalizeDepth, normalizeMaxBreadth),
                    severityNumber: isLevelLog ? 10 : undefined,
                    attributes: DEFAULT_ATTRIBUTES
                });
            });
        }
    };
};
/**
 * Captures calls to the `console` API as logs in Sentry. Requires the `enableLogs` option to be enabled.
 *
 * @experimental This feature is experimental and may be changed or removed in future versions.
 *
 * By default the integration instruments `console.debug`, `console.info`, `console.warn`, `console.error`,
 * `console.log`, `console.trace`, and `console.assert`. You can use the `levels` option to customize which
 * levels are captured.
 *
 * @example
 *
 * ```ts
 * import * as Sentry from '@sentry/browser';
 *
 * Sentry.init({
 *   enableLogs: true,
 *   integrations: [Sentry.consoleLoggingIntegration({ levels: ['error', 'warn'] })],
 * });
 * ```
 */ const consoleLoggingIntegration = integration.defineIntegration(_consoleLoggingIntegration);
function formatConsoleArgs(values, normalizeDepth, normalizeMaxBreadth) {
    return 'util' in worldwide.GLOBAL_OBJ && typeof worldwide.GLOBAL_OBJ.util.format === 'function' ? worldwide.GLOBAL_OBJ.util.format(...values) : safeJoinConsoleArgs(values, normalizeDepth, normalizeMaxBreadth);
}
function safeJoinConsoleArgs(values, normalizeDepth, normalizeMaxBreadth) {
    return values.map((value)=>is.isPrimitive(value) ? String(value) : JSON.stringify(normalize.normalize(value, normalizeDepth, normalizeMaxBreadth))).join(' ');
}
exports.consoleLoggingIntegration = consoleLoggingIntegration; //# sourceMappingURL=console-integration.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercel-ai-attributes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/* eslint-disable max-lines */ /**
 * AI SDK Telemetry Attributes
 * Based on https://ai-sdk.dev/docs/ai-sdk-core/telemetry#collected-data
 */ // =============================================================================
// SHARED ATTRIBUTES
// =============================================================================
/**
 * `generateText` function - `ai.generateText` span
 * `streamText` function - `ai.streamText` span
 *
 * The prompt that was used when calling the function
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generatetext-function
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#streamtext-function
 */ const AI_PROMPT_ATTRIBUTE = 'ai.prompt';
/**
 * `generateObject` function - `ai.generateObject` span
 * `streamObject` function - `ai.streamObject` span
 *
 * The object that was generated (stringified JSON)
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generateobject-function
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#streamobject-function
 */ const AI_RESPONSE_OBJECT_ATTRIBUTE = 'ai.response.object';
// =============================================================================
// GENERATETEXT FUNCTION - UNIQUE ATTRIBUTES
// =============================================================================
/**
 * `generateText` function - `ai.generateText` span
 *
 * The text that was generated
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generatetext-function
 */ const AI_RESPONSE_TEXT_ATTRIBUTE = 'ai.response.text';
/**
 * `generateText` function - `ai.generateText` span
 *
 * The tool calls that were made as part of the generation (stringified JSON)
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generatetext-function
 */ const AI_RESPONSE_TOOL_CALLS_ATTRIBUTE = 'ai.response.toolCalls';
/**
 * `generateText` function - `ai.generateText.doGenerate` span
 *
 * The messages that were passed into the provider
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generatetext-function
 */ const AI_PROMPT_MESSAGES_ATTRIBUTE = 'ai.prompt.messages';
/**
 * `generateText` function - `ai.generateText.doGenerate` span
 *
 * Array of stringified tool definitions
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#generatetext-function
 */ const AI_PROMPT_TOOLS_ATTRIBUTE = 'ai.prompt.tools';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * The id of the model
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_MODEL_ID_ATTRIBUTE = 'ai.model.id';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * The provider of the model
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_MODEL_PROVIDER_ATTRIBUTE = 'ai.model.provider';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * Provider specific metadata returned with the generation response
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_RESPONSE_PROVIDER_METADATA_ATTRIBUTE = 'ai.response.providerMetadata';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * The functionId that was set through `telemetry.functionId`
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_TELEMETRY_FUNCTION_ID_ATTRIBUTE = 'ai.telemetry.functionId';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * The number of completion tokens that were used
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_USAGE_COMPLETION_TOKENS_ATTRIBUTE = 'ai.usage.completionTokens';
/**
 * Basic LLM span information
 * Multiple spans
 *
 * The number of prompt tokens that were used
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#basic-llm-span-information
 */ const AI_USAGE_PROMPT_TOKENS_ATTRIBUTE = 'ai.usage.promptTokens';
/**
 * Semantic Conventions for GenAI operations
 * Individual LLM call spans
 *
 * The model that was used to generate the response
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#call-llm-span-information
 */ const GEN_AI_RESPONSE_MODEL_ATTRIBUTE = 'gen_ai.response.model';
/**
 * Semantic Conventions for GenAI operations
 * Individual LLM call spans
 *
 * The number of prompt tokens that were used
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#call-llm-span-information
 */ const GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE = 'gen_ai.usage.input_tokens';
/**
 * Semantic Conventions for GenAI operations
 * Individual LLM call spans
 *
 * The number of completion tokens that were used
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#call-llm-span-information
 */ const GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE = 'gen_ai.usage.output_tokens';
// =============================================================================
// TOOL CALL SPANS
// =============================================================================
/**
 * Tool call spans
 * `ai.toolCall` span
 *
 * The name of the tool
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#tool-call-spans
 */ const AI_TOOL_CALL_NAME_ATTRIBUTE = 'ai.toolCall.name';
/**
 * Tool call spans
 * `ai.toolCall` span
 *
 * The id of the tool call
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#tool-call-spans
 */ const AI_TOOL_CALL_ID_ATTRIBUTE = 'ai.toolCall.id';
/**
 * Tool call spans
 * `ai.toolCall` span
 *
 * The parameters of the tool call
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#tool-call-spans
 */ const AI_TOOL_CALL_ARGS_ATTRIBUTE = 'ai.toolCall.args';
/**
 * Tool call spans
 * `ai.toolCall` span
 *
 * The result of the tool call
 * @see https://ai-sdk.dev/docs/ai-sdk-core/telemetry#tool-call-spans
 */ const AI_TOOL_CALL_RESULT_ATTRIBUTE = 'ai.toolCall.result';
// =============================================================================
// PROVIDER METADATA
// =============================================================================
/**
 * OpenAI Provider Metadata
 * @see https://ai-sdk.dev/providers/ai-sdk-providers/openai
 * @see https://github.com/vercel/ai/blob/65e042afde6aad4da9d7a62526ece839eb34f9a5/packages/openai/src/openai-chat-language-model.ts#L397-L416
 * @see https://github.com/vercel/ai/blob/65e042afde6aad4da9d7a62526ece839eb34f9a5/packages/openai/src/responses/openai-responses-language-model.ts#L377C7-L384
 */ exports.AI_MODEL_ID_ATTRIBUTE = AI_MODEL_ID_ATTRIBUTE;
exports.AI_MODEL_PROVIDER_ATTRIBUTE = AI_MODEL_PROVIDER_ATTRIBUTE;
exports.AI_PROMPT_ATTRIBUTE = AI_PROMPT_ATTRIBUTE;
exports.AI_PROMPT_MESSAGES_ATTRIBUTE = AI_PROMPT_MESSAGES_ATTRIBUTE;
exports.AI_PROMPT_TOOLS_ATTRIBUTE = AI_PROMPT_TOOLS_ATTRIBUTE;
exports.AI_RESPONSE_OBJECT_ATTRIBUTE = AI_RESPONSE_OBJECT_ATTRIBUTE;
exports.AI_RESPONSE_PROVIDER_METADATA_ATTRIBUTE = AI_RESPONSE_PROVIDER_METADATA_ATTRIBUTE;
exports.AI_RESPONSE_TEXT_ATTRIBUTE = AI_RESPONSE_TEXT_ATTRIBUTE;
exports.AI_RESPONSE_TOOL_CALLS_ATTRIBUTE = AI_RESPONSE_TOOL_CALLS_ATTRIBUTE;
exports.AI_TELEMETRY_FUNCTION_ID_ATTRIBUTE = AI_TELEMETRY_FUNCTION_ID_ATTRIBUTE;
exports.AI_TOOL_CALL_ARGS_ATTRIBUTE = AI_TOOL_CALL_ARGS_ATTRIBUTE;
exports.AI_TOOL_CALL_ID_ATTRIBUTE = AI_TOOL_CALL_ID_ATTRIBUTE;
exports.AI_TOOL_CALL_NAME_ATTRIBUTE = AI_TOOL_CALL_NAME_ATTRIBUTE;
exports.AI_TOOL_CALL_RESULT_ATTRIBUTE = AI_TOOL_CALL_RESULT_ATTRIBUTE;
exports.AI_USAGE_COMPLETION_TOKENS_ATTRIBUTE = AI_USAGE_COMPLETION_TOKENS_ATTRIBUTE;
exports.AI_USAGE_PROMPT_TOKENS_ATTRIBUTE = AI_USAGE_PROMPT_TOKENS_ATTRIBUTE;
exports.GEN_AI_RESPONSE_MODEL_ATTRIBUTE = GEN_AI_RESPONSE_MODEL_ATTRIBUTE;
exports.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE = GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE;
exports.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE = GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE; //# sourceMappingURL=vercel-ai-attributes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercel-ai.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const vercelAiAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercel-ai-attributes.js [app-ssr] (ecmascript)");
function addOriginToSpan(span, origin) {
    span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, origin);
}
/**
 * Post-process spans emitted by the Vercel AI SDK.
 * This is supposed to be used in `client.on('spanStart', ...)
 */ function onVercelAiSpanStart(span) {
    const { data: attributes, description: name } = spanUtils.spanToJSON(span);
    if (!name) {
        return;
    }
    // Tool call spans
    // https://ai-sdk.dev/docs/ai-sdk-core/telemetry#tool-call-spans
    if (attributes[vercelAiAttributes.AI_TOOL_CALL_NAME_ATTRIBUTE] && attributes[vercelAiAttributes.AI_TOOL_CALL_ID_ATTRIBUTE] && name === 'ai.toolCall') {
        processToolCallSpan(span, attributes);
        return;
    }
    // The AI and Provider must be defined for generate, stream, and embed spans.
    // The id of the model
    const aiModelId = attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE];
    // the provider of the model
    const aiModelProvider = attributes[vercelAiAttributes.AI_MODEL_PROVIDER_ATTRIBUTE];
    if (typeof aiModelId !== 'string' || typeof aiModelProvider !== 'string' || !aiModelId || !aiModelProvider) {
        return;
    }
    processGenerateSpan(span, name, attributes);
}
function vercelAiEventProcessor(event) {
    if (event.type === 'transaction' && event.spans) {
        // Map to accumulate token data by parent span ID
        const tokenAccumulator = new Map();
        // First pass: process all spans and accumulate token data
        for (const span of event.spans){
            processEndedVercelAiSpan(span);
            // Accumulate token data for parent spans
            accumulateTokensForParent(span, tokenAccumulator);
        }
        // Second pass: apply accumulated token data to parent spans
        for (const span of event.spans){
            if (span.op !== 'gen_ai.invoke_agent') {
                continue;
            }
            applyAccumulatedTokens(span, tokenAccumulator);
        }
    }
    return event;
}
/**
 * Post-process spans emitted by the Vercel AI SDK.
 */ function processEndedVercelAiSpan(span) {
    const { data: attributes, origin } = span;
    if (origin !== 'auto.vercelai.otel') {
        return;
    }
    renameAttributeKey(attributes, vercelAiAttributes.AI_USAGE_COMPLETION_TOKENS_ATTRIBUTE, vercelAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE);
    renameAttributeKey(attributes, vercelAiAttributes.AI_USAGE_PROMPT_TOKENS_ATTRIBUTE, vercelAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE);
    if (typeof attributes[vercelAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] === 'number' && typeof attributes[vercelAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] === 'number') {
        attributes['gen_ai.usage.total_tokens'] = attributes[vercelAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] + attributes[vercelAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE];
    }
    // Rename AI SDK attributes to standardized gen_ai attributes
    renameAttributeKey(attributes, vercelAiAttributes.AI_PROMPT_MESSAGES_ATTRIBUTE, 'gen_ai.request.messages');
    renameAttributeKey(attributes, vercelAiAttributes.AI_RESPONSE_TEXT_ATTRIBUTE, 'gen_ai.response.text');
    renameAttributeKey(attributes, vercelAiAttributes.AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, 'gen_ai.response.tool_calls');
    renameAttributeKey(attributes, vercelAiAttributes.AI_RESPONSE_OBJECT_ATTRIBUTE, 'gen_ai.response.object');
    renameAttributeKey(attributes, vercelAiAttributes.AI_PROMPT_TOOLS_ATTRIBUTE, 'gen_ai.request.available_tools');
    renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_ARGS_ATTRIBUTE, 'gen_ai.tool.input');
    renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_RESULT_ATTRIBUTE, 'gen_ai.tool.output');
    addProviderMetadataToAttributes(attributes);
    // Change attributes namespaced with `ai.X` to `vercel.ai.X`
    for (const key of Object.keys(attributes)){
        if (key.startsWith('ai.')) {
            renameAttributeKey(attributes, key, `vercel.${key}`);
        }
    }
}
/**
 * Renames an attribute key in the provided attributes object if the old key exists.
 * This function safely handles null and undefined values.
 */ function renameAttributeKey(attributes, oldKey, newKey) {
    if (attributes[oldKey] != null) {
        attributes[newKey] = attributes[oldKey];
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete attributes[oldKey];
    }
}
function processToolCallSpan(span, attributes) {
    addOriginToSpan(span, 'auto.vercelai.otel');
    span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.execute_tool');
    renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_NAME_ATTRIBUTE, 'gen_ai.tool.name');
    renameAttributeKey(attributes, vercelAiAttributes.AI_TOOL_CALL_ID_ATTRIBUTE, 'gen_ai.tool.call.id');
    // https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/#gen-ai-tool-type
    if (!attributes['gen_ai.tool.type']) {
        span.setAttribute('gen_ai.tool.type', 'function');
    }
    const toolName = attributes['gen_ai.tool.name'];
    if (toolName) {
        span.updateName(`execute_tool ${toolName}`);
    }
}
function processGenerateSpan(span, name, attributes) {
    addOriginToSpan(span, 'auto.vercelai.otel');
    const nameWthoutAi = name.replace('ai.', '');
    span.setAttribute('ai.pipeline.name', nameWthoutAi);
    span.updateName(nameWthoutAi);
    // If a Telemetry name is set and it is a pipeline span, use that as the operation name
    const functionId = attributes[vercelAiAttributes.AI_TELEMETRY_FUNCTION_ID_ATTRIBUTE];
    if (functionId && typeof functionId === 'string' && name.split('.').length - 1 === 1) {
        span.updateName(`${nameWthoutAi} ${functionId}`);
        span.setAttribute('gen_ai.function_id', functionId);
    }
    if (attributes[vercelAiAttributes.AI_PROMPT_ATTRIBUTE]) {
        span.setAttribute('gen_ai.prompt', attributes[vercelAiAttributes.AI_PROMPT_ATTRIBUTE]);
    }
    if (attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE] && !attributes[vercelAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE]) {
        span.setAttribute(vercelAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE, attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]);
    }
    span.setAttribute('ai.streaming', name.includes('stream'));
    // Generate Spans
    if (name === 'ai.generateText') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.generateText.doGenerate') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.generate_text');
        span.updateName(`generate_text ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name === 'ai.streamText') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.streamText.doStream') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.stream_text');
        span.updateName(`stream_text ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name === 'ai.generateObject') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.generateObject.doGenerate') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.generate_object');
        span.updateName(`generate_object ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name === 'ai.streamObject') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.streamObject.doStream') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.stream_object');
        span.updateName(`stream_object ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name === 'ai.embed') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.embed.doEmbed') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.embed');
        span.updateName(`embed ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name === 'ai.embedMany') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.invoke_agent');
        return;
    }
    if (name === 'ai.embedMany.doEmbed') {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'gen_ai.embed_many');
        span.updateName(`embed_many ${attributes[vercelAiAttributes.AI_MODEL_ID_ATTRIBUTE]}`);
        return;
    }
    if (name.startsWith('ai.stream')) {
        span.setAttribute(semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP, 'ai.run');
        return;
    }
}
/**
 * Add event processors to the given client to process Vercel AI spans.
 */ function addVercelAiProcessors(client) {
    client.on('spanStart', onVercelAiSpanStart);
    // Note: We cannot do this on `spanEnd`, because the span cannot be mutated anymore at this point
    client.addEventProcessor(Object.assign(vercelAiEventProcessor, {
        id: 'VercelAiEventProcessor'
    }));
}
/**
 * Accumulates token data from a span to its parent in the token accumulator map.
 * This function extracts token usage from the current span and adds it to the
 * accumulated totals for its parent span.
 */ function accumulateTokensForParent(span, tokenAccumulator) {
    const parentSpanId = span.parent_span_id;
    if (!parentSpanId) {
        return;
    }
    const inputTokens = span.data[vercelAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE];
    const outputTokens = span.data[vercelAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE];
    if (typeof inputTokens === 'number' || typeof outputTokens === 'number') {
        const existing = tokenAccumulator.get(parentSpanId) || {
            inputTokens: 0,
            outputTokens: 0
        };
        if (typeof inputTokens === 'number') {
            existing.inputTokens += inputTokens;
        }
        if (typeof outputTokens === 'number') {
            existing.outputTokens += outputTokens;
        }
        tokenAccumulator.set(parentSpanId, existing);
    }
}
/**
 * Applies accumulated token data to the `gen_ai.invoke_agent` span.
 * Only immediate children of the `gen_ai.invoke_agent` span are considered,
 * since aggregation will automatically occur for each parent span.
 */ function applyAccumulatedTokens(span, tokenAccumulator) {
    const accumulated = tokenAccumulator.get(span.span_id);
    if (!accumulated) {
        return;
    }
    if (accumulated.inputTokens > 0) {
        span.data[vercelAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] = accumulated.inputTokens;
    }
    if (accumulated.outputTokens > 0) {
        span.data[vercelAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] = accumulated.outputTokens;
    }
    if (accumulated.inputTokens > 0 || accumulated.outputTokens > 0) {
        span.data['gen_ai.usage.total_tokens'] = accumulated.inputTokens + accumulated.outputTokens;
    }
}
function addProviderMetadataToAttributes(attributes) {
    const providerMetadata = attributes[vercelAiAttributes.AI_RESPONSE_PROVIDER_METADATA_ATTRIBUTE];
    if (providerMetadata) {
        try {
            const providerMetadataObject = JSON.parse(providerMetadata);
            if (providerMetadataObject.openai) {
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cached', providerMetadataObject.openai.cachedPromptTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.output_tokens.reasoning', providerMetadataObject.openai.reasoningTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.output_tokens.prediction_accepted', providerMetadataObject.openai.acceptedPredictionTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.output_tokens.prediction_rejected', providerMetadataObject.openai.rejectedPredictionTokens);
                setAttributeIfDefined(attributes, 'gen_ai.conversation.id', providerMetadataObject.openai.responseId);
            }
            if (providerMetadataObject.anthropic) {
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cached', providerMetadataObject.anthropic.cacheReadInputTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cache_write', providerMetadataObject.anthropic.cacheCreationInputTokens);
            }
            if (providerMetadataObject.bedrock?.usage) {
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cached', providerMetadataObject.bedrock.usage.cacheReadInputTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cache_write', providerMetadataObject.bedrock.usage.cacheWriteInputTokens);
            }
            if (providerMetadataObject.deepseek) {
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cached', providerMetadataObject.deepseek.promptCacheHitTokens);
                setAttributeIfDefined(attributes, 'gen_ai.usage.input_tokens.cache_miss', providerMetadataObject.deepseek.promptCacheMissTokens);
            }
        } catch  {
        // Ignore
        }
    }
}
/**
 * Sets an attribute only if the value is not null or undefined.
 */ function setAttributeIfDefined(attributes, key, value) {
    if (value != null) {
        attributes[key] = value;
    }
}
exports.addVercelAiProcessors = addVercelAiProcessors; //# sourceMappingURL=vercel-ai.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/gen-ai-attributes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * OpenAI Integration Telemetry Attributes
 * Based on OpenTelemetry Semantic Conventions for Generative AI
 * @see https://opentelemetry.io/docs/specs/semconv/gen-ai/
 */ // =============================================================================
// OPENTELEMETRY SEMANTIC CONVENTIONS FOR GENAI
// =============================================================================
/**
 * The Generative AI system being used
 * For OpenAI, this should always be "openai"
 */ const GEN_AI_SYSTEM_ATTRIBUTE = 'gen_ai.system';
/**
 * The name of the model as requested
 * Examples: "gpt-4", "gpt-3.5-turbo"
 */ const GEN_AI_REQUEST_MODEL_ATTRIBUTE = 'gen_ai.request.model';
/**
 * Whether streaming was enabled for the request
 */ const GEN_AI_REQUEST_STREAM_ATTRIBUTE = 'gen_ai.request.stream';
/**
 * The temperature setting for the model request
 */ const GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE = 'gen_ai.request.temperature';
/**
 * The frequency penalty setting for the model request
 */ const GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE = 'gen_ai.request.frequency_penalty';
/**
 * The presence penalty setting for the model request
 */ const GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE = 'gen_ai.request.presence_penalty';
/**
 * The top_p (nucleus sampling) setting for the model request
 */ const GEN_AI_REQUEST_TOP_P_ATTRIBUTE = 'gen_ai.request.top_p';
/**
 * Array of reasons why the model stopped generating tokens
 */ const GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE = 'gen_ai.response.finish_reasons';
/**
 * The name of the model that generated the response
 */ const GEN_AI_RESPONSE_MODEL_ATTRIBUTE = 'gen_ai.response.model';
/**
 * The unique identifier for the response
 */ const GEN_AI_RESPONSE_ID_ATTRIBUTE = 'gen_ai.response.id';
/**
 * The number of tokens used in the prompt
 */ const GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE = 'gen_ai.usage.input_tokens';
/**
 * The number of tokens used in the response
 */ const GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE = 'gen_ai.usage.output_tokens';
/**
 * The total number of tokens used (input + output)
 */ const GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE = 'gen_ai.usage.total_tokens';
/**
 * The operation name
 */ const GEN_AI_OPERATION_NAME_ATTRIBUTE = 'gen_ai.operation.name';
/**
 * The prompt messages
 * Only recorded when recordInputs is enabled
 */ const GEN_AI_REQUEST_MESSAGES_ATTRIBUTE = 'gen_ai.request.messages';
/**
 * The response text
 * Only recorded when recordOutputs is enabled
 */ const GEN_AI_RESPONSE_TEXT_ATTRIBUTE = 'gen_ai.response.text';
/**
 * The available tools from incoming request
 * Only recorded when recordInputs is enabled
 */ const GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE = 'gen_ai.request.available_tools';
/**
 * Whether the response is a streaming response
 */ const GEN_AI_RESPONSE_STREAMING_ATTRIBUTE = 'gen_ai.response.streaming';
/**
 * The tool calls from the response
 * Only recorded when recordOutputs is enabled
 */ const GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE = 'gen_ai.response.tool_calls';
// =============================================================================
// OPENAI-SPECIFIC ATTRIBUTES
// =============================================================================
/**
 * The response ID from OpenAI
 */ const OPENAI_RESPONSE_ID_ATTRIBUTE = 'openai.response.id';
/**
 * The response model from OpenAI
 */ const OPENAI_RESPONSE_MODEL_ATTRIBUTE = 'openai.response.model';
/**
 * The response timestamp from OpenAI (ISO string)
 */ const OPENAI_RESPONSE_TIMESTAMP_ATTRIBUTE = 'openai.response.timestamp';
/**
 * The number of completion tokens used
 */ const OPENAI_USAGE_COMPLETION_TOKENS_ATTRIBUTE = 'openai.usage.completion_tokens';
/**
 * The number of prompt tokens used
 */ const OPENAI_USAGE_PROMPT_TOKENS_ATTRIBUTE = 'openai.usage.prompt_tokens';
// =============================================================================
// OPENAI OPERATIONS
// =============================================================================
/**
 * OpenAI API operations
 */ const OPENAI_OPERATIONS = {
    CHAT: 'chat',
    RESPONSES: 'responses'
};
exports.GEN_AI_OPERATION_NAME_ATTRIBUTE = GEN_AI_OPERATION_NAME_ATTRIBUTE;
exports.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE = GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE;
exports.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE = GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE;
exports.GEN_AI_REQUEST_MESSAGES_ATTRIBUTE = GEN_AI_REQUEST_MESSAGES_ATTRIBUTE;
exports.GEN_AI_REQUEST_MODEL_ATTRIBUTE = GEN_AI_REQUEST_MODEL_ATTRIBUTE;
exports.GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE = GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE;
exports.GEN_AI_REQUEST_STREAM_ATTRIBUTE = GEN_AI_REQUEST_STREAM_ATTRIBUTE;
exports.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE = GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE;
exports.GEN_AI_REQUEST_TOP_P_ATTRIBUTE = GEN_AI_REQUEST_TOP_P_ATTRIBUTE;
exports.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE = GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE;
exports.GEN_AI_RESPONSE_ID_ATTRIBUTE = GEN_AI_RESPONSE_ID_ATTRIBUTE;
exports.GEN_AI_RESPONSE_MODEL_ATTRIBUTE = GEN_AI_RESPONSE_MODEL_ATTRIBUTE;
exports.GEN_AI_RESPONSE_STREAMING_ATTRIBUTE = GEN_AI_RESPONSE_STREAMING_ATTRIBUTE;
exports.GEN_AI_RESPONSE_TEXT_ATTRIBUTE = GEN_AI_RESPONSE_TEXT_ATTRIBUTE;
exports.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE = GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE;
exports.GEN_AI_SYSTEM_ATTRIBUTE = GEN_AI_SYSTEM_ATTRIBUTE;
exports.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE = GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE;
exports.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE = GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE;
exports.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE = GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE;
exports.OPENAI_OPERATIONS = OPENAI_OPERATIONS;
exports.OPENAI_RESPONSE_ID_ATTRIBUTE = OPENAI_RESPONSE_ID_ATTRIBUTE;
exports.OPENAI_RESPONSE_MODEL_ATTRIBUTE = OPENAI_RESPONSE_MODEL_ATTRIBUTE;
exports.OPENAI_RESPONSE_TIMESTAMP_ATTRIBUTE = OPENAI_RESPONSE_TIMESTAMP_ATTRIBUTE;
exports.OPENAI_USAGE_COMPLETION_TOKENS_ATTRIBUTE = OPENAI_USAGE_COMPLETION_TOKENS_ATTRIBUTE;
exports.OPENAI_USAGE_PROMPT_TOKENS_ATTRIBUTE = OPENAI_USAGE_PROMPT_TOKENS_ATTRIBUTE; //# sourceMappingURL=gen-ai-attributes.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const OPENAI_INTEGRATION_NAME = 'OpenAI';
// https://platform.openai.com/docs/quickstart?api-mode=responses
// https://platform.openai.com/docs/quickstart?api-mode=chat
const INSTRUMENTED_METHODS = [
    'responses.create',
    'chat.completions.create'
];
const RESPONSES_TOOL_CALL_EVENT_TYPES = [
    'response.output_item.added',
    'response.function_call_arguments.delta',
    'response.function_call_arguments.done',
    'response.output_item.done'
];
const RESPONSE_EVENT_TYPES = [
    'response.created',
    'response.in_progress',
    'response.failed',
    'response.completed',
    'response.incomplete',
    'response.queued',
    'response.output_text.delta',
    ...RESPONSES_TOOL_CALL_EVENT_TYPES
];
exports.INSTRUMENTED_METHODS = INSTRUMENTED_METHODS;
exports.OPENAI_INTEGRATION_NAME = OPENAI_INTEGRATION_NAME;
exports.RESPONSES_TOOL_CALL_EVENT_TYPES = RESPONSES_TOOL_CALL_EVENT_TYPES;
exports.RESPONSE_EVENT_TYPES = RESPONSE_EVENT_TYPES; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const genAiAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/gen-ai-attributes.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/constants.js [app-ssr] (ecmascript)");
/**
 * Maps OpenAI method paths to Sentry operation names
 */ function getOperationName(methodPath) {
    if (methodPath.includes('chat.completions')) {
        return genAiAttributes.OPENAI_OPERATIONS.CHAT;
    }
    if (methodPath.includes('responses')) {
        return genAiAttributes.OPENAI_OPERATIONS.RESPONSES;
    }
    return methodPath.split('.').pop() || 'unknown';
}
/**
 * Get the span operation for OpenAI methods
 * Following Sentry's convention: "gen_ai.{operation_name}"
 */ function getSpanOperation(methodPath) {
    return `gen_ai.${getOperationName(methodPath)}`;
}
/**
 * Check if a method path should be instrumented
 */ function shouldInstrument(methodPath) {
    return constants.INSTRUMENTED_METHODS.includes(methodPath);
}
/**
 * Build method path from current traversal
 */ function buildMethodPath(currentPath, prop) {
    return currentPath ? `${currentPath}.${prop}` : prop;
}
/**
 * Check if response is a Chat Completion object
 */ function isChatCompletionResponse(response) {
    return response !== null && typeof response === 'object' && 'object' in response && response.object === 'chat.completion';
}
/**
 * Check if response is a Responses API object
 */ function isResponsesApiResponse(response) {
    return response !== null && typeof response === 'object' && 'object' in response && response.object === 'response';
}
/**
 * Check if streaming event is from the Responses API
 */ function isResponsesApiStreamEvent(event) {
    return event !== null && typeof event === 'object' && 'type' in event && typeof event.type === 'string' && event.type.startsWith('response.');
}
/**
 * Check if streaming event is a chat completion chunk
 */ function isChatCompletionChunk(event) {
    return event !== null && typeof event === 'object' && 'object' in event && event.object === 'chat.completion.chunk';
}
/**
 * Set token usage attributes
 * @param span - The span to add attributes to
 * @param promptTokens - The number of prompt tokens
 * @param completionTokens - The number of completion tokens
 * @param totalTokens - The number of total tokens
 */ function setTokenUsageAttributes(span, promptTokens, completionTokens, totalTokens) {
    if (promptTokens !== undefined) {
        span.setAttributes({
            [genAiAttributes.OPENAI_USAGE_PROMPT_TOKENS_ATTRIBUTE]: promptTokens,
            [genAiAttributes.GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE]: promptTokens
        });
    }
    if (completionTokens !== undefined) {
        span.setAttributes({
            [genAiAttributes.OPENAI_USAGE_COMPLETION_TOKENS_ATTRIBUTE]: completionTokens,
            [genAiAttributes.GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]: completionTokens
        });
    }
    if (totalTokens !== undefined) {
        span.setAttributes({
            [genAiAttributes.GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE]: totalTokens
        });
    }
}
/**
 * Set common response attributes
 * @param span - The span to add attributes to
 * @param id - The response id
 * @param model - The response model
 * @param timestamp - The response timestamp
 */ function setCommonResponseAttributes(span, id, model, timestamp) {
    span.setAttributes({
        [genAiAttributes.OPENAI_RESPONSE_ID_ATTRIBUTE]: id,
        [genAiAttributes.GEN_AI_RESPONSE_ID_ATTRIBUTE]: id
    });
    span.setAttributes({
        [genAiAttributes.OPENAI_RESPONSE_MODEL_ATTRIBUTE]: model,
        [genAiAttributes.GEN_AI_RESPONSE_MODEL_ATTRIBUTE]: model
    });
    span.setAttributes({
        [genAiAttributes.OPENAI_RESPONSE_TIMESTAMP_ATTRIBUTE]: new Date(timestamp * 1000).toISOString()
    });
}
exports.buildMethodPath = buildMethodPath;
exports.getOperationName = getOperationName;
exports.getSpanOperation = getSpanOperation;
exports.isChatCompletionChunk = isChatCompletionChunk;
exports.isChatCompletionResponse = isChatCompletionResponse;
exports.isResponsesApiResponse = isResponsesApiResponse;
exports.isResponsesApiStreamEvent = isResponsesApiStreamEvent;
exports.setCommonResponseAttributes = setCommonResponseAttributes;
exports.setTokenUsageAttributes = setTokenUsageAttributes;
exports.shouldInstrument = shouldInstrument; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/streaming.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const genAiAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/gen-ai-attributes.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/constants.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/utils.js [app-ssr] (ecmascript)");
/**
 * State object used to accumulate information from a stream of OpenAI events/chunks.
 */ /**
 * Processes tool calls from a chat completion chunk delta.
 * Follows the pattern: accumulate by index, then convert to array at the end.
 *
 * @param toolCalls - Array of tool calls from the delta.
 * @param state - The current streaming state to update.
 *
 *  @see https://platform.openai.com/docs/guides/function-calling#streaming
 */ function processChatCompletionToolCalls(toolCalls, state) {
    for (const toolCall of toolCalls){
        const index = toolCall.index;
        if (index === undefined || !toolCall.function) continue;
        // Initialize tool call if this is the first chunk for this index
        if (!(index in state.chatCompletionToolCalls)) {
            state.chatCompletionToolCalls[index] = {
                ...toolCall,
                function: {
                    name: toolCall.function.name,
                    arguments: toolCall.function.arguments || ''
                }
            };
        } else {
            // Accumulate function arguments from subsequent chunks
            const existingToolCall = state.chatCompletionToolCalls[index];
            if (toolCall.function.arguments && existingToolCall?.function) {
                existingToolCall.function.arguments += toolCall.function.arguments;
            }
        }
    }
}
/**
 * Processes a single OpenAI ChatCompletionChunk event, updating the streaming state.
 *
 * @param chunk - The ChatCompletionChunk event to process.
 * @param state - The current streaming state to update.
 * @param recordOutputs - Whether to record output text fragments.
 */ function processChatCompletionChunk(chunk, state, recordOutputs) {
    state.responseId = chunk.id ?? state.responseId;
    state.responseModel = chunk.model ?? state.responseModel;
    state.responseTimestamp = chunk.created ?? state.responseTimestamp;
    if (chunk.usage) {
        // For stream responses, the input tokens remain constant across all events in the stream.
        // Output tokens, however, are only finalized in the last event.
        // Since we can't guarantee that the last event will include usage data or even be a typed event,
        // we update the output token values on every event that includes them.
        // This ensures that output token usage is always set, even if the final event lacks it.
        state.promptTokens = chunk.usage.prompt_tokens;
        state.completionTokens = chunk.usage.completion_tokens;
        state.totalTokens = chunk.usage.total_tokens;
    }
    for (const choice of chunk.choices ?? []){
        if (recordOutputs) {
            if (choice.delta?.content) {
                state.responseTexts.push(choice.delta.content);
            }
            // Handle tool calls from delta
            if (choice.delta?.tool_calls) {
                processChatCompletionToolCalls(choice.delta.tool_calls, state);
            }
        }
        if (choice.finish_reason) {
            state.finishReasons.push(choice.finish_reason);
        }
    }
}
/**
 * Processes a single OpenAI Responses API streaming event, updating the streaming state and span.
 *
 * @param streamEvent - The event to process (may be an error or unknown object).
 * @param state - The current streaming state to update.
 * @param recordOutputs - Whether to record output text fragments.
 * @param span - The span to update with error status if needed.
 */ function processResponsesApiEvent(streamEvent, state, recordOutputs, span) {
    if (!(streamEvent && typeof streamEvent === 'object')) {
        state.eventTypes.push('unknown:non-object');
        return;
    }
    if (streamEvent instanceof Error) {
        span.setStatus({
            code: spanstatus.SPAN_STATUS_ERROR,
            message: 'internal_error'
        });
        exports$1.captureException(streamEvent, {
            mechanism: {
                handled: false
            }
        });
        return;
    }
    if (!('type' in streamEvent)) return;
    const event = streamEvent;
    if (!constants.RESPONSE_EVENT_TYPES.includes(event.type)) {
        state.eventTypes.push(event.type);
        return;
    }
    // Handle output text delta
    if (recordOutputs) {
        // Handle tool call events for Responses API
        if (event.type === 'response.output_item.done' && 'item' in event) {
            state.responsesApiToolCalls.push(event.item);
        }
        if (event.type === 'response.output_text.delta' && 'delta' in event && event.delta) {
            state.responseTexts.push(event.delta);
            return;
        }
    }
    if ('response' in event) {
        const { response } = event;
        state.responseId = response.id ?? state.responseId;
        state.responseModel = response.model ?? state.responseModel;
        state.responseTimestamp = response.created_at ?? state.responseTimestamp;
        if (response.usage) {
            // For stream responses, the input tokens remain constant across all events in the stream.
            // Output tokens, however, are only finalized in the last event.
            // Since we can't guarantee that the last event will include usage data or even be a typed event,
            // we update the output token values on every event that includes them.
            // This ensures that output token usage is always set, even if the final event lacks it.
            state.promptTokens = response.usage.input_tokens;
            state.completionTokens = response.usage.output_tokens;
            state.totalTokens = response.usage.total_tokens;
        }
        if (response.status) {
            state.finishReasons.push(response.status);
        }
        if (recordOutputs && response.output_text) {
            state.responseTexts.push(response.output_text);
        }
    }
}
/**
 * Instruments a stream of OpenAI events, updating the provided span with relevant attributes and
 * optionally recording output text. This function yields each event from the input stream as it is processed.
 *
 * @template T - The type of events in the stream.
 * @param stream - The async iterable stream of events to instrument.
 * @param span - The span to add attributes to and to finish at the end of the stream.
 * @param recordOutputs - Whether to record output text fragments in the span.
 * @returns An async generator yielding each event from the input stream.
 */ async function* instrumentStream(stream, span, recordOutputs) {
    const state = {
        eventTypes: [],
        responseTexts: [],
        finishReasons: [],
        responseId: '',
        responseModel: '',
        responseTimestamp: 0,
        promptTokens: undefined,
        completionTokens: undefined,
        totalTokens: undefined,
        chatCompletionToolCalls: {},
        responsesApiToolCalls: []
    };
    try {
        for await (const event of stream){
            if (utils.isChatCompletionChunk(event)) {
                processChatCompletionChunk(event, state, recordOutputs);
            } else if (utils.isResponsesApiStreamEvent(event)) {
                processResponsesApiEvent(event, state, recordOutputs, span);
            }
            yield event;
        }
    } finally{
        utils.setCommonResponseAttributes(span, state.responseId, state.responseModel, state.responseTimestamp);
        utils.setTokenUsageAttributes(span, state.promptTokens, state.completionTokens, state.totalTokens);
        span.setAttributes({
            [genAiAttributes.GEN_AI_RESPONSE_STREAMING_ATTRIBUTE]: true
        });
        if (state.finishReasons.length) {
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE]: JSON.stringify(state.finishReasons)
            });
        }
        if (recordOutputs && state.responseTexts.length) {
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: state.responseTexts.join('')
            });
        }
        // Set tool calls attribute if any were accumulated
        const chatCompletionToolCallsArray = Object.values(state.chatCompletionToolCalls);
        const allToolCalls = [
            ...chatCompletionToolCallsArray,
            ...state.responsesApiToolCalls
        ];
        if (allToolCalls.length > 0) {
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]: JSON.stringify(allToolCalls)
            });
        }
        span.end();
    }
}
exports.instrumentStream = instrumentStream; //# sourceMappingURL=streaming.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const genAiAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/gen-ai-attributes.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/constants.js [app-ssr] (ecmascript)");
const streaming = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/streaming.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/utils.js [app-ssr] (ecmascript)");
/**
 * Extract request attributes from method arguments
 */ function extractRequestAttributes(args, methodPath) {
    const attributes = {
        [genAiAttributes.GEN_AI_SYSTEM_ATTRIBUTE]: 'openai',
        [genAiAttributes.GEN_AI_OPERATION_NAME_ATTRIBUTE]: utils.getOperationName(methodPath)
    };
    // Chat completion API accepts web_search_options and tools as parameters
    // we append web search options to the available tools to capture all tool calls
    if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
        const params = args[0];
        const tools = Array.isArray(params.tools) ? params.tools : [];
        const hasWebSearchOptions = params.web_search_options && typeof params.web_search_options === 'object';
        const webSearchOptions = hasWebSearchOptions ? [
            {
                type: 'web_search_options',
                ...params.web_search_options
            }
        ] : [];
        const availableTools = [
            ...tools,
            ...webSearchOptions
        ];
        if (availableTools.length > 0) {
            attributes[genAiAttributes.GEN_AI_REQUEST_AVAILABLE_TOOLS_ATTRIBUTE] = JSON.stringify(availableTools);
        }
    }
    if (args.length > 0 && typeof args[0] === 'object' && args[0] !== null) {
        const params = args[0];
        attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = params.model ?? 'unknown';
        if ('temperature' in params) attributes[genAiAttributes.GEN_AI_REQUEST_TEMPERATURE_ATTRIBUTE] = params.temperature;
        if ('top_p' in params) attributes[genAiAttributes.GEN_AI_REQUEST_TOP_P_ATTRIBUTE] = params.top_p;
        if ('frequency_penalty' in params) attributes[genAiAttributes.GEN_AI_REQUEST_FREQUENCY_PENALTY_ATTRIBUTE] = params.frequency_penalty;
        if ('presence_penalty' in params) attributes[genAiAttributes.GEN_AI_REQUEST_PRESENCE_PENALTY_ATTRIBUTE] = params.presence_penalty;
        if ('stream' in params) attributes[genAiAttributes.GEN_AI_REQUEST_STREAM_ATTRIBUTE] = params.stream;
    } else {
        attributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] = 'unknown';
    }
    return attributes;
}
/**
 * Add attributes for Chat Completion responses
 */ function addChatCompletionAttributes(span, response, recordOutputs) {
    utils.setCommonResponseAttributes(span, response.id, response.model, response.created);
    if (response.usage) {
        utils.setTokenUsageAttributes(span, response.usage.prompt_tokens, response.usage.completion_tokens, response.usage.total_tokens);
    }
    if (Array.isArray(response.choices)) {
        const finishReasons = response.choices.map((choice)=>choice.finish_reason).filter((reason)=>reason !== null);
        if (finishReasons.length > 0) {
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE]: JSON.stringify(finishReasons)
            });
        }
        // Extract tool calls from all choices (only if recordOutputs is true)
        if (recordOutputs) {
            const toolCalls = response.choices.map((choice)=>choice.message?.tool_calls).filter((calls)=>Array.isArray(calls) && calls.length > 0).flat();
            if (toolCalls.length > 0) {
                span.setAttributes({
                    [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]: JSON.stringify(toolCalls)
                });
            }
        }
    }
}
/**
 * Add attributes for Responses API responses
 */ function addResponsesApiAttributes(span, response, recordOutputs) {
    utils.setCommonResponseAttributes(span, response.id, response.model, response.created_at);
    if (response.status) {
        span.setAttributes({
            [genAiAttributes.GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE]: JSON.stringify([
                response.status
            ])
        });
    }
    if (response.usage) {
        utils.setTokenUsageAttributes(span, response.usage.input_tokens, response.usage.output_tokens, response.usage.total_tokens);
    }
    // Extract function calls from output (only if recordOutputs is true)
    if (recordOutputs) {
        const responseWithOutput = response;
        if (Array.isArray(responseWithOutput.output) && responseWithOutput.output.length > 0) {
            // Filter for function_call type objects in the output array
            const functionCalls = responseWithOutput.output.filter((item)=>typeof item === 'object' && item !== null && item.type === 'function_call');
            if (functionCalls.length > 0) {
                span.setAttributes({
                    [genAiAttributes.GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE]: JSON.stringify(functionCalls)
                });
            }
        }
    }
}
/**
 * Add response attributes to spans
 * This currently supports both Chat Completion and Responses API responses
 */ function addResponseAttributes(span, result, recordOutputs) {
    if (!result || typeof result !== 'object') return;
    const response = result;
    if (utils.isChatCompletionResponse(response)) {
        addChatCompletionAttributes(span, response, recordOutputs);
        if (recordOutputs && response.choices?.length) {
            const responseTexts = response.choices.map((choice)=>choice.message?.content || '');
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: JSON.stringify(responseTexts)
            });
        }
    } else if (utils.isResponsesApiResponse(response)) {
        addResponsesApiAttributes(span, response, recordOutputs);
        if (recordOutputs && response.output_text) {
            span.setAttributes({
                [genAiAttributes.GEN_AI_RESPONSE_TEXT_ATTRIBUTE]: response.output_text
            });
        }
    }
}
// Extract and record AI request inputs, if present. This is intentionally separate from response attributes.
function addRequestAttributes(span, params) {
    if ('messages' in params) {
        span.setAttributes({
            [genAiAttributes.GEN_AI_REQUEST_MESSAGES_ATTRIBUTE]: JSON.stringify(params.messages)
        });
    }
    if ('input' in params) {
        span.setAttributes({
            [genAiAttributes.GEN_AI_REQUEST_MESSAGES_ATTRIBUTE]: JSON.stringify(params.input)
        });
    }
}
function getOptionsFromIntegration() {
    const scope = currentScopes.getCurrentScope();
    const client = scope.getClient();
    const integration = client?.getIntegrationByName(constants.OPENAI_INTEGRATION_NAME);
    const shouldRecordInputsAndOutputs = integration ? Boolean(client?.getOptions().sendDefaultPii) : false;
    return {
        recordInputs: integration?.options?.recordInputs ?? shouldRecordInputsAndOutputs,
        recordOutputs: integration?.options?.recordOutputs ?? shouldRecordInputsAndOutputs
    };
}
/**
 * Instrument a method with Sentry spans
 * Following Sentry AI Agents Manual Instrumentation conventions
 * @see https://docs.sentry.io/platforms/javascript/guides/node/tracing/instrumentation/ai-agents-module/#manual-instrumentation
 */ function instrumentMethod(originalMethod, methodPath, context, options) {
    return async function instrumentedMethod(...args) {
        const finalOptions = options || getOptionsFromIntegration();
        const requestAttributes = extractRequestAttributes(args, methodPath);
        const model = requestAttributes[genAiAttributes.GEN_AI_REQUEST_MODEL_ATTRIBUTE] || 'unknown';
        const operationName = utils.getOperationName(methodPath);
        const params = args[0];
        const isStreamRequested = params && typeof params === 'object' && params.stream === true;
        if (isStreamRequested) {
            // For streaming responses, use manual span management to properly handle the async generator lifecycle
            return trace.startSpanManual({
                name: `${operationName} ${model} stream-response`,
                op: utils.getSpanOperation(methodPath),
                attributes: requestAttributes
            }, async (span)=>{
                try {
                    if (finalOptions.recordInputs && args[0] && typeof args[0] === 'object') {
                        addRequestAttributes(span, args[0]);
                    }
                    const result = await originalMethod.apply(context, args);
                    return streaming.instrumentStream(result, span, finalOptions.recordOutputs ?? false);
                } catch (error) {
                    // For streaming requests that fail before stream creation, we still want to record
                    // them as streaming requests but end the span gracefully
                    span.setStatus({
                        code: spanstatus.SPAN_STATUS_ERROR,
                        message: 'internal_error'
                    });
                    exports$1.captureException(error, {
                        mechanism: {
                            handled: false
                        }
                    });
                    span.end();
                    throw error;
                }
            });
        } else {
            //  Non-streaming responses
            return trace.startSpan({
                name: `${operationName} ${model}`,
                op: utils.getSpanOperation(methodPath),
                attributes: requestAttributes
            }, async (span)=>{
                try {
                    if (finalOptions.recordInputs && args[0] && typeof args[0] === 'object') {
                        addRequestAttributes(span, args[0]);
                    }
                    const result = await originalMethod.apply(context, args);
                    addResponseAttributes(span, result, finalOptions.recordOutputs);
                    return result;
                } catch (error) {
                    exports$1.captureException(error);
                    throw error;
                }
            });
        }
    };
}
/**
 * Create a deep proxy for OpenAI client instrumentation
 */ function createDeepProxy(target, currentPath = '', options) {
    return new Proxy(target, {
        get (obj, prop) {
            const value = obj[prop];
            const methodPath = utils.buildMethodPath(currentPath, String(prop));
            if (typeof value === 'function' && utils.shouldInstrument(methodPath)) {
                return instrumentMethod(value, methodPath, obj, options);
            }
            if (typeof value === 'function') {
                // Bind non-instrumented functions to preserve the original `this` context,
                // which is required for accessing private class fields (e.g. #baseURL) in OpenAI SDK v5.
                return value.bind(obj);
            }
            if (value && typeof value === 'object') {
                return createDeepProxy(value, methodPath, options);
            }
            return value;
        }
    });
}
/**
 * Instrument an OpenAI client with Sentry tracing
 * Can be used across Node.js, Cloudflare Workers, and Vercel Edge
 */ function instrumentOpenAiClient(client, options) {
    return createDeepProxy(client, '', options);
}
exports.instrumentOpenAiClient = instrumentOpenAiClient; //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/breadcrumb-log-level.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Determine a breadcrumb's log level (only `warning` or `error`) based on an HTTP status code.
 */ function getBreadcrumbLogLevelFromHttpStatusCode(statusCode) {
    // NOTE: undefined defaults to 'info' in Sentry
    if (statusCode === undefined) {
        return undefined;
    } else if (statusCode >= 400 && statusCode < 500) {
        return 'warning';
    } else if (statusCode >= 500) {
        return 'error';
    } else {
        return undefined;
    }
}
exports.getBreadcrumbLogLevelFromHttpStatusCode = getBreadcrumbLogLevelFromHttpStatusCode; //# sourceMappingURL=breadcrumb-log-level.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * An error emitted by Sentry SDKs and related utilities.
 * @deprecated This class is no longer used and will be removed in a future version. Use `Error` instead.
 */ class SentryError extends Error {
    constructor(message, logLevel = 'warn'){
        super(message);
        this.message = message;
        this.logLevel = logLevel;
    }
}
exports.SentryError = SentryError; //# sourceMappingURL=error.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/supports.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/debug-build.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const WINDOW = worldwide.GLOBAL_OBJ;
/**
 * Tells whether current environment supports ErrorEvent objects
 * {@link supportsErrorEvent}.
 *
 * @returns Answer to the given question.
 */ function supportsErrorEvent() {
    try {
        new ErrorEvent('');
        return true;
    } catch  {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMError objects
 * {@link supportsDOMError}.
 *
 * @returns Answer to the given question.
 */ function supportsDOMError() {
    try {
        // Chrome: VM89:1 Uncaught TypeError: Failed to construct 'DOMError':
        // 1 argument required, but only 0 present.
        // @ts-expect-error It really needs 1 argument, not 0.
        new DOMError('');
        return true;
    } catch  {
        return false;
    }
}
/**
 * Tells whether current environment supports DOMException objects
 * {@link supportsDOMException}.
 *
 * @returns Answer to the given question.
 */ function supportsDOMException() {
    try {
        new DOMException('');
        return true;
    } catch  {
        return false;
    }
}
/**
 * Tells whether current environment supports History API
 * {@link supportsHistory}.
 *
 * @returns Answer to the given question.
 */ function supportsHistory() {
    return 'history' in WINDOW && !!WINDOW.history;
}
/**
 * Tells whether current environment supports Fetch API
 * {@link supportsFetch}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ const supportsFetch = _isFetchSupported;
function _isFetchSupported() {
    if (!('fetch' in WINDOW)) {
        return false;
    }
    try {
        new Headers();
        new Request('http://www.example.com');
        new Response();
        return true;
    } catch  {
        return false;
    }
}
/**
 * isNative checks if the given function is a native implementation
 */ // eslint-disable-next-line @typescript-eslint/ban-types
function isNativeFunction(func) {
    return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
/**
 * Tells whether current environment supports Fetch API natively
 * {@link supportsNativeFetch}.
 *
 * @returns true if `window.fetch` is natively implemented, false otherwise
 */ function supportsNativeFetch() {
    if (typeof EdgeRuntime === 'string') {
        return true;
    }
    if (!_isFetchSupported()) {
        return false;
    }
    // Fast path to avoid DOM I/O
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (isNativeFunction(WINDOW.fetch)) {
        return true;
    }
    // window.fetch is implemented, but is polyfilled or already wrapped (e.g: by a chrome extension)
    // so create a "pure" iframe to see if that has native fetch
    let result = false;
    const doc = WINDOW.document;
    // eslint-disable-next-line deprecation/deprecation
    if (doc && typeof doc.createElement === 'function') {
        try {
            const sandbox = doc.createElement('iframe');
            sandbox.hidden = true;
            doc.head.appendChild(sandbox);
            if (sandbox.contentWindow?.fetch) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                result = isNativeFunction(sandbox.contentWindow.fetch);
            }
            doc.head.removeChild(sandbox);
        } catch (err) {
            debugBuild.DEBUG_BUILD && debugLogger.debug.warn('Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ', err);
        }
    }
    return result;
}
/**
 * Tells whether current environment supports ReportingObserver API
 * {@link supportsReportingObserver}.
 *
 * @returns Answer to the given question.
 */ function supportsReportingObserver() {
    return 'ReportingObserver' in WINDOW;
}
/**
 * Tells whether current environment supports Referrer Policy API
 * {@link supportsReferrerPolicy}.
 *
 * @returns Answer to the given question.
 * @deprecated This is no longer used and will be removed in a future major version.
 */ function supportsReferrerPolicy() {
    // Despite all stars in the sky saying that Edge supports old draft syntax, aka 'never', 'always', 'origin' and 'default'
    // (see https://caniuse.com/#feat=referrer-policy),
    // it doesn't. And it throws an exception instead of ignoring this parameter...
    // REF: https://github.com/getsentry/raven-js/issues/1233
    if (!_isFetchSupported()) {
        return false;
    }
    try {
        new Request('_', {
            referrerPolicy: 'origin'
        });
        return true;
    } catch  {
        return false;
    }
}
exports.isNativeFunction = isNativeFunction;
exports.supportsDOMError = supportsDOMError;
exports.supportsDOMException = supportsDOMException;
exports.supportsErrorEvent = supportsErrorEvent;
exports.supportsFetch = supportsFetch;
exports.supportsHistory = supportsHistory;
exports.supportsNativeFetch = supportsNativeFetch;
exports.supportsReferrerPolicy = supportsReferrerPolicy;
exports.supportsReportingObserver = supportsReportingObserver; //# sourceMappingURL=supports.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/fetch.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const supports = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/supports.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)");
/**
 * Add an instrumentation handler for when a fetch request happens.
 * The handler function is called once when the request starts and once when it ends,
 * which can be identified by checking if it has an `endTimestamp`.
 *
 * Use at your own risk, this might break without changelog notice, only used internally.
 * @hidden
 */ function addFetchInstrumentationHandler(handler, skipNativeFetchCheck) {
    const type = 'fetch';
    handlers.addHandler(type, handler);
    handlers.maybeInstrument(type, ()=>instrumentFetch(undefined, skipNativeFetchCheck));
}
/**
 * Add an instrumentation handler for long-lived fetch requests, like consuming server-sent events (SSE) via fetch.
 * The handler will resolve the request body and emit the actual `endTimestamp`, so that the
 * span can be updated accordingly.
 *
 * Only used internally
 * @hidden
 */ function addFetchEndInstrumentationHandler(handler) {
    const type = 'fetch-body-resolved';
    handlers.addHandler(type, handler);
    handlers.maybeInstrument(type, ()=>instrumentFetch(streamHandler));
}
function instrumentFetch(onFetchResolved, skipNativeFetchCheck = false) {
    if (skipNativeFetchCheck && !supports.supportsNativeFetch()) {
        return;
    }
    object.fill(worldwide.GLOBAL_OBJ, 'fetch', function(originalFetch) {
        return function(...args) {
            // We capture the error right here and not in the Promise error callback because Safari (and probably other
            // browsers too) will wipe the stack trace up to this point, only leaving us with this file which is useless.
            // NOTE: If you are a Sentry user, and you are seeing this stack frame,
            //       it means the error, that was caused by your fetch call did not
            //       have a stack trace, so the SDK backfilled the stack trace so
            //       you can see which fetch call failed.
            const virtualError = new Error();
            const { method, url } = parseFetchArgs(args);
            const handlerData = {
                args,
                fetchData: {
                    method,
                    url
                },
                startTimestamp: time.timestampInSeconds() * 1000,
                // // Adding the error to be able to fingerprint the failed fetch event in HttpClient instrumentation
                virtualError,
                headers: getHeadersFromFetchArgs(args)
            };
            // if there is no callback, fetch is instrumented directly
            if (!onFetchResolved) {
                handlers.triggerHandlers('fetch', {
                    ...handlerData
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            return originalFetch.apply(worldwide.GLOBAL_OBJ, args).then(async (response)=>{
                if (onFetchResolved) {
                    onFetchResolved(response);
                } else {
                    handlers.triggerHandlers('fetch', {
                        ...handlerData,
                        endTimestamp: time.timestampInSeconds() * 1000,
                        response
                    });
                }
                return response;
            }, (error)=>{
                handlers.triggerHandlers('fetch', {
                    ...handlerData,
                    endTimestamp: time.timestampInSeconds() * 1000,
                    error
                });
                if (is.isError(error) && error.stack === undefined) {
                    // NOTE: If you are a Sentry user, and you are seeing this stack frame,
                    //       it means the error, that was caused by your fetch call did not
                    //       have a stack trace, so the SDK backfilled the stack trace so
                    //       you can see which fetch call failed.
                    error.stack = virtualError.stack;
                    object.addNonEnumerableProperty(error, 'framesToPop', 1);
                }
                // We enhance the not-so-helpful "Failed to fetch" error messages with the host
                // Possible messages we handle here:
                // * "Failed to fetch" (chromium)
                // * "Load failed" (webkit)
                // * "NetworkError when attempting to fetch resource." (firefox)
                if (error instanceof TypeError && (error.message === 'Failed to fetch' || error.message === 'Load failed' || error.message === 'NetworkError when attempting to fetch resource.')) {
                    try {
                        const url = new URL(handlerData.fetchData.url);
                        error.message = `${error.message} (${url.host})`;
                    } catch  {
                    // ignore it if errors happen here
                    }
                }
                // NOTE: If you are a Sentry user, and you are seeing this stack frame,
                //       it means the sentry.javascript SDK caught an error invoking your application code.
                //       This is expected behavior and NOT indicative of a bug with sentry.javascript.
                throw error;
            });
        };
    });
}
async function resolveResponse(res, onFinishedResolving) {
    if (res?.body) {
        const body = res.body;
        const responseReader = body.getReader();
        // Define a maximum duration after which we just cancel
        const maxFetchDurationTimeout = setTimeout(()=>{
            body.cancel().then(null, ()=>{
            // noop
            });
        }, 90 * 1000);
        let readingActive = true;
        while(readingActive){
            let chunkTimeout;
            try {
                // abort reading if read op takes more than 5s
                chunkTimeout = setTimeout(()=>{
                    body.cancel().then(null, ()=>{
                    // noop on error
                    });
                }, 5000);
                // This .read() call will reject/throw when we abort due to timeouts through `body.cancel()`
                const { done } = await responseReader.read();
                clearTimeout(chunkTimeout);
                if (done) {
                    onFinishedResolving();
                    readingActive = false;
                }
            } catch  {
                readingActive = false;
            } finally{
                clearTimeout(chunkTimeout);
            }
        }
        clearTimeout(maxFetchDurationTimeout);
        responseReader.releaseLock();
        body.cancel().then(null, ()=>{
        // noop on error
        });
    }
}
function streamHandler(response) {
    // clone response for awaiting stream
    let clonedResponseForResolving;
    try {
        clonedResponseForResolving = response.clone();
    } catch  {
        return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    resolveResponse(clonedResponseForResolving, ()=>{
        handlers.triggerHandlers('fetch-body-resolved', {
            endTimestamp: time.timestampInSeconds() * 1000,
            response
        });
    });
}
function hasProp(obj, prop) {
    return !!obj && typeof obj === 'object' && !!obj[prop];
}
function getUrlFromResource(resource) {
    if (typeof resource === 'string') {
        return resource;
    }
    if (!resource) {
        return '';
    }
    if (hasProp(resource, 'url')) {
        return resource.url;
    }
    if (resource.toString) {
        return resource.toString();
    }
    return '';
}
/**
 * Parses the fetch arguments to find the used Http method and the url of the request.
 * Exported for tests only.
 */ function parseFetchArgs(fetchArgs) {
    if (fetchArgs.length === 0) {
        return {
            method: 'GET',
            url: ''
        };
    }
    if (fetchArgs.length === 2) {
        const [url, options] = fetchArgs;
        return {
            url: getUrlFromResource(url),
            method: hasProp(options, 'method') ? String(options.method).toUpperCase() : 'GET'
        };
    }
    const arg = fetchArgs[0];
    return {
        url: getUrlFromResource(arg),
        method: hasProp(arg, 'method') ? String(arg.method).toUpperCase() : 'GET'
    };
}
function getHeadersFromFetchArgs(fetchArgs) {
    const [requestArgument, optionsArgument] = fetchArgs;
    try {
        if (typeof optionsArgument === 'object' && optionsArgument !== null && 'headers' in optionsArgument && optionsArgument.headers) {
            return new Headers(optionsArgument.headers);
        }
        if (is.isRequest(requestArgument)) {
            return new Headers(requestArgument.headers);
        }
    } catch  {
    // noop
    }
    return;
}
exports.addFetchEndInstrumentationHandler = addFetchEndInstrumentationHandler;
exports.addFetchInstrumentationHandler = addFetchInstrumentationHandler;
exports.parseFetchArgs = parseFetchArgs; //# sourceMappingURL=fetch.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/env.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/*
 * This module exists for optimizations in the build process through rollup and terser.  We define some global
 * constants, which can be overridden during build. By guarding certain pieces of code with functions that return these
 * constants, we can control whether or not they appear in the final bundle. (Any code guarded by a false condition will
 * never run, and will hence be dropped during treeshaking.) The two primary uses for this are stripping out calls to
 * `debug` and preventing node-related code from appearing in browser bundles.
 *
 * Attention:
 * This file should not be used to define constants/flags that are intended to be used for tree-shaking conducted by
 * users. These flags should live in their respective packages, as we identified user tooling (specifically webpack)
 * having issues tree-shaking these constants across package boundaries.
 * An example for this is the __SENTRY_DEBUG__ constant. It is declared in each package individually because we want
 * users to be able to shake away expressions that it guards.
 */ /**
 * Figures out if we're building a browser bundle.
 *
 * @returns true if this is a browser bundle build.
 */ function isBrowserBundle() {
    return typeof __SENTRY_BROWSER_BUNDLE__ !== 'undefined' && !!__SENTRY_BROWSER_BUNDLE__;
}
/**
 * Get source of SDK.
 */ function getSDKSource() {
    // This comment is used to identify this line in the CDN bundle build step and replace this with "return 'cdn';"
    /* __SENTRY_SDK_SOURCE__ */ return 'npm';
}
exports.getSDKSource = getSDKSource;
exports.isBrowserBundle = isBrowserBundle; //# sourceMappingURL=env.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const env = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/env.js [app-ssr] (ecmascript)");
/**
 * NOTE: In order to avoid circular dependencies, if you add a function to this module and it needs to print something,
 * you must either a) use `console.log` rather than the `debug` singleton, or b) put your function elsewhere.
 */ /**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */ function isNodeEnv() {
    // explicitly check for browser bundles as those can be optimized statically
    // by terser/rollup.
    return !env.isBrowserBundle() && Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamicRequire(mod, request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return mod.require(request);
}
/**
 * Helper for dynamically loading module that should work with linked dependencies.
 * The problem is that we _should_ be using `require(require.resolve(moduleName, { paths: [cwd()] }))`
 * However it's _not possible_ to do that with Webpack, as it has to know all the dependencies during
 * build time. `require.resolve` is also not available in any other way, so we cannot create,
 * a fake helper like we do with `dynamicRequire`.
 *
 * We always prefer to use local package, thus the value is not returned early from each `try/catch` block.
 * That is to mimic the behavior of `require.resolve` exactly.
 *
 * @param moduleName module name to require
 * @param existingModule module to use for requiring
 * @returns possibly required module
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadModule(moduleName, existingModule = module) {
    let mod;
    try {
        mod = dynamicRequire(existingModule, moduleName);
    } catch  {
    // no-empty
    }
    if (!mod) {
        try {
            const { cwd } = dynamicRequire(existingModule, 'process');
            mod = dynamicRequire(existingModule, `${cwd()}/node_modules/${moduleName}`);
        } catch  {
        // no-empty
        }
    }
    return mod;
}
exports.isNodeEnv = isNodeEnv;
exports.loadModule = loadModule; //# sourceMappingURL=node.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/isBrowser.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const node = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/**
 * Returns true if we are in the browser.
 */ function isBrowser() {
    // eslint-disable-next-line no-restricted-globals
    return "undefined" !== 'undefined' && (!node.isNodeEnv() || isElectronNodeRenderer());
}
// Electron renderers with nodeIntegration enabled are detected as Node.js so we specifically test for them
function isElectronNodeRenderer() {
    const process = worldwide.GLOBAL_OBJ.process;
    return process?.type === 'renderer';
}
exports.isBrowser = isBrowser; //# sourceMappingURL=isBrowser.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node-stack-trace.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
/**
 * Does this filename look like it's part of the app code?
 */ function filenameIsInApp(filename, isNative = false) {
    const isInternal = isNative || filename && // It's not internal if it's an absolute linux path
    !filename.startsWith('/') && // It's not internal if it's an absolute windows path
    !filename.match(/^[A-Z]:/) && // It's not internal if the path is starting with a dot
    !filename.startsWith('.') && // It's not internal if the frame has a protocol. In node, this is usually the case if the file got pre-processed with a bundler like webpack
    !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//); // Schema from: https://stackoverflow.com/a/3641782
    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    return !isInternal && filename !== undefined && !filename.includes('node_modules/');
}
/** Node Stack line parser */ function node(getModule) {
    const FILENAME_MATCH = /^\s*[-]{4,}$/;
    const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
    const DATA_URI_MATCH = /at (?:async )?(.+?) \(data:(.*?),/;
    // eslint-disable-next-line complexity
    return (line)=>{
        const dataUriMatch = line.match(DATA_URI_MATCH);
        if (dataUriMatch) {
            return {
                filename: `<data:${dataUriMatch[2]}>`,
                function: dataUriMatch[1]
            };
        }
        const lineMatch = line.match(FULL_MATCH);
        if (lineMatch) {
            let object;
            let method;
            let functionName;
            let typeName;
            let methodName;
            if (lineMatch[1]) {
                functionName = lineMatch[1];
                let methodStart = functionName.lastIndexOf('.');
                if (functionName[methodStart - 1] === '.') {
                    methodStart--;
                }
                if (methodStart > 0) {
                    object = functionName.slice(0, methodStart);
                    method = functionName.slice(methodStart + 1);
                    const objectEnd = object.indexOf('.Module');
                    if (objectEnd > 0) {
                        functionName = functionName.slice(objectEnd + 1);
                        object = object.slice(0, objectEnd);
                    }
                }
                typeName = undefined;
            }
            if (method) {
                typeName = object;
                methodName = method;
            }
            if (method === '<anonymous>') {
                methodName = undefined;
                functionName = undefined;
            }
            if (functionName === undefined) {
                methodName = methodName || stacktrace.UNKNOWN_FUNCTION;
                functionName = typeName ? `${typeName}.${methodName}` : methodName;
            }
            let filename = lineMatch[2]?.startsWith('file://') ? lineMatch[2].slice(7) : lineMatch[2];
            const isNative = lineMatch[5] === 'native';
            // If it's a Windows path, trim the leading slash so that `/C:/foo` becomes `C:/foo`
            if (filename?.match(/\/[A-Z]:/)) {
                filename = filename.slice(1);
            }
            if (!filename && lineMatch[5] && !isNative) {
                filename = lineMatch[5];
            }
            return {
                filename: filename ? decodeURI(filename) : undefined,
                module: getModule ? getModule(filename) : undefined,
                function: functionName,
                lineno: _parseIntOrUndefined(lineMatch[3]),
                colno: _parseIntOrUndefined(lineMatch[4]),
                in_app: filenameIsInApp(filename || '', isNative)
            };
        }
        if (line.match(FILENAME_MATCH)) {
            return {
                filename: line
            };
        }
        return undefined;
    };
}
/**
 * Node.js stack line parser
 *
 * This is in @sentry/core so it can be used from the Electron SDK in the browser for when `nodeIntegration == true`.
 * This allows it to be used without referencing or importing any node specific code which causes bundlers to complain
 */ function nodeStackLineParser(getModule) {
    return [
        90,
        node(getModule)
    ];
}
function _parseIntOrUndefined(input) {
    return parseInt(input || '', 10) || undefined;
}
exports.filenameIsInApp = filenameIsInApp;
exports.node = node;
exports.nodeStackLineParser = nodeStackLineParser; //# sourceMappingURL=node-stack-trace.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/anr.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const nodeStackTrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node-stack-trace.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
/**
 * A node.js watchdog timer
 * @param pollInterval The interval that we expect to get polled at
 * @param anrThreshold The threshold for when we consider ANR
 * @param callback The callback to call for ANR
 * @returns An object with `poll` and `enabled` functions {@link WatchdogReturn}
 */ function watchdogTimer(createTimer, pollInterval, anrThreshold, callback) {
    const timer = createTimer();
    let triggered = false;
    let enabled = true;
    setInterval(()=>{
        const diffMs = timer.getTimeMs();
        if (triggered === false && diffMs > pollInterval + anrThreshold) {
            triggered = true;
            if (enabled) {
                callback();
            }
        }
        if (diffMs < pollInterval + anrThreshold) {
            triggered = false;
        }
    }, 20);
    return {
        poll: ()=>{
            timer.reset();
        },
        enabled: (state)=>{
            enabled = state;
        }
    };
}
// types copied from inspector.d.ts
/**
 * Converts Debugger.CallFrame to Sentry StackFrame
 */ function callFrameToStackFrame(frame, url, getModuleFromFilename) {
    const filename = url ? url.replace(/^file:\/\//, '') : undefined;
    // CallFrame row/col are 0 based, whereas StackFrame are 1 based
    const colno = frame.location.columnNumber ? frame.location.columnNumber + 1 : undefined;
    const lineno = frame.location.lineNumber ? frame.location.lineNumber + 1 : undefined;
    return {
        filename,
        module: getModuleFromFilename(filename),
        function: frame.functionName || stacktrace.UNKNOWN_FUNCTION,
        colno,
        lineno,
        in_app: filename ? nodeStackTrace.filenameIsInApp(filename) : undefined
    };
}
exports.callFrameToStackFrame = callFrameToStackFrame;
exports.watchdogTimer = watchdogTimer; //# sourceMappingURL=anr.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/lru.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/** A simple Least Recently Used map */ class LRUMap {
    constructor(_maxSize){
        this._maxSize = _maxSize;
        this._cache = new Map();
    }
    /** Get the current size of the cache */ get size() {
        return this._cache.size;
    }
    /** Get an entry or undefined if it was not in the cache. Re-inserts to update the recently used order */ get(key) {
        const value = this._cache.get(key);
        if (value === undefined) {
            return undefined;
        }
        // Remove and re-insert to update the order
        this._cache.delete(key);
        this._cache.set(key, value);
        return value;
    }
    /** Insert an entry and evict an older entry if we've reached maxSize */ set(key, value) {
        if (this._cache.size >= this._maxSize) {
            // keys() returns an iterator in insertion order so keys().next() gives us the oldest key
            this._cache.delete(this._cache.keys().next().value);
        }
        this._cache.set(key, value);
    }
    /** Remove an entry and return the entry if it was in the cache */ remove(key) {
        const value = this._cache.get(key);
        if (value) {
            this._cache.delete(key);
        }
        return value;
    }
    /** Clear all entries */ clear() {
        this._cache.clear();
    }
    /** Get all the keys */ keys() {
        return Array.from(this._cache.keys());
    }
    /** Get all the values */ values() {
        const values = [];
        this._cache.forEach((value)=>values.push(value));
        return values;
    }
}
exports.LRUMap = LRUMap; //# sourceMappingURL=lru.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercelWaitUntil.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
/**
 * Function that delays closing of a Vercel lambda until the provided promise is resolved.
 *
 * Vendored from https://www.npmjs.com/package/@vercel/functions
 */ function vercelWaitUntil(task) {
    const vercelRequestContextGlobal = // @ts-expect-error This is not typed
    worldwide.GLOBAL_OBJ[Symbol.for('@vercel/request-context')];
    const ctx = vercelRequestContextGlobal?.get?.();
    if (ctx?.waitUntil) {
        ctx.waitUntil(task);
    }
}
exports.vercelWaitUntil = vercelWaitUntil; //# sourceMappingURL=vercelWaitUntil.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/flushIfServerless.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const vercelWaitUntil = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercelWaitUntil.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
async function flushWithTimeout(timeout) {
    try {
        debugLogger.debug.log('Flushing events...');
        await exports$1.flush(timeout);
        debugLogger.debug.log('Done flushing events');
    } catch (e) {
        debugLogger.debug.log('Error while flushing events:\n', e);
    }
}
/**
 *  Flushes the event queue with a timeout in serverless environments to ensure that events are sent to Sentry before the
 *  serverless function execution ends.
 *
 * The function is async, but in environments that support a `waitUntil` mechanism, it will run synchronously.
 *
 * This function is aware of the following serverless platforms:
 * - Cloudflare: If a Cloudflare context is provided, it will use `ctx.waitUntil()` to flush events (keeps the `this` context of `ctx`).
 *               If a `cloudflareWaitUntil` function is provided, it will use that to flush events (looses the `this` context of `ctx`).
 * - Vercel: It detects the Vercel environment and uses Vercel's `waitUntil` function.
 * - Other Serverless (AWS Lambda, Google Cloud, etc.): It detects the environment via environment variables
 *   and uses a regular `await flush()`.
 *
 *  @internal This function is supposed for internal Sentry SDK usage only.
 *  @hidden
 */ async function flushIfServerless(params = {}) {
    const { timeout = 2000 } = params;
    if ('cloudflareWaitUntil' in params && typeof params?.cloudflareWaitUntil === 'function') {
        params.cloudflareWaitUntil(flushWithTimeout(timeout));
        return;
    }
    if ('cloudflareCtx' in params && typeof params.cloudflareCtx?.waitUntil === 'function') {
        params.cloudflareCtx.waitUntil(flushWithTimeout(timeout));
        return;
    }
    // @ts-expect-error This is not typed
    if (worldwide.GLOBAL_OBJ[Symbol.for('@vercel/request-context')]) {
        // Vercel has a waitUntil equivalent that works without execution context
        vercelWaitUntil.vercelWaitUntil(flushWithTimeout(timeout));
        return;
    }
    if (typeof process === 'undefined') {
        return;
    }
    const isServerless = !!process.env.FUNCTIONS_WORKER_RUNTIME || // Azure Functions
    !!process.env.LAMBDA_TASK_ROOT || // AWS Lambda
    !!process.env.K_SERVICE || // Google Cloud Run
    !!process.env.CF_PAGES || // Cloudflare Pages
    !!process.env.VERCEL || !!process.env.NETLIFY;
    if (isServerless) {
        // Use regular flush for environments without a generic waitUntil mechanism
        await flushWithTimeout(timeout);
    }
}
exports.flushIfServerless = flushIfServerless; //# sourceMappingURL=flushIfServerless.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/vendor/escapeStringForRegex.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
// Based on https://github.com/sindresorhus/escape-string-regexp but with modifications to:
//   a) reduce the size by skipping the runtime type - checking
//   b) ensure it gets down - compiled for old versions of Node(the published package only supports Node 14+).
//
// MIT License
//
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files(the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of
// the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
/**
 * Given a string, escape characters which have meaning in the regex grammar, such that the result is safe to feed to
 * `new RegExp()`.
 *
 * @param regexString The string to escape
 * @returns An version of the string with all special regex characters escaped
 */ function escapeStringForRegex(regexString) {
    // escape the hyphen separately so we can also replace it with a unicode literal hyphen, to avoid the problems
    // discussed in https://github.com/sindresorhus/escape-string-regexp/issues/20.
    return regexString.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}
exports.escapeStringForRegex = escapeStringForRegex; //# sourceMappingURL=escapeStringForRegex.js.map
}),
"[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const errors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/errors.js [app-ssr] (ecmascript)");
const utils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/utils.js [app-ssr] (ecmascript)");
const idleSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/idleSpan.js [app-ssr] (ecmascript)");
const sentrySpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentrySpan.js [app-ssr] (ecmascript)");
const sentryNonRecordingSpan = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sentryNonRecordingSpan.js [app-ssr] (ecmascript)");
const spanstatus = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/spanstatus.js [app-ssr] (ecmascript)");
const trace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/trace.js [app-ssr] (ecmascript)");
const dynamicSamplingContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/dynamicSamplingContext.js [app-ssr] (ecmascript)");
const measurement = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/measurement.js [app-ssr] (ecmascript)");
const sampling = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/sampling.js [app-ssr] (ecmascript)");
const logSpans = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/tracing/logSpans.js [app-ssr] (ecmascript)");
const semanticAttributes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/semanticAttributes.js [app-ssr] (ecmascript)");
const envelope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/envelope.js [app-ssr] (ecmascript)");
const exports$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/exports.js [app-ssr] (ecmascript)");
const currentScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/currentScopes.js [app-ssr] (ecmascript)");
const defaultScopes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/defaultScopes.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/asyncContext/index.js [app-ssr] (ecmascript)");
const carrier = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/carrier.js [app-ssr] (ecmascript)");
const session = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/session.js [app-ssr] (ecmascript)");
const scope = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/scope.js [app-ssr] (ecmascript)");
const eventProcessors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/eventProcessors.js [app-ssr] (ecmascript)");
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/api.js [app-ssr] (ecmascript)");
const client = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/client.js [app-ssr] (ecmascript)");
const serverRuntimeClient = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/server-runtime-client.js [app-ssr] (ecmascript)");
const sdk = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/sdk.js [app-ssr] (ecmascript)");
const base = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/base.js [app-ssr] (ecmascript)");
const offline = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/offline.js [app-ssr] (ecmascript)");
const multiplexed = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/transports/multiplexed.js [app-ssr] (ecmascript)");
const integration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integration.js [app-ssr] (ecmascript)");
const applyScopeDataToEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/applyScopeDataToEvent.js [app-ssr] (ecmascript)");
const prepareEvent = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/prepareEvent.js [app-ssr] (ecmascript)");
const checkin = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/checkin.js [app-ssr] (ecmascript)");
const hasSpansEnabled = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/hasSpansEnabled.js [app-ssr] (ecmascript)");
const isSentryRequestUrl = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/isSentryRequestUrl.js [app-ssr] (ecmascript)");
const handleCallbackErrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/handleCallbackErrors.js [app-ssr] (ecmascript)");
const parameterize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parameterize.js [app-ssr] (ecmascript)");
const ipAddress = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ipAddress.js [app-ssr] (ecmascript)");
const spanUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/spanUtils.js [app-ssr] (ecmascript)");
const parseSampleRate = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/parseSampleRate.js [app-ssr] (ecmascript)");
const sdkMetadata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/sdkMetadata.js [app-ssr] (ecmascript)");
const traceData = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/traceData.js [app-ssr] (ecmascript)");
const meta = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/meta.js [app-ssr] (ecmascript)");
const debounce = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debounce.js [app-ssr] (ecmascript)");
const request = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/request.js [app-ssr] (ecmascript)");
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/constants.js [app-ssr] (ecmascript)");
const breadcrumbs = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/breadcrumbs.js [app-ssr] (ecmascript)");
const functiontostring = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/functiontostring.js [app-ssr] (ecmascript)");
const eventFilters = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/eventFilters.js [app-ssr] (ecmascript)");
const linkederrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/linkederrors.js [app-ssr] (ecmascript)");
const metadata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/metadata.js [app-ssr] (ecmascript)");
const requestdata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/requestdata.js [app-ssr] (ecmascript)");
const captureconsole = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/captureconsole.js [app-ssr] (ecmascript)");
const dedupe = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/dedupe.js [app-ssr] (ecmascript)");
const extraerrordata = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/extraerrordata.js [app-ssr] (ecmascript)");
const rewriteframes = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/rewriteframes.js [app-ssr] (ecmascript)");
const supabase = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/supabase.js [app-ssr] (ecmascript)");
const zoderrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/zoderrors.js [app-ssr] (ecmascript)");
const thirdPartyErrorsFilter = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/third-party-errors-filter.js [app-ssr] (ecmascript)");
const console = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/console.js [app-ssr] (ecmascript)");
const featureFlagsIntegration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/featureFlags/featureFlagsIntegration.js [app-ssr] (ecmascript)");
const profiling = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/profiling.js [app-ssr] (ecmascript)");
const fetch = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/fetch.js [app-ssr] (ecmascript)");
const trpc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/trpc.js [app-ssr] (ecmascript)");
const index$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/integrations/mcp-server/index.js [app-ssr] (ecmascript)");
const feedback = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/feedback.js [app-ssr] (ecmascript)");
const exports$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/exports.js [app-ssr] (ecmascript)");
const consoleIntegration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/logs/console-integration.js [app-ssr] (ecmascript)");
const vercelAi = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercel-ai.js [app-ssr] (ecmascript)");
const index$2 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/index.js [app-ssr] (ecmascript)");
const constants$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/openai/constants.js [app-ssr] (ecmascript)");
const featureFlags = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/featureFlags.js [app-ssr] (ecmascript)");
const aggregateErrors = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/aggregate-errors.js [app-ssr] (ecmascript)");
const breadcrumbLogLevel = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/breadcrumb-log-level.js [app-ssr] (ecmascript)");
const browser = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/browser.js [app-ssr] (ecmascript)");
const dsn = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/dsn.js [app-ssr] (ecmascript)");
const error = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/error.js [app-ssr] (ecmascript)");
const worldwide = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/worldwide.js [app-ssr] (ecmascript)");
const console$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/console.js [app-ssr] (ecmascript)");
const fetch$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/fetch.js [app-ssr] (ecmascript)");
const globalError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalError.js [app-ssr] (ecmascript)");
const globalUnhandledRejection = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/globalUnhandledRejection.js [app-ssr] (ecmascript)");
const handlers = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/instrument/handlers.js [app-ssr] (ecmascript)");
const is = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/is.js [app-ssr] (ecmascript)");
const isBrowser = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/isBrowser.js [app-ssr] (ecmascript)");
const debugLogger = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-logger.js [app-ssr] (ecmascript)");
const misc = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/misc.js [app-ssr] (ecmascript)");
const node = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node.js [app-ssr] (ecmascript)");
const normalize = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/normalize.js [app-ssr] (ecmascript)");
const object = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/object.js [app-ssr] (ecmascript)");
const path = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/path.js [app-ssr] (ecmascript)");
const promisebuffer = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/promisebuffer.js [app-ssr] (ecmascript)");
const severity = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/severity.js [app-ssr] (ecmascript)");
const stacktrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/stacktrace.js [app-ssr] (ecmascript)");
const nodeStackTrace = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/node-stack-trace.js [app-ssr] (ecmascript)");
const string = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/string.js [app-ssr] (ecmascript)");
const supports = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/supports.js [app-ssr] (ecmascript)");
const syncpromise = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/syncpromise.js [app-ssr] (ecmascript)");
const time = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/time.js [app-ssr] (ecmascript)");
const tracing = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/tracing.js [app-ssr] (ecmascript)");
const env = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/env.js [app-ssr] (ecmascript)");
const envelope$1 = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/envelope.js [app-ssr] (ecmascript)");
const clientreport = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/clientreport.js [app-ssr] (ecmascript)");
const ratelimit = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/ratelimit.js [app-ssr] (ecmascript)");
const baggage = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/baggage.js [app-ssr] (ecmascript)");
const url = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/url.js [app-ssr] (ecmascript)");
const eventbuilder = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/eventbuilder.js [app-ssr] (ecmascript)");
const anr = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/anr.js [app-ssr] (ecmascript)");
const lru = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/lru.js [app-ssr] (ecmascript)");
const propagationContext = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/propagationContext.js [app-ssr] (ecmascript)");
const vercelWaitUntil = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/vercelWaitUntil.js [app-ssr] (ecmascript)");
const flushIfServerless = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/flushIfServerless.js [app-ssr] (ecmascript)");
const version = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/version.js [app-ssr] (ecmascript)");
const debugIds = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/utils/debug-ids.js [app-ssr] (ecmascript)");
const escapeStringForRegex = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/vendor/escapeStringForRegex.js [app-ssr] (ecmascript)");
exports.registerSpanErrorInstrumentation = errors.registerSpanErrorInstrumentation;
exports.getCapturedScopesOnSpan = utils.getCapturedScopesOnSpan;
exports.setCapturedScopesOnSpan = utils.setCapturedScopesOnSpan;
exports.TRACING_DEFAULTS = idleSpan.TRACING_DEFAULTS;
exports.startIdleSpan = idleSpan.startIdleSpan;
exports.SentrySpan = sentrySpan.SentrySpan;
exports.SentryNonRecordingSpan = sentryNonRecordingSpan.SentryNonRecordingSpan;
exports.SPAN_STATUS_ERROR = spanstatus.SPAN_STATUS_ERROR;
exports.SPAN_STATUS_OK = spanstatus.SPAN_STATUS_OK;
exports.SPAN_STATUS_UNSET = spanstatus.SPAN_STATUS_UNSET;
exports.getSpanStatusFromHttpCode = spanstatus.getSpanStatusFromHttpCode;
exports.setHttpStatus = spanstatus.setHttpStatus;
exports.continueTrace = trace.continueTrace;
exports.startInactiveSpan = trace.startInactiveSpan;
exports.startNewTrace = trace.startNewTrace;
exports.startSpan = trace.startSpan;
exports.startSpanManual = trace.startSpanManual;
exports.suppressTracing = trace.suppressTracing;
exports.withActiveSpan = trace.withActiveSpan;
exports.getDynamicSamplingContextFromClient = dynamicSamplingContext.getDynamicSamplingContextFromClient;
exports.getDynamicSamplingContextFromScope = dynamicSamplingContext.getDynamicSamplingContextFromScope;
exports.getDynamicSamplingContextFromSpan = dynamicSamplingContext.getDynamicSamplingContextFromSpan;
exports.spanToBaggageHeader = dynamicSamplingContext.spanToBaggageHeader;
exports.setMeasurement = measurement.setMeasurement;
exports.timedEventsToMeasurements = measurement.timedEventsToMeasurements;
exports.sampleSpan = sampling.sampleSpan;
exports.logSpanEnd = logSpans.logSpanEnd;
exports.logSpanStart = logSpans.logSpanStart;
exports.SEMANTIC_ATTRIBUTE_CACHE_HIT = semanticAttributes.SEMANTIC_ATTRIBUTE_CACHE_HIT;
exports.SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE = semanticAttributes.SEMANTIC_ATTRIBUTE_CACHE_ITEM_SIZE;
exports.SEMANTIC_ATTRIBUTE_CACHE_KEY = semanticAttributes.SEMANTIC_ATTRIBUTE_CACHE_KEY;
exports.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME = semanticAttributes.SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME;
exports.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD = semanticAttributes.SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD;
exports.SEMANTIC_ATTRIBUTE_PROFILE_ID = semanticAttributes.SEMANTIC_ATTRIBUTE_PROFILE_ID;
exports.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME;
exports.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_IDLE_SPAN_FINISH_REASON;
exports.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT;
exports.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_OP = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_OP;
exports.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN;
exports.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE;
exports.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = semanticAttributes.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE;
exports.SEMANTIC_ATTRIBUTE_URL_FULL = semanticAttributes.SEMANTIC_ATTRIBUTE_URL_FULL;
exports.SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE = semanticAttributes.SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE;
exports.createEventEnvelope = envelope.createEventEnvelope;
exports.createSessionEnvelope = envelope.createSessionEnvelope;
exports.createSpanEnvelope = envelope.createSpanEnvelope;
exports.addEventProcessor = exports$1.addEventProcessor;
exports.captureCheckIn = exports$1.captureCheckIn;
exports.captureEvent = exports$1.captureEvent;
exports.captureException = exports$1.captureException;
exports.captureMessage = exports$1.captureMessage;
exports.captureSession = exports$1.captureSession;
exports.close = exports$1.close;
exports.endSession = exports$1.endSession;
exports.flush = exports$1.flush;
exports.isEnabled = exports$1.isEnabled;
exports.isInitialized = exports$1.isInitialized;
exports.lastEventId = exports$1.lastEventId;
exports.setContext = exports$1.setContext;
exports.setExtra = exports$1.setExtra;
exports.setExtras = exports$1.setExtras;
exports.setTag = exports$1.setTag;
exports.setTags = exports$1.setTags;
exports.setUser = exports$1.setUser;
exports.startSession = exports$1.startSession;
exports.withMonitor = exports$1.withMonitor;
exports.getClient = currentScopes.getClient;
exports.getCurrentScope = currentScopes.getCurrentScope;
exports.getGlobalScope = currentScopes.getGlobalScope;
exports.getIsolationScope = currentScopes.getIsolationScope;
exports.getTraceContextFromScope = currentScopes.getTraceContextFromScope;
exports.withIsolationScope = currentScopes.withIsolationScope;
exports.withScope = currentScopes.withScope;
exports.getDefaultCurrentScope = defaultScopes.getDefaultCurrentScope;
exports.getDefaultIsolationScope = defaultScopes.getDefaultIsolationScope;
exports.setAsyncContextStrategy = index.setAsyncContextStrategy;
exports.getGlobalSingleton = carrier.getGlobalSingleton;
exports.getMainCarrier = carrier.getMainCarrier;
exports.closeSession = session.closeSession;
exports.makeSession = session.makeSession;
exports.updateSession = session.updateSession;
exports.Scope = scope.Scope;
exports.notifyEventProcessors = eventProcessors.notifyEventProcessors;
exports.getEnvelopeEndpointWithUrlEncodedAuth = api.getEnvelopeEndpointWithUrlEncodedAuth;
exports.getReportDialogEndpoint = api.getReportDialogEndpoint;
exports.Client = client.Client;
exports.ServerRuntimeClient = serverRuntimeClient.ServerRuntimeClient;
exports.initAndBind = sdk.initAndBind;
exports.setCurrentClient = sdk.setCurrentClient;
exports.createTransport = base.createTransport;
exports.makeOfflineTransport = offline.makeOfflineTransport;
exports.makeMultiplexedTransport = multiplexed.makeMultiplexedTransport;
exports.addIntegration = integration.addIntegration;
exports.defineIntegration = integration.defineIntegration;
exports.getIntegrationsToSetup = integration.getIntegrationsToSetup;
exports.applyScopeDataToEvent = applyScopeDataToEvent.applyScopeDataToEvent;
exports.mergeScopeData = applyScopeDataToEvent.mergeScopeData;
exports.prepareEvent = prepareEvent.prepareEvent;
exports.createCheckInEnvelope = checkin.createCheckInEnvelope;
exports.hasSpansEnabled = hasSpansEnabled.hasSpansEnabled;
exports.isSentryRequestUrl = isSentryRequestUrl.isSentryRequestUrl;
exports.handleCallbackErrors = handleCallbackErrors.handleCallbackErrors;
exports.fmt = parameterize.fmt;
exports.parameterize = parameterize.parameterize;
exports.addAutoIpAddressToSession = ipAddress.addAutoIpAddressToSession;
exports.addAutoIpAddressToUser = ipAddress.addAutoIpAddressToUser;
exports.addChildSpanToSpan = spanUtils.addChildSpanToSpan;
exports.convertSpanLinksForEnvelope = spanUtils.convertSpanLinksForEnvelope;
exports.getActiveSpan = spanUtils.getActiveSpan;
exports.getRootSpan = spanUtils.getRootSpan;
exports.getSpanDescendants = spanUtils.getSpanDescendants;
exports.getStatusMessage = spanUtils.getStatusMessage;
exports.spanIsSampled = spanUtils.spanIsSampled;
exports.spanTimeInputToSeconds = spanUtils.spanTimeInputToSeconds;
exports.spanToJSON = spanUtils.spanToJSON;
exports.spanToTraceContext = spanUtils.spanToTraceContext;
exports.spanToTraceHeader = spanUtils.spanToTraceHeader;
exports.updateSpanName = spanUtils.updateSpanName;
exports.parseSampleRate = parseSampleRate.parseSampleRate;
exports.applySdkMetadata = sdkMetadata.applySdkMetadata;
exports.getTraceData = traceData.getTraceData;
exports.getTraceMetaTags = meta.getTraceMetaTags;
exports.debounce = debounce.debounce;
exports.extractQueryParamsFromUrl = request.extractQueryParamsFromUrl;
exports.headersToDict = request.headersToDict;
exports.httpRequestToRequestData = request.httpRequestToRequestData;
exports.winterCGHeadersToDict = request.winterCGHeadersToDict;
exports.winterCGRequestToRequestData = request.winterCGRequestToRequestData;
exports.DEFAULT_ENVIRONMENT = constants.DEFAULT_ENVIRONMENT;
exports.addBreadcrumb = breadcrumbs.addBreadcrumb;
exports.functionToStringIntegration = functiontostring.functionToStringIntegration;
exports.eventFiltersIntegration = eventFilters.eventFiltersIntegration;
exports.inboundFiltersIntegration = eventFilters.inboundFiltersIntegration;
exports.linkedErrorsIntegration = linkederrors.linkedErrorsIntegration;
exports.moduleMetadataIntegration = metadata.moduleMetadataIntegration;
exports.requestDataIntegration = requestdata.requestDataIntegration;
exports.captureConsoleIntegration = captureconsole.captureConsoleIntegration;
exports.dedupeIntegration = dedupe.dedupeIntegration;
exports.extraErrorDataIntegration = extraerrordata.extraErrorDataIntegration;
exports.rewriteFramesIntegration = rewriteframes.rewriteFramesIntegration;
exports.instrumentSupabaseClient = supabase.instrumentSupabaseClient;
exports.supabaseIntegration = supabase.supabaseIntegration;
exports.zodErrorsIntegration = zoderrors.zodErrorsIntegration;
exports.thirdPartyErrorFilterIntegration = thirdPartyErrorsFilter.thirdPartyErrorFilterIntegration;
exports.consoleIntegration = console.consoleIntegration;
exports.featureFlagsIntegration = featureFlagsIntegration.featureFlagsIntegration;
exports.profiler = profiling.profiler;
exports.instrumentFetchRequest = fetch.instrumentFetchRequest;
exports.trpcMiddleware = trpc.trpcMiddleware;
exports.wrapMcpServerWithSentry = index$1.wrapMcpServerWithSentry;
exports.captureFeedback = feedback.captureFeedback;
exports._INTERNAL_captureLog = exports$2._INTERNAL_captureLog;
exports._INTERNAL_captureSerializedLog = exports$2._INTERNAL_captureSerializedLog;
exports._INTERNAL_flushLogsBuffer = exports$2._INTERNAL_flushLogsBuffer;
exports.consoleLoggingIntegration = consoleIntegration.consoleLoggingIntegration;
exports.addVercelAiProcessors = vercelAi.addVercelAiProcessors;
exports.instrumentOpenAiClient = index$2.instrumentOpenAiClient;
exports.OPENAI_INTEGRATION_NAME = constants$1.OPENAI_INTEGRATION_NAME;
exports._INTERNAL_FLAG_BUFFER_SIZE = featureFlags._INTERNAL_FLAG_BUFFER_SIZE;
exports._INTERNAL_MAX_FLAGS_PER_SPAN = featureFlags._INTERNAL_MAX_FLAGS_PER_SPAN;
exports._INTERNAL_addFeatureFlagToActiveSpan = featureFlags._INTERNAL_addFeatureFlagToActiveSpan;
exports._INTERNAL_copyFlagsFromScopeToEvent = featureFlags._INTERNAL_copyFlagsFromScopeToEvent;
exports._INTERNAL_insertFlagToScope = featureFlags._INTERNAL_insertFlagToScope;
exports.applyAggregateErrorsToEvent = aggregateErrors.applyAggregateErrorsToEvent;
exports.getBreadcrumbLogLevelFromHttpStatusCode = breadcrumbLogLevel.getBreadcrumbLogLevelFromHttpStatusCode;
exports.getComponentName = browser.getComponentName;
exports.getLocationHref = browser.getLocationHref;
exports.htmlTreeAsString = browser.htmlTreeAsString;
exports.dsnFromString = dsn.dsnFromString;
exports.dsnToString = dsn.dsnToString;
exports.makeDsn = dsn.makeDsn;
exports.SentryError = error.SentryError;
exports.GLOBAL_OBJ = worldwide.GLOBAL_OBJ;
exports.addConsoleInstrumentationHandler = console$1.addConsoleInstrumentationHandler;
exports.addFetchEndInstrumentationHandler = fetch$1.addFetchEndInstrumentationHandler;
exports.addFetchInstrumentationHandler = fetch$1.addFetchInstrumentationHandler;
exports.addGlobalErrorInstrumentationHandler = globalError.addGlobalErrorInstrumentationHandler;
exports.addGlobalUnhandledRejectionInstrumentationHandler = globalUnhandledRejection.addGlobalUnhandledRejectionInstrumentationHandler;
exports.addHandler = handlers.addHandler;
exports.maybeInstrument = handlers.maybeInstrument;
exports.resetInstrumentationHandlers = handlers.resetInstrumentationHandlers;
exports.triggerHandlers = handlers.triggerHandlers;
exports.isDOMError = is.isDOMError;
exports.isDOMException = is.isDOMException;
exports.isElement = is.isElement;
exports.isError = is.isError;
exports.isErrorEvent = is.isErrorEvent;
exports.isEvent = is.isEvent;
exports.isInstanceOf = is.isInstanceOf;
exports.isParameterizedString = is.isParameterizedString;
exports.isPlainObject = is.isPlainObject;
exports.isPrimitive = is.isPrimitive;
exports.isRegExp = is.isRegExp;
exports.isString = is.isString;
exports.isSyntheticEvent = is.isSyntheticEvent;
exports.isThenable = is.isThenable;
exports.isVueViewModel = is.isVueViewModel;
exports.isBrowser = isBrowser.isBrowser;
exports.CONSOLE_LEVELS = debugLogger.CONSOLE_LEVELS;
exports.consoleSandbox = debugLogger.consoleSandbox;
exports.debug = debugLogger.debug;
exports.originalConsoleMethods = debugLogger.originalConsoleMethods;
exports.addContextToFrame = misc.addContextToFrame;
exports.addExceptionMechanism = misc.addExceptionMechanism;
exports.addExceptionTypeValue = misc.addExceptionTypeValue;
exports.checkOrSetAlreadyCaught = misc.checkOrSetAlreadyCaught;
exports.getEventDescription = misc.getEventDescription;
exports.parseSemver = misc.parseSemver;
exports.uuid4 = misc.uuid4;
exports.isNodeEnv = node.isNodeEnv;
exports.loadModule = node.loadModule;
exports.normalize = normalize.normalize;
exports.normalizeToSize = normalize.normalizeToSize;
exports.normalizeUrlToBase = normalize.normalizeUrlToBase;
exports.addNonEnumerableProperty = object.addNonEnumerableProperty;
exports.convertToPlainObject = object.convertToPlainObject;
exports.dropUndefinedKeys = object.dropUndefinedKeys;
exports.extractExceptionKeysForMessage = object.extractExceptionKeysForMessage;
exports.fill = object.fill;
exports.getOriginalFunction = object.getOriginalFunction;
exports.markFunctionWrapped = object.markFunctionWrapped;
exports.objectify = object.objectify;
exports.basename = path.basename;
exports.dirname = path.dirname;
exports.isAbsolute = path.isAbsolute;
exports.join = path.join;
exports.normalizePath = path.normalizePath;
exports.relative = path.relative;
exports.resolve = path.resolve;
exports.SENTRY_BUFFER_FULL_ERROR = promisebuffer.SENTRY_BUFFER_FULL_ERROR;
exports.makePromiseBuffer = promisebuffer.makePromiseBuffer;
exports.severityLevelFromString = severity.severityLevelFromString;
exports.UNKNOWN_FUNCTION = stacktrace.UNKNOWN_FUNCTION;
exports.createStackParser = stacktrace.createStackParser;
exports.getFramesFromEvent = stacktrace.getFramesFromEvent;
exports.getFunctionName = stacktrace.getFunctionName;
exports.stackParserFromStackParserOptions = stacktrace.stackParserFromStackParserOptions;
exports.stripSentryFramesAndReverse = stacktrace.stripSentryFramesAndReverse;
exports.filenameIsInApp = nodeStackTrace.filenameIsInApp;
exports.node = nodeStackTrace.node;
exports.nodeStackLineParser = nodeStackTrace.nodeStackLineParser;
exports.isMatchingPattern = string.isMatchingPattern;
exports.safeJoin = string.safeJoin;
exports.snipLine = string.snipLine;
exports.stringMatchesSomePattern = string.stringMatchesSomePattern;
exports.truncate = string.truncate;
exports.isNativeFunction = supports.isNativeFunction;
exports.supportsDOMError = supports.supportsDOMError;
exports.supportsDOMException = supports.supportsDOMException;
exports.supportsErrorEvent = supports.supportsErrorEvent;
exports.supportsFetch = supports.supportsFetch;
exports.supportsHistory = supports.supportsHistory;
exports.supportsNativeFetch = supports.supportsNativeFetch;
exports.supportsReferrerPolicy = supports.supportsReferrerPolicy;
exports.supportsReportingObserver = supports.supportsReportingObserver;
exports.SyncPromise = syncpromise.SyncPromise;
exports.rejectedSyncPromise = syncpromise.rejectedSyncPromise;
exports.resolvedSyncPromise = syncpromise.resolvedSyncPromise;
exports.browserPerformanceTimeOrigin = time.browserPerformanceTimeOrigin;
exports.dateTimestampInSeconds = time.dateTimestampInSeconds;
exports.timestampInSeconds = time.timestampInSeconds;
exports.TRACEPARENT_REGEXP = tracing.TRACEPARENT_REGEXP;
exports.extractTraceparentData = tracing.extractTraceparentData;
exports.generateSentryTraceHeader = tracing.generateSentryTraceHeader;
exports.propagationContextFromHeaders = tracing.propagationContextFromHeaders;
exports.shouldContinueTrace = tracing.shouldContinueTrace;
exports.getSDKSource = env.getSDKSource;
exports.isBrowserBundle = env.isBrowserBundle;
exports.addItemToEnvelope = envelope$1.addItemToEnvelope;
exports.createAttachmentEnvelopeItem = envelope$1.createAttachmentEnvelopeItem;
exports.createEnvelope = envelope$1.createEnvelope;
exports.createEventEnvelopeHeaders = envelope$1.createEventEnvelopeHeaders;
exports.createSpanEnvelopeItem = envelope$1.createSpanEnvelopeItem;
exports.envelopeContainsItemType = envelope$1.envelopeContainsItemType;
exports.envelopeItemTypeToDataCategory = envelope$1.envelopeItemTypeToDataCategory;
exports.forEachEnvelopeItem = envelope$1.forEachEnvelopeItem;
exports.getSdkMetadataForEnvelopeHeader = envelope$1.getSdkMetadataForEnvelopeHeader;
exports.parseEnvelope = envelope$1.parseEnvelope;
exports.serializeEnvelope = envelope$1.serializeEnvelope;
exports.createClientReportEnvelope = clientreport.createClientReportEnvelope;
exports.DEFAULT_RETRY_AFTER = ratelimit.DEFAULT_RETRY_AFTER;
exports.disabledUntil = ratelimit.disabledUntil;
exports.isRateLimited = ratelimit.isRateLimited;
exports.parseRetryAfterHeader = ratelimit.parseRetryAfterHeader;
exports.updateRateLimits = ratelimit.updateRateLimits;
exports.MAX_BAGGAGE_STRING_LENGTH = baggage.MAX_BAGGAGE_STRING_LENGTH;
exports.SENTRY_BAGGAGE_KEY_PREFIX = baggage.SENTRY_BAGGAGE_KEY_PREFIX;
exports.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = baggage.SENTRY_BAGGAGE_KEY_PREFIX_REGEX;
exports.baggageHeaderToDynamicSamplingContext = baggage.baggageHeaderToDynamicSamplingContext;
exports.dynamicSamplingContextToSentryBaggageHeader = baggage.dynamicSamplingContextToSentryBaggageHeader;
exports.objectToBaggageHeader = baggage.objectToBaggageHeader;
exports.parseBaggageHeader = baggage.parseBaggageHeader;
exports.getHttpSpanDetailsFromUrlObject = url.getHttpSpanDetailsFromUrlObject;
exports.getSanitizedUrlString = url.getSanitizedUrlString;
exports.getSanitizedUrlStringFromUrlObject = url.getSanitizedUrlStringFromUrlObject;
exports.isURLObjectRelative = url.isURLObjectRelative;
exports.parseStringToURLObject = url.parseStringToURLObject;
exports.parseUrl = url.parseUrl;
exports.stripUrlQueryAndFragment = url.stripUrlQueryAndFragment;
exports.eventFromMessage = eventbuilder.eventFromMessage;
exports.eventFromUnknownInput = eventbuilder.eventFromUnknownInput;
exports.exceptionFromError = eventbuilder.exceptionFromError;
exports.parseStackFrames = eventbuilder.parseStackFrames;
exports.callFrameToStackFrame = anr.callFrameToStackFrame;
exports.watchdogTimer = anr.watchdogTimer;
exports.LRUMap = lru.LRUMap;
exports.generateSpanId = propagationContext.generateSpanId;
exports.generateTraceId = propagationContext.generateTraceId;
exports.vercelWaitUntil = vercelWaitUntil.vercelWaitUntil;
exports.flushIfServerless = flushIfServerless.flushIfServerless;
exports.SDK_VERSION = version.SDK_VERSION;
exports.getDebugImagesForResources = debugIds.getDebugImagesForResources;
exports.getFilenameToDebugIdMap = debugIds.getFilenameToDebugIdMap;
exports.escapeStringForRegex = escapeStringForRegex.escapeStringForRegex; //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=59109_%40sentry_core_build_cjs_2ef2472d._.js.map