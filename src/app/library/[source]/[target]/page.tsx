import { MusicService } from "@/types/services";

interface LibraryHomePageProps {
  params: Promise<{
    source: MusicService;
    target: MusicService;
  }>;
}

export default async function LibraryHomePage({ params }: LibraryHomePageProps) {
  const { source, target } = await params;

  return (
    <div className="p-8 text-center" role="guide" aria-label="Empty State">
      <svg
        className="mx-auto mb-4 h-16 w-16 text-indigo-500 dark:text-indigo-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
      <p className="text-lg font-normal text-indigo-700 dark:text-indigo-400">
        Select a playlist or album to view its tracks
      </p>
      <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-300/70">
        Choose from your {source} library on the left to transfer to {target}
      </p>
    </div>
  );
}
