import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface AppHeaderProps {
  /** Title to display in the header */
  title?: string;
  /** Subtitle text (only shown on home page style) */
  subtitle?: string;
  /** Show back button instead of brand */
  showBackButton?: boolean;
  /** Custom back URL (defaults to "/") */
  backTo?: string;
  /** Right-side actions (rendered before UserMenu) */
  actions?: React.ReactNode;
  /** Additional content below the main header row */
  children?: React.ReactNode;
  /** Whether this is the home page (affects max-width and styling) */
  variant?: "default" | "home";
}

export function AppHeader({
  title,
  subtitle,
  showBackButton = false,
  backTo = "/",
  actions,
  children,
  variant = "default",
}: AppHeaderProps) {
  const maxWidthClass = variant === "home" ? "max-w-7xl" : "max-w-4xl";

  return (
    <header className="sticky top-0 z-40 bg-white/60 shadow-sm backdrop-blur-sm">
      <div className={`mx-auto px-4 py-3 sm:py-4 ${maxWidthClass}`}>
        <div className="flex items-center gap-3">
          {/* Left section: Back button or Brand */}
          {showBackButton ? (
            <Link
              to={backTo}
              className="text-ink-600 hover:bg-paper-200/40 hover:text-ink-800 -ml-2 inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm transition md:h-12 md:px-4 md:text-base"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Link>
          ) : (
            <div className="flex flex-col">
              <Link
                to="/"
                className="font-heading text-warm-700 text-xl font-bold sm:text-2xl"
              >
                {title ?? "Re7"}
              </Link>
              {subtitle && (
                <p className="text-ink-500 text-xs sm:text-sm">{subtitle}</p>
              )}
            </div>
          )}

          {/* Center section: Title (when back button shown) or spacer */}
          {showBackButton && title ? (
            <h1 className="font-heading text-ink-900 min-w-0 flex-1 text-lg leading-8 font-semibold sm:text-xl sm:leading-10">
              {title}
            </h1>
          ) : (
            <div className="flex-1" />
          )}

          {/* Right section: Actions + UserMenu */}
          <div className="flex items-center gap-2">
            {actions}
            <UserMenu />
          </div>
        </div>

        {/* Additional content (search, filters, etc.) */}
        {children}
      </div>
    </header>
  );
}
