import type { LibraryAction, MatchingState } from "@/types";

// Reducer for matching-related state
export function matchingReducer(state: MatchingState, action: LibraryAction): MatchingState {
  switch (action.type) {
    case "MATCHING_START":
      // Start a new matching task
      return {
        ...state,
        isLoading: true,
        error: null,
        currentTask: action.payload,
      };
    case "MATCHING_PROGRESS":
      // Update progress for a specific task key
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.key]: action.payload.value,
        },
      };
    case "MATCHING_ERROR":
      // Set error and stop loading
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        currentTask: null,
      };
    case "MATCHING_COMPLETE":
      // Mark task as complete, set progress to 100, stop loading
      return {
        ...state,
        isLoading: false,
        currentTask: null,
        progress: {
          ...state.progress,
          [action.payload]: 100,
        },
      };
    case "MATCHING_CANCEL": {
      // Compute the key for the cancelled task
      const key =
        action.payload.type === "playlist" && action.payload.id
          ? `playlist:${action.payload.id}`
          : action.payload.type;
      // Remove the cancelled task's progress entry using destructuring
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _removed, ...rest } = state.progress;

      // Only clear isLoading/currentTask if the cancelled task is the current running task
      const isCurrentTask =
        state.currentTask &&
        state.currentTask.type === action.payload.type &&
        (action.payload.type !== "playlist" ||
          (action.payload.id &&
            state.currentTask.type === "playlist" &&
            state.currentTask.playlist.id === action.payload.id));

      // If cancelling the current running task, clear isLoading/currentTask
      // If cancelling a queued task, just remove its progress entry
      return {
        ...state,
        isLoading: isCurrentTask ? false : state.isLoading,
        currentTask: isCurrentTask ? null : state.currentTask,
        progress: rest,
      };
    }
    default:
      return state;
  }
}
