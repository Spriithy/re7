import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Button,
  SearchField,
  Input,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  Heading,
} from "react-aria-components";
import {
  Search,
  NotebookPen,
  ChefHat,
  Clock,
  User,
  Leaf,
  Sprout,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/useAuth";
import { recipeApi, categoryApi } from "@/lib/api";
import { RecipeImage } from "@/components/recipe-grid/RecipeImage";
import { CategoryBadge } from "@/components/CategoryBadge";
import { DietBadge } from "@/components/DietBadge";
import { CategoryIcon } from "@/components/CategoryIcon";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [filterVegetarian, setFilterVegetarian] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });

  const { data: recipesData, isLoading } = useQuery({
    queryKey: [
      "recipes",
      {
        search: searchQuery,
        category_id: selectedCategoryId,
        is_vegetarian: filterVegetarian,
        is_vegan: filterVegan,
      },
    ],
    queryFn: () =>
      recipeApi.list({
        search: searchQuery || undefined,
        category_id: selectedCategoryId || undefined,
        is_vegetarian: filterVegetarian || undefined,
        is_vegan: filterVegan || undefined,
      }),
  });

  if (!isAuthenticated) {
    void navigate({ to: "/login" });
    return null;
  }

  const recipes = recipesData?.items ?? [];

  // Count active filters
  const activeFilterCount =
    (filterVegetarian ? 1 : 0) +
    (filterVegan ? 1 : 0) +
    (selectedCategoryId ? 1 : 0);

  // Filter buttons component (used in both desktop and mobile drawer)
  const FilterButtons = () => (
    <>
      {/* Diet filters */}
      <button
        onClick={() => setFilterVegetarian(!filterVegetarian)}
        className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          filterVegetarian
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        <Leaf className="h-3.5 w-3.5" />
        Végétarien
      </button>
      <button
        onClick={() => setFilterVegan(!filterVegan)}
        className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          filterVegan
            ? "bg-emerald-700 text-white shadow-md"
            : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
        }`}
      >
        <Sprout className="h-3.5 w-3.5" />
        Végétalien
      </button>

      {/* Category filters */}
      {categories && categories.length > 0 && (
        <>
          <div className="border-ink-200 mx-1 w-px border-l" />
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              selectedCategoryId === null
                ? "bg-warm-600 text-white shadow-md"
                : "bg-warm-50 text-warm-700 hover:bg-warm-100"
            }`}
          >
            Toutes catégories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                selectedCategoryId === category.id
                  ? "bg-warm-600 text-white shadow-md"
                  : "bg-warm-50 text-warm-700 hover:bg-warm-100"
              }`}
            >
              <CategoryIcon
                iconName={category.icon_name}
                className={
                  selectedCategoryId === category.id ? "text-white" : ""
                }
                size={14}
                style={{
                  color:
                    selectedCategoryId === category.id
                      ? "white"
                      : category.color,
                }}
              />
              {category.name}
            </button>
          ))}
        </>
      )}
    </>
  );

  return (
    <div className="bg-paper-100 min-h-screen">
      {/* Sticky header with search */}
      <header className="bg-paper-100 sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:py-5">
          {/* Welcome message and search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-heading text-warm-700 text-2xl font-bold sm:text-3xl">
                Re7
              </h1>
              <p className="text-ink-500 text-sm sm:text-base">
                Découvrez et partagez vos recettes
              </p>
            </div>

            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              aria-label="Rechercher des recettes"
              className="w-full sm:max-w-sm"
            >
              <div className="relative">
                <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 sm:left-4 sm:h-5 sm:w-5" />
                <Input
                  placeholder="Rechercher une recette..."
                  className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 h-10 w-full rounded-full border bg-white py-2 pr-4 pl-11 text-sm transition focus:ring-2 focus:outline-none sm:h-12 sm:pl-12 sm:text-base"
                />
              </div>
            </SearchField>
          </div>

          {/* Mobile filter button */}
          <div className="sm:hidden">
            <DialogTrigger
              isOpen={isFilterDrawerOpen}
              onOpenChange={setIsFilterDrawerOpen}
            >
              <Button className="bg-warm-600 hover:bg-warm-700 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="bg-warm-800 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
              <ModalOverlay
                isDismissable
                className="fixed inset-0 z-50 flex items-end bg-black/50 sm:hidden"
              >
                <Modal>
                  <Dialog className="flex max-h-[80vh] w-full flex-col rounded-t-3xl bg-white shadow-xl outline-none">
                  {({ close }) => (
                    <>
                      <div className="border-ink-200 flex items-center justify-between border-b px-5 py-4">
                        <Heading
                          slot="title"
                          className="text-ink-900 text-lg font-semibold"
                        >
                          Filtres
                        </Heading>
                        <Button
                          onPress={close}
                          className="text-ink-500 hover:text-ink-900 -mr-2 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-5">
                        {/* Diet section */}
                        <div className="mb-5">
                          <h3 className="text-ink-700 mb-3 text-sm font-medium">
                            Régime alimentaire
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                setFilterVegetarian(!filterVegetarian)
                              }
                              className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                                filterVegetarian
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              <Leaf className="h-4 w-4" />
                              Végétarien
                            </button>
                            <button
                              onClick={() => setFilterVegan(!filterVegan)}
                              className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                                filterVegan
                                  ? "bg-emerald-700 text-white shadow-md"
                                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                              }`}
                            >
                              <Sprout className="h-4 w-4" />
                              Végétalien
                            </button>
                          </div>
                        </div>

                        {/* Category section */}
                        {categories && categories.length > 0 && (
                          <div>
                            <h3 className="text-ink-700 mb-3 text-sm font-medium">
                              Catégorie
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setSelectedCategoryId(null)}
                                className={`flex-shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                                  selectedCategoryId === null
                                    ? "bg-warm-600 text-white shadow-md"
                                    : "bg-warm-50 text-warm-700 hover:bg-warm-100"
                                }`}
                              >
                                Toutes catégories
                              </button>
                              {categories.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() =>
                                    setSelectedCategoryId(category.id)
                                  }
                                  className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                                    selectedCategoryId === category.id
                                      ? "bg-warm-600 text-white shadow-md"
                                      : "bg-warm-50 text-warm-700 hover:bg-warm-100"
                                  }`}
                                >
                                  <CategoryIcon
                                    iconName={category.icon_name}
                                    className={
                                      selectedCategoryId === category.id
                                        ? "text-white"
                                        : ""
                                    }
                                    size={16}
                                    style={{
                                      color:
                                        selectedCategoryId === category.id
                                          ? "white"
                                          : category.color,
                                    }}
                                  />
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="border-ink-200 border-t px-5 py-4">
                        <Button
                          onPress={close}
                          className="bg-warm-600 hover:bg-warm-700 w-full rounded-full px-6 py-3 font-medium text-white transition"
                        >
                          Appliquer les filtres
                        </Button>
                      </div>
                    </>
                  )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          </div>

          {/* Desktop filters - hidden on mobile */}
          <div className="scrollbar-hide hidden gap-2 overflow-x-auto pb-2 sm:flex">
            <FilterButtons />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Results header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-ink-900 text-lg font-semibold sm:text-xl">
              {filterVegetarian && filterVegan
                ? "Recettes végétariennes et végétaliennes"
                : filterVegetarian
                  ? "Recettes végétariennes"
                  : filterVegan
                    ? "Recettes végétaliennes"
                    : "Toutes les recettes"}
            </h2>
            <p className="text-ink-500 text-sm">
              {recipes.length} recette{recipes.length > 1 ? "s" : ""} trouvée
              {recipes.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        )}

        {/* Recipe grid */}
        {!isLoading && recipes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => {
              const totalTime =
                (recipe.prep_time_minutes ?? 0) +
                (recipe.cook_time_minutes ?? 0);

              return (
                <Link
                  key={recipe.id}
                  to="/recipes/$recipeId"
                  params={{ recipeId: recipe.id }}
                  className="group block"
                >
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <RecipeImage
                        recipe={recipe}
                        className="transition-transform duration-300 group-hover:scale-105"
                        aspectRatio="4/3"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="font-heading text-ink-900 mb-2 line-clamp-2 text-lg font-semibold">
                        {recipe.title}
                      </h3>

                      {recipe.description && (
                        <p className="text-ink-500 mb-3 line-clamp-2 text-sm">
                          {recipe.description}
                        </p>
                      )}

                      <div className="mt-auto space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {recipe.category && (
                            <CategoryBadge
                              category={recipe.category}
                              size="sm"
                            />
                          )}
                          {recipe.is_vegan && (
                            <DietBadge type="vegan" size="sm" />
                          )}
                          {recipe.is_vegetarian && !recipe.is_vegan && (
                            <DietBadge type="vegetarian" size="sm" />
                          )}
                        </div>

                        <div className="text-ink-500 flex items-center justify-between text-xs">
                          {totalTime > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {totalTime} min
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {recipe.author.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && recipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-warm-100 mb-4 rounded-full p-6">
              <ChefHat className="text-warm-600 h-16 w-16" />
            </div>
            <p className="text-ink-900 font-heading mb-2 text-xl font-semibold">
              Aucune recette trouvée
            </p>
            <p className="text-ink-500 mb-6 max-w-sm text-sm">
              {searchQuery ||
              selectedCategoryId ||
              filterVegetarian ||
              filterVegan
                ? "Essayez avec d'autres critères de recherche"
                : "Commencez à partager vos recettes favorites avec vos proches !"}
            </p>
            {!searchQuery &&
              !selectedCategoryId &&
              !filterVegetarian &&
              !filterVegan && (
                <Button
                  onPress={() => navigate({ to: "/recipes/new" })}
                  className="bg-warm-600 hover:bg-warm-700 rounded-full px-6 py-3 font-medium text-white transition"
                >
                  Créer ma première recette
                </Button>
              )}
          </div>
        )}
      </main>

      {/* FAB */}
      <Button
        onPress={() => navigate({ to: "/recipes/new" })}
        className="bg-warm-600 shadow-warm-600/30 hover:bg-warm-700 hover:shadow-warm-600/40 pressed:bg-warm-800 pressed:scale-95 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-xl"
        aria-label="Ajouter une recette"
      >
        <NotebookPen className="h-6 w-6" />
      </Button>
    </div>
  );
}
