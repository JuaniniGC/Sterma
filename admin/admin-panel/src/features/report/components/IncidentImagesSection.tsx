import { useState } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { Button } from '@/components/ui/Button'
import { FileButton } from '@/components/ui/FileButton'
import { Skeleton } from '@/components/ui/Skeleton'
import { imagePublicIdFromUrl } from '@/lib/cloudinary'
import { useIncidentImages, useUploadIncidentImages } from '../hooks/useIncidentImages'
import { INCIDENT_IMAGE_ACCEPT, INCIDENT_IMAGE_MAX_BYTES } from '../types'
import { DeleteIncidentImageDialog } from './DeleteIncidentImageDialog'

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3'

/** Motivo por el que no se puede subir un archivo, o null si es válido. */
function invalidReason(file: File): string | null {
  if (file.type !== INCIDENT_IMAGE_ACCEPT) return 'no es una imagen JPG'
  if (file.size > INCIDENT_IMAGE_MAX_BYTES) return 'ocupa más de 1 MB'
  return null
}

interface IncidentImagesSectionProps {
  incidentId: number
}

/**
 * Tarjeta "Fotos" de una incidencia: galería de sus fotos (cada una con "Eliminar") y botón para añadir más
 * (JPG de hasta 1 MB).
 */
export function IncidentImagesSection({ incidentId }: IncidentImagesSectionProps) {
  const { data: urls, isPending, isError, error, refetch } = useIncidentImages(incidentId)
  const upload = useUploadIncidentImages(incidentId)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)

  const addFiles = (files: File[]) => {
    // Se valida aquí: un archivo demasiado grande no llegaría al controlador (el backend respondería 401)
    const invalid = files.flatMap((file) => {
      const reason = invalidReason(file)
      return reason ? [`«${file.name}» ${reason}`] : []
    })
    if (invalid.length > 0) {
      toast.error(`No se ha subido ninguna foto: ${invalid.join('; ')}. Solo se admiten JPG de hasta 1 MB.`)
      return
    }
    upload.mutate(files)
  }

  let content
  if (isPending) {
    content = (
      <div className={GRID}>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    )
  } else if (isError) {
    content = <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
  } else if (urls.length === 0) {
    content = <p className="text-sm text-slate-600">Esta incidencia no tiene fotos.</p>
  } else {
    content = (
      <ul className={GRID}>
        {urls.map((url, index) => (
          <li key={url} className="relative">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-md border border-slate-200 bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-500"
              aria-label={`Abrir la foto ${index + 1} en una pestaña nueva`}
            >
              <img
                src={url}
                alt={`Foto ${index + 1} de la incidencia`}
                loading="lazy"
                className="aspect-square w-full object-cover transition hover:opacity-90"
              />
            </a>
            {/* Sin ID público reconocible en la URL no se puede pedir el borrado */}
            {imagePublicIdFromUrl(url) !== null && (
              <Button
                variant="danger"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setImageToDelete(url)}
                aria-label={`Eliminar la foto ${index + 1}`}
              >
                Eliminar
              </Button>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <DetailCard
      title="Fotos"
      description={urls && urls.length > 0 ? `${urls.length} ${urls.length === 1 ? 'foto' : 'fotos'}` : undefined}
      actions={
        <FileButton
          size="sm"
          accept={INCIDENT_IMAGE_ACCEPT}
          multiple
          onFiles={addFiles}
          loading={upload.isPending}
        >
          {upload.isPending ? 'Subiendo…' : '+ Añadir fotos'}
        </FileButton>
      }
    >
      {content}

      <DeleteIncidentImageDialog
        incidentId={incidentId}
        imageUrl={imageToDelete}
        onClose={() => setImageToDelete(null)}
      />
    </DetailCard>
  )
}
