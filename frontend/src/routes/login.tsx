import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Button,
  TextField,
  Label,
  Input,
  Form,
  FieldError,
} from "react-aria-components";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Redirect if already authenticated (after loading is complete)
  if (isAuthenticated) {
    void navigate({ to: "/" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password });
      void navigate({ to: "/" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="from-warm-50 to-paper-100 flex min-h-screen items-center justify-center bg-linear-to-b px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-heading text-warm-900 text-4xl font-bold">
              Re7
            </h1>
          </Link>
          <p className="font-heading text-warm-700 mt-2 text-lg italic">
            Recettes de famille
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-heading text-ink-900 text-2xl font-semibold">
            Connexion
          </h2>
          <p className="text-ink-600 mt-2 text-sm">
            Connectez-vous pour accéder à vos recettes.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <TextField
              name="username"
              isRequired
              minLength={3}
              maxLength={50}
              className="space-y-1.5"
            >
              <Label className="text-ink-700 text-sm font-medium">
                Nom d'utilisateur
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <TextField
              name="password"
              isRequired
              minLength={6}
              type="password"
              className="space-y-1.5"
            >
              <Label className="text-ink-700 text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </Form>

          <p className="text-ink-500 mt-6 text-center text-sm">
            Pas encore de compte ? Demandez une invitation à un membre de la
            famille.
          </p>
        </div>

        <p className="text-ink-500 mt-6 text-center text-xs">
          <Link to="/" className="hover:text-ink-700">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </main>
  );
}
