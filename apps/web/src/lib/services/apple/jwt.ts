import jwt from "jsonwebtoken";

export function generateAppleClientSecret(): string {
  const privateKey = process.env.APPLE_MUSIC_PRIVATE_KEY;
  const teamId = process.env.APPLE_MUSIC_TEAM_ID;
  const keyId = process.env.APPLE_MUSIC_KEY_ID;
  const clientId = process.env.APPLE_MUSIC_CLIENT_ID;

  if (!privateKey || !teamId || !keyId || !clientId) {
    throw new Error("Missing required Apple Music configuration");
  }

  return jwt.sign({}, privateKey, {
    algorithm: "ES256",
    expiresIn: "180d", // Apple allows up to 6 months
    issuer: teamId,
    header: {
      alg: "ES256",
      kid: keyId,
    },
    audience: "https://appleid.apple.com",
    subject: clientId,
  });
}
