import type { Ingredient } from "@/lib/api";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <section className="border-paper-300 border-b py-6">
      <h2 className="font-heading text-ink-900 text-xl font-semibold sm:text-2xl">
        Ingrédients
      </h2>
      <ul className="mt-4 space-y-2">
        {ingredients
          .sort((a, b) => a.order - b.order)
          .map((ing) => (
            <li key={ing.id} className="text-ink-800 flex items-baseline gap-2">
              <span className="bg-warm-500 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              <span>
                {ing.quantity !== null && (
                  <span className="font-medium">{ing.quantity} </span>
                )}
                {ing.unit && <span>{ing.unit} </span>}
                {ing.name}
              </span>
            </li>
          ))}
      </ul>
    </section>
  );
}
