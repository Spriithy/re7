import { RecipeGrid } from "@/components/home/RecipeGrid";
import type { RecipeListItem } from "@/lib/api";

interface MyRecipesSectionProps {
  recipes: RecipeListItem[];
  isLoading?: boolean;
}

export function MyRecipesSection({
  recipes,
  isLoading = false,
}: MyRecipesSectionProps) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-heading text-ink-900 text-lg font-semibold">
          Mes recettes
        </h2>
        {!isLoading && (
          <span className="bg-warm-100 text-warm-900 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-sm font-medium">
            {recipes.length}
          </span>
        )}
      </div>

      {/* Recipe grid or empty state */}
      {isLoading ? (
        <RecipeGrid recipes={[]} isLoading={true} />
      ) : recipes.length > 0 ? (
        <RecipeGrid recipes={recipes} isLoading={false} />
      ) : (
        <div className="py-12 text-center">
          <p className="text-ink-600 text-lg">
            Vous n'avez pas encore créé de recettes
          </p>
          <p className="text-ink-500 mt-2 text-sm">
            Commencez à partager vos recettes préférées
          </p>
        </div>
      )}
    </div>
  );
}
