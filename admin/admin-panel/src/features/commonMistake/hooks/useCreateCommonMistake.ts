import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createCommonMistake } from '@/api/commonMistake.api'
import { commonMistakeKeys } from './useCommonMistakes'

export function useCreateCommonMistake() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCommonMistake,
    // El error se muestra dentro del formulario
    meta: { skipErrorToast: true },
    onSuccess: async (mistake) => {
      toast.success(`Fallo común «${mistake.identificator}» creado.`)
      await queryClient.invalidateQueries({ queryKey: commonMistakeKeys.all })
    },
  })
}
