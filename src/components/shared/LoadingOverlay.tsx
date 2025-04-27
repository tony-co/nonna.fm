import { NonnaLogo } from "../icons/NonnaLogo";

export const LoadingOverlay: React.FC = () => (
  <div className="backdrop-blur-xs fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60">
    {/*
      Centered container for logo and spinner.
      - relative: allows absolute positioning of spinner over logo
      - w-48 h-48: fixed size for precise alignment
    */}
    <div className="relative flex h-52 w-52 items-center justify-center">
      {/* NonnaLogo: Cat with magnifying glass */}
      <NonnaLogo className="text-white" size={200} />
      {/*
        Spinner overlay:
        - absolute: overlays spinner on logo
        - left-[26%] top-[51%]: visually aligns spinner over magnifying glass (tweak as needed)
        - translate-x-1/2 translate-y-1/2: center spinner on that point
        - z-10: ensures spinner is above logo
      */}
      <div className="absolute left-[26.5%] top-[50.5%] z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-indigo-100 border-b-indigo-100/10 border-l-indigo-100/70 border-r-indigo-100/40" />
      </div>
    </div>
    {/* Loading text directly below the logo/spinner, centered */}
    <div className="mb-16 mt-2 text-center">
      <h2 className="animate-pulse text-xl font-normal text-white">Loading your library</h2>
      <p className="mt-2 text-sm text-indigo-200">Just a moment while we get everything ready</p>
    </div>
  </div>
);
