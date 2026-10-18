import { ElevatorActionPage } from '@/features/elevator/components/ElevatorActionPage'
import { ReportForm } from '../components/ReportForm'
import { useCreateMaintenanceReport } from '../hooks/useCreateReport'
import { toMaintenanceReportRequest } from '../types'

export function NewMaintenanceReportPage() {
  const createMaintenance = useCreateMaintenanceReport()

  return (
    <ElevatorActionPage
      title="Nuevo mantenimiento"
      description={(elevator) => `Ascensor ${elevator.rae} · ${elevator.community.name}`}
    >
      {(elevator, leave) => (
        <ReportForm
          kind="maintenance"
          onSubmit={(values) =>
            createMaintenance.mutate(toMaintenanceReportRequest(values, elevator.rae), { onSuccess: leave })
          }
          onCancel={leave}
          submitLabel="Crear mantenimiento"
          isPending={createMaintenance.isPending}
          error={createMaintenance.error}
        />
      )}
    </ElevatorActionPage>
  )
}
