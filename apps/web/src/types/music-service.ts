import { z } from "zod";

export const MusicServiceSchema = z.enum(["spotify", "apple", "youtube", "deezer"]);
export type MusicService = z.infer<typeof MusicServiceSchema>;
