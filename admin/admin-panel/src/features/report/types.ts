export const MAINTENANCE_TYPES = ['MONTHLY', 'BIANNUAL', 'ANNUAL'] as const
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]

/** En el backend BIANNUAL = cada 6 meses */
export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  MONTHLY: 'Mantenimiento mensual',
  BIANNUAL: 'Mantenimiento semestral',
  ANNUAL: 'Mantenimiento anual',
}

/** Fechas en formato `LocalDateTime` de Spring, sin zona: `2025-02-18T14:15:00` */
type LocalDateTime = string

/** GET /report/incident/{elevatorId} */
export interface IncidentReport {
  id: number
  startDate: LocalDateTime
  /** null si la incidencia sigue abierta */
  endDate: LocalDateTime | null
  commentary: string | null
}

/** GET /report/maintenance/{elevatorId} */
export interface MaintenanceReport {
  /** El backend siempre lo devuelve null (su DTO no lo rellena) */
  id: number | null
  maintenanceType: MaintenanceType | null
  startDate: LocalDateTime
  endDate: LocalDateTime | null
  commentary: string | null
}

/** Fila del historial unificado (incidencias + mantenimientos) */
export type ElevatorReportEntry =
  | { kind: 'incident'; key: string; report: IncidentReport }
  | { kind: 'maintenance'; key: string; report: MaintenanceReport }
