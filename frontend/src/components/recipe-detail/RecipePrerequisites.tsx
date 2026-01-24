import { Link } from "@tanstack/react-router";
import type { Prerequisite } from "@/lib/api";

interface RecipePrerequisitesProps {
  prerequisites: Prerequisite[];
}

export function RecipePrerequisites({
  prerequisites,
}: RecipePrerequisitesProps) {
  if (prerequisites.length === 0) {
    return null;
  }

  return (
    <section className="border-paper-300 border-b py-6">
      <h2 className="font-heading text-ink-900 text-2xl font-semibold">
        Prérequis
      </h2>
      <ul className="mt-4 space-y-2">
        {prerequisites
          .sort((a, b) => a.order - b.order)
          .map((prereq) => (
            <li
              key={prereq.id}
              className="text-ink-800 flex items-baseline gap-2"
            >
              <span className="bg-warm-500 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              <Link
                to="/recipes/$recipeId"
                params={{ recipeId: prereq.prerequisite_recipe_id }}
                className="text-warm-700 hover:underline"
                preload="intent"
              >
                {prereq.prerequisite_recipe_title ?? "Recette"}
              </Link>
              {prereq.note && (
                <span className="text-ink-500">({prereq.note})</span>
              )}
            </li>
          ))}
      </ul>
    </section>
  );
}
