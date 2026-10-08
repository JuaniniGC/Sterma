import { useLocation, useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { Pagination } from '@/components/data/Pagination'
import { SearchInput } from '@/components/data/SearchInput'
import { PageHeader } from '@/components/layout/PageHeader'
import { useClampPage } from '@/hooks/useClampPage'
import { useListSearchParams } from '@/hooks/useListSearchParams'
import { communityDetailPath } from '@/routes/paths'
import type { SortState } from '@/types/pagination'
import { useCommunities } from '../hooks/useCommunities'
import type { CommunityDetailLocationState } from './CommunityDetailPage'
import type { Community } from '../types'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
const EMPTY = '—'
const DEFAULT_SORT: SortState = { key: 'name', direction: 'asc' }
const SORT_KEYS = ['name'] as const

const columns: DataTableColumn<Community>[] = [
  {
    id: 'name',
    header: 'Nombre',
    sortKey: 'name',
    render: (c) => <span className="font-medium text-slate-900">{c.name}</span>,
  },
  { id: 'cif', header: 'CIF', render: (c) => c.cif, className: 'whitespace-nowrap' },
  { id: 'city', header: 'Ciudad', render: (c) => c.localization?.city || EMPTY },
  {
    id: 'address',
    header: 'Dirección',
    render: (c) => {
      const { street, postalCode } = c.localization ?? {}
      if (!street && !postalCode) return EMPTY
      return (
        <>
          <div>{street || EMPTY}</div>
          {postalCode && <div className="text-xs text-slate-500">CP {postalCode}</div>}
        </>
      )
    },
  },
  {
    id: 'leader',
    header: 'Responsable',
    render: (c) => {
      const { communityLeaderName: name, communityLeaderTelephone: phone } =
        c.communityLeaderInfo ?? {}
      if (!name && !phone) return EMPTY
      return (
        <>
          <div>{name || EMPTY}</div>
          {phone && (
            <a href={`tel:${phone}`} className="text-xs text-indigo-600 hover:underline">
              {phone}
            </a>
          )}
        </>
      )
    },
  },
  {
    id: 'description',
    header: 'Descripción',
    className: 'max-w-xs',
    render: (c) =>
      c.description ? (
        <span className="line-clamp-2" title={c.description}>
          {c.description}
        </span>
      ) : (
        EMPTY
      ),
  },
]

export function CommunityListPage() {
  const { page, size, filters, sort, sortParam, setPage, setSize, setFilter, setSort } =
    useListSearchParams(['name'], {
      defaultSize: 20,
      sizeOptions: PAGE_SIZE_OPTIONS,
      defaultSort: DEFAULT_SORT,
      sortKeys: SORT_KEYS,
    })
  const name = filters.name
  const { data, isPending, isFetching, isError, error, refetch } = useCommunities({
    name,
    page,
    size,
    sort: sortParam,
  })

  useClampPage(page, data?.totalPages, setPage)

  const navigate = useNavigate()
  const location = useLocation()
  const openCommunity = (community: Community) => {
    // Conserva filtros y página para el enlace "Volver" del detalle
    const state: CommunityDetailLocationState = { backTo: location.pathname + location.search }
    navigate(communityDetailPath(community.id), { state })
  }

  const hasFilter = name.trim() !== ''

  return (
    <>
      <PageHeader title="Comunidades" description="Listado de comunidades registradas." />

      <div className="mb-4 max-w-sm">
        <SearchInput
          value={name}
          onChange={(value) => setFilter('name', value)}
          placeholder="Buscar por nombre…"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        getRowKey={(c) => c.id}
        sort={sort}
        onSortChange={setSort}
        allowUnsorted={false}
        onRowClick={openCommunity}
        getRowLabel={(c) => `Ver detalle de ${c.name}`}
        isLoading={isPending}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage={
          hasFilter
            ? `No hay comunidades que coincidan con «${name.trim()}».`
            : 'Todavía no hay comunidades registradas.'
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
