import { useState, useEffect, useCallback, type ReactNode } from "react";
import { authApi, type UserLogin, type UserCreate } from "../api";
import type { AuthState } from "./types";
import { AuthContext } from "./AuthContext";
import { saveToken, clearToken, getStoredToken } from "./storage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken();
      if (!storedToken) {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
        return;
      }

      try {
        const user = await authApi.me(storedToken);
        setState({
          user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        clearToken();
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    void initAuth();
  }, []);

  const login = useCallback(async (credentials: UserLogin) => {
    const tokenData = await authApi.login(credentials);
    saveToken(tokenData);

    const user = await authApi.me(tokenData.access_token);
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(async (data: UserCreate) => {
    const tokenData = await authApi.register(data);
    saveToken(tokenData);

    const user = await authApi.me(tokenData.access_token);
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
