import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/useAuth";
import { HomeHeader } from "@/components/home/HomeHeader";
import { RecipeResultsHeader } from "@/components/home/RecipeResultsHeader";
import { RecipeGrid } from "@/components/home/RecipeGrid";
import { EmptyState } from "@/components/home/EmptyState";
import { AddRecipeFAB } from "@/components/home/AddRecipeFAB";
import { FilterSidebar } from "@/components/home/FilterSidebar";
import { useRecipeFilters } from "@/components/home/useRecipeFilters";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    filterVegetarian,
    setFilterVegetarian,
    filterVegan,
    setFilterVegan,
    filterQuick,
    setFilterQuick,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    categories,
    recipes,
    totalCount,
    isLoading: recipesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    activeFilterCount,
    hasActiveFilters,
  } = useRecipeFilters();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    void navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="from-warm-50 to-paper-100 min-h-screen">
      <HomeHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        filterVegetarian={filterVegetarian}
        filterVegan={filterVegan}
        filterQuick={filterQuick}
        activeFilterCount={activeFilterCount}
        isFilterDrawerOpen={isFilterDrawerOpen}
        onFilterDrawerOpenChange={setIsFilterDrawerOpen}
        onCategoryChange={setSelectedCategoryId}
        onVegetarianChange={setFilterVegetarian}
        onVeganChange={setFilterVegan}
        onQuickChange={setFilterQuick}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <main className="min-w-0 flex-1">
            <RecipeResultsHeader
              recipeCount={totalCount}
              filterVegetarian={filterVegetarian}
              filterVegan={filterVegan}
            />

            <RecipeGrid
              recipes={recipes}
              isLoading={recipesLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage ?? false}
              fetchNextPage={fetchNextPage}
            />

            {!recipesLoading && recipes.length === 0 && (
              <EmptyState hasActiveFilters={hasActiveFilters} />
            )}
          </main>

          {/* Filter sidebar - only on xl screens */}
          <div className="hidden xl:block">
            <FilterSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              filterVegetarian={filterVegetarian}
              filterVegan={filterVegan}
              filterQuick={filterQuick}
              searchQuery={searchQuery}
              onCategoryChange={setSelectedCategoryId}
              onVegetarianChange={setFilterVegetarian}
              onVeganChange={setFilterVegan}
              onQuickChange={setFilterQuick}
            />
          </div>
        </div>
      </div>

      <AddRecipeFAB />
    </div>
  );
}
