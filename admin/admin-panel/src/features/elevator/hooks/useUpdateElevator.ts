import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateElevator } from '@/api/elevator.api'
import { elevatorKeys } from './useElevators'

export function useUpdateElevator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateElevator,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (elevator) => {
      toast.success(`Ascensor «${elevator.rae}» actualizado.`)
      // Listados (también los del detalle de comunidad, que usan `useElevators`) y detalle
      await queryClient.invalidateQueries({ queryKey: elevatorKeys.all })
    },
  })
}
