import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteCommunity } from '@/api/community.api'
import { elevatorKeys } from '@/features/elevator/hooks/useElevators'
import type { Community } from '../types'
import { communityKeys } from './useCommunities'

/** Borra una comunidad (y, en el backend, sus ascensores). Los errores los notifica el toast global de mutaciones. */
export function useDeleteCommunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (community: Community) => deleteCommunity(community.id),
    onSuccess: (_data, community) => {
      toast.success(`Comunidad «${community.name}» eliminada.`)
    },
    // También tras un error (un 404 significa que ya no existe). Sin esperar a la recarga: desde el
    // detalle se navega al listado en cuanto termina el borrado, antes de que el detalle dé 404.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: communityKeys.all })
      void queryClient.invalidateQueries({ queryKey: elevatorKeys.all })
    },
  })
}
