module.exports = [
"[project]/node_modules/.pnpm/@opentelemetry+resources@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/execAsync.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "execAsync",
    ()=>execAsync
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/child_process [external] (child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/util [external] (util, cjs)");
;
;
const execAsync = __TURBOPACK__imported__module__$5b$externals$5d2f$util__$5b$external$5d$__$28$util$2c$__cjs$29$__["promisify"](__TURBOPACK__imported__module__$5b$externals$5d2f$child_process__$5b$external$5d$__$28$child_process$2c$__cjs$29$__["exec"]); //# sourceMappingURL=execAsync.js.map
}),
"[project]/node_modules/.pnpm/@opentelemetry+resources@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/getMachineId-bsd.js [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "getMachineId",
    ()=>getMachineId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$opentelemetry$2b$resources$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$machine$2d$id$2f$execAsync$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@opentelemetry+resources@2.0.1_@opentelemetry+api@1.9.0/node_modules/@opentelemetry/resources/build/esm/detectors/platform/node/machine-id/execAsync.js [instrumentation] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$opentelemetry$2b$api$40$1$2e$9$2e$0$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@opentelemetry+api@1.9.0/node_modules/@opentelemetry/api/build/esm/diag-api.js [instrumentation] (ecmascript)");
;
;
;
async function getMachineId() {
    try {
        const result = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile('/etc/hostid', {
            encoding: 'utf8'
        });
        return result.trim();
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$opentelemetry$2b$api$40$1$2e$9$2e$0$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`error reading machine id: ${e}`);
    }
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$opentelemetry$2b$resources$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$detectors$2f$platform$2f$node$2f$machine$2d$id$2f$execAsync$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["execAsync"])('kenv -q smbios.system.uuid');
        return result.stdout.trim();
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$opentelemetry$2b$api$40$1$2e$9$2e$0$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["diag"].debug(`error reading machine id: ${e}`);
    }
    return undefined;
} //# sourceMappingURL=getMachineId-bsd.js.map
}),
];

//# sourceMappingURL=44b11_%40opentelemetry_resources_build_esm_detectors_platform_node_machine-id_c988fd6a._.js.map