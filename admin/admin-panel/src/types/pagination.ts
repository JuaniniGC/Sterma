/** Respuesta paginada de Spring Data (`Page<T>`). Solo los campos que usa el panel. */
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  /** Página actual, empieza en 0 */
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  /** Campo de ordenación en el backend (p. ej. `name`) */
  key: string
  direction: SortDirection
}

/** Convierte el orden al formato de Spring (`campo,asc`). */
export function toSpringSort(sort: SortState | null): string | undefined {
  return sort ? `${sort.key},${sort.direction}` : undefined
}

/** Parámetros de paginación de Spring Data. */
export interface PageParams {
  /** Empieza en 0 */
  page: number
  size: number
  /** Formato Spring: `campo,asc` | `campo,desc` */
  sort?: string
}
