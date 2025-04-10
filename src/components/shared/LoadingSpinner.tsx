import { FC } from "react";

export const LoadingSpinner: FC = () => {
  return (
    <div className="flex items-center justify-center p-4" role="loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
