import { createFileRoute } from "@tanstack/react-router";

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
function CallbackPage() {
  return (
    <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
      <div className="text-center">
        <div className="border-warm-600 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-ink-600 mt-4">Authentification en cours...</p>
      </div>
    </div>
  );
}
