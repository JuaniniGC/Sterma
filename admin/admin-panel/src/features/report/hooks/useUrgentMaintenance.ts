import { useQuery } from '@tanstack/react-query'
import { getUrgentMaintenance } from '@/api/report.api'
import { NEXT_MAINTENANCE_STATUS_WEIGHT, type UrgentMaintenance } from '../types'
import { reportKeys } from './useElevatorReports'

/**
 * Mantenimientos urgentes de todos los ascensores. El backend ya los ordena por estado; dentro de cada estado se
 * ordenan aquí por fecha prevista (la más antigua primero: la más vencida o la más próxima).
 */
export function useUrgentMaintenance() {
  return useQuery({
    // Bajo `reportKeys.all`: crear o borrar un mantenimiento lo invalida y se recalcula
    queryKey: reportKeys.urgentMaintenance(),
    queryFn: getUrgentMaintenance,
    select: (items: UrgentMaintenance[]) =>
      [...items].sort((a, b) => {
        const byStatus =
          NEXT_MAINTENANCE_STATUS_WEIGHT[a.nextMaintenanceResponse.status] -
          NEXT_MAINTENANCE_STATUS_WEIGHT[b.nextMaintenanceResponse.status]
        // `LocalDate` ISO: el orden de texto coincide con el cronológico
        return byStatus || (a.nextMaintenanceResponse.nextDate ?? '').localeCompare(b.nextMaintenanceResponse.nextDate ?? '')
      }),
  })
}
