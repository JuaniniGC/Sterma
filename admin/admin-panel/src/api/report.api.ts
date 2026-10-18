import type { CreateMaintenanceRuleRequest, MaintenanceRule } from '@/features/maintenanceRule/types'
import type {
  CloseIncidentReportRequest,
  CreateIncidentReportRequest,
  CreateMaintenanceReportRequest,
  IncidentImage,
  IncidentReport,
  MaintenanceReport,
  MaintenanceType,
} from '@/features/report/types'
import { httpClient } from './client'
import { ApiError } from './errors'

/**
 * POST /report/incident — 201 si se crea. El cuerpo de la respuesta (entidad completa) no se usa.
 * Errores en texto plano: 404 (ningún ascensor con ese RAE / usuario sin técnico), 400 (fin anterior al inicio), 500.
 */
export async function createIncidentReport(body: CreateIncidentReportRequest): Promise<void> {
  const response = await httpClient.post('/report/incident', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear la incidencia (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * DELETE /report/incident/{id} — 200 con texto ("Se ha borrado correctamente el informe"); borra también sus
 * imágenes. 404 (texto plano) si no existe. Cualquier estado distinto de 200 se trata como error.
 */
export async function deleteIncidentReport(id: number): Promise<void> {
  const response = await httpClient.delete(`/report/incident/${encodeURIComponent(id)}`)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo eliminar la incidencia (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * GET /report/incident/{id}/image — URLs de Cloudinary de las fotos de la incidencia (`[]` si no tiene).
 * 404 (texto plano) si la incidencia no existe.
 */
export async function getIncidentImages(incidentId: number): Promise<string[]> {
  const { data } = await httpClient.get<string[]>(`/report/incident/${encodeURIComponent(incidentId)}/image`)
  return data
}

/**
 * POST /report/incident/{id}/image — sube una foto (`multipart/form-data`, campo `file`). El backend responde
 * 200 (`ResponseEntity.ok`) con `{ id, imagePublicId }`; cualquier otro estado se trata como error.
 * Errores en texto plano: 404 (incidencia), 400, 409, 500.
 */
export async function uploadIncidentImage({
  incidentId,
  file,
}: {
  incidentId: number
  file: File
}): Promise<IncidentImage> {
  const body = new FormData()
  body.append('file', file)
  const response = await httpClient.post<IncidentImage>(
    `/report/incident/${encodeURIComponent(incidentId)}/image`,
    body,
    {
      // Sin esto axios convertiría el FormData a JSON (la instancia usa application/json por defecto);
      // el navegador sustituye esta cabecera por la suya con el boundary
      headers: { 'Content-Type': 'multipart/form-data' },
      // La subida pasa por Cloudinary: puede tardar más que el timeout general
      timeout: 60_000,
    },
  )
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo subir la foto (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/**
 * DELETE /report/incident/{incidentId}/image/{imagePublicId} — borra la foto en Cloudinary y en la BD. 200 con texto
 * ("Se ha borrado correctamente la imagen"); 404 (texto plano) si la incidencia no existe o la foto no es suya.
 * Cualquier estado distinto de 200 se trata como error.
 */
export async function deleteIncidentImage({
  incidentId,
  imagePublicId,
}: {
  incidentId: number
  imagePublicId: string
}): Promise<void> {
  const response = await httpClient.delete(
    `/report/incident/${encodeURIComponent(incidentId)}/image/${encodeURIComponent(imagePublicId)}`,
  )
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo eliminar la foto (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * PATCH /report/incident/{id}/enddate — 200 con cuerpo vacío. Errores en texto plano: 400 (ya estaba cerrada o
 * el cierre no es posterior al inicio), 404 (no existe). Cualquier estado distinto de 200 se trata como error.
 */
export async function closeIncidentReport({
  id,
  body,
}: {
  id: number
  body: CloseIncidentReportRequest
}): Promise<void> {
  const response = await httpClient.patch(`/report/incident/${encodeURIComponent(id)}/enddate`, body)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo cerrar la incidencia (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * POST /report/maintenance — 201 si se crea. El cuerpo de la respuesta (entidad completa) no se usa.
 * Errores en texto plano: 404 (ningún ascensor con ese RAE / usuario sin técnico), 400 (fin anterior al inicio), 500.
 */
export async function createMaintenanceReport(body: CreateMaintenanceReportRequest): Promise<void> {
  const response = await httpClient.post('/report/maintenance', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear el mantenimiento (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * DELETE /report/maintenance/{id} — 200 con texto ("Se ha borrado correctamente el informe"); 404 (texto plano)
 * si no existe. Cualquier estado distinto de 200 se trata como error.
 */
export async function deleteMaintenanceReport(id: number): Promise<void> {
  const response = await httpClient.delete(`/report/maintenance/${encodeURIComponent(id)}`)
  if (response.status !== 200) {
    throw new ApiError(
      `No se pudo eliminar el mantenimiento (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
}

/**
 * GET /report/maintenance/rules/{maintenanceType} — reglas acumuladas hasta ese tipo:
 * `monthly` → mensuales; `biannual` → mensuales + semestrales; `annual` → todas.
 * El backend responde 404 cuando no hay reglas: se devuelve `[]`.
 */
export async function getMaintenanceRules(upTo: MaintenanceType = 'ANNUAL'): Promise<MaintenanceRule[]> {
  try {
    const { data } = await httpClient.get<MaintenanceRule[]>(
      `/report/maintenance/rules/${encodeURIComponent(upTo.toLowerCase())}`,
    )
    return data
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return []
    throw error
  }
}

/**
 * POST /report/maintenance/rules — crea una regla. Solo se acepta 201; cualquier otra
 * respuesta (incluido otro 2xx) se trata como error. El backend responde 500 con texto si falla.
 */
export async function createMaintenanceRule(body: CreateMaintenanceRuleRequest): Promise<MaintenanceRule> {
  const response = await httpClient.post<MaintenanceRule>('/report/maintenance/rules', body)
  if (response.status !== 201) {
    throw new ApiError(
      `No se pudo crear el paso (respuesta inesperada ${response.status}).`,
      response.status,
      response.data,
    )
  }
  return response.data
}

/** DELETE /report/maintenance/rules/{id} — 200 con texto; 404 (texto plano) si la regla no existe. */
export async function deleteMaintenanceRule(id: number): Promise<void> {
  await httpClient.delete(`/report/maintenance/rules/${encodeURIComponent(id)}`)
}

/** GET /report/incident/{elevatorId} — todas las incidencias del ascensor (sin paginar). 404 si el ascensor no existe. */
export async function getIncidentReportsByElevator(elevatorId: number): Promise<IncidentReport[]> {
  const { data } = await httpClient.get<IncidentReport[]>(
    `/report/incident/${encodeURIComponent(elevatorId)}`,
  )
  return data
}

/** GET /report/maintenance/{elevatorId} — todos los mantenimientos del ascensor (sin paginar). 404 si el ascensor no existe. */
export async function getMaintenanceReportsByElevator(elevatorId: number): Promise<MaintenanceReport[]> {
  const { data } = await httpClient.get<MaintenanceReport[]>(
    `/report/maintenance/${encodeURIComponent(elevatorId)}`,
  )
  return data
}
