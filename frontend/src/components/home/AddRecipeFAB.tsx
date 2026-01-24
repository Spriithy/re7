import { Button } from "react-aria-components";
import { NotebookPen } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export function AddRecipeFAB() {
  const navigate = useNavigate();

  return (
    <Button
      onPress={() => navigate({ to: "/recipes/new" })}
      className="bg-warm-600 shadow-warm-600/30 hover:bg-warm-700 hover:shadow-warm-600/40 pressed:bg-warm-800 pressed:scale-95 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-200 hover:shadow-xl"
      aria-label="Ajouter une recette"
    >
      <NotebookPen className="h-6 w-6" />
    </Button>
  );
}
