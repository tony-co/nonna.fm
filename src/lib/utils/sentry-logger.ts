import * as Sentry from "@sentry/nextjs";

/**
 * Sends warnings and errors to Sentry structured logs and also logs to console in non-production.
 */
export const sentryLogger = {
  warn: (...args: unknown[]) => {
    Sentry.logger.warn(args.map(String).join(" "));
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Sentry][warn]", ...args);
    }
  },
  error: (...args: unknown[]) => {
    Sentry.logger.error(args.map(String).join(" "));
    if (process.env.NODE_ENV !== "production") {
      console.error("[Sentry][error]", ...args);
    }
  },
};

/**
 * Logs an error to Sentry and then throws it as a new Error.
 * Use this instead of `throw new Error(...)` to ensure all errors are reported to Sentry.
 *
 * @param message - The error message to log and throw
 * @throws Error - Always throws after logging
 */
export function throwWithSentry(message: string): never {
  sentryLogger.error(message);
  throw new Error(message);
}
