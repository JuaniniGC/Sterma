import { z } from 'zod'
import { MAINTENANCE_TYPES, type MaintenanceType } from '@/features/report/types'

/** GET /report/maintenance/rules/{maintenanceType} */
export interface MaintenanceRule {
  id: number
  name: string
  description: string | null
  /** Orden global de la regla (el backend no exige que sea único) */
  orderNum: number
  maintenanceType: MaintenanceType
}

/** Body de POST /report/maintenance/rules */
export interface CreateMaintenanceRuleRequest {
  name: string
  description: string | null
  orderNum: number
  maintenanceType: MaintenanceType
}

export const ORDER_NUM_MIN = 1
export const ORDER_NUM_MAX = 99

/**
 * Formulario de nueva regla. El backend no valida: `name`, `orderNum` y `maintenanceType`
 * son NOT NULL en la BD y los textos son VARCHAR(255).
 */
export const maintenanceRuleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Introduce el nombre del paso')
    .max(255, 'El nombre no puede superar los 255 caracteres'),
  description: z.string().trim().max(255, 'La descripción no puede superar los 255 caracteres'),
  orderNum: z
    .number({ error: 'Introduce el orden' })
    .int('El orden debe ser un número entero')
    .min(ORDER_NUM_MIN, `El orden debe estar entre ${ORDER_NUM_MIN} y ${ORDER_NUM_MAX}`)
    .max(ORDER_NUM_MAX, `El orden debe estar entre ${ORDER_NUM_MIN} y ${ORDER_NUM_MAX}`),
  maintenanceType: z.enum(MAINTENANCE_TYPES, { error: 'Selecciona el tipo de mantenimiento' }),
})

export type MaintenanceRuleFormInput = z.input<typeof maintenanceRuleFormSchema>
export type MaintenanceRuleFormValues = z.output<typeof maintenanceRuleFormSchema>
