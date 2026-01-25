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

  // Clear form on success
  if (success && (currentPassword || newPassword || confirmPassword)) {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword;

  return (
    <div>
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-warm-50/50 transition-colors rounded-t-2xl"
      >
        <h2 className="text-lg font-heading font-semibold text-ink-900">
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
        <div className="px-6 pb-6 border-t border-ink-100">
          <Form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Current password */}
            <TextField
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
              isDisabled={isSaving}
              isRequired
            >
              <Label className="block text-sm font-medium text-ink-700 mb-1">
                Mot de passe actuel
              </Label>
              <Input
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
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
              <Label className="block text-sm font-medium text-ink-700 mb-1">
                Nouveau mot de passe
              </Label>
              <Input
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
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
              <Label className="block text-sm font-medium text-ink-700 mb-1">
                Confirmer le mot de passe
              </Label>
              <Input
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warm-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
                placeholder="Retapez votre nouveau mot de passe"
              />
            </TextField>

            {/* Submit button */}
            <div>
              <Button
                type="submit"
                isDisabled={!isFormValid || isSaving}
                className="w-full px-4 py-2 bg-warm-600 text-white rounded-lg hover:bg-warm-700 pressed:bg-warm-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? "Changement en cours..." : "Changer le mot de passe"}
              </Button>
            </div>

            {/* Success message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                Mot de passe changé avec succès
              </div>
            )}

            {/* Error messages */}
            {(validationError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {validationError || error}
              </div>
            )}
          </Form>
        </div>
      )}
    </div>
  );
}
