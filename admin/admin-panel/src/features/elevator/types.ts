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
