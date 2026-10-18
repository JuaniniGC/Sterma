import { paths } from './paths'

export interface NavItem {
  label: string
  to: string
  /** Coincidencia exacta de la ruta para marcar el enlace como activo */
  end?: boolean
}

/** Entradas del menú lateral. Añade una por cada pantalla implementada. */
export const navigation: NavItem[] = [
  { label: 'Inicio', to: paths.home, end: true },
  { label: 'Comunidades', to: paths.communities },
  { label: 'Ascensores', to: paths.elevators },
  { label: 'Pasos de mantenimiento', to: paths.maintenanceRules },
]
