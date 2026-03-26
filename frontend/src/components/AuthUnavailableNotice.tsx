import { getWorkOSAvailability } from "@/lib/auth/originSecurity";

interface AuthUnavailableNoticeProps {
  currentOrigin?: string;
}

export function AuthUnavailableNotice({
  currentOrigin = getWorkOSAvailability().currentOrigin,
}: AuthUnavailableNoticeProps) {
  return (
    <div
      role="alert"
      className="border-warm-300 bg-warm-50 text-ink-800 mt-4 rounded-xl border p-4"
    >
      <h3 className="font-heading text-warm-900 text-lg font-semibold">
        Connexion indisponible sur cette adresse
      </h3>
      <p className="mt-2 text-sm">
        Cette page est ouverte via une adresse HTTP non securisee. La connexion
        Google necessite une URL securisee en HTTPS, ou bien localhost en
        developpement.
      </p>
      <p className="mt-2 text-sm">
        Ouvrez Re7 via son adresse HTTPS Tailscale, ou utilisez{" "}
        <span className="font-medium">http://localhost:3000</span> sur cette
        machine.
      </p>
      {currentOrigin ? (
        <p className="text-ink-600 mt-3 text-xs">
          Adresse actuelle : {currentOrigin}
        </p>
      ) : null}
    </div>
  );
}
