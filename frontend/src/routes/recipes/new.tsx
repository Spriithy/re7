import { useState, useRef } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Button,
  TextField,
  Label,
  Input,
  TextArea,
  Form,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
} from 'react-aria-components'
import { ArrowLeft, Plus, Upload, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ApiError, recipeApi, type RecipeCreate, type IngredientCreate, type StepCreate, type Difficulty } from '@/lib/api'
import { IngredientRow } from '@/components/recipe-form/IngredientRow'
import { StepRow } from '@/components/recipe-form/StepRow'

export const Route = createFileRoute('/recipes/new')({
  component: CreateRecipePage,
})

const DIFFICULTY_LEVELS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Facile' },
  { value: 'medium', label: 'Moyen' },
  { value: 'hard', label: 'Difficile' },
]

const difficultyToIndex = (d: Difficulty): number =>
  DIFFICULTY_LEVELS.findIndex((l) => l.value === d)

const indexToDifficulty = (i: number): Difficulty =>
  DIFFICULTY_LEVELS[i]?.value ?? 'medium'

const emptyIngredient = (): IngredientCreate => ({
  quantity: null,
  unit: null,
  name: '',
  is_scalable: true,
})

const emptyStep = (): StepCreate => ({
  instruction: '',
  timer_minutes: null,
  note: null,
})

function CreateRecipePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, token } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [servings, setServings] = useState(4)
  const [servingUnit, setServingUnit] = useState('')
  const [prepTime, setPrepTime] = useState<number | null>(null)
  const [cookTime, setCookTime] = useState<number | null>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [source, setSource] = useState('')
  const [ingredients, setIngredients] = useState<IngredientCreate[]>([emptyIngredient()])
  const [steps, setSteps] = useState<StepCreate[]>([emptyStep()])

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Submission state
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    void navigate({ to: '/login' })
    return null
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-ink-500">Chargement...</div>
      </main>
    )
  }

  // Ingredient handlers
  const updateIngredient = (index: number, ingredient: IngredientCreate) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = ingredient
    setIngredients(newIngredients)
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const addIngredient = () => {
    setIngredients([...ingredients, emptyIngredient()])
  }

  // Step handlers
  const updateStep = (index: number, step: StepCreate) => {
    const newSteps = [...steps]
    newSteps[index] = step
    setSteps(newSteps)
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const addStep = () => {
    setSteps([...steps, emptyStep()])
  }

  // Image handlers
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Validate required fields
    if (!title.trim()) {
      setError('Le titre est requis')
      setIsSubmitting(false)
      return
    }

    // Filter out empty ingredients and steps
    const validIngredients = ingredients.filter((i) => i.name.trim() !== '')
    const validSteps = steps.filter((s) => s.instruction.trim() !== '')

    if (validIngredients.length === 0) {
      setError('Ajoutez au moins un ingrédient')
      setIsSubmitting(false)
      return
    }

    if (validSteps.length === 0) {
      setError('Ajoutez au moins une étape')
      setIsSubmitting(false)
      return
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
    }

    try {
      const recipe = await recipeApi.create(recipeData, token)

      // Upload image if selected
      if (imageFile) {
        await recipeApi.uploadImage(recipe.id, imageFile, token)
      }

      void navigate({ to: '/recipes/$recipeId', params: { recipeId: recipe.id } })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail)
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-warm-50 to-paper-100">
                <div className="fixed left-4 top-4 z-50">
      <Link
        to="/"
        className="inline-flex h-10 md:h-14 items-center gap-2 rounded-full px-4 md:px-6 py-2 text-sm text-ink-600 transition hover:bg-paper-200/60 hover:text-ink-800 md:text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Link>
    </div> 

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-sm p-6">
          <h1 className="mx-auto max-w-2xl font-heading text-xl leading-10 font-semibold text-ink-900">
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
          {/* Image upload */}
          <section>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="h-48 w-full object-cover"
                />
                <Button
                  onPress={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  aria-label="Supprimer l'image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onPress={() => fileInputRef.current?.click()}
                className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50 text-ink-500 transition hover:border-warm-300 hover:bg-warm-50 hover:text-warm-600"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Ajouter une photo</span>
              </Button>
            )}
          </section>

          {/* Basic info */}
          <section className="space-y-4">
            <TextField isRequired className="space-y-1.5">
              <Label className="text-sm font-medium text-ink-700">
                Titre de la recette
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: Tarte aux pommes de Mamie"
                className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
              />
            </TextField>

            <TextField className="space-y-1.5">
              <Label className="text-sm font-medium text-ink-700">
                Description
              </Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="L'histoire derrière cette recette..."
                rows={3}
                className="w-full resize-none rounded-lg border border-ink-200 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
              />
            </TextField>
          </section>

          {/* Servings & Times */}
          <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-heading text-sm font-semibold text-ink-700">
              Informations
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Servings */}
              <TextField className="space-y-1.5">
                <Label className="text-xs font-medium text-ink-600">
                  Portions
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
                />
              </TextField>

              {/* Serving unit */}
              <TextField className="space-y-1.5">
                <Label className="text-xs font-medium text-ink-600">
                  Unité (optionnel)
                </Label>
                <Input
                  value={servingUnit}
                  onChange={(e) => setServingUnit(e.target.value)}
                  placeholder="ex: biscuits, parts"
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
                />
              </TextField>

              {/* Prep time */}
              <TextField className="space-y-1.5">
                <Label className="text-xs font-medium text-ink-600">
                  Préparation (min)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={prepTime ?? ''}
                  onChange={(e) => setPrepTime(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="—"
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
                />
              </TextField>

              {/* Cook time */}
              <TextField className="space-y-1.5">
                <Label className="text-xs font-medium text-ink-600">
                  Cuisson (min)
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={cookTime ?? ''}
                  onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="—"
                  className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
                />
              </TextField>
            </div>

            {/* Difficulty */}
            <Slider
              value={difficultyToIndex(difficulty)}
              onChange={(val) => setDifficulty(indexToDifficulty(val))}
              minValue={0}
              maxValue={2}
              step={1}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-ink-600">
                  Difficulté
                </Label>
                <SliderOutput className="text-sm font-medium text-warm-700">
                  {({ state }) => DIFFICULTY_LEVELS[state.values[0]]?.label}
                </SliderOutput>
              </div>
              <SliderTrack className="relative h-2 w-full rounded-full bg-ink-100">
                {({ state }) => (
                  <>
                    {/* Filled portion */}
                    <div
                      className="absolute h-full rounded-full bg-warm-500"
                      style={{ width: `${state.getThumbPercent(0) * 100}%` }}
                    />
                    <SliderThumb className="top-1/2 h-5 w-5 rounded-full border-2 border-warm-500 bg-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-warm-500/30 dragging:bg-warm-50" />
                  </>
                )}
              </SliderTrack>
              <div className="flex justify-between text-xs text-ink-400">
                <span>Facile</span>
                <span>Moyen</span>
                <span>Difficile</span>
              </div>
            </Slider>
          </section>

          {/* Ingredients */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-ink-900">
                Ingrédients
              </h3>
              <Button
                onPress={addIngredient}
                className="flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1.5 text-xs font-medium text-warm-700 hover:bg-warm-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <IngredientRow
                  key={index}
                  ingredient={ingredient}
                  index={index}
                  onChange={updateIngredient}
                  onRemove={removeIngredient}
                  canRemove={ingredients.length > 1}
                />
              ))}
            </div>
          </section>

          {/* Steps */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-ink-900">
                Étapes
              </h3>
              <Button
                onPress={addStep}
                className="flex items-center gap-1 rounded-full bg-warm-100 px-3 py-1.5 text-xs font-medium text-warm-700 hover:bg-warm-200"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </Button>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <StepRow
                  key={index}
                  step={step}
                  index={index}
                  onChange={updateStep}
                  onRemove={removeStep}
                  canRemove={steps.length > 1}
                />
              ))}
            </div>
          </section>

          {/* Source (advanced) */}
          <section className="space-y-4">
            <TextField className="space-y-1.5">
              <Label className="text-sm font-medium text-ink-700">
                Source (optionnel)
              </Label>
              <Input
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="ex: Livre de Mamie, site web..."
                className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
              />
            </TextField>
          </section>

          {/* Submit */}
          <div className="sticky bottom-0 -mx-4 px-4 pt-6 pb-4 relative">
            {/* Gradient blur backdrop - fades from bottom to top */}
            <div
              className="absolute inset-0 backdrop-blur-md pointer-events-none"
              style={{
                maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 100%)',
              }}
            />
            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="relative w-full rounded-xl bg-warm-600 px-4 py-3.5 font-semibold text-white transition drop-shadow-[0_8px_25px_rgba(234,88,12,0.4)] hover:bg-warm-700 hover:drop-shadow-[0_12px_35px_rgba(234,88,12,0.5)] pressed:bg-warm-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Création en cours...' : 'Créer la recette'}
            </Button>
          </div>
        </Form>
      </div>
    </main>
  )
}
