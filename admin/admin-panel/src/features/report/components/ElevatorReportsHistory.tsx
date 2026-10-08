import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { DetailCard } from '@/components/data/DetailCard'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/formatters'
import { useElevatorReports } from '../hooks/useElevatorReports'
import { MAINTENANCE_TYPE_LABELS, type ElevatorReportEntry } from '../types'

const EMPTY = '—'

function typeBadge(entry: ElevatorReportEntry) {
  if (entry.kind === 'incident') return <Badge tone="red">Incidencia</Badge>
  const type = entry.report.maintenanceType
  return <Badge tone="blue">{type ? MAINTENANCE_TYPE_LABELS[type] : 'Mantenimiento'}</Badge>
}

const columns: DataTableColumn<ElevatorReportEntry>[] = [
  { id: 'type', header: 'Tipo', render: typeBadge, className: 'whitespace-nowrap' },
  {
    id: 'startDate',
    header: 'Inicio',
    render: (e) => formatDateTime(e.report.startDate) ?? EMPTY,
    className: 'whitespace-nowrap',
  },
  {
    id: 'endDate',
    header: 'Fin',
    render: (e) => formatDateTime(e.report.endDate) ?? <Badge tone="amber">En curso</Badge>,
    className: 'whitespace-nowrap',
  },
  {
    id: 'commentary',
    header: 'Comentario',
    render: (e) => e.report.commentary || EMPTY,
    className: 'min-w-64',
  },
]

function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

interface ElevatorReportsHistoryProps {
  elevatorId: number
}

/** Historial de informes (incidencias y mantenimientos) de un ascensor, del más reciente al más antiguo. */
export function ElevatorReportsHistory({ elevatorId }: ElevatorReportsHistoryProps) {
  const { entries, incidentCount, maintenanceCount, isLoading, isFetching, error, retry } =
    useElevatorReports(elevatorId)

  const summary =
    isLoading || error
      ? undefined
      : `${countLabel(incidentCount, 'incidencia', 'incidencias')} · ${countLabel(maintenanceCount, 'mantenimiento', 'mantenimientos')}`

  return (
    <DetailCard title="Historial de informes" description={summary}>
      <DataTable
        columns={columns}
        data={entries}
        getRowKey={(e) => e.key}
        isLoading={isLoading}
        skeletonRows={5}
        isFetching={isFetching}
        error={error ? getErrorMessage(error) : null}
        onRetry={retry}
        emptyMessage="Este ascensor no tiene informes registrados."
      />
    </DetailCard>
  )
}
