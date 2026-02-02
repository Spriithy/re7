import { useState, useEffect, type ReactNode } from "react";
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

  async function login(credentials: UserLogin) {
    const tokenData = await authApi.login(credentials);
    saveToken(tokenData);

    const user = await authApi.me(tokenData.access_token);
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    });
  }

  async function register(data: UserCreate) {
    const tokenData = await authApi.register(data);
    saveToken(tokenData);

    const user = await authApi.me(tokenData.access_token);
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    });
  }

  function logout() {
    clearToken();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }

  async function refreshUser() {
    const storedToken = getStoredToken();
    if (!storedToken) return;

    try {
      const user = await authApi.me(storedToken);
      setState((prev) => ({
        ...prev,
        user,
      }));
    } catch {
      // If refresh fails, log out the user
      logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
