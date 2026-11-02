import { Button } from '@/components/ui/Button'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '../types'

export function UserMenu() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <p className="text-sm font-medium text-slate-900">{user.username}</p>
        <p className="text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
      </div>
      <Button variant="secondary" size="sm" onClick={logout}>
        Cerrar sesión
      </Button>
    </div>
  )
}
