import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteElevator } from '@/api/elevator.api'
import type { Elevator } from '../types'
import { elevatorKeys } from './useElevators'

/** Borra un ascensor (y, en el backend, sus informes). Los errores los notifica el toast global de mutaciones. */
export function useDeleteElevator() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (elevator: Elevator) => deleteElevator(elevator.id),
    onSuccess: (_data, elevator) => {
      toast.success(`Ascensor «${elevator.rae}» eliminado.`)
    },
    // También tras un error (un 404 significa que ya no existe). Sin esperar a la recarga: desde el
    // detalle se sale en cuanto termina el borrado, antes de que el detalle se recargue con 404.
    onSettled: () => void queryClient.invalidateQueries({ queryKey: elevatorKeys.all }),
  })
}
