import { useState, useCallback, useEffect } from "react";
import { initializeAppleMusic, authorizeAppleMusic } from "@/lib/services/apple/api";

interface UseAppleMusicReturn {
  isInitialized: boolean;
  isAuthorized: boolean;
  musicUserToken: string | null;
  error: Error | null;
  authorize: () => Promise<void>;
}

export function useAppleMusic(): UseAppleMusicReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [musicUserToken, setMusicUserToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Initialize MusicKit when the component mounts
  useEffect(() => {
    async function init(): Promise<void> {
      try {
        await initializeAppleMusic();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to initialize Apple Music"));
      }
    }

    if (typeof window !== "undefined" && window.MusicKit) {
      init();
    }
  }, []);

  const authorize = useCallback(async () => {
    try {
      const token = await authorizeAppleMusic();
      setMusicUserToken(token);
      setIsAuthorized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to authorize with Apple Music"));
      setIsAuthorized(false);
      setMusicUserToken(null);
    }
  }, []);

  return {
    isInitialized,
    isAuthorized,
    musicUserToken,
    error,
    authorize,
  };
}
