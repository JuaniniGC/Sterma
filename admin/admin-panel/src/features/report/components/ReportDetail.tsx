import { useState } from 'react'
import { useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { InfoGrid } from '@/components/data/InfoGrid'
import { LoadingState } from '@/components/data/LoadingState'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatDateTime } from '@/lib/formatters'
import { parseId } from '@/lib/parseId'
import { useElevatorReport } from '../hooks/useElevatorReports'
import { MAINTENANCE_TYPE_LABELS, type IncidentReport, type ReportKind } from '../types'
import { CloseIncidentDialog } from './CloseIncidentDialog'
import { IncidentImagesSection } from './IncidentImagesSection'

interface ReportDetailProps {
  kind: ReportKind
  elevatorId: number
}

/**
 * Detalle de un informe (`:reportId` de la URL) de un ascensor: fechas de apertura y cierre y, si es una
 * incidencia en curso, botón para añadir la fecha de cierre. Común a incidencias y mantenimientos.
 */
export function ReportDetail({ kind, elevatorId }: ReportDetailProps) {
  const { reportId: rawReportId } = useParams()
  const reportId = parseId(rawReportId)
  // Sin id válido no se busca nada (0 no coincide con ningún informe)
  const { entry, isPending, error, retry } = useElevatorReport(kind, elevatorId, reportId ?? 0)
  const [incidentToClose, setIncidentToClose] = useState<IncidentReport | null>(null)

  if (reportId !== null && error) return <ErrorState message={getErrorMessage(error)} onRetry={retry} />
  if (reportId !== null && isPending) return <LoadingState label="Cargando informe…" />

  if (!entry) {
    return (
      <Alert variant="warning">
        Este ascensor no tiene {kind === 'incident' ? 'ninguna incidencia' : 'ningún mantenimiento'} con el identificador
        «{rawReportId}». Puede que se haya eliminado o que el enlace no sea correcto.
      </Alert>
    )
  }

  const { report } = entry
  const title =
    entry.kind === 'incident'
      ? 'Incidencia'
      : entry.report.maintenanceType
        ? MAINTENANCE_TYPE_LABELS[entry.report.maintenanceType]
        : 'Mantenimiento'
  // Solo las incidencias tienen endpoint para añadir la fecha de cierre
  const closableIncident = entry.kind === 'incident' && entry.report.endDate === null ? entry.report : null

  return (
    <div className="max-w-2xl space-y-6">
      <DetailCard
        title={title}
        actions={
          closableIncident && (
            <Button size="sm" onClick={() => setIncidentToClose(closableIncident)}>
              Añadir fecha de cierre
            </Button>
          )
        }
      >
        <InfoGrid
          columns={2}
          sections={[
            {
              items: [
                { label: 'Apertura', value: formatDateTime(report.startDate) ?? report.startDate },
                { label: 'Cierre', value: formatDateTime(report.endDate) ?? <Badge tone="amber">En curso</Badge> },
              ],
            },
          ]}
        />

        <CloseIncidentDialog incident={incidentToClose} onClose={() => setIncidentToClose(null)} />
      </DetailCard>

      {entry.kind === 'incident' && <IncidentImagesSection incidentId={entry.report.id} />}
    </div>
  )
}
