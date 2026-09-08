export interface BatchProcessorOptions<T> {
  items: T[];
  batchSize: number;
  delayBetweenBatches?: number;
  onBatchStart?: (batchNumber: number, totalBatches: number) => void;
  onBatchComplete?: (successCount: number, failureCount: number) => void;
  onError?: (error: Error, batch: T[]) => void;
  continueOnError?: boolean;
}

export interface BatchProcessorResult {
  added: number;
  failed: number;
  total: number;
}

export async function processInBatches<T, R>(
  processBatch: (batch: T[]) => Promise<R>,
  {
    items,
    batchSize,
    delayBetweenBatches = 100,
    onBatchStart,
    onBatchComplete,
    onError,
    continueOnError = false,
  }: BatchProcessorOptions<T>
): Promise<BatchProcessorResult> {
  if (!Number.isInteger(batchSize) || batchSize < 1) {
    throw new RangeError("batchSize must be a positive integer");
  }
  let added = 0;
  let failed = 0;
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    onBatchStart?.(index / batchSize + 1, Math.ceil(items.length / batchSize));
    let didSucceed = false;
    try {
      await processBatch(batch);
      didSucceed = true;
    } catch (error) {
      if ((error instanceof Error || error instanceof DOMException) && error.name === "AbortError")
        throw error;
      onError?.(error instanceof Error ? error : new Error(String(error)), batch);
      if (!continueOnError) throw error;
    }
    added += didSucceed ? batch.length : 0;
    failed += didSucceed ? 0 : batch.length;
    onBatchComplete?.(didSucceed ? batch.length : 0, didSucceed ? 0 : batch.length);
    if (delayBetweenBatches > 0 && index + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }
  return { added, failed, total: items.length };
}
