import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { deleteIncidentReport, deleteMaintenanceReport } from '@/api/report.api'
import type { ElevatorReportEntry } from '../types'
import { reportKeys } from './useElevatorReports'

function deleteReport(entry: ElevatorReportEntry): Promise<void> {
  if (entry.kind === 'incident') return deleteIncidentReport(entry.report.id)
  // El historial solo ofrece borrar mantenimientos con id; esto no debería ocurrir
  if (entry.report.id === null) return Promise.reject(new Error('El mantenimiento no tiene id.'))
  return deleteMaintenanceReport(entry.report.id)
}

/** Borra una incidencia (y sus imágenes) o un mantenimiento. Los errores los notifica el toast global de mutaciones. */
export function useDeleteReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: (_data, entry) => {
      toast.success(entry.kind === 'incident' ? 'Incidencia eliminada.' : 'Mantenimiento eliminado.')
    },
    // También tras un error: si era un 404 ya no existe y el historial debe reflejarlo
    onSettled: () => queryClient.invalidateQueries({ queryKey: reportKeys.all }),
  })
}
