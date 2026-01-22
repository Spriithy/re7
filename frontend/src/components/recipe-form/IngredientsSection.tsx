import { Button } from "react-aria-components";
import { Plus } from "lucide-react";
import type { IngredientCreate } from "@/lib/api";
import { IngredientRow } from "./IngredientRow";

interface IngredientsSectionProps {
  ingredients: IngredientCreate[];
  onUpdate: (index: number, ingredient: IngredientCreate) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function IngredientsSection({
  ingredients,
  onUpdate,
  onRemove,
  onAdd,
}: IngredientsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-ink-900 text-lg font-semibold">
          Ingrédients
        </h3>
        <Button
          onPress={onAdd}
          className="bg-warm-100 text-warm-700 hover:bg-warm-200 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-1 sm:space-y-2">
        {ingredients.map((ingredient, index) => (
          <IngredientRow
            key={index}
            ingredient={ingredient}
            index={index}
            onChange={onUpdate}
            onRemove={onRemove}
            canRemove={ingredients.length > 1}
          />
        ))}
      </div>
    </section>
  );
}
