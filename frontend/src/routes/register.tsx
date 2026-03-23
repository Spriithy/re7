import {
  Navigate,
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Label, TextField } from "react-aria-components";
import { authApi, inviteApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const inviteToken =
    new URLSearchParams(window.location.search).get("invite") ?? "";
  const {
    isAuthenticated,
    isLoading,
    signUp,
    getAccessToken,
    refreshUser,
    workosUser,
    hasWorkosSession,
    linkingRequired,
  } = useAuth();
  const suggestedUsername = useMemo(
    () => workosUser?.email.split("@", 1)[0] ?? "",
    [workosUser]
  );
  const suggestedFullName = useMemo(
    () =>
      [workosUser?.firstName, workosUser?.lastName].filter(Boolean).join(" ") ||
      (workosUser?.email ?? "") ||
      "",
    [workosUser]
  );
  const [usernameOverride, setUsernameOverride] = useState<string | null>(null);
  const [fullNameOverride, setFullNameOverride] = useState<string | null>(null);
  const username = usernameOverride ?? suggestedUsername;
  const fullName = fullNameOverride ?? suggestedFullName;

  const { data: inviteValidation, isLoading: inviteLoading } = useQuery({
    queryKey: ["invite-validation", inviteToken],
    queryFn: () => inviteApi.validate(inviteToken),
    enabled: inviteToken.length > 0,
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      const accessToken = await getAccessToken();
      return authApi.linkWorkOS(
        {
          username,
          invite_token: inviteToken,
          full_name: fullName || null,
        },
        accessToken
      );
    },
    onSuccess: async () => {
      await refreshUser();
      void navigate({ to: "/" });
    },
  });

  if (isLoading || inviteLoading) {
    return (
      <div className="bg-paper-100 flex h-screen items-center justify-center">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const inviteIsValid =
    inviteToken.length > 0 && inviteValidation?.valid === true;

  return (
    <main className="from-warm-100 to-paper-100 flex min-h-screen items-center justify-center bg-gradient-to-b px-4 py-12">
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
            Créer un compte
          </h2>

          {!inviteToken ? (
            <p className="text-ink-600 mt-3 text-sm">
              Un lien d'invitation est requis pour rejoindre Re7.
            </p>
          ) : !inviteIsValid ? (
            <p className="mt-3 text-sm text-red-700">
              Cette invitation est invalide ou expirée.
            </p>
          ) : hasWorkosSession && linkingRequired ? (
            <>
              <p className="text-ink-600 mt-2 text-sm">
                Votre compte Google est authentifié. Choisissez votre nom
                d'utilisateur pour terminer l'inscription.
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
                  onChange={setUsernameOverride}
                  isRequired
                >
                  <Label className="text-ink-700 text-sm font-medium">
                    Nom d'utilisateur
                  </Label>
                  <Input className="border-ink-200 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-3 transition outline-none focus:ring-4" />
                </TextField>

                <TextField
                  className="space-y-1.5"
                  value={fullName}
                  onChange={setFullNameOverride}
                >
                  <Label className="text-ink-700 text-sm font-medium">
                    Nom affiché
                  </Label>
                  <Input className="border-ink-200 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-3 transition outline-none focus:ring-4" />
                </TextField>

                <Button
                  type="submit"
                  isPending={linkMutation.isPending}
                  className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition"
                >
                  Terminer l'inscription
                </Button>
              </Form>
            </>
          ) : (
            <>
              <p className="text-ink-600 mt-2 text-sm">
                Rejoignez la famille pour partager vos recettes.
              </p>

              <div className="mt-6 space-y-4">
                <Button
                  onPress={() =>
                    signUp({
                      state: {
                        returnTo: `${window.location.pathname}${window.location.search}`,
                      },
                    })
                  }
                  className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition"
                >
                  Créer mon compte
                </Button>
              </div>
            </>
          )}

          <p className="text-ink-600 mt-6 text-center text-sm">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-warm-600 hover:text-warm-700 font-medium"
            >
              Se connecter
            </Link>
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
