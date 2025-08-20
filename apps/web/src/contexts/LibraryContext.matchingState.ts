import type { MatchingState } from "@/types";

export const initialMatchingState: MatchingState = {
  isLoading: false,
  error: null,
  progress: {},
  currentTask: null,
};
