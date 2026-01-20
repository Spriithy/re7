import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button, SearchField, Input, Label } from 'react-aria-components'
import { Search, Plus, ChefHat } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { RecipeMasonryGrid, RecipeMasonryGridMinimal, mockRecipes } from '@/components/RecipeMasonryGrid'
import { FabShowcase } from '@/components/FabShowcase'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [showMinimalGrid, setShowMinimalGrid] = useState(false)

  // Filter recipes based on search
  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-paper-100">
      {/* Sticky header with search */}
      <header className="sticky top-0 z-40 border-b border-warm-200/50 bg-paper-100/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <h1 className="font-heading text-2xl font-bold text-warm-700">
              Re7
            </h1>

            {/* Search */}
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              aria-label="Rechercher des recettes"
              className="flex-1 max-w-md"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <Input
                  placeholder="Rechercher une recette..."
                  className="w-full rounded-full border border-ink-200 bg-white py-2 pl-10 pr-4 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
                />
              </div>
            </SearchField>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Grid style toggle */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-ink-900">
              Recettes
            </h2>
            <p className="text-sm text-ink-500">
              {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={() => setShowMinimalGrid(false)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${!showMinimalGrid ? 'bg-warm-600 text-white' : 'bg-white text-ink-600 hover:bg-ink-100'}`}
            >
              Détaillé
            </Button>
            <Button
              onPress={() => setShowMinimalGrid(true)}
              className={`rounded-lg px-3 py-1.5 text-sm transition ${showMinimalGrid ? 'bg-warm-600 text-white' : 'bg-white text-ink-600 hover:bg-ink-100'}`}
            >
              Minimal
            </Button>
          </div>
        </div>

        {/* Recipe grid */}
        {showMinimalGrid ? (
          <RecipeMasonryGridMinimal recipes={filteredRecipes} />
        ) : (
          <RecipeMasonryGrid recipes={filteredRecipes} />
        )}

        {/* Empty state */}
        {filteredRecipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ChefHat className="h-16 w-16 text-ink-300" />
            <p className="mt-4 text-lg font-medium text-ink-600">Aucune recette trouvée</p>
            <p className="mt-1 text-sm text-ink-400">Essayez avec d'autres mots-clés</p>
          </div>
        )}
      </main>

      {/* FAB Showcase section */}
      <FabShowcase />

      {/* Actual fixed FAB (always visible) */}
      <Button
        onPress={() => navigate({ to: isAuthenticated ? '/' : '/login' })}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all duration-200 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800 pressed:scale-95"
        aria-label="Ajouter une recette"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Button>
    </div>
  )
}
