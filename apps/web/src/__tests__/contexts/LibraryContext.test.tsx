import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  LibraryProvider,
  mockLibraryState,
  useLibrary,
  useLibrarySelection,
} from "@/__mocks__/contexts/LibraryContext";

// --- Test component to consume context ---
function TestConsumer() {
  const { state, actions } = useLibrary();
  return (
    <div>
      <div data-testid="is-loading">{String(state.status.isLoading)}</div>
      <button type="button" onClick={() => actions.setLoading(true)}>
        Set Loading
      </button>
    </div>
  );
}

// --- Test suite for LibraryContext ---
describe("LibraryContext", () => {
  beforeEach(() => {
    // Reset any global state or mocks if needed
  });

  it("provides initial state to consumers", () => {
    render(
      <LibraryProvider>
        <TestConsumer />
      </LibraryProvider>
    );
    expect(screen.getByTestId("is-loading").textContent).toBe("false");
  });

  it("updates loading state via actions", async () => {
    render(
      <LibraryProvider>
        <TestConsumer />
      </LibraryProvider>
    );
    // Wrap state-changing interaction in act to flush updates
    await act(async () => {
      screen.getByText("Set Loading").click();
    });
    expect(screen.getByTestId("is-loading").textContent).toBe("true");
  });

  it("useLibrarySelection returns selectedItems and actions", async () => {
    function SelectionConsumer() {
      const { selectedItems, selectAllTracks } = useLibrarySelection();
      return (
        <>
          <div data-testid="selected-tracks">{Array.from(selectedItems.tracks).join(",")}</div>
          <button type="button" onClick={selectAllTracks}>
            Select All Tracks
          </button>
        </>
      );
    }
    render(
      <LibraryProvider>
        <SelectionConsumer />
      </LibraryProvider>
    );
    // Initially empty
    expect(screen.getByTestId("selected-tracks").textContent).toBe("");
    // Wrap state-changing interaction in act to flush updates
    await act(async () => {
      screen.getByText("Select All Tracks").click();
    });
    // Should now contain all track IDs from mockLibraryState
    // Defensive: default to empty Set if likedSongs is undefined
    const likedSongs = mockLibraryState.likedSongs ?? new Set();
    const expected = Array.from(likedSongs)
      .map(t => t.id)
      .join(",");
    expect(screen.getByTestId("selected-tracks").textContent).toBe(expected);
  });

  // Add more tests for reducer actions, error state, etc.
});
