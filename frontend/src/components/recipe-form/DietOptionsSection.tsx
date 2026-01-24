import { Checkbox, Label } from "react-aria-components";
import { Leaf, Sprout, Vegan } from "lucide-react";

interface DietOptionsSectionProps {
  isVegetarian: boolean;
  isVegan: boolean;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
}

export function DietOptionsSection({
  isVegetarian,
  isVegan,
  onVegetarianChange,
  onVeganChange,
}: DietOptionsSectionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-ink-900 text-sm font-medium">
        Régime alimentaire
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <Checkbox
          isSelected={isVegetarian}
          onChange={onVegetarianChange}
          className="group cursor-pointer"
        >
          <div className="border-ink-200 hover:border-ink-300 flex items-center gap-2.5 rounded-lg border-2 bg-white px-4 py-3 transition-all group-data-selected:border-emerald-500 group-data-selected:bg-emerald-50 group-data-selected:shadow-sm hover:shadow-sm">
            <div className="border-ink-300 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white transition-all group-data-selected:border-emerald-600 group-data-selected:bg-emerald-600">
              {isVegetarian && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Leaf className="h-4 w-4 text-emerald-600" />
              <span className="text-ink-900 text-sm font-medium">
                Végétarien
              </span>
            </div>
          </div>
        </Checkbox>

        <Checkbox
          isSelected={isVegan}
          onChange={onVeganChange}
          className="group cursor-pointer"
        >
          <div className="border-ink-200 hover:border-ink-300 flex items-center gap-2.5 rounded-lg border-2 bg-white px-4 py-3 transition-all group-data-selected:border-emerald-500 group-data-selected:bg-emerald-50 group-data-selected:shadow-sm hover:shadow-sm">
            <div className="border-ink-300 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 bg-white transition-all group-data-selected:border-emerald-600 group-data-selected:bg-emerald-600">
              {isVegan && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-600" />
              <span className="text-ink-900 text-sm font-medium">Végan</span>
            </div>
          </div>
        </Checkbox>
      </div>
    </div>
  );
}
