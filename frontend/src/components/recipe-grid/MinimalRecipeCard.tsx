import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Recipe } from "./types";
import { getRandomImage, getAspectRatio } from "./utils";

interface MinimalRecipeCardProps {
  recipe: Recipe;
}

export function MinimalRecipeCard({ recipe }: MinimalRecipeCardProps) {
  const imageUrl = getRandomImage(recipe.id);
  const aspectRatio = getAspectRatio(recipe.id);

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group mb-3 block break-inside-avoid"
      preload="intent"
    >
      <article className="relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <div className={`overflow-hidden ${aspectRatio}`}>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Hover overlay with title */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="p-3">
            <h3 className="font-heading text-sm font-semibold text-white">
              {recipe.title}
            </h3>
            <p className="mt-1 text-xs text-white/80">par {recipe.author}</p>
          </div>
        </div>

        {/* Always visible like count */}
        <div className="text-ink-700 absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
          <Heart className="fill-warm-500 text-warm-500 h-3 w-3" />
          {recipe.likes}
        </div>
      </article>
    </Link>
  );
}
