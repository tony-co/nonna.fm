/**
 * Console-based logging utility (formerly Sentry logger)
 * Provides consistent error logging throughout the application
 */
export const sentryLogger = {
  /**
   * Log warning messages to console
   */
  warn: (message: string, extra?: Record<string, unknown>) => {
    console.warn("[WARN]", message, extra);
  },

  /**
   * Log error messages to console
   */
  error: (error: Error | string, extra?: Record<string, unknown>) => {
    console.error("[ERROR]", error, extra);
  },

  /**
   * Capture matching errors with proper context and tags
   */
  captureMatchingError: (
    operation: "track_search" | "album_search",
    targetService: string,
    error: unknown,
    extra?: Record<string, unknown>
  ) => {
    console.error(`[MATCHING_ERROR][${operation}] Error in ${targetService}:`, error, extra);
  },

  /**
   * Capture general exceptions with context
   */
  captureException: (
    error: Error | unknown,
    context?: {
      tags?: Record<string, string>;
      extra?: Record<string, unknown>;
      level?: "fatal" | "error" | "warning" | "info" | "debug";
    }
  ) => {
    const level = context?.level || "error";
    console.error(`[EXCEPTION][${level.toUpperCase()}]`, error, context);
  },

  /**
   * Add breadcrumb for debugging context (now just logs to console)
   */
  addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
    console.log("[BREADCRUMB]", message, data);
  },
};