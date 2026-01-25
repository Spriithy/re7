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
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-heading font-semibold text-ink-900">
          Mes recettes
        </h2>
        {!isLoading && (
          <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 bg-warm-100 text-warm-900 text-sm font-medium rounded-full">
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
          <p className="text-ink-500 text-sm mt-2">
            Commencez à partager vos recettes préférées
          </p>
        </div>
      )}
    </div>
  );
}
