import type { MatchingState } from "@/types/library";

export const initialMatchingState: MatchingState = {
  isLoading: false,
  error: null,
  progress: {},
  currentTask: null,
};
