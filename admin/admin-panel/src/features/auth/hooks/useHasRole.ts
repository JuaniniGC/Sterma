import type { Role } from '../types'
import { useAuth } from './useAuth'

/** true si el usuario autenticado tiene alguno de los roles indicados. */
export function useHasRole(...roles: Role[]): boolean {
  const { user } = useAuth()
  return user !== null && roles.includes(user.role)
}
