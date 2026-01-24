import { Leaf } from "lucide-react";

interface DietBadgeProps {
  type: "vegetarian" | "vegan";
  size?: "sm" | "md";
}

export function DietBadge({ type, size = "md" }: DietBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
  };

  const iconSize = {
    sm: 12,
    md: 14,
  };

  const isVegan = type === "vegan";
  const label = isVegan ? "Végan" : "Végétarien";
  const bgColor = isVegan ? "bg-green-100" : "bg-green-50";
  const textColor = isVegan ? "text-green-800" : "text-green-700";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${bgColor} ${textColor}`}
    >
      <Leaf size={iconSize[size]} />
      {label}
    </span>
  );
}
