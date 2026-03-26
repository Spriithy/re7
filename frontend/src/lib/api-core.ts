const rawApiBaseUrl = (
  import.meta.env.VITE_API_URL as string | undefined
)?.trim();
const API_BASE_URL = rawApiBaseUrl ? rawApiBaseUrl.replace(/\/$/, "") : "";

function getApiUrl(endpoint: string): string {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }

  return endpoint;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

interface ErrorResponse {
  detail?: string;
}

async function parseErrorResponse(response: Response): Promise<ErrorResponse> {
  try {
    return (await response.json()) as ErrorResponse;
  } catch {
    return { detail: "Une erreur est survenue" };
  }
}

interface RequestOptions extends RequestInit {
  authToken?: string | null;
}

const AUTH_RETRY_EXCLUDED_ENDPOINTS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/auth/workos/exchange",
]);

async function fetchWithSessionRetry(
  endpoint: string,
  init: RequestInit,
  authToken?: string | null,
  hasRetried = false
): Promise<Response> {
  const response = await fetch(getApiUrl(endpoint), {
    ...init,
    credentials: "include",
  });

  if (
    response.status === 401 &&
    !authToken &&
    !hasRetried &&
    !AUTH_RETRY_EXCLUDED_ENDPOINTS.has(endpoint)
  ) {
    const refreshResponse = await fetch(getApiUrl("/api/auth/refresh"), {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      return fetchWithSessionRetry(endpoint, init, authToken, true);
    }
  }

  return response;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { authToken, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetchWithSessionRetry(
    endpoint,
    {
      ...fetchOptions,
      headers,
    },
    authToken
  );

  if (!response.ok) {
    const data = await parseErrorResponse(response);
    throw new ApiError(
      response.status,
      data.detail ?? "Une erreur est survenue"
    );
  }

  return response.json() as Promise<T>;
}

export async function requestNoContent(
  endpoint: string,
  options: RequestOptions = {}
): Promise<void> {
  const { authToken, ...fetchOptions } = options;
  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetchWithSessionRetry(
    endpoint,
    {
      ...fetchOptions,
      headers,
    },
    authToken
  );

  if (!response.ok) {
    const data = await parseErrorResponse(response);
    throw new ApiError(
      response.status,
      data.detail ?? "Une erreur est survenue"
    );
  }
}

export async function requestWithFormData<T>(
  endpoint: string,
  formData: FormData,
  authToken?: string | null
): Promise<T> {
  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetchWithSessionRetry(
    endpoint,
    {
      method: "POST",
      headers,
      body: formData,
    },
    authToken
  );

  if (!response.ok) {
    const data = await parseErrorResponse(response);
    throw new ApiError(
      response.status,
      data.detail ?? "Une erreur est survenue"
    );
  }

  return response.json() as Promise<T>;
}

export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/")) {
    return API_BASE_URL ? `${API_BASE_URL}${imagePath}` : imagePath;
  }

  const normalizedPath = imagePath.replace(/^\/+/, "");
  const uploadsBaseUrl = API_BASE_URL ? `${API_BASE_URL}/uploads` : "/uploads";
  return `${uploadsBaseUrl}/${normalizedPath}`;
}
