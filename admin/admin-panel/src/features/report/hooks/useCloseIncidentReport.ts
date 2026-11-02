import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { closeIncidentReport } from '@/api/report.api'
import { reportKeys } from './useElevatorReports'

/** Añade la fecha de cierre a una incidencia abierta. El error se muestra en el diálogo (`skipErrorToast`). */
export function useCloseIncidentReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: closeIncidentReport,
    meta: { skipErrorToast: true },
    onSuccess: async () => {
      toast.success('Incidencia cerrada.')
      await queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
    // Si ya estaba cerrada (400) o ya no existe (404), el historial también debe reflejarlo
    onError: () => void queryClient.invalidateQueries({ queryKey: reportKeys.all }),
  })
}
