import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth/useAuth";
import { userApi, recipeApi } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { MyRecipesSection } from "@/components/profile/MyRecipesSection";
import { InvitedUsersList } from "@/components/profile/InvitedUsersList";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isLoading, refreshUser } = useAuth();

  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Extract IDs for stable query keys
  const userId = user?.id;

  // Query user's recipes - always call hooks, use enabled flag to control execution
  const { data: recipesData, isLoading: recipesLoading } = useQuery({
    queryKey: ["recipes", "mine", userId],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- enabled ensures userId is defined
    queryFn: () => recipeApi.list({ author_id: userId! }),
    enabled: !!userId && !!token && isAuthenticated,
  });

  // Query invited users
  const { data: invitedUsers = [], isLoading: invitedUsersLoading } = useQuery({
    queryKey: ["users", "invited", token],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- enabled ensures token is defined
    queryFn: () => userApi.getInvitedUsers(token!),
    enabled: !!token && isAuthenticated,
  });

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: (fullName: string | null) => {
      if (!token) throw new Error("Not authenticated");
      return userApi.updateProfile({ full_name: fullName }, token);
    },
    onSuccess: async () => {
      await refreshUser();
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
    },
  });

  // Password change mutation
  const passwordChangeMutation = useMutation({
    mutationFn: ({
      current,
      newPass,
    }: {
      current: string;
      newPass: string;
    }) => {
      if (!token) throw new Error("Not authenticated");
      return userApi.changePassword(
        { current_password: current, new_password: newPass },
        token
      );
    },
    onSuccess: () => {
      setPasswordChangeSuccess(true);
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
    },
  });

  // Avatar upload mutation
  const avatarUploadMutation = useMutation({
    mutationFn: (file: File) => {
      if (!token) throw new Error("Not authenticated");
      return userApi.uploadAvatar(file, token);
    },
    onSuccess: async () => {
      await refreshUser();
    },
  });

  // Avatar delete mutation
  const avatarDeleteMutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error("Not authenticated");
      return userApi.deleteAvatar(token);
    },
    onSuccess: async () => {
      await refreshUser();
    },
  });

  const recipes = recipesData?.items ?? [];

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="from-warm-50 to-paper-100 flex h-screen min-h-screen items-center justify-center">
        <div className="border-warm-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    );
  }

  // Redirect to login if not authenticated (after loading is complete)
  if (!isAuthenticated || !user || !token) {
    void navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="from-warm-50 to-paper-100 min-h-screen bg-linear-to-b">
      <AppHeader title="Profil" showBackButton />

      {/* Main content */}
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6 sm:py-8">
        {/* Profile info section */}
        <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <ProfileAvatar
            user={user}
            onUpload={(file) => avatarUploadMutation.mutate(file)}
            onDelete={() => avatarDeleteMutation.mutate()}
            isUploading={avatarUploadMutation.isPending}
            isDeleting={avatarDeleteMutation.isPending}
          />

          <div className="border-ink-100 mt-6 border-t pt-6">
            <ProfileForm
              user={user}
              onSave={(fullName) => profileUpdateMutation.mutate(fullName)}
              isSaving={profileUpdateMutation.isPending}
              error={
                profileUpdateMutation.error?.message ??
                avatarUploadMutation.error?.message ??
                avatarDeleteMutation.error?.message ??
                null
              }
              success={profileUpdateSuccess}
            />
          </div>
        </div>

        {/* Password change section */}
        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-sm backdrop-blur-sm">
          <PasswordChangeForm
            onSave={(current, newPass) =>
              passwordChangeMutation.mutate({ current, newPass })
            }
            isSaving={passwordChangeMutation.isPending}
            error={passwordChangeMutation.error?.message ?? null}
            success={passwordChangeSuccess}
          />
        </div>

        {/* My recipes section */}
        <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <MyRecipesSection recipes={recipes} isLoading={recipesLoading} />
        </div>

        {/* Invited users section */}
        <div className="rounded-2xl bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <InvitedUsersList
            users={invitedUsers}
            isLoading={invitedUsersLoading}
          />
        </div>
      </main>
    </div>
  );
}
