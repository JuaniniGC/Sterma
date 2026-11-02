import type { CommonMistake, CreateCommonMistakeRequest } from '@/features/commonMistake/types'
import type { PageParams, PageResponse } from '@/types/pagination'
import { httpClient } from './client'
import { ApiError } from './errors'

/** GET /mistake — listado paginado de fallos comunes (`Pageable` de Spring, sin filtros). */
export async function getCommonMistakes({ page, size, sort }: PageParams): Promise<PageResponse<CommonMistake>> {
  const { data } = await httpClient.get<PageResponse<CommonMistake>>('/mistake', {
    params: { page, size, ...(sort ? { sort } : {}) },
  })
  return data
}

/**
 * DELETE /mistake/{id} — 204 sin cuerpo si se borra. Cualquier otro estado se trata como error.
 * El 404 del backend dice "Regla de mantenimiento no encontrada con ID: X" (texto copiado de otro servicio):
 * se sustituye por un mensaje correcto.
 */
export async function deleteCommonMistake(id: number): Promise<void> {
  try {
    const response = await httpClient.delete(`/mistake/${encodeURIComponent(id)}`)
    if (response.status !== 204) {
      throw new ApiError(
        `No se pudo eliminar el fallo común (respuesta inesperada ${response.status}).`,
        response.status,
        response.data,
      )
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError('El fallo común ya no existe (puede que otra persona lo haya eliminado).', 404, error.data)
    }
    throw error
  }
}

/**
 * POST /mistake — crea un fallo común y responde 201 con él. Cualquier otro estado se trata como error.
 * Errores en texto plano; un identificador repetido llega como 500 ("Error inesperado: Ese identificador ya esta
 * en uso: X") porque el controlador no captura el `IllegalStateException` del servicio.
 */
export async function createCommonMistake(body: CreateCommonMistakeRequest): Promise<CommonMistake> {
  const response = await httpClient.post<CommonMistake>('/mistake', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear el fallo común (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}
