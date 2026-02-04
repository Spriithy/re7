import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Input,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  TextField,
  Popover,
} from "react-aria-components";
import { ChevronDown, X, Search } from "lucide-react";
import { useIsMobile } from "@/components/utils/useIsMobile";

interface ComboBoxOption {
  value: string;
  label: string;
}

interface AdaptiveComboBoxProps {
  options: readonly ComboBoxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  allowCustomValue?: boolean;
  className?: string;
  drawerTitle?: string;
}

export function AdaptiveComboBox({
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  allowCustomValue = true,
  className = "",
  drawerTitle = "Sélectionner",
}: AdaptiveComboBoxProps) {
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  // Filter options based on search/input value
  const search = (isMobile ? searchValue : value)?.toLowerCase() ?? "";
  const filteredOptions = !search
    ? options
    : options.filter((opt) => opt.label.toLowerCase().includes(search));

  const handleDrawerOpenChange = (open: boolean) => {
    if (open) {
      setSearchValue(value ?? "");
    }
    setIsDrawerOpen(open);
  };

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue ? selectedValue : null);
    setIsDrawerOpen(false);
    setIsDesktopOpen(false);
  };

  // Mobile: Bottom drawer
  if (isMobile) {
    return (
      <div className={className}>
        <DialogTrigger
          isOpen={isDrawerOpen}
          onOpenChange={handleDrawerOpenChange}
        >
          <Button className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm focus:ring-2 focus:outline-none">
            <span className={value ? "text-ink-900" : "text-ink-400"}>
              {value ?? placeholder}
            </span>
            <ChevronDown className="text-ink-400 h-4 w-4" />
          </Button>
          <ModalOverlay
            className="data-entering:animate-fade-in data-exiting:animate-fade-out fixed inset-0 z-50 bg-black/40"
            isDismissable
          >
            <Modal className="data-entering:animate-slide-up data-exiting:animate-slide-down fixed right-0 bottom-0 left-0 z-50">
              <Dialog className="rounded-t-2xl bg-white outline-none">
                {({ close }) => (
                  <>
                    {/* Header */}
                    <div className="border-ink-100 flex items-center justify-between border-b px-4 py-3">
                      <h3 className="text-ink-900 font-medium">
                        {drawerTitle}
                      </h3>
                      <Button
                        onPress={close}
                        aria-label="Fermer"
                        className="text-ink-500 hover:bg-ink-100 -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Search input */}
                    <div className="border-ink-100 border-b px-4 py-3">
                      <TextField className="relative">
                        <Search className="text-ink-400 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Rechercher ou saisir..."
                          className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border py-2.5 pr-3 pl-10 text-base focus:ring-2 focus:outline-none"
                          autoFocus
                        />
                      </TextField>
                    </div>

                    {/* Options list */}
                    <div className="max-h-[50vh] overflow-y-auto pb-8">
                      <ListBox
                        aria-label="Options"
                        selectionMode="single"
                        className="p-2 outline-none"
                        onAction={(key) => handleSelect(key as string)}
                      >
                        {/* Custom value option if allowed and search doesn't match any option exactly */}
                        {allowCustomValue &&
                          searchValue &&
                          !options.some(
                            (opt) =>
                              opt.label.toLowerCase() ===
                              searchValue.toLowerCase()
                          ) && (
                            <ListBoxItem
                              id={searchValue}
                              textValue={searchValue}
                              className="text-warm-700 hover:bg-warm-50 focus:bg-warm-50 cursor-pointer rounded-lg px-4 py-3 text-base outline-none"
                            >
                              Utiliser "{searchValue}"
                            </ListBoxItem>
                          )}
                        {filteredOptions.map((opt) => (
                          <ListBoxItem
                            key={opt.value}
                            id={opt.value}
                            textValue={opt.label}
                            className="text-ink-900 hover:bg-warm-50 focus:bg-warm-50 cursor-pointer rounded-lg px-4 py-3 text-base outline-none"
                          >
                            {opt.label}
                          </ListBoxItem>
                        ))}
                        {filteredOptions.length === 0 && !allowCustomValue && (
                          <div className="text-ink-500 px-4 py-3 text-base">
                            Aucun résultat
                          </div>
                        )}
                      </ListBox>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
    );
  }

  // Desktop: Standard dropdown with React Aria Popover
  return (
    <div className={`relative ${className}`}>
      <DialogTrigger isOpen={isDesktopOpen} onOpenChange={setIsDesktopOpen}>
        <TextField className="w-full">
          <div className="relative">
            <Input
              value={value ?? ""}
              onChange={(e) => {
                onChange(e.target.value || null);
                setIsDesktopOpen(true);
              }}
              placeholder={placeholder}
              className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-3 py-2 pr-8 text-sm focus:ring-2 focus:outline-none"
            />
            <Button
              className="text-ink-400 hover:text-ink-600 absolute top-0 right-0 flex h-full w-8 items-center justify-center rounded-r-lg"
              excludeFromTabOrder
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </TextField>
        <Popover
          placement="bottom start"
          className="border-ink-200 z-50 w-[var(--trigger-width)] rounded-lg border bg-white p-1 shadow-lg"
        >
          <ListBox
            aria-label="Options"
            selectionMode="single"
            className="max-h-60 overflow-auto outline-none"
            onAction={(key) => handleSelect(key as string)}
          >
            {filteredOptions.map((opt) => (
              <ListBoxItem
                key={opt.value}
                id={opt.value}
                textValue={opt.label}
                className="text-ink-900 hover:bg-warm-100 focus:bg-warm-100 cursor-pointer rounded px-3 py-2 text-sm outline-none"
              >
                {opt.label}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
