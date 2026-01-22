import { useRef } from "react";
import { Button } from "react-aria-components";
import { Upload, X } from "lucide-react";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
}

export function ImageUploadSection({
  imagePreview,
  onImageSelect,
  onImageRemove,
}: ImageUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleRemove = () => {
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />
      {imagePreview ? (
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={imagePreview}
            alt="Aperçu"
            className="h-36 w-full object-cover sm:h-48"
          />
          <Button
            onPress={handleRemove}
            className="absolute top-2 right-2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            aria-label="Supprimer l'image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onPress={() => fileInputRef.current?.click()}
          className="border-ink-200 bg-ink-50 text-ink-500 hover:border-warm-300 hover:bg-warm-50 hover:text-warm-600 flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition sm:h-48"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">Ajouter une photo</span>
        </Button>
      )}
    </section>
  );
}
