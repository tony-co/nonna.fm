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
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;

    async function init(): Promise<void> {
      try {
        await initializeAppleMusic();
        if (isMounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to initialize Apple Music"));
        }
      }
    }

    async function waitForMusicKit(attempts = 0): Promise<void> {
      if (!isMounted) return;

      if (window.MusicKit) {
        init();
      } else if (attempts < 10) {
        console.log(`Waiting for MusicKit to be available (attempt ${attempts + 1})`);
        retryTimeout = setTimeout(
          () => {
            waitForMusicKit(attempts + 1);
          },
          500 * (attempts + 1)
        );
      } else {
        if (isMounted) {
          setError(new Error("MusicKit failed to load after multiple attempts"));
        }
      }
    }

    if (typeof window !== "undefined") {
      waitForMusicKit();
    }

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
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
