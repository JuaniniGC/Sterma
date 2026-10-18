import { z } from 'zod'
import { toLocalDateTime } from '@/lib/dateTime'

export const MAINTENANCE_TYPES = ['MONTHLY', 'BIANNUAL', 'ANNUAL'] as const
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number]

/** En el backend BIANNUAL = cada 6 meses */
export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  MONTHLY: 'Mantenimiento mensual',
  BIANNUAL: 'Mantenimiento semestral',
  ANNUAL: 'Mantenimiento anual',
}

/** Nombre corto de la periodicidad (títulos de grupo) */
export const MAINTENANCE_FREQUENCY_LABELS: Record<MaintenanceType, string> = {
  MONTHLY: 'Mensual',
  BIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
}

/** Cada cuánto se realiza (según `MaintenanceReport.getNextDate` del backend) */
export const MAINTENANCE_FREQUENCY_DESCRIPTIONS: Record<MaintenanceType, string> = {
  MONTHLY: 'Cada mes',
  BIANNUAL: 'Cada 6 meses',
  ANNUAL: 'Cada año',
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

/** Respuesta de POST /report/incident/{id}/image */
export interface IncidentImage {
  id: number
  imagePublicId: string
}

/** Tipos de foto que se pueden subir (la API se definió con .jpg) */
export const INCIDENT_IMAGE_ACCEPT = 'image/jpeg'

/**
 * Tamaño máximo por foto: 1 MB, el límite por defecto de Spring (`spring.servlet.multipart.max-file-size`, que el
 * backend no cambia). Una foto mayor daría un error que pasa por `/error` y llega como 401 (cerraría la sesión).
 */
export const INCIDENT_IMAGE_MAX_BYTES = 1024 * 1024

/** GET /report/maintenance/{elevatorId} */
export interface MaintenanceReport {
  /** null si el backend no lo envía (versiones anteriores de su DTO no lo rellenaban) */
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

export type ReportKind = ElevatorReportEntry['kind']

/** Body de POST /report/incident. El técnico lo asigna el backend (usuario del token). */
export interface CreateIncidentReportRequest {
  startDate: LocalDateTime
  /** null: incidencia abierta ("En curso") */
  endDate: LocalDateTime | null
  commentary: string | null
  elevatorRAE: string
}

/** Body de POST /report/maintenance. El técnico lo asigna el backend (usuario del token). */
export interface CreateMaintenanceReportRequest {
  maintenanceType: MaintenanceType
  startDate: LocalDateTime
  endDate: LocalDateTime
  commentary: string | null
  elevatorRAE: string
}

/** Body de PATCH /report/incident/{id}/enddate */
export interface CloseIncidentReportRequest {
  endDate: LocalDateTime
}

/**
 * Cierre de una incidencia abierta. El backend acepta `endDate: null` (lo guardaría y respondería 200),
 * así que aquí es obligatoria; debe ser posterior al inicio (si no, 400). `startDate` es el inicio de la
 * incidencia (`LocalDateTime` del backend), que el formulario lleva solo para comparar.
 */
export const closeIncidentFormSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string().min(1, 'Introduce la fecha de cierre'),
  })
  .refine(
    ({ startDate, endDate }) => !endDate || new Date(endDate).getTime() > new Date(startDate).getTime(),
    { path: ['endDate'], message: 'La fecha de cierre debe ser posterior a la de inicio' },
  )

export type CloseIncidentFormValues = z.output<typeof closeIncidentFormSchema>

export const COMMENTARY_MAX = 255

/**
 * Formulario de informe (incidencia o mantenimiento). Las fechas son valores de `datetime-local`
 * (`2025-11-13T10:30`), comparables como texto. En mantenimiento el tipo y la fecha de fin son obligatorios
 * (`@NotNull` en el backend: un null daría 400 → `/error` → 401 y cerraría la sesión); en incidencia la fecha
 * de fin es opcional. Si hay fin, debe ser posterior al inicio (el backend responde 400 si no).
 */
export function reportFormSchema(kind: ReportKind) {
  return z
    .object({
      maintenanceType: z.enum(MAINTENANCE_TYPES).optional(),
      startDate: z.string().min(1, 'Introduce la fecha de inicio'),
      endDate: z.string(),
      commentary: z
        .string()
        .trim()
        .max(COMMENTARY_MAX, `El comentario no puede superar los ${COMMENTARY_MAX} caracteres`),
    })
    .superRefine((values, ctx) => {
      if (kind === 'maintenance' && !values.maintenanceType) {
        ctx.addIssue({ code: 'custom', path: ['maintenanceType'], message: 'Selecciona el tipo de mantenimiento' })
      }
      if (kind === 'maintenance' && !values.endDate) {
        ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Introduce la fecha de fin' })
      }
      if (values.startDate && values.endDate && values.endDate <= values.startDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDate'],
          message: 'La fecha de fin debe ser posterior a la de inicio',
        })
      }
    })
}

export type ReportFormInput = z.input<ReturnType<typeof reportFormSchema>>
export type ReportFormValues = z.output<ReturnType<typeof reportFormSchema>>

export function toIncidentReportRequest(values: ReportFormValues, elevatorRAE: string): CreateIncidentReportRequest {
  return {
    startDate: toLocalDateTime(values.startDate),
    endDate: values.endDate ? toLocalDateTime(values.endDate) : null,
    commentary: values.commentary || null,
    elevatorRAE,
  }
}

export function toMaintenanceReportRequest(
  values: ReportFormValues,
  elevatorRAE: string,
): CreateMaintenanceReportRequest {
  // El esquema de mantenimiento ya los exige; esto solo estrecha los tipos
  if (!values.maintenanceType || !values.endDate) {
    throw new Error('Faltan el tipo o la fecha de fin del mantenimiento')
  }
  return {
    maintenanceType: values.maintenanceType,
    startDate: toLocalDateTime(values.startDate),
    endDate: toLocalDateTime(values.endDate),
    commentary: values.commentary || null,
    elevatorRAE,
  }
}
