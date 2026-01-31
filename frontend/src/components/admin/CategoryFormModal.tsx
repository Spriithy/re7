import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  Button,
  TextField,
  Label,
  Input,
} from "react-aria-components";
import { X } from "lucide-react";
import type { Category, CategoryCreate, CategoryUpdate } from "@/lib/api";
import { IconSelector } from "./IconSelector";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate?: (data: CategoryCreate) => void;
  onSubmitUpdate?: (data: CategoryUpdate) => void;
  isSubmitting: boolean;
  error: string | null;
  category?: Category | null;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  isSubmitting,
  error,
  category,
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("plats");

  const isEditing = !!category;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setName(category.name);
        setIconName(category.icon_name);
      } else {
        setName("");
        setIconName("plats");
      }
    }
  }, [isOpen, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && onSubmitUpdate && category) {
      const updates: CategoryUpdate = {};
      if (name !== category.name) {
        updates.name = name;
      }
      if (iconName !== category.icon_name) {
        updates.icon_name = iconName;
      }
      onSubmitUpdate(updates);
    } else if (onSubmitCreate) {
      onSubmitCreate({ name, icon_name: iconName });
    }
  };

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <Modal className="mx-4 w-full max-w-md">
          <Dialog className="rounded-2xl bg-white p-6 shadow-xl outline-none">
            {({ close }) => (
              <>
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-heading text-ink-900 text-xl font-semibold">
                    {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
                  </h2>
                  <Button
                    onPress={close}
                    className="hover:bg-paper-100 text-ink-400 hover:text-ink-600 -mr-2 rounded-lg p-2 transition"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name field */}
                  <TextField className="space-y-2">
                    <Label className="text-ink-700 text-sm font-medium">
                      Nom
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Desserts"
                      className="border-ink-200 focus:border-warm-500 focus:ring-warm-500 w-full rounded-lg border px-3 py-2 text-base outline-none transition focus:ring-2 focus:ring-offset-0"
                      autoFocus
                    />
                  </TextField>

                  {/* Icon selector */}
                  <div className="space-y-2">
                    <label className="text-ink-700 text-sm font-medium">
                      Icône
                    </label>
                    <IconSelector
                      selectedIcon={iconName}
                      onSelect={setIconName}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      onPress={close}
                      className="border-ink-200 text-ink-700 hover:bg-paper-50 rounded-lg border px-4 py-2 text-sm font-medium transition"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={!name.trim() || isSubmitting}
                      className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "..."
                        : isEditing
                          ? "Enregistrer"
                          : "Créer"}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
