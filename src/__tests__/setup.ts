import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = options?.root instanceof Element ? options.root : null;
    this.rootMargin = options?.rootMargin ?? "0px";
    this.thresholds = options?.threshold
      ? Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold]
      : [0];
  }

  observe(target: Element): void {
    // Simulate an immediate intersection
    setTimeout(() => {
      const entry = {
        isIntersecting: true,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        target,
        time: Date.now(),
      };
      this.callback([entry], this);
    }, 0);
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// --- Mock MusicKit before anything else ---
// This ensures that when the Apple API code is loaded, it finds window.MusicKit as expected.
(globalThis as unknown as { window: Window & typeof globalThis }).window = globalThis as Window &
  typeof globalThis;
(globalThis as Window & typeof globalThis).window.MusicKit = {
  configure: vi.fn(),
  getInstance: vi.fn(() => ({
    authorize: vi.fn().mockResolvedValue("mock-user-token"),
    api: {
      search: vi.fn().mockResolvedValue({ songs: { data: [] } }),
      library: {
        add: vi.fn(),
        playlists: {
          create: vi.fn().mockResolvedValue({ id: "mock-playlist-id" }),
          addTracks: vi.fn(),
        },
      },
    },
  })),
};
