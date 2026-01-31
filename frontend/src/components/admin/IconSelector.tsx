import { Button } from "react-aria-components";
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
  IceCream,
  Pizza,
  Sandwich,
  Carrot,
  Croissant,
  type LucideIcon,
} from "lucide-react";

const iconOptions: { name: string; Icon: LucideIcon }[] = [
  { name: "plats", Icon: CookingPot },
  { name: "entrees", Icon: UtensilsCrossed },
  { name: "viandes", Icon: Beef },
  { name: "poissons", Icon: Fish },
  { name: "soupes-potages", Icon: Soup },
  { name: "salades", Icon: Salad },
  { name: "desserts", Icon: Cake },
  { name: "patisseries", Icon: Cookie },
  { name: "boissons", Icon: Wine },
  { name: "sauces-condiments", Icon: Droplets },
  { name: "petit-dejeuner", Icon: Coffee },
  { name: "viennoiseries", Icon: Croissant },
  { name: "pains", Icon: Wheat },
  { name: "fruits", Icon: Cherry },
  { name: "glaces", Icon: IceCream },
  { name: "pizzas", Icon: Pizza },
  { name: "sandwichs", Icon: Sandwich },
  { name: "healthy", Icon: Carrot },
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelect: (iconName: string) => void;
}

export function IconSelector({ selectedIcon, onSelect }: IconSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {iconOptions.map(({ name, Icon }) => {
        const isSelected = selectedIcon === name;
        return (
          <Button
            key={name}
            type="button"
            onPress={() => onSelect(name)}
            className={`flex size-12 flex-col place-content-center items-center gap-1 rounded-lg border-2 p-2 transition-all ${
              isSelected
                ? "border-warm-500 bg-warm-50 text-warm-700"
                : "hover:border-ink-200 text-ink-500 hover:text-ink-700 border-transparent"
            }`}
            aria-label={name}
            aria-pressed={isSelected}
          >
            <Icon className="h-5 w-5" />
          </Button>
        );
      })}
    </div>
  );
}
