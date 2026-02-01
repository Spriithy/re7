import type { Category } from "@/lib/api";
import { CategoryListItem } from "./CategoryListItem";

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
  // Stable callback wrappers that pass category ID
  const handleEdit = (category: Category) => onEdit(category);
  const handleDelete = (category: Category) => onDelete(category);
  const handleUploadImage = (category: Category, file: File) =>
    onUploadImage(category, file);
  const handleDeleteImage = (category: Category) => onDeleteImage(category);

  return (
    <ul className="divide-ink-100 divide-y">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          category={category}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUploadImage={handleUploadImage}
          onDeleteImage={handleDeleteImage}
          isUploadingImage={isUploadingImage}
          isDeletingImage={isDeletingImage}
        />
      ))}
    </ul>
  );
}
