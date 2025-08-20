import { setServiceType, clearAuthData } from "@/lib/auth/constants";
import type { IPlaylist } from "@/types";

interface DeezerUser {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  country: string;
  tracklist: string;
  type: string;
}

interface DeezerApiError {
  error: string;
}

// Deezer API endpoints for reference (used in API routes)
export const DEEZER_ENDPOINTS = {
  user: (userId: string) => `/user/${userId}`,
  playlists: (userId: string) => `/user/${userId}/playlists`,
  tracks: (userId: string) => `/user/${userId}/tracks`,
  albums: (userId: string) => `/user/${userId}/albums`,
  artists: (userId: string) => `/user/${userId}/artists`,
};

/**
 * Validates a Deezer user ID and returns user data if valid
 */
export const validateDeezerUser = async (userId: string): Promise<DeezerUser> => {
  try {
    const response = await fetch(`/api/deezer/user/${userId}`);
    const data: DeezerUser | DeezerApiError = await response.json();

    if (!response.ok) {
      throw new Error((data as DeezerApiError).error || "Failed to validate Deezer user");
    }

    if ("error" in data) {
      throw new Error(data.error);
    }

    return data as DeezerUser;
  } catch (error) {
    console.error("Error validating Deezer user:", error);
    throw new Error(
      "Failed to validate Deezer user. Make sure the profile is public and try again."
    );
  }
};

/**
 * Stores Deezer user ID and sets up source service
 */
export const storeDeezerUserId = (userId: string): void => {
  localStorage.setItem("deezer_user_id", userId);
  setServiceType("source", "deezer");
};

/**
 * Retrieves stored Deezer user ID
 */
export const getDeezerUserId = (): string | null => {
  return localStorage.getItem("deezer_user_id");
};

/**
 * Clears stored Deezer user ID and service type
 */
export const clearDeezerUserId = (): void => {
  localStorage.removeItem("deezer_user_id");
  clearAuthData("source"); // Clear any source service type
};

/**
 * Stores selected Deezer playlist in local storage
 */
export const storeDeezerPlaylist = (playlist: IPlaylist): void => {
  localStorage.setItem("deezer_selected_playlist", JSON.stringify(playlist));
};

/**
 * Retrieves stored Deezer playlist
 */
export const getDeezerPlaylist = (): IPlaylist | null => {
  const playlist = localStorage.getItem("deezer_selected_playlist");
  return playlist ? JSON.parse(playlist) : null;
};

/**
 * Clears stored Deezer playlist
 */
export const clearDeezerPlaylist = (): void => {
  localStorage.removeItem("deezer_selected_playlist");
};

/**
 * Check if Deezer is currently set as the source service
 */
export const isDeezerSource = (): boolean => {
  const serviceType = localStorage.getItem("nonna_source_service");
  return serviceType === "deezer";
};

/**
 * Handles the callback from Deezer OAuth flow
 */
export const handleDeezerCallback = async (
  searchString: string
): Promise<{ success: boolean; role: "source" | "target" }> => {
  try {
    const params = new URLSearchParams(searchString);
    const userId = params.get("userId");
    const role = params.get("role") as "source" | "target";

    if (!userId) {
      throw new Error("No user ID provided in callback");
    }

    if (!role || !["source", "target"].includes(role)) {
      throw new Error("Invalid role provided in callback");
    }

    // Store the user ID and set the service type
    localStorage.setItem("deezer_user_id", userId);
    setServiceType(role, "deezer");

    return { success: true, role };
  } catch (error) {
    console.error("Error handling Deezer callback:", error);
    return { success: false, role: "source" };
  }
};
