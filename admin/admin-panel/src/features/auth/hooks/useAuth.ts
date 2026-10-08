import { use } from 'react'
import { AuthContext, type AuthContextValue } from '../AuthContext'

export function useAuth(): AuthContextValue {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}
