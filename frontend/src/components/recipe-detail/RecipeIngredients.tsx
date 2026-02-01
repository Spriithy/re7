import type { Ingredient } from "@/lib/api";

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
}

/**
 * Format a quantity for display, removing unnecessary decimals.
 * 4.000 → "4", 1.5 → "1,5", 0.25 → "0,25"
 */
function formatQuantity(quantity: number | string): string {
  // Convert to number in case API returns string
  const num = typeof quantity === "string" ? parseFloat(quantity) : quantity;
  // Use French locale for decimal separator (comma)
  return num.toLocaleString("fr-FR", {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  });
}

export function RecipeIngredients({ ingredients }: RecipeIngredientsProps) {
  return (
    <section className="border-paper-300 print:border-ink-300 border-b py-6">
      <h2 className="font-heading text-ink-900 text-xl font-semibold sm:text-2xl">
        Ingrédients
      </h2>
      <ul className="mt-4 space-y-2 gap-x-8 sm:columns-2 print:columns-2">
        {ingredients
          .sort((a, b) => a.order - b.order)
          .map((ing) => (
            <li
              key={ing.id}
              className="text-ink-800 flex break-inside-avoid items-baseline gap-2"
            >
              <span className="bg-warm-500 print:bg-ink-900 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
              <span>
                {ing.quantity !== null && (
                  <span className="font-medium">
                    {formatQuantity(ing.quantity)}{" "}
                  </span>
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
