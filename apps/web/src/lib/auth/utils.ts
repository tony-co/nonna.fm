import { clearDeezerPlaylist, clearDeezerUserId } from "../services/deezer/auth";
import { clearSpotifyAuth } from "../services/spotify/auth";
import { clearYouTubeAuth } from "../services/youtube/auth";
import { clearEncryption } from "./crypto";

/**
 * Clears all authentication and service-related data from the application
 * Call this before initiating a new service authentication
 */
export function clearAllServiceData(): void {
  // Check if running in browser environment
  if (typeof window === "undefined") {
    return;
  }

  // Clear service-specific data
  clearSpotifyAuth();
  clearYouTubeAuth();
  clearDeezerUserId();
  clearDeezerPlaylist();

  // Clear encryption (this will force a new encryption key generation)
  clearEncryption();

  // Clear any additional localStorage items that might be related to services
  localStorage.removeItem("encryption_key");
  localStorage.removeItem("spotify_auth_state");
  localStorage.removeItem("youtube_auth_state");

  // Clear any service-related cookies
  const cookies = ["spotify_code_verifier", "youtube_code_verifier"];

  cookies.forEach(cookie => {
    document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
}
