import { CategoryIcon } from "../CategoryIcon";

interface DefaultCategoryIconProps {
  iconName: string | null;
  className?: string;
  color?: string;
}

export function DefaultCategoryIcon({
  iconName,
  className = "",
  color = "#F97316",
}: DefaultCategoryIconProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <CategoryIcon
        iconName={iconName ?? "entrees"}
        className="h-12 w-12"
        style={{ color: color }}
      />
    </div>
  );
}
