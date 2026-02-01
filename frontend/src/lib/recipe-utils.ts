import type { Difficulty, Recipe, RecipeListItem } from "./api";
import { getImageUrl } from "./api";

/**
 * Get the French label for a recipe difficulty level
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "Facile";
    case "medium":
      return "Moyen";
    case "hard":
      return "Difficile";
  }
}

/**
 * Check if a recipe has a displayable image (recipe image or category image)
 */
export function recipeHasImage(recipe: Recipe | RecipeListItem): boolean {
  const recipeImageUrl = getImageUrl(recipe.image_path);
  const categoryImageUrl = getImageUrl(recipe.category?.image_path ?? null);
  return !!(recipeImageUrl ?? categoryImageUrl);
}
