import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { recipeApi } from "@/lib/api";
import { RecipeForm } from "@/components/recipe-form";

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
        <div className="fixed top-4 left-4 z-50">
          <Link
            to="/recipes/$recipeId"
            params={{ recipeId }}
            className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 inline-flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm transition md:h-14 md:px-6 md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Link>
        </div>
        <div className="flex min-h-screen items-center justify-center">
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
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/recipes/$recipeId"
          params={{ recipeId }}
          className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 inline-flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm transition md:h-14 md:px-6 md:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>
      </div>

      <header className="sticky top-0 z-10 px-4 py-4 backdrop-blur-sm sm:p-6">
        <h1 className="font-heading text-ink-900 mx-auto max-w-2xl text-lg leading-8 font-semibold sm:text-xl sm:leading-10">
          Modifier la recette
        </h1>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
        <RecipeForm mode="edit" initialData={recipe} />
      </div>
    </main>
  );
}
