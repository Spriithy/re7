import { Leaf, Sprout } from "lucide-react";
import { FilterButton } from "@/components/ui/FilterButton";

interface DietFilterButtonProps {
  type: "vegetarian" | "vegan";
  isActive: boolean;
  onClick: () => void;
  onPrefetch?: () => void;
  size?: "sm" | "md";
}

export function DietFilterButton({
  type,
  isActive,
  onClick,
  onPrefetch,
  size = "sm",
}: DietFilterButtonProps) {
  const isVegetarian = type === "vegetarian";
  const Icon = isVegetarian ? Leaf : Sprout;
  const label = isVegetarian ? "Végétarien" : "Végane";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <FilterButton
      isActive={isActive}
      onClick={onClick}
      onPrefetch={onPrefetch}
      size={size}
      accent="healthy"
    >
      <Icon size={iconSize} className="shrink-0" />
      <span className="leading-none">{label}</span>
    </FilterButton>
  );
}
