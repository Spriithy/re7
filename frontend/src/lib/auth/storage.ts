import type { Token } from "../api";

const TOKEN_KEY = "re7-token";
const TOKEN_EXPIRES_KEY = "re7-token-expires";

export function saveToken(tokenData: Token): void {
  localStorage.setItem(TOKEN_KEY, tokenData.access_token);
  localStorage.setItem(TOKEN_EXPIRES_KEY, tokenData.expires_at);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
}

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);

  if (!token || !expiresAt) {
    return null;
  }

  // Check if token is expired
  if (new Date(expiresAt) <= new Date()) {
    clearToken();
    return null;
  }

  return token;
}
