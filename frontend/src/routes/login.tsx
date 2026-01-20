import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, TextField, Label, Input, Form, FieldError } from 'react-aria-components'
import { useAuth, ApiError } from '@/lib/auth'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate({ to: '/' })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ username, password })
      navigate({ to: '/' })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail)
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-warm-100 to-paper-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-heading text-4xl font-bold text-warm-900">Re7</h1>
          </Link>
          <p className="mt-2 font-heading text-lg text-warm-700 italic">
            Recettes de famille
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-ink-600">
            Connectez-vous pour accéder à vos recettes.
          </p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <TextField
              isRequired
              minLength={3}
              maxLength={50}
              className="space-y-1.5"
            >
              <Label className="text-sm font-medium text-ink-700">
                Nom d'utilisateur
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom d'utilisateur"
                className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <TextField
              isRequired
              minLength={6}
              type="password"
              className="space-y-1.5"
            >
              <Label className="text-sm font-medium text-ink-700">
                Mot de passe
              </Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                className="w-full rounded-lg border border-ink-200 px-4 py-2.5 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none focus:ring-2 focus:ring-warm-500/20"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="w-full rounded-lg bg-warm-600 px-4 py-3 font-semibold text-white transition hover:bg-warm-700 pressed:bg-warm-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Pas encore de compte ? Demandez une invitation à un membre de la famille.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          <Link to="/" className="hover:text-ink-700">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </main>
  )
}
