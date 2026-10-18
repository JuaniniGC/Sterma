import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { useDeleteCommunity } from '../hooks/useDeleteCommunity'
import type { Community } from '../types'

interface DeleteCommunityDialogProps {
  /** Comunidad a borrar; con null el diálogo está cerrado */
  community: Community | null
  onClose: () => void
  /** Tras borrar (o si ya no existía: 404) */
  onDeleted?: () => void
}

/** Confirmación y borrado de una comunidad. Avisa de que se borran también sus ascensores e informes. */
export function DeleteCommunityDialog({ community, onClose, onDeleted }: DeleteCommunityDialogProps) {
  const deleteCommunity = useDeleteCommunity()

  const confirm = () => {
    if (!community) return
    deleteCommunity.mutate(community, {
      onSuccess: () => {
        onClose()
        onDeleted?.()
      },
      // 404: la comunidad ya no existe, no tiene sentido mantener el diálogo
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
      open={community !== null}
      title="Eliminar comunidad"
      message={
        community && (
          <>
            ¿Seguro que quieres eliminar la comunidad{' '}
            <strong className="text-slate-900">«{community.name}»</strong> ({community.cif})? Se eliminarán
            también <strong className="text-slate-900">todos sus ascensores y sus informes</strong>. Esta acción
            no se puede deshacer.
          </>
        )
      }
      confirmLabel="Eliminar"
      loading={deleteCommunity.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  )
}
