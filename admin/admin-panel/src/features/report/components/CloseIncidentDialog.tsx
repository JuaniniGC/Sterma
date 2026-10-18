import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId } from 'react'
import { useForm } from 'react-hook-form'
import { getErrorMessage } from '@/api/errors'
import { FormField } from '@/components/forms/FormField'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { toDateTimeInputValue, toLocalDateTime } from '@/lib/dateTime'
import { formatDateTime } from '@/lib/formatters'
import { useCloseIncidentReport } from '../hooks/useCloseIncidentReport'
import { closeIncidentFormSchema, type CloseIncidentFormValues, type IncidentReport } from '../types'

interface CloseIncidentDialogProps {
  /** Incidencia abierta a cerrar; con null el diálogo está cerrado */
  incident: IncidentReport | null
  onClose: () => void
}

/** Diálogo para añadir la fecha de cierre a una incidencia en curso (por defecto, ahora). */
export function CloseIncidentDialog({ incident, onClose }: CloseIncidentDialogProps) {
  const formId = useId()
  const closeIncident = useCloseIncidentReport()
  const { reset: resetMutation } = closeIncident
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CloseIncidentFormValues>({
    resolver: zodResolver(closeIncidentFormSchema),
    defaultValues: { startDate: '', endDate: '' },
  })

  // Cada vez que se abre para una incidencia: fecha de cierre = ahora y sin el error de la vez anterior
  const incidentId = incident?.id
  const incidentStart = incident?.startDate
  useEffect(() => {
    if (incidentId == null || incidentStart == null) return
    reset({ startDate: incidentStart, endDate: toDateTimeInputValue(new Date()) })
    resetMutation()
  }, [incidentId, incidentStart, reset, resetMutation])

  const close = () => {
    if (!closeIncident.isPending) onClose()
  }

  const onSubmit = handleSubmit(({ endDate }) => {
    if (!incident) return
    // Si falla (p. ej. 400 porque ya estaba cerrada), el error queda en el diálogo y el historial se recarga
    closeIncident.mutate({ id: incident.id, body: { endDate: toLocalDateTime(endDate) } }, { onSuccess: onClose })
  })

  return (
    <Modal
      open={incident !== null}
      onClose={close}
      title="Cerrar incidencia"
      dismissible={!closeIncident.isPending}
      footer={
        <>
          <Button variant="secondary" onClick={close} disabled={closeIncident.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form={formId} loading={closeIncident.isPending}>
            Guardar cierre
          </Button>
        </>
      }
    >
      {incident && (
        <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
          {closeIncident.isError && <Alert variant="error">{getErrorMessage(closeIncident.error)}</Alert>}

          <p className="text-sm text-slate-600">
            Incidencia iniciada el{' '}
            <strong className="text-slate-900">{formatDateTime(incident.startDate) ?? incident.startDate}</strong>
            {incident.commentary && <>: «{incident.commentary}»</>}. Una vez cerrada, la fecha de cierre no se
            puede modificar.
          </p>

          <FormField label="Fecha de cierre" htmlFor={`${formId}-end`} error={errors.endDate?.message}>
            <Input
              id={`${formId}-end`}
              type="datetime-local"
              step={60}
              autoFocus
              invalid={Boolean(errors.endDate)}
              {...register('endDate')}
            />
          </FormField>
        </form>
      )}
    </Modal>
  )
}
