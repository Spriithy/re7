import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "react-aria-components";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { inviteApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { PendingComponent } from "@/components/PendingComponent";

export const Route = createFileRoute("/invite")({
  component: InvitePage,
});

function InvitePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const {
    data: invite,
    isLoading: inviteLoading,
    refetch,
  } = useQuery({
    queryKey: ["invite", user?.id ?? null],
    queryFn: () => inviteApi.create(7),
    enabled: isAuthenticated && !!user?.is_admin,
  });

  if (!isLoading && (!isAuthenticated || !user)) {
    return <Navigate to="/login" />;
  }

  if (!isLoading && !user?.is_admin) {
    return <Navigate to="/" />;
  }

  if (isLoading || inviteLoading || !invite) {
    return <PendingComponent />;
  }

  const registerUrl = `${window.location.origin}/register?invite=${encodeURIComponent(invite.token)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(registerUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
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
    await refetch();
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
