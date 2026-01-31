import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { recipeApi, categoryApi } from "@/lib/api";

export function useRecipeFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });

  // Only include active filters in the query key so inactive filters
  // don't pollute the cache key (e.g. is_vegetarian: false would cause
  // the backend to exclude vegetarian recipes)
  const activeFilters = {
    ...(searchQuery ? { search: searchQuery } : {}),
    ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
    ...(filterVegetarian ? { is_vegetarian: true as const } : {}),
    ...(filterVegan ? { is_vegan: true as const } : {}),
  };

  const {
    data: recipesData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["recipes", activeFilters],
    queryFn: () =>
      recipeApi.list({
        search: searchQuery || undefined,
        category_id: selectedCategoryId ?? undefined,
        is_vegetarian: filterVegetarian || undefined,
        is_vegan: filterVegan || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const recipes = recipesData?.items ?? [];

  const activeFilterCount =
    (filterVegetarian ? 1 : 0) +
    (filterVegan ? 1 : 0) +
    (selectedCategoryId ? 1 : 0);

  const hasActiveFilters =
    !!searchQuery || !!selectedCategoryId || filterVegetarian || filterVegan;

  return {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    filterVegetarian,
    setFilterVegetarian,
    filterVegan,
    setFilterVegan,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    categories,
    recipes,
    isLoading,
    isPending,
    activeFilterCount,
    hasActiveFilters,
  };
}
