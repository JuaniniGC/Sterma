import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { formatDateTime } from '@/lib/formatters'
import { useDeleteReport } from '../hooks/useDeleteReport'
import { MAINTENANCE_TYPE_LABELS, type ElevatorReportEntry } from '../types'

interface DeleteReportDialogProps {
  /** Informe a borrar; con null el diálogo está cerrado */
  entry: ElevatorReportEntry | null
  onClose: () => void
}

/** Confirmación y borrado de un informe (incidencia o mantenimiento). En incidencias avisa de que se borran sus imágenes. */
export function DeleteReportDialog({ entry, onClose }: DeleteReportDialogProps) {
  const deleteReport = useDeleteReport()

  const confirm = () => {
    if (!entry) return
    deleteReport.mutate(entry, {
      onSuccess: onClose,
      // 404: ya no existe, no tiene sentido mantener el diálogo
      onError: (error) => {
        if (error.status === 404) onClose()
      },
    })
  }

  const isIncident = entry?.kind === 'incident'
  const maintenanceType = entry?.kind === 'maintenance' ? entry.report.maintenanceType : null
  const what = isIncident
    ? 'la incidencia'
    : `el ${maintenanceType ? MAINTENANCE_TYPE_LABELS[maintenanceType].toLowerCase() : 'mantenimiento'}`

  return (
    <ConfirmDialog
      open={entry !== null}
      title={isIncident ? 'Eliminar incidencia' : 'Eliminar mantenimiento'}
      message={
        entry && (
          <>
            ¿Seguro que quieres eliminar {what} iniciad{isIncident ? 'a' : 'o'} el{' '}
            <strong className="text-slate-900">{formatDateTime(entry.report.startDate) ?? entry.report.startDate}</strong>
            {entry.report.commentary && <> («{entry.report.commentary}»)</>}?
            {isIncident && ' Se eliminarán también sus imágenes.'} Esta acción no se puede deshacer.
          </>
        )
      }
      confirmLabel="Eliminar"
      loading={deleteReport.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  )
}
