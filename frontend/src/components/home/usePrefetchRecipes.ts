import { useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "@/lib/api";

const PAGE_SIZE = 12;

interface PrefetchParams {
  search?: string;
  category_id?: string | null;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_quick?: boolean;
}

export function usePrefetchRecipes() {
  const queryClient = useQueryClient();

  return (params: PrefetchParams) => {
    const { search, category_id, is_vegetarian, is_vegan, is_quick } = params;

    // Query key must exactly match useRecipeFilters.ts for cache to work
    // useRecipeFilters uses: ["recipes", deferredSearchQuery, selectedCategoryId, filterVegetarian, filterVegan, filterQuick]
    void queryClient.prefetchInfiniteQuery({
      queryKey: ["recipes", search, category_id, is_vegetarian, is_vegan, is_quick],
      queryFn: ({ pageParam = 1 }) =>
        recipeApi.list({
          page: pageParam,
          page_size: PAGE_SIZE,
          ...(search ? { search } : {}),
          ...(category_id ? { category_id } : {}),
          ...(is_vegetarian ? { is_vegetarian: true } : {}),
          ...(is_vegan ? { is_vegan: true } : {}),
          ...(is_quick ? { is_quick: true } : {}),
        }),
      initialPageParam: 1,
    });
  };
}
