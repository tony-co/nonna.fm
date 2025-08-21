// PostHog-based logging utility (formerly Sentry logger)
// Provides consistent event tracking and error capture throughout the application

import posthog from "posthog-js";

// Check if PostHog is properly configured and available
const isPostHogConfigured = (): boolean => {
  return (
    typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    !!process.env.NEXT_PUBLIC_POSTHOG_HOST
  );
};

/**
 * PostHog logging utility with fallback to console
 * Provides consistent event tracking and error capture throughout the application
 */
export const logger = {
  /**
   * Log warning messages to PostHog and console
   */
  warn: (message: string, extra?: Record<string, unknown>) => {
    if (isPostHogConfigured()) {
      posthog.capture("warning", {
        message,
        level: "warning",
        ...extra,
      });
    }

    // Always log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.warn("[PostHog][warn]", message, extra);
    }
  },

  /**
   * Log error messages to PostHog and console
   */
  error: (error: Error | string, extra?: Record<string, unknown>) => {
    if (isPostHogConfigured()) {
      if (error instanceof Error) {
        posthog.capture("error", {
          error: error.message,
          stack: error.stack,
          name: error.name,
          level: "error",
          ...extra,
        });
      } else {
        posthog.capture("error", {
          message: error,
          level: "error",
          ...extra,
        });
      }
    }

    // Always log to console in development or if PostHog fails
    if (process.env.NODE_ENV !== "production") {
      console.error("[PostHog][error]", error, extra);
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
    if (isPostHogConfigured()) {
      try {
        posthog.capture("matching_error", {
          operation,
          target_service: targetService,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          level: "error",
          category: "matching",
          ...extra,
        });
      } catch (posthogError) {
        // If PostHog fails, at least log to console
        console.error("[PostHog Error - fallback to console]", {
          originalError: error,
          posthogError,
          operation,
          targetService,
          extra,
        });
      }
    } else {
      // Log to console when PostHog is not configured
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
    if (isPostHogConfigured()) {
      try {
        posthog.capture("exception", {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          level: context?.level || "error",
          tags: context?.tags,
          ...context?.extra,
        });
      } catch (posthogError) {
        console.error("[PostHog Error - fallback to console]", {
          originalError: error,
          posthogError,
          context,
        });
      }
    } else {
      console.error("[Exception]", error, context);
    }
  },

  /**
   * Add event for debugging context (PostHog events)
   */
  addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
    if (isPostHogConfigured()) {
      posthog.capture("breadcrumb", {
        message,
        timestamp: Date.now(),
        ...data,
      });
    } else {
      console.log("[BREADCRUMB]", message, data);
    }
  },

  /**
   * Track custom events (leveraging PostHog's event tracking)
   */
  trackEvent: (event: string, properties?: Record<string, unknown>) => {
    if (isPostHogConfigured()) {
      posthog.capture(event, properties);
    } else {
      console.log("[EVENT]", event, properties);
    }
  },

  /**
   * Identify user (PostHog user identification)
   */
  identifyUser: (userId: string, properties?: Record<string, unknown>) => {
    if (isPostHogConfigured()) {
      posthog.identify(userId, properties);
    }
  },
};
