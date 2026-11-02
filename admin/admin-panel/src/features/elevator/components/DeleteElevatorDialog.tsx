import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { useDeleteElevator } from '../hooks/useDeleteElevator'
import type { Elevator } from '../types'

interface DeleteElevatorDialogProps {
  /** Ascensor a borrar; con null el diálogo está cerrado */
  elevator: Elevator | null
  onClose: () => void
  /** Tras borrar (o si ya no existía: 404) */
  onDeleted?: () => void
}

/** Confirmación y borrado de un ascensor. Avisa de que se borran también sus informes. */
export function DeleteElevatorDialog({ elevator, onClose, onDeleted }: DeleteElevatorDialogProps) {
  const deleteElevator = useDeleteElevator()

  const confirm = () => {
    if (!elevator) return
    deleteElevator.mutate(elevator, {
      onSuccess: () => {
        onClose()
        onDeleted?.()
      },
      // 404: el ascensor ya no existe, no tiene sentido mantener el diálogo
      onError: (error) => {
        if (error.status === 404) {
          onClose()
          onDeleted?.()
        }
      },
    })
  }

  return (
    <ConfirmDialog
      open={elevator !== null}
      title="Eliminar ascensor"
      message={
        elevator && (
          <>
            ¿Seguro que quieres eliminar el ascensor <strong className="text-slate-900">«{elevator.rae}»</strong>{' '}
            de la comunidad {elevator.community.name}? Se eliminarán también{' '}
            <strong className="text-slate-900">todos sus informes</strong> (incidencias y mantenimientos). Esta
            acción no se puede deshacer.
          </>
        )
      }
      confirmLabel="Eliminar"
      loading={deleteElevator.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  )
}
