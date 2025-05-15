import { QueueTask, LibraryAction } from "@/types";

// Action creator for starting a matching task
export const matchingStart = (task: QueueTask): LibraryAction => ({
  type: "MATCHING_START" as const,
  payload: task,
});

// Action creator for updating matching progress
export const matchingProgress = (key: string, value: number): LibraryAction => ({
  type: "MATCHING_PROGRESS" as const,
  payload: { key, value },
});

// Action creator for matching error
export const matchingError = (error: string): LibraryAction => ({
  type: "MATCHING_ERROR" as const,
  payload: error,
});

// Action creator for completing a matching task
export const matchingComplete = (key: string): LibraryAction => ({
  type: "MATCHING_COMPLETE" as const,
  payload: key,
});

// Action creator for cancelling a matching task
export const matchingCancel = (type: string, id?: string): LibraryAction => ({
  type: "MATCHING_CANCEL" as const,
  payload: { type, id },
});
