import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { communityDetailPath, elevatorDetailPath } from '@/routes/paths'
import type { Elevator } from '../types'

const baseColumns: DataTableColumn<Elevator>[] = [
  {
    id: 'rae',
    header: 'RAE',
    render: (e) => <span className="font-medium text-slate-900">{e.rae}</span>,
    className: 'whitespace-nowrap',
  },
  { id: 'instalationYear', header: 'Año de instalación', render: (e) => e.instalationYear },
]

const communityColumn: DataTableColumn<Elevator> = {
  id: 'community',
  header: 'Comunidad',
  render: (e) => (
    <Link
      to={communityDetailPath(e.community.id)}
      className="font-medium text-indigo-600 hover:underline"
    >
      {e.community.name}
    </Link>
  ),
}

const columnsWithCommunity = [...baseColumns, communityColumn]

interface ElevatorsTableProps {
  elevators: Elevator[]
  /** Oculta la columna "Comunidad" (p. ej. en el detalle de una comunidad) */
  hideCommunityColumn?: boolean
  isLoading?: boolean
  isFetching?: boolean
  error?: string | null
  onRetry?: () => void
  emptyMessage?: ReactNode
  /** Botones por fila (p. ej. editar/eliminar en el listado general) */
  rowActions?: (elevator: Elevator) => ReactNode
}

/**
 * Tabla de ascensores sobre `DataTable`, compartida por el listado general y el detalle de comunidad.
 * Toda la fila abre el detalle del ascensor; el enlace de la comunidad no la activa
 * (DataTable ignora clics y teclas que vienen de enlaces o botones internos).
 */
export function ElevatorsTable({
  elevators,
  hideCommunityColumn = false,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyMessage = 'No hay ascensores.',
  rowActions,
}: ElevatorsTableProps) {
  const navigate = useNavigate()

  return (
    <DataTable
      columns={hideCommunityColumn ? baseColumns : columnsWithCommunity}
      data={elevators}
      getRowKey={(e) => e.id}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onRetry={onRetry}
      emptyMessage={emptyMessage}
      onRowClick={(e) => void navigate(elevatorDetailPath(e.id))}
      getRowLabel={(e) => `Ver ascensor ${e.rae}`}
      rowActions={rowActions}
    />
  )
}
