import { useQuery } from '@tanstack/react-query'
import { getMaintenanceReportDetail } from '@/api/report.api'
import { reportKeys } from './useElevatorReports'

/** Detalle de un mantenimiento con los pasos realizados. */
export function useMaintenanceReportDetail(reportId: number) {
  return useQuery({
    // Bajo `reportKeys.all`: se invalida con el resto de informes
    queryKey: reportKeys.maintenanceDetail(reportId),
    queryFn: () => getMaintenanceReportDetail(reportId),
  })
}
