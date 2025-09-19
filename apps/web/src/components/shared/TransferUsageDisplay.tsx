"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTransfer } from "@/contexts/TransferContext";
import Dialog from "./Dialog";
import { TransferLimitModal } from "./TransferLimitModal";

export function TransferUsageDisplay() {
  const { userStatus: status, isLoading: loading, error } = useTransfer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tLoading = useTranslations("Loading");
  const tPlans = useTranslations("Plans");

  if (loading) {
    return (
      <div className="flex h-full animate-pulse items-center text-xs text-gray-400">
        {tLoading("usage")}
      </div>
    );
  }

  if (error || !status) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="group relative flex cursor-pointer flex-col items-center gap-1.5 rounded-full border border-indigo-100 bg-gradient-to-b from-white to-indigo-50/50 px-4 py-2.5 transition-all duration-300 hover:border-indigo-200 active:scale-[0.98] dark:border-indigo-500/20 dark:from-gray-900 dark:to-indigo-950/30 dark:hover:border-indigo-500/30"
      >
        <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-sm font-semibold text-transparent transition-colors group-hover:from-indigo-500 group-hover:to-indigo-400 dark:from-indigo-400 dark:to-indigo-300">
          {tPlans("goPremium")}
        </span>
      </button>

      {isModalOpen &&
        createPortal(
          <Dialog
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={tPlans("title")}
          >
            <TransferLimitModal selectedCount={0} userStatus={status} />
          </Dialog>,
          document.body
        )}
    </>
  );
}
