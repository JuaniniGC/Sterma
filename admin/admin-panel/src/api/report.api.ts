import type { CreateMaintenanceRuleRequest, MaintenanceRule } from '@/features/maintenanceRule/types'
import type { IncidentReport, MaintenanceReport, MaintenanceType } from '@/features/report/types'
import { httpClient } from './client'
import { ApiError } from './errors'

/**
 * GET /report/maintenance/rules/{maintenanceType} — reglas acumuladas hasta ese tipo:
 * `monthly` → mensuales; `biannual` → mensuales + semestrales; `annual` → todas.
 * El backend responde 404 cuando no hay reglas: se devuelve `[]`.
 */
export async function getMaintenanceRules(upTo: MaintenanceType = 'ANNUAL'): Promise<MaintenanceRule[]> {
  try {
    const { data } = await httpClient.get<MaintenanceRule[]>(
      `/report/maintenance/rules/${encodeURIComponent(upTo.toLowerCase())}`,
    )
    return data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return []
    throw error
  }
}

/**
 * POST /report/maintenance/rules — crea una regla. Solo se acepta 201; cualquier otra
 * respuesta (incluido otro 2xx) se trata como error. El backend responde 500 con texto si falla.
 */
export async function createMaintenanceRule(body: CreateMaintenanceRuleRequest): Promise<MaintenanceRule> {
  const response = await httpClient.post<MaintenanceRule>('/report/maintenance/rules', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear la regla (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/** DELETE /report/maintenance/rules/{id} — 200 con texto; 404 (texto plano) si la regla no existe. */
export async function deleteMaintenanceRule(id: number): Promise<void> {
  await httpClient.delete(`/report/maintenance/rules/${encodeURIComponent(id)}`)
}

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
