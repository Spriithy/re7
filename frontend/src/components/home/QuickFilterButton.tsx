import { Timer } from "lucide-react";
import { FilterButton } from "@/components/ui/FilterButton";

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
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <FilterButton
      isActive={isActive}
      onClick={onClick}
      onPrefetch={onPrefetch}
      size={size}
    >
      <Timer size={iconSize} className="shrink-0" />
      <span className="leading-none">Rapide</span>
    </FilterButton>
  );
}
