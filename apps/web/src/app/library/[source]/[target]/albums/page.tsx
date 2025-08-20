import { Suspense } from "react";
import { Albums } from "./_components/Albums";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function AlbumsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Albums />
    </Suspense>
  );
}
