import { useState } from "react";
import { TextField, Input, TextArea, Button } from "react-aria-components";
import { Trash2, Timer, StickyNote } from "lucide-react";
import type { StepCreate } from "@/lib/api";

interface StepRowProps {
  step: StepCreate;
  index: number;
  onChange: (index: number, step: StepCreate) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function StepRow({
  step,
  index,
  onChange,
  onRemove,
  canRemove,
}: StepRowProps) {
  const [showTimer, setShowTimer] = useState(step.timer_minutes != null);
  const [showNote, setShowNote] = useState(
    step.note != null && step.note !== ""
  );

  const updateField = <K extends keyof StepCreate>(
    field: K,
    value: StepCreate[K]
  ) => {
    onChange(index, { ...step, [field]: value });
  };

  const toggleTimer = () => {
    if (showTimer) {
      updateField("timer_minutes", null);
    }
    setShowTimer(!showTimer);
  };

  const toggleNote = () => {
    if (showNote) {
      updateField("note", null);
    }
    setShowNote(!showNote);
  };

  return (
    <div className="flex gap-3">
      {/* Step number badge */}
      <div className="bg-warm-100 text-warm-700 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm">
        {index + 1}
      </div>

      <div className="flex-1 space-y-2">
        {/* Instruction */}
        <TextField className="w-full">
          <TextArea
            value={step.instruction}
            onChange={(e) => updateField("instruction", e.target.value)}
            placeholder="Décrivez cette étape..."
            rows={2}
            className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </TextField>

        {/* Optional fields row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timer toggle */}
          <Button
            onPress={toggleTimer}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              showTimer
                ? "bg-warm-100 text-warm-700"
                : "bg-ink-100 text-ink-500 hover:bg-ink-200"
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            Minuteur
          </Button>

          {/* Note toggle */}
          <Button
            onPress={toggleNote}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${
              showNote
                ? "bg-warm-100 text-warm-700"
                : "bg-ink-100 text-ink-500 hover:bg-ink-200"
            }`}
          >
            <StickyNote className="h-3.5 w-3.5" />
            Note
          </Button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Remove button */}
          <Button
            onPress={() => onRemove(index)}
            isDisabled={!canRemove}
            className="text-ink-400 hover:bg-ink-100 hover:text-ink-600 pressed:bg-ink-200 rounded-lg p-1.5 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Supprimer l'étape"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Timer input (conditional) */}
        {showTimer && (
          <div className="flex items-center gap-2">
            <TextField className="w-24">
              <Input
                type="number"
                min="1"
                value={step.timer_minutes ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  updateField(
                    "timer_minutes",
                    val === "" ? null : parseInt(val, 10)
                  );
                }}
                placeholder="Min"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
              />
            </TextField>
            <span className="text-ink-500 text-sm">minutes</span>
          </div>
        )}

        {/* Note input (conditional) */}
        {showNote && (
          <TextField className="w-full">
            <TextArea
              value={step.note ?? ""}
              onChange={(e) => updateField("note", e.target.value || null)}
              placeholder="Astuce, avertissement ou variante..."
              rows={2}
              className="border-ink-200 bg-ink-50 text-ink-700 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full resize-none rounded-lg border border-dashed px-3 py-2 text-sm focus:ring-2 focus:outline-none"
            />
          </TextField>
        )}
      </div>
    </div>
  );
}
