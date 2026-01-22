import { TextField, Input, Button } from "react-aria-components";
import { Trash2 } from "lucide-react";
import type { IngredientCreate } from "@/lib/api";
import { FRENCH_COOKING_UNITS } from "@/lib/constants";
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
        <TextField className="w-20 shrink-0">
          <Input
            type="number"
            step="0.01"
            min="0"
            value={ingredient.quantity ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              updateField("quantity", val === "" ? null : parseFloat(val));
            }}
            placeholder="Qté"
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
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

        {/* Remove button - visible on mobile in this row */}
        <Button
          onPress={() => onRemove(index)}
          isDisabled={!canRemove}
          className="text-ink-400 hover:bg-ink-100 hover:text-ink-600 pressed:bg-ink-200 shrink-0 rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-30 sm:hidden"
          aria-label="Supprimer l'ingrédient"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Name - full width on mobile */}
      <TextField className="flex-1">
        <Input
          value={ingredient.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Nom de l'ingrédient"
          className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
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
