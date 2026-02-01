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

  const displayName = user.full_name ?? user.username;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarUrl = previewUrl ?? getImageUrl(user.avatar_url);
  const hasAvatar = avatarUrl !== null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
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
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div className="bg-warm-100 h-24 w-24 overflow-hidden rounded-full shadow-md sm:h-28 sm:w-28">
          {hasAvatar ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="from-warm-400 to-warm-600 flex h-full w-full items-center justify-center bg-gradient-to-br text-2xl font-bold text-white sm:text-3xl">
              {initials}
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {(isUploading || isDeleting) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          </div>
        )}
      </div>

      {/* User info and actions */}
      <div className="min-w-0 flex-1 text-center sm:text-left">
        <div className="mb-4">
          <h2 className="font-heading text-ink-900 mb-1 text-2xl font-bold">
            {displayName}
          </h2>
          <p className="text-ink-500 text-sm">@{user.username}</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button
            onPress={() => fileInputRef.current?.click()}
            isDisabled={isUploading || isDeleting}
            className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload size={16} />
            {hasAvatar ? "Changer la photo" : "Ajouter une photo"}
          </Button>

          {hasAvatar && !isUploading && (
            <DialogTrigger>
              <Button
                isDisabled={isDeleting}
                className="pressed:bg-red-900 inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                Supprimer
              </Button>
              <ModalOverlay className="data-entering:animate-fade-in data-exiting:animate-fade-out fixed inset-0 z-50 bg-black/40">
                <Modal className="data-entering:animate-zoom-in data-exiting:animate-zoom-out fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl outline-none">
                  <Dialog className="outline-none">
                    {({ close }) => (
                      <>
                        <Heading
                          slot="title"
                          className="font-heading text-ink-900 mb-2 text-lg font-semibold"
                        >
                          Supprimer la photo de profil ?
                        </Heading>
                        <p className="text-ink-600 mb-6 text-sm">
                          Êtes-vous sûr de vouloir supprimer votre photo de
                          profil ? Cette action ne peut pas être annulée.
                        </p>
                        <div className="flex justify-end gap-3">
                          <Button
                            onPress={close}
                            className="text-ink-700 hover:bg-ink-100 rounded-lg px-4 py-2 transition-colors"
                          >
                            Annuler
                          </Button>
                          <Button
                            onPress={() => {
                              handleDeleteClick();
                              close();
                            }}
                            className="pressed:bg-red-900 rounded-lg bg-red-700 px-4 py-2 text-white transition-colors hover:bg-red-800"
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
