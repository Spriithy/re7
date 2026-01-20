import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Separator,
} from 'react-aria-components'
import { User, UserPlus, Shield, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth'

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase()
}

export function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading || !isAuthenticated || !user) {
    return null
  }

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-3">
      <span className="hidden text-sm md:text-base font-medium text-ink-700 md:block">
        {user.username}
      </span>
      <MenuTrigger>
        <Button
          aria-label="Menu utilisateur"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-warm-600 text-sm font-semibold text-white shadow-lg transition hover:bg-warm-700 focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-warm-500 data-focus-visible:ring-offset-2 md:h-14 md:w-14 md:text-base"
        >
          {getInitials(user.username)}
        </Button>
        <Popover
          placement="bottom end"
          className="data-entering:animate-fade-in data-exiting:animate-fade-out"
        >
          <Menu className="min-w-50 rounded-xl bg-white p-1.5 shadow-xl outline-none ring-1 ring-ink-200">
            <MenuItem
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-700 outline-none transition data-focused:bg-warm-50 data-focused:text-warm-900"
              href="/invite"
            >
              <UserPlus className="h-4 w-4" />
              Inviter quelqu'un
            </MenuItem>
            <MenuItem
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-700 outline-none transition data-focused:bg-warm-50 data-focused:text-warm-900"
              href="/profile"
            >
              <User className="h-4 w-4" />
              Profil
            </MenuItem>
            {user.is_admin && (
              <MenuItem
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-700 outline-none transition data-focused:bg-warm-50 data-focused:text-warm-900"
                href="/admin"
              >
                <Shield className="h-4 w-4" />
                Administration
              </MenuItem>
            )}
            <Separator className="my-1.5 h-px bg-ink-100" />
            <MenuItem
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-700 outline-none transition data-focused:bg-warm-50 data-focused:text-warm-900"
              onAction={logout}
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  )
}
