import { useTranslations } from "next-intl";
import type { FC } from "react";

export const LoadingSpinner: FC = () => {
  const t = useTranslations("Loading");

  return (
    <div className="flex items-center justify-center p-4" data-testid="loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
};
