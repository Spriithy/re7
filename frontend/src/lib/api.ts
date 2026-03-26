import type {
  Category,
  CategoryCreate,
  CategoryUpdate,
  InviteResponse,
  InvitedUser,
  Recipe,
  RecipeCreate,
  RecipeListResponse,
  RecipeUpdate,
  SessionResponse,
  User,
  UserChangePassword,
  UserCreate,
  UserLogin,
  UserUpdateProfile,
  WorkOSLinkExistingRequest,
  WorkOSLinkRequest,
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

export const inviteApi = {
  validate: (token: string) =>
    request<{ valid: boolean }>(
      `/api/invites/validate/${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    ),

  create: (expiresInDays = 7) =>
    request<InviteResponse>("/api/invites", {
      method: "POST",
      body: JSON.stringify({ expires_in_days: expiresInDays }),
    }),
};

export const categoryApi = {
  list: () => request<Category[]>("/api/categories"),

  get: (id: string) =>
    request<Category>(`/api/categories/${encodeURIComponent(id)}`),

  create: (data: CategoryCreate) =>
    request<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: CategoryUpdate) =>
    request<Category>(`/api/categories/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    requestNoContent(`/api/categories/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<Category>(
      `/api/categories/${encodeURIComponent(id)}/image`,
      formData
    );
  },

  deleteImage: (id: string) =>
    requestNoContent(`/api/categories/${encodeURIComponent(id)}/image`, {
      method: "DELETE",
    }),

  getRecipeCount: (id: string) =>
    request<{ count: number }>(
      `/api/categories/${encodeURIComponent(id)}/recipes/count`
    ),
};

export const authApi = {
  login: (credentials: UserLogin) =>
    request<SessionResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data: UserCreate) =>
    request<SessionResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  exchangeWorkOSSession: (workosAccessToken: string) =>
    request<SessionResponse>("/api/auth/workos/exchange", {
      method: "POST",
      authToken: workosAccessToken,
    }),

  linkWorkOS: (data: WorkOSLinkRequest, workosAccessToken: string) =>
    request<SessionResponse>("/api/auth/workos/link", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: workosAccessToken,
    }),

  linkExistingWorkOS: (
    data: WorkOSLinkExistingRequest,
    workosAccessToken: string
  ) =>
    request<SessionResponse>("/api/auth/workos/link-existing", {
      method: "POST",
      body: JSON.stringify(data),
      authToken: workosAccessToken,
    }),

  me: () =>
    request<User>("/api/auth/me", {
      method: "GET",
    }),

  refresh: () =>
    request<SessionResponse>("/api/auth/refresh", {
      method: "POST",
    }),

  logout: () =>
    requestNoContent("/api/auth/logout", {
      method: "POST",
    }),
};

export const userApi = {
  updateProfile: (data: UserUpdateProfile) =>
    request<User>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  changePassword: (data: UserChangePassword) =>
    requestNoContent("/api/users/me/password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<User>("/api/users/me/avatar", formData);
  },

  deleteAvatar: () =>
    requestNoContent("/api/users/me/avatar", {
      method: "DELETE",
    }),

  getInvitedUsers: () =>
    request<InvitedUser[]>("/api/users/me/invited", {
      method: "GET",
    }),
};

export const recipeApi = {
  create: (data: RecipeCreate) =>
    request<Recipe>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(data),
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

  update: (id: string, data: RecipeUpdate) =>
    request<Recipe>(`/api/recipes/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return requestWithFormData<Recipe>(
      `/api/recipes/${encodeURIComponent(id)}/image`,
      formData
    );
  },

  deleteImage: (id: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}/image`, {
      method: "DELETE",
    }),
};
