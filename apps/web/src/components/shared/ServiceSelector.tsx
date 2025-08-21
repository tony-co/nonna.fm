import { FC, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getAvailableServices,
  getServiceById,
  ServiceConfig,
  SERVICE_STATUS,
} from "@/config/services";
import { MusicService } from "@/types";

interface ServiceSelectorProps {
  onTargetSelect: (serviceId: string) => void;
  isProcessing: boolean;
  source?: MusicService;
}

export const ServiceSelector: FC<ServiceSelectorProps> = ({
  onTargetSelect,
  isProcessing,
  source,
}) => {
  const tServiceSelector = useTranslations("ServiceSelector");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceConfig | null>(null);
  const sourceService = source ? getServiceById(source) : null;

  // Auto-open dropdown when no service is selected
  useEffect(() => {
    if (!selectedService && !isProcessing) {
      setIsOpen(true);
    }
  }, [selectedService, isProcessing]);

  const handleServiceSelect = (service: ServiceConfig): void => {
    // Special case for Deezer - can't be used as target
    if (service.id === "deezer") {
      return;
    }
    if (service.status === SERVICE_STATUS.AVAILABLE && !isProcessing) {
      setSelectedService(service);
      setIsOpen(false);
      onTargetSelect(service.id);
    }
  };

  if (!sourceService) {
    return (
      <div className="mb-8 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-500 dark:bg-yellow-500/5">
        {tServiceSelector("pleaseSpecifySourceService")}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        {/* Source Service - Non-interactive */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tServiceSelector("from")}
          </label>
          <div className="relative">
            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-lg lg:gap-4 lg:p-4 dark:border-indigo-900 dark:bg-indigo-950/50">
              <div className="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10">
                <sourceService.image className="h-6 w-6" size={24} />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {sourceService.name}
                </span>
                <span className="mt-0.5 block text-sm text-emerald-600 dark:text-emerald-500">
                  {tServiceSelector("connected")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Target Service (Selectable) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {tServiceSelector("to")}
          </label>
          <div className="relative">
            <button
              onClick={() => !isProcessing && setIsOpen(!isOpen)}
              className={`dark:bg-indigo-990 flex w-full items-center gap-3 rounded-xl border bg-white p-3 transition-all duration-200 lg:gap-4 lg:p-4 ${
                !selectedService
                  ? "animate-pulse border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-gray-200 hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/10 dark:border-gray-800 dark:hover:border-indigo-500"
              }`}
              disabled={isProcessing}
            >
              {selectedService ? (
                <>
                  <div className="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10">
                    <selectedService.image className="h-6 w-6" size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block font-medium text-gray-900 dark:text-white">
                      {selectedService.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">
                      {tServiceSelector("clickToChange")}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10">
                    <svg
                      className="h-5 w-5 text-indigo-500 lg:h-6 lg:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-left font-medium text-indigo-500">
                    {tServiceSelector("selectAService")}
                  </span>
                </>
              )}
              <svg
                className={`ml-1 h-5 w-5 text-gray-400 transition-transform lg:ml-2 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="dark:bg-indigo-990 absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800">
                {getAvailableServices()
                  // Hide source service from target options
                  .filter(service => service.id !== sourceService?.id)
                  .map(service => {
                    // Determine if service should be disabled - Deezer special case for target
                    const isDisabled =
                      service.status !== SERVICE_STATUS.AVAILABLE ||
                      isProcessing ||
                      service.id === "deezer";

                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        disabled={isDisabled}
                        className={`flex w-full items-center gap-3 p-3 transition-all duration-200 lg:gap-4 lg:p-4 ${!isDisabled ? "dark:hover:bg-indigo-970 cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50"} ${selectedService?.id === service.id ? "bg-gray-50 dark:bg-gray-800" : ""} group relative`}
                      >
                        <div className="flex h-8 w-8 items-center justify-center lg:h-10 lg:w-10">
                          <service.image className="h-6 w-6" size={24} />
                        </div>
                        <div className="flex w-full flex-col items-start">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </span>
                          {/* <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span> */}
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
