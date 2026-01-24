import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  ModalOverlay,
  Popover,
  Separator,
} from "react-aria-components";
import { User, UserPlus, Shield, LogOut, X } from "lucide-react";
import { useAuth } from "@/lib/auth/useAuth";
import { useRouter } from "@tanstack/react-router";
import { MenuItemLink } from "./MenuItemLink";
import { useIsMobile } from "./utils/useIsMobile";
import { getInitials } from "./utils/getInitials";

export function UserMenu() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const triggerButton = (
    <Button
      aria-label="Menu utilisateur"
      className="bg-warm-600 hover:bg-warm-700 data-focus-visible:ring-warm-500 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg transition focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-offset-2 sm:h-14 sm:w-14 sm:text-base"
    >
      {getInitials(user.username)}
    </Button>
  );

  // Mobile: Bottom drawer
  if (isMobile) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <DialogTrigger isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          {triggerButton}
          <ModalOverlay
            className="data-entering:animate-fade-in data-exiting:animate-fade-out fixed inset-0 z-50 bg-black/40"
            isDismissable
          >
            <Modal className="data-entering:animate-slide-up data-exiting:animate-slide-down fixed right-0 bottom-0 left-0 z-50">
              <Dialog className="rounded-t-2xl bg-white p-4 pb-8 outline-none">
                {({ close }) => (
                  <>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-warm-600 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
                          {getInitials(user.username)}
                        </div>
                        <span className="text-ink-900 font-medium">
                          {user.username}
                        </span>
                      </div>
                      <Button
                        onPress={close}
                        aria-label="Fermer"
                        className="text-ink-500 hover:bg-ink-100 -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {user.is_admin && (
                        <MenuItemLink
                          href="/invite"
                          icon={UserPlus}
                          onClose={close}
                        >
                          Inviter quelqu'un
                        </MenuItemLink>
                      )}
                      <MenuItemLink href="/profile" icon={User} onClose={close}>
                        Profil
                      </MenuItemLink>
                      {user.is_admin && (
                        <MenuItemLink
                          href="/admin"
                          icon={Shield}
                          onClose={close}
                        >
                          Administration
                        </MenuItemLink>
                      )}
                      <div className="bg-ink-100 my-2 h-px" />
                      <button
                        className="text-ink-700 hover:bg-warm-50 hover:text-warm-900 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base transition outline-none"
                        onClick={() => {
                          close();
                          logout();
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Se déconnecter
                      </button>
                    </div>
                  </>
                )}
              </Dialog>
            </Modal>
          </ModalOverlay>
        </DialogTrigger>
      </div>
    );
  }

  // Desktop: Popover menu
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <span className="text-ink-700 text-base font-medium">
        {user.username}
      </span>
      <MenuTrigger>
        {triggerButton}
        <Popover
          placement="bottom end"
          className="data-entering:animate-fade-in data-exiting:animate-fade-out"
        >
          <Menu className="ring-ink-200 min-w-50 rounded-xl bg-white p-1.5 shadow-xl ring-1 outline-none">
            {user.is_admin && (
              <MenuItem
                className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
                href="/invite"
                onHoverStart={() => router.preloadRoute({ to: "/invite" })}
                onFocus={() => router.preloadRoute({ to: "/invite" })}
              >
                <UserPlus className="h-4 w-4" />
                Inviter quelqu'un
              </MenuItem>
            )}
            <MenuItem
              className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
              href="/profile"
              onHoverStart={() => router.preloadRoute({ to: "/profile" })}
              onFocus={() => router.preloadRoute({ to: "/profile" })}
            >
              <User className="h-4 w-4" />
              Profil
            </MenuItem>
            {user.is_admin && (
              <MenuItem
                className="text-ink-700 data-focused:bg-warm-50 data-focused:text-warm-900 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition outline-none"
                href="/admin"
                onHoverStart={() => router.preloadRoute({ to: "/admin" })}
                onFocus={() => router.preloadRoute({ to: "/admin" })}
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
