import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { recipeApi, getImageUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";
import { ArrowLeft } from "lucide-react";
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
      <main className="bg-paper-50 min-h-screen">
        <div className="fixed top-4 left-4 z-50">
          <Link
            to="/"
            className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 inline-flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm transition md:h-14 md:px-6 md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Link>
        </div>
        <div className="mx-auto max-w-3xl px-4 py-12">
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

  const difficultyLabel =
    recipe.difficulty === "easy"
      ? "Facile"
      : recipe.difficulty === "medium"
        ? "Moyen"
        : "Difficile";

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
