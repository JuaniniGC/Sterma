import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { updateCommunity } from '@/api/community.api'
import { elevatorKeys } from '@/features/elevator/hooks/useElevators'
import { communityKeys } from './useCommunities'

export function useUpdateCommunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCommunity,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (community) => {
      toast.success(`Comunidad «${community.name}» actualizada.`)
      // Los ascensores llevan la comunidad anidada (nombre, datos...), así que también quedan obsoletos
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: communityKeys.all }),
        queryClient.invalidateQueries({ queryKey: elevatorKeys.all }),
      ])
    },
  })
}
