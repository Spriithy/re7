import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "react-aria-components";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ArrowLeft, RefreshCw } from "lucide-react";
import { inviteApi } from "@/lib/api";

const TOKEN_KEY = "re7-token";

export const Route = createFileRoute("/invite")({
  beforeLoad: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      throw new Error("Redirect to login");
    }
    return { token };
  },
  loader: async ({ context }) => {
    const { token } = context as { token: string };
    const invite = await inviteApi.create(7, token);
    return { invite };
  },
  component: InvitePage,
});

function InvitePage() {
  const { invite } = Route.useLoaderData();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const registerUrl = `${window.location.origin}/register?invite=${encodeURIComponent(invite.token)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(registerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = registerUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateNewCode = async () => {
    // Invalidate and reload the route to generate a new invite code
    await router.invalidate();
  };

  return (
    <main className="from-warm-50 to-paper-100 relative flex min-h-screen flex-col items-center justify-center bg-linear-to-b px-4 py-12">
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="text-ink-600 hover:bg-paper-200/60 hover:text-ink-800 inline-flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm transition md:h-14 md:px-6 md:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-heading text-ink-900 text-2xl font-bold">
            Inviter quelqu'un
          </h1>
          <p className="text-ink-600 mt-2 text-sm">
            Partagez ce QR code pour inviter un proche.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div>
            <QRCodeSVG
              value={registerUrl}
              size={220}
              level="M"
              bgColor="transparent"
              fgColor="#d4522a"
            />
          </div>

          <Button
            onPress={copyLink}
            className="text-warm-600 hover:text-warm-700 pressed:text-warm-800 mt-6 inline-flex cursor-pointer items-center gap-2 font-bold transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copier le lien
              </>
            )}
          </Button>

          <Button
            onPress={generateNewCode}
            className="text-ink-500 hover:text-ink-700 pressed:text-ink-800 mt-3 inline-flex cursor-pointer items-center gap-2 text-sm transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Générer un nouveau code
          </Button>

          <p className="text-ink-500 mt-6 text-center text-xs">
            Ce lien expire dans 7 jours.
          </p>
        </div>
      </div>
    </main>
  );
}
