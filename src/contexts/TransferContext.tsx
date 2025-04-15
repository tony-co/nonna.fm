"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useTransferLimits, TransferLimits } from "@/hooks/useTransferLimits";
import { TransferLimitModal } from "@/components/shared/TransferLimitModal";

interface TransferContextProps {
  children: ReactNode;
}

interface TransferContextType {
  userStatus: TransferLimits | null;
  isLoading: boolean;
  error: Error | null;
  updateUsage: (count: number) => Promise<boolean>;
  checkLimit: (count: number) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

const TransferContext = createContext<TransferContextType | undefined>(undefined);

export function TransferProvider({ children }: TransferContextProps) {
  const {
    status,
    loading,
    error,
    updateUsage,
    checkLimit,
    refreshStatus,
    isLimitExceededModalOpen,
    setIsLimitExceededModalOpen,
    selectedCountForModal,
  } = useTransferLimits();

  // Handle the "Continue anyway" action for the modal
  const handleCloseModal = () => {
    setIsLimitExceededModalOpen(false);
  };

  return (
    <TransferContext.Provider
      value={{
        userStatus: status,
        isLoading: loading,
        error,
        updateUsage,
        checkLimit,
        refreshStatus,
      }}
    >
      {children}

      {/* Render the modal conditionally based on status and modal state */}
      {status && (
        <TransferLimitModal
          isOpen={isLimitExceededModalOpen}
          onClose={handleCloseModal}
          selectedCount={selectedCountForModal}
          userStatus={status}
        />
      )}
    </TransferContext.Provider>
  );
}

export function useTransfer(): TransferContextType {
  const context = useContext(TransferContext);

  if (context === undefined) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }

  return context;
}
