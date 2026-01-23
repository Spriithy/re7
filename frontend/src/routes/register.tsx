import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Button,
  TextField,
  Label,
  Input,
  Form,
  FieldError,
} from "react-aria-components";
import { useAuth } from "@/lib/auth/useAuth";
import { ApiError } from "@/lib/api";
import { inviteApi } from "@/lib/api";

interface RegisterSearch {
  invite: string;
}

export const Route = createFileRoute("/register")({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>): RegisterSearch => {
    const invite = typeof search.invite === "string" ? search.invite : "";
    return { invite };
  },
  loaderDeps: ({ search: { invite } }) => ({ invite }),
  loader: async ({ deps: { invite } }) => {
    if (!invite) {
      return { isValidInvite: false };
    }
    const result = await inviteApi.validate(invite);
    return { isValidInvite: result.valid };
  },
});

function RegisterPage() {
  const navigate = useNavigate();
  const { invite } = Route.useSearch();
  const { isValidInvite } = Route.useLoaderData();
  const { register, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    void navigate({ to: "/" });
    return null;
  }

  // Show error if invite is invalid
  if (!isValidInvite) {
    return (
      <main className="from-warm-100 to-paper-100 flex min-h-screen flex-col items-center justify-center bg-gradient-to-b px-4 py-12">
        <Link to="/" className="inline-block">
          <h1 className="font-heading text-warm-900 text-4xl font-bold">Re7</h1>
        </Link>
        <p className="font-heading text-warm-700 mt-1 text-lg italic">
          Recettes de famille
        </p>

        {/* Tipped over pot illustration */}
        <svg
          className="mt-12 h-40 w-40"
          viewBox="0 0 160 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Spilled liquid puddle */}
          <ellipse
            cx="100"
            cy="125"
            rx="45"
            ry="10"
            className="fill-warm-300/60"
          />
          <ellipse
            cx="115"
            cy="122"
            rx="25"
            ry="6"
            className="fill-warm-400/40"
          />

          {/* Pot body - tipped over */}
          <g transform="rotate(-35 70 90)">
            {/* Pot base */}
            <ellipse
              cx="70"
              cy="105"
              rx="35"
              ry="8"
              className="fill-warm-600"
            />
            {/* Pot body */}
            <path
              d="M35 60 C35 85 40 105 70 105 C100 105 105 85 105 60"
              className="fill-warm-500"
            />
            {/* Pot rim */}
            <ellipse
              cx="70"
              cy="60"
              rx="35"
              ry="10"
              className="fill-warm-600"
            />
            {/* Inner pot */}
            <ellipse cx="70" cy="60" rx="28" ry="7" className="fill-warm-700" />
            {/* Left handle */}
            <rect
              x="25"
              y="55"
              width="12"
              height="6"
              rx="2"
              className="fill-warm-700"
            />
            {/* Right handle */}
            <rect
              x="103"
              y="55"
              width="12"
              height="6"
              rx="2"
              className="fill-warm-700"
            />
          </g>

          {/* Small droplets */}
          <circle cx="130" cy="115" r="3" className="fill-warm-400/50" />
          <circle cx="60" cy="128" r="4" className="fill-warm-300/50" />
          <circle cx="145" cy="120" r="2" className="fill-warm-400/40" />
        </svg>

        <h2 className="font-heading text-ink-900 mt-8 text-2xl font-semibold">
          Ce lien n'est plus valide
        </h2>
        <p className="text-ink-600 mt-3 max-w-sm text-center">
          L'invitation a peut-être expiré ou a déjà été utilisée.
        </p>
        <p className="text-ink-500 mt-6 text-sm">
          Demandez un nouveau lien à un membre de la famille.
        </p>
        <Link
          to="/"
          className="text-warm-700 decoration-warm-300 hover:text-warm-800 hover:decoration-warm-400 mt-8 font-medium underline underline-offset-4 transition"
        >
          Retour à l'accueil
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username,
        password,
        invite_token: invite,
      });
      void navigate({ to: "/" });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.detail === "Username already taken") {
          setError("Ce nom d'utilisateur est déjà pris.");
        } else if (err.detail === "Invalid invite token") {
          setError("Code d'invitation invalide.");
        } else if (
          err.detail === "Invite token has expired or already been used"
        ) {
          setError("Ce code d'invitation a expiré ou a déjà été utilisé.");
        } else {
          setError(err.detail);
        }
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="from-warm-100 to-paper-100 flex min-h-screen items-center justify-center bg-gradient-to-b px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-heading text-warm-900 text-4xl font-bold">
              Re7
            </h1>
          </Link>
          <p className="font-heading text-warm-700 mt-2 text-lg italic">
            Recettes de famille
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-heading text-ink-900 text-2xl font-semibold">
            Créer un compte
          </h2>
          <p className="text-ink-600 mt-2 text-sm">
            Rejoignez la famille pour partager vos recettes.
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
              <Label className="text-ink-700 text-sm font-medium">
                Nom d'utilisateur
              </Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choisissez un nom d'utilisateur"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <TextField
              isRequired
              minLength={6}
              type="password"
              className="space-y-1.5"
            >
              <Label className="text-ink-700 text-sm font-medium">
                Mot de passe
              </Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choisissez un mot de passe"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <TextField
              isRequired
              minLength={6}
              type="password"
              className="space-y-1.5"
            >
              <Label className="text-ink-700 text-sm font-medium">
                Confirmer le mot de passe
              </Label>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                className="border-ink-200 text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:ring-warm-500/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none"
              />
              <FieldError className="text-sm text-red-600" />
            </TextField>

            <Button
              type="submit"
              isDisabled={isSubmitting}
              className="bg-warm-600 hover:bg-warm-700 pressed:bg-warm-800 w-full rounded-lg px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Création..." : "Créer mon compte"}
            </Button>
          </Form>

          <p className="text-ink-600 mt-6 text-center text-sm">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-warm-600 hover:text-warm-700 font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>

        <p className="text-ink-500 mt-6 text-center text-xs">
          <Link to="/" className="hover:text-ink-700">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </main>
  );
}
