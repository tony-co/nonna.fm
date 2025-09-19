"use client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

// Context value type: title, minimal header flag, show title flag and their setters
interface ItemTitleContextValue {
  itemTitle: string | null;
  setItemTitle: Dispatch<SetStateAction<string | null>>;
  minimalMobileHeader: boolean;
  setMinimalMobileHeader: Dispatch<SetStateAction<boolean>>;
  showTitle: boolean;
  setShowTitle: Dispatch<SetStateAction<boolean>>;
}

// Create context with default values
const ItemTitleContext = createContext<ItemTitleContextValue>({
  itemTitle: null,
  setItemTitle: () => {},
  minimalMobileHeader: false,
  setMinimalMobileHeader: () => {},
  showTitle: false,
  setShowTitle: () => {},
});

// Provider component for item title and minimal header
export function ItemTitleProvider({ children }: { children: ReactNode }) {
  const [itemTitle, setItemTitle] = useState<string | null>(null);
  const [minimalMobileHeader, setMinimalMobileHeader] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState<boolean>(false);

  return (
    <ItemTitleContext.Provider
      value={{
        itemTitle,
        setItemTitle,
        minimalMobileHeader,
        setMinimalMobileHeader,
        showTitle,
        setShowTitle,
      }}
    >
      {children}
    </ItemTitleContext.Provider>
  );
}

// Hook to use the context (returns all values and setters)
export function useItemTitle() {
  return useContext(ItemTitleContext);
}
