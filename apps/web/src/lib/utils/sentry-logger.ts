import * as Sentry from "@sentry/nextjs";

// Check if Sentry is properly configured
const isSentryConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SENTRY_DSN;
};

/**
 * Centralized Sentry logging utility with fallback to console
 * Provides consistent error capture throughout the application
 */
export const sentryLogger = {
  /**
   * Log warning messages to Sentry and console
   */
  warn: (message: string, extra?: Record<string, unknown>) => {
    if (isSentryConfigured()) {
      Sentry.addBreadcrumb({
        message,
        level: "warning",
        data: extra,
      });
    }

    // Always log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Sentry][warn]", message, extra);
    }
  },

  /**
   * Log error messages to Sentry and console
   */
  error: (error: Error | string, extra?: Record<string, unknown>) => {
    if (isSentryConfigured()) {
      if (error instanceof Error) {
        Sentry.captureException(error, { extra });
      } else {
        Sentry.captureMessage(error, "error");
        Sentry.addBreadcrumb({
          message: error,
          level: "error",
          data: extra,
        });
      }
    }

    // Always log to console in development or if Sentry fails
    if (process.env.NODE_ENV !== "production") {
      console.error("[Sentry][error]", error, extra);
    }
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
    if (isSentryConfigured()) {
      try {
        Sentry.captureException(error, {
          tags: {
            category: "matching",
            operation,
            targetService,
          },
          extra: {
            operation,
            targetService,
            ...extra,
          },
          level: "error",
        });
      } catch (sentryError) {
        // If Sentry fails, at least log to console
        console.error("[Sentry Error - fallback to console]", {
          originalError: error,
          sentryError,
          operation,
          targetService,
          extra,
        });
      }
    } else {
      // Log to console when Sentry is not configured
      console.error(`[${operation}] Error in ${targetService}:`, error, extra);
    }
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
    if (isSentryConfigured()) {
      try {
        Sentry.captureException(error, {
          tags: context?.tags,
          extra: context?.extra,
          level: context?.level || "error",
        });
      } catch (sentryError) {
        console.error("[Sentry Error - fallback to console]", {
          originalError: error,
          sentryError,
          context,
        });
      }
    } else {
      console.error("[Exception]", error, context);
    }
  },

  /**
   * Add breadcrumb for debugging context
   */
  addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
    if (isSentryConfigured()) {
      Sentry.addBreadcrumb({
        message,
        data,
        level: "info",
        timestamp: Date.now() / 1000,
      });
    }
  },
};
