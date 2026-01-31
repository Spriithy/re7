import type {
  UserLogin,
  UserCreate,
  Token,
  User,
  UserUpdateProfile,
  UserChangePassword,
  InvitedUser,
  InviteResponse,
  Category,
  CategoryCreate,
  CategoryUpdate,
  Recipe,
  RecipeCreate,
  RecipeUpdate,
  RecipeListResponse,
} from "./api-types";

// Re-export types for convenience
export type {
  UserLogin,
  UserCreate,
  Token,
  User,
  InvitedUser,
  InviteResponse,
  Category,
  CategoryCreate,
  CategoryUpdate,
  Difficulty,
  Ingredient,
  IngredientCreate,
  Step,
  StepCreate,
  Prerequisite,
  PrerequisiteCreate,
  RecipeAuthor,
  Recipe,
  RecipeListItem,
  RecipeListResponse,
  RecipeCreate,
  RecipeUpdate,
} from "./api-types";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  "http://localhost:8000";

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

async function request<T>(
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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

async function requestNoContent(
  endpoint: string,
  options: RequestOptions = {}
): Promise<void> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData
  if (!(fetchOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

async function requestWithFormData<T>(
  endpoint: string,
  formData: FormData,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

// Invite API
export const inviteApi = {
  validate: (token: string) =>
    request<{ valid: boolean }>(
      `/api/invites/validate/${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    ),

  create: (expiresInDays = 7, authToken: string) =>
    request<InviteResponse>("/api/invites", {
      method: "POST",
      body: JSON.stringify({ expires_in_days: expiresInDays }),
      token: authToken,
    }),
};

// Category API
export const categoryApi = {
  list: () => request<Category[]>("/api/categories"),

  get: (id: string) =>
    request<Category>(`/api/categories/${encodeURIComponent(id)}`),

  create: (data: CategoryCreate, token: string) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  update: (id: string, data: CategoryUpdate, token: string) =>
    request<Category>(`/api/categories/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    requestNoContent(`/api/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
      token,
    }),

  uploadImage: (id: string, file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<Category>(
      `/api/categories/${encodeURIComponent(id)}/image`,
      formData,
      token
    );
  },

  deleteImage: (id: string, token: string) =>
    requestNoContent(`/api/categories/${encodeURIComponent(id)}/image`, {
      method: "DELETE",
      token,
    }),

  getRecipeCount: (id: string) =>
    request<{ count: number }>(
      `/api/categories/${encodeURIComponent(id)}/recipes/count`
    ),
};

// Auth API
export const authApi = {
  login: (credentials: UserLogin) =>
    request<Token>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data: UserCreate) =>
    request<Token>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<User>("/api/auth/me", {
      method: "GET",
      token,
    }),

  refresh: (token: string) =>
    request<Token>("/api/auth/refresh", {
      method: "POST",
      token,
    }),
};

// User API
export const userApi = {
  updateProfile: (data: UserUpdateProfile, token: string) =>
    request<User>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    }),

  changePassword: (data: UserChangePassword, token: string) =>
    requestNoContent("/api/users/me/password", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  uploadAvatar: (file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<User>("/api/users/me/avatar", formData, token);
  },

  deleteAvatar: (token: string) =>
    requestNoContent("/api/users/me/avatar", {
      method: "DELETE",
      token,
    }),

  getInvitedUsers: (token: string) =>
    request<InvitedUser[]>("/api/users/me/invited", {
      method: "GET",
      token,
    }),
};

// Recipe API
export const recipeApi = {
  create: (data: RecipeCreate, token: string) =>
    request<Recipe>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  list: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    author_id?: string;
    category_id?: string;
    is_vegetarian?: boolean;
    is_vegan?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params) as [
        string,
        string | number | boolean | undefined,
      ][]) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
    }
    return request<RecipeListResponse>(
      `/api/recipes?${searchParams.toString()}`
    );
  },

  get: (id: string) =>
    request<Recipe>(`/api/recipes/${encodeURIComponent(id)}`),

  update: (id: string, data: RecipeUpdate, token: string) =>
    request<Recipe>(`/api/recipes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}`, {
      method: "DELETE",
      token,
    }),

  uploadImage: (id: string, file: File, token: string) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<Recipe>(
      `/api/recipes/${encodeURIComponent(id)}/image`,
      formData,
      token
    );
  },

  deleteImage: (id: string, token: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}/image`, {
      method: "DELETE",
      token,
    }),
};

// Helper to get full image URL
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  return `${API_BASE_URL}/uploads/${imagePath}`;
}
