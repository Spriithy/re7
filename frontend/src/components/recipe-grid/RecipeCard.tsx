import { Link } from "@tanstack/react-router";
import { Heart, Clock } from "lucide-react";
import type { Recipe } from "./types";
import { getRandomImage, getAspectRatio } from "./utils";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const imageUrl = getRandomImage(recipe.id);
  const aspectRatio = getAspectRatio(recipe.id);
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0);

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group mb-3 block break-inside-avoid"
      preload="intent"
    >
      <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* Image */}
        <div className={`relative overflow-hidden ${aspectRatio}`}>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Like badge */}
          <div className="text-ink-700 absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
            <Heart className="fill-warm-500 text-warm-500 h-3 w-3" />
            {recipe.likes}
          </div>

          {/* Title overlay on image */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="font-heading line-clamp-2 text-base font-semibold text-white drop-shadow-sm">
              {recipe.title}
            </h3>
          </div>
        </div>

        {/* Minimal info below */}
        <div className="px-3 py-2">
          <div className="text-ink-500 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                recipe.difficulty === "Facile"
                  ? "bg-green-100 text-green-700"
                  : recipe.difficulty === "Moyen"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>
          <p className="text-ink-400 mt-1 text-xs">par {recipe.author}</p>
        </div>
      </article>
    </Link>
  );
}
