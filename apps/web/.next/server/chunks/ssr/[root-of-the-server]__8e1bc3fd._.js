module.exports = [
"[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_STORAGE_KEYS",
    ()=>AUTH_STORAGE_KEYS,
    "clearAuthData",
    ()=>clearAuthData,
    "getAuthData",
    ()=>getAuthData,
    "getServiceType",
    ()=>getServiceType,
    "setAuthData",
    ()=>setAuthData,
    "setServiceType",
    ()=>setServiceType
]);
const AUTH_STORAGE_KEYS = {
    SOURCE: {
        TOKEN: "nonna_source_token",
        STATE: "nonna_source_state",
        SERVICE: "nonna_source_service",
        CODE_VERIFIER: "nonna_source_code_verifier"
    },
    TARGET: {
        TOKEN: "nonna_target_token",
        STATE: "nonna_target_state",
        SERVICE: "nonna_target_service",
        CODE_VERIFIER: "nonna_target_code_verifier"
    }
};
function getAuthData(role) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
function setAuthData(role, data) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.TOKEN : AUTH_STORAGE_KEYS.TARGET.TOKEN;
    localStorage.setItem(key, JSON.stringify(data));
}
function clearAuthData(role) {
    const keys = role === "source" ? AUTH_STORAGE_KEYS.SOURCE : AUTH_STORAGE_KEYS.TARGET;
    Object.values(keys).forEach((key)=>localStorage.removeItem(key));
}
function getServiceType(role) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
    const serviceType = localStorage.getItem(key);
    if (!serviceType) {
        throw new Error(`No service type found for role: ${role}`);
    }
    return serviceType;
}
function setServiceType(role, serviceId) {
    const key = role === "source" ? AUTH_STORAGE_KEYS.SOURCE.SERVICE : AUTH_STORAGE_KEYS.TARGET.SERVICE;
    localStorage.setItem(key, serviceId);
}
}),
"[project]/apps/web/src/hooks/useTransferLimits.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransferLimits",
    ()=>useTransferLimits
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
;
;
function useTransferLimits() {
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLimitExceededModalOpen, setIsLimitExceededModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCountForModal, setSelectedCountForModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    // Helper function to calculate full status with limits
    const calculateFullStatus = (baseStatus)=>{
        const dailyLimit = baseStatus.isPremium ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PREMIUM_TIER_LIMIT"] : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FREE_TIER_LIMIT"];
        return {
            ...baseStatus,
            dailyLimit,
            availableToday: Math.max(0, dailyLimit - baseStatus.currentUsage)
        };
    };
    // Helper function to get the current user ID
    const getCurrentUserId = ()=>{
        const targetAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthData"])("target");
        if (!targetAuth) {
            throw new Error("No target service authentication found");
        }
        return `${targetAuth.serviceId}:${targetAuth.userId}`;
    };
    const fetchUserStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            setLoading(true);
            const userId = getCurrentUserId();
            const response = await fetch("/api/user/status", {
                headers: {
                    "x-user-id": userId
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch user status");
            }
            const data = await response.json();
            setStatus(calculateFullStatus(data));
            setError(null);
        } catch (err) {
            // Fall back to free tier limits
            const fallbackStatus = {
                isPremium: false,
                dailyLimit: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FREE_TIER_LIMIT"],
                currentUsage: 0,
                availableToday: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FREE_TIER_LIMIT"]
            };
            setStatus(fallbackStatus);
            setError(err instanceof Error ? err : new Error("Unknown error"));
        } finally{
            setLoading(false);
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchUserStatus();
    }, [
        fetchUserStatus
    ]);
    const checkLimit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (count)=>{
        try {
            const userId = getCurrentUserId();
            const response = await fetch("/api/user/status", {
                headers: {
                    "x-user-id": userId
                }
            });
            if (!response.ok) {
                throw new Error("Failed to check usage limit");
            }
            const data = await response.json();
            const { isPremium, currentUsage, resetInSeconds } = data;
            const dailyLimit = isPremium ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PREMIUM_TIER_LIMIT"] : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FREE_TIER_LIMIT"];
            const newUsage = currentUsage + count;
            if (newUsage > dailyLimit) {
                if (status) {
                    setSelectedCountForModal(count);
                    setIsLimitExceededModalOpen(true);
                    // Update local status with current usage and resetInSeconds
                    const newStatus = calculateFullStatus({
                        isPremium,
                        currentUsage,
                        resetInSeconds
                    });
                    setStatus(newStatus);
                }
                return false;
            }
            return true;
        } catch (err) {
            console.error("Error checking usage limit:", err);
            return false;
        }
    }, [
        status
    ]);
    const updateUsage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (count)=>{
        try {
            const userId = getCurrentUserId();
            const response = await fetch("/api/transfer/usage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": userId
                },
                body: JSON.stringify({
                    count
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error updating usage:", errorData);
                if (response.status === 403) {
                    if (status) {
                        setSelectedCountForModal(count);
                        setIsLimitExceededModalOpen(true);
                        // Update local status
                        const newStatus = calculateFullStatus({
                            isPremium: status.isPremium,
                            currentUsage: errorData.currentUsage,
                            resetInSeconds: errorData.resetInSeconds
                        });
                        setStatus(newStatus);
                    }
                    return false;
                }
                throw new Error("Failed to update usage");
            }
            const data = await response.json();
            // Update local status
            if (status) {
                const newStatus = calculateFullStatus({
                    isPremium: status.isPremium,
                    currentUsage: data.currentUsage
                });
                setStatus(newStatus);
            }
            return true;
        } catch (err) {
            console.error("Error updating usage count:", err);
            return false;
        }
    }, [
        status
    ]);
    return {
        status,
        loading,
        error,
        updateUsage,
        checkLimit,
        refreshStatus: fetchUserStatus,
        isLimitExceededModalOpen,
        setIsLimitExceededModalOpen,
        selectedCountForModal
    };
}
}),
"[project]/apps/web/src/components/shared/TransferLimitModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferLimitModal",
    ()=>TransferLimitModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/constants.ts [app-ssr] (ecmascript)");
"use client";
;
;
function TransferLimitModal({ selectedCount, userStatus }) {
    const { dailyLimit, availableToday, resetInSeconds } = userStatus;
    const hasAvailableTransfers = availableToday > 0;
    const isSelectionOverLimit = selectedCount > availableToday;
    // Format reset time if available
    const resetTimeText = resetInSeconds ? `${Math.floor(resetInSeconds / 3600)}h ${Math.floor(resetInSeconds % 3600 / 60)}m` : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-6",
        children: [
            (isSelectionOverLimit || !hasAvailableTransfers) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 p-6 text-gray-700 dark:text-gray-300",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1",
                        children: hasAvailableTransfers ? isSelectionOverLimit ? // Warning: selection exceeds available transfers
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg",
                                    children: [
                                        "You've selected ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: selectedCount
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                            lineNumber: 40,
                                            columnNumber: 44
                                        }, this),
                                        " ",
                                        "tracks but can only transfer",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold text-indigo-600 dark:text-indigo-400",
                                            children: availableToday
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                            lineNumber: 42,
                                            columnNumber: 23
                                        }, this),
                                        " ",
                                        "more today."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 39,
                                    columnNumber: 21
                                }, this),
                                resetTimeText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 dark:text-gray-400",
                                    children: [
                                        "Your transfer limit will reset in ",
                                        resetTimeText
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 49,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true) : null // No message or reset time if selection is within limit
                         : // No available transfers: daily limit reached
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-medium text-amber-600 dark:text-amber-400",
                                    children: "Daily Limit Reached"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 58,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base",
                                    children: [
                                        "You've used all ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-semibold",
                                            children: dailyLimit
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                            lineNumber: 62,
                                            columnNumber: 42
                                        }, this),
                                        " ",
                                        "transfers available in your free plan today"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 61,
                                    columnNumber: 19
                                }, this),
                                resetTimeText && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-500 dark:text-gray-400",
                                    children: [
                                        "Your transfer limit will reset in ",
                                        resetTimeText
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 67,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 28,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                    lineNumber: 27,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-900 dark:bg-gray-950/30",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "mt-1 h-5 w-5 text-gray-600 dark:text-gray-400",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 88,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                lineNumber: 81,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                                        children: "Free Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 97,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                                        children: "Current Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 98,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                lineNumber: 96,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 80,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mb-4 mt-4 space-y-2 text-gray-600 dark:text-gray-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-5 w-5 items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-4 w-4 text-gray-400",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FREE_TIER_LIMIT"],
                                " daily transfers"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                lineNumber: 79,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-indigo-900 dark:from-indigo-950/30 dark:to-indigo-900/10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-5 w-5 text-indigo-600 dark:text-indigo-400",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-semibold text-gray-900 dark:text-white",
                                        children: "Premium Plan"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 138,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "mt-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400",
                                        children: "Coming Soon"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 139,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 121,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-sm text-gray-500 dark:text-gray-400",
                        children: "Upgrade to Premium for a higher limit"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "mb-4 mt-3 space-y-2 text-gray-600 dark:text-gray-300",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-5 w-5 items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-4 w-4 text-emerald-500",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fillRule: "evenodd",
                                            d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                            clipRule: "evenodd"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                            lineNumber: 151,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center gap-1.5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PREMIUM_TIER_LIMIT"],
                                            " daily transfers"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        disabled: true,
                        className: "w-full cursor-not-allowed rounded-lg bg-gray-100 px-6 py-2.5 text-center font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500",
                        children: "Coming Soon"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/shared/TransferLimitModal.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/shared/Dialog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
function Dialog({ isOpen, onClose, title, children, closeOnBackdropClick = true }) {
    const dialogRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Handle clicking outside to close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleClickOutside(event) {
            if (closeOnBackdropClick && dialogRef.current && !dialogRef.current.contains(event.target)) {
                onClose();
            }
        }
        // Handle escape key press to close
        function handleKeyDown(event) {
            if (event.key === "Escape") {
                onClose();
            }
        }
        // Only add the event listeners if the dialog is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return ()=>{
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [
        isOpen,
        onClose,
        closeOnBackdropClick
    ]);
    // Prevent scrolling when dialog is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return ()=>{
            document.body.style.overflow = "";
        };
    }, [
        isOpen
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        // Use a very light black overlay (10% opacity) with minimal blur for a subtle, modern effect in both light and dark mode
        className: "fixed inset-0 isolate z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm",
        "aria-modal": "true",
        role: "dialog",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: dialogRef,
            // Dialog box: fullscreen on mobile, modal on sm+
            // Use flex-col so header stays fixed and content scrolls if needed
            // Increased dark mode background opacity from 80% to 95% for better readability
            className: "dark:bg-[var(--color-indigo-990)]/95 lg:dark:bg-[var(--color-indigo-990)]/95 mx-0 flex h-full max-h-none w-full max-w-none flex-col rounded-none border-none bg-white p-0 shadow-none lg:mx-4 lg:h-auto lg:max-h-[85vh] lg:max-w-2xl lg:rounded-xl lg:border lg:border-gray-200 lg:bg-white lg:p-0 lg:shadow",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-14 items-center justify-between border-b border-gray-100 px-4 py-0 lg:h-16 lg:px-6 dark:border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold tracking-tight text-gray-900 dark:text-white",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            // On mobile: match menu button (rounded-full, p-2, size-6). On desktop: original style.
                            className: "rounded-full p-0 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 lg:rounded-lg lg:p-1 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus:ring-indigo-400",
                            "aria-label": "Close dialog",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "size-6 lg:h-5 lg:w-5",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-0 flex-1 overflow-y-auto px-6 py-6 text-gray-700 lg:max-h-[calc(85vh-64px)] dark:text-gray-200",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
            lineNumber: 84,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/Dialog.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/contexts/TransferContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferProvider",
    ()=>TransferProvider,
    "useTransfer",
    ()=>useTransfer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTransferLimits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useTransferLimits.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferLimitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/TransferLimitModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/Dialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const TransferContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function TransferProvider({ children }) {
    const { status, loading, error, updateUsage, checkLimit, refreshStatus, isLimitExceededModalOpen, setIsLimitExceededModalOpen, selectedCountForModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTransferLimits$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransferLimits"])();
    // Handle the "Continue anyway" action for the modal
    const handleCloseModal = ()=>{
        setIsLimitExceededModalOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TransferContext.Provider, {
        value: {
            userStatus: status,
            isLoading: loading,
            error,
            updateUsage,
            checkLimit,
            refreshStatus
        },
        children: [
            children,
            status && isLimitExceededModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: true,
                onClose: handleCloseModal,
                title: "Transfer Limit",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferLimitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferLimitModal"], {
                    selectedCount: selectedCountForModal,
                    userStatus: status
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/contexts/TransferContext.tsx",
                    lineNumber: 57,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/contexts/TransferContext.tsx",
                lineNumber: 56,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/contexts/TransferContext.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
function useTransfer() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(TransferContext);
    if (context === undefined) {
        throw new Error("useTransfer must be used within a TransferProvider");
    }
    return context;
}
}),
"[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferUsageDisplay",
    ()=>TransferUsageDisplay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/TransferContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferLimitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/TransferLimitModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/Dialog.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function TransferUsageDisplay() {
    const { userStatus: status, isLoading: loading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransfer"])();
    const [isModalOpen, setIsModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full animate-pulse items-center text-xs text-gray-400",
            children: "Loading usage..."
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx",
            lineNumber: 15,
            columnNumber: 7
        }, this);
    }
    if (error || !status) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsModalOpen(true),
                className: "group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-full border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/50 px-4 py-2.5 transition-all duration-300 hover:border-indigo-200 active:scale-[0.98] dark:border-indigo-500/20 dark:from-gray-900 dark:to-indigo-950/30 dark:hover:border-indigo-500/30",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-sm font-semibold text-transparent transition-colors group-hover:from-indigo-500 group-hover:to-indigo-400 dark:from-indigo-400 dark:to-indigo-300",
                    children: "Go Premium"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            isModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isModalOpen,
                onClose: ()=>setIsModalOpen(false),
                title: "Plans",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferLimitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferLimitModal"], {
                    selectedCount: 0,
                    userStatus: status
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx",
                    lineNumber: 39,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx",
                lineNumber: 38,
                columnNumber: 11
            }, this), document.body)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/layout/header/ThemeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function ThemeToggle() {
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Avoid hydration mismatch by only rendering after mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-[30px] w-[60px]"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
            lineNumber: 17,
            columnNumber: 12
        }, this); // Placeholder with same dimensions
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: toggleTheme,
        "data-testid": "theme-toggle",
        className: `
        relative inline-flex h-[30px] w-[60px] items-center justify-between rounded-full p-0.5
        ${theme === "light" ? "bg-gray-300/60 hover:bg-gray-300" : "bg-indigo-950/60 hover:bg-indigo-950"}
        focus-visible:ring-primary-500/70 cursor-pointer
        border-0 transition-colors duration-200
        focus:outline-none focus-visible:ring-2
      `,
        "aria-label": theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `
          absolute h-[26px] w-[26px] rounded-full
          ${theme === "light" ? "translate-x-0 bg-gray-100" : "translate-x-[30px] bg-indigo-900"}
          transform transition-all duration-200 ease-out
        `
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: `
          relative z-10 ml-1.5
          ${theme === "light" ? "text-gray-800" : "text-gray-500"}
          transition-colors duration-200
        `,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "12",
                        cy: "12",
                        r: "5"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "12",
                        y1: "1",
                        x2: "12",
                        y2: "3"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "12",
                        y1: "21",
                        x2: "12",
                        y2: "23"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "4.22",
                        y1: "4.22",
                        x2: "5.64",
                        y2: "5.64"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "18.36",
                        y1: "18.36",
                        x2: "19.78",
                        y2: "19.78"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "1",
                        y1: "12",
                        x2: "3",
                        y2: "12"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "21",
                        y1: "12",
                        x2: "23",
                        y2: "12"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "4.22",
                        y1: "19.78",
                        x2: "5.64",
                        y2: "18.36"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 70,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: "18.36",
                        y1: "5.64",
                        x2: "19.78",
                        y2: "4.22"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "14",
                height: "14",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: `
          relative z-10 mr-1.5
          ${theme === "light" ? "text-gray-400" : "text-indigo-200"}
          transition-colors duration-200
        `,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/header/ThemeToggle.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageSwitch",
    ()=>LanguageSwitch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const languages = [
    {
        code: "en",
        name: "English"
    },
    {
        code: "zh",
        name: "简体中文"
    },
    {
        code: "pt",
        name: "Português"
    },
    {
        code: "ru",
        name: "Русский"
    },
    {
        code: "es",
        name: "Español"
    },
    {
        code: "ko",
        name: "한국어"
    },
    {
        code: "fa",
        name: "فارسی"
    }
];
const LanguageSwitch = ()=>{
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedLang, setSelectedLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleLanguageSelect = (langCode)=>{
        setSelectedLang(langCode);
        setIsOpen(false);
    // todo: handle language change
    };
    const selectedLanguage = languages.find((lang)=>lang.code === selectedLang);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: dropdownRef,
        style: {
            zIndex: 100
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                "data-testid": "language-switch",
                className: "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-800 transition-colors hover:text-gray-950 dark:text-indigo-300 dark:hover:text-indigo-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        width: "20",
                        height: "20",
                        viewBox: "0 0 512 512",
                        fill: "currentColor",
                        role: "graphics-symbol",
                        "aria-label": `Selected language: ${selectedLanguage?.name}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M363,176,246,464h47.24l24.49-58h90.54l24.49,58H480ZM336.31,362,363,279.85,389.69,362Z"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M272,320c-.25-.19-20.59-15.77-45.42-42.67,39.58-53.64,62-114.61,71.15-143.33H352V90H214V48H170V90H32v44H251.25c-9.52,26.95-27.05,69.5-53.79,108.36-32.68-43.44-47.14-75.88-47.33-76.22L143,152l-38,22,6.87,13.86c.89,1.56,17.19,37.9,54.71,86.57.92,1.21,1.85,2.39,2.78,3.57-49.72,56.86-89.15,79.09-89.66,79.47L64,368l23,36,19.3-11.47c2.2-1.67,41.33-24,92-80.78,24.52,26.28,43.22,40.83,44.3,41.67L255,362Z"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                        lineNumber: 46,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-testid": "language-dropdown",
                className: "absolute right-0 top-full mt-2 w-40 rounded-xl border border-gray-100 bg-white py-2 shadow-lg backdrop-blur-lg dark:border-gray-800/50 dark:bg-gray-900/95",
                children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleLanguageSelect(lang.code),
                        className: `w-full px-4 py-2 text-left text-sm transition-colors
                ${lang.code === selectedLang ? "bg-indigo-50/50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"}`,
                        children: lang.name
                    }, lang.code, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                        lineNumber: 73,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
                lineNumber: 68,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/layout/header/MobileMenu.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileMenu",
    ()=>MobileMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/ThemeContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
;
;
;
;
;
const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";
const GITHUB_REPO = "https://github.com/tony-co/nonna.fm";
const languages = [
    {
        code: "en",
        name: "English"
    },
    {
        code: "zh",
        name: "简体中文"
    },
    {
        code: "pt",
        name: "Português"
    },
    {
        code: "ru",
        name: "Русский"
    },
    {
        code: "es",
        name: "Español"
    },
    {
        code: "ko",
        name: "한국어"
    },
    {
        code: "fa",
        name: "فارسی"
    }
];
const MobileMenu = ({ isOpen, onOpenChange })=>{
    const [selectedLang, setSelectedLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const handleLanguageSelect = (langCode)=>{
        setSelectedLang(langCode);
    // todo: handle language change
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onOpenChange(true),
                className: "rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10",
                "aria-label": "Open menu",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "size-6",
                    fill: "none",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "2",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M4 6h16M4 12h16M4 18h16"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                        lineNumber: 50,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: isOpen,
                onClose: ()=>onOpenChange(false),
                title: "Settings",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "my-1 rounded-lg px-2 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2 flex items-center gap-3 text-gray-900 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "size-6",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 1.5,
                                                    d: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 63,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[17px]",
                                                children: "Language"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 71,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                        lineNumber: 62,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedLang,
                                        onChange: (e)=>handleLanguageSelect(e.target.value),
                                        className: "w-full rounded-lg bg-gray-100 px-3 py-2 text-[15px] text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
                                        "aria-label": "Select language",
                                        children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: lang.code,
                                                className: "bg-white text-gray-900 dark:bg-[#0A0A1B] dark:text-white",
                                                children: lang.name
                                            }, lang.code, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 80,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                        lineNumber: 73,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                lineNumber: 61,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "my-1 rounded-lg px-2 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 flex items-center gap-3 text-gray-900 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "size-6",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 1.5,
                                                    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 94,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[17px]",
                                                children: "Theme"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 102,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>theme !== "light" && toggleTheme(),
                                                className: `relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${theme === "light" ? "border-indigo-600 bg-gray-100" : "border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex aspect-[4/3] items-center justify-center rounded-lg bg-white",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl font-medium text-gray-900",
                                                            children: "Aa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                            lineNumber: 115,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-center text-[15px] font-medium text-gray-900 dark:text-white",
                                                        children: "Light"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 106,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>theme !== "dark" && toggleTheme(),
                                                className: `relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-200 ${theme === "dark" ? "border-indigo-600 bg-white/10" : "border-transparent bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex aspect-[4/3] items-center justify-center rounded-lg bg-[#1c1c1c]",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-2xl font-medium text-white",
                                                            children: "Aa"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                            lineNumber: 131,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-center text-[15px] font-medium text-gray-900 dark:text-white",
                                                        children: "Dark"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                        lineNumber: 133,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 122,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                        lineNumber: 105,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                lineNumber: 92,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                        lineNumber: 59,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "w-full rounded-full bg-indigo-600 py-3.5 text-center text-[17px] font-medium text-white transition-colors duration-200 hover:bg-indigo-700",
                            onClick: ()=>onOpenChange(false),
                            children: "Done"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                            lineNumber: 143,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                        lineNumber: 142,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-t border-gray-200 px-4 py-8 dark:border-white/10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-row justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `${GITHUB_BASE_URL}/PRIVACY.md`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 1.5,
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm",
                                            children: "Privacy"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                    lineNumber: 154,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: `${GITHUB_BASE_URL}/TERMS.md`,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            strokeWidth: 1.5,
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 190,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 182,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm",
                                            children: "Terms"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 196,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                    lineNumber: 176,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: GITHUB_REPO,
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "group flex flex-col items-center rounded-lg px-3 py-2 text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "mb-1.5 h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            fill: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                                lineNumber: 210,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 204,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm",
                                            children: "GitHub"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                            lineNumber: 212,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                                    lineNumber: 198,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                            lineNumber: 153,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                        lineNumber: 152,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/header/MobileMenu.tsx",
                lineNumber: 57,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)), document.body)
        ]
    }, void 0, true);
};
}),
"[project]/apps/web/src/components/icons/NonnaLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NonnaLogo",
    ()=>NonnaLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const NonnaLogo = ({ className = "", size = 50 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        style: {
            width: size,
            height: size
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 100 100",
            className: "h-full w-full transition-all duration-200",
            fill: "currentColor",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M74.4,30.4c1.3-3.9-0.1-9.5-1.5-12.1c-0.6-1-0.9-1.2-1.2-1.3c-0.8-0.2-3.4,1.5-5.9,3.5c-1.5-5-5.3-8.3-9.5-8.3   c-5.3,0-9.6,5-10.1,11.5c-3-3.3-7.4-4.8-9.1-5c-0.4,0-0.7,0-0.8,0.1c-0.3,0.3,0.6,8.5,1,10.3c-1.9,1.9-5.2,7.4-5.8,10.9   c-1.9-1.1-4.1-1.7-6.4-1.6c-3.2,0.1-6.2,1.5-8.5,3.8c-2.2,2.4-3.4,5.5-3.3,8.7c0.2,6.5,5.6,11.7,12.1,11.7c0.1,0,0.3,0,0.4,0   c0.7,0,1.4-0.1,2-0.2l0.7,2.9c-2.1,0.4-3.5,1.4-3.7,3.3c-0.1,3.1,0.4,5.8,2.2,7.8c1.8,1.9,4.4,3,7.4,3.1c-0.5,0.9-2.2,3.8-5.5,7.7   c-0.5,0.6,0.2,1.3,0.8,0.7C31.7,85.6,42.8,73,41,60.3l5.8,2.2l2.5,4.8c0,13.7-5.3,19.1-5.4,19.2c-0.5,0.5-0.1,1.3,0.7,0.7   c0.3-0.2,5.6-5.7,5.7-19.9l2.4-4.7l31.7-8c4.9,15-2.1,32.5-2.1,32.7c-0.3,0.9,0.6,1.3,0.9,0.4C85.6,80,94.6,58.2,74.4,30.4z    M56.4,13.1c3.9,0,7.4,3.2,8.7,8c-1.5,1.2-2.8,2.5-3.5,3.3c-2.7-1-9.4-1.9-14.4-0.4C47.6,17.9,51.5,13.1,56.4,13.1z M46.7,25.2   c4.4-1.7,11-1,14,0c-1.8,1.3-6.8,4.6-11.8,4.3c-2.4-0.1-3.9-0.7-4.1-1.5C44.6,27.3,45.4,26.1,46.7,25.2z M36.3,37.3   c0.9-3.9,3.6-6.2,6.8-5.8c1.1,0.2,2.2,0.8,2.9,1.9c1,1.5,1.4,3.6,0.9,5.6c-0.6,2.7-2.5,4.3-4.9,4.3c-0.5,0-0.9,0-1.5-0.2   C36.2,42.1,35.8,39.4,36.3,37.3z M32.2,41.6c0.3,0.2,0.5,0.5,0.8,0.7c2.2,2,3.4,4.8,3.5,7.8c0,0.7,0,1.4-0.1,2.1   C33.4,48.9,32,45.3,32.2,41.6z M25.8,61.6c-6.1,0.2-11.3-4.6-11.5-10.8c-0.1-3,1-5.8,3-8c2-2.2,4.8-3.4,7.8-3.5h0.4   c2.1,0,4.1,0.6,5.9,1.7c-0.4,4.4,1.2,8.6,4.9,12.4c-0.5,1.7-1.4,3.3-2.6,4.7C31.5,60.2,28.8,61.5,25.8,61.6z M35.2,78.3   c-3,0-5.5-1-7.2-2.8c-1.2-1.4-1.9-3.1-2-5.1c0.9,0.8,2.8,1.5,4.4,1.3l0.8,3c0.2,0.8,1.1,0.5,1-0.2l-0.7-2.8c0.2,0,0.3-0.1,0.5-0.1   c2.6,1.9,6.1-0.2,6.9-1C37.6,73.6,36.2,76.5,35.2,78.3z M39.7,66.4c-0.6,3.1-4.1,5.9-6.8,4.6c1.3-0.6,2.1-1.7,2.1-2.8   c0-0.9-1.6-3.7-5.5-3.2l-0.8-3c2.1-0.6,3.9-1.7,5.5-3.4c1.2-1.3,2.1-2.9,2.7-4.6c0,0,0.1,0.1,0.1,0.1C40.2,57.5,40.6,62,39.7,66.4z    M53.7,55.3c-2.6,0-4.9-1.5-5.9-2.9c-0.7,1.5-2.6,2.7-4.7,2.7c-1.9,0-4.2-0.9-5.1-3.8c-0.1-0.6,0.8-0.7,1-0.3   c1,2.6,2.9,3.3,4.7,3.1c1.7-0.3,3.5-2.7,3.5-3.5c-0.8-0.1-1.6-1.8-1.4-2.5c0.1-0.4,0.6-0.9,1.9-0.9c1.3,0,1.7,0.6,1.8,0.9   c0.2,0.5-0.2,2.3-1.3,2.5c0,0.8,2.3,3.4,4.9,3.7c1.3,0.1,3.3-0.2,4.2-3.3c0.2-0.7,1.1-0.4,1,0.2C57.8,53.8,56.1,55.3,53.7,55.3z    M64.7,42.3c-0.7,0.6-1.7,0.9-3.1,0.9c-0.6,0-1.3-0.1-2.1-0.1c-2.9-0.5-6.2-1-6.2-4.8c0-3.5,2.9-6.4,6.4-6.4s6.4,2.9,6.4,6.4   C66.1,40.2,65.6,41.5,64.7,42.3z"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/icons/NonnaLogo.tsx",
                    lineNumber: 18,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/NonnaLogo.tsx",
                lineNumber: 17,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/icons/NonnaLogo.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/NonnaLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[next]/internal/font/google/inter_53f63fe4.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "inter_53f63fe4-module__E0dXtq__className",
});
}),
"[next]/internal/font/google/inter_53f63fe4.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_53f63fe4.module.css [app-ssr] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Inter', 'Inter Fallback'",
        fontWeight: 900,
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/apps/web/src/contexts/ItemTitleContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ItemTitleProvider",
    ()=>ItemTitleProvider,
    "useItemTitle",
    ()=>useItemTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
// Create context with default values
const ItemTitleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    itemTitle: null,
    setItemTitle: ()=>{},
    minimalMobileHeader: false,
    setMinimalMobileHeader: ()=>{},
    showTitle: false,
    setShowTitle: ()=>{}
});
function ItemTitleProvider({ children }) {
    const [itemTitle, setItemTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [minimalMobileHeader, setMinimalMobileHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTitle, setShowTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ItemTitleContext.Provider, {
        value: {
            itemTitle,
            setItemTitle,
            minimalMobileHeader,
            setMinimalMobileHeader,
            showTitle,
            setShowTitle
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/contexts/ItemTitleContext.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
function useItemTitle() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ItemTitleContext);
}
}),
"[project]/apps/web/src/components/layout/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferUsageDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/TransferUsageDisplay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/header/ThemeToggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$LanguageSwitch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/header/LanguageSwitch.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$MobileMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/header/MobileMenu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$NonnaLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/NonnaLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/inter_53f63fe4.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ItemTitleContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/ItemTitleContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
const Header = ()=>{
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const isLibraryPage = pathname?.startsWith("/library");
    const { itemTitle, minimalMobileHeader, showTitle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ItemTitleContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useItemTitle"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const source = params?.source;
    const target = params?.target;
    // Compute backHref for detail pages
    const backHref = source && target ? `/library/${source}/${target}` : "/library";
    // If minimalMobileHeader is true, render both headers and use CSS to show/hide
    if (minimalMobileHeader) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "relative w-full backdrop-blur-xl transition-colors duration-200 ease-in-out lg:hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex h-14 w-full items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: backHref,
                                    className: "absolute left-0 flex items-center px-4 text-gray-900 hover:underline focus:outline-none dark:text-white",
                                    "aria-label": "Back",
                                    "data-testid": "back-to-library",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "mr-2 size-6",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: 2,
                                            viewBox: "0 0 24 24",
                                            "aria-hidden": "true",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                d: "M15 19l-7-7 7-7"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                                lineNumber: 60,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 52,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "Back"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 62,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 46,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `
                  mx-auto max-w-[65%] overflow-hidden truncate text-ellipsis whitespace-nowrap text-center text-lg font-semibold
                  transition duration-300 ease-out
                  ${showTitle ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"}
                `,
                                    title: itemTitle || "Item",
                                    children: itemTitle || "Item"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                            lineNumber: 45,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: `
            relative hidden w-full backdrop-blur-xl
            transition-colors duration-200 ease-in-out lg:block
        `,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "container mx-auto px-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex h-14 items-center justify-between lg:h-16",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4 lg:gap-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5 lg:gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$NonnaLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NonnaLogo"], {
                                                className: "size-6 font-black lg:size-8 dark:text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                                lineNumber: 91,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 pt-0.5 lg:gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        // Keep existing lg:text-xl
                                                        className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].className} text-md font-black uppercase italic leading-none text-gray-900 lg:text-xl dark:text-white`,
                                                        children: "nonna.fm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                                        lineNumber: 93,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 lg:inline-block dark:bg-indigo-900/50 dark:text-indigo-300",
                                                        children: "Beta"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                                        lineNumber: 100,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                                lineNumber: 92,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                        lineNumber: 89,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden items-center gap-8 lg:flex",
                                    children: [
                                        isLibraryPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferUsageDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferUsageDisplay"], {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 110,
                                            columnNumber: 35
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$LanguageSwitch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageSwitch"], {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 111,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 112,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 lg:hidden",
                                    children: [
                                        isLibraryPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferUsageDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferUsageDisplay"], {}, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 120,
                                            columnNumber: 35
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$MobileMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileMenu"], {
                                            onOpenChange: setIsMenuOpen,
                                            isOpen: isMenuOpen
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 118,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                            lineNumber: 87,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true);
    }
    // Default Header (when minimalMobileHeader is false)
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `
        relative w-full backdrop-blur-xl
        transition-colors duration-200 ease-in-out
      `,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-2",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex h-14 items-center justify-between lg:h-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 lg:gap-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1.5 lg:gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$NonnaLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NonnaLogo"], {
                                    className: "size-6 font-black lg:size-8 dark:text-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1 pt-0.5 lg:gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            // Keep existing lg:text-xl
                                            className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$inter_53f63fe4$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].className} text-md font-black uppercase italic leading-none text-gray-900 lg:text-xl dark:text-white`,
                                            children: "nonna.fm"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 149,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "hidden rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-indigo-700 lg:inline-block dark:bg-indigo-900/50 dark:text-indigo-300",
                                            children: "Beta"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                    lineNumber: 148,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                            lineNumber: 144,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden items-center gap-8 lg:flex",
                        children: [
                            isLibraryPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferUsageDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferUsageDisplay"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                lineNumber: 166,
                                columnNumber: 31
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$LanguageSwitch$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LanguageSwitch"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                        lineNumber: 164,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 lg:hidden",
                        children: [
                            isLibraryPage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferUsageDisplay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferUsageDisplay"], {}, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                lineNumber: 174,
                                columnNumber: 31
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$header$2f$MobileMenu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileMenu"], {
                                onOpenChange: setIsMenuOpen,
                                isOpen: isMenuOpen
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/Header.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/layout/Header.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/Header.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/layout/Footer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const GITHUB_BASE_URL = "https://github.com/tony-co/nonna.fm/blob/main";
const GITHUB_REPO = "https://github.com/tony-co/nonna.fm";
function Footer({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "sticky bottom-0 z-40 border-t border-indigo-200/20 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-indigo-800/20 dark:bg-[#0A0A1B]/80",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto flex items-center justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden items-center gap-4 lg:flex",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `${GITHUB_BASE_URL}/PRIVACY.md`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    strokeWidth: 1.5,
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                        lineNumber: 26,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                    lineNumber: 18,
                                    columnNumber: 13
                                }, this),
                                "Privacy"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                            lineNumber: 12,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: `${GITHUB_BASE_URL}/TERMS.md`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    strokeWidth: 1.5,
                                    stroke: "currentColor",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        d: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                    lineNumber: 40,
                                    columnNumber: 13
                                }, this),
                                "Terms"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                            lineNumber: 34,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: GITHUB_REPO,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "group flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-all hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-stone-400 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "h-3.5 w-3.5 opacity-70 transition-opacity group-hover:opacity-100",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                        lineNumber: 68,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                                    lineNumber: 62,
                                    columnNumber: 13
                                }, this),
                                "GitHub"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                    lineNumber: 11,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "ml-auto flex w-full justify-end lg:w-auto",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
            lineNumber: 9,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/layout/Footer.tsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/shared/AudioEqualizer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioEqualizer",
    ()=>AudioEqualizer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$28$2e$3_react$40$19$2e$1$2e$1$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/styled-jsx@5.1.6_@babel+core@7.28.3_react@19.1.1/node_modules/styled-jsx/style.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
// Create a client-only version of the component
const AudioEqualizerClient = ({ className = "" })=>{
    const totalBars = 32;
    // Define indigo color shades from Tailwind's palette
    const indigoShades = [
        "#312e81",
        "#3730a3",
        "#4338ca",
        "#4f46e5",
        "#6366f1",
        "#818cf8",
        "#a5b4fc",
        "#c7d2fe",
        "#e0e7ff"
    ];
    // Helper function to format numbers consistently
    const formatNumber = (num)=>{
        return Number(num.toFixed(4));
    };
    // Generate base animation parameters with smoother transitions
    const baseAnimationParams = Array.from({
        length: totalBars
    }).map((_, i)=>{
        const positionFactor = i / totalBars;
        // Create position-based speed variation (faster in middle, slower at edges)
        const positionBasedSpeed = 1.8 - Math.sin(positionFactor * Math.PI) * 0.6;
        // Add slight randomness (±0.2s) to make it more natural
        const randomVariation = Math.sin(i * 0.7) * 0.2;
        // Combine position-based speed with slight randomness
        const duration = formatNumber(positionBasedSpeed + randomVariation);
        // Create smooth wave pattern for delays
        const delay = formatNumber((Math.sin(i * 0.4) + 1) / 2);
        return {
            delay,
            duration
        };
    });
    // Smooth the animation parameters to create more natural transitions
    const smoothedParams = baseAnimationParams.map((param, i)=>{
        // Get neighboring bars' parameters
        const prevParams = i > 0 ? baseAnimationParams[i - 1] : param;
        const nextParams = i < totalBars - 1 ? baseAnimationParams[i + 1] : param;
        // Apply weighted average for smoother transitions
        return {
            delay: formatNumber((prevParams.delay + param.delay * 2 + nextParams.delay) / 4),
            duration: formatNumber((prevParams.duration + param.duration * 2 + nextParams.duration) / 4)
        };
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            contain: "paint layout style",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden"
        },
        className: "jsx-505b55c2546e821a" + " " + `relative mx-auto h-16 w-full max-w-[400px] ${className}`,
        children: [
            Array.from({
                length: totalBars
            }).map((_, i)=>{
                const positionFactor = formatNumber(i / totalBars);
                // Create a smoother intensity curve
                const intensity = formatNumber(Math.pow(Math.sin(positionFactor * Math.PI) * Math.sin(positionFactor * Math.PI * 2) * 0.8 + 0.2, 1.2));
                // Use smoothed parameters for animations
                const animParams = smoothedParams[i];
                // Calculate color index based on position
                const colorIndex = Math.floor(i / totalBars * indigoShades.length);
                const color = indigoShades[colorIndex];
                // Calculate height with smoother variations
                const baseHeight = 12;
                const maxRandomHeight = 24;
                const heightVariation = formatNumber(Math.sin(i * 0.3) * maxRandomHeight * 0.5 + maxRandomHeight * 0.5);
                const finalHeight = formatNumber(baseHeight + heightVariation);
                const left = `${formatNumber(i / totalBars * 100)}%`;
                const scaleY = formatNumber(0.2 + intensity * 0.8);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        left,
                        height: `${finalHeight}px`,
                        animation: `equalizer-bar ${animParams.duration}s infinite ease-in-out alternate`,
                        animationDelay: `${animParams.delay}s`,
                        transformOrigin: "bottom",
                        transform: `translateZ(0) scaleY(${scaleY})`,
                        willChange: "transform"
                    },
                    className: "jsx-505b55c2546e821a" + " " + "absolute bottom-0 w-[10px] transform-gpu opacity-80",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: color,
                            boxShadow: `0 0 10px ${color}40`,
                            transform: "translateZ(0)"
                        },
                        className: "jsx-505b55c2546e821a" + " " + "h-full w-full transform-gpu rounded-xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/AudioEqualizer.tsx",
                        lineNumber: 117,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/apps/web/src/components/shared/AudioEqualizer.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$styled$2d$jsx$40$5$2e$1$2e$6_$40$babel$2b$core$40$7$2e$28$2e$3_react$40$19$2e$1$2e$1$2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "505b55c2546e821a",
                children: "@keyframes equalizer-bar{0%,to{transform:translateZ(0)scaleY(.3)}50%{transform:translateZ(0)scaleY(1)}}[class*=animate-].jsx-505b55c2546e821a{will-change:transform;backface-visibility:hidden;perspective:1000px;transform-style:preserve-3d}@media (prefers-reduced-motion:reduce){.group.jsx-505b55c2546e821a,.group.jsx-505b55c2546e821a .jsx-505b55c2546e821a,[class*=animate-].jsx-505b55c2546e821a{transition:none!important;animation:none!important;transform:none!important}}.transform-gpu.jsx-505b55c2546e821a{backface-visibility:hidden;perspective:1000px;transform:translateZ(0)}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/shared/AudioEqualizer.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function AudioEqualizer(props) {
    const [isClient, setIsClient] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        setIsClient(true);
    }, []);
    if (!isClient) {
        // Return a placeholder with the same dimensions to prevent layout shift
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative mx-auto h-16 w-full max-w-[400px] ${props.className}`
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/AudioEqualizer.tsx",
            lineNumber: 179,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AudioEqualizerClient, {
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/AudioEqualizer.tsx",
        lineNumber: 182,
        columnNumber: 10
    }, this);
}
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearEncryption",
    ()=>clearEncryption,
    "decrypt",
    ()=>decrypt,
    "encrypt",
    ()=>encrypt,
    "generateCodeChallenge",
    ()=>generateCodeChallenge,
    "generateRandomString",
    ()=>generateRandomString,
    "initializeEncryption",
    ()=>initializeEncryption
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/index.js [app-ssr] (ecmascript)");
;
const ENCRYPTION_KEY_STORAGE = "encryption_key";
const STATE_STORAGE = "spotify_auth_state";
// We'll generate this key on app start and keep it in memory and localStorage
// This provides a basic level of encryption for the current session
let ENCRYPTION_KEY;
function initializeEncryption() {
    // Try to get existing key from localStorage
    const storedKey = localStorage.getItem(ENCRYPTION_KEY_STORAGE);
    if (storedKey) {
        ENCRYPTION_KEY = storedKey;
    } else {
        // Generate new key if none exists
        ENCRYPTION_KEY = generateRandomString(32);
        localStorage.setItem(ENCRYPTION_KEY_STORAGE, ENCRYPTION_KEY);
    }
}
function encrypt(text) {
    if (!ENCRYPTION_KEY) {
        throw new Error("Encryption not initialized");
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AES"].encrypt(text, ENCRYPTION_KEY).toString();
}
function decrypt(ciphertext) {
    if (!ENCRYPTION_KEY) {
        initializeEncryption(); // Try to initialize if not already done
    }
    const bytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AES"].decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["enc"].Utf8);
}
function generateRandomString(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x)=>acc + possible[x % possible.length], "");
}
async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function clearEncryption() {
    ENCRYPTION_KEY = "";
    localStorage.removeItem(ENCRYPTION_KEY_STORAGE);
    localStorage.removeItem(STATE_STORAGE);
}
}),
"[project]/apps/web/src/lib/services/spotify/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearSpotifyAuth",
    ()=>clearSpotifyAuth,
    "getSpotifyAuthData",
    ()=>getSpotifyAuthData,
    "handleSpotifyCallback",
    ()=>handleSpotifyCallback,
    "initiateSpotifyAuth",
    ()=>initiateSpotifyAuth,
    "refreshSpotifyToken",
    ()=>refreshSpotifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
;
const SOURCE_SPOTIFY_SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read"
];
const TARGET_SPOTIFY_SCOPES = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-library-read",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-modify"
];
async function fetchSpotifyUserProfile(accessToken) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        return {
            id: data.id
        };
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}
async function initiateSpotifyAuth(role) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    // Clear any existing auth data for this role
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    const state = {
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRandomString"])(16),
        role
    };
    const codeVerifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRandomString"])(64);
    const codeChallenge = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateCodeChallenge"])(codeVerifier);
    // Store state and code verifier
    const stateKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE;
    const verifierKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
    try {
        localStorage.setItem(stateKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encrypt"])(JSON.stringify(state)));
        document.cookie = `${verifierKey}=${codeVerifier}; path=/; max-age=3600; SameSite=Lax`;
    } catch (error) {
        console.error("Failed to store auth data:", error);
        throw new Error("Failed to initialize authentication");
    }
    const scopes = role === "source" ? SOURCE_SPOTIFY_SCOPES : TARGET_SPOTIFY_SCOPES;
    const params = new URLSearchParams({
        client_id: ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a") || "",
        response_type: "code",
        redirect_uri: `${("TURBOPACK compile-time value", "https://nonnalocal.fm:3000")}/callback/spotify`,
        state: JSON.stringify(state),
        scope: scopes.join(" "),
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        show_dialog: "true"
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
async function handleSpotifyCallback(searchParams) {
    console.log("Starting Spotify callback handling in auth.ts...");
    // Initialize encryption before handling callback
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    if (!searchParams) {
        console.error("No search params provided");
        return {
            success: false
        };
    }
    const params = new URLSearchParams(searchParams);
    const code = params.get("code");
    const receivedState = params.get("state");
    const error = params.get("error");
    console.log("Received params:", {
        hasCode: !!code,
        hasState: !!receivedState,
        error: error || "none"
    });
    if (error) {
        console.error("Spotify auth error:", error);
        return {
            success: false
        };
    }
    // Verify state
    let storedState = null;
    try {
        const encryptedState = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE) || localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE);
        if (encryptedState) {
            storedState = JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decrypt"])(encryptedState));
        }
    } catch (error) {
        console.error("Failed to decrypt stored state:", error);
        return {
            success: false
        };
    }
    if (!storedState || !receivedState) {
        console.error("State missing", {
            hasStoredState: !!storedState,
            hasReceivedState: !!receivedState
        });
        return {
            success: false
        };
    }
    try {
        const parsedReceivedState = JSON.parse(receivedState);
        if (parsedReceivedState.role !== storedState.role) {
            console.error("State role mismatch");
            return {
                success: false
            };
        }
    } catch (error) {
        console.error("Failed to parse received state:", error);
        return {
            success: false
        };
    }
    // Get stored code verifier from cookies
    let codeVerifier = null;
    try {
        const cookies = document.cookie.split(";");
        const verifierKey = storedState.role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
        const verifierCookie = cookies.find((cookie)=>cookie.trim().startsWith(`${verifierKey}=`));
        if (verifierCookie) {
            // Extract everything after the equals sign, properly handling URL encoding
            codeVerifier = decodeURIComponent(verifierCookie.split("=")[1].trim());
        }
    } catch (error) {
        console.error("Failed to get code verifier from cookies:", error);
        return {
            success: false
        };
    }
    if (!codeVerifier || !code) {
        console.error("Missing verifier or code", {
            hasCodeVerifier: !!codeVerifier,
            hasCode: !!code
        });
        return {
            success: false
        };
    }
    console.log("State and verifier validation successful");
    // Exchange code for token with retry logic
    console.log("Exchanging code for token...");
    let tokenResponse;
    let retryCount = 0;
    const maxRetries = 3;
    const backoffMs = 1000; // Start with 1 second delay
    while(retryCount < maxRetries){
        try {
            tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a") || "",
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: ("TURBOPACK compile-time value", "https://nonnalocal.fm:3000/callback/spotify") || "",
                    code_verifier: codeVerifier
                })
            });
            if (tokenResponse.ok) {
                break;
            }
            const errorText = await tokenResponse.text();
            console.warn(`Token exchange attempt ${retryCount + 1} failed:`, {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorText
            });
            // If we get a 400 error, the code might be invalid/expired - no point retrying
            if (tokenResponse.status === 400) {
                console.error("Token exchange failed with 400 - code might be invalid or expired");
                return {
                    success: false
                };
            }
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying in ${backoffMs / 1000} seconds...`);
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            }
        } catch (error) {
            console.error(`Network error during token exchange attempt ${retryCount + 1}:`, error);
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying in ${backoffMs / 1000} seconds...`);
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            } else {
                console.error("Max retries reached for token exchange");
                return {
                    success: false
                };
            }
        }
    }
    if (!tokenResponse || !tokenResponse.ok) {
        console.error("All token exchange attempts failed");
        return {
            success: false
        };
    }
    console.log("Token exchange successful");
    let tokenData;
    try {
        tokenData = await tokenResponse.json();
    } catch (error) {
        console.error("Failed to parse token response:", error);
        return {
            success: false
        };
    }
    // Clear state and verifier
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(storedState.role);
    // Store auth data
    try {
        // Fetch user profile
        const userProfile = await fetchSpotifyUserProfile(tokenData.access_token);
        const authData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            timestamp: Date.now(),
            userId: userProfile.id,
            tokenType: tokenData.token_type,
            role: storedState.role,
            serviceId: "spotify"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(storedState.role, authData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(storedState.role, "spotify");
        return {
            success: true,
            role: storedState.role
        };
    } catch (error) {
        console.error("Failed to store auth data:", error);
        return {
            success: false
        };
    }
}
async function getSpotifyAuthData(role) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const authData = undefined;
    // Check if token is expired or will expire in less than 5 minutes
    const expirationTime = undefined;
    const now = undefined;
    const timeToExpiry = undefined;
}
async function refreshSpotifyToken(refreshToken, role, directRequest = false) {
    try {
        if (!refreshToken || refreshToken.trim() === "") {
            throw new Error("Empty refresh token provided");
        }
        console.log("Attempting to refresh token with refresh token length:", refreshToken?.length);
        let responseData;
        // Get existing auth data to preserve user info
        const existingAuthData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthData"])(role);
        // For test environments, allow direct requests to Spotify API
        if (directRequest) {
            const clientId = ("TURBOPACK compile-time value", "cfa9625b2aaa4c16aa8a3e90fa145e3a");
            const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
            if (!clientId || !clientSecret) {
                throw new Error("Missing Spotify client credentials");
            }
            // Create Basic Auth header
            const buffer = Buffer.from(`${clientId}:${clientSecret}`);
            const base64Auth = buffer.toString("base64");
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${base64Auth}`
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: refreshToken,
                    client_id: clientId
                }).toString()
            });
            if (!response.ok) {
                console.error("Direct Spotify API request failed:", response.status, response.statusText);
                return null;
            }
            responseData = await response.json();
        } else {
            // Use our server API endpoint (default approach)
            const refreshUrl = `${("TURBOPACK compile-time value", "https://nonnalocal.fm:3000")}/api/spotify/refresh`;
            const response = await fetch(refreshUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
            try {
                responseData = await response.json();
            } catch (error) {
                console.error("Failed to parse response as JSON:", error);
                return null;
            }
            if (!response.ok) {
                console.error("Failed to refresh token:", response.status, response.statusText);
                console.error("Error details:", responseData);
                return null;
            }
        }
        if (!responseData.access_token) {
            console.error("Invalid token response - missing access_token:", responseData);
            return null;
        }
        const authData = {
            accessToken: responseData.access_token,
            refreshToken: responseData.refresh_token || refreshToken,
            expiresIn: responseData.expires_in,
            timestamp: Date.now(),
            userId: existingAuthData?.userId || "",
            tokenType: responseData.token_type || "Bearer",
            role: role,
            serviceId: "spotify"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(role, authData);
        return authData;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}
function clearSpotifyAuth(role) {
    if (role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("source");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("target");
    }
}
}),
"[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearYouTubeAuth",
    ()=>clearYouTubeAuth,
    "getYouTubeAuthData",
    ()=>getYouTubeAuthData,
    "handleYouTubeCallback",
    ()=>handleYouTubeCallback,
    "initiateYouTubeAuth",
    ()=>initiateYouTubeAuth,
    "refreshYouTubeToken",
    ()=>refreshYouTubeToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
;
// Readonly scope for source role
const YOUTUBE_READ_SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly"
].join(" ");
// Write scopes for target role
const YOUTUBE_WRITE_SCOPES = [
    "https://www.googleapis.com/auth/youtube"
].join(" ");
async function initiateYouTubeAuth(role) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    // Clear any existing auth data for this role
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    const state = {
        value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRandomString"])(16),
        role
    };
    const codeVerifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRandomString"])(64);
    const codeChallenge = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateCodeChallenge"])(codeVerifier);
    // Store state and code verifier
    const stateKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE;
    const verifierKey = role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
    try {
        localStorage.setItem(stateKey, (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encrypt"])(JSON.stringify(state)));
        document.cookie = `${verifierKey}=${codeVerifier}; path=/; max-age=3600; SameSite=Lax`;
    } catch (error) {
        console.error("Failed to store auth data:", error);
        throw new Error("Failed to initialize authentication");
    }
    // Use appropriate scopes based on role
    const scopes = role === "source" ? YOUTUBE_READ_SCOPES : YOUTUBE_WRITE_SCOPES;
    const params = new URLSearchParams({
        client_id: ("TURBOPACK compile-time value", "227190513562-2lke78tmen70slunujpsrmsjv5csu06h.apps.googleusercontent.com") || "",
        response_type: "code",
        redirect_uri: `${("TURBOPACK compile-time value", "https://nonnalocal.fm:3000")}/callback/youtube`,
        state: JSON.stringify(state),
        scope: scopes,
        access_type: "offline",
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        prompt: "consent"
    });
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
async function handleYouTubeCallback(searchParams) {
    console.log("Starting YouTube callback handling...");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    if (!searchParams) {
        console.error("No search params provided");
        return {
            success: false
        };
    }
    const params = new URLSearchParams(searchParams);
    const code = params.get("code");
    const receivedState = params.get("state");
    const error = params.get("error");
    console.log("Received callback request");
    if (error) {
        console.error("YouTube auth error occurred");
        return {
            success: false
        };
    }
    // Verify state
    let storedState = null;
    try {
        const encryptedState = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE) || localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE);
        if (encryptedState) {
            storedState = JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decrypt"])(encryptedState));
        }
    } catch  {
        console.error("State validation failed");
        return {
            success: false
        };
    }
    if (!storedState || !receivedState) {
        console.error("State validation failed");
        return {
            success: false
        };
    }
    try {
        const parsedReceivedState = JSON.parse(receivedState);
        if (parsedReceivedState.role !== storedState.role) {
            console.error("State role validation failed");
            return {
                success: false
            };
        }
    } catch  {
        console.error("State validation failed");
        return {
            success: false
        };
    }
    // Get stored code verifier from cookies
    let codeVerifier = null;
    try {
        const cookies = document.cookie.split(";");
        const verifierKey = storedState.role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER;
        const verifierCookie = cookies.find((cookie)=>cookie.trim().startsWith(`${verifierKey}=`));
        if (verifierCookie) {
            codeVerifier = verifierCookie.split("=")[1].trim();
        }
    } catch (error) {
        console.error("Failed to get code verifier from cookies:", error);
        return {
            success: false
        };
    }
    if (!codeVerifier || !code) {
        console.error("Missing verifier or code");
        return {
            success: false
        };
    }
    console.log("State validation successful");
    // Exchange code for token
    console.log("Starting token exchange...");
    let tokenResponse;
    try {
        tokenResponse = await fetch("/api/auth/youtube/callback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code,
                codeVerifier
            })
        });
    } catch  {
        console.error("Network error during token exchange");
        return {
            success: false
        };
    }
    if (!tokenResponse.ok) {
        await tokenResponse.text(); // Consume the response
        console.error("Token exchange failed");
        return {
            success: false
        };
    }
    console.log("Token exchange successful");
    let tokenData;
    try {
        tokenData = await tokenResponse.json();
    } catch (error) {
        console.error("Failed to parse token response:", error);
        return {
            success: false
        };
    }
    // Clear state and verifier
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(storedState.role);
    // Store auth data and fetch user profile
    try {
        const userProfile = await fetchYouTubeUserProfile(tokenData.access_token);
        const authData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            timestamp: Date.now(),
            userId: userProfile.id,
            tokenType: tokenData.token_type,
            role: storedState.role,
            serviceId: "youtube"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(storedState.role, authData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(storedState.role, "youtube");
        return {
            success: true,
            role: storedState.role
        };
    } catch (error) {
        console.error("Failed to store auth data or fetch user profile:", error);
        if (error instanceof Error && error.message === "No channel found for user") {
            return {
                success: false,
                error: "You don't have a YouTube channel. Please create one to continue.",
                role: storedState.role
            };
        }
        return {
            success: false
        };
    }
}
async function refreshYouTubeToken(refreshToken, role, directRequest = false) {
    try {
        if (!refreshToken || refreshToken.trim() === "") {
            throw new Error("Empty refresh token provided");
        }
        console.log("Attempting to refresh YouTube token with refresh token length:", refreshToken?.length);
        // Get existing auth data to preserve user info
        const existingAuthData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthData"])(role);
        let responseData;
        if (directRequest) {
            const clientId = ("TURBOPACK compile-time value", "227190513562-2lke78tmen70slunujpsrmsjv5csu06h.apps.googleusercontent.com");
            const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
            if (!clientId || !clientSecret) {
                throw new Error("Missing YouTube client credentials");
            }
            const response = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: refreshToken,
                    grant_type: "refresh_token"
                }).toString()
            });
            if (!response.ok) {
                console.error("Direct YouTube API request failed:", response.status, response.statusText);
                return null;
            }
            responseData = await response.json();
        } else {
            const response = await fetch("/api/auth/youtube/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
            if (!response.ok) {
                console.error("Failed to refresh token:", response.status, response.statusText);
                return null;
            }
            responseData = await response.json();
        }
        if (!responseData.access_token) {
            console.error("Invalid token response - missing access_token:", responseData);
            return null;
        }
        const authData = {
            accessToken: responseData.access_token,
            refreshToken: responseData.refresh_token || refreshToken,
            expiresIn: responseData.expires_in,
            timestamp: Date.now(),
            userId: existingAuthData?.userId || "",
            tokenType: responseData.token_type || "Bearer",
            role: role,
            serviceId: "youtube"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(role, authData);
        return authData;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}
async function getYouTubeAuthData(role) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const authData = undefined;
    // Check if token is expired or about to expire (within 5 minutes)
    const expirationTime = undefined;
    const now = undefined;
    const expirationThreshold = undefined; // 5 minutes in milliseconds
    const isExpired = undefined;
}
function clearYouTubeAuth(role) {
    if (role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("source");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("target");
    }
}
async function fetchYouTubeUserProfile(accessToken) {
    try {
        const response = await fetch("https://www.googleapis.com/youtube/v3/channels?part=id&mine=true", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            throw new Error("No channel found for user");
        }
        return {
            id: data.items[0].id
        };
    } catch (error) {
        console.error("Error fetching YouTube user profile:", error);
        throw error;
    }
}
}),
"[project]/apps/web/src/lib/services/deezer/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEEZER_ENDPOINTS",
    ()=>DEEZER_ENDPOINTS,
    "clearDeezerPlaylist",
    ()=>clearDeezerPlaylist,
    "clearDeezerUserId",
    ()=>clearDeezerUserId,
    "getDeezerPlaylist",
    ()=>getDeezerPlaylist,
    "getDeezerUserId",
    ()=>getDeezerUserId,
    "handleDeezerCallback",
    ()=>handleDeezerCallback,
    "isDeezerSource",
    ()=>isDeezerSource,
    "storeDeezerPlaylist",
    ()=>storeDeezerPlaylist,
    "storeDeezerUserId",
    ()=>storeDeezerUserId,
    "validateDeezerUser",
    ()=>validateDeezerUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
const DEEZER_ENDPOINTS = {
    user: (userId)=>`/user/${userId}`,
    playlists: (userId)=>`/user/${userId}/playlists`,
    tracks: (userId)=>`/user/${userId}/tracks`,
    albums: (userId)=>`/user/${userId}/albums`,
    artists: (userId)=>`/user/${userId}/artists`
};
const validateDeezerUser = async (userId)=>{
    try {
        const response = await fetch(`/api/deezer/user/${userId}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Failed to validate Deezer user");
        }
        if ("error" in data) {
            throw new Error(data.error);
        }
        return data;
    } catch (error) {
        console.error("Error validating Deezer user:", error);
        throw new Error("Failed to validate Deezer user. Make sure the profile is public and try again.");
    }
};
const storeDeezerUserId = (userId)=>{
    localStorage.setItem("deezer_user_id", userId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])("source", "deezer");
};
const getDeezerUserId = ()=>{
    return localStorage.getItem("deezer_user_id");
};
const clearDeezerUserId = ()=>{
    localStorage.removeItem("deezer_user_id");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("source"); // Clear any source service type
};
const storeDeezerPlaylist = (playlist)=>{
    localStorage.setItem("deezer_selected_playlist", JSON.stringify(playlist));
};
const getDeezerPlaylist = ()=>{
    const playlist = localStorage.getItem("deezer_selected_playlist");
    return playlist ? JSON.parse(playlist) : null;
};
const clearDeezerPlaylist = ()=>{
    localStorage.removeItem("deezer_selected_playlist");
};
const isDeezerSource = ()=>{
    const serviceType = localStorage.getItem("nonna_source_service");
    return serviceType === "deezer";
};
const handleDeezerCallback = async (searchString)=>{
    try {
        const params = new URLSearchParams(searchString);
        const userId = params.get("userId");
        const role = params.get("role");
        if (!userId) {
            throw new Error("No user ID provided in callback");
        }
        if (!role || ![
            "source",
            "target"
        ].includes(role)) {
            throw new Error("Invalid role provided in callback");
        }
        // Store the user ID and set the service type
        localStorage.setItem("deezer_user_id", userId);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(role, "deezer");
        return {
            success: true,
            role
        };
    } catch (error) {
        console.error("Error handling Deezer callback:", error);
        return {
            success: false,
            role: "source"
        };
    }
};
}),
"[project]/apps/web/src/lib/auth/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllServiceData",
    ()=>clearAllServiceData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/deezer/auth.ts [app-ssr] (ecmascript)");
;
;
;
;
function clearAllServiceData() {
    // Clear service-specific data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearSpotifyAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearYouTubeAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearDeezerUserId"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearDeezerPlaylist"])();
    // Clear encryption (this will force a new encryption key generation)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearEncryption"])();
    // Clear any additional localStorage items that might be related to services
    localStorage.removeItem("encryption_key");
    localStorage.removeItem("spotify_auth_state");
    localStorage.removeItem("youtube_auth_state");
    // Clear any service-related cookies
    const cookies = [
        "spotify_code_verifier",
        "youtube_code_verifier"
    ];
    cookies.forEach((cookie)=>{
        document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
}
}),
"[project]/apps/web/src/lib/services/apple/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAppleAuth",
    ()=>clearAppleAuth,
    "clearAppleMusicAuth",
    ()=>clearAppleMusicAuth,
    "getAppleAuthData",
    ()=>getAppleAuthData,
    "getAppleMusicAuthData",
    ()=>getAppleMusicAuthData,
    "handleAppleCallback",
    ()=>handleAppleCallback,
    "refreshAppleToken",
    ()=>refreshAppleToken,
    "setAppleMusicAuthData",
    ()=>setAppleMusicAuthData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
;
function getAppleMusicAuthData(role) {
    try {
        const authData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthData"])(role);
        if (!authData || authData.serviceId !== "apple") {
            return null;
        }
        // Check if the token is expired
        if (Date.now() >= authData.timestamp + authData.expiresIn * 1000) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
            return null;
        }
        return authData;
    } catch  {
        console.error("Error retrieving Apple Music auth data");
        return null;
    }
}
function setAppleMusicAuthData(role, data) {
    try {
        const authData = {
            ...data,
            role,
            serviceId: "apple"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(role, authData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(role, "apple");
    } catch  {
        console.error("Error storing Apple Music auth data");
    }
}
function clearAppleMusicAuth(role) {
    if (role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("source");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("target");
    }
}
async function handleAppleCallback(searchParams) {
    console.log("Starting Apple callback handling...");
    // Initialize encryption before handling callback
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    if (!searchParams) {
        console.error("No search params provided");
        return {
            success: false
        };
    }
    const params = new URLSearchParams(searchParams);
    const code = params.get("code");
    const receivedState = params.get("state");
    const error = params.get("error");
    if (error) {
        console.error("Apple auth error occurred");
        return {
            success: false
        };
    }
    // Verify state
    let storedState = null;
    try {
        const encryptedState = localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.STATE) || localStorage.getItem(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.STATE);
        if (encryptedState) {
            storedState = JSON.parse((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decrypt"])(encryptedState));
        }
    } catch (error) {
        console.error("Failed to decrypt stored state:", error);
        return {
            success: false
        };
    }
    if (!storedState || !receivedState) {
        console.error("State validation failed");
        return {
            success: false
        };
    }
    try {
        const parsedReceivedState = JSON.parse(receivedState);
        if (parsedReceivedState.role !== storedState.role) {
            console.error("State role validation failed");
            return {
                success: false
            };
        }
    } catch (error) {
        console.error("Failed to parse received state:", error);
        return {
            success: false
        };
    }
    // Get stored code verifier from cookies
    let codeVerifier = null;
    try {
        const cookies = document.cookie.split(";");
        const verifierCookie = cookies.find((cookie)=>cookie.trim().startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.CODE_VERIFIER) || cookie.trim().startsWith(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.CODE_VERIFIER));
        if (verifierCookie) {
            codeVerifier = verifierCookie.split("=")[1].trim();
        }
    } catch (error) {
        console.error("Failed to get code verifier from cookies:", error);
        return {
            success: false
        };
    }
    if (!codeVerifier || !code) {
        console.error("Missing verifier or code");
        return {
            success: false
        };
    }
    // Exchange code for token with retry logic
    let tokenResponse;
    let retryCount = 0;
    const maxRetries = 3;
    const backoffMs = 1000;
    while(retryCount < maxRetries){
        try {
            tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    client_id: ("TURBOPACK compile-time value", "com.tcosentino.nonna") || "",
                    client_secret: process.env.APPLE_CLIENT_SECRET || "",
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: ("TURBOPACK compile-time value", "https://nonnalocal.fm:3000/api/auth/apple/callback") || "",
                    code_verifier: codeVerifier
                })
            });
            if (tokenResponse.ok) {
                break;
            }
            const errorText = await tokenResponse.text();
            console.warn(`Token exchange attempt ${retryCount + 1} failed:`, {
                status: tokenResponse.status,
                statusText: tokenResponse.statusText,
                error: errorText
            });
            // If we get a 400 error, the code might be invalid/expired - no point retrying
            if (tokenResponse.status === 400) {
                console.error("Token exchange failed with 400 - code might be invalid or expired");
                return {
                    success: false
                };
            }
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying in ${backoffMs / 1000} seconds...`);
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            }
        } catch (error) {
            console.error(`Network error during token exchange attempt ${retryCount + 1}:`, error);
            retryCount++;
            if (retryCount < maxRetries) {
                console.log(`Retrying in ${backoffMs / 1000} seconds...`);
                await new Promise((resolve)=>setTimeout(resolve, backoffMs * retryCount));
            } else {
                console.error("Max retries reached for token exchange");
                return {
                    success: false
                };
            }
        }
    }
    if (!tokenResponse || !tokenResponse.ok) {
        console.error("All token exchange attempts failed");
        return {
            success: false
        };
    }
    let tokenData;
    try {
        tokenData = await tokenResponse.json();
    } catch (error) {
        console.error("Failed to parse token response:", error);
        return {
            success: false
        };
    }
    // Clear state and verifier
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(storedState.role);
    // Store auth data
    try {
        // Fetch user profile
        const userProfile = await fetchAppleMusicUserProfile();
        const authData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            timestamp: Date.now(),
            userId: userProfile.id,
            tokenType: tokenData.token_type,
            role: storedState.role,
            serviceId: "apple"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(storedState.role, authData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(storedState.role, "apple");
        return {
            success: true,
            role: storedState.role
        };
    } catch (error) {
        console.error("Failed to store auth data:", error);
        return {
            success: false
        };
    }
}
async function getAppleAuthData(role) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const authData = undefined;
    // Check if token is expired or will expire in less than 5 minutes
    const expirationTime = undefined;
    const now = undefined;
    const timeToExpiry = undefined;
}
async function refreshAppleToken(refreshToken, role) {
    try {
        const response = await fetch("https://appleid.apple.com/auth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: ("TURBOPACK compile-time value", "com.tcosentino.nonna") || "",
                client_secret: process.env.APPLE_CLIENT_SECRET || ""
            })
        });
        if (!response.ok) {
            console.error("Failed to refresh token:", response.statusText);
            return null;
        }
        const tokenData = await response.json();
        const authData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token || refreshToken,
            expiresIn: tokenData.expires_in,
            timestamp: Date.now(),
            userId: "",
            tokenType: tokenData.token_type,
            role: role,
            serviceId: "apple"
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthData"])(role, authData);
        return authData;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
}
function clearAppleAuth(role) {
    if (role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])(role);
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("source");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAuthData"])("target");
    }
}
async function fetchAppleMusicUserProfile() {
    try {
        const music = window.MusicKit.getInstance();
        // Get the current user's info which includes their unique identifier
        const userInfo = await music.authorize();
        return {
            id: userInfo
        };
    } catch (error) {
        console.error("Error fetching Apple Music user profile:", error);
        throw error;
    }
}
}),
"[project]/apps/web/src/lib/utils/batch-processor.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility for processing items in batches with consistent error handling and logging
 */ __turbopack_context__.s([
    "processInBatches",
    ()=>processInBatches
]);
async function processInBatches(processBatch, options) {
    const { items, batchSize = 5, delayBetweenBatches = 100, onBatchStart, onBatchComplete, onError = (error, batch)=>{
        throw new Error(`Batch processing error: ${error.message}`, {
            cause: {
                error,
                batch
            }
        });
    } } = options;
    let added = 0;
    let failed = 0;
    const totalBatches = Math.ceil(items.length / batchSize);
    for(let i = 0; i < items.length; i += batchSize){
        const batchNumber = Math.floor(i / batchSize) + 1;
        const batch = items.slice(i, i + batchSize);
        try {
            onBatchStart?.(batchNumber, totalBatches);
            await processBatch(batch);
            added += batch.length;
            onBatchComplete?.(batch.length, 0);
        } catch (error) {
            failed += batch.length;
            onError?.(error, batch);
            // If error is AbortError, stop processing
            if (error instanceof DOMException && error.name === "AbortError" || error instanceof Error && error.message === "Aborted") {
                console.log("Batch processing aborted due to AbortError");
                break;
            }
        }
        // Add delay between batches if not the last batch
        if (i + batchSize < items.length) {
            await new Promise((resolve)=>setTimeout(resolve, delayBetweenBatches));
        }
    }
    return {
        added,
        failed,
        total: items.length
    };
}
}),
"[project]/apps/web/src/lib/utils/matching.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_ALBUM_CONFIG",
    ()=>DEFAULT_ALBUM_CONFIG,
    "DEFAULT_TRACK_CONFIG",
    ()=>DEFAULT_TRACK_CONFIG,
    "calculateAlbumMatchScore",
    ()=>calculateAlbumMatchScore,
    "calculateStringSimilarity",
    ()=>calculateStringSimilarity,
    "calculateTrackMatchScore",
    ()=>calculateTrackMatchScore,
    "cleanSearchTerm",
    ()=>cleanSearchTerm,
    "cleanTrackTitle",
    ()=>cleanTrackTitle,
    "normalizeString",
    ()=>normalizeString,
    "splitArtists",
    ()=>splitArtists
]);
const DEFAULT_TRACK_CONFIG = {
    weights: {
        name: 0.45,
        artist: 0.45,
        album: 0.1
    },
    thresholds: {
        minimum: 0.6,
        boost: 0.7
    }
};
const DEFAULT_ALBUM_CONFIG = {
    weights: {
        name: 0.65,
        artist: 0.35
    },
    thresholds: {
        minimum: 0.6,
        boost: 0.85
    }
};
function normalizeString(str) {
    const result = str.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s*-\s*/g, " ") // Convert all hyphens to spaces
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()[\]'"']/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
    return result;
}
function splitArtists(artistStr) {
    return artistStr.split(/\s*(?:,|\band\b|&)\s*/).map((artist)=>artist.trim()).filter(Boolean);
}
function calculateStringSimilarity(str1, str2) {
    const norm1 = normalizeString(str1);
    const norm2 = normalizeString(str2);
    // Exact match after normalization
    if (norm1 === norm2) return 1;
    // Calculate word match ratio
    const words1 = norm1.split(" ");
    const words2 = norm2.split(" ");
    const commonWords = words1.filter((word)=>words2.includes(word));
    return 2 * commonWords.length / (words1.length + words2.length);
}
// Helper to compare artist arrays for better matching
/**
 * Calculates similarity between two artist strings by splitting them into arrays and checking for overlap.
 * - Returns 1 if any artist in target is present in source (or vice versa).
 * - Otherwise, returns the best string similarity between any pair.
 */ function calculateArtistArraySimilarity(sourceArtist, targetArtist) {
    const sourceArtists = splitArtists(sourceArtist).map(normalizeString);
    const targetArtists = splitArtists(targetArtist).map(normalizeString);
    // If any target artist is in source artists, consider it a strong match
    for (const t of targetArtists){
        if (sourceArtists.includes(t)) return 1;
    }
    // If any source artist is in target artists, also strong match
    for (const s of sourceArtists){
        if (targetArtists.includes(s)) return 1;
    }
    // Otherwise, return the best string similarity between any pair
    let best = 0;
    for (const s of sourceArtists){
        for (const t of targetArtists){
            best = Math.max(best, calculateStringSimilarity(s, t));
        }
    }
    return best;
}
async function calculateTrackMatchScore(sourceTrack, targetTrack, config = DEFAULT_TRACK_CONFIG) {
    const { weights } = config;
    // Calculate individual scores
    const nameScore = calculateStringSimilarity(sourceTrack.name, targetTrack.name);
    const artistScore = calculateStringSimilarity(sourceTrack.artist, targetTrack.artist);
    const albumScore = targetTrack.album ? calculateStringSimilarity(sourceTrack.album ?? "", targetTrack.album) : undefined;
    // Calculate total score
    let totalScore = nameScore * weights.name + artistScore * weights.artist;
    if (weights.album && albumScore !== undefined) {
        totalScore += albumScore * weights.album;
    }
    // If we have a YouTube video ID and the score is low, try additional matching strategies
    if (!!sourceTrack.videoId && totalScore < 0.5) {
        // First try: Compare source name against combined target name + artist
        const combinedTargetTitle = `${targetTrack.name} ${targetTrack.artist}`;
        const combinedNameScore = calculateStringSimilarity(sourceTrack.name, combinedTargetTitle);
        // If the combined score is significantly better, use it
        if (combinedNameScore > totalScore + 0.2) {
            console.log(`[MATCHING] Improved score using combined name+artist: ${combinedNameScore}`);
            return {
                score: combinedNameScore,
                details: {
                    nameScore: combinedNameScore,
                    artistScore: 1,
                    ...albumScore !== undefined && {
                        albumScore
                    }
                }
            };
        }
    }
    return {
        score: totalScore,
        details: {
            nameScore,
            artistScore,
            ...albumScore !== undefined && {
                albumScore
            }
        }
    };
}
function calculateAlbumMatchScore(sourceAlbum, targetAlbum, config = DEFAULT_ALBUM_CONFIG) {
    const { weights } = config;
    const nameScore = calculateStringSimilarity(sourceAlbum.name, targetAlbum.name);
    // Use improved artist similarity
    let artistScore = calculateArtistArraySimilarity(sourceAlbum.artist, targetAlbum.artist);
    // Special handling for OSTs with Multi-artists
    const isOst = sourceAlbum.name.toLowerCase().includes("music from") || targetAlbum.name.toLowerCase().includes("music from") || sourceAlbum.name.toLowerCase().includes("motion picture") || targetAlbum.name.toLowerCase().includes("motion picture");
    if (isOst) {
        const isMultiArtist = sourceAlbum.artist.toLowerCase().startsWith("multi") || targetAlbum.artist.toLowerCase().startsWith("multi") || sourceAlbum.artist.toLowerCase().startsWith("various") || targetAlbum.artist.toLowerCase().startsWith("various");
        if (isMultiArtist) {
            artistScore = Math.max(artistScore, 0.9);
        }
    }
    const totalScore = nameScore * weights.name + artistScore * weights.artist;
    return {
        score: totalScore,
        details: {
            nameScore,
            artistScore
        }
    };
}
function cleanSearchTerm(str) {
    return str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s*-\s*/g, " ") // Convert all hyphens to spaces
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()[\]'"']/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}
function cleanTrackTitle(title) {
    return title// Remove all content in square brackets, parentheses, or curly braces
    .replace(/[\[\(\{][^\]\)\}]*[\]\)\}]/g, "")// Remove featuring artist indicators
    .replace(/\s*\(feat\..*?\)/gi, "").replace(/\s*\(ft\..*?\)/gi, "").replace(/\s+ft\..*$/gi, "").replace(/\s+feat\..*$/gi, "").replace(/\s+ft\s+.*$/gi, "").replace(/\s+feat\s+.*$/gi, "")// Remove (Single)
    .replace(/\s*\(single\)\s*/gi, " ")// Remove remix, edit, version, acoustic, instrumental, bonus, cover tags
    .replace(/\s*\((remix|edit|version|acoustic|instrumental|bonus track|cover)\)/gi, "").replace(/\s*-?\s*(remix|edit|version|acoustic|instrumental|bonus track|cover)\b/gi, "")// Remove trailing/leading dashes
    .replace(/\s*-\s*$/, "").replace(/^\s*-\s*/, "")// Normalize spaces
    .replace(/\s+/g, " ").trim();
}
}),
"[externals]/perf_hooks [external] (perf_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("perf_hooks", () => require("perf_hooks"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/require-in-the-middle [external] (require-in-the-middle, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("require-in-the-middle", () => require("require-in-the-middle"));

module.exports = mod;
}),
"[externals]/import-in-the-middle [external] (import-in-the-middle, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("import-in-the-middle", () => require("import-in-the-middle"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[externals]/node:diagnostics_channel [external] (node:diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:diagnostics_channel", () => require("node:diagnostics_channel"));

module.exports = mod;
}),
"[externals]/diagnostics_channel [external] (diagnostics_channel, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("diagnostics_channel", () => require("diagnostics_channel"));

module.exports = mod;
}),
"[externals]/node:child_process [external] (node:child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:child_process", () => require("node:child_process"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:readline [external] (node:readline, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:readline", () => require("node:readline"));

module.exports = mod;
}),
"[externals]/node:worker_threads [external] (node:worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:worker_threads", () => require("node:worker_threads"));

module.exports = mod;
}),
"[externals]/node:http [external] (node:http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:http", () => require("node:http"));

module.exports = mod;
}),
"[externals]/async_hooks [external] (async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("async_hooks", () => require("async_hooks"));

module.exports = mod;
}),
"[externals]/node:https [external] (node:https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:https", () => require("node:https"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/node:zlib [external] (node:zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:zlib", () => require("node:zlib"));

module.exports = mod;
}),
"[externals]/node:net [external] (node:net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:net", () => require("node:net"));

module.exports = mod;
}),
"[externals]/node:tls [external] (node:tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:tls", () => require("node:tls"));

module.exports = mod;
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[externals]/module [external] (module, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("module", () => require("module"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sentryLogger",
    ()=>sentryLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@sentry+nextjs@10.5.0_@opentelemetry+context-async-hooks@2.0.1_@opentelemetry+api@1.9.0_741bcea63cba89f3cbec6de658bb5f5f/node_modules/@sentry/nextjs/build/cjs/index.server.js [app-ssr] (ecmascript)");
;
// Check if Sentry is properly configured
const isSentryConfigured = ()=>{
    return !!("TURBOPACK compile-time value", "https://73554041aef742260939cc53dd2fbf6e@o4509320664186880.ingest.de.sentry.io/4509320666677328");
};
const sentryLogger = {
    /**
   * Log warning messages to Sentry and console
   */ warn: (message, extra)=>{
        if (isSentryConfigured()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addBreadcrumb"]({
                message,
                level: "warning",
                data: extra
            });
        }
        // Always log to console in development
        if ("TURBOPACK compile-time truthy", 1) {
            console.warn("[Sentry][warn]", message, extra);
        }
    },
    /**
   * Log error messages to Sentry and console
   */ error: (error, extra)=>{
        if (isSentryConfigured()) {
            if (error instanceof Error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureException"](error, {
                    extra
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureMessage"](error, "error");
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addBreadcrumb"]({
                    message: error,
                    level: "error",
                    data: extra
                });
            }
        }
        // Always log to console in development or if Sentry fails
        if ("TURBOPACK compile-time truthy", 1) {
            console.error("[Sentry][error]", error, extra);
        }
    },
    /**
   * Capture matching errors with proper context and tags
   */ captureMatchingError: (operation, targetService, error, extra)=>{
        if (isSentryConfigured()) {
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureException"](error, {
                    tags: {
                        category: "matching",
                        operation,
                        targetService
                    },
                    extra: {
                        operation,
                        targetService,
                        ...extra
                    },
                    level: "error"
                });
            } catch (sentryError) {
                // If Sentry fails, at least log to console
                console.error("[Sentry Error - fallback to console]", {
                    originalError: error,
                    sentryError,
                    operation,
                    targetService,
                    extra
                });
            }
        } else //TURBOPACK unreachable
        ;
    },
    /**
   * Capture general exceptions with context
   */ captureException: (error, context)=>{
        if (isSentryConfigured()) {
            try {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["captureException"](error, {
                    tags: context?.tags,
                    extra: context?.extra,
                    level: context?.level || "error"
                });
            } catch (sentryError) {
                console.error("[Sentry Error - fallback to console]", {
                    originalError: error,
                    sentryError,
                    context
                });
            }
        } else //TURBOPACK unreachable
        ;
    },
    /**
   * Add breadcrumb for debugging context
   */ addBreadcrumb: (message, data)=>{
        if (isSentryConfigured()) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$5$2e$0_$40$opentelemetry$2b$context$2d$async$2d$hooks$40$2$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_741bcea63cba89f3cbec6de658bb5f5f$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addBreadcrumb"]({
                message,
                data,
                level: "info",
                timestamp: Date.now() / 1000
            });
        }
    }
};
}),
"[project]/apps/web/src/lib/utils/retry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "retryWithExponentialBackoff",
    ()=>retryWithExponentialBackoff
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)");
;
/**
 * Default retry configuration values
 */ const DEFAULT_RETRY_OPTIONS = {
    maxRetries: 5,
    initialRetryDelay: 1000,
    maxRetryDelay: 64000,
    jitterFactor: 0.1,
    additionalRetryStatusCodes: [],
    treat404AsEmpty: false
};
/**
 * Adds jitter to a delay value to prevent thundering herd problems
 */ function addJitter(delay, factor) {
    const jitter = delay * factor;
    return delay + (Math.random() * 2 - 1) * jitter;
}
async function retryWithExponentialBackoff(fetchFn, options = {}) {
    const { maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries, initialRetryDelay = DEFAULT_RETRY_OPTIONS.initialRetryDelay, maxRetryDelay = DEFAULT_RETRY_OPTIONS.maxRetryDelay, jitterFactor = DEFAULT_RETRY_OPTIONS.jitterFactor, additionalRetryStatusCodes = DEFAULT_RETRY_OPTIONS.additionalRetryStatusCodes, treat404AsEmpty = DEFAULT_RETRY_OPTIONS.treat404AsEmpty } = options;
    let attempt = 0;
    let delay = initialRetryDelay;
    // Default status codes that should be retried (4xx/5xx excluding specific ones below)
    const retryableStatusCodes = new Set([
        408,
        409,
        425,
        429,
        500,
        502,
        503,
        504,
        ...additionalRetryStatusCodes
    ]);
    // Status codes that should never be retried
    const nonRetryableStatusCodes = new Set([
        401,
        403,
        404
    ]);
    while(attempt < maxRetries){
        try {
            const response = await fetchFn();
            // If the response is ok, parse and return the data
            if (response.ok) {
                if (response.status === 204) {
                    return {};
                }
                // Handle both JSON and text responses
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    return await response.json();
                }
                return await response.text();
            }
            // If we get a 429, use the Retry-After header if available
            if (response.status === 429) {
                const retryAfter = response.headers.get("Retry-After");
                if (retryAfter) {
                    delay = parseInt(retryAfter, 10) * 1000; // Convert to milliseconds
                }
            }
            // If it's a 409 (often used for YouTube's SERVICE_UNAVAILABLE), check error contents
            if (response.status === 409) {
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        // Clone the response to read it twice (once here, once for the content)
                        const clonedResponse = response.clone();
                        const errorData = await clonedResponse.json();
                        // Check if it's a YouTube SERVICE_UNAVAILABLE error
                        const isYouTubeServiceUnavailable = errorData?.error?.errors?.some((e)=>e.reason === "SERVICE_UNAVAILABLE");
                        if (isYouTubeServiceUnavailable) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].warn("YouTube SERVICE_UNAVAILABLE detected, retrying...");
                            // Log the retry attempt
                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].warn(`API request failed (attempt ${attempt + 1}/${maxRetries})`, {
                                status: response.status,
                                statusText: response.statusText,
                                reason: "SERVICE_UNAVAILABLE",
                                retryIn: delay
                            });
                            // Wait before retrying
                            await new Promise((resolve)=>setTimeout(resolve, addJitter(delay, jitterFactor)));
                            // Exponential backoff for next attempt
                            delay = Math.min(delay * 2, maxRetryDelay);
                            attempt++;
                            continue;
                        }
                    }
                } catch (e) {
                    // If we couldn't parse the error JSON, just continue with normal error handling
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].warn("Could not parse response JSON for 409 error", {
                        error: e
                    });
                }
            }
            // For errors that we don't want to retry, throw immediately
            if (nonRetryableStatusCodes.has(response.status)) {
                // Special handling for 404 responses that should be treated as empty
                if (response.status === 404 && treat404AsEmpty) {
                    return {
                        data: []
                    };
                }
                const error = new Error(`Request failed with status ${response.status}: ${response.statusText}`);
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureException(error, {
                    tags: {
                        category: "api",
                        statusCode: response.status.toString(),
                        retryable: "false"
                    },
                    extra: {
                        status: response.status,
                        statusText: response.statusText
                    }
                });
                throw error;
            }
            // For errors with status codes that should be retried
            if (retryableStatusCodes.has(response.status)) {
                // Log the retry attempt
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].warn(`API request failed (attempt ${attempt + 1}/${maxRetries})`, {
                    status: response.status,
                    statusText: response.statusText,
                    retryIn: delay
                });
                // Wait before retrying
                await new Promise((resolve)=>setTimeout(resolve, addJitter(delay, jitterFactor)));
                // Exponential backoff for next attempt
                delay = Math.min(delay * 2, maxRetryDelay);
                attempt++;
                continue;
            }
            // For any other status code, throw an error
            throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
        } catch (error) {
            // Check if this is an error we explicitly threw for non-retryable status codes
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isNonRetryableStatusCode = Array.from(nonRetryableStatusCodes).some((code)=>errorMessage.includes(`Request failed with status ${code}`));
            // Don't retry if it's a non-retryable status code
            if (isNonRetryableStatusCode) {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureException(error);
                throw error;
            }
            // If it's the last attempt, throw the error
            if (attempt === maxRetries - 1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureException(error, {
                    tags: {
                        category: "api",
                        finalAttempt: "true"
                    },
                    extra: {
                        attempt: attempt + 1,
                        maxRetries
                    }
                });
                throw error;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].warn(`API request error (attempt ${attempt + 1}/${maxRetries})`, {
                error: error instanceof Error ? error.message : String(error),
                attempt: attempt + 1,
                maxRetries
            });
            await new Promise((resolve)=>setTimeout(resolve, addJitter(delay, jitterFactor)));
            delay = Math.min(delay * 2, maxRetryDelay);
            attempt++;
        }
    }
    throw new Error(`Failed after ${maxRetries} retries`);
}
}),
"[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MATCHING_STATUS",
    ()=>MATCHING_STATUS,
    "MatchingStatusSchema",
    ()=>MatchingStatusSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
const MATCHING_STATUS = {
    PENDING: "pending",
    MATCHED: "matched",
    UNMATCHED: "unmatched"
};
const MatchingStatusSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum(Object.values(MATCHING_STATUS));
}),
"[project]/apps/web/src/components/icons/SpotifyLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpotifyLogo",
    ()=>SpotifyLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const SpotifyLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 256 256",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid",
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z",
            fill: "#1ED760"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/icons/SpotifyLogo.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/SpotifyLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "YouTubeMusicLogo",
    ()=>YouTubeMusicLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const YouTubeMusicLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 176 176",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    fill: "#FF0000",
                    cx: "88",
                    cy: "88",
                    r: "88"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx",
                    lineNumber: 21,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    fill: "#FFFFFF",
                    d: "M88,46c23.1,0,42,18.8,42,42s-18.8,42-42,42s-42-18.8-42-42S64.9,46,88,46 M88,42 c-25.4,0-46,20.6-46,46s20.6,46,46,46s46-20.6,46-46S113.4,42,88,42L88,42z"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx",
                    lineNumber: 22,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                    fill: "#FFFFFF",
                    points: "72,111 111,87 72,65"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx",
            lineNumber: 20,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/DeezerLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeezerLogo",
    ()=>DeezerLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const DeezerLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 1433 1431",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid",
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            fillRule: "evenodd",
            fill: "#A238FF",
            d: "m1201.8 218.3c13.2-76.7 32.7-125 54.2-125.1h0.1c40.2 0.2 72.7 167.5 72.7 374.1 0 206.7-32.6 374.1-72.8 374.1-16.5 0-31.7-28.4-44-76.1-19.3 174.5-59.5 294.4-106 294.4-36 0-68.3-72-90-185.6-14.8 216-52.1 369.3-95.6 369.3-27.3 0-52.3-60.7-70.7-159.6-22.2 204.1-73.5 347.2-133.2 347.2-59.8 0-111.1-143-133.2-347.2-18.3 98.9-43.3 159.6-70.7 159.6-43.6 0-80.8-153.3-95.6-369.3-21.7 113.6-53.9 185.6-90 185.6-46.5 0-86.7-119.9-106.1-294.4-12.1 47.8-27.4 76.1-43.9 76.1-40.3 0-72.9-167.4-72.9-374.1 0-206.6 32.6-374.1 72.9-374.1 21.6 0 40.9 48.4 54.3 125.1 21.4-132.3 56.3-218.3 95.7-218.3 46.8 0 87.3 121.6 106.5 298.2 18.8-128.5 47.2-210.4 79.1-210.4 44.7 0 82.7 161.1 96.8 385.9 26.4-115.2 64.8-187.5 107.2-187.5 42.4 0 80.7 72.3 107.1 187.5 14.1-224.8 52.1-385.9 96.8-385.9 31.8 0 60.2 81.9 79.1 210.4 19.1-176.6 59.7-298.2 106.5-298.2 39.2 0 74.2 86 95.7 218.3zm-1160.5 379.5c-22.8 0-41.3-74.8-41.3-167.3 0-92.5 18.5-167.2 41.3-167.2 22.9 0 41.4 74.7 41.4 167.2 0 92.5-18.5 167.3-41.4 167.3zm1350.3 0c-22.9 0-41.3-74.8-41.3-167.3 0-92.5 18.4-167.2 41.3-167.2 22.8 0 41.3 74.7 41.3 167.2 0 92.5-18.5 167.3-41.3 167.3z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/icons/DeezerLogo.tsx",
            lineNumber: 18,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/DeezerLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/AppleMusicLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppleMusicLogo",
    ()=>AppleMusicLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const AppleMusicLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 361 361",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                id: "apple-music-gradient",
                x1: "180",
                x2: "180",
                y1: "358.605",
                y2: "7.759",
                gradientUnits: "userSpaceOnUse",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                        offset: "0",
                        style: {
                            stopColor: "#fa233b"
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                        offset: "1",
                        style: {
                            stopColor: "#fb5c74"
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
                        lineNumber: 27,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M360 112.61c0-4.3 0-8.6-.02-12.9-.02-3.62-.06-7.24-.16-10.86-.21-7.89-.68-15.84-2.08-23.64-1.42-7.92-3.75-15.29-7.41-22.49a75.633 75.633 0 0 0-33.06-33.05c-7.19-3.66-14.56-5.98-22.47-7.41C287 .86 279.04.39 271.15.18c-3.62-.1-7.24-.14-10.86-.16-4.3-.02-8.6-.02-12.9-.02H112.61c-4.3 0-8.6 0-12.9.02-3.62.02-7.24.06-10.86.16C80.96.4 73 .86 65.2 2.27c-7.92 1.42-15.28 3.75-22.47 7.41A75.633 75.633 0 0 0 9.67 42.73c-3.66 7.2-5.99 14.57-7.41 22.49C.86 73.02.39 80.98.18 88.86.08 92.48.04 96.1.02 99.72 0 104.01 0 108.31 0 112.61v134.77c0 4.3 0 8.6.02 12.9.02 3.62.06 7.24.16 10.86.21 7.89.68 15.84 2.08 23.64 1.42 7.92 3.75 15.29 7.41 22.49a75.633 75.633 0 0 0 33.06 33.05c7.19 3.66 14.56 5.98 22.47 7.41 7.8 1.4 15.76 1.87 23.65 2.08 3.62.1 7.24.14 10.86.16 4.3.03 8.6.02 12.9.02h134.77c4.3 0 8.6 0 12.9-.02 3.62-.02 7.24-.06 10.86-.16 7.89-.21 15.85-.68 23.65-2.08 7.92-1.42 15.28-3.75 22.47-7.41a75.633 75.633 0 0 0 33.06-33.05c3.66-7.2 5.99-14.57 7.41-22.49 1.4-7.8 1.87-15.76 2.08-23.64.1-3.62.14-7.24.16-10.86.03-4.3.02-8.6.02-12.9V112.61z",
                fill: "url(#apple-music-gradient)"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M254.5 55c-.87.08-8.6 1.45-9.53 1.64l-107 21.59-.04.01c-2.79.59-4.98 1.58-6.67 3-2.04 1.71-3.17 4.13-3.6 6.95-.09.6-.24 1.82-.24 3.62v133.92c0 3.13-.25 6.17-2.37 8.76s-4.74 3.37-7.81 3.99l-6.99 1.41c-8.84 1.78-14.59 2.99-19.8 5.01-4.98 1.93-8.71 4.39-11.68 7.51-5.89 6.17-8.28 14.54-7.46 22.38.7 6.69 3.71 13.09 8.88 17.82 3.49 3.2 7.85 5.63 12.99 6.66 5.33 1.07 11.01.7 19.31-.98 4.42-.89 8.56-2.28 12.5-4.61 3.9-2.3 7.24-5.37 9.85-9.11 2.62-3.75 4.31-7.92 5.24-12.35.96-4.57 1.19-8.7 1.19-13.26V142.81c0-6.22 1.76-7.86 6.78-9.08 0 0 88.94-17.94 93.09-18.75 5.79-1.11 8.52.54 8.52 6.61v79.29c0 3.14-.03 6.32-2.17 8.92-2.12 2.59-4.74 3.37-7.81 3.99l-6.99 1.41c-8.84 1.78-14.59 2.99-19.8 5.01-4.98 1.93-8.71 4.39-11.68 7.51-5.89 6.17-8.49 14.54-7.67 22.38.7 6.69 3.92 13.09 9.09 17.82 3.49 3.2 7.85 5.56 12.99 6.6 5.33 1.07 11.01.69 19.31-.98 4.42-.89 8.56-2.22 12.5-4.55 3.9-2.3 7.24-5.37 9.85-9.11 2.62-3.75 4.31-7.92 5.24-12.35.96-4.57 1-8.7 1-13.26V64.46c.02-6.16-3.23-9.96-9.02-9.46z",
                fill: "#fff"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/icons/AppleMusicLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AmazonMusicLogo",
    ()=>AmazonMusicLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const AmazonMusicLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 89.016 52",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: "amazon-music-gradient",
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "100%",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0",
                            stopColor: "#0C6CB3"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0.2911",
                            stopColor: "#1E84C4"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0.8873",
                            stopColor: "#4CC0EF"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "1",
                            stopColor: "#4CC0EF"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                            lineNumber: 23,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m59.7 22.5c-.6.4-1.5.7-2.6.7-1.7 0-3.3-.2-4.9-.7-.4-.1-.7-.2-.9-.2-.3 0-.4.2-.4.6v1c0 .3.1.5.2.7.1.1.3.3.6.4 1.6.7 3.4 1 5.4 1 2.1 0 3.7-.5 5-1.5 1.3-1 1.9-2.3 1.9-4 0-1.2-.3-2.1-.9-2.9-.6-.7-1.6-1.4-3-1.9l-2.8-1.1c-1.1-.4-1.9-.8-2.2-1.2-.4-.4-.6-.8-.6-1.5 0-1.5 1.1-2.3 3.4-2.3 1.3 0 2.6.2 3.8.6.4.1.7.2.8.2.3 0 .5-.2.5-.6v-1c0-.3-.1-.5-.2-.7-.1-.2-.3-.3-.6-.4-1.5-.5-3-.8-4.5-.8-1.9 0-3.5.5-4.7 1.4-1.2.9-1.8 2.2-1.8 3.7 0 2.3 1.3 4 3.9 5l3 1.1c1 .4 1.6.7 2 1.1.4.4.5.8.5 1.4 0 .8-.3 1.5-.9 1.9z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m44 8.1v13.3c-1.7 1.1-3.4 1.7-5.1 1.7-1.1 0-1.9-.3-2.4-.9-.5-.6-.7-1.5-.7-2.8V8.1c0-.5-.2-.7-.7-.7h-2.1c-.5 0-.7.2-.7.7v12.4c0 1.7.4 3.1 1.3 4 .9.9 2.2 1.4 3.9 1.4 2.3 0 4.6-.8 6.8-2.4l.2 1.2c0 .3.1.4.3.5.1.1.3.1.6.1h1.5c.5 0 .7-.2.7-.7V8.1c0-.5-.2-.7-.7-.7h-2.1c-.6 0-.8.3-.8.7z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m25 25.4h2.1c.5 0 .7-.2.7-.7V12.2c0-1.7-.4-3-1.3-3.9-.9-.9-2.1-1.4-3.8-1.4-2.3 0-4.7.8-7 2.5-.8-1.7-2.3-2.5-4.5-2.5-2.2 0-4.4.8-6.6 2.3l-.2-.9c0-.3-.1-.4-.3-.5-.1-.1-.3-.1-.5-.1h-1.6c-.5 0-.7.2-.7.7v16.6c0 .5.2.7.7.7h2.1c.5 0 .7-.2.7-.7V11.3c1.7-1 3.4-1.6 5.2-1.6 1 0 1.7.3 2.1.9.4.6.7 1.4.7 2.6v11.5c0 .5.2.7.7.7h2.1c.5 0 .7-.2.7-.7V12.4 11.8c0-.2 0-.4 0-.5 1.8-1.1 3.5-1.6 5.2-1.6 1 0 1.7.3 2.1.9.4.6.7 1.4.7 2.6v11.5c0 .5.2.7.7.7z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m79.5 38.7c-10.9 4.6-22.8 6.9-33.6 6.9-16 0-31.5-4.4-44-11.7-.2-.1-.4-.2-.6-.2-.7 0-1.1.8-.4 1.5 11.6 10.5 27 16.8 44 16.8 12.2 0 26.3-3.8 36-11 1.7-1.2.3-3-1.4-2.3z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m79.2 11.4c.9-1 2.3-1.5 4.3-1.5 1 0 2 .1 2.9.4.3.1.4.1.6.1.3 0 .5-.2.5-.7v-1c0-.3-.1-.6-.2-.7-.1-.1-.3-.3-.5-.4-1.3-.3-2.6-.6-3.8-.6-2.8 0-4.9.8-6.5 2.5-1.5 1.6-2.3 4-2.3 7 0 3 .7 5.3 2.2 6.9 1.5 1.6 3.6 2.4 6.4 2.4 1.5 0 2.9-.2 4-.7.3-.1.5-.2.6-.4.1-.1.1-.4.1-.7v-1c0-.5-.2-.7-.5-.7-.1 0-.3 0-.5.1-1.1.3-2.2.5-3.2.5-1.9 0-3.3-.5-4.2-1.5-.9-1-1.3-2.6-1.3-4.7v-.5c.1-2.2.5-3.8 1.4-4.8z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m83.7 48.1c5.2-4.4 6.6-13.5 5.5-14.9-.5-.6-2.9-1.2-5.9-1.2-3.2 0-7 .7-9.9 2.7-.9.6-.7 1.4.2 1.3 3.1-.4 10.1-1.2 11.4.4 1.2 1.6-1.4 8.2-2.6 11.1-.3.9.4 1.2 1.3.6z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m69.8 7.4h-2.1c-.5 0-.7.2-.7.7v16.6c0 .5.2.7.7.7h2.1c.5 0 .7-.2.7-.7V8.1c0-.4-.2-.7-.7-.7z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "url(#amazon-music-gradient)",
                d: "m70.4.6c-.4-.4-1-.6-1.7-.6-.7 0-1.2.2-1.6.6-.4.4-.6.9-.6 1.5 0 .6.2 1.2.6 1.5.4.4.9.6 1.6.6.7 0 1.2-.2 1.6-.6.4-.4.6-.9.6-1.5 0-.6-.1-1.2-.5-1.5z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/TidalLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TidalLogo",
    ()=>TidalLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const TidalLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 50 50",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            fill: "currentColor",
            d: "M9 12C8.7615 12 8.5237969 12.091437 8.3417969 12.273438L1.2734375 19.341797C0.9094375 19.705797 0.9094375 20.294203 1.2734375 20.658203L8.3417969 27.726562C8.7057969 28.090563 9.2942031 28.090563 9.6582031 27.726562L16.726562 20.658203C16.908563 20.476203 17 20.2385 17 20C17 19.7615 16.908563 19.523797 16.726562 19.341797L9.6582031 12.273438C9.4762031 12.091437 9.2385 12 9 12zM17 20C17 20.2385 17.091438 20.476203 17.273438 20.658203L24.341797 27.726562C24.523797 27.908563 24.7615 28 25 28C25.2385 28 25.476203 27.908563 25.658203 27.726562L32.726562 20.658203C32.908563 20.476203 33 20.2385 33 20C33 19.7615 32.908563 19.523797 32.726562 19.341797L25.658203 12.273438C25.294203 11.909437 24.705797 11.909437 24.341797 12.273438L17.273438 19.341797C17.091437 19.523797 17 19.7615 17 20zM33 20C33 20.2385 33.091437 20.476203 33.273438 20.658203L40.341797 27.726562C40.705797 28.090563 41.294203 28.090563 41.658203 27.726562L48.726562 20.658203C49.090563 20.294203 49.090563 19.705797 48.726562 19.341797L41.658203 12.273438C41.294203 11.909437 40.705797 11.909437 40.341797 12.273438L33.273438 19.341797C33.091437 19.523797 33 19.7615 33 20zM25 28C24.7615 28 24.523797 28.091437 24.341797 28.273438L17.273438 35.341797C16.909437 35.705797 16.909437 36.294203 17.273438 36.658203L24.341797 43.726562C24.705797 44.090562 25.294203 44.090562 25.658203 43.726562L32.726562 36.658203C33.090563 36.294203 33.090563 35.705797 32.726562 35.341797L25.658203 28.273438C25.476203 28.091437 25.2385 28 25 28z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/icons/TidalLogo.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/TidalLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/icons/PandoraLogo.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PandoraLogo",
    ()=>PandoraLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const PandoraLogo = ({ className = "", size = 24 })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 48 48",
        width: size,
        height: size,
        xmlns: "http://www.w3.org/2000/svg",
        preserveAspectRatio: "xMidYMid",
        className: className,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#f2494c",
                d: "M36.466,28.216c-0.225,0.225-0.461,0.439-0.709,0.653c-0.191,0.157-0.394,0.315-0.596,0.461 c-0.225,0.169-0.45,0.326-0.686,0.472c-0.124,0.09-0.27,0.169-0.405,0.236c-0.18,0.112-0.349,0.214-0.54,0.304l-0.135,0.068 c-0.522,0.261-1.065,0.48-1.622,0.655c-0.175,0.055-0.353,0.109-0.538,0.155c-0.315,0.09-0.641,0.169-0.979,0.225 c-0.675,0.124-1.361,0.18-2.07,0.18h-3.943c-0.155-0.099-0.318-0.205-0.474-0.305c-0.317-0.699-0.608-1.348-1.41-2.26 c-0.146-0.18-0.337-0.382-0.551-0.596c-0.911-0.911-1.586-1.339-2.216-1.665c-0.169-0.09-0.337-0.169-0.506-0.248 c-0.27-0.135-0.54-0.259-0.833-0.428c-0.529-0.304-1.114-0.731-1.856-1.474c-1.159-1.159-1.53-1.935-1.924-2.711 C14.159,21.264,13.833,20.6,13,19.678V9.125C13,8.504,13.504,8,14.125,8h2.914c0.36,0.495,0.563,0.934,0.788,1.361 c0.36,0.788,0.731,1.541,1.89,2.7s1.935,1.53,2.722,1.913c0.765,0.371,1.541,0.754,2.689,1.901c1.159,1.159,1.53,1.935,1.924,2.711 c0.36,0.788,0.731,1.541,1.89,2.7c1.159,1.159,1.935,1.53,2.722,1.913c0.765,0.371,1.541,0.754,2.689,1.901 c1.159,1.159,1.53,1.935,1.924,2.711C36.331,27.946,36.399,28.081,36.466,28.216z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#db1a58",
                d: "M13,8v32h8c1.105,0,2-0.895,2-2v-6h6c0,0,11-1,11-11S34,8,29,8H13z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#3231c7",
                d: "M16.51,40H13v-2.34l0.034,0.034c1.159,1.159,1.935,1.53,2.722,1.912 C16.004,39.719,16.251,39.842,16.51,40z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#e4273e",
                d: "M39.832,23.05c-0.068,0.236-0.351,5.743-7.712,8.232c-0.472-0.292-1.874-0.748-2.515-1.39 c-1.159-1.159-1.541-1.935-1.924-2.711c-0.236-0.484-0.472-0.968-0.889-1.541c-0.259-0.337-0.585-0.72-1.013-1.147 c-0.844-0.844-1.485-1.271-2.07-1.586c-0.214-0.124-0.427-0.236-0.641-0.337c-0.157-0.079-0.315-0.146-0.472-0.236 c-0.63-0.326-1.305-0.754-2.216-1.665c-1.159-1.159-1.541-1.935-1.924-2.711c-0.371-0.776-0.754-1.541-1.901-2.689 c-1.159-1.159-1.935-1.541-2.711-1.924c-0.281-0.124-0.551-0.259-0.844-0.439V8h10.62h0.001c1.202,1.219,1.996,1.611,2.789,2.001 c0.776,0.371,1.53,0.742,2.689,1.901s1.541,1.924,1.913,2.7c0.383,0.776,0.754,1.541,1.913,2.7c1.159,1.159,1.946,1.541,2.723,1.924 c0.765,0.382,1.541,0.754,2.678,1.901C38.954,21.759,39.54,22.589,39.832,23.05z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#f2494c",
                d: "M36.679,28.76C33.947,31.097,31.905,32,29,32c-2.152,0-4.775-0.088-4.854-0.097 c-0.317-0.699-0.984-1.93-1.786-2.843c-0.146-0.18-0.337-0.382-0.551-0.596c-0.911-0.911-1.586-1.339-2.216-1.665 c-0.169-0.09-0.337-0.169-0.506-0.248c-0.27-0.135-0.54-0.259-0.833-0.428c-0.529-0.304-0.495-1.579-1.238-2.322 c-1.159-1.159-1.808-1.946-2.202-2.723C14.5,20.404,13.833,20.6,13,19.678V8h4.039c0.36,0.495,0.563,0.934,0.788,1.361 c0.36,0.788,0.731,1.541,1.89,2.7s1.935,1.53,2.722,1.913c0.765,0.371,1.541,0.754,2.689,1.901c1.159,1.159,1.53,1.935,1.924,2.711 c0.36,0.788,0.731,1.541,1.89,2.7c1.159,1.159,1.935,1.53,2.722,1.913c0.765,0.371,1.541,0.754,2.689,1.901 c1.159,1.159,1.53,1.935,1.924,2.711C36.331,27.946,36.612,28.625,36.679,28.76z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#b11e93",
                d: "M23,38L23,38c0,1.105-0.895,2-2,2h-0.125H13V28.131c0.056,0.045-0.067-0.199,0-0.131 c0.259,0.259,0.82,0.775,1,1c0,0,0-0.011,0,0c0.653,0.776,0.811,1.415,1.104,2.022c0.382,0.765,0.754,1.553,1.913,2.7 c1.159,1.159,1.946,1.541,2.723,1.924c0.765,0.371,1.53,0.743,2.678,1.89C22.675,37.795,22.82,37.786,23,38z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#3231c7",
                d: "M23,35.641v1.609V38c0,1.105-0.895,2-2,2h0c0,0,0.756-1.756-0.497-3.009 c-0.405-0.394-0.81-0.686-1.406-1.046c-0.585-0.36-1.226-0.821-1.733-1.327c-1.001-1.013-1.868-2.115-2.396-3.431 c-0.112-0.281-0.214-0.551-0.304-0.821c-0.135-0.349-0.259-0.675-0.428-1.001C14.09,29.082,13.203,28.259,13,28 c0.517,0.416,1.146,0.599,1.585,1.128c0.428,0.517,0.776,1.136,1.125,1.665c0.045,0.068,0.079,0.124,0.135,0.18 c0.675,0.945,1.609,1.71,2.565,2.329c0.045,0.023,0.079,0.056,0.124,0.068c0.472,0.292,0.945,0.495,1.496,0.686 c0.596,0.191,1.361,0.517,2.002,0.923C22.381,35.191,22.696,35.416,23,35.641z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#3231c7",
                d: "M40,21c-0.011,0.236,0,2.317-0.635,3.942l-0.257-0.387l-0.641-0.833l-1.305-1.597 c-0.405-0.506-0.81-0.934-1.316-1.294c-0.484-0.382-1.193-0.742-1.845-1.271c-0.641-0.506-1.17-1.091-1.654-1.688 c-0.472-0.596-0.911-1.249-1.237-1.958c-0.214-0.472-0.36-0.934-0.529-1.373c-0.079-0.225-0.169-0.45-0.27-0.664 c-0.304-0.63-0.589-1.237-1.039-1.8c0.563,0.45,0.983,0.956,1.444,1.553c0.371,0.484,0.675,1.013,0.99,1.485 c0.079,0.112,0.146,0.214,0.225,0.315c0.754,0.956,1.789,1.811,2.824,2.385c0.101,0.056,0.191,0.101,0.281,0.146 c0.563,0.281,1.215,0.45,1.98,0.788c0.765,0.337,1.496,0.821,2.126,1.316C39.457,20.326,40,21,40,21z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#3231c7",
                d: "M37.687,27.752c-0.13,0.17-1.285,1.309-2.267,2.03l-0.31-0.69c-0.23-0.59-0.38-0.99-0.67-1.44 c-0.26-0.44-0.63-0.9-0.99-1.3c-0.38-0.41-0.75-0.74-1.23-1.05c-0.47-0.3-1.11-0.65-1.63-1.11c-0.52-0.45-0.95-0.94-1.35-1.45 c-0.4-0.51-0.77-1.07-1.03-1.68c-0.14-0.35-0.26-0.69-0.38-1.01c-0.09-0.24-0.306-0.517-0.426-0.747 c-0.27-0.54-0.427-1.112-0.817-1.592c0.48,0.39,0.853,0.939,1.243,1.439c0.33,0.42,0.61,0.91,0.88,1.34 c0.05,0.08,0.09,0.15,0.14,0.22c0.66,0.93,1.63,1.73,2.59,2.29c0.05,0.03,0.1,0.06,0.16,0.08c0.43,0.23,0.89,0.38,1.45,0.6 c0.63,0.24,1.28,0.6,1.84,1.01c0.55,0.42,1.06,0.84,1.56,1.37C36.9,26.522,37.387,27.262,37.687,27.752z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#e4273e",
                d: "M28.419,29.365c-1.02-1.02-1.7-1.36-2.39-1.69c-0.69-0.34-0.845-1.023-1.875-2.053 c-1.02-1.02-1.726-2.602-2.056-3.293c-0.34-0.69-0.416-1.098-1.446-2.128c-1.02-1.02-1.7-1.36-2.39-1.69 c-0.69-0.34-1.611-0.732-2.641-1.762c-1.02-1.02-1.562-1.639-1.892-2.329c-0.2-0.41-0.379-0.948-0.729-1.428V21 c0.49,0.35,0.879,0.523,1.289,0.733c0.65,0.3,1.091,0.899,1.991,1.769l0.03,0.03c0.06,0.04,0.13,0.11,0.2,0.18 c1.03,1.03,1.539,2.702,1.879,3.402c0.33,0.68,0.67,1.37,1.69,2.39c1.03,1.03,1.72,1.36,2.41,1.71 c0.27,0.12,0.523,0.565,0.803,0.725c0,0,1.1,0.065,2.708,0.06c0.313-0.001,1,0,1,0s2.166,0.049,2.999-0.029 C29.719,31.481,29.109,30.055,28.419,29.365z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#0288d1",
                d: "M27,32h-4l-0.01,0.157c-0.157-0.112-0.337-0.225-0.529-0.337c-0.585-0.36-1.226-0.821-1.733-1.327 c-1.001-1.013-1.868-2.115-2.396-3.431c-0.079-0.191-0.146-0.382-0.214-0.563c-0.157-0.439-0.315-0.855-0.517-1.26 c-0.225-0.428-0.495-0.844-0.788-1.237l-0.034-0.034c-0.079-0.124-0.18-0.236-0.27-0.36c0.517,0.416,1.001,0.866,1.44,1.395 c0.428,0.517,0.776,1.136,1.125,1.665c0.112,0.18,0.248,0.349,0.382,0.506c0.653,0.799,1.474,1.451,2.318,2.002 c0.146,0.09,0.304,0.18,0.45,0.259c0.371,0.191,0.754,0.349,1.17,0.495c0.596,0.191,1.361,0.517,2.002,0.923 C25.96,31.201,27.14,32.063,27,32z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#0288d1",
                d: "M33.286,31.079C32.533,31.63,30.252,32.031,29.99,32c-0.079-0.135-0.158-0.27-0.236-0.394 c-0.349-0.574-0.63-0.956-1.069-1.451c-0.405-0.472-0.821-0.855-1.339-1.204c-0.517-0.337-1.249-0.754-1.834-1.271 c-0.596-0.517-1.091-1.08-1.541-1.654c-0.461-0.585-0.877-1.237-1.17-1.924c-0.18-0.416-0.315-0.821-0.472-1.215 c-0.09-0.248-0.191-0.495-0.315-0.731c-0.292-0.619-0.697-1.193-1.136-1.744c0.551,0.439,1.069,0.934,1.519,1.496 c0.405,0.495,0.72,1.069,1.046,1.553c0.045,0.068,0.09,0.135,0.135,0.202c0.776,1.035,1.868,1.924,2.948,2.531 c0.011,0,0.011,0.011,0.022,0.011c0.551,0.304,1.103,0.472,1.834,0.754c0.731,0.281,1.474,0.72,2.104,1.181 c0.619,0.428,1.271,1.091,1.733,1.665C32.543,30.189,33.004,30.674,33.286,31.079z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#b11e93",
                d: "M38.852,14.415c-0.96-2.195-2.23-3.842-4.295-5.009c0.585,1.057,0.856,1.924,2.352,3.42 C37.73,13.648,38.278,14.111,38.852,14.415z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#3231c7",
                d: "M16.364,40H13v-2.474l0.032,0.036c1.11,1.225,1.854,1.617,2.609,2.022 C15.879,39.703,16.116,39.833,16.364,40z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/icons/PandoraLogo.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/config/services.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SERVICES",
    ()=>SERVICES,
    "SERVICE_STATUS",
    ()=>SERVICE_STATUS,
    "ServiceConfigSchema",
    ()=>ServiceConfigSchema,
    "getAvailableServices",
    ()=>getAvailableServices,
    "getComingSoonServices",
    ()=>getComingSoonServices,
    "getDevServices",
    ()=>getDevServices,
    "getMaintenanceServices",
    ()=>getMaintenanceServices,
    "getOfflineServices",
    ()=>getOfflineServices,
    "getPlaylistUrl",
    ()=>getPlaylistUrl,
    "getServiceById",
    ()=>getServiceById,
    "validateServiceConfig",
    ()=>validateServiceConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$SpotifyLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/SpotifyLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$YouTubeMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/YouTubeMusicLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$DeezerLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/DeezerLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$AppleMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/AppleMusicLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$AmazonMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/AmazonMusicLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$TidalLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/TidalLogo.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$PandoraLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/PandoraLogo.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const SERVICE_STATUS = {
    OFF: "OFF",
    DEV: "DEV",
    AVAILABLE: "AVAILABLE",
    MAINTENANCE: "MAINTENANCE"
};
const ServiceConfigSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    image: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((val)=>typeof val === "function"),
    color: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal([
        SERVICE_STATUS.OFF,
        SERVICE_STATUS.DEV,
        SERVICE_STATUS.AVAILABLE,
        SERVICE_STATUS.MAINTENANCE
    ]),
    getPlaylistUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((val)=>typeof val === "function"),
    getLikedSongsUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((val)=>typeof val === "function"),
    getAlbumsUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].custom((val)=>typeof val === "function"),
    apiBaseUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].url()
});
const ServicesSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), ServiceConfigSchema);
const rawServices = {
    spotify: {
        id: "spotify",
        name: "Spotify",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$SpotifyLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpotifyLogo"],
        color: "#1ed760",
        status: SERVICE_STATUS.AVAILABLE,
        apiBaseUrl: "https://api.spotify.com/v1",
        getPlaylistUrl: (id)=>`https://open.spotify.com/playlist/${id}`,
        getLikedSongsUrl: ()=>"https://open.spotify.com/collection/tracks",
        getAlbumsUrl: ()=>"https://open.spotify.com/"
    },
    youtube: {
        id: "youtube",
        name: "YouTube Music",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$YouTubeMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YouTubeMusicLogo"],
        color: "#FF0000",
        status: SERVICE_STATUS.DEV,
        apiBaseUrl: "https://www.googleapis.com/youtube/v3",
        getPlaylistUrl: (id)=>`https://music.youtube.com/playlist?list=${id}`,
        getLikedSongsUrl: ()=>"https://music.youtube.com/playlist?list=LM",
        getAlbumsUrl: ()=>null
    },
    deezer: {
        id: "deezer",
        name: "Deezer",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$DeezerLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeezerLogo"],
        color: "#A238FF",
        status: SERVICE_STATUS.DEV,
        apiBaseUrl: "https://api.deezer.com",
        getPlaylistUrl: (id)=>`https://www.deezer.com/playlist/${id}`,
        getLikedSongsUrl: ()=>{
            if ("TURBOPACK compile-time truthy", 1) return null;
            //TURBOPACK unreachable
            ;
            const userId = undefined;
        },
        getAlbumsUrl: ()=>{
            if ("TURBOPACK compile-time truthy", 1) return null;
            //TURBOPACK unreachable
            ;
            const userId = undefined;
        }
    },
    apple: {
        id: "apple",
        name: "Apple Music",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$AppleMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppleMusicLogo"],
        color: "#FA243C",
        status: SERVICE_STATUS.AVAILABLE,
        apiBaseUrl: "https://api.music.apple.com",
        getPlaylistUrl: (id)=>{
            try {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            } catch (error) {
                console.error("Error retrieving Apple Music storefront ID:", error);
            }
            return `https://music.apple.com/library/playlist/${id}`;
        },
        getLikedSongsUrl: ()=>"https://music.apple.com/fr/library/songs",
        getAlbumsUrl: ()=>"https://music.apple.com/fr/library/albums"
    },
    amazonMusic: {
        id: "amazonMusic",
        name: "Amazon Music",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$AmazonMusicLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AmazonMusicLogo"],
        color: "#00A8E1",
        status: SERVICE_STATUS.OFF,
        apiBaseUrl: "https://api.music.amazon.com",
        getPlaylistUrl: (id)=>`https://music.amazon.com/playlists/${id}`,
        getLikedSongsUrl: ()=>null,
        getAlbumsUrl: ()=>null
    },
    tidal: {
        id: "tidal",
        name: "Tidal",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$TidalLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TidalLogo"],
        color: "#000000",
        status: SERVICE_STATUS.DEV,
        apiBaseUrl: "https://openapi.tidal.com/v2",
        getPlaylistUrl: (id)=>`https://tidal.com/playlist/${id}`,
        getLikedSongsUrl: ()=>null,
        getAlbumsUrl: ()=>null
    },
    pandora: {
        id: "pandora",
        name: "Pandora",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$PandoraLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PandoraLogo"],
        color: "#3668FF",
        status: SERVICE_STATUS.OFF,
        apiBaseUrl: "https://api.pandora.com/v1",
        getPlaylistUrl: (id)=>`https://www.pandora.com/playlist/${id}`,
        getLikedSongsUrl: ()=>null,
        getAlbumsUrl: ()=>null
    }
};
const SERVICES = (()=>{
    try {
        return ServicesSchema.parse(rawServices);
    } catch (error) {
        console.error("Services configuration validation failed:", error);
        throw new Error("Invalid services configuration. Please check the service definitions.");
    }
})();
const getAvailableServices = ()=>{
    try {
        const isProduction = ("TURBOPACK compile-time value", "development") === "production";
        const availableServices = Object.values(SERVICES).filter((service)=>{
            if (service.status === SERVICE_STATUS.AVAILABLE) {
                return true;
            }
            // Include DEV services when not in production
            // if (!isProduction && service.status === SERVICE_STATUS.DEV) {
            //   return true;
            // }
            return false;
        });
        if (availableServices.length === 0) {
            console.warn("No available services found");
        }
        return availableServices;
    } catch (error) {
        console.error("Error getting available services:", error);
        return [];
    }
};
const getOfflineServices = ()=>{
    try {
        return Object.values(SERVICES).filter((service)=>service.status === SERVICE_STATUS.OFF);
    } catch (error) {
        console.error("Error getting offline services:", error);
        return [];
    }
};
const getDevServices = ()=>{
    try {
        return Object.values(SERVICES).filter((service)=>service.status === SERVICE_STATUS.DEV);
    } catch (error) {
        console.error("Error getting dev services:", error);
        return [];
    }
};
const getMaintenanceServices = ()=>{
    try {
        return Object.values(SERVICES).filter((service)=>service.status === SERVICE_STATUS.MAINTENANCE);
    } catch (error) {
        console.error("Error getting maintenance services:", error);
        return [];
    }
};
const getComingSoonServices = ()=>{
    try {
        return Object.values(SERVICES).filter((service)=>service.status === SERVICE_STATUS.OFF);
    } catch (error) {
        console.error("Error getting coming soon services:", error);
        return [];
    }
};
const getServiceById = (id)=>{
    if (!id || typeof id !== "string") {
        console.error(`Invalid service ID "${id}": must be a non-empty string`);
        return undefined;
    }
    return SERVICES[id];
};
const validateServiceConfig = (config)=>{
    return ServiceConfigSchema.parse(config);
};
const getPlaylistUrl = (serviceId, playlistId)=>{
    try {
        const service = getServiceById(serviceId);
        if (!service) {
            throw new Error(`Service "${serviceId}" not found`);
        }
        // Validate playlist ID
        if (!playlistId || playlistId.trim().length === 0) {
            throw new Error("Playlist ID cannot be empty");
        }
        return service.getPlaylistUrl(playlistId.trim());
    } catch (error) {
        console.error(`Error getting playlist URL for service "${serviceId}":`, error);
        return null;
    }
};
}),
"[project]/apps/web/src/lib/services/apple/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAlbumsToLibrary",
    ()=>addAlbumsToLibrary,
    "addTracksToLibrary",
    ()=>addTracksToLibrary,
    "authorizeAppleMusic",
    ()=>authorizeAppleMusic,
    "createPlaylistWithTracks",
    ()=>createPlaylistWithTracks,
    "fetchPlaylistTracks",
    ()=>fetchPlaylistTracks,
    "fetchUserLibrary",
    ()=>fetchUserLibrary,
    "initializeAppleMusic",
    ()=>initializeAppleMusic,
    "search",
    ()=>search,
    "searchAlbums",
    ()=>searchAlbums
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/apple/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/batch-processor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/matching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/retry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/config/services.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERVICES"].apple.apiBaseUrl;
// Define Apple-specific retry options
const APPLE_RETRY_OPTIONS = {
    maxRetries: 5,
    initialRetryDelay: 200,
    maxRetryDelay: 32000,
    jitterFactor: 0.1
};
// Helper function to fetch Apple Music API with authentication
async function fetchAppleMusic(url, options = {}, authData) {
    const finalUrl = url instanceof URL ? url.toString() : url;
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${("TURBOPACK compile-time value", "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4UzI4VzhSMjIifQ.eyJpYXQiOjE3NDE3NzIwODYsImV4cCI6MTc1NzMyNDA4NiwiaXNzIjoiU0pCUzI5NjNMNSJ9.8bgx8Uzi-FfdlB61YNV_l2FnDOBQAnXHItnuxmDuzcGD0p3UcVsJF9Ss_7zDeguVeoNT5exvpv2S6crNzJe7TQ")}`,
        "Music-User-Token": authData.accessToken
    };
    return fetch(finalUrl, {
        ...options,
        headers
    });
}
async function initializeAppleMusic(injectedMusicKit) {
    try {
        // Use the injected MusicKit if provided, otherwise use window.MusicKit
        let musicKit = injectedMusicKit ?? (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined);
        if (!musicKit) {
            // Retry logic as before
            let attempts = 0;
            while(attempts < 10){
                await new Promise((resolve)=>setTimeout(resolve, 500 * (attempts + 1)));
                musicKit = injectedMusicKit ?? (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined);
                if (musicKit) {
                    break;
                }
                attempts++;
            }
            if (!musicKit) {
                throw new Error("MusicKit failed to load after multiple attempts");
            }
        }
        await musicKit.configure({
            developerToken: ("TURBOPACK compile-time value", "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4UzI4VzhSMjIifQ.eyJpYXQiOjE3NDE3NzIwODYsImV4cCI6MTc1NzMyNDA4NiwiaXNzIjoiU0pCUzI5NjNMNSJ9.8bgx8Uzi-FfdlB61YNV_l2FnDOBQAnXHItnuxmDuzcGD0p3UcVsJF9Ss_7zDeguVeoNT5exvpv2S6crNzJe7TQ") || "",
            app: {
                name: "Nonna.fm",
                build: "1.0.0"
            }
        });
        return musicKit.getInstance();
    } catch (error) {
        throw error;
    }
}
async function authorizeAppleMusic(role, injectedMusicKit) {
    try {
        const music = await initializeAppleMusic(injectedMusicKit);
        const musicUserToken = await music.authorize();
        // Store auth data in localStorage
        const authData = {
            accessToken: musicUserToken,
            refreshToken: "",
            expiresIn: 3600,
            timestamp: Date.now(),
            userId: musicUserToken,
            tokenType: "Bearer",
            role,
            serviceId: "apple"
        };
        // Store in localStorage
        localStorage.setItem(role === "source" ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].SOURCE.TOKEN : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AUTH_STORAGE_KEYS"].TARGET.TOKEN, JSON.stringify(authData));
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setServiceType"])(role, "apple");
        return musicUserToken;
    } catch (error) {
        throw error;
    }
}
// Helper function to perform the actual search and matching for Apple Music
async function performSearch(track, searchTerm, authData) {
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(async ()=>{
        const url = new URL(`${BASE_URL}/v1/catalog/fr/search`);
        url.searchParams.set("term", searchTerm);
        url.searchParams.set("types", "songs");
        url.searchParams.set("limit", "3");
        url.searchParams.set("fields[songs]", "name,artistName,albumName");
        url.searchParams.set("include", "albums");
        return fetchAppleMusic(url, {
            method: "GET"
        }, authData);
    }, APPLE_RETRY_OPTIONS);
    if (!result.results?.songs?.data?.length) {
        return {
            songId: null,
            albumId: null
        };
    }
    const matches = await Promise.all(result.results.songs.data.map(async (song)=>({
            song,
            ...await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTrackMatchScore"])(track, {
                name: song.attributes.name,
                artist: song.attributes.artistName,
                album: song.attributes.albumName
            }, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TRACK_CONFIG"])
        })));
    matches.sort((a, b)=>b.score - a.score);
    const filteredMatches = matches.filter((match)=>match.score >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TRACK_CONFIG"].thresholds.minimum);
    if (filteredMatches.length > 0) {
        const bestMatch = filteredMatches[0].song;
        const albumId = bestMatch.relationships?.album?.data?.[0]?.id || null;
        return {
            songId: bestMatch.id,
            albumId
        };
    }
    return {
        songId: null,
        albumId: null
    };
}
// Refactored findBestMatch to use performSearch and retry logic like Spotify
async function findBestMatch(track, authData) {
    try {
        // Clean the track name for better matching
        const cleanedTrack = {
            ...track,
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanTrackTitle"])(track.name)
        };
        // First attempt with full search query
        const searchQuery = `${cleanedTrack.name} ${track.artist}`;
        let bestMatch = await performSearch(cleanedTrack, searchQuery, authData);
        // If no good match found and track is from YouTube, retry with just the cleaned track name
        if (!bestMatch.songId && track.videoId) {
            const retrySearchQuery = cleanedTrack.name;
            bestMatch = await performSearch(cleanedTrack, retrySearchQuery, authData);
        }
        return bestMatch;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("track_search", "apple", error, {
            trackName: track.name,
            trackArtist: track.artist
        });
        return {
            songId: null,
            albumId: null
        };
    }
}
async function search(tracks, onProgress) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with Apple Music");
        }
        const results = [];
        let matched = 0;
        let unmatched = 0;
        let processedCount = 0;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const trackResults = await Promise.all(batch.map(async (track)=>{
                const { songId, albumId } = await findBestMatch(track, authData);
                processedCount++;
                if (onProgress) {
                    onProgress(processedCount / tracks.length);
                }
                return {
                    ...track,
                    targetId: songId || undefined,
                    albumId: albumId || undefined,
                    status: songId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            }));
            results.push(...trackResults);
            matched += trackResults.filter((r)=>r.targetId).length;
            unmatched += trackResults.filter((r)=>!r.targetId).length;
        }, {
            items: tracks,
            batchSize: 10,
            onBatchStart: ()=>{}
        });
        return {
            matched,
            unmatched,
            total: tracks.length,
            tracks: results
        };
    } catch (error) {
        throw error;
    }
}
async function createPlaylistWithTracks(name, tracks, description) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with Apple Music");
        }
        // Create the playlist with retry
        const playlistData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(`${BASE_URL}/v1/me/library/playlists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    attributes: {
                        name,
                        description: description || `Imported on ${new Date().toLocaleDateString()}`
                    }
                })
            }, authData), APPLE_RETRY_OPTIONS);
        const playlistId = playlistData.data?.[0]?.id;
        if (!playlistId) {
            throw new Error("Failed to create playlist - no ID returned");
        }
        // Filter tracks with IDs
        const tracksWithIds = tracks.filter((track)=>!!track.targetId);
        if (tracksWithIds.length === 0) {
            return {
                added: 0,
                failed: tracks.length,
                total: tracks.length,
                playlistId
            };
        }
        // Add tracks to playlist
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(`${BASE_URL}/v1/me/library/playlists/${playlistId}/tracks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: tracksWithIds.map((track)=>({
                            id: track.targetId,
                            type: "songs"
                        }))
                })
            }, authData), APPLE_RETRY_OPTIONS);
        return {
            added: tracksWithIds.length,
            failed: tracks.length - tracksWithIds.length,
            total: tracks.length,
            playlistId
        };
    } catch (error) {
        throw error;
    }
}
async function addTracksToLibrary(tracks) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with Apple Music");
        }
        // Filter tracks with valid targetIds
        const tracksWithIds = tracks.filter((track)=>!!track.targetId);
        if (tracksWithIds.length === 0) {
            return {
                added: 0,
                failed: tracks.length,
                total: tracks.length,
                playlistId: null
            };
        }
        // Add tracks to library with retry
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(`${BASE_URL}/v1/me/library`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: tracksWithIds.map((track)=>({
                            id: track.targetId,
                            type: "songs"
                        }))
                })
            }, authData), APPLE_RETRY_OPTIONS);
        return {
            added: tracksWithIds.length,
            failed: tracks.length - tracksWithIds.length,
            total: tracks.length,
            playlistId: null
        };
    } catch (error) {
        throw error;
    }
}
async function addAlbumsToLibrary(albums) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with Apple Music");
        }
        if (albums.size === 0) {
            return {
                added: 0,
                failed: albums.size,
                total: albums.size,
                playlistId: null
            };
        }
        // Construct the URL with comma-separated album IDs
        const albumIds = Array.from(albums).map((album)=>album.targetId).join(",");
        const url = `${BASE_URL}/v1/me/library?ids[albums]=${albumIds}`;
        // Add albums to library with retry
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            }, authData), APPLE_RETRY_OPTIONS);
        return {
            added: albums.size,
            failed: 0,
            total: albums.size,
            playlistId: null
        };
    } catch (error) {
        throw error;
    }
}
async function findBestAlbumMatch(album, authData) {
    try {
        // Clean search terms
        const searchTerm = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanSearchTerm"])(album.name)} ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanSearchTerm"])(album.artist)}`;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(async ()=>{
            const url = new URL(`${BASE_URL}/v1/catalog/fr/search`);
            url.searchParams.set("term", searchTerm);
            url.searchParams.set("types", "albums");
            url.searchParams.set("limit", "3");
            url.searchParams.set("fields[albums]", "name,artistName");
            return fetchAppleMusic(url, {
                method: "GET"
            }, authData);
        }, APPLE_RETRY_OPTIONS);
        // Process initial search results
        if (!result.results?.albums?.data?.length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "apple", new Error(`No search results found for album "${album.name}" by ${album.artist}`), {
                albumName: album.name,
                albumArtist: album.artist
            });
            return {
                albumId: null
            };
        }
        const matches = result.results.albums.data.map((appleAlbum)=>({
                album: appleAlbum,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateAlbumMatchScore"])(album, {
                    name: appleAlbum.attributes.name,
                    artist: appleAlbum.attributes.artistName
                }, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_ALBUM_CONFIG"])
            })).sort((a, b)=>b.score - a.score);
        // Return best match if it meets the threshold
        if (matches[0].score >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_ALBUM_CONFIG"].thresholds.minimum) {
            return {
                albumId: matches[0].album.id
            };
        }
        return {
            albumId: null
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "apple", error, {
            albumName: album.name,
            albumArtist: album.artist
        });
        return {
            albumId: null
        };
    }
}
async function searchAlbums(albums, onProgress) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with Apple Music");
        }
        const results = [];
        let matched = 0;
        let unmatched = 0;
        let processedCount = 0;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const albumResults = await Promise.all(batch.map(async (album)=>{
                const { albumId } = await findBestAlbumMatch(album, authData);
                processedCount++;
                if (onProgress) {
                    onProgress(processedCount / albums.length);
                }
                return {
                    ...album,
                    targetId: albumId || undefined,
                    status: albumId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            }));
            results.push(...albumResults);
            matched += albumResults.filter((r)=>r.targetId).length;
            unmatched += albumResults.filter((r)=>!r.targetId).length;
        }, {
            items: albums,
            batchSize: 10,
            onBatchStart: ()=>{}
        });
        return {
            matched,
            unmatched,
            total: albums.length,
            albums: results
        };
    } catch (error) {
        throw error;
    }
}
async function fetchUserLibrary() {
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("source");
    if (!authData) throw new Error("Not authenticated with Apple Music");
    // Base URL for Apple Music API
    const baseUrl = `${BASE_URL}/v1/me/library`;
    // Helper function to format artwork URL
    const formatArtworkUrl = (url)=>{
        if (!url) return undefined;
        // Replace {w} and {h} with actual dimensions
        return url.replace("{w}", "192").replace("{h}", "192");
    };
    // Fetch playlists
    const playlists = [];
    let nextUrl = `${baseUrl}/playlists?limit=50`;
    do {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(nextUrl, {
                method: "GET"
            }, authData), APPLE_RETRY_OPTIONS);
        const playlistItems = data.data.map((playlist)=>({
                id: playlist.id,
                name: playlist.attributes.name,
                trackCount: playlist.attributes.trackCount,
                ownerId: authData.userId,
                artwork: formatArtworkUrl(playlist.attributes.artwork?.url),
                tracks: []
            }));
        playlists.push(...playlistItems);
        nextUrl = data.next ? `${BASE_URL}${data.next}` : "";
        if (!nextUrl) break;
    }while (nextUrl)
    // Fetch songs from library
    const songs = [];
    nextUrl = `${baseUrl}/songs?limit=50`;
    do {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(nextUrl, {
                method: "GET"
            }, authData), APPLE_RETRY_OPTIONS);
        const songItems = data.data.map((song)=>({
                id: song.id,
                name: song.attributes.name,
                artist: song.attributes.artistName,
                album: song.attributes.albumName,
                artwork: formatArtworkUrl(song.attributes.artwork?.url)
            }));
        songs.push(...songItems);
        nextUrl = data.next ? `${BASE_URL}${data.next}` : "";
        if (!nextUrl) break;
    }while (nextUrl)
    // Fetch albums
    const albums = [];
    nextUrl = `${baseUrl}/albums?limit=50`;
    do {
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(nextUrl, {
                method: "GET"
            }, authData), APPLE_RETRY_OPTIONS);
        const albumItems = data.data.map((album)=>({
                id: album.id,
                name: album.attributes.name,
                artist: album.attributes.artistName,
                artwork: formatArtworkUrl(album.attributes.artwork?.url)
            }));
        albums.push(...albumItems);
        nextUrl = data.next ? `${BASE_URL}${data.next}` : "";
        if (!nextUrl) break;
    }while (nextUrl)
    return {
        playlists,
        likedSongs: songs,
        albums
    };
}
async function fetchPlaylistTracks(playlistId, onProgress) {
    // Helper function to format artwork URL
    const formatArtworkUrl = (url)=>{
        if (!url) return undefined;
        // Replace {w} and {h} with actual dimensions
        return url.replace("{w}", "48").replace("{h}", "48");
    };
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleAuthData"])("source");
    if (!authData) throw new Error("Not authenticated with Apple Music");
    const tracks = [];
    let nextUrl = `${BASE_URL}/v1/me/library/playlists/${playlistId}/tracks?limit=50`;
    while(nextUrl){
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetchAppleMusic(nextUrl, {
                method: "GET"
            }, authData), {
            ...APPLE_RETRY_OPTIONS,
            treat404AsEmpty: true
        });
        // Apple API does not return total, so we estimate progress by assuming 100 per page
        const trackItems = data.data.map((item)=>({
                id: item.id,
                name: item.attributes.name,
                artist: item.attributes.artistName,
                album: item.attributes.albumName,
                artwork: formatArtworkUrl(item.attributes.artwork?.url)
            }));
        tracks.push(...trackItems);
        // Call onProgress after each page
        if (onProgress) {
            // Estimate progress: if no nextUrl, we're done
            const progress = data.next ? 0.99 : 1;
            onProgress([
                ...tracks
            ], progress);
        }
        nextUrl = data.next ? `${BASE_URL}${data.next}` : "";
    }
    return tracks;
}
}),
"[project]/apps/web/src/components/modals/DeezerConnectModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeezerConnectModal",
    ()=>DeezerConnectModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/deezer/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
"use client";
;
;
;
;
;
;
;
// Dynamically import Dialog component
const DialogComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/shared/Dialog.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function DeezerConnectModal({ isOpen, onClose }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [deezerUserId, setDeezerUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connectError, setConnectError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isValidating, setIsValidating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [validationStatus, setValidationStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showTechnicalDetails, setShowTechnicalDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Debounced validation function
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!deezerUserId) {
            setValidationStatus(null);
            return;
        }
        const validateProfile = async ()=>{
            try {
                setIsValidating(true);
                setConnectError("");
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDeezerUser"])(deezerUserId);
                setValidationStatus("success");
            } catch (error) {
                setValidationStatus("error");
                setConnectError(error instanceof Error ? error.message : "Failed to validate profile");
            } finally{
                setIsValidating(false);
            }
        };
        const timeoutId = setTimeout(validateProfile, 500);
        return ()=>clearTimeout(timeoutId);
    }, [
        deezerUserId
    ]);
    const handleDeezerConnect = async ()=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
            setIsConnecting(true);
            setConnectError("");
            // Validate the user ID
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateDeezerUser"])(deezerUserId);
            // Store the user ID
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["storeDeezerUserId"])(deezerUserId);
            // Redirect to source page
            router.push("/source?source=deezer");
        } catch (error) {
            console.error("Error connecting to Deezer:", error);
            setConnectError(error instanceof Error ? error.message : "Failed to connect to Deezer");
        } finally{
            setIsConnecting(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogComponent, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Connect with Deezer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200",
                                    children: "Why do we need your profile ID?"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 82,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base text-zinc-600 dark:text-stone-400",
                                    children: [
                                        "Deezer works differently from other platforms. To connect your account, we need your profile ID - it's like your unique username for Deezer.",
                                        " ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowTechnicalDetails(!showTechnicalDetails),
                                            className: "inline-flex items-center gap-1 text-indigo-600 hover:underline dark:text-indigo-400",
                                            children: [
                                                "See more",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: `h-4 w-4 transform transition-transform ${showTechnicalDetails ? "rotate-180" : ""}`,
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M19 9l-7 7-7-7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                        lineNumber: 99,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                    lineNumber: 93,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 85,
                                    columnNumber: 13
                                }, this),
                                showTechnicalDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-zinc-600 dark:border-indigo-800/30 dark:bg-indigo-950/50 dark:text-stone-400",
                                    children: "As of 2024, Deezer no longer accepts new OAuth application registrations for third-party developers. This means we can't use the traditional OAuth flow like we do with Spotify and YouTube. Instead, we use your public profile ID to access your public playlists, which is still allowed under Deezer's API terms."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 81,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200",
                                    children: "Make your profile public:"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 119,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    className: "list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: [
                                                "Log in to your Deezer account and go to",
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "https://account.deezer.com/login/?redirect_uri=https%3A%2F%2Fwww.deezer.com%2Faccount%2Fshare",
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "text-indigo-600 hover:underline dark:text-indigo-400",
                                                    children: "deezer.com/account/share"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "You should see your social sharing settings"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 134,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Make sure the “Private profile” option is disabled"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 135,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 118,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "mb-3 text-xl font-semibold text-zinc-800 dark:text-stone-200",
                                    children: "Get your Deezer profile ID:"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                    className: "list-inside list-decimal space-y-3 text-zinc-600 dark:text-stone-400",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "leading-relaxed",
                                        children: [
                                            "Go to your favourites, copy your profile ID from the URL:",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2 space-y-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/images/deezer_id.webp",
                                                    alt: "How to find your Deezer profile ID",
                                                    width: 400,
                                                    height: 200,
                                                    className: "rounded-xl border border-indigo-100 shadow-sm dark:border-indigo-800/30",
                                                    priority: true
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                    lineNumber: 80,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: "deezer-id-modal",
                            className: "block text-base font-medium text-zinc-800 dark:text-stone-200",
                            children: "Enter your Deezer profile ID"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    id: "deezer-id-modal",
                                    type: "text",
                                    value: deezerUserId,
                                    onChange: (e)=>{
                                        const value = e.target.value;
                                        const profileMatch = value.match(/(?:deezer\.com\/(?:[a-z]{2}\/)?(?:profile\/)?|^)(\d+)(?:$|\/|(?:\?|&).*)/);
                                        setDeezerUserId(profileMatch ? profileMatch[1] : value);
                                    },
                                    placeholder: "Paste your Deezer profile ID (e.g. 123456)",
                                    className: `w-full border bg-indigo-50 px-4 py-3 dark:bg-indigo-950/50 ${validationStatus === "success" ? "border-emerald-500 dark:border-emerald-400" : validationStatus === "error" ? "border-red-500 dark:border-red-400" : "border-indigo-200 dark:border-indigo-800/30"} rounded-xl pr-10 text-lg text-zinc-800 placeholder-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:text-stone-200 dark:placeholder-stone-500 dark:focus:ring-indigo-400`
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute right-3 top-1/2 -translate-y-1/2",
                                    children: isValidating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                        lineNumber: 192,
                                        columnNumber: 17
                                    }, this) : validationStatus === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-6 w-6 text-emerald-500 dark:text-emerald-400",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M5 13l4 4L19 7"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 200,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                        lineNumber: 194,
                                        columnNumber: 17
                                    }, this) : validationStatus === "error" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "h-6 w-6 text-red-500 dark:text-red-400",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M6 18L18 6M6 6l12 12"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, this) : null
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        connectError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-red-500 dark:text-red-400",
                            children: connectError
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 224,
                            columnNumber: 28
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "flex-1 text-sm text-zinc-600 dark:text-stone-400",
                            children: [
                                "We only use this data for the transfer process.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this),
                                "We don't store any of your data permanently."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 235,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleDeezerConnect,
                                    disabled: !deezerUserId || isConnecting || validationStatus !== "success",
                                    className: "min-w-[100px] rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600",
                                    children: isConnecting ? "Connecting..." : "Connect"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                                    lineNumber: 241,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                            lineNumber: 234,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
                    lineNumber: 227,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/modals/DeezerConnectModal.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SpotifyConsentModal",
    ()=>SpotifyConsentModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
;
"use client";
;
;
// Dynamically import Dialog component
const DialogComponent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(async ()=>{}, {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/shared/Dialog.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function SpotifyConsentModal({ isOpen, onClose, onAgree }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogComponent, {
        isOpen: isOpen,
        onClose: onClose,
        title: "Spotify Terms of Service",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mb-2 font-semibold",
                            children: "Before using Spotify with Nonna.fm, please note:"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                            className: "ml-4 list-disc space-y-1.5 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "Nonna.fm makes no warranties or representations on behalf of Spotify and expressly disclaims all implied warranties with respect to the Spotify Platform, Spotify Service and Spotify Content, including the implied warranties of merchantability, fitness for a particular purpose and non-infringement."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 26,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "You agree to not modify or create derivative works based on the Spotify Platform, Spotify Service or Spotify Content."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 32,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "You agree to not decompile, reverse-engineer, disassemble, or otherwise reduce the Spotify Platform, Spotify Service, and Spotify Content to source code or other human-perceivable form, to the full extent allowed by law."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "Nonna.fm is solely responsible for this application and Spotify has no liability related to your use of this service."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 41,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                    children: "Spotify is a third party beneficiary of our terms of service and privacy policy and is entitled to directly enforce these terms."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 25,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-zinc-800 dark:text-stone-200",
                            children: "Privacy Information"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-2",
                                    children: "While using our service with Spotify, please be aware:"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 57,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "ml-4 list-disc space-y-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Our collection and use of data is subject to our privacy policy."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 59,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "We collect and use information about your Spotify playlists, saved songs, and related metadata solely for providing the playlist transfer service."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 60,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "All processing of your data happens directly in your browser. We do not store your Spotify data on our servers."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 64,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "For questions about your information, please contact us via our support channels."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "We do not place cookies on your browser beyond what is necessary for authentication."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 71,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "We do not allow third parties to place cookies on your browser to track browsing activities."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 74,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "You can manage cookies through your browser settings if you wish to control them."
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 56,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-4 pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "cursor-pointer rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50",
                            children: "Decline"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onAgree,
                            className: "cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
                            children: "I Agree"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/Header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/Footer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$AudioEqualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/AudioEqualizer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/crypto.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/apple/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/config/services.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$modals$2f$DeezerConnectModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/modals/DeezerConnectModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$modals$2f$SpotifyConsentModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/modals/SpotifyConsentModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function HomePageContent() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const error = searchParams.get("error");
    const [isDeezerModalOpen, setIsDeezerModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSpotifyConsentModalOpen, setIsSpotifyConsentModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Clear all service data if there was an error
        if (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
        }
        // Initialize encryption on app start
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$crypto$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeEncryption"])();
    }, [
        error
    ]);
    const handleSpotifyLogin = async ()=>{
        setIsSpotifyConsentModalOpen(true);
    };
    const handleSpotifyConsent = async ()=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
            setIsSpotifyConsentModalOpen(false);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initiateSpotifyAuth"])("source");
        } catch (error) {
            console.error("Error initiating Spotify auth:", error);
        }
    };
    const handleAppleLogin = async ()=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorizeAppleMusic"])("source");
            router.push("/source?source=apple");
        } catch (error) {
            console.error("Error initiating Apple Music auth:", error);
        }
    };
    const handleYouTubeLogin = async ()=>{
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initiateYouTubeAuth"])("source");
        } catch (error) {
            console.error("Error initiating YouTube auth:", error);
        }
    };
    const openDeezerModal = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAllServiceData"])();
        setIsDeezerModalOpen(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Header"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/page.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-7xl px-4 py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto max-w-4xl text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent lg:text-7xl dark:from-stone-50 dark:to-indigo-600",
                                                style: {
                                                    contain: "content"
                                                },
                                                children: "Your Music, Anywhere"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 81,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mx-auto text-xl leading-relaxed text-zinc-800 lg:text-2xl dark:text-indigo-100",
                                                style: {
                                                    contain: "content",
                                                    textRendering: "optimizeLegibility"
                                                },
                                                children: [
                                                    "Move your playlists between streaming platforms ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "easily"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 96,
                                                        columnNumber: 67
                                                    }, this),
                                                    "."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 80,
                                        columnNumber: 15
                                    }, this),
                                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-[var(--color-error)]/5 dark:bg-[var(--color-error)]/10 border-[var(--color-error)]/20 dark:text-[var(--color-error)]/90 mx-auto mb-8 max-w-lg rounded-2xl border px-6 py-4 text-[var(--color-error)] shadow-lg backdrop-blur-sm",
                                        style: {
                                            contain: "content"
                                        },
                                        children: [
                                            error === "spotify_auth_failed" && "Spotify authentication failed. Please try again.",
                                            error === "spotify_auth_error" && "An error occurred during Spotify authentication.",
                                            error === "youtube_auth_failed" && "YouTube Music authentication failed. Please try again.",
                                            error === "youtube_auth_error" && "An error occurred during YouTube Music authentication.",
                                            error === "not_authenticated" && "Please authenticate with a music service to continue."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-22",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$AudioEqualizer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AudioEqualizer"], {
                                            className: "opacity-90"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mb-8 flex items-center justify-center gap-3 text-2xl font-semibold text-zinc-800 lg:text-3xl dark:text-stone-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg text-zinc-800 dark:text-indigo-800",
                                                children: "1"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this),
                                            "Select your source:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mx-auto grid max-w-4xl grid-cols-2 items-stretch justify-center gap-4 py-4 pb-16 lg:grid-cols-4",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAvailableServices"])().map((service)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: service.id === "spotify" ? handleSpotifyLogin : service.id === "youtube" ? handleYouTubeLogin : service.id === "deezer" ? openDeezerModal : service.id === "apple" ? handleAppleLogin : undefined,
                                                className: "group flex h-[180px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl bg-indigo-100 px-5 py-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-200 dark:bg-indigo-950 dark:hover:bg-indigo-900/70",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(service.image, {
                                                        className: "h-12 w-12",
                                                        size: 48
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 147,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-text text-center text-base font-semibold",
                                                        children: [
                                                            "Connect with",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                                lineNumber: 150,
                                                                columnNumber: 23
                                                            }, this),
                                                            service.name
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 148,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, service.id, true, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 132,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/page.tsx",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/page.tsx",
                            lineNumber: 78,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative mx-auto max-w-7xl px-4 py-20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-4xl drop-shadow-md filter",
                                                    role: "img",
                                                    "aria-label": "Money with wings",
                                                    children: "💸"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/page.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 163,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200",
                                                children: "Generous Free Plan"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg text-zinc-600 dark:text-stone-400",
                                                children: [
                                                    "500 transfers for free ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        children: "everyday"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 42
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Upgrade to Premium for 10x more."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 162,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-3xl border border-indigo-200/50 bg-indigo-100 p-10 shadow-lg transition-all duration-200 hover:shadow-xl dark:border-indigo-800/30 dark:bg-indigo-950/70",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-8 flex h-16 w-16 transform items-center justify-center rounded-2xl bg-indigo-200 shadow-sm transition-transform duration-200 hover:scale-110 dark:bg-indigo-900/70",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-4xl drop-shadow-md filter",
                                                    role: "img",
                                                    "aria-label": "Shield with lock",
                                                    children: "🔐"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/page.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "mb-4 text-2xl font-semibold text-zinc-800 dark:text-stone-200",
                                                children: "Secure and private"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg text-zinc-600 dark:text-stone-400",
                                                children: [
                                                    "We do not sell your data.",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Our code is open source for full transparency."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/page.tsx",
                                                lineNumber: 194,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/page.tsx",
                                        lineNumber: 181,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/page.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/page.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/page.tsx",
                            lineNumber: 203,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$modals$2f$DeezerConnectModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DeezerConnectModal"], {
                            isOpen: isDeezerModalOpen,
                            onClose: ()=>setIsDeezerModalOpen(false)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/page.tsx",
                            lineNumber: 206,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$modals$2f$SpotifyConsentModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpotifyConsentModal"], {
                            isOpen: isSpotifyConsentModalOpen,
                            onClose: ()=>setIsSpotifyConsentModalOpen(false),
                            onAgree: handleSpotifyConsent
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/page.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/page.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/page.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/page.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
}
function HomePage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/page.tsx",
            lineNumber: 225,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HomePageContent, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/page.tsx",
            lineNumber: 226,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/page.tsx",
        lineNumber: 225,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8e1bc3fd._.js.map