import { ElevatorActionPage } from '@/features/elevator/components/ElevatorActionPage'
import { ReportForm } from '../components/ReportForm'
import { useCreateIncidentReport } from '../hooks/useCreateReport'
import { toIncidentReportRequest } from '../types'

export function NewIncidentReportPage() {
  const createIncident = useCreateIncidentReport()

  return (
    <ElevatorActionPage
      title="Nueva incidencia"
      description={(elevator) => `Ascensor ${elevator.rae} · ${elevator.community.name}`}
    >
      {(elevator, leave) => (
        <ReportForm
          kind="incident"
          onSubmit={(values) =>
            createIncident.mutate(toIncidentReportRequest(values, elevator.rae), { onSuccess: leave })
          }
          onCancel={leave}
          submitLabel="Crear incidencia"
          isPending={createIncident.isPending}
          error={createIncident.error}
        />
      )}
    </ElevatorActionPage>
  )
}
