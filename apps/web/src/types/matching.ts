import { z } from "zod";
import { TrackSchema } from "./track";
import { AlbumSchema } from "./album";
import { PlaylistSchema } from "./playlist";
import { MusicServiceSchema } from "./music-service";

export interface MatchingState {
  isLoading: boolean;
  error: string | null;
  progress: Record<string, number>;
  currentTask: QueueTask | null;
}

export const QueueTaskSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("likedSongs"),
    tracks: z.array(TrackSchema),
    targetService: MusicServiceSchema,
  }),
  z.object({
    type: z.literal("albums"),
    albums: z.array(AlbumSchema),
    targetService: MusicServiceSchema,
  }),
  z.object({
    type: z.literal("playlist"),
    playlist: PlaylistSchema,
    targetService: MusicServiceSchema,
  }),
]);
export type QueueTask = z.infer<typeof QueueTaskSchema>;
