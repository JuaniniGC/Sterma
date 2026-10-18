import { useState } from 'react'
import { useNavigate } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { DataTable, type DataTableColumn } from '@/components/data/DataTable'
import { DetailCard } from '@/components/data/DetailCard'
import { ErrorState } from '@/components/data/ErrorState'
import { ConfirmDialog } from '@/components/forms/ConfirmDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/Button'
import {
  MAINTENANCE_FREQUENCY_DESCRIPTIONS,
  MAINTENANCE_FREQUENCY_LABELS,
  MAINTENANCE_TYPES,
} from '@/features/report/types'
import { paths } from '@/routes/paths'
import { useDeleteMaintenanceRule } from '../hooks/useDeleteMaintenanceRule'
import { useMaintenanceRules } from '../hooks/useMaintenanceRules'
import type { MaintenanceRule } from '../types'

const columns: DataTableColumn<MaintenanceRule>[] = [
  {
    id: 'orderNum',
    header: 'Orden',
    render: (r) => <span className="text-slate-500 tabular-nums">#{r.orderNum}</span>,
    className: 'w-20 whitespace-nowrap',
  },
  {
    id: 'name',
    header: 'Nombre',
    render: (r) => <span className="font-medium text-slate-900">{r.name}</span>,
    className: 'whitespace-nowrap',
  },
  { id: 'description', header: 'Descripción', render: (r) => r.description || '—' },
]

function ruleCount(count: number): string {
  return `${count} ${count === 1 ? 'paso' : 'pasos'}`
}

export function MaintenanceRulesPage() {
  const { data, isPending, isFetching, isError, error, refetch } = useMaintenanceRules()
  const deleteRule = useDeleteMaintenanceRule()
  const navigate = useNavigate()
  const [ruleToDelete, setRuleToDelete] = useState<MaintenanceRule | null>(null)

  const confirmDelete = () => {
    if (!ruleToDelete) return
    deleteRule.mutate(ruleToDelete, {
      onSuccess: () => setRuleToDelete(null),
      // 404: la regla ya no existe, no tiene sentido mantener el diálogo
      onError: (deleteError) => {
        if (deleteError.status === 404) setRuleToDelete(null)
      },
    })
  }

  const renderRowActions = (rule: MaintenanceRule) => (
    <Button
      variant="danger"
      size="sm"
      onClick={() => setRuleToDelete(rule)}
      aria-label={`Eliminar el paso ${rule.name}`}
    >
      Eliminar
    </Button>
  )

  const header = (
    <PageHeader
      title="Pasos de mantenimiento"
      description={
        data
          ? `${ruleCount(data.total)}, agrupados por tipo de mantenimiento.`
          : 'Tareas a realizar en cada tipo de mantenimiento.'
      }
      actions={
        <Button size="lg" onClick={() => void navigate(paths.newMaintenanceRule)}>
          <span aria-hidden="true" className="text-[22px] leading-none">+</span>
          Nuevo paso
        </Button>
      }
    />
  )

  if (isError) {
    return (
      <>
        {header}
        <ErrorState message={getErrorMessage(error)} onRetry={() => void refetch()} />
      </>
    )
  }

  if (data && data.total === 0) {
    return (
      <>
        {header}
        <DetailCard>
          <p className="py-8 text-center text-slate-500">No hay pasos de mantenimiento registrados.</p>
        </DetailCard>
      </>
    )
  }

  return (
    <>
      {header}
      <div className="space-y-6">
        {MAINTENANCE_TYPES.map((type) => {
          const rules = data?.byType[type] ?? []
          return (
            <DetailCard
              key={type}
              title={MAINTENANCE_FREQUENCY_LABELS[type]}
              description={
                isPending
                  ? MAINTENANCE_FREQUENCY_DESCRIPTIONS[type]
                  : `${MAINTENANCE_FREQUENCY_DESCRIPTIONS[type]} · ${ruleCount(rules.length)}`
              }
            >
              <DataTable
                columns={columns}
                data={rules}
                getRowKey={(r) => r.id}
                isLoading={isPending}
                skeletonRows={2}
                isFetching={isFetching}
                emptyMessage={`No hay pasos de mantenimiento ${MAINTENANCE_FREQUENCY_LABELS[type].toLowerCase()}.`}
                rowActions={renderRowActions}
              />
            </DetailCard>
          )
        })}
      </div>

      <ConfirmDialog
        open={ruleToDelete !== null}
        title="Eliminar paso de mantenimiento"
        message={
          ruleToDelete && (
            <>
              ¿Seguro que quieres eliminar el paso{' '}
              <strong className="text-slate-900">«{ruleToDelete.name}»</strong> (#{ruleToDelete.orderNum},{' '}
              {MAINTENANCE_FREQUENCY_LABELS[ruleToDelete.maintenanceType].toLowerCase()})? Esta acción no se puede
              deshacer.
            </>
          )
        }
        confirmLabel="Eliminar"
        loading={deleteRule.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setRuleToDelete(null)}
      />
    </>
  )
}
