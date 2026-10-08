import type { ReactNode } from 'react'
import { useHasRole } from '../hooks/useHasRole'
import type { Role } from '../types'

interface RoleGuardProps {
  roles: Role[]
  children: ReactNode
  /** Qué mostrar si el usuario no tiene ninguno de los roles (por defecto nada) */
  fallback?: ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const allowed = useHasRole(...roles)
  return allowed ? children : fallback
}
