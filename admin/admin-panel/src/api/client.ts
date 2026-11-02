import axios from 'axios'
import { authToken } from '@/lib/authToken'
import { toApiError } from './errors'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** No enviar el token ni tratar el 401 como sesión caducada (p. ej. el login) */
    skipAuth?: boolean
  }
}

/**
 * Única instancia HTTP de la aplicación. Úsala solo desde `src/api/`.
 * En desarrollo se usa `/api` (proxy de Vite hacia `VITE_API_URL`, evita CORS);
 * en producción se llama directamente a `VITE_API_URL`.
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

let unauthorizedHandler: (() => void) | null = null

/** Registra qué hacer cuando una petición autenticada devuelve 401 (lo hace `AuthProvider`). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler
}

httpClient.interceptors.request.use((config) => {
  if (config.skipAuth) return config
  const token = authToken.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)
    const config = axios.isAxiosError(error) ? error.config : undefined
    const sentToken = Boolean(config?.headers?.Authorization)
    if (apiError.status === 401 && !config?.skipAuth && sentToken) {
      authToken.clear()
      unauthorizedHandler?.()
    }
    return Promise.reject(apiError)
  },
)
