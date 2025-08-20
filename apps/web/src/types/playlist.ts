import { z } from "zod";
import { TrackSchema } from "./track";

export const PlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  trackCount: z.number().nullable(),
  ownerId: z.string(),
  tracks: z.array(TrackSchema),
  selected: z.boolean().optional(),
  artwork: z.url().optional(),
  targetId: z.string().optional(),
});
export type IPlaylist = z.infer<typeof PlaylistSchema>;
