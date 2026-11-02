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
import { communityDetailPath, paths } from '@/routes/paths'
import { CommunityForm } from '../components/CommunityForm'
import { useCommunity } from '../hooks/useCommunity'
import { useUpdateCommunity } from '../hooks/useUpdateCommunity'
import { communityToFormValues } from '../types'

export function EditCommunityPage() {
  const { id: rawId } = useParams()
  const id = parseId(rawId)
  const navigate = useNavigate()
  const { data: community, isPending, isError, error, refetch } = useCommunity(id)
  const updateCommunity = useUpdateCommunity()

  if (id === null || error?.status === 404) {
    return (
      <>
        <BackLink to={paths.communities}>Volver a comunidades</BackLink>
        <PageHeader title="Comunidad no encontrada" />
        <Alert variant="warning">
          No existe ninguna comunidad con el identificador «{rawId}». Puede que se haya eliminado o que el
          enlace no sea correcto.
        </Alert>
      </>
    )
  }

  const detailPath = communityDetailPath(id)
  // Vuelve a donde se vino (listado o detalle); sin historial de la app, al detalle
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
        <LoadingState label="Cargando comunidad…" />
      </>
    )
  }

  return (
    <>
      {backLink}
      <PageHeader title="Editar comunidad" description={community.name} />

      <DetailCard className="max-w-2xl">
        <CommunityForm
          defaultValues={communityToFormValues(community)}
          onSubmit={(body) => updateCommunity.mutate({ id, body }, { onSuccess: leave })}
          onCancel={leave}
          submitLabel="Guardar cambios"
          isPending={updateCommunity.isPending}
          error={updateCommunity.error}
        />
      </DetailCard>
    </>
  )
}
