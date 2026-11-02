import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, type LoginRequest } from '@/api/auth.api'
import { setUnauthorizedHandler } from '@/api/client'
import { ApiError } from '@/api/errors'
import { authToken } from '@/lib/authToken'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { sessionFromToken, type Session } from './session'

/** Restaura la sesión guardada; si el token no es válido o ha caducado, lo descarta. */
function restoreSession(): Session | null {
  const token = authToken.get()
  if (!token) return null
  const session = sessionFromToken(token)
  if (!session) authToken.clear()
  return session
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(restoreSession)
  const [sessionExpired, setSessionExpired] = useState(false)

  const endSession = useCallback(
    (expired: boolean) => {
      authToken.clear()
      // Evita que el siguiente usuario vea datos cacheados del anterior
      queryClient.clear()
      setSession(null)
      setSessionExpired(expired)
    },
    [queryClient],
  )

  const logout = useCallback(() => endSession(false), [endSession])

  const login = useCallback(async (credentials: LoginRequest) => {
    const { token } = await loginRequest(credentials)
    const newSession = sessionFromToken(token)
    if (!newSession) {
      throw new ApiError('El servidor devolvió un token no válido.', null, null)
    }
    authToken.set(token)
    setSession(newSession)
    setSessionExpired(false)
  }, [])

  // Cualquier 401 de una petición autenticada cierra la sesión.
  // ProtectedRoute se encarga de redirigir a /login.
  useEffect(() => {
    setUnauthorizedHandler(() => endSession(true))
    return () => setUnauthorizedHandler(null)
  }, [endSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: session !== null,
      sessionExpired,
      login,
      logout,
    }),
    [session, sessionExpired, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
