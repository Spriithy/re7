import { TextField, Input, Button } from 'react-aria-components'
import { Trash2 } from 'lucide-react'
import type { IngredientCreate } from '@/lib/api'

interface IngredientRowProps {
  ingredient: IngredientCreate
  index: number
  onChange: (index: number, ingredient: IngredientCreate) => void
  onRemove: (index: number) => void
  canRemove: boolean
}

export function IngredientRow({
  ingredient,
  index,
  onChange,
  onRemove,
  canRemove,
}: IngredientRowProps) {
  const updateField = <K extends keyof IngredientCreate>(
    field: K,
    value: IngredientCreate[K]
  ) => {
    onChange(index, { ...ingredient, [field]: value })
  }

  return (
    <div className="flex items-start gap-2">
      {/* Quantity */}
      <TextField className="w-20 shrink-0">
        <Input
          type="number"
          step="0.01"
          min="0"
          value={ingredient.quantity ?? ''}
          onChange={(e) => {
            const val = e.target.value
            updateField('quantity', val === '' ? null : parseFloat(val))
          }}
          placeholder="Qté"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
        />
      </TextField>

      {/* Unit */}
      <TextField className="w-24 shrink-0">
        <Input
          value={ingredient.unit ?? ''}
          onChange={(e) => updateField('unit', e.target.value || null)}
          placeholder="Unité"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
        />
      </TextField>

      {/* Name */}
      <TextField className="flex-1">
        <Input
          value={ingredient.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Nom de l'ingrédient"
          className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
        />
      </TextField>

      {/* Remove button */}
      <Button
        onPress={() => onRemove(index)}
        isDisabled={!canRemove}
        className="shrink-0 rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-600 pressed:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-30"
        aria-label="Supprimer l'ingrédient"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
