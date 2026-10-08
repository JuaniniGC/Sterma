import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { Pagination } from '@/components/data/Pagination'
import { ElevatorsTable } from '@/features/elevator/components/ElevatorsTable'
import { useElevators } from '@/features/elevator/hooks/useElevators'
import { useClampPage } from '@/hooks/useClampPage'
import { useListSearchParams } from '@/hooks/useListSearchParams'
import type { Community } from '../types'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
const NO_FILTERS = [] as const

interface CommunityElevatorsSectionProps {
  /** Comunidad ya cargada: la petición de ascensores necesita su nombre */
  community: Community
}

/**
 * Ascensores de una comunidad. El backend solo filtra por nombre (parcial), así que
 * además se filtra en el cliente por `community.id`: los totales de paginación pueden
 * incluir ascensores de otras comunidades con nombres parecidos.
 */
export function CommunityElevatorsSection({ community }: CommunityElevatorsSectionProps) {
  const { page, size, setPage, setSize } = useListSearchParams(NO_FILTERS, {
    defaultSize: 20,
    sizeOptions: PAGE_SIZE_OPTIONS,
  })
  const { data, isPending, isFetching, isError, error, refetch } = useElevators({
    communityName: community.name,
    page,
    size,
  })

  useClampPage(page, data?.totalPages, setPage)

  const elevators = data?.content.filter((e) => e.community.id === community.id) ?? []
  const emptyMessage =
    data && data.totalElements > 0
      ? 'No hay ascensores de esta comunidad en esta página.'
      : 'Esta comunidad no tiene ascensores registrados.'

  return (
    <DetailCard title="Ascensores de la comunidad">
      <ElevatorsTable
        elevators={elevators}
        hideCommunityColumn
        isLoading={isPending}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage={emptyMessage}
      />
      {data && !isError && data.totalElements > 0 && (
        <div className="mt-4">
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            size={size}
            onPageChange={setPage}
            onSizeChange={setSize}
            sizeOptions={PAGE_SIZE_OPTIONS}
            disabled={isFetching}
          />
        </div>
      )}
    </DetailCard>
  )
}
