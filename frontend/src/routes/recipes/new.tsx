import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
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
      <header className="sticky top-0 z-10 px-4 py-4 backdrop-blur-sm sm:p-6">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            to="/"
            className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 -ml-2 inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm transition md:h-12 md:px-4 md:text-base"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Link>
          <h1 className="font-heading text-ink-900 min-w-0 flex-1 text-lg leading-8 font-semibold sm:text-xl sm:leading-10">
            Nouvelle recette
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
        <RecipeForm mode="create" />
      </div>
    </main>
  );
}
