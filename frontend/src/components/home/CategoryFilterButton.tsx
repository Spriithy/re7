import type { Category } from "@/lib/api-types";
import { ToggleButton } from "react-aria-components";
import { CategoryIcon } from "@/components/CategoryIcon";

interface CategoryFilterButtonProps {
  category: Category | null;
  isActive: boolean;
  onClick: () => void;
  onPrefetch?: () => void;
  size?: "sm" | "md";
}

export function CategoryFilterButton({
  category,
  isActive,
  onClick,
  onPrefetch,
  size = "sm",
}: CategoryFilterButtonProps) {
  const baseStyles =
    "rounded-full font-medium transition-all duration-200 border";
  const sizeStyles =
    size === "sm"
      ? "flex-shrink-0 px-3 py-1.5 text-sm"
      : "w-full px-3 py-2 text-sm";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? "bg-warm-600 text-white shadow-md border-warm-600"
    : "bg-warm-50/40 text-warm-700 border-warm-200 hover:bg-warm-100";

  const layoutStyles = category
    ? `flex items-center gap-1.5${size === "md" ? " justify-center" : ""}`
    : size === "md"
      ? "flex justify-center"
      : "";

  return (
    <ToggleButton
      isSelected={isActive}
      onChange={() => onClick()}
      onHoverStart={onPrefetch ? () => onPrefetch() : undefined}
      onFocus={onPrefetch ? () => onPrefetch() : undefined}
      className={`${layoutStyles} ${baseStyles} ${sizeStyles} ${colorStyles}`}
    >
      {category && (
        <CategoryIcon
          iconName={category.icon_name}
          className={`shrink-0 ${isActive ? "text-white" : "text-warm-600"}`}
          size={iconSize}
        />
      )}
      <span className="leading-none">
        {category ? category.name : "Toutes catégories"}
      </span>
    </ToggleButton>
  );
}
