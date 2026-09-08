import { describe, expect, it, vi } from "vitest";
import { processInBatches } from "@/lib/utils/batch-processor";

describe("batch processing", () => {
  it("preserves successful counts when a later batch fails", async () => {
    const process = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockResolvedValueOnce(undefined);
    const onBatchComplete = vi.fn();
    await expect(
      processInBatches(process, {
        items: [1, 2, 3, 4, 5],
        batchSize: 2,
        delayBetweenBatches: 0,
        continueOnError: true,
        onBatchComplete,
      })
    ).resolves.toEqual({ added: 3, failed: 2, total: 5 });
    expect(onBatchComplete.mock.calls).toEqual([
      [2, 0],
      [0, 2],
      [1, 0],
    ]);
  });
  it("stops read operations at the first failure", async () => {
    const process = vi.fn().mockRejectedValue(new Error("Unavailable"));
    await expect(processInBatches(process, { items: [1, 2], batchSize: 1 })).rejects.toThrow(
      "Unavailable"
    );
    expect(process).toHaveBeenCalledTimes(1);
  });
  it("propagates cancellation even when continuing normal failures", async () => {
    const process = vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError"));
    await expect(
      processInBatches(process, { items: [1, 2], batchSize: 1, continueOnError: true })
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(process).toHaveBeenCalledTimes(1);
  });
  it.each([0, -1, 1.5])("rejects invalid batch size %s", async batchSize => {
    await expect(processInBatches(vi.fn(), { items: [1], batchSize })).rejects.toThrow(
      "positive integer"
    );
  });
});
