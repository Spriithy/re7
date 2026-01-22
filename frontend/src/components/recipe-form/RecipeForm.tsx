import { useState } from "react";
import { Form } from "react-aria-components";
import { useNavigate } from "@tanstack/react-router";
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
import { useAuth } from "@/lib/auth";
import { ImageUploadSection } from "./ImageUploadSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { RecipeInfoSection } from "./RecipeInfoSection";
import { IngredientsSection } from "./IngredientsSection";
import { StepsSection } from "./StepsSection";
import { SourceSection } from "./SourceSection";
import { SubmitButton } from "./SubmitButton";

interface RecipeFormProps {
  mode: "create" | "edit";
  initialData?: Recipe;
}

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

export function RecipeForm({ mode, initialData }: RecipeFormProps) {
  const navigate = useNavigate();
  const { token } = useAuth();

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
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
  const updateIngredient = (index: number, ingredient: IngredientCreate) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = ingredient;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, emptyIngredient()]);
  };

  // Step handlers
  const updateStep = (index: number, step: StepCreate) => {
    const newSteps = [...steps];
    newSteps[index] = step;
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const addStep = () => {
    setSteps([...steps, emptyStep()]);
  };

  // Image handlers
  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setRemoveExistingImage(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    if (mode === "edit" && initialData?.image_path) {
      setRemoveExistingImage(true);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
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
          servings,
          serving_unit: servingUnit.trim() || null,
          prep_time_minutes: prepTime,
          cook_time_minutes: cookTime,
          difficulty,
          source: source.trim() || null,
          ingredients: validIngredients,
          steps: validSteps,
          prerequisites: [],
        };
        recipe = await recipeApi.create(recipeData, token);
      } else {
        const recipeData: RecipeUpdate = {
          title: title.trim(),
          description: description.trim() || null,
          servings,
          serving_unit: servingUnit.trim() || null,
          prep_time_minutes: prepTime,
          cook_time_minutes: cookTime,
          difficulty,
          source: source.trim() || null,
          ingredients: validIngredients,
          steps: validSteps,
          prerequisites: [],
        };
        recipe = await recipeApi.update(initialData!.id, recipeData, token);
      }

      // Handle image changes
      if (removeExistingImage && mode === "edit" && initialData?.image_path) {
        await recipeApi.deleteImage(recipe.id, token);
      }

      if (imageFile) {
        await recipeApi.uploadImage(recipe.id, imageFile, token);
      }

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
  };

  const submitLabel =
    mode === "create" ? "Créer la recette" : "Enregistrer les modifications";
  const submitLoadingLabel =
    mode === "create" ? "Création en cours..." : "Enregistrement...";

  return (
    <>
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <ImageUploadSection
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
        />

        <BasicInfoSection
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <RecipeInfoSection
          servings={servings}
          servingUnit={servingUnit}
          prepTime={prepTime}
          cookTime={cookTime}
          difficulty={difficulty}
          onServingsChange={setServings}
          onServingUnitChange={setServingUnit}
          onPrepTimeChange={setPrepTime}
          onCookTimeChange={setCookTime}
          onDifficultyChange={setDifficulty}
        />

        <IngredientsSection
          ingredients={ingredients}
          onUpdate={updateIngredient}
          onRemove={removeIngredient}
          onAdd={addIngredient}
        />

        <StepsSection
          steps={steps}
          onUpdate={updateStep}
          onRemove={removeStep}
          onAdd={addStep}
        />

        <SourceSection source={source} onSourceChange={setSource} />

        <SubmitButton
          isSubmitting={isSubmitting}
          label={submitLabel}
          loadingLabel={submitLoadingLabel}
        />
      </Form>
    </>
  );
}
