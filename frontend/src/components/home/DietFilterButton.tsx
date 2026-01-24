import { Leaf, Sprout } from "lucide-react";

interface DietFilterButtonProps {
  type: "vegetarian" | "vegan";
  isActive: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}

export function DietFilterButton({
  type,
  isActive,
  onClick,
  size = "sm",
}: DietFilterButtonProps) {
  const isVegetarian = type === "vegetarian";
  const Icon = isVegetarian ? Leaf : Sprout;
  const label = isVegetarian ? "Végétarien" : "Végétalien";

  const baseStyles =
    "flex flex-shrink-0 items-center gap-1.5 rounded-full font-medium transition";
  const sizeStyles =
    size === "sm" ? "px-3 py-1.5 text-xs" : "gap-2 px-4 py-2.5 text-sm";
  const iconSize = size === "sm" ? 14 : 16;

  const colorStyles = isActive
    ? isVegetarian
      ? "bg-emerald-600 text-white shadow-md"
      : "bg-emerald-700 text-white shadow-md"
    : isVegetarian
      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${colorStyles}`}
      aria-pressed={isActive}
      type="button"
    >
      <Icon
        className="h-3.5 w-3.5"
        style={{ width: iconSize, height: iconSize }}
      />
      {label}
    </button>
  );
}
