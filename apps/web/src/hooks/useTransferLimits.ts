import { useCallback, useEffect, useState } from "react";
import { getAuthData } from "@/lib/auth/constants";
import { FREE_TIER_LIMIT, PREMIUM_TIER_LIMIT } from "@/lib/constants";

export interface UserStatus {
  isPremium: boolean;
  currentUsage: number;
  resetInSeconds?: number;
}

export interface TransferLimits extends UserStatus {
  dailyLimit: number;
  availableToday: number;
  resetInSeconds?: number;
}

export interface UseTransferLimitsReturn {
  status: TransferLimits | null;
  loading: boolean;
  error: Error | null;
  updateUsage: (count: number) => Promise<boolean>;
  checkLimit: (count: number) => Promise<boolean>;
  refreshStatus: () => Promise<void>;
  isLimitExceededModalOpen: boolean;
  setIsLimitExceededModalOpen: (isOpen: boolean) => void;
  selectedCountForModal: number;
}

export function useTransferLimits(): UseTransferLimitsReturn {
  const [status, setStatus] = useState<TransferLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isLimitExceededModalOpen, setIsLimitExceededModalOpen] = useState(false);
  const [selectedCountForModal, setSelectedCountForModal] = useState(0);

  // Helper function to calculate full status with limits
  const calculateFullStatus = useCallback((baseStatus: UserStatus): TransferLimits => {
    const dailyLimit = baseStatus.isPremium ? PREMIUM_TIER_LIMIT : FREE_TIER_LIMIT;
    return {
      ...baseStatus,
      dailyLimit,
      availableToday: Math.max(0, dailyLimit - baseStatus.currentUsage),
    };
  }, []);

  // Helper function to get the current user ID
  const getCurrentUserId = useCallback((): string => {
    const targetAuth = getAuthData("target");
    if (!targetAuth) {
      throw new Error("No target service authentication found");
    }
    return `${targetAuth.serviceId}:${targetAuth.userId}`;
  }, []);

  const fetchUserStatus = useCallback(async () => {
    try {
      setLoading(true);
      const userId = getCurrentUserId();
      const response = await fetch("/api/user/status", {
        headers: {
          "x-user-id": userId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user status");
      }
      const data = await response.json();
      setStatus(calculateFullStatus(data));
      setError(null);
    } catch (err) {
      // Fall back to free tier limits
      const fallbackStatus = {
        isPremium: false,
        dailyLimit: FREE_TIER_LIMIT,
        currentUsage: 0,
        availableToday: FREE_TIER_LIMIT,
      };
      setStatus(fallbackStatus);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [calculateFullStatus, getCurrentUserId]);

  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  const checkLimit = useCallback(
    async (count: number): Promise<boolean> => {
      try {
        const userId = getCurrentUserId();
        const response = await fetch("/api/user/status", {
          headers: {
            "x-user-id": userId,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to check usage limit");
        }

        const data = await response.json();
        const { isPremium, currentUsage, resetInSeconds } = data;
        const dailyLimit = isPremium ? PREMIUM_TIER_LIMIT : FREE_TIER_LIMIT;
        const newUsage = currentUsage + count;

        if (newUsage > dailyLimit) {
          if (status) {
            setSelectedCountForModal(count);
            setIsLimitExceededModalOpen(true);

            // Update local status with current usage and resetInSeconds
            const newStatus = calculateFullStatus({
              isPremium,
              currentUsage,
              resetInSeconds,
            });
            setStatus(newStatus);
          }
          return false;
        }

        return true;
      } catch (err) {
        console.error("Error checking usage limit:", err);
        return false;
      }
    },
    [status, calculateFullStatus, getCurrentUserId]
  );

  const updateUsage = useCallback(
    async (count: number): Promise<boolean> => {
      try {
        const userId = getCurrentUserId();
        const response = await fetch("/api/transfer/usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({ count }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating usage:", errorData);

          if (response.status === 403) {
            if (status) {
              setSelectedCountForModal(count);
              setIsLimitExceededModalOpen(true);

              // Update local status
              const newStatus = calculateFullStatus({
                isPremium: status.isPremium,
                currentUsage: errorData.currentUsage,
                resetInSeconds: errorData.resetInSeconds,
              });
              setStatus(newStatus);
            }
            return false;
          }

          throw new Error("Failed to update usage");
        }

        const data = await response.json();
        // Update local status
        if (status) {
          const newStatus = calculateFullStatus({
            isPremium: status.isPremium,
            currentUsage: data.currentUsage,
          });
          setStatus(newStatus);
        }

        return true;
      } catch (err) {
        console.error("Error updating usage count:", err);
        return false;
      }
    },
    [status, calculateFullStatus, getCurrentUserId]
  );

  return {
    status,
    loading,
    error,
    updateUsage,
    checkLimit,
    refreshStatus: fetchUserStatus,
    isLimitExceededModalOpen,
    setIsLimitExceededModalOpen,
    selectedCountForModal,
  };
}
