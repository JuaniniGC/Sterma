import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createElevator } from '@/api/elevator.api'
import { elevatorKeys } from './useElevators'

export function useCreateElevator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createElevator,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (elevator) => {
      toast.success(`Ascensor «${elevator.rae}» creado.`)
      // Listados (también los del detalle de comunidad, que usan `useElevators`)
      await queryClient.invalidateQueries({ queryKey: elevatorKeys.all })
    },
  })
}
