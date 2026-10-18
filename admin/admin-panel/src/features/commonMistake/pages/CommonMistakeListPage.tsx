import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { Pagination } from '@/components/data/Pagination'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import { useClampPage } from '@/hooks/useClampPage'
import { useListSearchParams } from '@/hooks/useListSearchParams'
import { paths } from '@/routes/paths'
import { DeleteCommonMistakeDialog } from '../components/DeleteCommonMistakeDialog'
import { useCommonMistakes } from '../hooks/useCommonMistakes'
import type { CommonMistake } from '../types'

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const

const columns: DataTableColumn<CommonMistake>[] = [
  {
    id: 'identificator',
    header: 'Identificador',
    render: (m) => <span className="font-medium whitespace-nowrap text-slate-900">{m.identificator}</span>,
  },
  { id: 'description', header: 'Descripción', render: (m) => m.description, className: 'min-w-64' },
]

/** `/common-mistakes`: listado paginado de los fallos comunes. */
export function CommonMistakeListPage() {
  // Sin filtros: solo página y tamaño en la URL
  const { page, size, setPage, setSize } = useListSearchParams([], {
    defaultSize: 20,
    sizeOptions: PAGE_SIZE_OPTIONS,
  })
  const { data, isPending, isFetching, isError, error, refetch } = useCommonMistakes({ page, size })

  useClampPage(page, data?.totalPages, setPage)
  const navigate = useNavigate()
  const [mistakeToDelete, setMistakeToDelete] = useState<CommonMistake | null>(null)

  return (
    <>
      <PageHeader
        title="Fallos comunes"
        description="Catálogo de los fallos más habituales en los ascensores."
        actions={
          <Button size="lg" onClick={() => void navigate(paths.newCommonMistake)}>
            <span aria-hidden="true" className="text-[22px] leading-none">+</span>
            Nuevo fallo común
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        getRowKey={(m) => m.id}
        isLoading={isPending}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage="Todavía no hay fallos comunes registrados."
        rowActions={(m) => (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setMistakeToDelete(m)}
            aria-label={`Eliminar el fallo común ${m.identificator}`}
          >
            Eliminar
          </Button>
        )}
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

      <DeleteCommonMistakeDialog mistake={mistakeToDelete} onClose={() => setMistakeToDelete(null)} />
    </>
  )
}
