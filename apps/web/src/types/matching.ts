import { z } from "zod";
import { AlbumSchema } from "./album";
import { MusicServiceSchema } from "./music-service";
import { PlaylistSchema } from "./playlist";
import { TrackSchema } from "./track";

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
