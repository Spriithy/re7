import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const { isAuthenticated, hasWorkosSession, isLoading } = useAuth();
  const workosAvailability = getWorkOSAvailability();
  const returnTo =
    typeof window !== "undefined"
      ? (window.sessionStorage.getItem("re7:auth:returnTo") ?? "/")
      : "/";

  useEffect(() => {
    if (isLoading || (!isAuthenticated && !hasWorkosSession)) {
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("re7:auth:returnTo");
    }

    void navigate({ to: returnTo, replace: true });
  }, [hasWorkosSession, isAuthenticated, isLoading, navigate, returnTo]);

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
