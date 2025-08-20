"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Dynamically import Dialog component
const DialogComponent = dynamic(() => import("@/components/shared/Dialog"), { ssr: false });

interface SpotifyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function SpotifyConsentModal({
  isOpen,
  onClose,
  onAgree,
}: SpotifyConsentModalProps): React.ReactElement {
  const t = useTranslations('SpotifyConsent');
  
  return (
    <DialogComponent isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className="space-y-6">
        <div className="">
          <p className="mb-2 font-semibold">{t('beforeUsing')}</p>
          <ul className="ml-4 list-disc space-y-1.5 text-sm">
            <li>{t('terms.warranty')}</li>
            <li>{t('terms.noModify')}</li>
            <li>{t('terms.noReverse')}</li>
            <li>{t('terms.liability')}</li>
            <li>{t('terms.beneficiary')}</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-stone-200">
            {t('privacyTitle')}
          </h3>
          <div className="text-sm">
            <p className="mb-2">{t('warning')}</p>
            <ul className="ml-4 list-disc space-y-1.5">
              <li>{t('privacy.policy')}</li>
              <li>{t('privacy.collection')}</li>
              <li>{t('privacy.processing')}</li>
              <li>{t('privacy.contact')}</li>
              <li>{t('privacy.cookies')}</li>
              <li>{t('privacy.tracking')}</li>
              <li>{t('privacy.manage')}</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-indigo-200 px-6 py-3 font-medium text-zinc-800 transition-colors hover:bg-indigo-50 dark:border-indigo-800/30 dark:text-stone-200 dark:hover:bg-indigo-950/50"
          >
            {t('decline')}
          </button>
          <button
            onClick={onAgree}
            className="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {t('agree')}
          </button>
        </div>
      </div>
    </DialogComponent>
  );
}
