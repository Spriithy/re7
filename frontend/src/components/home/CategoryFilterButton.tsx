import type { Category } from "@/lib/api-types";
import { CategoryIcon } from "@/components/CategoryIcon";

interface CategoryFilterButtonProps {
  category: Category | null;
  isActive: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

export function CategoryFilterButton({
  category,
  isActive,
  onClick,
  size = "sm",
}: CategoryFilterButtonProps) {
  const baseStyles = "flex-shrink-0 rounded-full font-medium transition";
  const sizeStyles =
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? "bg-warm-600 text-white shadow-md"
    : "bg-warm-50 text-warm-700 hover:bg-warm-100";

  if (!category) {
    return (
      <button
        onClick={onClick}
        className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
        aria-pressed={isActive}
        type="button"
      >
        Toutes catégories
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 ${baseStyles} ${sizeStyles} ${colorStyles}`}
      aria-pressed={isActive}
      type="button"
    >
      <CategoryIcon
        iconName={category.icon_name}
        className={isActive ? "text-white" : ""}
        size={iconSize}
        style={{
          color: isActive ? "white" : category.color,
        }}
      />
      {category.name}
    </button>
  );
}
