import { useNavigate, useRouter } from "@tanstack/react-router";
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
    <button
      className="text-ink-700 hover:bg-warm-50 hover:text-warm-900 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-base transition outline-none sm:px-3 sm:py-2.5 sm:text-sm"
      onClick={() => {
        onClose?.();
        void navigate({ to: href });
      }}
      onMouseEnter={handlePreload}
      onFocus={handlePreload}
    >
      <Icon className="h-5 w-5 sm:h-4 sm:w-4" />
      {children}
    </button>
  );
}
