import { useLocation, useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { ErrorState } from '@/components/data/ErrorState'
import { LoadingState } from '@/components/data/LoadingState'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { Alert } from '@/components/ui/Alert'
import { parseId } from '@/lib/parseId'
import { paths } from '@/routes/paths'
import { CommunityElevatorsSection } from '../components/CommunityElevatorsSection'
import { CommunityInfoCard } from '../components/CommunityInfoCard'
import { useCommunity } from '../hooks/useCommunity'

export interface CommunityDetailLocationState {
  /** Listado del que se viene (con sus filtros), para el enlace "Volver" */
  backTo?: string
}

export function CommunityDetailPage() {
  const { id: rawId } = useParams()
  const id = parseId(rawId)
  const location = useLocation()
  // Solo mejora el "Volver" (conserva filtros); al recargar se usa el listado sin filtros
  const backTo = (location.state as CommunityDetailLocationState | null)?.backTo ?? paths.communities
  const { data: community, isPending, isError, error, refetch } = useCommunity(id)

  const backLink = <BackLink to={backTo}>Volver a comunidades</BackLink>

  if (id === null || error?.status === 404) {
    return (
      <>
        {backLink}
        <PageHeader title="Comunidad no encontrada" />
        <Alert variant="warning">
          No existe ninguna comunidad con el identificador «{rawId}». Puede que se haya eliminado o que el
          enlace no sea correcto.
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
        <LoadingState label="Cargando comunidad…" />
      </>
    )
  }

  return (
    <>
      {backLink}
      <PageHeader title={community.name} description={community.description ?? undefined} />
      <div className="space-y-6">
        <CommunityInfoCard community={community} title="Información" />
        <CommunityElevatorsSection community={community} />
      </div>
    </>
  )
}
