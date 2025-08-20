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
"[project]/apps/web/src/contexts/LibraryContext.matchingState.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initialMatchingState",
    ()=>initialMatchingState
]);
const initialMatchingState = {
    isLoading: false,
    error: null,
    progress: {},
    currentTask: null
};
}),
"[project]/apps/web/src/contexts/LibraryContext.matchingReducer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchingReducer",
    ()=>matchingReducer
]);
function matchingReducer(state, action) {
    switch(action.type){
        case "MATCHING_START":
            // Start a new matching task
            return {
                ...state,
                isLoading: true,
                error: null,
                currentTask: action.payload
            };
        case "MATCHING_PROGRESS":
            // Update progress for a specific task key
            return {
                ...state,
                progress: {
                    ...state.progress,
                    [action.payload.key]: action.payload.value
                }
            };
        case "MATCHING_ERROR":
            // Set error and stop loading
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                currentTask: null
            };
        case "MATCHING_COMPLETE":
            // Mark task as complete, set progress to 100, stop loading
            return {
                ...state,
                isLoading: false,
                currentTask: null,
                progress: {
                    ...state.progress,
                    [action.payload]: 100
                }
            };
        case "MATCHING_CANCEL":
            {
                // Compute the key for the cancelled task
                const key = action.payload.type === "playlist" && action.payload.id ? `playlist:${action.payload.id}` : action.payload.type;
                // Remove the cancelled task's progress entry using destructuring
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [key]: _removed, ...rest } = state.progress;
                // Only clear isLoading/currentTask if the cancelled task is the current running task
                const isCurrentTask = state.currentTask && state.currentTask.type === action.payload.type && (action.payload.type !== "playlist" || action.payload.id && state.currentTask.type === "playlist" && state.currentTask.playlist.id === action.payload.id);
                // If cancelling the current running task, clear isLoading/currentTask
                // If cancelling a queued task, just remove its progress entry
                return {
                    ...state,
                    isLoading: isCurrentTask ? false : state.isLoading,
                    currentTask: isCurrentTask ? null : state.currentTask,
                    progress: rest
                };
            }
        default:
            return state;
    }
}
}),
"[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryContext",
    ()=>LibraryContext,
    "LibraryProvider",
    ()=>LibraryProvider,
    "useLibrary",
    ()=>useLibrary,
    "useLibrarySelection",
    ()=>useLibrarySelection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.matchingState.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingReducer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.matchingReducer.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// Initial state
const initialLibraryState = {
    likedSongs: new Set(),
    albums: new Set(),
    playlists: new Map(),
    selectedItems: {
        tracks: new Set(),
        albums: new Set(),
        playlists: new Set()
    },
    status: {
        isLoading: false,
        error: null
    },
    matching: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingState$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initialMatchingState"]
};
const LibraryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
// Reducer function
function libraryReducer(state, action) {
    // Delegate matching actions to matchingReducer
    switch(action.type){
        case "MATCHING_START":
        case "MATCHING_PROGRESS":
        case "MATCHING_ERROR":
        case "MATCHING_COMPLETE":
        case "MATCHING_CANCEL":
            return {
                ...state,
                matching: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingReducer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingReducer"])(state.matching, action)
            };
        // Selection actions
        case "SELECT_ALL_TRACKS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    tracks: new Set([
                        ...state.likedSongs ?? []
                    ].map((track)=>track.id))
                }
            };
        case "DESELECT_ALL_TRACKS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    tracks: new Set()
                }
            };
        case "SELECT_PLAYLIST":
            {
                const newPlaylists = new Set(state.selectedItems.playlists);
                newPlaylists.add(action.payload);
                return {
                    ...state,
                    selectedItems: {
                        ...state.selectedItems,
                        playlists: newPlaylists
                    }
                };
            }
        case "DESELECT_PLAYLIST":
            {
                const newPlaylists = new Set(state.selectedItems.playlists);
                newPlaylists.delete(action.payload);
                return {
                    ...state,
                    selectedItems: {
                        ...state.selectedItems,
                        playlists: newPlaylists
                    }
                };
            }
        case "SELECT_ALL_ALBUMS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    albums: new Set([
                        ...state.albums ?? []
                    ].map((album)=>album.id))
                }
            };
        case "DESELECT_ALL_ALBUMS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    albums: new Set()
                }
            };
        case "SELECT_ALL_PLAYLISTS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    playlists: new Set([
                        ...state.playlists?.keys() ?? []
                    ])
                }
            };
        case "DESELECT_ALL_PLAYLISTS":
            return {
                ...state,
                selectedItems: {
                    ...state.selectedItems,
                    playlists: new Set()
                }
            };
        case "RESET_SELECTION":
            return {
                ...state,
                selectedItems: {
                    tracks: new Set(),
                    albums: new Set(),
                    playlists: new Set()
                }
            };
        // Library data actions
        case "SET_LIKED_SONGS":
            return {
                ...state,
                likedSongs: action.payload
            };
        case "SET_ALBUMS":
            return {
                ...state,
                albums: action.payload
            };
        case "SET_PLAYLISTS":
            return {
                ...state,
                playlists: action.payload
            };
        case "SET_PLAYLISTS_FUNCTIONAL":
            {
                const next = action.payload(state.playlists ?? new Map());
                return {
                    ...state,
                    playlists: new Map(next)
                };
            }
        case "UPDATE_PLAYLIST":
            {
                const newPlaylists = new Map(state.playlists);
                newPlaylists.set(action.payload.id, action.payload);
                return {
                    ...state,
                    playlists: newPlaylists
                };
            }
        case "UPDATE_LIBRARY":
            return {
                ...state,
                ...action.payload
            };
        // Status actions
        case "SET_LOADING":
            return {
                ...state,
                status: {
                    ...state.status,
                    isLoading: action.payload
                }
            };
        case "SET_ERROR":
            return {
                ...state,
                status: {
                    ...state.status,
                    error: action.payload
                }
            };
        default:
            return state;
    }
}
function LibraryProvider({ children }) {
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(libraryReducer, initialLibraryState);
    const actions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            // Selection actions
            selectAllTracks: ()=>dispatch({
                    type: "SELECT_ALL_TRACKS"
                }),
            deselectAllTracks: ()=>dispatch({
                    type: "DESELECT_ALL_TRACKS"
                }),
            selectPlaylist: (playlistId)=>dispatch({
                    type: "SELECT_PLAYLIST",
                    payload: playlistId
                }),
            deselectPlaylist: (playlistId)=>dispatch({
                    type: "DESELECT_PLAYLIST",
                    payload: playlistId
                }),
            selectAllAlbums: ()=>dispatch({
                    type: "SELECT_ALL_ALBUMS"
                }),
            deselectAllAlbums: ()=>dispatch({
                    type: "DESELECT_ALL_ALBUMS"
                }),
            selectAllPlaylists: ()=>dispatch({
                    type: "SELECT_ALL_PLAYLISTS"
                }),
            deselectAllPlaylists: ()=>dispatch({
                    type: "DESELECT_ALL_PLAYLISTS"
                }),
            resetSelection: ()=>dispatch({
                    type: "RESET_SELECTION"
                }),
            // Library data actions
            setLikedSongs: (songs)=>dispatch({
                    type: "SET_LIKED_SONGS",
                    payload: songs
                }),
            setAlbums: (albums)=>dispatch({
                    type: "SET_ALBUMS",
                    payload: albums
                }),
            setPlaylists: (playlistsOrUpdater)=>{
                if (typeof playlistsOrUpdater === "function") {
                    dispatch({
                        type: "SET_PLAYLISTS_FUNCTIONAL",
                        payload: playlistsOrUpdater
                    });
                } else {
                    dispatch({
                        type: "SET_PLAYLISTS",
                        payload: playlistsOrUpdater
                    });
                }
            },
            updatePlaylist: (playlist)=>dispatch({
                    type: "UPDATE_PLAYLIST",
                    payload: playlist
                }),
            updateLibrary: (data)=>dispatch({
                    type: "UPDATE_LIBRARY",
                    payload: data
                }),
            // Status actions
            setLoading: (isLoading)=>dispatch({
                    type: "SET_LOADING",
                    payload: isLoading
                }),
            setError: (error)=>dispatch({
                    type: "SET_ERROR",
                    payload: error
                })
        }), [
        dispatch
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LibraryContext.Provider, {
        value: {
            state,
            dispatch,
            actions
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/contexts/LibraryContext.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
function useLibrary() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LibraryContext);
    if (!context) {
        throw new Error("useLibrary must be used within a LibraryProvider");
    }
    return context;
}
function useLibrarySelection() {
    const { state, actions } = useLibrary();
    return {
        selectedItems: state.selectedItems,
        ...actions
    };
}
}),
"[project]/apps/web/src/types/music-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MusicServiceSchema",
    ()=>MusicServiceSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
const MusicServiceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "spotify",
    "apple",
    "youtube",
    "deezer"
]);
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
"[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrackSchema",
    ()=>TrackSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
;
;
const TrackSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    artist: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    album: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    artwork: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].url().optional(),
    targetId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    videoId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MatchingStatusSchema"].optional(),
    selected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
}),
"[project]/apps/web/src/types/album.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlbumSchema",
    ()=>AlbumSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
;
;
const AlbumSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    artist: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    targetId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MatchingStatusSchema"].optional(),
    selected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    artwork: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].url().optional()
});
}),
"[project]/apps/web/src/types/playlist.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PlaylistSchema",
    ()=>PlaylistSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)");
;
;
const PlaylistSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    trackCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nullable(),
    ownerId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    tracks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrackSchema"]),
    selected: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    artwork: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].url().optional(),
    targetId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
}),
"[project]/apps/web/src/types/matching.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueueTaskSchema",
    ()=>QueueTaskSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/album.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$playlist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/playlist.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$music$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/music-service.ts [app-ssr] (ecmascript)");
;
;
;
;
;
const QueueTaskSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].discriminatedUnion("type", [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("likedSongs"),
        tracks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrackSchema"]),
        targetService: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$music$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MusicServiceSchema"]
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("albums"),
        albums: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlbumSchema"]),
        targetService: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$music$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MusicServiceSchema"]
    }),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
        type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].literal("playlist"),
        playlist: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$playlist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaylistSchema"],
        targetService: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$music$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MusicServiceSchema"]
    })
]);
}),
"[project]/apps/web/src/types/library.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryDataSchema",
    ()=>LibraryDataSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/album.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$playlist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/playlist.ts [app-ssr] (ecmascript)");
;
;
;
;
const LibraryDataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    likedSongs: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrackSchema"]),
    albums: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlbumSchema"]),
    playlists: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$playlist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlaylistSchema"])
});
}),
"[project]/apps/web/src/types/services.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchResultSchema",
    ()=>SearchResultSchema,
    "TransferResultSchema",
    ()=>TransferResultSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@4.0.17/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/album.ts [app-ssr] (ecmascript)");
;
;
;
const SearchResultSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    matched: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    unmatched: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    tracks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TrackSchema"]).optional(),
    albums: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlbumSchema"]).optional()
});
const TransferResultSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    added: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    failed: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    playlistId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$0$2e$17$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().nullable()
});
}),
"[project]/apps/web/src/types/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$music$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/music-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$track$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/track.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$album$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/album.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$playlist$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/playlist.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$library$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/library.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/services.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
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
"[project]/apps/web/src/lib/services/spotify/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "transformSpotifyAlbumToAlbum",
    ()=>transformSpotifyAlbumToAlbum,
    "transformSpotifyPlaylistToPlaylist",
    ()=>transformSpotifyPlaylistToPlaylist,
    "transformSpotifyTrackToTrack",
    ()=>transformSpotifyTrackToTrack
]);
function transformSpotifyTrackToTrack(spotifyTrack) {
    return {
        id: spotifyTrack.id,
        name: spotifyTrack.name,
        artist: spotifyTrack.artists[0].name,
        album: spotifyTrack.album.name,
        artwork: spotifyTrack.album.images?.[0]?.url
    };
}
function transformSpotifyAlbumToAlbum(spotifyAlbum) {
    return {
        id: spotifyAlbum.id,
        name: spotifyAlbum.name,
        artist: spotifyAlbum.artists[0].name,
        artwork: spotifyAlbum.images?.[0]?.url
    };
}
function transformSpotifyPlaylistToPlaylist(spotifyPlaylist) {
    return {
        id: spotifyPlaylist.id,
        name: spotifyPlaylist.name,
        trackCount: spotifyPlaylist.tracks.total,
        ownerId: spotifyPlaylist.owner.id,
        tracks: [],
        artwork: spotifyPlaylist.images?.[0]?.url
    };
}
}),
"[project]/apps/web/src/lib/services/spotify/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAlbumsToLibrary",
    ()=>addAlbumsToLibrary,
    "addTracksToLibrary",
    ()=>addTracksToLibrary,
    "createPlaylistWithTracks",
    ()=>createPlaylistWithTracks,
    "fetchPlaylistTracks",
    ()=>fetchPlaylistTracks,
    "fetchUserLibrary",
    ()=>fetchUserLibrary,
    "search",
    ()=>search,
    "searchAlbums",
    ()=>searchAlbums
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/retry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/matching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/batch-processor.ts [app-ssr] (ecmascript)");
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
// Base URL for Spotify API from services configuration
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERVICES"].spotify.apiBaseUrl;
// Spotify-specific retry options for all API calls
// These values can be tuned for Spotify's rate limits and error patterns
const SPOTIFY_RETRY_OPTIONS = {
    maxRetries: 5,
    initialRetryDelay: 500,
    maxRetryDelay: 32000,
    jitterFactor: 0.1
};
// Helper function to perform the actual search and matching
async function performSearch(track, searchQuery, authData) {
    // Use Spotify-specific retry options for all API calls
    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/search?q=${searchQuery}&type=track&limit=3`, {
            headers: {
                Authorization: `Bearer ${authData.accessToken}`
            }
        }), SPOTIFY_RETRY_OPTIONS);
    if (!data.tracks?.items?.length) {
        return null;
    }
    // Find the best match using our shared matching system
    const matchPromises = data.tracks.items.map(async (spotifyTrack)=>({
            track: spotifyTrack,
            ...await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateTrackMatchScore"])(track, {
                name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanTrackTitle"])(spotifyTrack.name),
                artist: spotifyTrack.artists[0].name,
                album: spotifyTrack.album.name
            }, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TRACK_CONFIG"])
        }));
    const matches = await Promise.all(matchPromises);
    matches.sort((a, b)=>b.score - a.score);
    // Return the ID if we have a good match (score >= minimum threshold)
    return matches[0].score >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_TRACK_CONFIG"].thresholds.minimum ? matches[0].track.id : null;
}
async function fetchUserLibrary() {
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("source");
    if (!authData) throw new Error("Not authenticated with Spotify");
    // Fetch playlists with batching and retry
    const initialPlaylistResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/playlists?limit=1`, {
            headers: {
                Authorization: `Bearer ${authData.accessToken}`
            }
        }), SPOTIFY_RETRY_OPTIONS);
    if (!initialPlaylistResponse.total) {
        throw new Error("Failed to fetch playlists count");
    }
    const totalPlaylists = initialPlaylistResponse.total;
    const playlistBatchSize = 50;
    const playlistBatchCount = Math.ceil(totalPlaylists / playlistBatchSize);
    const playlistResults = [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
        const offset = batch[0] * playlistBatchSize;
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/playlists?limit=${playlistBatchSize}&offset=${offset}&fields=items(id,name,tracks(total),owner(id,display_name),images)`, {
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`
                }
            }), SPOTIFY_RETRY_OPTIONS);
        playlistResults.push(...data.items.map((playlist)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformSpotifyPlaylistToPlaylist"])(playlist)));
    }, {
        items: Array.from({
            length: playlistBatchCount
        }, (_, i)=>i),
        batchSize: playlistBatchSize,
        onBatchStart: ()=>{}
    });
    const playlists = playlistResults;
    // Fetch saved tracks (liked songs) with batching and retry
    const initialResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/tracks?limit=1&fields=total`, {
            headers: {
                Authorization: `Bearer ${authData.accessToken}`
            }
        }), SPOTIFY_RETRY_OPTIONS);
    if (!initialResponse.total) {
        throw new Error("Failed to fetch saved tracks count");
    }
    const { total: totalTracks } = initialResponse;
    const batchSize = 50;
    const batchCount = Math.ceil(totalTracks / batchSize);
    const trackResults = [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
        // Process multiple offsets in parallel within each batch
        const batchPromises = batch.map(async (index)=>{
            const offset = index * batchSize;
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`, {
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`
                    }
                }), SPOTIFY_RETRY_OPTIONS);
            return data.items.map((item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformSpotifyTrackToTrack"])(item.track));
        });
        // Wait for all requests in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        trackResults.push(...batchResults.flat());
    }, {
        items: Array.from({
            length: batchCount
        }, (_, i)=>i),
        batchSize: 3,
        onBatchStart: ()=>{}
    });
    const likedSongs = trackResults;
    // Fetch saved albums with batching and retry
    const initialAlbumsResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/albums?limit=1`, {
            headers: {
                Authorization: `Bearer ${authData.accessToken}`
            }
        }), SPOTIFY_RETRY_OPTIONS);
    if (!initialAlbumsResponse.total) {
        throw new Error("Failed to fetch saved albums count");
    }
    const { total: totalAlbums } = initialAlbumsResponse;
    const albumBatchSize = 50; // Spotify's recommended batch size for albums
    const albumBatchCount = Math.ceil(totalAlbums / albumBatchSize);
    const albumResults = [];
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
        // Process multiple offsets in parallel within each batch
        const batchPromises = batch.map(async (index)=>{
            const offset = index * albumBatchSize;
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/albums?limit=${albumBatchSize}&offset=${offset}&fields=items(album(id,name,artists(name),images))`, {
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`
                    }
                }), SPOTIFY_RETRY_OPTIONS);
            return data.items.map((item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformSpotifyAlbumToAlbum"])(item.album));
        });
        // Wait for all requests in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        albumResults.push(...batchResults.flat());
    }, {
        items: Array.from({
            length: albumBatchCount
        }, (_, i)=>i),
        batchSize: 3,
        onBatchStart: ()=>{}
    });
    return {
        playlists,
        likedSongs,
        albums: albumResults
    };
}
async function fetchPlaylistTracks(playlistId, onProgress) {
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("source");
    if (!authData) throw new Error("Not authenticated with Spotify");
    // Fetch initial playlist info with retry
    const initialResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/playlists/${playlistId}/tracks?limit=1&fields=total`, {
            headers: {
                Authorization: `Bearer ${authData.accessToken}`
            }
        }), SPOTIFY_RETRY_OPTIONS);
    if (!initialResponse.total) {
        throw new Error("Failed to fetch playlist tracks count");
    }
    const { total } = initialResponse;
    const batchSize = 50;
    const batchCount = Math.ceil(total / batchSize);
    const trackResults = [];
    let loadedCount = 0;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
        // Process multiple offsets in parallel within each batch
        const batchPromises = batch.map(async (index)=>{
            const offset = index * batchSize;
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/playlists/${playlistId}/tracks?limit=${batchSize}&offset=${offset}&fields=items(track(id,name,artists(name),album(name,images)))`, {
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`
                    }
                }), SPOTIFY_RETRY_OPTIONS);
            return data.items.map((item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformSpotifyTrackToTrack"])(item.track));
        });
        // Wait for all requests in this batch to complete
        const batchResults = await Promise.all(batchPromises);
        const flatBatch = batchResults.flat();
        trackResults.push(...flatBatch);
        loadedCount += flatBatch.length;
        // Call onProgress with a shallow copy of the loaded tracks and progress ratio
        if (onProgress) {
            onProgress([
                ...trackResults
            ], Math.min(loadedCount / total, 1));
        }
    }, {
        items: Array.from({
            length: batchCount
        }, (_, i)=>i),
        batchSize: 1,
        onBatchStart: ()=>{}
    });
    return trackResults;
}
async function findBestMatch(track, authData) {
    try {
        // Clean the source track name for better matching
        const cleanedTrack = {
            ...track,
            name: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cleanTrackTitle"])(track.name)
        };
        // First attempt with full search query
        const searchQuery = encodeURIComponent(`${cleanedTrack.name} ${track.artist}`);
        let bestMatch = await performSearch(cleanedTrack, searchQuery, authData);
        // If no good match found and track is from YouTube, retry with just the cleaned track name
        if (bestMatch === null && track.videoId) {
            const retrySearchQuery = encodeURIComponent(cleanedTrack.name);
            bestMatch = await performSearch(cleanedTrack, retrySearchQuery, authData);
        }
        return bestMatch;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("track_search", "spotify", error, {
            trackName: track.name,
            trackArtist: track.artist
        });
        return null;
    }
}
async function search(tracks, onProgress) {
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("target");
    if (!authData) throw new Error("Not authenticated with Spotify");
    const results = [];
    let matched = 0;
    let unmatched = 0;
    let processedCount = 0;
    // Process tracks in batches
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
        const trackResults = await Promise.all(batch.map(async (track)=>{
            const targetId = await findBestMatch(track, authData);
            processedCount++;
            if (onProgress) {
                onProgress(processedCount / tracks.length);
            }
            return {
                ...track,
                targetId: targetId || undefined,
                status: targetId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
            };
        }));
        results.push(...trackResults);
        matched += trackResults.filter((r)=>r.targetId).length;
        unmatched += trackResults.filter((r)=>!r.targetId).length;
    }, {
        items: tracks,
        batchSize: 4,
        delayBetweenBatches: 200,
        onBatchStart: ()=>{}
    });
    return {
        matched,
        unmatched,
        total: tracks.length,
        tracks: results
    };
}
async function createPlaylistWithTracks(name, tracks, description) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("target");
        if (!authData) throw new Error("Not authenticated with Spotify");
        // Create the playlist using retryWithExponentialBackoff
        const playlistData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/playlists`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    description: description || `Imported on ${new Date().toLocaleDateString()}`
                })
            }), SPOTIFY_RETRY_OPTIONS);
        // The util parses JSON if available, so we can safely cast
        const playlistId = playlistData.id;
        if (!playlistId) {
            throw new Error("Failed to create playlist - no ID returned");
        }
        // Filter tracks with valid targetIds
        const tracksWithIds = tracks.filter((track)=>!!track.targetId);
        if (tracksWithIds.length === 0) {
            return {
                added: 0,
                failed: tracks.length,
                total: tracks.length,
                playlistId
            };
        }
        // Add tracks to playlist in batches using retryWithExponentialBackoff
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const uris = batch.map((track)=>`spotify:track:${track.targetId}`);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/playlists/${playlistId}/tracks`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        uris
                    })
                }), SPOTIFY_RETRY_OPTIONS);
        }, {
            items: tracksWithIds,
            batchSize: 100,
            onBatchStart: ()=>{}
        });
        return {
            ...result,
            playlistId
        };
    } catch (error) {
        throw error;
    }
}
async function addTracksToLibrary(tracks) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("target");
        if (!authData) throw new Error("Not authenticated with Spotify");
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
        // Add tracks to library in batches using retryWithExponentialBackoff
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const ids = batch.map((track)=>track.targetId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/tracks`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ids
                    })
                }), SPOTIFY_RETRY_OPTIONS);
        }, {
            items: tracksWithIds,
            batchSize: 50,
            onBatchStart: ()=>{}
        });
        return {
            ...result,
            playlistId: null
        };
    } catch (error) {
        throw error;
    }
}
async function addAlbumsToLibrary(albums) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("target");
        if (!authData) throw new Error("Not authenticated with Spotify");
        // Convert Set/Array to Array and filter albums with valid targetIds
        const albumsWithIds = (Array.isArray(albums) ? albums : Array.from(albums)).filter((album)=>!!album.targetId);
        if (albumsWithIds.length === 0) {
            throw new Error("No albums with valid targetIds found");
        }
        // Add albums to library in batches using retryWithExponentialBackoff
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const ids = batch.map((album)=>album.targetId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/me/albums`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ids
                    })
                }), SPOTIFY_RETRY_OPTIONS);
        }, {
            items: albumsWithIds,
            batchSize: 20,
            onBatchStart: ()=>{}
        });
        return {
            ...result,
            playlistId: null
        };
    } catch (error) {
        throw error;
    }
}
async function findBestAlbumMatch(album, authData) {
    try {
        // Clean and encode the search query
        const searchQuery = encodeURIComponent(`${album.name} ${album.artist}`);
        // Search for albums with retry
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(`${BASE_URL}/search?q=${searchQuery}&type=album&limit=10`, {
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`
                }
            }), SPOTIFY_RETRY_OPTIONS);
        if (!response.albums?.items?.length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "spotify", new Error(`No search results found for album "${album.name}" by ${album.artist}`), {
                albumName: album.name,
                albumArtist: album.artist
            });
            return null;
        }
        // Find the best match using our shared matching system
        const matches = response.albums.items.map((spotifyAlbum)=>({
                album: spotifyAlbum,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateAlbumMatchScore"])(album, {
                    name: spotifyAlbum.name,
                    artist: spotifyAlbum.artists[0].name
                }, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_ALBUM_CONFIG"])
            })).sort((a, b)=>b.score - a.score);
        // Return the ID if we have a good match (score >= minimum threshold)
        return matches[0].score >= __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$matching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_ALBUM_CONFIG"].thresholds.minimum ? matches[0].album.id : null;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "spotify", error, {
            albumName: album.name,
            albumArtist: album.artist
        });
        return null;
    }
}
async function searchAlbums(albums, onProgress) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])("target");
        if (!authData) throw new Error("Not authenticated with Spotify");
        const results = [];
        let matched = 0;
        let unmatched = 0;
        let processedCount = 0;
        // Process albums in batches
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const albumResults = await Promise.all(batch.map(async (album)=>{
                const spotifyId = await findBestAlbumMatch(album, authData);
                processedCount++;
                if (onProgress) {
                    onProgress(processedCount / albums.length);
                }
                return {
                    ...album,
                    targetId: spotifyId || undefined,
                    status: spotifyId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            }));
            results.push(...albumResults);
            matched += albumResults.filter((r)=>r.targetId).length;
            unmatched += albumResults.filter((r)=>!r.targetId).length;
        }, {
            items: albums,
            batchSize: 4,
            delayBetweenBatches: 200,
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
"[project]/apps/web/src/lib/services/youtube/ytmusic-adapter.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "YTMusicAdapter",
    ()=>YTMusicAdapter,
    "ytmusicAdapter",
    ()=>ytmusicAdapter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/types/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)");
;
;
/**
 * Returns an absolute URL for the YouTube Music API proxy.
 * In Node.js (test) environments, fetch requires an absolute URL.
 * Uses NEXT_PUBLIC_APP_URL or defaults to http://localhost:3000.
 */ function getYouTubeApiUrl(path) {
    // If already absolute, return as is
    if (/^https?:\/\//.test(path)) return path;
    // Use env or fallback
    const base = ("TURBOPACK compile-time value", "https://nonnalocal.fm:3000") || "http://localhost:3000";
    // Ensure no double slashes
    return base.replace(/\/$/, "") + (path.startsWith("/") ? path : "/" + path);
}
class YTMusicAdapter {
    initialized = false;
    currentRole = null;
    constructor(){}
    /**
   * Initialize connection to the YouTube Music API
   */ async initialize(role) {
        try {
            const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(role);
            if (!authData) {
                return false;
            }
            // Make a test API call to verify connectivity
            const testResult = await this.makeApiCall("search", {
                query: "test"
            }, authData.accessToken);
            if (!testResult) {
                return false;
            }
            this.initialized = true;
            this.currentRole = role;
            return true;
        } catch (error) {
            console.error("Failed to initialize YTMusic:", error);
            return false;
        }
    }
    /**
   * Make a call to our YouTube Music API proxy
   */ async makeApiCall(method, params, token) {
        try {
            // Use absolute URL for Node.js compatibility
            const url = getYouTubeApiUrl("/api/youtube/music");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    method,
                    params,
                    token
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${errorText}`);
            }
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error(`Error in API call ${method}:`, error);
            throw error;
        }
    }
    /**
   * Search for songs with improved YouTube Music results
   */ async search(query) {
        if (!this.initialized) {
            await this.initialize("source");
        }
        try {
            const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(this.currentRole || "source");
            if (!authData) throw new Error("Not authenticated with YouTube");
            const results = await this.makeApiCall("search", {
                query
            }, authData.accessToken);
            // Map the YTMusic search results to our ITrack format
            return results.filter((item)=>item.type === "SONG").map((item)=>({
                    id: item.videoId || "",
                    name: item.name || "Unknown Track",
                    artist: item.artist?.name || "Unknown Artist",
                    album: item.album?.name || "Unknown Album",
                    artwork: item.thumbnails?.[0]?.url
                }));
        } catch (error) {
            console.error(`Error searching for "${query}":`, error);
            return [];
        }
    }
    /**
   * Get user's library with better structured data
   */ async getLikedSongs() {
        if (!this.initialized) {
            await this.initialize("source");
        }
        try {
            const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(this.currentRole || "source");
            if (!authData) throw new Error("Not authenticated with YouTube");
            // Get liked songs using the YouTube Data API v3
            const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
            url.searchParams.append("part", "snippet");
            url.searchParams.append("playlistId", "LM");
            url.searchParams.append("maxResults", "50");
            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch liked songs");
            }
            const data = await response.json();
            // Map to our format
            return (data.items || []).map((item)=>({
                    id: item.snippet.resourceId.videoId || "",
                    name: item.snippet.title || "Unknown Track",
                    artist: item.snippet.channelTitle || "Unknown Artist",
                    album: "YouTube Music",
                    artwork: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
                }));
        } catch (error) {
            console.error("Error fetching liked songs:", error);
            return [];
        }
    }
    /**
   * Get songs matching search criteria for a batch of tracks
   * Used for matching source tracks to YouTube Music tracks
   */ async findMatchingTracks(tracks) {
        if (!this.initialized) {
            await this.initialize("target");
        }
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(this.currentRole || "target");
        if (!authData) throw new Error("Not authenticated with YouTube");
        return Promise.all(tracks.map(async (track)=>{
            try {
                // Construct a search query combining track name and artist
                const searchQuery = `${track.name} ${track.artist}`;
                // Use searchSongs to get more accurate song matches
                const searchResults = await this.makeApiCall("searchSongs", {
                    query: searchQuery
                }, authData.accessToken);
                // With searchSongs, we should already have only song results
                const songMatch = searchResults.find((item)=>item.type === "SONG");
                return {
                    ...track,
                    targetId: songMatch?.videoId || undefined,
                    status: songMatch?.videoId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            } catch (error) {
                console.error(`Error finding match for track "${track.name}":`, error);
                return {
                    ...track,
                    status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            }
        }));
    }
    /**
   * Find matching albums in YouTube Music
   * Used for matching source albums to YouTube Music albums
   */ async findMatchingAlbums(albums) {
        if (!this.initialized) {
            await this.initialize("target");
        }
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(this.currentRole || "target");
        if (!authData) throw new Error("Not authenticated with YouTube");
        return Promise.all(albums.map(async (album)=>{
            try {
                // Construct a search query combining album name and artist
                const searchQuery = `${album.name} ${album.artist}`;
                // Search for albums
                const searchResults = await this.makeApiCall("searchAlbums", {
                    query: searchQuery
                }, authData.accessToken);
                // Find the best album match
                const albumMatch = searchResults.find((item)=>item.type === "ALBUM" && item.albumId // Ensure it has a browseId
                );
                const result = {
                    ...album,
                    targetId: albumMatch?.albumId || undefined,
                    status: albumMatch?.albumId ? __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].MATCHED : __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
                return result;
            } catch (error) {
                console.error(`Error finding match for album "${album.name}":`, error);
                return {
                    ...album,
                    status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].UNMATCHED
                };
            }
        }));
    }
}
const ytmusicAdapter = new YTMusicAdapter();
}),
"[project]/apps/web/src/lib/services/youtube/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAlbumsToLibrary",
    ()=>addAlbumsToLibrary,
    "addTracksToLibrary",
    ()=>addTracksToLibrary,
    "createPlaylistWithTracks",
    ()=>createPlaylistWithTracks,
    "fetchPlaylistTracks",
    ()=>fetchPlaylistTracks,
    "fetchUserLibrary",
    ()=>fetchUserLibrary,
    "findMatchingAlbums",
    ()=>findMatchingAlbums,
    "search",
    ()=>search,
    "searchAlbums",
    ()=>searchAlbums
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$ytmusic$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/ytmusic-adapter.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/retry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/batch-processor.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)");
;
;
;
;
;
// YouTube-specific retry options for robust API error handling
const YOUTUBE_RETRY_OPTIONS = {
    maxRetries: 5,
    initialRetryDelay: 200,
    maxRetryDelay: 32000,
    jitterFactor: 0.1
};
/**
 * Find the best matching album from YouTube search results
 */ async function findBestAlbumMatch(album) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])("target");
        if (!authData) {
            return null;
        }
        // Use retryWithExponentialBackoff for robust error handling and retries
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch("/api/youtube/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: `${album.name} ${album.artist}`,
                    token: authData.accessToken
                })
            }), YOUTUBE_RETRY_OPTIONS);
        if (!data.matches?.length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "youtube", new Error(`No search results found for album "${album.name}" by ${album.artist}`), {
                albumName: album.name,
                albumArtist: album.artist
            });
            return null;
        }
        // Sort matches by score
        const matches = data.matches.sort((a, b)=>b.score - a.score);
        // Return the ID if we have a good match (score >= 0.7)
        const bestMatch = matches[0];
        if (bestMatch.score >= 0.7) {
            return bestMatch.item.snippet.resourceId?.videoId || bestMatch.item.id || null;
        }
        return null;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "youtube", error, {
            albumName: album.name,
            albumArtist: album.artist
        });
        return null;
    }
}
async function findMatchingAlbums(albums) {
    try {
        const results = await Promise.all(albums.map(async (album)=>{
            const targetId = await findBestAlbumMatch(album);
            return {
                ...album,
                targetId: targetId || undefined
            };
        }));
        return results;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "youtube", error, {});
        return albums.map((album)=>({
                ...album
            }));
    }
}
async function search(tracks, onProgress) {
    try {
        const ytAdapter = new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$ytmusic$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YTMusicAdapter"]();
        await ytAdapter.initialize("target");
        const results = [];
        let matched = 0;
        let unmatched = 0;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            const batchResults = await Promise.all(batch.map(async (track)=>{
                const result = await ytAdapter.findMatchingTracks([
                    track
                ]);
                return result[0];
            }));
            results.push(...batchResults);
            const validTracks = batchResults.filter((track)=>track.targetId);
            matched += validTracks.length;
            unmatched += batch.length - validTracks.length;
            if (onProgress) {
                onProgress(results.length / tracks.length);
            }
        }, {
            items: tracks,
            batchSize: 5,
            delayBetweenBatches: 200,
            onBatchStart: ()=>{}
        });
        return {
            matched,
            unmatched,
            total: tracks.length,
            tracks: results
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("track_search", "youtube", error, {});
        return {
            matched: 0,
            unmatched: tracks.length,
            total: tracks.length,
            tracks: tracks.map((track)=>({
                    ...track
                }))
        };
    }
}
async function createPlaylistWithTracks(name, tracks, description) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])("target");
        if (!authData) throw new Error("Not authenticated with YouTube");
        const validTracks = tracks.filter((track)=>track.targetId);
        if (validTracks.length === 0) {
            return {
                added: 0,
                failed: tracks.length,
                total: tracks.length,
                playlistId: null
            };
        }
        // Create the playlist using retryWithExponentialBackoff for reliability
        const playlistData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch("https://www.googleapis.com/youtube/v3/playlists?part=snippet", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    snippet: {
                        title: name,
                        description: description || "",
                        privacyStatus: "private"
                    }
                })
            }), YOUTUBE_RETRY_OPTIONS);
        const playlistId = playlistData.id;
        // Add tracks to the playlist in batches, using retryWithExponentialBackoff for each request
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            await Promise.all(batch.filter((track)=>track.targetId).map(async (track)=>{
                // Use retryWithExponentialBackoff for each add-track request
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${authData.accessToken}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            snippet: {
                                playlistId,
                                resourceId: {
                                    kind: "youtube#video",
                                    videoId: track.targetId
                                }
                            }
                        })
                    }), YOUTUBE_RETRY_OPTIONS);
                // If no data.id, treat as error
                if (!data.id) {
                    throw new Error("Failed to add track to playlist: No item ID returned");
                }
            }));
        }, {
            items: validTracks,
            batchSize: 1,
            delayBetweenBatches: 200,
            onBatchStart: ()=>{}
        });
        return {
            ...result,
            playlistId
        };
    } catch (error) {
        throw error;
    }
}
async function fetchPlaylistTracks(playlistId, onProgress) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])("source");
        if (!authData) throw new Error("Not authenticated with YouTube");
        const tracks = [];
        let nextPageToken;
        let total = undefined;
        do {
            const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
            url.searchParams.append("part", "snippet,status");
            url.searchParams.append("playlistId", playlistId);
            url.searchParams.append("maxResults", "50");
            if (nextPageToken) {
                url.searchParams.append("pageToken", nextPageToken);
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(url.toString(), {
                    headers: {
                        Authorization: `Bearer ${authData.accessToken}`
                    }
                }), YOUTUBE_RETRY_OPTIONS);
            // Set total from the first response
            if (total === undefined && response.pageInfo?.totalResults) {
                total = response.pageInfo.totalResults;
            }
            const data = response;
            tracks.push(...(data.items || []).filter((item)=>{
                // Only include tracks that have required data and are public
                if (!item.snippet?.resourceId?.videoId || !item.snippet.title) {
                    return false;
                }
                return item.status?.privacyStatus === "public";
            }).map((item)=>{
                const metadata = extractTrackMetadata(item);
                return {
                    id: item.snippet.resourceId.videoId,
                    name: metadata.title,
                    artist: metadata.artist,
                    album: "YouTube Music",
                    videoId: item.snippet.resourceId.videoId,
                    artwork: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
                };
            }));
            // Call onProgress after each page
            if (onProgress && total) {
                const progress = Math.min(tracks.length / total, 1);
                onProgress([
                    ...tracks
                ], progress);
            }
            nextPageToken = data.nextPageToken;
        }while (nextPageToken)
        return tracks;
    } catch (error) {
        throw error;
    }
}
async function fetchUserLibrary() {
    const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])("source");
    if (!authData) throw new Error("Not authenticated with YouTube");
    // Fetch playlists
    const playlists = [];
    let nextPageToken;
    do {
        const url = new URL("https://www.googleapis.com/youtube/v3/playlists");
        url.searchParams.append("part", "snippet,contentDetails");
        url.searchParams.append("mine", "true");
        url.searchParams.append("maxResults", "50");
        if (nextPageToken) {
            url.searchParams.append("pageToken", nextPageToken);
        }
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${authData.accessToken}`
                }
            }), YOUTUBE_RETRY_OPTIONS);
        const data = response;
        playlists.push(...data.items.map((playlist)=>({
                id: playlist.id || `youtube-${Date.now()}-${Math.random()}`,
                name: playlist.snippet.title,
                trackCount: playlist.contentDetails?.itemCount || 0,
                ownerId: authData.userId,
                tracks: [],
                artwork: playlist.snippet.thumbnails?.high?.url || playlist.snippet.thumbnails?.medium?.url || playlist.snippet.thumbnails?.default?.url
            })));
        nextPageToken = data.nextPageToken;
    }while (nextPageToken)
    // Fetch liked songs using the consolidated getPlaylist function
    const likedSongs = await fetchPlaylistTracks("LM");
    // For now, return empty albums array as YouTube Music's album structure
    // is different and will need special handling
    const albums = [];
    return {
        playlists,
        likedSongs,
        albums
    };
}
/**
 * Clean up YouTube title by removing common suffixes and prefixes
 */ function cleanYouTubeTitle(title) {
    // First remove any duration timestamp at the end (e.g., "4:46", "3:33")
    title = title.replace(/\s+\d{1,2}:\d{2}\s*$/, "");
    // Remove channel/uploader attribution at the end
    title = title.replace(/\s+by\s+[^()\[\]]+$/, "");
    return title// Remove all content in square brackets
    .replace(/\s*\[[^\]]*\]/g, "")// Remove official video/audio indicators
    .replace(/\s*\(Official.*?\)/gi, "")// Remove live performance indicators
    .replace(/\s*\(Live.*?\)/gi, "").replace(/\s*\(.*?Live Session.*?\)/gi, "")// Remove lyric video indicators
    .replace(/\s*\(Lyric.*?\)/gi, "").replace(/\s*\(.*?lyrics.*?\)/gi, "")// Remove audio indicators
    .replace(/\s*\(Audio.*?\)/gi, "").replace(/\s*\(Acoustic.*?\)/gi, "")// Remove music video indicators
    .replace(/\s*\(Music Video.*?\)/gi, "").replace(/\s*\(Video.*?\)/gi, "")// Remove mix/version/edit indicators
    .replace(/\s*\(.*?Mix.*?\)/gi, "").replace(/\s*\(.*?Version.*?\)/gi, "").replace(/\s*\(.*?Edit.*?\)/gi, "")// Remove cover song indicators
    .replace(/\s*\(.*?Cover.*?\)/gi, "")// Remove featuring artist indicators
    .replace(/\s*\(feat\..*?\)/gi, "").replace(/\s*\(ft\..*?\)/gi, "").replace(/\s+ft\..*$/gi, "") // Handle "ft." at the end without parentheses
    .replace(/\s+ft\s+.*$/gi, "") // Handle "ft" without dot at the end
    .replace(/\s+feat\..*$/gi, "") // Handle "feat." at the end without parentheses
    .replace(/\s+feat\s+.*$/gi, "") // Handle "feat" without dot at the end
    // Remove album indicators (usually at the end after artist)
    .replace(/\s+(?:From|on)\s+.*?(?:Album|EP).*?$/i, "")// Remove bonus track indicators
    .replace(/\s*\(Bonus Track\)/gi, "")// Remove instrumental indicators
    .replace(/\s*\(Instrumental\)/gi, "")// Remove uncensored indicators (with optional parentheses)
    .replace(/\s*(?:\()?Uncensored(?:\))?/gi, "")// Remove location indicators
    .replace(/\s*\(.*?at .*?\)/gi, "")// Remove quality/resolution tags
    .replace(/\s*\(?(?:HD|4K|1080p|720p|Full HD|Ultra HD|UHD|HQ)\)?/gi, "").replace(/\s*\((?:High Quality|High Definition)\)/gi, "").replace(/\s*\[(?:HD|4K|1080p|720p|Full HD|Ultra HD|UHD|HQ)\]/gi, "")// Remove any remaining parentheses with short content (likely metadata)
    .replace(/\s*\([^)]{1,20}\)/g, "")// Clean up apostrophes and quotes
    .replace(/[''′`]/g, "") // Remove single quotes and similar characters
    .replace(/[""]/g, "") // Remove double quotes
    // Clean up any leftover artifacts
    .replace(/\s*-\s*$/, "") // Remove trailing dash
    .replace(/^\s*-\s*/, "") // Remove leading dash
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}
/**
 * Clean up YouTube artist name by removing common suffixes and collaborations
 */ function cleanYouTubeArtist(artist) {
    return artist// Remove featuring artists with more comprehensive patterns
    .replace(/\s+feat\.?\s+.*/i, "") // "feat" or "feat."
    .replace(/\s+ft\.?\s+.*/i, "") // "ft" or "ft."
    .replace(/\s+featuring\s+.*/i, "") // "featuring"
    .replace(/\s*\(feat\.?\s+[^)]*\)/gi, "") // (feat. ...)
    .replace(/\s*\(ft\.?\s+[^)]*\)/gi, "") // (ft. ...)
    .replace(/\s*\[feat\.?\s+[^]]*\]/gi, "") // [feat. ...]
    .replace(/\s*\[ft\.?\s+[^]]*\]/gi, "") // [ft. ...]
    // Remove "- Topic" suffix common in YouTube Music
    .replace(/\s*-\s*Topic$/i, "")// Remove "VEVO" suffix
    .replace(/\s*VEVO$/i, "")// Remove common channel indicators
    .replace(/\s*\(Official\)$/i, "").replace(/\s*\(Official Channel\)$/i, "")// Clean up any leftover artifacts
    .replace(/\s+/g, " ").trim();
}
/**
 * Extract both title and artist information from a YouTube playlist item
 */ function extractTrackMetadata(item) {
    const { snippet } = item;
    const defaultResult = {
        title: cleanYouTubeTitle(snippet.title),
        artist: "Unknown Artist"
    };
    // Helper function to validate artist name
    const isValidArtistName = (name)=>{
        if (!name) return false;
        const invalidTerms = [
            "youtube",
            "vevo",
            "official",
            "music",
            "records",
            "topic"
        ];
        return !invalidTerms.some((term)=>name.toLowerCase().includes(term));
    };
    // Helper function to extract artist and title from a string
    const extractFromSeparator = (text)=>{
        // Match the pattern: "Artist feat. Someone - Title" but only with spaced dashes
        const featMatch = text.match(/^(.+?)(?:\s+(?:feat\.?|ft\.?|featuring)\s+[^-]+)?(?:\s+-\s+.+)$/i);
        if (featMatch) {
            const [, artist] = featMatch;
            // Get the title part after the last spaced dash
            const titlePart = text.split(/\s+-\s+/).pop() || "";
            return {
                artist: cleanYouTubeArtist(artist.trim()),
                title: cleanYouTubeTitle(titlePart.trim())
            };
        }
        // If no featuring pattern, just split on spaced separators
        const parts = text.split(/\s+[-–—:]\s+/).map((p)=>p.trim());
        if (parts.length < 2) return null;
        // Validate first part looks like an artist name (not too long, no special patterns)
        const potentialArtist = parts[0];
        if (potentialArtist.split(" ").length > 4 || potentialArtist.toLowerCase().includes("provided") || !isValidArtistName(potentialArtist)) {
            return null;
        }
        return {
            artist: cleanYouTubeArtist(potentialArtist),
            title: cleanYouTubeTitle(parts.slice(1).join(" - "))
        };
    };
    // Try to extract from Topic channel
    if (snippet.videoOwnerChannelTitle?.includes("- Topic")) {
        return {
            artist: cleanYouTubeArtist(snippet.videoOwnerChannelTitle.split("- Topic")[0].trim()),
            title: cleanYouTubeTitle(snippet.title)
        };
    }
    // Try to extract from description metadata
    if (snippet.description?.includes("Provided to YouTube")) {
        const lines = snippet.description.split("\n");
        let foundTitle = "";
        let foundArtist = "";
        for (const line of lines){
            if (!line.includes("·")) continue;
            const parts = line.split("·").map((p)=>p.trim());
            // Look for song title
            if (parts[0].toLowerCase().includes("song")) {
                foundTitle = cleanYouTubeTitle(parts[0].replace(/song/i, "").trim());
            } else if (line.toLowerCase().includes("title") || line.toLowerCase().includes("track")) {
                foundTitle = cleanYouTubeTitle(parts[0].trim());
            }
            // Look for artist
            if (line.toLowerCase().includes("performer") || line.toLowerCase().includes("artist")) {
                foundArtist = cleanYouTubeArtist(parts[parts.length - 1]);
            }
        }
        if (foundTitle || foundArtist) {
            return {
                title: foundTitle || defaultResult.title,
                artist: foundArtist || defaultResult.artist
            };
        }
    }
    // Try to extract from common title patterns
    const extracted = extractFromSeparator(snippet.title);
    if (extracted) return extracted;
    // Try to extract from channel information
    if (snippet.videoOwnerChannelTitle && isValidArtistName(snippet.videoOwnerChannelTitle)) {
        return {
            title: defaultResult.title,
            artist: cleanYouTubeArtist(snippet.videoOwnerChannelTitle)
        };
    }
    if (snippet.channelTitle && isValidArtistName(snippet.channelTitle)) {
        return {
            title: defaultResult.title,
            artist: cleanYouTubeArtist(snippet.channelTitle)
        };
    }
    // Fallback to default result with cleaned title
    return defaultResult;
}
async function searchAlbums(albums, onProgress) {
    try {
        // Use the YTMusicAdapter for album matching, just like search uses it for tracks
        const ytAdapter = new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$ytmusic$2d$adapter$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["YTMusicAdapter"]();
        await ytAdapter.initialize("target");
        const results = [];
        let matched = 0;
        let unmatched = 0;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$batch$2d$processor$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["processInBatches"])(async (batch)=>{
            // Use the adapter's findMatchingAlbums for each batch
            const batchResults = await ytAdapter.findMatchingAlbums(batch);
            // Map results to IAlbum with targetId
            const mappedResults = batchResults.map((album, i)=>({
                    ...batch[i],
                    targetId: album.targetId,
                    status: album.status
                }));
            results.push(...mappedResults);
            const validAlbums = mappedResults.filter((album)=>album.targetId);
            matched += validAlbums.length;
            unmatched += batch.length - validAlbums.length;
            if (onProgress) {
                onProgress(results.length / albums.length);
            }
        }, {
            items: albums,
            batchSize: 3,
            delayBetweenBatches: 300,
            onBatchStart: ()=>{}
        });
        return {
            matched,
            unmatched,
            total: albums.length,
            albums: results
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureMatchingError("album_search", "youtube", error, {});
        return {
            matched: 0,
            unmatched: albums.length,
            total: albums.length,
            albums: albums.map((album)=>({
                    ...album,
                    tracks: [],
                    targetId: undefined
                }))
        };
    }
}
async function addTracksToLibrary(tracks) {
    try {
        const authData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])("target");
        if (!authData) {
            throw new Error("Not authenticated with YouTube");
        }
        const validTracks = tracks.filter((track)=>track.targetId);
        if (validTracks.length === 0) {
            return {
                added: 0,
                failed: tracks.length,
                total: tracks.length,
                playlistId: null
            };
        }
        // Create a playlist for the tracks
        const playlistName = `Imported from Nonna.fm - ${new Date().toLocaleDateString()}`;
        const playlistId = await createPlaylistWithTracks(playlistName, validTracks);
        return {
            added: validTracks.length,
            failed: tracks.length - validTracks.length,
            total: tracks.length,
            playlistId: playlistId.playlistId
        };
    } catch (error) {
        throw error;
    }
}
async function addAlbumsToLibrary(_albums) {
    // no way to add albums to YouTube Music library yet
    return {
        added: 0,
        failed: 0,
        total: 0,
        playlistId: null
    };
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
"[project]/apps/web/src/lib/services/deezer/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEEZER_API_BASE",
    ()=>DEEZER_API_BASE,
    "addAlbumsToLibrary",
    ()=>addAlbumsToLibrary,
    "addTracksToLibrary",
    ()=>addTracksToLibrary,
    "createPlaylistWithTracks",
    ()=>createPlaylistWithTracks,
    "fetchDeezerAlbums",
    ()=>fetchDeezerAlbums,
    "fetchPlaylistTracks",
    ()=>fetchPlaylistTracks,
    "fetchUserLibrary",
    ()=>fetchUserLibrary,
    "search",
    ()=>search,
    "searchAlbums",
    ()=>searchAlbums
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/deezer/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/retry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/config/services.ts [app-ssr] (ecmascript)");
;
;
;
// Base URL for Deezer API from services configuration
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERVICES"].deezer.apiBaseUrl;
const DEEZER_API_BASE = BASE_URL;
// Define Deezer-specific retry options for all API calls
const DEEZER_RETRY_OPTIONS = {
    maxRetries: 5,
    initialRetryDelay: 300,
    maxRetryDelay: 16000,
    jitterFactor: 0.1
};
async function fetchUserLibrary() {
    const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDeezerUserId"])();
    if (!userId) throw new Error("No Deezer user ID found");
    // Fetch playlists and albums in parallel
    const [allPlaylists, albums] = await Promise.all([
        (async ()=>{
            let playlists = [];
            let nextUrl = `/api/deezer/playlists/${userId}`;
            // Fetch all pages of playlists with retry logic
            while(nextUrl){
                const url = nextUrl; // Ensure url is string
                // Use retryWithExponentialBackoff for robust error handling
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(url), DEEZER_RETRY_OPTIONS);
                if (data.error) {
                    throw new Error(data.error?.message || "Failed to fetch Deezer library");
                }
                if (data.data) {
                    playlists = [
                        ...playlists,
                        ...data.data
                    ];
                }
                // If we get a next URL from Deezer API, convert it to our API route
                nextUrl = data.next ? `/api/deezer/playlists/${userId}?${new URL(data.next).searchParams.toString()}` : undefined;
            }
            return playlists;
        })(),
        fetchDeezerAlbums()
    ]);
    // Find the loved tracks playlist
    const lovedTracksPlaylist = allPlaylists.find((p)=>p.is_loved_track);
    // Get the liked songs if the loved tracks playlist exists
    const likedSongs = lovedTracksPlaylist ? await fetchPlaylistTracks(lovedTracksPlaylist.id.toString()) : [];
    // Filter out the loved tracks playlist from regular playlists
    const playlists = allPlaylists.filter((playlist)=>!playlist.is_loved_track).map((playlist)=>({
            id: playlist.id.toString(),
            name: playlist.title,
            trackCount: playlist.nb_tracks,
            ownerId: userId,
            artwork: playlist.picture_medium,
            tracks: []
        }));
    return {
        likedSongs,
        albums,
        playlists
    };
}
async function fetchPlaylistTracks(playlistId, onProgress) {
    let allTracks = [];
    let nextUrl = `/api/deezer/playlists/${playlistId}/tracks`;
    let total = undefined;
    // Fetch all pages of tracks with retry logic
    while(nextUrl){
        const url = nextUrl; // Ensure url is string
        // Use retryWithExponentialBackoff for robust error handling
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(url), DEEZER_RETRY_OPTIONS);
        if (data.error) {
            throw new Error(data.error?.message || "Failed to fetch Deezer playlist tracks");
        }
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid response format from Deezer API");
        }
        // Set total from the first response
        if (total === undefined && typeof data.total === "number") {
            total = data.total;
        }
        // Transform tracks to our format
        const tracks = data.data.map((track)=>({
                id: track.id.toString(),
                name: track.title,
                artist: track.artist.name,
                album: track.album.title,
                duration: track.duration,
                artwork: track.album.cover_small,
                previewUrl: track.preview,
                externalUrl: track.link,
                service: "deezer"
            }));
        allTracks = [
            ...allTracks,
            ...tracks
        ];
        // Call onProgress after each page
        if (onProgress && total) {
            const progress = Math.min(allTracks.length / total, 1);
            onProgress([
                ...allTracks
            ], progress);
        }
        // If we get a next URL from Deezer API, convert it to our API route
        if (data.next) {
            const nextDeezerUrl = new URL(data.next);
            nextUrl = `/api/deezer/playlists/${playlistId}/tracks?${nextDeezerUrl.searchParams.toString()}`;
        } else {
            nextUrl = undefined;
        }
    }
    return allTracks;
}
async function fetchDeezerAlbums() {
    const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDeezerUserId"])();
    if (!userId) throw new Error("No Deezer user ID found");
    let allAlbums = [];
    let nextUrl = `/api/deezer/albums/${userId}`;
    // Fetch all pages of albums with retry logic
    while(nextUrl){
        const url = nextUrl; // Ensure url is string
        // Use retryWithExponentialBackoff for robust error handling
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$retry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retryWithExponentialBackoff"])(()=>fetch(url), DEEZER_RETRY_OPTIONS);
        if (data.error) {
            throw new Error(data.error?.message || "Failed to fetch Deezer albums");
        }
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid response format from Deezer API");
        }
        allAlbums = [
            ...allAlbums,
            ...data.data
        ];
        // If we get a next URL from Deezer API, convert it to our API route
        if (data.next) {
            const nextDeezerUrl = new URL(data.next);
            nextUrl = `/api/deezer/albums/${userId}?${nextDeezerUrl.searchParams.toString()}`;
        } else {
            nextUrl = undefined;
        }
    }
    // Convert Deezer albums to our format
    return allAlbums.map((album)=>({
            id: album.id.toString(),
            name: album.title,
            artist: album.artist.name,
            artwork: album.cover_small,
            trackCount: album.nb_tracks,
            tracks: [],
            service: "deezer"
        }));
}
async function search(tracks, onProgress) {
    // Call onProgress with 100% since we're not doing any actual work
    if (onProgress) {
        onProgress(1);
    }
    return {
        matched: 0,
        unmatched: tracks.length,
        total: tracks.length,
        tracks: []
    };
}
async function searchAlbums(albums, onProgress) {
    // Call onProgress with 100% since we're not doing any actual work
    if (onProgress) {
        onProgress(1);
    }
    return {
        matched: 0,
        unmatched: albums.length,
        total: albums.length,
        albums: []
    };
}
async function addTracksToLibrary(tracks) {
    return {
        added: 0,
        failed: tracks.length,
        total: tracks.length,
        playlistId: null
    };
}
async function addAlbumsToLibrary(albums) {
    return {
        added: 0,
        failed: albums.size,
        total: albums.size,
        playlistId: null
    };
}
async function createPlaylistWithTracks(_name, _tracks, _description) {
    return {
        added: 0,
        failed: _tracks.length,
        total: _tracks.length,
        playlistId: null
    };
}
}),
"[project]/apps/web/src/lib/services/factory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchingPlaylists",
    ()=>fetchingPlaylists,
    "musicServiceFactory",
    ()=>musicServiceFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/apple/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/deezer/api.ts [app-ssr] (ecmascript)");
;
;
;
;
class MusicServiceFactory {
    providers = {
        apple: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
        spotify: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
        youtube: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__,
        deezer: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
    };
    getProvider(service) {
        const provider = this.providers[service];
        if (!provider) {
            throw new Error(`No provider found for service: ${service}`);
        }
        return provider;
    }
}
const musicServiceFactory = new MusicServiceFactory();
const fetchingPlaylists = new Set();
}),
"[project]/apps/web/src/contexts/LibraryContext.matchingActions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "matchingCancel",
    ()=>matchingCancel,
    "matchingComplete",
    ()=>matchingComplete,
    "matchingError",
    ()=>matchingError,
    "matchingProgress",
    ()=>matchingProgress,
    "matchingStart",
    ()=>matchingStart
]);
const matchingStart = (task)=>({
        type: "MATCHING_START",
        payload: task
    });
const matchingProgress = (key, value)=>({
        type: "MATCHING_PROGRESS",
        payload: {
            key,
            value
        }
    });
const matchingError = (error)=>({
        type: "MATCHING_ERROR",
        payload: error
    });
const matchingComplete = (key)=>({
        type: "MATCHING_COMPLETE",
        payload: key
    });
const matchingCancel = (type, id)=>({
        type: "MATCHING_CANCEL",
        payload: {
            type,
            id
        }
    });
}),
"[project]/apps/web/src/hooks/useMatching.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMatching",
    ()=>useMatching
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/apps/web/src/types/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/types/matching-status.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.matchingActions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/utils/sentry-logger.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const useMatching = ()=>{
    const { state, dispatch, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrary"])();
    // Only keep queue and abortController local; all state is global
    const queueRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const isProcessingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Helper to get a unique task key for progress tracking
    const getTaskKey = (task)=>{
        if (task.type === "playlist") return `playlist:${task.playlist.id}`;
        return task.type;
    };
    // Queue processor
    const processQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (isProcessingRef.current || queueRef.current.length === 0) return;
        isProcessingRef.current = true;
        // Use action creator for matching start
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingStart"])(queueRef.current[0]));
        const task = queueRef.current[0];
        const taskKey = getTaskKey(task);
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;
        try {
            if (task.type === "likedSongs") {
                // Cast targetService to MusicService for provider
                const provider = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["musicServiceFactory"].getProvider(task.targetService);
                // Filter out tracks that already have a targetId (already matched)
                const tracksToMatch = task.tracks.filter((track)=>!track.targetId);
                if (tracksToMatch.length === 0) {
                    // All tracks already matched, skip provider call
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
                    return;
                }
                // Set all to pending first (including already matched, for UI consistency)
                const pendingSet = new Set(Array.from(state.likedSongs ?? []).map((track)=>({
                        ...track,
                        status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].PENDING
                    })));
                actions.setLikedSongs(pendingSet);
                const result = await provider.search(tracksToMatch, (progressValue)=>{
                    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
                    // Use action creator for progress
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingProgress"])(taskKey, Math.round(progressValue < 1 ? progressValue * 100 : progressValue)));
                });
                if (result.tracks) {
                    // Batch update: merge all result.tracks into state.likedSongs
                    const updatedTracksMap = new Map(result.tracks.map((track)=>[
                            track.id,
                            track
                        ]));
                    const updated = new Set(Array.from(state.likedSongs ?? []).map((track)=>updatedTracksMap.has(track.id) ? {
                            ...track,
                            ...updatedTracksMap.get(track.id)
                        } : track));
                    actions.setLikedSongs(updated);
                }
                // Use action creator for complete
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
            } else if (task.type === "albums") {
                // Cast targetService to MusicService for provider
                const provider = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["musicServiceFactory"].getProvider(task.targetService);
                // Filter out albums that already have a targetId (already matched)
                const albumsToMatch = task.albums.filter((album)=>!album.targetId);
                if (albumsToMatch.length === 0) {
                    // All albums already matched, skip provider call
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
                    return;
                }
                // Set all to pending first (including already matched, for UI consistency)
                const pendingSet = new Set(Array.from(state.albums ?? []).map((album)=>({
                        ...album,
                        status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].PENDING
                    })));
                actions.setAlbums(pendingSet);
                const result = await provider.searchAlbums(albumsToMatch, (progressValue)=>{
                    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
                    // Use action creator for progress
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingProgress"])(taskKey, Math.round(progressValue < 1 ? progressValue * 100 : progressValue)));
                });
                if (result.albums) {
                    // Batch update: merge all result.albums into state.albums
                    const updatedAlbumsMap = new Map(result.albums.map((album)=>[
                            album.id,
                            album
                        ]));
                    const updated = new Set(Array.from(state.albums ?? []).map((album)=>updatedAlbumsMap.has(album.id) ? {
                            ...album,
                            ...updatedAlbumsMap.get(album.id)
                        } : album));
                    actions.setAlbums(updated);
                }
                // Use action creator for complete
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
            } else if (task.type === "playlist") {
                // Cast targetService to MusicService for provider
                const provider = __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["musicServiceFactory"].getProvider(task.targetService);
                // Filter out tracks in the playlist that already have a targetId
                const tracksToMatch = task.playlist.tracks.filter((track)=>!track.targetId);
                if (tracksToMatch.length === 0) {
                    // All tracks already matched, skip provider call
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
                    return;
                }
                // Set all to pending first (including already matched, for UI consistency)
                const playlistId = task.playlist.id;
                const playlist = task.playlist;
                if (playlist) {
                    // Use functional update to avoid stale state bugs when multiple playlists are queued
                    actions.setPlaylists((prev)=>{
                        const updated = new Map(prev ?? []);
                        const pendingTracks = playlist.tracks.map((track)=>({
                                ...track,
                                status: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$types$2f$matching$2d$status$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MATCHING_STATUS"].PENDING
                            }));
                        updated.set(playlistId, {
                            ...playlist,
                            tracks: pendingTracks
                        });
                        return updated;
                    });
                }
                const result = await provider.search(tracksToMatch, (progressValue)=>{
                    if (signal.aborted) throw new DOMException("Aborted", "AbortError");
                    // Use action creator for progress
                    dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingProgress"])(taskKey, Math.round(progressValue < 1 ? progressValue * 100 : progressValue)));
                });
                if (result.tracks) {
                    // Batch update: merge all result.tracks into the playlist's tracks
                    // Use functional update to avoid stale state bugs when multiple playlists are queued
                    const playlist = task.playlist;
                    if (playlist) {
                        const updatedTracksMap = new Map(result.tracks.map((track)=>[
                                track.id,
                                track
                            ]));
                        actions.setPlaylists((prev)=>{
                            const updated = new Map(prev ?? []);
                            const updatedTracks = playlist.tracks.map((track)=>updatedTracksMap.has(track.id) ? {
                                    ...track,
                                    ...updatedTracksMap.get(track.id)
                                } : track);
                            updated.set(playlistId, {
                                ...playlist,
                                tracks: updatedTracks
                            });
                            return updated;
                        });
                    }
                }
                // Use action creator for complete
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingComplete"])(taskKey));
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
            // Do nothing, user cancelled
            } else {
                // Capture the error to Sentry with context
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$utils$2f$sentry$2d$logger$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sentryLogger"].captureException(err, {
                    tags: {
                        category: "matching",
                        taskType: task.type,
                        targetService: task.targetService
                    },
                    extra: {
                        taskType: task.type,
                        targetService: task.targetService,
                        itemCount: task.type === "playlist" ? task.playlist.tracks.length : task.type === "albums" ? task.albums.length : task.tracks.length
                    }
                });
                const errorMessage = err instanceof Error ? err.message : "Unknown error";
                dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingError"])(errorMessage));
            }
        } finally{
            queueRef.current.shift();
            isProcessingRef.current = false;
            abortControllerRef.current = null;
            // If more tasks, process next
            // Use setTimeout to defer to next event loop tick, ensuring isProcessingRef.current is reset
            if (queueRef.current.length > 0) {
                setTimeout(()=>processQueue(), 0);
            }
        }
    }, [
        actions,
        state.likedSongs,
        state.albums,
        dispatch
    ]);
    // Public API
    const matchLikedSongs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (tracks, targetService)=>{
        if (!tracks.length) return;
        queueRef.current.push({
            type: "likedSongs",
            tracks,
            targetService
        });
        processQueue();
    }, [
        processQueue
    ]);
    const matchAlbums = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (albums, targetService)=>{
        if (!albums.length) return;
        queueRef.current.push({
            type: "albums",
            albums,
            targetService
        });
        processQueue();
    }, [
        processQueue
    ]);
    const matchPlaylistTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (playlist, targetService)=>{
        if (!playlist.tracks.length) return;
        queueRef.current.push({
            type: "playlist",
            playlist,
            targetService
        });
        processQueue();
    }, [
        processQueue
    ]);
    // Type guard for playlist tasks
    function isPlaylistTask(task) {
        return task.type === "playlist";
    }
    // Cancel a specific matching task (does not revert status)
    const cancelMatching = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type, id)=>{
        // Check if the current task matches the cancel request
        const currentTask = state.matching.currentTask;
        const isCurrentTask = currentTask && currentTask.type === type && (type !== "playlist" || id && currentTask.type === "playlist" && currentTask.playlist.id === id);
        if (isCurrentTask) {
            // If cancelling the current task, only abort it.
            // Do NOT filter the queue, let the finally block handle removal.
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        } else {
            // If cancelling a queued (not running) task, filter it out from the queue.
            queueRef.current = queueRef.current.filter((task)=>{
                if (task.type !== type) return true;
                if (type === "playlist" && id && isPlaylistTask(task)) return task.playlist.id !== id;
                // Remove if matches
                return false;
            });
        }
        // Only dispatch matchingCancel for the affected task (once)
        dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$matchingActions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["matchingCancel"])(type, id));
    // Note: processQueue will be called in processQueue's finally block if there are more tasks
    }, [
        dispatch,
        state.matching.currentTask
    ]);
    // Get progress for a given task type/id
    const getProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((type, id)=>{
        const key = type === "playlist" && id ? `playlist:${id}` : type;
        return state.matching.progress[key] ?? 0;
    }, [
        state.matching.progress
    ]);
    return {
        isLoading: state.matching.isLoading,
        error: state.matching.error,
        matchLikedSongs,
        matchAlbums,
        matchPlaylistTracks,
        cancelMatching,
        getProgress,
        currentTask: state.matching.currentTask
    };
};
}),
"[project]/apps/web/src/components/shared/IndeterminateCheckbox.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IndeterminateCheckbox",
    ()=>IndeterminateCheckbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const IndeterminateCheckbox = ({ selectedCount, totalCount, onChange, onClick, disabled = false, className = "", label, testId })=>{
    const checkboxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;
    const isChecked = selectedCount === totalCount && totalCount > 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (checkboxRef.current) {
            checkboxRef.current.indeterminate = isIndeterminate;
        }
    }, [
        isIndeterminate
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: checkboxRef,
                type: "checkbox",
                className: `h-5 w-5 flex-shrink-0 cursor-pointer accent-[#8B7FFF] ${className}`,
                checked: isChecked,
                onChange: onChange,
                onClick: onClick,
                disabled: disabled,
                "aria-label": label,
                "data-testid": testId || `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/IndeterminateCheckbox.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only fixed",
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/IndeterminateCheckbox.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/shared/IndeterminateCheckbox.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/shared/ArtworkImage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ArtworkImage",
    ()=>ArtworkImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/image.js [app-ssr] (ecmascript)");
;
;
const FALLBACK_CONFIGS = {
    liked: {
        bgColor: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-500",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-6 w-6",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fillRule: "evenodd",
                d: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z",
                clipRule: "evenodd"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                lineNumber: 27,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    album: {
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-500",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-6 w-6",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                lineNumber: 40,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    playlist: {
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        iconColor: "text-indigo-500",
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            className: "h-6 w-6",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 4a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 3a1 1 0 100 2h14a1 1 0 100-2H3z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
};
const ArtworkImage = ({ src, alt, size = 48, type = "playlist", className = "", objectFit = "cover", multiSrc })=>{
    const baseClassName = "relative overflow-hidden rounded-md shadow-sm transition-transform duration-200";
    const finalClassName = `${baseClassName} ${className}`;
    // Special grid for albums: up to 4 images
    if (type === "album" && Array.isArray(multiSrc) && multiSrc.length > 1) {
        // Only use up to 4 images
        const images = multiSrc.slice(0, 4);
        // Grid layout: 2x2 for 4, 1x2 for 2, 1x3 for 3
        // Fallback to placeholder for missing images
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: size,
                height: size
            },
            className: `grid ${images.length > 2 ? "grid-cols-2 grid-rows-2" : "grid-cols-2 grid-rows-1"} gap-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 ${finalClassName}`,
            children: Array.from({
                length: images.length < 4 ? images.length : 4
            }).map((_, i)=>images[i] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative h-full w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: images[i],
                        alt: alt + ` ${i + 1}`,
                        fill: true,
                        className: `object-${objectFit} rounded-[2px]`,
                        sizes: `${Math.floor(size / 2)}px`
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                        lineNumber: 82,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                    lineNumber: 81,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-full w-full items-center justify-center rounded-[2px] bg-purple-100 dark:bg-purple-900/30",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-purple-300",
                        children: "?"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                        lineNumber: 95,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0))
                }, i, false, {
                    fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                    lineNumber: 91,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Fallback to single image or icon
    if (!src) {
        const fallback = FALLBACK_CONFIGS[type];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: size,
                height: size
            },
            className: `flex items-center justify-center ${fallback.bgColor} ${finalClassName}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: fallback.iconColor,
                children: fallback.icon
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 107,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: size,
            height: size
        },
        className: finalClassName,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            src: src,
            alt: alt,
            fill: true,
            className: `object-${objectFit}`,
            sizes: `${size}px`
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/ArtworkImage.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/shared/CircularProgress.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CircularProgress",
    ()=>CircularProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
const CircularProgress = ({ progress, size = 24, onComplete })=>{
    const [showSuccess, setShowSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const normalizedProgress = Math.min(Math.max(progress, 0), 100) / 100;
    const offset = circumference - normalizedProgress * circumference;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let successTimer;
        if (progress >= 100) {
            // Show success state immediately when progress is complete
            setShowSuccess(true);
            setIsVisible(true);
            // Keep success state visible for 1 second
            successTimer = setTimeout(()=>{
                if (onComplete) {
                    onComplete();
                }
                setIsVisible(false);
            }, 1000);
        } else {
            setShowSuccess(false);
            setIsVisible(true);
        }
        return ()=>{
            if (successTimer) clearTimeout(successTimer);
        };
    }, [
        progress,
        onComplete
    ]);
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`,
        "data-progress": Math.round(progress),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-full bg-black/30 p-1",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                width: size,
                height: size,
                className: "rotate-[-90deg] transform",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: "text-zinc-600/30",
                        strokeWidth: strokeWidth,
                        stroke: "currentColor",
                        fill: "transparent",
                        r: radius,
                        cx: size / 2,
                        cy: size / 2
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/CircularProgress.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        className: `transition-all duration-300 ease-in-out ${showSuccess ? "text-emerald-500" : "text-white"}`,
                        strokeWidth: strokeWidth,
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        stroke: "currentColor",
                        fill: "transparent",
                        r: radius,
                        cx: size / 2,
                        cy: size / 2
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/CircularProgress.tsx",
                        lineNumber: 65,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/CircularProgress.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/shared/CircularProgress.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/CircularProgress.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/lib/musicApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAlbumsToLibrary",
    ()=>addAlbumsToLibrary,
    "addTracksToLibrary",
    ()=>addTracksToLibrary,
    "createPlaylistWithTracks",
    ()=>createPlaylistWithTracks,
    "fetchPlaylistTracks",
    ()=>fetchPlaylistTracks,
    "fetchUserLibrary",
    ()=>fetchUserLibrary,
    "getLibraryData",
    ()=>getLibraryData,
    "getSourceLibrary",
    ()=>getSourceLibrary,
    "getSourceService",
    ()=>getSourceService,
    "getTargetService",
    ()=>getTargetService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/deezer/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/youtube/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/spotify/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/apple/auth.ts [app-ssr] (ecmascript)");
;
;
;
;
;
async function getCurrentService(role = "source") {
    const service = await getActiveService(role);
    if (!service) {
        throw new Error(`No active ${role} service found`);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["musicServiceFactory"].getProvider(service);
}
async function getActiveService(role) {
    try {
        // Check Apple Music
        const appleAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAppleMusicAuthData"])(role);
        if (appleAuth) return "apple";
        // Check Spotify - needs special handling as it's async
        try {
            const spotifyAuth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$spotify$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSpotifyAuthData"])(role);
            if (spotifyAuth !== null) return "spotify";
        } catch (error) {
            console.error("Error checking Spotify auth:", error);
        }
        // Check YouTube
        try {
            const youtubeAuth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$youtube$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getYouTubeAuthData"])(role);
            if (youtubeAuth !== null) return "youtube";
        } catch (error) {
            console.error("Error checking YouTube auth:", error);
        }
        // Special case for Deezer - only works as source
        if (role === "source" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$deezer$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isDeezerSource"])()) return "deezer";
        throw new Error("No active service found");
    } catch (error) {
        console.error("Error getting active service:", error);
        throw new Error("Error getting active service");
    }
}
async function getSourceService() {
    return await getActiveService("source");
}
async function getTargetService() {
    return await getActiveService("target");
}
async function fetchUserLibrary() {
    const provider = await getCurrentService("source");
    return provider.fetchUserLibrary();
}
async function fetchPlaylistTracks(playlistId, onProgress) {
    const provider = await getCurrentService("source");
    return provider.fetchPlaylistTracks(playlistId, onProgress);
}
async function addTracksToLibrary(tracks) {
    const provider = await getCurrentService("target");
    return provider.addTracksToLibrary(tracks);
}
async function createPlaylistWithTracks(name, tracks, description) {
    const provider = await getCurrentService("target");
    return provider.createPlaylistWithTracks(name, tracks, description);
}
async function addAlbumsToLibrary(albums) {
    const provider = await getCurrentService("target");
    return provider.addAlbumsToLibrary(albums);
}
async function getLibraryData() {
    const provider = await getCurrentService("source");
    return provider.fetchUserLibrary();
}
async function getSourceLibrary() {
    const sourceService = await getActiveService("source");
    if (!sourceService) {
        throw new Error("No source service selected");
    }
    return getLibraryData();
}
}),
"[project]/apps/web/src/hooks/useTransfer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTransfer",
    ()=>useTransfer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useMatching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/musicApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/TransferContext.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
function useTransfer() {
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrary"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMatching"])();
    const [transferResults, setTransferResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showSuccessModal, setShowSuccessModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { updateUsage, checkLimit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransfer"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const sourceService = params.source;
    const targetService = params.target;
    // Helper to count total tracks in a selection
    const countSelectedTracks = (selection)=>{
        let count = 0;
        // Count liked songs
        count += Array.from(selection.likedSongs).filter((track)=>track.status === "matched").length;
        // Count tracks in playlists
        for (const [, selectedTracks] of Array.from(selection.playlists.entries())){
            count += Array.from(selectedTracks).filter((track)=>track.status === "matched").length;
        }
        // Count albums as tracks (this is a simplification)
        // In a full implementation, we would count the actual tracks in each album
        count += selection.albums.size;
        return count;
    };
    const handleStartTransfer = async (selection)=>{
        if (!state || !targetService) {
            console.error("handleStartTransfer - missing required data", {
                state,
                targetService
            });
            setError("Target service not specified");
            return;
        }
        try {
            // Count total tracks that will be transferred
            const totalTracksToTransfer = countSelectedTracks(selection);
            // Check against daily limit without updating usage
            const canProceed = await checkLimit(totalTracksToTransfer);
            if (!canProceed) {
                return;
            }
            console.log("Starting transfer with selection:", selection);
            const results = {
                playlists: new Map()
            };
            // Transfer liked songs
            const matchedLikedSongs = Array.from(selection.likedSongs).filter((track)=>track.status === "matched" && track.targetId).map((track)=>({
                    ...track,
                    targetId: track.targetId
                }));
            if (matchedLikedSongs.length > 0) {
                results.likedSongs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addTracksToLibrary"])(matchedLikedSongs);
            }
            // Transfer matched albums
            const albumsWithIds = Array.from(selection.albums).filter((album)=>album.status === "matched" && album.targetId).map((album)=>({
                    ...album,
                    targetId: album.targetId
                }));
            if (albumsWithIds.length > 0) {
                console.log("Transferring albums with IDs:", albumsWithIds.map((a)=>({
                        name: a.name,
                        targetId: a.targetId
                    })));
                const albumsSet = new Set(albumsWithIds);
                results.albums = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addAlbumsToLibrary"])(albumsSet);
            }
            // Transfer playlists
            for (const [playlistId, selectedTracks] of Array.from(selection.playlists.entries())){
                if (!state.playlists) {
                    throw new Error("Playlists not initialized");
                }
                const playlist = state.playlists.get(playlistId);
                if (!playlist) {
                    throw new Error(`Playlist not found: ${playlistId}`);
                }
                console.log("Transferring playlist:", playlist);
                const matchedTracks = Array.from(selectedTracks).filter((track)=>track.status === "matched" && track.targetId).map((track)=>({
                        ...track,
                        targetId: track.targetId
                    }));
                if (matchedTracks.length > 0) {
                    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPlaylistWithTracks"])(playlist.name, matchedTracks, `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`);
                    results.playlists.set(playlistId, result);
                }
            }
            // Update usage count in Redis after successful transfer
            await updateUsage(totalTracksToTransfer);
            console.log("Transfer completed successfully:", results);
            setTransferResults(results);
            setShowSuccessModal(true);
            console.log("Success modal should show now:", {
                showModal: true
            });
        } catch (err) {
            console.error("handleStartTransfer - error:", err);
            setError("Failed to transfer tracks. Please try again.");
        }
    };
    const handleTransferPlaylist = async (playlist, selection)=>{
        if (!state || !targetService) {
            console.error("handleTransferPlaylist - missing required data", {
                state,
                targetService
            });
            setError("Target service not specified");
            return;
        }
        try {
            const selectedTracks = selection.playlists.get(playlist.id);
            if (!selectedTracks || selectedTracks.size === 0) {
                setError("No tracks selected for transfer");
                return;
            }
            const matchedTracks = Array.from(selectedTracks).filter((track)=>track.status === "matched" && track.targetId).map((track)=>({
                    ...track,
                    targetId: track.targetId
                }));
            if (matchedTracks.length === 0) {
                setError("No matched tracks found for transfer");
                return;
            }
            // Check against daily limit without updating usage
            const canProceed = await checkLimit(matchedTracks.length);
            if (!canProceed) {
                return;
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPlaylistWithTracks"])(playlist.name, matchedTracks, `Imported from ${sourceService} on ${new Date().toLocaleDateString()}`);
            // Update usage count in Redis after successful transfer
            await updateUsage(matchedTracks.length);
            const results = {
                playlists: new Map([
                    [
                        playlist.id,
                        result
                    ]
                ])
            };
            setTransferResults(results);
            setShowSuccessModal(true);
        } catch (err) {
            console.error("handleTransferPlaylist - error:", err);
            setError("Failed to transfer playlist. Please try again.");
        }
    };
    return {
        handleStartTransfer,
        handleTransferPlaylist,
        transferResults,
        showSuccessModal,
        setShowSuccessModal,
        error
    };
}
}),
"[project]/apps/web/src/components/shared/TransferSuccessModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferSuccessModal",
    ()=>TransferSuccessModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/Dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/config/services.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/ArtworkImage.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
const TransferSuccessModal = ({ isOpen, onClose, targetServiceId, results, selectedData })=>{
    // Log when the modal is rendered
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        console.log("TransferSuccessModal rendered:", {
            isOpen,
            targetServiceId,
            hasResults: !!results,
            resultsPlaylists: results?.playlists?.size || 0,
            likedSongsResult: !!results?.likedSongs,
            albumsResult: !!results?.albums,
            hasSelectedData: {
                likedSongs: selectedData?.likedSongs?.length || 0,
                albums: selectedData?.albums?.length || 0,
                playlists: selectedData?.playlists?.size || 0
            }
        });
        return ()=>{
            console.log("TransferSuccessModal unmounting");
        };
    }, [
        isOpen,
        targetServiceId,
        results,
        selectedData
    ]);
    const targetService = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$config$2f$services$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getServiceById"])(targetServiceId);
    if (!targetService) {
        console.log("Target service not found:", targetServiceId);
        return null;
    }
    const hasLikedSongs = results.likedSongs && results.likedSongs.playlistId;
    const hasAlbums = results.albums && results.albums.playlistId;
    const successfulPlaylists = Array.from(results.playlists.entries()).filter(([_, result])=>result.playlistId);
    const totalTransferred = (results.likedSongs?.added || 0) + (results.albums?.added || 0) + Array.from(results.playlists.values()).reduce((sum, result)=>sum + result.added, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$dom$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$Dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        isOpen: isOpen,
        onClose: onClose,
        title: "Transfer Complete!",
        closeOnBackdropClick: false,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 p-6 text-indigo-600 dark:from-indigo-400/10 dark:to-indigo-500/5 dark:text-indigo-400",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "h-8 w-8",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                xmlns: "http://www.w3.org/2000/svg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                    lineNumber: 88,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-medium",
                                        children: [
                                            "Enjoy your ",
                                            totalTransferred,
                                            " tracks on"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(targetService.image, {
                                                className: "h-8 w-8",
                                                size: 28
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xl font-medium",
                                                style: {
                                                    color: targetService.color
                                                },
                                                children: targetService.name
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 99,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                        lineNumber: 97,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-zinc-800 dark:text-stone-200",
                            children: "Your transferred music is ready!"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-3",
                            children: [
                                hasLikedSongs && selectedData.likedSongs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: targetService.getPlaylistUrl(results.likedSongs.playlistId),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArtworkImage"], {
                                                    src: selectedData.likedSongs[0]?.artwork,
                                                    alt: "Liked Songs",
                                                    type: "liked"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-gray-900 dark:text-white",
                                                            children: "Liked Songs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500 dark:text-gray-400",
                                                            children: [
                                                                results.likedSongs?.added,
                                                                " songs transferred"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M9 5l7 7-7 7"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                    lineNumber: 113,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                hasAlbums && selectedData.albums.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: targetService.getPlaylistUrl(results.albums.playlistId),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    className: "group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArtworkImage"], {
                                                    src: selectedData.albums[0]?.artwork,
                                                    alt: "Albums",
                                                    type: "album"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-gray-900 dark:text-white",
                                                            children: "Albums"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-sm text-gray-500 dark:text-gray-400",
                                                            children: [
                                                                results.albums?.added,
                                                                " albums transferred"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                            lineNumber: 155,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M9 5l7 7-7 7"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 170,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                    lineNumber: 149,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                successfulPlaylists.map(([playlistId, result])=>{
                                    const playlist = selectedData.playlists.get(playlistId);
                                    if (!playlist || !result.playlistId) return null;
                                    const tracks = playlist.tracks || [];
                                    const firstTrack = tracks[0];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: targetService.getPlaylistUrl(result.playlistId),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArtworkImage"], {
                                                        src: firstTrack?.artwork,
                                                        alt: playlist.name || "Playlist",
                                                        type: "playlist"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-medium text-gray-900 dark:text-white",
                                                            children: playlist.name || "Playlist"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                        lineNumber: 201,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 195,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M9 5l7 7-7 7"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                                lineNumber: 210,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, playlistId, true, {
                                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                                        lineNumber: 188,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                    lineNumber: 107,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "rounded-lg bg-indigo-600 px-6 py-2.5 text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md dark:bg-indigo-500 dark:hover:bg-indigo-600",
                        children: "Close"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                        lineNumber: 230,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/shared/TransferSuccessModal.tsx",
        lineNumber: 72,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
}),
"[project]/apps/web/src/components/shared/TransferButton.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferButton",
    ()=>TransferButton,
    "fetchingPlaylists",
    ()=>fetchingPlaylists
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useMatching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTransfer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useTransfer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/TransferContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferSuccessModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/TransferSuccessModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
const fetchingPlaylists = new Set();
function TransferButton() {
    const { state } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrary"])();
    const { isLoading: isMatching } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMatching"])();
    const { userStatus: status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$TransferContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransfer"])();
    const { handleStartTransfer, transferResults, showSuccessModal, setShowSuccessModal, error: transferError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useTransfer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransfer"])();
    const [isTransferring, setIsTransferring] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Dynamically check if any selected playlist is currently being fetched (no memo, always up-to-date)
    const isFetchingPlaylists = Array.from(state.selectedItems.playlists).some((playlistId)=>fetchingPlaylists.has(playlistId));
    // Get target service from URL parameters
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const targetServiceId = params.target;
    // Check if any items are selected
    const hasSelections = state.selectedItems.tracks.size > 0 || state.selectedItems.albums.size > 0 || state.selectedItems.playlists.size > 0;
    // Button is busy if any async operation is in progress
    const isBusy = isTransferring || isMatching || isFetchingPlaylists;
    // Disable if busy, completed, or nothing selected
    const isDisabled = isBusy || !hasSelections;
    // Determine button text based on state
    const buttonText = isMatching || isFetchingPlaylists ? "Finding Matches..." : isTransferring ? "Transferring..." : "Start Transfer";
    // Format summary text of selected items
    const getSummaryText = ()=>{
        const parts = [];
        if (state.selectedItems.tracks.size > 0) {
            parts.push(`${state.selectedItems.tracks.size} liked tracks`);
        }
        if (state.selectedItems.albums.size > 0) {
            parts.push(`${state.selectedItems.albums.size} albums`);
        }
        if (state.selectedItems.playlists.size > 0) {
            parts.push(`${state.selectedItems.playlists.size} playlists`);
        }
        return parts.join(", ");
    };
    // Prepare selected data for the success modal
    const getSelectedData = ()=>{
        const selectedLikedSongs = state.likedSongs ? Array.from(state.likedSongs).filter((track)=>state.selectedItems.tracks.has(track.id)) : [];
        const selectedAlbums = state.albums ? Array.from(state.albums).filter((album)=>state.selectedItems.albums.has(album.id)) : [];
        const selectedPlaylists = new Map();
        if (state.playlists) {
            for (const playlistId of state.selectedItems.playlists){
                const playlist = state.playlists.get(playlistId);
                if (playlist) {
                    selectedPlaylists.set(playlistId, playlist);
                }
            }
        }
        return {
            likedSongs: selectedLikedSongs,
            albums: selectedAlbums,
            playlists: selectedPlaylists
        };
    };
    // Handle button click
    const handleClick = async ()=>{
        if (!hasSelections) return;
        setIsTransferring(true);
        try {
            // Create selection state from the selected items
            const selection = {
                likedSongs: new Set(state.likedSongs ? Array.from(state.likedSongs).filter((track)=>state.selectedItems.tracks.has(track.id)) : []),
                albums: new Set(state.albums ? Array.from(state.albums).filter((album)=>state.selectedItems.albums.has(album.id)) : []),
                playlists: new Map()
            };
            // Add selected playlists to the selection
            if (state.playlists) {
                for (const playlistId of state.selectedItems.playlists){
                    const playlist = state.playlists.get(playlistId);
                    if (playlist) {
                        selection.playlists.set(playlistId, new Set(playlist.tracks));
                    }
                }
            }
            await handleStartTransfer(selection);
        } finally{
            setIsTransferring(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    status && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-gray-600 dark:text-gray-400",
                        children: [
                            status.availableToday,
                            " transfers left"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `relative flex w-[240px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-200 ${!isDisabled ? "transform cursor-pointer bg-gradient-to-r from-indigo-600 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-200/50 active:scale-[0.98] dark:hover:shadow-indigo-900/30" : "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"}`,
                        onClick: handleClick,
                        disabled: isDisabled,
                        "aria-label": `${buttonText}${hasSelections ? ` - ${getSummaryText()}` : ""}`,
                        role: "transfer-button",
                        tabIndex: !isDisabled ? 0 : -1,
                        children: [
                            (isMatching || isTransferring || isFetchingPlaylists) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 animate-[shimmer_2s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative z-10 flex flex-col items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex items-center justify-center gap-2",
                                    children: isMatching || isTransferring || isFetchingPlaylists ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                                                lineNumber: 163,
                                                columnNumber: 19
                                            }, this),
                                            buttonText
                                        ]
                                    }, void 0, true) : buttonText
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                                    lineNumber: 160,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                                lineNumber: 159,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, this),
            showSuccessModal && transferResults && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferSuccessModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransferSuccessModal"], {
                isOpen: true,
                onClose: ()=>setShowSuccessModal(false),
                targetServiceId: targetServiceId,
                results: transferResults,
                selectedData: getSelectedData()
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                lineNumber: 175,
                columnNumber: 9
            }, this),
            transferError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-24 left-0 right-0 mx-auto w-full max-w-md rounded-lg bg-red-50 p-4 text-red-800 shadow-lg dark:bg-red-900/30 dark:text-red-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: transferError
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                    lineNumber: 186,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/shared/TransferButton.tsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/apps/web/src/components/icons/LikedSongsIcon.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LikedSongsIcon",
    ()=>LikedSongsIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const LikedSongsIcon = ({ className = "", ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        "aria-hidden": "true",
        className: className,
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            fillRule: "evenodd",
            d: "M12.001 4.529c2.349-2.532 6.15-2.532 8.498 0 2.349 2.532 2.349 6.64 0 9.172l-7.071 7.627a1.25 1.25 0 01-1.854 0l-7.071-7.627c-2.349-2.532-2.349-6.64 0-9.172 2.348-2.532 6.149-2.532 8.498 0z",
            clipRule: "evenodd"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/components/icons/LikedSongsIcon.tsx",
            lineNumber: 16,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/icons/LikedSongsIcon.tsx",
        lineNumber: 8,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
}),
"[project]/apps/web/src/components/layout/Sidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibrarySidebar",
    ()=>LibrarySidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useMatching.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$IndeterminateCheckbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/IndeterminateCheckbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/ArtworkImage.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$CircularProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/CircularProgress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/musicApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/TransferButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$LikedSongsIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/LikedSongsIcon.tsx [app-ssr] (ecmascript)");
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
const LibrarySidebar = ()=>{
    const { state, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrary"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const source = params.source;
    const target = params.target;
    const { matchLikedSongs, matchAlbums, matchPlaylistTracks, cancelMatching } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useMatching$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMatching"])();
    const { selectedItems, selectAllTracks, deselectAllTracks, selectAllAlbums, deselectAllAlbums, selectPlaylist, deselectPlaylist } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrarySelection"])();
    // Tracking map to handle async operations - this is no longer needed as a ref
    // since we're using the shared fetchingPlaylists Set
    const fetchingPlaylistsRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(new Set());
    if (!state.likedSongs || !state.albums || !state.playlists) return null;
    // Calculate selection states
    const likedSongsCount = state.likedSongs.size;
    const selectedLikedSongsCount = selectedItems.tracks.size;
    // Count unmatched liked songs
    const unmatchedLikedSongsCount = Array.from(state.likedSongs).reduce((count, track)=>{
        return track.status === "unmatched" ? count + 1 : count;
    }, 0);
    const albumsCount = state.albums.size;
    const selectedAlbumsCount = Array.from(state.albums).filter((album)=>selectedItems.albums.has(album.id)).length;
    // Count unmatched albums
    const unmatchedAlbumsCount = Array.from(state.albums).reduce((count, album)=>{
        return album.status === "unmatched" ? count + 1 : count;
    }, 0);
    // Handle selection toggles with matching
    const handleLikedSongsToggle = ()=>{
        if (selectedLikedSongsCount === likedSongsCount) {
            deselectAllTracks();
            cancelMatching("likedSongs");
        } else {
            selectAllTracks();
            matchLikedSongs(Array.from(state.likedSongs ?? []), target);
        }
    };
    const handleAlbumsToggle = ()=>{
        if (selectedAlbumsCount === albumsCount) {
            deselectAllAlbums();
            cancelMatching("albums");
        } else {
            selectAllAlbums();
            matchAlbums(Array.from(state.albums ?? []), target);
        }
    };
    // complex but this allows us to have a very responsive UI
    // and cancel matching quickly if the playlist is deselected
    const handlePlaylistToggle = async (playlist)=>{
        const playlistId = playlist.id;
        if (selectedItems.playlists.has(playlistId)) {
            // If deselecting, remove from selection and cancel matching
            deselectPlaylist(playlistId);
            cancelMatching("playlist", playlistId);
            // Mark as no longer being processed
            fetchingPlaylistsRef.current.delete(playlistId);
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].delete(playlistId);
        } else {
            // Optimistically update UI by selecting the playlist immediately
            selectPlaylist(playlistId);
            // Add to our tracking set
            fetchingPlaylistsRef.current.add(playlistId);
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].add(playlistId);
            // Only fetch tracks if they don't exist
            // TODO: Keep an eye on this as we could have playlists not fully fetched
            if (!playlist.tracks || playlist.tracks.length === 0) {
                try {
                    // Fetch tracks in the background
                    const tracks = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPlaylistTracks"])(playlistId);
                    // After fetch completes, check if playlist is still being processed
                    if (tracks && fetchingPlaylistsRef.current.has(playlistId)) {
                        // Update the playlist in the library context
                        const updatedPlaylist = {
                            ...playlist,
                            tracks
                        };
                        // Use updatePlaylist to only update the relevant playlist in the Map
                        // This avoids accidentally overwriting the entire playlists Map
                        actions.updatePlaylist(updatedPlaylist);
                        // Check if it's still selected in the UI before matching
                        if (fetchingPlaylistsRef.current.has(playlistId)) {
                            matchPlaylistTracks(updatedPlaylist, target);
                        }
                        // Remove from tracking set
                        fetchingPlaylistsRef.current.delete(playlistId);
                        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].delete(playlistId);
                    }
                } catch (error) {
                    console.error("Error fetching playlist tracks:", error);
                    // Clean up tracking on error
                    fetchingPlaylistsRef.current.delete(playlistId);
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].delete(playlistId);
                }
            } else {
                // Always retrieve the latest playlist object from state before matching
                // This ensures we use the freshest tracks array and avoid stale data
                const latestPlaylist = state.playlists?.get(playlistId) || playlist;
                matchPlaylistTracks(latestPlaylist, target);
                // Remove from tracking set
                fetchingPlaylistsRef.current.delete(playlistId);
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].delete(playlistId);
            }
        }
    };
    // Navigation handlers
    const handleLikedSongsClick = ()=>{
        router.push(`/library/${source}/${target}/liked`);
    };
    const handleAlbumsClick = ()=>{
        router.push(`/library/${source}/${target}/albums`);
    };
    const handlePlaylistClick = (playlistId)=>{
        router.push(`/library/${source}/${target}/playlist/${playlistId}`);
    };
    // Use global matching state from context
    const isMatching = state.matching.isLoading;
    const currentTask = state.matching.currentTask;
    const getProgress = (type, id)=>{
        const key = type === "playlist" && id ? `playlist:${id}` : type;
        return state.matching.progress[key] ?? 0;
    };
    // Helper function to check if a service is YouTube Music
    // MusicService type: 'spotify' | 'apple' | 'youtube' | 'deezer' (see src/types/services.ts)
    const isYouTubeService = (service)=>{
        return service === "youtube";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-w-0 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 mt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "mb-1 text-xl font-bold text-zinc-800 dark:text-white",
                        children: "Your library"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-zinc-600 dark:text-zinc-400",
                        children: "Select items to transfer"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                // Add margin-bottom to separate from next item, and reduce vertical padding
                className: `group mb-1 flex cursor-pointer items-center gap-4 rounded-lg px-2.5 py-2 transition-all duration-200
            ${selectedLikedSongsCount === likedSongsCount && likedSongsCount > 0 ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60" : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"}`,
                onClick: handleLikedSongsClick,
                role: "button",
                "aria-label": "View Liked Songs",
                "data-testid": "liked-songs-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        className: "pl-2 lg:pl-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$IndeterminateCheckbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndeterminateCheckbox"], {
                            selectedCount: selectedLikedSongsCount,
                            totalCount: likedSongsCount,
                            onChange: handleLikedSongsToggle,
                            className: "",
                            label: "Liked Songs",
                            testId: "liked-songs-checkbox"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$LikedSongsIcon$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LikedSongsIcon"], {
                                className: "h-5 w-5 text-white"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 202,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            currentTask && currentTask.type === "likedSongs" && isMatching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$CircularProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircularProgress"], {
                                progress: getProgress("likedSongs"),
                                "data-testid": "liked-songs-progress"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${currentTask && currentTask.type === "likedSongs" && isMatching ? "animate-pulse" : ""}`,
                                children: "Liked Songs"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 212,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-sm text-zinc-600 dark:text-zinc-400",
                                children: [
                                    likedSongsCount,
                                    " songs",
                                    unmatchedLikedSongsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1 text-red-500 dark:text-red-400",
                                        children: [
                                            "• ",
                                            unmatchedLikedSongsCount,
                                            " unmatched"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                        lineNumber: 223,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            !isYouTubeService(source) && !isYouTubeService(target) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                // Add margin-bottom to separate from next item, and reduce vertical padding
                className: `group mb-1 flex cursor-pointer items-center gap-4 rounded-lg px-2.5 py-2 transition-all duration-200
                ${selectedAlbumsCount === albumsCount && albumsCount > 0 ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60" : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"}`,
                onClick: handleAlbumsClick,
                role: "button",
                "aria-label": "View Albums",
                "data-testid": "albums-section",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: (e)=>e.stopPropagation(),
                        className: "pl-2 lg:pl-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$IndeterminateCheckbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndeterminateCheckbox"], {
                            selectedCount: selectedAlbumsCount,
                            totalCount: albumsCount,
                            onChange: handleAlbumsToggle,
                            className: "",
                            label: "Albums",
                            testId: "albums-checkbox"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative overflow-hidden rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArtworkImage"], {
                                src: Array.from(state.albums ?? [])[0]?.artwork,
                                multiSrc: Array.from(state.albums ?? []).slice(0, 4).map((a)=>a.artwork).filter((a)=>Boolean(a)),
                                alt: "Albums artwork",
                                type: "album",
                                className: "rounded-lg"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            currentTask && currentTask.type === "albums" && isMatching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$CircularProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircularProgress"], {
                                progress: getProgress("albums"),
                                "data-testid": "albums-progress"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 270,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-200 ${currentTask && currentTask.type === "albums" && isMatching ? "animate-pulse" : ""}`,
                                children: "Albums"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "truncate text-sm text-zinc-600 dark:text-zinc-400",
                                children: [
                                    albumsCount,
                                    " albums",
                                    unmatchedAlbumsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1 text-red-500 dark:text-red-400",
                                        children: [
                                            "• ",
                                            unmatchedAlbumsCount,
                                            " unmatched"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                        lineNumber: 285,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 281,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                        lineNumber: 273,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            Array.from(state.playlists?.values() ?? []).map((playlist, idx, arr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    // Add margin-bottom to separate from next item, except last; reduce vertical padding
                    className: `group flex cursor-pointer items-center gap-4 rounded-lg ${idx !== arr.length - 1 ? "mb-1" : ""} px-2.5 py-2 transition-all duration-200
                ${selectedItems.playlists.has(playlist.id) ? "bg-indigo-100/60 group-hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-800/60" : "hover:bg-indigo-100/50 dark:hover:bg-indigo-950/20"}`,
                    onClick: ()=>handlePlaylistClick(playlist.id),
                    "data-testid": `playlist-item-${playlist.id}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: (e)=>e.stopPropagation(),
                            className: "pl-2 lg:pl-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$IndeterminateCheckbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["IndeterminateCheckbox"], {
                                selectedCount: selectedItems.playlists.has(playlist.id) ? 1 : 0,
                                totalCount: 1,
                                onChange: ()=>handlePlaylistToggle(playlist),
                                label: playlist.name,
                                testId: `playlist-checkbox-${playlist.id}`
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                            lineNumber: 308,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative overflow-hidden rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$ArtworkImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ArtworkImage"], {
                                    src: playlist.artwork,
                                    alt: playlist.name,
                                    type: "playlist",
                                    className: `rounded-lg ${__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].has(playlist.id) ? "animate-pulse" : ""}`
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                    lineNumber: 318,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                currentTask && currentTask.type === "playlist" && currentTask.playlist.id === playlist.id && isMatching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$CircularProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CircularProgress"], {
                                    progress: getProgress("playlist", playlist.id),
                                    "data-testid": `playlist-progress-${playlist.id}`
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                    lineNumber: 329,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                            lineNumber: 317,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "min-w-0 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `truncate font-normal text-zinc-600 group-hover:text-zinc-950 dark:text-zinc-300 dark:group-hover:text-zinc-100 ${currentTask && currentTask.type === "playlist" && currentTask.playlist.id === playlist.id && isMatching || __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$TransferButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchingPlaylists"].has(playlist.id) ? "animate-pulse" : ""}`,
                                    "data-testid": `playlist-name-${playlist.id}`,
                                    title: playlist.name,
                                    children: playlist.name
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                    lineNumber: 336,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "truncate text-sm text-zinc-600 dark:text-zinc-400",
                                    "data-testid": `playlist-track-count-${playlist.id}`,
                                    children: [
                                        playlist.tracks?.length || playlist.trackCount,
                                        " tracks",
                                        playlist.tracks && playlist.tracks.length > 0 && (()=>{
                                            // Count unmatched tracks for this playlist
                                            const unmatchedCount = playlist.tracks.reduce((count, track)=>track.status === "unmatched" ? count + 1 : count, 0);
                                            return unmatchedCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 text-red-500 dark:text-red-400",
                                                children: [
                                                    "• ",
                                                    unmatchedCount,
                                                    " unmatched"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                                lineNumber: 366,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)) : null;
                                        })()
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                                    lineNumber: 351,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                            lineNumber: 335,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, playlist.id, true, {
                    fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
                    lineNumber: 296,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/layout/Sidebar.tsx",
        lineNumber: 171,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/apps/web/src/components/shared/LoadingOverlay.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LoadingOverlay",
    ()=>LoadingOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$NonnaLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/icons/NonnaLogo.tsx [app-ssr] (ecmascript)");
;
;
const LoadingOverlay = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "backdrop-blur-xs fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex h-52 w-52 items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$icons$2f$NonnaLogo$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NonnaLogo"], {
                        className: "text-white",
                        size: 200
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                        lineNumber: 12,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-[26.5%] top-[50.5%] z-10 -translate-x-1/2 -translate-y-1/2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-b-indigo-100/10 border-l-indigo-100/70 border-r-indigo-100/40"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                            lineNumber: 21,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                        lineNumber: 20,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                lineNumber: 10,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-16 mt-2 text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "animate-pulse text-xl font-normal text-white",
                        children: "Loading your library"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                        lineNumber: 26,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 text-sm text-indigo-200",
                        children: "Just a moment while we get everything ready"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                        lineNumber: 27,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
                lineNumber: 25,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/shared/LoadingOverlay.tsx",
        lineNumber: 4,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
}),
"[project]/apps/web/src/lib/server/library.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchInitialLibraryData",
    ()=>fetchInitialLibraryData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/musicApi.ts [app-ssr] (ecmascript)");
;
async function fetchInitialLibraryData(sourceService) {
    try {
        if (!sourceService) {
            return {
                initialData: null,
                error: new Error("Source service not specified")
            };
        }
        const initialData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$musicApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchUserLibrary"])();
        return {
            initialData,
            error: null
        };
    } catch (error) {
        return {
            initialData: null,
            error: error instanceof Error ? error : new Error("Failed to load initial library data")
        };
    }
}
}),
"[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LibraryClientContent",
    ()=>LibraryClientContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/layout/Sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/contexts/LibraryContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$LoadingOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/shared/LoadingOverlay.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/services/apple/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$server$2f$library$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/server/library.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.5.0_@babel+core@7.28.3_@opentelemetry+api@1.9.0_@playwright+test@1.55.0_react-d_97e969c4b1a46df1a391ef3aba8543fe/node_modules/next/navigation.js [app-ssr] (ecmascript)");
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
function LibraryContent({ source, _target, children }) {
    const { state, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$LibraryContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLibrary"])();
    const { setShowTitle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$contexts$2f$ItemTitleContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useItemTitle"])();
    const [isContentVisible, setIsContentVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [mainEl, setMainEl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const mainRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((node)=>{
        setMainEl(node);
    }, []);
    // Show content when route changes (i.e., when an item is selected)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const isHome = pathname.endsWith(`${source}/${_target}`);
        setIsContentVisible(!isHome);
    }, [
        pathname,
        source,
        _target
    ]);
    // Effect to observe the h1 within the main content area
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isContentVisible || !setShowTitle) {
            setShowTitle(false);
            return;
        }
        if (!mainEl) {
            // Wait for main element to be set
            return;
        }
        const scrollContainer = mainEl;
        let intersectionObserver = null;
        let mutationObserver = null;
        function attachIntersectionObserver() {
            const h1Element = scrollContainer.querySelector("h1");
            if (!h1Element) return false;
            intersectionObserver = new IntersectionObserver(([entry])=>{
                setShowTitle(!entry.isIntersecting);
            }, {
                root: scrollContainer,
                rootMargin: "0px",
                threshold: 0.1
            });
            intersectionObserver.observe(h1Element);
            return true;
        }
        // Try to attach immediately
        if (!attachIntersectionObserver()) {
            // If h1 is not present, observe for DOM changes
            mutationObserver = new MutationObserver(()=>{
                if (attachIntersectionObserver()) {
                    // Once attached, disconnect mutation observer
                    if (mutationObserver) mutationObserver.disconnect();
                }
            });
            mutationObserver.observe(scrollContainer, {
                childList: true,
                subtree: true
            });
        }
        return ()=>{
            if (intersectionObserver) intersectionObserver.disconnect();
            if (mutationObserver) mutationObserver.disconnect();
        };
    }, [
        isContentVisible,
        setShowTitle,
        mainEl
    ]);
    // Initialize library
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let mounted = true;
        async function initLibrary() {
            if (!source) return; // Don't initialize if source is not set
            try {
                actions.setLoading(true);
                // Apple Musickit requires browser-side initialization
                if (source === "apple") {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$services$2f$apple$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authorizeAppleMusic"])("source");
                }
                const { initialData, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$server$2f$library$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchInitialLibraryData"])(source);
                // Check if component is still mounted before updating state
                if (!mounted) return;
                if (error) {
                    console.error("Error initializing library:", error);
                    actions.setError(error.toString());
                } else if (initialData) {
                    actions.updateLibrary({
                        likedSongs: new Set(initialData.likedSongs),
                        albums: new Set(initialData.albums),
                        playlists: new Map(initialData.playlists.map((p)=>[
                                p.id,
                                p
                            ]))
                    });
                }
            } catch (err) {
                if (!mounted) return;
                console.error("Failed to initialize library:", err);
                actions.setError(err instanceof Error ? err.message : "Failed to initialize library");
            } finally{
                if (mounted) {
                    actions.setLoading(false);
                }
            }
        }
        const isLibraryEmpty = !state?.likedSongs?.size && !state?.albums?.size && !state?.playlists?.size;
        if (isLibraryEmpty && source) {
            initLibrary();
        }
        // Cleanup function to prevent state updates after unmount
        return ()=>{
            mounted = false;
        };
    }, [
        source,
        state?.likedSongs,
        state?.albums,
        state?.playlists,
        actions
    ]);
    if (state?.status?.isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$LoadingOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingOverlay"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
            lineNumber: 144,
            columnNumber: 7
        }, this);
    }
    if (state?.status?.error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: [
                "Error: ",
                state.status.error
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
            lineNumber: 151,
            columnNumber: 12
        }, this);
    }
    const isLibraryEmpty = !state?.likedSongs?.size && !state?.albums?.size && !state?.playlists?.size;
    if (isLibraryEmpty) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$shared$2f$LoadingOverlay$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoadingOverlay"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
                lineNumber: 160,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
            lineNumber: 159,
            columnNumber: 7
        }, this);
    }
    return(// Main grid layout for sidebar and content area.
    // Takes full height of its parent grid row.
    // lg:grid-cols defines the two-column layout for desktop.
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto grid h-full lg:grid-cols-[25rem_1fr]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                role: "sidebar",
                "aria-label": "Library Selection",
                className: `overflow-y-auto transition-transform duration-200 lg:h-full lg:translate-x-0 lg:border-r lg:border-indigo-100/10 lg:dark:bg-transparent ${isContentVisible ? "fixed inset-0 z-50 -translate-x-full lg:static lg:z-auto lg:translate-x-0" : "relative z-40"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LibrarySidebar"], {}, void 0, false, {
                    fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                ref: mainRef,
                role: "main",
                "aria-label": "Selected Content",
                className: `z-40 h-full overflow-y-auto p-8 transition-transform duration-200 lg:translate-x-0 ${isContentVisible ? "translate-x-0" : "hidden lg:relative lg:block"}`,
                children: children
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
        lineNumber: 169,
        columnNumber: 5
    }, this));
}
function LibraryClientContent(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$5$2e$0_$40$babel$2b$core$40$7$2e$28$2e$3_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_$40$playwright$2b$test$40$1$2e$55$2e$0_react$2d$d_97e969c4b1a46df1a391ef3aba8543fe$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LibraryContent, {
        ...props
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/library/[source]/[target]/_components/LibraryClientContent.tsx",
        lineNumber: 200,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f055fa11._.js.map