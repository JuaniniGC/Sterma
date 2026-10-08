import { Link } from 'react-router'
import { DetailCard } from '@/components/data/DetailCard'
import { InfoGrid, type InfoSection } from '@/components/data/InfoGrid'
import { communityDetailPath } from '@/routes/paths'
import type { Community } from '../types'

interface CommunityInfoCardProps {
  community: Community
  /**
   * Título de la tarjeta. Por defecto el nombre (con la descripción debajo).
   * Úsalo cuando el nombre ya está en la cabecera de la página (p. ej. "Información").
   */
  title?: string
  /** Muestra el enlace "Ver comunidad" al detalle de la comunidad */
  showCommunityLink?: boolean
}

function buildSections(community: Community): InfoSection[] {
  const { localization, communityLeaderInfo: leader } = community
  const phone = leader?.communityLeaderTelephone
  return [
    { title: 'Datos generales', items: [{ label: 'CIF', value: community.cif }] },
    {
      title: 'Localización',
      items: [
        { label: 'Ciudad', value: localization?.city },
        { label: 'Calle', value: localization?.street },
        { label: 'Código postal', value: localization?.postalCode },
      ],
    },
    {
      title: 'Responsable',
      items: [
        { label: 'Nombre', value: leader?.communityLeaderName },
        {
          label: 'Teléfono',
          value: phone && (
            <a href={`tel:${phone}`} className="text-indigo-600 hover:underline">
              {phone}
            </a>
          ),
        },
        { label: 'Nota', value: leader?.communityLeaderNote },
      ],
    },
  ]
}

/** Todos los datos de una comunidad (sin peticiones). Única forma de mostrarlos en el panel. */
export function CommunityInfoCard({ community, title, showCommunityLink = false }: CommunityInfoCardProps) {
  return (
    <DetailCard
      title={title ?? community.name}
      description={title ? undefined : (community.description ?? undefined)}
      actions={
        showCommunityLink && (
          <Link
            to={communityDetailPath(community.id)}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Ver comunidad →
          </Link>
        )
      }
    >
      <InfoGrid sections={buildSections(community)} />
    </DetailCard>
  )
}
