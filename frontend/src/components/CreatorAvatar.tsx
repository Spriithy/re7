import { getImageUrl } from "@/lib/api";
import { getInitials } from "./utils/getInitials";

interface CreatorAvatarProps {
  author: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  size?: "sm" | "md";
  className?: string;
}

export function CreatorAvatar({
  author,
  size = "sm",
  className = "",
}: CreatorAvatarProps) {
  const displayName = author.full_name ?? author.username;
  const avatarUrl = getImageUrl(author.avatar_url);
  const hasAvatar = avatarUrl !== null;

  const sizeClasses = {
    sm: "h-5 w-5 text-xs",
    md: "h-8 w-8 text-sm",
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeClasses[size]} bg-warm-600 overflow-hidden rounded-full font-medium text-white ${className}`}
    >
      {hasAvatar ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(displayName)}</span>
      )}
    </div>
  );
}
