import {
  Navigate,
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Label, TextField } from "react-aria-components";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isLoading,
    signIn,
    getAccessToken,
    refreshUser,
    hasWorkosSession,
    linkingRequired,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const linkMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await getAccessToken();
      return authApi.linkExistingWorkOS(
        {
          username,
          password,
        },
        accessToken
      );
    },
    onSuccess: async () => {
      await refreshUser();
      void navigate({ to: "/" });
    },
  });

  if (isLoading) {
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

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

          {hasWorkosSession && linkingRequired ? (
            <>
              <p className="text-ink-600 mt-2 text-sm">
                Votre compte Google est authentifié, mais pas encore lié à votre
                compte Re7 existant. Connectez-vous une dernière fois avec vos
                identifiants actuels pour finaliser le lien.
              </p>

              {linkMutation.error ? (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {linkMutation.error.message}
                </p>
              ) : null}

              <Form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  linkMutation.mutate();
                }}
              >
                <TextField
                  className="space-y-1.5"
                  value={username}
                  onChange={setUsername}
                  isRequired
                >
                  <Label className="text-ink-700 text-sm font-medium">
                    Nom d'utilisateur
                  </Label>
                  <Input className="border-ink-200 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-3 transition outline-none focus:ring-4" />
                </TextField>

                <TextField
                  className="space-y-1.5"
                  value={password}
                  onChange={setPassword}
                  isRequired
                >
                  <Label className="text-ink-700 text-sm font-medium">
                    Mot de passe actuel
                  </Label>
                  <Input
                    type="password"
                    className="border-ink-200 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-3 transition outline-none focus:ring-4"
                  />
                </TextField>

                <Button
                  type="submit"
                  isPending={linkMutation.isPending}
                  className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition"
                >
                  Lier mon compte
                </Button>
              </Form>
            </>
          ) : (
            <>
              <p className="text-ink-600 mt-2 text-sm">
                Connectez-vous pour accéder à vos recettes.
              </p>

              <div className="mt-6 space-y-4">
                <Button
                  onPress={() => signIn()}
                  className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition"
                >
                  Se connecter
                </Button>
              </div>
            </>
          )}

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
