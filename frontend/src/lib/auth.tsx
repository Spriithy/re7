import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { authApi, type User, type Token, type UserLogin, type UserCreate, ApiError } from './api'

const TOKEN_KEY = 're7-token'
const TOKEN_EXPIRES_KEY = 're7-token-expires'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (credentials: UserLogin) => Promise<void>
  register: (data: UserCreate) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function saveToken(tokenData: Token) {
  localStorage.setItem(TOKEN_KEY, tokenData.access_token)
  localStorage.setItem(TOKEN_EXPIRES_KEY, tokenData.expires_at)
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
}

function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY)

  if (!token || !expiresAt) {
    return null
  }

  // Check if token is expired
  if (new Date(expiresAt) <= new Date()) {
    clearToken()
    return null
  }

  return token
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  })

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) {
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        })
        return
      }

      try {
        const user = await authApi.me(storedToken)
        setState({
          user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        })
      } catch {
        clearToken()
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: UserLogin) => {
    const tokenData = await authApi.login(credentials)
    saveToken(tokenData)

    const user = await authApi.me(tokenData.access_token)
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    })
  }, [])

  const register = useCallback(async (data: UserCreate) => {
    const tokenData = await authApi.register(data)
    saveToken(tokenData)

    const user = await authApi.me(tokenData.access_token)
    setState({
      user,
      token: tokenData.access_token,
      isLoading: false,
      isAuthenticated: true,
    })
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { ApiError }
