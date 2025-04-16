import { MusicService } from "@/types/services";
import { getServiceById } from "@/config/services";

interface LibraryHomePageProps {
  params: Promise<{
    source: MusicService;
    target: MusicService;
  }>;
}

export default async function LibraryHomePage({ params }: LibraryHomePageProps) {
  const { source, target } = await params;
  const sourceService = getServiceById(source);
  const targetService = getServiceById(target);

  const sourceName = sourceService?.name || source;
  const targetName = targetService?.name || target;

  return (
    <div
      className="animate-fade-in mx-auto flex max-w-2xl flex-col items-center justify-center p-8"
      role="guide"
      aria-label="Transfer Guide"
      style={{
        animation: "fadeIn 0.5s ease-out",
      }}
    >
      <h1
        className="mt-6
      bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-300 dark:to-purple-300"
      >
        How it works
      </h1>

      <div className="mt-8 w-full space-y-5 text-center">
        <div className="group relative overflow-hidden rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40">
          <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-70"></div>
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800/50">
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">1</span>
            </div>
            <p className="ml-4 font-medium text-gray-800 dark:text-indigo-100">
              Select what you want to transfer
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40">
          <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-70"></div>
          <div className="flex">
            <div className="flex-shrink-0 pt-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800/50">
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">2</span>
              </div>
            </div>
            <div className="ml-4 flex flex-col items-start text-left">
              <p className="font-medium text-gray-800 dark:text-indigo-100">
                We will look for the best matches on {targetName}
              </p>
              <p className="mt-1 text-gray-700 dark:text-indigo-200/80">
                You can open the selected playlists to check the matches
              </p>
              <p className="mt-1 text-gray-700 dark:text-indigo-200/80">
                This can take a while depending on your selection
              </p>
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-indigo-800/30 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40">
          <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-70"></div>
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800/50">
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">3</span>
            </div>
            <p className="ml-4 font-medium text-gray-800 dark:text-indigo-100">
              Click <strong>Start transfer</strong> to copy your selection to {targetName}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-indigo-600 dark:text-indigo-400/80">
        Your original {sourceName} playlists will remain unchanged.
      </p>
    </div>
  );
}
