/**
 * Utility for processing items in batches with consistent error handling and logging
 */

export interface BatchProcessorOptions<T> {
  items: T[];
  batchSize: number;
  delayBetweenBatches?: number;
  onBatchStart?: (batchNumber: number, totalBatches: number) => void;
  onBatchComplete?: (successCount: number, failureCount: number) => void;
  onError?: (error: Error, batch: T[]) => void;
}

export interface BatchProcessorResult {
  added: number;
  failed: number;
  total: number;
}

/**
 * Generic batch processor that handles common patterns like:
 * - Processing items in batches of a fixed size
 * - Adding delays between batches
 * - Handling API responses
 * - Tracking success/failure counts
 * - Error handling
 */
export async function processInBatches<T, R>(
  processBatch: (batch: T[]) => Promise<R>,
  options: BatchProcessorOptions<T>
): Promise<BatchProcessorResult> {
  const {
    items,
    batchSize,
    delayBetweenBatches = 100,
    onBatchStart,
    onBatchComplete,
    onError,
  } = options;

  let added = 0;
  let failed = 0;
  const totalBatches = Math.ceil(items.length / batchSize);

  for (let i = 0; i < items.length; i += batchSize) {
    const batchNumber = Math.floor(i / batchSize) + 1;
    const batch = items.slice(i, i + batchSize);

    try {
      onBatchStart?.(batchNumber, totalBatches);

      await processBatch(batch);
      added += batch.length;

      onBatchComplete?.(batch.length, 0);
    } catch (error) {
      failed += batch.length;
      onError?.(error as Error, batch);
    }

    // Add delay between batches if not the last batch
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }

  return {
    added,
    failed,
    total: items.length,
  };
}
