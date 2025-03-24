import { useRef, useEffect } from "react";

interface IndeterminateCheckboxProps {
  selectedCount: number;
  totalCount: number;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

export function IndeterminateCheckbox({
  selectedCount,
  totalCount,
  onChange,
  onClick,
  disabled = false,
  className = "",
}: IndeterminateCheckboxProps) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = selectedCount > 0 && selectedCount < totalCount;
    }
  }, [selectedCount, totalCount]);

  return (
    <input
      ref={checkboxRef}
      type="checkbox"
      className={`h-4 w-4 cursor-pointer rounded accent-[#8B7FFF] transition-colors duration-200 ${className}`}
      checked={selectedCount === totalCount && totalCount > 0}
      onChange={onChange}
      onClick={onClick}
      disabled={disabled}
    />
  );
}
