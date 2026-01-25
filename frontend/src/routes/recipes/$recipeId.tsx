import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { recipeApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";
import { getDifficultyLabel } from "@/lib/recipe-utils";
import { AppHeader } from "@/components/AppHeader";
import { RecipeDetailNav } from "@/components/recipe-detail/RecipeDetailNav";
import { RecipeHero } from "@/components/recipe-detail/RecipeHero";
import { RecipeMeta } from "@/components/recipe-detail/RecipeMeta";
import { RecipeDescription } from "@/components/recipe-detail/RecipeDescription";
import { RecipePrerequisites } from "@/components/recipe-detail/RecipePrerequisites";
import { RecipeIngredients } from "@/components/recipe-detail/RecipeIngredients";
import { RecipeSteps } from "@/components/recipe-detail/RecipeSteps";

export const Route = createFileRoute("/recipes/$recipeId")({
  component: RecipePage,
});

function RecipePage() {
  const { recipeId } = Route.useParams();
  const { user } = useAuth();

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => recipeApi.get(recipeId),
  });

  if (isLoading) {
    return (
      <main className="from-warm-50 to-paper-100 min-h-screen">
        <AppHeader showBackButton variant="narrow" />
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-ink-100 h-64 rounded-xl" />
            <div className="bg-ink-100 h-8 w-2/3 rounded" />
            <div className="bg-ink-100 h-4 w-1/2 rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    throw error;
  }

  if (!recipe) {
    throw new Error("404 - Recipe not found");
  }

  const difficultyLabel = getDifficultyLabel(recipe.difficulty);

  const canEdit = Boolean(
    user && (user.id === recipe.author.id || user.is_admin)
  );

  return (
    <main className="bg-paper-50 min-h-screen">
      <RecipeDetailNav recipeId={recipeId} canEdit={canEdit} />

      <RecipeHero recipe={recipe} difficultyLabel={difficultyLabel} />

      <div className="mx-auto max-w-3xl px-4 py-5 sm:py-8">
        <RecipeMeta
          prepTimeMinutes={recipe.prep_time_minutes}
          cookTimeMinutes={recipe.cook_time_minutes}
          servings={recipe.servings}
          servingUnit={recipe.serving_unit}
        />

        <RecipeDescription
          description={recipe.description}
          authorUsername={recipe.author.username}
          source={recipe.source}
        />

        <RecipePrerequisites prerequisites={recipe.prerequisites} />

        <RecipeIngredients ingredients={recipe.ingredients} />

        <RecipeSteps steps={recipe.steps} />
      </div>
    </main>
  );
}
