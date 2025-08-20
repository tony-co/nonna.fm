module.exports = [
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/manifest/createRouteManifest.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
let manifestCache = null;
let lastAppDirPath = null;
let lastIncludeRouteGroups = undefined;
function isPageFile(filename) {
    return filename === 'page.tsx' || filename === 'page.jsx' || filename === 'page.ts' || filename === 'page.js';
}
function isRouteGroup(name) {
    return name.startsWith('(') && name.endsWith(')');
}
function normalizeRoutePath(routePath) {
    // Remove route group segments from the path
    return routePath.replace(/\/\([^)]+\)/g, '');
}
function getDynamicRouteSegment(name) {
    if (name.startsWith('[[...') && name.endsWith(']]')) {
        // Optional catchall: [[...param]]
        const paramName = name.slice(5, -2); // Remove [[... and ]]
        return `:${paramName}*?`; // Mark with ? as optional
    } else if (name.startsWith('[...') && name.endsWith(']')) {
        // Required catchall: [...param]
        const paramName = name.slice(4, -1); // Remove [... and ]
        return `:${paramName}*`;
    }
    // Regular dynamic: [param]
    return `:${name.slice(1, -1)}`;
}
function buildRegexForDynamicRoute(routePath) {
    const segments = routePath.split('/').filter(Boolean);
    const regexSegments = [];
    const paramNames = [];
    let hasOptionalCatchall = false;
    for (const segment of segments){
        if (segment.startsWith(':')) {
            const paramName = segment.substring(1);
            if (paramName.endsWith('*?')) {
                // Optional catchall: matches zero or more segments
                const cleanParamName = paramName.slice(0, -2);
                paramNames.push(cleanParamName);
                // Handling this special case in pattern construction below
                hasOptionalCatchall = true;
            } else if (paramName.endsWith('*')) {
                // Required catchall: matches one or more segments
                const cleanParamName = paramName.slice(0, -1);
                paramNames.push(cleanParamName);
                regexSegments.push('(.+)');
            } else {
                // Regular dynamic segment
                paramNames.push(paramName);
                regexSegments.push('([^/]+)');
            }
        } else {
            // Static segment - escape regex special characters including route group parentheses
            regexSegments.push(segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
    }
    let pattern;
    if (hasOptionalCatchall) {
        // For optional catchall, make the trailing slash and segments optional
        // This allows matching both /catchall and /catchall/anything
        const staticParts = regexSegments.join('/');
        pattern = `^/${staticParts}(?:/(.*))?$`;
    } else {
        pattern = `^/${regexSegments.join('/')}$`;
    }
    return {
        regex: pattern,
        paramNames
    };
}
function scanAppDirectory(dir, basePath = '', includeRouteGroups = false) {
    const dynamicRoutes = [];
    const staticRoutes = [];
    try {
        const entries = fs.readdirSync(dir, {
            withFileTypes: true
        });
        const pageFile = entries.some((entry)=>isPageFile(entry.name));
        if (pageFile) {
            // Conditionally normalize the path based on includeRouteGroups option
            const routePath = includeRouteGroups ? basePath || '/' : normalizeRoutePath(basePath || '/');
            const isDynamic = routePath.includes(':');
            if (isDynamic) {
                const { regex, paramNames } = buildRegexForDynamicRoute(routePath);
                dynamicRoutes.push({
                    path: routePath,
                    regex,
                    paramNames
                });
            } else {
                staticRoutes.push({
                    path: routePath
                });
            }
        }
        for (const entry of entries){
            if (entry.isDirectory()) {
                const fullPath = path.join(dir, entry.name);
                let routeSegment;
                const isDynamic = entry.name.startsWith('[') && entry.name.endsWith(']');
                const isRouteGroupDir = isRouteGroup(entry.name);
                if (isRouteGroupDir) {
                    if (includeRouteGroups) {
                        routeSegment = entry.name;
                    } else {
                        routeSegment = '';
                    }
                } else if (isDynamic) {
                    routeSegment = getDynamicRouteSegment(entry.name);
                } else {
                    routeSegment = entry.name;
                }
                const newBasePath = routeSegment ? `${basePath}/${routeSegment}` : basePath;
                const subRoutes = scanAppDirectory(fullPath, newBasePath, includeRouteGroups);
                dynamicRoutes.push(...subRoutes.dynamicRoutes);
                staticRoutes.push(...subRoutes.staticRoutes);
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Error building route manifest:', error);
    }
    return {
        dynamicRoutes,
        staticRoutes
    };
}
/**
 * Returns a route manifest for the given app directory
 */ function createRouteManifest(options) {
    let targetDir;
    {
        const projectDir = process.cwd();
        const maybeAppDirPath = path.join(projectDir, 'app');
        const maybeSrcAppDirPath = path.join(projectDir, 'src', 'app');
        if (fs.existsSync(maybeAppDirPath) && fs.lstatSync(maybeAppDirPath).isDirectory()) {
            targetDir = maybeAppDirPath;
        } else if (fs.existsSync(maybeSrcAppDirPath) && fs.lstatSync(maybeSrcAppDirPath).isDirectory()) {
            targetDir = maybeSrcAppDirPath;
        }
    }
    if (!targetDir) {
        return {
            dynamicRoutes: [],
            staticRoutes: []
        };
    }
    // Check if we can use cached version
    if (manifestCache && lastAppDirPath === targetDir && lastIncludeRouteGroups === options?.includeRouteGroups) {
        return manifestCache;
    }
    const { dynamicRoutes, staticRoutes } = scanAppDirectory(targetDir, '', options?.includeRouteGroups);
    const manifest = {
        dynamicRoutes,
        staticRoutes
    };
    // set cache
    manifestCache = manifest;
    lastAppDirPath = targetDir;
    lastIncludeRouteGroups = options?.includeRouteGroups;
    return manifest;
}
exports.createRouteManifest = createRouteManifest; //# sourceMappingURL=createRouteManifest.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack/generateValueInjectionRules.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
/**
 * Generate the value injection rules for client and server in turbopack config.
 */ function generateValueInjectionRules({ routeManifest, nextJsVersion }) {
    const rules = [];
    const isomorphicValues = {};
    let clientValues = {};
    let serverValues = {};
    if (nextJsVersion) {
        // This is used to determine version-based dev-symbolication behavior
        isomorphicValues._sentryNextJsVersion = nextJsVersion;
    }
    if (routeManifest) {
        clientValues._sentryRouteManifest = JSON.stringify(routeManifest);
    }
    if (Object.keys(isomorphicValues).length > 0) {
        clientValues = {
            ...clientValues,
            ...isomorphicValues
        };
        serverValues = {
            ...serverValues,
            ...isomorphicValues
        };
    }
    // Client value injection
    if (Object.keys(clientValues).length > 0) {
        rules.push({
            matcher: '**/instrumentation-client.*',
            rule: {
                loaders: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack"), '..', 'loaders', 'valueInjectionLoader.js'),
                        options: {
                            values: clientValues
                        }
                    }
                ]
            }
        });
    }
    // Server value injection
    if (Object.keys(serverValues).length > 0) {
        rules.push({
            matcher: '**/instrumentation.*',
            rule: {
                loaders: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack"), '..', 'loaders', 'valueInjectionLoader.js'),
                        options: {
                            values: serverValues
                        }
                    }
                ]
            }
        });
    }
    return rules;
}
exports.generateValueInjectionRules = generateValueInjectionRules; //# sourceMappingURL=generateValueInjectionRules.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack/constructTurbopackConfig.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const chalk = __turbopack_context__.r("[project]/node_modules/.pnpm/chalk@3.0.0/node_modules/chalk/source/index.js [app-ssr] (ecmascript)");
const generateValueInjectionRules = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack/generateValueInjectionRules.js [app-ssr] (ecmascript)");
/**
 * Construct a Turbopack config object from a Next.js config object and a Turbopack options object.
 *
 * @param userNextConfig - The Next.js config object.
 * @param turbopackOptions - The Turbopack options object.
 * @returns The Turbopack config object.
 */ function constructTurbopackConfig({ userNextConfig, routeManifest, nextJsVersion }) {
    const newConfig = {
        ...userNextConfig.turbopack
    };
    const valueInjectionRules = generateValueInjectionRules.generateValueInjectionRules({
        routeManifest,
        nextJsVersion
    });
    for (const { matcher, rule } of valueInjectionRules){
        newConfig.rules = safelyAddTurbopackRule(newConfig.rules, {
            matcher,
            rule
        });
    }
    return newConfig;
}
/**
 * Safely add a Turbopack rule to the existing rules.
 *
 * @param existingRules - The existing rules.
 * @param matcher - The matcher for the rule.
 * @param rule - The rule to add.
 * @returns The updated rules object.
 */ function safelyAddTurbopackRule(existingRules, { matcher, rule }) {
    if (!existingRules) {
        return {
            [matcher]: rule
        };
    }
    // If the rule already exists, we don't want to mess with it.
    if (existingRules[matcher]) {
        core.debug.log(`${chalk.cyan('info')} - Turbopack rule already exists for ${matcher}. Please remove it from your Next.js config in order for Sentry to work properly.`);
        return existingRules;
    }
    return {
        ...existingRules,
        [matcher]: rule
    };
}
exports.constructTurbopackConfig = constructTurbopackConfig;
exports.safelyAddTurbopackRule = safelyAddTurbopackRule; //# sourceMappingURL=constructTurbopackConfig.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/util.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const resolve = __turbopack_context__.r("[project]/node_modules/.pnpm/resolve@1.22.8/node_modules/resolve/index.js [app-ssr] (ecmascript)");
/**
 * Returns the version of Next.js installed in the project, or undefined if it cannot be determined.
 */ function getNextjsVersion() {
    const nextjsPackageJsonPath = resolveNextjsPackageJson();
    if (nextjsPackageJsonPath) {
        try {
            const nextjsPackageJson = JSON.parse(fs.readFileSync(nextjsPackageJsonPath, {
                encoding: 'utf-8'
            }));
            return nextjsPackageJson.version;
        } catch  {
        // noop
        }
    }
    return undefined;
}
function resolveNextjsPackageJson() {
    try {
        return resolve.sync('next/package.json', {
            basedir: process.cwd()
        });
    } catch  {
        return undefined;
    }
}
exports.getNextjsVersion = getNextjsVersion; //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/webpackPluginOptions.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
/**
 * Combine default and user-provided SentryWebpackPlugin options, accounting for whether we're building server files or
 * client files.
 */ function getWebpackPluginOptions(buildContext, sentryBuildOptions, releaseName) {
    const { isServer, config: userNextConfig, dir, nextRuntime } = buildContext;
    const prefixInsert = !isServer ? 'Client' : nextRuntime === 'edge' ? 'Edge' : 'Node.js';
    // We need to convert paths to posix because Glob patterns use `\` to escape
    // glob characters. This clashes with Windows path separators.
    // See: https://www.npmjs.com/package/glob
    const projectDir = dir.replace(/\\/g, '/');
    // `.next` is the default directory
    const distDir = userNextConfig.distDir?.replace(/\\/g, '/') ?? '.next';
    const distDirAbsPath = path.posix.join(projectDir, distDir);
    const sourcemapUploadAssets = [];
    const sourcemapUploadIgnore = [];
    if (isServer) {
        sourcemapUploadAssets.push(path.posix.join(distDirAbsPath, 'server', '**'), path.posix.join(distDirAbsPath, 'serverless', '**'));
    } else {
        if (sentryBuildOptions.widenClientFileUpload) {
            sourcemapUploadAssets.push(path.posix.join(distDirAbsPath, 'static', 'chunks', '**'));
        } else {
            sourcemapUploadAssets.push(path.posix.join(distDirAbsPath, 'static', 'chunks', 'pages', '**'), path.posix.join(distDirAbsPath, 'static', 'chunks', 'app', '**'));
        }
        // We want to include main-* files if widenClientFileUpload is true as they have proven to be useful
        if (!sentryBuildOptions.widenClientFileUpload) {
            sourcemapUploadIgnore.push(path.posix.join(distDirAbsPath, 'static', 'chunks', 'main-*'));
        }
        // Always ignore framework, polyfills, and webpack files
        sourcemapUploadIgnore.push(path.posix.join(distDirAbsPath, 'static', 'chunks', 'framework-*'), path.posix.join(distDirAbsPath, 'static', 'chunks', 'framework.*'), path.posix.join(distDirAbsPath, 'static', 'chunks', 'polyfills-*'), path.posix.join(distDirAbsPath, 'static', 'chunks', 'webpack-*'));
    }
    return {
        authToken: sentryBuildOptions.authToken,
        headers: sentryBuildOptions.headers,
        org: sentryBuildOptions.org,
        project: sentryBuildOptions.project,
        telemetry: sentryBuildOptions.telemetry,
        debug: sentryBuildOptions.debug,
        errorHandler: sentryBuildOptions.errorHandler,
        reactComponentAnnotation: {
            ...sentryBuildOptions.reactComponentAnnotation,
            ...sentryBuildOptions.unstable_sentryWebpackPluginOptions?.reactComponentAnnotation
        },
        silent: sentryBuildOptions.silent,
        url: sentryBuildOptions.sentryUrl,
        sourcemaps: {
            disable: sentryBuildOptions.sourcemaps?.disable,
            rewriteSources (source) {
                if (source.startsWith('webpack://_N_E/')) {
                    return source.replace('webpack://_N_E/', '');
                } else if (source.startsWith('webpack://')) {
                    return source.replace('webpack://', '');
                } else {
                    return source;
                }
            },
            assets: sentryBuildOptions.sourcemaps?.assets ?? sourcemapUploadAssets,
            ignore: sentryBuildOptions.sourcemaps?.ignore ?? sourcemapUploadIgnore,
            filesToDeleteAfterUpload: sentryBuildOptions.sourcemaps?.deleteSourcemapsAfterUpload ? [
                // We only care to delete client bundle source maps because they would be the ones being served.
                // Removing the server source maps crashes Vercel builds for (thus far) unknown reasons:
                // https://github.com/getsentry/sentry-javascript/issues/13099
                path.posix.join(distDirAbsPath, 'static', '**', '*.js.map'),
                path.posix.join(distDirAbsPath, 'static', '**', '*.mjs.map'),
                path.posix.join(distDirAbsPath, 'static', '**', '*.cjs.map')
            ] : undefined,
            ...sentryBuildOptions.unstable_sentryWebpackPluginOptions?.sourcemaps
        },
        release: releaseName !== undefined ? {
            inject: false,
            name: releaseName,
            create: sentryBuildOptions.release?.create,
            finalize: sentryBuildOptions.release?.finalize,
            dist: sentryBuildOptions.release?.dist,
            vcsRemote: sentryBuildOptions.release?.vcsRemote,
            setCommits: sentryBuildOptions.release?.setCommits,
            deploy: sentryBuildOptions.release?.deploy,
            ...sentryBuildOptions.unstable_sentryWebpackPluginOptions?.release
        } : {
            inject: false,
            create: false,
            finalize: false
        },
        bundleSizeOptimizations: {
            ...sentryBuildOptions.bundleSizeOptimizations
        },
        _metaOptions: {
            loggerPrefixOverride: `[@sentry/nextjs - ${prefixInsert}]`,
            telemetry: {
                metaFramework: 'nextjs'
            }
        },
        ...sentryBuildOptions.unstable_sentryWebpackPluginOptions
    };
}
exports.getWebpackPluginOptions = getWebpackPluginOptions; //# sourceMappingURL=webpackPluginOptions.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/webpack.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const chalk = __turbopack_context__.r("[project]/node_modules/.pnpm/chalk@3.0.0/node_modules/chalk/source/index.js [app-ssr] (ecmascript)");
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const resolve = __turbopack_context__.r("[project]/node_modules/.pnpm/resolve@1.22.8/node_modules/resolve/index.js [app-ssr] (ecmascript)");
const util = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/util.js [app-ssr] (ecmascript)");
const webpackPluginOptions = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/webpackPluginOptions.js [app-ssr] (ecmascript)");
/* eslint-disable complexity */ /* eslint-disable max-lines */ // Next.js runs webpack 3 times, once for the client, the server, and for edge. Because we don't want to print certain
// warnings 3 times, we keep track of them here.
let showedMissingGlobalErrorWarningMsg = false;
/**
 * Construct the function which will be used as the nextjs config's `webpack` value.
 *
 * Sets:
 *   - `devtool`, to ensure high-quality sourcemaps are generated
 *   - `entry`, to include user's sentry config files (where `Sentry.init` is called) in the build
 *   - `plugins`, to add SentryWebpackPlugin
 *
 * @param userNextConfig The user's existing nextjs config, as passed to `withSentryConfig`
 * @param userSentryOptions The user's SentryWebpackPlugin config, as passed to `withSentryConfig`
 * @returns The function to set as the nextjs config's `webpack` value
 */ function constructWebpackConfigFunction(userNextConfig = {}, userSentryOptions = {}, releaseName, routeManifest, nextJsVersion) {
    // Will be called by nextjs and passed its default webpack configuration and context data about the build (whether
    // we're building server or client, whether we're in dev, what version of webpack we're using, etc). Note that
    // `incomingConfig` and `buildContext` are referred to as `config` and `options` in the nextjs docs.
    return function newWebpackFunction(incomingConfig, buildContext) {
        const { isServer, dev: isDev, dir: projectDir } = buildContext;
        const runtime = isServer ? buildContext.nextRuntime === 'edge' ? 'edge' : 'server' : 'client';
        // Default page extensions per https://github.com/vercel/next.js/blob/f1dbc9260d48c7995f6c52f8fbcc65f08e627992/packages/next/server/config-shared.ts#L161
        const pageExtensions = userNextConfig.pageExtensions || [
            'tsx',
            'ts',
            'jsx',
            'js'
        ];
        const dotPrefixedPageExtensions = pageExtensions.map((ext)=>`.${ext}`);
        const pageExtensionRegex = pageExtensions.map(core.escapeStringForRegex).join('|');
        // We add `.ts` and `.js` back in because `pageExtensions` might not be relevant to the instrumentation file
        // e.g. user's setting `.mdx`. In that case we still want to default look up
        // `instrumentation.ts` and `instrumentation.js`
        const instrumentationFile = getInstrumentationFile(projectDir, dotPrefixedPageExtensions.concat([
            '.ts',
            '.js'
        ]));
        if (runtime !== 'client') {
            warnAboutDeprecatedConfigFiles(projectDir, instrumentationFile, runtime);
        }
        if (runtime === 'server') {
            const nextJsVersion = util.getNextjsVersion();
            const { major } = core.parseSemver(nextJsVersion || '');
            // was added in v15 (https://github.com/vercel/next.js/pull/67539)
            if (major && major >= 15) {
                warnAboutMissingOnRequestErrorHandler(instrumentationFile);
            }
        }
        let rawNewConfig = {
            ...incomingConfig
        };
        // if user has custom webpack config (which always takes the form of a function), run it so we have actual values to
        // work with
        if ('webpack' in userNextConfig && typeof userNextConfig.webpack === 'function') {
            rawNewConfig = userNextConfig.webpack(rawNewConfig, buildContext);
        }
        // This mutates `rawNewConfig` in place, but also returns it in order to switch its type to one in which
        // `newConfig.module.rules` is required, so we don't have to keep asserting its existence
        const newConfig = setUpModuleRules(rawNewConfig);
        // Add a loader which will inject code that sets global values
        addValueInjectionLoader({
            newConfig,
            userNextConfig,
            userSentryOptions,
            buildContext,
            releaseName,
            routeManifest,
            nextJsVersion
        });
        addOtelWarningIgnoreRule(newConfig);
        let pagesDirPath;
        const maybePagesDirPath = path.join(projectDir, 'pages');
        const maybeSrcPagesDirPath = path.join(projectDir, 'src', 'pages');
        if (fs.existsSync(maybePagesDirPath) && fs.lstatSync(maybePagesDirPath).isDirectory()) {
            pagesDirPath = maybePagesDirPath;
        } else if (fs.existsSync(maybeSrcPagesDirPath) && fs.lstatSync(maybeSrcPagesDirPath).isDirectory()) {
            pagesDirPath = maybeSrcPagesDirPath;
        }
        let appDirPath;
        const maybeAppDirPath = path.join(projectDir, 'app');
        const maybeSrcAppDirPath = path.join(projectDir, 'src', 'app');
        if (fs.existsSync(maybeAppDirPath) && fs.lstatSync(maybeAppDirPath).isDirectory()) {
            appDirPath = maybeAppDirPath;
        } else if (fs.existsSync(maybeSrcAppDirPath) && fs.lstatSync(maybeSrcAppDirPath).isDirectory()) {
            appDirPath = maybeSrcAppDirPath;
        }
        const apiRoutesPath = pagesDirPath ? path.join(pagesDirPath, 'api') : undefined;
        const middlewareLocationFolder = pagesDirPath ? path.join(pagesDirPath, '..') : appDirPath ? path.join(appDirPath, '..') : projectDir;
        const staticWrappingLoaderOptions = {
            appDir: appDirPath,
            pagesDir: pagesDirPath,
            pageExtensionRegex,
            excludeServerRoutes: userSentryOptions.excludeServerRoutes,
            nextjsRequestAsyncStorageModulePath: getRequestAsyncStorageModuleLocation(projectDir, rawNewConfig.resolve?.modules)
        };
        const normalizeLoaderResourcePath = (resourcePath)=>{
            // `resourcePath` may be an absolute path or a path relative to the context of the webpack config
            let absoluteResourcePath;
            if (path.isAbsolute(resourcePath)) {
                absoluteResourcePath = resourcePath;
            } else {
                absoluteResourcePath = path.join(projectDir, resourcePath);
            }
            return path.normalize(absoluteResourcePath);
        };
        const isPageResource = (resourcePath)=>{
            const normalizedAbsoluteResourcePath = normalizeLoaderResourcePath(resourcePath);
            return pagesDirPath !== undefined && normalizedAbsoluteResourcePath.startsWith(pagesDirPath + path.sep) && !normalizedAbsoluteResourcePath.startsWith(apiRoutesPath + path.sep) && dotPrefixedPageExtensions.some((ext)=>normalizedAbsoluteResourcePath.endsWith(ext));
        };
        const isApiRouteResource = (resourcePath)=>{
            const normalizedAbsoluteResourcePath = normalizeLoaderResourcePath(resourcePath);
            return normalizedAbsoluteResourcePath.startsWith(apiRoutesPath + path.sep) && dotPrefixedPageExtensions.some((ext)=>normalizedAbsoluteResourcePath.endsWith(ext));
        };
        const possibleMiddlewareLocations = pageExtensions.map((middlewareFileEnding)=>{
            return path.join(middlewareLocationFolder, `middleware.${middlewareFileEnding}`);
        });
        const isMiddlewareResource = (resourcePath)=>{
            const normalizedAbsoluteResourcePath = normalizeLoaderResourcePath(resourcePath);
            return possibleMiddlewareLocations.includes(normalizedAbsoluteResourcePath);
        };
        const isServerComponentResource = (resourcePath)=>{
            const normalizedAbsoluteResourcePath = normalizeLoaderResourcePath(resourcePath);
            // ".js, .jsx, or .tsx file extensions can be used for Pages"
            // https://beta.nextjs.org/docs/routing/pages-and-layouts#pages:~:text=.js%2C%20.jsx%2C%20or%20.tsx%20file%20extensions%20can%20be%20used%20for%20Pages.
            return appDirPath !== undefined && normalizedAbsoluteResourcePath.startsWith(appDirPath + path.sep) && !!normalizedAbsoluteResourcePath.match(// eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor
            new RegExp(`[\\\\/](page|layout|loading|head|not-found)\\.(${pageExtensionRegex})$`));
        };
        const isRouteHandlerResource = (resourcePath)=>{
            const normalizedAbsoluteResourcePath = normalizeLoaderResourcePath(resourcePath);
            return appDirPath !== undefined && normalizedAbsoluteResourcePath.startsWith(appDirPath + path.sep) && !!normalizedAbsoluteResourcePath.match(// eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor
            new RegExp(`[\\\\/]route\\.(${pageExtensionRegex})$`));
        };
        if (isServer && userSentryOptions.autoInstrumentServerFunctions !== false) {
            // It is very important that we insert our loaders at the beginning of the array because we expect any sort of transformations/transpilations (e.g. TS -> JS) to already have happened.
            // Wrap pages
            newConfig.module.rules.unshift({
                test: isPageResource,
                use: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders', 'wrappingLoader.js'),
                        options: {
                            ...staticWrappingLoaderOptions,
                            wrappingTargetKind: 'page'
                        }
                    }
                ]
            });
            let vercelCronsConfig = undefined;
            try {
                if (process.env.VERCEL && userSentryOptions.automaticVercelMonitors) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    vercelCronsConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8')).crons;
                    if (vercelCronsConfig) {
                        core.debug.log(`${chalk.cyan('info')} - Creating Sentry cron monitors for your Vercel Cron Jobs. You can disable this feature by setting the ${chalk.bold.cyan('automaticVercelMonitors')} option to false in you Next.js config.`);
                    }
                }
            } catch (e) {
                if (e.code === 'ENOENT') ;
                else {
                    // log but noop
                    core.debug.error(`${chalk.red('error')} - Sentry failed to read vercel.json for automatic cron job monitoring instrumentation`, e);
                }
            }
            // Wrap api routes
            newConfig.module.rules.unshift({
                test: isApiRouteResource,
                use: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders', 'wrappingLoader.js'),
                        options: {
                            ...staticWrappingLoaderOptions,
                            vercelCronsConfig,
                            wrappingTargetKind: 'api-route'
                        }
                    }
                ]
            });
            // Wrap middleware
            if (userSentryOptions.autoInstrumentMiddleware ?? true) {
                newConfig.module.rules.unshift({
                    test: isMiddlewareResource,
                    use: [
                        {
                            loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders', 'wrappingLoader.js'),
                            options: {
                                ...staticWrappingLoaderOptions,
                                wrappingTargetKind: 'middleware'
                            }
                        }
                    ]
                });
            }
        }
        if (isServer && userSentryOptions.autoInstrumentAppDirectory !== false) {
            // Wrap server components
            newConfig.module.rules.unshift({
                test: isServerComponentResource,
                use: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders', 'wrappingLoader.js'),
                        options: {
                            ...staticWrappingLoaderOptions,
                            wrappingTargetKind: 'server-component'
                        }
                    }
                ]
            });
            // Wrap route handlers
            newConfig.module.rules.unshift({
                test: isRouteHandlerResource,
                use: [
                    {
                        loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders', 'wrappingLoader.js'),
                        options: {
                            ...staticWrappingLoaderOptions,
                            wrappingTargetKind: 'route-handler'
                        }
                    }
                ]
            });
        }
        if (appDirPath) {
            const hasGlobalErrorFile = pageExtensions.map((extension)=>`global-error.${extension}`).some(// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            (globalErrorFile)=>fs.existsSync(path.join(appDirPath, globalErrorFile)));
            if (!hasGlobalErrorFile && !showedMissingGlobalErrorWarningMsg && !process.env.SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING) {
                // eslint-disable-next-line no-console
                console.log(`${chalk.yellow('warn')}  - It seems like you don't have a global error handler set up. It is recommended that you add a ${chalk.cyan('global-error.js')} file with Sentry instrumentation so that React rendering errors are reported to Sentry. Read more: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#react-render-errors-in-app-router (you can suppress this warning by setting SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1 as environment variable)`);
                showedMissingGlobalErrorWarningMsg = true;
            }
        }
        if (!isServer) {
            // Tell webpack to inject the client config files (containing the client-side `Sentry.init()` call) into the appropriate output
            // bundles. Store a separate reference to the original `entry` value to avoid an infinite loop. (If we don't do
            // this, we'll have a statement of the form `x.y = () => f(x.y)`, where one of the things `f` does is call `x.y`.
            // Since we're setting `x.y` to be a callback (which, by definition, won't run until some time later), by the time
            // the function runs (causing `f` to run, causing `x.y` to run), `x.y` will point to the callback itself, rather
            // than its original value. So calling it will call the callback which will call `f` which will call `x.y` which
            // will call the callback which will call `f` which will call `x.y`... and on and on. Theoretically this could also
            // be fixed by using `bind`, but this is way simpler.)
            const origEntryProperty = newConfig.entry;
            newConfig.entry = async ()=>addSentryToClientEntryProperty(origEntryProperty, buildContext);
            const clientSentryConfigFileName = getClientSentryConfigFile(projectDir);
            if (clientSentryConfigFileName) {
                // eslint-disable-next-line no-console
                console.warn(`[@sentry/nextjs] DEPRECATION WARNING: It is recommended renaming your \`${clientSentryConfigFileName}\` file, or moving its content to \`instrumentation-client.ts\`. When using Turbopack \`${clientSentryConfigFileName}\` will no longer work. Read more about the \`instrumentation-client.ts\` file: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client`);
            }
        }
        const isStaticExport = userNextConfig?.output === 'export';
        // We don't want to do any webpack plugin stuff OR any source maps stuff in dev mode or for the server on static-only builds.
        // Symbolication for dev-mode errors is done elsewhere.
        if (!(isDev || isStaticExport && isServer)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { sentryWebpackPlugin } = core.loadModule('@sentry/webpack-plugin', module) ?? {};
            if (sentryWebpackPlugin) {
                if (!userSentryOptions.sourcemaps?.disable) {
                    // Source maps can be configured in 3 ways:
                    // 1. (next config): productionBrowserSourceMaps
                    // 2. (next config): experimental.serverSourceMaps
                    // 3. custom webpack configuration
                    //
                    // We only update this if no explicit value is set
                    // (Next.js defaults to `false`: https://github.com/vercel/next.js/blob/5f4f96c133bd6b10954812cc2fef6af085b82aa5/packages/next/src/build/webpack/config/blocks/base.ts#L61)
                    if (!newConfig.devtool) {
                        core.debug.log(`[@sentry/nextjs] Automatically enabling source map generation for ${runtime} build.`);
                        // `hidden-source-map` produces the same sourcemaps as `source-map`, but doesn't include the `sourceMappingURL`
                        // comment at the bottom. For folks who aren't publicly hosting their sourcemaps, this is helpful because then
                        // the browser won't look for them and throw errors into the console when it can't find them. Because this is a
                        // front-end-only problem, and because `sentry-cli` handles sourcemaps more reliably with the comment than
                        // without, the option to use `hidden-source-map` only applies to the client-side build.
                        if (isServer) {
                            newConfig.devtool = 'source-map';
                        } else {
                            newConfig.devtool = 'hidden-source-map';
                        }
                    }
                    // enable source map deletion if not explicitly disabled
                    if (!isServer && userSentryOptions.sourcemaps?.deleteSourcemapsAfterUpload === undefined) {
                        core.debug.warn('[@sentry/nextjs] Source maps will be automatically deleted after being uploaded to Sentry. If you want to keep the source maps, set the `sourcemaps.deleteSourcemapsAfterUpload` option to false in `withSentryConfig()`. If you do not want to generate and upload sourcemaps at all, set the `sourcemaps.disable` option to true.');
                        userSentryOptions.sourcemaps = {
                            ...userSentryOptions.sourcemaps,
                            deleteSourcemapsAfterUpload: true
                        };
                    }
                }
                newConfig.plugins = newConfig.plugins || [];
                const sentryWebpackPluginInstance = sentryWebpackPlugin(webpackPluginOptions.getWebpackPluginOptions(buildContext, userSentryOptions, releaseName));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                sentryWebpackPluginInstance._name = 'sentry-webpack-plugin'; // For tests and debugging. Serves no other purpose.
                newConfig.plugins.push(sentryWebpackPluginInstance);
            }
        }
        if (userSentryOptions.disableLogger) {
            newConfig.plugins = newConfig.plugins || [];
            newConfig.plugins.push(new buildContext.webpack.DefinePlugin({
                __SENTRY_DEBUG__: false
            }));
        }
        // We inject a map of dependencies that the nextjs app has, as we cannot reliably extract them at runtime, sadly
        newConfig.plugins = newConfig.plugins || [];
        newConfig.plugins.push(new buildContext.webpack.DefinePlugin({
            __SENTRY_SERVER_MODULES__: JSON.stringify(_getModules(projectDir))
        }));
        return newConfig;
    };
}
/**
 * Modify the webpack `entry` property so that the code in `sentry.client.config.js` is
 * included in the the necessary bundles.
 *
 * @param currentEntryProperty The value of the property before Sentry code has been injected
 * @param buildContext Object passed by nextjs containing metadata about the build
 * @returns The value which the new `entry` property (which will be a function) will return (TODO: this should return
 * the function, rather than the function's return value)
 */ async function addSentryToClientEntryProperty(currentEntryProperty, buildContext) {
    // The `entry` entry in a webpack config can be a string, array of strings, object, or function. By default, nextjs
    // sets it to an async function which returns the promise of an object of string arrays. Because we don't know whether
    // someone else has come along before us and changed that, we need to check a few things along the way. The one thing
    // we know is that it won't have gotten *simpler* in form, so we only need to worry about the object and function
    // options. See https://webpack.js.org/configuration/entry-context/#entry.
    const { dir: projectDir, dev: isDevMode } = buildContext;
    const newEntryProperty = typeof currentEntryProperty === 'function' ? await currentEntryProperty() : {
        ...currentEntryProperty
    };
    const clientSentryConfigFileName = getClientSentryConfigFile(projectDir);
    const instrumentationClientFileName = getInstrumentationClientFile(projectDir);
    const filesToInject = [];
    if (clientSentryConfigFileName) {
        // we need to turn the filename into a path so webpack can find it
        filesToInject.push(`./${clientSentryConfigFileName}`);
    }
    if (instrumentationClientFileName) {
        // we need to turn the filename into a path so webpack can find it
        filesToInject.push(`./${instrumentationClientFileName}`);
    }
    // inject into all entry points which might contain user's code
    for(const entryPointName in newEntryProperty){
        if (entryPointName === 'pages/_app' || // entrypoint for `/app` pages
        entryPointName === 'main-app') {
            addFilesToWebpackEntryPoint(newEntryProperty, entryPointName, filesToInject, isDevMode);
        }
    }
    return newEntryProperty;
}
/**
 * Gets the content of the user's instrumentation file
 */ function getInstrumentationFile(projectDir, dotPrefixedExtensions) {
    const paths = dotPrefixedExtensions.flatMap((extension)=>[
            [
                'src',
                `instrumentation${extension}`
            ],
            [
                `instrumentation${extension}`
            ]
        ]);
    for (const pathSegments of paths){
        try {
            return fs.readFileSync(path.resolve(projectDir, ...pathSegments), {
                encoding: 'utf-8'
            });
        } catch  {
        // no-op
        }
    }
    return null;
}
/**
 * Make sure the instrumentation file has a `onRequestError` Handler
 */ function warnAboutMissingOnRequestErrorHandler(instrumentationFile) {
    if (!instrumentationFile) {
        if (!process.env.SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING) {
            // eslint-disable-next-line no-console
            console.warn(chalk.yellow('[@sentry/nextjs] Could not find a Next.js instrumentation file. This indicates an incomplete configuration of the Sentry SDK. An instrumentation file is required for the Sentry SDK to be initialized on the server: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#create-initialization-config-files (you can suppress this warning by setting SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING=1 as environment variable)'));
        }
        return;
    }
    if (!instrumentationFile.includes('onRequestError')) {
        // eslint-disable-next-line no-console
        console.warn(chalk.yellow('[@sentry/nextjs] Could not find `onRequestError` hook in instrumentation file. This indicates outdated configuration of the Sentry SDK. Use `Sentry.captureRequestError` to instrument the `onRequestError` hook: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#errors-from-nested-react-server-components'));
    }
}
/**
 * Searches for old `sentry.(server|edge).config.ts` files and Next.js instrumentation hooks and warns if there are "old"
 * config files and no signs of them inside the instrumentation hook.
 *
 * @param projectDir The root directory of the project, where config files would be located
 * @param platform Either "server" or "edge", so that we know which file to look for
 */ function warnAboutDeprecatedConfigFiles(projectDir, instrumentationFile, platform) {
    const hasInstrumentationHookWithIndicationsOfSentry = instrumentationFile && (instrumentationFile.includes('@sentry/') || instrumentationFile.match(/sentry\.(server|edge)\.config(\.(ts|js))?/));
    if (hasInstrumentationHookWithIndicationsOfSentry) {
        return;
    }
    for (const filename of [
        `sentry.${platform}.config.ts`,
        `sentry.${platform}.config.js`
    ]){
        if (fs.existsSync(path.resolve(projectDir, filename))) {
            // eslint-disable-next-line no-console
            console.warn(`[@sentry/nextjs] It appears you've configured a \`${filename}\` file. Please ensure to put this file's content into the \`register()\` function of a Next.js instrumentation file instead. To ensure correct functionality of the SDK, \`Sentry.init\` must be called inside of an instrumentation file. Learn more about setting up an instrumentation file in Next.js: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation. You can safely delete the \`${filename}\` file afterward.`);
        }
    }
}
/**
 * Searches for a `sentry.client.config.ts|js` file and returns its file name if it finds one. (ts being prioritized)
 *
 * @param projectDir The root directory of the project, where config files would be located
 */ function getClientSentryConfigFile(projectDir) {
    const possibilities = [
        'sentry.client.config.ts',
        'sentry.client.config.js'
    ];
    for (const filename of possibilities){
        if (fs.existsSync(path.resolve(projectDir, filename))) {
            return filename;
        }
    }
}
/**
 * Searches for a `instrumentation-client.ts|js` file and returns its file name if it finds one. (ts being prioritized)
 *
 * @param projectDir The root directory of the project, where config files would be located
 */ function getInstrumentationClientFile(projectDir) {
    const possibilities = [
        [
            'src',
            'instrumentation-client.js'
        ],
        [
            'src',
            'instrumentation-client.ts'
        ],
        [
            'instrumentation-client.js'
        ],
        [
            'instrumentation-client.ts'
        ]
    ];
    for (const pathParts of possibilities){
        if (fs.existsSync(path.resolve(projectDir, ...pathParts))) {
            return path.join(...pathParts);
        }
    }
}
/**
 * Add files to a specific element of the given `entry` webpack config property.
 *
 * @param entryProperty The existing `entry` config object
 * @param entryPointName The key where the file should be injected
 * @param filesToInsert An array of paths to the injected files
 */ function addFilesToWebpackEntryPoint(entryProperty, entryPointName, filesToInsert, isDevMode) {
    // BIG FAT NOTE: Order of insertion seems to matter here. If we insert the new files before the `currentEntrypoint`s,
    // the Next.js dev server breaks. Because we generally still want the SDK to be initialized as early as possible we
    // still keep it at the start of the entrypoints if we are not in dev mode.
    // can be a string, array of strings, or object whose `import` property is one of those two
    const currentEntryPoint = entryProperty[entryPointName];
    let newEntryPoint = currentEntryPoint;
    if (typeof currentEntryPoint === 'string' || Array.isArray(currentEntryPoint)) {
        newEntryPoint = Array.isArray(currentEntryPoint) ? currentEntryPoint : [
            currentEntryPoint
        ];
        if (newEntryPoint.some((entry)=>filesToInsert.includes(entry))) {
            return;
        }
        if (isDevMode) {
            // Inserting at beginning breaks dev mode so we insert at the end
            newEntryPoint.push(...filesToInsert);
        } else {
            // In other modes we insert at the beginning so that the SDK initializes as early as possible
            newEntryPoint.unshift(...filesToInsert);
        }
    } else if (typeof currentEntryPoint === 'object' && 'import' in currentEntryPoint) {
        const currentImportValue = currentEntryPoint.import;
        const newImportValue = Array.isArray(currentImportValue) ? currentImportValue : [
            currentImportValue
        ];
        if (newImportValue.some((entry)=>filesToInsert.includes(entry))) {
            return;
        }
        if (isDevMode) {
            // Inserting at beginning breaks dev mode so we insert at the end
            newImportValue.push(...filesToInsert);
        } else {
            // In other modes we insert at the beginning so that the SDK initializes as early as possible
            newImportValue.unshift(...filesToInsert);
        }
        newEntryPoint = {
            ...currentEntryPoint,
            import: newImportValue
        };
    } else {
        // eslint-disable-next-line no-console
        console.error('Sentry Logger [Error]:', `Could not inject SDK initialization code into entry point ${entryPointName}, as its current value is not in a recognized format.\n`, 'Expected: string | Array<string> | { [key:string]: any, import: string | Array<string> }\n', `Got: ${currentEntryPoint}`);
    }
    if (newEntryPoint) {
        entryProperty[entryPointName] = newEntryPoint;
    }
}
/**
 * Ensure that `newConfig.module.rules` exists. Modifies the given config in place but also returns it in order to
 * change its type.
 *
 * @param newConfig A webpack config object which may or may not contain `module` and `module.rules`
 * @returns The same object, with an empty `module.rules` array added if necessary
 */ function setUpModuleRules(newConfig) {
    newConfig.module = {
        ...newConfig.module,
        rules: [
            ...newConfig.module?.rules || []
        ]
    };
    // Surprising that we have to assert the type here, since we've demonstrably guaranteed the existence of
    // `newConfig.module.rules` just above, but ¯\_(ツ)_/¯
    return newConfig;
}
/**
 * Adds loaders to inject values on the global object based on user configuration.
 */ // TODO: Remove this loader and replace it with a nextConfig.env (https://web.archive.org/web/20240917153554/https://nextjs.org/docs/app/api-reference/next-config-js/env) or define based (https://github.com/vercel/next.js/discussions/71476) approach.
// In order to remove this loader though we need to make sure the minimum supported Next.js version includes this PR (https://github.com/vercel/next.js/pull/61194), otherwise the nextConfig.env based approach will not work, as our SDK code is not processed by Next.js.
function addValueInjectionLoader({ newConfig, userNextConfig, userSentryOptions, buildContext, releaseName, routeManifest, nextJsVersion }) {
    const assetPrefix = userNextConfig.assetPrefix || userNextConfig.basePath || '';
    // Check if release creation is disabled to prevent injection that breaks build determinism
    const shouldCreateRelease = userSentryOptions.release?.create !== false;
    const releaseToInject = releaseName && shouldCreateRelease ? releaseName : undefined;
    const isomorphicValues = {
        // `rewritesTunnel` set by the user in Next.js config
        _sentryRewritesTunnelPath: userSentryOptions.tunnelRoute !== undefined && userNextConfig.output !== 'export' && typeof userSentryOptions.tunnelRoute === 'string' ? `${userNextConfig.basePath ?? ''}${userSentryOptions.tunnelRoute}` : undefined,
        // The webpack plugin's release injection breaks the `app` directory so we inject the release manually here instead.
        // Having a release defined in dev-mode spams releases in Sentry so we only set one in non-dev mode
        // Only inject if release creation is not explicitly disabled (to maintain build determinism)
        SENTRY_RELEASE: releaseToInject && !buildContext.dev ? {
            id: releaseToInject
        } : undefined,
        _sentryBasePath: buildContext.dev ? userNextConfig.basePath : undefined,
        // This is used to determine version-based dev-symbolication behavior
        _sentryNextJsVersion: nextJsVersion
    };
    const serverValues = {
        ...isomorphicValues,
        // Make sure that if we have a windows path, the backslashes are interpreted as such (rather than as escape
        // characters)
        _sentryRewriteFramesDistDir: userNextConfig.distDir?.replace(/\\/g, '\\\\') || '.next'
    };
    const clientValues = {
        ...isomorphicValues,
        // Get the path part of `assetPrefix`, minus any trailing slash. (We use a placeholder for the origin if
        // `assetPrefix` doesn't include one. Since we only care about the path, it doesn't matter what it is.)
        _sentryRewriteFramesAssetPrefixPath: assetPrefix ? new URL(assetPrefix, 'http://dogs.are.great').pathname.replace(/\/$/, '') : '',
        _sentryAssetPrefix: userNextConfig.assetPrefix,
        _sentryExperimentalThirdPartyOriginStackFrames: userSentryOptions._experimental?.thirdPartyOriginStackFrames ? 'true' : undefined,
        _sentryRouteManifest: JSON.stringify(routeManifest)
    };
    if (buildContext.isServer) {
        newConfig.module.rules.push({
            // TODO: Find a more bulletproof way of matching. For now this is fine and doesn't hurt anyone. It merely sets some globals.
            test: /(src[\\/])?instrumentation.(js|ts)/,
            use: [
                {
                    loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders/valueInjectionLoader.js'),
                    options: {
                        values: serverValues
                    }
                }
            ]
        });
    } else {
        newConfig.module.rules.push({
            test: /(?:sentry\.client\.config\.(jsx?|tsx?)|(?:src[\\/])?instrumentation-client\.(js|ts))$/,
            use: [
                {
                    loader: path.resolve(("TURBOPACK compile-time value", "/ROOT/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config"), 'loaders/valueInjectionLoader.js'),
                    options: {
                        values: clientValues
                    }
                }
            ]
        });
    }
}
function resolveNextPackageDirFromDirectory(basedir) {
    try {
        return path.dirname(resolve.sync('next/package.json', {
            basedir
        }));
    } catch  {
        // Should not happen in theory
        return undefined;
    }
}
const POTENTIAL_REQUEST_ASYNC_STORAGE_LOCATIONS = [
    // Original location of RequestAsyncStorage
    // https://github.com/vercel/next.js/blob/46151dd68b417e7850146d00354f89930d10b43b/packages/next/src/client/components/request-async-storage.ts
    'next/dist/client/components/request-async-storage.js',
    // Introduced in Next.js 13.4.20
    // https://github.com/vercel/next.js/blob/e1bc270830f2fc2df3542d4ef4c61b916c802df3/packages/next/src/client/components/request-async-storage.external.ts
    'next/dist/client/components/request-async-storage.external.js',
    // Introduced in Next.js 15.0.0-canary.180
    // https://github.com/vercel/next.js/blob/541167b9b0fed6af9f36472e632863ffec41f18c/packages/next/src/server/app-render/work-unit-async-storage.external.ts
    'next/dist/server/app-render/work-unit-async-storage.external.js',
    // Introduced in Next.js 15.0.0-canary.182
    // https://github.com/vercel/next.js/blob/f35159e5e80138ca7373f57b47edcaae3bcf1728/packages/next/src/client/components/work-unit-async-storage.external.ts
    'next/dist/client/components/work-unit-async-storage.external.js'
];
function getRequestAsyncStorageModuleLocation(webpackContextDir, webpackResolvableModuleLocations) {
    if (webpackResolvableModuleLocations === undefined) {
        return undefined;
    }
    const absoluteWebpackResolvableModuleLocations = webpackResolvableModuleLocations.map((loc)=>path.resolve(webpackContextDir, loc));
    for (const webpackResolvableLocation of absoluteWebpackResolvableModuleLocations){
        const nextPackageDir = resolveNextPackageDirFromDirectory(webpackResolvableLocation);
        if (nextPackageDir) {
            const asyncLocalStorageLocation = POTENTIAL_REQUEST_ASYNC_STORAGE_LOCATIONS.find((loc)=>fs.existsSync(path.join(nextPackageDir, '..', loc)));
            if (asyncLocalStorageLocation) {
                return asyncLocalStorageLocation;
            }
        }
    }
    return undefined;
}
function addOtelWarningIgnoreRule(newConfig) {
    const ignoreRules = [
        // Inspired by @matmannion: https://github.com/getsentry/sentry-javascript/issues/12077#issuecomment-2180307072
        (warning, compilation)=>{
            // This is wrapped in try-catch because we are vendoring types for this hook and we can't be 100% sure that we are accessing API that is there
            try {
                if (!warning.module) {
                    return false;
                }
                const isDependencyThatMayRaiseCriticalDependencyMessage = /@opentelemetry\/instrumentation/.test(warning.module.readableIdentifier(compilation.requestShortener)) || /@prisma\/instrumentation/.test(warning.module.readableIdentifier(compilation.requestShortener));
                const isCriticalDependencyMessage = /Critical dependency/.test(warning.message);
                return isDependencyThatMayRaiseCriticalDependencyMessage && isCriticalDependencyMessage;
            } catch  {
                return false;
            }
        },
        // We provide these objects in addition to the hook above to provide redundancy in case the hook fails.
        {
            module: /@opentelemetry\/instrumentation/,
            message: /Critical dependency/
        },
        {
            module: /@prisma\/instrumentation/,
            message: /Critical dependency/
        },
        {
            module: /require-in-the-middle/,
            message: /Critical dependency/
        }
    ];
    if (newConfig.ignoreWarnings === undefined) {
        newConfig.ignoreWarnings = ignoreRules;
    } else if (Array.isArray(newConfig.ignoreWarnings)) {
        newConfig.ignoreWarnings.push(...ignoreRules);
    }
}
function _getModules(projectDir) {
    try {
        const packageJson = path.join(projectDir, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJson, 'utf8');
        const packageJsonObject = JSON.parse(packageJsonContent);
        return {
            ...packageJsonObject.dependencies,
            ...packageJsonObject.devDependencies
        };
    } catch  {
        return {};
    }
}
exports.constructWebpackConfigFunction = constructWebpackConfigFunction; //# sourceMappingURL=webpack.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/withSentryConfig.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const node = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/index.js [app-ssr] (ecmascript)");
const childProcess = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
const fs = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const createRouteManifest = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/manifest/createRouteManifest.js [app-ssr] (ecmascript)");
const constructTurbopackConfig = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/turbopack/constructTurbopackConfig.js [app-ssr] (ecmascript)");
const util = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/util.js [app-ssr] (ecmascript)");
const webpack = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/webpack.js [app-ssr] (ecmascript)");
/* eslint-disable max-lines */ /* eslint-disable complexity */ let showedExportModeTunnelWarning = false;
let showedExperimentalBuildModeWarning = false;
// Packages we auto-instrument need to be external for instrumentation to work
// Next.js externalizes some packages by default, see: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
// Others we need to add ourselves
//
// NOTE: 'ai' (Vercel AI SDK) is intentionally NOT included in this list.
// When externalized, Next.js doesn't properly handle the package's conditional exports,
// specifically the "react-server" export condition. This causes client-side code to be
// loaded in server components instead of the appropriate server-side functions.
const DEFAULT_SERVER_EXTERNAL_PACKAGES = [
    'amqplib',
    'connect',
    'dataloader',
    'express',
    'generic-pool',
    'graphql',
    '@hapi/hapi',
    'ioredis',
    'kafkajs',
    'koa',
    'lru-memoizer',
    'mongodb',
    'mongoose',
    'mysql',
    'mysql2',
    'knex',
    'pg',
    'pg-pool',
    '@node-redis/client',
    '@redis/client',
    'redis',
    'tedious'
];
/**
 * Modifies the passed in Next.js configuration with automatic build-time instrumentation and source map upload.
 *
 * @param nextConfig A Next.js configuration object, as usually exported in `next.config.js` or `next.config.mjs`.
 * @param sentryBuildOptions Additional options to configure instrumentation and
 * @returns The modified config to be exported
 */ function withSentryConfig(nextConfig, sentryBuildOptions = {}) {
    const castNextConfig = nextConfig || {};
    if (typeof castNextConfig === 'function') {
        return function(...webpackConfigFunctionArgs) {
            const maybePromiseNextConfig = castNextConfig.apply(this, webpackConfigFunctionArgs);
            if (core.isThenable(maybePromiseNextConfig)) {
                return maybePromiseNextConfig.then((promiseResultNextConfig)=>{
                    return getFinalConfigObject(promiseResultNextConfig, sentryBuildOptions);
                });
            }
            return getFinalConfigObject(maybePromiseNextConfig, sentryBuildOptions);
        };
    } else {
        return getFinalConfigObject(castNextConfig, sentryBuildOptions);
    }
}
/**
 * Generates a random tunnel route path that's less likely to be blocked by ad-blockers
 */ function generateRandomTunnelRoute() {
    // Generate a random 8-character alphanumeric string
    const randomString = Math.random().toString(36).substring(2, 10);
    return `/${randomString}`;
}
// Modify the materialized object form of the user's next config by deleting the `sentry` property and wrapping the
// `webpack` property
function getFinalConfigObject(incomingUserNextConfigObject, userSentryOptions) {
    // Only determine a release name if release creation is not explicitly disabled
    // This prevents injection of Git commit hashes that break build determinism
    const shouldCreateRelease = userSentryOptions.release?.create !== false;
    const releaseName = shouldCreateRelease ? userSentryOptions.release?.name ?? node.getSentryRelease() ?? getGitRevision() : userSentryOptions.release?.name;
    if (userSentryOptions?.tunnelRoute) {
        if (incomingUserNextConfigObject.output === 'export') {
            if (!showedExportModeTunnelWarning) {
                showedExportModeTunnelWarning = true;
                // eslint-disable-next-line no-console
                console.warn('[@sentry/nextjs] The Sentry Next.js SDK `tunnelRoute` option will not work in combination with Next.js static exports. The `tunnelRoute` option uses server-side features that cannot be accessed in export mode. If you still want to tunnel Sentry events, set up your own tunnel: https://docs.sentry.io/platforms/javascript/troubleshooting/#using-the-tunnel-option');
            }
        } else {
            const resolvedTunnelRoute = userSentryOptions.tunnelRoute === true ? generateRandomTunnelRoute() : userSentryOptions.tunnelRoute;
            // Update the global options object to use the resolved value everywhere
            userSentryOptions.tunnelRoute = resolvedTunnelRoute || undefined;
            setUpTunnelRewriteRules(incomingUserNextConfigObject, resolvedTunnelRoute);
        }
    }
    if (process.argv.includes('--experimental-build-mode')) {
        if (!showedExperimentalBuildModeWarning) {
            showedExperimentalBuildModeWarning = true;
            // eslint-disable-next-line no-console
            console.warn('[@sentry/nextjs] The Sentry Next.js SDK does not currently fully support next build --experimental-build-mode');
        }
        if (process.argv.includes('generate')) {
            // Next.js v15.3.0-canary.1 splits the experimental build into two phases:
            // 1. compile: Code compilation
            // 2. generate: Environment variable inlining and prerendering (We don't instrument this phase, we inline in the compile phase)
            //
            // We assume a single "full" build and reruns Webpack instrumentation in both phases.
            // During the generate step it collides with Next.js's inliner
            // producing malformed JS and build failures.
            // We skip Sentry processing during generate to avoid this issue.
            return incomingUserNextConfigObject;
        }
    }
    let routeManifest;
    if (!userSentryOptions.disableManifestInjection) {
        routeManifest = createRouteManifest.createRouteManifest();
    }
    setUpBuildTimeVariables(incomingUserNextConfigObject, userSentryOptions, releaseName);
    const nextJsVersion = util.getNextjsVersion();
    // Add the `clientTraceMetadata` experimental option based on Next.js version. The option got introduced in Next.js version 15.0.0 (actually 14.3.0-canary.64).
    // Adding the option on lower versions will cause Next.js to print nasty warnings we wouldn't confront our users with.
    if (nextJsVersion) {
        const { major, minor } = core.parseSemver(nextJsVersion);
        if (major !== undefined && minor !== undefined && (major >= 15 || major === 14 && minor >= 3)) {
            incomingUserNextConfigObject.experimental = incomingUserNextConfigObject.experimental || {};
            incomingUserNextConfigObject.experimental.clientTraceMetadata = [
                'baggage',
                'sentry-trace',
                ...incomingUserNextConfigObject.experimental?.clientTraceMetadata || []
            ];
        }
    } else {
        // eslint-disable-next-line no-console
        console.log("[@sentry/nextjs] The Sentry SDK was not able to determine your Next.js version. If you are using Next.js version 15 or greater, please add `experimental.clientTraceMetadata: ['sentry-trace', 'baggage']` to your Next.js config to enable pageload tracing for App Router.");
    }
    // From Next.js version (15.0.0-canary.124) onwards, Next.js does no longer require the `experimental.instrumentationHook` option and will
    // print a warning when it is set, so we need to conditionally provide it for lower versions.
    if (nextJsVersion) {
        const { major, minor, patch, prerelease } = core.parseSemver(nextJsVersion);
        const isFullySupportedRelease = major !== undefined && minor !== undefined && patch !== undefined && major >= 15 && (minor === 0 && patch === 0 && prerelease === undefined || minor > 0 || patch > 0);
        const isSupportedV15Rc = major !== undefined && minor !== undefined && patch !== undefined && prerelease !== undefined && major === 15 && minor === 0 && patch === 0 && prerelease.startsWith('rc.') && parseInt(prerelease.split('.')[1] || '', 10) > 0;
        const isSupportedCanary = minor !== undefined && patch !== undefined && prerelease !== undefined && major === 15 && minor === 0 && patch === 0 && prerelease.startsWith('canary.') && parseInt(prerelease.split('.')[1] || '', 10) >= 124;
        if (!isFullySupportedRelease && !isSupportedV15Rc && !isSupportedCanary) {
            if (incomingUserNextConfigObject.experimental?.instrumentationHook === false) {
                // eslint-disable-next-line no-console
                console.warn('[@sentry/nextjs] You turned off the `experimental.instrumentationHook` option. Note that Sentry will not be initialized if you did not set it up inside `instrumentation.(js|ts)`.');
            }
            incomingUserNextConfigObject.experimental = {
                instrumentationHook: true,
                ...incomingUserNextConfigObject.experimental
            };
        }
    } else {
        // If we cannot detect a Next.js version for whatever reason, the sensible default is to set the `experimental.instrumentationHook`, even though it may create a warning.
        if (incomingUserNextConfigObject.experimental && 'instrumentationHook' in incomingUserNextConfigObject.experimental) {
            if (incomingUserNextConfigObject.experimental.instrumentationHook === false) {
                // eslint-disable-next-line no-console
                console.warn('[@sentry/nextjs] You set `experimental.instrumentationHook` to `false`. If you are using Next.js version 15 or greater, you can remove that option. If you are using Next.js version 14 or lower, you need to set `experimental.instrumentationHook` in your `next.config.(js|mjs)` to `true` for the SDK to be properly initialized in combination with `instrumentation.(js|ts)`.');
            }
        } else {
            // eslint-disable-next-line no-console
            console.log("[@sentry/nextjs] The Sentry SDK was not able to determine your Next.js version. If you are using Next.js version 15 or greater, Next.js will probably show you a warning about the `experimental.instrumentationHook` being set. To silence Next.js' warning, explicitly set the `experimental.instrumentationHook` option in your `next.config.(js|mjs|ts)` to `undefined`. If you are on Next.js version 14 or lower, you can silence this particular warning by explicitly setting the `experimental.instrumentationHook` option in your `next.config.(js|mjs)` to `true`.");
            incomingUserNextConfigObject.experimental = {
                instrumentationHook: true,
                ...incomingUserNextConfigObject.experimental
            };
        }
    }
    // We wanna check whether the user added a `onRouterTransitionStart` handler to their client instrumentation file.
    const instrumentationClientFileContents = getInstrumentationClientFileContents();
    if (instrumentationClientFileContents !== undefined && !instrumentationClientFileContents.includes('onRouterTransitionStart') && !userSentryOptions.suppressOnRouterTransitionStartWarning) {
        // eslint-disable-next-line no-console
        console.warn('[@sentry/nextjs] ACTION REQUIRED: To instrument navigations, the Sentry SDK requires you to export an `onRouterTransitionStart` hook from your `instrumentation-client.(js|ts)` file. You can do so by adding `export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;` to the file.');
    }
    let nextMajor;
    const isTurbopack = ("TURBOPACK compile-time value", true);
    let isTurbopackSupported = false;
    if (nextJsVersion) {
        const { major, minor, patch, prerelease } = core.parseSemver(nextJsVersion);
        nextMajor = major;
        const isSupportedVersion = major !== undefined && minor !== undefined && patch !== undefined && (major > 15 || major === 15 && minor > 3 || major === 15 && minor === 3 && patch === 0 && prerelease === undefined || major === 15 && minor === 3 && patch > 0);
        isTurbopackSupported = isSupportedVersion;
        const isSupportedCanary = major !== undefined && minor !== undefined && patch !== undefined && prerelease !== undefined && major === 15 && minor === 3 && patch === 0 && prerelease.startsWith('canary.') && parseInt(prerelease.split('.')[1] || '', 10) >= 28;
        const supportsClientInstrumentation = isSupportedCanary || isSupportedVersion;
        if (!supportsClientInstrumentation && isTurbopack) {
            if ("TURBOPACK compile-time truthy", 1) {
                // eslint-disable-next-line no-console
                console.warn(`[@sentry/nextjs] WARNING: You are using the Sentry SDK with Turbopack (\`next dev --turbo\`). The Sentry SDK is compatible with Turbopack on Next.js version 15.3.0 or later. You are currently on ${nextJsVersion}. Please upgrade to a newer Next.js version to use the Sentry SDK with Turbopack. Note that the SDK will continue to work for non-Turbopack production builds. This warning is only about dev-mode.`);
            } else //TURBOPACK unreachable
            ;
        }
    }
    return {
        ...incomingUserNextConfigObject,
        ...nextMajor && nextMajor >= 15 ? {
            serverExternalPackages: [
                ...incomingUserNextConfigObject.serverExternalPackages || [],
                ...DEFAULT_SERVER_EXTERNAL_PACKAGES
            ]
        } : {
            experimental: {
                ...incomingUserNextConfigObject.experimental,
                serverComponentsExternalPackages: [
                    ...incomingUserNextConfigObject.experimental?.serverComponentsExternalPackages || [],
                    ...DEFAULT_SERVER_EXTERNAL_PACKAGES
                ]
            }
        },
        webpack: ("TURBOPACK compile-time truthy", 1) ? incomingUserNextConfigObject.webpack // just return the original webpack config
         : "TURBOPACK unreachable",
        ...isTurbopackSupported && isTurbopack ? {
            turbopack: constructTurbopackConfig.constructTurbopackConfig({
                userNextConfig: incomingUserNextConfigObject,
                routeManifest,
                nextJsVersion
            })
        } : {}
    };
}
/**
 * Injects rewrite rules into the Next.js config provided by the user to tunnel
 * requests from the `tunnelPath` to Sentry.
 *
 * See https://nextjs.org/docs/api-reference/next.config.js/rewrites.
 */ function setUpTunnelRewriteRules(userNextConfig, tunnelPath) {
    const originalRewrites = userNextConfig.rewrites;
    // This function doesn't take any arguments at the time of writing but we future-proof
    // here in case Next.js ever decides to pass some
    userNextConfig.rewrites = async (...args)=>{
        const tunnelRouteRewrite = {
            // Matched rewrite routes will look like the following: `[tunnelPath]?o=[orgid]&p=[projectid]`
            // Nextjs will automatically convert `source` into a regex for us
            source: `${tunnelPath}(/?)`,
            has: [
                {
                    type: 'query',
                    key: 'o',
                    value: '(?<orgid>\\d*)'
                },
                {
                    type: 'query',
                    key: 'p',
                    value: '(?<projectid>\\d*)'
                }
            ],
            destination: 'https://o:orgid.ingest.sentry.io/api/:projectid/envelope/?hsts=0'
        };
        const tunnelRouteRewriteWithRegion = {
            // Matched rewrite routes will look like the following: `[tunnelPath]?o=[orgid]&p=[projectid]?r=[region]`
            // Nextjs will automatically convert `source` into a regex for us
            source: `${tunnelPath}(/?)`,
            has: [
                {
                    type: 'query',
                    key: 'o',
                    value: '(?<orgid>\\d*)'
                },
                {
                    type: 'query',
                    key: 'p',
                    value: '(?<projectid>\\d*)'
                },
                {
                    type: 'query',
                    key: 'r',
                    value: '(?<region>[a-z]{2})'
                }
            ],
            destination: 'https://o:orgid.ingest.:region.sentry.io/api/:projectid/envelope/?hsts=0'
        };
        // Order of these is important, they get applied first to last.
        const newRewrites = [
            tunnelRouteRewriteWithRegion,
            tunnelRouteRewrite
        ];
        if (typeof originalRewrites !== 'function') {
            return newRewrites;
        }
        // @ts-expect-error Expected 0 arguments but got 1 - this is from the future-proofing mentioned above, so we don't care about it
        const originalRewritesResult = await originalRewrites(...args);
        if (Array.isArray(originalRewritesResult)) {
            return [
                ...newRewrites,
                ...originalRewritesResult
            ];
        } else {
            return {
                ...originalRewritesResult,
                beforeFiles: [
                    ...newRewrites,
                    ...originalRewritesResult.beforeFiles || []
                ]
            };
        }
    };
}
function setUpBuildTimeVariables(userNextConfig, userSentryOptions, releaseName) {
    const assetPrefix = userNextConfig.assetPrefix || userNextConfig.basePath || '';
    const basePath = userNextConfig.basePath ?? '';
    const rewritesTunnelPath = userSentryOptions.tunnelRoute !== undefined && userNextConfig.output !== 'export' && typeof userSentryOptions.tunnelRoute === 'string' ? `${basePath}${userSentryOptions.tunnelRoute}` : undefined;
    const buildTimeVariables = {
        // Make sure that if we have a windows path, the backslashes are interpreted as such (rather than as escape
        // characters)
        _sentryRewriteFramesDistDir: userNextConfig.distDir?.replace(/\\/g, '\\\\') || '.next',
        // Get the path part of `assetPrefix`, minus any trailing slash. (We use a placeholder for the origin if
        // `assetPrefix` doesn't include one. Since we only care about the path, it doesn't matter what it is.)
        _sentryRewriteFramesAssetPrefixPath: assetPrefix ? new URL(assetPrefix, 'http://dogs.are.great').pathname.replace(/\/$/, '') : ''
    };
    if (userNextConfig.assetPrefix) {
        buildTimeVariables._assetsPrefix = userNextConfig.assetPrefix;
    }
    if (userSentryOptions._experimental?.thirdPartyOriginStackFrames) {
        buildTimeVariables._experimentalThirdPartyOriginStackFrames = 'true';
    }
    if (rewritesTunnelPath) {
        buildTimeVariables._sentryRewritesTunnelPath = rewritesTunnelPath;
    }
    if (basePath) {
        buildTimeVariables._sentryBasePath = basePath;
    }
    if (userNextConfig.assetPrefix) {
        buildTimeVariables._sentryAssetPrefix = userNextConfig.assetPrefix;
    }
    if (userSentryOptions._experimental?.thirdPartyOriginStackFrames) {
        buildTimeVariables._experimentalThirdPartyOriginStackFrames = 'true';
    }
    if (releaseName) {
        buildTimeVariables._sentryRelease = releaseName;
    }
    if (typeof userNextConfig.env === 'object') {
        userNextConfig.env = {
            ...buildTimeVariables,
            ...userNextConfig.env
        };
    } else if (userNextConfig.env === undefined) {
        userNextConfig.env = buildTimeVariables;
    }
}
function getGitRevision() {
    let gitRevision;
    try {
        gitRevision = childProcess.execSync('git rev-parse HEAD', {
            stdio: [
                'ignore',
                'pipe',
                'ignore'
            ]
        }).toString().trim();
    } catch  {
    // noop
    }
    return gitRevision;
}
function getInstrumentationClientFileContents() {
    const potentialInstrumentationClientFileLocations = [
        [
            'src',
            'instrumentation-client.ts'
        ],
        [
            'src',
            'instrumentation-client.js'
        ],
        [
            'instrumentation-client.ts'
        ],
        [
            'instrumentation-client.js'
        ]
    ];
    for (const pathSegments of potentialInstrumentationClientFileLocations){
        try {
            return fs.readFileSync(path.join(process.cwd(), ...pathSegments), 'utf-8');
        } catch  {
        // noop
        }
    }
}
exports.DEFAULT_SERVER_EXTERNAL_PACKAGES = DEFAULT_SERVER_EXTERNAL_PACKAGES;
exports.withSentryConfig = withSentryConfig; //# sourceMappingURL=withSentryConfig.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/devErrorSymbolicationEventProcessor.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const stackTraceParser = __turbopack_context__.r("[project]/node_modules/.pnpm/stacktrace-parser@0.1.11/node_modules/stacktrace-parser/dist/stack-trace-parser.esm.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)");
const globalWithInjectedValues = core.GLOBAL_OBJ;
/**
 * Event processor that will symbolicate errors by using the webpack/nextjs dev server that is used to show stack traces
 * in the dev overlay.
 */ async function devErrorSymbolicationEventProcessor(event, hint) {
    // Filter out spans for requests resolving source maps for stack frames in dev mode
    if (event.type === 'transaction') {
        event.spans = event.spans?.filter((span)=>{
            const httpUrlAttribute = span.data?.['http.url'];
            if (typeof httpUrlAttribute === 'string') {
                return !httpUrlAttribute.includes('__nextjs_original-stack-frame'); // could also be __nextjs_original-stack-frames (plural)
            }
            return true;
        });
    }
    // Due to changes across Next.js versions, there are a million things that can go wrong here so we just try-catch the
    // entire event processor. Symbolicated stack traces are just a nice to have.
    try {
        if (hint.originalException && hint.originalException instanceof Error && hint.originalException.stack) {
            const frames = stackTraceParser.parse(hint.originalException.stack);
            const nextJsVersion = globalWithInjectedValues._sentryNextJsVersion;
            // If we for whatever reason don't have a Next.js version,
            // we don't want to symbolicate as this previously lead to infinite loops
            if (!nextJsVersion) {
                return event;
            }
            const parsedNextjsVersion = core.parseSemver(nextJsVersion);
            let resolvedFrames;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            if (parsedNextjsVersion.major > 15 || parsedNextjsVersion.major === 15 && parsedNextjsVersion.minor >= 2) {
                const r = await resolveStackFrames(frames);
                if (r === null) {
                    return event;
                }
                resolvedFrames = r;
            } else {
                resolvedFrames = await Promise.all(frames.map((frame)=>resolveStackFrame(frame, hint.originalException)));
            }
            if (event.exception?.values?.[0]?.stacktrace?.frames) {
                event.exception.values[0].stacktrace.frames = event.exception.values[0].stacktrace.frames.map((frame, i, frames)=>{
                    const resolvedFrame = resolvedFrames[frames.length - 1 - i];
                    if (!resolvedFrame?.originalStackFrame || !resolvedFrame.originalCodeFrame) {
                        return {
                            ...frame,
                            platform: frame.filename?.startsWith('node:internal') ? 'nodejs' : undefined,
                            in_app: false
                        };
                    }
                    const { contextLine, preContextLines, postContextLines } = parseOriginalCodeFrame(resolvedFrame.originalCodeFrame);
                    return {
                        ...frame,
                        pre_context: preContextLines,
                        context_line: contextLine,
                        post_context: postContextLines,
                        function: resolvedFrame.originalStackFrame.methodName,
                        filename: resolvedFrame.originalStackFrame.file ? stripWebpackInternalPrefix(resolvedFrame.originalStackFrame.file) : undefined,
                        lineno: resolvedFrame.originalStackFrame.lineNumber || resolvedFrame.originalStackFrame.line1 || undefined,
                        colno: resolvedFrame.originalStackFrame.column || resolvedFrame.originalStackFrame.column1 || undefined
                    };
                });
            }
        }
    } catch  {
        return event;
    }
    return event;
}
async function resolveStackFrame(frame, error) {
    try {
        if (!(frame.file?.startsWith('webpack-internal:') || frame.file?.startsWith('file:'))) {
            return null;
        }
        const params = new URLSearchParams();
        params.append('isServer', String(false)); // doesn't matter since it is overwritten by isAppDirectory
        params.append('isEdgeServer', String(false)); // doesn't matter since it is overwritten by isAppDirectory
        params.append('isAppDirectory', String(true)); // will force server to do more thorough checking
        params.append('errorMessage', error.toString());
        Object.keys(frame).forEach((key)=>{
            params.append(key, (frame[key] ?? '').toString());
        });
        let basePath = process.env._sentryBasePath ?? globalWithInjectedValues._sentryBasePath ?? '';
        // Prefix the basepath with a slash if it doesn't have one
        if (basePath !== '' && !basePath.match(/^\//)) {
            basePath = `/${basePath}`;
        }
        const controller = new AbortController();
        const timer = setTimeout(()=>controller.abort(), 3000);
        const res = await core.suppressTracing(()=>fetch(`${// eslint-disable-next-line no-restricted-globals
            ("TURBOPACK compile-time truthy", 1) ? 'http://localhost:3000' : "TURBOPACK unreachable" // TODO: handle the case where users define a different port
            }${basePath}/__nextjs_original-stack-frame?${params.toString()}`, {
                signal: controller.signal
            }).finally(()=>{
                clearTimeout(timer);
            }));
        if (!res.ok || res.status === 204) {
            return null;
        }
        const body = await res.json();
        return {
            originalCodeFrame: body.originalCodeFrame,
            originalStackFrame: body.originalStackFrame
        };
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.error('Failed to symbolicate event with Next.js dev server', e);
        return null;
    }
}
async function resolveStackFrames(frames) {
    try {
        const postBody = {
            frames: frames.filter((frame)=>{
                return !!frame.file;
            }).map((frame)=>{
                // https://github.com/vercel/next.js/blob/df0573a478baa8b55478a7963c473dddd59a5e40/packages/next/src/client/components/react-dev-overlay/server/middleware-turbopack.ts#L129
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                frame.file = frame.file.replace(/^rsc:\/\/React\/[^/]+\//, '').replace(/\?\d+$/, '');
                return {
                    file: frame.file,
                    methodName: frame.methodName ?? '<unknown>',
                    arguments: [],
                    lineNumber: frame.lineNumber ?? 0,
                    column: frame.column ?? 0,
                    line1: frame.lineNumber ?? 0,
                    column1: frame.column ?? 0
                };
            }),
            isServer: false,
            isEdgeServer: false,
            isAppDirectory: true
        };
        let basePath = process.env._sentryBasePath ?? globalWithInjectedValues._sentryBasePath ?? '';
        // Prefix the basepath with a slash if it doesn't have one
        if (basePath !== '' && !basePath.match(/^\//)) {
            basePath = `/${basePath}`;
        }
        const controller = new AbortController();
        const timer = setTimeout(()=>controller.abort(), 3000);
        const res = await core.suppressTracing(()=>fetch(`${// eslint-disable-next-line no-restricted-globals
            ("TURBOPACK compile-time truthy", 1) ? 'http://localhost:3000' : "TURBOPACK unreachable" // TODO: handle the case where users define a different port
            }${basePath}/__nextjs_original-stack-frames`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal,
                body: JSON.stringify(postBody)
            }).finally(()=>{
                clearTimeout(timer);
            }));
        if (!res.ok || res.status === 204) {
            return null;
        }
        const body = await res.json();
        return body.map((frame)=>{
            return {
                originalCodeFrame: frame.value.originalCodeFrame,
                originalStackFrame: frame.value.originalStackFrame
            };
        });
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.error('Failed to symbolicate event with Next.js dev server', e);
        return null;
    }
}
function parseOriginalCodeFrame(codeFrame) {
    const preProcessedLines = codeFrame// Remove ASCII control characters that are used for syntax highlighting
    .replace(// eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').split('\n')// Remove line that is supposed to indicate where the error happened
    .filter((line)=>!line.match(/^\s*\|/))// Find the error line
    .map((line)=>({
            line,
            isErrorLine: !!line.match(/^>/)
        }))// Remove the leading part that is just for prettier output
    .map((lineObj)=>({
            ...lineObj,
            line: lineObj.line.replace(/^.*\|/, '')
        }));
    const preContextLines = [];
    let contextLine = undefined;
    const postContextLines = [];
    let reachedContextLine = false;
    for (const preProcessedLine of preProcessedLines){
        if (preProcessedLine.isErrorLine) {
            contextLine = preProcessedLine.line;
            reachedContextLine = true;
        } else if (reachedContextLine) {
            postContextLines.push(preProcessedLine.line);
        } else {
            preContextLines.push(preProcessedLine.line);
        }
    }
    return {
        contextLine,
        preContextLines,
        postContextLines
    };
}
/**
 * Strips webpack-internal prefixes from filenames to clean up stack traces.
 *
 * Examples:
 * - "webpack-internal:///./components/file.tsx" -> "./components/file.tsx"
 * - "webpack-internal:///(app-pages-browser)/./components/file.tsx" -> "./components/file.tsx"
 */ function stripWebpackInternalPrefix(filename) {
    if (!filename) {
        return filename;
    }
    const webpackInternalRegex = /^webpack-internal:(?:\/+)?(?:\([^)]*\)\/)?(.+)$/;
    const match = filename.match(webpackInternalRegex);
    return match ? match[1] : filename;
}
exports.devErrorSymbolicationEventProcessor = devErrorSymbolicationEventProcessor; //# sourceMappingURL=devErrorSymbolicationEventProcessor.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/getVercelEnv.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * Returns an environment setting value determined by Vercel's `VERCEL_ENV` environment variable.
 *
 * @param isClient Flag to indicate whether to use the `NEXT_PUBLIC_` prefixed version of the environment variable.
 */ function getVercelEnv(isClient) {
    const vercelEnvVar = isClient ? process.env.NEXT_PUBLIC_VERCEL_ENV : process.env.VERCEL_ENV;
    return vercelEnvVar ? `vercel-${vercelEnvVar}` : undefined;
}
exports.getVercelEnv = getVercelEnv; //# sourceMappingURL=getVercelEnv.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
/**
 * If this attribute is attached to a transaction, the Next.js SDK will drop that transaction.
 */ const TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION = 'sentry.drop_transaction';
const TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL = 'sentry.sentry_trace_backfill';
const TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL = 'sentry.route_backfill';
exports.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL = TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL;
exports.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL = TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL;
exports.TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION = TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION; //# sourceMappingURL=span-attributes-with-logic-attached.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const constants = __turbopack_context__.r("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/constants.js [app-ssr] (ecmascript)");
/**
 * Decide if the currently running process is part of the build phase or happening at runtime.
 */ function isBuild() {
    return process.env.NEXT_PHASE === constants.PHASE_PRODUCTION_BUILD;
}
exports.isBuild = isBuild; //# sourceMappingURL=isBuild.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/server/distDirRewriteFramesIntegration.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const path = __turbopack_context__.r("[externals]/path [external] (path, cjs)");
const distDirRewriteFramesIntegration = core.defineIntegration(({ distDirName })=>{
    // nextjs always puts the build directory at the project root level, which is also where you run `next start` from, so
    // we can read in the project directory from the currently running process
    const distDirAbsPath = path.resolve(distDirName).replace(/(\/|\\)$/, ''); // We strip trailing slashes because "app:///_next" also doesn't have one
    // eslint-disable-next-line @sentry-internal/sdk/no-regexp-constructor -- user input is escaped
    const SOURCEMAP_FILENAME_REGEX = new RegExp(core.escapeStringForRegex(distDirAbsPath));
    const rewriteFramesInstance = core.rewriteFramesIntegration({
        iteratee: (frame)=>{
            frame.filename = frame.filename?.replace(SOURCEMAP_FILENAME_REGEX, 'app:///_next');
            return frame;
        }
    });
    return {
        ...rewriteFramesInstance,
        name: 'DistDirRewriteFrames'
    };
});
exports.distDirRewriteFramesIntegration = distDirRewriteFramesIntegration; //# sourceMappingURL=distDirRewriteFramesIntegration.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)");
/**
 * Flushes pending Sentry events with a 2 second timeout and in a way that cannot create unhandled promise rejections.
 */ async function flushSafelyWithTimeout() {
    try {
        debugBuild.DEBUG_BUILD && core.debug.log('Flushing events...');
        await core.flush(2000);
        debugBuild.DEBUG_BUILD && core.debug.log('Done flushing events');
    } catch (e) {
        debugBuild.DEBUG_BUILD && core.debug.log('Error while flushing events:\n', e);
    }
}
exports.flushSafelyWithTimeout = flushSafelyWithTimeout; //# sourceMappingURL=responseEnd.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
/**
 * Capture the exception passed by nextjs to the `_error` page, adding context data as appropriate.
 *
 * @param contextOrProps The data passed to either `getInitialProps` or `render` by nextjs
 */ async function captureUnderscoreErrorException(contextOrProps) {
    const { req, res, err } = contextOrProps;
    // 404s (and other 400-y friends) can trigger `_error`, but we don't want to send them to Sentry
    const statusCode = res?.statusCode || contextOrProps.statusCode;
    if (statusCode && statusCode < 500) {
        return Promise.resolve();
    }
    // In previous versions of the suggested `_error.js` page in which this function is meant to be used, there was a
    // workaround for https://github.com/vercel/next.js/issues/8592 which involved an extra call to this function, in the
    // custom error component's `render` method, just in case it hadn't been called by `getInitialProps`. Now that that
    // issue has been fixed, the second call is unnecessary, but since it lives in user code rather than our code, users
    // have to be the ones to get rid of it, and guaraneteedly, not all of them will. So, rather than capture the error
    // twice, we just bail if we sense we're in that now-extraneous second call. (We can tell which function we're in
    // because Nextjs passes `pathname` to `getInitialProps` but not to `render`.)
    if (!contextOrProps.pathname) {
        return Promise.resolve();
    }
    core.withScope((scope)=>{
        if (req) {
            const normalizedRequest = core.httpRequestToRequestData(req);
            scope.setSDKProcessingMetadata({
                normalizedRequest
            });
        }
        // If third-party libraries (or users themselves) throw something falsy, we want to capture it as a message (which
        // is what passing a string to `captureException` will wind up doing)
        core.captureException(err || `_error.js called with falsy error (${err})`, {
            mechanism: {
                type: 'instrument',
                handled: false,
                data: {
                    function: '_error.getInitialProps'
                }
            }
        });
    });
    core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
}
exports.captureUnderscoreErrorException = captureUnderscoreErrorException; //# sourceMappingURL=_error.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)");
/**
 * Wraps a function that potentially throws. If it does, the error is passed to `captureException` and rethrown.
 *
 * Note: This function turns the wrapped function into an asynchronous one.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorInstrumentation(origFunction) {
    return async function(...origFunctionArguments) {
        try {
            return await origFunction.apply(this, origFunctionArguments);
        } catch (e) {
            // TODO: Extract error logic from `withSentry` in here or create a new wrapper with said logic or something like that.
            core.captureException(e, {
                mechanism: {
                    handled: false
                }
            });
            throw e;
        }
    };
}
/**
 * Calls a server-side data fetching function (that takes a `req` and `res` object in its context) with tracing
 * instrumentation. A transaction will be created for the incoming request (if it doesn't already exist) in addition to
 * a span for the wrapped data fetching function.
 *
 * All of the above happens in an isolated domain, meaning all thrown errors will be associated with the correct span.
 *
 * @param origDataFetcher The data fetching method to call.
 * @param origFunctionArguments The arguments to call the data fetching method with.
 * @param req The data fetching function's request object.
 * @param res The data fetching function's response object.
 * @param options Options providing details for the created transaction and span.
 * @returns what the data fetching method call returned.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function withTracedServerSideDataFetcher(origDataFetcher, req, res, options) {
    return async function(...args) {
        const normalizedRequest = core.httpRequestToRequestData(req);
        core.getCurrentScope().setTransactionName(`${options.dataFetchingMethodName} (${options.dataFetcherRouteName})`);
        core.getIsolationScope().setSDKProcessingMetadata({
            normalizedRequest
        });
        const span = core.getActiveSpan();
        // Only set the route backfill if the span is not for /_error
        if (span && options.requestedRouteName !== '/_error') {
            const root = core.getRootSpan(span);
            root.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL, options.requestedRouteName);
        }
        const { 'sentry-trace': sentryTrace, baggage } = core.getTraceData();
        return {
            sentryTrace: sentryTrace,
            baggage: baggage,
            data: await origDataFetcher.apply(this, args)
        };
    };
}
/**
 * Call a data fetcher and trace it. Only traces the function if there is an active transaction on the scope.
 *
 * We only do the following until we move transaction creation into this function: When called, the wrapped function
 * will also update the name of the active transaction with a parameterized route provided via the `options` argument.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callDataFetcherTraced(origFunction, origFunctionArgs) {
    try {
        return await origFunction(...origFunctionArgs);
    } catch (e) {
        core.captureException(e, {
            mechanism: {
                handled: false
            }
        });
        throw e;
    }
}
/**
 * Extracts the params and searchParams from the props object.
 *
 * Depending on the next version, params and searchParams may be a promise which we do not want to resolve in this function.
 */ function maybeExtractSynchronousParamsAndSearchParams(props) {
    let params = props && typeof props === 'object' && 'params' in props ? props.params : undefined;
    if (core.isThenable(params)) {
        params = undefined;
    }
    let searchParams = props && typeof props === 'object' && 'searchParams' in props ? props.searchParams : undefined;
    if (core.isThenable(searchParams)) {
        searchParams = undefined;
    }
    return {
        params,
        searchParams
    };
}
exports.callDataFetcherTraced = callDataFetcherTraced;
exports.maybeExtractSynchronousParamsAndSearchParams = maybeExtractSynchronousParamsAndSearchParams;
exports.withErrorInstrumentation = withErrorInstrumentation;
exports.withTracedServerSideDataFetcher = withTracedServerSideDataFetcher; //# sourceMappingURL=wrapperUtils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getStaticProps` function
 *
 * @param origGetStaticProps The user's `getStaticProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetStaticPropsWithSentry(origGetStaticPropsa, _parameterizedRoute) {
    return new Proxy(origGetStaticPropsa, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const errorWrappedGetStaticProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            return wrapperUtils.callDataFetcherTraced(errorWrappedGetStaticProps, args);
        }
    });
}
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry; //# sourceMappingURL=wrapGetStaticPropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function
 *
 * @param origGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetInitialPropsWithSentry(origGetInitialProps) {
    return new Proxy(origGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: context.pathname,
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: initialProps, baggage, sentryTrace } = await tracedGetInitialProps.apply(thisArg, args) ?? {}; // Next.js allows undefined to be returned from a getInitialPropsFunction.
                if (typeof initialProps === 'object' && initialProps !== null) {
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (sentryTrace) {
                        initialProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        initialProps._sentryBaggage = baggage;
                    }
                }
                return initialProps;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry; //# sourceMappingURL=wrapGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom app ("_app.js").
 *
 * @param origAppGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapAppGetInitialPropsWithSentry(origAppGetInitialProps) {
    return new Proxy(origAppGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context.ctx;
            const errorWrappedAppGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedAppGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_app',
                    requestedRouteName: context.ctx.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: appGetInitialProps, sentryTrace, baggage } = await tracedGetInitialProps.apply(thisArg, args);
                if (typeof appGetInitialProps === 'object' && appGetInitialProps !== null) {
                    // Per definition, `pageProps` is not optional, however an increased amount of users doesn't seem to call
                    // `App.getInitialProps(appContext)` in their custom `_app` pages which is required as per
                    // https://nextjs.org/docs/advanced-features/custom-app - resulting in missing `pageProps`.
                    // For this reason, we just handle the case where `pageProps` doesn't exist explicitly.
                    if (!appGetInitialProps.pageProps) {
                        appGetInitialProps.pageProps = {};
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (sentryTrace) {
                        appGetInitialProps.pageProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        appGetInitialProps.pageProps._sentryBaggage = baggage;
                    }
                }
                return appGetInitialProps;
            } else {
                return errorWrappedAppGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry; //# sourceMappingURL=wrapAppGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom document ("_document.js").
 *
 * @param origDocumentGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapDocumentGetInitialPropsWithSentry(origDocumentGetInitialProps) {
    return new Proxy(origDocumentGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_document',
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data } = await tracedGetInitialProps.apply(thisArg, args);
                return data;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry; //# sourceMappingURL=wrapDocumentGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getInitialProps` function in
 * a custom error page ("_error.js").
 *
 * @param origErrorGetInitialProps The user's `getInitialProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapErrorGetInitialPropsWithSentry(origErrorGetInitialProps) {
    return new Proxy(origErrorGetInitialProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetInitialProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            // Generally we can assume that `req` and `res` are always defined on the server:
            // https://nextjs.org/docs/api-reference/data-fetching/get-initial-props#context-object
            // This does not seem to be the case in dev mode. Because we have no clean way of associating the the data fetcher
            // span with each other when there are no req or res objects, we simply do not trace them at all here.
            if (req && res) {
                const tracedGetInitialProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetInitialProps, req, res, {
                    dataFetcherRouteName: '/_error',
                    requestedRouteName: context.pathname,
                    dataFetchingMethodName: 'getInitialProps'
                });
                const { data: errorGetInitialProps, baggage, sentryTrace } = await tracedGetInitialProps.apply(thisArg, args);
                if (typeof errorGetInitialProps === 'object' && errorGetInitialProps !== null) {
                    if (sentryTrace) {
                        // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                        errorGetInitialProps._sentryTraceData = sentryTrace;
                    }
                    // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                    if (baggage) {
                        errorGetInitialProps._sentryBaggage = baggage;
                    }
                }
                return errorGetInitialProps;
            } else {
                return errorWrappedGetInitialProps.apply(thisArg, args);
            }
        }
    });
}
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry; //# sourceMappingURL=wrapErrorGetInitialPropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Create a wrapped version of the user's exported `getServerSideProps` function
 *
 * @param origGetServerSideProps The user's `getServerSideProps` function
 * @param parameterizedRoute The page's parameterized route
 * @returns A wrapped version of the function
 */ function wrapGetServerSidePropsWithSentry(origGetServerSideProps, parameterizedRoute) {
    return new Proxy(origGetServerSideProps, {
        apply: async (wrappingTarget, thisArg, args)=>{
            if (isBuild.isBuild()) {
                return wrappingTarget.apply(thisArg, args);
            }
            const [context] = args;
            const { req, res } = context;
            const errorWrappedGetServerSideProps = wrapperUtils.withErrorInstrumentation(wrappingTarget);
            const tracedGetServerSideProps = wrapperUtils.withTracedServerSideDataFetcher(errorWrappedGetServerSideProps, req, res, {
                dataFetcherRouteName: parameterizedRoute,
                requestedRouteName: parameterizedRoute,
                dataFetchingMethodName: 'getServerSideProps'
            });
            const { data: serverSideProps, baggage, sentryTrace } = await tracedGetServerSideProps.apply(thisArg, args);
            if (typeof serverSideProps === 'object' && serverSideProps !== null && 'props' in serverSideProps) {
                // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                if (sentryTrace) {
                    serverSideProps.props._sentryTraceData = sentryTrace;
                }
                // The Next.js serializer throws on undefined values so we need to guard for it (#12102)
                if (baggage) {
                    serverSideProps.props._sentryBaggage = baggage;
                }
            }
            return serverSideProps;
        }
    });
}
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry; //# sourceMappingURL=wrapGetServerSidePropsWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Determines whether input is a Next.js not-found error.
 * https://beta.nextjs.org/docs/api-reference/notfound#notfound
 */ function isNotFoundNavigationError(subject) {
    return core.isError(subject) && [
        'NEXT_NOT_FOUND',
        'NEXT_HTTP_ERROR_FALLBACK;404'
    ].includes(subject.digest);
}
/**
 * Determines whether input is a Next.js redirect error.
 * https://beta.nextjs.org/docs/api-reference/redirect#redirect
 */ function isRedirectNavigationError(subject) {
    return core.isError(subject) && typeof subject.digest === 'string' && subject.digest.startsWith('NEXT_REDIRECT;') // a redirect digest looks like "NEXT_REDIRECT;[redirect path]"
    ;
}
exports.isNotFoundNavigationError = isNotFoundNavigationError;
exports.isRedirectNavigationError = isRedirectNavigationError; //# sourceMappingURL=nextNavigationErrorUtils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)");
const commonPropagationContextMap = new WeakMap();
/**
 * Takes a shared (garbage collectable) object between resources, e.g. a headers object shared between Next.js server components and returns a common propagation context.
 *
 * @param commonObject The shared object.
 * @param propagationContext The propagation context that should be shared between all the resources if no propagation context was registered yet.
 * @returns the shared propagation context.
 */ function commonObjectToPropagationContext(commonObject, propagationContext) {
    if (typeof commonObject === 'object' && commonObject) {
        const memoPropagationContext = commonPropagationContextMap.get(commonObject);
        if (memoPropagationContext) {
            return memoPropagationContext;
        } else {
            commonPropagationContextMap.set(commonObject, propagationContext);
            return propagationContext;
        }
    } else {
        return propagationContext;
    }
}
const commonIsolationScopeMap = new WeakMap();
/**
 * Takes a shared (garbage collectable) object between resources, e.g. a headers object shared between Next.js server components and returns a common propagation context.
 *
 * @param commonObject The shared object.
 * @param isolationScope The isolationScope that should be shared between all the resources if no isolation scope was created yet.
 * @returns the shared isolation scope.
 */ function commonObjectToIsolationScope(commonObject) {
    if (typeof commonObject === 'object' && commonObject) {
        const memoIsolationScope = commonIsolationScopeMap.get(commonObject);
        if (memoIsolationScope) {
            return memoIsolationScope;
        } else {
            const newIsolationScope = new core.Scope();
            commonIsolationScopeMap.set(commonObject, newIsolationScope);
            return newIsolationScope;
        }
    } else {
        return new core.Scope();
    }
}
let nextjsEscapedAsyncStorage;
/**
 * Will mark the execution context of the callback as "escaped" from Next.js internal tracing by unsetting the active
 * span and propagation context. When an execution passes through this function multiple times, it is a noop after the
 * first time.
 */ function escapeNextjsTracing(cb) {
    const MaybeGlobalAsyncLocalStorage = core.GLOBAL_OBJ.AsyncLocalStorage;
    if (!MaybeGlobalAsyncLocalStorage) {
        debugBuild.DEBUG_BUILD && core.debug.warn("Tried to register AsyncLocalStorage async context strategy in a runtime that doesn't support AsyncLocalStorage.");
        return cb();
    }
    if (!nextjsEscapedAsyncStorage) {
        nextjsEscapedAsyncStorage = new MaybeGlobalAsyncLocalStorage();
    }
    if (nextjsEscapedAsyncStorage.getStore()) {
        return cb();
    } else {
        return core.startNewTrace(()=>{
            return nextjsEscapedAsyncStorage.run(true, ()=>{
                return cb();
            });
        });
    }
}
/**
 * Ideally this function never lands in the develop branch.
 *
 * Drops the entire span tree this function was called in, if it was a span tree created by Next.js.
 */ function dropNextjsRootContext() {
    const nextJsOwnedSpan = core.getActiveSpan();
    if (nextJsOwnedSpan) {
        const rootSpan = core.getRootSpan(nextJsOwnedSpan);
        const rootSpanAttributes = core.spanToJSON(rootSpan).data;
        if (rootSpanAttributes?.['next.span_type']) {
            core.getRootSpan(nextJsOwnedSpan)?.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION, true);
        }
    }
}
exports.commonObjectToIsolationScope = commonObjectToIsolationScope;
exports.commonObjectToPropagationContext = commonObjectToPropagationContext;
exports.dropNextjsRootContext = dropNextjsRootContext;
exports.escapeNextjsTracing = escapeNextjsTracing; //# sourceMappingURL=tracingUtils.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/urls.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const HeaderKeys = {
    FORWARDED_PROTO: 'x-forwarded-proto',
    FORWARDED_HOST: 'x-forwarded-host',
    HOST: 'host',
    REFERER: 'referer'
};
/**
 * Replaces route parameters in a path template with their values
 * @param path - The path template containing parameters in [paramName] format
 * @param params - Optional route parameters to replace in the template
 * @returns The path with parameters replaced
 */ function substituteRouteParams(path, params) {
    if (!params || typeof params !== 'object') return path;
    let resultPath = path;
    for (const [key, value] of Object.entries(params)){
        resultPath = resultPath.split(`[${key}]`).join(encodeURIComponent(value));
    }
    return resultPath;
}
/**
 * Normalizes a path by removing route groups
 * @param path - The path to normalize
 * @returns The normalized path
 */ function sanitizeRoutePath(path) {
    const cleanedSegments = path.split('/').filter((segment)=>segment && !(segment.startsWith('(') && segment.endsWith(')')));
    return cleanedSegments.length > 0 ? `/${cleanedSegments.join('/')}` : '/';
}
/**
 * Constructs a full URL from the component route, parameters, and headers.
 *
 * @param componentRoute - The route template to construct the URL from
 * @param params - Optional route parameters to replace in the template
 * @param headersDict - Optional headers containing protocol and host information
 * @param pathname - Optional pathname coming from parent span "http.target"
 * @returns A sanitized URL string
 */ function buildUrlFromComponentRoute(componentRoute, params, headersDict, pathname) {
    const parameterizedPath = substituteRouteParams(componentRoute, params);
    // If available, the pathname from the http.target of the HTTP request server span takes precedence over the parameterized path.
    // Spans such as generateMetadata and Server Component rendering are typically direct children of that span.
    const path = pathname ?? sanitizeRoutePath(parameterizedPath);
    const protocol = headersDict?.[HeaderKeys.FORWARDED_PROTO];
    const host = headersDict?.[HeaderKeys.FORWARDED_HOST] || headersDict?.[HeaderKeys.HOST];
    if (!protocol || !host) {
        return path;
    }
    const fullUrl = `${protocol}://${host}${path}`;
    const urlObject = core.parseStringToURLObject(fullUrl);
    if (!urlObject) {
        return path;
    }
    return core.getSanitizedUrlStringFromUrlObject(urlObject);
}
/**
 * Returns a sanitized URL string from the referer header if it exists and is valid.
 *
 * @param headersDict - Optional headers containing the referer
 * @returns A sanitized URL string or undefined if referer is missing/invalid
 */ function extractSanitizedUrlFromRefererHeader(headersDict) {
    const referer = headersDict?.[HeaderKeys.REFERER];
    if (!referer) {
        return undefined;
    }
    try {
        const refererUrl = new URL(referer);
        return core.getSanitizedUrlStringFromUrlObject(refererUrl);
    } catch  {
        return undefined;
    }
}
/**
 * Returns a sanitized URL string using the referer header if available,
 * otherwise constructs the URL from the component route, params, and headers.
 *
 * @param componentRoute - The route template to construct the URL from
 * @param params - Optional route parameters to replace in the template
 * @param headersDict - Optional headers containing protocol, host, and referer
 * @param pathname - Optional pathname coming from root span "http.target"
 * @returns A sanitized URL string
 */ function getSanitizedRequestUrl(componentRoute, params, headersDict, pathname) {
    const refererUrl = extractSanitizedUrlFromRefererHeader(headersDict);
    if (refererUrl) {
        return refererUrl;
    }
    return buildUrlFromComponentRoute(componentRoute, params, headersDict, pathname);
}
exports.buildUrlFromComponentRoute = buildUrlFromComponentRoute;
exports.extractSanitizedUrlFromRefererHeader = extractSanitizedUrlFromRefererHeader;
exports.getSanitizedRequestUrl = getSanitizedRequestUrl;
exports.sanitizeRoutePath = sanitizeRoutePath;
exports.substituteRouteParams = substituteRouteParams; //# sourceMappingURL=urls.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-ssr] (ecmascript)");
const urls = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/urls.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Wraps an `app` directory server component with Sentry error instrumentation.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapServerComponentWithSentry(appDirComponent, context) {
    const { componentRoute, componentType } = context;
    // Even though users may define server components as async functions, for the client bundles
    // Next.js will turn them into synchronous functions and it will transform any `await`s into instances of the `use`
    // hook. 🤯
    return new Proxy(appDirComponent, {
        apply: (originalFunction, thisArg, args)=>{
            const requestTraceId = core.getActiveSpan()?.spanContext().traceId;
            const isolationScope = tracingUtils.commonObjectToIsolationScope(context.headers);
            let pathname = undefined;
            const activeSpan = core.getActiveSpan();
            if (activeSpan) {
                const rootSpan = core.getRootSpan(activeSpan);
                const { scope } = core.getCapturedScopesOnSpan(rootSpan);
                core.setCapturedScopesOnSpan(rootSpan, scope ?? new core.Scope(), isolationScope);
                const spanData = core.spanToJSON(rootSpan);
                if (spanData.data && 'http.target' in spanData.data) {
                    pathname = spanData.data['http.target']?.toString();
                }
            }
            const headersDict = context.headers ? core.winterCGHeadersToDict(context.headers) : undefined;
            let params = undefined;
            if (core.getClient()?.getOptions().sendDefaultPii) {
                const props = args[0];
                const { params: paramsFromProps } = wrapperUtils.maybeExtractSynchronousParamsAndSearchParams(props);
                params = paramsFromProps;
            }
            isolationScope.setSDKProcessingMetadata({
                normalizedRequest: {
                    headers: headersDict,
                    url: urls.getSanitizedRequestUrl(componentRoute, params, headersDict, pathname)
                }
            });
            return core.withIsolationScope(isolationScope, ()=>{
                return core.withScope((scope)=>{
                    scope.setTransactionName(`${componentType} Server Component (${componentRoute})`);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const activeSpan = core.getActiveSpan();
                    if (activeSpan) {
                        const rootSpan = core.getRootSpan(activeSpan);
                        const sentryTrace = headersDict?.['sentry-trace'];
                        if (sentryTrace) {
                            rootSpan.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL, sentryTrace);
                        }
                    }
                    return core.startSpanManual({
                        op: 'function.nextjs',
                        name: `${componentType} Server Component (${componentRoute})`,
                        attributes: {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'component',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs',
                            'sentry.nextjs.ssr.function.type': componentType,
                            'sentry.nextjs.ssr.function.route': componentRoute
                        }
                    }, (span)=>{
                        return core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (error)=>{
                            // When you read this code you might think: "Wait a minute, shouldn't we set the status on the root span too?"
                            // The answer is: "No." - The status of the root span is determined by whatever status code Next.js decides to put on the response.
                            if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                                // We don't want to report "not-found"s
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                            } else if (nextNavigationErrorUtils.isRedirectNavigationError(error)) {
                                // We don't want to report redirects
                                span.setStatus({
                                    code: core.SPAN_STATUS_OK
                                });
                            } else {
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.captureException(error, {
                                    mechanism: {
                                        handled: false
                                    }
                                });
                            }
                        }, ()=>{
                            span.end();
                            core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
                        });
                    });
                });
            });
        }
    });
}
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry; //# sourceMappingURL=wrapServerComponentWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-ssr] (ecmascript)");
/**
 * Wraps a Next.js App Router Route handler with Sentry error and performance instrumentation.
 *
 * NOTICE: This wrapper is for App Router API routes. If you are looking to wrap Pages Router API routes use `wrapApiHandlerWithSentry` instead.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapRouteHandlerWithSentry(routeHandler, context) {
    const { method, parameterizedRoute, headers } = context;
    return new Proxy(routeHandler, {
        apply: async (originalFunction, thisArg, args)=>{
            const activeSpan = core.getActiveSpan();
            const rootSpan = activeSpan ? core.getRootSpan(activeSpan) : undefined;
            let edgeRuntimeIsolationScopeOverride;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return core.withIsolationScope(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : core.getIsolationScope(), ()=>{
                return core.withScope(async (scope)=>{
                    scope.setTransactionName(`${method} ${parameterizedRoute}`);
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const response = await core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (error)=>{
                        // Next.js throws errors when calling `redirect()`. We don't wanna report these.
                        if (nextNavigationErrorUtils.isRedirectNavigationError(error)) ;
                        else if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                            if (activeSpan) {
                                core.setHttpStatus(activeSpan, 404);
                            }
                            if (rootSpan) {
                                core.setHttpStatus(rootSpan, 404);
                            }
                        } else {
                            core.captureException(error, {
                                mechanism: {
                                    handled: false
                                }
                            });
                        }
                    }, ()=>{
                        core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
                    });
                    try {
                        if (response.status) {
                            if (activeSpan) {
                                core.setHttpStatus(activeSpan, response.status);
                            }
                            if (rootSpan) {
                                core.setHttpStatus(rootSpan, response.status);
                            }
                        }
                    } catch  {
                    // best effort - response may be undefined?
                    }
                    return response;
                });
            });
        }
    });
}
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry; //# sourceMappingURL=wrapRouteHandlerWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
/**
 * Wraps a function with Sentry crons instrumentation by automatically sending check-ins for the given Vercel crons config.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapApiHandlerWithSentryVercelCrons(handler, vercelCronsConfig) {
    return new Proxy(handler, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        apply: (originalFunction, thisArg, args)=>{
            if (!args?.[0]) {
                return originalFunction.apply(thisArg, args);
            }
            const [req] = args;
            let maybePromiseResult;
            const cronsKey = 'nextUrl' in req ? req.nextUrl.pathname : req.url;
            const userAgentHeader = 'nextUrl' in req ? req.headers.get('user-agent') : req.headers['user-agent'];
            if (!vercelCronsConfig || // do nothing if vercel crons config is missing
            !userAgentHeader?.includes('vercel-cron') // do nothing if endpoint is not called from vercel crons
            ) {
                return originalFunction.apply(thisArg, args);
            }
            const vercelCron = vercelCronsConfig.find((vercelCron)=>vercelCron.path === cronsKey);
            if (!vercelCron?.path || !vercelCron.schedule) {
                return originalFunction.apply(thisArg, args);
            }
            const monitorSlug = vercelCron.path;
            const checkInId = core.captureCheckIn({
                monitorSlug,
                status: 'in_progress'
            }, {
                maxRuntime: 60 * 12,
                schedule: {
                    type: 'crontab',
                    value: vercelCron.schedule
                }
            });
            const startTime = Date.now() / 1000;
            const handleErrorCase = ()=>{
                core.captureCheckIn({
                    checkInId,
                    monitorSlug,
                    status: 'error',
                    duration: Date.now() / 1000 - startTime
                });
            };
            try {
                maybePromiseResult = originalFunction.apply(thisArg, args);
            } catch (e) {
                handleErrorCase();
                throw e;
            }
            if (typeof maybePromiseResult === 'object' && maybePromiseResult !== null && 'then' in maybePromiseResult) {
                Promise.resolve(maybePromiseResult).then(()=>{
                    core.captureCheckIn({
                        checkInId,
                        monitorSlug,
                        status: 'ok',
                        duration: Date.now() / 1000 - startTime
                    });
                }, ()=>{
                    handleErrorCase();
                });
                // It is very important that we return the original promise here, because Next.js attaches various properties
                // to that promise and will throw if they are not on the returned value.
                return maybePromiseResult;
            } else {
                core.captureCheckIn({
                    checkInId,
                    monitorSlug,
                    status: 'ok',
                    duration: Date.now() / 1000 - startTime
                });
                return maybePromiseResult;
            }
        }
    });
}
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons; //# sourceMappingURL=wrapApiHandlerWithSentryVercelCrons.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
/**
 * Wraps Next.js middleware with Sentry error and performance instrumentation.
 *
 * @param middleware The middleware handler.
 * @returns a wrapped middleware handler.
 */ function wrapMiddlewareWithSentry(middleware) {
    return new Proxy(middleware, {
        apply: async (wrappingTarget, thisArg, args)=>{
            const tunnelRoute = '_sentryRewritesTunnelPath' in globalThis ? globalThis._sentryRewritesTunnelPath : undefined;
            if (tunnelRoute && typeof tunnelRoute === 'string') {
                const req = args[0];
                // Check if the current request matches the tunnel route
                if (req instanceof Request) {
                    const url = new URL(req.url);
                    const isTunnelRequest = url.pathname.startsWith(tunnelRoute);
                    if (isTunnelRequest) {
                        // Create a simple response that mimics NextResponse.next() so we don't need to import internals here
                        // which breaks next 13 apps
                        // https://github.com/vercel/next.js/blob/c12c9c1f78ad384270902f0890dc4cd341408105/packages/next/src/server/web/spec-extension/response.ts#L146
                        return new Response(null, {
                            status: 200,
                            headers: {
                                'x-middleware-next': '1'
                            }
                        });
                    }
                }
            }
            // TODO: We still should add central isolation scope creation for when our build-time instrumentation does not work anymore with turbopack.
            return core.withIsolationScope((isolationScope)=>{
                const req = args[0];
                const currentScope = core.getCurrentScope();
                let spanName;
                let spanSource;
                if (req instanceof Request) {
                    isolationScope.setSDKProcessingMetadata({
                        normalizedRequest: core.winterCGRequestToRequestData(req)
                    });
                    spanName = `middleware ${req.method} ${new URL(req.url).pathname}`;
                    spanSource = 'url';
                } else {
                    spanName = 'middleware';
                    spanSource = 'component';
                }
                currentScope.setTransactionName(spanName);
                const activeSpan = core.getActiveSpan();
                if (activeSpan) {
                    // If there is an active span, it likely means that the automatic Next.js OTEL instrumentation worked and we can
                    // rely on that for parameterization.
                    spanName = 'middleware';
                    spanSource = 'component';
                    const rootSpan = core.getRootSpan(activeSpan);
                    if (rootSpan) {
                        core.setCapturedScopesOnSpan(rootSpan, currentScope, isolationScope);
                    }
                }
                return core.startSpan({
                    name: spanName,
                    op: 'http.server.middleware',
                    attributes: {
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: spanSource,
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs.wrapMiddlewareWithSentry'
                    }
                }, ()=>{
                    return core.handleCallbackErrors(()=>wrappingTarget.apply(thisArg, args), (error)=>{
                        core.captureException(error, {
                            mechanism: {
                                type: 'instrument',
                                handled: false
                            }
                        });
                    }, ()=>{
                        core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
                    });
                });
            });
        }
    });
}
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry; //# sourceMappingURL=wrapMiddlewareWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
function isReactClassComponent(target) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return typeof target === 'function' && target?.prototype?.isReactComponent;
}
/**
 * Wraps a page component with Sentry error instrumentation.
 */ function wrapPageComponentWithSentry(pageComponent) {
    if (isReactClassComponent(pageComponent)) {
        return class SentryWrappedPageComponent extends pageComponent {
            render(...args) {
                return core.withIsolationScope(()=>{
                    const scope = core.getCurrentScope();
                    // We extract the sentry trace data that is put in the component props by datafetcher wrappers
                    const sentryTraceData = typeof this.props === 'object' && this.props !== null && '_sentryTraceData' in this.props && typeof this.props._sentryTraceData === 'string' ? this.props._sentryTraceData : undefined;
                    if (sentryTraceData) {
                        const traceparentData = core.extractTraceparentData(sentryTraceData);
                        scope.setContext('trace', {
                            span_id: traceparentData?.parentSpanId,
                            trace_id: traceparentData?.traceId
                        });
                    }
                    try {
                        return super.render(...args);
                    } catch (e) {
                        core.captureException(e, {
                            mechanism: {
                                handled: false
                            }
                        });
                        throw e;
                    }
                });
            }
        };
    } else if (typeof pageComponent === 'function') {
        return new Proxy(pageComponent, {
            apply (target, thisArg, argArray) {
                return core.withIsolationScope(()=>{
                    const scope = core.getCurrentScope();
                    // We extract the sentry trace data that is put in the component props by datafetcher wrappers
                    const sentryTraceData = argArray?.[0]?._sentryTraceData;
                    if (sentryTraceData) {
                        const traceparentData = core.extractTraceparentData(sentryTraceData);
                        scope.setContext('trace', {
                            span_id: traceparentData?.parentSpanId,
                            trace_id: traceparentData?.traceId
                        });
                    }
                    try {
                        return target.apply(thisArg, argArray);
                    } catch (e) {
                        core.captureException(e, {
                            mechanism: {
                                handled: false
                            }
                        });
                        throw e;
                    }
                });
            }
        });
    } else {
        return pageComponent;
    }
}
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry; //# sourceMappingURL=wrapPageComponentWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-ssr] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-ssr] (ecmascript)");
const urls = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/urls.js [app-ssr] (ecmascript)");
const wrapperUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/wrapperUtils.js [app-ssr] (ecmascript)");
/**
 * Wraps a generation function (e.g. generateMetadata) with Sentry error and performance instrumentation.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function wrapGenerationFunctionWithSentry(generationFunction, context) {
    const { requestAsyncStorage, componentRoute, componentType, generationFunctionIdentifier } = context;
    return new Proxy(generationFunction, {
        apply: (originalFunction, thisArg, args)=>{
            const requestTraceId = core.getActiveSpan()?.spanContext().traceId;
            let headers = undefined;
            // We try-catch here just in case anything goes wrong with the async storage here goes wrong since it is Next.js internal API
            try {
                headers = requestAsyncStorage?.getStore()?.headers;
            } catch  {
            /** empty */ }
            const isolationScope = tracingUtils.commonObjectToIsolationScope(headers);
            let pathname = undefined;
            const activeSpan = core.getActiveSpan();
            if (activeSpan) {
                const rootSpan = core.getRootSpan(activeSpan);
                const { scope } = core.getCapturedScopesOnSpan(rootSpan);
                core.setCapturedScopesOnSpan(rootSpan, scope ?? new core.Scope(), isolationScope);
                const spanData = core.spanToJSON(rootSpan);
                if (spanData.data && 'http.target' in spanData.data) {
                    pathname = spanData.data['http.target'];
                }
            }
            const headersDict = headers ? core.winterCGHeadersToDict(headers) : undefined;
            let data = undefined;
            if (core.getClient()?.getOptions().sendDefaultPii) {
                const props = args[0];
                const { params, searchParams } = wrapperUtils.maybeExtractSynchronousParamsAndSearchParams(props);
                data = {
                    params,
                    searchParams
                };
            }
            return core.withIsolationScope(isolationScope, ()=>{
                return core.withScope((scope)=>{
                    scope.setTransactionName(`${componentType}.${generationFunctionIdentifier} (${componentRoute})`);
                    isolationScope.setSDKProcessingMetadata({
                        normalizedRequest: {
                            headers: headersDict,
                            url: urls.getSanitizedRequestUrl(componentRoute, data?.params, headersDict, pathname)
                        }
                    });
                    const activeSpan = core.getActiveSpan();
                    if (activeSpan) {
                        const rootSpan = core.getRootSpan(activeSpan);
                        const sentryTrace = headersDict?.['sentry-trace'];
                        if (sentryTrace) {
                            rootSpan.setAttribute(spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL, sentryTrace);
                        }
                    }
                    const propagationContext = tracingUtils.commonObjectToPropagationContext(headers, core.propagationContextFromHeaders(headersDict?.['sentry-trace'], headersDict?.['baggage']));
                    if (requestTraceId) {
                        propagationContext.traceId = requestTraceId;
                    }
                    scope.setPropagationContext(propagationContext);
                    scope.setExtra('route_data', data);
                    return core.startSpanManual({
                        op: 'function.nextjs',
                        name: `${componentType}.${generationFunctionIdentifier} (${componentRoute})`,
                        attributes: {
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
                            [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.function.nextjs',
                            'sentry.nextjs.ssr.function.type': generationFunctionIdentifier,
                            'sentry.nextjs.ssr.function.route': componentRoute
                        }
                    }, (span)=>{
                        return core.handleCallbackErrors(()=>originalFunction.apply(thisArg, args), (err)=>{
                            // When you read this code you might think: "Wait a minute, shouldn't we set the status on the root span too?"
                            // The answer is: "No." - The status of the root span is determined by whatever status code Next.js decides to put on the response.
                            if (nextNavigationErrorUtils.isNotFoundNavigationError(err)) {
                                // We don't want to report "not-found"s
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                                core.getRootSpan(span).setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'not_found'
                                });
                            } else if (nextNavigationErrorUtils.isRedirectNavigationError(err)) {
                                // We don't want to report redirects
                                span.setStatus({
                                    code: core.SPAN_STATUS_OK
                                });
                            } else {
                                span.setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.getRootSpan(span).setStatus({
                                    code: core.SPAN_STATUS_ERROR,
                                    message: 'internal_error'
                                });
                                core.captureException(err, {
                                    mechanism: {
                                        handled: false
                                    }
                                });
                            }
                        }, ()=>{
                            span.end();
                        });
                    });
                });
            });
        }
    });
}
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry; //# sourceMappingURL=wrapGenerationFunctionWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)");
const nextNavigationErrorUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/nextNavigationErrorUtils.js [app-ssr] (ecmascript)");
/**
 * Wraps a Next.js Server Action implementation with Sentry Error and Performance instrumentation.
 */ function withServerActionInstrumentation(...args) {
    if (typeof args[1] === 'function') {
        const [serverActionName, callback] = args;
        return withServerActionInstrumentationImplementation(serverActionName, {}, callback);
    } else {
        const [serverActionName, options, callback] = args;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return withServerActionInstrumentationImplementation(serverActionName, options, callback);
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function withServerActionInstrumentationImplementation(serverActionName, options, callback) {
    return core.withIsolationScope(async (isolationScope)=>{
        const sendDefaultPii = core.getClient()?.getOptions().sendDefaultPii;
        let sentryTraceHeader;
        let baggageHeader;
        const fullHeadersObject = {};
        try {
            const awaitedHeaders = await options.headers;
            sentryTraceHeader = awaitedHeaders?.get('sentry-trace') ?? undefined;
            baggageHeader = awaitedHeaders?.get('baggage');
            awaitedHeaders?.forEach((value, key)=>{
                fullHeadersObject[key] = value;
            });
        } catch  {
            debugBuild.DEBUG_BUILD && core.debug.warn("Sentry wasn't able to extract the tracing headers for a server action. Will not trace this request.");
        }
        isolationScope.setTransactionName(`serverAction/${serverActionName}`);
        isolationScope.setSDKProcessingMetadata({
            normalizedRequest: {
                headers: fullHeadersObject
            }
        });
        // Normally, there is an active span here (from Next.js OTEL) and we just use that as parent
        // Else, we manually continueTrace from the incoming headers
        const continueTraceIfNoActiveSpan = core.getActiveSpan() ? (_opts, callback)=>callback() : core.continueTrace;
        return continueTraceIfNoActiveSpan({
            sentryTrace: sentryTraceHeader,
            baggage: baggageHeader
        }, async ()=>{
            try {
                return await core.startSpan({
                    op: 'function.server_action',
                    name: `serverAction/${serverActionName}`,
                    forceTransaction: true,
                    attributes: {
                        [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route'
                    }
                }, async (span)=>{
                    const result = await core.handleCallbackErrors(callback, (error)=>{
                        if (nextNavigationErrorUtils.isNotFoundNavigationError(error)) {
                            // We don't want to report "not-found"s
                            span.setStatus({
                                code: core.SPAN_STATUS_ERROR,
                                message: 'not_found'
                            });
                        } else if (nextNavigationErrorUtils.isRedirectNavigationError(error)) {
                        // Don't do anything for redirects
                        } else {
                            span.setStatus({
                                code: core.SPAN_STATUS_ERROR,
                                message: 'internal_error'
                            });
                            core.captureException(error, {
                                mechanism: {
                                    handled: false
                                }
                            });
                        }
                    });
                    if (options.recordResponse !== undefined ? options.recordResponse : sendDefaultPii) {
                        core.getIsolationScope().setExtra('server_action_result', result);
                    }
                    if (options.formData) {
                        options.formData.forEach((value, key)=>{
                            core.getIsolationScope().setExtra(`server_action_form_data.${key}`, typeof value === 'string' ? value : '[non-string value]');
                        });
                    }
                    return result;
                });
            } finally{
                core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
            }
        });
    });
}
exports.withServerActionInstrumentation = withServerActionInstrumentation; //# sourceMappingURL=withServerActionInstrumentation.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
/**
 * Reports errors passed to the the Next.js `onRequestError` instrumentation hook.
 */ function captureRequestError(error, request, errorContext) {
    core.withScope((scope)=>{
        scope.setSDKProcessingMetadata({
            normalizedRequest: {
                headers: core.headersToDict(request.headers),
                method: request.method
            }
        });
        scope.setContext('nextjs', {
            request_path: request.path,
            router_kind: errorContext.routerKind,
            router_path: errorContext.routePath,
            route_type: errorContext.routeType
        });
        scope.setTransactionName(errorContext.routePath);
        core.captureException(error, {
            mechanism: {
                handled: false
            }
        });
        core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
    });
}
exports.captureRequestError = captureRequestError; //# sourceMappingURL=captureRequestError.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentry.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const responseEnd = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/responseEnd.js [app-ssr] (ecmascript)");
const tracingUtils = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/tracingUtils.js [app-ssr] (ecmascript)");
/**
 * Wrap the given API route handler with error nad performance monitoring.
 *
 * @param apiHandler The handler exported from the user's API page route file, which may or may not already be
 * wrapped with `withSentry`
 * @param parameterizedRoute The page's parameterized route.
 * @returns The wrapped handler which will always return a Promise.
 */ function wrapApiHandlerWithSentry(apiHandler, parameterizedRoute) {
    return new Proxy(apiHandler, {
        apply: (wrappingTarget, thisArg, args)=>{
            tracingUtils.dropNextjsRootContext();
            return tracingUtils.escapeNextjsTracing(()=>{
                const [req, res] = args;
                if (!req) {
                    core.debug.log(`Wrapped API handler on route "${parameterizedRoute}" was not passed a request object. Will not instrument.`);
                    return wrappingTarget.apply(thisArg, args);
                } else if (!res) {
                    core.debug.log(`Wrapped API handler on route "${parameterizedRoute}" was not passed a response object. Will not instrument.`);
                    return wrappingTarget.apply(thisArg, args);
                }
                // Prevent double wrapping of the same request.
                if (req.__withSentry_applied__) {
                    return wrappingTarget.apply(thisArg, args);
                }
                req.__withSentry_applied__ = true;
                return core.withIsolationScope((isolationScope)=>{
                    // Normally, there is an active span here (from Next.js OTEL) and we just use that as parent
                    // Else, we manually continueTrace from the incoming headers
                    const continueTraceIfNoActiveSpan = core.getActiveSpan() ? (_opts, callback)=>callback() : core.continueTrace;
                    return continueTraceIfNoActiveSpan({
                        sentryTrace: req.headers && core.isString(req.headers['sentry-trace']) ? req.headers['sentry-trace'] : undefined,
                        baggage: req.headers?.baggage
                    }, ()=>{
                        const reqMethod = `${(req.method || 'GET').toUpperCase()} `;
                        const normalizedRequest = core.httpRequestToRequestData(req);
                        isolationScope.setSDKProcessingMetadata({
                            normalizedRequest
                        });
                        isolationScope.setTransactionName(`${reqMethod}${parameterizedRoute}`);
                        return core.startSpanManual({
                            name: `${reqMethod}${parameterizedRoute}`,
                            op: 'http.server',
                            forceTransaction: true,
                            attributes: {
                                [core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: 'route',
                                [core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: 'auto.http.nextjs'
                            }
                        }, async (span)=>{
                            // eslint-disable-next-line @typescript-eslint/unbound-method
                            res.end = new Proxy(res.end, {
                                apply (target, thisArg, argArray) {
                                    core.setHttpStatus(span, res.statusCode);
                                    span.end();
                                    core.vercelWaitUntil(responseEnd.flushSafelyWithTimeout());
                                    return target.apply(thisArg, argArray);
                                }
                            });
                            try {
                                return await wrappingTarget.apply(thisArg, args);
                            } catch (e) {
                                // In case we have a primitive, wrap it in the equivalent wrapper class (string -> String, etc.) so that we can
                                // store a seen flag on it. (Because of the one-way-on-Vercel-one-way-off-of-Vercel approach we've been forced
                                // to take, it can happen that the same thrown object gets caught in two different ways, and flagging it is a
                                // way to prevent it from actually being reported twice.)
                                const objectifiedErr = core.objectify(e);
                                core.captureException(objectifiedErr, {
                                    mechanism: {
                                        type: 'instrument',
                                        handled: false,
                                        data: {
                                            wrapped_handler: wrappingTarget.name,
                                            function: 'withSentry'
                                        }
                                    }
                                });
                                core.setHttpStatus(span, 500);
                                span.end();
                                // we need to await the flush here to ensure that the error is captured
                                // as the runtime freezes as soon as the error is thrown below
                                await responseEnd.flushSafelyWithTimeout();
                                // We rethrow here so that nextjs can do with the error whatever it would normally do. (Sometimes "whatever it
                                // would normally do" is to allow the error to bubble up to the global handlers - another reason we need to mark
                                // the error as already having been captured.)
                                throw objectifiedErr;
                            }
                        });
                    });
                });
            });
        }
    });
}
exports.wrapApiHandlerWithSentry = wrapApiHandlerWithSentry; //# sourceMappingURL=wrapApiHandlerWithSentry.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/server/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const api = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/index.js [app-ssr] (ecmascript)");
const semanticConventions = __turbopack_context__.r("[project]/node_modules/.pnpm/@opentelemetry+semantic-conventions@1.36.0/node_modules/@opentelemetry/semantic-conventions/build/esm/index.js [app-ssr] (ecmascript)");
const core = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+core@10.5.0/node_modules/@sentry/core/build/cjs/index.js [app-ssr] (ecmascript)");
const node = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/index.js [app-ssr] (ecmascript)");
const opentelemetry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+opentelemetry@10.5.0_@opentelemetry+api@1.9.0_@opentelemetry+context-async-hook_d046852cd8b13461775ca0180081e7c3/node_modules/@sentry/opentelemetry/build/cjs/index.js [app-ssr] (ecmascript)");
const debugBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/debug-build.js [app-ssr] (ecmascript)");
const devErrorSymbolicationEventProcessor = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/devErrorSymbolicationEventProcessor.js [app-ssr] (ecmascript)");
const getVercelEnv = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/getVercelEnv.js [app-ssr] (ecmascript)");
const spanAttributesWithLogicAttached = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/span-attributes-with-logic-attached.js [app-ssr] (ecmascript)");
const isBuild = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/utils/isBuild.js [app-ssr] (ecmascript)");
const distDirRewriteFramesIntegration = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/server/distDirRewriteFramesIntegration.js [app-ssr] (ecmascript)");
const _error = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-ssr] (ecmascript)");
const wrapGetStaticPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapAppGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapDocumentGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapErrorGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapGetServerSidePropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-ssr] (ecmascript)");
const wrapServerComponentWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-ssr] (ecmascript)");
const wrapRouteHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-ssr] (ecmascript)");
const wrapApiHandlerWithSentryVercelCrons = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-ssr] (ecmascript)");
const wrapMiddlewareWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-ssr] (ecmascript)");
const wrapPageComponentWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-ssr] (ecmascript)");
const wrapGenerationFunctionWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-ssr] (ecmascript)");
const withServerActionInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-ssr] (ecmascript)");
const captureRequestError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-ssr] (ecmascript)");
const wrapApiHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentry.js [app-ssr] (ecmascript)");
const globalWithInjectedValues = core.GLOBAL_OBJ;
/**
 * A passthrough error boundary for the server that doesn't depend on any react. Error boundaries don't catch SSR errors
 * so they should simply be a passthrough.
 */ const ErrorBoundary = (props)=>{
    if (!props.children) {
        return null;
    }
    if (typeof props.children === 'function') {
        return props.children();
    }
    // since Next.js >= 10 requires React ^16.6.0 we are allowed to return children like this here
    return props.children;
};
/**
 * A passthrough redux enhancer for the server that doesn't depend on anything from the `@sentry/react` package.
 */ function createReduxEnhancer() {
    return (createStore)=>createStore;
}
/**
 * A passthrough error boundary wrapper for the server that doesn't depend on any react. Error boundaries don't catch
 * SSR errors so they should simply be a passthrough.
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function withErrorBoundary(WrappedComponent) {
    return WrappedComponent;
}
/**
 * Just a passthrough since we're on the server and showing the report dialog on the server doesn't make any sense.
 */ function showReportDialog() {
    return;
}
/** Inits the Sentry NextJS SDK on node. */ function init(options) {
    if (isBuild.isBuild()) {
        return;
    }
    const customDefaultIntegrations = node.getDefaultIntegrations(options).filter((integration)=>integration.name !== 'Http').concat(// We are using the HTTP integration without instrumenting incoming HTTP requests because Next.js does that by itself.
    node.httpIntegration({
        disableIncomingRequestSpans: true
    }));
    // Turn off Next.js' own fetch instrumentation
    // https://github.com/lforst/nextjs-fork/blob/1994fd186defda77ad971c36dc3163db263c993f/packages/next/src/server/lib/patch-fetch.ts#L245
    process.env.NEXT_OTEL_FETCH_DISABLED = '1';
    // This value is injected at build time, based on the output directory specified in the build config. Though a default
    // is set there, we set it here as well, just in case something has gone wrong with the injection.
    const distDirName = ("TURBOPACK compile-time value", ".next") || globalWithInjectedValues._sentryRewriteFramesDistDir;
    if ("TURBOPACK compile-time truthy", 1) {
        customDefaultIntegrations.push(distDirRewriteFramesIntegration.distDirRewriteFramesIntegration({
            distDirName
        }));
    }
    const opts = {
        environment: process.env.SENTRY_ENVIRONMENT || getVercelEnv.getVercelEnv(false) || ("TURBOPACK compile-time value", "development"),
        release: ("TURBOPACK compile-time value", "c7d9e37ae99e75f0824cae80bea499934a43ed1e") || globalWithInjectedValues._sentryRelease,
        defaultIntegrations: customDefaultIntegrations,
        ...options
    };
    if (debugBuild.DEBUG_BUILD && opts.debug) {
        core.debug.enable();
    }
    debugBuild.DEBUG_BUILD && core.debug.log('Initializing SDK...');
    if (sdkAlreadyInitialized()) {
        debugBuild.DEBUG_BUILD && core.debug.log('SDK already initialized');
        return;
    }
    core.applySdkMetadata(opts, 'nextjs', [
        'nextjs',
        'node'
    ]);
    const client = node.init(opts);
    client?.on('beforeSampling', ({ spanAttributes }, samplingDecision)=>{
        // There are situations where the Next.js Node.js server forwards requests for the Edge Runtime server (e.g. in
        // middleware) and this causes spans for Sentry ingest requests to be created. These are not exempt from our tracing
        // because we didn't get the chance to do `suppressTracing`, since this happens outside of userland.
        // We need to drop these spans.
        if (// eslint-disable-next-line deprecation/deprecation
        typeof spanAttributes[semanticConventions.SEMATTRS_HTTP_TARGET] === 'string' && // eslint-disable-next-line deprecation/deprecation
        spanAttributes[semanticConventions.SEMATTRS_HTTP_TARGET].includes('sentry_key') && // eslint-disable-next-line deprecation/deprecation
        spanAttributes[semanticConventions.SEMATTRS_HTTP_TARGET].includes('sentry_client') || typeof spanAttributes[semanticConventions.ATTR_URL_QUERY] === 'string' && spanAttributes[semanticConventions.ATTR_URL_QUERY].includes('sentry_key') && spanAttributes[semanticConventions.ATTR_URL_QUERY].includes('sentry_client')) {
            samplingDecision.decision = false;
        }
    });
    client?.on('spanStart', (span)=>{
        const spanAttributes = core.spanToJSON(span).data;
        // What we do in this glorious piece of code, is hoist any information about parameterized routes from spans emitted
        // by Next.js via the `next.route` attribute, up to the transaction by setting the http.route attribute.
        if (typeof spanAttributes?.['next.route'] === 'string') {
            const rootSpan = core.getRootSpan(span);
            const rootSpanAttributes = core.spanToJSON(rootSpan).data;
            // Only hoist the http.route attribute if the transaction doesn't already have it
            if (// eslint-disable-next-line deprecation/deprecation
            (rootSpanAttributes?.[semanticConventions.ATTR_HTTP_REQUEST_METHOD] || rootSpanAttributes?.[semanticConventions.SEMATTRS_HTTP_METHOD]) && !rootSpanAttributes?.[semanticConventions.ATTR_HTTP_ROUTE]) {
                const route = spanAttributes['next.route'].replace(/\/route$/, '');
                rootSpan.updateName(route);
                rootSpan.setAttribute(semanticConventions.ATTR_HTTP_ROUTE, route);
                // Preserving the original attribute despite internally not depending on it
                rootSpan.setAttribute('next.route', route);
            }
        }
        // We want to skip span data inference for any spans generated by Next.js. Reason being that Next.js emits spans
        // with patterns (e.g. http.server spans) that will produce confusing data.
        if (spanAttributes?.['next.span_type'] !== undefined) {
            span.setAttribute(core.SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, 'auto');
        }
        // We want to fork the isolation scope for incoming requests
        if (spanAttributes?.['next.span_type'] === 'BaseServer.handleRequest' && span === core.getRootSpan(span)) {
            const scopes = core.getCapturedScopesOnSpan(span);
            const isolationScope = (scopes.isolationScope || core.getIsolationScope()).clone();
            const scope = scopes.scope || core.getCurrentScope();
            const currentScopesPointer = opentelemetry.getScopesFromContext(api.context.active());
            if (currentScopesPointer) {
                currentScopesPointer.isolationScope = isolationScope;
            }
            core.setCapturedScopesOnSpan(span, scope, isolationScope);
        }
    });
    core.getGlobalScope().addEventProcessor(Object.assign((event)=>{
        if (event.type === 'transaction') {
            // Filter out transactions for static assets
            // This regex matches the default path to the static assets (`_next/static`) and could potentially filter out too many transactions.
            // We match `/_next/static/` anywhere in the transaction name because its location may change with the basePath setting.
            if (event.transaction?.match(/^GET (\/.*)?\/_next\/static\//)) {
                return null;
            }
            // Filter out transactions for requests to the tunnel route
            if (globalWithInjectedValues._sentryRewritesTunnelPath && event.transaction === `POST ${globalWithInjectedValues._sentryRewritesTunnelPath}` || ("TURBOPACK compile-time value", "/sentry-tunnel") && event.transaction === `POST ${"TURBOPACK compile-time value", "/sentry-tunnel"}`) {
                return null;
            }
            // Filter out requests to resolve source maps for stack frames in dev mode
            if (event.transaction?.match(/\/__nextjs_original-stack-frame/)) {
                return null;
            }
            // Filter out /404 transactions which seem to be created excessively
            if (// Pages router
            event.transaction === '/404' || // App router (could be "GET /404", "POST /404", ...)
            event.transaction?.match(/^(GET|HEAD|POST|PUT|DELETE|CONNECT|OPTIONS|TRACE|PATCH) \/(404|_not-found)$/)) {
                return null;
            }
            // Filter transactions that we explicitly want to drop.
            if (event.contexts?.trace?.data?.[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SHOULD_DROP_TRANSACTION]) {
                return null;
            }
            // Next.js 13 sometimes names the root transactions like this containing useless tracing.
            if (event.transaction === 'NextServer.getRequestHandler') {
                return null;
            }
            // Next.js 13 is not correctly picking up tracing data for trace propagation so we use a back-fill strategy
            if (typeof event.contexts?.trace?.data?.[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL] === 'string') {
                const traceparentData = core.extractTraceparentData(event.contexts.trace.data[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL]);
                if (traceparentData?.parentSampled === false) {
                    return null;
                }
            }
            return event;
        } else {
            return event;
        }
    }, {
        id: 'NextLowQualityTransactionsFilter'
    }));
    core.getGlobalScope().addEventProcessor(Object.assign((event, hint)=>{
        if (event.type !== undefined) {
            return event;
        }
        const originalException = hint.originalException;
        const isPostponeError = typeof originalException === 'object' && originalException !== null && '$$typeof' in originalException && originalException.$$typeof === Symbol.for('react.postpone');
        if (isPostponeError) {
            // Postpone errors are used for partial-pre-rendering (PPR)
            return null;
        }
        // We don't want to capture suspense errors as they are simply used by React/Next.js for control flow
        const exceptionMessage = event.exception?.values?.[0]?.value;
        if (exceptionMessage?.includes('Suspense Exception: This is not a real error!') || exceptionMessage?.includes('Suspense Exception: This is not a real error, and should not leak')) {
            return null;
        }
        return event;
    }, {
        id: 'DropReactControlFlowErrors'
    }));
    // Use the preprocessEvent hook instead of an event processor, so that the users event processors receive the most
    // up-to-date value, but also so that the logic that detects changes to the transaction names to set the source to
    // "custom", doesn't trigger.
    client?.on('preprocessEvent', (event)=>{
        // Enhance route handler transactions
        if (event.type === 'transaction' && event.contexts?.trace?.data?.['next.span_type'] === 'BaseServer.handleRequest') {
            event.contexts.trace.data[core.SEMANTIC_ATTRIBUTE_SENTRY_OP] = 'http.server';
            event.contexts.trace.op = 'http.server';
            if (event.transaction) {
                event.transaction = core.stripUrlQueryAndFragment(event.transaction);
            }
            // eslint-disable-next-line deprecation/deprecation
            const method = event.contexts.trace.data[semanticConventions.SEMATTRS_HTTP_METHOD];
            // eslint-disable-next-line deprecation/deprecation
            const target = event.contexts?.trace?.data?.[semanticConventions.SEMATTRS_HTTP_TARGET];
            const route = event.contexts.trace.data[semanticConventions.ATTR_HTTP_ROUTE] || event.contexts.trace.data['next.route'];
            if (typeof method === 'string' && typeof route === 'string') {
                const cleanRoute = route.replace(/\/route$/, '');
                event.transaction = `${method} ${cleanRoute}`;
                event.contexts.trace.data[core.SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = 'route';
                // Preserve next.route in case it did not get hoisted
                event.contexts.trace.data['next.route'] = cleanRoute;
            }
            // backfill transaction name for pages that would otherwise contain unparameterized routes
            if (event.contexts.trace.data[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL] && event.transaction !== 'GET /_app') {
                event.transaction = `${method} ${event.contexts.trace.data[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_ROUTE_BACKFILL]}`;
            }
            // Next.js overrides transaction names for page loads that throw an error
            // but we want to keep the original target name
            if (event.transaction === 'GET /_error' && target) {
                event.transaction = `${method ? `${method} ` : ''}${target}`;
            }
        }
        // Next.js 13 is not correctly picking up tracing data for trace propagation so we use a back-fill strategy
        if (event.type === 'transaction' && typeof event.contexts?.trace?.data?.[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL] === 'string') {
            const traceparentData = core.extractTraceparentData(event.contexts.trace.data[spanAttributesWithLogicAttached.TRANSACTION_ATTR_SENTRY_TRACE_BACKFILL]);
            if (traceparentData?.traceId) {
                event.contexts.trace.trace_id = traceparentData.traceId;
            }
            if (traceparentData?.parentSpanId) {
                event.contexts.trace.parent_span_id = traceparentData.parentSpanId;
            }
        }
    });
    if ("TURBOPACK compile-time truthy", 1) {
        core.getGlobalScope().addEventProcessor(devErrorSymbolicationEventProcessor.devErrorSymbolicationEventProcessor);
    }
    try {
        // @ts-expect-error `process.turbopack` is a magic string that will be replaced by Next.js
        if ("TURBOPACK compile-time truthy", 1) {
            core.getGlobalScope().setTag('turbopack', true);
        }
    } catch  {
    // Noop
    // The statement above can throw because process is not defined on the client
    }
    debugBuild.DEBUG_BUILD && core.debug.log('SDK successfully initialized');
    return client;
}
function sdkAlreadyInitialized() {
    return !!core.getClient();
}
exports.captureUnderscoreErrorException = _error.captureUnderscoreErrorException;
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry.wrapGetStaticPropsWithSentry;
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry.wrapGetInitialPropsWithSentry;
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry.wrapAppGetInitialPropsWithSentry;
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry.wrapDocumentGetInitialPropsWithSentry;
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry.wrapErrorGetInitialPropsWithSentry;
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry.wrapGetServerSidePropsWithSentry;
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry.wrapServerComponentWithSentry;
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry.wrapRouteHandlerWithSentry;
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons.wrapApiHandlerWithSentryVercelCrons;
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry.wrapMiddlewareWithSentry;
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry.wrapPageComponentWithSentry;
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry.wrapGenerationFunctionWithSentry;
exports.withServerActionInstrumentation = withServerActionInstrumentation.withServerActionInstrumentation;
exports.captureRequestError = captureRequestError.captureRequestError;
exports.wrapApiHandlerWithSentry = wrapApiHandlerWithSentry.wrapApiHandlerWithSentry;
exports.ErrorBoundary = ErrorBoundary;
exports.createReduxEnhancer = createReduxEnhancer;
exports.init = init;
exports.showReportDialog = showReportDialog;
exports.withErrorBoundary = withErrorBoundary;
Object.prototype.hasOwnProperty.call(node, '__proto__') && !Object.prototype.hasOwnProperty.call(exports, '__proto__') && Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: node['__proto__']
});
Object.keys(node).forEach((k)=>{
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = node[k];
}); //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/index.server.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
});
const withSentryConfig = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/config/withSentryConfig.js [app-ssr] (ecmascript)");
const index = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/server/index.js [app-ssr] (ecmascript)");
const _error = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/_error.js [app-ssr] (ecmascript)");
const wrapApiHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentry.js [app-ssr] (ecmascript)");
const wrapGetStaticPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetStaticPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapAppGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapAppGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapDocumentGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapDocumentGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapErrorGetInitialPropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapErrorGetInitialPropsWithSentry.js [app-ssr] (ecmascript)");
const wrapGetServerSidePropsWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapGetServerSidePropsWithSentry.js [app-ssr] (ecmascript)");
const wrapServerComponentWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapServerComponentWithSentry.js [app-ssr] (ecmascript)");
const wrapRouteHandlerWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapRouteHandlerWithSentry.js [app-ssr] (ecmascript)");
const wrapApiHandlerWithSentryVercelCrons = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapApiHandlerWithSentryVercelCrons.js [app-ssr] (ecmascript)");
const wrapMiddlewareWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapMiddlewareWithSentry.js [app-ssr] (ecmascript)");
const wrapPageComponentWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/pages-router-instrumentation/wrapPageComponentWithSentry.js [app-ssr] (ecmascript)");
const wrapGenerationFunctionWithSentry = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/wrapGenerationFunctionWithSentry.js [app-ssr] (ecmascript)");
const withServerActionInstrumentation = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/withServerActionInstrumentation.js [app-ssr] (ecmascript)");
const captureRequestError = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/common/captureRequestError.js [app-ssr] (ecmascript)");
const node = __turbopack_context__.r("[project]/node_modules/.pnpm/@sentry+node@10.5.0/node_modules/@sentry/node/build/cjs/index.js [app-ssr] (ecmascript)");
exports.withSentryConfig = withSentryConfig.withSentryConfig;
exports.ErrorBoundary = index.ErrorBoundary;
exports.createReduxEnhancer = index.createReduxEnhancer;
exports.init = index.init;
exports.showReportDialog = index.showReportDialog;
exports.withErrorBoundary = index.withErrorBoundary;
exports.captureUnderscoreErrorException = _error.captureUnderscoreErrorException;
exports.wrapApiHandlerWithSentry = wrapApiHandlerWithSentry.wrapApiHandlerWithSentry;
exports.wrapGetStaticPropsWithSentry = wrapGetStaticPropsWithSentry.wrapGetStaticPropsWithSentry;
exports.wrapGetInitialPropsWithSentry = wrapGetInitialPropsWithSentry.wrapGetInitialPropsWithSentry;
exports.wrapAppGetInitialPropsWithSentry = wrapAppGetInitialPropsWithSentry.wrapAppGetInitialPropsWithSentry;
exports.wrapDocumentGetInitialPropsWithSentry = wrapDocumentGetInitialPropsWithSentry.wrapDocumentGetInitialPropsWithSentry;
exports.wrapErrorGetInitialPropsWithSentry = wrapErrorGetInitialPropsWithSentry.wrapErrorGetInitialPropsWithSentry;
exports.wrapGetServerSidePropsWithSentry = wrapGetServerSidePropsWithSentry.wrapGetServerSidePropsWithSentry;
exports.wrapServerComponentWithSentry = wrapServerComponentWithSentry.wrapServerComponentWithSentry;
exports.wrapRouteHandlerWithSentry = wrapRouteHandlerWithSentry.wrapRouteHandlerWithSentry;
exports.wrapApiHandlerWithSentryVercelCrons = wrapApiHandlerWithSentryVercelCrons.wrapApiHandlerWithSentryVercelCrons;
exports.wrapMiddlewareWithSentry = wrapMiddlewareWithSentry.wrapMiddlewareWithSentry;
exports.wrapPageComponentWithSentry = wrapPageComponentWithSentry.wrapPageComponentWithSentry;
exports.wrapGenerationFunctionWithSentry = wrapGenerationFunctionWithSentry.wrapGenerationFunctionWithSentry;
exports.withServerActionInstrumentation = withServerActionInstrumentation.withServerActionInstrumentation;
exports.captureRequestError = captureRequestError.captureRequestError;
Object.prototype.hasOwnProperty.call(node, '__proto__') && !Object.prototype.hasOwnProperty.call(exports, '__proto__') && Object.defineProperty(exports, '__proto__', {
    enumerable: true,
    value: node['__proto__']
});
Object.keys(node).forEach((k)=>{
    if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) exports[k] = node[k];
}); //# sourceMappingURL=index.server.js.map
}),
];

//# sourceMappingURL=10912_%40sentry_nextjs_build_cjs_a5f5051f._.js.map