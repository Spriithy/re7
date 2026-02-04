import { useState, useDeferredValue } from "react";
import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { recipeApi, categoryApi } from "@/lib/api";

const PAGE_SIZE = 12;

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

  // Defer search updates to prevent UI flickering during rapid typing
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const {
    data,
    isLoading,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPlaceholderData,
  } = useInfiniteQuery({
    queryKey: [
      "recipes",
      deferredSearchQuery,
      selectedCategoryId,
      filterVegetarian,
      filterVegan,
      filterQuick,
    ],
    queryFn: ({ pageParam = 1 }) =>
      recipeApi.list({
        ...(deferredSearchQuery ? { search: deferredSearchQuery } : {}),
        ...(selectedCategoryId ? { category_id: selectedCategoryId } : {}),
        ...(filterVegetarian ? { is_vegetarian: true } : {}),
        ...(filterVegan ? { is_vegan: true } : {}),
        ...(filterQuick ? { is_quick: true } : {}),
        page: pageParam,
        page_size: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page >= lastPage.total_pages ? undefined : lastPage.page + 1,
    placeholderData: keepPreviousData,
  });

  const recipes = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.total ?? 0;

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
    totalCount,
    isLoading,
    isPending,
    isPlaceholderData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    activeFilterCount,
    hasActiveFilters,
  };
}
