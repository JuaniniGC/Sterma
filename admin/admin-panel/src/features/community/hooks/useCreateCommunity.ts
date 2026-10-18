import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCommunity } from '@/api/community.api'
import { communityKeys } from './useCommunities'

export function useCreateCommunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCommunity,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (community) => {
      toast.success(`Comunidad «${community.name}» creada.`)
      await queryClient.invalidateQueries({ queryKey: communityKeys.all })
    },
  })
}
