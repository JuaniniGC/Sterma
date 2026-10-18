/** Rutas de la aplicación. Añade aquí la ruta de cada pantalla nueva. */
export const paths = {
  home: '/',
  login: '/login',
  communities: '/communities',
  newCommunity: '/communities/new',
  communityDetail: '/communities/:id',
  editCommunity: '/communities/:id/edit',
  elevators: '/elevators',
  newElevator: '/elevators/new',
  elevatorDetail: '/elevators/:id',
  editElevator: '/elevators/:id/edit',
  newIncidentReport: '/elevators/:id/incidents/new',
  newMaintenanceReport: '/elevators/:id/maintenance/new',
  incidentReportDetail: '/elevators/:id/incidents/:reportId',
  maintenanceReportDetail: '/elevators/:id/maintenance/:reportId',
  maintenanceRules: '/maintenance-rules',
  newMaintenanceRule: '/maintenance-rules/new',
  commonMistakes: '/common-mistakes',
  newCommonMistake: '/common-mistakes/new',
} as const

/** Construye la URL del detalle de una comunidad. */
export function communityDetailPath(id: number): string {
  return `/communities/${id}`
}

/** Construye la URL del detalle de un ascensor. */
export function elevatorDetailPath(id: number): string {
  return `/elevators/${id}`
}

/** Construye la URL de edición de una comunidad. */
export function editCommunityPath(id: number): string {
  return `/communities/${id}/edit`
}

/** Construye la URL de edición de un ascensor. */
export function editElevatorPath(id: number): string {
  return `/elevators/${id}/edit`
}

/** Construye la URL de alta de una incidencia del ascensor. */
export function newIncidentReportPath(elevatorId: number): string {
  return `/elevators/${elevatorId}/incidents/new`
}

/** Construye la URL de alta de un mantenimiento del ascensor. */
export function newMaintenanceReportPath(elevatorId: number): string {
  return `/elevators/${elevatorId}/maintenance/new`
}

/** Construye la URL del detalle de un informe (incidencia o mantenimiento) del ascensor. */
export function reportDetailPath(elevatorId: number, kind: 'incident' | 'maintenance', reportId: number): string {
  return `/elevators/${elevatorId}/${kind === 'incident' ? 'incidents' : 'maintenance'}/${reportId}`
}
