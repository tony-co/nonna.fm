"use client";

import { useState, FC, useEffect } from "react";
import { Library } from "@/components/library/Library";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSearchTracks } from "@/hooks/useSearchTracks";
import { MatchingProvider } from "@/contexts/MatchingContext";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { LibraryProvider, useLibrary } from "@/contexts/LibraryContext";
import { ILibraryData } from "@/types/library";
import { useAppleMusic } from "@/hooks/useAppleMusic";
import { initiateAppleAuth } from "@/lib/services/apple/auth";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";
import { MusicService } from "@/types/services";
interface StatusMessagesProps {
  error: Error | null;
}

const AuthErrorMessage: FC<StatusMessagesProps> = ({ error }) => (
  <>
    {error && (
      <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
        {error.message}
      </div>
    )}
  </>
);

const PageLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow pt-4">
        <div className="h-full">{children}</div>
      </main>
      <Footer />
    </div>
  </>
);

interface TransferClientProps {
  initialLibraryData: ILibraryData | null;
  initialError: Error | null;
  _sourceService: MusicService;
}

const TransferContent: FC<TransferClientProps> = ({ initialError, _sourceService }) => {
  const [mode, setMode] = useState<"select" | "matching" | "review" | "transfer" | "completed">(
    "select"
  );
  const { libraryState, error, initializeLibrary } = useLibrary();
  const { isInitialized } = useAppleMusic();

  const { handleSearchTracks, cancelSearch } = useSearchTracks({
    onModeChange: setMode,
  });

  useEffect(() => {
    async function initAuth() {
      if (!libraryState) {
        try {
          // Apple Musickit requires browser-side initialization
          if (!isInitialized && _sourceService === "apple") {
            await initiateAppleAuth("source");
          }
          // Initialize library data
          await initializeLibrary(_sourceService);
        } catch (err) {
          console.error("Failed to initialize library:", err);
        }
      }
    }

    initAuth();
  }, [_sourceService, libraryState, isInitialized, initializeLibrary]);

  const renderContent = () => {
    if (!libraryState) {
      return (
        <>
          <LoadingOverlay />
        </>
      );
    }

    return (
      <SelectionProvider data={libraryState} mode={mode} onSearchTracks={handleSearchTracks}>
        <>
          {!libraryState && (error || initialError) && (
            <AuthErrorMessage error={error || initialError} />
          )}
          <Library mode={mode} onSearchTracks={handleSearchTracks} onCancel={cancelSearch} />
        </>
      </SelectionProvider>
    );
  };

  return <PageLayout>{renderContent()}</PageLayout>;
};

export const TransferClient: FC<TransferClientProps> = props => {
  return (
    <LibraryProvider initialData={props.initialLibraryData} initialError={props.initialError}>
      <MatchingProvider>
        <TransferContent {...props} />
      </MatchingProvider>
    </LibraryProvider>
  );
};
