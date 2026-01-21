import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'react-aria-components'
import { recipeApi, getImageUrl } from '@/lib/api'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/recipes/$recipeId')({
  component: RecipePage,
})

function RecipePage() {
  const { recipeId } = Route.useParams()

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => recipeApi.get(recipeId),
  })

  if (isLoading) {
    return (
      <main className="min-h-screen bg-paper-50">
    <div className="fixed left-4 top-4 z-50">
      <Link
        to="/"
        className="inline-flex h-10 md:h-14 items-center gap-2 rounded-full px-4 md:px-6 py-2 text-sm text-ink-600 transition hover:bg-paper-200/60 hover:text-ink-800 md:text-base"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Link>
    </div>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-64 rounded-xl bg-ink-100" />
            <div className="h-8 w-2/3 rounded bg-ink-100" />
            <div className="h-4 w-1/2 rounded bg-ink-100" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    throw error
  }

  if (!recipe) {
    throw new Error('404 - Recipe not found')
  }

  const imageUrl = getImageUrl(recipe.image_path)
  const _totalTime = (recipe.prep_time_minutes ?? 0) + (recipe.cook_time_minutes ?? 0)

  // Map difficulty to French
  const difficultyLabel =
    recipe.difficulty === 'easy'
      ? 'Facile'
      : recipe.difficulty === 'medium'
        ? 'Moyen'
        : 'Difficile'

  return (
    <main className="min-h-screen bg-paper-50">
      {/* Back navigation */}
      <nav className="sticky top-0 z-10 border-b border-paper-300 bg-paper-50/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-ink-600 transition hover:text-ink-900"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button className="rounded-full p-2 text-ink-500 transition hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300">
              <BookmarkIcon className="h-5 w-5" />
            </Button>
            <Button className="rounded-full p-2 text-ink-500 transition hover:bg-paper-200 hover:text-warm-600 pressed:bg-paper-300">
              <ShareIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero image */}
      {imageUrl ? (
        <div className="relative aspect-[16/9] max-h-[400px] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mx-auto max-w-3xl">
              <span className="inline-block rounded-full bg-warm-500 px-3 py-1 text-sm font-medium text-white">
                {difficultyLabel}
              </span>
              <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
                {recipe.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-b from-warm-50 to-paper-50 px-6 py-8">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full bg-warm-500 px-3 py-1 text-sm font-medium text-white">
              {difficultyLabel}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-ink-900 md:text-4xl">
              {recipe.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 border-b border-paper-300 pb-6 text-sm text-ink-600">
          {recipe.prep_time_minutes && (
            <span className="flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4" />
              Préparation : {recipe.prep_time_minutes} min
            </span>
          )}
          {recipe.cook_time_minutes && recipe.cook_time_minutes > 0 && (
            <span className="flex items-center gap-1.5">
              <FireIcon className="h-4 w-4" />
              Cuisson : {recipe.cook_time_minutes} min
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4" />
            {recipe.servings} {recipe.serving_unit ?? 'personnes'}
          </span>
        </div>

        {/* Description */}
        {(recipe.description || recipe.author || recipe.source) && (
          <div className="border-b border-paper-300 py-6">
            {recipe.description && (
              <p className="text-lg leading-relaxed text-ink-700 italic">
                {recipe.description}
              </p>
            )}
            <p className="mt-4 text-sm text-ink-500">
              Partagée par{' '}
              <span className="font-medium text-warm-700">
                {recipe.author.username}
              </span>
              {recipe.source && (
                <span className="text-ink-400"> • {recipe.source}</span>
              )}
            </p>
          </div>
        )}

        {/* Prerequisites */}
        {recipe.prerequisites.length > 0 && (
          <section className="border-b border-paper-300 py-6">
            <h2 className="font-heading text-2xl font-semibold text-ink-900">
              Prérequis
            </h2>
            <ul className="mt-4 space-y-2">
              {recipe.prerequisites
                .sort((a, b) => a.order - b.order)
                .map((prereq) => (
                  <li
                    key={prereq.id}
                    className="flex items-baseline gap-2 text-ink-800"
                  >
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                    <Link
                      to="/recipes/$recipeId"
                      params={{ recipeId: prereq.prerequisite_recipe_id }}
                      className="text-warm-700 hover:underline"
                    >
                      {prereq.prerequisite_recipe_title ?? 'Recette'}
                    </Link>
                    {prereq.note && (
                      <span className="text-ink-500">({prereq.note})</span>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Ingredients */}
        <section className="border-b border-paper-300 py-6">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">
            Ingrédients
          </h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients
              .sort((a, b) => a.order - b.order)
              .map((ing) => (
                <li
                  key={ing.id}
                  className="flex items-baseline gap-2 text-ink-800"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                  <span>
                    {ing.quantity !== null && (
                      <span className="font-medium">{ing.quantity} </span>
                    )}
                    {ing.unit && <span>{ing.unit} </span>}
                    {ing.name}
                  </span>
                </li>
              ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="py-6">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">
            Préparation
          </h2>
          <ol className="mt-6 space-y-6">
            {recipe.steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <li key={step.id} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warm-100 font-heading text-lg font-semibold text-warm-700">
                    {index + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-ink-800 leading-relaxed">
                      {step.instruction}
                    </p>
                    {step.timer_minutes && (
                      <button className="mt-2 flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-sm font-medium text-warm-700 transition hover:bg-warm-200">
                        <ClockIcon className="h-4 w-4" />
                        {step.timer_minutes} min
                      </button>
                    )}
                    {step.note && (
                      <p className="mt-2 text-sm text-ink-500 italic">
                        {step.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        </section>
      </div>
    </main>
  )
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
      />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  )
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
      />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  )
}
