import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { LikedSongs } from "./_components/LikedSongs";

export default function LikedSongsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LikedSongs />
    </Suspense>
  );
}
