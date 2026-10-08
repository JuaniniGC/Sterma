import type { Elevator, ElevatorListParams } from '@/features/elevator/types'
import type { PageResponse } from '@/types/pagination'
import { httpClient } from './client'

/**
 * GET /elevator — listado paginado. `communityName` y `rae` son filtros parciales
 * que el backend combina con AND. axios codifica los valores en la URL.
 */
export async function getElevators({
  communityName,
  rae,
  page,
  size,
  sort,
}: ElevatorListParams): Promise<PageResponse<Elevator>> {
  const trimmedCommunityName = communityName?.trim()
  const trimmedRae = rae?.trim()
  const { data } = await httpClient.get<PageResponse<Elevator>>('/elevator', {
    params: {
      page,
      size,
      ...(trimmedCommunityName ? { communityName: trimmedCommunityName } : {}),
      ...(trimmedRae ? { rae: trimmedRae } : {}),
      ...(sort ? { sort } : {}),
    },
  })
  return data
}

/** GET /elevator/{id} — ascensor con su comunidad. 404 (texto plano) si no existe. */
export async function getElevatorById(id: number): Promise<Elevator> {
  const { data } = await httpClient.get<Elevator>(`/elevator/${encodeURIComponent(id)}`)
  return data
}
