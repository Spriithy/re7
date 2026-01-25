import { useState } from "react";
import { Form, TextField, Label, Input, Button } from "react-aria-components";

interface ProfileFormProps {
  user: {
    username: string;
    full_name: string | null;
  };
  onSave: (fullName: string | null) => void;
  isSaving?: boolean;
  error?: string | null;
  success?: boolean;
}

export function ProfileForm({
  user,
  onSave,
  isSaving = false,
  error = null,
  success = false,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [hasChanges, setHasChanges] = useState(false);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setHasChanges(value !== (user.full_name || ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fullName.trim() || null);
    setHasChanges(false);
  };

  return (
    <div>
      <h2 className="text-lg font-heading font-semibold text-ink-900 mb-4">
        Informations du profil
      </h2>

      <Form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name field */}
        <TextField
          value={fullName}
          onChange={handleFullNameChange}
          isDisabled={isSaving}
        >
          <Label className="block text-sm font-medium text-ink-700 mb-1">
            Nom complet
          </Label>
          <Input
            className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
            placeholder="Votre nom complet (optionnel)"
          />
        </TextField>

        {/* Username (read-only) */}
        <div>
          <Label className="block text-sm font-medium text-ink-700 mb-1">
            Identifiant
          </Label>
          <div className="px-3 py-2 bg-gray-50 border border-ink-200 rounded-lg text-ink-600">
            @{user.username}
          </div>
          <p className="mt-1 text-xs text-ink-500">
            L'identifiant ne peut pas être modifié
          </p>
        </div>

        {/* Submit button */}
        <div>
          <Button
            type="submit"
            isDisabled={!hasChanges || isSaving}
            className="w-full px-4 py-2 bg-warm-600 text-white rounded-lg hover:bg-warm-700 pressed:bg-warm-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            Profil mis à jour avec succès
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}
      </Form>
    </div>
  );
}
