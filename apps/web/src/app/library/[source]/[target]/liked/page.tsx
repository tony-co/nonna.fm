import { Suspense } from "react";
import { LikedSongs } from "./_components/LikedSongs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function LikedSongsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LikedSongs />
    </Suspense>
  );
}
