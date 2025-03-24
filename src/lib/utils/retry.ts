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
}

/**
 * Default retry configuration values
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 5,
  initialRetryDelay: 1000, // 1 second
  maxRetryDelay: 64000, // 64 seconds
  jitterFactor: 0.1, // 10% jitter
};

/**
 * Adds jitter to a delay value to prevent thundering herd problems
 */
function addJitter(delay: number, factor: number): number {
  const jitter = delay * factor;
  return delay + (Math.random() * 2 - 1) * jitter;
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
  } = options;

  let attempt = 0;
  let delay = initialRetryDelay;

  while (attempt < maxRetries) {
    try {
      const response = await fetchFn();

      // If the response is ok, parse and return the data
      if (response.ok) {
        // Handle both JSON and text responses
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return await response.json();
        }
        return (await response.text()) as T;
      }

      // If we get a 429, use the Retry-After header if available
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        if (retryAfter) {
          delay = parseInt(retryAfter, 10) * 1000; // Convert to milliseconds
        }
      }

      // For other errors that we don't want to retry, throw immediately
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
      }

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
    } catch (error) {
      // If it's a network error or other exception, retry with backoff
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
