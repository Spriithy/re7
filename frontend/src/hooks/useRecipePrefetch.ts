import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { recipeApi } from "@/lib/api";

export function useRecipePrefetch() {
  const queryClient = useQueryClient();

  const prefetchRecipe = useCallback(
    (recipeId: string) => {
      void queryClient.prefetchQuery({
        queryKey: ["recipe", recipeId],
        queryFn: () => recipeApi.get(recipeId),
        staleTime: 10000, // 10 seconds for prefetched data
      });
    },
    [queryClient]
  );

  return { prefetchRecipe };
}
