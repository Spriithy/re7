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
  Beef,
  Wheat,
  Cherry,
  Citrus,
  IceCream,
  Pizza,
  Sandwich,
  Carrot,
  Croissant,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  plats: CookingPot,
  entrees: UtensilsCrossed,
  viandes: Beef,
  poissons: Fish,
  "soupes-potages": Soup,
  salades: Salad,
  desserts: Cake,
  patisseries: Cookie,
  boissons: Wine,
  "sauces-condiments": Droplets,
  "petit-dejeuner": Coffee,
  aperitifs: Wine,
  viennoiseries: Croissant,
  pains: Wheat,
  fruits: Cherry,
  agrumes: Citrus,
  glaces: IceCream,
  pizzas: Pizza,
  sandwichs: Sandwich,
  healthy: Carrot,
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
  const Icon = iconMap[iconName] ?? UtensilsCrossed;
  return <Icon className={className} size={size} style={style} />;
}
