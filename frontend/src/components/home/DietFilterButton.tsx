import { Leaf, Sprout } from "lucide-react";

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

  const baseStyles =
    "flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 border";
  const sizeStyles =
    size === "sm"
      ? "flex-shrink-0 px-3 py-1.5 text-xs"
      : "w-full justify-center gap-2 px-3 py-2 text-xs";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? "bg-emerald-700 text-white shadow-md border-emerald-700"
    : "bg-emerald-50/40 text-emerald-800 border-emerald-300 hover:bg-emerald-100";

  return (
    <button
      onClick={onClick}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
      aria-pressed={isActive}
      type="button"
    >
      <Icon
        className="shrink-0"
        style={{ width: iconSize, height: iconSize }}
      />
      <span className="leading-none">{label}</span>
    </button>
  );
}
