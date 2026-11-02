import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createIncidentReport, createMaintenanceReport } from '@/api/report.api'
import { reportKeys } from './useElevatorReports'

// El error se muestra dentro del formulario (`skipErrorToast`). Tras crear se invalida todo el historial:
// el body lleva el RAE y no el id del ascensor, que es la clave de las queries.

export function useCreateIncidentReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIncidentReport,
    meta: { skipErrorToast: true },
    onSuccess: async () => {
      toast.success('Incidencia creada.')
      await queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}

export function useCreateMaintenanceReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMaintenanceReport,
    meta: { skipErrorToast: true },
    onSuccess: async () => {
      toast.success('Mantenimiento creado.')
      await queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
  })
}
