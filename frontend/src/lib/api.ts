const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  token?: string | null
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Une erreur est survenue' }))
    throw new ApiError(response.status, data.detail || 'Une erreur est survenue')
  }

  return response.json()
}

async function requestNoContent(
  endpoint: string,
  options: RequestOptions = {}
): Promise<void> {
  const { token, ...fetchOptions } = options

  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Don't set Content-Type for FormData
  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Une erreur est survenue' }))
    throw new ApiError(response.status, data.detail || 'Une erreur est survenue')
  }
}

async function requestWithFormData<T>(
  endpoint: string,
  formData: FormData,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {}

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ detail: 'Une erreur est survenue' }))
    throw new ApiError(response.status, data.detail || 'Une erreur est survenue')
  }

  return response.json()
}

// Auth types matching backend schemas
export interface UserLogin {
  username: string
  password: string
}

export interface UserCreate {
  username: string
  password: string
  invite_token: string
}

export interface Token {
  access_token: string
  token_type: string
  expires_at: string
}

export interface User {
  id: string
  username: string
  is_admin: boolean
  created_at: string
}

// Invite types
export interface InviteResponse {
  id: string
  token: string
  expires_at: string
  created_at: string
  is_used: boolean
}

// Invite API
export const inviteApi = {
  validate: (token: string) =>
    request<{ valid: boolean }>(`/api/invites/validate/${encodeURIComponent(token)}`, {
      method: 'GET',
    }),

  create: (expiresInDays: number = 7, authToken: string) =>
    request<InviteResponse>('/api/invites', {
      method: 'POST',
      body: JSON.stringify({ expires_in_days: expiresInDays }),
      token: authToken,
    }),
}

// Auth API
export const authApi = {
  login: (credentials: UserLogin) =>
    request<Token>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (data: UserCreate) =>
    request<Token>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<User>('/api/auth/me', {
      method: 'GET',
      token,
    }),

  refresh: (token: string) =>
    request<Token>('/api/auth/refresh', {
      method: 'POST',
      token,
    }),
}

// Recipe types
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  id: string
  quantity: number | null
  unit: string | null
  name: string
  is_scalable: boolean
  order: number
}

export interface IngredientCreate {
  quantity?: number | null
  unit?: string | null
  name: string
  is_scalable?: boolean
}

export interface Step {
  id: string
  instruction: string
  timer_minutes: number | null
  note: string | null
  order: number
}

export interface StepCreate {
  instruction: string
  timer_minutes?: number | null
  note?: string | null
}

export interface Prerequisite {
  id: string
  prerequisite_recipe_id: string
  prerequisite_recipe_title: string | null
  note: string | null
  order: number
}

export interface PrerequisiteCreate {
  prerequisite_recipe_id: string
  note?: string | null
}

export interface RecipeAuthor {
  id: string
  username: string
}

export interface Recipe {
  id: string
  title: string
  description: string | null
  image_path: string | null
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number
  serving_unit: string | null
  difficulty: Difficulty
  source: string | null
  author: RecipeAuthor
  ingredients: Ingredient[]
  steps: Step[]
  prerequisites: Prerequisite[]
  created_at: string
  updated_at: string
}

export interface RecipeListItem {
  id: string
  title: string
  description: string | null
  image_path: string | null
  prep_time_minutes: number | null
  cook_time_minutes: number | null
  servings: number
  serving_unit: string | null
  difficulty: Difficulty
  author: RecipeAuthor
  created_at: string
}

export interface RecipeListResponse {
  items: RecipeListItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface RecipeCreate {
  title: string
  description?: string | null
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  servings?: number
  serving_unit?: string | null
  difficulty?: Difficulty
  source?: string | null
  ingredients?: IngredientCreate[]
  steps?: StepCreate[]
  prerequisites?: PrerequisiteCreate[]
}

export interface RecipeUpdate {
  title?: string
  description?: string | null
  prep_time_minutes?: number | null
  cook_time_minutes?: number | null
  servings?: number
  serving_unit?: string | null
  difficulty?: Difficulty
  source?: string | null
  ingredients?: IngredientCreate[]
  steps?: StepCreate[]
  prerequisites?: PrerequisiteCreate[]
}

// Recipe API
export const recipeApi = {
  create: (data: RecipeCreate, token: string) =>
    request<Recipe>('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    }),

  list: (params?: { page?: number; page_size?: number; search?: string; author_id?: string }) =>
    request<RecipeListResponse>(`/api/recipes?${new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    ).toString()}`),

  get: (id: string) =>
    request<Recipe>(`/api/recipes/${encodeURIComponent(id)}`),

  update: (id: string, data: RecipeUpdate, token: string) =>
    request<Recipe>(`/api/recipes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    }),

  delete: (id: string, token: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      token,
    }),

  uploadImage: (id: string, file: File, token: string) => {
    const formData = new FormData()
    formData.append('file', file)
    return requestWithFormData<Recipe>(
      `/api/recipes/${encodeURIComponent(id)}/image`,
      formData,
      token
    )
  },

  deleteImage: (id: string, token: string) =>
    requestNoContent(`/api/recipes/${encodeURIComponent(id)}/image`, {
      method: 'DELETE',
      token,
    }),
}

// Helper to get full image URL
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null
  return `${API_BASE_URL}/uploads/${imagePath}`
}
