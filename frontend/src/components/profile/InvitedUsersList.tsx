import { getImageUrl } from "@/lib/api";
import type { InvitedUser } from "@/lib/api";

interface InvitedUsersListProps {
  users: InvitedUser[];
  isLoading?: boolean;
}

export function InvitedUsersList({
  users,
  isLoading = false,
}: InvitedUsersListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-heading font-semibold text-ink-900">
          Mes invitations
        </h2>
        {!isLoading && (
          <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 bg-warm-100 text-warm-900 text-sm font-medium rounded-full">
            {users.length}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-lg h-24"
            />
          ))}
        </div>
      )}

      {/* User grid */}
      {!isLoading && users.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => {
            const displayName = user.full_name || user.username;
            const initials = displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);
            const avatarUrl = getImageUrl(user.avatar_url);

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 p-4 border border-ink-200 rounded-lg hover:border-warm-400 hover:bg-warm-50/30 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-warm-100">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-warm-400 to-warm-600 text-white text-sm font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* User info */}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink-900 truncate">
                    {displayName}
                  </div>
                  <div className="text-sm text-ink-600">
                    Membre depuis {formatDate(user.created_at)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && users.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-ink-600 text-lg">
            Vous n'avez invité personne
          </p>
          <p className="text-ink-500 text-sm mt-2">
            Partagez l'application avec vos proches
          </p>
        </div>
      )}
    </div>
  );
}
