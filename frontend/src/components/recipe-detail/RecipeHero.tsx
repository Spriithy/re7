import type { Recipe } from "@/lib/api";
import { getImageUrl } from "@/lib/api";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DietBadge } from "@/components/DietBadge";

interface RecipeHeroProps {
  recipe: Recipe;
  difficultyLabel: string;
}

function PrintMeta({ recipe, difficultyLabel }: RecipeHeroProps) {
  const parts: string[] = [];
  if (recipe.category) parts.push(recipe.category.name);
  parts.push(difficultyLabel);
  if (recipe.is_vegan) parts.push("Végan");
  else if (recipe.is_vegetarian) parts.push("Végétarien");

  return (
    <p className="text-ink-600 mt-1 hidden text-sm print:block">
      {parts.join(" • ")}
    </p>
  );
}

export function RecipeHero({ recipe, difficultyLabel }: RecipeHeroProps) {
  // Check for recipe image, then category image as fallback
  const recipeImageUrl = getImageUrl(recipe.image_path);
  const categoryImageUrl = getImageUrl(recipe.category?.image_path ?? null);
  const imageUrl = recipeImageUrl ?? categoryImageUrl;

  if (imageUrl) {
    return (
      <div className="relative aspect-[16/9] max-h-[400px] w-full overflow-hidden print:max-h-[200px]">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="from-ink-950/60 absolute inset-0 bg-gradient-to-t to-transparent print:hidden" />
        <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6 print:static print:p-0 print:pt-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex flex-wrap gap-2 print:hidden">
              {recipe.category && <CategoryBadge category={recipe.category} />}
              <span className="bg-warm-500 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm">
                {difficultyLabel}
              </span>
              {recipe.is_vegan && <DietBadge type="vegan" />}
              {recipe.is_vegetarian && !recipe.is_vegan && (
                <DietBadge type="vegetarian" />
              )}
            </div>
            <h1 className="font-heading print:text-ink-900 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {recipe.title}
            </h1>
            <PrintMeta recipe={recipe} difficultyLabel={difficultyLabel} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-warm-50 to-paper-50 bg-gradient-to-b px-4 py-6 sm:px-6 sm:py-8 print:bg-none print:py-4">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex flex-wrap gap-2 print:hidden">
          {recipe.category && <CategoryBadge category={recipe.category} />}
          <span className="bg-warm-500 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium text-white sm:px-3 sm:py-1 sm:text-sm">
            {difficultyLabel}
          </span>
          {recipe.is_vegan && <DietBadge type="vegan" />}
          {recipe.is_vegetarian && !recipe.is_vegan && (
            <DietBadge type="vegetarian" />
          )}
        </div>
        <h1 className="font-heading text-ink-900 text-2xl font-bold sm:text-3xl md:text-4xl">
          {recipe.title}
        </h1>
        <PrintMeta recipe={recipe} difficultyLabel={difficultyLabel} />
      </div>
    </div>
  );
}
