import { MutationCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ApiError, getErrorMessage } from '@/api/errors'

const MAX_RETRIES = 1

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // No reintentar errores del cliente (4xx): repetirlos no cambia el resultado
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status !== null && error.status < 500) return false
        return failureCount < MAX_RETRIES
      },
    },
    mutations: {
      retry: false,
    },
  },
  // Los errores de mutación se notifican con un toast salvo que la mutación
  // indique `meta: { skipErrorToast: true }` (p. ej. si los muestra en el formulario).
  mutationCache: new MutationCache({
    onError: (error, _variables, _onMutateResult, mutation) => {
      if (mutation.meta?.skipErrorToast) return
      // El 401 ya cierra la sesión y la pantalla de login lo explica
      if (error.status === 401) return
      toast.error(getErrorMessage(error))
    },
  }),
})

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError
    mutationMeta: { skipErrorToast?: boolean }
  }
}
