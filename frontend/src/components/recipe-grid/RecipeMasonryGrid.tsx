import type { Recipe } from "./types";
import { mockRecipes } from "./constants";
import { RecipeCard } from "./RecipeCard";

interface RecipeMasonryGridProps {
  recipes?: Recipe[];
}

export function RecipeMasonryGrid({
  recipes = mockRecipes,
}: RecipeMasonryGridProps) {
  return (
    <div className="columns-2 gap-3 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
