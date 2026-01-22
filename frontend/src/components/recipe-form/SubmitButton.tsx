import { Button } from "react-aria-components";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  loadingLabel?: string;
}

export function SubmitButton({
  isSubmitting,
  label = "Créer la recette",
  loadingLabel = "Création en cours...",
}: SubmitButtonProps) {
  return (
    <div className="relative sticky bottom-0 -mx-4 px-4 pt-6 pb-4">
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-md"
        style={{
          maskImage:
            "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, black 50%, transparent 100%)",
        }}
      />
      <Button
        type="submit"
        isDisabled={isSubmitting}
        className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 relative w-full rounded-xl px-4 py-3.5 font-semibold text-white drop-shadow-[0_8px_25px_rgba(234,88,12,0.4)] transition hover:drop-shadow-[0_12px_35px_rgba(234,88,12,0.5)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? loadingLabel : label}
      </Button>
    </div>
  );
}
