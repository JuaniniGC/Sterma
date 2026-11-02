import { useQuery } from '@tanstack/react-query'
import { getMaintenanceRules } from '@/api/report.api'
import { MAINTENANCE_TYPES, type MaintenanceType } from '@/features/report/types'
import type { MaintenanceRule } from '../types'

export const maintenanceRuleKeys = {
  all: ['maintenanceRules'] as const,
}

export type MaintenanceRulesByType = Record<MaintenanceType, MaintenanceRule[]>

/** Agrupa las reglas por `maintenanceType`, cada grupo ordenado por `orderNum`. */
function groupByType(rules: MaintenanceRule[]): MaintenanceRulesByType {
  const groups: MaintenanceRulesByType = { MONTHLY: [], BIANNUAL: [], ANNUAL: [] }
  // `?.` por si el backend añade un tipo nuevo que el panel aún no conoce
  for (const rule of rules) groups[rule.maintenanceType]?.push(rule)
  for (const type of MAINTENANCE_TYPES) groups[type].sort((a, b) => a.orderNum - b.orderNum)
  return groups
}

/** Todas las reglas de mantenimiento (se piden con `annual`, que las incluye todas), agrupadas por tipo. */
export function useMaintenanceRules() {
  return useQuery({
    queryKey: maintenanceRuleKeys.all,
    queryFn: () => getMaintenanceRules('ANNUAL'),
    select: (rules) => ({ total: rules.length, byType: groupByType(rules) }),
  })
}
