import { Suspense } from "react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Albums } from "./_components/Albums";

export default function AlbumsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Albums />
    </Suspense>
  );
}
