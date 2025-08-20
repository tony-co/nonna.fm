import { FC } from "react";
import { useTranslations } from "next-intl";

export const LoadingSpinner: FC = () => {
  const t = useTranslations('Common');
  
  return (
    <div className="flex items-center justify-center p-4" role="loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      <span className="sr-only">{t('loading')}</span>
    </div>
  );
};
