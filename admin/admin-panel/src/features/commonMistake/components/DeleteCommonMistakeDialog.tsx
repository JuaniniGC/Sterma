import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { useDeleteCommonMistake } from '../hooks/useDeleteCommonMistake'
import type { CommonMistake } from '../types'

interface DeleteCommonMistakeDialogProps {
  /** Fallo común a borrar; con null el diálogo está cerrado */
  mistake: CommonMistake | null
  onClose: () => void
}

/** Confirmación y borrado de un fallo común. */
export function DeleteCommonMistakeDialog({ mistake, onClose }: DeleteCommonMistakeDialogProps) {
  const deleteMistake = useDeleteCommonMistake()

  const confirm = () => {
    if (!mistake) return
    deleteMistake.mutate(mistake, {
      onSuccess: onClose,
      // 404: ya no existe, no tiene sentido mantener el diálogo
      onError: (error) => {
        if (error.status === 404) onClose()
      },
    })
  }

  return (
    <ConfirmDialog
      open={mistake !== null}
      title="Eliminar fallo común"
      message={
        mistake && (
          <>
            ¿Seguro que quieres eliminar el fallo común{' '}
            <strong className="text-slate-900">«{mistake.identificator}»</strong> ({mistake.description})? Esta
            acción no se puede deshacer.
          </>
        )
      }
      confirmLabel="Eliminar"
      loading={deleteMistake.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  )
}
