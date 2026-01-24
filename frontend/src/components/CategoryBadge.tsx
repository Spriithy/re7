import type { Category } from "@/lib/api";
import { CategoryIcon } from "./CategoryIcon";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "text-xs px-2 py-0.5 gap-1.5",
  md: "text-sm px-3 py-1 gap-2",
  lg: "text-base px-4 py-1.5 gap-2.5",
} as const;

const ICON_SIZES = {
  sm: 14,
  md: 18,
  lg: 22,
} as const;

export function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  return (
    <span
      className={`bg-ink-100 text-ink-700 inline-flex items-center rounded-full font-medium ${SIZE_CLASSES[size]}`}
    >
      <CategoryIcon iconName={category.icon_name} size={ICON_SIZES[size]} />
      {category.name}
    </span>
  );
}
