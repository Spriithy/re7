import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { RecipeListItem } from "@/lib/api-types";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { RecipeCard } from "./RecipeCard";

interface RecipeGridProps {
  recipes: RecipeListItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export function RecipeGrid({
  recipes,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: RecipeGridProps) {
  const { ref: loadMoreRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "200px",
    enabled: hasNextPage && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    );
  }

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={loadMoreRef} className="mt-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-warm-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        )}
        {!hasNextPage && recipes.length > 0 && (
          <p className="text-sm text-stone-500">
            Vous avez vu toutes les recettes
          </p>
        )}
      </div>
    </div>
  );
}
