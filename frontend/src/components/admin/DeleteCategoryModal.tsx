import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  Button,
} from "react-aria-components";
import { AlertTriangle } from "lucide-react";
import type { Category } from "@/lib/api";
import { categoryApi } from "@/lib/api";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  category: Category | null;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  category,
}: DeleteCategoryModalProps) {
  // Fetch recipe count when modal is open
  const { data: countData, isLoading: countLoading } = useQuery({
    queryKey: ["categories", category?.id, "recipes", "count"],
    queryFn: () => categoryApi.getRecipeCount(category!.id),
    enabled: isOpen && !!category,
  });

  const recipeCount = countData?.count ?? 0;

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Modal className="mx-4 w-full max-w-md">
          <Dialog className="rounded-2xl bg-white p-6 shadow-xl outline-none">
            {({ close }) => (
              <>
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                {/* Content */}
                <div className="mb-6 text-center">
                  <h2 className="font-heading text-ink-900 mb-2 text-xl font-semibold">
                    Supprimer la catégorie
                  </h2>
                  <p className="text-ink-600">
                    Voulez-vous vraiment supprimer la catégorie{" "}
                    <strong>{category?.name}</strong> ?
                  </p>

                  {/* Recipe count warning */}
                  {countLoading ? (
                    <p className="text-ink-400 mt-3 text-sm">Chargement...</p>
                  ) : recipeCount > 0 ? (
                    <p className="text-ink-600 mt-3 text-sm">
                      <span className="font-medium text-red-600">
                        {recipeCount} recette{recipeCount > 1 ? "s" : ""}
                      </span>{" "}
                      {recipeCount > 1 ? "seront classées" : "sera classée"}{" "}
                      comme « Sans catégorie ».
                    </p>
                  ) : (
                    <p className="text-ink-400 mt-3 text-sm">
                      Aucune recette n'est associée à cette catégorie.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    onPress={close}
                    className="border-ink-200 text-ink-700 hover:bg-paper-50 rounded-lg border px-4 py-2 text-sm font-medium transition"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    onPress={onConfirm}
                    isDisabled={isDeleting}
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-800 disabled:opacity-50"
                  >
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
