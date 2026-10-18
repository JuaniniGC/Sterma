import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { InfoGrid } from '@/components/data/InfoGrid'
import { LoadingState } from '@/components/data/LoadingState'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { CommunityInfoCard } from '@/features/community/components/CommunityInfoCard'
import { ElevatorReportsHistory } from '@/features/report/components/ElevatorReportsHistory'
import { usePrefetchElevatorReports } from '@/features/report/hooks/useElevatorReports'
import { hasAppHistory } from '@/lib/history'
import { parseId } from '@/lib/parseId'
import {
  editElevatorPath,
  newIncidentReportPath,
  newMaintenanceReportPath,
  paths,
} from '@/routes/paths'
import { DeleteElevatorDialog } from '../components/DeleteElevatorDialog'
import { useElevator } from '../hooks/useElevator'

export function ElevatorDetailPage() {
  const { id: rawId } = useParams()
  const id = parseId(rawId)
  const { data: elevator, isPending, isError, error, refetch } = useElevator(id)
  // El historial puede tardar: se pide a la vez que el ascensor, no después
  usePrefetchElevatorReports(id)
  const navigate = useNavigate()
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Tras borrar: a la pantalla anterior (listado o detalle de comunidad); sin historial, al listado
  // con `replace`, para que "atrás" no vuelva a un ascensor que ya no existe
  const leaveDeleted = () =>
    void (hasAppHistory() ? navigate(-1) : navigate(paths.elevators, { replace: true }))

  // Vuelve a la pantalla anterior (listado o detalle de comunidad); sin historial, a /elevators
  const backLink = (
    <BackLink to={paths.elevators} preferHistory>
      Volver
    </BackLink>
  )

  if (id === null || error?.status === 404) {
    return (
      <>
        {backLink}
        <PageHeader title="Ascensor no encontrado" />
        <Alert variant="warning">
          No existe ningún ascensor con el identificador «{rawId}». Puede que se haya eliminado o que el enlace
          no sea correcto.
        </Alert>
      </>
    )
  }

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
      <PageHeader
        title={elevator.rae}
        description="Ascensor"
        actions={
          <>
            <Button variant="success" onClick={() => void navigate(editElevatorPath(elevator.id))}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              Eliminar
            </Button>
          </>
        }
      />
      <DeleteElevatorDialog
        elevator={confirmingDelete ? elevator : null}
        onClose={() => setConfirmingDelete(false)}
        onDeleted={leaveDeleted}
      />
      <div className="space-y-6">
        <DetailCard title="Datos del ascensor">
          <InfoGrid
            sections={[
              {
                items: [
                  { label: 'RAE', value: elevator.rae },
                  { label: 'ID', value: elevator.id },
                  { label: 'Año de instalación', value: elevator.instalationYear },
                ],
              },
            ]}
          />
        </DetailCard>

        <section aria-labelledby="elevator-community-heading">
          <h2 id="elevator-community-heading" className="mb-3 text-lg font-semibold text-slate-900">
            Comunidad
          </h2>
          <CommunityInfoCard community={elevator.community} showCommunityLink />
        </section>

        <ElevatorReportsHistory
          elevatorId={elevator.id}
          actions={
            <>
              <Button size="sm" onClick={() => void navigate(newIncidentReportPath(elevator.id))}>
                + Nueva incidencia
              </Button>
              <Button size="sm" onClick={() => void navigate(newMaintenanceReportPath(elevator.id))}>
                + Nuevo mantenimiento
              </Button>
            </>
          }
        />
      </div>
    </>
  )
}
