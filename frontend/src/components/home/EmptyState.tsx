import { Button } from "react-aria-components";
import { ChefHat } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

interface EmptyStateProps {
  hasActiveFilters: boolean;
}

export function EmptyState({ hasActiveFilters }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-warm-100 mb-4 rounded-full p-6">
        <ChefHat className="text-warm-600 h-16 w-16" />
      </div>
      <p className="text-ink-900 font-heading mb-2 text-xl font-semibold">
        Aucune recette trouvée
      </p>
      <p className="text-ink-500 mb-6 max-w-sm text-sm">
        {hasActiveFilters
          ? "Essayez avec d'autres critères de recherche"
          : "Commencez à partager vos recettes favorites avec vos proches !"}
      </p>
      {!hasActiveFilters && (
        <Button
          onPress={() => navigate({ to: "/recipes/new" })}
          className="bg-warm-600 hover:bg-warm-700 rounded-full px-6 py-3 font-medium text-white transition"
        >
          Créer ma première recette
        </Button>
      )}
    </div>
  );
}
