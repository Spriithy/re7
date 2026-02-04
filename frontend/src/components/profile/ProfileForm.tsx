import { useState } from "react";
import { Form, TextField, Label, Input, Button } from "react-aria-components";
import { inputStyles } from "@/components/ui/styles";

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
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [hasChanges, setHasChanges] = useState(false);

  const handleFullNameChange = (value: string) => {
    setFullName(value);
    setHasChanges(value !== (user.full_name ?? ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(fullName.trim() || null);
    setHasChanges(false);
  };

  return (
    <div>
      <h2 className="font-heading text-ink-900 mb-4 text-lg font-semibold">
        Informations du profil
      </h2>

      <Form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name field */}
        <TextField
          name="fullName"
          value={fullName}
          onChange={handleFullNameChange}
          isDisabled={isSaving}
          className="space-y-1"
        >
          <Label className="text-ink-700 block text-sm font-medium">
            Nom complet
          </Label>
          <Input
            autoComplete="name"
            placeholder="Votre nom complet (optionnel)"
            className={inputStyles}
          />
        </TextField>

        {/* Username (read-only) */}
        <div>
          <Label className="text-ink-700 mb-1 block text-sm font-medium">
            Identifiant
          </Label>
          <div className="border-ink-200 text-ink-600 rounded-lg border bg-gray-50 px-3 py-2">
            @{user.username}
          </div>
          <p className="text-ink-500 mt-1 text-xs">
            L'identifiant ne peut pas être modifié
          </p>
        </div>

        {/* Submit button */}
        <div>
          <Button
            type="submit"
            isDisabled={!hasChanges || isSaving}
            className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Profil mis à jour avec succès
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}
      </Form>
    </div>
  );
}
