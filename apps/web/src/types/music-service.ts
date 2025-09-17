import { z } from "zod";

export const MusicServiceSchema = z.enum(["spotify", "apple", "youtube", "deezer", "tidal"]);
export type MusicService = z.infer<typeof MusicServiceSchema>;
