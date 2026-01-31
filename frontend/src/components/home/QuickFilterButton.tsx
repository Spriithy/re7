import { ToggleButton } from "react-aria-components";
import { Timer } from "lucide-react";

interface QuickFilterButtonProps {
  isActive: boolean;
  onClick: () => void;
  onPrefetch?: () => void;
  size?: "sm" | "md";
}

export function QuickFilterButton({
  isActive,
  onClick,
  onPrefetch,
  size = "sm",
}: QuickFilterButtonProps) {
  const baseStyles =
    "flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 border";
  const sizeStyles =
    size === "sm"
      ? "flex-shrink-0 px-3 py-1.5 text-sm"
      : "w-full justify-center gap-2 px-3 py-2 text-sm";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? "bg-warm-600 text-white shadow-md border-warm-600"
    : "bg-warm-50/40 text-warm-700 border-warm-200 hover:bg-warm-100";

  return (
    <ToggleButton
      isSelected={isActive}
      onChange={() => onClick()}
      onHoverStart={onPrefetch ? () => onPrefetch() : undefined}
      onFocus={onPrefetch ? () => onPrefetch() : undefined}
      className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
    >
      <Timer
        className="shrink-0"
        style={{ width: iconSize, height: iconSize }}
      />
      <span className="leading-none">Rapide à préparer</span>
    </ToggleButton>
  );
}
