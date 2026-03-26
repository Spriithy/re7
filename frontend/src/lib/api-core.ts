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
  token?: string | null;
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...fetchOptions,
    headers,
  });

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
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...fetchOptions,
    headers,
  });

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
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    method: "POST",
    headers,
    body: formData,
  });

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
