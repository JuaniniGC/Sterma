import { useNavigate } from 'react-router'
import { DetailCard } from '@/components/data/DetailCard'
import { BackLink } from '@/components/layout/BackLink'
import { PageHeader } from '@/components/layout/PageHeader'
import { paths } from '@/routes/paths'
import { ElevatorForm } from '../components/ElevatorForm'
import { useCreateElevator } from '../hooks/useCreateElevator'

export function NewElevatorPage() {
  const navigate = useNavigate()
  const createElevator = useCreateElevator()

  return (
    <>
      <BackLink to={paths.elevators}>Volver a ascensores</BackLink>
      <PageHeader title="Nuevo ascensor" />

      <DetailCard className="max-w-2xl">
        <ElevatorForm
          defaultValues={{ rae: '' }}
          defaultCommunity={null}
          onSubmit={(request) =>
            createElevator.mutate(request, { onSuccess: () => void navigate(paths.elevators) })
          }
          onCancel={() => void navigate(paths.elevators)}
          submitLabel="Crear ascensor"
          isPending={createElevator.isPending}
          error={createElevator.error}
        />
      </DetailCard>
    </>
  )
}
