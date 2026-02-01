import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ApiError,
  recipeApi,
  getImageUrl,
  type Recipe,
  type RecipeCreate,
  type RecipeUpdate,
  type IngredientCreate,
  type StepCreate,
  type Difficulty,
} from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";

const emptyIngredient = (): IngredientCreate => ({
  quantity: null,
  unit: null,
  name: "",
  is_scalable: true,
});

const emptyStep = (): StepCreate => ({
  instruction: "",
  timer_minutes: null,
  note: null,
});

interface UseRecipeFormProps {
  mode: "create" | "edit";
  initialData?: Recipe;
}

export function useRecipeForm({ mode, initialData }: UseRecipeFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initialData?.category?.id ?? null
  );
  const [servings, setServings] = useState(initialData?.servings ?? 4);
  const [servingUnit, setServingUnit] = useState(
    initialData?.serving_unit ?? ""
  );
  const [prepTime, setPrepTime] = useState<number | null>(
    initialData?.prep_time_minutes ?? null
  );
  const [cookTime, setCookTime] = useState<number | null>(
    initialData?.cook_time_minutes ?? null
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialData?.difficulty ?? "medium"
  );
  const [source, setSource] = useState(initialData?.source ?? "");
  const [isVegetarian, setIsVegetarian] = useState(
    initialData?.is_vegetarian ?? false
  );
  const [isVegan, setIsVegan] = useState(initialData?.is_vegan ?? false);
  const [ingredients, setIngredients] = useState<IngredientCreate[]>(() => {
    if (initialData?.ingredients && initialData.ingredients.length > 0) {
      return initialData.ingredients.map((ing) => ({
        quantity: ing.quantity,
        unit: ing.unit,
        name: ing.name,
        is_scalable: ing.is_scalable,
      }));
    }
    return [emptyIngredient()];
  });
  const [steps, setSteps] = useState<StepCreate[]>(() => {
    if (initialData?.steps && initialData.steps.length > 0) {
      return initialData.steps.map((step) => ({
        instruction: step.instruction,
        timer_minutes: step.timer_minutes,
        note: step.note,
      }));
    }
    return [emptyStep()];
  });

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(() =>
    initialData?.image_path ? getImageUrl(initialData.image_path) : null
  );
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // Submission state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ingredient handlers
  const updateIngredient = useCallback(
    (index: number, ingredient: IngredientCreate) => {
      setIngredients((prev) => {
        const newIngredients = [...prev];
        newIngredients[index] = ingredient;
        return newIngredients;
      });
    },
    []
  );

  const removeIngredient = useCallback((index: number) => {
    setIngredients((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const addIngredient = useCallback(() => {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  }, []);

  // Step handlers
  const updateStep = useCallback((index: number, step: StepCreate) => {
    setSteps((prev) => {
      const newSteps = [...prev];
      newSteps[index] = step;
      return newSteps;
    });
  }, []);

  const removeStep = useCallback((index: number) => {
    setSteps((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, emptyStep()]);
  }, []);

  // Image handlers
  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setRemoveExistingImage(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
    if (mode === "edit" && initialData?.image_path) {
      setRemoveExistingImage(true);
    }
  }, [mode, initialData?.image_path]);

  // Form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      if (!token) {
        setError("Vous devez être connecté pour modifier une recette");
        setIsSubmitting(false);
        return;
      }

      // Validate required fields
      if (!title.trim()) {
        setError("Le titre est requis");
        setIsSubmitting(false);
        return;
      }

      // Filter out empty ingredients and steps
      const validIngredients = ingredients.filter((i) => i.name.trim() !== "");
      const validSteps = steps.filter((s) => s.instruction.trim() !== "");

      if (validIngredients.length === 0) {
        setError("Ajoutez au moins un ingrédient");
        setIsSubmitting(false);
        return;
      }

      if (validSteps.length === 0) {
        setError("Ajoutez au moins une étape");
        setIsSubmitting(false);
        return;
      }

      try {
        let recipe: Recipe;

        if (mode === "create") {
          const recipeData: RecipeCreate = {
            title: title.trim(),
            description: description.trim() || null,
            category_id: categoryId,
            servings,
            serving_unit: servingUnit.trim() || null,
            prep_time_minutes: prepTime,
            cook_time_minutes: cookTime,
            difficulty,
            source: source.trim() || null,
            is_vegetarian: isVegetarian,
            is_vegan: isVegan,
            ingredients: validIngredients,
            steps: validSteps,
            prerequisites: [],
          };
          recipe = await recipeApi.create(recipeData, token);
        } else {
          if (!initialData) {
            throw new Error("Initial data is required for edit mode");
          }
          const recipeData: RecipeUpdate = {
            title: title.trim(),
            description: description.trim() || null,
            category_id: categoryId,
            servings,
            serving_unit: servingUnit.trim() || null,
            prep_time_minutes: prepTime,
            cook_time_minutes: cookTime,
            difficulty,
            source: source.trim() || null,
            is_vegetarian: isVegetarian,
            is_vegan: isVegan,
            ingredients: validIngredients,
            steps: validSteps,
            prerequisites: [],
          };
          recipe = await recipeApi.update(initialData.id, recipeData, token);
        }

        // Handle image changes
        if (removeExistingImage && mode === "edit" && initialData?.image_path) {
          await recipeApi.deleteImage(recipe.id, token);
        }

        if (imageFile) {
          await recipeApi.uploadImage(recipe.id, imageFile, token);
        }

        // Invalidate recipe caches to reflect image changes
        void queryClient.invalidateQueries({ queryKey: ["recipes"] });
        void queryClient.invalidateQueries({ queryKey: ["recipe", recipe.id] });

        void navigate({
          to: "/recipes/$recipeId",
          params: { recipeId: recipe.id },
        });
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.detail);
        } else {
          setError("Une erreur est survenue. Veuillez réessayer.");
        }
        setIsSubmitting(false);
      }
    },
    [
      token,
      title,
      description,
      categoryId,
      servings,
      servingUnit,
      prepTime,
      cookTime,
      difficulty,
      source,
      isVegetarian,
      isVegan,
      ingredients,
      steps,
      mode,
      initialData,
      removeExistingImage,
      imageFile,
      navigate,
      queryClient,
    ]
  );

  return {
    // Form state
    title,
    setTitle,
    description,
    setDescription,
    categoryId,
    setCategoryId,
    servings,
    setServings,
    servingUnit,
    setServingUnit,
    prepTime,
    setPrepTime,
    cookTime,
    setCookTime,
    difficulty,
    setDifficulty,
    source,
    setSource,
    isVegetarian,
    setIsVegetarian,
    isVegan,
    setIsVegan,
    ingredients,
    steps,

    // Image state
    imagePreview,
    imageFile,

    // Submission state
    error,
    isSubmitting,

    // Handlers
    updateIngredient,
    removeIngredient,
    addIngredient,
    updateStep,
    removeStep,
    addStep,
    handleImageSelect,
    handleImageRemove,
    handleSubmit,
  };
}
