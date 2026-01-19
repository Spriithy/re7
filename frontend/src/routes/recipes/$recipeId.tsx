import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from 'react-aria-components'

// Mock data - same as index for now
const mockRecipes: Record<string, Recipe> = {
  '1': {
    id: '1',
    title: 'Tarte aux pommes de Mamie',
    description: 'La recette secrète de grand-mère, transmise depuis trois générations. Cette tarte aux pommes fond littéralement dans la bouche grâce à sa pâte brisée maison et ses pommes caramélisées à la perfection.',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&h=500&fit=crop',
    prepTime: 30,
    cookTime: 45,
    servings: 8,
    difficulty: 'Facile',
    author: 'Marie',
    likes: 12,
    source: 'Carnet de recettes familial',
    ingredients: [
      { quantity: 250, unit: 'g', name: 'farine' },
      { quantity: 125, unit: 'g', name: 'beurre froid, en dés' },
      { quantity: 1, unit: 'pincée', name: 'sel' },
      { quantity: 5, unit: 'cl', name: "eau froide" },
      { quantity: 6, unit: null, name: 'pommes Golden' },
      { quantity: 100, unit: 'g', name: 'sucre' },
      { quantity: 1, unit: 'c. à café', name: 'cannelle' },
      { quantity: 30, unit: 'g', name: 'beurre pour les pommes' },
    ],
    steps: [
      { instruction: 'Préparer la pâte : mélanger la farine et le sel, puis incorporer le beurre froid en travaillant du bout des doigts jusqu\'à obtenir une texture sableuse.', timer: null },
      { instruction: "Ajouter l'eau froide petit à petit et former une boule. Filmer et réfrigérer 30 minutes.", timer: 30 },
      { instruction: 'Préchauffer le four à 180°C.', timer: null },
      { instruction: 'Éplucher et couper les pommes en fines lamelles.', timer: null },
      { instruction: 'Étaler la pâte et la disposer dans un moule à tarte beurré.', timer: null },
      { instruction: 'Disposer les pommes en rosace, saupoudrer de sucre et de cannelle, parsemer de noisettes de beurre.', timer: null },
      { instruction: 'Enfourner et cuire jusqu\'à ce que les pommes soient dorées et la pâte bien cuite.', timer: 45 },
    ],
  },
  '2': {
    id: '2',
    title: 'Bœuf bourguignon',
    description: 'Un classique français qui réchauffe les cœurs en hiver. Ce plat mijoté lentement développe des saveurs profondes et réconfortantes qui rappellent les dimanches en famille.',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&h=500&fit=crop',
    prepTime: 45,
    cookTime: 180,
    servings: 6,
    difficulty: 'Moyen',
    author: 'Pierre',
    likes: 24,
    source: 'Tradition familiale bourguignonne',
    ingredients: [
      { quantity: 1.2, unit: 'kg', name: 'bœuf à braiser (paleron ou macreuse)' },
      { quantity: 200, unit: 'g', name: 'lardons' },
      { quantity: 750, unit: 'ml', name: 'vin rouge de Bourgogne' },
      { quantity: 300, unit: 'g', name: 'champignons de Paris' },
      { quantity: 200, unit: 'g', name: 'petits oignons' },
      { quantity: 3, unit: null, name: 'carottes' },
      { quantity: 2, unit: 'gousses', name: "d'ail" },
      { quantity: 1, unit: null, name: 'bouquet garni' },
      { quantity: 2, unit: 'c. à soupe', name: 'farine' },
      { quantity: null, unit: null, name: 'Sel et poivre' },
    ],
    steps: [
      { instruction: 'Couper la viande en gros cubes. Faire revenir les lardons dans une cocotte, puis les réserver.', timer: null },
      { instruction: 'Dans la même cocotte, faire dorer les morceaux de viande sur toutes les faces. Réserver.', timer: null },
      { instruction: 'Faire revenir les oignons et les carottes coupées en rondelles.', timer: null },
      { instruction: 'Remettre la viande, saupoudrer de farine et mélanger.', timer: null },
      { instruction: "Mouiller avec le vin rouge, ajouter l'ail écrasé et le bouquet garni. Saler et poivrer.", timer: null },
      { instruction: 'Couvrir et laisser mijoter à feu très doux.', timer: 150 },
      { instruction: 'Ajouter les champignons et les lardons, poursuivre la cuisson.', timer: 30 },
      { instruction: 'Servir bien chaud avec des pommes de terre vapeur ou des pâtes fraîches.', timer: null },
    ],
  },
  '3': {
    id: '3',
    title: 'Mousse au chocolat',
    description: 'Légère et aérienne, parfaite pour terminer un repas. Cette mousse au chocolat ne contient que deux ingrédients et fait toujours sensation.',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=800&h=500&fit=crop',
    prepTime: 20,
    cookTime: 0,
    servings: 6,
    difficulty: 'Facile',
    author: 'Sophie',
    likes: 18,
    source: null,
    ingredients: [
      { quantity: 200, unit: 'g', name: 'chocolat noir 70%' },
      { quantity: 6, unit: null, name: 'œufs' },
      { quantity: 1, unit: 'pincée', name: 'sel' },
    ],
    steps: [
      { instruction: 'Faire fondre le chocolat au bain-marie ou au micro-ondes. Laisser tiédir.', timer: null },
      { instruction: 'Séparer les blancs des jaunes. Incorporer les jaunes au chocolat tiède.', timer: null },
      { instruction: 'Monter les blancs en neige ferme avec une pincée de sel.', timer: null },
      { instruction: 'Incorporer délicatement les blancs au mélange chocolat-jaunes en soulevant la masse.', timer: null },
      { instruction: 'Répartir dans des verrines et réfrigérer au moins 4 heures avant de servir.', timer: 240, note: 'Peut se préparer la veille' },
    ],
  },
}

export const Route = createFileRoute('/recipes/$recipeId')({
  component: RecipePage,
})

interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  author: string
  likes: number
  source: string | null
  ingredients: { quantity: number | null; unit: string | null; name: string }[]
  steps: { instruction: string; timer: number | null; note?: string }[]
}

function RecipePage() {
  const { recipeId } = Route.useParams()
  const recipe = mockRecipes[recipeId]

  if (!recipe) {
    return (
      <main className="min-h-screen bg-paper-100 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-3xl font-bold text-ink-900">
            Recette introuvable
          </h1>
          <p className="mt-4 text-ink-600">
            Cette recette n'existe pas ou a été supprimée.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-full bg-warm-600 px-6 py-2 font-semibold text-white transition hover:bg-warm-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </main>
    )
  }

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
      <div className="relative aspect-[16/9] max-h-[400px] w-full overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="mx-auto max-w-3xl">
            <span className="inline-block rounded-full bg-warm-500 px-3 py-1 text-sm font-medium text-white">
              {recipe.difficulty}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 border-b border-paper-300 pb-6 text-sm text-ink-600">
          <span className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            Préparation : {recipe.prepTime} min
          </span>
          {recipe.cookTime > 0 && (
            <span className="flex items-center gap-1.5">
              <FireIcon className="h-4 w-4" />
              Cuisson : {recipe.cookTime} min
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <UsersIcon className="h-4 w-4" />
            {recipe.servings} personnes
          </span>
          <span className="flex items-center gap-1.5">
            <HeartIcon className="h-4 w-4" />
            {recipe.likes}
          </span>
        </div>

        {/* Description */}
        <div className="border-b border-paper-300 py-6">
          <p className="text-lg leading-relaxed text-ink-700 italic">
            {recipe.description}
          </p>
          <p className="mt-4 text-sm text-ink-500">
            Partagée par <span className="font-medium text-warm-700">{recipe.author}</span>
            {recipe.source && (
              <span className="text-ink-400"> • {recipe.source}</span>
            )}
          </p>
        </div>

        {/* Ingredients */}
        <section className="border-b border-paper-300 py-6">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">
            Ingrédients
          </h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((ing, index) => (
              <li
                key={index}
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
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warm-100 font-heading text-lg font-semibold text-warm-700">
                  {index + 1}
                </span>
                <div className="flex-1 pt-1">
                  <p className="text-ink-800 leading-relaxed">{step.instruction}</p>
                  {step.timer && (
                    <button className="mt-2 flex items-center gap-1.5 rounded-full bg-warm-100 px-3 py-1 text-sm font-medium text-warm-700 transition hover:bg-warm-200">
                      <ClockIcon className="h-4 w-4" />
                      {step.timer} min
                    </button>
                  )}
                  {step.note && (
                    <p className="mt-2 text-sm text-ink-500 italic">
                      💡 {step.note}
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
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
  )
}
