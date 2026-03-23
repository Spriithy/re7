const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? "";

export function buildApiUrl(path: string): string {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, "");

  if (!normalizedBaseUrl) {
    return path;
  }

  return `${normalizedBaseUrl}${path}`;
}
