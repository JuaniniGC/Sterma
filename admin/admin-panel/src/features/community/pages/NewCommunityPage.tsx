import { useNavigate } from 'react-router'
import { DetailCard } from '@/components/data/DetailCard'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { paths } from '@/routes/paths'
import { CommunityForm } from '../components/CommunityForm'
import { useCreateCommunity } from '../hooks/useCreateCommunity'
import { EMPTY_COMMUNITY_FORM } from '../types'

export function NewCommunityPage() {
  const navigate = useNavigate()
  const createCommunity = useCreateCommunity()

  return (
    <>
      <BackLink to={paths.communities}>Volver a comunidades</BackLink>
      <PageHeader title="Nueva comunidad" />

      <DetailCard className="max-w-2xl">
        <CommunityForm
          defaultValues={EMPTY_COMMUNITY_FORM}
          onSubmit={(request) =>
            createCommunity.mutate(request, { onSuccess: () => void navigate(paths.communities) })
          }
          onCancel={() => void navigate(paths.communities)}
          submitLabel="Crear comunidad"
          isPending={createCommunity.isPending}
          error={createCommunity.error}
        />
      </DetailCard>
    </>
  )
}
