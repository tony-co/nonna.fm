"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { ILibraryData } from "@/types/library";
import { MusicService } from "@/types/services";
import { fetchUserLibrary } from "@/lib/musicApi";

interface LibraryContextType {
  libraryState: ILibraryData | null;
  isLoading: boolean;
  error: Error | null;
  setLibraryState: Dispatch<SetStateAction<ILibraryData | null>>;
  initializeLibrary: (sourceService: MusicService) => Promise<void>;
  clearError: () => void;
}

const defaultLibraryContext: LibraryContextType = {
  libraryState: null,
  isLoading: false,
  error: null,
  setLibraryState: () => {},
  initializeLibrary: async () => {},
  clearError: () => {},
};

const LibraryContext = createContext<LibraryContextType>(defaultLibraryContext);

interface LibraryProviderProps {
  children: ReactNode;
  initialData?: ILibraryData | null;
  initialError?: Error | null;
}

export function LibraryProvider({
  children,
  initialData = null,
  initialError = null,
}: LibraryProviderProps) {
  const [libraryState, setLibraryState] = useState<ILibraryData | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(initialError);

  const initializeLibrary = useCallback(async (sourceService: MusicService): Promise<void> => {
    try {
      if (!sourceService) {
        throw new Error("Source service not specified");
      }

      setIsLoading(true);
      setError(null);

      const library = await fetchUserLibrary(sourceService);
      setLibraryState(library);
      //setError(null);
    } catch (err) {
      console.error("Error initializing library:", err);
      setError(err instanceof Error ? err : new Error("Failed to load library. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        libraryState,
        isLoading,
        error,
        setLibraryState,
        initializeLibrary,
        clearError,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error(
      "useLibrary must be used within a LibraryProvider. " +
        "Please wrap your component with <LibraryProvider>"
    );
  }
  return context;
}
