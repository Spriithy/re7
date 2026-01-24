import type { Category } from "@/lib/api-types";
import { DietFilterButton } from "./DietFilterButton";
import { CategoryFilterButton } from "./CategoryFilterButton";

interface FilterBarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  filterVegetarian: boolean;
  filterVegan: boolean;
  onCategoryChange: (categoryId: string | null) => void;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
}

export function FilterBar({
  categories,
  selectedCategoryId,
  filterVegetarian,
  filterVegan,
  onCategoryChange,
  onVegetarianChange,
  onVeganChange,
}: FilterBarProps) {
  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
      <DietFilterButton
        type="vegetarian"
        isActive={filterVegetarian}
        onClick={() => onVegetarianChange(!filterVegetarian)}
      />
      <DietFilterButton
        type="vegan"
        isActive={filterVegan}
        onClick={() => onVeganChange(!filterVegan)}
      />

      {categories.length > 0 && (
        <>
          <div className="border-ink-200 mx-1 w-px border-l" />
          <CategoryFilterButton
            category={null}
            isActive={selectedCategoryId === null}
            onClick={() => onCategoryChange(null)}
          />
          {categories.map((category) => (
            <CategoryFilterButton
              key={category.id}
              category={category}
              isActive={selectedCategoryId === category.id}
              onClick={() => onCategoryChange(category.id)}
            />
          ))}
        </>
      )}
    </div>
  );
}
