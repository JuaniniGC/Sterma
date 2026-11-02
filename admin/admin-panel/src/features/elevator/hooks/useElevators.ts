import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getElevators } from '@/api/elevator.api'
import type { ElevatorListParams } from '../types'

export const elevatorKeys = {
  all: ['elevators'] as const,
  list: (params: ElevatorListParams) => [...elevatorKeys.all, 'list', params] as const,
  detail: (id: number) => [...elevatorKeys.all, 'detail', id] as const,
}

interface UseElevatorsOptions {
  /** false para esperar a tener los parámetros (p. ej. el nombre de la comunidad) */
  enabled?: boolean
}

export function useElevators(params: ElevatorListParams, { enabled = true }: UseElevatorsOptions = {}) {
  return useQuery({
    queryKey: elevatorKeys.list(params),
    queryFn: () => getElevators(params),
    enabled,
    // Mantiene la página anterior visible mientras llega la siguiente
    placeholderData: keepPreviousData,
  })
}
