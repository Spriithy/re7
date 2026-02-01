import { TextField, Input, Button } from "react-aria-components";
import { Trash2 } from "lucide-react";
import type { IngredientCreate } from "@/lib/api";
import { FRENCH_COOKING_UNITS } from "@/lib/constants";
import { inputStyles } from "@/components/ui/styles";
import { AdaptiveComboBox } from "@/components/ui/AdaptiveComboBox";

interface IngredientRowProps {
  ingredient: IngredientCreate;
  index: number;
  onChange: (index: number, ingredient: IngredientCreate) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function IngredientRow({
  ingredient,
  index,
  onChange,
  onRemove,
  canRemove,
}: IngredientRowProps) {
  const updateField = <K extends keyof IngredientCreate>(
    field: K,
    value: IngredientCreate[K]
  ) => {
    onChange(index, { ...ingredient, [field]: value });
  };

  return (
    <div className="space-y-2 py-2 sm:flex sm:items-center sm:gap-2 sm:space-y-0 sm:py-0">
      {/* Quantity and Unit - row on mobile */}
      <div className="flex items-start gap-2">
        <TextField
          value={ingredient.quantity?.toString() ?? ""}
          onChange={(val) => {
            updateField("quantity", val === "" ? null : parseFloat(val));
          }}
          className="w-20 shrink-0"
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="Qté"
            className={`${inputStyles} text-sm`}
          />
        </TextField>

        <AdaptiveComboBox
          options={FRENCH_COOKING_UNITS}
          value={ingredient.unit ?? null}
          onChange={(value) => updateField("unit", value)}
          placeholder="Unité"
          drawerTitle="Unité"
          allowCustomValue
          className="flex-1 sm:w-28 sm:flex-none"
        />

        {/* Remove button - responsive sizing */}
        <Button
          onPress={() => onRemove(index)}
          isDisabled={!canRemove}
          className="text-ink-400 hover:bg-ink-100 hover:text-ink-600 pressed:bg-ink-200 flex size-9 shrink-0 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-30 sm:hidden"
          aria-label="Supprimer l'ingrédient"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Name - full width on mobile */}
      <TextField
        value={ingredient.name}
        onChange={(val) => updateField("name", val)}
        className="flex-1"
      >
        <Input placeholder="Nom de l'ingrédient" className={`${inputStyles} text-sm`} />
      </TextField>

      {/* Remove button - hidden on mobile, visible on desktop */}
      <Button
        onPress={() => onRemove(index)}
        isDisabled={!canRemove}
        className="text-ink-400 hover:bg-ink-100 hover:text-ink-600 pressed:bg-ink-200 hidden size-9.5 shrink-0 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-30 sm:flex"
        aria-label="Supprimer l'ingrédient"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
