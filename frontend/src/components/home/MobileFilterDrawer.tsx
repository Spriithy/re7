import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
  Heading,
} from "react-aria-components";
import { SlidersHorizontal, X } from "lucide-react";
import type { Category } from "@/lib/api-types";
import { DietFilterButton } from "./DietFilterButton";
import { CategoryFilterButton } from "./CategoryFilterButton";

interface MobileFilterDrawerProps {
  categories: Category[];
  selectedCategoryId: string | null;
  filterVegetarian: boolean;
  filterVegan: boolean;
  activeFilterCount: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCategoryChange: (categoryId: string | null) => void;
  onVegetarianChange: (value: boolean) => void;
  onVeganChange: (value: boolean) => void;
}

export function MobileFilterDrawer({
  categories,
  selectedCategoryId,
  filterVegetarian,
  filterVegan,
  activeFilterCount,
  isOpen,
  onOpenChange,
  onCategoryChange,
  onVegetarianChange,
  onVeganChange,
}: MobileFilterDrawerProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Button className="bg-warm-600 hover:bg-warm-700 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white transition">
        <SlidersHorizontal className="h-4 w-4" />
        Filtres
        {activeFilterCount > 0 && (
          <span className="bg-warm-800 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs">
            {activeFilterCount}
          </span>
        )}
      </Button>
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-50 flex items-end bg-black/50 sm:hidden"
      >
        <Modal>
          <Dialog className="flex max-h-[80vh] w-full flex-col rounded-t-3xl bg-white shadow-xl outline-none">
            {({ close }) => (
              <>
                <div className="border-ink-200 flex items-center justify-between border-b px-5 py-4">
                  <Heading
                    slot="title"
                    className="text-ink-900 text-lg font-semibold"
                  >
                    Filtres
                  </Heading>
                  <Button
                    onPress={close}
                    className="text-ink-500 hover:text-ink-900 -mr-2 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="scrollbar-hide flex-1 overflow-y-auto px-5 py-5">
                  <div className="mb-5">
                    <h3 className="text-ink-700 mb-3 text-sm font-medium">
                      Régime alimentaire
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <DietFilterButton
                        type="vegetarian"
                        isActive={filterVegetarian}
                        onClick={() => onVegetarianChange(!filterVegetarian)}
                        size="md"
                      />
                      <DietFilterButton
                        type="vegan"
                        isActive={filterVegan}
                        onClick={() => onVeganChange(!filterVegan)}
                        size="md"
                      />
                    </div>
                  </div>

                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-ink-700 mb-3 text-sm font-medium">
                        Catégorie
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <CategoryFilterButton
                          category={null}
                          isActive={selectedCategoryId === null}
                          onClick={() => onCategoryChange(null)}
                          size="md"
                        />
                        {categories.map((category) => (
                          <CategoryFilterButton
                            key={category.id}
                            category={category}
                            isActive={selectedCategoryId === category.id}
                            onClick={() => onCategoryChange(category.id)}
                            size="md"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-ink-200 border-t px-5 py-4">
                  <Button
                    onPress={close}
                    className="bg-warm-600 hover:bg-warm-700 w-full rounded-full px-6 py-3 font-medium text-white transition"
                  >
                    Appliquer les filtres
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
