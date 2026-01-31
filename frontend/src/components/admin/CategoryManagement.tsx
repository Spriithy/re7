import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "react-aria-components";
import { categoryApi, type Category, type CategoryCreate, type CategoryUpdate } from "@/lib/api";
import { CategoryList } from "./CategoryList";
import { CategoryFormModal } from "./CategoryFormModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

interface CategoryManagementProps {
  token: string;
}

export function CategoryManagement({ token }: CategoryManagementProps) {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CategoryCreate) => categoryApi.create(data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreateModalOpen(false);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryUpdate }) =>
      categoryApi.update(id, data, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryApi.delete(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["recipes"] });
      setDeletingCategory(null);
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      categoryApi.uploadImage(id, file, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  // Image delete mutation
  const deleteImageMutation = useMutation({
    mutationFn: (id: string) => categoryApi.deleteImage(id, token),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const handleCreate = (data: CategoryCreate) => {
    createMutation.mutate(data);
  };

  const handleUpdate = (data: CategoryUpdate) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    }
  };

  const handleDelete = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id);
    }
  };

  const handleUploadImage = (category: Category, file: File) => {
    uploadImageMutation.mutate({ id: category.id, file });
  };

  const handleDeleteImage = (category: Category) => {
    deleteImageMutation.mutate(category.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-ink-900 text-xl font-semibold">
            Catégories
          </h2>
          <p className="text-ink-500 mt-1 text-sm">
            Gérez les catégories de recettes
          </p>
        </div>
        <Button
          onPress={() => setIsCreateModalOpen(true)}
          className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {/* Category list */}
      <div className="rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="border-warm-600 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ink-500">Aucune catégorie</p>
          </div>
        ) : (
          <CategoryList
            categories={categories}
            onEdit={setEditingCategory}
            onDelete={setDeletingCategory}
            onUploadImage={handleUploadImage}
            onDeleteImage={handleDeleteImage}
            isUploadingImage={uploadImageMutation.isPending}
            isDeletingImage={deleteImageMutation.isPending}
          />
        )}
      </div>

      {/* Create modal */}
      <CategoryFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitCreate={handleCreate}
        isSubmitting={createMutation.isPending}
        error={createMutation.error?.message ?? null}
      />

      {/* Edit modal */}
      <CategoryFormModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmitUpdate={handleUpdate}
        isSubmitting={updateMutation.isPending}
        error={updateMutation.error?.message ?? null}
        category={editingCategory}
      />

      {/* Delete modal */}
      <DeleteCategoryModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        category={deletingCategory}
      />
    </div>
  );
}
