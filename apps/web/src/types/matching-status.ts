import { z } from "zod";

// Matching status values used throughout the app
export const MATCHING_STATUS = {
  PENDING: "pending",
  MATCHED: "matched",
  UNMATCHED: "unmatched",
} as const;

// Zod schema for matching status
export const MatchingStatusSchema = z.enum(Object.values(MATCHING_STATUS));
export type MatchingStatus = z.infer<typeof MatchingStatusSchema>;
