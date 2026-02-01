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
  const [filterQuick, setFilterQuick] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });

  const {
    data: recipesData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: [
      "recipes",
      searchQuery,
      selectedCategoryId,
      filterVegetarian,
      filterVegan,
      filterQuick,
    ],
    queryFn: () =>
      recipeApi.list({
        search: searchQuery || undefined,
        category_id: selectedCategoryId ?? undefined,
        is_vegetarian: filterVegetarian || undefined,
        is_vegan: filterVegan || undefined,
        is_quick: filterQuick || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const recipes = recipesData?.items ?? [];

  const activeFilterCount =
    (filterVegetarian ? 1 : 0) +
    (filterVegan ? 1 : 0) +
    (filterQuick ? 1 : 0) +
    (selectedCategoryId ? 1 : 0);

  const hasActiveFilters =
    !!searchQuery ||
    !!selectedCategoryId ||
    filterVegetarian ||
    filterVegan ||
    filterQuick;

  return {
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
    isLoading,
    isPending,
    activeFilterCount,
    hasActiveFilters,
  };
}
