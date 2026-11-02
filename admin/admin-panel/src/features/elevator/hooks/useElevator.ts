import { useQuery } from '@tanstack/react-query'
import { getElevatorById } from '@/api/elevator.api'
import { elevatorKeys } from './useElevators'

/** Detalle de un ascensor. Con `id` null (id de la URL no válido) no se lanza la petición. */
export function useElevator(id: number | null) {
  return useQuery({
    queryKey: elevatorKeys.detail(id ?? -1),
    queryFn: () => getElevatorById(id as number),
    enabled: id !== null,
  })
}
