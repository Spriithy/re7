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

// Invite API
export const inviteApi = {
  validate: (token: string) =>
    request<{ valid: boolean }>(`/api/invites/validate/${encodeURIComponent(token)}`, {
      method: 'GET',
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
