import type { Category } from "@/lib/api-types";
import { DietFilterButton } from "./DietFilterButton";
import { CategoryFilterButton } from "./CategoryFilterButton";
import { usePrefetchRecipes } from "./usePrefetchRecipes";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  filterVegetarian: boolean;
  filterVegan: boolean;
  searchQuery?: string;
  onCategoryChange: (categoryId: string | null) => void;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
}

export function FilterSidebar({
  categories,
  selectedCategoryId,
  filterVegetarian,
  filterVegan,
  searchQuery = "",
  onCategoryChange,
  onVegetarianChange,
  onVeganChange,
}: FilterSidebarProps) {
  const prefetchRecipes = usePrefetchRecipes();
  return (
    <aside className="sticky top-24 h-fit w-64 shrink-0 p-6">
      {/* Diet filters group */}
      <div className="flex flex-col gap-2">
        <h3 className="text-ink-500 px-1 text-[10px] font-semibold tracking-wider uppercase">
          Régimes
        </h3>
        <div className="flex flex-col gap-1.5">
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
              })
            }
            size="md"
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
              })
            }
            size="md"
          />
        </div>
      </div>

      {/* Category filters group */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          <h3 className="text-ink-500 px-1 text-[10px] font-semibold tracking-wider uppercase">
            Catégories
          </h3>
          <div className="flex flex-col gap-1.5">
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
                })
              }
              size="md"
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
                  })
                }
                size="md"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
