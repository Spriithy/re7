import { Link } from "@tanstack/react-router";
import { Button } from "react-aria-components";
import { Bookmark, Share2, Pencil } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

interface RecipeDetailNavProps {
  recipeId?: string;
  canEdit?: boolean;
}

export function RecipeDetailNav({
  recipeId,
  canEdit = false,
}: RecipeDetailNavProps) {
  const actionButtons = (
    <div className="flex items-center gap-1">
      {canEdit && recipeId && (
        <Link
          to="/recipes/$recipeId/edit"
          params={{ recipeId }}
          className="text-ink-500 hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300 rounded-full p-2 transition"
          aria-label="Modifier la recette"
          preload="intent"
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
  );

  return <AppHeader showBackButton actions={actionButtons} />;
}
