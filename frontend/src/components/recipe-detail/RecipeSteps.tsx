import type { Step } from "@/lib/api";
import { Clock } from "lucide-react";

interface RecipeStepsProps {
  steps: Step[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <section className="py-6">
      <h2 className="font-heading text-ink-900 text-2xl font-semibold">
        Préparation
      </h2>
      <ol className="mt-6 space-y-6">
        {steps
          .sort((a, b) => a.order - b.order)
          .map((step, index) => (
            <li key={step.id} className="flex gap-4">
              <span className="bg-warm-100 font-heading text-warm-700 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold">
                {index + 1}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-ink-800 leading-relaxed">
                  {step.instruction}
                </p>
                {step.timer_minutes && (
                  <button className="bg-warm-100 text-warm-700 hover:bg-warm-200 mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition">
                    <Clock className="h-4 w-4" />
                    {step.timer_minutes} min
                  </button>
                )}
                {step.note && (
                  <p className="text-ink-500 mt-2 text-sm italic">
                    {step.note}
                  </p>
                )}
              </div>
            </li>
          ))}
      </ol>
    </section>
  );
}
