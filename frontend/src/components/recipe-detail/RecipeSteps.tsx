import type { Step } from "@/lib/api";
import { Clock } from "lucide-react";

interface RecipeStepsProps {
  steps: Step[];
}

export function RecipeSteps({ steps }: RecipeStepsProps) {
  return (
    <section className="py-6">
      <h2 className="font-heading text-ink-900 text-xl font-semibold sm:text-2xl">
        Préparation
      </h2>
      <ol className="mt-4 space-y-5 sm:mt-6 sm:space-y-6">
        {steps
          .sort((a, b) => a.order - b.order)
          .map((step, index) => (
            <li key={step.id} className="flex gap-3 sm:gap-4">
              <span className="bg-warm-100 font-heading text-warm-700 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold sm:h-8 sm:w-8 sm:text-lg">
                {index + 1}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-ink-800 leading-relaxed">
                  {step.instruction}
                </p>
                {step.timer_minutes != null && step.timer_minutes > 0 ? (
                  <button className="bg-warm-100 text-warm-700 hover:bg-warm-200 mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition">
                    <Clock className="h-4 w-4" />
                    {step.timer_minutes} min
                  </button>
                ) : null}
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
