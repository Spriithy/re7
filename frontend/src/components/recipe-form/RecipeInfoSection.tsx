import {
  TextField,
  Label,
  Input,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
} from "react-aria-components";
import type { Difficulty } from "@/lib/api";

const DIFFICULTY_LEVELS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

const difficultyToIndex = (d: Difficulty): number =>
  DIFFICULTY_LEVELS.findIndex((l) => l.value === d);

const indexToDifficulty = (i: number): Difficulty =>
  DIFFICULTY_LEVELS[i]?.value ?? "medium";

interface RecipeInfoSectionProps {
  servings: number;
  servingUnit: string;
  prepTime: number | null;
  cookTime: number | null;
  difficulty: Difficulty;
  onServingsChange: (value: number) => void;
  onServingUnitChange: (value: string) => void;
  onPrepTimeChange: (value: number | null) => void;
  onCookTimeChange: (value: number | null) => void;
  onDifficultyChange: (value: Difficulty) => void;
}

export function RecipeInfoSection({
  servings,
  servingUnit,
  prepTime,
  cookTime,
  difficulty,
  onServingsChange,
  onServingUnitChange,
  onPrepTimeChange,
  onCookTimeChange,
  onDifficultyChange,
}: RecipeInfoSectionProps) {
  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <h3 className="font-heading text-ink-700 text-sm font-semibold">
        Informations
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <TextField className="space-y-1.5">
          <Label className="text-ink-600 text-xs font-medium">Portions</Label>
          <Input
            type="number"
            min="1"
            value={servings}
            onChange={(e) => onServingsChange(parseInt(e.target.value) || 1)}
            className="border-ink-200 text-ink-900 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </TextField>

        <TextField className="space-y-1.5">
          <Label className="text-ink-600 text-xs font-medium">
            Unité (optionnel)
          </Label>
          <Input
            value={servingUnit}
            onChange={(e) => onServingUnitChange(e.target.value)}
            placeholder="ex: biscuits, parts"
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </TextField>

        <TextField className="space-y-1.5">
          <Label className="text-ink-600 text-xs font-medium">
            Préparation (min)
          </Label>
          <Input
            type="number"
            min="1"
            value={prepTime ?? ""}
            onChange={(e) =>
              onPrepTimeChange(e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="—"
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </TextField>

        <TextField className="space-y-1.5">
          <Label className="text-ink-600 text-xs font-medium">
            Cuisson (min)
          </Label>
          <Input
            type="number"
            min="1"
            value={cookTime ?? ""}
            onChange={(e) =>
              onCookTimeChange(e.target.value ? parseInt(e.target.value) : null)
            }
            placeholder="—"
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </TextField>
      </div>

      <Slider
        value={difficultyToIndex(difficulty)}
        onChange={(val) => onDifficultyChange(indexToDifficulty(val))}
        minValue={0}
        maxValue={2}
        step={1}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <Label className="text-ink-600 text-xs font-medium">Difficulté</Label>
          <SliderOutput className="text-warm-700 text-sm font-medium">
            {({ state }) => DIFFICULTY_LEVELS[state.values[0]]?.label}
          </SliderOutput>
        </div>
        <SliderTrack className="bg-ink-100 relative h-2 w-full rounded-full">
          {({ state }) => (
            <>
              <div
                className="bg-warm-500 absolute h-full rounded-full"
                style={{ width: `${state.getThumbPercent(0) * 100}%` }}
              />
              <SliderThumb className="border-warm-500 focus:ring-warm-500/30 dragging:bg-warm-50 top-1/2 h-5 w-5 rounded-full border-2 bg-white shadow-sm transition focus:ring-2 focus:outline-none" />
            </>
          )}
        </SliderTrack>
        <div className="text-ink-400 flex justify-between text-xs">
          <span>Facile</span>
          <span>Moyen</span>
          <span>Difficile</span>
        </div>
      </Slider>
    </section>
  );
}
