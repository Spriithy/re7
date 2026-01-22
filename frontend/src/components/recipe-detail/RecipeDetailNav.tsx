import { Link } from "@tanstack/react-router";
import { Button } from "react-aria-components";
import { ArrowLeft, Bookmark, Share2, Pencil } from "lucide-react";

interface RecipeDetailNavProps {
  recipeId?: string;
  canEdit?: boolean;
}

export function RecipeDetailNav({
  recipeId,
  canEdit = false,
}: RecipeDetailNavProps) {
  return (
    <nav className="border-paper-300 bg-paper-50/95 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link
          to="/"
          className="text-ink-600 hover:text-ink-900 flex items-center gap-2 transition"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Retour</span>
        </Link>
        <div className="flex items-center gap-2">
          {canEdit && recipeId && (
            <Link
              to="/recipes/$recipeId/edit"
              params={{ recipeId }}
              className="text-ink-500 hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300 rounded-full p-2 transition"
              aria-label="Modifier la recette"
            >
              <Pencil className="h-5 w-5" />
            </Link>
          )}
          <Button className="text-ink-500 hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300 rounded-full p-2 transition">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button className="text-ink-500 hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300 rounded-full p-2 transition">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
