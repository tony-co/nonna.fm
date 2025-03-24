import { vi, afterEach } from "vitest";
import MusicKit from "../lib/services/apple/__mocks__/musicKit.mock";

// Create a mock window object with MusicKit
const windowMock = {
  MusicKit,
};

// Stub the global window object
Object.defineProperty(global, "window", {
  value: windowMock,
  writable: true,
});

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
