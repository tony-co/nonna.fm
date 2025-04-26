import { vi } from "vitest";

// --- Mock state and spies for useMatching ---
export const mockFns = {
  matchLikedSongs: vi.fn(),
  matchAlbums: vi.fn(),
  matchPlaylistTracks: vi.fn(),
  cancelMatching: vi.fn(),
  getProgress: vi.fn(),
};

// --- Default mock state ---
let mockState = {
  isLoading: false,
  error: null as string | null,
  currentTask: null as unknown,
};

// --- Enhanced mock state for queueing and async matching ---
interface MatchingTask {
  id: string;
  type: string;
  items: unknown[];
  provider: string;
  timeoutId?: ReturnType<typeof setTimeout>;
}

let queue: MatchingTask[] = [];
let completed: string[] = [];
let cancelled: string[] = [];
let isProcessing = false;

// --- Helper to process the next item in the queue ---
function processNext(): void {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const task = queue[0];
  mockState.isLoading = true;
  mockState.currentTask = task;
  // Simulate async matching (e.g., 100ms per item)
  task.timeoutId = setTimeout(() => {
    // If cancelled, do not complete
    if (cancelled.includes(task.id)) {
      queue.shift();
      isProcessing = false;
      mockState.isLoading = false;
      mockState.currentTask = null;
      processNext();
      return;
    }
    completed.push(task.id);
    queue.shift();
    isProcessing = false;
    mockState.isLoading = false;
    mockState.currentTask = null;
    processNext();
  }, 100);
}

// --- Enhanced matchLikedSongs to support queueing ---
mockFns.matchLikedSongs.mockImplementation((items: unknown[], provider: string) => {
  const id = `${provider}:${Date.now()}:${Math.random()}`;
  queue.push({ id, type: "likedSongs", items, provider });
  processNext();
  return id;
});

// --- Enhanced cancelMatching to support cancelling specific items ---
mockFns.cancelMatching.mockImplementation((id: string) => {
  // Mark as cancelled
  cancelled.push(id);
  // Remove from queue if not processing yet
  const idx = queue.findIndex(t => t.id === id);
  if (idx > 0) {
    queue.splice(idx, 1);
  }
  // If currently processing, clear timeout (will be handled in processNext)
  if (idx === 0 && queue[0]?.timeoutId) {
    clearTimeout(queue[0].timeoutId);
    // processNext will be called after timeout
  }
});

// --- Expose helpers for tests ---
export function getMockQueue(): string[] {
  return queue.map(t => t.id);
}
export function getMockQueueTasks(): MatchingTask[] {
  return [...queue];
}
export function getMockCompleted(): string[] {
  return [...completed];
}
export function getMockCancelled(): string[] {
  return [...cancelled];
}

// --- Reset all mocks and state (extended) ---
export function resetMocks(): void {
  Object.values(mockFns).forEach(fn => fn.mockClear());
  mockState = {
    isLoading: false,
    error: null,
    currentTask: null,
  };
  queue = [];
  completed = [];
  cancelled = [];
  isProcessing = false;
}

// --- The mock useMatching hook ---
export function useMatching(): {
  isLoading: boolean;
  error: string | null;
  currentTask: unknown;
  matchLikedSongs: typeof mockFns.matchLikedSongs;
  matchAlbums: typeof mockFns.matchAlbums;
  matchPlaylistTracks: typeof mockFns.matchPlaylistTracks;
  cancelMatching: typeof mockFns.cancelMatching;
  getProgress: typeof mockFns.getProgress;
} {
  return {
    ...mockState,
    matchLikedSongs: mockFns.matchLikedSongs,
    matchAlbums: mockFns.matchAlbums,
    matchPlaylistTracks: mockFns.matchPlaylistTracks,
    cancelMatching: mockFns.cancelMatching,
    getProgress: mockFns.getProgress,
    // Add any other properties as needed for tests
  };
}

// --- Optionally, allow tests to set mock state ---
export function setMockMatchingState(state: Partial<typeof mockState>): void {
  mockState = { ...mockState, ...state };
}

// --- Optionally, allow tests to set mock return values for getProgress ---
mockFns.getProgress.mockImplementation((_type, _id) => 0);

// --- Add lots of comments for clarity ---
// This mock allows tests to control the behavior of the useMatching hook.
// Use setMockMatchingState to set isLoading, error, or currentTask for a test.
// Use resetMocks in beforeEach to clear state and spies.
