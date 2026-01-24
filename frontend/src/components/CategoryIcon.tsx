import {
  Salad,
  UtensilsCrossed,
  Coffee,
  Cake,
  Cookie,
  Soup,
  Wine,
  Droplets,
  Fish,
  CookingPot,
  type LucideIcon,
  Beef,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  entrees: UtensilsCrossed,
  viandes: Beef,
  poissons: Fish,
  plats: CookingPot,
  "soupes-potages": Soup,
  salades: Salad,
  desserts: Cake,
  patisseries: Cookie,
  boissons: Wine,
  "sauces-condiments": Droplets,
  "petit-dejeuner": Coffee,
  aperitifs: Wine,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export function CategoryIcon({
  iconName,
  className = "",
  size = 16,
  style,
}: CategoryIconProps) {
  const Icon = iconMap[iconName] || UtensilsCrossed;
  return <Icon className={className} size={size} style={style} />;
}
