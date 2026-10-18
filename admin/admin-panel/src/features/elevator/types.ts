import { z } from 'zod'
import type { Community } from '@/features/community/types'
import type { PageParams } from '@/types/pagination'

export interface Elevator {
  id: number
  rae: string
  /** Así se llama en el backend (con una sola "l") */
  instalationYear: number
  /** Siempre presente: todo ascensor pertenece a una comunidad */
  community: Community
}

export interface ElevatorListParams extends PageParams {
  /** Filtro parcial por nombre de la comunidad (no se envía si está vacío) */
  communityName?: string
  /** Filtro parcial por RAE (no se envía si está vacío) */
  rae?: string
}

/** Body de PUT /elevator/{id} (el backend solo exige que no sean null) */
export interface UpdateElevatorRequest {
  rae: string
  instalationYear: number
  communityId: number
}

export const INSTALATION_YEAR_MIN = 1900
export const INSTALATION_YEAR_MAX = new Date().getFullYear()

const yearRange = `El año debe estar entre ${INSTALATION_YEAR_MIN} y ${INSTALATION_YEAR_MAX}`

/** Formulario de edición de ascensor. `rae` es VARCHAR(255) único en la BD (duplicado → 409). */
export const elevatorFormSchema = z.object({
  rae: z
    .string()
    .trim()
    .min(1, 'Introduce el RAE')
    .max(255, 'El RAE no puede superar los 255 caracteres'),
  instalationYear: z
    .number({ error: 'Introduce el año de instalación' })
    .int('El año debe ser un número entero')
    .min(INSTALATION_YEAR_MIN, yearRange)
    .max(INSTALATION_YEAR_MAX, yearRange),
  communityId: z.number({ error: 'Selecciona una comunidad' }).int().positive('Selecciona una comunidad'),
})

export type ElevatorFormInput = z.input<typeof elevatorFormSchema>
export type ElevatorFormValues = z.output<typeof elevatorFormSchema>

export function elevatorToFormValues(elevator: Elevator): ElevatorFormInput {
  return {
    rae: elevator.rae,
    instalationYear: elevator.instalationYear,
    communityId: elevator.community.id,
  }
}

/** Body de POST /elevator: mismos campos que la edición */
export type CreateElevatorRequest = UpdateElevatorRequest
