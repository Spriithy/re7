import { lazy, Suspense } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { UserMenu } from "@/components/UserMenu";
import { ErrorPage } from "@/components/ErrorPage";
import { RootErrorBoundary } from "@/components/RootErrorBoundary";

const TanStackDevtools = lazy(() =>
  import("@tanstack/react-devtools").then((m) => ({ default: m.TanStackDevtools }))
);
const TanStackRouterDevtoolsPanel = lazy(() =>
  import("@tanstack/react-router-devtools").then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
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

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserMenu />
        <Outlet />
{import.meta.env.DEV ? (
          <Suspense fallback={null}>
            <TanStackDevtools
              config={{
                position: "bottom-left",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: (
                    <Suspense fallback={null}>
                      <TanStackRouterDevtoolsPanel />
                    </Suspense>
                  ),
                },
              ]}
            />
          </Suspense>
        ) : null}
      </AuthProvider>
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
