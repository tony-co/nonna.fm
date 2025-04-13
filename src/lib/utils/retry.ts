/**
 * Configuration options for retry behavior
 */
export interface RetryOptions {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Initial delay between retries in milliseconds */
  initialRetryDelay?: number;
  /** Maximum delay between retries in milliseconds */
  maxRetryDelay?: number;
  /** Factor to add jitter to delay (0-1) */
  jitterFactor?: number;
  /** Additional status codes to retry (beyond the defaults) */
  additionalRetryStatusCodes?: number[];
}

/**
 * Default retry configuration values
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 5,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 64000, // 64 seconds
  jitterFactor: 0.1, // 10% jitter
  additionalRetryStatusCodes: [],
};

/**
 * Adds jitter to a delay value to prevent thundering herd problems
 */
function addJitter(delay: number, factor: number): number {
  const jitter = delay * factor;
  return delay + (Math.random() * 2 - 1) * jitter;
}

/**
 * Type definition for YouTube API error object
 */
interface YouTubeErrorObject {
  domain: string;
  reason: string;
  message?: string;
}

/**
 * Utility function to retry a fetch request with exponential backoff
 * Handles rate limiting (429) and other retryable errors
 *
 * @param fetchFn - Function that returns a Promise<Response>
 * @param options - Retry configuration options
 * @returns Promise<T> - The response data of type T
 */
export async function retryWithExponentialBackoff<T>(
  fetchFn: () => Promise<Response>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_RETRY_OPTIONS.maxRetries,
    initialRetryDelay = DEFAULT_RETRY_OPTIONS.initialRetryDelay,
    maxRetryDelay = DEFAULT_RETRY_OPTIONS.maxRetryDelay,
    jitterFactor = DEFAULT_RETRY_OPTIONS.jitterFactor,
    additionalRetryStatusCodes = DEFAULT_RETRY_OPTIONS.additionalRetryStatusCodes,
  } = options;

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
    ...additionalRetryStatusCodes,
  ]);
  // Status codes that should never be retried
  const nonRetryableStatusCodes = new Set([401, 403, 404]);

  while (attempt < maxRetries) {
    try {
      const response = await fetchFn();

      // Helper function to safely parse response
      const parseResponse = async (res: Response): Promise<T> => {
        const contentType = res.headers.get("content-type");
        try {
          if (contentType && contentType.includes("application/json")) {
            const text = await res.text();
            // Only try to parse as JSON if we have content
            return text ? JSON.parse(text) : null;
          }
          return (await res.text()) as T;
        } catch (e) {
          console.warn("Failed to parse response:", e);
          return null as T;
        }
      };

      // If the response is ok, parse and return the data
      if (response.ok) {
        return await parseResponse(response);
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
            // Parse error response separately from main response
            const text = await response.clone().text();
            const errorData = text ? JSON.parse(text) : null;

            // Check if it's a YouTube SERVICE_UNAVAILABLE error
            const isYouTubeServiceUnavailable = errorData?.error?.errors?.some(
              (e: YouTubeErrorObject) => e.reason === "SERVICE_UNAVAILABLE"
            );

            if (isYouTubeServiceUnavailable) {
              console.warn("YouTube SERVICE_UNAVAILABLE detected, retrying...");

              // Log the retry attempt
              console.warn(`API request failed (attempt ${attempt + 1}/${maxRetries}):`, {
                status: response.status,
                statusText: response.statusText,
                reason: "SERVICE_UNAVAILABLE",
                retryIn: delay,
              });

              // Wait before retrying
              await new Promise(resolve => setTimeout(resolve, addJitter(delay, jitterFactor)));

              // Exponential backoff for next attempt
              delay = Math.min(delay * 2, maxRetryDelay);
              attempt++;
              continue;
            }
          }
        } catch (e) {
          // If we couldn't parse the error JSON, just continue with normal error handling
          console.warn("Could not parse response JSON for 409 error:", e);
        }
      }

      // For errors that we don't want to retry, throw immediately
      if (nonRetryableStatusCodes.has(response.status)) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

      console.log("retryableStatusCodes", retryableStatusCodes);
      console.log("response.status", response.status);

      // For errors with status codes that should be retried
      if (retryableStatusCodes.has(response.status)) {
        // Log the retry attempt
        console.warn(`API request failed (attempt ${attempt + 1}/${maxRetries}):`, {
          status: response.status,
          statusText: response.statusText,
          retryIn: delay,
        });

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, addJitter(delay, jitterFactor)));

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
      const isNonRetryableStatusCode = Array.from(nonRetryableStatusCodes).some(code =>
        errorMessage.includes(`Request failed with status ${code}`)
      );

      // Don't retry if it's a non-retryable status code
      if (isNonRetryableStatusCode) {
        throw error;
      }

      // If it's the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      console.warn(`API request error (attempt ${attempt + 1}/${maxRetries}):`, error);
      await new Promise(resolve => setTimeout(resolve, addJitter(delay, jitterFactor)));
      delay = Math.min(delay * 2, maxRetryDelay);
      attempt++;
    }
  }

  throw new Error(`Failed after ${maxRetries} retries`);
}
