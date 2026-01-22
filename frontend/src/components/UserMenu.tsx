import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Separator,
} from "react-aria-components";
import { User, UserPlus, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <span className="text-ink-700 hidden text-sm font-medium md:block md:text-base">
        {user.username}
      </span>
      <MenuTrigger>
        <Button
          aria-label="Menu utilisateur"
          className="bg-warm-600 hover:bg-warm-700 data-focus-visible:ring-warm-500 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg transition focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-offset-2 md:h-14 md:w-14 md:text-base"
        >
          {getInitials(user.username)}
        </Button>
        <Popover
          placement="bottom end"
          className="data-entering:animate-fade-in data-exiting:animate-fade-out"
        >
          <Menu className="ring-ink-200 min-w-50 rounded-xl bg-white p-1.5 shadow-xl ring-1 outline-none">
            {user.is_admin && (
              <MenuItem
                className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
                href="/invite"
              >
                <UserPlus className="h-4 w-4" />
                Inviter quelqu'un
              </MenuItem>
            )}
            <MenuItem
              className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
              href="/profile"
            >
              <User className="h-4 w-4" />
              Profil
            </MenuItem>
            {user.is_admin && (
              <MenuItem
                className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
                href="/admin"
              >
                <Shield className="h-4 w-4" />
                Administration
              </MenuItem>
            )}
            <Separator className="bg-ink-100 my-1.5 h-px" />
            <MenuItem
              className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
              onAction={logout}
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </div>
  );
}
