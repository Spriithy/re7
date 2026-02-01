import { Button } from "react-aria-components";
import { Plus } from "lucide-react";
import type { IngredientCreate } from "@/lib/api";
import { FormSection } from "@/components/ui/FormSection";
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
    <FormSection title="Ingrédients" className="">
      <div className="mb-4 flex items-center justify-between">
        <div />
        <Button
          onPress={onAdd}
          className="bg-warm-100 text-warm-700 hover:bg-warm-200 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </Button>
      </div>

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
    </FormSection>
  );
}
