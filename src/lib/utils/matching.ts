import { ITrack, IAlbum } from "@/types/library";

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
    name: 0.45,
    artist: 0.55,
  },
  thresholds: {
    minimum: 0.7,
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
    /*.replace(/\b(?:part|pt)\b\.?\s*(\d+)/gi, 'part $1') // Normalize "Part" and "Pt" variations
        .replace(/\b(?:number|no|nr)\b\.?\s*(\d+)/gi, 'no $1') // Normalize "Number", "No", "Nr" variations
        .replace(/\b(?:volume|vol)\b\.?\s*(\d+)/gi, 'vol $1') // Normalize "Volume", "Vol" variations
        .replace(/\b(?:remix|rmx)\b/gi, 'remix') // Normalize "Remix", "Rmx" variations
        .replace(/\b(?:original|orig)\b/gi, 'original') // Normalize "Original", "Orig" variations
        .replace(/\b(?:version|ver)\b/gi, 'version') // Normalize "Version", "Ver" variations
        .replace(/\b(?:extended|ext)\b/gi, 'extended') // Normalize "Extended", "Ext" variations*/
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();

  // if contains '.' or '-'
  if (str.includes(".") || str.includes(",") || str.includes("-") || str.includes("DMX")) {
    console.log(`[DEBUG] normalizeString('${str}') -> '${result}'`);
  }

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
    ? calculateStringSimilarity(sourceTrack.album, targetTrack.album)
    : undefined;

  // Calculate total score
  let totalScore = nameScore * weights.name + artistScore * weights.artist;
  if (weights.album && albumScore !== undefined) {
    totalScore += albumScore * weights.album;
  }

  console.log(
    `[MATCHING] Comparing ${sourceTrack.name} by ${sourceTrack.artist} with ${targetTrack.name} by ${targetTrack.artist}: ${totalScore}`
  );

  // If we have a YouTube video ID and the score is low, try additional matching strategies
  if (!!sourceTrack.videoId && totalScore < 0.5) {
    console.log(
      `[MATCHING] Low score for ${sourceTrack.name} by ${sourceTrack.artist} with target ${targetTrack.name} by ${targetTrack.artist}: ${totalScore}`
    );
    console.log(`[MATCHING] Video ID: ${sourceTrack.videoId}`);

    // First try: Compare source name against combined target name + artist
    const combinedTargetTitle = `${targetTrack.name} ${targetTrack.artist}`;
    const combinedNameScore = calculateStringSimilarity(sourceTrack.name, combinedTargetTitle);

    console.log(
      `[MATCHING] Combined name source: ${sourceTrack.name} target: ${combinedTargetTitle} score: ${combinedNameScore}`
    );

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
  let artistScore = calculateStringSimilarity(sourceAlbum.artist, targetAlbum.artist);

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
    .replace(/\s*-?\s*EP\b/gi, "") // Remove EP markers more flexibly
    .replace(/\s*-?\s*Single\b/gi, "") // Remove Single markers more flexibly
    .replace(/\b(deluxe|special|expanded|collectors|bonus)( edition| version)?\b/gi, "") // Remove edition markers
    .replace(/[\(\[\{].*?[\)\]\}]/g, "") // Remove any remaining parenthetical content
    .trim()
    .replace(/\s+/g, " "); // Normalize spaces
}
