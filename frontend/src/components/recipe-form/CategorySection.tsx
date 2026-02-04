import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "@/lib/api";
import {
  Label,
  Button,
  DialogTrigger,
  Dialog,
  Modal,
  ModalOverlay,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { ChevronDown, X } from "lucide-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useIsMobile } from "@/components/utils/useIsMobile";

interface CategorySectionProps {
  value: string | null;
  onChange: (categoryId: string | null) => void;
}

export function CategorySection({ value, onChange }: CategorySectionProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Catégorie</Label>
        <div className="h-10 animate-pulse rounded-md bg-gray-100" />
      </div>
    );
  }

  const selectedCategory = categories?.find((c) => c.id === value);
  const displayValue = selectedCategory ? (
    <span className="flex items-center gap-2">
      <CategoryIcon
        iconName={selectedCategory.icon_name}
        size={20}
        className="text-ink-600"
      />
      {selectedCategory.name}
    </span>
  ) : (
    <span className="text-ink-400">Aucune catégorie</span>
  );

  const handleSelect = (categoryId: string) => {
    onChange(categoryId === "none" ? null : categoryId);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Catégorie</Label>
      {isMobile ? (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button className="border-ink-200 text-ink-900 hover:bg-ink-50 focus:border-warm-500 focus:ring-warm-500/20 flex h-10 w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm transition focus:ring-2 focus:outline-none">
            {displayValue}
            <ChevronDown className="text-ink-400 ml-2 h-4 w-4" />
          </Button>
          <ModalOverlay
            className="data-entering:animate-fade-in data-exiting:animate-fade-out fixed inset-0 z-50 bg-black/40"
            isDismissable
          >
            <Modal className="data-entering:animate-slide-up data-exiting:animate-slide-down fixed right-0 bottom-0 left-0 z-50">
              <Dialog className="rounded-t-2xl bg-white outline-none">
                {({ close }) => (
                  <>
                    <div className="border-ink-100 flex items-center justify-between border-b px-4 py-3">
                      <h3 className="text-ink-900 font-medium">
                        Sélectionner une catégorie
                      </h3>
                      <Button
                        onPress={close}
                        aria-label="Fermer"
                        className="text-ink-500 hover:bg-ink-100 -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto pb-8">
                      <ListBox
                        aria-label="Catégories"
                        selectionMode="single"
                        className="p-2 outline-none"
                        onAction={(key) => handleSelect(key as string)}
                      >
                        <ListBoxItem
                          id="none"
                          textValue="Aucune catégorie"
                          className="text-ink-900 hover:bg-warm-50 focus:bg-warm-50 cursor-pointer rounded-lg px-4 py-3 text-base outline-none"
                        >
                          Aucune catégorie
                        </ListBoxItem>
                        {categories?.map((category) => (
                          <ListBoxItem
                            key={category.id}
                            id={category.id}
                            textValue={category.name}
                            className="text-ink-900 hover:bg-warm-50 focus:bg-warm-50 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base outline-none"
                          >
                            <CategoryIcon
                              iconName={category.icon_name}
                              size={24}
                              className="text-ink-600 flex-shrink-0"
                            />
                            {category.name}
                          </ListBoxItem>
                        ))}
                      </ListBox>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      ) : (
        <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
          <Button className="border-ink-200 text-ink-900 hover:bg-ink-50 focus:border-warm-500 focus:ring-warm-500/20 flex h-10 w-full items-center justify-between rounded-lg border bg-white px-4 py-2 text-sm transition focus:ring-2 focus:outline-none">
            {displayValue}
            <ChevronDown className="text-ink-400 ml-2 h-4 w-4" />
          </Button>
          <Popover
            placement="bottom start"
            className="border-ink-200 z-50 w-[var(--trigger-width)] rounded-lg border bg-white shadow-lg"
          >
            <ListBox
              aria-label="Catégories"
              selectionMode="single"
              className="max-h-60 overflow-auto p-1 outline-none"
              onAction={(key) => handleSelect(key as string)}
            >
              <ListBoxItem
                id="none"
                textValue="Aucune catégorie"
                className="text-ink-900 hover:bg-warm-100 focus:bg-warm-100 cursor-pointer rounded px-3 py-2 text-sm outline-none"
              >
                Aucune catégorie
              </ListBoxItem>
              {categories?.map((category) => (
                <ListBoxItem
                  key={category.id}
                  id={category.id}
                  textValue={category.name}
                  className="text-ink-900 hover:bg-warm-100 focus:bg-warm-100 flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm outline-none"
                >
                  <CategoryIcon
                    iconName={category.icon_name}
                    size={20}
                    className="text-ink-600 flex-shrink-0"
                  />
                  {category.name}
                </ListBoxItem>
              ))}
            </ListBox>
          </Popover>
        </DialogTrigger>
      )}
    </div>
  );
}
