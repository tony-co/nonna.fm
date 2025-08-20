import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  useMatching,
  mockFns,
  resetMocks,
  setMockMatchingState,
  getMockQueue,
  getMockCompleted,
  getMockCancelled,
} from "@/__mocks__/hooks/useMatching";
import { TestWrapper } from "../testUtils";
import { vi } from "vitest";
import { act } from "react";

// --- Test component to consume useMatching ---
function MatchingConsumer() {
  const { isLoading, error, matchLikedSongs, cancelMatching, getProgress } = useMatching();
  return (
    <div>
      <div data-testid="is-loading">{String(isLoading)}</div>
      <div data-testid="error">{error ?? ""}</div>
      <div data-testid="progress">{getProgress("likedSongs")}</div>
      <button onClick={() => matchLikedSongs([], "spotify")}>Match Liked Songs</button>
      <button onClick={() => cancelMatching("likedSongs")}>Cancel</button>
    </div>
  );
}

// --- Test component for advanced queue/cancel testing ---
function AdvancedMatchingConsumer() {
  const { matchLikedSongs, cancelMatching } = useMatching();
  // Store IDs in local state for test control
  const [ids, setIds] = React.useState<string[]>([]);
  return (
    <div>
      <button
        onClick={() => {
          // Queue a new item and store its ID
          const id = matchLikedSongs([], "spotify");
          setIds(prev => [...prev, id]);
        }}
      >
        Queue Item
      </button>
      {ids.map((id, idx) => (
        <button key={id} data-testid={`cancel-${idx}`} onClick={() => cancelMatching(id)}>
          Cancel {idx}
        </button>
      ))}
    </div>
  );
}

// --- Test suite for useMatching ---
describe("useMatching", () => {
  beforeEach(() => {
    resetMocks();
    setMockMatchingState({ isLoading: false, error: null });
  });

  it("returns initial loading and error state", () => {
    render(
      <TestWrapper>
        <MatchingConsumer />
      </TestWrapper>
    );
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("");
  });

  it("calls matchLikedSongs when button is clicked", () => {
    render(
      <TestWrapper>
        <MatchingConsumer />
      </TestWrapper>
    );
    screen.getByText("Match Liked Songs").click();
    expect(mockFns.matchLikedSongs).toHaveBeenCalled();
  });

  it("calls cancelMatching when cancel button is clicked", () => {
    render(
      <TestWrapper>
        <MatchingConsumer />
      </TestWrapper>
    );
    screen.getByText("Cancel").click();
    expect(mockFns.cancelMatching).toHaveBeenCalledWith("likedSongs");
  });

  it("shows progress from getProgress", () => {
    mockFns.getProgress.mockReturnValueOnce(42);
    render(
      <TestWrapper>
        <MatchingConsumer />
      </TestWrapper>
    );
    expect(screen.getByTestId("progress").textContent).toBe("42");
  });

  it("shows error if error state is set", () => {
    setMockMatchingState({ error: "Something went wrong" });
    render(
      <TestWrapper>
        <MatchingConsumer />
      </TestWrapper>
    );
    expect(screen.getByTestId("error").textContent).toBe("Something went wrong");
  });

  it("queues multiple items, cancels one, and matches others (with async)", async () => {
    // Diagnostic: use real timers to see if fake timers are the issue
    vi.useRealTimers();
    render(
      <TestWrapper>
        <AdvancedMatchingConsumer />
      </TestWrapper>
    );
    // Queue three items, each wrapped in act
    await act(async () => {
      screen.getByText("Queue Item").click();
    });
    await act(async () => {
      screen.getByText("Queue Item").click();
    });
    await act(async () => {
      screen.getByText("Queue Item").click();
    });
    // Wait for the cancel buttons to appear
    await screen.findByTestId("cancel-1");
    // Get the queued IDs
    const ids = getMockQueue();
    expect(ids.length).toBe(3);
    // Cancel the second item before it matches, wrapped in act
    await act(async () => {
      screen.getByTestId("cancel-1").click();
    });
    // Wait for all items to be processed (simulate 3x100ms + buffer)
    await new Promise(r => setTimeout(r, 400));
    // Assert: second item is cancelled, others are completed
    const completed = getMockCompleted();
    const cancelled = getMockCancelled();
    expect(completed).toContain(ids[0]);
    expect(completed).toContain(ids[2]);
    expect(completed).not.toContain(ids[1]);
    expect(cancelled).toContain(ids[1]);
  });

  it("preserves tracks array of first playlist when a second playlist is queued", async () => {
    // This test ensures that when two playlists are queued, the tracks array of the first is not lost or replaced
    // Define two playlists with unique tracks arrays
    const playlist1 = { id: "playlist1", tracks: ["trackA", "trackB"] };
    const playlist2 = { id: "playlist2", tracks: ["trackX", "trackY"] };

    // Test component to queue playlists with tracks
    function PlaylistMatchingConsumer() {
      const { matchLikedSongs } = useMatching();
      return (
        <div>
          <button onClick={() => matchLikedSongs(playlist1.tracks, "spotify")}>
            Queue Playlist 1
          </button>
          <button onClick={() => matchLikedSongs(playlist2.tracks, "spotify")}>
            Queue Playlist 2
          </button>
        </div>
      );
    }

    render(
      <TestWrapper>
        <PlaylistMatchingConsumer />
      </TestWrapper>
    );

    // Queue both playlists
    screen.getByText("Queue Playlist 1").click();
    screen.getByText("Queue Playlist 2").click();

    // Get the queued tasks (full objects)
    const { getMockQueueTasks } = await import("@/__mocks__/hooks/useMatching");
    const queueTasks = getMockQueueTasks();
    // Find the first playlist in the queue by its tracks
    const first = queueTasks.find(
      item => Array.isArray(item.items) && item.items.includes("trackA")
    );
    // Assert that the tracks array is intact and not replaced
    expect(first).toBeDefined();
    expect(first?.items).toEqual(["trackA", "trackB"]);
  });

  // Add more tests for queueing, completion, edge cases, etc.
});
