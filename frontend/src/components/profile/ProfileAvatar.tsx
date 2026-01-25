import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { getImageUrl } from "@/lib/api";

interface ProfileAvatarProps {
  user: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  onUpload: (file: File) => void;
  onDelete: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
}

export function ProfileAvatar({
  user,
  onUpload,
  onDelete,
  isUploading = false,
  isDeleting = false,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const displayName = user.full_name || user.username;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = previewUrl || getImageUrl(user.avatar_url);
  const hasAvatar = avatarUrl !== null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Le fichier doit être une image (JPG, PNG, WebP ou GIF)");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("L'image ne doit pas dépasser 10 Mo");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onUpload(file);
  };

  const handleDeleteClick = () => {
    setPreviewUrl(null);
    onDelete();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden shadow-md bg-warm-100">
          {hasAvatar ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-warm-400 to-warm-600 text-white text-2xl sm:text-3xl font-bold">
              {initials}
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* User info and actions */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="mb-4">
          <h2 className="text-2xl font-heading font-bold text-ink-900 mb-1">
            {displayName}
          </h2>
          <p className="text-ink-500 text-sm">
            @{user.username}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
          <Button
            onPress={() => fileInputRef.current?.click()}
            isDisabled={isUploading || isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-warm-600 text-white text-sm rounded-lg hover:bg-warm-700 pressed:bg-warm-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload size={16} />
            {hasAvatar ? "Changer la photo" : "Ajouter une photo"}
          </Button>

          {hasAvatar && !isUploading && (
            <DialogTrigger>
              <Button
                isDisabled={isDeleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white text-sm rounded-lg hover:bg-red-800 pressed:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 size={16} />
                Supprimer
              </Button>
              <ModalOverlay className="data-entering:animate-fade-in data-exiting:animate-fade-out fixed inset-0 z-50 bg-black/40">
                <Modal className="data-entering:animate-zoom-in data-exiting:animate-zoom-out fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
                  <Dialog className="outline-none">
                    {({ close }) => (
                      <>
                        <Heading
                          slot="title"
                          className="text-lg font-heading font-semibold text-ink-900 mb-2"
                        >
                          Supprimer la photo de profil ?
                        </Heading>
                        <p className="text-ink-600 text-sm mb-6">
                          Êtes-vous sûr de vouloir supprimer votre photo de profil ?
                          Cette action ne peut pas être annulée.
                        </p>
                        <div className="flex gap-3 justify-end">
                          <Button
                            onPress={close}
                            className="px-4 py-2 text-ink-700 hover:bg-ink-100 rounded-lg transition-colors"
                          >
                            Annuler
                          </Button>
                          <Button
                            onPress={() => {
                              handleDeleteClick();
                              close();
                            }}
                            className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 pressed:bg-red-900 transition-colors"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </>
                    )}
                  </Dialog>
                </Modal>
              </ModalOverlay>
            </DialogTrigger>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
