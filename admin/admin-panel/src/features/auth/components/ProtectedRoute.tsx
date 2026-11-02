import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { paths } from '@/routes/paths'
import { useAuth } from '../hooks/useAuth'

export interface LoginLocationState {
  /** Ruta a la que se intentaba acceder, para volver tras el login */
  from?: { pathname: string; search: string; hash: string }
}

/** Renderiza sus hijos (o el `<Outlet />`) solo si hay sesión; si no, redirige a /login. */
export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const state: LoginLocationState = {
      from: { pathname: location.pathname, search: location.search, hash: location.hash },
    }
    return <Navigate to={paths.login} replace state={state} />
  }

  return children ?? <Outlet />
}
