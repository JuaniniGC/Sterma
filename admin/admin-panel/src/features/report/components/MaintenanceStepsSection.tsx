import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { DetailCard } from '@/components/data/DetailCard'
import { Badge } from '@/components/ui/Badge'
import type { MaintenanceRule } from '@/features/maintenanceRule/types'
import { useMaintenanceReportDetail } from '../hooks/useMaintenanceReportDetail'
import { MAINTENANCE_FREQUENCY_LABELS } from '../types'

const columns: DataTableColumn<MaintenanceRule>[] = [
  {
    id: 'orderNum',
    header: 'Orden',
    render: (r) => <span className="text-slate-500 tabular-nums">#{r.orderNum}</span>,
    className: 'w-20 whitespace-nowrap',
  },
  {
    id: 'name',
    header: 'Paso',
    render: (r) => <span className="font-medium text-slate-900">{r.name}</span>,
  },
  { id: 'description', header: 'Descripción', render: (r) => r.description || '—' },
  {
    id: 'type',
    header: 'Tipo',
    render: (r) => <Badge tone="indigo">{MAINTENANCE_FREQUENCY_LABELS[r.maintenanceType]}</Badge>,
    className: 'whitespace-nowrap',
  },
]

interface MaintenanceStepsSectionProps {
  reportId: number
}

/** Tarjeta "Pasos realizados" de un mantenimiento: los pasos registrados en el informe, por orden. */
export function MaintenanceStepsSection({ reportId }: MaintenanceStepsSectionProps) {
  const { data, isPending, isFetching, isError, error, refetch } = useMaintenanceReportDetail(reportId)
  const steps = data?.maintenanceRules

  return (
    <DetailCard
      title="Pasos realizados"
      description={
        steps && steps.length > 0 ? `${steps.length} ${steps.length === 1 ? 'paso' : 'pasos'}` : undefined
      }
    >
      <DataTable
        columns={columns}
        data={steps ?? []}
        getRowKey={(r) => r.id}
        isLoading={isPending}
        skeletonRows={4}
        isFetching={isFetching}
        error={isError ? getErrorMessage(error) : null}
        onRetry={() => void refetch()}
        emptyMessage="Este mantenimiento no tiene pasos registrados."
      />
    </DetailCard>
  )
}
