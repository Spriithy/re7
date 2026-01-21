import { Outlet, createRootRoute } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/lib/auth'
import { UserMenu } from '@/components/UserMenu'
import { ErrorPage } from '@/components/ErrorPage'
import { AlertTriangle, ServerCrash } from 'lucide-react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    browserQueryClient ??= makeQueryClient()
    return browserQueryClient
  }
}

function RootComponent() {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserMenu />
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const errorMessage = error instanceof Error ? error.message : 'Une erreur inattendue est survenue'

  // Check for 404 (Not Found)
  if (
    error instanceof Error &&
    (error.message.includes('404') ||
      error.message.toLowerCase().includes('not found') ||
      error.message.toLowerCase().includes('notfound'))
  ) {
    return (
      <ErrorPage
        code="404"
        title="Page introuvable"
        description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
        showDetails={false}
        reset={reset}
      />
    )
  }

  // Check for 500 (Server Error)
  if (
    error instanceof Error &&
    (error.message.includes('500') ||
      error.message.toLowerCase().includes('server error') ||
      error.message.toLowerCase().includes('internal error'))
  ) {
    return (
      <ErrorPage
        title="Erreur serveur"
        description="Nos serveurs rencontrent des difficultés. Veuillez réessayer dans quelques instants."
        icon={ServerCrash}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        showDetails={true}
        errorMessage={errorMessage}
        reset={reset}
      />
    )
  }

  // Default: Runtime error
  return (
    <ErrorPage
      title="Oups, quelque chose s'est mal passé"
      description="Nous sommes désolés, une erreur est survenue lors du chargement de la page."
      icon={AlertTriangle}
      iconBgColor="bg-red-100"
      iconColor="text-red-600"
      showDetails={true}
      errorMessage={errorMessage}
      reset={reset}
    />
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent:  ()=>  <ErrorPage
      code="404"
      title="Page introuvable"
      description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
      showDetails={false}
    />,
})
