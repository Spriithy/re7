import { useRouter } from '@tanstack/react-router'
import { Button } from 'react-aria-components'
import { RefreshCw, Home } from 'lucide-react'

export interface ErrorPageProps {
  title: string
  description: string
  code?: string
  icon?: React.ComponentType<{ className?: string }>
  iconBgColor?: string
  iconColor?: string
  showDetails?: boolean
  errorMessage?: string
  reset?: () => void
}

export function ErrorPage({
  title,
  description,
  code,
  icon: Icon,
  iconBgColor = 'bg-red-100',
  iconColor = 'text-red-600',
  showDetails = false,
  errorMessage,
  reset,
}: ErrorPageProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon or Code */}
        {code ? (
          <div className="mx-auto mb-6">
            <p className="text-8xl font-serif font-bold text-warm-600">{code}</p>
          </div>
        ) : Icon ? (
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${iconBgColor}`}>
            <Icon className={`h-8 w-8 ${iconColor}`} />
          </div>
        ) : null}

        {/* Title */}
        <h1 className="mb-2 font-serif text-2xl font-bold text-ink-900">
          {title}
        </h1>

        {/* Description */}
        <p className="mb-6 text-ink-600">{description}</p>

        {/* Error Details */}
        {showDetails && errorMessage && (
          <div className="mb-8 rounded-lg bg-red-50 p-4 text-left">
            <p className="text-sm font-medium text-red-800">Détails de l'erreur :</p>
            <p className="mt-1 font-mono text-sm text-red-700 wrap-break-word">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {reset && (
            <Button
              onPress={reset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-warm-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-warm-700 focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-warm-500 data-focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          <Button
            onPress={() => router.navigate({ to: '/' })}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none data-focus-visible:ring-2 data-focus-visible:ring-warm-500 data-focus-visible:ring-offset-2 ${
              code && !reset
                ? 'bg-warm-600 text-white hover:bg-warm-700'
                : 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50'
            }`}
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
