import { useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "@/lib/api";

interface PrefetchParams {
  search?: string;
  category_id?: string | null;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
}

export function usePrefetchRecipes() {
  const queryClient = useQueryClient();

  return (params: PrefetchParams) => {
    const { search, category_id, is_vegetarian, is_vegan } = params;

    void queryClient.prefetchQuery({
      queryKey: [
        "recipes",
        {
          search: search ?? "",
          category_id,
          is_vegetarian: is_vegetarian ?? false,
          is_vegan: is_vegan ?? false,
        },
      ],
      queryFn: () =>
        recipeApi.list({
          search: search ?? undefined,
          category_id: category_id ?? undefined,
          is_vegetarian: is_vegetarian ?? undefined,
          is_vegan: is_vegan ?? undefined,
        }),
    });
  };
}
