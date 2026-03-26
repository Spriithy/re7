import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth as useWorkOSAuth } from "@workos-inc/authkit-react";
import { ApiError, authApi, type User } from "../api";

const UNLINKED_ACCOUNT_DETAIL =
  "Authenticated WorkOS user is not linked to a local account";
const INVALID_TOKEN_DETAIL = "Invalid or expired token";
const MISSING_REFRESH_TOKEN_MESSAGE = "Missing refresh token.";

interface AuthSession {
  token: string;
  user: User;
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
    enabled: !workosLoading && !!workosUser,
    retry: false,
    queryFn: async () => {
      try {
        const accessToken = await getAccessToken();
        const currentUser = await authApi.me(accessToken);
        return {
          token: accessToken,
          user: currentUser,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes(MISSING_REFRESH_TOKEN_MESSAGE)
        ) {
          throw new InvalidWorkOSSessionError();
        }

        if (
          error instanceof ApiError &&
          error.status === 401 &&
          error.detail === INVALID_TOKEN_DETAIL
        ) {
          throw new InvalidWorkOSSessionError();
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

  const isLoading = workosLoading || sessionQuery.isLoading;
  const user = sessionQuery.data?.user ?? null;
  const token = sessionQuery.data?.token ?? null;
  const isAuthenticated = !!workosUser && !!user && !!token;

  const login = async (_credentials?: {
    username: string;
    password: string;
  }) => {
    await signIn();
  };

  const register = async (_data?: {
    username: string;
    password: string;
    invite_token?: string;
  }) => {
    await signUp();
  };

  const refreshUser = async () => {
    if (!workosUser) {
      queryClient.removeQueries({ queryKey: ["auth-session"] });
      return;
    }

    await sessionQuery.refetch();
  };

  const logout = () => {
    queryClient.removeQueries({ queryKey: ["auth-session"] });
    signOut({ returnTo: window.location.origin });
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
    token,
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
