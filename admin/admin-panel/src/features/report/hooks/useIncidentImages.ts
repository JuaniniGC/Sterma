import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getIncidentImages, uploadIncidentImage } from '@/api/report.api'
import { ApiError } from '@/api/errors'
import { reportKeys } from './useElevatorReports'

/** URLs de las fotos de una incidencia. */
export function useIncidentImages(incidentId: number) {
  return useQuery({
    queryKey: reportKeys.incidentImages(incidentId),
    queryFn: () => getIncidentImages(incidentId),
  })
}

/**
 * Sube varias fotos a una incidencia, una detrás de otra (el endpoint recibe una por petición). Si una falla,
 * se para y el error indica cuántas se habían subido. Los errores los notifica el toast global de mutaciones.
 */
export function useUploadIncidentImages(incidentId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (files: File[]) => {
      for (const [index, file] of files.entries()) {
        try {
          await uploadIncidentImage({ incidentId, file })
        } catch (error) {
          if (index === 0 || !(error instanceof ApiError)) throw error
          throw new ApiError(
            `Se subieron ${index} de ${files.length} fotos; «${file.name}» falló: ${error.message}`,
            error.status,
            error.data,
          )
        }
      }
    },
    onSuccess: (_data, files) => {
      toast.success(files.length === 1 ? 'Foto añadida.' : `${files.length} fotos añadidas.`)
    },
    // También tras un error: las que sí se subieron deben aparecer
    onSettled: () => queryClient.invalidateQueries({ queryKey: reportKeys.incidentImages(incidentId) }),
  })
}
