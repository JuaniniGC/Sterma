import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteCommonMistake } from '@/api/commonMistake.api'
import type { CommonMistake } from '../types'
import { commonMistakeKeys } from './useCommonMistakes'

/** Borra un fallo común. Los errores los notifica el toast global de mutaciones. */
export function useDeleteCommonMistake() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mistake: CommonMistake) => deleteCommonMistake(mistake.id),
    onSuccess: (_data, mistake) => {
      toast.success(`Fallo común «${mistake.identificator}» eliminado.`)
    },
    // También tras un error: si era un 404 ya no existe y el listado debe reflejarlo
    onSettled: () => queryClient.invalidateQueries({ queryKey: commonMistakeKeys.all }),
  })
}
