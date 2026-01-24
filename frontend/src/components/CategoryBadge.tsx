import type { Category } from "@/lib/api";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
}

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1.5",
    md: "text-sm px-3 py-1 gap-2",
    lg: "text-base px-4 py-1.5 gap-2.5",
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-ink-100 text-ink-700 ${sizeClasses[size]}`}
    >
      <CategoryIcon iconName={category.icon_name} size={iconSize[size]} />
      {category.name}
    </span>
  );
}
