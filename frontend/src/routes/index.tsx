import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button, RadioGroup, Radio, Label } from 'react-aria-components'

// Color palette definitions
const palettes = {
  terracotta: {
    name: 'Terracotta',
    description: 'Orange-rouge terreux',
    preview: ['#fef7f4', '#fbd5c5', '#f29468', '#d4522a', '#752f22'],
    values: {
      50: '#fef7f4', 100: '#fdece4', 200: '#fbd5c5', 300: '#f7b89a', 400: '#f29468',
      500: '#e87042', 600: '#d4522a', 700: '#b14024', 800: '#8f3624', 900: '#752f22', 950: '#3f150e',
    },
  },
  saffron: {
    name: 'Safran',
    description: 'Orange doré, épicé',
    preview: ['#fffbeb', '#fde68a', '#fbbf24', '#d97706', '#78350f'],
    values: {
      50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
      500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03',
    },
  },
  paprika: {
    name: 'Paprika',
    description: 'Rouge profond, chaleureux',
    preview: ['#fef2f2', '#fecaca', '#f87171', '#dc2626', '#7f1d1d'],
    values: {
      50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
      500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a',
    },
  },
  cinnamon: {
    name: 'Cannelle',
    description: 'Brun-rouge épicé',
    preview: ['#fdf4f3', '#f9d2cb', '#e9967a', '#b5503c', '#6b2e1f'],
    values: {
      50: '#fdf4f3', 100: '#fbe8e5', 200: '#f9d2cb', 300: '#f3b0a1', 400: '#e9967a',
      500: '#d97856', 600: '#b5503c', 700: '#93412f', 800: '#7a392c', 900: '#6b2e1f', 950: '#391610',
    },
  },
} as const

type PaletteKey = keyof typeof palettes

function applyPalette(key: PaletteKey) {
  const palette = palettes[key]
  const root = document.documentElement
  Object.entries(palette.values).forEach(([shade, color]) => {
    root.style.setProperty(`--warm-${shade}`, color)
  })
  localStorage.setItem('re7-palette', key)
}

export const Route = createFileRoute('/')({
  component: HomePage,
})

// Mock data for design exploration
const mockRecipes = [
  {
    id: '1',
    title: 'Tarte aux pommes de Mamie',
    description: 'La recette secrète de grand-mère, transmise depuis trois générations.',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=300&fit=crop',
    prepTime: 30,
    cookTime: 45,
    difficulty: 'Facile',
    author: 'Marie',
    likes: 12,
  },
  {
    id: '2',
    title: 'Bœuf bourguignon',
    description: 'Un classique français qui réchauffe les cœurs en hiver.',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&h=300&fit=crop',
    prepTime: 45,
    cookTime: 180,
    difficulty: 'Moyen',
    author: 'Pierre',
    likes: 24,
  },
  {
    id: '3',
    title: 'Mousse au chocolat',
    description: 'Légère et aérienne, parfaite pour terminer un repas.',
    image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=400&h=300&fit=crop',
    prepTime: 20,
    cookTime: 0,
    difficulty: 'Facile',
    author: 'Sophie',
    likes: 18,
  },
]

function HomePage() {
  const [selectedPalette, setSelectedPalette] = useState<PaletteKey>('terracotta')

  useEffect(() => {
    // Load saved palette on mount
    const saved = localStorage.getItem('re7-palette') as PaletteKey | null
    if (saved && saved in palettes) {
      setSelectedPalette(saved)
      applyPalette(saved)
    }
  }, [])

  const handlePaletteChange = (key: string) => {
    const paletteKey = key as PaletteKey
    setSelectedPalette(paletteKey)
    applyPalette(paletteKey)
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-warm-100 to-paper-100 px-4 py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-4xl font-bold text-warm-900 md:text-6xl">
            Re7
          </h1>
          <p className="mt-2 font-heading text-xl text-warm-700 italic md:text-2xl">
            Recettes de famille
          </p>
          <p className="mx-auto mt-6 max-w-xl text-ink-700">
            Partagez vos recettes préférées avec ceux qui comptent.
            Un livre de cuisine familial, toujours à portée de main.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button className="rounded-full bg-warm-600 px-8 py-3 font-semibold text-white transition hover:bg-warm-700 pressed:bg-warm-800">
              Découvrir les recettes
            </Button>
            <Button className="rounded-full border-2 border-warm-600 px-8 py-3 font-semibold text-warm-700 transition hover:bg-warm-50 pressed:bg-warm-100">
              Se connecter
            </Button>
          </div>
        </div>
      </section>

      {/* Recipe Cards Section */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-semibold text-ink-900 md:text-3xl">
            Recettes récentes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Design Exploration Section - Different card styles */}
      <section className="bg-paper-200 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-semibold text-ink-900 md:text-3xl">
            Variantes de design
          </h2>
          <p className="mt-2 text-ink-600">
            Quelques explorations visuelles pour trouver le bon style.
          </p>

          <div className="mt-8 space-y-8">
            {/* Variant A: Compact cards */}
            <div>
              <h3 className="mb-4 font-semibold text-ink-800">A. Cartes compactes</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {mockRecipes.map((recipe) => (
                  <CompactCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>

            {/* Variant B: List style */}
            <div>
              <h3 className="mb-4 font-semibold text-ink-800">B. Style liste</h3>
              <div className="space-y-3">
                {mockRecipes.map((recipe) => (
                  <ListCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Picker */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-heading text-2xl font-semibold text-ink-900 md:text-3xl">
            Choisir la palette
          </h2>
          <p className="mt-2 text-ink-600">
            Sélectionnez une palette de couleurs pour personnaliser l'apparence.
          </p>

          <RadioGroup
            value={selectedPalette}
            onChange={handlePaletteChange}
            aria-label="Palette de couleurs"
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {(Object.keys(palettes) as PaletteKey[]).map((key) => {
              const palette = palettes[key]
              const isSelected = selectedPalette === key
              return (
                <Radio
                  key={key}
                  value={key}
                  className={`group relative cursor-pointer rounded-xl border-2 p-4 transition ${
                    isSelected
                      ? 'border-warm-500 bg-warm-50 ring-2 ring-warm-500 ring-offset-2'
                      : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-paper-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex gap-0.5 rounded-md overflow-hidden shadow-sm">
                      {palette.preview.map((color, i) => (
                        <div
                          key={i}
                          className="h-10 w-5"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <Label className="font-heading text-base font-semibold text-ink-900 cursor-pointer">
                        {palette.name}
                      </Label>
                      <p className="mt-0.5 text-sm text-ink-500">
                        {palette.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckIcon className="h-5 w-5 text-warm-600" />
                    )}
                  </div>
                </Radio>
              )
            })}
          </RadioGroup>

          {/* Current palette preview */}
          <div className="mt-10">
            <h3 className="text-sm font-medium text-ink-700">
              Aperçu : {palettes[selectedPalette].name}
            </h3>
            <div className="mt-3 flex gap-1">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div
                  key={shade}
                  className="h-10 w-10 rounded-md shadow-sm"
                  style={{ backgroundColor: `var(--color-warm-${shade})` }}
                  title={`warm-${shade}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  difficulty: string
  author: string
  likes: number
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <article>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-heading text-lg font-semibold text-ink-900">
              {recipe.title}
            </h3>
            <span className="rounded-full bg-warm-100 px-2 py-0.5 text-xs font-medium text-warm-700">
              {recipe.difficulty}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-ink-600">
            {recipe.description}
          </p>
          <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {recipe.prepTime + recipe.cookTime} min
              </span>
            </div>
            <span className="flex items-center gap-1">
              <HeartIcon className="h-4 w-4" />
              {recipe.likes}
            </span>
          </div>
          <p className="mt-3 text-xs text-ink-400">par {recipe.author}</p>
        </div>
      </article>
    </Link>
  )
}

function CompactCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <article>
        <div className="aspect-square overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-heading text-sm font-semibold text-ink-900 line-clamp-1">
            {recipe.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-500">
            <span>{recipe.prepTime + recipe.cookTime} min</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function ListCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group block"
    >
      <article className="flex gap-4 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="font-heading font-semibold text-ink-900">
            {recipe.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-ink-600">
            {recipe.description}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-ink-500">
            <span>{recipe.prepTime + recipe.cookTime} min</span>
            <span>•</span>
            <span>{recipe.difficulty}</span>
            <span>•</span>
            <span>par {recipe.author}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="flex items-center gap-1 text-sm text-ink-500">
            <HeartIcon className="h-4 w-4" />
            {recipe.likes}
          </span>
        </div>
      </article>
    </Link>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
