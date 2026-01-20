import { Link } from '@tanstack/react-router'
import { Heart, Clock } from 'lucide-react'

// Placeholder images - food photography from Unsplash
const placeholderImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', // Salad bowl
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80', // Pancakes
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', // Pizza
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', // Veggie bowl
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&q=80', // Pasta
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80', // French toast
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80', // Pasta dish
  'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80', // Soup
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', // Steak plate
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', // Healthy bowl
  'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=600&q=80', // BBQ
  'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&q=80', // Ramen
]

// Seeded random for consistent results per recipe id
function seededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getRandomImage(id: string) {
  const index = seededRandom(id) % placeholderImages.length
  return placeholderImages[index]
}

// Varied aspect ratios for Pinterest effect
const aspectRatios = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/6]']

function getAspectRatio(id: string) {
  const index = seededRandom(id + 'aspect') % aspectRatios.length
  return aspectRatios[index]
}

export interface Recipe {
  id: string
  title: string
  description?: string
  prepTime?: number
  cookTime?: number
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  author: string
  likes: number
}

// Extended mock data for grid
export const mockRecipes: Recipe[] = [
  { id: '1', title: 'Tarte aux pommes de Mamie', description: 'La recette secrète de grand-mère', prepTime: 30, cookTime: 45, difficulty: 'Facile', author: 'Marie', likes: 12 },
  { id: '2', title: 'Bœuf bourguignon', description: 'Un classique qui réchauffe', prepTime: 45, cookTime: 180, difficulty: 'Moyen', author: 'Pierre', likes: 24 },
  { id: '3', title: 'Mousse au chocolat', description: 'Légère et aérienne', prepTime: 20, cookTime: 0, difficulty: 'Facile', author: 'Sophie', likes: 18 },
  { id: '4', title: 'Ratatouille provençale', prepTime: 25, cookTime: 60, difficulty: 'Facile', author: 'Luc', likes: 15 },
  { id: '5', title: 'Blanquette de veau', description: 'Tendreté et sauce onctueuse', prepTime: 30, cookTime: 120, difficulty: 'Moyen', author: 'Marie', likes: 21 },
  { id: '6', title: 'Crêpes bretonnes', prepTime: 15, cookTime: 30, difficulty: 'Facile', author: 'Jean', likes: 33 },
  { id: '7', title: 'Gratin dauphinois', description: 'Crémeux à souhait', prepTime: 20, cookTime: 75, difficulty: 'Facile', author: 'Claire', likes: 27 },
  { id: '8', title: 'Coq au vin', prepTime: 40, cookTime: 150, difficulty: 'Difficile', author: 'Pierre', likes: 19 },
  { id: '9', title: 'Tarte Tatin', description: 'Caramélisée et fondante', prepTime: 25, cookTime: 40, difficulty: 'Moyen', author: 'Sophie', likes: 31 },
  { id: '10', title: 'Soupe à l\'oignon', prepTime: 15, cookTime: 45, difficulty: 'Facile', author: 'Luc', likes: 14 },
  { id: '11', title: 'Quiche lorraine', description: 'L\'authentique', prepTime: 20, cookTime: 35, difficulty: 'Facile', author: 'Marie', likes: 22 },
  { id: '12', title: 'Cassoulet toulousain', prepTime: 60, cookTime: 240, difficulty: 'Difficile', author: 'Jean', likes: 17 },
]

interface RecipeMasonryGridProps {
  recipes?: Recipe[]
}

export function RecipeMasonryGrid({ recipes = mockRecipes }: RecipeMasonryGridProps) {
  return (
    <div className="columns-2 gap-3 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
      {recipes.map((recipe) => (
        <MasonryCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

function MasonryCard({ recipe }: { recipe: Recipe }) {
  const imageUrl = getRandomImage(recipe.id)
  const aspectRatio = getAspectRatio(recipe.id)
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group mb-3 block break-inside-avoid"
    >
      <article className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
        {/* Image */}
        <div className={`relative overflow-hidden ${aspectRatio}`}>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Like badge */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-ink-700 backdrop-blur-sm">
            <Heart className="h-3 w-3 fill-warm-500 text-warm-500" />
            {recipe.likes}
          </div>

          {/* Title overlay on image */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <h3 className="font-heading text-base font-semibold text-white drop-shadow-sm line-clamp-2">
              {recipe.title}
            </h3>
          </div>
        </div>

        {/* Minimal info below */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {totalTime} min
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              recipe.difficulty === 'Facile' ? 'bg-green-100 text-green-700' :
              recipe.difficulty === 'Moyen' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>
              {recipe.difficulty}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-400">par {recipe.author}</p>
        </div>
      </article>
    </Link>
  )
}

// Alternative: Minimal card variant (title only on hover)
export function RecipeMasonryGridMinimal({ recipes = mockRecipes }: RecipeMasonryGridProps) {
  return (
    <div className="columns-2 gap-3 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
      {recipes.map((recipe) => (
        <MinimalMasonryCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

function MinimalMasonryCard({ recipe }: { recipe: Recipe }) {
  const imageUrl = getRandomImage(recipe.id)
  const aspectRatio = getAspectRatio(recipe.id)

  return (
    <Link
      to="/recipes/$recipeId"
      params={{ recipeId: recipe.id }}
      className="group mb-3 block break-inside-avoid"
    >
      <article className="relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <div className={`overflow-hidden ${aspectRatio}`}>
          <img
            src={imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Hover overlay with title */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="p-3">
            <h3 className="font-heading text-sm font-semibold text-white">
              {recipe.title}
            </h3>
            <p className="mt-1 text-xs text-white/80">par {recipe.author}</p>
          </div>
        </div>

        {/* Always visible like count */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-ink-700 backdrop-blur-sm">
          <Heart className="h-3 w-3 fill-warm-500 text-warm-500" />
          {recipe.likes}
        </div>
      </article>
    </Link>
  )
}
