import { useMutation } from '@tanstack/react-query'
import { useAuth } from './useAuth'

export function useLogin() {
  const { login } = useAuth()
  return useMutation({
    mutationFn: login,
    // El error se muestra dentro del formulario de login
    meta: { skipErrorToast: true },
  })
}
