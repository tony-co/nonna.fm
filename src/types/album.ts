import { z } from "zod/v4";
import { MatchingStatusSchema } from "./matching-status";

export const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string(),
  targetId: z.string().optional(),
  status: MatchingStatusSchema.optional(),
  selected: z.boolean().optional(),
  artwork: z.url().optional(),
});
export type IAlbum = z.infer<typeof AlbumSchema>;
