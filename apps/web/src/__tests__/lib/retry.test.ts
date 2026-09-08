import { afterEach, describe, expect, it, vi } from "vitest";
import { retryWithExponentialBackoff } from "@/lib/utils/retry";

afterEach(() => vi.useRealTimers());
describe("request retries", () => {
  it.each([202, 204, 205])("accepts an empty successful %i response once", async status => {
    const request = vi
      .fn()
      .mockResolvedValue(
        new Response(null, { status, headers: { "Content-Type": "application/json" } })
      );
    await expect(retryWithExponentialBackoff(request)).resolves.toEqual({});
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each([400, 401, 403, 404, 422])("does not retry a permanent %i failure", async status => {
    const request = vi.fn().mockResolvedValue(new Response(null, { status }));
    await expect(retryWithExponentialBackoff(request)).rejects.toThrow(String(status));
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("does not replay a successful write with malformed JSON", async () => {
    const request = vi
      .fn()
      .mockResolvedValue(new Response("{", { headers: { "Content-Type": "application/json" } }));
    await expect(retryWithExponentialBackoff(request)).rejects.toThrow();
    expect(request).toHaveBeenCalledTimes(1);
  });
  it("does not replay an ambiguous non-idempotent write", async () => {
    const request = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(retryWithExponentialBackoff(request, { retrySafe: false })).rejects.toThrow(
      "Failed to fetch"
    );
    expect(request).toHaveBeenCalledTimes(1);
  });
  it.each(["2", "Wed, 01 Jan 2025 00:00:02 GMT"])("honors Retry-After %s", async retryAfter => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    const request = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 429, headers: { "Retry-After": retryAfter } })
      )
      .mockResolvedValueOnce(Response.json({ ok: true }));
    const result = retryWithExponentialBackoff(request, { retrySafe: false });
    await vi.advanceTimersByTimeAsync(1999);
    expect(request).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toEqual({ ok: true });
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("stops a backoff immediately when cancelled", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const request = vi.fn().mockResolvedValue(new Response(null, { status: 503 }));
    const result = retryWithExponentialBackoff(request, { signal: controller.signal });
    const rejected = expect(result).rejects.toMatchObject({ name: "AbortError" });
    await vi.advanceTimersByTimeAsync(0);
    controller.abort();
    await rejected;
    expect(request).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("fails after the final attempt without another sleep", async () => {
    vi.useFakeTimers();
    const request = vi.fn().mockImplementation(async () => new Response(null, { status: 503 }));
    const result = retryWithExponentialBackoff(request, {
      maxRetries: 2,
      initialRetryDelay: 10,
      jitterFactor: 0,
    });
    const rejected = expect(result).rejects.toThrow("503");
    await vi.advanceTimersByTimeAsync(10);
    await rejected;
    expect(request).toHaveBeenCalledTimes(2);
    expect(vi.getTimerCount()).toBe(0);
  });
});
