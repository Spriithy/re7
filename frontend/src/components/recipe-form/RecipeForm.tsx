import { Form } from "react-aria-components";
import type { Recipe } from "@/lib/api";
import { useRecipeForm } from "./useRecipeForm";
import { ImageUploadSection } from "./ImageUploadSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { CategorySection } from "./CategorySection";
import { DietOptionsSection } from "./DietOptionsSection";
import { RecipeInfoSection } from "./RecipeInfoSection";
import { IngredientsSection } from "./IngredientsSection";
import { StepsSection } from "./StepsSection";
import { SourceSection } from "./SourceSection";
import { SubmitButton } from "./SubmitButton";

interface RecipeFormProps {
  mode: "create" | "edit";
  initialData?: Recipe;
}

export function RecipeForm({ mode, initialData }: RecipeFormProps) {
  const {
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
    imagePreview,
    error,
    isSubmitting,
    updateIngredient,
    removeIngredient,
    addIngredient,
    updateStep,
    removeStep,
    addStep,
    handleImageSelect,
    handleImageRemove,
    handleSubmit,
  } = useRecipeForm({ mode, initialData });

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

        <CategorySection value={categoryId} onChange={setCategoryId} />

        <DietOptionsSection
          isVegetarian={isVegetarian}
          isVegan={isVegan}
          onVegetarianChange={setIsVegetarian}
          onVeganChange={setIsVegan}
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
