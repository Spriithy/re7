import type { Recipe, RecipeListItem } from "@/lib/api";
import { getImageUrl } from "@/lib/api";
import { DefaultCategoryIcon } from "./DefaultCategoryIcon";

interface RecipeImageProps {
  recipe: Recipe | RecipeListItem;
  className?: string;
  aspectRatio?: string;
}

export function RecipeImage({
  recipe,
  className = "",
  aspectRatio = "1/1",
}: RecipeImageProps) {
  // Fallback chain: recipe image → category image → category icon
  const recipeImageUrl = getImageUrl(recipe.image_path);
  const categoryImageUrl = getImageUrl(recipe.category?.image_path ?? null);
  const imageUrl = recipeImageUrl ?? categoryImageUrl;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={recipe.title}
        className={`w-full object-cover ${className}`}
        style={{ aspectRatio }}
      />
    );
  }

  return (
    <DefaultCategoryIcon
      iconName={recipe.category?.icon_name ?? null}
      className={className}
    />
  );
}
