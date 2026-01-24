interface RecipeResultsHeaderProps {
  recipeCount: number;
  filterVegetarian: boolean;
  filterVegan: boolean;
}

export function RecipeResultsHeader({
  recipeCount,
  filterVegetarian,
  filterVegan,
}: RecipeResultsHeaderProps) {
  const getTitle = () => {
    if (filterVegetarian && filterVegan) {
      return "Recettes végétariennes et végétaliennes";
    }
    if (filterVegetarian) {
      return "Recettes végétariennes";
    }
    if (filterVegan) {
      return "Recettes végétaliennes";
    }
    return "Toutes les recettes";
  };

  return (
    <div className="mb-6">
      <h2 className="font-heading text-ink-900 text-lg font-semibold sm:text-xl">
        {getTitle()}
      </h2>
      <p className="text-ink-500 text-sm">
        {recipeCount} recette{recipeCount > 1 ? "s" : ""} trouvée
        {recipeCount > 1 ? "s" : ""}
      </p>
    </div>
  );
}
