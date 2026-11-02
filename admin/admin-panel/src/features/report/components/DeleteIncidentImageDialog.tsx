import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { imagePublicIdFromUrl } from '@/lib/cloudinary'
import { useDeleteIncidentImage } from '../hooks/useIncidentImages'

interface DeleteIncidentImageDialogProps {
  incidentId: number
  /** URL de la foto a borrar; con null el diálogo está cerrado */
  imageUrl: string | null
  onClose: () => void
}

/** Confirmación y borrado de una foto de una incidencia (muestra la miniatura). */
export function DeleteIncidentImageDialog({ incidentId, imageUrl, onClose }: DeleteIncidentImageDialogProps) {
  const deleteImage = useDeleteIncidentImage(incidentId)

  const confirm = () => {
    const publicId = imageUrl && imagePublicIdFromUrl(imageUrl)
    if (!publicId) return
    deleteImage.mutate(publicId, {
      onSuccess: onClose,
      // 404: ya no existe, no tiene sentido mantener el diálogo
      onError: (error) => {
        if (error.status === 404) onClose()
      },
    })
  }

  return (
    <ConfirmDialog
      open={imageUrl !== null}
      title="Eliminar foto"
      message={
        imageUrl && (
          <>
            <img
              src={imageUrl}
              alt="Foto que se va a eliminar"
              className="mb-3 max-h-48 w-full rounded-md border border-slate-200 bg-slate-50 object-contain"
            />
            ¿Seguro que quieres eliminar esta foto de la incidencia? Esta acción no se puede deshacer.
          </>
        )
      }
      confirmLabel="Eliminar"
      loading={deleteImage.isPending}
      onConfirm={confirm}
      onCancel={onClose}
    />
  )
}
