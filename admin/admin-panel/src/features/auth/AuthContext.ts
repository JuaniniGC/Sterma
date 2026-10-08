import { createContext } from 'react'
import type { LoginRequest } from '@/api/auth.api'
import type { AuthUser } from './types'

export interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  /** true si la última sesión terminó por un 401 (token caducado o inválido) */
  sessionExpired: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
