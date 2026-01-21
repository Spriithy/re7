import { Button } from 'react-aria-components'
import { NotebookPen } from 'lucide-react'

export function AddRecipeFab() {
  return (
    <Button
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-warm-600 text-white shadow-lg shadow-warm-600/30 transition-all duration-200 hover:bg-warm-700 hover:shadow-xl hover:shadow-warm-600/40 pressed:bg-warm-800 pressed:scale-95"
      aria-label="Ajouter une recette"
    >
      <NotebookPen className="h-6 w-6" />
    </Button>
  )
}
