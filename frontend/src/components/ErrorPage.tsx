import { useRouter } from "@tanstack/react-router";
import { Button } from "react-aria-components";
import { RefreshCw, Home } from "lucide-react";

export interface ErrorPageProps {
  title: string;
  description: string;
  code?: string;
  icon?: React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  showDetails?: boolean;
  errorMessage?: string;
  reset?: () => void;
}

export function ErrorPage({
  title,
  description,
  code,
  icon: Icon,
  iconBgColor = "bg-red-100",
  iconColor = "text-red-600",
  showDetails = false,
  errorMessage,
  reset,
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="bg-cream-50 flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon or Code */}
        {code ? (
          <div className="mx-auto mb-6">
            <p className="text-warm-600 font-serif text-8xl font-bold">
              {code}
            </p>
          </div>
        ) : Icon ? (
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${iconBgColor}`}
          >
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        ) : null}

        {/* Title */}
        <h1 className="text-ink-900 mb-2 font-serif text-2xl font-bold">
          {title}
        </h1>

        {/* Description */}
        <p className="text-ink-600 mb-6">{description}</p>

        {/* Error Details */}
        {showDetails && errorMessage && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm font-medium text-red-800">
              Détails de l'erreur :
            </p>
            <p className="mt-1 font-mono text-sm wrap-break-word text-red-700">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {reset && (
            <Button
              onPress={reset}
              className="bg-warm-600 hover:bg-warm-700 data-focus-visible:ring-warm-500 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm transition focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          <Button
            onPress={() => router.navigate({ to: "/" })}
            className={`data-focus-visible:ring-warm-500 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-offset-2 ${
              code && !reset
                ? "bg-warm-600 hover:bg-warm-700 text-white"
                : "border-ink-200 text-ink-700 hover:bg-ink-50 border bg-white"
            }`}
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
