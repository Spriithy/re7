import type { Recipe } from "./types";
import { mockRecipes } from "./constants";
import { MinimalRecipeCard } from "./MinimalRecipeCard";

interface RecipeMasonryGridMinimalProps {
  recipes?: Recipe[];
}

export function RecipeMasonryGridMinimal({
  recipes = mockRecipes,
}: RecipeMasonryGridMinimalProps) {
  return (
    <div className="columns-1 gap-3 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
      {recipes.map((recipe) => (
        <MinimalRecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
