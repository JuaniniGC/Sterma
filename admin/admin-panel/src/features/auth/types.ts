import { z } from 'zod'

export const ROLES = ['MANAGEMENT', 'TECHNICIAN'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  MANAGEMENT: 'Gestión',
  TECHNICIAN: 'Técnico',
}

export interface AuthUser {
  /** Nombre de usuario (`sub` del JWT) */
  username: string
  role: Role
}

/** Campos del payload del JWT que usa el cliente. La firma NO se valida en el frontend. */
export const jwtPayloadSchema = z.object({
  sub: z.string().min(1),
  role: z.enum(ROLES),
  exp: z.number(),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Introduce tu usuario'),
  password: z.string().min(1, 'Introduce tu contraseña'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
