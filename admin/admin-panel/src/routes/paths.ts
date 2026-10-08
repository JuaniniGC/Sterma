/** Rutas de la aplicación. Añade aquí la ruta de cada pantalla nueva. */
export const paths = {
  home: '/',
  login: '/login',
  communities: '/communities',
  communityDetail: '/communities/:id',
  elevators: '/elevators',
  elevatorDetail: '/elevators/:id',
} as const

/** Construye la URL del detalle de una comunidad. */
export function communityDetailPath(id: number): string {
  return `/communities/${id}`
}

/** Construye la URL del detalle de un ascensor. */
export function elevatorDetailPath(id: number): string {
  return `/elevators/${id}`
}
