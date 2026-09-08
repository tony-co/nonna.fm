import { useLibrary } from "@/contexts/LibraryContext";
import type { UseMatchingReturn } from "@/types";

export function useMatching(): UseMatchingReturn {
  const { state, operations } = useLibrary();
  return {
    ...operations,
    isLoading: state.matching.isLoading,
    error: state.matching.error,
    currentTask: state.matching.currentTask,
    getProgress: (type, id) =>
      state.matching.progress[type === "playlist" ? `playlist:${id}` : type] ?? 0,
  };
}
