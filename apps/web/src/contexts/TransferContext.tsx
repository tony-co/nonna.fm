"use client";

import { createContext, type ReactNode, useContext } from "react";
import Dialog from "@/components/shared/Dialog";
import { TransferLimitModal } from "@/components/shared/TransferLimitModal";
import { type TransferLimits, useTransferLimits } from "@/hooks/useTransferLimits";

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
      {status && isLimitExceededModalOpen && (
        <Dialog isOpen={true} onClose={handleCloseModal} title="Transfer Limit">
          <TransferLimitModal selectedCount={selectedCountForModal} userStatus={status} />
        </Dialog>
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
