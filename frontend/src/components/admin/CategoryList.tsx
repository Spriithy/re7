import { useRef } from "react";
import { Button } from "react-aria-components";
import { Pencil, Trash2, ImagePlus, X } from "lucide-react";
import type { Category } from "@/lib/api";
import { getImageUrl } from "@/lib/api";
import { CategoryIcon } from "@/components/CategoryIcon";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onUploadImage: (category: Category, file: File) => void;
  onDeleteImage: (category: Category) => void;
  isUploadingImage: boolean;
  isDeletingImage: boolean;
}

export function CategoryList({
  categories,
  onEdit,
  onDelete,
  onUploadImage,
  onDeleteImage,
  isUploadingImage,
  isDeletingImage,
}: CategoryListProps) {
  return (
    <ul className="divide-ink-100 divide-y">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          category={category}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
          onUploadImage={(file) => onUploadImage(category, file)}
          onDeleteImage={() => onDeleteImage(category)}
          isUploadingImage={isUploadingImage}
          isDeletingImage={isDeletingImage}
        />
      ))}
    </ul>
  );
}

interface CategoryListItemProps {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
  onUploadImage: (file: File) => void;
  onDeleteImage: () => void;
  isUploadingImage: boolean;
  isDeletingImage: boolean;
}

function CategoryListItem({
  category,
  onEdit,
  onDelete,
  onUploadImage,
  onDeleteImage,
  isUploadingImage,
  isDeletingImage,
}: CategoryListItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const imageUrl = getImageUrl(category.image_path);

  return (
    <li className="flex items-center gap-4 p-4">
      {/* Image or icon */}
      <div className="bg-paper-100 border-ink-100 group relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={category.name}
              className="h-full w-full object-cover"
            />
            {/* Delete image overlay */}
            <Button
              onPress={onDeleteImage}
              isDisabled={isDeletingImage}
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100 disabled:opacity-50"
              aria-label="Supprimer l'image"
            >
              <X className="h-5 w-5" />
            </Button>
          </>
        ) : (
          <CategoryIcon
            iconName={category.icon_name}
            size={24}
            className="text-ink-400"
          />
        )}
      </div>

      {/* Name */}
      <div className="min-w-0 flex-1">
        <h3 className="text-ink-900 font-medium">{category.name}</h3>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload image button */}
        <Button
          onPress={() => fileInputRef.current?.click()}
          isDisabled={isUploadingImage}
          className="hover:bg-paper-100 text-ink-500 hover:text-ink-700 rounded-lg p-2 transition disabled:opacity-50"
          aria-label="Ajouter une image"
        >
          {isUploadingImage ? (
            <div className="border-ink-400 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
        </Button>

        {/* Edit button */}
        <Button
          onPress={onEdit}
          className="hover:bg-paper-100 text-ink-500 hover:text-ink-700 rounded-lg p-2 transition"
          aria-label="Modifier"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        {/* Delete button */}
        <Button
          onPress={onDelete}
          className="hover:bg-paper-100 text-ink-500 hover:text-red-600 rounded-lg p-2 transition"
          aria-label="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
