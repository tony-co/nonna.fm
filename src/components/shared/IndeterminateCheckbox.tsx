import { FC, useRef, useEffect } from "react";

interface IndeterminateCheckboxProps {
  selectedCount: number;
  totalCount: number;
  onChange: () => void;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
  label: string;
  testId?: string;
}

export const IndeterminateCheckbox: FC<IndeterminateCheckboxProps> = ({
  selectedCount,
  totalCount,
  onChange,
  onClick,
  disabled = false,
  className = "",
  label,
  testId,
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;
  const isChecked = selectedCount === totalCount && totalCount > 0;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="flex items-center">
      <input
        ref={checkboxRef}
        type="checkbox"
        className={`h-4 w-4 flex-shrink-0 cursor-pointer rounded accent-[#8B7FFF] transition-colors duration-200 ${className}`}
        checked={isChecked}
        onChange={onChange}
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        data-testid={testId || `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
