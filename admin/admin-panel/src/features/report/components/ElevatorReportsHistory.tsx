import { useState, type ReactNode } from 'react'
import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { DetailCard } from '@/components/data/DetailCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router'
import { formatDateTime } from '@/lib/formatters'
import { reportDetailPath } from '@/routes/paths'
import { useElevatorReports } from '../hooks/useElevatorReports'
import { MAINTENANCE_TYPE_LABELS, type ElevatorReportEntry, type IncidentReport } from '../types'
import { CloseIncidentDialog } from './CloseIncidentDialog'
import { DeleteReportDialog } from './DeleteReportDialog'

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
  /** Botones en la cabecera de la tarjeta (p. ej. "Nueva incidencia") */
  actions?: ReactNode
}

/** Historial de informes (incidencias y mantenimientos) de un ascensor, del más reciente al más antiguo. */
export function ElevatorReportsHistory({ elevatorId, actions }: ElevatorReportsHistoryProps) {
  const { entries, incidentCount, maintenanceCount, isLoading, isFetching, error, retry } =
    useElevatorReports(elevatorId)
  const navigate = useNavigate()
  const [incidentToClose, setIncidentToClose] = useState<IncidentReport | null>(null)
  const [reportToDelete, setReportToDelete] = useState<ElevatorReportEntry | null>(null)

  // Incidencias: cerrar (si siguen en curso) y eliminar. Mantenimientos: eliminar; deshabilitado si el backend
  // no devuelve su id (sin él no se pueden identificar).
  const renderRowActions = (entry: ElevatorReportEntry) => {
    const started = formatDateTime(entry.report.startDate) ?? entry.report.startDate
    const isIncident = entry.kind === 'incident'
    const canDelete = isIncident || entry.report.id !== null
    return (
      <div className="flex justify-end gap-2">
        {entry.kind === 'incident' && entry.report.endDate === null && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIncidentToClose(entry.report)}
            aria-label={`Cerrar la incidencia iniciada el ${started}`}
          >
            Cerrar incidencia
          </Button>
        )}
        <Button
          variant="danger"
          size="sm"
          disabled={!canDelete}
          title={canDelete ? undefined : 'No se puede eliminar: el servidor no ha enviado el identificador del mantenimiento.'}
          onClick={() => setReportToDelete(entry)}
          aria-label={`Eliminar ${isIncident ? 'la incidencia iniciada' : 'el mantenimiento iniciado'} el ${started}`}
        >
          Eliminar
        </Button>
      </div>
    )
  }

  // Cada fila abre el detalle del informe (un mantenimiento sin id no se puede identificar: no abre nada)
  const openDetail = (entry: ElevatorReportEntry) => {
    if (entry.report.id === null) return
    void navigate(reportDetailPath(elevatorId, entry.kind, entry.report.id))
  }

  const summary =
    isLoading || error
      ? undefined
      : `${countLabel(incidentCount, 'incidencia', 'incidencias')} · ${countLabel(maintenanceCount, 'mantenimiento', 'mantenimientos')}`

  return (
    <DetailCard title="Historial de informes" description={summary} actions={actions}>
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
        rowActions={renderRowActions}
        onRowClick={openDetail}
        getRowLabel={(e) =>
          `Ver ${e.kind === 'incident' ? 'la incidencia iniciada' : 'el mantenimiento iniciado'} el ${formatDateTime(e.report.startDate) ?? e.report.startDate}`
        }
      />

      <CloseIncidentDialog incident={incidentToClose} onClose={() => setIncidentToClose(null)} />
      <DeleteReportDialog entry={reportToDelete} onClose={() => setReportToDelete(null)} />
    </DetailCard>
  )
}
