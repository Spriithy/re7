import { getImageUrl } from "@/lib/api";
import type { InvitedUser } from "@/lib/api";

// Cache formatter at module level to avoid recreation on every render
const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  year: "numeric",
  month: "long",
});

function formatDate(dateString: string) {
  return dateFormatter.format(new Date(dateString));
}

interface InvitedUsersListProps {
  users: InvitedUser[];
  isLoading?: boolean;
}

export function InvitedUsersList({
  users,
  isLoading = false,
}: InvitedUsersListProps) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-heading text-ink-900 text-lg font-semibold">
          Mes invitations
        </h2>
        {!isLoading && (
          <span className="bg-warm-100 text-warm-900 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-sm font-medium">
            {users.length}
          </span>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* User grid */}
      {!isLoading && users.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const displayName = user.full_name ?? user.username;
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
                className="border-ink-200 hover:border-warm-400 hover:bg-warm-50/30 flex items-center gap-3 rounded-lg border p-4 transition-colors"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="bg-warm-100 h-12 w-12 overflow-hidden rounded-full">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="from-warm-400 to-warm-600 flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                {/* User info */}
                <div className="min-w-0 flex-1">
                  <div className="text-ink-900 truncate font-medium">
                    {displayName}
                  </div>
                  <div className="text-ink-600 text-sm">
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
          <p className="text-ink-600 text-lg">Vous n'avez invité personne</p>
          <p className="text-ink-500 mt-2 text-sm">
            Partagez l'application avec vos proches
          </p>
        </div>
      )}
    </div>
  );
}
