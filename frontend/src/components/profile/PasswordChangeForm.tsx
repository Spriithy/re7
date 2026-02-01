import { useState } from "react";
import { Form, TextField, Label, Input, Button } from "react-aria-components";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PasswordChangeFormProps {
  onSave: (currentPassword: string, newPassword: string) => void;
  isSaving?: boolean;
  error?: string | null;
  success?: boolean;
}

export function PasswordChangeForm({
  onSave,
  isSaving = false,
  error = null,
  success = false,
}: PasswordChangeFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Key form content on success to reset form fields when password change succeeds
  const formKey = success ? "reset" : "form";

  return (
    <div>
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:bg-warm-50/50 flex w-full items-center justify-between rounded-t-2xl px-6 py-4 transition-colors"
      >
        <h2 className="font-heading text-ink-900 text-lg font-semibold">
          Changer le mot de passe
        </h2>
        {isOpen ? (
          <ChevronUp className="text-ink-600" size={20} />
        ) : (
          <ChevronDown className="text-ink-600" size={20} />
        )}
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <PasswordFormContent
          key={formKey}
          onSave={onSave}
          isSaving={isSaving}
          error={error}
          success={success}
        />
      )}
    </div>
  );
}

interface PasswordFormContentProps {
  onSave: (currentPassword: string, newPassword: string) => void;
  isSaving: boolean;
  error: string | null;
  success: boolean;
}

// eslint-disable-next-line react/no-multi-comp -- Internal helper component for form state isolation
function PasswordFormContent({
  onSave,
  isSaving,
  error,
  success,
}: PasswordFormContentProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (newPassword.length < 6) {
      setValidationError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Les mots de passe ne correspondent pas");
      return;
    }

    onSave(currentPassword, newPassword);
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword;

  return (
    <div className="border-ink-100 border-t px-6 pb-6">
      <Form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* Current password */}
        <TextField
          type="password"
          value={currentPassword}
          onChange={setCurrentPassword}
          isDisabled={isSaving}
          isRequired
        >
          <Label className="text-ink-700 mb-1 block text-sm font-medium">
            Mot de passe actuel
          </Label>
          <Input
            className="border-ink-300 focus:ring-warm-500 w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:opacity-50"
            placeholder="Votre mot de passe actuel"
          />
        </TextField>

        {/* New password */}
        <TextField
          type="password"
          value={newPassword}
          onChange={setNewPassword}
          isDisabled={isSaving}
          isRequired
        >
          <Label className="text-ink-700 mb-1 block text-sm font-medium">
            Nouveau mot de passe
          </Label>
          <Input
            className="border-ink-300 focus:ring-warm-500 w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:opacity-50"
            placeholder="Au moins 6 caractères"
          />
        </TextField>

        {/* Confirm password */}
        <TextField
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          isDisabled={isSaving}
          isRequired
        >
          <Label className="text-ink-700 mb-1 block text-sm font-medium">
            Confirmer le mot de passe
          </Label>
          <Input
            className="border-ink-300 focus:ring-warm-500 w-full rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none disabled:bg-gray-50 disabled:opacity-50"
            placeholder="Retapez votre nouveau mot de passe"
          />
        </TextField>

        {/* Submit button */}
        <div>
          <Button
            type="submit"
            isDisabled={!isFormValid || isSaving}
            className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Changement en cours..." : "Changer le mot de passe"}
          </Button>
        </div>

        {/* Success message */}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Mot de passe changé avec succès
          </div>
        )}

        {/* Error messages */}
        {(validationError ?? error) && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {validationError ?? error}
          </div>
        )}
      </Form>
    </div>
  );
}
