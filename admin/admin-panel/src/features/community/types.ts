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
