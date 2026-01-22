import { Button } from "react-aria-components";
import { Plus } from "lucide-react";
import type { StepCreate } from "@/lib/api";
import { StepRow } from "./StepRow";

interface StepsSectionProps {
  steps: StepCreate[];
  onUpdate: (index: number, step: StepCreate) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

export function StepsSection({
  steps,
  onUpdate,
  onRemove,
  onAdd,
}: StepsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-ink-900 text-lg font-semibold">
          Étapes
        </h3>
        <Button
          onPress={onAdd}
          className="bg-warm-100 text-warm-700 hover:bg-warm-200 flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <StepRow
            key={index}
            step={step}
            index={index}
            onChange={onUpdate}
            onRemove={onRemove}
            canRemove={steps.length > 1}
          />
        ))}
      </div>
    </section>
  );
}
