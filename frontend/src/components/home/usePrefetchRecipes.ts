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

    // Only include active filters in the key — must match useRecipeFilters
    const activeFilters = {
      ...(search ? { search } : {}),
      ...(category_id ? { category_id } : {}),
      ...(is_vegetarian ? { is_vegetarian: true as const } : {}),
      ...(is_vegan ? { is_vegan: true as const } : {}),
      ...(is_quick ? { is_quick: true as const } : {}),
    };

    // Must use prefetchInfiniteQuery to match useInfiniteQuery in useRecipeFilters
    void queryClient.prefetchInfiniteQuery({
      queryKey: ["recipes", activeFilters],
      queryFn: ({ pageParam = 1 }) =>
        recipeApi.list({
          page: pageParam,
          page_size: PAGE_SIZE,
          search: search ?? undefined,
          category_id: category_id ?? undefined,
          is_vegetarian: is_vegetarian ?? undefined,
          is_vegan: is_vegan ?? undefined,
          is_quick: is_quick ?? undefined,
        }),
      initialPageParam: 1,
    });
  };
}
