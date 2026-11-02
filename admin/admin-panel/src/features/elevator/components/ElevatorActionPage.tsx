import type { ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { LoadingState } from '@/components/data/LoadingState'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { hasAppHistory } from '@/lib/history'
import { parseId } from '@/lib/parseId'
import { elevatorDetailPath, paths } from '@/routes/paths'
import { useElevator } from '../hooks/useElevator'
import type { Elevator } from '../types'

interface ElevatorActionPageProps {
  title: string
  /** Texto bajo el título (por defecto, el RAE) */
  description?: (elevator: Elevator) => string
  /**
   * Contenido de la tarjeta (normalmente un formulario) una vez cargado el ascensor.
   * `leave` vuelve a la pantalla anterior de la app o, sin historial, al detalle del ascensor.
   */
  children: (elevator: Elevator, leave: () => void) => ReactNode
  /** Sin la `DetailCard` que envuelve el contenido (para pantallas que ponen sus propias tarjetas) */
  bare?: boolean
}

/**
 * Estructura de las pantallas que actúan sobre un ascensor de la URL (`/elevators/:id/...`): valida el id con
 * `parseId`, carga el ascensor y gestiona "no encontrado", error y carga, con "Volver" encima del título.
 */
export function ElevatorActionPage({ title, description, children, bare = false }: ElevatorActionPageProps) {
  const { id: rawId } = useParams()
  const id = parseId(rawId)
  const navigate = useNavigate()
  const { data: elevator, isPending, isError, error, refetch } = useElevator(id)

  if (id === null || error?.status === 404) {
    return (
      <>
        <BackLink to={paths.elevators}>Volver a ascensores</BackLink>
        <PageHeader title="Ascensor no encontrado" />
        <Alert variant="warning">
          No existe ningún ascensor con el identificador «{rawId}». Puede que se haya eliminado o que el enlace
          no sea correcto.
        </Alert>
      </>
    )
  }

  const detailPath = elevatorDetailPath(id)
  const leave = () => void (hasAppHistory() ? navigate(-1) : navigate(detailPath))
  const backLink = (
    <BackLink to={detailPath} preferHistory>
      Volver
    </BackLink>
  )

  if (isError) {
    return (
      <>
        {backLink}
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </>
    )
  }

  if (isPending) {
    return (
      <>
        {backLink}
        <LoadingState label="Cargando ascensor…" />
      </>
    )
  }

  return (
    <>
      {backLink}
      <PageHeader title={title} description={description ? description(elevator) : elevator.rae} />
      {bare ? (
        children(elevator, leave)
      ) : (
        <DetailCard className="max-w-2xl">{children(elevator, leave)}</DetailCard>
      )}
    </>
  )
}
