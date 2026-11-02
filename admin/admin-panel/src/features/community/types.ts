import { z } from 'zod'
import type { PageParams } from '@/types/pagination'

export interface Localization {
  city: string | null
  street: string | null
  postalCode: string | null
}

export interface CommunityLeaderInfo {
  communityLeaderName: string | null
  communityLeaderTelephone: string | null
  communityLeaderNote: string | null
}

export interface Community {
  id: number
  name: string
  description: string | null
  /** Embebido en el backend: puede llegar null si no tiene ningún dato */
  localization: Localization | null
  communityLeaderInfo: CommunityLeaderInfo | null
  cif: string
}

export interface CommunityListParams extends PageParams {
  /** Filtro parcial por nombre (no se envía si está vacío) */
  name?: string
}

/** Body de POST /community (aplanado: el backend lo agrupa en `localization` y `communityLeaderInfo`) */
export interface CreateCommunityRequest {
  name: string
  description: string | null
  cif: string
  city: string
  street: string
  postalCode: string
  communityLeaderName: string | null
  communityLeaderTelephone: string | null
  communityLeaderNote: string | null
}

/** Mismo patrón que `@Pattern` de `CreateCommunityRequest` en el backend */
export const CIF_PATTERN = /^[A-HJ-NP-SUVW]\d{7}[0-9A-J]$/
export const POSTAL_CODE_PATTERN = /^\d{5}$/
export const TELEPHONE_PATTERN = /^\d{9}$/

const MAX_TEXT = 255
const tooLong = (field: string) => `${field} no puede superar los ${MAX_TEXT} caracteres`
const requiredText = (requiredMessage: string, field: string) =>
  z.string().trim().min(1, requiredMessage).max(MAX_TEXT, tooLong(field))
const optionalText = (field: string) => z.string().trim().max(MAX_TEXT, tooLong(field))

/**
 * Formulario de nueva comunidad. Replica las validaciones `@Valid` del backend: si fallan allí,
 * el 400 pasa por `/error` y llega como 401, lo que cerraría la sesión.
 * Los opcionales vacíos se envían como `null` (un `""` no cumple los `@Pattern`).
 */
export const communityFormSchema = z.object({
  name: requiredText('Introduce el nombre de la comunidad', 'El nombre'),
  description: optionalText('La descripción'),
  cif: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, 'Introduce el CIF')
    .regex(CIF_PATTERN, 'CIF inválido: una letra, 7 dígitos y un dígito o letra de control (p. ej. A12345678)'),
  city: requiredText('Introduce la ciudad', 'La ciudad'),
  street: requiredText('Introduce la dirección', 'La dirección'),
  postalCode: z
    .string()
    .trim()
    .min(1, 'Introduce el código postal')
    .regex(POSTAL_CODE_PATTERN, 'El código postal debe tener exactamente 5 dígitos'),
  communityLeaderName: optionalText('El nombre del responsable'),
  communityLeaderTelephone: z
    .string()
    .trim()
    .refine((value) => value === '' || TELEPHONE_PATTERN.test(value), {
      message: 'El teléfono debe tener exactamente 9 dígitos',
    }),
  communityLeaderNote: optionalText('La nota'),
})

export type CommunityFormInput = z.input<typeof communityFormSchema>
export type CommunityFormValues = z.output<typeof communityFormSchema>

/** Body de PUT /community/{id}: mismos campos que el alta */
export type UpdateCommunityRequest = CreateCommunityRequest

export const EMPTY_COMMUNITY_FORM: CommunityFormInput = {
  name: '',
  description: '',
  cif: '',
  city: '',
  street: '',
  postalCode: '',
  communityLeaderName: '',
  communityLeaderTelephone: '',
  communityLeaderNote: '',
}

/** Rellena el formulario con una comunidad existente (`null` → cadena vacía). */
export function communityToFormValues(community: Community): CommunityFormInput {
  const { localization, communityLeaderInfo: leader } = community
  return {
    name: community.name,
    description: community.description ?? '',
    cif: community.cif,
    city: localization?.city ?? '',
    street: localization?.street ?? '',
    postalCode: localization?.postalCode ?? '',
    communityLeaderName: leader?.communityLeaderName ?? '',
    communityLeaderTelephone: leader?.communityLeaderTelephone ?? '',
    communityLeaderNote: leader?.communityLeaderNote ?? '',
  }
}

/** Valores validados → body del backend (opcionales vacíos → `null`). */
export function toCommunityRequest(values: CommunityFormValues): CreateCommunityRequest {
  return {
    ...values,
    description: values.description || null,
    communityLeaderName: values.communityLeaderName || null,
    communityLeaderTelephone: values.communityLeaderTelephone || null,
    communityLeaderNote: values.communityLeaderNote || null,
  }
}
