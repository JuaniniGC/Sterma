import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCommunities } from '@/api/community.api'
import type { CommunityListParams } from '../types'

export const communityKeys = {
  all: ['communities'] as const,
  list: (params: CommunityListParams) => [...communityKeys.all, 'list', params] as const,
  detail: (id: number) => [...communityKeys.all, 'detail', id] as const,
}

interface UseCommunitiesOptions {
  /** false para no pedir nada (p. ej. un buscador cerrado) */
  enabled?: boolean
}

export function useCommunities(params: CommunityListParams, { enabled = true }: UseCommunitiesOptions = {}) {
  return useQuery({
    queryKey: communityKeys.list(params),
    queryFn: () => getCommunities(params),
    enabled,
    // Mantiene la página anterior visible mientras llega la siguiente
    placeholderData: keepPreviousData,
  })
}
