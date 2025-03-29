export const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
    <div className="text-center">
      <div className="inline-block">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-b-indigo-500/10 border-l-indigo-500/70 border-r-indigo-500/40" />
      </div>
      <h2 className="mt-4 animate-pulse text-xl font-normal text-white">Loading your library</h2>
      <p className="mt-2 text-sm text-indigo-200">Just a moment while we get everything ready</p>
    </div>
  </div>
);
