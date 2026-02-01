import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "react-aria-components";
import type { User } from "lucide-react";

interface MenuItemLinkProps {
  href: string;
  icon: typeof User;
  children: React.ReactNode;
  onClose?: () => void;
}

export function MenuItemLink({
  href,
  icon: Icon,
  children,
  onClose,
}: MenuItemLinkProps) {
  const navigate = useNavigate();
  const router = useRouter();

  const handlePreload = () => {
    void router.preloadRoute({ to: href });
  };

  return (
    <Button
      className="text-ink-700 hover:bg-warm-50 hover:text-warm-900 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base transition outline-none sm:px-3 sm:py-2.5 sm:text-sm"
      onPress={() => {
        onClose?.();
        void navigate({ to: href });
      }}
      onHoverStart={handlePreload}
      onFocus={handlePreload}
    >
      <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
      {children}
    </Button>
  );
}
