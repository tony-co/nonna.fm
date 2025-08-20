import { ITrack, IAlbum } from "@/types";

// Types for matching configuration
export interface MatchWeights {
  name: number;
  artist: number;
  album?: number;
}

export interface MatchThresholds {
  minimum: number;
  boost: number;
}

export interface MatchScoreDetails {
  nameScore: number;
  artistScore: number;
  albumScore?: number;
}

export interface MatchResult {
  score: number;
  details: MatchScoreDetails;
}

export interface MatchConfig {
  weights: MatchWeights;
  thresholds: MatchThresholds;
}

// Default configurations
export const DEFAULT_TRACK_CONFIG: MatchConfig = {
  weights: {
    name: 0.45,
    artist: 0.45,
    album: 0.1,
  },
  thresholds: {
    minimum: 0.6,
    boost: 0.7,
  },
};

export const DEFAULT_ALBUM_CONFIG: MatchConfig = {
  weights: {
    name: 0.65,
    artist: 0.35,
  },
  thresholds: {
    minimum: 0.6,
    boost: 0.85,
  },
};

// Helper function to normalize strings for comparison
export function normalizeString(str: string): string {
  const result = str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s*-\s*/g, " ") // Convert all hyphens to spaces
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()[\]'"']/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();

  return result;
}

// Helper function to split artist string into array of artists
export function splitArtists(artistStr: string): string[] {
  return artistStr
    .split(/\s*(?:,|\band\b|&)\s*/)
    .map(artist => artist.trim())
    .filter(Boolean);
}

// Calculate similarity score between two strings (0-1)
export function calculateStringSimilarity(str1: string, str2: string): number {
  const norm1 = normalizeString(str1);
  const norm2 = normalizeString(str2);

  // Exact match after normalization
  if (norm1 === norm2) return 1;

  // Calculate word match ratio
  const words1 = norm1.split(" ");
  const words2 = norm2.split(" ");
  const commonWords = words1.filter(word => words2.includes(word));
  return (2 * commonWords.length) / (words1.length + words2.length);
}

// Helper to compare artist arrays for better matching
/**
 * Calculates similarity between two artist strings by splitting them into arrays and checking for overlap.
 * - Returns 1 if any artist in target is present in source (or vice versa).
 * - Otherwise, returns the best string similarity between any pair.
 */
function calculateArtistArraySimilarity(sourceArtist: string, targetArtist: string): number {
  const sourceArtists = splitArtists(sourceArtist).map(normalizeString);
  const targetArtists = splitArtists(targetArtist).map(normalizeString);

  // If any target artist is in source artists, consider it a strong match
  for (const t of targetArtists) {
    if (sourceArtists.includes(t)) return 1;
  }
  // If any source artist is in target artists, also strong match
  for (const s of sourceArtists) {
    if (targetArtists.includes(s)) return 1;
  }
  // Otherwise, return the best string similarity between any pair
  let best = 0;
  for (const s of sourceArtists) {
    for (const t of targetArtists) {
      best = Math.max(best, calculateStringSimilarity(s, t));
    }
  }
  return best;
}

// Calculate match score for a track
export async function calculateTrackMatchScore(
  sourceTrack: ITrack,
  targetTrack: {
    name: string;
    artist: string;
    album?: string;
  },
  config: MatchConfig = DEFAULT_TRACK_CONFIG
): Promise<MatchResult> {
  const { weights } = config;

  // Calculate individual scores
  const nameScore = calculateStringSimilarity(sourceTrack.name, targetTrack.name);
  const artistScore = calculateStringSimilarity(sourceTrack.artist, targetTrack.artist);
  const albumScore = targetTrack.album
    ? calculateStringSimilarity(sourceTrack.album ?? "", targetTrack.album)
    : undefined;

  // Calculate total score
  let totalScore = nameScore * weights.name + artistScore * weights.artist;
  if (weights.album && albumScore !== undefined) {
    totalScore += albumScore * weights.album;
  }

  // If we have a YouTube video ID and the score is low, try additional matching strategies
  if (!!sourceTrack.videoId && totalScore < 0.5) {
    // First try: Compare source name against combined target name + artist
    const combinedTargetTitle = `${targetTrack.name} ${targetTrack.artist}`;
    const combinedNameScore = calculateStringSimilarity(sourceTrack.name, combinedTargetTitle);

    // If the combined score is significantly better, use it
    if (combinedNameScore > totalScore + 0.2) {
      console.log(`[MATCHING] Improved score using combined name+artist: ${combinedNameScore}`);
      return {
        score: combinedNameScore,
        details: {
          nameScore: combinedNameScore,
          artistScore: 1, // We consider artist matched since it was part of the combined match
          ...(albumScore !== undefined && { albumScore }),
        },
      };
    }
  }

  return {
    score: totalScore,
    details: {
      nameScore,
      artistScore,
      ...(albumScore !== undefined && { albumScore }),
    },
  };
}

// Calculate match score for an album
export function calculateAlbumMatchScore(
  sourceAlbum: IAlbum,
  targetAlbum: {
    name: string;
    artist: string;
  },
  config: MatchConfig = DEFAULT_ALBUM_CONFIG
): MatchResult {
  const { weights } = config;

  const nameScore = calculateStringSimilarity(sourceAlbum.name, targetAlbum.name);
  // Use improved artist similarity
  let artistScore = calculateArtistArraySimilarity(sourceAlbum.artist, targetAlbum.artist);

  // Special handling for OSTs with Multi-artists
  const isOst =
    sourceAlbum.name.toLowerCase().includes("music from") ||
    targetAlbum.name.toLowerCase().includes("music from") ||
    sourceAlbum.name.toLowerCase().includes("motion picture") ||
    targetAlbum.name.toLowerCase().includes("motion picture");

  if (isOst) {
    const isMultiArtist =
      sourceAlbum.artist.toLowerCase().startsWith("multi") ||
      targetAlbum.artist.toLowerCase().startsWith("multi") ||
      sourceAlbum.artist.toLowerCase().startsWith("various") ||
      targetAlbum.artist.toLowerCase().startsWith("various");

    if (isMultiArtist) {
      artistScore = Math.max(artistScore, 0.9);
    }
  }

  const totalScore = nameScore * weights.name + artistScore * weights.artist;

  return {
    score: totalScore,
    details: {
      nameScore,
      artistScore,
    },
  };
}

// Helper function to clean search terms for better music service search results
export function cleanSearchTerm(str: string): string {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s*-\s*/g, " ") // Convert all hyphens to spaces
    .replace(/[.,\/#!$%\^&\*;:{}=_`~()[\]'"']/g, "") // Remove punctuation
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

// Clean up a track title for better cross-service matching.
export function cleanTrackTitle(title: string): string {
  return (
    title
      // Remove all content in square brackets, parentheses, or curly braces
      .replace(/[\[\(\{][^\]\)\}]*[\]\)\}]/g, "")
      // Remove featuring artist indicators
      .replace(/\s*\(feat\..*?\)/gi, "")
      .replace(/\s*\(ft\..*?\)/gi, "")
      .replace(/\s+ft\..*$/gi, "")
      .replace(/\s+feat\..*$/gi, "")
      .replace(/\s+ft\s+.*$/gi, "")
      .replace(/\s+feat\s+.*$/gi, "")
      // Remove (Single)
      .replace(/\s*\(single\)\s*/gi, " ")
      // Remove remix, edit, version, acoustic, instrumental, bonus, cover tags
      .replace(/\s*\((remix|edit|version|acoustic|instrumental|bonus track|cover)\)/gi, "")
      .replace(/\s*-?\s*(remix|edit|version|acoustic|instrumental|bonus track|cover)\b/gi, "")
      // Remove trailing/leading dashes
      .replace(/\s*-\s*$/, "")
      .replace(/^\s*-\s*/, "")
      // Normalize spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}
