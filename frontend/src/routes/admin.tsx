import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/useAuth";
import { AppHeader } from "@/components/AppHeader";
import { CategoryManagement } from "@/components/admin/CategoryManagement";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user || !token) {
    void navigate({ to: "/login" });
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Redirect to home if not admin
  if (!user.is_admin) {
    void navigate({ to: "/" });
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center bg-linear-to-b">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <AppHeader title="Administration" showBackButton />

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:py-8">
        <CategoryManagement token={token} />
      </main>
    </div>
  );
}
