import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Form } from "react-aria-components";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  ApiError,
  recipeApi,
  type RecipeCreate,
  type IngredientCreate,
  type StepCreate,
  type Difficulty,
} from "@/lib/api";
import {
  ImageUploadSection,
  BasicInfoSection,
  RecipeInfoSection,
  IngredientsSection,
  StepsSection,
  SourceSection,
  SubmitButton,
} from "@/components/recipe-form";

export const Route = createFileRoute("/recipes/new")({
  component: CreateRecipePage,
});

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

function CreateRecipePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, token } = useAuth();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState(4);
  const [servingUnit, setServingUnit] = useState("");
  const [prepTime, setPrepTime] = useState<number | null>(null);
  const [cookTime, setCookTime] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [source, setSource] = useState("");
  const [ingredients, setIngredients] = useState<IngredientCreate[]>([
    emptyIngredient(),
  ]);
  const [steps, setSteps] = useState<StepCreate[]>([emptyStep()]);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Submission state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    void navigate({ to: "/login" });
    return null;
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-ink-500">Chargement...</div>
      </main>
    );
  }

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
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Ensure user is authenticated
    if (!token) {
      setError("Vous devez être connecté pour créer une recette");
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

    try {
      const recipe = await recipeApi.create(recipeData, token);

      // Upload image if selected
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

  return (
    <main className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 inline-flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm transition md:h-14 md:px-6 md:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>
      </div>

      <header className="sticky top-0 z-10 p-6 backdrop-blur-sm">
        <h1 className="font-heading text-ink-900 mx-auto max-w-2xl text-xl leading-10 font-semibold">
          Nouvelle recette
        </h1>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <Form onSubmit={handleSubmit} className="space-y-8">
          <ImageUploadSection
            imagePreview={imagePreview}
            onImageSelect={handleImageSelect}
            onImageRemove={removeImage}
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

          <SubmitButton isSubmitting={isSubmitting} />
        </Form>
      </div>
    </main>
  );
}
