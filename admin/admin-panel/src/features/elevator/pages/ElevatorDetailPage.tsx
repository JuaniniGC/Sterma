import { useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { InfoGrid } from '@/components/data/InfoGrid'
import { LoadingState } from '@/components/data/LoadingState'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { CommunityInfoCard } from '@/features/community/components/CommunityInfoCard'
import { ElevatorReportsHistory } from '@/features/report/components/ElevatorReportsHistory'
import { usePrefetchElevatorReports } from '@/features/report/hooks/useElevatorReports'
import { parseId } from '@/lib/parseId'
import { paths } from '@/routes/paths'
import { useElevator } from '../hooks/useElevator'

export function ElevatorDetailPage() {
  const { id: rawId } = useParams()
  const id = parseId(rawId)
  const { data: elevator, isPending, isError, error, refetch } = useElevator(id)
  // El historial puede tardar: se pide a la vez que el ascensor, no después
  usePrefetchElevatorReports(id)

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
      <PageHeader title={elevator.rae} description="Ascensor" />
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

        <ElevatorReportsHistory elevatorId={elevator.id} />
      </div>
    </>
  )
}
