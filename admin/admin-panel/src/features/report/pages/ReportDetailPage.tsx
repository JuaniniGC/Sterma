import { ElevatorActionPage } from '@/features/elevator/components/ElevatorActionPage'
import { ReportDetail } from '../components/ReportDetail'
import type { ReportKind } from '../types'

interface ReportDetailPageProps {
  kind: ReportKind
}

/** `/elevators/:id/incidents/:reportId` y `/elevators/:id/maintenance/:reportId`: misma pantalla para ambos tipos. */
export function ReportDetailPage({ kind }: ReportDetailPageProps) {
  return (
    <ElevatorActionPage
      title={kind === 'incident' ? 'Detalle de incidencia' : 'Detalle de mantenimiento'}
      description={(elevator) => `Ascensor ${elevator.rae} · ${elevator.community.name}`}
      bare
    >
      {(elevator) => <ReportDetail kind={kind} elevatorId={elevator.id} />}
    </ElevatorActionPage>
  )
}
