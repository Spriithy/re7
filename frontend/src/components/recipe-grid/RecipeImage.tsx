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
  const imageUrl = getImageUrl(recipe.image_path);

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
      color={recipe.category?.color ?? "#F97316"}
      className={className}
    />
  );
}
