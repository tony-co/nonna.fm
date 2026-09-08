export interface RetryOptions {
  /** Maximum number of attempts, including the initial request. */
  maxRetries?: number;
  initialRetryDelay?: number;
  maxRetryDelay?: number;
  jitterFactor?: number;
  additionalRetryStatusCodes?: number[];
  treat404AsEmpty?: boolean;
  signal?: AbortSignal;
  /** Disable ambiguous retries for operations such as creating a playlist. */
  retrySafe?: boolean;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    statusText: string
  ) {
    super(`Request failed with status ${status}: ${statusText}`);
    this.name = "HttpError";
  }
}

function wait(delayMs: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    signal?.throwIfAborted();
    const abort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, delayMs);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

function getRetryAfter(response: Response): number | undefined {
  const value = response.headers.get("Retry-After");
  if (!value) return undefined;
  const seconds = Number(value);
  const delayMs = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
  return Number.isFinite(delayMs) ? Math.max(0, delayMs) : undefined;
}

export async function retryWithExponentialBackoff<T>(
  fetchFn: () => Promise<Response>,
  {
    maxRetries = 5,
    initialRetryDelay = 1000,
    maxRetryDelay = 64000,
    jitterFactor = 0.1,
    additionalRetryStatusCodes = [],
    treat404AsEmpty = false,
    signal,
    retrySafe = true,
  }: RetryOptions = {}
): Promise<T> {
  if (!Number.isInteger(maxRetries) || maxRetries < 1) {
    throw new RangeError("maxRetries must be a positive integer");
  }

  const retryableStatuses = new Set([
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
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    signal?.throwIfAborted();
    let response: Response;
    const backoffMs = Math.min(initialRetryDelay * 2 ** attempt, maxRetryDelay);
    try {
      response = await fetchFn();
    } catch (error) {
      signal?.throwIfAborted();
      if (!retrySafe || !(error instanceof TypeError) || attempt === maxRetries - 1) throw error;
      await wait(Math.min(backoffMs * (1 + Math.random() * jitterFactor), maxRetryDelay), signal);
      continue;
    }

    signal?.throwIfAborted();
    if (response.ok) {
      const body = await response.text();
      if (!body) return {} as T;
      return response.headers.get("content-type")?.includes("json")
        ? JSON.parse(body)
        : (body as T);
    }
    if (response.status === 404 && treat404AsEmpty) return { data: [] } as T;

    const error = new HttpError(response.status, response.statusText);
    if (
      !retryableStatuses.has(response.status) ||
      (!retrySafe && response.status !== 429) ||
      attempt === maxRetries - 1
    )
      throw error;

    const retryAfter = getRetryAfter(response);
    // A long server cooldown must not turn into an earlier, abusive retry.
    if (retryAfter !== undefined && retryAfter > maxRetryDelay) throw error;
    await response.body?.cancel();
    await wait(
      retryAfter ?? Math.min(backoffMs * (1 + Math.random() * jitterFactor), maxRetryDelay),
      signal
    );
  }
  throw new Error("Request attempts exhausted");
}
