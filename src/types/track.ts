import { z } from "zod/v4";
import { MatchingStatusSchema } from "./matching-status";

export const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  artwork: z.url().optional(),
  targetId: z.string().optional(),
  videoId: z.string().optional(),
  status: MatchingStatusSchema.optional(),
  selected: z.boolean().optional(),
});
export type ITrack = z.infer<typeof TrackSchema>;
