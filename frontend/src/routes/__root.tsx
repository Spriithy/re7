import { lazy, Suspense } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { ErrorPage } from "@/components/ErrorPage";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((m) => ({
    default: m.ReactQueryDevtools,
  }))
);

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}

function RootComponent() {
  const queryClient = getQueryClient();
  const clientId = String(import.meta.env.VITE_WORKOS_CLIENT_ID ?? "");
  const redirectUri = String(import.meta.env.VITE_WORKOS_REDIRECT_URI ?? "");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthKitProvider
        clientId={clientId}
        redirectUri={redirectUri}
        onRedirectCallback={({ state }) => {
          const redirectState =
            typeof state === "object" && state !== null
              ? (state as Record<string, unknown>)
              : null;
          const returnTo =
            typeof redirectState?.returnTo === "string"
              ? redirectState.returnTo
              : "/";
          window.location.replace(returnTo);
        }}
      >
        <Outlet />
        {import.meta.env.DEV ? (
          <Suspense fallback={null}>
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </Suspense>
        ) : null}
      </AuthKitProvider>
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorBoundary,
  notFoundComponent: () => (
    <ErrorPage
      code="404"
      title="Page introuvable"
      description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
      showDetails={false}
    />
  ),
});
