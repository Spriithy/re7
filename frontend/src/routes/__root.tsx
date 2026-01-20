import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { AuthProvider } from '@/lib/auth'
import { UserMenu } from '@/components/UserMenu'

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <UserMenu />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'top-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </AuthProvider>
  ),
})
