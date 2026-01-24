import type { Category } from "@/lib/api-types";
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
      ? "flex-shrink-0 px-3 py-1.5 text-xs"
      : "w-full px-3 py-2 text-xs";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? "bg-warm-600 text-white shadow-md border-warm-600"
    : "bg-warm-50/40 text-warm-700 border-warm-200 hover:bg-warm-100";

  if (!category) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        className={`${size === "md" ? "flex justify-center" : ""} ${baseStyles} ${sizeStyles} ${colorStyles}`}
        aria-pressed={isActive}
        type="button"
      >
        <span className="leading-none">Toutes catégories</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={`flex items-center gap-1.5 ${size === "md" ? "justify-center" : ""} ${baseStyles} ${sizeStyles} ${colorStyles}`}
      aria-pressed={isActive}
      type="button"
    >
      <CategoryIcon
        iconName={category.icon_name}
        className={`flex-shrink-0 ${isActive ? "text-white" : ""}`}
        size={iconSize}
        style={{
          color: isActive ? "white" : category.color,
        }}
      />
      <span className="leading-none">{category.name}</span>
    </button>
  );
}
