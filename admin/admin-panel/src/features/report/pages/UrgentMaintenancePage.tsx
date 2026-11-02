import { Link, useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { formatDate, parseLocalDate } from '@/lib/formatters'
import { communityDetailPath, elevatorDetailPath } from '@/routes/paths'
import { useUrgentMaintenance } from '../hooks/useUrgentMaintenance'
import {
  MAINTENANCE_TYPE_LABELS,
  NEXT_MAINTENANCE_STATUS_LABELS,
  type NextMaintenanceStatus,
  type UrgentMaintenance,
} from '../types'

const STATUS_TONES: Record<NextMaintenanceStatus, 'red' | 'amber' | 'green'> = {
  NEVER_PASS: 'red',
  DANGER: 'red',
  WARNING: 'amber',
  GOOD: 'green',
}

const DAY_MS = 24 * 60 * 60 * 1000

/** "Hace 3 días", "Hoy", "En 12 días" respecto a hoy (fechas a medianoche local). */
function relativeDays(value: string | null): string | null {
  const date = parseLocalDate(value)
  if (!date) return null
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // Redondeo: los cambios de hora hacen que un día no mida siempre 24 h exactas
  const days = Math.round((date.getTime() - today.getTime()) / DAY_MS)
  if (days === 0) return 'Hoy'
  const count = `${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'}`
  return days < 0 ? `Hace ${count}` : `En ${count}`
}

const columns: DataTableColumn<UrgentMaintenance>[] = [
  {
    id: 'status',
    header: 'Estado',
    render: ({ nextMaintenanceResponse: { status } }) => (
      <Badge tone={STATUS_TONES[status]}>{NEXT_MAINTENANCE_STATUS_LABELS[status]}</Badge>
    ),
    className: 'whitespace-nowrap',
  },
  {
    id: 'rae',
    header: 'Ascensor',
    render: ({ elevator }) => <span className="font-medium text-slate-900">{elevator.rae}</span>,
    className: 'whitespace-nowrap',
  },
  {
    id: 'community',
    header: 'Comunidad',
    render: ({ elevator: { community } }) => (
      <Link to={communityDetailPath(community.id)} className="font-medium text-indigo-600 hover:underline">
        {community.name}
      </Link>
    ),
  },
  {
    id: 'type',
    header: 'Mantenimiento',
    render: ({ nextMaintenanceResponse: { maintenanceType } }) => MAINTENANCE_TYPE_LABELS[maintenanceType],
    className: 'whitespace-nowrap',
  },
  {
    id: 'nextDate',
    header: 'Fecha prevista',
    render: ({ nextMaintenanceResponse: { nextDate, status } }) => {
      const formatted = formatDate(nextDate)
      if (!formatted) {
        // NEVER_PASS: no hay ningún mantenimiento anual del que calcular la fecha
        return status === 'NEVER_PASS' ? (
          <span className="text-slate-600">Sin mantenimiento anual registrado</span>
        ) : (
          '—'
        )
      }
      return (
        <>
          <span className="text-slate-900">{formatted}</span>
          <span className="block text-xs text-slate-500">{relativeDays(nextDate)}</span>
        </>
      )
    },
    className: 'whitespace-nowrap',
  },
]

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Resumen de la cabecera: "2 nunca realizados · 12 vencidos · 2 próximos" (solo los estados presentes). */
function summary(items: UrgentMaintenance[]): string {
  const count = (status: NextMaintenanceStatus) =>
    items.filter((item) => item.nextMaintenanceResponse.status === status).length
  return [
    [count('NEVER_PASS'), 'nunca realizado', 'nunca realizados'] as const,
    [count('DANGER'), 'vencido', 'vencidos'] as const,
    [count('WARNING'), 'próximo (este mes)', 'próximos (este mes)'] as const,
  ]
    .filter(([n]) => n > 0)
    .map(([n, singular, plural]) => countLabel(n, singular, plural))
    .join(' · ')
}

/** `/urgent-maintenance`: ascensores con el próximo mantenimiento vencido, sin realizar o en el próximo mes. */
export function UrgentMaintenancePage() {
  const navigate = useNavigate()
  const { data, isPending, isFetching, isError, error, refetch } = useUrgentMaintenance()

  return (
    <>
      <PageHeader
        title="Mantenimientos urgentes"
        description={
          data && data.length > 0
            ? summary(data)
            : 'Ascensores con el próximo mantenimiento vencido o previsto para el próximo mes.'
        }
      />

      <DataTable
        columns={columns}
        data={data ?? []}
        getRowKey={(item) => item.elevator.id}
        isLoading={isPending}
        skeletonRows={6}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage="No hay mantenimientos urgentes: todos los ascensores están al día."
        onRowClick={(item) => void navigate(elevatorDetailPath(item.elevator.id))}
        getRowLabel={(item) => `Ver el ascensor ${item.elevator.rae}`}
      />
    </>
  )
}
