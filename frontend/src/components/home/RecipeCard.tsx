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
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden">
          <RecipeImage
            recipe={recipe}
            className="transition-transform duration-300 group-hover:scale-105"
            aspectRatio="4/3"
          />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-heading text-ink-900 mb-2 line-clamp-2 text-lg font-semibold">
            {recipe.title}
          </h3>

          {recipe.description && (
            <p className="text-ink-500 mb-3 line-clamp-2 text-sm">
              {recipe.description}
            </p>
          )}

          <div className="mt-auto space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {recipe.category && (
                <CategoryBadge category={recipe.category} size="sm" />
              )}
              {recipe.is_vegan && <DietBadge type="vegan" size="sm" />}
              {recipe.is_vegetarian && !recipe.is_vegan && (
                <DietBadge type="vegetarian" size="sm" />
              )}
            </div>

            <div className="text-ink-500 flex items-center justify-between text-xs">
              {totalTime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {totalTime} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {recipe.author.username}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
});
