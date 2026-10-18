import type {
  CreateElevatorRequest,
  Elevator,
  ElevatorListParams,
  UpdateElevatorRequest,
} from '@/features/elevator/types'
import type { PageResponse } from '@/types/pagination'
import { httpClient } from './client'
import { ApiError } from './errors'

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

/**
 * PUT /elevator/{id} — 200 con el ascensor actualizado (y su comunidad). Errores en texto plano:
 * 404 (ascensor o comunidad no existen), 409 (RAE en uso), 500. Cualquier estado distinto de 200 es error.
 */
export async function updateElevator({
  id,
  body,
}: {
  id: number
  body: UpdateElevatorRequest
}): Promise<Elevator> {
  const response = await httpClient.put<Elevator>(`/elevator/${encodeURIComponent(id)}`, body)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo actualizar el ascensor (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/**
 * DELETE /elevator/{id} — 204 sin cuerpo. El backend borra también sus informes (incidencias y
 * mantenimientos). 404 (texto plano) si no existe. Cualquier estado distinto de 204 es error.
 */
export async function deleteElevator(id: number): Promise<void> {
  const response = await httpClient.delete(`/elevator/${encodeURIComponent(id)}`)
  if (response.status !== 204) {
    throw new ApiError(
      `No se pudo eliminar el ascensor (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * POST /elevator — el backend responde **200** (no 201) con el ascensor creado y su comunidad.
 * Errores en texto plano: 404 (la comunidad no existe), 409 (RAE en uso), 500.
 * Cualquier estado distinto de 200 se trata como error.
 */
export async function createElevator(body: CreateElevatorRequest): Promise<Elevator> {
  const response = await httpClient.post<Elevator>('/elevator', body)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo crear el ascensor (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}
