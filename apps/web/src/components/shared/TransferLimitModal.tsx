"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { TransferLimits } from "@/hooks/useTransferLimits";
import { FREE_TIER_LIMIT, PREMIUM_TIER_LIMIT } from "@/lib/constants";

interface TransferLimitModalProps {
  selectedCount: number;
  userStatus: TransferLimits;
}

export function TransferLimitModal({ selectedCount, userStatus }: TransferLimitModalProps) {
  const { dailyLimit, availableToday, resetInSeconds } = userStatus;
  const tPlans = useTranslations("Plans");
  const tModals = useTranslations("Modals");
  const hasAvailableTransfers = availableToday > 0;
  const isSelectionOverLimit = selectedCount > availableToday;

  // Format reset time if available
  const resetTimeText = resetInSeconds
    ? `${Math.floor(resetInSeconds / 3600)}h ${Math.floor((resetInSeconds % 3600) / 60)}m`
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Status Message */}
      {(isSelectionOverLimit || !hasAvailableTransfers) && (
        <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 p-6 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              {/**
                Status message logic:
                - If user has available transfers and selection exceeds limit, show warning
                - If user has available transfers and selection is within limit, show nothing
                - If no available transfers, show daily limit reached
              */}
              {hasAvailableTransfers ? (
                isSelectionOverLimit ? (
                  // Warning: selection exceeds available transfers
                  <>
                    <p className="text-lg">
                      {tModals("transferLimit.selectionExceedsLimit", {
                        selectedCount,
                        availableToday,
                      })}
                    </p>
                    {/* Show reset time only with warning */}
                    {resetTimeText && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {tModals("transferLimit.resetTimeWarning", { resetTime: resetTimeText })}
                      </p>
                    )}
                  </>
                ) : null // No message or reset time if selection is within limit
              ) : (
                // No available transfers: daily limit reached
                <>
                  <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
                    {tModals("transferLimit.dailyLimitTitle")}
                  </p>
                  <p className="text-base">
                    {tModals("transferLimit.usedAllTransfers", { dailyLimit })}
                  </p>
                  {/* Show reset time only with daily limit reached */}
                  {resetTimeText && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tModals("transferLimit.resetTimeWarning", { resetTime: resetTimeText })}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Free Plan */}
      <div className="relative overflow-hidden rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-900 dark:bg-gray-950/30">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/50">
            <svg
              className="mt-1 h-5 w-5 text-gray-600 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tPlans("freePlan")}
            </h3>
            <span className="mt-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {tPlans("currentPlan")}
            </span>
          </div>
        </div>
        <ul className="mb-4 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {FREE_TIER_LIMIT} {tModals("transferLimit.dailyTransfers")}
          </li>
        </ul>
      </div>

      {/* Premium Plan - Coming Soon */}
      <div className="relative overflow-hidden rounded-lg border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 dark:border-indigo-900 dark:from-indigo-950/30 dark:to-indigo-900/10">
        <div className="flex items-center gap-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
            <svg
              className="h-5 w-5 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tPlans("premiumPlan")}
            </h3>
            <span className="mt-2 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              {tPlans("comingSoon")}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {tModals("transferLimit.upgradeToPremium")}
        </p>
        <ul className="mb-4 mt-3 space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center">
              <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="flex items-center gap-1.5">
              <span>
                {PREMIUM_TIER_LIMIT} {tModals("transferLimit.dailyTransfers")}
              </span>
            </span>
          </li>
        </ul>
        <button
          disabled
          className="w-full cursor-not-allowed rounded-lg bg-gray-100 px-6 py-2.5 text-center font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500"
        >
          {tModals("transferLimit.comingSoonButton")}
        </button>
      </div>
    </div>
  );
}
