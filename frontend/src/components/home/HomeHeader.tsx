import { SearchField, Input } from "react-aria-components";
import { Search } from "lucide-react";
import type { Category } from "@/lib/api-types";
import { FilterBar } from "./FilterBar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";

interface HomeHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategoryId: string | null;
  filterVegetarian: boolean;
  filterVegan: boolean;
  activeFilterCount: number;
  isFilterDrawerOpen: boolean;
  onFilterDrawerOpenChange: (isOpen: boolean) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
}

export function HomeHeader({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategoryId,
  filterVegetarian,
  filterVegan,
  activeFilterCount,
  isFilterDrawerOpen,
  onFilterDrawerOpenChange,
  onCategoryChange,
  onVegetarianChange,
  onVeganChange,
}: HomeHeaderProps) {
  return (
    <header className="bg-paper-100 sticky top-0 z-40 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-warm-700 text-2xl font-bold sm:text-3xl">
              Re7
            </h1>
            <p className="text-ink-500 text-sm sm:text-base">
              Découvrez et partagez vos recettes
            </p>
          </div>

          <SearchField
            value={searchQuery}
            onChange={onSearchChange}
            aria-label="Rechercher des recettes"
            className="w-full sm:max-w-sm"
          >
            <div className="relative">
              <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Rechercher une recette..."
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 h-10 w-full rounded-full border bg-white py-2 pr-4 pl-11 text-sm transition focus:ring-2 focus:outline-none sm:h-12 sm:pl-12 sm:text-base"
              />
            </div>
          </SearchField>
        </div>

        <div className="sm:hidden">
          <MobileFilterDrawer
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            filterVegetarian={filterVegetarian}
            filterVegan={filterVegan}
            activeFilterCount={activeFilterCount}
            searchQuery={searchQuery}
            isOpen={isFilterDrawerOpen}
            onOpenChange={onFilterDrawerOpenChange}
            onCategoryChange={onCategoryChange}
            onVegetarianChange={onVegetarianChange}
            onVeganChange={onVeganChange}
          />
        </div>

        <div className="hidden sm:block xl:hidden">
          <FilterBar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            filterVegetarian={filterVegetarian}
            filterVegan={filterVegan}
            searchQuery={searchQuery}
            onCategoryChange={onCategoryChange}
            onVegetarianChange={onVegetarianChange}
            onVeganChange={onVeganChange}
          />
        </div>
      </div>
    </header>
  );
}
