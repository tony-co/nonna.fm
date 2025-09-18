import jwt from "jsonwebtoken";
import { env } from "../../../env.server.mjs";

// Interface for JWT payload structure
interface JWTPayload {
  iss?: string; // Issuer
  iat?: number; // Issued at
  exp?: number; // Expiration time
  [key: string]: unknown; // Allow additional properties
}

// Interface for token validation result
export interface TokenValidationResult {
  isValid: boolean;
  expiresAt?: Date;
  timeUntilExpiry?: number;
}

// Generate Apple Music developer token for MusicKit
export function generateAppleDeveloperToken(): string {
  const privateKey = env.APPLE_MUSIC_PRIVATE_KEY;
  const teamId = env.APPLE_MUSIC_TEAM_ID;
  const keyId = env.APPLE_MUSIC_KEY_ID;

  if (!privateKey || !teamId || !keyId) {
    throw new Error("Missing required Apple Music configuration for developer token");
  }

  // Format private key properly - ensure it includes proper line breaks
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now + 180 * 24 * 60 * 60; // 180 days (6 months)

  return jwt.sign(
    {
      iss: teamId, // Issuer (Team ID)
      iat: now, // Issued at
      exp: expirationTime, // Expiration time
    },
    formattedPrivateKey,
    {
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: keyId, // Key ID from Apple Developer Console
      },
    }
  );
}

// Note: Apple Sign-In client secrets are handled separately in the auth module
// This file focuses only on MusicKit developer tokens

// Validate if a JWT token is still valid and not expired
export function validateToken(token: string): TokenValidationResult {
  try {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded || typeof decoded === "string" || !decoded.payload) {
      return { isValid: false };
    }

    const payload = decoded.payload as JWTPayload;
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp <= now) {
      return {
        isValid: false,
        expiresAt: new Date(payload.exp * 1000),
        timeUntilExpiry: payload.exp - now,
      };
    }

    return {
      isValid: true,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : undefined,
      timeUntilExpiry: payload.exp ? payload.exp - now : undefined,
    };
  } catch (error) {
    console.error("Error validating token:", error);
    return { isValid: false };
  }
}

// Check if token expires within the specified number of days
export function isTokenExpiringWithinDays(token: string, days: number): boolean {
  const validation = validateToken(token);
  if (!validation.isValid || !validation.timeUntilExpiry) {
    return true; // Consider invalid tokens as "expiring"
  }

  const secondsInDay = 24 * 60 * 60;
  const daysUntilExpiry = validation.timeUntilExpiry / secondsInDay;

  return daysUntilExpiry <= days;
}
