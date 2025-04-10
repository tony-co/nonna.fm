import { MusicService } from "@/types/services";
import { fetchUserLibrary } from "@/lib/musicApi";
import { ILibraryData } from "@/types/library";

interface InitialLibraryResult {
  initialData: ILibraryData | null;
  error: Error | null;
}

// This function can be imported and used in server components
export async function fetchInitialLibraryData(
  sourceService: MusicService | undefined
): Promise<InitialLibraryResult> {
  try {
    if (!sourceService) {
      return {
        initialData: null,
        error: new Error("Source service not specified"),
      };
    }

    const initialData = await fetchUserLibrary(sourceService);
    return { initialData, error: null };
  } catch (error) {
    return {
      initialData: null,
      error: error instanceof Error ? error : new Error("Failed to load initial library data"),
    };
  }
}
