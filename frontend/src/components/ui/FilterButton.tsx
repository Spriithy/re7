import { ToggleButton } from "react-aria-components";
import type { ReactNode } from "react";

interface FilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  onPrefetch?: () => void;
  size?: "sm" | "md";
  accent?: "base" | "healthy";
  children: ReactNode;
  className?: string;
  isDisabled?: boolean;
}

export function FilterButton({
  isActive,
  onClick,
  onPrefetch,
  size = "sm",
  accent = "base",
  children,
  className = "",
  isDisabled = false,
}: FilterButtonProps) {
  const baseStyles =
    "flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 border";

  const sizeStyles =
    size === "sm"
      ? "flex-shrink-0 px-3 py-1.5 text-sm"
      : "w-full justify-center gap-2 px-3 py-2 text-sm";

  const accentStyles =
    accent === "healthy"
      ? isActive
        ? "bg-emerald-700 text-white shadow-md border-emerald-700"
        : "bg-emerald-50/40 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
      : isActive
        ? "bg-warm-600 text-white shadow-md border-warm-600"
        : "bg-warm-50/40 text-warm-700 border-warm-200 hover:bg-warm-100";

  return (
    <ToggleButton
      isSelected={isActive}
      onChange={() => onClick()}
      onHoverStart={onPrefetch}
      onFocus={onPrefetch}
      isDisabled={isDisabled}
      className={`${baseStyles} ${sizeStyles} ${accentStyles} ${className}`}
    >
      {children}
    </ToggleButton>
  );
}
