import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "react-aria-components";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { inviteApi } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";

const TOKEN_KEY = "re7-token";

function PendingComponent() {
  return (
    <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
      <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

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
  pendingComponent: PendingComponent,
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
    <main className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <AppHeader title="Inviter quelqu'un" showBackButton />

      <div className="mx-auto w-full max-w-sm px-4 py-8">
        <p className="text-ink-600 text-center text-sm">
          Partagez ce QR code pour inviter un proche.
        </p>

        <div className="mt-6 flex flex-col items-center">
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
