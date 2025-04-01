import { Suspense } from "react";
import { TransferClient } from "./TransferClient";
import { fetchInitialLibraryData } from "@/lib/server/library";
import { MusicService } from "@/types/services";
import { LoadingOverlay } from "@/components/shared/LoadingOverlay";

// Separate server component for data fetching
async function TransferData({ sourceService }: { sourceService: MusicService }) {
  const { initialData, error } = await fetchInitialLibraryData(sourceService);

  return (
    <TransferClient
      initialLibraryData={initialData}
      initialError={error}
      _sourceService={sourceService}
    />
  );
}

// Component to handle source service validation
function ValidatedTransfer({ sourceService }: { sourceService: MusicService }) {
  if (!sourceService) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/10 dark:text-red-400">
          No source service specified
        </div>
      </div>
    );
  }

  // Move Suspense boundary closer to data fetching
  return <TransferData sourceService={sourceService} />;
}

// Async component to handle params resolution
async function TransferPageContent({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <ValidatedTransfer sourceService={params.source as MusicService} />
    </Suspense>
  );
}

// Main page component
export default function TransferPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  return (
    <div className="h-screen">
      <TransferPageContent searchParams={searchParams} />
    </div>
  );
}
