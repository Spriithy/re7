import { SearchField, Input } from "react-aria-components";
import { Search } from "lucide-react";
import type { Category } from "@/lib/api-types";
import { FilterBar } from "./FilterBar";
import { MobileFilterDrawer } from "./MobileFilterDrawer";
import { AppHeader } from "@/components/AppHeader";

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
    <AppHeader
      title="Re7"
      subtitle="Découvrez et partagez vos recettes"
      variant="home"
      actions={
        <SearchField
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Rechercher des recettes"
          className="hidden w-64 sm:block lg:w-80"
        >
          <div className="relative">
            <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Rechercher..."
              className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 h-10 w-full rounded-full border bg-white py-2 pr-4 pl-10 text-sm transition focus:ring-2 focus:outline-none"
            />
          </div>
        </SearchField>
      }
    >
      {/* Mobile search */}
      <div className="mt-3 sm:hidden">
        <SearchField
          value={searchQuery}
          onChange={onSearchChange}
          aria-label="Rechercher des recettes"
          className="w-full"
        >
          <div className="relative">
            <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Rechercher une recette..."
              className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 h-10 w-full rounded-full border bg-white py-2 pr-4 pl-10 text-sm transition focus:ring-2 focus:outline-none"
            />
          </div>
        </SearchField>
      </div>

      {/* Mobile filters */}
      <div className="mt-3 sm:hidden">
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

      {/* Tablet filters */}
      <div className="mt-3 hidden sm:block xl:hidden">
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
    </AppHeader>
  );
}
