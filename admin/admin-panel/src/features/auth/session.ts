import { jwtDecode } from 'jwt-decode'
import { jwtPayloadSchema, type AuthUser } from './types'

export interface Session {
  token: string
  user: AuthUser
  /** Caducidad en milisegundos (epoch) */
  expiresAt: number
}

/** Decodifica el JWT (sin validar la firma). Devuelve null si no es válido o ya ha caducado. */
export function sessionFromToken(token: string): Session | null {
  try {
    const payload = jwtPayloadSchema.parse(jwtDecode(token))
    const expiresAt = payload.exp * 1000
    if (expiresAt <= Date.now()) return null
    return { token, user: { username: payload.sub, role: payload.role }, expiresAt }
  } catch {
    return null
  }
}
