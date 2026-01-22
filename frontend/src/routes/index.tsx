import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, SearchField, Input } from "react-aria-components";
import { Search, NotebookPen, ChefHat } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  RecipeMasonryGrid,
  RecipeMasonryGridMinimal,
  mockRecipes,
} from "@/components/recipe-grid";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMinimalGrid, setShowMinimalGrid] = useState(false);

  // Filter recipes based on search
  const filteredRecipes = mockRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-paper-100 min-h-screen">
      {/* Sticky header with search */}
      <header className="bg-paper-100 sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <h1 className="font-heading text-warm-700 text-2xl font-bold">
              Re7
            </h1>
          </div>

          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            aria-label="Rechercher des recettes"
            className="max-w-md flex-1"
          >
            <div className="relative">
              <Search className="text-ink-400 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
              <Input
                placeholder="Rechercher une recette..."
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 h-12 w-full rounded-full border bg-white py-2 pr-4 pl-12 transition focus:ring-2 focus:outline-none"
              />
            </div>
          </SearchField>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Grid style toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-ink-900 text-xl font-semibold">
              Recettes
            </h2>
            <p className="text-ink-500 text-sm">
              {filteredRecipes.length} recette
              {filteredRecipes.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={() => setShowMinimalGrid(false)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${!showMinimalGrid ? "bg-warm-600 text-white" : "text-ink-600 hover:bg-ink-100 bg-white"}`}
            >
              Détaillé
            </Button>
            <Button
              onPress={() => setShowMinimalGrid(true)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${showMinimalGrid ? "bg-warm-600 text-white" : "text-ink-600 hover:bg-ink-100 bg-white"}`}
            >
              Minimal
            </Button>
          </div>
        </div>

        {/* Recipe grid */}
        {showMinimalGrid ? (
          <RecipeMasonryGridMinimal recipes={filteredRecipes} />
        ) : (
          <RecipeMasonryGrid recipes={filteredRecipes} />
        )}

        {/* Empty state */}
        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ChefHat className="text-ink-300 h-16 w-16" />
            <p className="text-ink-600 mt-4 text-lg font-medium">
              Aucune recette trouvée
            </p>
            <p className="text-ink-400 mt-1 text-sm">
              Essayez avec d'autres mots-clés
            </p>
          </div>
        )}
      </main>

      {/* FAB */}
      <Button
        onPress={() =>
          navigate({ to: isAuthenticated ? "/recipes/new" : "/login" })
        }
        className="bg-warm-600 shadow-warm-600/30 hover:bg-warm-700 hover:shadow-warm-600/40 pressed:bg-warm-800 pressed:scale-95 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-xl"
        aria-label="Ajouter une recette"
      >
        <NotebookPen className="h-6 w-6" />
      </Button>
    </div>
  );
}
