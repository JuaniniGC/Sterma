import axios from 'axios'

/** Error normalizado de la API. Todas las llamadas de `src/api/` rechazan con este tipo. */
export class ApiError extends Error {
  readonly status: number | null
  readonly data: unknown

  constructor(message: string, status: number | null, data: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'La petición no es válida.',
  401: 'Tu sesión ha caducado o no has iniciado sesión.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no existe.',
  409: 'La operación entra en conflicto con el estado actual.',
  500: 'Error interno del servidor.',
}

function messageFromBody(data: unknown): string | null {
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const body = data as Record<string, unknown>
    for (const key of ['message', 'error', 'detail']) {
      const value = body[key]
      if (typeof value === 'string' && value.trim()) return value
    }
  }
  return null
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError('No se pudo conectar con el servidor.', null, null)
    }
    const { status, data } = error.response
    const message =
      messageFromBody(data) ?? STATUS_MESSAGES[status] ?? `Error inesperado (${status}).`
    return new ApiError(message, status, data)
  }
  if (error instanceof Error) return new ApiError(error.message, null, null)
  return new ApiError('Error desconocido.', null, null)
}

/** Mensaje legible para mostrar al usuario a partir de cualquier error. */
export function getErrorMessage(error: unknown): string {
  return toApiError(error).message
}
