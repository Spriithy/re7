import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import type { RecipeListItem } from "@/lib/api-types";
import { RecipeImage } from "@/components/RecipeImage";
import { recipeHasImage } from "@/lib/recipe-utils";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DietBadge } from "@/components/DietBadge";
import { CreatorAvatar } from "@/components/CreatorAvatar";
import { useRecipePrefetch } from "@/hooks/useRecipePrefetch";

interface RecipeCardProps {
  recipe: RecipeListItem;
}

export const RecipeCard = memo(function RecipeCard({
  recipe,
}: RecipeCardProps) {
  const { prefetchRecipe } = useRecipePrefetch();
  const totalTime =
    (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0);
  const hasImage = recipeHasImage(recipe);

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block"
      preload="intent"
      onMouseEnter={() => prefetchRecipe(recipe.id)}
      onFocus={() => prefetchRecipe(recipe.id)}
    >
      <article className="relative aspect-5/6 overflow-hidden rounded-2xl transition-shadow duration-200">
        {/* Full-bleed image or placeholder */}
        <div className="absolute inset-0 overflow-hidden">
          <RecipeImage
            recipe={recipe}
            className={`h-full ${hasImage ? "transition-transform duration-500 ease-out group-hover:scale-105" : ""}`}
            aspectRatio="auto"
          />
        </div>

        {/* Gradient overlay - only for actual images */}
        {hasImage && (
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
        )}

        {/* Subtle border for placeholder mode to define edges */}
        {!hasImage && (
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 ring-inset" />
        )}

        {/* Category badge — top left */}
        {recipe.category && (
          <div className="absolute top-3 left-3 z-10">
            <CategoryBadge category={recipe.category} size="sm" />
          </div>
        )}

        {/* Diet badges — top right */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          {recipe.is_vegan && <DietBadge type="vegan" size="sm" />}
          {recipe.is_vegetarian && !recipe.is_vegan && (
            <DietBadge type="vegetarian" size="sm" />
          )}
        </div>

        {/* Overlay content — pinned to bottom */}
        <div
          className={`absolute inset-x-0 bottom-0 z-10 p-4 ${
            hasImage ? "text-white" : "text-ink-900"
          }`}
        >
          <h3 className="font-heading mb-1 line-clamp-2 text-xl font-bold">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p
              className={`mb-2 line-clamp-2 text-sm ${hasImage ? "text-white/80" : "text-ink-600"}`}
            >
              {recipe.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 text-xs ${
                hasImage ? "text-white/70" : "text-ink-500"
              }`}
            >
              {totalTime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-white">{totalTime} min</span>
                </span>
              )}
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs ${
                hasImage ? "text-white/70" : "text-ink-500"
              }`}
            >
              <span className="max-w-20 truncate">
                par&nbsp;
                <span className="font-medium text-white">
                  {recipe.author.full_name ?? recipe.author.username}
                </span>
              </span>
              <CreatorAvatar author={recipe.author} size="sm" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});
