import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/useAuth";
import { recipeApi } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RecipeForm } from "@/components/recipe-form/RecipeForm";

export const Route = createFileRoute("/recipes/$recipeId/edit")({
  component: EditRecipePage,
});

function EditRecipePage() {
  const navigate = useNavigate();
  const { recipeId } = Route.useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: recipe,
    isLoading: recipeLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => recipeApi.get(recipeId),
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    void navigate({ to: "/login" });
    return null;
  }

  // Check if user can edit (author or admin)
  if (recipe && user && recipe.author.id !== user.id && !user.is_admin) {
    void navigate({
      to: "/recipes/$recipeId",
      params: { recipeId },
    });
    return null;
  }

  if (authLoading || recipeLoading) {
    return (
      <main className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
        <AppHeader
          title="Modifier la recette"
          showBackButton
          backTo={`/recipes/${recipeId}`}
        />
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-ink-500">Chargement...</div>
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

  return (
    <main className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <AppHeader
        title="Modifier la recette"
        showBackButton
        backTo={`/recipes/${recipeId}`}
      />

      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
        <RecipeForm mode="edit" initialData={recipe} />
      </div>
    </main>
  );
}
