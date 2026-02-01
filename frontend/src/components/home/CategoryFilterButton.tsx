import type { Category } from "@/lib/api-types";
import { FilterButton } from "@/components/ui/FilterButton";
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
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <FilterButton
      isActive={isActive}
      onClick={onClick}
      onPrefetch={onPrefetch}
      size={size}
    >
      {category && (
        <CategoryIcon
          iconName={category.icon_name}
          size={iconSize}
          className={isActive ? "text-white" : "text-warm-600"}
        />
      )}
      <span className="leading-none">
        {category ? category.name : "Toutes catégories"}
      </span>
    </FilterButton>
  );
}
