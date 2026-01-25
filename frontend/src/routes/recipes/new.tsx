import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { RecipeForm } from "@/components/recipe-form/RecipeForm";

export const Route = createFileRoute("/recipes/new")({
  component: CreateRecipePage,
});

function CreateRecipePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    void navigate({ to: "/login" });
    return null;
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-ink-500">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <AppHeader title="Nouvelle recette" showBackButton variant="narrow" />

      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
        <RecipeForm mode="create" />
      </div>
    </main>
  );
}
