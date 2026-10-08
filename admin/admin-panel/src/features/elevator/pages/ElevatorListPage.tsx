import { getErrorMessage } from '@/api/errors'
import { Pagination } from '@/components/data/Pagination'
import { SearchInput } from '@/components/data/SearchInput'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useClampPage } from '@/hooks/useClampPage'
import { useListSearchParams } from '@/hooks/useListSearchParams'
import { ElevatorsTable } from '../components/ElevatorsTable'
import { useElevators } from '../hooks/useElevators'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
const FILTER_KEYS = ['communityName', 'rae'] as const

export function ElevatorListPage() {
  const { page, size, filters, hasActiveFilters, setPage, setSize, setFilter, clearFilters } =
    useListSearchParams(FILTER_KEYS, { defaultSize: 20, sizeOptions: PAGE_SIZE_OPTIONS })
  const { data, isPending, isFetching, isError, error, refetch } = useElevators({
    communityName: filters.communityName,
    rae: filters.rae,
    page,
    size,
  })

  useClampPage(page, data?.totalPages, setPage)

  return (
    <>
      <PageHeader title="Ascensores" description="Vista general de los ascensores de todas las comunidades." />

      <div className="mb-4 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        <SearchInput
          value={filters.communityName}
          onChange={(value) => setFilter('communityName', value)}
          placeholder="Buscar por comunidad…"
          label="Filtrar por nombre de la comunidad"
        />
        <SearchInput
          value={filters.rae}
          onChange={(value) => setFilter('rae', value)}
          placeholder="Buscar por RAE…"
          label="Filtrar por RAE"
        />
      </div>

      <ElevatorsTable
        elevators={data?.content ?? []}
        isLoading={isPending}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage={
          hasActiveFilters ? (
            <>
              <p>No hay ascensores que coincidan con los filtros.</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            </>
          ) : (
            'Todavía no hay ascensores registrados.'
          )
        }
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
    </>
  )
}
