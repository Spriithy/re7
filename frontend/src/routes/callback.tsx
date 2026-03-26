import { useEffect } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "react-aria-components";
import { AuthUnavailableNotice } from "@/components/AuthUnavailableNotice";
import { getWorkOSAvailability } from "@/lib/auth/originSecurity";
import { useAuth } from "@/lib/auth/useAuth";

export const Route = createFileRoute("/callback")({
  component: CallbackPage,
});

/**
 * OAuth callback page for WorkOS AuthKit.
 *
 * The AuthKitProvider automatically intercepts the OAuth callback,
 * exchanges the authorization code for tokens, and handles session management.
 *
 * This page just needs to exist as a route target. The SDK handles
 * everything else in the background.
 */
export function CallbackPage() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    hasWorkosSession,
    isLoading,
    invalidWorkosSession,
    resetWorkosSession,
  } = useAuth();
  const workosAvailability = getWorkOSAvailability();
  const returnTo =
    typeof window !== "undefined"
      ? (window.sessionStorage.getItem("re7:auth:returnTo") ?? "/")
      : "/";
  const loginUrl =
    typeof window !== "undefined"
      ? new URL("/login", window.location.origin).toString()
      : "/login";

  useEffect(() => {
    if (
      isLoading ||
      invalidWorkosSession ||
      (!isAuthenticated && !hasWorkosSession)
    ) {
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("re7:auth:returnTo");
    }

    void navigate({ to: returnTo, replace: true });
  }, [
    hasWorkosSession,
    invalidWorkosSession,
    isAuthenticated,
    isLoading,
    navigate,
    returnTo,
  ]);

  if (!workosAvailability.canUseWorkOSAuth) {
    return (
      <div className="from-warm-50 to-paper-100 flex min-h-screen items-center justify-center bg-linear-to-b px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h1 className="font-heading text-ink-900 text-2xl font-semibold">
            Authentification interrompue
          </h1>
          <p className="text-ink-600 mt-2 text-sm">
            Reprenez la connexion depuis l'adresse HTTPS Tailscale de Re7, ou
            depuis localhost sur cette machine.
          </p>
          <AuthUnavailableNotice
            currentOrigin={workosAvailability.currentOrigin}
          />
        </div>
      </div>
    );
  }

  if (!isLoading && !isAuthenticated && !hasWorkosSession) {
    const title = invalidWorkosSession
      ? "Session expirée"
      : "Connexion interrompue";
    const description = invalidWorkosSession
      ? "La session Google n'a pas pu être validée. Cela peut arriver après un changement entre localhost et Tailscale, ou si la session a expiré."
      : "Aucune session de connexion valide n'a été trouvée pour terminer l'authentification.";

    return (
      <div className="from-warm-50 to-paper-100 flex min-h-screen items-center justify-center bg-linear-to-b px-4 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h1 className="font-heading text-ink-900 text-2xl font-semibold">
            {title}
          </h1>
          <p className="text-ink-600 mt-2 text-sm">{description}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Button
              onPress={() => {
                void resetWorkosSession(loginUrl);
              }}
              className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition"
            >
              Recommencer la connexion
            </Button>
            <Link
              to="/"
              className="border-ink-200 text-ink-700 hover:border-warm-300 hover:text-ink-900 rounded-lg border px-4 py-3 text-center font-medium transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
      <div className="text-center">
        <div className="border-warm-600 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-ink-600 mt-4">
          {isLoading
            ? "Authentification en cours..."
            : "Finalisation de la session..."}
        </p>
      </div>
    </div>
  );
}
