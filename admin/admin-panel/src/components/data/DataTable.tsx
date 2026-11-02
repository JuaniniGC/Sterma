import type { Key, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'

import type { SortState } from '@/types/pagination'

export type { SortDirection, SortState } from '@/types/pagination'

export interface DataTableColumn<T> {
  /** Identificador único de la columna */
  id: string
  header: ReactNode
  render: (row: T) => ReactNode
  /** Si se indica (y la tabla recibe `onSortChange`), la columna es ordenable por este campo */
  sortKey?: string
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey: (row: T) => Key
  /** Primera carga, sin datos todavía */
  isLoading?: boolean
  /** Si se indica, la carga muestra este número de filas skeleton en lugar del spinner */
  skeletonRows?: number
  /** Recargando con datos previos visibles (p. ej. cambio de página) */
  isFetching?: boolean
  /** Mensaje de error; si se indica, sustituye al contenido */
  error?: string | null
  onRetry?: () => void
  emptyMessage?: ReactNode
  /** Contenido de la columna de acciones de cada fila */
  rowActions?: (row: T) => ReactNode
  sort?: SortState | null
  /** Ciclo al pulsar una cabecera: asc → desc → sin ordenar (o asc ↔ desc si `allowUnsorted` es false) */
  onSortChange?: (sort: SortState | null) => void
  /** Permite volver a "sin ordenar" al pulsar una columna ya ordenada desc (por defecto true) */
  allowUnsorted?: boolean
  /** Hace toda la fila clicable y enfocable (Enter/Espacio). Los clics en enlaces o botones internos no la activan */
  onRowClick?: (row: T) => void
  /** Texto accesible de la fila clicable (p. ej. "Ver Residencial Las Rosas") */
  getRowLabel?: (row: T) => string
}

const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, label'

/** true si el evento viene de un control interno de la fila (enlace, botón...) */
function fromInteractiveChild(event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>): boolean {
  const target = event.target as HTMLElement
  return target !== event.currentTarget && target.closest(INTERACTIVE_SELECTOR) !== null
}

function nextSort(
  current: SortState | null | undefined,
  key: string,
  allowUnsorted: boolean,
): SortState | null {
  if (current?.key !== key) return { key, direction: 'asc' }
  if (current.direction === 'asc') return { key, direction: 'desc' }
  return allowUnsorted ? null : { key, direction: 'asc' }
}

function stateRow(colSpan: number, content: ReactNode) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-slate-500">
        {content}
      </td>
    </tr>
  )
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRows,
  isFetching = false,
  error = null,
  onRetry,
  emptyMessage = 'No hay datos.',
  rowActions,
  sort,
  onSortChange,
  allowUnsorted = true,
  onRowClick,
  getRowLabel,
}: DataTableProps<T>) {
  const columnCount = columns.length + (rowActions ? 1 : 0)

  function renderBody() {
    if (error) {
      return stateRow(
        columnCount,
        <>
          <p className="text-red-700">{error}</p>
          {onRetry && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
              Reintentar
            </Button>
          )}
        </>,
      )
    }
    if (isLoading && skeletonRows) {
      return Array.from({ length: skeletonRows }, (_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columnCount }, (_, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3">
              {rowIndex === 0 && cellIndex === 0 && <span className="sr-only">Cargando…</span>}
              <Skeleton className={cellIndex === columnCount - 1 ? 'h-4 w-3/4' : 'h-4 w-full'} />
            </td>
          ))}
        </tr>
      ))
    }
    if (isLoading) {
      return stateRow(
        columnCount,
        <span className="inline-flex items-center gap-2">
          <Spinner /> Cargando…
        </span>,
      )
    }
    if (data.length === 0) {
      return stateRow(columnCount, emptyMessage)
    }
    return data.map((row) => (
      <tr
        key={getRowKey(row)}
        className={`hover:bg-slate-50 ${
          onRowClick
            ? 'cursor-pointer focus-visible:bg-indigo-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-500'
            : ''
        }`}
        {...(onRowClick && {
          tabIndex: 0,
          'aria-label': getRowLabel?.(row),
          onClick: (event: MouseEvent<HTMLTableRowElement>) => {
            if (!fromInteractiveChild(event)) onRowClick(row)
          },
          onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
            if ((event.key === 'Enter' || event.key === ' ') && !fromInteractiveChild(event)) {
              event.preventDefault()
              onRowClick(row)
            }
          },
        })}
      >
        {columns.map((column) => (
          <td key={column.id} className={`px-4 py-3 align-top text-slate-700 ${column.className ?? ''}`}>
            {column.render(row)}
          </td>
        ))}
        {rowActions && (
          <td className="px-4 py-3 text-right align-top whitespace-nowrap">{rowActions(row)}</td>
        )}
      </tr>
    ))
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table
        className={`min-w-full divide-y divide-slate-200 text-sm transition-opacity ${
          isFetching && !isLoading ? 'opacity-60' : ''
        }`}
        aria-busy={isLoading || isFetching}
      >
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => {
              const sortKey = onSortChange ? column.sortKey : undefined
              const direction = sortKey && sort?.key === sortKey ? sort.direction : null
              return (
                <th
                  key={column.id}
                  scope="col"
                  aria-sort={direction ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={`px-4 py-3 text-left font-medium whitespace-nowrap text-slate-600 ${column.className ?? ''}`}
                >
                  {sortKey ? (
                    <button
                      type="button"
                      onClick={() => onSortChange?.(nextSort(sort, sortKey, allowUnsorted))}
                      className="inline-flex items-center gap-1 hover:text-slate-900"
                    >
                      {column.header}
                      <span aria-hidden="true" className="text-xs text-slate-400">
                        {direction === 'asc' ? '▲' : direction === 'desc' ? '▼' : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
            {rowActions && (
              <th scope="col" className="px-4 py-3 text-right font-medium text-slate-600">
                <span className="sr-only">Acciones</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderBody()}</tbody>
      </table>
    </div>
  )
}
