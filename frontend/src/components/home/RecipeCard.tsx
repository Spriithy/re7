import { memo } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, User } from "lucide-react";
import type { RecipeListItem } from "@/lib/api-types";
import { RecipeImage } from "@/components/recipe-grid/RecipeImage";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DietBadge } from "@/components/DietBadge";

interface RecipeCardProps {
  recipe: RecipeListItem;
}

export const RecipeCard = memo(function RecipeCard({
  recipe,
}: RecipeCardProps) {
  const totalTime =
    (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0);

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block"
      preload="intent"
    >
      <article className="relative aspect-[5/6] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 hover:shadow-md">

        {/* Full-bleed image */}
        <div className="absolute inset-0 overflow-hidden">
          <RecipeImage
            recipe={recipe}
            className="h-full transition-transform duration-500 group-hover:scale-105"
            aspectRatio="auto"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

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
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
          <h3 className="font-heading mb-1 line-clamp-2 text-xl font-bold drop-shadow-sm">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="mb-2 line-clamp-2 text-sm text-white/80 drop-shadow-sm">
              {recipe.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-white/70">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {totalTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {recipe.author.full_name ?? recipe.author.username}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
});
