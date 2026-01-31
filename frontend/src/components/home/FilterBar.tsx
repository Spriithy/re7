import type { Category } from "@/lib/api-types";
import { DietFilterButton } from "./DietFilterButton";
import { QuickFilterButton } from "./QuickFilterButton";
import { CategoryFilterButton } from "./CategoryFilterButton";
import { usePrefetchRecipes } from "./usePrefetchRecipes";

interface FilterBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  filterVegetarian: boolean;
  filterVegan: boolean;
  filterQuick: boolean;
  searchQuery?: string;
  onCategoryChange: (categoryId: string | null) => void;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
  onQuickChange: (value: boolean) => void;
}

export function FilterBar({
  categories,
  selectedCategoryId,
  filterVegetarian,
  filterVegan,
  filterQuick,
  searchQuery = "",
  onCategoryChange,
  onVegetarianChange,
  onVeganChange,
  onQuickChange,
}: FilterBarProps) {
  const prefetchRecipes = usePrefetchRecipes();
  return (
    <div className="relative">
      {/* Fade out indicator on the right */}
      <div className="from-paper-100 pointer-events-none absolute top-0 right-0 z-10 h-full w-12 bg-gradient-to-l to-transparent" />

      <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-2">
        {/* Time filter group */}
        <div className="flex flex-shrink-0 flex-col gap-1.5">
          <span className="text-ink-500 px-1 text-[10px] font-semibold tracking-wider uppercase">
            Temps
          </span>
          <div className="flex gap-2">
            <QuickFilterButton
              isActive={filterQuick}
              onClick={() => onQuickChange(!filterQuick)}
              onPrefetch={() =>
                prefetchRecipes({
                  search: searchQuery,
                  category_id: selectedCategoryId,
                  is_vegetarian: filterVegetarian,
                  is_vegan: filterVegan,
                  is_quick: !filterQuick,
                })
              }
            />
          </div>
        </div>

        {/* Diet filters group */}
        <div className="flex flex-shrink-0 flex-col gap-1.5">
          <span className="text-ink-500 px-1 text-[10px] font-semibold tracking-wider uppercase">
            Régimes
          </span>
          <div className="flex gap-2">
            <DietFilterButton
              type="vegetarian"
              isActive={filterVegetarian}
              onClick={() => onVegetarianChange(!filterVegetarian)}
              onPrefetch={() =>
                prefetchRecipes({
                  search: searchQuery,
                  category_id: selectedCategoryId,
                  is_vegetarian: !filterVegetarian,
                  is_vegan: filterVegan,
                  is_quick: filterQuick,
                })
              }
            />
            <DietFilterButton
              type="vegan"
              isActive={filterVegan}
              onClick={() => onVeganChange(!filterVegan)}
              onPrefetch={() =>
                prefetchRecipes({
                  search: searchQuery,
                  category_id: selectedCategoryId,
                  is_vegetarian: filterVegetarian,
                  is_vegan: !filterVegan,
                  is_quick: filterQuick,
                })
              }
            />
          </div>
        </div>

        {/* Category filters group */}
        {categories.length > 0 && (
          <div className="flex flex-shrink-0 flex-col gap-1.5">
            <span className="text-ink-500 px-1 text-[10px] font-semibold tracking-wider uppercase">
              Catégories
            </span>
            <div className="flex gap-2">
              <CategoryFilterButton
                category={null}
                isActive={selectedCategoryId === null}
                onClick={() => onCategoryChange(null)}
                onPrefetch={() =>
                  prefetchRecipes({
                    search: searchQuery,
                    category_id: null,
                    is_vegetarian: filterVegetarian,
                    is_vegan: filterVegan,
                    is_quick: filterQuick,
                  })
                }
              />
              {categories.map((category) => (
                <CategoryFilterButton
                  key={category.id}
                  category={category}
                  isActive={selectedCategoryId === category.id}
                  onClick={() => onCategoryChange(category.id)}
                  onPrefetch={() =>
                    prefetchRecipes({
                      search: searchQuery,
                      category_id: category.id,
                      is_vegetarian: filterVegetarian,
                      is_vegan: filterVegan,
                      is_quick: filterQuick,
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
