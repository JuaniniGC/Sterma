import { useQuery } from '@tanstack/react-query'
import { getCommunityById } from '@/api/community.api'
import { communityKeys } from './useCommunities'

/** Detalle de una comunidad. Con `id` null (id de la URL no válido) no se lanza la petición. */
export function useCommunity(id: number | null) {
  return useQuery({
    queryKey: communityKeys.detail(id ?? -1),
    queryFn: () => getCommunityById(id as number),
    enabled: id !== null,
  })
}
