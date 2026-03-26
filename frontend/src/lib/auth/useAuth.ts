import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-react";
import { ApiError, authApi, type User } from "../api";

const UNLINKED_ACCOUNT_DETAIL =
  "Authenticated WorkOS user is not linked to a local account";
const INVALID_TOKEN_DETAIL = "Invalid or expired token";
const NOT_AUTHENTICATED_DETAIL = "Not authenticated";
const MISSING_REFRESH_TOKEN_MESSAGE = "Missing refresh token.";

interface AuthSession {
  user: User | null;
}

class InvalidWorkOSSessionError extends Error {
  constructor() {
    super(INVALID_TOKEN_DETAIL);
    this.name = "InvalidWorkOSSessionError";
  }
}

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    user: workosUser,
    isLoading: workosLoading,
    signIn,
    signUp,
    signOut,
    getAccessToken,
    role,
    permissions,
  } = useWorkOSAuth();

  const sessionQuery = useQuery<AuthSession>({
    queryKey: ["auth-session", workosUser?.id ?? null],
    retry: false,
    queryFn: async () => {
      try {
        if (workosUser) {
          const accessToken = await getAccessToken();
          const session = await authApi.exchangeWorkOSSession(accessToken);
          return { user: session.user };
        }

        const user = await authApi.me();
        return { user };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(MISSING_REFRESH_TOKEN_MESSAGE)
        ) {
          throw new InvalidWorkOSSessionError();
        }

        if (error instanceof ApiError && error.status === 401) {
          if (error.detail === INVALID_TOKEN_DETAIL) {
            throw new InvalidWorkOSSessionError();
          }

          if (error.detail === NOT_AUTHENTICATED_DETAIL) {
            return { user: null };
          }
        }

        throw error;
      }
    },
  });

  const sessionError = sessionQuery.error;
  const linkingRequired =
    sessionError instanceof ApiError &&
    sessionError.status === 401 &&
    sessionError.detail === UNLINKED_ACCOUNT_DETAIL;
  const invalidWorkosSession =
    sessionError instanceof InvalidWorkOSSessionError;
  const user = sessionQuery.data?.user ?? null;
  const isLoading = workosLoading || sessionQuery.isLoading;
  const isAuthenticated = !!user;

  const login = async (credentials: { username: string; password: string }) => {
    await authApi.login(credentials);
    await sessionQuery.refetch();
  };

  const register = async (data: {
    username: string;
    password: string;
    invite_token?: string;
  }) => {
    await authApi.register({
      username: data.username,
      password: data.password,
      invite_token: data.invite_token ?? "",
    });
    await sessionQuery.refetch();
  };

  const refreshUser = async () => {
    await sessionQuery.refetch();
  };

  const logout = async () => {
    queryClient.removeQueries({ queryKey: ["auth-session"] });
    try {
      await authApi.logout();
    } finally {
      if (workosUser) {
        await signOut({ returnTo: window.location.origin, navigate: false });
      }
      window.location.assign(window.location.origin);
    }
  };

  const resetWorkosSession = async (returnTo = window.location.origin) => {
    queryClient.removeQueries({ queryKey: ["auth-session"] });

    try {
      await signOut({ returnTo, navigate: false });
    } catch (error) {
      console.error("WorkOS session reset failed", error);
    }

    window.location.assign(returnTo);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    signIn,
    signUp,
    signOut,
    getAccessToken,
    role,
    permissions,
    workosUser,
    hasWorkosSession: !!workosUser && !invalidWorkosSession,
    linkingRequired,
    invalidWorkosSession,
    resetWorkosSession,
  };
}
