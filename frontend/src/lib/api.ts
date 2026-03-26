import type {
  UserLogin,
  UserCreate,
  WorkOSLinkExistingRequest,
  WorkOSLinkRequest,
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
import {
  ApiError,
  getImageUrl,
  request,
  requestNoContent,
  requestWithFormData,
} from "./api-core";

export type * from "./api-types";
export { ApiError, getImageUrl };

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

  linkWorkOS: (data: WorkOSLinkRequest, token: string) =>
    request<User>("/api/auth/workos/link", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  linkExistingWorkOS: (data: WorkOSLinkExistingRequest, token: string) =>
    request<User>("/api/auth/workos/link-existing", {
      method: "POST",
      body: JSON.stringify(data),
      token,
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
    is_quick?: boolean;
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
