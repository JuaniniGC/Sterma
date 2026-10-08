import type { IncidentReport, MaintenanceReport } from '@/features/report/types'
import { httpClient } from './client'

/** GET /report/incident/{elevatorId} — todas las incidencias del ascensor (sin paginar). 404 si el ascensor no existe. */
export async function getIncidentReportsByElevator(elevatorId: number): Promise<IncidentReport[]> {
  const { data } = await httpClient.get<IncidentReport[]>(
    `/report/incident/${encodeURIComponent(elevatorId)}`,
  )
  return data
}

/** GET /report/maintenance/{elevatorId} — todos los mantenimientos del ascensor (sin paginar). 404 si el ascensor no existe. */
export async function getMaintenanceReportsByElevator(elevatorId: number): Promise<MaintenanceReport[]> {
  const { data } = await httpClient.get<MaintenanceReport[]>(
    `/report/maintenance/${encodeURIComponent(elevatorId)}`,
  )
  return data
}
