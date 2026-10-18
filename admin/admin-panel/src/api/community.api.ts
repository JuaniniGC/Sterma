import type {
  Community,
  CommunityListParams,
  CreateCommunityRequest,
  UpdateCommunityRequest,
} from '@/features/community/types'
import type { PageResponse } from '@/types/pagination'
import { httpClient } from './client'
import { ApiError } from './errors'

/** GET /community — listado paginado, con filtro opcional por nombre. */
export async function getCommunities({
  name,
  page,
  size,
  sort,
}: CommunityListParams): Promise<PageResponse<Community>> {
  const trimmedName = name?.trim()
  const { data } = await httpClient.get<PageResponse<Community>>('/community', {
    params: {
      page,
      size,
      ...(trimmedName ? { name: trimmedName } : {}),
      ...(sort ? { sort } : {}),
    },
  })
  return data
}

/** GET /community/{id} — 404 (texto plano) si no existe. */
export async function getCommunityById(id: number): Promise<Community> {
  const { data } = await httpClient.get<Community>(`/community/${encodeURIComponent(id)}`)
  return data
}

/**
 * POST /community — 201 con la comunidad creada. Errores en texto plano: 400 (CIF duplicado),
 * 403 (solo MANAGEMENT), 500. Cualquier estado distinto de 201 se trata como error.
 */
export async function createCommunity(body: CreateCommunityRequest): Promise<Community> {
  const response = await httpClient.post<Community>('/community', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear la comunidad (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/**
 * PUT /community/{id} — 200 con la comunidad actualizada. Errores en texto plano: 400 (CIF de otra
 * comunidad), 404 (no existe), 500. Cualquier estado distinto de 200 se trata como error.
 */
export async function updateCommunity({
  id,
  body,
}: {
  id: number
  body: UpdateCommunityRequest
}): Promise<Community> {
  const response = await httpClient.put<Community>(`/community/${encodeURIComponent(id)}`, body)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo actualizar la comunidad (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/**
 * DELETE /community/{id} — 204 sin cuerpo. El backend borra también los ascensores de la comunidad
 * y todos sus informes. 404 (texto plano) si no existe. Cualquier estado distinto de 204 es error.
 */
export async function deleteCommunity(id: number): Promise<void> {
  const response = await httpClient.delete(`/community/${encodeURIComponent(id)}`)
  if (response.status !== 204) {
    throw new ApiError(
      `No se pudo eliminar la comunidad (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}
