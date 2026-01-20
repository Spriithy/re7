import { Button } from 'react-aria-components'
import {
  Plus,
  ChefHat,
  UtensilsCrossed,
  CookingPot,
  Soup,
  BookOpen,
  PenLine,
  Sparkles
} from 'lucide-react'

interface FabVariant {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  className: string
}

const fabVariants: FabVariant[] = [
  {
    id: 'classic',
    name: 'Classique',
    description: 'Simple et efficace',
    icon: <Plus className="h-6 w-6" strokeWidth={2.5} />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
  {
    id: 'chef-hat',
    name: 'Toque',
    description: 'Icône de chef',
    icon: <ChefHat className="h-6 w-6" />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
  {
    id: 'utensils',
    name: 'Couverts',
    description: 'Fourchette & couteau croisés',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
  {
    id: 'cooking-pot',
    name: 'Marmite',
    description: 'Casserole fumante',
    icon: <CookingPot className="h-6 w-6" />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
  {
    id: 'soup-bowl',
    name: 'Bol',
    description: 'Bol de soupe',
    icon: <Soup className="h-6 w-6" />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
  {
    id: 'book-pen',
    name: 'Carnet',
    description: 'Livre de recettes + stylo',
    icon: (
      <span className="relative">
        <BookOpen className="h-6 w-6" />
        <PenLine className="absolute -right-1 -top-1 h-3 w-3" strokeWidth={3} />
      </span>
    ),
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800',
  },
]

// Different shape/style variations
// Colorful SVG icon designs
const svgVariants: FabVariant[] = [
  {
    id: 'pot-steam',
    name: 'Marmite fumante',
    description: 'Pot coloré avec vapeur',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Steam wisps */}
        <path d="M9 6C9 4 10 2 10 2" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 5C14 3 15 1 15 1" stroke="#FB923C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M19 6C19 4 20 2 20 2" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pot body */}
        <ellipse cx="14" cy="16" rx="9" ry="4" fill="#DC2626" />
        <rect x="5" y="12" width="18" height="8" rx="2" fill="#EF4444" />
        <rect x="5" y="12" width="18" height="3" fill="#DC2626" />
        {/* Lid */}
        <ellipse cx="14" cy="11" rx="10" ry="3" fill="#B91C1C" />
        <ellipse cx="14" cy="10.5" rx="10" ry="2.5" fill="#DC2626" />
        {/* Lid handle */}
        <ellipse cx="14" cy="8" rx="2" ry="1" fill="#78350F" />
        {/* Handles */}
        <rect x="1" y="14" width="4" height="2" rx="1" fill="#78350F" />
        <rect x="23" y="14" width="4" height="2" rx="1" fill="#78350F" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
  {
    id: 'chef-toque',
    name: 'Toque colorée',
    description: 'Chapeau de chef décoré',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Hat puffs */}
        <circle cx="8" cy="10" r="5" fill="#FBBF24" />
        <circle cx="14" cy="7" r="6" fill="#FCD34D" />
        <circle cx="20" cy="10" r="5" fill="#FBBF24" />
        {/* Hat base */}
        <rect x="6" y="12" width="16" height="10" fill="#FEF3C7" />
        <rect x="6" y="20" width="16" height="3" rx="1" fill="#F59E0B" />
        {/* Decorative band */}
        <rect x="6" y="18" width="16" height="2" fill="#DC2626" />
        {/* Plus sign */}
        <rect x="12.5" y="13" width="3" height="6" rx="0.5" fill="#DC2626" />
        <rect x="10" y="14.5" width="8" height="3" rx="0.5" fill="#DC2626" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
  {
    id: 'recipe-book',
    name: 'Livre de recettes',
    description: 'Carnet gourmand',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Book spine */}
        <rect x="4" y="4" width="3" height="20" rx="1" fill="#92400E" />
        {/* Book cover */}
        <rect x="6" y="4" width="18" height="20" rx="2" fill="#DC2626" />
        <rect x="7" y="5" width="16" height="18" rx="1" fill="#FECACA" />
        {/* Page lines */}
        <line x1="9" y1="9" x2="21" y2="9" stroke="#FCA5A5" strokeWidth="1" />
        <line x1="9" y1="12" x2="21" y2="12" stroke="#FCA5A5" strokeWidth="1" />
        <line x1="9" y1="15" x2="18" y2="15" stroke="#FCA5A5" strokeWidth="1" />
        {/* Fork decoration */}
        <path d="M11 17L11 21M10 17L10 19M12 17L12 19" stroke="#F97316" strokeWidth="1" strokeLinecap="round" />
        {/* Spoon decoration */}
        <ellipse cx="17" cy="18" rx="2" ry="1.5" fill="#F97316" />
        <rect x="16.5" y="19" width="1" height="3" fill="#F97316" />
        {/* Plus badge */}
        <circle cx="22" cy="22" r="4" fill="#16A34A" />
        <path d="M22 20V24M20 22H24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
  {
    id: 'pan-ingredients',
    name: 'Poêle garnie',
    description: 'Poêle avec ingrédients',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Pan handle */}
        <rect x="20" y="12" width="8" height="3" rx="1" fill="#78350F" />
        {/* Pan body */}
        <ellipse cx="12" cy="14" rx="10" ry="8" fill="#4B5563" />
        <ellipse cx="12" cy="13" rx="9" ry="7" fill="#1F2937" />
        {/* Food items */}
        <circle cx="8" cy="12" r="2.5" fill="#EF4444" /> {/* Tomato */}
        <circle cx="14" cy="11" r="2" fill="#22C55E" /> {/* Pea/veggie */}
        <circle cx="11" cy="15" r="2.5" fill="#FBBF24" /> {/* Egg yolk */}
        <ellipse cx="16" cy="14" rx="1.5" ry="2" fill="#FB923C" /> {/* Carrot */}
        {/* Plus badge */}
        <circle cx="20" cy="20" r="4" fill="#E87042" />
        <path d="M20 18V22M18 20H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
  {
    id: 'whisk-bowl',
    name: 'Bol & fouet',
    description: 'Ustensiles de pâtisserie',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Bowl */}
        <path d="M4 14C4 14 4 22 14 22C24 22 24 14 24 14H4Z" fill="#F97316" />
        <ellipse cx="14" cy="14" rx="10" ry="3" fill="#FB923C" />
        {/* Batter inside */}
        <ellipse cx="14" cy="15" rx="8" ry="4" fill="#FEF3C7" />
        {/* Whisk */}
        <rect x="18" y="2" width="2" height="10" rx="1" fill="#78350F" />
        <path d="M16 10C16 10 15 13 19 13C23 13 22 10 22 10" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
        <path d="M17 10C17 10 16.5 12 19 12C21.5 12 21 10 21 10" stroke="#9CA3AF" strokeWidth="1.5" fill="none" />
        {/* Plus badge */}
        <circle cx="6" cy="8" r="4" fill="#16A34A" />
        <path d="M6 6V10M4 8H8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
  {
    id: 'plate-meal',
    name: 'Assiette garnie',
    description: 'Plat complet',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        {/* Plate rim */}
        <ellipse cx="14" cy="16" rx="12" ry="6" fill="#E5E7EB" />
        <ellipse cx="14" cy="15" rx="12" ry="5" fill="#F3F4F6" />
        {/* Plate inner */}
        <ellipse cx="14" cy="14" rx="9" ry="4" fill="#FAFAFA" />
        {/* Food */}
        <ellipse cx="10" cy="13" rx="3" ry="2" fill="#92400E" /> {/* Meat */}
        <circle cx="16" cy="12" r="2" fill="#22C55E" /> {/* Broccoli */}
        <circle cx="17" cy="15" r="1.5" fill="#EF4444" /> {/* Tomato */}
        <path d="M12 15C12 15 13 14 14 15C15 16 16 15 16 15" fill="#FBBF24" /> {/* Sauce drizzle */}
        {/* Fork */}
        <path d="M3 8L3 12M2 8L2 10M4 8L4 10" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
        <rect x="2.5" y="11" width="1" height="4" fill="#9CA3AF" />
        {/* Knife */}
        <path d="M25 8L25 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="24.5" y="11" width="1" height="4" fill="#9CA3AF" />
        {/* Plus badge */}
        <circle cx="22" cy="6" r="4" fill="#E87042" />
        <path d="M22 4V8M20 6H24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    className: 'bg-white shadow-lg hover:shadow-xl hover:scale-105 pressed:scale-95',
  },
]

// Different shape/style variations
const styleVariants: FabVariant[] = [
  {
    id: 'round-shadow',
    name: 'Rond + Ombre douce',
    description: 'Style Material Design',
    icon: <Plus className="h-6 w-6" strokeWidth={2.5} />,
    className: 'bg-warm-600 text-white shadow-xl shadow-warm-900/20 hover:bg-warm-700 hover:shadow-2xl pressed:bg-warm-800',
  },
  {
    id: 'round-glow',
    name: 'Rond + Halo',
    description: 'Effet lumineux',
    icon: <ChefHat className="h-6 w-6" />,
    className: 'bg-gradient-to-br from-warm-500 to-warm-700 text-white shadow-lg shadow-warm-500/50 hover:shadow-xl hover:shadow-warm-500/60 pressed:from-warm-600 pressed:to-warm-800',
  },
  {
    id: 'outline',
    name: 'Contour',
    description: 'Style léger',
    icon: <UtensilsCrossed className="h-6 w-6" />,
    className: 'bg-white text-warm-600 border-2 border-warm-600 shadow-md hover:bg-warm-50 hover:shadow-lg pressed:bg-warm-100',
  },
  {
    id: 'soft',
    name: 'Doux',
    description: 'Fond pastel',
    icon: <CookingPot className="h-6 w-6" />,
    className: 'bg-warm-100 text-warm-700 shadow-md hover:bg-warm-200 hover:shadow-lg pressed:bg-warm-300',
  },
  {
    id: 'pill',
    name: 'Pilule',
    description: 'Avec texte',
    icon: <Plus className="h-5 w-5" strokeWidth={2.5} />,
    className: 'bg-warm-600 text-white shadow-lg shadow-warm-600/30 hover:bg-warm-700 hover:shadow-xl pressed:bg-warm-800 !rounded-full !w-auto !h-auto px-5 py-3 gap-2',
  },
  {
    id: 'sparkle',
    name: 'Festif',
    description: 'Avec étoiles',
    icon: (
      <span className="relative">
        <Plus className="h-6 w-6" strokeWidth={2.5} />
        <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-warm-200" />
      </span>
    ),
    className: 'bg-gradient-to-br from-warm-500 via-warm-600 to-warm-700 text-white shadow-lg shadow-warm-600/40 hover:shadow-xl pressed:from-warm-600 pressed:to-warm-800',
  },
]

export function FabShowcase() {
  return (
    <section className="px-4 py-12 bg-paper-200">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-2xl font-semibold text-ink-900 md:text-3xl">
          Boutons d'ajout (FAB)
        </h2>
        <p className="mt-2 text-ink-600">
          Différents styles pour le bouton "Ajouter une recette"
        </p>

        {/* Icon variants */}
        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-ink-800">Variantes d'icônes</h3>
          <div className="flex flex-wrap items-end gap-6">
            {fabVariants.map((variant) => (
              <div key={variant.id} className="flex flex-col items-center gap-2">
                <Button
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${variant.className}`}
                  aria-label={`Ajouter une recette - ${variant.name}`}
                >
                  {variant.icon}
                </Button>
                <span className="text-xs font-medium text-ink-700">{variant.name}</span>
                <span className="text-xs text-ink-500">{variant.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Colorful SVG variants */}
        <div className="mt-12">
          <h3 className="mb-4 font-semibold text-ink-800">Icônes SVG colorées</h3>
          <div className="flex flex-wrap items-end gap-6">
            {svgVariants.map((variant) => (
              <div key={variant.id} className="flex flex-col items-center gap-2">
                <Button
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${variant.className}`}
                  aria-label={`Ajouter une recette - ${variant.name}`}
                >
                  {variant.icon}
                </Button>
                <span className="text-xs font-medium text-ink-700">{variant.name}</span>
                <span className="text-xs text-ink-500">{variant.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Style variants */}
        <div className="mt-12">
          <h3 className="mb-4 font-semibold text-ink-800">Variantes de style</h3>
          <div className="flex flex-wrap items-end gap-6">
            {styleVariants.map((variant) => (
              <div key={variant.id} className="flex flex-col items-center gap-2">
                <Button
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ${variant.className}`}
                  aria-label={`Ajouter une recette - ${variant.name}`}
                >
                  {variant.icon}
                  {variant.id === 'pill' && <span className="text-sm font-medium">Ajouter</span>}
                </Button>
                <span className="text-xs font-medium text-ink-700">{variant.name}</span>
                <span className="text-xs text-ink-500">{variant.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Size variants */}
        <div className="mt-12">
          <h3 className="mb-4 font-semibold text-ink-800">Tailles</h3>
          <div className="flex flex-wrap items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Button
                className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all hover:bg-warm-700 pressed:bg-warm-800"
                aria-label="Ajouter - petit"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </Button>
              <span className="text-xs font-medium text-ink-700">Petit</span>
              <span className="text-xs text-ink-500">48px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                className="flex h-14 w-14 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all hover:bg-warm-700 pressed:bg-warm-800"
                aria-label="Ajouter - moyen"
              >
                <Plus className="h-6 w-6" strokeWidth={2.5} />
              </Button>
              <span className="text-xs font-medium text-ink-700">Moyen</span>
              <span className="text-xs text-ink-500">56px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                className="flex h-16 w-16 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all hover:bg-warm-700 pressed:bg-warm-800"
                aria-label="Ajouter - grand"
              >
                <Plus className="h-7 w-7" strokeWidth={2.5} />
              </Button>
              <span className="text-xs font-medium text-ink-700">Grand</span>
              <span className="text-xs text-ink-500">64px</span>
            </div>
          </div>
        </div>

        {/* Animated Book FAB */}
        <div className="mt-12">
          <h3 className="mb-4 font-semibold text-ink-800">Bouton animé (survoler pour voir)</h3>
          <div className="flex flex-wrap items-end gap-8">
            <div className="flex flex-col items-center gap-3">
              <Button
                className="group relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-white to-amber-50 shadow-xl shadow-warm-900/15 transition-all duration-300 hover:shadow-2xl hover:shadow-warm-600/25 hover:scale-105 pressed:scale-95"
                aria-label="Ajouter une recette - Livre animé"
              >
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="overflow-visible">
                  {/* Book back cover (always visible) */}
                  <rect
                    x="8" y="8" width="32" height="40" rx="5"
                    fill="#7F1D1D"
                  />

                  {/* Book spine - rounded */}
                  <rect x="5" y="8" width="6" height="40" rx="3" fill="#991B1B" />
                  <rect x="7" y="12" width="2" height="32" rx="1" fill="#7F1D1D" opacity="0.5" />

                  {/* Pages (fan out on hover) */}
                  <g className="origin-[11px_28px] transition-transform duration-300 ease-out group-hover:rotate-[-15deg]">
                    <rect x="11" y="10" width="27" height="36" rx="3" fill="#FEF3C7" />
                    <rect x="11" y="10" width="27" height="36" rx="3" fill="url(#pageTexture)" />
                    {/* Page lines */}
                    <line x1="15" y1="18" x2="34" y2="18" stroke="#D4B896" strokeWidth="1" strokeLinecap="round" />
                    <line x1="15" y1="24" x2="34" y2="24" stroke="#D4B896" strokeWidth="1" strokeLinecap="round" />
                    <line x1="15" y1="30" x2="30" y2="30" stroke="#D4B896" strokeWidth="1" strokeLinecap="round" />
                    <line x1="15" y1="36" x2="34" y2="36" stroke="#D4B896" strokeWidth="1" strokeLinecap="round" />
                    {/* Little heart doodle */}
                    <path d="M32 32C32 31 33 30 34 31C35 30 36 31 36 32C36 33 34 35 34 35C34 35 32 33 32 32Z" fill="#F87171" opacity="0.6" />
                  </g>

                  {/* Front cover (rotates open on hover) */}
                  <g className="origin-[11px_28px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[-50deg]">
                    <rect x="11" y="8" width="29" height="40" rx="4" fill="url(#bookGradient)" />

                    {/* Book decorative border */}
                    <rect x="13" y="10" width="25" height="36" rx="3" fill="none" stroke="#FCA5A5" strokeWidth="1" opacity="0.4" />

                    {/* Toque on cover - bigger and cuter */}
                    <g transform="translate(14, 12)">
                      {/* Hat puffs - fluffy clouds */}
                      <ellipse cx="5" cy="10" rx="5" ry="4.5" fill="#FFFBEB" />
                      <ellipse cx="11" cy="7" rx="6" ry="5.5" fill="#FFF" />
                      <ellipse cx="17" cy="10" rx="5" ry="4.5" fill="#FFFBEB" />
                      {/* Extra fluff */}
                      <circle cx="8" cy="6" r="3" fill="#FFF" />
                      <circle cx="14" cy="5" r="2.5" fill="#FFFBEB" />
                      {/* Hat base */}
                      <rect x="4" y="13" width="14" height="10" rx="2" fill="#FEF9C3" />
                      {/* Golden band */}
                      <rect x="4" y="20" width="14" height="3" rx="1.5" fill="#F59E0B" />
                      {/* Red ribbon */}
                      <rect x="4" y="17" width="14" height="3" rx="1" fill="#DC2626" />
                      {/* Ribbon shine */}
                      <rect x="6" y="18" width="4" height="1" rx="0.5" fill="#FCA5A5" opacity="0.5" />
                    </g>
                  </g>

                  {/* Pen (slides in with bounce on hover) */}
                  <g className="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-0 translate-x-6 translate-y-6 rotate-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0">
                    <g transform="translate(30, 10) rotate(20)">
                      {/* Pen body */}
                      <rect x="0" y="0" width="5" height="28" rx="2.5" fill="#1E40AF" />
                      {/* Pen shine */}
                      <rect x="1" y="2" width="1.5" height="20" rx="0.75" fill="#3B82F6" opacity="0.6" />
                      {/* Pen grip */}
                      <rect x="0" y="20" width="5" height="6" rx="2" fill="#60A5FA" />
                      <rect x="0.5" y="21" width="4" height="1" rx="0.5" fill="#93C5FD" opacity="0.5" />
                      <rect x="0.5" y="23" width="4" height="1" rx="0.5" fill="#93C5FD" opacity="0.5" />
                      {/* Pen tip */}
                      <path d="M0 26L2.5 34L5 26Z" fill="#FCD34D" />
                      <path d="M1.5 26L2.5 31L3.5 26Z" fill="#FBBF24" />
                      {/* Pen clip */}
                      <rect x="4" y="2" width="2" height="10" rx="1" fill="#93C5FD" />
                    </g>
                  </g>

                  {/* Sparkles that appear on hover */}
                  <g className="transition-all duration-700 opacity-0 group-hover:opacity-100">
                    <circle cx="48" cy="12" r="2" fill="#FBBF24" className="animate-pulse" />
                    <circle cx="52" cy="20" r="1.5" fill="#F97316" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <circle cx="46" cy="6" r="1" fill="#FCD34D" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </g>

                  {/* Gradient definitions */}
                  <defs>
                    <linearGradient id="bookGradient" x1="11" y1="8" x2="40" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="50%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#991B1B" />
                    </linearGradient>
                    <linearGradient id="pageTexture" x1="11" y1="10" x2="38" y2="46" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFBEB" />
                      <stop offset="100%" stopColor="#FEF3C7" />
                    </linearGradient>
                  </defs>
                </svg>
              </Button>
              <span className="text-sm font-medium text-ink-700">Livre & Toque</span>
              <span className="text-xs text-ink-500">S'ouvre au survol</span>
            </div>
          </div>
        </div>

        {/* Preview in context */}
        <div className="mt-12">
          <h3 className="mb-4 font-semibold text-ink-800">Aperçu en contexte (position fixe)</h3>
          <div className="relative h-64 overflow-hidden rounded-xl border-2 border-ink-200 bg-paper-100">
            <div className="absolute inset-0 flex items-center justify-center text-ink-400">
              Zone de contenu (recettes)
            </div>
            {/* Simulated fixed FAB */}
            <Button
              className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all hover:bg-warm-700 pressed:bg-warm-800"
              aria-label="Ajouter une recette"
            >
              <Plus className="h-6 w-6" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
