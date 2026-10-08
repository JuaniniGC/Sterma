import type { Community, CommunityListParams } from '@/features/community/types'
import type { PageResponse } from '@/types/pagination'
import { httpClient } from './client'

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
